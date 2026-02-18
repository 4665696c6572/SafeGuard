export default async function updateGameData ( new_score, db )
{
	try
	{
		await db.runAsync(
		`
			UPDATE Game_Data
			SET score = ?
			WHERE user_id = ?;
		`, [ new_score, 1 ] );

		console.log( `Score updated in database` );
	}
	catch ( error )
	{
		console.log( `Error updating game data:`, error );
	}
};