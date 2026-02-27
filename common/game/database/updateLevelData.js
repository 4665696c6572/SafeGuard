import { startOfDay } from "date-fns";

let date = startOfDay( new Date( ) ).toISOString( ).slice( 0, 10 );

const queries =
{
	TrueFalseScreen:
	`
		UPDATE True_False_Data
		SET last_seen_date = ?
		WHERE question_id = ?;
	`,
	MatchingScreen:
	`
		UPDATE Matching_Data
		SET last_seen_date = ?
		WHERE question_id = ?;
	`,
	MultipleChoiceScreen:
	`
		UPDATE Multiple_Choice_Data
		SET last_seen_date = ?
		WHERE question_id = ?;
	`
}

export default async function updateLevelData ( db, screen_name, question_id )
{
	try
	{
		await db.runAsync( queries[`${ screen_name }`], [ date, question_id ]);
		console.log( `${ screen_name } data updated.` );
	}
	catch ( error )
	{
		console.log( `Error updating ${ screen_name } data:`, error );
	}
};