// Loads non-content game data
export default async function selectGameData ( db )
{
	try
	{
		// last_badge_seen is a badge number
		const game_data = await db.getAllAsync(
		`
			SELECT
				last_badge_seen,
				current_level,
				score
			FROM Game_Data;
		`
		);

		// streak_seen is a bool for single viewing of streak update per day
		const streak_history = await db.getAllAsync(
		`
			SELECT
				date_played,
				streak_seen
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