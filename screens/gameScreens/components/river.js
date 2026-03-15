import { Image, ScrollView, TouchableHighlight, View } from 'react-native';

import { selectButtonImage } from '../../../common/game/sharedGame.js';
import styles from '../../../styles/styles.js';

let level_type = [ "MultipleChoiceScreen", "MatchingScreen", "TrueFalseScreen" ];

// Trophy items
const trophy = require ( '../../../assets/trophy.png' );
const empty_trophy = require ( '../../../assets/empty_trophy.png' );

// River decorations
const frog_2 = require( '../../../assets/frog_2.png' );
const grass = require( '../../../assets/grass.png' );
const plant_1 = require( '../../../assets/plant_1.png' );
const plant_2 = require( '../../../assets/plant_2.png' );
const plant_3 = require( '../../../assets/plant_3.png' );
const plant_4 = require( '../../../assets/plant_4.png' );
const plants = [ plant_1, plant_2, frog_2, plant_3, plant_4];

const underlay = '#2555e6';


// Decorative items in the game screen's river
export function Decoration ({ i })
{
	return (
		<Image source={ plants[ i % 5 ] } style={{ height: 100 , width: 100 }}/>
	);
}


/*
 *	Populates the river ( game home ) with appropriately spaced level buttons.
 *	Also handles the end game trophy.
 */
export const GamePath = ({ currentLevel, handleNavigation }) =>
{
	return (
		<>
		<Image source={ grass } style={ styles.grass }/>
		<ScrollView style={ styles.river }>
			<View>
			{
				Array.from({ length: 12 }, ( _, i ) =>
				(
					<View key={ i + 1 } style={ styles.river_container }>
						<View style={ styles.river_column }>
						{
							Math.abs(( i % 4 ) - 1 ) == 2 ?
							<LevelButton
								currentLevel={ currentLevel }
								i={ i }
								handleNavigation={ handleNavigation }
							/>
						: null
						}
						{ Math.abs(( i % 4 ) - 1 ) == 0 ? <Decoration i={ i }/> : null }
						</View>

						<View style={ styles.river_column }>
						{
							Math.abs(( i % 4 ) - 1 ) == 1 ?
							<LevelButton
								currentLevel={ currentLevel }
								i={ i }
								handleNavigation={ handleNavigation }
							/>
						: null
						}
						</View>

						<View style={ styles.river_column }>
						{
							Math.abs(( i % 4 ) - 1 ) == 0 ?
							<LevelButton
								currentLevel={ currentLevel }
								i={ i }
								handleNavigation={ handleNavigation }
							/>
							: null
						}
						{
							Math.abs(( i % 4 ) - 1 ) == 2 ?
							<Decoration i={ i }/>
							: null
						}
						</View>
					</View>
				))}
			</View>

			<View style={{ alignItems: 'center' }}>
			{
				currentLevel == 13 ?
				<Image
					source={ trophy }
					style={{ height: 150, width: 150 }}
				/>
			:
				<Image
					source={ empty_trophy }
					style={{ height: 150, opacity: 0.2, width: 150 }}
				/>
			}
			</View>
		</ScrollView>
		</>
	);
}


/*
 *	Sets up the decorative level selection buttons
 *	As well as level navigation
 */
export function LevelButton ({ currentLevel, i, handleNavigation })
{
	return (
		<TouchableHighlight style={ styles.game_button }
			activeOpacity={ 1 }
			disabled={ ( i + 1 ) > currentLevel ? true : false }
			// category number, level, screen
			onPress={ ( ) => 
				handleNavigation( ( i + 1 ), ( i % 4 + 1 ), level_type[ i % 3 ] )
			}
			underlayColor={ underlay }
		>
		{
			currentLevel != ( i + 1 ) ?
			<Image
				source={ selectButtonImage( i + 1, currentLevel ) }
				style={[
							styles.game_lily, styles.game_lily_container,
							{ opacity: ( i + 1 ) > currentLevel ? 0.2 : 0.7 }
						]}
			/>
		:
			<View style={ styles.game_lily_container }>
				<Image
					source={ selectButtonImage( i + 1, currentLevel )?.[0] }
					style={[ styles.game_lily, styles.game_lily_container ]}
				/>
				<Image
					source={ selectButtonImage( i + 1, currentLevel )?.[1] }
					style={[ styles.game_frog, styles.game_lily_container ]}
				/>
			</View>
		}
		</TouchableHighlight>
	);
}