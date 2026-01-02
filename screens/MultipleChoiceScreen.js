import { useSQLiteContext } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';


import styles from '../styles/styles';
const total_question_count = 10;

export default function MultipleChoiceScreen({  }) 
{
	const db = useSQLiteContext();
	const underlay = '#0b3e82ff'
	

	const [ loadingData, setLoadingData ] = useState(true);
	const [ multipleChoiceData, setMultipleChoiceData ] = useState();
	const [ questionOrder, setQuestionOrder ] = useState( () => calcQuestionOrder() );
	const [ answerOrder, setAnswerOrder ] = useState( );
	const [ roundStartIndex, setRoundStartIndex ] = useState(0);
	const [ remainingMultipleChoiceCount, setRemainingMultipleChoiceCount ] = useState(total_question_count);
	const [ multipleChoiceScore, setMultipleChoiceScore ] = useState(0)


	useEffect( ( ) =>
	{		
		if (!db) return;  

		
		if (!multipleChoiceData)
		{
			setLoadingData(true);
			(async function ()
			{
				let multiple_choice_data = await selectMultipleChoiceData( db );
				if (multiple_choice_data)    setMultipleChoiceData( multiple_choice_data );
			})()
		}

	}, [ db ] );

	useEffect( ( ) =>
	{		
		if (!multipleChoiceData) return
		setAnswerOrder(calcAnswerOrder());
		setLoadingData(false);
	}, [ multipleChoiceData ] );




	function checkAnswer( answerNumber )
	{ 
		if (answerNumber == 0)
		{
			setMultipleChoiceScore(prev => prev + 1)
			updateCorrectDate ( db, multipleChoiceData, roundStartIndex );
			console.log('correct')
		}
		setAnswerOrder(calcAnswerOrder());
		setRemainingMultipleChoiceCount(prev => prev - 1);
		setRoundStartIndex(prev => prev + 1);
	}


	if (loadingData)    return <ActivityIndicator/>;
// console.log('q ' + questionOrder)
// console.log('a ' + answerOrder)
	return (
		<View style={ styles.container }>
			<SafeAreaProvider style={[ styles.game_area, {marginBottom: '10%'} ]}>
			{ 
				remainingMultipleChoiceCount > 0 ?  
				<View style={ styles.score_row }>

					<View style={ styles.score }>
						<Text style={ styles.score_text } >Score</Text>	
						<Text style={ styles.score_text } >{ multipleChoiceScore } </Text>	
					</View> 

					<View style={ styles.count }>
						<Text style={ styles.score_text } >Remaining</Text>
						<Text style={ styles.score_text } >{total_question_count - remainingMultipleChoiceCount } / {remainingMultipleChoiceCount}</Text>
					</View> 
				</View>
				: null 
			}
				{
					multipleChoiceData.slice(roundStartIndex, roundStartIndex + 1).map((entry, i) => 
					<View style={ styles.game_column } key = {`${multipleChoiceData[questionOrder[roundStartIndex]].id}`}>
						

						<View style={[ styles.game_box_large, styles.multiple_choice_question ]}>
							<Text style={ styles.multiple_choice_question_text }>{ multipleChoiceData[questionOrder[roundStartIndex]].question }</Text>
						</View>



						<TouchableHighlight style={[ styles.game_box_large, styles.game_box_active ]}
							testID='answer_box_1'
							onPress={ () => checkAnswer( answerOrder[0] ) } 
							underlayColor={ underlay }
							activeOpacity={ 1 }
						>
							<Text style={ styles.game_text }>{ multipleChoiceData[questionOrder[roundStartIndex]].answers[answerOrder[0]]}</Text>
						</TouchableHighlight>


						<TouchableHighlight style={[ styles.game_box_large, styles.game_box_active ]}
							testID='answer_box_2'
							onPress={ () => checkAnswer( answerOrder[1] ) } 
							underlayColor={ underlay }
							activeOpacity={ 1 }
						>
							<Text style={ styles.game_text }>{  multipleChoiceData[questionOrder[roundStartIndex]].answers[answerOrder[1]] }</Text>
						</TouchableHighlight>

						<TouchableHighlight style={[ styles.game_box_large, styles.game_box_active ]}
							testID='answer_box_3'
							onPress={ () => checkAnswer( answerOrder[2] ) } 
							underlayColor={ underlay }
							activeOpacity={ 1 }
						>
							<Text style={ styles.game_text }>{  multipleChoiceData[questionOrder[roundStartIndex]].answers[answerOrder[2]] }</Text>
						</TouchableHighlight>


						<TouchableHighlight style={[ styles.game_box_large, styles.game_box_active ]}
							testID='answer_box_3'
							onPress={ () => checkAnswer( answerOrder[3] ) } 
							underlayColor={ underlay }
							activeOpacity={ 1 }
						>
							<Text style={ styles.game_text }>{  multipleChoiceData[questionOrder[roundStartIndex]].answers[answerOrder[3]] }</Text>
						</TouchableHighlight>
						
					</View>
				)}
				<StatusBar style="auto" />
			</SafeAreaProvider>
		</View>
	);
}



const calcQuestionOrder = () =>
{
	let start = 0;
	return Array.from({length: total_question_count}, (_, start) => start).sort( () => Math.random() - 0.5);
}

const calcAnswerOrder = () =>
{
	let start = 0;
	return Array.from({length: 4}, (_, start) => start).sort( () => Math.random() - 0.5);
}


const selectMultipleChoiceData = async ( db ) =>
{
	try
	{
		const result_multiple_choice = await db.getAllAsync(
		`
			SELECT
				Question_ID,
				Question,
				Answer_Correct,
				Answer_One_Incorrect,
				Answer_Two_Incorrect,
				Answer_Three_Incorrect,
				Last_Correct_Date
			FROM Multiple_Choice_Data
			ORDER BY Last_Correct_Date
			LIMIT 10;
		`);


	const multiple_choice_data = result_multiple_choice.map(function(result) 
	{
		return {
			id: result.Question_ID,
			question: result.Question,
			answers:
			[ 
				result.Answer_Correct,
				result.Answer_One_Incorrect,
				result.Answer_Two_Incorrect,
				result.Answer_Three_Incorrect
			],
			last_date: result.Last_Correct_Date
		}
	})

			console.log( 'MultipleChoice Data Loaded' );
			return multiple_choice_data;
			// setMultipleChoiceData(multiple_choice_data)
	
		}
		catch ( error )
		{
			console.log( 'Error loading Multiple Choice data:', error );
		}
	};


	const updateCorrectDate = async ( db, multipleChoiceData, roundStartIndex ) =>
	{
		let date = new Date().toISOString().slice(0,10);

		try
			{
				await db.runAsync( 
					`
						UPDATE Matching_Data
						SET Last_Correct_Date = ?
						WHERE Question_ID = ?;
					`,
					[date, multipleChoiceData[roundStartIndex].id]
				);
			}
		catch (error)
			{
				console.error( 'Error updating Correct Date:', error );
			}
	}