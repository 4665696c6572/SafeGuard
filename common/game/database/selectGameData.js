export default async function selectGameData ( db )
{
	try
	{
		const game_data = await db.getAllAsync(
		`
			SELECT
				current_level,
				score
			FROM Game_Data;
		`
		);

		const streak_history = await db.getAllAsync(
		`
			SELECT
				date_played
			FROM Streak_History
			ORDER by date_played Desc;
		`
		);

		console.log( 'Game data loaded' );

		return { game_data: game_data, streak_history: streak_history };
	}
	catch ( error )
	{
		console.log( `Error loading game data:`, error );
	}
};