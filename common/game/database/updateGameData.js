import { startOfDay } from "date-fns";

export default async function updateGameData ( table, db, new_level, new_score )
{
	// streak_id is used to prevent multiple entries for a single day
	const streak_id = startOfDay( new Date( )).toISOString( ).slice( 0, 10 );
	const today = startOfDay( new Date( )).toISOString( );

	try
	{
		if ( table == 'Game_Data' )
		{
			await db.runAsync(
			`
				UPDATE Game_Data
				SET
					current_level = ?,
					score = score + ?;
			`, [ new_level, new_score ] );

			await db.runAsync(
			`
				INSERT OR IGNORE
				INTO Streak_History
				( streak_id, date_played )
				VALUES ( ?, ? )
			`, [ streak_id, today ]);
		}

		// last_badge_seen is a badge number
		if ( table == 'Badge' )
		{
			await db.runAsync(
			`
				UPDATE Game_Data
				SET	last_badge_seen = ?;
			`, [ new_level ]);
		}

		// streak_seen is a bool for single viewing of streak update per day
		if ( table == 'Streak' )
		{
			await db.runAsync(
			`
				UPDATE Streak_History
				SET streak_seen = ?
				WHERE streak_id = ?;
			`, [ 1, streak_id ]);
		}

		console.log( `Game data updated.` );
	}
	catch ( error )
	{
		console.log( `Error updating game data:`, error );
	}
};