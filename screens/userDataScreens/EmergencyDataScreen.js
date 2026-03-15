
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import useLoadEmergencyData from '../../common/userData/hook/useLoadEmergencyData';

import styles from '../../styles/styles';

import { Allergy, HealthInsurance, MedicalCondition, Medication, Person } from './components/emergencyData';


// Displays summary of each type of data for quick access in an emergency.
const EmergencyDataScreen = ({ navigation }) =>
{
	const db = useSQLiteContext( );

	const [ emergencyData, setEmergencyData, loadingData, loadEmergencyData ] = useLoadEmergencyData( db, 'All', 'Health' );

	const isFocused = useIsFocused( );


	useEffect(( ) =>
	{
		if ( isFocused )
		{
			loadEmergencyData( );
		}
	}, [ isFocused ]);


	return (
		<ScrollView style={[ styles.container, styles.data_container_view, { marginTop: 0, paddingTop: '5%' } ]}>
		{
			loadingData ?
			<ActivityIndicator/>
		:
			<View style={{ paddingBottom: 30 }}>
			<Person
				entityData={ emergencyData?.person }
				nav={ ( ) => { navigation.navigate( "PersonScreen", { screen: 'EmergencyDataScreen' })}}
			/>

			<Allergy
				doctorData={ emergencyData?.doctor }
				allergyData={ emergencyData?.allergy }
			/>

			<MedicalCondition
				conditionData={ emergencyData?.medical_condition }
			/>

			<Medication
				doctorData={ emergencyData?.doctor }
				medicationData={ emergencyData?.medication }
			/>

			<HealthInsurance
				insuranceData={ emergencyData?.insurance }
			/>

			<View style={ styles.contact_button }>
				<TouchableOpacity
					accessibilityLabel='Navigation Button'
					accessibilityHint='Press to view more details.'
					onPress={ ( ) =>
					{
						navigation.pop( );
						navigation.navigate( "PersonScreen");
					}}
				>
					<Text style={ styles.save_button_text }>View full details</Text>
				</TouchableOpacity>
			</View>
			</View>
		}
		</ScrollView>
	);
}

export default EmergencyDataScreen;