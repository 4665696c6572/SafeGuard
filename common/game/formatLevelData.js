export default async function formatLevelData( results, screen_name )
{
	if (screen_name == 'MultipleChoiceScreen')
	{
		const multiple_choice_data = results.map(function(result) 
		{
			return {
				id: result.Question_ID,
				question: result.Question,
				answers:
				[ 
					result.Answer_Correct,
					result.Incorrect_Answer_One,
					result.Incorrect_Answer_Two,
					result.Incorrect_Answer_Three
				],
				last_date: result.Last_Seen_Date
			}
		})
		return multiple_choice_data;
	}
	else if (screen_name == 'MatchingScreen')
	{
		const matching_data = results.map(function(result) 
		{
			return {
				id: result.Question_ID,
				question: result.Question,
				answer: result.Answer,
				last_date: result.Last_Seen_Date,
				correct: false
			}
		})
		
		return matching_data;
	}
	else if (screen_name == 'TrueFalseScreen')
	{
		const true_false_data = results.map(function(result) 
		{
			return {
				id: result.Question_ID,
				question: result.Question,
				correct_answer: result.True_Or_False,
				incorrect_answer_one: result.Incorrect_Answer_One,
				incorrect_answer_two: result.Incorrect_Answer_Two,
				incorrect_answer_three: result.Incorrect_Answer_Three,
				last_date: result.Last_Seen_Date
			}
		})
		return true_false_data;
	}	
}
