import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { Cell, Section, TableView } from 'react-native-tableview-simple';


// Weather related variables
const weather_URL = 'https://api.openweathermap.org/data/2.5/weather';
const API_Key = 'a7d2d44c1023b2f2fc9dec96f12b617d';
const units = 'imperial';


const HomeScreen = ({ navigation }) =>
{
	const db = useSQLiteContext();

	const [alertData, setAlertData] = useState();
	const [alertTitle, setAlertTitle] = useState();
	const [errorMessage, setErrorMessage] = useState();
	const [location, setLocation] = useState();
	const [userData, setUserData] = useState( [ ] );
	const [weatherData, setWeatherData] = useState();



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
		
		Uses latitude and longitude of user to load any current alerts.

		Alert levels include: Extreme, Severe, Moderate, Minor, and Unknown.
	*/
	const fetchAlertData = async () => 
	{
		// If phone in US, use location data
		// const lat = location.coords.latitude;
		// const lon = location.coords.longitude;

		// Hard coded for outside the US
		const lat = 28.078072; // Palm Harbor, Florida
		const lon = -82.763710;

		const url_zone = `https://api.weather.gov/points/${lat},${lon}`;
		const result_zone = await fetch(url_zone);

		// Zone ID 2 letter state, Z, 3 number zone  example: FLZ050
		// Note: only works when phone in US
		// const zone = (await result.json())?.properties.forecastZone.slice(-6);

		// const zone = 'FLZ050';  // Pinellas County Florida

		// Statewide alerts for demo (in case zone has no current alerts)
		const url_alert =`https://api.weather.gov/alerts/active/area/FL`; // State

		// Load zone alerts
		// const url_alert = `https://api.weather.gov/alerts/active?zone=${zone}`; 	
		const result_alert = await fetch(url_alert);
		const alert_data = await result_alert.json();

		const severity = {'Extreme' : 0, 'Severe' : 1,'Moderate': 2,'Minor' : 3, 'Unknown' : 4};
		let priority_alert_number = 0;
		let max_severity = 5;

		// Locates first highest severity alert 
		for (var i = 0; i < alert_data.features.length ; i++)
		{
			if (Number(severity[alert_data.features[i].properties.severity]) < Number(max_severity))
			{	
				max_severity = severity[alert_data.features[i].properties.severity];
				priority_alert_number = i;
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


	// Loads current weather data
	const fetchWeatherData = async () => 
	{
		if (!location)
		{
			console.log('location failed');
			return;
		}

		// const lat = location.coords.latitude;
		// const lon = location.coords.longitude;

		// Hard coded for outside the US (although this feature does work worldwide)
		lat = 28.078072; // Palm Harbor, Florida
		lon = -82.763710;
		
		const url = `${weather_URL}?lat=${lat}&lon=${lon}&appid=${API_Key}&units=${units}`;
		const result = await fetch(url);
		const weather_data = await result.json();
		setWeatherData(weather_data);
	};


	////// Load Alert Data \\\\\\
	useEffect(() => 
	{
		if(location)
		{
			fetchWeatherData();
			fetchAlertData();
		}
	}, [location]);


	return (
		<View>
			{errorMessage != null ? <Text>{errorMessage}</Text> : null }
			<TableView style={{ marginTop : '12%' }}>
				{   alertData != null ? 
					<TouchableOpacity 
						onPress={scheduleAlertNotification}
						style={styles.button_chrome_grey}
					>
						<Text style={styles.text_button}>Load Demo Alert</Text>
					</TouchableOpacity>  
					: null
				}
				<TouchableOpacity
					onPress={ ( ) =>  {navigation.navigate("EmergencyDataScreen"); } }
					style={styles.button_chrome_grey}
				>
					<Text style={styles.text_button}>Emergency Data</Text>
				</TouchableOpacity>
				<Section>
					{ 
						Array.isArray(userData) &&
						userData.map(( user ) => (
						<Cell
							key={ user.Entity_ID }
								cellContentView={
								<View>
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
			{ weatherData && 
			
				<View>  
					{ weatherData?.weather[0].main != null ? <Text>Weather condition: {weatherData.weather[0].description.slice(0,1).toUpperCase() + weatherData.weather[0].description.slice(1)}.</Text> : null }
					{ weatherData?.main.humidity != null ? <Text>Humidity: {weatherData.main.humidity}%</Text> : null }
					{ weatherData?.main.temp_max != null ? <Text>High temperature: {Math.round(weatherData.main.temp_max)}°</Text> : null }
					{ weatherData?.main.temp_min != null ? <Text>Low temperature: {Math.round(weatherData.main.temp_min)}°</Text> : null }
					{ weatherData?.main.temp != null ? <Text>Current temperature: {Math.round(weatherData.main.temp)}°</Text> : null }
				</View>
			}
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
			SELECT * FROM Entity, Person 
			WHERE Person_ID = ? AND Entity_ID = ?;`, 
			[1,1]
		);

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
		color: 'black',
		fontSize: 20,
		textAlign: 'center'
	},
	button_chrome_grey:
	{
		backgroundColor: '#DBE2E9',
		marginTop: 10,
		marginBottom: 10
	},
});

export default HomeScreen;