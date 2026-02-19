import * as Haptics from 'expo-haptics';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, Modal, Text, TouchableHighlight, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {  StackActions, useIsFocused } from '@react-navigation/native';

import { calcAnswerOrder, checkAnswer,  checkLevelComplete } from '../../common/game/sharedGame.js';

import updateGameData from '../../common/game/database/updateGameData.js';
import updateLevelData from '../../common/game/database/updateLevelData.js';
import useLoadLevelData from '../../common/game/hook/useLoadLevelData.js';

import styles from '../../styles/styles.js';


const questions_per_round = 1;
const answers_per_round = 4;
const questions_per_level = 10;

const screen_width = Dimensions.get('screen').width;
const imgUri = require( '../../assets/frog.png' );

export default function MultipleChoiceScreen({ navigation, route }) 
{
	const db = useSQLiteContext();
	const underlay = '#0b3e82ff'

	const [ answerOrder, setAnswerOrder ] = useState( calcAnswerOrder( answers_per_round ) );
	const [ currentNumber, setCurrentNumber ] = useState( 1 );
	const [ roundStartIndex, setRoundStartIndex ] = useState( 0 );
	const [ levelComplete, setLevelComplete ] = useState( false );
	const [ levelScore, setLevelScore ] = useState( 0 )

	const [ cheerVisible, setCheerVisible ] = useState( false );

	const [ levelData, loadingData, loadData ] = useLoadLevelData( db, 'MultipleChoiceScreen', questions_per_level )

	const isFocused = useIsFocused();

	useEffect(() =>
		{
			if ( isFocused )
			{
				loadData( );
			}
	}, [ isFocused ]);

	useEffect(( ) =>
	{
		if ( levelComplete )
		{
			const new_score = route?.params?.score + levelScore;

			updateGameData( new_score, db );
			setTimeout(function() 
			{
				navigation.dispatch( StackActions.pop( ));
				navigation.navigate( "GameScreen", { score: new_score });
			}, 1200) 
		}
	}), [ levelComplete ]


	function handleAnswerCheck( correct_answer,  user_answer, question_id )
	{
		if ( checkAnswer( correct_answer,  user_answer ))
		{
			setAnswerOrder( calcAnswerOrder( answers_per_round ));
			setLevelScore( prev => prev + 1 );			
		}
		else Haptics.selectionAsync();
		setCurrentNumber( prev => prev + 1 );
		setRoundStartIndex( prev => prev + 1 );
		updateLevelData( db, 'TrueFalseScreen', question_id );
		if ( ( roundStartIndex == questions_per_level * 0.4 ) )
		{
			setCheerVisible( true );
			setTimeout( function( )
			{
				setCheerVisible( false )
			}, 1000 );
		}
		if ( checkLevelComplete( roundStartIndex, questions_per_level, questions_per_round ))    setLevelComplete( true );	
	}


	if (loadingData)    return <ActivityIndicator/>;

	return (
		<View style={ styles.container }>
			<SafeAreaProvider style={[ styles.game_area, {marginBottom: '15%'} ]}>
				<Modal animationType='fade' color='#d1dce4ff' visible={ levelComplete }>
					<View style={ styles.game_area }>

						<View>
							<Text style={ styles.score_text } >Final score</Text>	
							<Text style={ styles.score_text } >{ levelScore }</Text>	
						</View> 

						<Image source={ imgUri } style={{ height: '50%', width: '100%' }}/>
					</View>
				</Modal>

				{/*  Cheer Modal */}
				<Modal animationType='fade' color='#d1dce4ff' visible={ cheerVisible }>
					<Image source={ imgUri } style={{ height: '50%', width: '100%' }}/>					
				</Modal>

				{/*  Progress and Score  */}
				<View style={ styles.progress_bar_container }>
					<View style={ styles.progress_bar }>
						<Progress.Bar
							progress={( currentNumber / questions_per_level )}
							height= '20'
							width={screen_width * 0.6}
							color='#66a1efff'
							borderRadius={5}
							unfilledColor='#bacfeaff'
							borderColor='#DBE2E9'
						/>
					</View>

						<Text style={ styles.count_text }>
							{ Math.min( currentNumber, questions_per_level )} / { questions_per_level }
						</Text>
				</View>

				<View>
					<Text style={ styles.score_text } >Score</Text>	
					<Text style={ styles.score_text } >{ levelScore }</Text>	
				</View> 

				{
					levelData.slice(roundStartIndex, roundStartIndex + 1).map((entry, i) =>
					<View style={ styles.game_column } key={entry.question_id}>
						

						<View style={[ styles.game_box_large, styles.multiple_choice_question ]}>
							<Text style={ styles.multiple_choice_question_text }>{ entry.question }</Text>
						</View>

						{	
							answerOrder.map((index) =>
							<TouchableHighlight
								key = {index}
								style={[ styles.game_box_large, styles.game_box_active ]}
								onPress={ () => handleAnswerCheck( entry.answers[0], entry.answers[answerOrder[index]], entry.ID) }
								underlayColor={ underlay }
								activeOpacity={ 1 }
							>
								<Text style={ styles.game_text }>{ entry.answers[answerOrder[index]] }</Text>
							</TouchableHighlight>

						)}
					</View>
				)}
			</SafeAreaProvider>
		</View>
	);
}