import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import saveToDB from '../../common/userData/saveToDB.js';
import useLoadEmergencyData from '../../common/userData/hook/useLoadEmergencyData';

import styles from '../../styles/styles.js';

import { Allergy, EditAllergy, ViewAllergy } from "./components/allergy";
import { EditMedicalCondition, MedicalCondition, ViewMedicalCondition } from "./components/medicalCondition";


const MedicalConditionScreen = ( ) =>
{
	const db = useSQLiteContext();

	const [ allergyData, setAllergyData, loadingAllergyData, loadAllergyData ] = useLoadEmergencyData( db, 'Allergy' );
	const [ conditionData, setConditionData, loadingConditionData, loadConditionData ] = useLoadEmergencyData( db, 'Medical_Condition' );
	const [ doctorData, setDoctorData, loadingDoctorData, loadDoctorData ] = useLoadEmergencyData( db, 'Doctor_Name' );
	const [ medicationData, setMedicationData, loadingMedicationData, loadMedicationData ] = useLoadEmergencyData( db, 'Medication_Name' );

	const [ tempConditionData, setTempConditionData ] = useState( );
	const [ conditionIndex, setConditionIndex ] = useState( );

	const [ editConditionVisible, setEditConditionVisible ] = useState( false );
	const [ viewConditionVisible, setViewConditionVisible ] = useState( false );

	const [ tempAllergyData, setTempAllergyData ] = useState( );
	const [ allergyIndex, setAllergyIndex ] = useState( );

	const [ editAllergyVisible, setEditAllergyVisible ] = useState( false );
	const [ viewAllergyVisible, setViewAllergyVisible ] = useState( false );

	const isFocused = useIsFocused();

	useEffect(() =>
		{
			if ( isFocused )
			{
				loadAllergyData( );
				loadConditionData( );
				loadDoctorData( );
				loadMedicationData( );
			}
	}, [ isFocused ]);


	async function save( table, data, id )
	{
		let loadData;
		if ( table == 'Allergy' ) loadData = loadAllergyData;
		else loadData = loadConditionData;

		await saveToDB( table, data, db, id, loadData );
	}


	if
	(
		loadingAllergyData || loadingConditionData ||
		loadingDoctorData || loadingMedicationData
	)
	{
		return <ActivityIndicator/>;
	}


	return(
		<View style={ styles.container }>
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
				<Modal animationType='slide' visible={ viewConditionVisible }>
					<ViewMedicalCondition
						conditionData={ conditionData }
						conditionIndex={ conditionIndex }
						doctorData={ doctorData }
						medicationData={ medicationData }
						setConditionIndex={ setConditionIndex }
						setEditConditionVisible={ setEditConditionVisible }
						setTempConditionData={ setTempConditionData }
						setViewConditionVisible={ setViewConditionVisible }
					/>
				</Modal>

				{/* View allergy */}
				<Modal animationType='slide' visible={ viewAllergyVisible }>
					<ViewAllergy
						allergyData={ allergyData }
						allergyIndex={ allergyIndex }
						doctorData={ doctorData }
						medicationData={ medicationData }
						setAllergyIndex={ setAllergyIndex }
						setEditAllergyVisible={ setEditAllergyVisible }
						setTempAllergyData={ setTempAllergyData }
						setViewAllergyVisible={ setViewAllergyVisible }
					/>
				</Modal>

				{/* Edit medical condition */}
				<Modal animationType='slide' visible={ editConditionVisible }>
					<EditMedicalCondition
						conditionData={ conditionData}
						conditionIndex={ conditionIndex }
						doctorData={ doctorData }
						save={ save }
						setConditionIndex={ setConditionIndex }
						setEditConditionVisible={ setEditConditionVisible }
						setTempConditionData={ setTempConditionData }
						tempConditionData={ tempConditionData }
					/>
				</Modal>

				{/* Edit allergy */}
				<Modal animationType='slide' visible={ editAllergyVisible }>
					<EditAllergy
						allergyData={ allergyData}
						allergyIndex={ allergyIndex }
						doctorData={ doctorData }
						save={ save }
						setAllergyIndex={ setAllergyIndex }
						setEditAllergyVisible={ setEditAllergyVisible }
						setTempAllergyData={ setTempAllergyData }
						tempAllergyData={ tempAllergyData }
					/>
				</Modal>
			</ScrollView>
		</View>
	)
};

export default MedicalConditionScreen;