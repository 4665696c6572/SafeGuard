import * as Haptics from 'expo-haptics';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Text, TouchableHighlight, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StackActions, useIsFocused } from '@react-navigation/native';

import { EndLevelModal, ProgressAndScore } from './components/modalsAndScore.js';
import { calcAnswerOrder, checkAnswer, checkLevelComplete, updateLevel } from '../../common/game/sharedGame.js';

import updateGameData from '../../common/game/database/updateGameData.js';
import updateLevelData from '../../common/game/database/updateLevelData.js';
import useLoadLevelData from '../../common/game/hook/useLoadLevelData.js';

import styles from '../../styles/styles.js';

const frog = require( '../../assets/frog_jump_2.png' );

const questions_per_round = 1;
const answers_per_round = 4;
const questions_per_level = 10;


export default function MultipleChoiceScreen({ navigation, route })
{
	const db = useSQLiteContext( );
	const underlay = '#0b3e82ff'
	const params = route?.params;

	const [ answerOrder, setAnswerOrder ] = useState( calcAnswerOrder( answers_per_round ) );
	const [ currentNumber, setCurrentNumber ] = useState( 1 );
	const [ roundStartIndex, setRoundStartIndex ] = useState( 0 );
	const [ levelComplete, setLevelComplete ] = useState( false );
	const [ levelScore, setLevelScore ] = useState( 0 )

	const [ cheerVisible, setCheerVisible ] = useState( false );

	const [ levelData, loadingData, loadData ] = useLoadLevelData( db, 'MultipleChoiceScreen', questions_per_level )

	const isFocused = useIsFocused( );

	useEffect(( ) =>
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
			const new_level = updateLevel( params?.loadedLevel, params?.currentLevel );

			updateGameData( 'Game_Data', db, new_level, levelScore );
			setTimeout( function( )
			{
				navigation.dispatch( StackActions.pop( ));
				navigation.navigate( "GameScreen" );
			}, 1200 );
		}
	}), [ levelComplete ]


	function handleAnswerCheck( correct_answer, user_answer, question_id )
	{
		if ( ( roundStartIndex == Math.floor( questions_per_level * 0.4 ) && levelScore >= 2 ))
		{
			setCheerVisible( true );
			setTimeout( function( )
			{
				setCheerVisible( false );
			}, 1000 );
		}

		if ( checkAnswer( correct_answer, user_answer ))
		{
			setAnswerOrder( calcAnswerOrder( answers_per_round ));
			setLevelScore( prev => prev + 1 );
		}
		else Haptics.selectionAsync( );

		setCurrentNumber( prev => prev + 1 );
		setRoundStartIndex( prev => prev + 1 );
		updateLevelData( db, 'MultipleChoiceScreen', question_id );

		if ( checkLevelComplete( roundStartIndex, questions_per_level, questions_per_round ))    setLevelComplete( true );
	}


	if ( loadingData )    return <ActivityIndicator/>;

	return (
		<View style={ styles.container }>
			<SafeAreaProvider style={[ styles.game_level_area, { marginBottom: cheerVisible? 0 : '15%' } ]}>
				<EndLevelModal
					levelComplete={ levelComplete }
					levelScore={ levelScore }
				/>

				<ProgressAndScore
					currentNumber={ currentNumber }
					levelScore={ levelScore }
					questions_per_level={ questions_per_level }
				/>


				{
					levelData.slice( roundStartIndex, roundStartIndex + 1 ).map(( entry, i ) =>
					<View style={ styles.game_column } key={ entry.question_id }>
					

						<View style={[ styles.game_box_large, styles.multiple_choice_question ]}>
							<Text style={ styles.multiple_choice_question_text }>{ entry.question }</Text>
						</View>

						{
							answerOrder.map(( index ) =>
							<TouchableHighlight
								key = { index }
								style={[ styles.game_box_large, styles.game_box_active ]}
								onPress={ ( ) => handleAnswerCheck( entry.answers[0], entry.answers[answerOrder[index]], entry.question_id )}
								underlayColor={ underlay }
								activeOpacity={ 1 }
							>
								<View>
									
									<Text style={ styles.game_text }>{ entry.answers[answerOrder[index]] }</Text>
								</View>
								
							</TouchableHighlight>

						)}
					</View>
				)}
			</SafeAreaProvider>

			{
				cheerVisible ?
				<Image source={ frog } style={ styles.cheer_image }/>
			: null
			}
		</View>
	);
}