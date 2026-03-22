import { HugeiconsIcon } from '@hugeicons/react-native';
import { CheckmarkCircle03Icon } from '@hugeicons/core-free-icons';
import { ScrollView, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

import styles from '../../styles/styles.js';


// Storm and Tornado information screen.
const StormScreen = ( ) =>
{
	return (
		<View style={ styles.resource_container }>
			<ScrollView>
				<Card style={ styles.resource_card_outer }>
					<Card style={ styles.resource_card_upper }>
						<Card.Content>
							<Text style={ styles.resource_title }>Storm & Tornado</Text>
							<Text style={[ styles.text, styles.resource_text ]}>
								Severe storms can bring lightning, hail, powerful winds,
								heavy rain, flash flooding, and even tornadoes.
								Tornadoes can form quickly and may damage or destroy
								buildings and vehicles, block roadways, and bring
								down power lines.{"\n\n"}

								The safest response is to monitor warnings early,
								move to sturdy shelter immediately, and avoid windows.{"\n\n"}
								
								After the storm, hazards such as debris, unstable
								structures, gas leaks, and downed power lines may remain.{"\n\n"}
							</Text>
						</Card.Content>
					</Card>


					<Card style={ styles.resource_card_lower }>
						<Card.Content>
							<Text style={ styles.resource_title }>
								Be ready to respond
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

export default StormScreen;


const list =
[
	'Monitor local weather alerts.',
	'Move to the lowest level of a sturdy building.',
	'Stay away from windows and exterior walls.',
	'Keep a flashlight, shoes, and cell phone nearby.',
	'Do not shelter in a mobile home or auto if safer shelter is available.',
	'After the storm, avoid damaged buildings and downed power lines.'
];
