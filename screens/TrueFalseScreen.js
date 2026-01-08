import { useSQLiteContext } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, ImageBackground, Modal, StyleSheet, Pressable, Text, TouchableHighlight, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';


import formatLevelData from '../common/game/formatLevelData.js';
import selectLevelData from '../common/game/database/selectLevelData.js';
import updateLevelData from '../common/game/database/updateLevelData.js';

import styles from '../styles/styles.js';

const total_question_count = 6;
const questions_per_round = 1



export default function TrueFalseScreen({  }) 
{
	const db = useSQLiteContext();
	const underlay = '#0b3e82ff'

	const [ loadingData, setLoadingData ] = useState(true);
	const [ trueFalseData, setTrueFalseData ] = useState();
	const [ roundStartIndex, setRoundStartIndex ] = useState(0);

	const [ trueFalseScore, setTrueFalseScore ] = useState(0)


	
	
	useEffect( () =>
	{		
		if ( !db || trueFalseData ) return;  

		setLoadingData(true);

		async function loadData() 
		{
			try 
			{
				const unformatted_data = await selectLevelData( db, 'TrueFalseScreen', total_question_count );
				const formatted_data = await formatLevelData(unformatted_data, 'TrueFalseScreen');
				setTrueFalseData(formatted_data)
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
		loadData();
	}, [ db ] );


	
	function checkRoundComplete( correct_answer,  user_answer, question_ID)
	{
		if (correct_answer ==  user_answer )
		{
			console.log('Correct ' + question_ID)
			setTrueFalseScore(prev => prev + 1); 
		}
		console.log(roundStartIndex)
		
		setRoundStartIndex(prev => prev + 1)	
		updateLevelData(db, 'TrueFalseScreen', question_ID);
		
	}





	if (loadingData)    return <ActivityIndicator/>;

	return (
		<View style={ styles.container }>
			<SafeAreaProvider style={[ styles.game_area, {marginBottom: '10%'} ]}>
				{ 
					roundStartIndex < total_question_count ?  
					<View style={ styles.score_row }>

						<View style={ styles.score }>
							<Text style={ styles.score_text } >Score</Text>	
							<Text style={ styles.score_text } >{ trueFalseScore } </Text>	
						</View> 

						<View style={ styles.count }>
							<Text style={ styles.score_text } >Round</Text>
							<Text style={ styles.score_text } >{ roundStartIndex  + 1} / { total_question_count }</Text>
						</View>  
					</View>
					: null 
				}
				{
					trueFalseData.slice(roundStartIndex, roundStartIndex + 1).map((entry, i) => 
					<View style={ styles.game_column } key = {entry.id}>
						

						<View style={[ styles.game_box_large, styles.multiple_choice_question ]}>
							<Text style={ styles.multiple_choice_question_text }>{ entry.question }</Text>
						</View>

						<View style={ styles.game_row }>
							<TouchableHighlight 
								testID={`match_question_box_${i}`}
								style=
								{[
									styles.game_box_small,
									styles.game_box_active,
									{ height: 100 }
								]}
								onPress={ () => 
								{
									checkRoundComplete( entry.correct_answer, 'True', entry.id )
								}}
								underlayColor={ underlay }
								activeOpacity={ 1 }
							>
								<Text style={ styles.game_text }>True</Text>
							</TouchableHighlight>


							<TouchableHighlight 
								testID={`match_question_box_${i}`}
								style=
								{[
									styles.game_box_small,
									styles.game_box_active,
									{ height: 100 }
								]}
								onPress={ () => 
								{
									checkRoundComplete( entry.correct_answer, 'False', entry.id )
								}}
								underlayColor={ underlay }
								activeOpacity={ 1 }
							>
								<Text style={ styles.game_text }>False</Text>
							</TouchableHighlight>
						</View>
					</View>
				)}
				<StatusBar style="auto" />
			</SafeAreaProvider>
		</View>
	);
}