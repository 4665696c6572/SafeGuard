import { ScrollView, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';
import { TextInput } from 'react-native-paper';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from '@react-native-picker/picker';

import { DeleteDialog } from './deleteDialog.js';

import styles from "../../../styles/styles.js";

const underlay_color = '#d1dce4ff';


export const Allergy = ({ allergyData, setAllergyIndex, setEditAllergyVisible, setViewAllergyVisible }) =>
{
		return (
		<View style={[ styles.data_container_view, { flex: 2 } ]}>
			<Text style={ styles.title_bar }>Allergies</Text>
			<ScrollView>
			{
				allergyData[0]?.condition_id ?
				<View>
				{
					allergyData.map(( allergy, i ) =>
					<View key={ allergy.condition_id } style={ styles.text_list }>
					{
						allergy.severity == 'Life Threatening' ?
						<View style={{ flex: 1 }}>
							{ allergy.severity ? <Text style={[ styles.text, styles.alert ]}>{ allergy.severity } Allergy</Text> : null }
							{ allergy.allergen ? <Text style={[ styles.text, styles.alert ]}>{ allergy.allergen }</Text> : null }
						</View>
						:
						<View style={{ flex: 1 }}>
							{ allergy.allergen ? <Text style={[ styles.text, { textAlignVertical: 'center' }]}>{ allergy.allergen }</Text> : null }
						</View>
					}

						<TouchableOpacity
							accessibilityLabel='Expand button'
							accessibilityHint='Press to view additional details.'
							style={ styles.expand_button }
							onPress={ ( ) =>
							{
								setViewAllergyVisible( true );
								setAllergyIndex( i );
							}}
						>
							<Text style={ styles.text }>{ '< >' }</Text>
						</TouchableOpacity>
					</View>
				)}
				</View>
			: null
			}

				<TouchableOpacity
					onPress={ ( ) => setEditAllergyVisible( true )}
					style={ styles.data_button_size }
				>
					<Text style={ styles.text_button }>Add new allergy</Text>
				</TouchableOpacity>
			</ScrollView>
		</View>
	);
};



export const ViewAllergy = ({
								allergyData, allergyIndex, doctorData, medicationData, setAllergyIndex,
								setEditAllergyVisible, setTempAllergyData, setViewAllergyVisible
							}) =>
{
	return (
		<View style={ styles.data_container_view }>
			{/* Allergen & Severity */}
			<View>
				{
					allergyData[allergyIndex].severity == 'Life Threatening' ?
					<View>
						<Text style={[ styles.alert, { fontSize: 22 } ]}>{ allergyData[allergyIndex].severity } Allergy</Text>
						<Text style={ styles.title_bar }>
							{ allergyData[allergyIndex].allergen } Allergy
						</Text>
					</View>
					:
					<View>
						<Text style={ styles.title_bar }>
							{ allergyData[allergyIndex].allergen } Allergy
						</Text>
						<View style={ styles.data_section_small }>
							<Text style={ styles.heading_text }>Allergy severity</Text>
							<Text style={ styles.text }>{ allergyData[allergyIndex].severity }</Text>
						</View>
					</View>
				}
			</View>

			{/* Diagnosis Date */}
			<View style={ styles.data_section_small }>
				<Text style={ styles.heading_text }>Diagnosis Date</Text>
				<Text key={ allergyData[allergyIndex].diagnosis_date } style={ styles.text }>
					{ allergyData[allergyIndex].diagnosis_date }
				</Text>
			</View>

			{/* Doctor */}
			{ doctorData.map ( doctor =>
				<View key={ doctor.entity_id }>
				{
					doctor.entity_id == allergyData[allergyIndex].doctor_id ?
					<View style={ styles.data_section_small }>
						<Text style={ styles.heading_text }>Doctor</Text>
						<Text style={ styles.text }>{ doctor.entity_name }</Text>
					</View>
					: null
				}
				</View>
			)}

			{/* allergy notes */}
			{
				allergyData[allergyIndex]?.condition_note ?
				<View style={ styles.data_section_small }>
					<Text style={ styles.heading_text }>Allergy notes</Text>
					<Text key={ allergyData[allergyIndex].condition_note } style={ styles.text }>
						{ allergyData[allergyIndex].condition_note }
					</Text>
				</View>
			: null
			}

			{/* Medication(s) */}
			<View style={ styles.data_section_small }>
				<Text style={ styles.heading_text }>Medication(s)</Text>
				{
					medicationData?.map( medication =>
					<View key={ medication.medication_id }>
					{
						medication.condition_id == allergyData[allergyIndex].condition_id ?
						<View>
							<Text style={ styles.text }>{ medication.medication_name }</Text>
						</View>
						:
						null
					}
					</View>
				)}
			</View>


			{/* Close/Edit button row */}
			<View style={ styles.save_row }>
				<TouchableOpacity
					accessibilityLabel='Close button'
					accessibilityHint='Press to close allergy details screen.'
					style={ styles.button_end }
					onPress={ ( ) =>
					{
						setAllergyIndex( null );
						setViewAllergyVisible( false );
					}}
				>
					<Text style={ styles.save_button_text }>Close</Text>
				</TouchableOpacity>

				<TouchableOpacity
					accessibilityLabel='Edit button'
					accessibilityHint='Press to edit allergy details.'
					style={ styles.button_end }
					onPress={ ( ) =>
					{
						setEditAllergyVisible( true );
						setTempAllergyData({ ...allergyData[allergyIndex] } );
						setViewAllergyVisible( false );
					}}
				>
					<Text style={ styles.save_button_text }>Edit</Text>
				</TouchableOpacity>
			</View>
	</View>
	);
};



export const EditAllergy = ({
								allergyData, allergyIndex, deleteEntry, doctorData, saveEntry, setAllergyIndex,
								setEditAllergyVisible, setTempAllergyData, tempAllergyData
							}) =>
{
	const [ deleteAllergyVisible, setDeleteAllergyVisible ] = useState( false );

	// Date Picker
	const [ isDatePickerVisible, setDatePickerVisibility ] = useState( false );
	const showDatePicker = ( ) => setDatePickerVisibility( true );
	const hideDatePicker = ( ) => setDatePickerVisibility( false );

	const handleConfirm = ( date ) =>
	{
		setTempAllergyData( prev => ({ ...prev, 'diagnosis_date': date.toISOString( ).slice( 0,10 )}));
		hideDatePicker( );
	};


	// Form Validation ( Allergies must have an allergen name )
	const [ allergenName, setAllergenName ] = useState( tempAllergyData?.allergen ? tempAllergyData.allergen : '' );
	const [ errors, setErrors ] = useState({ });
	const [ isFormValid, setIsFormValid ] = useState( false );
	const [ showValidationError, setShowValidationError ] = useState( false );

	useEffect(( ) =>
	{
		validateForm( );
	}, [ allergenName ]);

	const validateForm = ( ) =>
	{
		let errors = {};

		// Validate name field
		if ( allergenName == '' )    errors.allergenName = 'Allergen name is required.';

		// Set the errors and update form validity
		setErrors( errors );
		setIsFormValid( Object.keys( errors ).length === 0 );
	};


	const handleCancel = ( ) =>
	{
		setDeleteAllergyVisible( false );
	};

	const handleDelete = ( ) =>
	{
		
		deleteEntry( 'Allergy', tempAllergyData.condition_id );
		setDeleteAllergyVisible( false );
		handlePress( true );
	};

	// Close / Save button handler for Edit modal
	function handlePress( close )
	{
		// If no changes have been made or user presses cancel button, close the edit Modal
		if
		(
			JSON.stringify( allergyData[allergyIndex] ) === JSON.stringify( tempAllergyData ) ||
			tempAllergyData == undefined || close == true
		)
		{
			setAllergyIndex( null );
			setAllergenName( '' );
			setEditAllergyVisible( false );
			setTempAllergyData( );
			return;
		}

		// Only triggers save( insert/update ) if min of medication name has been entered ( or already exists )
		if ( isFormValid && close != true )
		{
			saveEntry( 'Allergy', tempAllergyData, 'condition_id' );
			setAllergyIndex( null );
			setAllergenName( '' );
			setEditAllergyVisible( false );
			setTempAllergyData( );
			setShowValidationError( false );
		}
		else    setShowValidationError( true );
	}


	return (
		<View style={ styles.data_container_edit }>
			<View style={{ flex: 3 }}>
				<TextInput
					accessibilityLabel='Allergen name'
					accessibilityHint='Type in name of allergen.'
					style={ styles.text_input }
					placeholder={ tempAllergyData?.allergen ? tempAllergyData.allergen : 'Allergen name' }
					onChangeText={ ( text ) =>
					{
						setAllergenName( text );
						setTempAllergyData( prev => ({ ...prev, 'allergen': text }));
						setTempAllergyData( prev => ({ ...prev, 'condition_name': 'Allergy' }));
						setTempAllergyData( prev => ({ ...prev, 'is_allergy': 1 }));
					}}
				/>


				<View style={ styles.picker_view }>
					<Picker
						accessibilityLabel='Severity menu'
						accessibilityHint='Select the severity of your allergy.'
						selectedValue={ tempAllergyData?.severity ? tempAllergyData.severity : 'Severity' }
						style={ styles.picker }
						onValueChange={( itemValue ) =>
						{
							setTempAllergyData( prev => ({ ...prev, 'severity': itemValue, }));
						}}
					>
						<Picker.Item color='black' enabled={ false } label='Severity' value='' />
						<Picker.Item accessibilityLabel='menuitem' label='Mild' value='Mild' />
						<Picker.Item accessibilityLabel='menuitem' label='Moderate' value='Moderate' />
						<Picker.Item accessibilityLabel='menuitem' label='Severe' value='Severe' />
						<Picker.Item accessibilityLabel='menuitem' color='#7e0404' label='Life Threatening' value='Life Threatening' />
					</Picker>
				</View>

				{/* Select existing Doctor */}
				{
					doctorData?.length > 0 ?
					<View style={ styles.picker_view }>
						<Picker
							selectedValue={ tempAllergyData?.doctor_id ? tempAllergyData.doctor_id : 'Doctor' }
							style={ styles.picker }
							onValueChange={ itemValue =>
							{
								setTempAllergyData( prev => ({ ...prev, 'doctor_id': itemValue }));
							}}
							>
							<Picker.Item label='Doctor' value='' color='black' enabled={ false }/>
							{
								doctorData.map( doctor =>
								<Picker.Item
									key={ doctor.entity_id }
									label={ doctor.entity_name }
									value={ doctor.entity_id }
								/>
							)}
						</Picker>
					</View>
					: null
				}

				{/* Date of Diagnosis */}
				<TouchableHighlight
					accessibilityLabel="Date picker"
					accessibilityHint="Touch to open date picker for diagnosis date."
					onPress={ showDatePicker }
					style={ styles.menu }
					underlayColor={ underlay_color }
					>
					<Text style={[ styles.text_input, styles.menu_text ]}>
						{ tempAllergyData?.diagnosis_date ? tempAllergyData.diagnosis_date : 'Date of diagnosis' }
					</Text>
				</TouchableHighlight>

				<DateTimePickerModal
					isVisible={ isDatePickerVisible }
					mode="date"
					onConfirm={ handleConfirm }
					onCancel={ hideDatePicker }
				/>

				<TextInput
					accessibilityLabel='Allergy notes'
					accessibilityHint='Type in allergy notes.'
					placeholder={ tempAllergyData?.condition_note ? tempAllergyData.condition_note : 'Notes' }
					style={ styles.text_input }
					onChangeText={ ( text ) =>
					{
						setTempAllergyData( prev => ({ ...prev, 'condition_note': text }))}
					}
				/>


				{/* Cancel/Save button row */}
				<View style={ styles.save_row }>
					{/* Cancel Button */}
					<TouchableOpacity
						accessibilityLabel='Cancel button'
						accessibilityHint='Press to cancel adding or editing this allergy.'
						onPress={ ( ) => handlePress( true )}
						style={ styles.button_end }
					>
						<Text style={ styles.save_button_text }>Cancel</Text>
					</TouchableOpacity>

					{/* Save Button */}
					<TouchableOpacity
						accessibilityLabel='Save button'
						accessibilityHint='Press to save changes.'
						onPress={ ( ) => handlePress( ) }
						style={ styles.button_end }
					>
						<Text style={ styles.save_button_text }>Save</Text>
					</TouchableOpacity>
				</View>

				{/* Form Validation Error */}
				{
					showValidationError ?
					<View style={{ alignItems: 'center' }}>
						<Text style={[ styles.alert, styles.text ]}>{ errors.allergenName }</Text>
					</View>
					: null
				}
			</View>


			{/* Delete */}
			<DeleteDialog
				buttonVisibleCondition={ tempAllergyData?.condition_id }
				description={ 'allergy' }
				dialogVisible={ deleteAllergyVisible }
				handleCancel={ handleCancel }
				handleDelete={ handleDelete }
				setDialogVisible={ setDeleteAllergyVisible }
				title={ `${ tempAllergyData?.allergen } Allergy` }
			/>
		</View>
	);
}