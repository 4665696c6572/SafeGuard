import * as Haptics from 'expo-haptics';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Text, TouchableHighlight, View } from 'react-native';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StackActions, useIsFocused } from '@react-navigation/native';

import {
			calcAnswerOrder, checkAnswer, checkLevelComplete, checkRoundComplete,
			setResultArray, updateLevel, updateResultArray
		} from '../../common/game/sharedGame.js';
import { EndLevelModal } from './components/levelEnd.js';
import { ProgressAndScore } from './components/score.js';
import updateGameData from '../../common/game/database/updateGameData.js';
import updateLevelData from '../../common/game/database/updateLevelData.js';
import useLoadLevelData from '../../common/game/hook/useLoadLevelData.js';

import styles from '../../styles/styles.js';

const frog = require( '../../assets/frog_jump_2.png' );

const questions_per_round = 3;
const questions_per_level = 12;

const underlay = '#0b3e82ff'	

export default function MatchingScreen({ navigation, route })
{
	const db = useSQLiteContext( );
	const params = route?.params;

	const [ answerButtonsDisabled, setAnswerButtonsDisabled ] = useState( true );
	const [ answeredCorrectly, setAnsweredCorrectly ] = useState( setResultArray( questions_per_round ));
	const [ answerOrder, setAnswerOrder ] = useState( calcAnswerOrder( questions_per_round ));
	const [ currentNumber, setCurrentNumber ] = useState( 1 );
	const [ levelComplete, setLevelComplete ] = useState( false );
	const [ levelScore, setLevelScore ] = useState( 0 )
	const [ questionSelected, setQuestionSelected ] = useState( null );
	const [ roundStartIndex, setRoundStartIndex ] = useState( 0 );

	const [ cheerVisible, setCheerVisible ] = useState( false );

	const [ levelData, loadingData, loadData ] = useLoadLevelData( db, 'MatchingScreen', params?.level_category ?? 1, questions_per_level );


	const isFocused = useIsFocused( );


	useEffect(( ) =>
		{
			if ( isFocused )
			{
				loadData( );
			}
	}, [ isFocused ]);


	useEffect( ( ) =>
	{
		if ( checkRoundComplete( answeredCorrectly, questions_per_round ))
		{
			setAnsweredCorrectly( setResultArray( questions_per_round ));
			setAnswerOrder( calcAnswerOrder( questions_per_round ));
			setRoundStartIndex( prev => prev + questions_per_round );

			if ( checkLevelComplete( roundStartIndex, questions_per_level, questions_per_round ))    setLevelComplete( true );
		}
	}, [ answeredCorrectly ] );


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


	function handleAnswerCheck( question_id, answer_id, question_row )
	{
		if ( checkAnswer( question_id, answer_id ))
		{
			setAnsweredCorrectly( updateResultArray( answeredCorrectly, question_row ));
			if
			((
				roundStartIndex == ( Math.floor( questions_per_level * 0.4 ) - 1)
				&& levelScore >= 3 && currentNumber == 4 
			))
			{
				setCheerVisible( true );
				setTimeout( function( )
				{
					setCheerVisible( false );
				}, 1000 );
			}
		}
		else Haptics.selectionAsync( );
		if ( answer_id != question_id )    return;

		setAnswerButtonsDisabled( true );
		setCurrentNumber( prev => prev + 1 );
		setLevelScore( prev => prev + 1 );
		updateLevelData ( db, 'MatchingScreen', question_id );
	}


	if ( loadingData )    return <ActivityIndicator/>;

	return (
		<View style={ styles.container }>
			<View style={[ styles.game_level_area, { marginBottom: cheerVisible? 0 : '15%' } ]}>
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
				levelData.slice( roundStartIndex, roundStartIndex + 3 ).map(( entry, i ) =>
				<View style={ styles.game_row } key ={ entry.question_id } >
				{
					answeredCorrectly[i] === false ?

					<TouchableHighlight
						style=
						{[
							styles.game_box_small,
							[ questionSelected === entry.question_id ? styles.game_box_selected : styles.game_box_active ]
						]}
						onPress={ ( ) =>
						{
							setQuestionSelected( entry.question_id );
							setAnswerButtonsDisabled( false );
						}}
						underlayColor={ underlay }
						activeOpacity={ 1 }
					>
						<Text style={[ styles.game_button_text, {paddingLeft: 10, paddingRight: 10 } ]}>{ entry.question }</Text>
					</TouchableHighlight>

					: <View style={ styles.game_box_small }/>
				}


				{
					answeredCorrectly[answerOrder[i]] === false ?

					<TouchableHighlight
						style=
						{[
							styles.game_box_small,
							styles.game_box_active,
							answerButtonsDisabled ? styles.game_box_disabled : null
						]}
						onPress={ ( ) =>
						{	// question id, answer ( question ) id, answeredCorrectly index
							handleAnswerCheck( questionSelected, levelData[roundStartIndex + answerOrder[i]].question_id, answerOrder[i] );
						}}
						underlayColor={ underlay }
						activeOpacity={ 1 }
					>
						<Text style={ styles.game_button_text }>{ levelData[roundStartIndex + answerOrder[i]].answer }</Text>
					</TouchableHighlight>

					: <View style={ styles.game_box_small }/>
				}
				</View>
			)}
			</View>

			{
				cheerVisible ?
				<Image source={ frog } style={ styles.cheer_image }/>
			: null
			}
		</View>
	);
}