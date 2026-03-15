import * as NavigationBar from 'expo-navigation-bar';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import deleteFromDB from '../../common/userData/deleteFromDB.js';
import saveToDB from '../../common/userData/saveToDB.js';
import useLoadEmergencyData from '../../common/userData/hook/useLoadEmergencyData';

import styles from '../../styles/styles.js';

import { Doctor, EditDoctor, ViewDoctor } from './components/doctor';


// Doctor information screen with modals for viewing and editing.
const DoctorScreen = ({ navigation, route }) =>
{
	const db = useSQLiteContext( );
	const params = route?.params;

	const [ doctorData, setDoctorData, loadingDoctorData, loadDoctorData ] = useLoadEmergencyData( db, 'Doctor' );

	// Temp data selection & storage to allow for canceling mid add/edit.
	const [ doctorIndex, setDoctorIndex ] = useState( null );
	const [ tempDoctorData, setTempDoctorData ] = useState( );

	// Modal Controls.
	const [ editDoctorVisible, setEditDoctorVisible ] = useState( params?.visible ?? false );
	const [ viewDoctorVisible, setViewDoctorVisible ] = useState( false );

	const isFocused = useIsFocused( );


	// Load/Reload data on screen focus.
	useEffect(( ) =>
	{
		if ( isFocused )
		{
			loadDoctorData( );
		}
	}, [ isFocused ]);


	/*
	 *	Saves to db.
	 *	Additionally reloads data for on screen data refresh.
	 *	Navigates to Contact Screen if needed.
	 */
	async function saveEntry( table, data, id, shouldNavigate )
	{
		if ( shouldNavigate )
		{
			const new_id = await saveToDB( db, table, data, id, loadDoctorData, shouldNavigate );
			handleNavigation( new_id, data.entity_name, data?.facility_name );
		}
		else
		{
			await saveToDB( db, table, data, id, loadDoctorData );
		}
	}


	// Deletes from db & reloads data for on screen data refresh.
	async function deleteEntry( table, id )
	{
		deleteFromDB( db, table, id, loadDoctorData );
	}


	// Doctors can have contact details.
	function handleNavigation( id, name, facility )
	{
		navigation.navigate( 'ContactScreen', { id: id, contact_name: name, facility: facility, return: true });
	}


	// close and reset for modals
	function closeModal( setModalVisible )
	{
		// navigation bar hidden in modals.
		NavigationBar.setVisibilityAsync( "visible" );
		setDoctorIndex( null );
		setModalVisible( false );
		setTempDoctorData( );
	}


	return (
		<View style={ styles.bottom_tab_container }>
		{
			loadingDoctorData ?
			<ActivityIndicator/>
		:
			<>
			<Doctor
				doctorData={ doctorData }
				setEditDoctorVisible={ setEditDoctorVisible }
				setDoctorIndex={ setDoctorIndex }
				setViewDoctorVisible={ setViewDoctorVisible }
			/>

			<Modal
				animationType='slide'
				onRequestClose={ ( ) => closeModal( setViewDoctorVisible ) }
				transparent={ true }
				visible={ viewDoctorVisible }
			>
				<ViewDoctor
					closeView={ ( ) =>  closeModal( setViewDoctorVisible ) }
					doctorData={ doctorData }
					doctorIndex={ doctorIndex }
					handleNavigation={ handleNavigation }
					setEditDoctorVisible={ setEditDoctorVisible }
					setDoctorIndex={ setDoctorIndex }
					setTempDoctorData={ setTempDoctorData }
					setViewDoctorVisible={ setViewDoctorVisible }
				/>
			</Modal>

			<Modal
				animationType='slide'
				onRequestClose={ ( ) => closeModal( setEditDoctorVisible ) }
				transparent={ true }
				visible={ editDoctorVisible }
			>
				<EditDoctor
					closeEdit={ ( ) => closeModal( setEditDoctorVisible ) }
					deleteEntry={ deleteEntry }
					doctorData={ doctorData }
					doctorIndex={ doctorIndex }
					saveEntry={ saveEntry }
					setTempDoctorData={ setTempDoctorData }
					tempDoctorData={ tempDoctorData }
				/>
			</Modal>
			</>
		}
		</View>
	);
}

export default DoctorScreen;