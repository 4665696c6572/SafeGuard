import * as NavigationBar from 'expo-navigation-bar';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import deleteFromDB from '../../common/userData/deleteFromDB.js';
import saveToDB from '../../common/userData/saveToDB.js';
import useLoadEmergencyData from '../../common/userData/hook/useLoadEmergencyData';

import styles from '../../styles/styles.js';

import { EditMedication, Medication, ViewMedication } from './components/medication.js';


// Medication information screen with modals for viewing and editing.
const MedicationScreen = ({ route }) =>
{
	const db = useSQLiteContext( );
	const params = route?.params;

	const [ conditionData, setConditionData, loadingConditionData, loadConditionData ] = useLoadEmergencyData( db, 'Medical_Condition_Name' );
	const [ doctorData, setDoctorData, loadingDoctorData, loadDoctorData ] = useLoadEmergencyData( db, 'Doctor_Name' );
	const [ medicationData, setMedicationData, loadingMedicationData, loadMedicationData ] = useLoadEmergencyData( db, 'Medication' );

	// Temp data selection & storage to allow for canceling mid add/edit.
	const [ medicationIndex, setMedicationIndex ] = useState( params?.condition ? params.condition : 0 );
	const [ tempMedicationData, setTempMedicationData ] = useState( );

	// Modal Controls.
	const [ editMedicationVisible, setEditMedicationVisible ] = useState( false );
	const [ viewMedicationVisible, setViewMedicationVisible ] = useState( false );

	const isFocused = useIsFocused( );


	// Load/Reload data on screen focus.
	useEffect(( ) =>
	{
		if ( isFocused )
		{
			loadConditionData( );
			loadDoctorData( );
			loadMedicationData( );
		}
	}, [ isFocused ]);


	// Saves to db & reloads data for on screen data refresh.
	async function saveEntry( table, data, id )
	{
		await saveToDB( db, table, data, id, loadMedicationData );
	}


	// Deletes from db & reloads data for on screen data refresh.
	async function deleteEntry( table, id )
	{
		deleteFromDB( db, table, id, loadMedicationData );		
	}


	// close and reset for modals
	function closeModal( setModalVisible )
	{
		// navigation bar hidden in modals.
		NavigationBar.setVisibilityAsync( "visible" );
		setMedicationIndex( null );
		setModalVisible( false );
		setTempMedicationData( );
	}


	return(
		<View style={ styles.bottom_tab_container }>
		{
			loadingMedicationData ?
			<ActivityIndicator/>
		:
			<>
			<Medication
				medicationData={ medicationData }
				setEditMedicationVisible={ setEditMedicationVisible }
				setMedicationIndex={ setMedicationIndex }
				setViewMedicationVisible={ setViewMedicationVisible }
			/>

			<Modal
				animationType='slide'
				onRequestClose={ ( ) => closeModal( setViewMedicationVisible ) }
				transparent={ true }
				visible={ viewMedicationVisible }
			>
				<ViewMedication
					closeView={ ( ) =>  closeModal( setViewMedicationVisible ) }
					conditionData={ conditionData }
					doctorData={ doctorData }
					medicationData={ medicationData }
					medicationIndex={ medicationIndex }
					setEditMedicationVisible={ setEditMedicationVisible }
					setTempMedicationData={ setTempMedicationData }
					setViewMedicationVisible={ setViewMedicationVisible }
				/>
			</Modal>

			<Modal
				animationType='slide'
				onRequestClose={ ( ) => closeModal( setEditMedicationVisible )  }
				transparent={ true }
				visible={ editMedicationVisible }
			>
				<EditMedication
					closeEdit={  ( ) =>  closeModal( setEditMedicationVisible )  }
					conditionData={ conditionData }
					deleteEntry={ deleteEntry }
					doctorData={ doctorData }
					medicationData={ medicationData }
					medicationIndex={ medicationIndex }
					saveEntry={ saveEntry }
					setMedicationData={ setMedicationData }
					setTempMedicationData={ setTempMedicationData }
					tempMedicationData={ tempMedicationData }
				/>
			</Modal>
			</>
		}
		</View>
	)
};
export default MedicationScreen;