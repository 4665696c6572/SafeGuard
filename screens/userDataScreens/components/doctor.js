import { Checkbox } from 'expo-checkbox';
import * as NavigationBar from 'expo-navigation-bar';
import { SquareArrowDiagonal01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import { useEffect, useState } from 'react';
import { Keyboard, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-paper';

import { DeleteDialog } from './deleteDialog.js';

import styles from "../../../styles/styles.js";


export const Doctor = ({ doctorData, setEditDoctorVisible, setDoctorIndex, setViewDoctorVisible }) =>
{
	return (
		<View style={ styles.data_container_view }>
			<Text style={ styles.title_bar }>Doctors</Text>
				<ScrollView>
				{
					doctorData.map(( doctor, i ) =>
					<View key={ doctor.entity_id } style={ styles.text_list }>
						<View>
								{ doctor?.entity_name ? <Text style={ styles.text }>{ doctor.entity_name }</Text> : null }
						</View>

						<TouchableOpacity
							style={ styles.expand_button }
							onPress={ ( ) =>
							{
								setDoctorIndex( i );
								setViewDoctorVisible( true );
								NavigationBar.setVisibilityAsync( "hidden" );
							}}
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
					style={ styles.data_button_size }
					onPress={ ( ) =>
					{
						setEditDoctorVisible( true );
						NavigationBar.setVisibilityAsync( "hidden" );
					}}
				>
					<Text style={ styles.text_button }>Add new doctor</Text>
				</TouchableOpacity>
			</ScrollView>
		</View>
	);
};



export const ViewDoctor = ({
								doctorData, doctorIndex, handleNavigation, setEditDoctorVisible,
								setDoctorIndex, setTempDoctorData, setViewDoctorVisible
							}) =>
{
	return (
		<View style={ styles.data_container_view }>
			<View style={{ flex: 3 }}>
				{
					doctorData?.[doctorIndex]?.entity_name ?
						<Text style={ styles.title_bar }>{ doctorData[doctorIndex].entity_name }</Text>
				: null
				}

				{
					doctorData?.[doctorIndex]?.specialty ?
					<View style={ styles.data_section_small }>
						<Text style={ styles.heading_text }>Specialty</Text>
						<Text style={ styles.text }>{ doctorData[doctorIndex].specialty }</Text>
					</View>
				: null
				}

				{
					doctorData?.[doctorIndex]?.facility_name ?
					<View style={ styles.data_section_small }>
						<Text style={ styles.heading_text }>Facility name</Text>
						<Text style={ styles.text }>{ doctorData[doctorIndex].facility_name }</Text>
					</View>
				: null
				}

				{
					doctorData?.[doctorIndex]?.current != null ?
					<View style={ styles.data_section_small }>
						{
							doctorData?.[doctorIndex].current == true ?
							<Text style={ styles.text }>I am currently seeing this doctor.</Text>
							:
							<Text style={ styles.text }>I am not currently seeing this doctor.</Text>
						}
					</View>
				: null
				}


				{/* Close/Edit button row */}
				<View style={ styles.save_row }>
					{/* Close Button */}
					<TouchableOpacity
						accessibilityLabel='Close button'
						accessibilityHint='Press to close doctor details screen.'
						style={ styles.button_end }
						onPress={ ( ) =>
						{
							setDoctorIndex( null );
							setViewDoctorVisible( false );
							NavigationBar.setVisibilityAsync( "visible" );
						}}
					>
						<Text style={ styles.save_button_text }>Close</Text>
					</TouchableOpacity>

					<TouchableOpacity
						accessibilityLabel='Edit button'
						accessibilityHint='Press to edit health insurance details.'
						style={ styles.button_end }
						onPress={ ( ) =>
						{
							setEditDoctorVisible( true );
							setTempDoctorData({ ...doctorData[doctorIndex] });
							setViewDoctorVisible( false );
						}}
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
						handleNavigation(
											doctorData?.[doctorIndex]?.entity_id, doctorData?.[doctorIndex]?.entity_name,
											doctorData?.[doctorIndex]?.facility_name
										);
						setViewDoctorVisible( false );
					}}
				>
					<Text style={ styles.save_button_text }>View contact details</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};


// For adding or editing
export const EditDoctor = ({
								deleteEntry, doctorData, doctorIndex, saveEntry, setDoctorIndex,
								setEditDoctorVisible, setTempDoctorData, tempDoctorData
							}) =>
{
	// Delete dialog visibility control
	const [ deleteDoctorVisible, setDeleteDoctorVisible ] = useState( false );

	const [ currentDr, setCurrentDr ] = useState( tempDoctorData?.current ? tempDoctorData.current : false );


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


	// Form Validation ( Must ( minimally ) have a name ).
	const [ doctorName, setDoctorName ] = useState( tempDoctorData?.entity_name ? tempDoctorData.entity_name : '' );
	const [ errors, setErrors ] = useState({ });
	const [ isFormValid, setIsFormValid ] = useState( false );
	const [ showValidationError, setShowValidationError ] = useState( false );


	useEffect(( ) =>
	{
		validateForm( );
	}, [ doctorName ]);


	const validateForm = ( ) =>
	{
		let errors = {};

	// Validate name field
	if ( doctorName == '' )    errors.doctorName = 'Name is required.';

	setErrors( errors );
	setIsFormValid( Object.keys( errors ).length === 0 );
	};


	const handleCancel = ( ) =>
	{
		setDeleteDoctorVisible( false );
	};


	const handleDelete = ( ) =>
	{
		deleteEntry( 'Doctor', tempDoctorData.entity_id );
		setDeleteDoctorVisible( false );
		handlePress( true );
	};


	const handlePress = ( close, shouldNavigate ) =>
	{
		NavigationBar.setVisibilityAsync( "visible" );

		let prev_data = ( doctorIndex != null ) ? JSON.stringify( doctorData[doctorIndex] ) : null;

		if ( prev_data === JSON.stringify( tempDoctorData ) || close == true )
		{
			setDoctorIndex( null );
			setDoctorName( '' );
			setEditDoctorVisible( false );
			setTempDoctorData( );
			return;
		}

		// New / Edit -> Save / Next
		if ( isFormValid )
		{
			saveEntry( 'Doctor', tempDoctorData, 'entity_id', shouldNavigate );

			setDoctorName( '' );
			setEditDoctorVisible( false );
			setDoctorIndex( null );
			setTempDoctorData( );
			return;
		}

		else    setShowValidationError( true );
	}


	return(
		<View style={ styles.data_container_edit }>
			<View style={{ flex: 3 }}>
				<TextInput
					accessibilityLabel="Doctor's name"
					accessibilityHint='Type in name of doctor.'
					maxLength={ 100 }
					placeholder={ tempDoctorData?.entity_name ? tempDoctorData.entity_name : "Doctor's name" }
					style={ styles.text_input }
					onChangeText={ ( text ) =>
					{
						setDoctorName( text );
						setTempDoctorData( prev => ({ ...prev, 'entity_name': text, 'entity_type': 'Doctor' }));
					}}
				/>

				<TextInput
					accessibilityLabel='Specialty'
					accessibilityHint="Enter doctor's specialty."
					onChangeText={ ( text ) => setTempDoctorData( prev => ({ ...prev, 'specialty': text }))}
					maxLength={ 100 }
					placeholder={ tempDoctorData?.specialty ? tempDoctorData.specialty : 'Specialty' }
					style={ styles.text_input }
				/>

				<TextInput
					accessibilityLabel='Facility name'
					accessibilityHint='Type in the name of the facility that the doctor works at.'
					style={ styles.text_input }
					onChangeText={ ( text ) => setTempDoctorData( prev => ({ ...prev, 'facility_name': text }))}
					maxLength={ 100 }
					placeholder={ tempDoctorData?.facility_name ? tempDoctorData.facility_name : 'Facility name' }
					textContentType='name'
				/>

				<View style={ styles.checkbox_row }>
					<Text style={ styles.text }>This is a doctor I am currently seeing:</Text>
					<Checkbox
						accessibilityLabel='Current doctor'
						accessibilityHint='Check the box if this is a doctor that you are currently a patient of.'
						color={ currentDr ? '#3087eb' : undefined }
						value={ currentDr }
						onValueChange={ ( ) =>
						{
							setCurrentDr( !currentDr );
							setTempDoctorData( prev => ({ ...prev, 'current': !currentDr }));
						}}
					/>
				</View>


				{/* Cancel/Save button row */}
				<View style={ styles.save_row }>
					{/* Cancel Button */}
					<TouchableOpacity
						accessibilityLabel='Cancel button'
						accessibilityHint='Press to cancel adding or editing this doctor information.'
						style={ styles.button_end }
						onPress={ ( ) => handlePress( true, false )}
					>
						<Text style={ styles.save_button_text }>Cancel</Text>
					</TouchableOpacity>

					{/* Save Button */}
					<TouchableOpacity
						accessibilityLabel='Save button'
						accessibilityHint='Press to save changes.'
						style={ styles.button_end }
						onPress={ ( ) => handlePress( false, false )}
					>
						<Text style={ styles.save_button_text }>Save</Text>
					</TouchableOpacity>

					{/* Next Button */}
					{
						!doctorData?.[doctorIndex]?.entity_id ?
						<TouchableOpacity
							accessibilityLabel='Contact details button'
							accessibilityHint='Save and go to add contact detail screen.'
							style={ styles.button_end }
							onPress={ ( ) => handlePress( false, true )}
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
					buttonVisibleCondition={ tempDoctorData?.entity_id }
					description={ 'doctor' }
					dialogVisible={ deleteDoctorVisible }
					handleCancel={ handleCancel }
					handleDelete={ handleDelete }
					setDialogVisible={ setDeleteDoctorVisible }
					title={ tempDoctorData?.entity_name }
				/>
			: null
			}


			{/* Form Validation Error */}
			{
				showValidationError ?
				<View style={ styles.alert_row }>
					<Text style={[ styles.alert, styles.text ]}>{ errors.doctorName }</Text>
				</View>
			: null
			}
		</View>
	)
}