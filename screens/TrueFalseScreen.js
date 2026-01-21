import { useSQLiteContext } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, Modal,Text, TouchableHighlight, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {  StackActions } from '@react-navigation/native';

import {checkAnswer, checkLevelComplete } from '../common/game/sharedGame.js'

import updateGameData from '../common/game/database/updateGameData.js'
import updateLevelData from '../common/game/database/updateLevelData.js';
import useLoadGameData from '../common/game/hook/useLoadGameData.js';

import styles from '../styles/styles.js';

const questions_per_level = 6;
const questions_per_round = 1;

const imgUri = require( '../assets/frog.png' );
const screen_width = Dimensions.get('screen').width;

export default function TrueFalseScreen({ navigation, route }) 
{
	const db = useSQLiteContext();
	const underlay = '#0b3e82ff'

	const [ currentNumber, setCurrentNumber ] = useState( 1 );
	const [ levelComplete, setLevelComplete ] = useState( false );
	const [ levelScore, setLevelScore ] = useState( 0 );
	const [ roundStartIndex, setRoundStartIndex ] = useState( 0 );

	const [ levelData, loadingData ] = useLoadGameData( db, 'TrueFalseScreen', questions_per_level );


	useEffect(( ) =>
	{
		if ( levelComplete )
		{
			const new_score = route?.params?.score + levelScore;

			updateGameData( new_score, db );
			setTimeout(function() 
			{
				navigation.dispatch(StackActions.pop());
				navigation.navigate("GameScreen", {score: new_score});
			}, 1200) 
		}
	}), [ levelComplete ]


	function handleAnswerCheck( correct_answer,  user_answer, question_ID)
	{
		if ( checkAnswer( correct_answer,  user_answer ))
		{
			console.log( 'Correct' );
			setLevelScore( prev => prev + 1 ); 
		}

		if ( checkLevelComplete( roundStartIndex, questions_per_level, questions_per_round ))
		{
			setLevelComplete( true );
		}

		setCurrentNumber( prev => prev + 1 );
		setRoundStartIndex( prev => prev + 1 );
		updateLevelData( db, 'TrueFalseScreen', question_ID );
	}


	if (loadingData)    return <ActivityIndicator/>;


	return (
		<View style={ styles.container }>
			<SafeAreaProvider style={ styles.game_area }>
				<Modal visible={ levelComplete } >
					<SafeAreaProvider style={ styles.game_area }>

						<View>
							<Text style={ styles.score_text } >Final score</Text>	
							<Text style={ styles.score_text } >{ levelScore }</Text>	
						</View> 

						<View style={{ alignItems: 'center' }}>
							<Image source={ imgUri } style={{ height: 250, width: 250 }}/>
						</View>
					</SafeAreaProvider>
				</Modal>

				{/* Progress and Score */}
				<View style={ styles.progress_bar_container } >
					<View style={ styles.progress_bar }>
						<Progress.Bar 
							progress={( currentNumber / questions_per_level )} 
							height= '20' 
							width={ screen_width * 0.6 } 
							color='#66a1efff' 
							borderRadius={5} 
							unfilledColor='#bacfeaff' 
							borderColor='#DBE2E9'
						/>
					</View>

						<Text style={ styles.count_text } >{ Math.min( currentNumber, questions_per_level )} / { questions_per_level }</Text>
				</View>

				<View>
						<Text style={ styles.score_text } >Score</Text>	
						<Text style={ styles.score_text } >{ levelScore }</Text>	
				</View> 


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