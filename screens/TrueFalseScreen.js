import { useSQLiteContext } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, ImageBackground, StyleSheet, Pressable, Text, TouchableHighlight, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';


import styles from '../styles/styles.js';

const total_question_count = 16;


export default function TrueFalseScreen({  }) 
{
	const db = useSQLiteContext();
	const underlay = '#0b3e82ff'


	const [ loadingData, setLoadingData ] = useState(true);
	const [ trueFalseData, setTrueFalseData ] = useState();

	const [ roundStartIndex, setRoundStartIndex ] = useState(0);
	const [ remainingMultipleChoiceCount, setRemainingMultipleChoiceCount ] = useState(total_question_count);
	const [ trueFalseScore, setTrueFalseScore ] = useState(0)




	
	
	useEffect( ( ) =>
	{		
		if (!db) return;  

		
		if (!trueFalseData)
		{
			setLoadingData(true);
			(async function ()
			{
				setRoundStartIndex(0)
				let true_false_data = await selectTrueFalseData( db );

				if (true_false_data)    setTrueFalseData( true_false_data );
			})()
		}

	}, [ db ] );

	useEffect( ( ) =>
	{		
		if (!trueFalseData) return
		// setAnswerOrder(calcAnswerOrder());
		setLoadingData(false);
	}, [ trueFalseData ] );


	
	function checkRoundComplete( correct_answer,  user_answer)
	{
		if (correct_answer ==  user_answer )
		{
			console.log('Correct')
			
			setTrueFalseScore(prev => prev + 1);
			
		}
		setRemainingMultipleChoiceCount(prev => prev - 1);
		setRoundStartIndex(prev => prev + 1)
		console.log(typeof roundStartIndex)
		
	}

const selectTrueFalseData = async ( db ) =>
{
	try
	{
		const result_true_false = await db.getAllAsync(
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
			[total_question_count]
		);

		const true_false_data = result_true_false.map(function(result) 
		{
			return {
				id: result.Question_ID,
				question: result.Question,
				correct_answer: result.True_Or_False,
				last_date: result.Last_Seen_Date
			}
		})

			console.log( 'True or False Data Loaded' );
			return true_false_data;
		}
		catch ( error )
		{
			console.log( 'Error loading True or False data:', error );
		}
	};



	if (loadingData)    return <ActivityIndicator/>;
	console.log(trueFalseData[roundStartIndex].question)

	return (
		<View style={ styles.container }>
			<SafeAreaProvider style={[ styles.game_area, {marginBottom: '10%'} ]}>
			{ 
				remainingMultipleChoiceCount > 0 ?  
				<View style={ styles.score_row }>

					<View style={ styles.score }>
						<Text style={ styles.score_text } >Score</Text>	
						<Text style={ styles.score_text } >{ trueFalseScore } </Text>	
					</View> 

					<View style={ styles.count }>
						<Text style={ styles.score_text } >Remaining</Text>
						<Text style={ styles.score_text } >{total_question_count - remainingMultipleChoiceCount } / {remainingMultipleChoiceCount}</Text>
					</View> 
				</View>
				: null 
			}
	
				{
					trueFalseData.slice(roundStartIndex, roundStartIndex + 1).map((entry, i) => 
					<View style={ styles.game_column } key = {`${trueFalseData[i].id}`}>
						

						<View style={[ styles.game_box_large, styles.multiple_choice_question ]}>
							<Text style={ styles.multiple_choice_question_text }>{ entry.question }</Text>
						</View>

						<View style={ styles.game_row }>
							<TouchableHighlight 
								testID={`match_question_box_${i}`}
								style=
								{[
									styles.game_box_small,
									styles.game_box_active 
								]}
								onPress={ () => 
								{
									checkRoundComplete('tf', entry.correct_answer, 'True' )
					
								}}
								underlayColor={ underlay }
								activeOpacity={ 1 }
							>
								<Text style={ styles.game_text }>True</Text>
							</TouchableHighlight>


							<TouchableHighlight 
								testID={`match_question_box_${i}`}
								style=
								{[
									styles.game_box_small,
									styles.game_box_active 
								]}
								onPress={ () => 
								{
									checkRoundComplete('tf', entry.correct_answer, 'False' )
								}}
								underlayColor={ underlay }
								activeOpacity={ 1 }
							>
								<Text style={ styles.game_text }>False</Text>
							</TouchableHighlight>
						</View>
					</View>
				)}
				<StatusBar style="auto" />
			</SafeAreaProvider>
		</View>
	);
}




	const updateCorrectDate = async ( db, trueFalseData, roundStartIndex ) =>
	{
						// let date = new Date().toISOString().slice(0,10);

						// try
						// 	{
						// 		await db.runAsync( 
						// 			`
						// 				UPDATE True_Or_False_Data
						// 				SET Last_Seen_Date = ?
						// 				WHERE Question_ID = ?;
						// 			`,
						// 			[date, trueFalseData[roundStartIndex].id]
						// 		);
						// 	}
						// catch (error)
						// 	{
						// 		console.error( 'Error updating Correct Date:', error );
						// 	}
	}


	

