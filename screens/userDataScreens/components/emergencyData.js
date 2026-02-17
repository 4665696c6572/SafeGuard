import { Text, TouchableOpacity, View } from 'react-native';

import styles from "../../../styles/styles";


export const Person = ( { entityData, nav }) => 
{
	console.log(entityData[0])
	return (
		<View style={{ marginVertical: 8 }}>
		{ 
			entityData[0]?.entity_name ? 
			<View>
				<Text style={{ fontSize: 22, borderBottomWidth: 2, borderColor: 'blue' }}>Personal Information</Text>
				{
					entityData.map( person => 
						<View key={ person.entity_id } style={{ marginBottom: 10 }}>
							{ person?.entity_name ? <Text style={ styles.text }>{person.entity_name }</Text> : null }
							{ person?.dob ? <Text style={ styles.text }>Date of birth: {person.dob}</Text> : null }
							{ person?.sex ? <Text style={ styles.text }>Sex: {person.sex}</Text> : null }
							{ person?.height ? <Text style={ styles.text }>Height: {person.height}</Text> : null }
							{ person?.weight ? <Text style={ styles.text }>Weight: {person.weight}</Text> : null }
							{ person?.blood_type ? <Text style={ styles.text }>Blood Type: {person.blood_type }</Text> : null }
						</View>
					)
				}
			</View>
		: 
			<View>
				<TouchableOpacity
					onPress={ nav }
					style={{ flex: 1/3}}
				>
					<Text style={styles.text_button}>Add Emergency Details</Text>
				</TouchableOpacity> 
			</View>
		}
		</View>
	);
};

export const MedicalCondition = ( { conditionData }) =>
{
	return (
		<View style={{ marginVertical: 8 }}>
		{
			conditionData[0]?.condition_id ?
			<View>
				<Text style={{ fontSize: 22, borderBottomWidth: 2, borderColor: 'blue' }}>Medical Conditions</Text>
				{
					conditionData.map( condition =>				
					<View key={ condition.condition_id } style={{ marginBottom: 10 }}>
						<Text style={ styles.text } > { condition.condition_name }</Text>
					</View>					
				)}
			</View>
			: null
		}
		</View>
	);
};

export const Medication = ( { doctorData, medicationData }) => 
{
	return (
		<View>
		{ 
			medicationData[0]?.medication_id ?
			<View style={{ marginVertical: 8 }}>
				<Text style={{ fontSize: 22, borderBottomWidth: 2, borderColor: 'blue' }}>Medications</Text>
				{ 
					medicationData.map(( medication, i) =>
					<View key={ medication.medication_id } style={{ marginBottom: 10 }}>
						
						{
							medication.is_life_sustaining == 1 ?
							<View>
								<Text style={[ styles.text, styles.allergy_alert ]}>Life Sustaining Medication</Text>
								{ medication?.medication_name ? <Text style={[ styles.text, styles.allergy_alert ]}>{ medication.medication_name }</Text> : null }
							</View>
							:
							<View>
								{ medication?.medication_name ? <Text style={ styles.text }>{ medication.medication_name }</Text> : null}
							</View>
						}


						{ medication?.strength ? <Text style={ styles.text }>{ medication.strength }</Text> : null}
						{ medication?.frequency ? <Text style={ styles.text }>{ medication.frequency }</Text> : null}
						{ medication?.start_date ? <Text style={ styles.text }>Start date: { medication.start_date }</Text> : null}
						{ 
							doctorData?.map ( doctor =>
							<View key={ doctor.doctor_id } >
							{
								doctor.doctor_id == medication.doctor_id ?
								<Text style={ styles.text }>Prescribing doctor: { doctor.doctor_name }</Text>
								: null 
							}
							</View>
						)}
						{ medication?.note ? <Text style={ styles.text }>Notes: { medication.note }</Text> : null}
					</View>
				)}
			</View>
		: null
		}
		</View>
	);
};

export const Allergy = ( { allergyData }) =>
{
	return (
		<View style={{ marginVertical: 8 }}>
		{
			allergyData[0]?.allergy_id ?
			<View>
				<Text style={{ fontSize: 22, borderBottomWidth: 2, borderColor: 'blue' }}>Allergies</Text>
				{
					allergyData.map( allergy => 
					<View key={ allergy.allergy_id } style={{ marginBottom: 10 }}>
					{
						allergy.severity == 'Life Threatening' ?
						<View>
							{ allergy.severity ? <Text style={[ styles.text, styles.allergy_alert ]}>{ allergy.severity } Allergy</Text> : null }
							{ allergy.allergen ? <Text style={[ styles.text, styles.allergy_alert ]}>{ allergy.allergen }</Text> : null }
						</View>
						:
						<View>
							{ allergy.severity ? <Text style={ styles.text }>severity: { allergy.severity } Allergy</Text> : null }
							{ allergy.allergen ? <Text style={ styles.text }>{ allergy.allergen }</Text> : null }
						</View>
					}
					</View>
				)}
			</View>
		: null
		}
		</View>
	);
};

export const HealthInsurance = ( { insuranceData }) =>
{
	return (
		<View style={{ marginVertical: 8 }}>
		{
			insuranceData[0]?.insurance_id ?
			<View>
				<Text style={{ fontSize: 22, borderBottomWidth: 2, borderColor: 'blue' }}>Health Insurance</Text>
				{
					insuranceData.map( insurance => 
					<View key={ insurance.insurance_id } style={{ marginBottom: 10 }}>
					
						{ insurance.company_name ? <Text style={[ styles.text, styles.insurance_alert ]}>{ insurance. company_name } insurance</Text> : null }
						{ insurance.policy_number ? <Text style={[ styles.text, styles.insurance_alert ]}>Policy number: { insurance.policy_number }</Text> : null }
						{ insurance.start_date ? <Text style={ styles.text }>Start date: { insurance.start_date } insurance</Text> : null }
						{ insurance.note ? <Text style={ styles.text }>Notes: { insurance.note }</Text> : null }
						</View>
				)}
			</View>
		: null
		}
		</View>
	);
};
