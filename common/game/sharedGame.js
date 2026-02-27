import { addDays, differenceInCalendarDays, startOfDay } from "date-fns";
import { Animated} from 'react-native';

const today = startOfDay( new Date( ) ).toISOString( )


/*
 * This function uses Fisher-Yates Shuffle which is not written by me.
 * Availability: https://www.geeksforgeeks.org/javascript/how-to-shuffle-an-array-using-javascript/
 *
 * This function calculates a random order for question answers.
 * It is used by Matching and Multiple Choice.
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


export function checkAnswer( correct_answer, user_answer )
{
	if ( correct_answer == user_answer )    return true;
	return false;
}


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


export function checkStreakCurrent( last_entry )
{
	if (last_entry == undefined) return false

	if ( last_entry.slice( 0, 10 ) == today.slice( 0, 10 ))    return true;
	else    return false;
}


/*
 * The countStreakLength function code is a modified version ( modified by me ) of code not written by me.
 * Title: DailyStreakCounter
 * Author: Ofekino ( GitHub ) / Horizon @Devving_Horizon ( YouTube )
 * Date published: Jan 18, 2025
 * Code version: unknown
 * Availability: https://github.com/Ofekino/DailyStreakCounter / https://www.youtube.com/watch?v=5CFdSkA17Sw
 *
 * This function counts the length of the current streak.
 */
export function countStreakLength( streak_history )
{
	let streak_length = 0;

	// No streak
	if (
			streak_history[0] == undefined ||
			differenceInCalendarDays( today, new Date( streak_history?.[0]?.date_played) ) > 1
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
 * The fillStreakArray function code is a modified version ( modified by me ) of code not written by me.
 * Title: DailyStreakCounter
 * Author: Ofekino ( GitHub ) / Horizon @Devving_Horizon ( YouTube )
 * Date published: Jan 18, 2025
 * Code version: unknown
 * Availability: https://github.com/Ofekino/DailyStreakCounter / https://www.youtube.com/watch?v=5CFdSkA17Sw
 *
 * This function returns an array of length 7 containing date and if day was completed
 * uses addDays from date-fns to include future days
 */
export function fillStreakArray( streak_length, streak_history )
{
	const start = new Date( findStreakStart( streak_history ));

	if ( start == null )    return false;

	return ( 
		Array.from({ length: 7 }, ( _, i ) =>
		({
			day: addDays( start, i),
			completed:	i < 
			(
				streak_length % 7 == 0 &&
				streak_length != 0 ? 7
				: streak_length % 7
			)
		})));
}


/*
 * The findStreakStart function code is a modified version ( modified by me ) of code not written by me.
 * Title: DailyStreakCounter
 * Author: Ofekino ( GitHub ) / Horizon @Devving_Horizon ( YouTube )
 * Date published: Jan 18, 2025
 * Code version: unknown
 * Availability: https://github.com/Ofekino/DailyStreakCounter / https://www.youtube.com/watch?v=5CFdSkA17Sw
 *
 * This function finds the first day of the current streak.
 */
export function findStreakStart( streak_history )
{
	let streak_start = null;

	if ( streak_history.length == 0)    return    streak_start;
	else if ( streak_history.length == 1)    return    new Date( streak_history[0].date_played );

	for ( let i = 0; i < streak_history.length - 1; i++ )
	{
		const previous_day = new Date( streak_history[ i + 1 ].date_played );
		const current_day = new Date( streak_history[ i ].date_played );

		if ( differenceInCalendarDays( current_day, previous_day ) == 1 )    streak_start = previous_day;
		else    break;
	}

	return streak_start;
}


/*
 * This pulse function code is not written by me
 * Title: DailyStreakCounter
 * Author: Ofekino ( GitHub ) / Horizon @Devving_Horizon ( YouTube )
 * Date published: Jan 18, 2025
 * Code version: unknown
 * Availability: https://github.com/Ofekino/DailyStreakCounter / https://www.youtube.com/watch?v=5CFdSkA17Sw
 *
 * This function produces a pulsing animation of the current days streak indicator
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


export function setResultArray( questions_per_round )
{
	return Array( questions_per_round ).fill( false );
}


// Matching Screen is the only screen where a round has more than one question
export function updateResultArray ( answeredCorrectly, question_row )
{
	return answeredCorrectly.with( question_row, true );
}


export function updateLevel( loaded_level, current_level )
{
	if ( loaded_level == current_level )    return Number(current_level) + 1;
	else    return current_level;
}