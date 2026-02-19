// This function uses Fisher-Yates Shuffle https://www.geeksforgeeks.org/javascript/how-to-shuffle-an-array-using-javascript/
export function calcAnswerOrder ( length )
{
	let array = Array.from({length }, ( _, i ) => i );
	for ( let i = array.length - 1; i > 0; i-- ) 
	{ 
		const j = Math.floor( Math.random() * ( i + 1 ));

		const temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}

	return array;
}


export function checkAnswer( correct_answer,  user_answer )
{
	console.log( 'checkAnswer' )
	if ( correct_answer ==  user_answer )    return true;
	return false;
}


export function checkLevelComplete( roundStartIndex, questions_per_level, questions_per_round )
{
	console.log( 'checkLevelComplete' )
	if ( roundStartIndex == questions_per_level - questions_per_round )    return true;
	return false;
}


// Matching Screen is the only screen where a round has more than one question 
export  function checkRoundComplete( answeredCorrectly, questions_per_round )
{	
	console.log( 'checkRoundComplete' )
	if ( answeredCorrectly.length != questions_per_round ) return false;
	return answeredCorrectly.every( Boolean );
}


export function setResultArray( questions_per_round )
{
	return Array( questions_per_round ).fill( false );
}


// Matching Screen is the only screen where a round has more than one question 
export function updateResultArray ( answeredCorrectly, question_row ) 
{
	return answeredCorrectly.with(  question_row, true );
}