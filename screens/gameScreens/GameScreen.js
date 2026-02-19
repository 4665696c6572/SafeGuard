import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableHighlight, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import useLoadGameData from '../../common/game/hook/useLoadGameData.js';

import styles from '../../styles/styles.js';

const GameScreen = ({ navigation }) =>
{
	const db = useSQLiteContext();
	const [ levelData, setLevelData ] = useState();
	const underlay = '#0b3e82ff';

    const [ totalScore, setTotalScore, loadingData, loadData ] = useLoadGameData( db );

	const isFocused = useIsFocused();

	useEffect(() => 
		{
			if ( isFocused ) 
			{
				loadData( );
			}
	}, [ isFocused ]);


	if (loadingData)    return <ActivityIndicator/>;

	return (
		<View style={ styles.container }>
			<View style={ styles.game_area }>
				
				<View>
							<Text style={ styles.score_text } >Score</Text>	
							<Text style={ styles.score_text } >{ totalScore } </Text>	
				</View>

				<ScrollView>
					<View style={styles.game_button_start}>
						<TouchableHighlight style={ styles.game_button }
							onPress={ ( ) =>  { navigation.navigate("TrueFalseScreen",  { score: totalScore }); }}
							underlayColor={ underlay }
							activeOpacity={ 1 }
						>
							<Text style={ styles.game_button_text }> True / False </Text>
						</TouchableHighlight>
					</View>

					<View style={styles.game_button_center}>
						<TouchableHighlight style={ styles.game_button }
							onPress={( ) =>  { navigation.navigate("MultipleChoiceScreen",  { score: totalScore }); }}
							underlayColor={ underlay }
							activeOpacity={ 1 }
						>
							<Text style={ styles.game_button_text }>MC</Text>
						</TouchableHighlight>
					</View>

					<View style={styles.game_button_end}>
						<TouchableHighlight style={ styles.game_button }
							onPress={ ( ) =>  { navigation.navigate("MatchingScreen", { score: totalScore }); }}
							underlayColor={ underlay }
							activeOpacity={ 1 }
						>
							<Text style={ styles.game_button_text }> Matching </Text>
						</TouchableHighlight>
					</View>

					<View style={styles.game_button_center}>
					<TouchableHighlight style={ styles.game_button }
						onPress={( ) =>  { navigation.navigate("MultipleChoiceScreen",  { score: totalScore }); }}
						underlayColor={ underlay }
						activeOpacity={ 1 }
					>
						<Text style={ styles.game_button_text }>MC</Text>
					</TouchableHighlight>
					</View>

					<View style={styles.game_button_start}>
					<TouchableHighlight style={ styles.game_button }
						onPress={ ( ) =>  { navigation.navigate("MatchingScreen",  { score: totalScore }); }}
						underlayColor={ underlay }
						activeOpacity={ 1 }
					>
						<Text style={ styles.game_button_text }> Matching </Text>
					</TouchableHighlight>
					</View>

					<View style={styles.game_button_center}>
						<TouchableHighlight style={ styles.game_button }
							onPress={( ) =>  { navigation.navigate("MultipleChoiceScreen",  { score: totalScore }); }}
							underlayColor={ underlay }
							activeOpacity={ 1 }
						>
							<Text style={ styles.game_button_text }>MC</Text>
						</TouchableHighlight>
					</View>
				</ScrollView>
			</View>
		</View>
	)
}

export default GameScreen;