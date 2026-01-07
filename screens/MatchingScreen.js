import { useSQLiteContext } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import styles from '../styles/styles.js';

export default function MatchingScreen({  }) 
{
	const db = useSQLiteContext();
	const underlay = '#0b3e82ff'

	const [ answerButtonsDisabled, setAnswerButtonsDisabled ] = useState(true);
	const [ answeredCorrectly, setAnsweredCorrectly ] = useState([false, false, false, false, false, false, false, false, false, false, false, false]);
	const [ loadingData, setLoadingData ] = useState(true);
	const [ matchData, setMatchData ] = useState();
	const [ questionSelected, setQuestionSelected ] = useState(null);
	const [ questionOrder, setQuestionOrder ] = useState( () => calcQuestionOrder() );
	const [ answerOrder, setAnswerOrder ] = useState( () => calcAnswerOrder(questionOrder) );
	const [ roundStartIndex, setRoundStartIndex ] = useState(0);
	const [ remainingMatchCount, setRemainingMatchCount ] = useState(12);
	const [ matchScore, setMatchScore ] = useState(0)


	useEffect( ( ) =>
	{		
		if (!db) return;  

		
		if (!matchData)
		{
			setLoadingData(true);
			(async function ()
			{
				let match_data = await selectMatchData( db );
				if (match_data)    setMatchData( match_data );
			})()
		}

	}, [ db ] );

	useEffect( ( ) =>
	{		
		if (!matchData) return

		setLoadingData(false);
	}, [ matchData ] );


	useEffect( () =>
	{
		
		if(checkRoundComplete(answeredCorrectly, questionOrder, roundStartIndex))
		{	
			setRoundStartIndex(prev => prev + 3);
		}
	}, [ answeredCorrectly, questionOrder, roundStartIndex] );



	function checkAnswer( questionSelected, answerNumber )
	{ 
		if (answerNumber != questionSelected)    return;
		else 
		{
			const correct = answeredCorrectly.map((curr, i) => 
			{
				if (i == questionSelected)    return true;

				else    return curr;
			});	

			setMatchScore(prev => prev + 1)
			setRemainingMatchCount(prev => prev - 1);
			setAnswerButtonsDisabled(true);
			setAnsweredCorrectly(correct);			
			updateCorrectDate ( db, matchData, questionSelected );
		}
	}







	

	if (loadingData)    return <ActivityIndicator/>;
// console.log(typeof matchData)
	return (
		<View style={ styles.container }>
			<SafeAreaProvider style={[ styles.game_area, {marginBottom: '25%'} ]}>
			{ 
				 remainingMatchCount > 0 ?  
				<View style={ styles.score_row }>

					<View style={ styles.score }>
						<Text style={ styles.score_text } >Score</Text>	
						<Text style={ styles.score_text } >{ matchScore }</Text>	
					</View> 

					<View style={ styles.count }>
						<Text style={ styles.score_text } >Remaining</Text>
						<Text style={ styles.score_text } >{12 - remainingMatchCount } / {remainingMatchCount}</Text>
					</View> 
				</View>
				: null 
			}
				{
					matchData.slice(roundStartIndex, roundStartIndex + 3).map((entry, i) => 
					<View style={ styles.game_row } key = {`${questionOrder[i]}--${answerOrder[i]}`}>
					{ 
						answeredCorrectly[questionOrder[roundStartIndex + i]] === false ?

						<TouchableHighlight 
							testID={`match_question_box_${i}`}
							style=
							{[
								styles.game_box_small,
								[ questionSelected === questionOrder[roundStartIndex + i] ? styles.game_box_selected : styles.game_box_active ] 
							]}
							onPress={ () => 
							{
								setQuestionSelected(questionOrder[roundStartIndex + i]); 
								setAnswerButtonsDisabled( false ); 
							}}
							underlayColor={ underlay }
							activeOpacity={ 1 }
						>
							<Text style={ styles.game_text }>{matchData[questionOrder[roundStartIndex + i]].question}</Text>
						</TouchableHighlight>

						: <View style={ styles.game_box_small } testID={`match_question_box_${i}_disabled`} />
					}


					{ 
						answeredCorrectly[answerOrder[roundStartIndex + i]] === false ?

						<TouchableHighlight style={[ styles.game_box_small, styles.game_box_active, answerButtonsDisabled ? styles.game_box_disabled : null ]}
							testID={`match_answer_box_${i}`}
							onPress={ () => checkAnswer( questionSelected, answerOrder[roundStartIndex + i] ) } 
							disabled={ answerButtonsDisabled }
							underlayColor={ underlay }
							activeOpacity={ 1 }
						>
							<Text style={ styles.game_text }>{ matchData[answerOrder[roundStartIndex + i]].answer }</Text>
						</TouchableHighlight>

						: <View style={ styles.game_box_small } testID={`match_answer_box_${i}_disabled`} /> 
					}
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
	return Array.from({length: 12}, (_, start) => start).sort( () => Math.random() - 0.5);
}

const calcAnswerOrder = (questionOrder) =>
{
	let answer_order = [];
	for (let i = 0; i < 12; i += 3)    answer_order.push(questionOrder.slice(i, i + 3).sort( () => Math.random() - 0.5))
	return answer_order.flat()
}

function checkRoundComplete(answeredCorrectly, questionOrder, roundStartIndex)
{
	if 
	( 
		answeredCorrectly[questionOrder[roundStartIndex]] == true && 
		answeredCorrectly[questionOrder[roundStartIndex + 1]] == true &&
		answeredCorrectly[questionOrder[roundStartIndex + 2]] == true
	)
	{  
		console.log('screen cleared'); 
		return true;
	}
	else return false;
}

const selectMatchData = async ( db ) =>
{
	try
	{
		const result_match = await db.getAllAsync(
		`
			SELECT
				Question_ID,
				Question,
				Answer,
				Last_Seen_Date
			FROM Matching_Data
			ORDER BY Last_Seen_Date
			LIMIT 12;
		`);


		const match_data = result_match.map(function(result) 
		{
			return {
				id: result.Question_ID,
				question: result.Question,
				answer: result.Answer,
				last_date: result.Last_Seen_Date
			}
		})

		console.log( 'Match Data Loaded' );
		return match_data;
	}
	catch ( error )
	{
		console.log( 'Error loading Match data:', error );
	}
};


	const updateCorrectDate = async ( db, matchData, questionSelected ) =>
	{
		let date = new Date().toISOString().slice(0,10);

		try
			{
				await db.runAsync( 
					`
						UPDATE Matching_Data
						SET Last_Seen_Date = ?
						WHERE Question_ID = ?;
					`,
					[date, matchData[questionSelected].id]
				);
			}
		catch (error)
			{
				console.error( 'Error updating Correct Date:', error );
			}
	}