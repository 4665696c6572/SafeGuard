import * as Location from 'expo-location';
import * as NavigationBar from 'expo-navigation-bar';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';


import
{
	fetchAlertZone, fetchAlertData,
	findHighestSeverity, scheduleAlertNotification
}	from '../common/home/alertFunctions.js';
import fetchWeatherData from '../common/home/fetchWeather.js';
import { Weather } from './components/weather.js';

import styles from '../styles/styles.js';


const HomeScreen = ({ navigation }) =>
{
	const db = useSQLiteContext( );

	const [ alertData, setAlertData ] = useState( );
	const [ errorMessage, setErrorMessage ] = useState( );
	const [ loadingAlertData, setLoadingAlertData ] = useState( true );
	const [ locationData, setLocationData ] = useState( );
	const [ weatherData, setWeatherData ] = useState( );
	const [ weatherLoaded, setWeatherLoaded ] = useState( null );

	const isFocused = useIsFocused( );


	// Load location data
	useEffect( ( ) =>
	{
		async function getLocation( )
		{
			let { status } = await Location.requestForegroundPermissionsAsync( );
			if ( status !== 'granted' )
			{
				setErrorMsg( 'Permission to access location was denied' );
				return;
			}

			let location_data = await Location.getCurrentPositionAsync({});

			console.log( 'location loaded.' );
			setLocationData( location_data );
		}
		getLocation( );
	}, [ ]);


	// Loads alert data
	useEffect( ( ) =>
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
				setErrorMessage( error );
			}
			finally
			{
				setLoadingAlertData( false );
			}
		}
		fetchAlert( locationData );
	}, [ locationData ]);


	/*
	 * Loads weather on app open, also reloads every
	 *	30 minutes so long as the screen is focused.
	 */
	useEffect(( ) =>
	{
		if
		(
			isFocused && locationData &&
			( weatherLoaded == null || Date.now() - weatherLoaded > 1800000 )
		)
		{
			async function fetchWeather( locationData )
			{
				try
				{
					const weather_data = await fetchWeatherData( locationData );
					if( weather_data )
					{
						setWeatherData( weather_data );
						setWeatherLoaded( Date.now( ) );
					}
					else    return;
				}
				catch ( error )
				{
					setErrorMessage( error );
				}
			}
			fetchWeather( locationData );
			scheduleAlertNotification( alertData );
		}
	}, [ isFocused, locationData ]);


	return (
		<View style={[ styles.container, { justifyContent: 'space-between' } ]}>
		{ errorMessage != null ? <Text>{ errorMessage }</Text> : null }


		{
			weatherData ?
			<View style={ styles.home_container_weather }>
			<Weather
				weatherData={ weatherData }
			/>
			</View>
		: null
		}


			<View style={[ styles.home_container, weatherData ? null : styles.home_extra_margin ]}>
				<View style={ styles.home_row }>
					<TouchableOpacity
						onPress={ ( ) => { navigation.navigate( "EmergencyDataScreen" ); }}
						style={ styles.home_button }
					>
						<Text style={ styles.text_button }>Emergency Information</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={ ( ) => { navigation.navigate( "PersonScreen" )}}
						style={ styles.home_button }
					>
						<Text style={ styles.text_button }>User data</Text>
					</TouchableOpacity>
				</View>

				<View style={ styles.home_row }>
					<TouchableOpacity
						onPress={ ( ) => { navigation.navigate( "ResourceHubScreen" )}}
						style={ styles.home_button }
					>
						<Text style={ styles.text_button }>Resource Hub</Text>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={ ( ) => { navigation.navigate( "GameScreen", { score: 0 })}}
						style={ styles.home_button }
					>
						<Text style={ styles.text_button }>Game</Text>
					</TouchableOpacity>
				</View>
			</View>


			<View style={ styles.contact_button }>
			{
				loadingAlertData == false ?
				<TouchableOpacity onPress={( ) => { scheduleAlertNotification( alertData )}}>
					<Text style={ styles.save_button_text }>Load Alert</Text>
				</TouchableOpacity>
			: null
			}
			</View>
		</View>
	)
}

export default HomeScreen;