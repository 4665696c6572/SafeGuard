import { format } from "date-fns";
import { Animated, Image, Modal, Text, View } from 'react-native';
import Dialog from "react-native-dialog";

import styles from '../../../styles/styles';

const frog = require( '../../../assets/frog_jump_1.png' );
const frog_streak = require( '../../../assets/frog_streak.png' );
const lily_pad = require( '../../../assets/lily_pad.png' );



// Informs user that they have earned a badge upon completion of a category
export const BadgeDialog = ({ badgeInfo, badgeDialogVisible, setBadgeDialogVisible }) =>
{
	if ( !badgeInfo )    return;

	let text
	if ( badgeInfo?.badgeType )    text = ` the ${ "\n" } ${ badgeInfo.badgeType }.`;
	else    text = ' a badge!';

	return (
		<Dialog.Container visible={ badgeDialogVisible }>
			<Dialog.Title style={[ styles.count_text, styles.delete_text ]}>
				Congratulations!
			</Dialog.Title>

			<Dialog.Description style={[ styles.count_text, styles.delete_text ]}>
				You have earned
				{ text }{ "\n \n" }
				{ <Image source={ badgeInfo?.badge } style={ styles.badge_large }/> }
			</Dialog.Description>

			<Dialog.Button
				label="Close"
				onPress={ ( ) => setBadgeDialogVisible( false ) }
				style={ styles.count_text }
			/>
		</Dialog.Container>
	)
}



// Displays an encouraging modal after a level is complete
export const EndLevelModal = ({ levelComplete, levelScore }) =>
{
	return (
	<Modal animationType='slide' color='#d1dce4ff' visible={ levelComplete } >
		<View style={ styles.cheer_container }>
			{
				levelScore != 0 ?
				<>
					<Text style={ styles.score_text }>Final score</Text>
					<Text style={ styles.score_text }>{ levelScore }</Text>
					<Image source={ frog } style={ styles.cheer_image }/>
				</>
				:
				<Text style={ styles.score_text }>Small steps still count. Tomorrow’s another chance.</Text>
			}
		</View>
	</Modal>
	)
}



/*
 *	This code is a modified version ( modified by me ) of code not written by me.
 *	Title: DailyStreakCounter
 *	Author: Ofekino ( GitHub ) / Horizon @Devving_Horizon ( YouTube )
 *	Date published: Jan 18, 2025
 *	Code version: unknown
 *	Availability: https://github.com/Ofekino/DailyStreakCounter / https://www.youtube.com/watch?v=5CFdSkA17Sw
 *
 *	This function produces streak indicators for a period of seven days.
 *	The streak display resets once full.
 */
export function Streak ({ index, item, pulseAnimation, streakLength })
{
	const today = index == ( streakLength - 1 ) % 7;

	return (
		<View style={ styles.streak_columns }>
			<Animated.View style={ today ? { transform: [{ scale: pulseAnimation }]} : null }>
				<View style={ styles.data_section }>
				{
					item.completed ?
					<Image source={ frog_streak } style={ styles.streak_icon_size }/>
				:
					<Image source={ lily_pad } style={ styles.streak_icon_size }/>
				}
					<Text style={ styles.streak_day_text }>{ format( item.day, "EEE" )}</Text>
				</View>
			</Animated.View>
		</View>
	);
}


/*
 *	Image - Frogs
 *	Title: Playful Green Frog Stickers Collection
 *	Author: easy-peasy.ai
 *	Availability: https://easy-peasy.ai/ai-image-generator/images/colorful-green-frog-stickers-collection-messaging-app
 *
 *
 *	Image - Lily Pad
 *	Title: Lily Pad
 *	Author: Alison Feiler ( me )
 *	Availability: n/a
 */