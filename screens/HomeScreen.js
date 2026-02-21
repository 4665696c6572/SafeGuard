import * as Location from 'expo-location';
import { useSQLiteContext } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Cell, Section, TableView } from 'react-native-tableview-simple';

import fetchWeatherData from '../common/home/fetchWeather.js';
import { fetchAlertZone, fetchAlertData, findHighestSeverity, scheduleAlertNotification } from '../common/home/alertFunctions.js';

import styles from '../styles/styles.js';


const HomeScreen = ({ navigation }) =>
{
	const db = useSQLiteContext();

	const [ alertData, setAlertData ] = useState( );
	const [ errorMessage, setErrorMessage ] = useState( );
	const [ loadingAlertData, setLoadingAlertData ] = useState( true );
	const [ locationData, setLocationData ] = useState( );
	const [ userData, setUserData ] = useState( [ ] );
	const [ weatherData, setWeatherData ] = useState( );


	////// Load Database \\\\\\
	useEffect( ( ) =>
	{
		if ( userData.length === 0 )
		{
			selectEntityData( db, setUserData );
		}
	}, [ db ] );


	////// Load Location \\\\\\
	useEffect( () =>
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

			console.log( 'location loaded.' )
			setLocationData( location_data );
		}
		getLocation();
	}, []);


		////// Load Alert \\\\\\
		useEffect( () =>
		{
			async function fetchAlert( locationData )
			{
				try
				{
					const alert_zone = await fetchAlertZone( locationData );
					const alert_data = await fetchAlertData( alert_zone );
					if ( alert_data )
					{
						setAlertData( findHighestSeverity( alert_data ));
					}
					else    return;
				}
				catch ( error )
				{
					console.error( error );
				}
				finally
				{
					setLoadingAlertData( false );
				}
			}
			fetchAlert( locationData );
		}, [ locationData ]);


	////// Load Weather \\\\\\
	useEffect( ( ) =>
	{
		if( locationData )
		{
			async function fetchWeather( locationData )
			{
				try
				{
					const weather_data = await fetchWeatherData( locationData );
					if(weather_data)
					{
						setWeatherData( weather_data );
					}
					else    return
				}
				catch ( error )
				{
					console.error( error );
				}
			}
			fetchWeather( locationData );
		}
	}, [ locationData ]);


	return (
		<SafeAreaProvider style={ styles.container }>
			{ errorMessage != null ? <Text>{ errorMessage }</Text> : null }
			<TableView style={{ marginTop : '12%' }}>
				{   loadingAlertData == false ?
		
					<TouchableOpacity
						onPress={() => { scheduleAlertNotification( alertData )}}
						style={styles.button_chrome_grey}
					>
						<Text style={styles.text_button}>Load Demo Alert</Text>
					</TouchableOpacity> 
					: null
				}

				<TouchableOpacity
					onPress={ ( ) =>  { navigation.navigate("EmergencyDataScreen"); }}
					style={styles.button_chrome_grey}
				>
					<Text style={styles.text_button}>Emergency Data</Text>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={ ( ) =>  { navigation.navigate("EmergencyDataFormScreen" ); }}
					style={ styles.button_chrome_grey }
				>
					<Text style={styles.text_button}>User Data</Text>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={ ( ) =>  { navigation.navigate("GameScreen", {score: 0 }); }}
					style={styles.button_chrome_grey}
				>
					<Text style={styles.text_button}>Game</Text>
				</TouchableOpacity>

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
			<StatusBar style="auto" />
		</SafeAreaProvider>
	)
}

const selectEntityData = async ( db, setUserData ) =>
{
	try
	{
		const result = await db.getAllAsync(
		`
			SELECT * FROM Entity, Person
			WHERE Person_ID = ? AND Entity_ID = ?;`,
			[ 1, 1 ]
		);

		setUserData( result );
		console.log( 'Entity Data Loaded.' );
	}
	catch ( error )
	{
		console.log( 'Error loading Entity data:', error );
	}
};

export default HomeScreen;