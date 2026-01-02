import { useSQLiteContext } from 'expo-sqlite';
import {  Component, Fragment, React, useEffect, useState } from 'react';
import { ActivityIndicator,  ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Cell, Section, TableView} from 'react-native-tableview-simple';



const EmergencyDataScreen = ({  }) =>
{
	const db = useSQLiteContext();
	const [emergencyData, setEmergencyData] = useState();
	const [loading, setLoading] = useState(true);

	////// Load Database \\\\\\
	useEffect( ( ) =>
	{
		selectEmergencyData( db, setEmergencyData, setLoading );
	}, [ db ] );

	if (loading)    return <ActivityIndicator/>;

	return (
		<SafeAreaProvider style={ styles.container }>
			<ScrollView style={{ flex: 1, marginBottom : 5,  paddingLeft: 10, paddingTop : 10 }}>
				<View key={emergencyData.id} >

				{/* Person's info */}
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
			</ScrollView>
		</SafeAreaProvider>
	);
}


const selectEmergencyData = async function ( db, setEmergencyData, setLoading ) 
{
	setLoading(true);
	try
	{
		const result_person = await db.getAllAsync(
		`
			SELECT 
				ENTITY_ID, 
				Entity_Name AS Name, 
				DOB,
				Sex, 
				Height, 
				Weight, 
				Blood_Type 
			FROM Entity, Person 
			WHERE Person_ID = ? 
			AND Entity_ID = ?;`, 
			[1, 1]
		);

		const result_condition = await db.getAllAsync(
		`
			SELECT
				Medical_Condition_ID,
				Condition_Name,
				Diagnosis_Date,
				Note,
				Entity_NAME AS Doctor
			FROM Medical_Condition
			JOIN Entity
			ON Entity.Entity_ID = Medical_Condition.Doctor_ID
			WHERE Condition_Name NOT LIKE ?;`, 
			['%Allergy%']
		);

		const result_medication = await db.getAllAsync(
		`
			SELECT 
				Medication_ID,
				Medication_Name, 
				Strength, 
				Frequency,
				Start_Date,
				Note,
				Entity_NAME AS Doctor
			FROM Medication
			JOIN Entity 
			ON Entity.Entity_ID = Medication.Doctor_ID;
		`);

		const result_allergy = await db.getAllAsync(
		`
			SELECT
				Allergy_ID,
				Allergen,
				Severity,
				Medication_Name,
				Diagnosis_Date,
				Medical_Condition.Note
			FROM Allergy
			LEFT JOIN Medical_Condition
			ON Medical_Condition.Medical_Condition_ID = Allergy.Allergy_ID
			LEFT JOIN Medication 
			ON Medical_Condition.Medical_Condition_ID = Medication.Medical_Condition_ID;
		`);

		const result_insurance = await db.getAllAsync(
		`
			SELECT 
				Insurance_ID,
				Entity.Entity_Name AS Company_Name, 
				Policy_Number,
				Start_Date,
				Note
				FROM Insurance
				JOIN Entity on Entity.Entity_ID = Insurance.Insurance_ID
				WHERE Insurance_Type = ?`, 
			['Health']
		);


		setEmergencyData
		({
			id: result_person[0]?.Entity_ID,
			person:
			{
				name: result_person[0]?.Name,
				dob: result_person[0]?.DOB,
				sex: result_person[0]?.Sex,
				height: result_person[0]?.Height,
				weight: result_person[0]?.Weight,
				blood_type: result_person[0]?.Blood_Type
			},
			medical_condition:
			(
				result_condition || []).map(condition => 
				({
					id: condition.Medical_Condition_ID,
					condition_name: condition.Condition_Name,
					diagnosis_date: condition.Diagnosis_Date,
					note: condition.Note,
					doctor: condition.Doctor,
				})
			),
			
			medication:
			(
				result_medication || []).map(medication => 
				({
					id: medication.Medication_ID,
					medication_name: medication.Medication_Name,
					strength: medication.Strength,
					frequency: medication.Frequency,
					start_date: medication.Start_Date,
					note: medication.Note,
					doctor: medication.Doctor
				})
			),
			allergy:
			(
				result_allergy || []).map(allergy => 
				({
					id: allergy.Allergy_ID,
					allergen: allergy.Allergen,
					severity: allergy.Severity,
					medication_name: allergy.Medication_Name,
					diagnosis_date: allergy.Diagnosis_Date,
					note: allergy.Note
				})
			),
			health_insurance:
			(
				result_insurance || []).map(insurance => 
				({
					id: insurance.Insurance_ID,
					company: insurance.Company_Name,
					policy_number: insurance.Policy_Number,
					start_date: insurance.Start_Date,
					note: insurance.Note
				})
			)
		});

	console.log( 'Emergency Data Loaded' );
	setLoading(false);
	}
	catch ( error )
	{
		console.log( 'Error loading Entity data:', error );  
	}
};

const styles=StyleSheet.create({
	container: 
	{ 
		flex: 1,
		backgroundColor: '#e8ecfbff', 
		marginTop: '10%',
		marginBottom: '10%',
	},
	category: 
	{
		marginBottom: 10,
		fontSize: 18,
	},
	text:
	{
		fontSize: 16
	}
});

export default EmergencyDataScreen;