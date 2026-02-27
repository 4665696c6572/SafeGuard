import { startOfDay } from "date-fns";


export default async function updateGameData ( table, db, new_level, new_score )
{
	const today = startOfDay( new Date( )).toISOString( );
	const streak_id = startOfDay(new Date( )).toISOString( ).slice( 0, 10 );

	try
	{
		if (table == 'Game_Data' )
		{
			await db.runAsync(
			`
				UPDATE Game_Data
				SET
					current_level = ?,
					score = score + ?
				WHERE user_id = ?;
			`, [ new_level, new_score, 1 ] );

			await db.runAsync(
			`
				INSERT OR IGNORE
				INTO Streak_History
				( streak_id, date_played )
				VALUES ( ?, ? )
			`, [ streak_id, today ]);
		}

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