import * as NavigationBar from 'expo-navigation-bar';
import { useEffect, useState } from 'react';
import { Keyboard, Text, TouchableOpacity, View } from 'react-native';

import { AddressForm, EmailForm, FaxForm, PhoneForm } from './contactForms.js';
import { DeleteDialog } from './deleteDialog.js';

import styles from "../../../styles/styles.js";


export const ViewContact = ({
								contactData, handleNavigation, params, setEditContactVisible,
								setTempAddressData, setTempEmailData, setTempFaxData,
								setTempPhoneData, setViewContactVisible
							}) =>
{
	return (
		<View style={[ styles.data_container_view, { marginTop: 38 } ]}>
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
			<View style={ styles.data_section }>
				<Text style={ styles.heading_text }>Address</Text>
				{
					contactData?.address?.address_line_one ?
					<Text style={ styles.text }>{ contactData?.address?.address_line_one }</Text>
				: null
				}

				{
					contactData?.address?.address_line_two ?
					<Text style={ styles.text }> { contactData?.address?.address_line_two }</Text>
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
			<View style={ styles.data_section }>
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
			<View style={ styles.data_section }>
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
			<View style={ styles.data_section }>
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


		{
			(
				!contactData?.address.address_id && !contactData?.email.email_id &&
				!contactData?.fax.fax_number_id && !contactData?.phone.phone_number_id
			) ?
			<View style={{ alignItems: 'center' }}>
				<Text style={[ styles.heading_text, styles.data_button_size ]}>No contact details found.</Text>
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
						// navigation bar hidden in modals.
						NavigationBar.setVisibilityAsync( "visible" );
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
							contactData?.fax.fax_number_id || contactData?.phone.phone_number_id
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



// For adding or editing
export const EditContact = ({
								contactData, deleteEntry, handleNavigation, params,
								saveEntry, setEditContactVisible, setTempAddressData,
								setTempEmailData, setTempFaxData, setTempPhoneData,
								tempAddressData, tempEmailData, tempFaxData, tempPhoneData
							}) =>
{
	// Delete dialog visibility controls
	const [ deleteAddressVisible, setDeleteAddressVisible ] = useState( false );
	const [ deleteContactVisible, setDeleteContactVisible ] = useState( false );
	const [ deleteEmailVisible, setDeleteEmailVisible ] = useState( false );
	const [ deleteFaxVisible, setDeleteFaxVisible ] = useState( false );
	const [ deletePhoneVisible, setDeletePhoneVisible ] = useState( false );

	// Modal visibility controls
	const [ addAddressVisible, setAddAddressVisible ] = useState( false );
	const [ addContactDetailsVisible, setAddContactDetailsVisible ] = useState( false );
	const [ addEmailVisible, setAddEmailVisible ] = useState( false );
	const [ addFaxVisible, setAddFaxVisible ] = useState( false );
	const [ addPhoneVisible, setAddPhoneVisible ] = useState( false );
	const [ viewNameVisible, setViewNameVisible ] = useState( true );


	// To hide delete button when keyboard opens so it doesn't overlap form
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
	}, [ ]);


	// Form Validation - Address must ( minimally ) have a street address or city.
	const [ addressItem, setAddressItem ] =
		useState( tempAddressData?.address_line_one ?? tempAddressData?.city ?? '' );
	const [ isAddressValid, setIsAddressValid ] = useState( false );

	// Form Validation - Email must ( minimally ) have an email address.
	const [ emailItem, setEmailItem ] = useState( tempEmailData?.email ?? '' );
	const [ isEmailValid, setIsEmailValid ] = useState( false );

	// Form Validation - Fax must ( minimally ) have a number.
	const [ faxItem, setFaxItem ] = useState( tempFaxData?.fax_number ?? '' );
	const [ isFaxValid, setIsFaxValid ] = useState( false );

	// Form Validation - Phone must ( minimally ) have a number.
	const [ phoneItem, setPhoneItem ] = useState( tempPhoneData?.phone_number ?? '' );
	const [ isPhoneValid, setIsPhoneValid ] = useState( false );

	const [ showValidationError, setShowValidationError ] = useState( false );
	const [ errors, setErrors ] = useState({ });


	useEffect(( ) =>
	{
		validateForm( );
	}, [ addressItem, emailItem, faxItem, phoneItem ]);


	const validateForm = ( ) =>
	{
		// sets all to false to prevent other categories from triggering error.
		setIsAddressValid( false );
		setIsEmailValid( false );
		setIsFaxValid( false );
		setIsPhoneValid( false );

		let errors = { };

		if ( addressItem.trim( ) == '' )    errors.address = 'City name or full address is required.';
		else    setIsAddressValid( true );

		if ( emailItem.trim( ) == '' )    errors.email = 'Email address is required.';
		else    setIsEmailValid( true );

		if ( faxItem.trim( ) == '' )    errors.fax = 'Fax number is required.';
		else    setIsFaxValid( true );

		if ( phoneItem.trim( ) == '' )    errors.phone = 'Phone number is required.';
		else    setIsPhoneValid( true );

		setErrors( errors );
	}


	// Closes all modals.
	function closeAll( )
	{
		setAddAddressVisible( false );
		setAddContactDetailsVisible( false );
		setAddEmailVisible( false );
		setAddFaxVisible( false );
		setAddPhoneVisible( false );
		setViewNameVisible( true );
	}


	const handleCancel = ( table ) =>
	{
		if ( table == 'Address' )    setDeleteAddressVisible( false );
		if ( table == 'Contact' )    setDeleteContactVisible( false );
		if ( table == 'Email' )    setDeleteEmailVisible( false );
		if ( table == 'Fax' )    setDeleteFaxVisible( false );
		if ( table == 'Phone' )    setDeletePhoneVisible( false );
	};


	const handleDelete = ( table ) =>
	{
		if ( table == 'Contact' )
		{
			deleteEntry( table,
			[
				tempAddressData.address_id, tempEmailData.email_id,
				tempFaxData.fax_number_id, tempPhoneData.phone_number_id
			]);
			handlePress( true );
			setDeleteContactVisible( false );
		}

		if ( table == 'Address' )
		{
			deleteEntry( table, tempAddressData.address_id );
			setAddressItem( '' );
			setAddAddressVisible( false );
			setDeleteAddressVisible( false );
			setTempAddressData( { entity_id: tempAddressData?.entity_id } );
			setViewNameVisible( true );
		}

		if ( table == 'Email' )
		{
			deleteEntry( table, tempEmailData.email_id );
			setAddEmailVisible( false );
			setDeleteEmailVisible( false );
			setEmailItem( '' );
			setTempEmailData( { entity_id: tempEmailData?.entity_id } );
		}

		if ( table == 'Fax' )
		{
			deleteEntry( table, tempFaxData.fax_number_id );
			setAddFaxVisible( false );
			setDeleteFaxVisible( false );
			setFaxItem( '' );
			setTempFaxData({ entity_id: tempFaxData?.entity_id } );
		}

		if ( table == 'Phone' )
		{
			deleteEntry( table, tempPhoneData.phone_number_id );
			setAddPhoneVisible( false );
			setDeletePhoneVisible( false );
			setPhoneItem( '' );
			setTempPhoneData( { entity_id: tempPhoneData?.entity_id } );
		}
	};


	function handlePress( close )
	{

		// navigation bar hidden in modals.
		NavigationBar.setVisibilityAsync( "visible" );


		// If no changes have been made or user presses close button,
		// close the edit Modal and clear any unsaved data.
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


		// Only triggers save ( insert/update ) and reset if min
		// has been entered ( or already exists ).
		if
		(
			JSON.stringify( contactData.address ) !==
			JSON.stringify( tempAddressData ) && tempAddressData != { }
			&& isAddressValid
		)
		{
			saveEntry( 'Address', tempAddressData, 'address_id' );
		}

		if
		( 
			JSON.stringify( contactData.email ) !==
			JSON.stringify( tempEmailData ) &&
			tempEmailData != { } && isEmailValid
		)
		{
			saveEntry( 'Email', tempEmailData, 'email_id' );
		}

		if
		(
			JSON.stringify( contactData.fax ) !==
			JSON.stringify( tempFaxData ) && tempFaxData != { }
			&& isFaxValid
		)
		{
			saveEntry( 'Fax', tempFaxData, 'fax_number_id' );
		}

		if
		(
			JSON.stringify( contactData.phone ) !==
			JSON.stringify( tempPhoneData ) &&
			tempPhoneData != { } && isPhoneValid
		)
		{
			saveEntry( 'Phone', tempPhoneData, 'phone_number_id' );
		}

		// close with save
		if ( close == true )
		{
			setEditContactVisible( false );
		}
	}


	return (
		<View style={[ styles.data_container_edit, { marginTop: 38 } ]}>
		{/* Outer Screen */}
		{
			viewNameVisible ?
			<View style={{ flex: 1 }}>
				<View style={{ flex: 3 }}>
				{
					params?.contact_name || params?.facility ?
					<Text style={ styles.title_bar }>
						{ params?.contact_name ?? params?.facility }
					</Text>
				: null
				}

					<View style={ styles.data_section }>
						<View>
						{
							!addContactDetailsVisible ?
							<TouchableOpacity
								accessibilityLabel='Add or Edit button'
								accessibilityHint='Press to add or edit address.'
								onPress={ ( ) =>
								{
									setAddAddressVisible( true );
									setViewNameVisible( false );
								}}
								style={ styles.contact_button }
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

						{/* Inner Screen */}
						<View>
						{
							!addAddressVisible ?
							<TouchableOpacity
								accessibilityLabel='Add or Edit button'
								accessibilityHint='Press to add or edit contact details.'
								onPress={ ( ) =>
								{
									setAddContactDetailsVisible( true );
									setViewNameVisible( false );
								}}
								style={ styles.contact_button }
							>
							{
								tempEmailData?.email || tempFaxData?.fax_number
								|| tempPhoneData?.phone_number ?
								<Text style={ styles.text_button }>Edit contact details</Text>
							:
								<Text style={ styles.text_button }>Add contact details</Text>
							}
							</TouchableOpacity>
						: null
						}
						</View>
					</View>

					<View style={{ alignItems: 'flex-end' }}>
						<TouchableOpacity
							accessibilityLabel='Close button'
							accessibilityHint='Press to close.'
							onPress={ ( ) => handlePress( true )}
							style={ styles.contact_button }
						>
							<Text style={ styles.text_button }>Close</Text>
						</TouchableOpacity>
					</View>
				</View>


				{/* Delete */}
				{
					!keyboardVisible ?
					<DeleteDialog
						buttonVisibleCondition=
						{
							viewNameVisible &&
							(
								tempAddressData?.address_id || tempEmailData?.email_id ||
								tempFaxData?.fax_number_id || tempPhoneData?.phone_number_id
							)
						}
						description={ 'contact' }
						dialogVisible={ deleteContactVisible }
						handleCancel={ handleCancel }
						handleDelete={ handleDelete }
						setDialogVisible={ setDeleteContactVisible }
						table={ 'Contact' }
						title={ params?.contact_name ?? params?.facility }
					/>
				: null
				}
			</View>
		: null
		}


		{/* Address Form */}
		{
			addAddressVisible ?
			<View style={{ flex: 1 }}>
			{/* Form Validation Error */}
			{
				showValidationError ?
				<View style={[ styles.validation_container, { paddingLeft: 0 } ]}>
					<Text style={[  styles.alert, { fontSize: 17 } ]}>{ errors.address }</Text>
				</View>
			: null
			}
				<View style={{ flex: 3 }}>
					<AddressForm
						setAddressItem={ setAddressItem }
						setTempAddressData={ setTempAddressData }
						tempAddressData={ tempAddressData }
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
								setAddressItem( '' );
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
								else
								{
									setShowValidationError( true );
									setTimeout( function( )
									{
										setShowValidationError( false );
									}, 2000 );
								}
							}}
						>
							<Text style={ styles.text_button }>Save address</Text>
						</TouchableOpacity>
					</View>
				</View>


				{/* Delete */}
				{
					!keyboardVisible ?
					<DeleteDialog
						buttonVisibleCondition={ addAddressVisible && tempAddressData.address_id }
						description={ 'Address' }
						dialogVisible={ deleteAddressVisible }
						handleCancel={ handleCancel }
						handleDelete={ handleDelete }
						setDialogVisible={ setDeleteAddressVisible }
						table={ 'Address' }
						title={ "Address" }
					/>
					:null
				}
			</View>
		: null
		}


		{/* Second inner screen ( email, fax, phone ) */}
		{/* Contact */}
		{
			addContactDetailsVisible ?
			<View>
			{/* Text Buttons */}
			{
				( !addEmailVisible && !addFaxVisible && !addPhoneVisible ) ?
				<View>
					<TouchableOpacity
						accessibilityLabel='Add or Edit button'
						accessibilityHint='Press to add or edit phone information.'
						onPress={ ( ) =>
						{
							setAddEmailVisible( false );
							setAddFaxVisible( false );
							setAddPhoneVisible( true )}
						}
						style={ styles.contact_button }
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
						onPress={ ( ) =>
						{
							setAddEmailVisible( false );
							setAddFaxVisible( true );
							setAddPhoneVisible( false )}
						}
						style={ styles.contact_button }
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
						onPress={ ( ) =>
						{
							setAddEmailVisible( true );
							setAddFaxVisible( false );
							setAddPhoneVisible( false );
						}}
						style={ styles.contact_button }
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
							}}
						>
							<Text style={ styles.text_button }>Close</Text>
						</TouchableOpacity>
					</View>
				</View>
			: null
			}
			</View>
		: null
		}


		{/* Email Form */}
		{
			addEmailVisible ?
			<View style={{ flex: 1 }}>
			{/* Form Validation Error */}
			{
				showValidationError ?
				<View style={ styles.validation_container }>
					<Text style={[ styles.text_input, styles.alert ]}>{ errors.email }</Text>
				</View>
			: null
			}
				<View style={{ flex: 3 }}>
					<EmailForm
						setEmailItem={ setEmailItem }
						setTempEmailData={ setTempEmailData }
						tempEmailData={ tempEmailData }
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
								else
								{
									setShowValidationError( true );
									setTimeout( function( )
									{
										setShowValidationError( false );
									}, 900 );
								}
							}}
						>
							<Text style={ styles.text_button }>Save email</Text>
						</TouchableOpacity>
					</View>
				</View>


				{/* Delete */}
				{
					!keyboardVisible ?
					<DeleteDialog
						buttonVisibleCondition={ addEmailVisible && tempEmailData?.email_id }
						description={ 'email address' }
						dialogVisible={ deleteEmailVisible }
						handleCancel={ handleCancel }
						handleDelete={ handleDelete }
						setDialogVisible={ setDeleteEmailVisible }
						table={ 'Email' }
						title={ 'Email' }
					/>
				: null
				}
			</View>
		: null
		}


		{/* Fax Form */}
		{
			addFaxVisible ?
			<View style={{ flex: 1 }}>
			{/* Form Validation Error */}
			{
				showValidationError ?
				<View style={ styles.validation_container }>
					<Text style={[ styles.text_input, styles.alert ]}>{ errors.fax }</Text>
				</View>
			: null
			}
				<View style={{ flex: 3 }}>
					<FaxForm
						setFaxItem={ setFaxItem }
						setTempFaxData={ setTempFaxData }
						tempFaxData={ tempFaxData }
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
								else
								{
									setShowValidationError( true );
									setTimeout( function( )
									{
										setShowValidationError( false );
									}, 900 );
								}
							}}
						>
							<Text style={ styles.text_button }>Save fax number</Text>
						</TouchableOpacity>
					</View>
				</View>


				{/* Delete */}
				{
					!keyboardVisible ?
					<DeleteDialog
						buttonVisibleCondition={ addFaxVisible && tempFaxData?.fax_number_id }
						description={ 'fax number' }
						dialogVisible={ deleteFaxVisible }
						handleCancel={ handleCancel }
						handleDelete={ handleDelete }
						setDialogVisible={ setDeleteFaxVisible }
						table={ 'Fax' }
						title={ 'Fax' }
					/>
					: null
				}
			</View>
		: null
		}


		{/* Phone Form */}
		{
			addPhoneVisible ?
			<View style={{ flex: 1 }}>
			{/* Form Validation Error */}
			{
				showValidationError ?
				<View style={ styles.validation_container }>
					<Text style={[ styles.text_input, styles.alert ]}>{ errors.phone }</Text>
				</View>
			: null
			}
				<View style={{ flex: 3 }}>
					<PhoneForm
						setPhoneItem={ setPhoneItem }
						setTempPhoneData={ setTempPhoneData }
						tempPhoneData={ tempPhoneData }
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
								else
								{
									setShowValidationError( true );
									setTimeout( function( )
									{
										setShowValidationError( false );
									}, 900 );
								}
							}}
						>
							<Text style={ styles.text_button }>Save phone number</Text>
						</TouchableOpacity>
					</View>
				</View>


				{/* Delete */}
				{
					!keyboardVisible ?
					<DeleteDialog
						buttonVisibleCondition={ addPhoneVisible && tempPhoneData?.phone_number_id }
						description={ 'phone number' }
						dialogVisible={ deletePhoneVisible }
						handleCancel={ handleCancel }
						handleDelete={ handleDelete }
						setDialogVisible={ setDeletePhoneVisible }
						table={ 'Phone' }
						title={ 'Phone' }
					/>
					: null
				}
			</View>
		: null
		}
	</View>
	);
}