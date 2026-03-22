import { addDays, differenceInCalendarDays, startOfDay } from "date-fns";
import { Animated } from 'react-native';

const today = startOfDay( new Date( ) ).toISOString( )


/*
 *	This function uses Fisher-Yates Shuffle which is not written by me.
 *	Availability: https://www.geeksforgeeks.org/javascript/how-to-shuffle-an-array-using-javascript/
 *
 *	This function calculates a random order for question answers.
 *	It is used by Matching and Multiple Choice.
 */
export function calcAnswerOrder ( length )
{
	let array = Array.from({ length }, ( _, i ) => i );
	for ( let i = array.length - 1; i > 0; i-- )
	{
		const j = Math.floor( Math.random( ) * ( i + 1 ));

		const temp = array[i];

		array[i] = array[j];
		array[j] = temp;
	}

	return array;
}


// Checks if the answer supplied by the user matches the correct answer
export function checkAnswer( correct_answer, user_answer )
{
	if ( correct_answer == user_answer )    return true;
	return false;
}


/*
 *	Checks players current level and returns the
 *	appropriate badge information.
 */
export function checkBadgeEarned ( currentLevel )
{

	if ( currentLevel == 4 )
	{
		return {
			badgeType: 'hurricane and flood badge',
			badge: require( '../../assets/badge_water.png' )
		}
	}

	else if ( currentLevel == 7 )
	{
		return {
			badgeType: 'tornado and storm badge',
			badge: require( '../../assets/badge_storm.png' )
		}
	}

	else if ( currentLevel == 10 )
	{
		return {
			badgeType: 'extreme temp badge',
			badge: require( '../../assets/badge_temp.png' )
		}
	}

	else if ( currentLevel == 13 )
	{
		return {
			badgeType: 'health badge',
			badge: require( '../../assets/badge_health.png' )
		}
	}

	else    return null;
}


// Checks if the correct number of questions have been completed
export function checkLevelComplete( roundStartIndex, questions_per_level, questions_per_round )
{
	if ( roundStartIndex == questions_per_level - questions_per_round )    return true;
	return false;
}


// Matching Screen is the only screen where a round has more than one question
export function checkRoundComplete( answeredCorrectly, questions_per_round )
{
	if ( answeredCorrectly.length != questions_per_round )     return false;
	return answeredCorrectly.every( Boolean );
}


/*
 *	Accepts the last date in which a level was completed in the format stored in db ( ISOString ),
 *	slices and checks to see if it is today so that the streak can be marked as current.
 */
export function checkStreakCurrent( last_entry )
{
	if ( last_entry == undefined || ( typeof last_entry ) != 'string' )    return false;

	if ( last_entry.slice( 0, 10 ) == today.slice( 0, 10 ))    return true;
	else    return false;
}


/*
 *	The countStreakLength function code is a modified version ( modified by me ) of code not written by me.
 *	Title: DailyStreakCounter
 *	Author: Ofekino ( GitHub ) / Horizon @Devving_Horizon ( YouTube )
 *	Date published: Jan 18, 2025
 *	Code version: unknown
 *	Availability: https://github.com/Ofekino/DailyStreakCounter / https://www.youtube.com/watch?v=5CFdSkA17Sw
 *
 *	This function counts the length of the current streak.
 *	Input: an array of objects in format date_played: ISOString
 *	Output: integer
 */
export function countStreakLength( streak_history )
{
	let streak_length = 0;

	// No streak
	if
	(
		streak_history?.[0] == undefined ||
		differenceInCalendarDays( today, new Date( streak_history?.[0]?.date_played ) ) > 1
	)    return streak_length;

	for ( let i = 0; i < streak_history.length - 1; i++ )
	{
		const previous_day = new Date( streak_history[ i + 1 ].date_played );
		const current_day = new Date( streak_history[ i ].date_played );

		if ( differenceInCalendarDays( current_day, previous_day ) == 1 )    streak_length ++;
		else    break;
	}

	// Add Current day
	streak_length += 1;
	return streak_length;
}


/*
 *	The fillStreakArray function code is a modified version ( modified by me ) of code not written by me.
 *	Title: DailyStreakCounter
 *	Author: Ofekino ( GitHub ) / Horizon @Devving_Horizon ( YouTube )
 *	Date published: Jan 18, 2025
 *	Code version: unknown
 *	Availability: https://github.com/Ofekino/DailyStreakCounter / https://www.youtube.com/watch?v=5CFdSkA17Sw
 *
 *	This function returns an array of length 7 containing date and if day was completed
 *	uses addDays from date-fns to include future days
 *	Input: length as an integer and a date format 1970-01-01T00:00:00.000Z
 *	Output: [{"day": 1970-01-01T00:00:00.000Z}, "completed": true,...
 */
export function fillStreakArray( streak_length, streak_start )
{
	// Neither of these should happen
	if ( differenceInCalendarDays( today, streak_start ) != streak_length - 1 )    return false;
	if ( streak_start.toISOString( ) == '1970-01-01T00:00:00.000Z' )    return false;

	return (
		Array.from({ length: 7 }, ( _, i ) =>
		({
			day: addDays( streak_start, i ),
			completed: i <
			(
				streak_length % 7 == 0 &&
				streak_length != 0 ? 7
				: streak_length % 7
			)
		})));
}


/*
 *	The findStreakStart function code is a modified version ( modified by me ) of code not written by me.
 *	Title: DailyStreakCounter
 *	Author: Ofekino ( GitHub ) / Horizon @Devving_Horizon ( YouTube )
 *	Date published: Jan 18, 2025
 *	Code version: unknown
 *	Availability: https://github.com/Ofekino/DailyStreakCounter / https://www.youtube.com/watch?v=5CFdSkA17Sw
 *
 *	This function finds the first day of the current streak.
 *	Input: [{"date_played": "1970-01-01T00:00:00.000Z", "streak_seen": 1}, ....
 *	Output: date in format 1970-01-01T00:00:00.000Z
 */
export function findStreakStart( streak_history )
{
	let streak_start = null;

	if ( streak_history?.length == 0 || streak_history == undefined )    return streak_start;
	if ( streak_history?.length == 1 )
	{
		if ( streak_history[0].date_played == today )    return new Date( today );
	}

	for ( let i = 0; i < streak_history.length - 1; i++ )
	{
		const previous_day = new Date( streak_history[ i + 1 ].date_played );
		const current_day = new Date( streak_history[ i ].date_played );

		if ( differenceInCalendarDays( current_day, previous_day ) == 1 )    streak_start = previous_day;
		else    return current_day;
	}

	return streak_start;
}


/*
 *	This pulse function code is not written by me
 *	Title: DailyStreakCounter
 *	Author: Ofekino ( GitHub ) / Horizon @Devving_Horizon ( YouTube )
 *	Date published: Jan 18, 2025
 *	Code version: unknown
 *	Availability: https://github.com/Ofekino/DailyStreakCounter / https://www.youtube.com/watch?v=5CFdSkA17Sw
 *
 *	This function produces a pulsing animation of the current days streak indicator
 */
export function pulse( pulseAnimation )
{
	Animated.loop
	(
		Animated.sequence
		([
			Animated.timing( pulseAnimation,
			{
				toValue: 1.2,
				duration: 300,
				useNativeDriver: true,
			}),
			Animated.timing( pulseAnimation,
			{
				toValue: 1,
				duration: 300,
				useNativeDriver: true,
			})
		]), { iterations: 2 }
	).start( );
};


/*
 *	Assigns level buttons.
 *	future levels are a lily pad.
 *	Past levels are initially a lily pad.
 *	Upon completion of the category,
 *	past levels display the category badge.
 *	The current level is a frog & a lily pad
 */
export function selectButtonImage( i, currentLevel )
{
	const frog = require( '../../assets/frog_1.png' );
	const health = require( '../../assets/badge_health.png' );
	const lily_pad = require( '../../assets/lily_pad.png' );
	const storm = require( '../../assets/badge_storm.png' );
	const temp = require( '../../assets/badge_temp.png' );
	const water = require( '../../assets/badge_water.png' );

	if ( i < currentLevel && currentLevel >= 4 && i < 4 )    return water;
	else if ( i < currentLevel && currentLevel >= 7 && i >= 4 && i < 7 )    return storm;
	else if ( i < currentLevel && currentLevel >= 10 && i >= 7 && i < 10 )    return temp;
	else if ( i < currentLevel && currentLevel >= 13 && i >= 10 && i < 13 )    return health;
	else if ( i == currentLevel )    return[ lily_pad, frog ];
	else    return lily_pad;
}


// Fills an array with false to track answers completed
export function setResultArray( questions_per_round )
{
	return Array( questions_per_round ).fill( false );
}


/*
 *	Checks if newly completed level should unlock the next level.
 *	User completing a previously completed level should not.
 */
export function updateLevel( loaded_level, current_level )
{
	if ( loaded_level == current_level )    return Number( current_level ) + 1;
	else    return current_level;
}


/*
 *	Matching Screen is the only screen where a round has more than one question
 *	accepts an array of length three ( for the three questions )
 *	if none have been answered array should contain only false
 *	array index of correctly answered question should update to true
 *	other values should not be altered. Altered array is returned
 */
export function updateResultArray ( answeredCorrectly, question_row )
{
	return answeredCorrectly.with( question_row, true );
}


/*
*	Image - Badges ( health, storm, temp, & water)
*	Title: Disaster damage elements set
*	Author: macrovector
*	Availability: https://www.freepik.com/free-vector/disaster-damage-elements-set_9387099.htm
*
*
*	Image - Frogs
*	Title: Playful Green Frog Stickers Collection
*	Author: easy-peasy.ai
*	Availability: https://easy-peasy.ai/ai-image-generator/images/colorful-green-frog-stickers-collection-messaging-app
*
*
*	Image - Lily Pad
*	Title: Lily Pad
*	Author: Alison Feiler ( me )
*	Availability: n/a
*/