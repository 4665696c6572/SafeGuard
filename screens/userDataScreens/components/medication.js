import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Checkbox, TextInput } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

import styles from "../../../styles/styles.js";

const underlay_color = '#d1dce4ff';


export const Medication = ({ medicationData, setEditMedicationVisible, setMedicationIndex, setViewMedicationVisible }) =>
{
	return (
		<View style={ styles.container }>
			<View style={ styles.data_container }>
				<Text style={ styles.title_bar }>Medications</Text>
				<ScrollView>
				{
					medicationData.map(( medication, i) =>
					<View key={medication.medication_id} style={ styles.text_list }>
						{
							medication.is_life_sustaining == 1 ?
							<View style={{flex:0.9}}>
								<Text style={[ styles.text, styles.alert ]}>Life Sustaining Medication</Text>
								{ 
									medication?.medication_name ?
									<Text style={[ styles.text, styles.alert ]}>
										{ medication.medication_name } {medication?.strength}
									</Text>
								: null 
								}
							</View>
							:
							<View style={{flex:0.9}}>
								{ 
									medication?.medication_name ?
									<Text style={ styles.text }>
										{ medication.medication_name } {medication?.strength}
									</Text>
								: null
								}
							</View>
						}

						<TouchableOpacity
							style={ styles.expand_button }
							onPress={ ( ) =>
							{
								setViewMedicationVisible( true );
								setMedicationIndex( i );
							}}
						>
							<Text style={ styles.text }>{'< >'}</Text>
						</TouchableOpacity>
					</View>
				)}


					<TouchableOpacity
						onPress={ ( ) => setEditMedicationVisible( true )}
						style={ styles.data_button_size }
					>
						<Text style={styles.text_button}>Add new medication</Text>
					</TouchableOpacity>
				</ScrollView>
			</View>
		</View>
	);
};


export const ViewMedication = ({
									conditionData, doctorData, medicationData,
									medicationIndex, setEditMedicationVisible, setMedicationIndex,
									setTempMedicationData, setViewMedicationVisible
								}) =>
{
	return (
		<View style={ styles.container }>
			<View style={ styles.data_container }>
			{
				medicationData?.[medicationIndex].is_life_sustaining == 1 ?
				<View>
					<Text style={[ styles.heading_text, styles.alert ]}>Life Sustaining Medication</Text>
					{ 
						medicationData?.[medicationIndex].medication_name ? 
						<Text style={[ styles.heading_text, styles.alert ]}>
							{ medicationData?.[medicationIndex].medication_name }
						</Text> 
					: null 
					}
				</View>
				:
				<View>
					{ 
						medicationData?.[medicationIndex].medication_name ? 
						<Text style={ styles.heading_text }>
							{ medicationData?.[medicationIndex].medication_name }
						</Text> 
					: null 
					}
				</View>
			}

				<View key={ medicationData?.[medicationIndex].medication_id } style={{ justifyContent: 'space-between', gap: 1 }}>
					{
						medicationData?.[medicationIndex]?.strength ?
						<View style={ styles.section_small }>
							<Text style={ styles.heading_text }>Strength</Text>
							<Text style={ styles.text }>{ medicationData?.[medicationIndex].strength }</Text>
						</View>
					: null
					}

					{
						medicationData?.[medicationIndex]?.frequency ?
						<View style={ styles.section_small }>
							<Text style={ styles.heading_text }>Frequency</Text>
							<Text style={ styles.text }>{ medicationData?.[medicationIndex].frequency }</Text>
						</View>
					: null
					}

					{
						medicationData?.[medicationIndex]?.start_date ?
						<View style={ styles.section_small }>
							<Text style={ styles.heading_text }>Start date</Text>
							<Text style={ styles.text }>{ medicationData?.[medicationIndex].start_date }</Text>
						</View>
					: null
					}

					{
						medicationData?.[medicationIndex]?.medication_note?
						<View style={ styles.section_small }>
							<Text style={ styles.heading_text }>Note</Text>
							<Text style={ styles.text }>{ medicationData?.[medicationIndex].medication_note }</Text>
						</View>
					: null
					}

					{
						doctorData.map (doctor =>
						<View key={doctor.entity_id} >
						{
							doctor.entity_id == medicationData[medicationIndex].doctor_id ?
							<View style={ styles.section_small }>
								<Text style={ styles.heading_text }>Doctor</Text>
								<Text style={ styles.text }>{ doctor.entity_name }</Text>
							</View>
							: null
						}
						</View>
					)}

					{
						conditionData.map (condition =>
						<View key={condition.condition_id} >
						{
							condition.condition_id == medicationData[medicationIndex].condition_id ?
								<View style={ styles.section_small }>
								{
									condition.allergen ?
									<View>
										<Text style={ styles.heading_text }>Allergy</Text>
										<Text style={ styles.text }>{ condition.allergen }</Text>
									</View>
								:
									<View>
										<Text style={ styles.heading_text }>Condition</Text>
										<Text style={ styles.text }>{ condition.condition_name }</Text>
									</View>
								}
								</View>
							: null
						}
						</View>
					)}
				</View>


				{/* Close/Edit Button Row */}
				<View style={ styles.save_row }>
					{/* Close Button */}
					<TouchableOpacity
						style={ styles.game_button_end }
						onPress={ ( ) =>
						{
							setMedicationIndex( null );
							setViewMedicationVisible( false );
						}}
					>
						<Text style={ styles.save_button_text }>Close</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={ styles.game_button_end }
						onPress={ ( ) =>
						{
							setEditMedicationVisible( true );
							setTempMedicationData({ ...medicationData[medicationIndex] } );
							setViewMedicationVisible( false );
						}}
					>
						<Text style={ styles.save_button_text }>Edit</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};



export const EditMedication = ({
									conditionData, doctorData, isFormValid, medicationData, medicationIndex,
									saveToDB, setEditMedicationVisible, setIsFormValid,
									setMedicationIndex, setTempMedicationData, tempMedicationData
								}) =>
{

	// Doctor Picker
	const [ selectedDoctor, setSelectedDoctor ] = useState( '' );

	// Condition Picker
	const [ selectedCondition, setSelectedCondition ] = useState( '' );

	const [ lifeSustaining, setLifeSustaining ] = useState( tempMedicationData?.is_life_sustaining ? tempMedicationData.is_life_sustaining : false)

	// Date Picker
	const [ datePickerVisible, setDatePickerVisibility ] = useState( false );

	const showDatePicker = () => setDatePickerVisibility( true );
	const hideDatePicker = () => setDatePickerVisibility( false );

	const handleConfirm = ( date ) =>
	{
		setTempMedicationData( prev => ({ ...prev, 'start_date': date.toISOString().slice( 0,10)}));
		hideDatePicker();
	};


	// Form Validation ( Must (minimally) have a name )
	const [ medicationName, setMedicationName ] = useState( tempMedicationData?.medication_name ? tempMedicationData.medication_name : '' );

	const [ showValidationError, setShowValidationError ] = useState( false );
	const [ errors, setErrors ] = useState({ });

		useEffect(() =>
		{
			validateForm();
		}, [ medicationName ]);

		const validateForm = ( ) =>
		{
			let errors = {};

		// Validate name field
		if ( medicationName == '')    errors.medicationName = 'Medication name is required.';

		// Set the errors and update form validity
		setErrors( errors );
		setIsFormValid(Object.keys( errors ).length === 0);
	};




	// Close / Save button handler for Edit modal
	function handlePress( close )
	{
		// If no changes have been made or user presses cancel button, close the edit Modal
		if (
				JSON.stringify( medicationData[medicationIndex] ) === JSON.stringify(tempMedicationData ) ||
				tempMedicationData == undefined || close == true
			)
		{
			setEditMedicationVisible( false );
			setMedicationIndex( null );
			setMedicationName( '' );
			setTempMedicationData( );
		}

		// Only triggers save( insert/update ) if min of medication name has been entered (or already exists )
		if ( isFormValid)
		{
			saveToDB( tempMedicationData );
			setEditMedicationVisible( false );
			setMedicationIndex( null );
			setMedicationName( '' );
			setTempMedicationData( );
		}
		else    setShowValidationError( true );
	}


	return (
		<View style={ styles.edit_container }>
			<View style={ styles.data_container }>
				<TextInput
					accessibilityLabel='Medication name'
					accessibilityHint='Enter name of medication.'
					style={ styles.text_input }
					placeholder={ tempMedicationData?.medication_name ? tempMedicationData.medication_name : 'Medication name' }
					onChangeText={( text ) =>
					{
						setMedicationName( text );
						setTempMedicationData( prev => ({ ...prev, 'medication_name': text }));
					}}
				/>

				<TextInput
					accessibilityLabel='Medication strength'
					accessibilityHint='Enter strength of medication (example: 500 or 500mg).'
					style={ styles.text_input }
					placeholder={ tempMedicationData?.strength ? tempMedicationData.strength : 'Strength' }
					onChangeText={( text ) => setTempMedicationData( prev => ({ ...prev, 'strength': text }))}
				/>

				<TextInput
					accessibilityLabel='Medication frequency'
					accessibilityHint='Enter dosage frequency (example: every eight hours).'
					style={ styles.text_input }
					placeholder={ tempMedicationData?.frequency ? tempMedicationData.frequency : 'Frequency' }
					onChangeText={( text ) => setTempMedicationData( prev => ({ ...prev, 'frequency': text }))}
				/>


				{/* Select existing Doctor */}
				{
					doctorData?.length > 0 ?
					<View style={ styles.picker_view }>
						<Picker
							accessibilityLabel='Doctor menu'
							accessibilityHint='Select previously entered doctor.'
							selectedValue={ tempMedicationData?.doctor_id ? tempMedicationData.doctor_id : selectedDoctor }
							style={ styles.picker }
							onValueChange={ itemValue =>
									{
										setSelectedDoctor( itemValue );
										setTempMedicationData( prev => ({ ...prev, 'doctor_id': itemValue}))
									}
								}
							>
							<Picker.Item
								color='black'
								enabled={ false }
								label='Doctor'
								value=''
							/>
							{
								doctorData.map(doctor =>
								<Picker.Item
									accessibilityLabel='menuitem'
									key={doctor.entity_id}
									label={doctor.entity_name}
									value={doctor.entity_id}
								/>
							)}
						</Picker>
					</View>
				: null
				}


				<TouchableHighlight
					accessibilityLabel="Date picker"
					accessibilityHint="Touch to open date picker for start date of medication."
					onPress={ showDatePicker }
					style={ styles.menu }
					underlayColor={ underlay_color }
				>
					<Text style={[ styles.text_input, styles.menu_text ]}>{ tempMedicationData?.start_date ? tempMedicationData.start_date : 'Start date:' }</Text>
				</TouchableHighlight>


				<DateTimePickerModal
					isVisible={ datePickerVisible }
					mode="date"
					onConfirm={ handleConfirm }
					onCancel={ hideDatePicker }
				/>


				{/* Select existing Medical Condition */}
				{
					conditionData?.length > 0 ?
					<View style={ styles.picker_view }>
						<Picker
							accessibilityLabel='Medical condition menu'
							accessibilityHint='Select a medical condition.'
							selectedValue={ tempMedicationData?.condition_id  ? tempMedicationData.condition_id  : selectedCondition }
							style={ styles.picker }
							onValueChange={ itemValue =>
							{
								setSelectedCondition( itemValue );
								setTempMedicationData( prev => ({ ...prev,  'condition_id': itemValue }));
							}}
							>
							<Picker.Item color='black' enabled={ false } label='Condition' value='' />
							{
								conditionData.map(condition =>
								<Picker.Item
									accessibilityLabel='menuitem'
									key={ condition.condition_id }
									label={ condition.allergen ? 'Allergy: ' + condition.allergen :  condition.condition_name}
									value={ condition.condition_id }
								/>)
							}
						</Picker>
					</View>
					: null
				}


				<TextInput
					accessibilityLabel='Notes'
					accessibilityHint='Enter medication relevant notes.'
					style={ styles.text_input }
					placeholder={ tempMedicationData?.note ? tempMedicationData.note : 'Notes' }
					onChangeText={( text ) => setTempMedicationData( prev => ({ ...prev, 'medication_note' : text }))}
				/>


				<View style={ styles.checkbox_row }>
					<Text style={ styles.text }>This a life-sustaining medication:</Text>
					<Checkbox
						accessibilityLabel='Life-sustaining medication'
						accessibilityHint='Check the box if this is a life-sustaining medication.'
						color={ lifeSustaining  ? '#3087eb' : undefined }
						value={ lifeSustaining  }
						onValueChange={ ( ) =>
						{
							setLifeSustaining( !lifeSustaining );
							setTempMedicationData( prev => ({ ...prev, 'is_life_sustaining' : !lifeSustaining }));
						}}
					/>
				</View>

				<TouchableOpacity // ~~~
					onPress={ ( ) => { navigation.navigate( "DoctorScreen" ); }}
					style={{ flex: 1/3}}
				>
					<Text style={styles.text_button}>Add new Doctor</Text>
				</TouchableOpacity>


				{/* Close/Save Button Row */}
				<View style={{ flexDirection: 'row', justifyContent: 'space-around', gap: 5}}>
					{/* Close Button */}
					<TouchableOpacity
						accessibilityLabel='Close button'
						accessibilityHint='Press to close medication details screen.'
						style={ styles.game_button_end }
						onPress={ ( ) => handlePress( true )}
					>
						<Text style={ styles.save_button_text }>Close</Text>
					</TouchableOpacity>


					{/* Save Button */}
					<TouchableOpacity
						accessibilityLabel='save button'
						accessibilityHint='Press to save medication details.'
						style={ styles.game_button_end }
						onPress={ ( ) => handlePress( )}
					>
						<Text style={ styles.save_button_text }>Save</Text>
					</TouchableOpacity>
				</View>

				{/* Form Validation Error */}
				{
					showValidationError ?
					<View style={ styles.alert_row }>
						<Text style={[ styles.alert, styles.text ]}>{ errors.medicationName }</Text>
					</View>
				: null
				}
			</View>
		</View>
	);
}