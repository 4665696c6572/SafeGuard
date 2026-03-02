import { Image, Text, View } from 'react-native';

import styles from "../../styles/styles.js";

const icon = "http://openweathermap.org/img/w/";
const img_high = require( '../../assets/temp_high.png' );
const img_hum = require( '../../assets/humidity.png' );
const img_low = require( '../../assets/temp_low.png' );
const img_now = require( '../../assets/temp_now.png' );


export const Weather = ({ weatherData }) =>
{
	return (
		<View style={{ paddingTop: 20 }}>
		{
			weatherData &&
			<View style={{ alignItems: 'center'}}>
				<View style={{ flexDirection:'row', justifyContent: 'space-between' }}>
					
					{
						weatherData?.list?.[0].main.temp_min ?
						<View style={{ alignItems: 'center', flex: 1/4 }}>
							<Image source={ img_low } style={{ height: 75, width: 75 }}/>
							<Text style={ styles.heading_text }>{ Math.round( weatherData.list[0].main.temp_min )}°</Text>
						</View>
					: null
					}

					{
						weatherData?.list[0].main.temp != null ?
						<View style={{ alignItems: 'center', flex: 1/4 }}>
							<Image source={ img_now } style={{ height: 75, width: 75 }}/>
							<Text style={ styles.heading_text }>{ Math.round( weatherData.list[0].main.temp )}°</Text>
						</View>
					: null
					}

					{
						weatherData?.list[0].main.temp_max ?
						<View style={{ alignItems: 'center', flex: 1/4 }}>
							<Image source={ img_high } style={{ height: 75, width: 75 }}/>
							<Text style={ styles.heading_text }>{ Math.round( weatherData.list[0].main.temp_max )}°</Text>
						</View>
					: null
					}
					

					{
						weatherData?.list[0].main.humidity != null ?
						<View style={{ alignItems: 'center', flex: 1/4, justifyContent: 'space-between' }}>
							<Image source={ img_hum } style={{ height: 50, marginTop: 10, width: 50 }}/>
						<Text style={ styles.heading_text }>{ weatherData.list[0].main.humidity }%</Text>
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
							<Image source={{ uri: icon + weatherData.list[i].weather[0].icon + ".png" }} style={ styles.weather_image }/>

							<Text style={ styles.text }>
								{ weatherData.list[i].weather[0].description.slice( 0, 1 ).toUpperCase( ) + weatherData.list[i].weather[0].description.slice( 1 )}
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