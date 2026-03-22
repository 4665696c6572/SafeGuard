import { KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { TextInput } from 'react-native-paper';

import styles from "../../../styles/styles.js";


export const AddressForm = ({ setAddressItem, setTempAddressData, tempAddressData }) =>
{
	return(
		<KeyboardAvoidingView>
			<ScrollView  keyboardDismissMode='on-drag'>
				<TextInput
					accessibilityLabel='Street address'
					accessabilityHint='Type in first line of street address.'
					activeUnderlineColor='#0b3e82ff'
					autoComplete='address-line1'
					maxLength={ 100 }
					placeholder={ 'Street address' }
					style={ styles.text_input }
					textContentType='streetAddressLine1'
					value={ tempAddressData?.address_line_one ?? '' }
					onChangeText={ ( text ) =>
					{
						setAddressItem( text );
						setTempAddressData( prev =>
						({
							...prev, 'address_line_one': text }
						));
					}}
				/>

				<TextInput
					accessibilityLabel='Address line two'
					accessabilityHint='Type in address line two.'
					activeUnderlineColor='#0b3e82ff'
					autoComplete='address-line2'
					maxLength={ 100 }
					placeholder={ 'Address line two' }
					style={ styles.text_input }
					value={ tempAddressData?.address_line_two ?? '' }
					textContentType='streetAddressLine2'
					onChangeText={ ( text ) =>
						setTempAddressData( prev =>
						({
							...prev, 'address_line_two': text
						}))
					}
				/>

				<TextInput
					accessibilityLabel='City'
					accessabilityHint='Type in city name.'
					activeUnderlineColor='#0b3e82ff'
					maxLength={ 100 }
					placeholder={ 'City' }
					style={ styles.text_input }
					textContentType='city'
					value={ tempAddressData?.city ?? '' }
					onChangeText={ ( text ) =>
					{
						setAddressItem( text );
						setTempAddressData( prev => ({ ...prev, 'city': text }));
					}}
				/>

				<TextInput
					accessibilityLabel='State'
					accessabilityHint='Type in state name or abbreviation.'
					maxLength={ 100 }
					activeUnderlineColor='#0b3e82ff'
					placeholder={ 'State' }
					style={ styles.text_input }
					value={ tempAddressData?.state ?? '' }
					textContentType='state'
					onChangeText={ ( text ) =>
						setTempAddressData( prev =>
						({
							...prev, 'state': text
						}))
					}
				/>

				<TextInput
					accessibilityLabel='Post code'
					accessabilityHint='Type in post code.'
					activeUnderlineColor='#0b3e82ff'
					autoComplete='postal-code'
					keyboardType='numeric'
					maxLength={ 100 }
					placeholder={ 'Post code' }
					style={ styles.text_input }
					value={ tempAddressData?.post_code ?? '' }
					textContentType='postalCode'
					onChangeText={ ( text ) =>
						setTempAddressData( prev =>
						({
							...prev, 'post_code': text
						}))
					}
				/>

				<TextInput
					accessibilityLabel='Country'
					accessabilityHint='Type in country name or abbreviation'
					activeUnderlineColor='#0b3e82ff'
					autoComplete='country'
					maxLength={ 100 }
					placeholder={ 'Country' }
					style={ styles.text_input }
					value={ tempAddressData?.country ?? '' }
					textContentType='countryName'
					onChangeText=
					{
						( text ) => setTempAddressData( prev =>
						({
							...prev, 'country': text
						}))
					}
				/>

				<TextInput
					accessibilityLabel='Note'
					accessabilityHint='Type in address note.'
					activeUnderlineColor='#0b3e82ff'
					maxLength={ 100 }
					multiline={ true }
					placeholder={ 'Note' }
					style={ styles.text_input }
					value={ tempAddressData?.address_note ?? '' }
					onChangeText=
					{
						( text ) => setTempAddressData( prev =>
						({
							...prev, 'address_note': text
						}))
					}
				/>
			</ScrollView>
		</KeyboardAvoidingView>
	)
}


export const EmailForm = ({ setEmailItem, setTempEmailData, tempEmailData }) =>
{
	return(
		<View>
			<TextInput
				accessibilityLabel='Text input'
				accessibilityHint='Type in email address.'
				activeUnderlineColor='#0b3e82ff'
				autoCapitalize='none'
				autoComplete='email'
				keyboardType='email-address'
				placeholder={ 'E-mail' }
				style={ styles.text_input }
				textContentType='emailAddress'
				value={ tempEmailData?.email ?? '' }
				onChangeText={ ( text ) =>
				{
					setEmailItem( text );
					setTempEmailData( prev => ({ ...prev, 'email': text }))}
				}
			/>

			<TextInput
				accessibilityLabel='Text input'
				accessibilityHint='Type in email note.'
				activeUnderlineColor='#0b3e82ff'
				placeholder={ 'E-mail note' }
				style={ styles.text_input }
				value={ tempEmailData?.email_note ?? '' }
				onChangeText={ ( text ) =>
					setTempEmailData( prev => ({ ...prev, 'email_note': text }))
				}
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
				activeUnderlineColor='#0b3e82ff'
				keyboardType='numeric'
				placeholder={ 'Fax number' }
				textContentType='telephoneNumber'
				style={ styles.text_input }
				value={ tempFaxData?.fax_number ?? '' }
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
				activeUnderlineColor='#0b3e82ff'
				placeholder={ 'Fax note' }
				style={ styles.text_input }
				value={ tempFaxData?.fax_note ?? '' }
				onChangeText={ ( text ) =>
					setTempFaxData( prev => ({ ...prev, 'fax_note': text }))
				}
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
				activeUnderlineColor='#0b3e82ff'
				keyboardType='numeric'
				placeholder={ 'Office phone number' }
				style={ styles.text_input }
				textContentType='telephoneNumber'
				value={ tempPhoneData?.phone_number ?? '' }
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
				activeUnderlineColor='#0b3e82ff'
				placeholder={ 'Phone number note' }
				style={ styles.text_input }
				value={ tempPhoneData?.phone_number_note ?? '' }
				onChangeText={ ( text ) =>
					setTempPhoneData( prev => ({ ...prev, 'phone_number_note': text }))
				}
			/>
		</View>
	)
}