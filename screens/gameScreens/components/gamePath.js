import { Image, ScrollView, TouchableHighlight, View } from 'react-native';

import styles from "../../../styles/styles.js";

const lily_pad = require( '../../../assets/lily_pad.png' );
const frog = require( '../../../assets/frog_1.png' );
const grass = require('../../../assets/grass.png' );

const underlay = '#2555e6';


let levels = [ "MultipleChoiceScreen", "MatchingScreen", "MultipleChoiceScreen", "TrueFalseScreen" ];
let position = [ styles.game_button_center, styles.game_button_end, styles.game_button_center, styles.game_button_start ];


export const GamePath = ({ handleNavigation, currentLevel }) =>
{
	return (
		<>
		<Image source={ grass } style={ styles.grass } />
		<ScrollView style={ styles.river }>
		{
			Array.from({ length: 12 }, ( _, i ) =>
			(
				<View key ={ i } style={ position[ i % 4 ] }>
				<TouchableHighlight style={ styles.game_button }
					disabled={ ( i + 1 ) > currentLevel ? true : false }
					onPress={ ( ) => { handleNavigation( levels[ i % 4 ], i + 1 )}}
					underlayColor={ underlay }
					activeOpacity={ 1 }
				>
					<View style={ styles.game_lily_container }>
						{
							currentLevel!= ( i + 1 ) ?
							<Image
								source={ lily_pad }
								style={[ styles.game_lily, styles.game_lily_container, { opacity: ( i + 1 ) > currentLevel? 0.05 : 0.7 } ]}
							/>
						:
							<View style={ styles.game_lily_container }>
								<Image source={ lily_pad } style={[ styles.game_lily, styles.game_lily_container ]}/>
								<Image source={ frog } style={[ styles.game_frog, styles.game_lily_container ]}/>
							</View>
						}
					</View>
				</TouchableHighlight>
				
			</View>
		))}
		</ScrollView>
		</>
	);
}
