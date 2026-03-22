import { Image, Text, View } from 'react-native';

import styles from "../../styles/styles.js";

const icon = "http://openweathermap.org/img/w/";
const img_high = require( '../../assets/temp_high.png' );
const img_hmd = require( '../../assets/humidity.png' );
const img_low = require( '../../assets/temp_low.png' );
const img_now = require( '../../assets/temp_now.png' );

/*
 *	Displays Weather forecast Information.
 *	Displays: temp ( low/current/high ), humidity,
 *	todays' forecast & tomorrow's forecast.
 */
export const Weather = ({ weatherData }) =>
{
	return (
		<View style={{ paddingTop: 20 }}>
		{
			weatherData &&
			<View>
				<View style={ styles.weather_temp_row }>

					{
						weatherData?.list?.[0].main.temp_min ?
						<View style={ styles.weather_temp_column }>
							<Image source={ img_low } style={ styles.weather_temp_image }/>
							<Text style={ styles.heading_text }>
								{ Math.round( weatherData.list[0].main.temp_min * 10) / 10}°
							</Text>
							<Text style={ styles.heading_text }>Low</Text>
						</View>
					: null
					}

					{
						weatherData?.list[0].main.temp != null ?
						<View style={ styles.weather_temp_column }>
							<Image source={ img_now } style={ styles.weather_temp_image }/>
							<Text style={ styles.heading_text }>
								{ Math.round( weatherData.list[0].main.temp * 10) / 10}°
							</Text>
							<Text style={ styles.heading_text }>Current</Text>
						</View>
					: null
					}

					{
						weatherData?.list[0].main.temp_max ?
						<View style={ styles.weather_temp_column }>
							<Image source={ img_high } style={ styles.weather_temp_image }/>
							<Text style={ styles.heading_text }>
								{ Math.round( weatherData.list[0].main.temp_max * 10) / 10}°
							</Text>
							<Text style={ styles.heading_text }>High</Text>
						</View>
					: null
					}


					{
						weatherData?.list[0].main.humidity != null ?
						<View style={ styles.weather_temp_column }>
							<Image source={ img_hmd } style={ styles.weather_temp_image }/>
							<Text style={ styles.heading_text }>
								{ weatherData.list[0].main.humidity }%
							</Text>
							<Text style={ styles.heading_text }>Humidity</Text>
						</View>
					: null
					}
				</View>


				<View style={ styles.home_row }>
				{
					[ 0, 8 ].map( i =>
					weatherData.list[i].weather[0].description != null ?
					<View key={ i }>
						<View style={ styles.weather_forecast }>
							<Image
								source={{ uri: icon + weatherData.list[i].weather[0].icon + ".png" }}
								style={ styles.weather_image }
							/>

							<Text style={ styles.text }>
							{
								weatherData.list[i].weather[0].description.slice(0,1 ).toUpperCase( ) +
								weatherData.list[i].weather[0].description.slice( 1 )
							}
							</Text>
							<Text style={ styles.text }>{ i == 0 ? "Today" : "Tomorrow"}</Text>
						</View>
					</View>
				: null
				)}
				</View>
			</View>
		}
		</View>
	);
};


/*
 *	Image - Humidity
 *	Title: Humidity free icon
 *	Author: freepik
 *	Availability: https://www.flaticon.com/free-icon/humidity_8923690
 *
 *
 *	Image - High Temp
 *	Title: High Temperature free icon
 *	Author: smashingstocks
 *	Availability: https://www.flaticon.com/free-icon/high-temperature_6218295
 *
 *
 *	Image - Low Temp
 *	Title: Temperature free icon
 *	Author: nawicon
 *	Availability: https://www.flaticon.com/free-icon/temperature_2322701
 *
 *
 *	Image - Temp
 *	Title: temp mix
 *	Author: nawicon / smashingstocks
 *	Availability: https://www.flaticon.com/free-icon/temperature_2322701 & https://www.flaticon.com/free-icon/high-temperature_6218295
 */