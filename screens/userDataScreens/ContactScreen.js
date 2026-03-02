
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Text, TouchableOpacity, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import deleteFromDB from '../../common/userData/deleteFromDB.js';
import saveToDB from '../../common/userData/saveToDB.js';
import useLoadEmergencyData from '../../common/userData/hook/useLoadEmergencyData';


import { EditContact, ViewContact } from './components/contact';


const ContactScreen = ({ navigation, route }) =>
{
	const db = useSQLiteContext( );
	const params = route?.params;

	const [ contactData, setContactData, loadingContactData, loadContactData ] = useLoadEmergencyData( db, 'Contact', params.id );

	const [ editContactVisible, setEditContactVisible ] = useState( false );
	const [ viewContactVisible, setViewContactVisible ] = useState( true );

	const [ tempAddressData, setTempAddressData ] = useState( );
	const [ tempEmailData, setTempEmailData ] = useState( );
	const [ tempFaxData, setTempFaxData ] = useState( );
	const [ tempPhoneData, setTempPhoneData ] = useState( );

	const isFocused = useIsFocused( );


	useEffect(( ) =>
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


	async function saveEntry( table, data, id )
	{
		await saveToDB( db, table, data, id, loadContactData );
	}


	async function deleteEntry( table, id )
	{
		deleteFromDB( db, table, id, loadContactData );
	}


	if ( loadingContactData )    return <ActivityIndicator/>;

	return(
		<View>
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
					deleteEntry={ deleteEntry }
					handleNavigation={ handleNavigation }
					params={ params }
					saveEntry={ saveEntry }
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