export default async function updateGameData ( new_level, new_score, db )
{
	try
	{
		if ( new_score )
		{
			await db.runAsync(
			`
				UPDATE Game_Data
				SET
					current_level = ?,
					score = score + ?
				WHERE user_id = ?;
			`, [ new_level, new_score, 1 ] );
		}

		const result = await db.runAsync(
		`
			INSERT OR IGNORE
			INTO Streak_History
			( streak_id, date_played )
			VALUES ( ?, ? )
		`, [ now.toISOString( ).slice( 0, 10 ), now.toISOString( ) ] );

		console.log( `Game data updated.` );
	}
	catch ( error )
	{
		console.log( `Error updating game data:`, error );
	}
};