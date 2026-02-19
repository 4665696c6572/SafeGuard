import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import updateEmergencyData from '../../common/userData/database/updateEmergencyData.js';
import useLoadEmergencyData from '../../common/userData/hook/useLoadEmergencyData';
import insertEmergencyData from '../../common/userData/database/insertEmergencyData.js';

import styles from '../../styles/styles.js';

import { Medication, EditMedication, ViewMedication } from './components/medication.js';


const MedicationScreen = ({ navigation, route  }) =>
{
	const db = useSQLiteContext();
	const params = route?.params;

	const [ medicationData,  setMedicationData, loadingMedicationData , loadMedicationData] = useLoadEmergencyData( db, 'Medication', 'Select' );
	const [ doctorData, setDoctorData, loadingDoctorData, loadDoctorData ] = useLoadEmergencyData( db, 'Doctor_Name', 'Select' );

	const [ medicationIndex, setMedicationIndex ] = useState( params?.condition ? params.condition : 0 );
	const [ tempMedicationData, setTempMedicationData ] = useState( );

	const [ viewMedicationVisible, setViewMedicationVisible ] = useState( false );
	const [ editMedicationVisible, setEditMedicationVisible ] = useState( false );

	const [ isFormValid, setIsFormValid ] = useState( false );


	const isFocused = useIsFocused();
	
	useEffect(() =>
		{
			if ( isFocused )
			{
				loadDoctorData();
				loadMedicationData();
			}
	}, [ isFocused ]);



		async function saveToDB( medicationData, setMedicationData, tempMedicationData )
		{
			if ( tempMedicationData.medication_id )
			{	
				await updateEmergencyData( 'Medication', tempMedicationData, db );
			}
			else
			{
				await insertEmergencyData( 'Medication', tempMedicationData, db );
			}

			loadMedicationData();
		}


		if ( loadingMedicationData )    return <ActivityIndicator/>;

	return(
		<View style={ styles.container }>
			<Medication
				medicationData={ medicationData }
				setEditMedicationVisible={ setEditMedicationVisible }
				setMedicationIndex={ setMedicationIndex }
				setViewMedicationVisible={setViewMedicationVisible}
			/>

			<Modal animationType='slide' color='#d1dce4ff' visible={ viewMedicationVisible }>
				<ViewMedication
					doctorData={ doctorData }
					medicationData={ medicationData }
					medicationIndex={ medicationIndex }
					setEditMedicationVisible={ setEditMedicationVisible }
					setMedicationIndex={ setMedicationIndex }
					setTempMedicationData={ setTempMedicationData }
					setViewMedicationVisible={setViewMedicationVisible}
				/>
			</Modal>

			<Modal animationType='slide' color='#d1dce4ff' visible={editMedicationVisible }>
				<EditMedication
					doctorData={ doctorData }
					isFormValid={ isFormValid }
					medicationData={medicationData}
					medicationIndex={ medicationIndex }
					saveToDB={ saveToDB }
					setEditMedicationVisible={ setEditMedicationVisible }
					setIsFormValid={ setIsFormValid }
					setMedicationData={ setMedicationData}
					setMedicationIndex={ setMedicationIndex }
					setTempMedicationData={ setTempMedicationData }
					tempMedicationData={ tempMedicationData }
				/>
			</Modal>
		</View>
	)
};
export default MedicationScreen;