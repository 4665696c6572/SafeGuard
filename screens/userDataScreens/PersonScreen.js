import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import saveToDB from '../../common/userData/saveToDB.js';
import useLoadEmergencyData from '../../common/userData/hook/useLoadEmergencyData';

import styles from '../../styles/styles.js';

import { EditInsurance, Insurance, ViewInsurance } from './components/insurance.js';
import { EditPerson, Person } from './components/person';


const PersonScreen = ({ navigation, route }) =>
{
	const db = useSQLiteContext();
	const params = route?.params;

	const [ entityData, setEntityData, loadingEntityData, loadEntityData ] = useLoadEmergencyData( db, 'Person' );
	const [ editPersonVisible, setEditPersonVisible ] = useState( false );
	const [ tempEntityData, setTempEntityData ] = useState( );

	const [ insuranceData, setInsuranceData, loadingInsuranceData, loadInsuranceData ] = useLoadEmergencyData( db, 'Insurance', 'Health' );
	const [ tempInsuranceData, setTempInsuranceData ] = useState( );
	const [ insuranceIndex, setInsuranceIndex ] = useState( params?.condition ? params.condition : null );
	const [ viewInsuranceVisible, setViewInsuranceVisible ] = useState( false );
	const [ editInsuranceVisible, setEditInsuranceVisible ] = useState( false );

	const isFocused = useIsFocused();


	useEffect( ( ) =>
	{
		if ( isFocused )
		{
			loadEntityData( );
			loadInsuranceData( );
		}
	}, [ isFocused ]);


	async function save( table, data, id, shouldNavigate )
	{
		let loadData;
		if ( table == 'Person' ) loadData = loadEntityData;
		else loadData = loadInsuranceData;

		if ( shouldNavigate )
		{
			const new_id = await saveToDB( table, data, db, id, loadData, shouldNavigate );
			handleNavigation( new_id, data[id] );
		}
		else
		{
			await saveToDB( table, data, db, id, loadData );
		}
	}


	function handleNavigation( id, name )
	{
		navigation.navigate('ContactScreen', { id: id, contact_name: name, return: true });
	}

	if ( loadingEntityData || loadingInsuranceData )    return <ActivityIndicator/>;


	return (
		<View style={ styles.container }>
			<Person
				entityData={ entityData }
				setEditPersonVisible={ setEditPersonVisible }
				setTempEntityData={ setTempEntityData }
				showEditButton={ true }
			/>

			<Insurance
				insuranceData={ insuranceData }
				setEditInsuranceVisible={ setEditInsuranceVisible }
				setInsuranceIndex={ setInsuranceIndex }
				setViewInsuranceVisible={ setViewInsuranceVisible }
			/>

			<Modal animationType='slide' visible={ editPersonVisible }>
				<EditPerson
					entityData={ entityData }
					save={ save }
					setEditPersonVisible={setEditPersonVisible}
					setTempEntityData={ setTempEntityData }
					tempEntityData={ tempEntityData }
				/>
			</Modal>

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

			<Modal animationType='slide' visible={ editInsuranceVisible }>
				<EditInsurance
					insuranceData={ insuranceData }
					insuranceIndex={ insuranceIndex }
					save={ save }
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