import { ScrollView, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

import styles from '../../styles/styles.js';


// Health Emergency information screen.
const HealthScreen = ( ) =>
{
	return (
		<View style={ styles.resource_container }>
			<ScrollView>
				<Card style={ styles.resource_card_outer }>
					<Card style={ styles.resource_card_upper }>
						<Card.Content>
							<Text style={ styles.resource_title }>
								Health Emergencies
							</Text>
							<Text style={[ styles.text, styles.resource_text ]}>
								Common health emergencies include severe bleeding,
								trouble breathing, heart attack, stroke,
								life-threatening allergic reactions, and seizures.{"\n\n"}

								These situations can become life-threatening
								quickly and often require immediate action.{"\n\n"}
								
								The safest response is to recognize signs early,
								call emergency services, and give basic first
								aid if trained while waiting for professional help.
							</Text>
						</Card.Content>
					</Card>


					<Card style={[ styles.resource_card_lower, { marginBottom: 0 } ]}>
						<Card.Content>
							<Text style={ styles.resource_title }>
								Heart attack symptoms
							</Text>
							{
								heart_attack.map(( item, index ) =>
								<View key={ index } style={ styles.resource_row }>
									<Text style={[ styles.text, { paddingLeft: 10 }]}>{ item }</Text>
								</View>
							)}
						</Card.Content>
					</Card>


					<Card style={ styles.resource_card_lower }>
						<Card.Content>
							<Text style={ styles.resource_title }>
								Stroke symptoms
							</Text>
							{
								stroke.map(( item, index ) =>
								<View key={ index } style={ styles.resource_row }>
									<Text style={[ styles.text, { paddingLeft: 10 }]}>{ item }</Text>
								</View>
							)}
						</Card.Content>
					</Card>
				</Card>
			</ScrollView>
		</View>
	)
}

export default HealthScreen;


const heart_attack =
[
	'Chest pain',
	'Arm, back, neck, or jaw pain',
	'Shortness of breath',
	'Cold sweat',
	'Nausea and/or vomiting',
	'Rapid or irregular heartbeat',
	'Being unusually tired',
	'Feeling lightheaded or faint',
	'Anxiety'
];

const stroke =
[
	'Facial Drooping',
	'Arm weakness',
	'Confusion',
	'Unilateral numbness or weakness',
	'Difficulty speaking or slurring',
	'Difficulty understanding speech',
	'Difficulty seeing',
	'Dizziness or loss of balance',
	'Sudden severe headache'
];