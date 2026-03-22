import * as Notifications from 'expo-notifications';

/*
 *	Takes latitude and Longitude from location data
 *	and requests the zone from the api.
 *	If user is outside of covered area ( US )
 *	no zone is returned.
 */
// Zone ID 2 letter state, the letter Z, 3 number zone example: FLZ050 Florida Zone 050
export async function fetchAlertZone( location )
{
	// ______________________________________________________________________
	// Latitude & Longitude
	// ______________________________________________________________________

	// ____ US ____
	// const lat = location?.coords?.latitude; // Use while located in the US
	// const lon = location?.coords?.longitude;

	// ____ Non-US ____
	const lat = 28.078072; // for demonstration: Palm Harbor, Florida
	const lon = -82.763710;

	try
	{
		const url_zone = `https://api.weather.gov/points/${ lat },${ lon }`;
		const result_zone = await fetch( url_zone );
		const zone = ( await result_zone.json( ))?.properties?.forecastZone.slice( -6 );
		return zone;
	}
	catch ( error )
	{
		return null;
	}
}


/*
 *	Takes zone data and fetches alert data
 *	and parses it to JSON.
 */
export async function fetchAlertData( zone )
{
	try
	{
		// const url_alert = `https://api.weather.gov/alerts/active?zone=${ zone }`;

		// By State is only for demonstration.
		// This is set up because zones frequently have no active alerts.
		const url_alert =`https://api.weather.gov/alerts/active/area/FL`; // State /area/FL

		const result_alert = await fetch( url_alert );
		if ( result_alert.ok )
		{
			const alert_data = await result_alert.json( );
			return alert_data;
		}
		else    return null;
	}
	catch ( error )
	{
		return null;
	}
}


/*
 *	Takes alert data and locates the first
 *	( should there be more than one )
 *	highest priority alert.
 */
export function findHighestSeverity( alert_data )
{
	if ( alert_data?.features?.length == 0 )    return null;

	const severity = { 'Extreme' : 0, 'Severe' : 1, 'Moderate': 2, 'Minor' : 3, 'Unknown' : 4 };
	let priority_alert_number = 0;
	let max_severity = 5;

	for ( var i = 0; i < alert_data?.features?.length ; i++ )
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


// Schedules a notification
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
	console.log( 'Alert loaded.' )
}