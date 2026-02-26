
import { differenceInCalendarDays } from "date-fns";

// This function uses Fisher-Yates Shuffle
// https://www.geeksforgeeks.org/javascript/how-to-shuffle-an-array-using-javascript/
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
	if ( answeredCorrectly.length != questions_per_round )    return false;
	return answeredCorrectly.every( Boolean );
}


export function setResultArray( questions_per_round )
{
	return    Array( questions_per_round ).fill( false );
}


// Matching Screen is the only screen where a round has more than one question
export function updateResultArray ( answeredCorrectly, question_row )
{
	return    answeredCorrectly.with( question_row, true );
}


export function updateLevel( loaded_level, current_level )
{
	if ( loaded_level == current_level )    return Number(current_level) + 1;
	else    return current_level;
}


export function countStreak( streak_history )
{
	let streak = 0;
	const now = new Date( );

	// No streak
	if ( streak_history[0] == undefined || differenceInCalendarDays( now, new Date( streak_history?.[0]?.date_played) ) > 1 )    return streak;

	for ( let i = 0; i < streak_history.length - 1; i++ )
	{
		const prev = new Date( streak_history[ i + 1 ].date_played );
		const curr = new Date( streak_history[ i ].date_played );

		if ( differenceInCalendarDays( curr, prev ) == 1 )    streak ++;
		else    break;
	}

	// Add current day
	streak += 1;
	return streak;
}


export function checkStreak( last_entry)
{
	if ( last_entry.slice( 0, 10 ) == new Date( ).toISOString().slice( 0, 10 ) )    return true;
	else return    false;
}