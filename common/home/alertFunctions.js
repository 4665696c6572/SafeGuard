import * as Notifications from 'expo-notifications';

// Zone ID 2 letter state, the letter Z, 3 number zone example: FLZ050 Florida Zone 050
export async function fetchAlertZone( location )
{
	// ______________________________________________________________________
	// Latitude & Longitude
	// ______________________________________________________________________

	// ____ US ____
	// const lat = location.coords.latitude; // ~~~~~~ in US ~~~~~~
	// const lon = location.coords.longitude; // ~~~~~~ in US ~~~~~~

	// ____ Non-US ____

	const lat = 28.078072; // Palm Harbor, Florida
	const lon = -82.763710;

	const url_zone = `https://api.weather.gov/points/${ lat },${ lon }`;
	const result_zone = await fetch( url_zone );
	const zone = ( await result_zone.json( ))?.properties.forecastZone.slice( -6 );
	return zone;
}


export async function fetchAlertData( zone )
{
	// const url_alert = `https://api.weather.gov/alerts/active?zone=${ zone }`;

	// By State is only for demonstration ( zone may not have any active alerts )
	const url_alert =`https://api.weather.gov/alerts/active/area/FL`; // State /area/FL

	const result_alert = await fetch( url_alert );

	if ( !result_alert )
	{
		return false;
	}

	const alert_data = await result_alert.json( );

	return alert_data;
}




export function findHighestSeverity( alert_data )
{
	const severity = {'Extreme' : 0, 'Severe' : 1,'Moderate': 2,'Minor' : 3, 'Unknown' : 4};
	let priority_alert_number = 0;
	let max_severity = 5;

	for ( var i = 0; i < alert_data.features.length ; i++ )
	{
		if ( Number( severity[ alert_data.features[i].properties.severity ]) < Number( max_severity ))
		{
			max_severity = severity[ alert_data.features[i].properties.severity ];
			priority_alert_number = i;
		}
	}

	const alert_title = alert_data.features[ priority_alert_number ].properties.severity;
	const alert_body = alert_data.features[ priority_alert_number ].properties.description;

	return [ alert_title, alert_body ];
}


export async function scheduleAlertNotification( alertData )
{
	await Notifications.scheduleNotificationAsync (
	{
		content:
		{
			title: alertData[0],
			body: alertData[1]
		},
		trigger: { seconds: 2, channelId: 'default' },
	});
	console.log('Alert loaded.' )
}