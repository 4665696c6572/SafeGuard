import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-paper';

import styles from "../../../styles/styles.js";


export const ViewContact = ({
								contactData, handleNavigation, params, setEditContactVisible, setTempAddressData,
								setTempEmailData, setTempFaxData, setTempPhoneData, setViewContactVisible
							}) =>
{
	return (
		<View style={ styles.container }>
			<View style={ styles.data_container }>
			{
				( contactData?.contact_name ?? params.contact_name ) ?
				<Text style={ styles.title_bar }>
					{ contactData?.contact_name ?? params.contact_name }
				</Text>
			: null
			}

			{
				params?.facility ?
				<View style={ styles.heading_row }>
					<Text style={ styles.heading_text }>
						{ params.facility }
					</Text>
				</View>
			: null
			}


			{/* Address Section */}
			{
				contactData?.address?.address_id ?
				<View style={ styles.section }>
					<Text style={ styles.heading_text }>Address</Text>
					{
						contactData?.address?.address_line_one ?
						<Text style={ styles.text }>
							{ contactData?.address?.address_line_one }
						</Text>
					: null
					}

					{
						contactData?.address?.address_line_two ?
						<Text style={ styles.text }>
							{ contactData?.address?.address_line_two }
						</Text>
					: null
					}

					{
						contactData?.address?.city ?
						<Text style={ styles.text }>{ contactData?.address?.city }</Text>
					: null
					}

					{
						contactData?.address?.state ?
						<Text style={ styles.text }>{ contactData?.address?.state }</Text>
					: null
					}

					{
						contactData?.address?.post_code ?
						<Text style={ styles.text }>{ contactData?.address?.post_code }</Text>
					: null
					}

					{
						contactData?.address?.country ?
						<Text style={ styles.text }>{ contactData?.address?.country }</Text>
					: null
					}

					{
						contactData?.address?.address_note ?
						<Text style={ styles.text }>{ contactData?.address?.address_note }</Text>
					: null
					}
				</View>
			: null
			}


			{/* Phone Number Section */}
			{
			contactData?.phone?.phone_number_id ?
				<View style={ styles.section }>
					<Text style={ styles.heading_text }>Office phone number</Text>
					{
						contactData?.phone?.phone_number ?
						<Text style={ styles.text }>{ contactData?.phone?.phone_number }</Text>
					: null
					}

					{
						contactData?.phone?.phone_number_note ?
						<Text style={ styles.text }>{ contactData?.phone?.phone_number_note }</Text>
					: null
					}
				</View>
			: null
			}


			{/* Fax Section */}
			{
				contactData?.fax?.fax_number_id ?
				<View style={ styles.section }>
					<Text style={ styles.heading_text }>Fax number</Text>
					{
						contactData?.fax?.fax_number ?
						<Text style={ styles.text }>{ contactData?.fax?.fax_number }</Text>
					: null
					}

					{
						contactData?.fax?.fax_note ?
						<Text style={ styles.text }>{ contactData?.fax?.fax_note }</Text>
					: null
					}
				</View>
			: null
			}


			{/* Email Section */}
			{
				contactData?.email?.email_id ?
				<View style={ styles.section }>
					<Text style={ styles.heading_text }>Email</Text>
					{
						contactData?.email?.email ?
						<Text style={ styles.text }>{ contactData?.email?.email }</Text>
					: null
					}

					{
						contactData?.email?.email_note ?
						<Text style={ styles.text }>{ contactData?.email?.email_note }</Text>
					: null
					}
				</View>
			: null
			}
		</View>


		{
			( !contactData?.address.address_id && !contactData?.email.email_id && !contactData?.fax.fax_number_id && !contactData?.phone.phone_number_id ) ?
			<View style={{ alignItems: 'center' }}>
				<Text style={[ styles.heading_text, { paddingBottom: 20, paddingTop: 20 }]}>No contact details found.</Text>
			</View>
		: null
		}


			<View style={ styles.save_row }>
				<TouchableOpacity
					accessibilityLabel='Close button'
					accessibilityHint='Press to return to previous screen.'
					onPress={ ( ) =>
					{
						setViewContactVisible( false );
						handleNavigation( );
					}}
				>
					<Text style={ styles.save_button_text }>Close</Text>
				</TouchableOpacity>

				<TouchableOpacity
					accessibilityLabel='Add / Edit button'
					accessibilityHint='Press to add or edit contact details.'
					onPress={ ( ) =>
					{
						setEditContactVisible( true );
						setTempAddressData( contactData?.address );
						setTempEmailData( contactData?.email );
						setTempFaxData( contactData?.fax );
						setTempPhoneData( contactData?.phone );
					}}
				>
					{
						(
							contactData?.address.address_id || contactData?.email.email_id ||
							contactData?.fax.fax_id || contactData?.phone.phone_id
						) ?
						<Text style={ styles.save_button_text }>Edit</Text>
					:
						<Text style={ styles.save_button_text }>Add details </Text>
					}
				</TouchableOpacity>
			</View>
		</View>
	);
}



export const EditContact = ({
								contactData, handleNavigation, isAddressValid, isEmailValid,
								isFaxValid, isPhoneValid, params, saveToDB, setEditContactVisible,
								setIsAddressValid, setIsEmailValid, setIsFaxValid, setIsPhoneValid,
								setTempAddressData, setTempEmailData, setTempFaxData, setTempPhoneData,
								tempAddressData, tempEmailData, tempFaxData, tempPhoneData
							}) =>
{
	// Modal controls
	const [ addAddressVisible, setAddAddressVisible ] = useState( false );
	const [ addContactDetailsVisible, setAddContactDetailsVisible ] = useState( false );
	const [ addEmailVisible, setAddEmailVisible ] = useState( false );
	const [ addFaxVisible, setAddFaxVisible ] = useState( false );
	const [ addPhoneVisible, setAddPhoneVisible ] = useState( false );
	const [ viewNameVisible, setViewNameVisible ] = useState( true );

	// Form Validation
	const [ addressItemOne, setAddressItemOne ] = useState( tempAddressData?.address_line_one ? tempAddressData.address_line_one : '' );
	const [ addressItemTwo, setAddressItemTwo ] = useState( tempAddressData?.city ? tempAddressData.city : '' );

	const [ emailItem, setEmailItem ] = useState( tempEmailData?.email ? tempEmailData.email : '' );
	const [ faxItem, setFaxItem ] = useState( tempFaxData?.fax_number ? tempFaxData.fax_number : '' );
	const [ phoneItem, setPhoneItem ] = useState( tempPhoneData?.phone_number ? tempPhoneData.phone_number : '' );

	const [ showValidationError, setShowValidationError ] = useState( false );
	const [ errors, setErrors ] = useState({ });

	useEffect(() =>
	{
		validateForm( );
	}, [ addressItemOne, addressItemTwo, emailItem, faxItem, phoneItem ]);

	const validateForm = ( ) =>
	{
		setIsAddressValid( false );
		setIsEmailValid( false );
		setIsFaxValid( false );
		setIsPhoneValid( false );

		let errors = { };

		if ( addressItemOne == '' && addressItemTwo == '')    errors.address = 'Please enter either a city name or full address.';
		else    setIsAddressValid( true );

		if ( emailItem == '' )    errors.email = 'Please enter an email address.';
		else    setIsEmailValid( true );

		if ( faxItem == '' )    errors.fax = 'Please enter a fax number.';
		else    setIsFaxValid( true );

		if ( phoneItem == '' )    errors.phone = 'Please enter a phone number.';
		else    setIsPhoneValid( true );

		setErrors( errors );
	}


	function closeAll( )
	{
		setAddAddressVisible( false );
		setAddContactDetailsVisible( false );
		setAddEmailVisible( false );
		setAddFaxVisible( false );
		setAddPhoneVisible( false );
		setViewNameVisible( true );
	}


	function handlePress( close )
	{
	
		// If no changes have been made, close the edit Modal
		if  (
				( JSON.stringify( contactData.address ) === JSON.stringify( tempAddressData )) &&
				( JSON.stringify( contactData.email ) === JSON.stringify( tempEmailData )) &&
				( JSON.stringify( contactData.fax ) === JSON.stringify( tempFaxData )) &&
				( JSON.stringify( contactData.phone ) === JSON.stringify( tempPhoneData )) &&
				( JSON.stringify( contactData.phone ) === JSON.stringify( tempPhoneData ))
			)
		{
			handleNavigation( );
			return;
		}
	
	
		// Only triggers save( insert/update ) if min of medication name has been entered (or already exists )

		if ( JSON.stringify( contactData.address ) !== JSON.stringify( tempAddressData ) && tempAddressData != { } && isAddressValid )
		{
			saveToDB( 'Address', tempAddressData );
		}

		if ( JSON.stringify( contactData.email ) !== JSON.stringify( tempEmailData ) && tempEmailData != { } && isEmailValid )
		{
			saveToDB( 'Email', tempEmailData );
		}

		if ( JSON.stringify( contactData.fax ) !== JSON.stringify( tempFaxData ) && tempFaxData != { } && isFaxValid )
		{
			saveToDB( 'Fax', tempFaxData );
		}

		if ( JSON.stringify( contactData.phone ) !== JSON.stringify( tempPhoneData ) && tempPhoneData != { } && isPhoneValid )
		{
			saveToDB( 'Phone', tempPhoneData );
		}
	
		if (close == true)    setEditContactVisible( false );
	}


	return (
		<View style={ styles.edit_container }>
				<ScrollView keyboardShouldPersistTaps='handled' style={ styles.data_container }>
				{
					viewNameVisible ?
					<View>
					{
						params?.contact_name || params?.facility ?
						<Text style={ styles.title_bar }>
							{ params?.contact_name ?? params?.facility }
						</Text>
					: null
					}

						<View style={ styles.section }>
							<View>
							{
								!addContactDetailsVisible ?
								<TouchableOpacity
									accessibilityLabel='Add or Edit button'
									accessibilityHint='Press to add or edit address.'
									style={ styles.contact_button }
									onPress={ ( ) =>
									{
										setAddAddressVisible( true );
										setViewNameVisible( false );
									}}
								>
								{
									( tempAddressData?.address_line_one || tempAddressData?.city ) ?
									<Text style={ styles.text_button }>Edit address</Text>
								:
									<Text style={ styles.text_button }>Add address</Text>
								}
								</TouchableOpacity>
								: null
							}
							</View>

							<View>
							{
								!addAddressVisible ?
								<TouchableOpacity
									accessibilityLabel='Add or Edit button'
									accessibilityHint='Press to add or edit contact details.'
									style={ styles.contact_button }
									onPress={ ( ) =>
									{
										setAddContactDetailsVisible( true );
										setViewNameVisible( false );
									}}
								>
								{
									tempPhoneData?.phone_number ?
									<Text style={ styles.text_button }>Edit contact details</Text>
								:
									<Text style={ styles.text_button }>Add contact details</Text>
								}
								</TouchableOpacity>
							: null
							}
							</View>
						</View>
					</View>
				: null
				}


				{
					addAddressVisible ?
					<View>
						<TextInput
							accessibilityLabel='Street address'
							accessabilityHint='Type in first line of street address.'
							autoComplete='address-line1'
							placeholder={ tempAddressData?.address_line_one ? tempAddressData.address_line_one : 'Street address' }
							style={ styles.text_input }
							textContentType='streetAddressLine1'
							onChangeText={ ( text ) =>
							{
								setAddressItemOne( text );
								setTempAddressData( prev => ({ ...prev, 'address_line_one': text }));
							}}
						/>

						<TextInput
							accessibilityLabel='Address line two'
							accessabilityHint='Type in address line two.'
							autoComplete='address-line2'
							onChangeText={ ( text ) => setTempAddressData( prev => ({ ...prev, 'address_line_two': text }))}
							placeholder={ tempAddressData?.address_line_two ? tempAddressData.address_line_two : 'Address line two' }
							style={ styles.text_input }
							textContentType='streetAddressLine2'
						/>

						<TextInput
							accessibilityLabel='City'
							accessabilityHint='Type in city name.'
							placeholder={ tempAddressData?.city ? tempAddressData.city : 'City' }
							style={ styles.text_input }
							textContentType='city'
							onChangeText={ ( text ) =>
							{
								setAddressItemOne( text );
								setTempAddressData( prev => ({ ...prev, 'city': text }));
							}}
						/>

						<TextInput
							accessibilityLabel='State'
							accessabilityHint='Type in state name or abbreviation.'
							onChangeText={ ( text ) => setTempAddressData( prev => ({ ...prev, 'state': text }))}
							placeholder={ tempAddressData?.state ? tempAddressData.state : 'State' }
							style={ styles.text_input }
							textContentType='state'
						/>

						<TextInput
							accessibilityLabel='Post code'
							accessabilityHint='Type in post code.'
							autoComplete='postal-code'
							keyboardType='numeric'
							onChangeText={ ( text ) => setTempAddressData( prev => ({ ...prev, 'post_code': text }))}
							placeholder={ tempAddressData?.post_code ? tempAddressData.post_code : 'Post code' }
							style={ styles.text_input }
							textContentType='postalCode'
						/>

						<TextInput
							accessibilityLabel='Country'
							accessabilityHint='Type in country name or abbreviation'
							autoComplete='country'
							onChangeText={ ( text ) => setTempAddressData( prev => ({ ...prev, 'country': text }))}
							placeholder={ tempAddressData?.country ? tempAddressData.country : 'Country' }
							style={ styles.text_input }
							textContentType='countryName'
						/>

						<TextInput
							accessibilityLabel='Note'
							accessabilityHint='Type in address note.'
							onChangeText={ ( text ) => setTempAddressData( prev => ({ ...prev, 'address_note': text }))}
							placeholder={ tempAddressData?.address_note ? tempAddressData.address_note : 'Note' }
							style={ styles.text_input }
						/>


						{/* Cancel / Save Address */}
						<View style={ styles.save_row }>
							<TouchableOpacity
								accessibilityLabel='Cancel button'
								accessibilityHint='Press to cancel adding or editing address.'
								onPress={ ( ) =>
								{
									setAddAddressVisible( false );
									setViewNameVisible( true );
									setShowValidationError( false );
									setTempAddressData( contactData.address ?? [ ] );
									setAddressItemOne( '' );
								}}
							>
								<Text style={ styles.text_button }>Cancel</Text>
							</TouchableOpacity>

							<TouchableOpacity
								accessibilityLabel='Save button'
								accessibilityHint='Press to save address.'
							
								onPress={ ( ) =>
								{
									if ( isAddressValid )
									{
										handlePress( false );
										setAddAddressVisible( false );
										setViewNameVisible( true );
									}
									else    setShowValidationError( true );
								}}
							>
								<Text style={ styles.text_button }>Save address</Text>
							</TouchableOpacity>
						</View>

						{/* Form Validation Error */}
						{
							showValidationError ?
							<View style={ styles.alert_row }>
								<Text style={[ styles.alert, styles.text ]}>{ errors.address }</Text>
							</View>
						: null
						}
					</View>
				: null
				}


				{/* Contact */}
				{
					addContactDetailsVisible ?
					<View>
					{/* Phone Form */}
					{
						addPhoneVisible ?
						<View>
							<TextInput
								accessibilityLabel='Office phone number'
								accessibilityHint='Type in office phone number.'
								keyboardType='numeric'
								placeholder={ tempPhoneData?.phone_number ? tempPhoneData.phone_number : 'Office phone number' }
								style={ styles.text_input }
								textContentType='telephoneNumber'
								onChangeText={ ( text ) =>
								{
									setPhoneItem( text );
									setTempPhoneData( prev => ({ ...prev, 'phone_number': text }));
									setTempPhoneData( prev => ({ ...prev, 'phone_number_type': 'Office' }));
								}}
							/>

							<TextInput
								accessibilityLabel='Text input'
								accessibilityHint='Type in phone note.'
								onChangeText={ ( text ) => setTempPhoneData( prev => ({ ...prev, 'phone_number_note': text }))}
								placeholder={ tempPhoneData?.phone_number_note ? tempPhoneData.phone_number_note : 'Phone number note' }
								style={ styles.text_input }
							/>

							{/* Cancel / Save Phone */}
							<View style={ styles.save_row }>
								<TouchableOpacity
									accessibilityLabel='Cancel button'
									accessibilityHint='Press to cancel adding or editing phone number.'
									onPress={ ( ) =>
									{
										setAddPhoneVisible( false );
										setShowValidationError( false );
										setTempPhoneData( contactData.phone );
										setPhoneItem( '' );
									}}
								>
									<Text style={ styles.text_button }>Cancel</Text>
								</TouchableOpacity>

								<TouchableOpacity
									accessibilityLabel='Save button'
									accessibilityHint='Press to save phone number.'
									onPress={ ( ) =>
									{
										if ( isPhoneValid )
										{
											handlePress( false );
											setAddPhoneVisible( false );
										}
										else    setShowValidationError( true );
									}}
								>
									<Text style={ styles.text_button }>Save phone number</Text>
								</TouchableOpacity>

							</View>
							{/* Form Validation Error */}
							{
								showValidationError ?
								<View style={ styles.alert_row }>
									<Text style={[ styles.alert, styles.text ]}>{ errors.phone }</Text>
								</View>
							: null
							}
						</View>
						: null
					}


					{/* Fax Form */}
					{
						addFaxVisible ?
						<View>
							<TextInput
								accessibilityLabel='Text Input'
								accessibilityHint='Type in fax number.'
								keyboardType='numeric'
								placeholder={ tempFaxData?.fax_number ? tempFaxData.fax_number : 'Fax number' }
								textContentType='telephoneNumber'
								style={ styles.text_input }
								onChangeText={ ( text ) =>
								{
									setFaxItem( text );
									setTempFaxData( prev => ({ ...prev, 'fax_number': text }));
									setTempFaxData( prev => ({ ...prev, 'fax_number_type': 'Fax' }));
								}
								}
							/>
							<TextInput
								accessibilityLabel='Text input'
								accessibilityHint='Type in fax note.'
								onChangeText={ ( text ) => setTempFaxData( prev => ({ ...prev, 'fax_note': text }))}
								placeholder={ tempFaxData?.fax_note ? tempFaxData.fax_note : 'Fax note' }
								style={ styles.text_input }
							/>

							{/* Cancel / Save fax */}
							<View style={ styles.save_row }>
								<TouchableOpacity
									accessibilityLabel='Cancel button'
									accessibilityHint='Press to cancel adding or editing fax number.'
									onPress={ ( ) =>
									{
										setAddFaxVisible( false );
										setTempFaxData( contactData.fax );
										setShowValidationError( false );
										setFaxItem( '' );
									}}
								>
									<Text style={ styles.text_button }>Cancel</Text>
								</TouchableOpacity>

								<TouchableOpacity
									accessibilityLabel='Save fax info button'
									accessibilityHint='Press to save fax number.'
									onPress={ ( ) =>
									{
										if ( isFaxValid )
										{
											handlePress( false );
											setAddFaxVisible( false );
										}
										else    setShowValidationError( true );
									}}
								>
									<Text style={ styles.text_button }>Save fax number</Text>
								</TouchableOpacity>
							</View>

							{/* Form Validation Error */}
							{
								showValidationError ?
								<View style={ styles.alert_row }>
									<Text style={[ styles.alert, styles.text ]}>{ errors.fax }</Text>
								</View>
							: null
							}
						</View>
					: null
					}


					{/* Email Form */}
					{
						addEmailVisible ?
						<View>
							<TextInput
								accessibilityLabel='Text input'
								accessibilityHint='Type in email address.'
								autoCapitalize='none'
								autoComplete='email'
								keyboardType='email-address'
								placeholder={ tempEmailData?.email ? tempEmailData.email : 'E-mail' }
								style={ styles.text_input }
								textContentType='emailAddress'
								onChangeText={ (text) =>
								{
									setEmailItem( text );
									setTempEmailData( prev => ({ ...prev, 'email': text }))}
								}
							/>

							<TextInput
								accessibilityLabel='Text input'
								accessibilityHint='Type in email note.'
								onChangeText={ ( text ) => setTempEmailData( prev => ({ ...prev, 'email_note': text }))}
								placeholder={ tempEmailData?.email_note ? tempEmailData.email_note : 'E-mail note' }
								style={ styles.text_input }
							/>

							{/* Cancel / Save Email */}
							<View style={ styles.save_row }>
								<TouchableOpacity
									accessibilityLabel='Cancel button'
									accessibilityHint='Press to cancel adding or editing email address.'
									onPress={ ( ) =>
									{
										setAddEmailVisible( false );
										setEmailItem( '' );
										setShowValidationError( false );
										setTempEmailData( contactData.email );
									}}
								>
									<Text style={ styles.text_button }>Cancel</Text>
								</TouchableOpacity>

								<TouchableOpacity
									accessibilityLabel='Save button'
									accessibilityHint='Press to save email address.'
								
									onPress={ ( ) =>
									{
										if ( isEmailValid )
										{
											handlePress( false );
											setAddEmailVisible( false );
										}
										else    setShowValidationError( true );
									}}
								>
									<Text style={ styles.text_button }>Save email</Text>
								</TouchableOpacity>
							</View>

							{/* Form Validation Error */}
							{
								showValidationError ?
								<View style={ styles.alert_row }>
									<Text style={[ styles.alert, styles.text ]}>{ errors.email }</Text>
								</View>
							: null
							}
						</View>
					: null
					}


					{/* Text Buttons */}
					{
						( !addEmailVisible && !addFaxVisible && !addPhoneVisible ) ?
						<View>
							<TouchableOpacity
								accessibilityLabel='Add or Edit button'
								accessibilityHint='Press to add or edit phone information.'
								style={ styles.contact_button }
								onPress={ ( ) =>
								{
									setAddEmailVisible( false );
									setAddFaxVisible( false );
									setAddPhoneVisible( true )}
								}
							>
							{
								tempPhoneData?.phone_number ?
								<Text style={ styles.text_button }>Edit office phone number</Text>
							:
								<Text style={ styles.text_button }>Add office phone number</Text>
							}
							</TouchableOpacity>

							<TouchableOpacity
								accessibilityLabel='Add or Edit button'
								accessibilityHint='Press to add or edit fax information.'
								style={ styles.contact_button }
								onPress={ ( ) =>
								{
									setAddEmailVisible( false );
									setAddFaxVisible( true );
									setAddPhoneVisible( false )}
								
								}
							>
							{
								tempFaxData?.fax_number ?
								<Text style={ styles.text_button }>Edit fax number</Text>
							:
								<Text style={ styles.text_button }>Add fax number</Text>
							}
							</TouchableOpacity>

							<TouchableOpacity
								accessibilityLabel='Add or Edit button'
								accessibilityHint='Press to add or edit email address.'
								style={ styles.contact_button }
								onPress={ ( ) =>
								{
									setAddEmailVisible( true );
									setAddFaxVisible( false );
									setAddPhoneVisible( false );
								}}
							>
							{
								tempEmailData?.email ?
								<Text style={ styles.text_button }>Edit email address</Text>
							:
								<Text style={ styles.text_button }>Add email address</Text>
							}
							</TouchableOpacity>


							<View style={[ styles.expand_button, { paddingRight: 20 }]}>
								<TouchableOpacity
									accessibilityLabel='Close button'
									accessibilityHint='Press to close.'
									onPress={ ( ) =>
									{
										setShowValidationError( false );
										closeAll( );
										setErrors({ });
									}}>
									<Text style={ styles.text_button }>Close</Text>
								</TouchableOpacity>
							</View>
						</View>
					: null
					}
					</View>
				: null
				}


				{
					viewNameVisible?
					<View>
						<View style={[ styles.expand_button, { paddingRight: 20 }]}>
							<TouchableOpacity
								accessibilityLabel='Close button'
								accessibilityHint='Press to close.'
								onPress={ () => handlePress( true )}
							>
								<Text style={ styles.text_button }>Close</Text>
							</TouchableOpacity>
						</View>

						<View>
						{
							showValidationError ?
							<View
								accessibilityLabel='Form error.'
								style={{ alignItems: 'center', paddingLeft: 40, paddingRight: 40, paddingTop: 20}}
							>
								<Text style={[ styles.text, styles.alert, {textAlign: 'center'} ]}>{ errors.address }</Text>
							</View>
						: null
						}
						</View>
					</View>
					: null
				}
			</ScrollView>
	</View>
	);
}