import { useSQLiteContext } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, ScrollView, Dimensions, Text, TouchableHighlight, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import selectGameData from '../common/game/database/selectGameData.js'

import styles from '../styles/styles.js';



const GameScreen = ({ navigation }) =>
{
	const db = useSQLiteContext();
	// const  score = route.params.score ;

    const [ totalScore, setTotalScore ] = useState(0);
	const [ loadingData, setLoadingData ] = useState( true );
	const [ levelData, setLevelData ] = useState();  

	const underlay = '#0b3e82ff'


	/*
	*	Takes GameScreen out of focus when leaving
	*	so that it needs to reload when back button
	*	is hit from one of the other pages.
	*	This allows for changes to be displayed.
	*/
	useEffect( ( ) =>
	{
		const unsubscribe = navigation.addListener('focus', () =>
		{
			if ( !db )
			{
				
				return; 
			}  
			else
			{
				setLoadingData(true);

				async function fetchData() 
				{
					try 
					{
						const game_data = await selectGameData( db );
						setTotalScore( game_data[0].Score )
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
			}
		});
		return unsubscribe;
	}, [ db ] );




	if (loadingData)    return <ActivityIndicator/>;

	return (
		<View style={ styles.container }>
			<SafeAreaProvider style={ styles.game_area }>
				
				<View style={ styles.score }>
							<Text style={ styles.score_text } >Score</Text>	
							<Text style={ styles.score_text } >{ totalScore } </Text>	
				</View> 

					<ScrollView >

				<View style={styles.game_button_start}>
					<TouchableHighlight style={ styles.game_button }
				
									onPress={ ( ) =>  { navigation.navigate( "TrueFalseScreen",  { score: totalScore }); }} 
									underlayColor={ underlay }
									activeOpacity={ 1 }
								>
									<Text style={ styles.game_button_text }> True / False </Text>
					</TouchableHighlight>
				</View>

				<View style={styles.game_button_center}>
					<TouchableHighlight style={ styles.game_button }
						
									onPress={( ) =>  { navigation.navigate( "MultipleChoiceScreen",  { score: totalScore }); }} 
									underlayColor={ underlay }
									activeOpacity={ 1 }
								>
									<Text style={ styles.game_button_text }>MC</Text>
					</TouchableHighlight>
					</View>

				<View style={styles.game_button_end}>
					<TouchableHighlight style={ styles.game_button }
								
									onPress={ ( ) =>  { navigation.navigate( "MatchingScreen",  { score: totalScore }); }} 
									underlayColor={ underlay }
									activeOpacity={ 1 }
								>
									<Text style={ styles.game_button_text }> Matching </Text>
					</TouchableHighlight>
					</View>

					<View style={styles.game_button_center}>
					<TouchableHighlight style={ styles.game_button }
						
									onPress={( ) =>  { navigation.navigate( "MultipleChoiceScreen",  { score: totalScore }); }} 
									underlayColor={ underlay }
									activeOpacity={ 1 }
								>
									<Text style={ styles.game_button_text }>MC</Text>
					</TouchableHighlight>
					</View>

					<View style={styles.game_button_start}>
					<TouchableHighlight style={ styles.game_button }
				
									onPress={ ( ) =>  { navigation.navigate( "MatchingScreen",  { score: totalScore }); }} 
									underlayColor={ underlay }
									activeOpacity={ 1 }
								>
									<Text style={ styles.game_button_text }> Matching </Text>
					</TouchableHighlight>
					</View>

					<View style={styles.game_button_center}>
						<TouchableHighlight style={ styles.game_button }
							
										onPress={( ) =>  { navigation.navigate( "MultipleChoiceScreen",  { score: totalScore }); }} 
										underlayColor={ underlay }
										activeOpacity={ 1 }
									>
										<Text style={ styles.game_button_text }>MC</Text>
						</TouchableHighlight>
					</View>
				<StatusBar style="auto" />
				</ScrollView>
			</SafeAreaProvider>
		</View>
	)
}


export default GameScreen;
