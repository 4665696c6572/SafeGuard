import { useSQLiteContext } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, ImageBackground, Modal, StyleSheet, Pressable, Text, TouchableHighlight, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';


import {checkAnswer, checkLevelComplete } from '../common/game/sharedGame.js'

import updateLevelData from '../common/game/database/updateLevelData.js';

import useLoadGameData from '../common/game/hook/useLoadGameData.js';

import styles from '../styles/styles.js';

const questions_per_level = 6;
const questions_per_round = 1


export default function TrueFalseScreen({ navigation }) 
{
	const db = useSQLiteContext();
	const underlay = '#0b3e82ff'

	const [ levelComplete, setLevelComplete ] = useState( false );
	const [ levelScore, setLevelScore ] = useState( 0 );
	const [ roundStartIndex, setRoundStartIndex ] = useState( 0 );

	const [ levelData, loadingData ] = useLoadGameData( db, 'TrueFalseScreen', questions_per_level );


	useEffect(( ) =>
	{
		if ( levelComplete )
		{
			navigation.navigate( "GameScreen" );
		}
	}), [ levelComplete ]


	function handleAnswerCheck( correct_answer,  user_answer, question_ID)
	{
		if ( checkAnswer( correct_answer,  user_answer ))
		{
			console.log( 'Correct ' );
			setLevelScore( prev => prev + 1 ); 
		}

		if ( checkLevelComplete( roundStartIndex, questions_per_level, questions_per_round ))
		{
			setLevelComplete( true );
		}
		
		setRoundStartIndex( prev => prev + 1 );
		updateLevelData( db, 'TrueFalseScreen', question_ID );
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

						<View style={ styles.game_row }>
							<TouchableHighlight 
								testID={`match_question_box_${i}`}
								style=
								{[
									styles.game_box_small,
									styles.game_box_active,
									{ height: 100 }
								]}
								onPress={ () => 
								{
									handleAnswerCheck( entry.correct_answer, 'True', entry.id )
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
									styles.game_box_active,
									{ height: 100 }
								]}
								onPress={ () => 
								{
									handleAnswerCheck( entry.correct_answer, 'False', entry.id )
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