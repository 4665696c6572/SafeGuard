
export function calcAnswerOrder(length)
{
	let start = 0;
	return Array.from({length: length}, (_, start) => start).sort( () => Math.random() - 0.5);
}


