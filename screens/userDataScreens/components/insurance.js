import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { TextInput } from 'react-native-paper';

import styles from "../../../styles/styles.js";

const underlay_color = '#d1dce4ff';

export const Insurance = ({ insuranceData, setEditInsuranceVisible, setInsuranceIndex, setViewInsuranceVisible }) =>
{
	return (
		<View style={[ styles.container, { flex: 2/3 } ]}>
			<ScrollView style={ styles.data_container }>
				<Text style={ styles.title_bar }>Health Insurance</Text>
				{
					insuranceData.map(( insurance, i) =>
					<View key={insurance.insurance_id} style = {{ flexDirection: 'row', justifyContent: 'space-between', height: 50, borderBottomWidth: 0.75, paddingLeft: 10, paddingRight: 10 }}>
						<View style={{flex:0.9}}>
								{ insurance?.entity_name ? <Text style={ styles.text }>{ insurance.entity_name }</Text> : null}
						</View>

						<TouchableOpacity
						accessibilityLabel='Expand button'
						accessibilityHint='Press to view additional details.'
							style={{ fontSize: 18, flex: 0.1, alignItems: 'flex-end' }}
							onPress={ ( ) =>
							{
								setInsuranceIndex( i );
								setViewInsuranceVisible( true );
							}}
						>
							<Text style={[ styles.text, { paddingRight: 5 }]}>{'< >'}</Text>
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
		<View style={ styles.container }>
			<View style={ styles.data_container }>
				<View style={ styles.heading_row }>
					{ insuranceData?.[insuranceIndex]?.entity_name ? <Text style={ styles.heading_text }>{ insuranceData?.[insuranceIndex]?.entity_name }</Text> : null }

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
						<Text style={[ styles.text_button, { paddingLeft: 5, paddingRight: 5 }]}>Edit</Text>
					</TouchableOpacity>
				</View>

				{ insuranceData?.[insuranceIndex]?.policy_number ? <Text style={ styles.text }>Policy Number: { insuranceData?.[insuranceIndex].policy_number }</Text> : null }
				{ insuranceData?.[insuranceIndex]?.start_date ? <Text style={ styles.text }>Policy start date: { insuranceData?.[insuranceIndex].start_date }</Text> : null }
				{ insuranceData?.[insuranceIndex]?.insurance_note ? <Text style={ styles.text }>Note: { insuranceData?.[insuranceIndex].insurance_note }</Text> : null }
				{ insuranceData?.[insuranceIndex]?.phone_number ? <Text style={ styles.text }>Phone number: { insuranceData?.[insuranceIndex].phone_number }</Text> : null }



				{/* Close/View Button Row */}
				<View style={{ flexDirection: 'row', justifyContent: 'space-around', gap: 5}}>
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
					accessibilityLabel='Contact details button'
					accessibilityHint='Press to view insurance contact details.'
					style={ styles.game_button_end }
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
		</View>
	);
};




export const EditInsurance = ({ 
								insuranceData, insuranceIndex, isFormValid, loadInsuranceData,
								saveToDB, setEditInsuranceVisible, setInsuranceIndex, setIsFormValid,
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
	const [ showValidationError, setShowValidationError ] = useState( false );
	const [ errors, setErrors ] = useState({ });

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

		if (( prev_data  === JSON.stringify( tempInsuranceData )) || close == true )
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
			saveToDB( 'Insurance', tempInsuranceData, loadInsuranceData, shouldNavigate );
			setCompanyName( '' );
			setEditInsuranceVisible( false );
			setInsuranceIndex( null );
			setTempInsuranceData( );
		}
		else    setShowValidationError( true );
	}


	return (
		<View style={ styles.edit_container }>
			<View style={ styles.data_container }>
				<TextInput
					accessibilityLabel='Insurance company'
					accessibilityHint='Type in name of insurance company.'
					style={ styles.text_input}
					placeholder={ tempInsuranceData?.entity_name ? tempInsuranceData.entity_name : 'Insurance company name' }
					onChangeText={( text ) =>
					{	
						setCompanyName( text );
						setTempInsuranceData( prev => ({ ...prev,  'entity_name': text }));
						setTempInsuranceData( prev => ({ ...prev,  'insurance_type': 'Health' }));
					}}
				/>

				<TextInput
					accessibilityLabel='Insurance policy number'
					accessibilityHint='Type in insurance policy number.'
					style={ styles.text_input}
					placeholder={ tempInsuranceData?.policy_number ? tempInsuranceData.policy_number : 'Policy Number' }
					onChangeText={( text ) => setTempInsuranceData( prev => ({ ...prev,  'policy_number': text }))}
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
					style={ styles.text_input }
					placeholder={ tempInsuranceData?.insurance_note ? tempInsuranceData.insurance_note : 'Notes' }
					onChangeText={( text ) => setTempInsuranceData( prev => ({ ...prev,  'insurance_note' : text }))}
				/>


				{/* Cancel/Save Button Row */}
				<View style={ styles.save_row }>
					{/* Cancel Button */}
					<TouchableOpacity
						accessibilityLabel='Cancel button'
						accessibilityHint='Press to cancel changes.'
						style={ styles.game_button_end }
						onPress={ ( ) =>  handlePress( true, false )}
					>
						<Text style={ styles.save_button_text }>Cancel</Text>
					</TouchableOpacity>

					
					{/* Save Button */}
					<TouchableOpacity
						accessibilityLabel='Save button'
						accessibilityHint='Press to save changes.'
						style={ styles.game_button_end }
						onPress={ ( ) => handlePress( false, false )}
					>
						<Text style={ styles.save_button_text }>Save</Text>
					</TouchableOpacity>	

					{/* Next Button */}
					{ !insuranceData?.[insuranceIndex]?.insurance_id ?
						<TouchableOpacity
							accessibilityLabel='Contact details button'
							accessibilityHint='Save and go to add contact detail screen.'
							style={ styles.game_button_end  }
							onPress={ ( ) => handlePress( false, true )}
						>
							<Text style={ styles.save_button_text }>Next</Text>
						</TouchableOpacity>
					: null
					}
				</View>

				{/* Form Validation Error */}
				{
					showValidationError ?
					<View
						accessibilityLabel='Form error.'
						style={{ alignItems: 'center'}}
					>
						<Text style={ styles.allergy_alert }>{ errors.companyName }</Text>
					</View>
				: null
				}
			</View>
		</View>
	);
}