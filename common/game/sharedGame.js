
export function calcAnswerOrder(length)
{
	let start = 0;
	return Array.from({length: length}, (_, start) => start).sort( () => Math.random() - 0.5);
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
export  function checkRoundComplete( answeredCorrectly,questions_per_round )
{	
	console.log( 'checkRoundComplete' )
	for ( let i = 0; i < questions_per_round; i++ )
	{
		console.log( answeredCorrectly[i] == false )
		if ( answeredCorrectly[i] == false )  return false
	}
	return true;
}


export function setResultArray( questions_per_round )
{
	return Array( questions_per_round ).fill( false );
}


// Matching Screen is the only screen where a round has more than one question 
export function updateResultArray ( answeredCorrectly, question_index ) 
{
	const correct = answeredCorrectly.map(( curr, i ) => 
	{
		if ( i == question_index )    return true;
		else    return curr;
	});	

	return correct;
}