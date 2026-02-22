
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Text, TouchableOpacity, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import saveToDB from '../../common/userData/saveToDB.js';
import useLoadEmergencyData from '../../common/userData/hook/useLoadEmergencyData';

import styles from '../../styles/styles.js';

import { EditContact, ViewContact } from './components/contact';


const ContactScreen = ({ navigation, route }) =>
{
	const db = useSQLiteContext();
	const params = route?.params;

	const [ contactData, setContactData, loadingContactData, loadContactData ] = useLoadEmergencyData( db, 'Contact', params.id );

	const [ editContactVisible, setEditContactVisible ] = useState( false );
	const [ viewContactVisible, setViewContactVisible ] = useState( true );

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
		}
	}, [ isFocused ]);


	function handleNavigation( )
	{
		if ( params.return )    navigation.goBack( );
	}


	async function save( table, data, id )
	{
		await saveToDB( table, data, db, id, loadContactData );
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
					params={ params }
					save={ save }
					setEditContactVisible={ setEditContactVisible }
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