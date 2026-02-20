import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import updateEmergencyData from '../../common/userData/database/updateEmergencyData.js';
import useLoadEmergencyData from '../../common/userData/hook/useLoadEmergencyData';
import insertEmergencyData from '../../common/userData/database/insertEmergencyData.js';

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


	const [ isFormValid, setIsFormValid ] = useState( false );
	const isFocused = useIsFocused();

	useEffect( ( ) =>
	{
		if ( isFocused )
		{
			loadEntityData( );
			loadInsuranceData( );
		}
	}, [ isFocused ]);


	async function saveToDB( table, data, loadData, shouldNavigate )
	{
		let id
		if (table == 'Person')
		{
			if ( data.entity_id )
			{								
				await updateEmergencyData( table, data, db, data.entity_id );
			}
			else
			{
				await insertEmergencyData( table, data, db );
			}
		}
		else if (table == 'Insurance')
		{
			if ( data?.insurance_id )
			{
				await updateEmergencyData( table, data, db, data.insurance_id );
			}
			else
			{
				id = await insertEmergencyData( table, data, db );
			}

			if ( shouldNavigate )    handleNavigation( id, data.entity_name );
		}
	loadData( );
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

			<Modal animationType='slide' color='#d1dce4ff' visible={ editPersonVisible }>
				<EditPerson
					entityData={ entityData }
					isFormValid={ isFormValid }
					loadEntityData={ loadEntityData }
					saveToDB={ saveToDB }
					setEditPersonVisible={setEditPersonVisible}
					setIsFormValid={ setIsFormValid }
					setTempEntityData={ setTempEntityData }
					tempEntityData={ tempEntityData }
				/>
			</Modal>

			{/* ****************************************************** */}
			<Modal animationType='slide' color='#d1dce4ff' visible={ viewInsuranceVisible }>
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

			<Modal animationType='slide' color='#d1dce4ff' visible={ editInsuranceVisible }>
				<EditInsurance
					insuranceData={ insuranceData }
					insuranceIndex={ insuranceIndex }
					isFormValid={ isFormValid }
					loadInsuranceData={ loadInsuranceData }
					saveToDB={ saveToDB }
					setEditInsuranceVisible={ setEditInsuranceVisible }
					setInsuranceIndex={ setInsuranceIndex }
					setIsFormValid={ setIsFormValid }
					setTempInsuranceData={ setTempInsuranceData }
					setViewInsuranceVisible={ setViewInsuranceVisible }
					tempInsuranceData={ tempInsuranceData }
				/>
			
			</Modal>
		</View>
	);
}

export default PersonScreen;