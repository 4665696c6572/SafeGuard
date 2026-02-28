import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, FlatList, Text, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import { GamePath } from './components/gamePath.js'
import { checkStreakCurrent, countStreakLength, fillStreakArray, findStreakStart, pulse } from '../../common/game/sharedGame.js';
import Streak from '../../common/game/streak.js';
import updateGameData from '../../common/game/database/updateGameData.js';
import useLoadGameData from '../../common/game/hook/useLoadGameData.js';

import styles from '../../styles/styles.js';

let streak_start;
const GameScreen = ({ navigation, route }) =>
{
	const db = useSQLiteContext();

	const [ gameData, loadingData, loadData ] = useLoadGameData( db );
	const [ streakLength, setStreakLength ] = useState( 0 );
	const [ streakVisible, setStreakVisible ] = useState( false );

	const pulseAnimation = useRef( new Animated.Value( 1.0 )).current;

	const isFocused = useIsFocused();


	useEffect(() =>
	{
		if ( isFocused )
		{
			loadData( );
		}
	}, [ isFocused ]);


	useEffect(() =>
	{
		if( gameData )
		{
			setStreakLength( countStreakLength( gameData?.streak_history ?? [ ] ));

			if ( checkStreakCurrent( gameData?.streak_history?.[0]?.date_played ) && gameData?.streak_history?.[0]?.streak_seen == 0 )
			{
				updateGameData( 'Streak', db );
				streak_start = findStreakStart( gameData?.streak_history );

				if ( streak_start )
				{	
					// fillStreakArray( streakLength, streak_start )
					pulse( pulseAnimation )
					setStreakVisible( true );
					setTimeout( function( )
					{
						setStreakVisible( false );
					}, 1500 );
				}
			}
		}
	}, [ gameData ]);


	function handleNavigation( screen, loadedLevel )
	{
		navigation.navigate( screen, { currentLevel: gameData?.game_data[0]?.current_level ?? 1, loadedLevel: loadedLevel });
	}


	if ( loadingData )    return <ActivityIndicator/>;

	return (
		<View style={ styles.game_screen_container }>
			{ 	
				streakVisible ?
				<View style={ styles.streak_container }>
					{/*
					* The FlatList is a modified version ( modified by me ) of code not written by me.
					* Title: DailyStreakCounter
					* Author: Ofekino ( GitHub ) / Horizon @Devving_Horizon ( YouTube )
					* Date published: Jan 18, 2025
					* Code version: unknown
					* Availability: https://github.com/Ofekino/DailyStreakCounter / https://www.youtube.com/watch?v=5CFdSkA17Sw
					*
					* This function produces streak indicators for a period of seven days.
					* The streak display resets once full.
					*/}
					<FlatList
						data={ fillStreakArray( streakLength, streak_start )  }
						horizontal
						keyExtractor={ (item) => item.day.toISOString( )}
						contentContainerStyle={{ flexDirection: "row" }}
						renderItem={({ item, index }) =>
						(
							<Streak
								index={ index }
								item={ item }
								pulseAnimation={ pulseAnimation }
								streakLength={ streakLength }
							/>
						)}
					/>
					{
						( streakLength % 7 % 7 == 0 && streakLength != 0 ) ?
						<Text style={ styles.streak_text }>{ streakLength } days in a row!</Text>
					:
						<Text style={ styles.streak_text }>{ streakLength } day streak!</Text>
					}
				</View>
			: null
			}


			<View style={[ styles.game_area, { marginTop: 0 }]}>
				<View style={[ styles.data_section]}>
							<Text style={[ styles.score_text, styles.score_text_green ]} >Score</Text>
							<Text style={[ styles.score_text, styles.score_text_green ]} >{ gameData?.game_data[0]?.score ?? 0 } </Text>


				</View>
				<GamePath
					currentLevel={ gameData?.game_data[0]?.current_level ?? 1 }
					handleNavigation={ handleNavigation }
					totalScore={ gameData?.game_data[0]?.score ?? 0 }
				/>
			</View>
		</View>
	)
}

export default GameScreen;