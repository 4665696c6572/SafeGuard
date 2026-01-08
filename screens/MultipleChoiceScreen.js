import { useSQLiteContext } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';


import { calcAnswerOrder } from '../common/game/sharedGame.js';
import formatLevelData from '../common/game/formatLevelData.js';
import selectLevelData from '../common/game/database/selectLevelData.js';
import updateLevelData from '../common/game/database/updateLevelData.js';

import styles from '../styles/styles.js';

const questions_per_round = 1
const answers_per_round = 4;
const total_question_count = 10;



export default function MultipleChoiceScreen({  }) 
{
	const db = useSQLiteContext();
	const underlay = '#0b3e82ff'

	const [ loadingData, setLoadingData ] = useState(true);
	const [ multipleChoiceData, setMultipleChoiceData ] = useState();

	const [ answerOrder, setAnswerOrder ] = useState( calcAnswerOrder( answers_per_round ) );
	const [ roundStartIndex, setRoundStartIndex ] = useState(0);
	const [ levelComplete, setLevelComplete ] = useState( );
	const [ multipleChoiceScore, setMultipleChoiceScore ] = useState(0)


	useEffect( () =>
	{		
		if ( !db || multipleChoiceData ) return;  

		setLoadingData(true);
		setLevelComplete(false);

		async function loadData() 
		{
			try 
			{
				const unformatted_data = await selectLevelData( db, 'MultipleChoiceScreen', total_question_count );
				const formatted_data = await formatLevelData(unformatted_data, 'MultipleChoiceScreen');
				setMultipleChoiceData(formatted_data)
			} 
			catch ( error ) 
			{
				console.error( error );
			} 
			finally 
			{
				setLoadingData( false );
			}
		}
		loadData();
	}, [ db ] );




	function checkRoundComplete( correct_answer, user_answer, question_ID)
	{
		if (correct_answer ==  user_answer )
		{
			console.log('Correct')
			setMultipleChoiceScore(prev => prev + 1);
		}

		setAnswerOrder( calcAnswerOrder( answers_per_round ));
		setRoundStartIndex( prev => prev + 1 );
		updateLevelData( db, 'MultipleChoiceScreen', question_ID );
	}


	if (loadingData)    return <ActivityIndicator/>;

	return (
		<View style={ styles.container }>
			<SafeAreaProvider style={[ styles.game_area, {marginBottom: '10%'} ]}>
				{ 
					roundStartIndex < total_question_count ?  
					<View style={ styles.score_row }>

						<View style={ styles.score }>
							<Text style={ styles.score_text } >Score</Text>	
							<Text style={ styles.score_text } >{ multipleChoiceScore } </Text>	
						</View> 

						<View style={ styles.count }>
							<Text style={ styles.score_text } >Round</Text>
							<Text style={ styles.score_text } >{ roundStartIndex  + 1} / { total_question_count }</Text>
						</View>  
					</View>
					: null
					
				}
				{
					multipleChoiceData.slice(roundStartIndex, roundStartIndex + 1).map((entry, i) => 
					<View style={ styles.game_column } key = {entry.id}>
						

						<View style={[ styles.game_box_large, styles.multiple_choice_question ]}>
							<Text style={ styles.multiple_choice_question_text }>{ entry.question }</Text>
						</View>


						{	
							answerOrder.map((index) => 
							<TouchableHighlight 
								key = {index}
								style={[ styles.game_box_large, styles.game_box_active ]} 
								onPress={ () => checkRoundComplete( entry.answers[0], entry.answers[answerOrder[index]], entry.ID) } 
								underlayColor={ underlay }
								activeOpacity={ 1 }
							>
								<Text style={ styles.game_text }>{ entry.answers[answerOrder[index]] }</Text>
							</TouchableHighlight>

						)}
					</View>
				)}
				<StatusBar style="auto" />
			</SafeAreaProvider>
		</View>
	);
}