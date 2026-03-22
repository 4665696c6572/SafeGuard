
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import deleteFromDB from '../../common/userData/deleteFromDB.js';
import saveToDB from '../../common/userData/saveToDB.js';
import useLoadEmergencyData from '../../common/userData/hook/useLoadEmergencyData';

import { EditContact, ViewContact } from './components/contact';


// This is not a standalone screen.  It is used by Insurance & Doctor.
const ContactScreen = ({ navigation, route }) =>
{
	const db = useSQLiteContext( );
	const params = route?.params;

	const [ contactData, setContactData, loadingContactData, loadContactData ] = useLoadEmergencyData( db, 'Contact', params.id );

	// Temp data storage to allow for canceling mid add/edit.
	const [ tempAddressData, setTempAddressData ] = useState( );
	const [ tempEmailData, setTempEmailData ] = useState( );
	const [ tempFaxData, setTempFaxData ] = useState( );
	const [ tempPhoneData, setTempPhoneData ] = useState( );

	// Modal Controls.
	const [ editContactVisible, setEditContactVisible ] = useState( false );
	const [ viewContactVisible, setViewContactVisible ] = useState( true );

	const isFocused = useIsFocused( );


	// Load/Reload data on screen focus.
	useEffect(( ) =>
	{
		if ( isFocused )
		{
			loadContactData( );
		}
	}, [ isFocused ]);


	// Navigates back to either PersonScreen ( Insurance ) or Doctor.
	function handleNavigation( )
	{
		if ( params.return )    navigation.goBack( );
	}


	// Saves to db & reloads data for on screen data refresh.
	async function saveEntry( table, data, id )
	{
		await saveToDB( db, table, data, id, loadContactData );
	}


	// Deletes from db & reloads data for on screen data refresh.
	async function deleteEntry( table, id )
	{
		deleteFromDB( db, table, id, loadContactData );
	}


	return(
		<View>
		{
			loadingContactData ?
			<ActivityIndicator/>
		:
			<>
			<Modal
				animationType='slide'
				onRequestClose={ ( ) => setViewContactVisible( false ) }
				transparent={ true }
				visible={ viewContactVisible }
			>
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


			<Modal
				animationType='slide'
				transparent={ true }
				onRequestClose={ ( ) => setEditContactVisible( false ) }
				visible={ editContactVisible }
			>
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
			</>
		}
		</View>
	)
};
export default ContactScreen;