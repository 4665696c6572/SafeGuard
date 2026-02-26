import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import { countStreak } from '../../common/game/sharedGame.js';
import { GamePath } from './components/gamePath.js'
import useLoadGameData from '../../common/game/hook/useLoadGameData.js';

import styles from '../../styles/styles.js';

const GameScreen = ({ navigation }) =>
{
	const db = useSQLiteContext();
	const [ gameData, loadingData, loadData ] = useLoadGameData( db );

	const [ currentLevel, setCurrentLevel ] = useState( 1 );
	const [ streakLength, setStreakLength ] = useState( 0 );
	const [ totalScore, setTotalScore ] = useState( 0 );

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
			setStreakLength( countStreak( gameData?.streak_history ?? [ ] ));
			setCurrentLevel( gameData?.game_data[0]?.current_level ?? 1 );
			setTotalScore( gameData?.game_data[0]?.score ?? 0 );
		}
	}, [ gameData ]);


	function handleNavigation( screen, loadedLevel )
	{
		navigation.navigate( screen, { currentLevel: currentLevel, loadedLevel: loadedLevel	});
	}


	if (loadingData)    return <ActivityIndicator/>;

	return (
		<View style={ styles.game_area }>
			<View style={[ styles.data_section]}>
				<Text style={[ styles.score_text, {	color: 'rgb(144, 226, 152)' }]} >Score</Text>
				<Text style={[ styles.score_text, {	color: 'rgb(144, 226, 152)' }]} >{ totalScore } </Text>
			</View>

			<GamePath
				currentLevel={ currentLevel }
				handleNavigation={ handleNavigation }
				totalScore={ totalScore }
			/>
		</View>
	)
}

export default GameScreen;