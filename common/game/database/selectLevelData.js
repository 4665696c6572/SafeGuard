export default async function selectLevelData( db, screen_name, questions_per_level ) 
{
	try
	{
		const level_data = await db.getAllAsync( queries[`${screen_name}`], questions_per_level);
		console.log( `${screen_name} Loaded` );
		return level_data;
	}
	catch ( error )
	{
		console.log( `Error loading ${screen_name} data:`, error );
	}
};

	const queries =
	{
		TrueFalseScreen:
		`
			SELECT
				Question_ID,
				Question,
				True_Or_False,
				Last_Seen_Date
			FROM True_False_Data
			ORDER BY Last_Seen_Date
			Limit ?
		`,
		MatchingScreen:
		`
			SELECT
				Question_ID,
				Question,
				Answer,
				Last_Seen_Date
			FROM Matching_Data
			ORDER BY Last_Seen_Date
			LIMIT ?
		`,
		MultipleChoiceScreen:
		`
			SELECT
				Question_ID,
				Question,
				Answer_Correct,
				Incorrect_Answer_One,
				Incorrect_Answer_Two,
				Incorrect_Answer_Three,
				Last_Seen_Date
			FROM Multiple_Choice_Data
			ORDER BY Last_Seen_Date
			LIMIT ?
		`

	}




