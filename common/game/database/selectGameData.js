export default async function selectGameData ( db )
{
	try
	{
		const game_data = await db.getAllAsync(
		`
			SELECT
				score,
				level_status
			FROM Game_Data
			WHERE user_id = ?;
		`, [ 1 ]
		);
		console.log( 'Game data loaded' );

		return game_data;
	}
	catch ( error )
	{
		console.log( `Error loading game data:`, error );
	}
};