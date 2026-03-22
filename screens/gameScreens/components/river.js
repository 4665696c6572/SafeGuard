import { useEffect, useRef } from 'react';
import { Image, ScrollView, TouchableHighlight, Text, View } from 'react-native';

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
const plants = [ plant_1, plant_2, frog_2, plant_3, plant_4 ];

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
	// Scrolls to current section
	const scrollViewRef = useRef( 0 );

	useEffect(() =>
	{
		if ( currentLevel > 3 && currentLevel < 7 ) scrollViewRef.current?.scrollTo({ y: 350 });
		if ( currentLevel > 6 && currentLevel < 10 ) scrollViewRef.current?.scrollTo({ y: 700 });
		if ( currentLevel > 9 ) scrollViewRef.current?.scrollToEnd()
	}, [ currentLevel ])

	return (
		<>
		<Image source={ grass } style={ styles.grass }/>
		<ScrollView style={ styles.river } ref={ scrollViewRef }>
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
	// 1: Water, 2: Storm, 3: Temp, 4: Health
	function calculateCategory( i )
	{
		if ( i < 4 )    return 1;
		else if ( i > 3 && i < 7 )    return 2;
		else if ( i > 6 && i < 10 )    return 3;
		else return 4;
	}

	return (
		<TouchableHighlight style={ styles.game_button }
			activeOpacity={ 1 }
			disabled={ ( i + 1 ) > currentLevel ? true : false }
			// level category, loaded level, screen ( which game type )
			onPress={ ( ) =>
				handleNavigation( calculateCategory( i + 1 ), ( i + 1 ), level_type[ i % 3 ] )
			}
			underlayColor={ underlay }
		>
		{
			currentLevel != ( i + 1 ) ?
			<Image
				source={ selectButtonImage( i + 1, currentLevel ) }
				style=
				{[
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


/*
 *	Image - Frog
 *	Title: Playful Green Frog Stickers Collection
 *	Author: easy-peasy.ai
 *	Availability: https://easy-peasy.ai/ai-image-generator/images/colorful-green-frog-stickers-collection-messaging-app
 *
 *
 *	Image - Grass
 *	Title: Grass Plants Green Free Photo
 *	Author: OpenClipart-Vectors (pixabay.com)
 *	Availability: https://www.needpix.com/photo/90703/grass-plants-green-free-vector-graphics-free-pictures-free-photos-free-images-royalty-free-free-illustrations
 *
 *
 *	Image - Plants ( 1 - 4 )
 *	Title: Marsh reed grass stone in pond set of swamp cattails rock in lake vector bulrush
 *	Author: valadzionak_volha
 *	Availability: https://www.freepik.com/free-vector/marsh-reed-grass-stone-pond-set-swamp-cattails-rock-lake-vector-bulrush_26984545.htm
 *
 *
 *	Image - Trophy / Empty Trophy
 *	Title: Trophy logo circle
 *	Author: juicy_fish
 *	Availability: https://www.freepik.com/free-vector/trophy-logo-circle_418186784.htm
 */