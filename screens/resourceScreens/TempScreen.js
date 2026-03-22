import { ScrollView, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

import styles from '../../styles/styles.js';


// Temperature Extremes information screen.
const TempScreen = ( ) =>
{
	return (
		<View style={ styles.resource_container }>
			<ScrollView>
				<Card style={ styles.resource_card_outer }>
					<Card style={ styles.resource_card_upper }>
						<Card.Content>
							<Text style={ styles.resource_title }>
								Temperature Extremes
							</Text>
							<Text style={[ styles.text, styles.resource_text ]}>
								Temperate climates can still produce dangerous
								heatwaves and cold snaps.{"\n\n"}

								Heat can cause dehydration, heat exhaustion, and heat stroke,
								while cold can lead to hypothermia and frostbite.{"\n\n"}

								Risks increase when electricity, heating and cooling,
								water supply, transportation services and infrastructure,
								and/or medical services are disrupted even briefly. {"\n\n"}
								
								Preparedness means dressing appropriately, limiting exposure,
								checking forecasts, and protecting those who are most at risk.
							</Text>
						</Card.Content>
					</Card>

					<Card style={[ styles.resource_card_lower, { marginBottom: 0 } ]}>
						<Card.Content>
							<Text style={[ styles.resource_title, 
								{
									borderColor: '#7e0404', color: '#7e0404'
								}]}
							>
								Know your risks: Heat
							</Text>
							{
								Object.entries(heat_terms).map(([ key, val ]) =>
								(
									<View key={ key } style={ styles.resource_column }>
										<Text style={ styles.resource_term }>{ key }</Text>
										<Text style={[ styles.text, { textAlign: 'center' } ]}>{ val }</Text>
									</View>
								)
							)}
							<Text style={[ styles.streak_day_text, styles.alert ]}>
								Heat Stroke is a medical Emergency!
							</Text>
						</Card.Content>
					</Card>


					<Card style={[ styles.resource_card_lower ]}>
						<Card.Content>
							<Text style={ styles.resource_title }>
								Know your risks: Cold
							</Text>
							{
								Object.entries(cold_terms).map(([ key, val ]) =>
								(
									<View key={ key } style={ styles.resource_column }>
										<Text style={ styles.resource_term }>{ key }</Text>
										<Text style={[ styles.text, { textAlign: 'center' } ]}>{ val }</Text>
									</View>
								)
							)}
						</Card.Content>
					</Card>
				</Card>
			</ScrollView>
		</View>
	)
}

export default TempScreen;


const heat_terms =
{
	'Heat Cramps' : 'Painful muscle cramps and sweating that typically occurs during or after intense physical activity in hot or humid conditions.',
	'Heat Exhaustion' : 'Heavy sweating, headache, dizziness, nausea, weakness, irritability, thirst, cool and clammy skin, fast or weak pulse, and normal body temp. ',
	'Heat Rash': 'Tiny red bumps, blisters, or a prickly, itchy sensation caused by inflamed or blocked sweat ducts that trapping in sweat.',
	'Heat Stroke': 'Confusion, slurred speech, loss of consciousness, seizures, hot and dry skin, sweating, rapid pulse, and a body temperature above 103°F',
	'Heat Syncope': 'Dizziness or fainting when standing or getting up quickly due to a temporary drop in blood pressure, typically occurring in hot environments.'
};

const cold_terms =
{
	'Chilblains': 'Small blood vessels in the skin become inflamed from the cold',
	'Trench Foot': 'Red, numb/tingly, and swollen feet caused by prolonged wetness in cool or cold conditions.',
	'Cold Urticaria': 'Red itchy welts caused by skin reacting to the cold. ',
	'Frostbite': 'Severe damage , especially to fingers and toes from extreme cold.',
	'Hypothermia': 'Low body temperature from prolonged exposure to the cold.'
};