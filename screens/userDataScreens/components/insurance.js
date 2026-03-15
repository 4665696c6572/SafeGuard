import * as NavigationBar from 'expo-navigation-bar';
import { SquareArrowDiagonal01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import { useEffect, useState } from 'react';
import { Keyboard, ScrollView, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { TextInput } from 'react-native-paper';

import { DeleteDialog } from './deleteDialog.js';

import styles from "../../../styles/styles.js";

const underlay_color = '#d1dce4ff';


export const Insurance = ({
							insuranceData, setEditInsuranceVisible,
							setInsuranceIndex, setViewInsuranceVisible
						}) =>
{
	return (
		<View style={[ styles.data_container_view, { flex: 2 } ]}>
			<Text style={ styles.title_bar }>Health Insurance</Text>
			<ScrollView>
			{
				insuranceData.map(( insurance, i ) =>
				<View key={ insurance.insurance_id } style={ styles.text_list }>
					<View style={{ flex:0.9 }}>
						{
							insurance?.entity_name ?
							<Text style={ styles.text }>
								{ insurance.entity_name }
							</Text>
						: null
						}
					</View>

					<TouchableOpacity
						accessibilityLabel='Expand button'
						accessibilityHint='Press to view additional details.'
						onPress={ ( ) =>
						{
							setInsuranceIndex( i );
							setViewInsuranceVisible( true );
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
					accessibilityLabel='Add button'
					accessibilityHint='Press to add new health insurance details.'
					onPress={ ( ) =>
					{
						setEditInsuranceVisible( true );
						// navigation bar hidden in modals.
						NavigationBar.setVisibilityAsync( "hidden" );
					}}
					style={ styles.data_button_size }
				>
					<Text style={ styles.text_button }>Add new insurance</Text>
				</TouchableOpacity>
			</ScrollView>
		</View>
	);
};


export const ViewInsurance = ({
								closeView, handleNavigation, insuranceData, insuranceIndex,
								setEditInsuranceVisible, setInsuranceIndex,
								setTempInsuranceData, setViewInsuranceVisible
							}) =>
{
	return (
		<View style={[ styles.data_container_view, { marginTop: 38 } ]}>
			<View style={{ flex: 3 }}>
				{
					insuranceData?.[insuranceIndex]?.entity_name ?
						<Text style={ styles.title_bar }>
							{ insuranceData?.[insuranceIndex]?.entity_name }
						</Text>
				: null
				}

				{
					insuranceData?.[insuranceIndex]?.policy_number ?
					<View style={ styles.data_section_small }>
						<Text style={ styles.heading_text }>Policy Number</Text>
						<Text style={ styles.text }>
							{ insuranceData?.[insuranceIndex].policy_number }
						</Text>
					</View>
				: null
				}

				{
					insuranceData?.[insuranceIndex]?.start_date ?
					<View style={ styles.data_section_small }>
						<Text style={ styles.heading_text }>Policy start date</Text>
						<Text style={ styles.text }>
							{ insuranceData?.[insuranceIndex].start_date }
						</Text>
					</View>
				: null
				}

				{
					insuranceData?.[insuranceIndex]?.insurance_note ?
					<View style={ styles.data_section_small }>
						<Text style={ styles.heading_text }>Note</Text>
						<Text style={ styles.text }>
							{ insuranceData?.[insuranceIndex].insurance_note }
						</Text>
					</View>
				: null
				}

				{
					insuranceData?.[insuranceIndex]?.phone_number ?
					<View style={ styles.data_section_small }>
						<Text style={ styles.heading_text }>Phone number</Text>
						<Text style={ styles.text }>
							{ insuranceData?.[insuranceIndex].phone_number }
						</Text>
					</View>
				: null
				}


				{/* Close/View button row */}
				<View style={ styles.save_row }>
				{/* Close Button */}
				<TouchableOpacity
					accessibilityLabel='Close button'
					accessibilityHint='Press to close insurance details screen.'
					onPress={ ( ) => closeView( ) }
					style={ styles.button_end }
				>
					<Text style={ styles.save_button_text }>Close</Text>
				</TouchableOpacity>

				<TouchableOpacity
					accessibilityLabel='Edit button'
					accessibilityHint='Press to edit health insurance details.'
					onPress={ ( ) =>
					{
						setEditInsuranceVisible( true );
						setTempInsuranceData({ ...insuranceData[insuranceIndex] });
						setViewInsuranceVisible( false );
					}}
					style={ styles.button_end }
				>
					<Text style={ styles.save_button_text }>Edit</Text>
				</TouchableOpacity>
				</View>
			</View>


			{/* Contact details */}
			<View style={ styles.contact_button }>
				<TouchableOpacity
					accessibilityLabel='Contact details button'
					accessibilityHint='Press to view insurance contact details.'
					onPress={ ( ) =>
					{
						handleNavigation
						(
							insuranceData?.[insuranceIndex]?.insurance_id,
							insuranceData?.[insuranceIndex]?.entity_name
						);
						setInsuranceIndex( null );
						setViewInsuranceVisible( false );
					}}
				>
					<Text style={ styles.save_button_text }>View contact details</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};



// For adding or editing
export const EditInsurance = ({
								closeEdit, deleteEntry, insuranceData, insuranceIndex,
								saveEntry, setTempInsuranceData, tempInsuranceData
							}) =>
{
	// Delete dialog visibility control
	const [ deleteInsuranceVisible, setDeleteInsuranceVisible ] = useState( false );

	// Date Picker
	const [ isDatePickerVisible, setDatePickerVisibility ] = useState( false );
	const showDatePicker = ( ) => setDatePickerVisibility( true );
	const hideDatePicker = ( ) => setDatePickerVisibility( false );

	const handleConfirm = ( date ) =>
	{
		setTempInsuranceData( prev =>
		({
			...prev, 'start_date': date.toISOString( ).slice( 0,10 )
		}));
		hideDatePicker( );
	};


	// sed to hide delete button when keyboard opens so it doesn't overlap form
	const [ keyboardVisible, setKeyboardVisible ] = useState( false );

	useEffect( ( ) =>
	{
		const showSubscription = Keyboard.addListener( 'keyboardDidShow', ( ) =>
		{
			setKeyboardVisible( true );
		});
		const hideSubscription = Keyboard.addListener( 'keyboardDidHide', ( ) =>
		{
			setKeyboardVisible( false );
		});

		return ( ) =>
		{
			showSubscription.remove( );
			hideSubscription.remove( );
		};
	}, []);


	// Form Validation - Company must ( minimally ) have a name.
	const [ companyName, setCompanyName ] =
		useState( tempInsuranceData?.entity_name ?? '' );
	const [ errors, setErrors ] = useState({ });
	const [ isFormValid, setIsFormValid ] = useState( false );
	const [ showValidationError, setShowValidationError ] = useState( false );


	useEffect(( ) =>
	{
		validateForm( );
	}, [ companyName ]);


	const validateForm = ( ) =>
	{
		setIsFormValid( false );

		let errors = {};

		// Validate name field.
		if ( companyName.trim( ) == '' )    errors.companyName = 'Company name is required.';

		// Set the errors and update form validity.
		setErrors( errors );
		setIsFormValid( Object.keys( errors ).length === 0 );
	}

	// Delete dialog controls.
	const handleCancel = ( ) =>
	{
		setDeleteInsuranceVisible( false );
	};

	const handleDelete = ( ) =>
	{
		deleteEntry( 'Insurance', tempInsuranceData.insurance_id );
		setDeleteInsuranceVisible( false );
		handlePress( true );
	};


	// Close / Save button handler for Edit modal
	const handlePress = ( close, shouldNavigate ) =>
	{
		// Show error if user tries to save without min requirement.
		if ( !isFormValid && !close )
		{
			setShowValidationError( true );
			setTimeout( function( )
			{
				setShowValidationError( false );
			}, 900 );
			return;
		} 	


		/// If no changes have been made or user presses cancel button,
		// close the edit Modal and clear any unsaved data.
		let prev_data = insuranceIndex != null  ?
						JSON.stringify( insuranceData[insuranceIndex] )
						: null;

		if
		((
			prev_data === JSON.stringify( tempInsuranceData ))
			|| close == true
		)
		{
			closeEdit( );
			setCompanyName( '' );
			return;
		}


		// Only triggers save ( insert/update ) and reset if min of
		// company name has been entered ( or already exists )
		// and changes have been made.
		if ( isFormValid && !close )
		{
			saveEntry( 'Insurance', tempInsuranceData, 'insurance_id', shouldNavigate );

			closeEdit( );
			setCompanyName( '' );
		}
	}


	return (
		<View style={[ styles.data_container_edit, { marginTop: 38 } ]}>
		{/* Form Validation Error */}
		{
			showValidationError ?
			<View style={ styles.validation_container }>
				<Text style={[ styles.text_input, styles.alert ]}>{ errors.companyName }</Text>
			</View>
		: null
		}
			<View style={{ flex: 3 }}>
				<TextInput
					accessibilityLabel='Insurance company'
					accessibilityHint='Type in name of insurance company.'
					maxLength={ 100 }
					placeholder={ 'Insurance company name' }
					style={ styles.text_input }
					value={ tempInsuranceData?.entity_name ?? '' }
					onChangeText={( text ) =>
					{
						setCompanyName( text );
						setTempInsuranceData( prev =>
						({
							...prev, 'entity_name': text, 'insurance_type': 'Health'
						}));
					}}
				/>

				<TextInput
					accessibilityLabel='Insurance policy number'
					accessibilityHint='Type in insurance policy number.'
					maxLength={ 100 }
					onChangeText={( text ) =>
						setTempInsuranceData( prev => ({ ...prev, 'policy_number': text }))
					}
					placeholder={ 'Policy Number' }
					style={ styles.text_input }
					value={ tempInsuranceData?.policy_number ?? '' }
				/>


				{/* Policy Start Date */}
				<TouchableHighlight
					accessibilityLabel='Date picker'
					accessibilityHint='Touch to open date picker for start date of insurance.'
					onPress={ showDatePicker }
					style={ styles.menu }
					underlayColor={ underlay_color }
					>
					<Text style={[ styles.text_input, styles.menu_text ]}>
						{ tempInsuranceData?.start_date ?? 'Policy start date' }
					</Text>
				</TouchableHighlight>

				<DateTimePickerModal
					isVisible={ isDatePickerVisible }
					mode='date'
					onConfirm={ handleConfirm }
					onCancel={ hideDatePicker }
				/>


				<TextInput
					accessibilityLabel='Insurance note'
					accessibilityHint='Type in an note about this insurance.'
					onChangeText={( text ) =>
						setTempInsuranceData( prev => ({ ...prev, 'insurance_note' : text }))
					}
					maxLength={ 100 }
					multiline={ true }
					placeholder={ 'Notes' }
					style={ styles.text_input }
					value={ tempInsuranceData?.insurance_note ?? '' }
				/>

				{/* Cancel/Save button row */}
				<View style={ styles.save_row }>
					{/* Cancel Button */}
					<TouchableOpacity
						accessibilityLabel='Cancel button'
						accessibilityHint='Press to cancel adding or editing this insurance information.'
						onPress={ ( ) => handlePress( true, false )}
						style={ styles.button_end }
					>
						<Text style={ styles.save_button_text }>Cancel</Text>
					</TouchableOpacity>

					{/* Save Button */}
					<TouchableOpacity
						accessibilityLabel='Save button'
						accessibilityHint='Press to save changes.'
						onPress={ ( ) => handlePress( false, false )}
						style={ styles.button_end }
					>
						<Text style={ styles.save_button_text }>Save</Text>
					</TouchableOpacity>

					{/* Next Button */}
					{ !insuranceData?.[insuranceIndex]?.insurance_id ?
						<TouchableOpacity
							accessibilityLabel='Contact details button'
							accessibilityHint='Save and go to add contact detail screen.'
							onPress={ ( ) => handlePress( false, true )}
							style={ styles.button_end }
						>
							<Text style={ styles.save_button_text }>Next</Text>
						</TouchableOpacity>
					: null
					}
				</View>
			</View>


			{/* Delete */}
			{
				!keyboardVisible ?
				<DeleteDialog
					buttonVisibleCondition={ tempInsuranceData?.insurance_id }
					description={ 'insurance' }
					dialogVisible={ deleteInsuranceVisible }
					handleCancel={ handleCancel }
					handleDelete={ handleDelete }
					setDialogVisible={ setDeleteInsuranceVisible }
					title={ tempInsuranceData?.entity_name }
				/>
			: null
			}
		</View>
	);
}