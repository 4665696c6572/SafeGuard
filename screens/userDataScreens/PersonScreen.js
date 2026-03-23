import * as NavigationBar from 'expo-navigation-bar';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import deleteFromDB from '../../common/userData/deleteFromDB.js';
import saveToDB from '../../common/userData/saveToDB.js';
import useLoadEmergencyData from '../../common/userData/hook/useLoadEmergencyData.js';

import styles from '../../styles/styles.js';

import { EditInsurance, Insurance, ViewInsurance } from './components/insurance.js';
import { EditPerson, Person } from './components/person.js';


// Personal & Insurance information screen with modals for viewing and editing.
const PersonScreen = ({ navigation, route }) =>
{
	const db = useSQLiteContext( );

	const [ insuranceData, setInsuranceData, loadingInsuranceData, loadInsuranceData ] = useLoadEmergencyData( db, 'Insurance' );
	const [ personData, setPersonData, loadingPersonData, loadPersonData ] = useLoadEmergencyData( db, 'Person' );

	// Temp data selection & storage to allow for canceling mid add/edit.
	const [ insuranceIndex, setInsuranceIndex ] = useState( null );
	const [ tempInsuranceData, setTempInsuranceData ] = useState( );

	// Modal Controls.
	const [ editInsuranceVisible, setEditInsuranceVisible ] = useState( false );
	const [ viewInsuranceVisible, setViewInsuranceVisible ] = useState( false );

	// Temp data storage to allow for canceling mid add/edit.
	const [ tempPersonData, setTempPersonData ] = useState( );
	const [ showDeleteButton, setShowDeleteButton ] = useState( false );

	// Modal Controls.
	const [ editPersonVisible, setEditPersonVisible ] = useState( false );

	const isFocused = useIsFocused( );


	// Load/Reload data on screen focus.
	useEffect( ( ) =>
	{
		if ( isFocused )
		{
			loadPersonData( );
			loadInsuranceData( );
		}
	}, [ isFocused ]);


	/*
	 *	Saves to db.
	 *	Additionally reloads data for on screen data refresh.
	 *	Navigates to Contact Screen if needed ( only for insurance ).
	 */
	async function saveEntry( table, data, id, shouldNavigate )
	{
		if ( shouldNavigate )
		{
			const new_id = await saveToDB( db, table, data, id, loadInsuranceData, shouldNavigate );
			handleNavigation( new_id, data.entity_name );
		}
		else
		{
			if ( table == 'Person' )    await saveToDB( db, table, data, id, loadPersonData );
			else    await saveToDB( db, table, data, id, loadInsuranceData );
		}
	}


	// Deletes from db & reloads data for on screen data refresh.
	async function deleteEntry( table, id )
	{
		if ( table == 'Person' )    await deleteFromDB( db, table, id, loadPersonData );
		else    await deleteFromDB( db, table, id, loadInsuranceData );
	}


	// Insurance can have contact details.
	function handleNavigation( id, name )
	{
		navigation.navigate( 'ContactScreen', { id: id, contact_name: name, return: true });
	}


	// close and reset for modals
	function closeModal( screen, setModalVisible )
	{
		// navigation bar hidden in modals.
		NavigationBar.setVisibilityAsync( "visible" );
		setModalVisible( false );

		if ( screen == 'Person' )
		{
			setShowDeleteButton( false );
			setTempPersonData( );
		}
		else
		{
			setInsuranceIndex( null );
			setTempInsuranceData( );
		}
	}


	return (
		<View style={ styles.bottom_tab_container }>
		{
			( loadingPersonData || loadingInsuranceData ) ?
			<ActivityIndicator/>
		:
			<>
			<Person
				personData={ personData }
				setEditPersonVisible={ setEditPersonVisible }
				setShowDeleteButton={ setShowDeleteButton }
				setTempPersonData={ setTempPersonData }
				showEditButton={ true }
			/>

			<Insurance
				insuranceData={ insuranceData }
				setEditInsuranceVisible={ setEditInsuranceVisible }
				setInsuranceIndex={ setInsuranceIndex }
				setViewInsuranceVisible={ setViewInsuranceVisible }
			/>

			<Modal
				animationType='slide'
				onRequestClose={ ( ) =>  closeModal( 'Insurance', setViewInsuranceVisible ) }
				transparent={ true }
				visible={ viewInsuranceVisible }
			>
				<ViewInsurance
					closeView={  ( ) =>  closeModal( 'Insurance', setViewInsuranceVisible )  }
					handleNavigation={ handleNavigation }
					insuranceData={ insuranceData }
					insuranceIndex={ insuranceIndex }
					setEditInsuranceVisible={ setEditInsuranceVisible }
					setInsuranceIndex={ setInsuranceIndex }
					setTempInsuranceData={ setTempInsuranceData }
					setViewInsuranceVisible={ setViewInsuranceVisible }
				/>
			</Modal>

			<Modal
				animationType='slide'
				onRequestClose={ ( ) =>  closeModal( 'Person', setEditPersonVisible ) }
				transparent={ true }
				visible={ editPersonVisible }
			>
				<EditPerson
					closeEdit={ ( ) =>  closeModal( 'Person', setEditPersonVisible ) }
					deleteEntry={ deleteEntry }
					personData={ personData }
					saveEntry={ saveEntry }
					setTempPersonData={ setTempPersonData }
					showDeleteButton={ showDeleteButton }
					tempPersonData={ tempPersonData }
				/>
			</Modal>

			<Modal
				animationType='slide'
				onRequestClose={ ( ) =>  closeModal( 'Insurance', setEditInsuranceVisible ) }
				transparent={ true }
				visible={ editInsuranceVisible }
			>
				<EditInsurance
					closeEdit={  ( ) =>  closeModal( 'Insurance', setEditInsuranceVisible ) }
					deleteEntry={ deleteEntry }
					insuranceData={ insuranceData }
					insuranceIndex={ insuranceIndex }
					saveEntry={ saveEntry }
					setEditInsuranceVisible={ setEditInsuranceVisible }
					setInsuranceIndex={ setInsuranceIndex }
					setTempInsuranceData={ setTempInsuranceData }
					setViewInsuranceVisible={ setViewInsuranceVisible }
					tempInsuranceData={ tempInsuranceData }
				/>
			</Modal>
			</>
		}
		</View>
	);
}

export default PersonScreen;