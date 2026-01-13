import { StatusBar } from 'expo-status-bar';
import { useSQLiteContext } from 'expo-sqlite';
import { Fragment } from 'react';
import { ActivityIndicator,  ScrollView, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useLoadEmergencyData from '../common/emergency/hook/useLoadEmergencyData';

import styles from '../styles/styles';


const EmergencyDataScreen = ({  }) =>
{
	const db = useSQLiteContext();

	const [ emergencyData, loadingData ] = useLoadEmergencyData( db );

	if ( loadingData )    return <ActivityIndicator/>;

	return (
		<SafeAreaProvider style={ styles.container }>
			<ScrollView style={{ flex: 1, marginBottom : 5,  paddingLeft: 10, paddingTop : 10 }}>
				<View key={emergencyData.id} >

				{/* Personal info */}
				{ emergencyData.person?.name != null ? 
					<Fragment> 
						{ emergencyData?.person.name != null ? <Text style={{fontSize: 18}}>{emergencyData.person.name}</Text> : null }
						{ emergencyData?.person.dob != null ? <Text style={ styles.text }>Date of birth: {emergencyData.person.dob}</Text> : null }
						{ emergencyData?.person.sex != null ? <Text style={ styles.text }>Sex: {emergencyData.person.sex}</Text> : null }
						{ emergencyData?.person.height != null ? <Text style={ styles.text }>Height: {emergencyData.person.height}</Text> : null }
						{ emergencyData?.person.weight != null ? <Text style={ styles.text }>Weight: {emergencyData.person.weight}</Text> : null }
						{ emergencyData?.person.blood_type != null ? <Text style={ styles.text }>Blood Type: {emergencyData.person.blood_type}</Text> : null }
					</Fragment> : null
				}

				{/* Medical Conditions */}
				{ emergencyData.medical_condition[0]?.id != null ? 
					<Fragment> 
						<Text>---------------------------------------------</Text>
						<Text style={ styles.category }>Medical Conditions</Text>
						{
							Array.isArray(emergencyData.medical_condition) &&
							emergencyData.medical_condition.map((condition) => 
							(
								<View key={condition.id} style={{ marginBottom: 10 }}>
									{ condition?.condition_name != null ? <Text style={ styles.text }>Condition: {condition.condition_name}</Text> : null }
									{ condition?.diagnosis_date != null ? <Text style={ styles.text }>Diagnosed on: {condition.diagnosis_date}</Text> : null }
								</View>
							))
						}
					</Fragment> : null
				}

				{/* Medications */}
				{ emergencyData.medication[0]?.id != null ? 
					<Fragment> 
						<Text>---------------------------------------------</Text>						
						<Text style={ styles.category }>Medications</Text> 
						{   Array.isArray(emergencyData.medication)    &&
							emergencyData.medication.map((medication) => 
							(
								<View key={medication.id} style={{ marginBottom: 10 }}>
									{ medication?.medication_name != null ? <Text style={ styles.text }>Medication: {medication.medication_name}</Text> : null}
									{ medication?.strength != null ? <Text style={ styles.text }>Strength: {medication.strength}</Text> : null}
									{ medication?.frequency != null ? <Text style={ styles.text }>Frequency: {medication.frequency}</Text> : null}
									{ medication?.start_date != null ? <Text style={ styles.text }>Start date: {medication.start_date}</Text> : null}
									{ medication?.doctor != null ? <Text style={ styles.text }>Doctor: {medication.doctor}</Text> : null}
									{ medication?.note != null ? <Text style={ styles.text }>Notes: {medication.note}</Text> : null}
								</View>
							)
						)}
					</Fragment> : null
				}

				{/* Allergies */}
				{ emergencyData.allergy[0]?.id != null ? 
					<Fragment> 
						<Text>---------------------------------------------</Text>
						<Text style={ styles.category }>Allergies</Text>
						{ Array.isArray(emergencyData.allergy)    &&
							emergencyData.allergy.map((allergy) => 
							(
								<View key={allergy.id} style={{ marginBottom: 10 }}>
									{ allergy?.allergen != null ? <Text style={ styles.text }>Allergen: {allergy.allergen}</Text> : null }	
									{ allergy?.severity != null ? <Text style={ styles.text }>Severity: {allergy.severity}</Text> : null }
									{ allergy?.medication_name != null ? <Text style={ styles.text }>Medication: {allergy.medication_name}</Text> : null }
									{ allergy?.diagnosis_date != null ? <Text style={ styles.text }>Diagnosis date: {allergy.diagnosis_date}</Text> : null }
									{ allergy?.note != null ? <Text style={ styles.text }>Notes: {allergy.note}</Text> : null }
								</View>
							)
						)}
					</Fragment> : null
				}

				{/* Health Insurance */}
				{ emergencyData.health_insurance[0]?.id != null ? 
					<Fragment> 
						<Text>---------------------------------------------</Text>						
						<Text style={ styles.category }>Health Insurance</Text>
						{ Array.isArray(emergencyData.health_insurance)    &&
							emergencyData.health_insurance.map((insurance) => 
							(
								<View key={insurance.id} style={{ marginBottom: 8 }}>
									{ insurance?.company != null ? <Text style={ styles.text }>Company Name: {insurance.company}</Text> : null }
									{ insurance?.policy_number != null ? <Text style={ styles.text }>Policy Number: {insurance.policy_number}</Text> : null }
									{ insurance?.start_date != null ? <Text style={ styles.text }>Start Date: {insurance.start_date}</Text> : null }
									{ insurance?.note != null ? <Text style={ styles.text }>Note: {insurance.note}</Text> : null }
								</View> 
							)
						)}
					</Fragment> : null
				}
				</View>
				<StatusBar style="auto" />
			</ScrollView>
		</SafeAreaProvider>
	);
}

export default EmergencyDataScreen;