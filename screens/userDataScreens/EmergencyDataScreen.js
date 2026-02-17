
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

import styles from '../../styles/styles';

import { Allergy, HealthInsurance, MedicalCondition, Medication, Person } from './components/emergencyData';
import useLoadEmergencyData from '../../common/userData/hook/useLoadEmergencyData';


const EmergencyDataScreen = ({ navigation }) =>
{
	const db = useSQLiteContext();

	const [ emergencyData, setEmergencyData, loadingData, loadEmergencyData ] = useLoadEmergencyData( db, 'All' );

	const isFocused = useIsFocused();

	useEffect(() =>
		{
			if ( isFocused )
			{
				loadEmergencyData();
			}
	}, [ isFocused ]);


	if ( loadingData )    return <ActivityIndicator/>;

	
	return (
		<View style={ styles.container }>
			<ScrollView style={{ flex: 1, marginBottom : 45, paddingLeft: 10, paddingTop : 10 }}>
				<Person 
					entityData={ emergencyData?.person }	
					nav={ ( ) => { navigation.navigate( "EmergencyDataFormScreen" )}}			
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
			</ScrollView>
		</View>
	);
}

export default EmergencyDataScreen;