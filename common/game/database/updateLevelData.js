let date = new Date().toISOString().slice(0,10);

const queries =
{
	TrueFalseScreen:
	`
		UPDATE True_False_Data
		SET Last_Seen_Date = ?
		WHERE Question_ID = ?;
	`,
	MatchingScreen:
	`
		UPDATE Matching_Data
		SET Last_Seen_Date = ?
		WHERE Question_ID = ?;
	`,
	MultipleChoiceScreen:
	`
		UPDATE Multiple_Choice_Data
		SET Last_Seen_Date = ?
		WHERE Question_ID = ?;
	`
}

export default async function updateLevelData( db, screen_name, question_ID ) 
{
	try
	{

		await db.runAsync( queries[`${screen_name}`], [date, question_ID]);
		console.log( `updated` );
	}
	catch ( error )
	{
		console.log( `Error updating ${screen_name} data:`, error );
	}
};

