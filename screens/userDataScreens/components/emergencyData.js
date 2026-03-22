import { Text, TouchableOpacity, View } from 'react-native';

import styles from "../../../styles/styles";

// This file contains components for each category on the Emergency Data Screen.


export const Person = ({ entityData, nav }) =>
{
	return (
		<View>
			<TouchableOpacity
				accessibilityLabel='Navigation Button'
				accessibilityHint='Press to add emergency user information.'
				disabled={ entityData[0]?.entity_name ? false : true }
				onPress={ nav }
			>
				<Text style={ styles.title_bar }>Personal Information</Text>
			</TouchableOpacity>
			{
				entityData[0]?.entity_name ?
				<View>
				{
					entityData.map( person =>
						<View key={ person.entity_id } style={ styles.data_section_small }>
						{
							person?.entity_name ?
							<Text style={ styles.heading_text }>
								{ person.entity_name }
							</Text>
						: null
						}

						{
							person?.dob ?
							<Text style={ styles.text }>
								Date of birth: { person.dob }
							</Text>
						: null
						}

						{
							person?.sex ?
							<Text style={ styles.text }>
								Sex: { person.sex }
							</Text>
						: null
						}

						{
							person?.height ?
							<Text style={ styles.text }>
								Height: { person.height }
							</Text>
						: null
						}

						{
							person?.weight ?
							<Text style={ styles.text }>
								Weight: { person.weight }
							</Text>
						: null
						}

						{
							person?.blood_type ?
							<Text style={ styles.text }>
								Blood Type: { person.blood_type }
							</Text>
						: null
						}
						</View>
					)
				}
				</View>
			:
				<TouchableOpacity
					accessibilityLabel='Navigation Button'
					accessibilityHint='Press to add emergency user information.'
					onPress={ nav }
					style={ styles.data_section_small }
				>
					<Text style={ styles.text_button }>Add emergency user information</Text>
				</TouchableOpacity>
			}
		</View>
	);
};




export const Allergy = ({ allergyData, nav }) =>
{
	return (
		<View style={{ marginVertical: 10 }}>
			<TouchableOpacity
				accessibilityLabel='Navigation Button'
				accessibilityHint='Press to add medication details.'
				disabled={ allergyData[0]?.condition_id ? false : true }
				onPress={ nav }
			>
				<Text style={ styles.title_bar }>Allergies</Text>
			</TouchableOpacity>
			{
				allergyData[0]?.condition_id ?
				<View>
				{
					allergyData.map( allergy =>
					<View key={ allergy.condition_id } style={ styles.data_section_small }>
					{
						allergy.severity == 'Life Threatening' ?
						<View>
						{
							allergy.severity ?
							<Text style={[ styles.heading_text, styles.alert ]}>
								{ allergy.severity } Allergy
							</Text>
						: null
						}

						{
							allergy.allergen ?
							<Text style={[ styles.heading_text, styles.alert ]}>
								{ allergy.allergen }
							</Text>
						: null
						}
						</View>
						:
						<View>
						{
							allergy.severity ?
							<Text style={ styles.text }>
								{ allergy.severity } Allergy
							</Text>
						: null
						}

						{
							allergy.allergen ?
							<Text style={ styles.text }>
								{ allergy.allergen }
							</Text>
						: null
						}
						</View>
					}
					</View>
				)}
				</View>
			:
				<TouchableOpacity
					accessibilityLabel='Navigation Button'
					accessibilityHint='Press to add allergy details.'
					onPress={ nav }
					style={ styles.data_section_small }
				>
					<Text style={ styles.text_button }>Add allergy details</Text>
				</TouchableOpacity>
			}
		</View>
	);
};


export const MedicalCondition = ({ conditionData, nav }) =>
{
	return (
		<View style={{ marginVertical: 10 }}>
			<TouchableOpacity
				accessibilityLabel='Navigation Button'
				accessibilityHint='Press to add medical condition details.'
				disabled={ conditionData[0]?.condition_id ? false : true }
				onPress={ nav }
			>
				<Text style={ styles.title_bar }>Medical Conditions</Text>
			</TouchableOpacity>
			{
				conditionData[0]?.condition_id ?
				<View>
					{
						conditionData.map( condition =>
						<View key={ condition.condition_id } style={ styles.data_section_small }>
							<Text style={ styles.text } > { condition.condition_name }</Text>
						</View>
					)}
				</View>
			:
				<TouchableOpacity
					accessibilityLabel='Navigation Button'
					accessibilityHint='Press to add medical condition details.'
					onPress={ nav }
					style={ styles.data_section_small }
				>
					<Text style={ styles.text_button }>Add medical condition details</Text>
				</TouchableOpacity>
			}
		</View>
	);
};


export const Medication = ({ doctorData, medicationData, nav}) =>
{
	return (
		<View style={{ marginVertical: 10 }}>
			<TouchableOpacity
				accessibilityLabel='Navigation Button'
				accessibilityHint='Press to add medication details.'
				disabled={ medicationData[0]?.medication_id ? false : true }
				onPress={ nav }
			>
				<Text style={ styles.title_bar }>Medications</Text>
			</TouchableOpacity>
		{
			medicationData[0]?.medication_id ?
			<View>
			{
				medicationData.map(( medication, i ) =>
				<View key={ medication.medication_id } style={ styles.data_section_small }>
					{
						medication.is_life_sustaining == 1 ?
						<View>
							<Text style={[ styles.heading_text, styles.alert ]}>
								Life Sustaining Medication
							</Text>
							{
								medication?.medication_name ?
								<Text style={[ styles.heading_text, styles.alert ]}>
									{ medication.medication_name }
								</Text>
							: null
							}
						</View>
						:
						<View>
						{
							medication?.medication_name ?
							<Text style={ styles.heading_text }>
								{ medication.medication_name }
							</Text>
						: null
						}
						</View>
					}

					{
						medication?.strength ?
						<Text style={ styles.text }>
							{ medication.strength }
						</Text>
					: null
					}

					{
						medication?.frequency ?
						<Text style={ styles.text }>
							{ medication.frequency }
						</Text>
					: null
					}

					{
						medication?.start_date ?
						<Text style={ styles.text }>
							Start date: { medication.start_date }
						</Text>
					: null
					}

					{
						doctorData?.map ( doctor =>
						<View key={ doctor.entity_id } >
						{
							doctor.entity_id == medication.doctor_id ?
							<Text style={ styles.text }>
								Prescribing doctor: { doctor.entity_name }
							</Text>
							: null
						}
						</View>
					)}

					{
						medication?.medication_note ?
						<Text style={ styles.text } >
							Notes: { medication.medication_note }
						</Text>
					: null
					}
				</View>
			)}
			</View>
		:
			<TouchableOpacity
				accessibilityLabel='Navigation Button'
				accessibilityHint='Press to add medication details.'
				onPress={ nav }
				style={ styles.data_section_small }
			>
				<Text style={ styles.text_button }>Add medication details</Text>
			</TouchableOpacity>
		}
		</View>
	);
};


export const HealthInsurance = ({ insuranceData, nav }) =>
{
	return (
		<View style={{ marginVertical: 10 }}>
			<TouchableOpacity
				accessibilityLabel='Navigation Button'
				accessibilityHint='Press to add medication details.'
				disabled={ insuranceData[0]?.insurance_id ? false : true }
				onPress={ nav }
			>
				<Text style={ styles.title_bar }>Health Insurance</Text>
			</TouchableOpacity>
			{
				insuranceData[0]?.insurance_id ?
				<View>
					{
						insuranceData.map( insurance =>
						<View key={ insurance.insurance_id } style={ styles.data_section_small }>
						{
							insurance.entity_name ?
							<Text style={ styles.heading_text }>
								{ insurance. entity_name } insurance
							</Text>
						: null
						}

						{
							insurance.policy_number ?
							<Text style={ styles.text }>
								Policy number: { insurance.policy_number }
							</Text>
						: null
						}

						{
							insurance.start_date ?
							<Text style={ styles.text }>
								Start date: { insurance.start_date } insurance
							</Text>
						: null
						}

						{
							insurance.insurance_note ?
							<Text style={ styles.text }>
								Notes: { insurance.insurance_note }
							</Text>
						: null
						}
						</View>
					)}
				</View>
			:
				<TouchableOpacity
					accessibilityLabel='Navigation Button'
					accessibilityHint='Press to add health insurance details.'
					onPress={ nav }
					style={ styles.data_section_small }
				>
					<Text style={ styles.text_button }>Add health insurance details</Text>
				</TouchableOpacity>
			}
		</View>
	);
};