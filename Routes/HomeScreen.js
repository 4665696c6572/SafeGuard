import { StyleSheet, Text, View} from 'react-native';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

const HomeScreen = ({ navigation }) =>
{
	const db = useSQLiteContext();

	const [errorMessage, setErrorMessage] = useState();
	const [location, setLocation] = useState();
	const [userData, setUserData] = useState( [ ] );

	////// Load Database \\\\\\
	useEffect( ( ) =>
	{
		if ( userData.length === 0 )
		{
			selectEntityData( db, setUserData );
		}
	}, [ db ] );



	////// Load Location \\\\\\
	useEffect(() => 
	{
		async function getLocation() 
		{
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') 
			{
				setErrorMsg('Permission to access location was denied');
				return;
			}

			let location_data = await Location.getCurrentPositionAsync({});
			console.log('location loaded')
			setLocation(location_data);
		}
		getLocation();
	}, []);


	return (
		<View>
			{errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
			<TableView style={{ marginTop : '12%' }}>
				<Section>
					{userData.map(( user ) => (
						<Cell
							key={ user.Entity_ID }
								cellContentView={
								<View  >
									<Text>Name: { user.Entity_Name } </Text>
									<Text>DOB: {user.DOB} </Text>
									{user?.Sex != null ? <Text>Sex: {user.Sex} </Text> : null}
									{user?.Height != null ? <Text>Height: {user.Height} </Text> : null}
									{user?.Weight != null ? <Text>Weight: {user.Weight} </Text> : null}
									{user?.Blood_Type != null ? <Text>Blood Type: {user.Blood_Type} </Text> : null}
								</View>
							}
						/>
					))}
				</Section>
				
			</TableView>
		</View>
	)
}

const selectEntityData = async ( db, setUserData ) =>
{
	try
	{
		const result = await db.getAllAsync(
		`
			SELECT * FROM Entity, Person WHERE Person_ID = 1 AND Entity_ID = 1;
		`);

		setUserData( result );
	}	
	catch ( error )
	{
		console.log( 'Error loading Entity data:', error );
	}
};

export default HomeScreen;