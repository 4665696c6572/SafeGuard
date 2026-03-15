import * as NavigationBar from 'expo-navigation-bar';
import { useEffect, useState } from 'react';
import { Keyboard, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from '@react-native-picker/picker';

import { DeleteDialog } from './deleteDialog.js';

import styles from "../../../styles/styles.js";

const underlay_color = '#d1dce4ff';


export const Person = ({
							personData, screen, setEditPersonVisible, setShowDeleteButton,
							setTempPersonData, showEditButton
						}) =>
{
	return (
		<View style={[ styles.data_container_view, { flex: 1 }]}>
			<Text style={ styles.title_bar }>Personal Information</Text>
			{
				personData[0]?.entity_name != null ?
				<View>
				{
					personData.map( person =>
					(
						<View key={ person.entity_id } style={{ marginBottom: 10 }}>
							<View style={ styles.delete_dialog_button_row }>
							{
								person?.entity_name != null ?
								<Text style={ styles.heading_text }>
										{ person.entity_name }
								</Text>
							: null
							}

							{
								showEditButton ?
								<TouchableOpacity
									accessibilityLabel='Edit button'
									accessibilityHint='Press to edit user information.'
									onPress={ ( ) =>
									{
										setEditPersonVisible( true );
										setShowDeleteButton( true );
										setTempPersonData( personData[0] );
										// navigation bar hidden in modals.
										NavigationBar.setVisibilityAsync( "hidden" );
									}}
									style={ styles.expand_button }
								>
									<Text style={ styles.text_button }>Edit</Text>
								</TouchableOpacity>
							: null
							}
							</View>

							{
								person?.dob != null ?
								<Text style={ styles.text }>Date of birth: { person.dob }</Text>
							: null
							}
							{
								person?.sex != null ?
								<Text style={ styles.text }>Sex: { person.sex }</Text>
							: null
							}
							{
								person?.height != null ?
								<Text style={ styles.text }>Height: { person.height }</Text>
							: null
							}
							{
								person?.weight != null ?
								<Text style={ styles.text }>Weight: { person.weight }</Text>
							: null
							}
							{
								person?.blood_type != null ?
								<Text style={ styles.text }>Blood Type: { person.blood_type }</Text>
							: null
							}
						</View>
					))
				}
				</View>
				:
				<View>
				{
					screen == 'EmergencyDataScreen' ? null :
					<TouchableOpacity
						accessibilityLabel='Add information button'
						accessibilityHint='Press to add user information.'
						onPress={ ( ) =>
						{
							setEditPersonVisible( true )
							setTempPersonData( personData[0] );
							// navigation bar hidden in modals.
							NavigationBar.setVisibilityAsync( "hidden" );
						}}
						style={ styles.data_button_size }
					>
						<Text style={ styles.text_button }>Add information</Text>
					</TouchableOpacity>
				}
				</View>
			}
			</View>
	);
};


// Used to edit data or add if none has been added already.
export const EditPerson = ({
								closeEdit, deleteEntry, personData, saveEntry,
								setTempPersonData, showDeleteButton, tempPersonData
							}) =>
{
	// Delete dialog visibility control
	const [ deletePersonVisible, setDeletePersonVisible ] = useState( false );

	// Date Picker
	const [ datePickerVisible, setDatePickerVisible ] = useState( false );

	const showDatePicker = ( ) => setDatePickerVisible( true );
	const hideDatePicker = ( ) => setDatePickerVisible( false );

	const handleConfirm = ( date ) =>
	{
		setTempPersonData( prev => ({ ...prev, 'dob': date.toISOString( ).slice( 0,10 )}));
		hideDatePicker( );
	};


	// Used to hide delete button when keyboard opens so it doesn't overlap form
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


	// Form Validation - Person must ( minimally ) have a name.
	const [ personName, setPersonName ] =
		useState( tempPersonData?.entity_name ? tempPersonData.entity_name : '' );
	const [ errors, setErrors ] = useState({ });
	const [ isFormValid, setIsFormValid ] = useState( false );
	const [ showValidationError, setShowValidationError ] = useState( false );

	useEffect(( ) =>
	{
		validateForm( );
	}, [personName ]);


	const validateForm = ( ) =>
	{
		let errors = {};

		// Validate name field
		if ( personName.trim( ) == '' )    errors.personName = 'Name is required.';

		setErrors( errors );
		setIsFormValid( Object.keys( errors ).length === 0 );
	};


	// Delete dialog controls.
	const handleCancel = ( ) =>
	{
		setDeletePersonVisible( false );
	};

	const handleDelete = ( ) =>
	{
		deleteEntry( 'Person', tempPersonData.entity_id );
		setDeletePersonVisible( false )
		handlePress( true );
	};


	// Close / Save button handler for Edit modal
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
			JSON.stringify( personData ) === JSON.stringify( [ tempPersonData ] )
			|| close == true
		)
		{
			closeEdit( );
			setPersonName( '' );
			return;
		}

		// Only triggers save ( insert/update ) if min of
		// name has been entered ( or already exists )
		// and changes have been made.
		if ( isFormValid && !close )
		{
			saveEntry( 'Person', tempPersonData, 'entity_id' );

			closeEdit( );
			setPersonName( '' );
		}
	}


	return(
		<View style={[ styles.data_container_edit, { marginTop: 38 } ]}>
		{/* Form Validation Error */}
		{
			showValidationError ?
			<View style={ styles.validation_container }>
				<Text style={[ styles.text_input, styles.alert ]}>{ errors.personName }</Text>
			</View>
		: null
		}
			<View style={{ flex: 3}}>
				<TextInput
					accessibilityLabel='Full user name'
					maxLength={ 100 }
					placeholder={ 'Full Name' }
					style={ styles.text_input }
					value={ tempPersonData?.entity_name ?? '' }
					onChangeText={ ( text ) =>
					{
						setPersonName( text );
						setTempPersonData( prev =>
						({
							...prev, 'entity_name': text, 'entity_type': 'Person'
						}));
					}}
				/>

				<TouchableHighlight
					accessibilityLabel='Date picker'
					accessibilityHint='Touch to open date picker for date of birth.'
					onPress={ showDatePicker }
					style={ styles.menu }
					underlayColor={ underlay_color }
				>
					<Text style={[ styles.text_input, styles.menu_text ]}>
						{ tempPersonData?.dob ?? 'Date of birth' }
					</Text>
				</TouchableHighlight>

				<DateTimePickerModal
					isVisible={ datePickerVisible }
					mode='date'
					onConfirm={ handleConfirm }
					onCancel={ hideDatePicker }
				/>

				<View style={ styles.picker_view }>
					<Picker
						accessibilityLabel='Sex menu'
						accessibilityHint='Select your sex.'
						dropdownIconColor='#0b3e82ff'
						dropdownIconRippleColor='#0b3e82ff'
						mode='dropdown'
						
						style={ styles.menu_text }
						selectedValue={ tempPersonData?.sex ? tempPersonData.sex : 'Sex' }
						onValueChange={( itemValue ) =>
						{
							setTempPersonData( prev => ({ ...prev, 'sex': itemValue }))
						}}
					>
						<Picker.Item
							color='black'
							enabled={ false }
							label='Sex'
							style={ styles.picker_item }
							value=''
						/>
						<Picker.Item
							accessibilityRole='menuitem'
							label='Male'
							style={ styles.picker_item }
							value='Male'
						/>
						<Picker.Item
							accessibilityRole='menuitem'
							label='Female'
							style={ styles.picker_item }
							value='Female'
						/>
						<Picker.Item
							accessibilityRole='menuitem'
							label='Prefer not to say.'
							style={ styles.picker_item }
							value='Prefer not to say.'
						/>
					</Picker>
				</View>

				<TextInput
					accessibilityLabel='Height'
					accessibilityHint='Type in your height.'
					maxLength={ 100 }
					placeholder={ 'height' }
					style={ styles.text_input }
					value={ tempPersonData?.height ?? '' }
					onChangeText={ ( text ) =>
						setTempPersonData( prev => ({ ...prev, 'height': text }))
					}
				/>

				<TextInput
					accessibilityLabel='Weight'
					accessibilityHint='Type in your weight.'
					maxLength={ 100 }
					placeholder={ 'weight' }
					style={ styles.text_input }
					value={ tempPersonData?.weight ?? '' }
					onChangeText={ ( text ) =>
						setTempPersonData( prev => ({ ...prev, 'weight': text }))
					}
				/>

				<View style={ styles.picker_view }>
					<Picker
						accessibilityLabel='Blood type menu.'
						accessibilityHint='Select your blood type.'
						dropdownIconColor='#0b3e82ff'
						dropdownIconRippleColor='#0b3e82ff'
						mode='dropdown'
						selectedValue={ tempPersonData?.blood_type ?? '' }
						style={ styles.menu_text }
						onValueChange={( itemValue ) =>
						{
							setTempPersonData( prev => ({ ...prev, 'blood_type': itemValue }))
						}}
					>
						<Picker.Item
							color='black'
							enabled={ false }
							label='Blood Type'
							style={ styles.picker_item }
							value=''
						/>
						<Picker.Item
							accessibilityRole='menuitem'
							label='A+'
							style={ styles.picker_item }
							value='A+'
						/>
						<Picker.Item
							accessibilityRole='menuitem'
							label='A-'
							style={ styles.picker_item }
							value='A-'
						/>
						<Picker.Item
							accessibilityRole='menuitem'
							label='B+'
							style={ styles.picker_item }
							value='B+'
						/>
						<Picker.Item
							accessibilityRole='menuitem'
							label='B-'
							style={ styles.picker_item }
							value='B-'
						/>
						<Picker.Item
							accessibilityRole='menuitem'
							label='AB+'
							style={ styles.picker_item }
							value='AB+'
						/>
						<Picker.Item
							accessibilityRole='menuitem'
							label='AB-'
							style={ styles.picker_item }
							value='AB-'
						/>
						<Picker.Item
							accessibilityRole='menuitem'
							label='O+'
							style={ styles.picker_item }
							value='O+'
						/>
						<Picker.Item
							accessibilityRole='menuitem'
							label='O-'
							style={ styles.picker_item }
							value='O-'
						/>
						<Picker.Item
							accessibilityRole='menuitem'
							label='Unknown'
							style={ styles.picker_item }
							value='Unknown'
						/>
					</Picker>
				</View>


				{/* Cancel/Save button row */}
				<View style={ styles.save_row }>
					{/* Cancel Button */}
					<TouchableOpacity
						accessibilityLabel='Cancel button'
						accessibilityHint='Press to cancel editing your information.'
						onPress={ ( ) => handlePress( true )}
						style={ styles.button_end }
					>
						<Text style={ styles.save_button_text }>Cancel</Text>
					</TouchableOpacity>

					{/* Save Button */}
					<TouchableOpacity
						accessibilityLabel='Save button'
						accessibilityHint='Press to save.'
						onPress={ ( ) => handlePress( false )}
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
					buttonVisibleCondition={ showDeleteButton }
					description={ 'information' }
					dialogVisible={ deletePersonVisible }
					handleCancel={ handleCancel }
					handleDelete={ handleDelete }
					setDialogVisible={ setDeletePersonVisible }
					title={ ' ' }
				/>
			: null
			}
		</View>
	)
}