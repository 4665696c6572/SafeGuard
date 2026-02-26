import { Dimensions, Image, Modal, Text, View } from 'react-native';
import * as Progress from 'react-native-progress';

import styles from '../../../styles/styles';

const imgUri = require( '../../../assets/frog.png' );

const screen_width = Dimensions.get('screen').width;


export const EndLevelModal = ( { levelComplete, levelScore }) =>
{
	return (
	<Modal animationType='slide' color='#d1dce4ff' visible={ levelComplete } >
		<View style={ styles.game_level_area }>

			<View>
				<Text style={ styles.score_text } >Final score</Text>
				<Text style={ styles.score_text } >{ levelScore }</Text>
			</View>
			<Image source={ imgUri } style={{ height: '50%', width: '100%' }}/>
		</View>
	</Modal>
	)
}

export const CheerModal = ( { cheerVisible }) =>
{
	return (
		<Modal animationType='slide' color='#d1dce4ff' visible={ cheerVisible }>
			<Image source={ imgUri } style={{ height: '50%', width: '100%' }}/>
		</Modal>
	)
}


export const ProgressAndScore = ( { currentNumber, levelScore, questions_per_level }) =>
{
	return (
		<View>
			<View style={ styles.progress_bar_container }>
				<View style={ styles.progress_bar }>
					<Progress.Bar
						progress={( ( currentNumber - 1) / questions_per_level )}
						height= '20'
						width={screen_width * 0.6}
						color='#66a1efff'
						borderRadius={5}
						unfilledColor='#bacfeaff'
						borderColor='#DBE2E9'
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