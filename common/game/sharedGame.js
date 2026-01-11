
export function calcAnswerOrder(length)
{
	let start = 0;
	return Array.from({length: length}, (_, start) => start).sort( () => Math.random() - 0.5);
}


export function checkLevelComplete( roundStartIndex, questions_per_level, questions_per_round )
{
	console.log( 'checkLevelComplete' )
	if ( roundStartIndex == questions_per_level - questions_per_round )    return true;
	return false;
}