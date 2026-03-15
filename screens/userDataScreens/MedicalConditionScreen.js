import * as NavigationBar from 'expo-navigation-bar';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import deleteFromDB from '../../common/userData/deleteFromDB.js';
import saveToDB from '../../common/userData/saveToDB.js';
import useLoadEmergencyData from '../../common/userData/hook/useLoadEmergencyData';

import styles from '../../styles/styles.js';

import { Allergy, EditAllergy, ViewAllergy } from "./components/allergy";
import { EditMedicalCondition, MedicalCondition, ViewMedicalCondition } from "./components/medicalCondition";


// Allergy & Medical Condition information screen with modals for viewing and editing.
const MedicalConditionScreen = ( ) =>
{
	const db = useSQLiteContext( );

	const [ allergyData, setAllergyData, loadingAllergyData, loadAllergyData ] = useLoadEmergencyData( db, 'Allergy' );
	const [ conditionData, setConditionData, loadingConditionData, loadConditionData ] = useLoadEmergencyData( db, 'Medical_Condition' );
	const [ doctorData, setDoctorData, loadingDoctorData, loadDoctorData ] = useLoadEmergencyData( db, 'Doctor_Name' );
	const [ medicationData, setMedicationData, loadingMedicationData, loadMedicationData ] = useLoadEmergencyData( db, 'Medication_Name' );

	// Temp data selection & storage to allow for canceling mid add/edit.
	const [ allergyIndex, setAllergyIndex ] = useState( );
	const [ tempAllergyData, setTempAllergyData ] = useState( );

	// Modal Controls.
	const [ editAllergyVisible, setEditAllergyVisible ] = useState( false );
	const [ viewAllergyVisible, setViewAllergyVisible ] = useState( false );

	// Temp data selection & storage to allow for canceling mid add/edit.
	const [ conditionIndex, setConditionIndex ] = useState( );
	const [ tempConditionData, setTempConditionData ] = useState( );

	// Modal Controls.
	const [ editConditionVisible, setEditConditionVisible ] = useState( false );
	const [ viewConditionVisible, setViewConditionVisible ] = useState( false );

	const isFocused = useIsFocused( );


	// Load/Reload data on screen focus.
	useEffect(( ) =>
	{
		if ( isFocused )
		{
			loadAllergyData( );
			loadConditionData( );
			loadDoctorData( );
			loadMedicationData( );
		}
	}, [ isFocused ]);


	// Saves to db & reloads data for on screen data refresh.
	async function saveEntry( table, data, id )
	{
		if ( table == 'Allergy' )    await saveToDB( db, table, data, id, loadAllergyData );
		else    await saveToDB( db, table, data, id, loadConditionData );
	}


	// Deletes from db & reloads data for on screen data refresh.
	async function deleteEntry( table, id )
	{
		if ( table == 'Allergy' )    await deleteFromDB( db, table, id, loadAllergyData );
		else    await deleteFromDB( db, table, id, loadConditionData );
	}

	// close and reset for modals
	function closeModal( screen, setModalVisible )
	{
		// navigation bar hidden in modals.
		NavigationBar.setVisibilityAsync( "visible" );
		setModalVisible( false );

		if ( screen == 'Allergy' )
		{
			setAllergyIndex( null );
			setTempAllergyData( );
		}
		else
		{
			setConditionIndex( null );
			setTempConditionData( );
		}
	}


	return(
		<View style={ styles.bottom_tab_container }>
		{
			( 	loadingAllergyData || loadingConditionData ||
				loadingDoctorData || loadingMedicationData 		) ?
				<ActivityIndicator/>
		:
			<>
			
			<ScrollView>
				{/* Medical Condition */}
				<MedicalCondition
					conditionData={ conditionData }
					setConditionIndex={ setConditionIndex }
					setEditConditionVisible={ setEditConditionVisible }
					setViewConditionVisible={ setViewConditionVisible }
				/>

				{/* Allergy */}
				<Allergy
					allergyData={ allergyData }
					setAllergyIndex={ setAllergyIndex }
					setEditAllergyVisible={ setEditAllergyVisible }
					setViewAllergyVisible={ setViewAllergyVisible }
				/>

				{/* View medical condition */}
				<Modal
					animationType='slide'
					onRequestClose={ ( ) => closeModal( 'Condition', setViewConditionVisible ) }
					transparent={ true }
					visible={ viewConditionVisible }
				>
					<ViewMedicalCondition
						closeView={ ( ) => closeModal( 'Condition', setViewConditionVisible ) }
						conditionData={ conditionData }
						conditionIndex={ conditionIndex }
						doctorData={ doctorData }
						medicationData={ medicationData }
						setEditConditionVisible={ setEditConditionVisible }
						setTempConditionData={ setTempConditionData }
						setViewConditionVisible={ setViewConditionVisible }
					/>
				</Modal>

				{/* View allergy */}
				<Modal
					animationType='slide'
					onRequestClose={ ( ) => closeModal( 'Allergy', setViewAllergyVisible ) }
					transparent={ true }
					visible={ viewAllergyVisible }
				>
					<ViewAllergy
						closeView={ ( ) => closeModal( 'Allergy', setViewAllergyVisible ) }
						allergyData={ allergyData }
						allergyIndex={ allergyIndex }
						doctorData={ doctorData }
						medicationData={ medicationData }
						setEditAllergyVisible={ setEditAllergyVisible }
						setTempAllergyData={ setTempAllergyData }
						setViewAllergyVisible={ setViewAllergyVisible }
					/>
				</Modal>

				{/* Edit medical condition */}
				<Modal
					animationType='slide'
					onRequestClose={ ( ) => closeModal( 'Condition', setEditConditionVisible ) }
					transparent={ true }
					visible={ editConditionVisible }
				>
					<EditMedicalCondition
						closeEdit={ ( ) => closeModal( 'Condition', setEditConditionVisible ) }
						conditionData={ conditionData }
						conditionIndex={ conditionIndex }
						deleteEntry={ deleteEntry }
						doctorData={ doctorData }
						saveEntry={ saveEntry }
						setTempConditionData={ setTempConditionData }
						tempConditionData={ tempConditionData }
					/>
				</Modal>

				{/* Edit allergy */}
				<Modal
					animationType='slide'
					onRequestClose={ ( ) => closeModal( 'Allergy', setEditAllergyVisible ) }
					transparent={ true }
					visible={ editAllergyVisible }
				>
					<EditAllergy
						closeEdit={ ( ) => closeModal( 'Allergy', setEditAllergyVisible ) }
						allergyData={ allergyData }
						allergyIndex={ allergyIndex }
						deleteEntry={ deleteEntry }
						doctorData={ doctorData }
						saveEntry={ saveEntry }
						setTempAllergyData={ setTempAllergyData }
						tempAllergyData={ tempAllergyData }
					/>
				</Modal>
			</ScrollView>
			</>
		}
		</View>
	)
};

export default MedicalConditionScreen;