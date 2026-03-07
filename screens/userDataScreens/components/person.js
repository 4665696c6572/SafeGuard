import * as NavigationBar from 'expo-navigation-bar';
import { useEffect, useState } from 'react';
import { Keyboard, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from '@react-native-picker/picker';

import { DeleteDialog } from './deleteDialog.js';

import styles from "../../../styles/styles";

const underlay_color = '#d1dce4ff';


export const Person = ({ personData, screen, setEditPersonVisible, setShowDeleteButton, setTempPersonData, showEditButton }) =>
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
							<View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 5 }}>
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
											NavigationBar.setVisibilityAsync( "hidden" );
										}}
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
								deleteEntry, personData, saveEntry, setEditPersonVisible, setShowDeleteButton,
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


	// Form Validation ( Must ( minimally ) have a name )
	const [ personName, setPersonName ] = useState( tempPersonData?.entity_name ? tempPersonData.entity_name : '' );
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
		if ( personName == '' )    errors.personName = 'Name is required.';

		setErrors( errors );
		setIsFormValid( Object.keys( errors ).length === 0 );
	};


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
		NavigationBar.setVisibilityAsync( "visible" );

		// Don't save if changes have not been made
		if ( JSON.stringify( personData ) === JSON.stringify( [ tempPersonData ] ) || close == true )
		{
			setEditPersonVisible( false );
			setPersonName( '' );
			setShowDeleteButton( false );
			setTempPersonData( );
			return;
		}

		if ( isFormValid )
		{
			saveEntry( 'Person', tempPersonData, 'entity_id' );

			setEditPersonVisible( false );
			setPersonName( '' );
			setShowDeleteButton( false );
			setTempPersonData( );
		}
		else    setShowValidationError( true );
	}


	return(
		<View style={ styles.data_container_edit }>
			<View style={{ flex: 3}}>
				<TextInput
					accessibilityLabel='Full user name'
					style={ styles.text_input }
					placeholder={ tempPersonData?.entity_name ? tempPersonData.entity_name : 'Full Name' }
					onChangeText={ ( text ) =>
					{
						setPersonName( text );
						setTempPersonData( prev => ({ ...prev, 'entity_name': text, 'entity_type': 'Person' }));
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
						{ tempPersonData?.dob ? tempPersonData.dob : 'Date of birth' }
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
						style={ styles.picker }
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
							value=''
						/>
						<Picker.Item
							accessibilityLabel='menuitem'
							label='Male'
							value='Male'
						/>
						<Picker.Item
							accessibilityLabel='menuitem'
							label='Female'
							value='Female'
						/>
						<Picker.Item
							accessibilityLabel='menuitem'
							label='Prefer not to say.'
							value='Prefer not to say.'
						/>
					</Picker>
				</View>

				<TextInput
					accessibilityLabel='Height'
					accessibilityHint='Type in your height.'
					style={ styles.text_input }
					placeholder={ tempPersonData?.height?tempPersonData.height :'height' }
					onChangeText={ ( text ) => setTempPersonData( prev => ({ ...prev, 'height': text }))}
				/>

				<TextInput
					accessibilityLabel='Weight'
					accessibilityHint='Type in your weight.'
					style={ styles.text_input }
					placeholder={ tempPersonData?.weight?tempPersonData.weight : 'weight' }
					onChangeText={ ( text ) => setTempPersonData( prev => ({ ...prev, 'weight': text }))}
				/>

				<View style={ styles.picker_view }>
					<Picker
						accessibilityLabel='Blood type menu.'
						accessibilityHint='Select your blood type.'
						selectedValue={ tempPersonData?.blood_type? tempPersonData.blood_type : '' }
						style={ styles.picker }
						onValueChange={( itemValue ) =>
						{
							setTempPersonData( prev => ({ ...prev, 'blood_type': itemValue }))
						}}
					>
						<Picker.Item
							color='black'
							enabled={ false }
							label='Blood Type'
							value=''
						/>
						<Picker.Item
							accessibilityLabel='menuitem'
							label='A+'
							value='A+'
						/>
						<Picker.Item
							accessibilityLabel='menuitem'
							label='A-'
							value='A-'
						/>
						<Picker.Item
							accessibilityLabel='menuitem'
							label='B+'
							value='B+'
						/>
						<Picker.Item
							accessibilityLabel='menuitem'
							label='B-'
							value='B-'
						/>
						<Picker.Item
							accessibilityLabel='menuitem'
							label='AB+'
							value='AB+'
						/>
						<Picker.Item
							accessibilityLabel='menuitem'
							label='AB-'
							value='AB-'
						/>
						<Picker.Item
							accessibilityLabel='menuitem'
							label='O+'
							value='O+'
						/>
						<Picker.Item
							accessibilityLabel='menuitem'
							label='O-'
							value='O-'
						/>
						<Picker.Item
							accessibilityLabel='menuitem'
							label='Unknown'
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
						style={ styles.button_end }
						onPress={ ( ) => handlePress( true )}
					>
						<Text style={ styles.save_button_text }>Cancel</Text>
					</TouchableOpacity>

					{/* Save Button */}
					<TouchableOpacity
						accessibilityLabel='Save button'
						accessibilityHint='Press to save.'
						style={ styles.button_end }
						onPress={ ( ) => handlePress( false )}
					>
						<Text style={ styles.save_button_text }>Save</Text>
					</TouchableOpacity>
				</View>

				{/* Form Validation Error */}
				{
					showValidationError ?
					<View style={ styles.alert_row }>
						<Text style={[ styles.alert, styles.text ]}>{ errors.personName }</Text>
					</View>
				: null
				}
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