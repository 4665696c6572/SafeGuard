import * as Haptics from 'expo-haptics';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Text, TouchableHighlight, View } from 'react-native';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StackActions, useIsFocused } from '@react-navigation/native';

import { checkAnswer, checkLevelComplete, updateLevel } from '../../common/game/sharedGame.js';
import { EndLevelModal } from './components/levelEnd.js';
import { ProgressAndScore } from './components/score.js';
import updateGameData from '../../common/game/database/updateGameData.js';
import updateLevelData from '../../common/game/database/updateLevelData.js';
import useLoadLevelData from '../../common/game/hook/useLoadLevelData.js';

import styles from '../../styles/styles.js';

const frog = require( '../../assets/frog_jump_2.png' );

const questions_per_level = 6;
const questions_per_round = 1;

const underlay = '#0b3e82ff';


export default function TrueFalseScreen({ navigation, route })
{
	const db = useSQLiteContext( );

	const params = route?.params;

	const [ currentNumber, setCurrentNumber ] = useState( 1 );
	const [ levelComplete, setLevelComplete ] = useState( false );
	const [ levelScore, setLevelScore ] = useState( 0 );
	const [ roundStartIndex, setRoundStartIndex ] = useState( 0 );

	const [ cheerVisible, setCheerVisible ] = useState( false );

	const [ levelData, loadingData, loadData ] = useLoadLevelData( db, 'TrueFalseScreen', params?.level_category ?? 1, questions_per_level );


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
		if(( roundStartIndex == Math.floor( questions_per_level * 0.4 ) && levelScore >= 2 ))
		{
			setCheerVisible( true );
			setTimeout( function( )
			{
				setCheerVisible( false );
			}, 1000 );
		}

		if ( checkAnswer( correct_answer, user_answer ))
		{
			console.log( 'Correct' );
			setLevelScore( prev => prev + 1 );
		}
		else Haptics.selectionAsync( );

		if ( checkLevelComplete( roundStartIndex, questions_per_level, questions_per_round ))
		{
			setLevelComplete( true );
		}

		setCurrentNumber( prev => prev + 1 );
		setRoundStartIndex( prev => prev + 1 );
		updateLevelData( db, 'TrueFalseScreen', question_id );
	}


	if ( loadingData )    return <ActivityIndicator/>;


	return (
		<View style={ styles.container }>
			<View style={[ styles.game_level_area,
									{
										marginBottom: cheerVisible? 0 : '30%',
										justifyContent: 'flex-end'
									}]}>
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
					<View style={ [styles.game_column, { justifyContent: 'space-between' }]} key={ entry.question_id }>
						<View style={[
										styles.game_box_large,
										styles.multiple_choice_question,
										{ height: cheerVisible? '73%' : '70%'}
									]}>
							<Text style={ styles.multiple_choice_question_text }>{ entry.question }</Text>
						</View>

						<View style={[ styles.game_row, { alignItems: 'flex-end' }]}>
							<TouchableHighlight
								style=
								{[
									styles.game_box_small,
									styles.game_box_active,
									{
										height: cheerVisible? '80%' : '60%'
									}
								]}
								onPress={ ( ) =>
								{
									handleAnswerCheck( entry.answer, 'True', entry.question_id );
								}}
								underlayColor={ underlay }
								activeOpacity={ 1 }
							>
								<Text style={ styles.game_button_text }>True</Text>
							</TouchableHighlight>


							<TouchableHighlight
								style=
								{[
									styles.game_box_small,
									styles.game_box_active,
									{
										height: cheerVisible? '80%' : '60%'
									}
								]}
								onPress={ ( ) =>
								{
									handleAnswerCheck( entry.answer, 'False', entry.question_id );
								}}
								underlayColor={ underlay }
								activeOpacity={ 1 }
							>
								<Text style={ styles.game_button_text }>False</Text>
							</TouchableHighlight>
						</View>
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