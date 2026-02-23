import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { TextInput } from 'react-native-paper';

import styles from "../../../styles/styles.js";

const underlay_color = '#d1dce4ff';

export const Insurance = ({ insuranceData, setEditInsuranceVisible, setInsuranceIndex, setViewInsuranceVisible }) =>
{
	return (
		<View style={[ styles.data_container_view, { flex: 2 } ]}>
			<Text style={ styles.title_bar }>Health Insurance</Text>
			<ScrollView>
			{
				insuranceData.map(( insurance, i) =>
				<View key={insurance.insurance_id} style={ styles.text_list }>
					<View style={{flex:0.9}}>
							{ insurance?.entity_name ? <Text style={ styles.text }>{ insurance.entity_name }</Text> : null}
					</View>

					<TouchableOpacity
					accessibilityLabel='Expand button'
					accessibilityHint='Press to view additional details.'
						style={ styles.expand_button }
						onPress={ ( ) =>
						{
							setInsuranceIndex( i );
							setViewInsuranceVisible( true );
						}}
					>
						<Text style={ styles.text }>{'< >'}</Text>
					</TouchableOpacity>
				</View>
			)}

				<TouchableOpacity
					accessibilityLabel='Add button'
					accessibilityHint='Press to add new health insurance details.'
					onPress={ ( ) => setEditInsuranceVisible( true )}
					style={ styles.data_button_size }
				>
					<Text style={styles.text_button}>Add new insurance</Text>
				</TouchableOpacity>
			</ScrollView>
		</View>
	);
};


export const ViewInsurance = ({
								handleNavigation, insuranceData, insuranceIndex, setEditInsuranceVisible,
								setInsuranceIndex, setTempInsuranceData, setViewInsuranceVisible
							}) =>
{
	return (
		<View style={ styles.data_container_view }>
			<View style={{ flex: 3}}>
				{
					insuranceData?.[insuranceIndex]?.entity_name ?
						<Text style={ styles.title_bar }>{ insuranceData?.[insuranceIndex]?.entity_name }</Text>
				: null
				}

				{
					insuranceData?.[insuranceIndex]?.policy_number ?
					<View style={ styles.data_section_small }>
						<Text style={ styles.heading_text }>Policy Number</Text>
						<Text style={ styles.text }>{ insuranceData?.[insuranceIndex].policy_number }</Text>
					</View>
				: null
				}

				{
					insuranceData?.[insuranceIndex]?.start_date ?
					<View style={ styles.data_section_small }>
						<Text style={ styles.heading_text }>Policy start date</Text>
						<Text style={ styles.text }>{ insuranceData?.[insuranceIndex].start_date }</Text>
					</View>
				: null
				}

				{
					insuranceData?.[insuranceIndex]?.insurance_note ?
					<View style={ styles.data_section_small }>
						<Text style={ styles.heading_text }>Note</Text>
						<Text style={ styles.text }>{ insuranceData?.[insuranceIndex].insurance_note }</Text>
					</View>
				: null
				}

				{
					insuranceData?.[insuranceIndex]?.phone_number ?
					<View style={ styles.data_section_small }>
						<Text style={ styles.heading_text }>Phone number</Text>
						<Text style={ styles.text }>{ insuranceData?.[insuranceIndex].phone_number }</Text>
					</View>
				: null
				}


				{/* Close/View button row */}
				<View style={ styles.save_row }>
				{/* Close Button */}
				<TouchableOpacity
					accessibilityLabel='Close button'
					accessibilityHint='Press to close insurance details screen.'
					style={ styles.game_button_end }
					onPress={ ( ) =>
					{
						setInsuranceIndex( null );
						setViewInsuranceVisible( false );
					}}
				>
					<Text style={ styles.save_button_text }>Close</Text>
				</TouchableOpacity>

				<TouchableOpacity
					accessibilityLabel='Edit button'
					accessibilityHint='Press to edit health insurance details.'
					style={ styles.game_button_end }
					onPress={ ( ) =>
					{
						setEditInsuranceVisible( true );
						setTempInsuranceData({...insuranceData[insuranceIndex] });
						setViewInsuranceVisible( false );
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
						handleNavigation( insuranceData?.[insuranceIndex]?.insurance_id, insuranceData?.[insuranceIndex]?.entity_name );
						setViewInsuranceVisible( false );
					}}
				>
					<Text style={ styles.save_button_text }>View contact details</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};



export const EditInsurance = ({
								insuranceData, insuranceIndex, save, setEditInsuranceVisible, setInsuranceIndex,
								setTempInsuranceData, setViewInsuranceVisible, tempInsuranceData
							}) =>
{
	// Date Picker
	const [ isDatePickerVisible, setDatePickerVisibility ] = useState( false );
	const showDatePicker = () => setDatePickerVisibility(true);
	const hideDatePicker = () => setDatePickerVisibility(false);

	const handleConfirm = ( date ) =>
	{
		setTempInsuranceData( prev => ({ ...prev, 'start_date': date.toISOString().slice( 0,10)}));
		hideDatePicker();
	};


	// Form Validation
	const [ companyName, setCompanyName ] = useState( tempInsuranceData?.entity_name ? tempInsuranceData.entity_name : '' );
	const [ errors, setErrors ] = useState({ });
	const [ isFormValid, setIsFormValid ] = useState( false );
	const [ showValidationError, setShowValidationError ] = useState( false );


	useEffect(() =>
	{
		validateForm( );
	}, [ companyName ]);


	const validateForm = ( ) =>
	{
		setIsFormValid( false );

		let errors = {};

		if ( companyName == '')
		{
			errors.companyName = 'Please enter a company name.';
		}
			setErrors( errors );
			setIsFormValid(Object.keys( errors ).length === 0);
	}


	const handlePress = ( close, shouldNavigate ) =>
	{
		let prev_data = ( insuranceIndex != null ) ? JSON.stringify( insuranceData[insuranceIndex]) : null;

		if (( prev_data === JSON.stringify( tempInsuranceData )) || close == true )
		{
			// View -> Edit -> Cancel / Save without changes ( reloads view )
			if ( tempInsuranceData?.insurance_id )    setViewInsuranceVisible( true );

			// New -> Cancel
			else    setInsuranceIndex( null );

			setCompanyName( '' );
			setEditInsuranceVisible( false );
			setTempInsuranceData( );
			return;
		}

		// New / Edit -> Save / Next
		if ( isFormValid )
		{
			save( 'Insurance', tempInsuranceData, 'insurance_id', shouldNavigate );

			setCompanyName( '' );
			setEditInsuranceVisible( false );
			setInsuranceIndex( null );
			setTempInsuranceData( );
		}
		else    setShowValidationError( true );
	}


	return (
		<View style={ styles.data_container_edit}>
			<TextInput
				accessibilityLabel='Insurance company'
				accessibilityHint='Type in name of insurance company.'
				style={ styles.text_input}
				placeholder={ tempInsuranceData?.entity_name ? tempInsuranceData.entity_name : 'Insurance company name' }
				onChangeText={( text ) =>
				{
					setCompanyName( text );
					setTempInsuranceData( prev => ({ ...prev, 'entity_name': text }));
					setTempInsuranceData( prev => ({ ...prev, 'insurance_type': 'Health' }));
				}}
			/>

			<TextInput
				accessibilityLabel='Insurance policy number'
				accessibilityHint='Type in insurance policy number.'
				onChangeText={( text ) => setTempInsuranceData( prev => ({ ...prev, 'policy_number': text }))}
				placeholder={ tempInsuranceData?.policy_number ? tempInsuranceData.policy_number : 'Policy Number' }
				style={ styles.text_input}
			/>


			{/* Policy Start Date */}
			<TouchableHighlight
				accessibilityLabel='Date picker'
				accessibilityHint='Touch to open date picker for start date of insurance.'
				style={ styles.menu }
				underlayColor={ underlay_color }
				onPress={ showDatePicker }
				>
				<Text style={[ styles.text_input, styles.menu_text ]}>
					{ tempInsuranceData?.start_date ? tempInsuranceData?.start_date : 'Policy start date' }
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
				onChangeText={( text ) => setTempInsuranceData( prev => ({ ...prev, 'insurance_note' : text }))}
				placeholder={ tempInsuranceData?.insurance_note ? tempInsuranceData.insurance_note : 'Notes' }
				style={ styles.text_input }
			/>


			{/* Cancel/Save button row */}
			<View style={ styles.save_row }>
				{/* Cancel Button */}
				<TouchableOpacity
					accessibilityLabel='Cancel button'
					accessibilityHint='Press to cancel changes.'
					style={ styles.game_button_end }
					onPress={ ( ) => handlePress( true, false )}
				>
					<Text style={ styles.save_button_text }>Cancel</Text>
				</TouchableOpacity>

			
				{/* Save Button */}
				<TouchableOpacity
					accessibilityLabel='Save button'
					accessibilityHint='Press to save changes.'
					onPress={ ( ) => handlePress( false, false )}
					style={ styles.game_button_end }
				>
					<Text style={ styles.save_button_text }>Save</Text>
				</TouchableOpacity>

				{/* Next Button */}
				{ !insuranceData?.[insuranceIndex]?.insurance_id ?
					<TouchableOpacity
						accessibilityLabel='Contact details button'
						accessibilityHint='Save and go to add contact detail screen.'
						onPress={ ( ) => handlePress( false, true )}
						style={ styles.game_button_end }
					>
						<Text style={ styles.save_button_text }>Next</Text>
					</TouchableOpacity>
				: null
				}
			</View>

			{/* Form Validation Error */}
			{
				showValidationError ?
				<View style={ styles.alert_row }>
					<Text style={ styles.alert }>{ errors.companyName }</Text>
				</View>
			: null
			}
		</View>
	);
}