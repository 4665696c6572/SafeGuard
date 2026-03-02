import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import deleteFromDB from '../../common/userData/deleteFromDB.js';
import saveToDB from '../../common/userData/saveToDB.js';
import useLoadEmergencyData from '../../common/userData/hook/useLoadEmergencyData';

import styles from '../../styles/styles.js';

import { EditInsurance, Insurance, ViewInsurance } from './components/insurance.js';
import { EditPerson, Person } from './components/person';


const PersonScreen = ({ navigation, route }) =>
{
	const db = useSQLiteContext( );
	const params = route?.params;

	const [ personData, setPersonData, loadingPersonData, loadPersonData ] = useLoadEmergencyData( db, 'Person' );
	const [ tempPersonData, setTempPersonData ] = useState( );

	const [ editPersonVisible, setEditPersonVisible ] = useState( false );
	const [ showDeleteButton, setShowDeleteButton ] = useState( false );

	const [ insuranceData, setInsuranceData, loadingInsuranceData, loadInsuranceData ] = useLoadEmergencyData( db, 'Insurance', 'Health' );
	const [ insuranceIndex, setInsuranceIndex ] = useState( params?.condition ? params.condition : null );
	const [ tempInsuranceData, setTempInsuranceData ] = useState( );

	const [ editInsuranceVisible, setEditInsuranceVisible ] = useState( false );
	const [ viewInsuranceVisible, setViewInsuranceVisible ] = useState( false );

	const isFocused = useIsFocused( );


	useEffect( ( ) =>
	{
		if ( isFocused )
		{
			loadPersonData( );
			loadInsuranceData( );
		}
	}, [ isFocused ]);


	async function saveEntry( table, data, id, shouldNavigate )
	{
		if ( shouldNavigate )
		{
			const new_id = await saveToDB( db, table, data, id, loadInsuranceData, shouldNavigate );
			handleNavigation( new_id, data[id] );
			
		}
		else
		{
			if ( table == 'Person' )    await saveToDB( db, table, data, id, loadPersonData );
			else    await saveToDB( db, table, data, id, loadInsuranceData );
		}
	}


	async function deleteEntry( table, id )
	{
		if ( table == 'Person' )    await deleteFromDB( db, table, id, loadPersonData );
		else    await deleteFromDB( db, table, id, loadInsuranceData );
	}


	function handleNavigation( id, name )
	{
		navigation.navigate('ContactScreen', { id: id, contact_name: name, return: true });
	}


	if ( loadingPersonData || loadingInsuranceData )    return <ActivityIndicator/>;

	return (
		<View style={ styles.bottom_tab_container }>
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

			<Modal animationType='slide' visible={ viewInsuranceVisible }>
				<ViewInsurance
					handleNavigation={ handleNavigation }
					insuranceData={ insuranceData }
					insuranceIndex={ insuranceIndex }
					setEditInsuranceVisible={ setEditInsuranceVisible }
					setInsuranceIndex={ setInsuranceIndex }
					setTempInsuranceData={ setTempInsuranceData }
					setViewInsuranceVisible={ setViewInsuranceVisible }
				/>
			</Modal>

			<Modal animationType='slide' visible={ editPersonVisible }>
				<EditPerson
					deleteEntry={ deleteEntry }
					personData={ personData }
					saveEntry={ saveEntry }
					setEditPersonVisible={ setEditPersonVisible }
					setShowDeleteButton={ setShowDeleteButton }
					setTempPersonData={ setTempPersonData }
					showDeleteButton={ showDeleteButton }
					tempPersonData={ tempPersonData }
				/>
			</Modal>

			<Modal animationType='slide' visible={ editInsuranceVisible }>
				<EditInsurance
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
		</View>
	);
}

export default PersonScreen;