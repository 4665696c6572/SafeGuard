import { useSQLiteContext } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';


import { calcAnswerOrder, checkAnswer,  checkLevelComplete, checkRoundComplete, setResultArray, updateResultArray } from '../common/game/sharedGame.js'

import useLoadGameData from '../common/game/hook/useLoadGameData.js';

import updateLevelData from '../common/game/database/updateLevelData.js';

import styles from '../styles/styles.js';

// const answers_per_round = 3;
const questions_per_round = 3; 
const questions_per_level = 12

export default function MatchingScreen({ navigation }) 
{
	const db = useSQLiteContext();
	const underlay = '#0b3e82ff'

	const [ answerButtonsDisabled, setAnswerButtonsDisabled ] = useState( true );
	const [ answeredCorrectly, setAnsweredCorrectly ] = useState( setResultArray( questions_per_round ));
	const [ answerOrder, setAnswerOrder ] = useState( calcAnswerOrder( questions_per_round ));
	const [ levelComplete, setLevelComplete ] = useState( false );
	const [ levelScore, setLevelScore ] = useState( 0 )
	const [ questionSelected, setQuestionSelected ] = useState( null );
	const [ roundStartIndex, setRoundStartIndex ] = useState( 0 );

	const [levelData, loadingData] = useLoadGameData(db, 'MatchingScreen', questions_per_level);


	useEffect( () =>
	{
		if ( checkRoundComplete( answeredCorrectly, questions_per_round ))
		{	
			setAnsweredCorrectly( setResultArray( questions_per_round ));
			setAnswerOrder( calcAnswerOrder( questions_per_round ));
			setRoundStartIndex( prev => prev + questions_per_round );
			if ( checkLevelComplete( roundStartIndex, questions_per_level, questions_per_round ))   setLevelComplete( true );
		}
	}, [ answeredCorrectly ] );


	useEffect(( ) =>
	{
		if ( levelComplete )
		{
			navigation.navigate( "GameScreen" );
		}
	}), [ levelComplete ]


	function handleAnswerCheck( question_ID, answer_ID, question_index )
	{ 
		if (checkAnswer( question_ID, answer_ID ))
		{
			setAnsweredCorrectly( updateResultArray( answeredCorrectly, question_index ))
		}
		if ( answer_ID != question_ID )    return;
			
			setLevelScore( prev => prev + 1 )
			setAnswerButtonsDisabled( true );
			updateLevelData ( db, 'MatchingScreen', question_ID );
	}


	if ( loadingData )    return <ActivityIndicator/>;

	return (
		<View style={ styles.container }>
			<SafeAreaProvider style={[ styles.game_area, {marginBottom: '25%'} ]}>
			{ 
				roundStartIndex < questions_per_level ?  
				<View style={ styles.score_row }>

					<View style={ styles.score }>
						<Text style={ styles.score_text } >Score</Text>	
						<Text style={ styles.score_text } >{ levelScore }</Text>	
					</View> 

					<View style={ styles.count }>
						<Text style={ styles.score_text } >Round</Text>
						<Text style={ styles.score_text } >{ roundStartIndex / questions_per_round + 1} / { questions_per_level / questions_per_round }</Text>
					</View>   
				</View>
				: null 
			}
				{
				levelData.slice(roundStartIndex, roundStartIndex + 3).map((entry, i ) => 
				<View style={ styles.game_row } key ={entry.id} >
				{ 
					answeredCorrectly[i] === false ?

					<TouchableHighlight 
						style=
						{[
							styles.game_box_small,
							[ questionSelected === entry.id ? styles.game_box_selected : styles.game_box_active ] 
						]}
						onPress={ () => 
						{
							setQuestionSelected( entry.id ); 
							setAnswerButtonsDisabled( false ); 
						}}
						underlayColor={ underlay }
						activeOpacity={ 1 }
					>
						<Text style={ styles.game_text }>{ entry.question }</Text>
					</TouchableHighlight>

					: <View style={ styles.game_box_small } />
				}


				{ 
					answeredCorrectly[answerOrder[i]] === false ?

					<TouchableHighlight 
						// key = {`a ${i}`}
						style=
						{[ 
							styles.game_box_small, 
							styles.game_box_active, 
							answerButtonsDisabled ? styles.game_box_disabled : null 
						]}
						onPress={ () => 
						{	////	question id, answer (question) id, answeredCorrectly index
							handleAnswerCheck( questionSelected, levelData[roundStartIndex + answerOrder[i]].id, answerOrder[i] );
						}} 
						underlayColor={ underlay }
						activeOpacity={ 1 }
					>
						<Text style={ styles.game_text }>{  levelData[roundStartIndex + answerOrder[i]].answer }</Text>
					</TouchableHighlight>

					: <View style={ styles.game_box_small } />
				}
				</View>
			)}			
				<StatusBar style="auto" />
			</SafeAreaProvider>
		</View>
	);
}