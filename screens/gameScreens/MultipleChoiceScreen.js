import * as Haptics from 'expo-haptics';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Text, TouchableHighlight, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StackActions, useIsFocused } from '@react-navigation/native';

import { calcAnswerOrder, checkAnswer, checkLevelComplete, updateLevel } from '../../common/game/sharedGame.js';
import { EndLevelModal } from './components/levelEnd.js';
import { ProgressAndScore } from './components/score.js';
import updateGameData from '../../common/game/database/updateGameData.js';
import updateLevelData from '../../common/game/database/updateLevelData.js';
import useLoadLevelData from '../../common/game/hook/useLoadLevelData.js';

import styles from '../../styles/styles.js';

const flower = require( '../../assets/flower.png' );
const frog = require( '../../assets/frog_jump_2.png' );

const questions_per_round = 1;
const answers_per_round = 4;
const questions_per_level = 10;

const underlay = '#2f73ccff';


export default function MultipleChoiceScreen({ navigation, route })
{
	const db = useSQLiteContext( );
	const params = route?.params;

	const [ answerOrder, setAnswerOrder ] = useState( calcAnswerOrder( answers_per_round ) );
	const [ currentNumber, setCurrentNumber ] = useState( 1 );
	const [ roundStartIndex, setRoundStartIndex ] = useState( 0 );
	const [ levelComplete, setLevelComplete ] = useState( false );
	const [ levelScore, setLevelScore ] = useState( 0 )

	const [ cheerVisible, setCheerVisible ] = useState( false );

	const [ levelData, loadingData, loadData ] = useLoadLevelData( db, 'MultipleChoiceScreen', params?.levelCategory ?? 1, questions_per_level )

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
			<SafeAreaProvider style={[ styles.game_level_area, { marginBottom: 0 } ]}>
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
					<View
						style={ [styles.game_column, { gap: cheerVisible ? 0 : '5%',  paddingBottom: 0 } ]}
						key={ entry.question_id }
					>
						<View style={{ height: 100 }}>
							<Text style={ styles.multiple_choice_question_text }>{ entry.question }</Text>
						</View>

						{
							answerOrder.map(( index ) =>
							<View key={ answerOrder[index] } style={ styles.multiple_choice_answers }>
								<View style={ styles.game_text_container }>
									<Text style={ styles.game_text }>{ entry.answers[ answerOrder[index] ] }</Text>
								</View>
							
							<TouchableHighlight
								key = { index }
								style={[   styles.game_button_round ]}
								onPress={ ( ) => handleAnswerCheck( entry.answers[0], entry.answers[ answerOrder[index] ], entry.question_id )}
								underlayColor={ underlay }
								activeOpacity={ 1 }
							>
								<Image source={ flower } style={ { height: 70, width: 70} }/>
							</TouchableHighlight>
							</View>
						)}
					</View>
				)}
			</SafeAreaProvider>

			{
				cheerVisible?
				<Image source={ frog } style={ styles.cheer_image }/>
			: null
			}
		</View>
	);
}