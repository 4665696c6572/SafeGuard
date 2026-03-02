import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import deleteFromDB from '../../common/userData/deleteFromDB.js';
import saveToDB from '../../common/userData/saveToDB.js';
import useLoadEmergencyData from '../../common/userData/hook/useLoadEmergencyData';

import styles from '../../styles/styles.js';

import { Doctor, EditDoctor, ViewDoctor } from './components/doctor';


const DoctorScreen = ({ navigation, route }) =>
{
	const db = useSQLiteContext( );
	const params = route?.params;

	const [ doctorData, setDoctorData, loadingDoctorData, loadDoctorData ] = useLoadEmergencyData( db, 'Doctor' );

	const [ editDoctorVisible, setEditDoctorVisible ] = useState( params?.visible ?? false );
	const [ viewDoctorVisible, setViewDoctorVisible ] = useState( false );

	const [ doctorIndex, setDoctorIndex ] = useState( null );
	const [ tempDoctorData, setTempDoctorData ] = useState( );

	const isFocused = useIsFocused( );


	useEffect(( ) =>
	{
		if ( isFocused )
		{
			loadDoctorData( );
		}
	}, [ isFocused ]);


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


	async function deleteEntry( table, id )
	{
		deleteFromDB( db, table, id, loadDoctorData );
	}


	function handleNavigation( id, name, facility )
	{
		navigation.navigate( 'ContactScreen', { id: id, contact_name: name, facility: facility, return: true });
	}


	if ( loadingDoctorData )    return <ActivityIndicator/>;

	return (
		<View style={ styles.bottom_tab_container }>
			<Doctor
				doctorData={ doctorData }
				setEditDoctorVisible={ setEditDoctorVisible }
				setDoctorIndex={ setDoctorIndex }
				setViewDoctorVisible={ setViewDoctorVisible }
			/>

			<Modal animationType='slide' visible={ viewDoctorVisible }>
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

			<Modal animationType='slide' visible={ editDoctorVisible }>
				<EditDoctor
					deleteEntry={ deleteEntry }
					doctorData={ doctorData }
					doctorIndex={ doctorIndex }
					saveEntry={ saveEntry }
					setEditDoctorVisible={ setEditDoctorVisible }
					setDoctorIndex={ setDoctorIndex }
					setTempDoctorData={ setTempDoctorData }
					setViewDoctorVisible={ setViewDoctorVisible }
					tempDoctorData={ tempDoctorData }
				/>
			</Modal>
		</View>
	);
}

export default DoctorScreen;