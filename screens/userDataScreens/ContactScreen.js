
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Text, TouchableOpacity, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import insertEmergencyData from '../../common/userData/database/insertEmergencyData.js';
import updateEmergencyData from '../../common/userData/database/updateEmergencyData.js';
import useLoadEmergencyData from '../../common/userData/hook/useLoadEmergencyData';

import styles from '../../styles/styles.js';

import { EditContact, ViewContact } from './components/contact';


const ContactScreen = ({ navigation, route }) =>
{
	const db = useSQLiteContext();
	const params = route?.params;


	const [ contactData, setContactData, loadingContactData, loadContactData ] = useLoadEmergencyData( db, 'Contact', params.id );
	const [ FacilityData, setFacilityData, loadingFacilityData, loadFacilityData ] = useLoadEmergencyData( db, 'Facility_Name', params.id );

	const [ editContactVisible, setEditContactVisible ] = useState( false );
	const [ viewContactVisible, setViewContactVisible ] = useState( true );

	const [ isAddressValid, setIsAddressValid ] = useState( false );
	const [ isEmailValid, setIsEmailValid ] = useState( false );
	const [ isFaxValid, setIsFaxValid ] = useState( false );
	const [ isPhoneValid, setIsPhoneValid ] = useState( false );

	const [ tempAddressData, setTempAddressData ] = useState( );
	const [ tempEmailData, setTempEmailData ] = useState( );
	const [ tempFaxData, setTempFaxData ] = useState( );
	const [ tempPhoneData, setTempPhoneData ] = useState( );

	const isFocused = useIsFocused();


	useEffect(() =>
	{
		if ( isFocused )
		{
			loadContactData( );
			loadFacilityData( );
		}
	}, [ isFocused ]);


	function handleNavigation( )
	{
		if ( params.return )    navigation.goBack( );
	}


	async function saveToDB( table, data )
	{
		const id =
		{
			Address: 'address_id',
			Email: 'email_id',
			Entity: 'entity_id',
			Fax: 'fax_number_id',
			Phone: 'phone_number_id'
		}

		if ( data[id[table]] )
		{
			await updateEmergencyData( table, data, db );
		}
		else
		{
			await insertEmergencyData( table, data, db );
		}

		if ( table == 'Entity' ) loadFacilityData( );
		else loadContactData( );
	}


	if ( loadingContactData )    return <ActivityIndicator/>;

	return(
		<View style={ styles.container }>
			<TouchableOpacity
				style={ styles.game_button_end }
				onPress={ ( ) => setEditContactVisible( true )}
			>
				<Text style={ styles.save_button_text }>Edit</Text>
			</TouchableOpacity>


			<Modal animationType='slide' visible={ viewContactVisible }>
				<ViewContact
					contactData={ contactData }
					handleNavigation={ handleNavigation }
					params={ params }
					setEditContactVisible={ setEditContactVisible }
					setTempAddressData={ setTempAddressData }
					setTempEmailData={ setTempEmailData }
					setTempFaxData={ setTempFaxData }
					setTempPhoneData={ setTempPhoneData }
					setViewContactVisible={ setViewContactVisible }
				/>
			</Modal>


			<Modal animationType='slide' visible={ editContactVisible }>
					<EditContact
						contactData={ contactData }
						handleNavigation={ handleNavigation }
						isAddressValid={ isAddressValid }
						isEmailValid={ isEmailValid }
						isFaxValid={ isFaxValid }
						isPhoneValid={ isPhoneValid }
						params={ params }
						saveToDB={ saveToDB }
						setEditContactVisible={ setEditContactVisible }
						setIsAddressValid={ setIsAddressValid }
						setIsEmailValid={ setIsEmailValid }
						setIsFaxValid={ setIsFaxValid }
						setIsPhoneValid={ setIsPhoneValid }
						setTempAddressData={ setTempAddressData }
						setTempEmailData={ setTempEmailData }
						setTempFaxData={ setTempFaxData }
						setTempPhoneData={ setTempPhoneData }
						tempAddressData={ tempAddressData }
						tempEmailData={ tempEmailData }
						tempFaxData={ tempFaxData }
						tempPhoneData={ tempPhoneData }
					/>
			</Modal>
		</View>
	)
};
export default ContactScreen;