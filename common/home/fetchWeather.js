// Weather
const weather_URL = 'https://api.openweathermap.org/data/2.5/weather';
const API_Key = 'a7d2d44c1023b2f2fc9dec96f12b617d';
const units = 'imperial';

export default async function fetchWeatherData( location )
{
	if (!location)
	{
		console.log('location failed');
		return;
	}

	const lat = location.coords.latitude;
	const lon = location.coords.longitude;
	const url = `${weather_URL}?lat=${lat}&lon=${lon}&appid=${API_Key}&units=${units}`;
	const result = await fetch(url);
	const weather_data = await result.json();

	return weather_data;
};																		