import { Dimensions,Image, Text, View } from 'react-native';
import * as Progress from 'react-native-progress';
import styles from '../../../styles/styles.js';

const health = require( '../../../assets/badge_health.png' );
const temp = require( '../../../assets/badge_temp.png' );
const water = require( '../../../assets/badge_water.png' );
const storm = require( '../../../assets/badge_storm.png' );

const screen_width = Dimensions.get( 'screen' ).width;


/*
 *	Displays player score
 *	Also displays badges that the player has earned.
 *	Badges are only visible once earned.
*/
export function ScoreBox ({ currentLevel, totalScore })
{
	return (
		<View style={ styles.badge_container }>
		{
			currentLevel >= 4 ?
			<View style={ styles.badge_row_upper }>
				<Image
					source={ water }
					style={ styles.badge_small }
				/>
				<Image
					source={ storm }
					style={[ styles.badge_small , { opacity: currentLevel >= 7 ? 1 : 0 } ]}
				/>
			</View>
		: null
		}


		{
			currentLevel < 10 ?
			<View style={{ paddingTop: 25 }}>
				<Text style={[ styles.score_text, styles.score_text_green ]} >
					Score
				</Text>
				<Text style={[ styles.score_text, styles.score_text_green ]} >
					{ totalScore }
				</Text>
			</View>
		: null
		}


		{
			currentLevel >= 10 ?
			<View style={[ styles.badge_row_lower ]}>

				<View>
					<Image source={ temp } style={ styles.badge_small }/>
				</View>

				<View style={{ paddingTop: 25 }}>
						<Text style={[ styles.score_text, styles.score_text_green ]} >
							Score
						</Text>
						<Text style={[ styles.score_text, styles.score_text_green ]} >
							{ totalScore }
						</Text>
				</View>

				<View>
					<Image
						source={ health }
						style={[ styles.badge_small, { opacity: currentLevel >= 13 ? 1 : 0 } ]}
					/>
				</View>
			</View>
		: null
		}
		</View>
	);
}


/*
 *	Displays a progress bar and the level's score
 *	Used by game levels
 */
export const ProgressAndScore = ({ currentNumber, levelScore, questions_per_level }) =>
{
	return (
		<View>
			<View style={ styles.progress_bar_container }>
				<View style={ styles.progress_bar }>
					<Progress.Bar
						borderColor='#DBE2E9'
						borderRadius={ 5 }
						color='#66a1efff'
						height= '20'
						progress={( ( currentNumber - 1 ) / questions_per_level )}
						unfilledColor='#bacfeaff'
						width={ screen_width * 0.6 }
					/>
				</View>

				<Text style={ styles.count_text }>
					{ Math.min( currentNumber, questions_per_level )} / { questions_per_level }
				</Text>
		</View>

		<View>
			<Text style={ styles.score_text } >Score</Text>
			<Text style={ styles.score_text } >{ levelScore }</Text>
		</View>
	</View>
	)
}