export default async function selectGameData ( db )
{
	try
	{
		const game_data = await db.getAllAsync(
		`
			SELECT Score, Level_Status FROM Game_Data 
			WHERE User_ID = ?;
		`,  [ 1 ]
		);
		console.log( 'Game data loaded' );
		return game_data;
	}
	catch ( error )
	{
		console.log( `Error loading game data:`, error );
	}
};