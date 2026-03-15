import { Checkbox } from 'expo-checkbox';
import * as NavigationBar from 'expo-navigation-bar';
import { SquareArrowDiagonal01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import { useEffect, useState } from 'react';
import { Keyboard, ScrollView, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { TextInput } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

import { DeleteDialog } from './deleteDialog.js';

import styles from "../../../styles/styles.js";

const underlay_color = '#d1dce4ff';


export const Medication = ({
								medicationData, setEditMedicationVisible,
								setMedicationIndex, setViewMedicationVisible
							}) =>
{
	return (
		<View style={ styles.data_container_view }>
			<Text style={ styles.title_bar }>Medications</Text>
			<ScrollView>
			{
				medicationData.map(( medication, i ) =>
				<View key={ medication.medication_id } style={ styles.text_list }>
					{
						medication.is_life_sustaining == 1 ?
						<View style={{ flex:0.9 }}>
							<Text style={[ styles.text, styles.alert ]}>
								Life Sustaining Medication
							</Text>
							{
								medication?.medication_name ?
								<Text style={[ styles.text, styles.alert ]}>
									{ medication.medication_name } { medication?.strength }
								</Text>
							: null
							}
						</View>
						:
						<View style={{ flex:0.9 }}>
							{
								medication?.medication_name ?
								<Text style={ styles.text }>
									{ medication.medication_name } { medication?.strength }
								</Text>
							: null
							}
						</View>
					}

					<TouchableOpacity
						onPress={ ( ) =>
						{
							setViewMedicationVisible( true );
							setMedicationIndex( i );
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

				<TouchableOpacity
					onPress={ ( ) =>
					{
						setEditMedicationVisible( true );
						// navigation bar hidden in modals.
						NavigationBar.setVisibilityAsync( "hidden" );
					}}
					style={ styles.data_button_size }
				>
					<Text style={ styles.text_button }>Add new medication</Text>
				</TouchableOpacity>
			</ScrollView>
		</View>
	);
};


export const ViewMedication = ({
									closeView, conditionData, doctorData, medicationData,
									medicationIndex, setEditMedicationVisible,
									setTempMedicationData, setViewMedicationVisible
								}) =>
{
	return (
		<View style={[ styles.data_container_view, { marginTop: 38 } ]}>
			{
				medicationData?.[medicationIndex].is_life_sustaining == 1 ?
				<View>
				{
					medicationData?.[medicationIndex].medication_name ?
					<Text style={ styles.title_bar }>
						{ medicationData?.[medicationIndex].medication_name }
					</Text>
				: null
				}
					<Text style={[ styles.heading_text, styles.alert ]}>
						Life Sustaining Medication
					</Text>
				</View>
				:
				<View>
				{
					medicationData?.[medicationIndex].medication_name ?
					<Text style={ styles.title_bar }>
						{ medicationData?.[medicationIndex].medication_name }
					</Text>
				: null
				}
				</View>
			}

			<View
				key={ medicationData?.[medicationIndex].medication_id }
				style={{ justifyContent: 'space-between', gap: 1 }}
			>
				{
					medicationData?.[medicationIndex]?.strength ?
					<View style={ styles.data_section_small }>
						<Text style={ styles.heading_text }>Strength</Text>
						<Text style={ styles.text }>
							{ medicationData?.[medicationIndex].strength }
						</Text>
					</View>
				: null
				}

				{
					medicationData?.[medicationIndex]?.frequency ?
					<View style={ styles.data_section_small }>
						<Text style={ styles.heading_text }>Frequency</Text>
						<Text style={ styles.text }>
							{ medicationData?.[medicationIndex].frequency }
						</Text>
					</View>
				: null
				}

				{
					medicationData?.[medicationIndex]?.start_date ?
					<View style={ styles.data_section_small }>
						<Text style={ styles.heading_text }>Start date</Text>
						<Text style={ styles.text }>
							{ medicationData?.[medicationIndex].start_date }
						</Text>
					</View>
				: null
				}

				{
					medicationData?.[medicationIndex]?.medication_note?
					<View style={ styles.data_section_small }>
						<Text style={ styles.heading_text }>Note</Text>
						<Text style={ styles.text }>
							{ medicationData?.[medicationIndex].medication_note }
						</Text>
					</View>
				: null
				}

				{
					doctorData.map ( doctor =>
					<View key={ doctor.entity_id } >
					{
						doctor.entity_id == medicationData[medicationIndex].doctor_id ?
						<View style={ styles.data_section_small }>
							<Text style={ styles.heading_text }>Doctor</Text>
							<Text style={ styles.text }>{ doctor.entity_name }</Text>
						</View>
						: null
					}
					</View>
				)}

				{
					conditionData.map ( condition =>
					<View key={ condition.condition_id } >
					{
						condition.condition_id == medicationData[medicationIndex].condition_id ?
							<View style={ styles.data_section_small }>
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

			{/* Close/Edit button row */}
			<View style={ styles.save_row }>
				{/* Close Button */}
				<TouchableOpacity
					onPress={ ( ) => closeView( ) }
					style={ styles.button_end }
				>
					<Text style={ styles.save_button_text }>Close</Text>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={ ( ) =>
					{
						setEditMedicationVisible( true );
						setTempMedicationData({ ...medicationData[medicationIndex] } );
						setViewMedicationVisible( false );
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
export const EditMedication = ({
									closeEdit, conditionData, deleteEntry, doctorData, medicationData,
									medicationIndex, saveEntry,setTempMedicationData, tempMedicationData
								}) =>
{
	const [ lifeSustaining, setLifeSustaining ] = useState
	(
		tempMedicationData?.is_life_sustaining ?
		tempMedicationData.is_life_sustaining
		: false
	);

	// Delete dialog visibility control
	const [ deleteMedicationVisible, setDeleteMedicationVisible ] = useState( false );

	// Date Picker
	const [ datePickerVisible, setDatePickerVisibility ] = useState( false );

	const showDatePicker = ( ) => setDatePickerVisibility( true );
	const hideDatePicker = ( ) => setDatePickerVisibility( false );

	const handleConfirm = ( date ) =>
	{
		setTempMedicationData( prev =>
		({
			...prev, 'start_date': date.toISOString( ).slice( 0,10 )
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


	// Form Validation - Medication must ( minimally ) have a name.
	const [ errors, setErrors ] = useState({ });
	const [ isFormValid, setIsFormValid ] = useState( false );
	const [ medicationName, setMedicationName ] =
		useState( tempMedicationData?.medication_name ? tempMedicationData.medication_name : '' );
	const [ showValidationError, setShowValidationError ] = useState( false );


	useEffect(( ) =>
	{
		validateForm( );
	}, [ medicationName ]);


	const validateForm = ( ) =>
	{
		let errors = {};

		// Validate name field
		if ( medicationName.trim( ) == '' )    errors.medicationName = 'Medication name is required.';

		// Set the errors and update form validity
		setErrors( errors );
		setIsFormValid( Object.keys( errors ).length === 0 );
	};


	// Delete dialog controls.
	const handleCancel = ( ) =>
	{
		setDeleteMedicationVisible( false );
	};

	const handleDelete = ( ) =>
	{
		deleteEntry( 'Medication', tempMedicationData.medication_id );
		handlePress( true );
		setDeleteMedicationVisible( false );
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
			JSON.stringify( medicationData[medicationIndex] )
			=== JSON.stringify( tempMedicationData ) ||
			tempMedicationData == undefined || close == true
		)
		{
			closeEdit( );
			setMedicationName( '' );
			return;
		}


		// Only triggers save ( insert/update ) and reset if min of
		// medication name has been entered ( or already exists )
		// and changes have been made.
		if ( isFormValid && !close )
		{
			saveEntry( 'Medication', tempMedicationData,'medication_id' );

			closeEdit( );
			setMedicationName( '' );
		}
	}


	return (
		<View style={[ styles.data_container_edit, { marginTop: 38 } ]}>
		{/* Form Validation Error */}
			{
				showValidationError ?
				<View style={ styles.validation_container }>
					<Text style={[ styles.text_input, styles.alert ]}>
						{ errors.medicationName }
					</Text>
				</View>
			: null
			}
			<View style={{ flex: 3 }}>
				<TextInput
					accessibilityLabel='Medication name'
					accessibilityHint='Type in name of medication.'
					maxLength={ 100 }
					placeholder={ 'Medication name' }
					style={ styles.text_input }
					value={ tempMedicationData?.medication_name ?? '' }
					onChangeText={( text ) =>
					{
						setMedicationName( text );
						setTempMedicationData( prev => ({ ...prev, 'medication_name': text }));
					}}
				/>

				<TextInput
					accessibilityLabel='Medication strength'
					accessibilityHint='Type in strength of medication ( example: 500 or 500mg ).'
					maxLength={ 100 }
					onChangeText={( text ) =>
						setTempMedicationData( prev => ({ ...prev, 'strength': text }))
					}
					placeholder={ 'Strength' }
					style={ styles.text_input }
					value={ tempMedicationData?.strength ?? '' }
				/>

				<TextInput
					accessibilityLabel='Medication frequency'
					accessibilityHint='Type in dosage frequency ( example: every eight hours ).'
					maxLength={ 100 }
					onChangeText={( text ) =>
						setTempMedicationData( prev => ({ ...prev, 'frequency': text }))
					}
					placeholder={ 'Frequency' }
					style={ styles.text_input }
					value={ tempMedicationData?.frequency ?? '' }
				/>

				{/* Select existing Doctor */}
				{
					doctorData?.length > 0 ?
					<View style={ styles.picker_view }>
						<Picker
							accessibilityLabel='Doctor menu'
							accessibilityHint='Select previously entered doctor.'
							dropdownIconColor='#0b3e82ff'
							dropdownIconRippleColor='#0b3e82ff'
							mode='dropdown'
							selectedValue={ tempMedicationData?.doctor_id ?? 'Doctor' }
							style={ styles.menu_text }
							onValueChange={ itemValue =>
							{
								setTempMedicationData( prev => ({ ...prev, 'doctor_id': itemValue }));
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
									style={ styles.picker_item }
									value={ doctor.entity_id }
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
					<Text style={[ styles.text_input, styles.menu_text ]}>
						{ tempMedicationData?.start_date ?? 'Start date:' }
					</Text>
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
							dropdownIconColor='#0b3e82ff'
							dropdownIconRippleColor='#0b3e82ff'
							mode='dropdown'
							selectedValue={ tempMedicationData?.condition_id ?? 'Condition name' }
							style={ styles.menu_text }
							onValueChange={ itemValue =>
							{
								setTempMedicationData( prev => ({ ...prev, 'condition_id': itemValue }));
							}}
							>
							<Picker.Item
								color='black'
								enabled={ false }
								label='Condition'
								style={ styles.picker_item }
								value='' />
							{
								conditionData.map( condition =>
								<Picker.Item
									accessibilityLabel='menuitem'
									key={ condition.condition_id }
									label=
									{
										condition.allergen ?
										'Allergy: ' + condition.allergen :
										condition.condition_name
									}
									style={ styles.picker_item }
									value={ condition.condition_id }
								/>
							)}
						</Picker>
					</View>
				: null
				}

				<TextInput
					accessibilityLabel='Notes'
					accessibilityHint='Type in medication relevant notes.'
					multiline={ true }
					maxLength={ 100 }
					onChangeText={( text ) =>
						setTempMedicationData( prev => ({ ...prev, 'medication_note' : text }))
					}
					placeholder={ 'Notes' }
					style={ styles.text_input }
					value={ tempMedicationData?.medication_note ?? '' }
				/>

				<View style={ styles.checkbox_row }>
					<Text style={ styles.text }>This a life-sustaining medication:</Text>
					<Checkbox
						accessibilityLabel='Life-sustaining medication'
						accessibilityHint='Check the box if this is a life-sustaining medication.'
						color={ lifeSustaining ? '#3087eb' : undefined }
						value={ lifeSustaining }
						onValueChange={ ( ) =>
						{
							setLifeSustaining( !lifeSustaining );
							setTempMedicationData( prev =>
								({ ...prev, 'is_life_sustaining' : !lifeSustaining })
							);
						}}
					/>
				</View>


				{/* Cancel/Save button row */}
				<View style={ styles.save_row }>
					{/* Cancel Button */}
					<TouchableOpacity
						accessibilityLabel='Cancel button'
						accessibilityHint='Press to cancel adding or editing this medication.'
						onPress={ ( ) => handlePress( true )}
						style={ styles.button_end }
					>
						<Text style={ styles.save_button_text }>Cancel</Text>
					</TouchableOpacity>

					{/* Save Button */}
					<TouchableOpacity
						accessibilityLabel='save button'
						accessibilityHint='Press to save medication details.'
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
					buttonVisibleCondition={ tempMedicationData?.medication_id }
					description={ 'medication' }
					dialogVisible={ deleteMedicationVisible }
					handleCancel={ handleCancel }
					handleDelete={ handleDelete }
					setDialogVisible={ setDeleteMedicationVisible }
					title={ tempMedicationData?.medication_name }
				/>
			: null
			}
		</View>
	);
}