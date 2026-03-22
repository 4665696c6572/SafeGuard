import * as NavigationBar from 'expo-navigation-bar';
import { SquareArrowDiagonal01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import { useEffect, useState } from 'react';
import { Keyboard, ScrollView, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from '@react-native-picker/picker';

import { DeleteDialog } from './deleteDialog.js';

import styles from "../../../styles/styles.js";

const underlay_color = '#d1dce4ff';


export const MedicalCondition = ({
									conditionData, setConditionIndex,
									setEditConditionVisible, setViewConditionVisible
								}) =>
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
							<Text style={ styles.text }>{ condition.condition_name }</Text>
						</View>

						<TouchableOpacity
							accessibilityLabel='Expand button'
							accessibilityHint='Press to view additional details.'
							onPress={ ( ) =>
							{
								setConditionIndex( i );
								setViewConditionVisible( true );
								// navigation bar hidden in modals.
								NavigationBar.setVisibilityAsync( "hidden" );
							}}
							style={ styles.expand_button }
						>
							<HugeiconsIcon
								icon={ SquareArrowDiagonal01Icon }
								size={ 24 }
								color="black"
								strokeWidth={ 1.25 }
							/>
						</TouchableOpacity>
					</View>
				)}
				</View>
			: null
			}

				<TouchableOpacity
					accessibilityLabel='Add medical conditions button'
					accessibilityHint={ 'Press to Add new medical condition.' }
					onPress={ ( ) =>
					{
						setEditConditionVisible( true );
						// navigation bar hidden in modals.
						NavigationBar.setVisibilityAsync( "hidden" );
					}}
					style={ styles.data_button_size }
				>
					<Text style={ styles.text_button }>Add new medical condition</Text>
				</TouchableOpacity>
			</ScrollView>
		</View>
	);
};



export const ViewMedicalCondition = ({
										closeView, conditionData, conditionIndex, doctorData,
										medicationData, setEditConditionVisible,
										setTempConditionData, setViewConditionVisible
									}) =>
{
	// If medications are associated with this condition, don't display the medication header
	const [ medicationVisible, setMedicationVisible ]  = useState( false );
	useEffect( ( ) =>
	{
		for (const item of medicationData)
		{
			if(  item.condition_id == conditionData[conditionIndex].condition_id )
			{
				setMedicationVisible( true );
			}
		}
	}, [ ]);

	return (
		<View style={[ styles.data_container_view, { marginTop: 38 } ]}>
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
					<Text
						key={ conditionData[conditionIndex].condition_note }
						style={ styles.text }
					>
						{ conditionData[conditionIndex].condition_note }
					</Text>
				</View>
			: null
			}


			{/* Medication(s) */}
			{
				medicationVisible ?
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
			: null
			}


			{/* Close/Edit button row */}
			<View style={ styles.save_row }>
				<TouchableOpacity
					accessibilityLabel='Close button'
					accessibilityHint='Press to close medical condition details screen.'
					onPress={ ( ) => closeView( ) }
					style={ styles.button_end }
				>
					<Text style={ styles.save_button_text }>Close</Text>
				</TouchableOpacity>

				<TouchableOpacity
					accessibilityLabel='Edit button'
					accessibilityHint='Press to edit medical condition details.'onPress={ ( ) =>
					{
						setEditConditionVisible( true );
						setTempConditionData({ ...conditionData[conditionIndex] } );
						setViewConditionVisible( false );
					}}
					style={ styles.button_end }
				>
					<Text style={ styles.save_button_text }>Edit</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};



// For adding or editing
export const EditMedicalCondition = ({
										closeEdit, conditionData, conditionIndex, deleteEntry,
										doctorData, saveEntry, setTempConditionData, tempConditionData
									}) =>
{
	// Delete dialog visibility control
	const [ deleteConditionVisible, setDeleteConditionVisible ] = useState( false );

	// Date Picker
	const [ isDatePickerVisible, setDatePickerVisibility ] = useState( false );
	const showDatePicker = ( ) => setDatePickerVisibility( true );
	const hideDatePicker = ( ) => setDatePickerVisibility( false );

	const handleConfirm = ( date ) =>
	{
		setTempConditionData( prev =>
		({
			...prev,
			'diagnosis_date': date.toISOString( ).slice( 0,10 )
		}));
		hideDatePicker( );
	};


	// sed to hide delete button when keyboard opens so it doesn't overlap form
	const [ keyboardVisible, setKeyboardVisible ] = useState( false );

	useEffect( ( ) =>
	{
		const showSubscription = Keyboard.addListener( 'keyboardDidShow', () =>
		{
			setKeyboardVisible( true );
		});
		const hideSubscription = Keyboard.addListener( 'keyboardDidHide', () =>
		{
			setKeyboardVisible( false );
		});

		return ( ) =>
		{
			showSubscription.remove( );
			hideSubscription.remove( );
		};
	}, []);


	// Form Validation - Conditions must ( minimally ) have a name.
	const [ conditionName, setConditionName ] =
		useState( tempConditionData?.condition_name ?? '' );
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

		// Validate name field.
		if ( conditionName.trim( ) == '' )
		{
			errors.conditionName = 'Condition name is required.';
		}

		// Set the errors and update form validity.
		setErrors( errors );
		setIsFormValid( Object.keys( errors ).length === 0 );
	};


	// Delete dialog controls.
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


	// Close / Save button handler for Edit modal.
	function handlePress( close )
	{
		// Show error if user tries to save without min requirement.
		if ( !isFormValid  && !close )
		{
			setShowValidationError( true );
			setTimeout( function( )
			{
				setShowValidationError( false );
			}, 900 );
			return;
		}


		// If no changes have been made or user presses cancel button,
		// close the edit Modal and clear any unsaved data.
		if
		(
			JSON.stringify( conditionData[conditionIndex] )
			=== JSON.stringify( tempConditionData )
			|| close == true
		)
		{
			closeEdit( );
			setConditionName( '' );
			return;
		}


		// Only triggers save ( insert/update ) and reset if min of
		// medication name has been entered ( or already exists )
		// and changes have been made.
		if ( isFormValid && !close )
		{
			saveEntry( 'Medical_Condition', tempConditionData, 'condition_id' );

			closeEdit( );
			setConditionName( '' );
		}
	}


	return (
		<View style={[ styles.data_container_edit, { marginTop: 38 } ]}>
		{/* Form Validation Error */}
		{
			showValidationError ?
			<View style={ styles.validation_container }>
				<Text style={[ styles.text_input, styles.alert ]}>
					{ errors.conditionName }
				</Text>
			</View>
		: null
		}
			<View style={{ flex: 3 }}>
				{/* Condition name */}
				<TextInput
					accessibilityLabel='Condition name'
					accessibilityHint='Type in name of medical condition.'
					activeUnderlineColor='#0b3e82ff'
					maxLength={ 100 }
					multiline={ true }
					placeholder={ 'Condition Name' }
					style={ styles.text_input }
					value={ tempConditionData?.condition_name ?? '' }
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
							dropdownIconColor='#0b3e82ff'
							dropdownIconRippleColor='#0b3e82ff'
							mode='dropdown'
							selectedValue={ tempConditionData?.doctor_id ?? 'Doctor' }
							style={ styles.menu_text }
							onValueChange={ itemValue =>
							{
								setTempConditionData( prev =>
								({
									...prev, 'doctor_id': itemValue
								}));
							}}
							>
							<Picker.Item
								color='black'
								enabled={ false }
								label='Doctor'
								style={ styles.picker_item }
								value=''
							/>
							{
								doctorData.map( doctor =>
								<Picker.Item
									accessibilityLabel='menuitem'
									key={ doctor.entity_id }
									label={ doctor.entity_name }
									selectionColor={'red'}
									style={ styles.picker_item }
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
							{ tempConditionData?.diagnosis_date ?? 'Date of diagnosis' }
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
					activeUnderlineColor='#0b3e82ff'
					multiline={ true }
					placeholder={ 'Notes' }
					style={ styles.text_input }
					value={ tempConditionData?.condition_note ?? '' }
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
			</View>


			{/* Delete */}
			{
				!keyboardVisible ?
				<DeleteDialog
					buttonVisibleCondition={ tempConditionData?.condition_id }
					description={ 'condition' }
					dialogVisible={ deleteConditionVisible }
					handleCancel={ handleCancel }
					handleDelete={ handleDelete }
					setDialogVisible={ setDeleteConditionVisible }
					title={ tempConditionData?.condition_name }
				/>
			: null
			}
		</View>
	);
}