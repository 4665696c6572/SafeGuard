
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import updateEmergencyData from '../../common/userData/database/updateEmergencyData.js';
import useLoadEmergencyData from '../../common/userData/hook/useLoadEmergencyData';
import insertEmergencyData from '../../common/userData/database/insertEmergencyData.js';


import styles from '../../styles/styles.js';

import { Person, EditPerson } from '../userDataScreens/components/person';


const PersonScreen = ({ navigation, route }) =>
{
	
	const db = useSQLiteContext();
	const params = route?.params;

	const [ entityData, setEntityData, loadingData, loadData ] = useLoadEmergencyData( db, 'Person', 'Select' );
	const [ editPersonVisible, setEditPersonVisible ] = useState( false );
	const [ tempEntityData, setTempEntityData ] = useState( );
	const [ isFormValid, setIsFormValid ] = useState( false );
	const isFocused = useIsFocused();
	
	useEffect(() => 
		{
			if ( isFocused ) 
			{
				loadData( );
			}
	}, [ isFocused ]);

	
	function saveToDB( )
	{
	
		if ( entityData[0]?.entity_id )
		{									
			updateEmergencyData( 'Person', entityData, db, entityData[0].entity_id );
		}
		else
		{   
			insertEmergencyData( 'Person', entityData, db );
		}
	}




	if ( loadingData )    return <ActivityIndicator/>;


	return (
		<View style={ styles.container }>
			<Person 
				entityData={ entityData }
				screen={ 'EntityScreen' }
				setEditPersonVisible={ setEditPersonVisible }
				setTempEntityData={ setTempEntityData }			
			/>

			<Modal animationType='fade' color='#d1dce4ff' visible={ editPersonVisible }>
				<EditPerson				
					entityData={ entityData }
					isFormValid={ isFormValid }
					setIsFormValid={ setIsFormValid }			
					saveToDB={ saveToDB }					
					setEditPersonVisible={setEditPersonVisible}	
					setEntityData={ setEntityData }
					setTempEntityData={ setTempEntityData }
					tempEntityData={ tempEntityData }
				/>
			</Modal>
		</View>
	);
}

export default PersonScreen;