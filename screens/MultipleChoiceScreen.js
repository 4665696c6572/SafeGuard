import { useSQLiteContext } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';


import { calcAnswerOrder, checkLevelComplete } from '../common/game/sharedGame.js';

import useLoadGameData from '../common/game/hook/useLoadGameData.js';

import updateLevelData from '../common/game/database/updateLevelData.js';

import styles from '../styles/styles.js';


const questions_per_round = 1
const answers_per_round = 4;
const questions_per_level = 10;


export default function MultipleChoiceScreen({ navigation }) 
{
	const db = useSQLiteContext();
	const underlay = '#0b3e82ff'

	const [ answerOrder, setAnswerOrder ] = useState( calcAnswerOrder( answers_per_round ) );
	const [ roundStartIndex, setRoundStartIndex ] = useState(0);
	const [ levelComplete, setLevelComplete ] = useState( false );
	const [ levelScore, setLevelScore ] = useState(0)

	const [ levelData, loadingData ] = useLoadGameData( db, 'MultipleChoiceScreen', questions_per_level )


	useEffect(( ) =>
	{
		if ( levelComplete )
		{
			navigation.navigate( "GameScreen" );
		}
	}), [ levelComplete ]
	

	function checkRoundComplete( correct_answer, user_answer, question_ID)
	{
		if (correct_answer ==  user_answer )
		{
			console.log('Correct');
			setLevelScore(prev => prev + 1);
		}

		setAnswerOrder( calcAnswerOrder( answers_per_round ));
		setRoundStartIndex( prev => prev + 1 );
		updateLevelData( db, 'MultipleChoiceScreen', question_ID );

		if ( checkLevelComplete( roundStartIndex, questions_per_level, questions_per_round ))
		{	
			setLevelComplete( true );
			console.log( 'Level complete.')
		}
	}


	if (loadingData)    return <ActivityIndicator/>;

	return (
		<View style={ styles.container }>
			<SafeAreaProvider style={[ styles.game_area, {marginBottom: '10%'} ]}>
				{ 
					roundStartIndex < questions_per_level ?  
					<View style={ styles.score_row }>

						<View style={ styles.score }>
							<Text style={ styles.score_text } >Score</Text>	
							<Text style={ styles.score_text } >{ levelScore } </Text>	
						</View> 

						<View style={ styles.count }>
							<Text style={ styles.score_text } >Round</Text>
							<Text style={ styles.score_text } >{ roundStartIndex  + 1} / { questions_per_level }</Text>
						</View>  
					</View>
					: null
					
				}
				{
					levelData.slice(roundStartIndex, roundStartIndex + 1).map((entry, i) => 
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