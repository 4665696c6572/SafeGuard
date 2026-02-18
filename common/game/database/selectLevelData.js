export default async function selectLevelData( db, screen_name, questions_per_level )
{
	try
	{
		let level_data = await db.getAllAsync( queries[`${screen_name}`], questions_per_level);

		if ( screen_name == 'MultipleChoiceScreen' )
		{
			level_data = level_data.map( function( result )
			{
				return {
					question_id: result.question_id,
					question: result.question,
					answers:
					[
						result.answer_correct,
						result.answer_one_incorrect,
						result.answer_two_incorrect,
						result.answer_three_incorrect
					],
					last_date: result.last_seen_date
				}
			})
		}

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
			question_id,
			question,
			answer,
			last_seen_date
		FROM True_False_Data
		ORDER BY last_seen_date
		Limit ?
	`,
	MatchingScreen:
	`
		SELECT
			question_id,
			question,
			answer,
			last_seen_date
		FROM Matching_Data
		ORDER BY last_seen_date
		LIMIT ?
	`,
	MultipleChoiceScreen:
	`
		SELECT
			question_id,
			question,				
			last_seen_date,
			answer_correct,
			answer_one_incorrect,
			answer_two_incorrect,
			answer_three_incorrect				
		FROM Multiple_Choice_Data
		GROUP BY question_id
		ORDER BY last_seen_date
		LIMIT ?
	`
};