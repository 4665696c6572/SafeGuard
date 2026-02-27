import { Animated, Image, Text, View } from 'react-native';
import { format } from "date-fns";

import styles from '../../styles/styles.js';

const lily_pad = require( '../../assets/lily_pad.png' );
const frog = require( '../../assets/frog_streak.png' );


/*
 * This code is a modified version ( modified by me ) of code not written by me.
 * Title: DailyStreakCounter
 * Author: Ofekino ( GitHub ) / Horizon @Devving_Horizon ( YouTube )
 * Date published: Jan 18, 2025
 * Code version: unknown
 * Availability: https://github.com/Ofekino/DailyStreakCounter / https://www.youtube.com/watch?v=5CFdSkA17Sw
 *
 * This function produces streak indicators for a period of five days.
 * The streak display resets once full.
 */
export default function Streak ({ index, item, pulseAnimation, streakLength })
{
	const today = index == ( streakLength - 1 ) % 7;

	return (
		<View style={ styles.streak_columns }>
			<Animated.View style={ today ? { transform: [{ scale: pulseAnimation }]} : null }>
					<View style={ styles.data_section }>
					{
						item.completed ?
						<Image source={frog} style={ styles.streak_icon_size }/>
					:
						<Image source={lily_pad} style={ styles.streak_icon_size }/>
					}
						<Text style={ styles.streak_day_text }>{ format( item.day, "EEE" )}</Text>
					</View>
			</Animated.View>
		</View>
	);
};