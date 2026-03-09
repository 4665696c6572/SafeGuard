import { Text, TouchableOpacity, View } from 'react-native';

import styles from "../../../styles/styles";


export const Person = ({ entityData, nav }) =>
{
	return (
		<View>
		{
			entityData[0]?.entity_name ?
			<View>
				<Text style={ styles.title_bar }>Personal Information</Text>
				{
					entityData.map( person =>
						<View key={ person.entity_id } style={ styles.data_section_small }>
							{ person?.entity_name ? <Text style={ styles.heading_text }>{ person.entity_name }</Text> : null }
							{ person?.dob ? <Text style={ styles.text }>Date of birth: { person.dob }</Text> : null }
							{ person?.sex ? <Text style={ styles.text }>Sex: { person.sex }</Text> : null }
							{ person?.height ? <Text style={ styles.text }>Height: { person.height }</Text> : null }
							{ person?.weight ? <Text style={ styles.text }>Weight: { person.weight }</Text> : null }
							{ person?.blood_type ? <Text style={ styles.text }>Blood Type: { person.blood_type }</Text> : null }
						</View>
					)
				}
			</View>
		:
			<View>
				<TouchableOpacity
					accessibilityLabel='Add Emergency Details button'
					accessibilityHint={ `Press to navigate to teh screen to add emergency user iformation.`}
					onPress={ nav }
					style={{ flex: 1/3}}
				>
					<Text style={[ styles.home_extra_margin, styles.text_button ]}>Add Emergency Details</Text>
				</TouchableOpacity>
			</View>
		}
		</View>
	);
};


export const MedicalCondition = ({ conditionData }) =>
{
	return (
		<View style={{ marginVertical: 10 }}>
		{
			conditionData[0]?.condition_id ?
			<View>
				<Text style={ styles.title_bar }>Medical Conditions</Text>
				{
					conditionData.map( condition =>			
					<View key={ condition.condition_id } style={ styles.data_section_small }>
						<Text style={ styles.text } > { condition.condition_name }</Text>
					</View>				
				)}
			</View>
			: null
		}
		</View>
	);
};


export const Medication = ({ doctorData, medicationData }) =>
{
	return (
		<View style={{ marginVertical: 10 }}>
		{
			medicationData[0]?.medication_id ?
			<View>
				<Text style={ styles.title_bar }>Medications</Text>
				{
					medicationData.map(( medication, i ) =>
					<View key={ medication.medication_id } style={ styles.data_section_small }>
						{
							medication.is_life_sustaining == 1 ?
							<View>
								<Text style={[ styles.heading_text, styles.alert ]}>Life Sustaining Medication</Text>
								{ medication?.medication_name ? <Text style={[ styles.heading_text, styles.alert ]}>{ medication.medication_name }</Text> : null }
							</View>
							:
							<View>
								{ medication?.medication_name ? <Text style={ styles.heading_text }>{ medication.medication_name }</Text> : null }
							</View>
						}

						{ medication?.strength ? <Text style={ styles.text }>{ medication.strength }</Text> : null }
						{ medication?.frequency ? <Text style={ styles.text }>{ medication.frequency }</Text> : null }
						{ medication?.start_date ? <Text style={ styles.text }>Start date: { medication.start_date }</Text> : null }
						{
							doctorData?.map ( doctor =>
							<View key={ doctor.entity_id } >
							{
								doctor.entity_id == medication.doctor_id ?
								<Text style={ styles.text }>Prescribing doctor: { doctor.entity_name }</Text>
								: null
							}
							</View>
						)}
						{ medication?.note ? <Text style={ styles.text }>Notes: { medication.note }</Text> : null }
					</View>
				)}
			</View>
		: null
		}
		</View>
	);
};


export const Allergy = ({ allergyData }) =>
{
	return (
		<View style={{ marginVertical: 10 }}>
		{
			allergyData[0]?.condition_id ?
			<View>
				<Text style={ styles.title_bar }>Allergies</Text>
				{
					allergyData.map( allergy =>
					<View key={ allergy.condition_id } style={ styles.data_section_small }>
					{
						allergy.severity == 'Life Threatening' ?
						<View>
							{ allergy.severity ? <Text style={[ styles.heading_text, styles.alert ]}>{ allergy.severity } Allergy</Text> : null }
							{ allergy.allergen ? <Text style={[ styles.heading_text, styles.alert ]}>{ allergy.allergen }</Text> : null }
						</View>
						:
						<View>
							{ allergy.severity ? <Text style={ styles.text }>{ allergy.severity } Allergy</Text> : null }
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


export const HealthInsurance = ({ insuranceData }) =>
{
	return (
		<View style={{ marginVertical: 10 }}>
		{
			insuranceData[0]?.insurance_id ?
			<View>
				<Text style={ styles.title_bar }>Health Insurance</Text>
				{
					insuranceData.map( insurance =>
					<View key={ insurance.insurance_id } style={ styles.data_section_small }>

						{ insurance.entity_name ? <Text style={ styles.heading_text }>{ insurance. entity_name } insurance</Text> : null }
						{ insurance.policy_number ? <Text style={ styles.text }>Policy number: { insurance.policy_number }</Text> : null }
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