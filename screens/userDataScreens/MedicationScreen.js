import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import deleteFromDB from '../../common/userData/deleteFromDB.js';
import saveToDB from '../../common/userData/saveToDB.js';
import useLoadEmergencyData from '../../common/userData/hook/useLoadEmergencyData';

import styles from '../../styles/styles.js';

import { EditMedication, Medication, ViewMedication } from './components/medication.js';


const MedicationScreen = ({ route }) =>
{
	const db = useSQLiteContext( );
	const params = route?.params;

	const [ medicationData,  setMedicationData, loadingMedicationData , loadMedicationData] = useLoadEmergencyData( db, 'Medication' );
	const [ doctorData, setDoctorData, loadingDoctorData, loadDoctorData ] = useLoadEmergencyData( db, 'Doctor_Name' );
	const [ conditionData, setConditionData, loadingConditionData, loadConditionData ] = useLoadEmergencyData( db, 'Medical_Condition_Name' );

	const [ medicationIndex, setMedicationIndex ] = useState( params?.condition ? params.condition : 0 );
	const [ tempMedicationData, setTempMedicationData ] = useState( );

	const [ editMedicationVisible, setEditMedicationVisible ] = useState( false );
	const [ viewMedicationVisible, setViewMedicationVisible ] = useState( false );

	const isFocused = useIsFocused( );


	useEffect(( ) =>
		{
			if ( isFocused )
			{
				loadConditionData( );
				loadDoctorData( );
				loadMedicationData( );
			}
	}, [ isFocused ]);


	async function saveEntry( table, data, id )
	{
		await saveToDB( db, table, data, id, loadMedicationData );
	}

	async function deleteEntry( table, id )
	{
		deleteFromDB( db, table, id, loadMedicationData );		
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

			<Modal animationType='slide' visible={ viewMedicationVisible }>
				<ViewMedication
					conditionData={ conditionData }
					doctorData={ doctorData }
					medicationData={ medicationData }
					medicationIndex={ medicationIndex }
					setEditMedicationVisible={ setEditMedicationVisible }
					setMedicationIndex={ setMedicationIndex }
					setTempMedicationData={ setTempMedicationData }
					setViewMedicationVisible={ setViewMedicationVisible }
				/>
			</Modal>

			<Modal animationType='slide' visible={ editMedicationVisible }>
				<EditMedication
					conditionData={ conditionData }
					deleteEntry={ deleteEntry }
					doctorData={ doctorData }
					medicationData={ medicationData }
					medicationIndex={ medicationIndex }
					saveEntry={ saveEntry }
					setEditMedicationVisible={ setEditMedicationVisible }
					setMedicationData={ setMedicationData }
					setMedicationIndex={ setMedicationIndex }
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