import { HugeiconsIcon } from '@hugeicons/react-native';
import { CheckmarkCircle03Icon } from '@hugeicons/core-free-icons';
import { Linking, ScrollView, TouchableOpacity, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

import styles from '../../styles/styles.js';

const url = 'https://www.floridadisaster.org/planprepare/disability/evacuations-and-shelters/shelter-information/'


// Hurricane and flood information screen.
const WaterScreen = ( ) =>
{
	// Links for Hurricane Shelters
	const handleLinkPress = ( ) =>
	{
		Linking.openURL(url);
	};

	return (
		<View style={ styles.resource_container }>
			<ScrollView>
				<Card style={ styles.resource_card_outer }>
					<Card style={ styles.resource_card_upper }>
						<Card.Content>
							<Text style={ styles.resource_title }>
								Flood and Hurricane
							</Text>
							<Text style={[ styles.text, styles.resource_text ]}>
								Hurricanes can cause great damage and injury from high winds, storm surges,
								inland flooding, contaminated water, power loss, and blocked roads.{"\n\n"}
								
								The danger from water often surpasses that of the wind because even seemingly
								shallow water can sweep people, vehicles, and even buildings away.
								Do not attempt to drive to safety.  Most flash flooding deaths occur
								in automobiles{"\n\n"}
								
								Be sure to monitor official warnings, evacuate early if instructed, avoid
								floodwater,and return only when authorities say it is safe.{"\n\n"}
								
								Even after the hurricane has passed, hidden hazards such as contaminated
								water, damaged buildings, and electrical risks may remain.{"\n\n"}
								
								For evacuation shelter details visit:

							<TouchableOpacity
								onPress={ handleLinkPress }
							>
								<Text style={ styles.resource_link }>www.floridadisaster.org</Text>
							</TouchableOpacity>
					</Text>
						</Card.Content>
					</Card>


					<Card style={ styles.resource_card_lower }>
						<Card.Content>
							<Text style={ styles.resource_title }>
								Prepare for safety
							</Text>
							{
								list.map(( item, index ) =>
								<View key={ index } style={ styles.resource_row }>
									<View style={{ alignSelf: 'center' }}>
										<HugeiconsIcon
											icon={ CheckmarkCircle03Icon }
											size={ 18 }
											color={ 'black' }
											strokeWidth={ 1.5 }
										/>
									</View>
									<Text style={ styles.text }>{ item }</Text>
								</View>
							)}
						</Card.Content>
					</Card>
				</Card>
			</ScrollView>
		</View>
	)
}

export default WaterScreen;


const list =
[
	'Cash',
	'Cell phone charger and power bank',
	'First Aid kit',
	'Flashlight with batteries',
	'Important documents',
	'Medications (2 week supply)',
	'Non-perishable food',
	'Rain gear',
	'Water ( 3 gallons/person )'
];

