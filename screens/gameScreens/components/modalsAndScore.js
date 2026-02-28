import { Dimensions, Image, Modal, Text, View } from 'react-native';
import * as Progress from 'react-native-progress';

import styles from '../../../styles/styles';

const frog = require( '../../../assets/frog_jump_1.png' );

const screen_width = Dimensions.get('screen').width; 


export const EndLevelModal = ({ levelComplete, levelScore }) =>
{
	return (
	<Modal animationType='slide' color='#d1dce4ff' visible={ levelComplete } >
		<View style={ styles.cheer_container }>
			<Text style={ styles.score_text } >Final score</Text>
			<Text style={ styles.score_text } >{ levelScore }</Text>
			<Image source={ frog } style={ styles.cheer_image }/>
		</View>
	</Modal>
	)
}


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
						progress={( ( currentNumber - 1) / questions_per_level )}
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