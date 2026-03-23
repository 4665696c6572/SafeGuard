
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import useLoadEmergencyData from '../../common/userData/hook/useLoadEmergencyData';

import styles from '../../styles/styles';

import { Allergy, HealthInsurance, MedicalCondition, Medication, Person } from './components/emergencyData';


// Displays summary of each type of data for quick access in an emergency.
// Doctor excluded as the category is less about the patient.
const EmergencyDataScreen = ({ navigation }) =>
{
	const db = useSQLiteContext( );

	const [ emergencyData, setEmergencyData, loadingData, loadEmergencyData ] = useLoadEmergencyData( db, 'All' );

	const isFocused = useIsFocused( );


	useEffect( ( ) =>
	{
		if ( isFocused )
		{
			loadEmergencyData( );
		}
	}, [ isFocused ]);


	function handleNavigation( screen )
	{
		navigation.pop( );
		navigation.navigate( "TabNavigator", { screen: screen })
	}


	return (
		<ScrollView 
			style={[ styles.container, styles.data_container_view,
			{ marginTop: 0, paddingTop: '5%' } ]}
		>
		{
			loadingData ?
			<ActivityIndicator/>
		:
			<>
			{
				(
					emergencyData?.person?.[0]?.entity_name == null &&
					emergencyData?.allergy.length  == 0 &&
					emergencyData?.doctor.length  == 0 &&
					emergencyData?.insurance.length  == 0 &&
					emergencyData?.medical_condition.length  == 0 &&
					emergencyData?.medication.length == 0
				) ?
				<View style={[ styles.contact_button, { paddingTop: 40 }  ]}>
					<Text style={[ styles.heading_text, { paddingBottom: 20 } ]}>No Details available</Text>
					<TouchableOpacity
						accessibilityLabel='Navigation Button'
						accessibilityHint='Press to add emergency details.'
						onPress={ ( ) => handleNavigation( 'Person' ) }
					>
						<Text style={ styles.save_button_text }>Add Emergency details</Text>
					</TouchableOpacity>
				</View>
			:

				<View style={{ paddingBottom: 30 }}>
					<Person
						entityData={ emergencyData?.person }
						nav={ ( ) => handleNavigation( 'Person' ) }
					/>

					<Allergy
						doctorData={ emergencyData?.doctor }
						allergyData={ emergencyData?.allergy }
						nav={ ( ) => handleNavigation( 'Condition' ) }
					/>

					<MedicalCondition
						conditionData={ emergencyData?.medical_condition }
						nav={ ( ) => handleNavigation( 'Condition' ) }
					/>

					<Medication
						doctorData={ emergencyData?.doctor }
						medicationData={ emergencyData?.medication }
						nav={ ( ) => handleNavigation( 'Medication' ) }
					/>

					<HealthInsurance
						insuranceData={ emergencyData?.insurance }
						nav={ ( ) => handleNavigation( 'Person' ) }
					/>
				</View>
			}
			</>
		}
		</ScrollView>
	);
}

export default EmergencyDataScreen;