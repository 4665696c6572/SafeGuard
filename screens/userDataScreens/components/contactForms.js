import { View } from 'react-native';
import { TextInput } from 'react-native-paper';

import styles from "../../../styles/styles.js";


export const AddressForm = ({ setAddressItem, setTempAddressData, tempAddressData }) =>
{
	return(
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
					setAddressItem( text );
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
					setAddressItem( text );
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
		</View>
	)
}


export const EmailForm = ({ setEmailItem, setTempEmailData, tempEmailData }) =>
{
	return(
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
				onChangeText={ ( text ) =>
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
		</View>
	)
}

export const FaxForm = ({ setFaxItem, setTempFaxData, tempFaxData }) =>
{
	return(
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
				}}
			/>

			<TextInput
				accessibilityLabel='Text input'
				accessibilityHint='Type in fax note.'
				onChangeText={ ( text ) => setTempFaxData( prev => ({ ...prev, 'fax_note': text }))}
				placeholder={ tempFaxData?.fax_note ? tempFaxData.fax_note : 'Fax note' }
				style={ styles.text_input }
			/>
		</View>
	)
}


export const PhoneForm = ({ setPhoneItem, setTempPhoneData, tempPhoneData }) =>
{
	return(
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
		</View>
	)
}