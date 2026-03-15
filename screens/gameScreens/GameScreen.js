import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, FlatList, Text, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';


import { GamePath } from './components/river.js';
import { ScoreBox } from './components/score.js';
import {
			checkStreakCurrent, checkBadgeEarned, countStreakLength,
			fillStreakArray, findStreakStart, pulse
		}
from '../../common/game/sharedGame.js';
import { BadgeDialog, Streak } from './components/levelEnd.js';
import useLoadGameData from '../../common/game/hook/useLoadGameData.js';
import updateGameData from '../../common/game/database/updateGameData.js';

import styles from '../../styles/styles.js';

let streak_start;

/*
 *	Game Home
 *	
 */
const GameScreen = ({ navigation }) =>
{
	const db = useSQLiteContext( );

	const [ gameData, loadingData, loadData ] = useLoadGameData( db );
	const [ streakLength, setStreakLength ] = useState( 0 );
	const [ streakVisible, setStreakVisible ] = useState( false );
	const [ badgeVisible, setBadgeVisible ] = useState( true );
	const [ badgeInfo, setBadgeInfo ] = useState( null );

	const pulseAnimation = useRef( new Animated.Value( 1.0 )).current;

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
		if( gameData )
		{
			setStreakLength( countStreakLength( gameData?.streak_history ?? [ ] ));

			/*
			 *	Check if badge has been earned and not yet viewed.
			 *  It updates the db and displays the badge received dialog.
			 *	Also sets badge info so that the badge may be viewed.
			 */
			const result = checkBadgeEarned( gameData?.game_data[0]?.current_level ?? 0 )

			if
			(
				result && ( gameData?.game_data[0]?.last_badge_seen
				< gameData?.game_data[0]?.current_level )
			)
			{
				setBadgeInfo( result );
				setBadgeVisible( true );
				updateGameData( 'Badge', db, gameData?.game_data[0]?.current_level );
			}


			/*
			 *	Check if there is a current streak.
			 *	Today counts as a 1 day streak after play.
			 *	The db is updated and streak info is calculated.
			 *	The streak display is then triggered.
			 */
			if
			(
				checkStreakCurrent( gameData?.streak_history?.[0]?.date_played )
				&& gameData?.streak_history?.[0]?.streak_seen == 0
			)
			{
				updateGameData( 'Streak', db );

				streak_start = findStreakStart( gameData?.streak_history );
				if ( streak_start )
				{
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


	// Handles navigation to game levels
	function handleNavigation( category, loadedLevel, screen )
	{
		navigation.navigate( screen,
		{
			currentLevel: gameData?.game_data[0]?.current_level ?? 1,
			loadedLevel: loadedLevel,
			levelCategory: category
		});
	}


	return (
		<View style={[ styles.game_screen_container ]}>
		{
			loadingData ?
			<ActivityIndicator/>
		:
			<>
			{
				streakVisible ?
				<View style={ styles.streak_container }>
					{
					/*
						*	The FlatList is a modified version ( modified by me ) of code not written by me.
						*	Title: DailyStreakCounter
						*	Author: Ofekino ( GitHub ) / Horizon @Devving_Horizon ( YouTube )
						*	Date published: Jan 18, 2025
						*	Code version: unknown
						*	Availability: https://github.com/Ofekino/DailyStreakCounter / https://www.youtube.com/watch?v=5CFdSkA17Sw
						*
						*	This function produces streak indicators for a period of seven days.
						*	The streak display resets once full.
					*/
					}
					<FlatList
						data={ fillStreakArray( streakLength, streak_start ) }
						horizontal
						keyExtractor={ ( item ) => item.day.toISOString( )}
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
					<ScoreBox
						currentLevel={ gameData?.game_data[0]?.current_level ?? 1 }
						totalScore={ gameData?.game_data[0]?.score ?? 0 }
					/>
					<GamePath
						currentLevel={ gameData?.game_data[0]?.current_level ?? 1 }
						handleNavigation={ handleNavigation }
					/>
					{
						badgeVisible ?
						<BadgeDialog
							badgeInfo={ badgeInfo }
							badgeVisible={ badgeVisible }
							setBadgeVisible={ setBadgeVisible }
						/>
					: null
					}
				</View>
			</>
		}
		</View>
	)
}

export default GameScreen;