import { Fragment } from 'react';
import { Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';
import { TextInput } from 'react-native-paper';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from '@react-native-picker/picker';

import styles from "../../../styles/styles";

const underlay_color = '#d1dce4ff';


export const Person = ({entityData, setEditPersonVisible, setTempEntityData, showEditButton }) =>
{
	return (
		<View style={[ styles.container, { flex: 1/3 }]}>
			<View style={ styles.data_container }>
			<Text style={ styles.title_bar }>Personal Information</Text>
			{
				entityData[0]?.entity_name != null ?
				<Fragment>
				{
					entityData.map( person =>
					(
						<View key={ person.entity_id } style={{ marginBottom: 10 }}>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 5}}>
								{
									person?.entity_name != null ?
									<Text style={ styles.heading_text }>
											{person.entity_name}
									</Text>
								: null
								}
								{
									showEditButton ?
									<TouchableOpacity
										accessibilityLabel='Edit button'
										accessibilityHint='Press to edit user information.'
										onPress={ () =>
										{
											setEditPersonVisible( true );
											setTempEntityData( entityData[0] );
										}}
									>
										<Text style={ styles.text_button }>Edit</Text>
									</TouchableOpacity>
								: null
								}
							</View>

							{
								person?.dob != null ?
								<Text style={ styles.text }>
									Date of birth: { person.dob }
								</Text>
							: null
							}
							{
								person?.sex != null ?
								<Text style={ styles.text }>
									Sex: {person.sex}
								</Text>
							: null
							}
							{
								person?.height != null ?
								<Text style={ styles.text }>
									Height: {person.height}
								</Text>
							: null
							}
							{
								person?.weight != null ?
								<Text style={ styles.text }>
									Weight: {person.weight}
								</Text>
							: null
							}
							{
								person?.blood_type != null ?
								<Text style={ styles.text }>
									Blood Type: {person.blood_type}
								</Text>
							: null
							}
						</View>
					))
				}
				</Fragment>
				:
				<View>
					{
						screen == 'EmergencyDataScreen' ? null :
						<TouchableOpacity
							accessibilityLabel='Add information button'
							accessibilityHint='Press to add user information.'
							onPress={ () => setEditPersonVisible( true )}
							style={ styles.data_button_size }
						>
							<Text style={ styles.text_button }>Add information</Text>
						</TouchableOpacity>
					}
				</View>
			}
			</View>
		</View>
	);
};




export const EditPerson = ({
								entityData, isFormValid, loadEntityData,
								saveToDB, setEditPersonVisible, setIsFormValid,
								setTempEntityData, tempEntityData
							}) =>
{
	// Date Picker
	const [ datePickerVisible, setDatePickerVisible ] = useState( false );

	const showDatePicker = () => setDatePickerVisible( true );
	const hideDatePicker = () => setDatePickerVisible( false );

	const handleConfirm = ( date ) =>
	{
		setTempEntityData( prev => ({ ...prev, 'dob': date.toISOString().slice( 0,10 )}));
		hideDatePicker();
	};


	// Form Validation ( Must (minimally) have a name )
	const [ entityName, setEntityName ] = useState( tempEntityData?.entity_name ? tempEntityData.entity_name : '' );

	const [ showValidationError, setShowValidationError ] = useState( false );
	const [ errors, setErrors ] = useState({ });

	useEffect(() =>
	{
		validateForm();
	}, [entityName ]);

	const validateForm = ( ) =>
	{
		let errors = {};

		// Validate name field
		if ( entityName == '')     errors.entityName = 'Name is required.';

		setErrors( errors );
		setIsFormValid(Object.keys( errors ).length === 0);
	};


	// Close / Save button handler for Edit modal
	function handlePress( close )
	{	
		// Don't save if changes have not been made
		if (JSON.stringify( entityData ) === JSON.stringify( tempEntityData ) || close == true )
		{
			setEditPersonVisible( false );
			setEntityName( '' );
			setTempEntityData( );
		}

		if ( isFormValid )
		{
			saveToDB( 'Person', tempEntityData, loadEntityData, false );
			setEditPersonVisible( false );
			setEntityName( '' );
			setTempEntityData( );
		}
		else    setShowValidationError( true );
	}


	return(
		<View style={ styles.edit_container }>
			<View style={ styles.data_container }>
					<View>
						<TextInput
							accessibilityLabel='Full user name'
							style={ styles.text_input }
							placeholder={ tempEntityData?.entity_name ? tempEntityData.entity_name : 'Full Name' }
							onChangeText={ ( text ) =>
							{
								setEntityName( text );
								setTempEntityData( prev => ({ ...prev, 'entity_name': text }));
								setTempEntityData( prev => ({ ...prev, 'entity_name': text }));
							}}
						/>


						<TouchableHighlight
							accessibilityLabel='Date picker'
							accessibilityHint='Touch to open date picker for date of birth.'
							onPress={ showDatePicker }
							style={ styles.menu }
							underlayColor={ underlay_color }
						>
							<Text style={[ styles.text_input, styles.menu_text ]}>{ tempEntityData?.dob ? tempEntityData.dob : 'Date of birth' }</Text>
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
								selectedValue={ tempEntityData?.sex ? tempEntityData.sex : 'Sex' }
								onValueChange={( itemValue ) =>setTempEntityData( prev => ({ ...prev, 'sex': itemValue }))}
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
							placeholder={ tempEntityData?.height?tempEntityData.height :'height' }
							onChangeText={ ( text ) => setTempEntityData( prev => ({ ...prev, 'height': text }))}
						/>


						<TextInput
							accessibilityLabel='Weight'
							accessibilityHint='Type in your weight.'
							style={ styles.text_input }
							placeholder={ tempEntityData?.weight?tempEntityData.weight : 'weight' }
							onChangeText={ ( text ) => setTempEntityData( prev => ({ ...prev, 'weight': text }))}
						/>
					


						<View style={ styles.picker_view }>
							<Picker
								accessibilityLabel='Blood type menu.'
								accessibilityHint='Select your blood type.'
								selectedValue={ tempEntityData?.blood_type? tempEntityData.blood_type : '' }
								style={ styles.picker }
								onValueChange={( itemValue ) => setTempEntityData( prev => ({ ...prev, 'blood_type': itemValue }))}
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
					</View>


				{/* Cancel/Save button row */}
				<View style={ styles.save_row }>
					{/* Cancel Button */}
					<TouchableOpacity
						accessibilityLabel='Cancel button'
						accessibilityHint='Press to cancel editing.'
						style={ styles.game_button_end }
						onPress={ () => handlePress( true )}
					>
						<Text style={ styles.save_button_text }>Cancel</Text>
					</TouchableOpacity>

					{/* Save Button */}
					<TouchableOpacity
						accessibilityLabel='Save button'
						accessibilityHint='Press to save.'
						style={ styles.game_button_end }
						onPress={ () => handlePress( false )}
					>
						<Text style={ styles.save_button_text }>Save</Text>
					</TouchableOpacity>
				</View>

				{/* Form Validation Error */}
				{
					showValidationError ?
					<View style={ styles.alert_row }>
						<Text style={ styles.alert }>{ errors.entityName }</Text>
					</View>
				: null
				}
			</View>
		</View>
	)
}