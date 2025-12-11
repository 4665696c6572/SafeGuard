import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { Cell, Section, TableView } from 'react-native-tableview-simple';



const HomeScreen = ({ navigation }) =>
{
	const db = useSQLiteContext();

	const [alertTitle, setAlertTitle] = useState();
	const [alertData, setAlertData] = useState();
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



	/*
		Loads alert data from US based government agency:
		National Oceanic and Atmospheric Administration
		
		Uses latitude and longitude of user to load
		any current alerts.

		Alert types include:

		Alert levels include: 
	*/
	const fetchAlertData = async () => 
	{
		// If phone in US, use location data
		// const lat =  location.coords.latitude;
		// const lon = location.coords.longitude;
		const lat =  28.078072; // Palm Harbor, Florida
		const lon = -82.763710;

		const url_zone = `https://api.weather.gov/points/${lat},${lon}`;
		const result_zone = await fetch(url_zone);

		// Zone ID 2 letter state, Z, 3 number zone  example: FLZ050
		// Note: only works when phone in US
		// const zone = (await result.json())?.properties.forecastZone.slice(-6);

		// const zone = 'FLZ050';  // Pinellas County Florida
		const zone = 'FLZ124';


		// const url_alert =`https://api.weather.gov/alerts/active/area/FL`;  // State
		const url_alert = `https://api.weather.gov/alerts/active?zone=${zone}`; 	
		const result_alert = await fetch(url_alert);
		const alert_data = await result_alert.json();

		const severity =  {'Extreme' : 0, 'Severe' : 1,'Moderate': 2,'Minor' : 3, 'Unknown' : 4};
		let priority_alert_number = 0;
		let max_severity = 5;

		for (var i = 0; i < alert_data.features.length ; i++)
		{
			if (Number(severity[alert_data.features[i].properties.severity]) < Number(max_severity))
			{	
				// console.log('i ' + i )
				// console.log('max_severity before ' + max_severity )
				// console.log('priority_alert_number before ' + priority_alert_number )
				// console.log(alert_data.features[i].properties.severity)

				max_severity = severity[alert_data.features[i].properties.severity];
				priority_alert_number = i;

				// console.log('max_severity after ' + max_severity )
				// console.log('priority_alert_number after ' + priority_alert_number )
			}	
		}

		if (alert_data.features.length != 0 || priority_alert_number != null)
		{
			setAlertTitle("Alert severity level: " + alert_data.features[priority_alert_number].properties.severity);
			setAlertData(alert_data.features[priority_alert_number].properties.description);
		}
	};


	////// Alert Setup \\\\\\
	const scheduleAlertNotification = async () => 
	{
		if(!alertTitle || !alertData)
		{
			console.log('No alert data')
			return;
		}
		
		await Notifications.scheduleNotificationAsync (
		{
			content: 
			{
				title: alertTitle,
				body: alertData,
				channelId: 'hazard_alert'
			},
			trigger: { seconds: 2 },
		});
	}




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


	//////  Load Alert Data \\\\\\
	useEffect(() => 
	{
		if(location)
		{
			fetchAlertData();
		}
	}, [location]);


	return (
		<View>
			{errorMessage && <Text>{errorMessage}</Text>}
			<TableView style={{ marginTop : '12%' }}>
				{   alertData && 
					<TouchableOpacity 
						onPress={scheduleAlertNotification}
						style={[styles.button, styles.button_chrome_grey]}
					>
						<Text>Load Alert</Text>
					</TouchableOpacity> 
				}
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



////// Load User's data from Database \\\\\\
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


const styles = StyleSheet.create(
{
	text_button:
	{
		color: 'white',
		fontSize: 30,
		textAlign: 'center'
	},
	button_chrome_grey:
	{
		backgroundColor: '#DBE2E9'
	},
});

export default HomeScreen;