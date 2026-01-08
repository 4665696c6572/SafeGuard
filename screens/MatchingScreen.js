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

const answers_per_round = 3;
const questions_per_round = 3; 
const total_question_count = 12

export default function MatchingScreen({  }) 
{
	const db = useSQLiteContext();
	const underlay = '#0b3e82ff'

	const [ answerButtonsDisabled, setAnswerButtonsDisabled ] = useState( true );
	const [ answeredCorrectly, setAnsweredCorrectly ] = useState( [false, false, false] );
	const [ loadingData, setLoadingData ] = useState( true );
	const [ matchData, setMatchData ] = useState();
	const [ questionSelected, setQuestionSelected ] = useState( null );
	const [ answerOrder, setAnswerOrder ] = useState( calcAnswerOrder( questions_per_round ) );
	const [ roundStartIndex, setRoundStartIndex ] = useState( 0 );
	const [ matchScore, setMatchScore ] = useState( 0 )


	useEffect( () =>
	{		
		if ( !db || matchData ) return;  
			setLoadingData(true);	

			async function fetchData() 
			{
				try 
				{
					const unformatted_data = await selectLevelData( db, 'MatchingScreen', total_question_count );
					const formatted_data = await formatLevelData(unformatted_data, 'MatchingScreen');
					setMatchData(formatted_data)
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
			fetchData();
		
	}, [ db ] );


		useEffect( () =>
	{
		
		if(checkRoundComplete(answeredCorrectly))
		{	
			setAnsweredCorrectly( [false, false, false] );
			setAnswerOrder( calcAnswerOrder( questions_per_round ));
			setRoundStartIndex( prev => prev + questions_per_round );			
		}
	}, [ answeredCorrectly ] );


	function checkAnswer( question_ID, answer_ID, question_index  )
	{ 
		if ( answer_ID != question_ID )    return;
		else 
		{
	
			const correct = answeredCorrectly.map((curr, i) => 
			{
				if ( i == question_index )    return true;
				else    return curr;
			});	
		
			
			setMatchScore(prev => prev + 1)
			setAnswerButtonsDisabled(true);
			setAnsweredCorrectly(correct);			
			updateLevelData ( db, 'MatchingScreen', question_ID );
		}
	}


	function checkRoundComplete()
	{		
		if 
		( 
			answeredCorrectly[0] == true && 
			answeredCorrectly[1] == true &&
			answeredCorrectly[2] == true
		)
		{  
			console.log(roundStartIndex, total_question_count)
			console.log('screen cleared'); 
			return true;
		}
		
		else return false;
	}





	

	if (loadingData)    return <ActivityIndicator/>;

	return (
		<View style={ styles.container }>
			<SafeAreaProvider style={[ styles.game_area, {marginBottom: '25%'} ]}>
			{ 
				 roundStartIndex < total_question_count ?  
				<View style={ styles.score_row }>

					<View style={ styles.score }>
						<Text style={ styles.score_text } >Score</Text>	
						<Text style={ styles.score_text } >{ matchScore }</Text>	
					</View> 

					<View style={ styles.count }>
						<Text style={ styles.score_text } >Round</Text>
						<Text style={ styles.score_text } >{ roundStartIndex / questions_per_round + 1} / { total_question_count / questions_per_round }</Text>
					</View>   
				</View>
				: null 
			}
				{
				matchData.slice(roundStartIndex, roundStartIndex + 3).map((entry, i ) => 
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
							checkAnswer( questionSelected, matchData[roundStartIndex + answerOrder[i]].id, answerOrder[i] );
						}} 
						underlayColor={ underlay }
						activeOpacity={ 1 }
					>
						<Text style={ styles.game_text }>{  matchData[roundStartIndex + answerOrder[i]].answer }</Text>
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