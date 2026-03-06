import { ScrollView, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';
import { TextInput } from 'react-native-paper';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from '@react-native-picker/picker';

import styles from "../../../styles/styles.js";

const underlay_color = '#d1dce4ff';


export const MedicalCondition = ({ conditionData, setConditionIndex, setEditConditionVisible, setViewConditionVisible }) =>
{
	return (
		<View style={[ styles.data_container_view, styles.data_condition_height ]}>
			<Text style={ styles.title_bar }>Medical Conditions</Text>
			<ScrollView>
			{
				conditionData[0]?.condition_id ?
				<View>
				{
					conditionData.map(( condition, i ) =>
					<View key={ condition.condition_id } style={ styles.text_list }>
						<View style={{ flex:0.9 }}>
							<Text style={ styles.text }> { condition.condition_name }</Text>
						</View>

						<TouchableOpacity
							accessibilityLabel='Expand button'
							accessibilityHint='Press to view additional details.'
							style={ styles.expand_button }
							onPress={ ( ) =>
							{
								setConditionIndex( i );
								setViewConditionVisible( true );
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
					accessibilityLabel='Add medical conditions button'
					accessibilityHint={ 'Press to Add new medical condition.' }
					onPress={ ( ) => setEditConditionVisible( true )}
					style={ styles.data_button_size }
				>
					<Text style={ styles.text_button }>Add new medical condition</Text>
				</TouchableOpacity>
			</ScrollView>
		</View>
	);
};



export const ViewMedicalCondition = ({
										conditionData, conditionIndex, doctorData, medicationData, setConditionIndex,
										setEditConditionVisible, setTempConditionData, setViewConditionVisible
									}) =>
{
	return (
		<View style={ styles.data_container_view }>
			{/* Condition name */}
			{
				conditionData[conditionIndex].condition_name.length > 30 ?
				<Text style={[ styles.title_bar, styles.text_button, styles.text ]}>
					{ conditionData[conditionIndex].condition_name }
				</Text>
				:
				<Text style={ styles.title_bar }>
					{ conditionData[conditionIndex].condition_name }
				</Text>
			}

			{/* Diagnosis Date */}
			{
				conditionData[conditionIndex]?.diagnosis_date ?
				<View style={ styles.data_section_small }>
					<Text style={ styles.heading_text }>Diagnosis Date</Text>
					<Text key={ conditionData[conditionIndex].diagnosis_date } style={ styles.text }>
						{ conditionData[conditionIndex].diagnosis_date }
					</Text>
				</View>
			: null
			}

			{/* Doctor */}
			{ doctorData.map ( doctor =>
				<View key={ doctor.entity_id } >
				{
					doctor.entity_id == conditionData[conditionIndex].doctor_id ?
					<View style={ styles.data_section_small }>
						<Text style={ styles.heading_text }>Doctor</Text>
						<Text style={ styles.text }>{ doctor.entity_name }</Text>
					</View>
					: null
				}
				</View>
			)}

			{/* Condition notes */}
			{
				conditionData[conditionIndex]?.condition_note ?
				<View style={ styles.data_section_small }>
					<Text style={ styles.heading_text }>Condition notes</Text>
					<Text key={ conditionData[conditionIndex].condition_note } style={ styles.text }>
						{ conditionData[conditionIndex].condition_note }
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
						medication.condition_id == conditionData[conditionIndex].condition_id ?
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
					accessibilityHint='Press to close medical condition details screen.'
					style={ styles.button_end }
					onPress={ ( ) =>
					{
						setConditionIndex( null );
						setViewConditionVisible( false );
					}}
				>
					<Text style={ styles.save_button_text }>Close</Text>
				</TouchableOpacity>

				<TouchableOpacity
					accessibilityLabel='Edit button'
					accessibilityHint='Press to edit medical condition details.'
					style={ styles.button_end }
					onPress={ ( ) =>
					{
						setEditConditionVisible( true );
						setTempConditionData({ ...conditionData[conditionIndex] } );
						setViewConditionVisible( false );
					}}
				>
					<Text style={ styles.save_button_text }>Edit</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};



// For adding or editing
export const EditMedicalCondition = ({
										conditionData, conditionIndex, deleteEntry, doctorData, saveEntry, setConditionIndex,
										setEditConditionVisible, setTempConditionData, tempConditionData
									}) =>
{
	const [ deleteConditionVisible, setDeleteConditionVisible ] = useState( false );

	// Date Picker
	const [ isDatePickerVisible, setDatePickerVisibility ] = useState( false );
	const showDatePicker = ( ) => setDatePickerVisibility( true );
	const hideDatePicker = ( ) => setDatePickerVisibility( false );

	const handleConfirm = ( date ) =>
	{
		setTempConditionData( prev => ({ ...prev, 'diagnosis_date': date.toISOString( ).slice( 0,10 )}));
		hideDatePicker( );
	};


	// Form Validation ( Conditions must have an condition name ).
	const [ conditionName, setConditionName ] = useState( tempConditionData?.condition_name ? tempConditionData.condition_name : '' );
	const [ errors, setErrors ] = useState({ });
	const [ isFormValid, setIsFormValid ] = useState( false );
	const [ showValidationError, setShowValidationError ] = useState( false );


	useEffect(( ) =>
	{
		validateForm( );
	}, [ conditionName ]);


	const validateForm = ( ) =>
	{
		let errors = {};

		// Validate name field
		if ( conditionName == '' )
		{
			errors.conditionName = 'Condition name is required.';
		}

		// Set the errors and update form validity
		setErrors( errors );
		setIsFormValid( Object.keys( errors ).length === 0 );
	};


	const handleCancel = ( ) =>
	{
		setDeleteConditionVisible( false );
	};


	const handleDelete = ( ) =>
	{
		deleteEntry( 'Medical_Condition', tempConditionData.condition_id );
		setDeleteConditionVisible( false );
		handlePress( true );
	};


	// Close / Save button handler for Edit modal
	function handlePress( close )
	{
		// If no changes have been made or user presses cancel button, close the edit Modal
		if
		(
			JSON.stringify( conditionData[conditionIndex] ) === JSON.stringify( tempConditionData )
			|| close == true
		)
		{
			setConditionIndex( null );
			setConditionName( '' );
			setEditConditionVisible( false );
			setTempConditionData( );
			return;
		}

		// Only triggers save( insert/update ) if min of medication name has been entered ( or already exists ).
		if ( isFormValid )
		{
			saveEntry( 'Medical_Condition', tempConditionData, 'condition_id' );

			setConditionIndex( null );
			setConditionName( '' );
			setEditConditionVisible( false );
			setTempConditionData( );
		}
		else    setShowValidationError( true );
	}


	return (
		<View style={ styles.data_container_edit }>
			<View style={{ flex: 3 }}>
				{/* Condition name */}
				<TextInput
					accessibilityLabel='Condition name'
					accessibilityHint='Type in name of medical condition.'
					style={ styles.text_input }
					placeholder={ tempConditionData?.condition_name ? tempConditionData.condition_name : 'Condition Name' }
					onChangeText={ ( text ) =>
					{
						setConditionName( text );
						setTempConditionData( prev => ({ ...prev, 'condition_name': text }));
						setTempConditionData( prev => ({ ...prev, 'is_allergy': 0 }));
					}}
				/>

				{/* Select existing Doctor */}
				{
					doctorData?.length > 0 ?
					<View style={ styles.picker_view }>
						<Picker
							accessibilityLabel='Doctor menu'
							accessibilityHint='Select a doctor.'
							selectedValue={ tempConditionData?.doctor_id ? tempConditionData.doctor_id : 'Doctor' }
							style={ styles.picker }
							onValueChange={ itemValue =>
							{
								setTempConditionData( prev => ({ ...prev, 'doctor_id': itemValue }));
							}}
							>
							<Picker.Item color='black' enabled={ false } label='Doctor' value='' />
							{
								doctorData.map( doctor =>
								<Picker.Item
									accessibilityLabel='menuitem'
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
						style={ styles.menu }
						underlayColor={ underlay_color }
						onPress={ showDatePicker }
					>
						<Text style={[ styles.text_input, styles.menu_text ]}>
							{ tempConditionData?.diagnosis_date ? tempConditionData.diagnosis_date : 'Date of diagnosis' }
						</Text>
					</TouchableHighlight>

					<DateTimePickerModal
						isVisible={ isDatePickerVisible }
						mode="date"
						onConfirm={ handleConfirm }
						onCancel={ hideDatePicker }
					/>

				{/* Condition notes */}
				<TextInput
					accessibilityLabel='Condition notes'
					accessibilityHint='Type in medical condition notes.'
					style={ styles.text_input }
					placeholder={ tempConditionData?.condition_note ? tempConditionData.condition_note : 'Notes' }
					onChangeText={ ( text ) =>
					{
						setTempConditionData( prev => ({ ...prev, 'condition_note': text }));
					}}
				/>


					{/* Cancel/Save button row */}
					<View style={ styles.save_row }>
					{/* Cancel Button */}
					<TouchableOpacity
						accessibilityLabel='Cancel button'
						accessibilityHint='Press to cancel adding or editing this medical condition.'
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
					<View style={ styles.alert_row }>
						<Text style={ styles.alert }>{ errors.conditionName }</Text>
					</View>
				: null
				}
			</View>


			{/* Delete */}
			<DeleteDialog
				buttonVisibleCondition={ tempConditionData?.condition_id }
				description={ 'condition' }
				dialogVisible={ deleteConditionVisible }
				handleCancel={ handleCancel }
				handleDelete={ handleDelete }
				setDialogVisible={ setDeleteConditionVisible }
				title={ tempConditionData?.condition_name }
			/>
		</View>
	);
}