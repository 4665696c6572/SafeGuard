export default async function updateGameData ( new_score, db ) 
{
	try
	{
		await db.runAsync(
		`
			UPDATE Game_Data
			SET Score = ?
			WHERE User_ID = ?;
		`, [ new_score, 1 ] );

		console.log( `Score updated in database.` );
	}
	catch ( error )
	{
		console.log( `Error updating game data:`, error );
	}
};