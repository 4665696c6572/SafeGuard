import * as Location from 'expo-location';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Image, ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import
{
	fetchAlertZone, fetchAlertData,
	findHighestSeverity, scheduleAlertNotification
}	from '../common/home/alertFunctions.js';
import fetchWeatherData from '../common/home/fetchWeather.js';
import { Weather } from './components/weather.js';

import styles from '../styles/styles.js';

const books = require( '../assets/books.png' );
const chart = require( '../assets/chart.png' );
const emergency = require( '../assets/emergency.png' );
const frog_game = require( '../assets/frog_game.png' );
const flood = require( '../assets/flood.png' );

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

			let location_data = await Location.getCurrentPositionAsync({ });

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
				if ( alert_zone != null )
				{
					const alert_data = await fetchAlertData( alert_zone );
					if ( alert_data )
					{
						setAlertData( findHighestSeverity( alert_data ));
					}
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
	 *	Loads weather on app open, also reloads every
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
		:
			<View style={ styles.home_header_container }>
				<Text style={ styles.home_header_text }>SafeGuard</Text>
				<Image source={ flood } style={ styles.home_header_image }/>
			</View>
		}


			<View style={ styles.home_container }>
				<View style={ styles.home_row }>
					<TouchableOpacity
						onPress={ ( ) => { navigation.navigate( "EmergencyDataScreen" ); }}
						style={[ styles.home_button, { overflow: 'hidden' } ]}
					>
						<ImageBackground
							imageStyle={ styles.home_button_image }
							source={ emergency }
							style={ styles.home_button_image_2 }
						>
							<View style={{ alignItems: 'center',  gap: 100,  flex: 1}}>
							<Text
								style={[ 
									styles.home_button_text, { marginTop: -3, width: '100%' } ]}>Emergency
							</Text>
							<Text
								style={[ 
									styles.home_button_text, { marginTop: 3, width: '100%' } ]} >Information
							</Text>
							</View>
						</ImageBackground>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={ ( ) => { navigation.navigate( "TabNavigator", { screen: 'PersonScreen'} )}}
						style={ styles.home_button }
					>
						<ImageBackground
							imageStyle={ styles.home_button_image }
							source={ chart }
							style={ styles.home_button_image_2 }
						>
							<View style={{ alignItems: 'flex-end', justifyContent: 'flex-end', flex: 1}}>
							<Text style={[ styles.home_button_text, { marginBottom: 7, width: '100%' } ]}>
								Data Hub
							</Text>
							</View>
						</ImageBackground>
					</TouchableOpacity>
				</View>

				<View style={ styles.home_row }>
					<TouchableOpacity
						onPress={ ( ) =>
						{
							navigation.navigate( "ResourceTabNavigator", { screen: "WaterScreen" } )}
						}
						style={ styles.home_button }
					>
						<ImageBackground
							imageStyle={ styles.home_button_image }
							source={ books }
							style={ styles.home_button_image_2 }
						>
							<View style={{ alignItems: 'flex-end', justifyContent: 'flex-end', flex: 1}}>
							<Text style={[ styles.home_button_text, { marginBottom: 7, width: '100%' } ]}>
								Resources
							</Text>
							</View>
						</ImageBackground>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={ ( ) => { navigation.navigate( "GameScreen", { score: 0 })}}
						style={ styles.home_button }
					>
						<ImageBackground
							imageStyle={ styles.home_button_image }
							source={ frog_game }
							style={ styles.home_button_image_2 }
						>
							<View style={{ alignItems: 'center',  flex: 1}}>
							<Text style={[ styles.home_button_text, { marginTop: 5, width: '100%' } ]}>
								Games
							</Text>
							</View>
						</ImageBackground>
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


/*
 *	Image - Books
 *	Title: Books
 *	Author: PandannaImagen
 *	Availability: https://pixabay.com/vectors/books-stack-of-books-reading-study-7448036/
 *
 *
 *	Image - Chart
 *	Title: Prognosis Icon
 *	Author: mcmurryjulie
 *	Availability: https://pixabay.com/vectors/prognosis-icon-patient-chart-2803190/
 *
 *
 *	Image - Emergency
 *	Title: Medic
 *	Author: WaldhoerSolutions
 *	Availability: https://pixabay.com/illustrations/medic-help-first-aid-rescue-1553191/
 *
 *
 *	Image - Frog_Game
 *	Title: Organic Flat Frog Illustration
 *	Author: Freepik
 *	Availability: https://www.freepik.com/free-vector/organic-flat-frog-illustration_13861891.htm
 */