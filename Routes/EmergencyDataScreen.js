import { useSQLiteContext } from 'expo-sqlite';
import {  Component, Fragment, React, useEffect, useState } from 'react';
import { ActivityIndicator,  ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Cell, Section, TableView} from 'react-native-tableview-simple';


const EmergencyDataScreen = ({  }) =>
{
	const db = useSQLiteContext();
	const [emergencyData, setEmergencyData] = useState();

	////// Load Database \\\\\\
	useEffect( ( ) =>
	{
		selectEmergencyData( db, setEmergencyData);
	}, [ db ] );

	if (!emergencyData) 
	{
		return <ActivityIndicator/>;
	}

	return (
		<SafeAreaProvider>
			<ScrollView style={{ flex: 1, paddingTop : 10 }}>
				<View key={emergencyData.id} >

				{/* Person's info */}
				{ emergencyData.person?.name != null ? 
					<Fragment> 
						{ emergencyData.person.name && <Text>Name: {emergencyData.person.name}</Text> }
						{ emergencyData.person.dob && <Text>Date of birth: {emergencyData.person.dob}</Text> }
						{ emergencyData.person.sex && <Text>Sex: {emergencyData.person.sex}</Text> }
						{ emergencyData.person.height && <Text>Height: {emergencyData.person.height}</Text> }
						{ emergencyData.person.weight && <Text>Weight: {emergencyData.person.weight}</Text> }
						{ emergencyData.person.blood_type && <Text>Blood Type: {emergencyData.person.blood_type}</Text> }
					</Fragment> : null
				}

				{/* Medical Conditions */}
				{ emergencyData.medical_condition[0]?.id != null ? 
					<Fragment> 
						<Text>---------------------------------------------</Text>
						<Text style={{marginBottom: 10}}>Medical Conditions</Text>
						{
							Array.isArray(emergencyData.medical_condition) &&
							emergencyData.medical_condition.map((condition) => 
							(
								<View key={condition.id} style={{ marginBottom: 10 }}>
									{ condition.condition_name && <Text>Condition: {condition.condition_name}</Text>}
									{ condition.diagnosis_date && <Text>Diagnosed on: {condition.diagnosis_date}</Text>}
								</View>
							))
						}
					</Fragment> : null
				}

				{/* Medications */}
				{ emergencyData.medication[0]?.id != null ? 
					<Fragment> 
						<Text>---------------------------------------------</Text>						
						<Text style={{marginBottom: 10}}>Medications</Text> 
						{   Array.isArray(emergencyData.medication)    &&
							emergencyData.medication.map((medication) => 
							(
								<View key={medication.id} style={{ marginBottom: 10 }}>
									{ medication.medication_name && <Text>Medication: {medication.medication_name}</Text> }
									{ medication.strength && <Text>Strength: {medication.strength}</Text> }
									{ medication.frequency && <Text>Frequency: {medication.frequency}</Text> }
									{ medication.start_date && <Text>Start date: {medication.start_date}</Text> }
									{ medication.doctor && <Text>Doctor: {medication.doctor}</Text> }
									{ medication.note && <Text>Notes: {medication.note}</Text> }
								</View>
							)
						)}
					</Fragment> : null
				}

				{/* Allergies */}
				{ emergencyData.allergy[0]?.id != null ? 
					<Fragment> 
						<Text>---------------------------------------------</Text>
						<Text style={{marginBottom: 10}}>Allergies</Text>
						{ Array.isArray(emergencyData.allergy)    &&
							emergencyData.allergy.map((allergy) => 
							(
								<View key={allergy.id} style={{ marginBottom: 10 }}>
									{ allergy.allergen && <Text>Allergen: {allergy.allergen}</Text> } 							
									{ allergy.severity && <Text>Severity: {allergy.severity}</Text> }
									{ allergy.note && <Text>Notes: {allergy.note}</Text> }
								</View>
							)
						)}
					</Fragment> : null
				}

				{/* Health Insurance */}
				{ emergencyData.health_insurance[0]?.id != null ? 
					<Fragment> 
						<Text>---------------------------------------------</Text>						
						<Text style={{marginBottom: 10}}>Health Insurance</Text>
						{ Array.isArray(emergencyData.health_insurance)    &&
							emergencyData.health_insurance.map((insurance) => 
							(
								<View key={insurance.id} style={{ marginBottom: 8 }}>
									{ insurance.company && <Text>{insurance.company}</Text>}
									{ insurance.policy_number && <Text>{insurance.policy_number}</Text>}
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


const selectEmergencyData = async ( db, setEmergencyData, emergencyData ) =>
{
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
			WHERE Condition_Name NOT LIKE '%Allergy%';
		`);

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
			SELECT * FROM Allergy;
		`);

		const result_insurance = await db.getAllAsync(
		`
			SELECT * FROM Insurance 
			WHERE Insurance_Type = 'Health';
		`);

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
					phone_number: insurance.Phone_Number
				})
			)
		});

		console.log( 'Emergency Data Loaded' );
	}
	catch ( error )
	{
		console.log( 'Error loading Entity data:', error );
	}
};


export default EmergencyDataScreen;