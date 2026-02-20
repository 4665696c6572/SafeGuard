import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import updateEmergencyData from '../../common/userData/database/updateEmergencyData.js';
import useLoadEmergencyData from '../../common/userData/hook/useLoadEmergencyData';
import insertEmergencyData from '../../common/userData/database/insertEmergencyData.js';

import styles from '../../styles/styles.js';

import { Doctor, EditDoctor, ViewDoctor } from './components/doctor';


const DoctorScreen = ({ navigation, route }) =>
{
	const db = useSQLiteContext();
	const params = route?.params;

	const [ doctorData, setDoctorData, loadingDoctorData, loadDoctorData ] = useLoadEmergencyData( db, 'Doctor' );

	const [ editDoctorVisible, setEditDoctorVisible ] = useState( params?.visible ?? false );
	const [ viewDoctorVisible, setViewDoctorVisible ] = useState( false );

	const [ doctorIndex, setDoctorIndex ] = useState( null );
	const [ tempDoctorData, setTempDoctorData ] = useState( );

	const [ isFormValid, setIsFormValid ] = useState( false );
	const isFocused = useIsFocused();

	useEffect(() =>
	{
		if ( isFocused )
		{
			loadDoctorData( );
		}
	}, [ isFocused ]);


	async function saveToDB( data, shouldNavigate )
	{
		let id;
		if (data?.entity_id )
		{
			await updateEmergencyData( 'Doctor', data, db );
		}
		else
		{
			id = await insertEmergencyData( 'Doctor', data, db );
		}
		loadDoctorData( );

		if ( shouldNavigate )    handleNavigation( id, data.entity_name, data?.facility_name );
	}


	function handleNavigation( id, name, facility )
	{
		navigation.navigate('ContactScreen', { id: id, contact_name: name, facility: facility, return: true });
	}


	if ( loadingDoctorData )    return <ActivityIndicator/>;

	return (
		<View style={ styles.container }>
			<Doctor
				doctorData={ doctorData }
				setEditDoctorVisible={ setEditDoctorVisible }
				setDoctorIndex={ setDoctorIndex }
				setViewDoctorVisible={ setViewDoctorVisible }
			/>

			<Modal animationType='slide' color='#d1dce4ff' visible={ viewDoctorVisible }>
				<ViewDoctor
					doctorData={ doctorData }
					doctorIndex={ doctorIndex }
					handleNavigation={ handleNavigation }
					setEditDoctorVisible={ setEditDoctorVisible }
					setDoctorIndex={ setDoctorIndex }
					setTempDoctorData={ setTempDoctorData }
					setViewDoctorVisible={ setViewDoctorVisible }
				/>
			</Modal>

			<Modal animationType='slide' color='#d1dce4ff' visible={ editDoctorVisible }>
				<EditDoctor
					doctorData={ doctorData }
					doctorIndex={ doctorIndex }
					isFormValid={ isFormValid }
					saveToDB={ saveToDB }
					setEditDoctorVisible={ setEditDoctorVisible }
					setDoctorIndex={ setDoctorIndex }
					setIsFormValid={ setIsFormValid }
					setTempDoctorData={ setTempDoctorData }
					setViewDoctorVisible={ setViewDoctorVisible }
					tempDoctorData={ tempDoctorData }
				/>
			</Modal>
		</View>
	);
}

export default DoctorScreen;