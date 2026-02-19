import { Fragment } from 'react';
import { Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';
import { TextInput } from 'react-native-paper';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from '@react-native-picker/picker';


import styles from "../../../styles/styles";

import updateStateData  from '../../../common/userData/updateStateData.js';

const underlay_color = '#d1dce4ff';

export const Person = ( { entityData, screen, setEditPersonVisible, setTempEntityData }) => 
{

	return (
		<View style={ styles.container }>
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
								{ person?.entity_name != null ? <Text style={ styles.heading_text }>{person.entity_name}</Text> : null }

								{ 
									screen == 'EmergencyDataScreen' ? null :
									<TouchableOpacity 
										accessibilityLabel='button'
										onPress={ () => 
										{
											setEditPersonVisible( true );
											setTempEntityData( entityData );
										}}
									>
										<Text style={ styles.text_button }>Edit</Text>
									</TouchableOpacity>		
								}							
							</View>

							{ 
								person?.dob != null ? 
								<Text 
									accessibilityRole="text"
									accessibilityLabel="Date of birth"
									style={ styles.text }
								>
									Date of birth: {person.dob}
								</Text> 
							: null 
							}
							{ 
								person?.sex != null ? 
								<Text 
									accessibilityRole="text"
									accessibilityLabel="Sex"
									style={ styles.text }
								>
									Sex: {person.sex}
								</Text> 
							: null  
							}
							{ 
								person?.height != null ? 
								<Text 
									accessibilityRole="text"
									accessibilityLabel="Height"
									style={ styles.text }
								>
									Height: {person.height}
								</Text> 
							: null 
							}
							{ 
								person?.weight != null ? 
								<Text 
									accessibilityRole="text"
									accessibilityLabel="Weight"
									style={ styles.text }
								>
									Weight: {person.weight}
								</Text> 
							: null 
							}
							{ 
								person?.blood_type != null ? 
								<Text 
									accessibilityRole="text"
									accessibilityLabel="Blood type"
									style={ styles.text }
								>
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
							accessibilityLabel='button'
							onPress={ () => setEditPersonVisible( true )}
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




















export const EditPerson = ( { entityData, isFormValid, saveToDB, setEditPersonVisible, setEntityData, setIsFormValid, setTempEntityData, tempEntityData } ) => 
{
	// Date Picker \/
	const [ datePickerVisible, setDatePickerVisible ] = useState( false );

	const showDatePicker = () => setDatePickerVisible( true );
	const hideDatePicker = () => setDatePickerVisible( false );

	const handleConfirm = ( date ) => 
	{
		setEntityData( updateStateData( 'dob', date.toISOString().slice( 0,10), entityData ));
		hideDatePicker();
	};
	// Date Picker /\	


		// Form Validation  \/
	// Form Validation ( Must (minimally) have a name )   
	const [ entityName, setEntityName ] = useState( entityData[0]?.entity_name ? entityData[0].entity_name : '' );

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

        // Set the errors and update form validity
        setErrors( errors );
        setIsFormValid(Object.keys( errors ).length === 0);
    };
	// Form Validation  /\




	//  Close / Save button handler for Edit modal
	function handlePress( )
	{
		// Only triggers save( insert/update ) if minimum entered (or already exists )
		if ( !isFormValid )    setShowValidationError( true );	
		else
		{
			// Only save if changes have been made
			if (JSON.stringify( entityData ) !== JSON.stringify( tempEntityData ) &&  tempEntityData != undefined )
			{
				saveToDB( );
			}

			setEditPersonVisible( false );
			setEntityName( '' );
			setTempEntityData( );
		}
	}


	return(
		<View style={ styles.container }>
			<View style={ styles.data_container }>
			{ 
				<View>
				{  
					entityData.map( person => 
					<View key={person.entity_id}>
						<TextInput					
							accessibilityLabel='Name'			
							style={ styles.text_input }
							placeholder={ person.entity_name ?  person.entity_name :  'Full Name' }
							//left={<TextInput.Icon icon="account-circle" />}
							onChangeText={ ( text ) => setEntityData(  updateStateData( 'entity_name', text, entityData ))}
						/>



						<TouchableHighlight
							accessibilityLabel="Date picker"
							accessibilityHint="Touch to open date picker for date of birth."
							onPress={ showDatePicker } 
							style={ styles.menu }
							underlayColor={ underlay_color }
						>
							<Text style={[ styles.text_input, styles.menu_text ]}>{ person.dob ?  person.dob :  'Date of birth' }</Text>
						</TouchableHighlight> 
						
						<DateTimePickerModal
							isVisible={ datePickerVisible }
							mode="date"
							onConfirm={ handleConfirm }
							onCancel={ hideDatePicker }
							// display={'spinner'}
						/>

						<View style={ styles.picker_view }>
						{/* <Image source={lily_pad} style={{height: 20, width: 20}} /> */}
						{/* @react-native-picker/picker  ~~~ */}
							<Picker
								accessibilityLabel='Sex menu'
								style={ styles.picker }
								selectedValue={ person.sex ?  person.sex :  'Sex'  }
								onValueChange={( itemValue ) => setEntityData( updateStateData( 'sex', itemValue, entityData ))}	
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

						{/* ~~~  { borderRadius: 5}  all seem to have rounded */}
						<TextInput
							accessibilityLabel='height'
							style={[ styles.text_input,  ]}
							placeholder={ person.height?  person.height :  'height' }
							//left={<TextInput.Icon icon="account-circle" />}
							onChangeText={ ( text ) => setEntityData( updateStateData( 'height', text, entityData ))}
						/>


						<TextInput
							accessibilityLabel='Weight'
							style={ styles.text_input }
							placeholder={ person.weight?  person.weight :  'weight' }
							onChangeText={ ( text ) => setEntityData( updateStateData( 'weight', text, entityData ))}
							// left={ <TextInput.Icon icon="account-circle" />}
						/>
						


						<View style={ styles.picker_view }>
						{/* <Image source={lily_pad} style={{height: 20, width: 20}} /> */}
						{/* @react-native-picker/picker */}
							<Picker
								accessibilityLabel='Blood type menu'
								selectedValue={ person.blood_type?  person.blood_type :  ''  }
								style={ styles.picker } 
								onValueChange={( itemValue ) =>
								{
									setEntityData( updateStateData( 'blood_type', itemValue, entityData ))																
								}}	
							>
								<Picker.Item
									color='black'
									enabled={ false }								
									label='Blood Type'
									value=''
								/>
								<Picker.Item 
									accessibilityLabel="menuitem"
									label='A+'
									value='A+'
								/>
								<Picker.Item 
									accessibilityLabel="menuitem"
									label='A-'
									value='A-'					
								/>
								<Picker.Item 
									accessibilityLabel="menuitem"
									label='B+'
									value='B+'
								/>
								<Picker.Item
									accessibilityLabel="menuitem"
									label='B-'
									value='B-'
								/>
								<Picker.Item
									accessibilityLabel="menuitem"
									label='AB+'
									value='AB+'
								/>
								<Picker.Item 
									accessibilityLabel="menuitem"
									label='AB-'
									value='AB-'
								/>
								<Picker.Item
									accessibilityLabel="menuitem"
									label='O+'
									value='O+'
								/>
								<Picker.Item 
									accessibilityLabel="menuitem"
									label='O-'
									value='O-'
								/>
								<Picker.Item 
									accessibilityLabel="menuitem"
									label='Unknown'
									value='Unknown'
								/> 
							</Picker>
						</View>
					</View>
				)}
				</View>
			}

				{/* Cancel/Save Button Row */}
				<View style={ styles.save_row }>
					{/* Cancel Button */}
					<TouchableOpacity
						accessibilityLabel='button'
						style={ styles.game_button_end }
						onPress={ () => handlePress( )}
					>
						<Text style={ styles.save_button_text }>Cancel</Text>
					</TouchableOpacity>

					{/* Save Button */}
					<TouchableOpacity
						accessibilityLabel='button'
						style={ styles.game_button_end }
						onPress={ () => handlePress( )}
					>
						<Text style={ styles.save_button_text }>Save</Text>
					</TouchableOpacity>	
				</View>	

				{/* Form Validation Error */}
				{
					showValidationError ?
					<View style={{ alignItems: 'center'}}>
						<Text style={ styles.allergy_alert }>{ errors.entityName }</Text>
					</View>
				: null
				}
			</View>
		</View>
	)
}