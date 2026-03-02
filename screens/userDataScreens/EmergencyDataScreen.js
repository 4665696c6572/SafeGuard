
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import useLoadEmergencyData from '../../common/userData/hook/useLoadEmergencyData';

import styles from '../../styles/styles';

import { Allergy, HealthInsurance, MedicalCondition, Medication, Person } from './components/emergencyData';


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


	if ( loadingData )    return <ActivityIndicator/>;


	return (
		<ScrollView style={[ styles.container, styles.data_container_view ]}>
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
		</ScrollView>
	);
}

export default EmergencyDataScreen;