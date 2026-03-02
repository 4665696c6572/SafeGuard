import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';


export function notificationHandlerSetup( )
{
	Notifications.setNotificationHandler (
	{
		handleNotification: async ( ) =>
		({
			shouldShowBanner: true,
			shouldShowList: true,
			shouldPlaySound: false,
			shouldSetBadge: false,
		}),
	});
}

export async function requestNotificationPermission( )
{
	const { status } = await Notifications.requestPermissionsAsync( );

	if ( status !== 'granted' )
	{
		console.log( 'Permission not granted' );
		return;
	}
};


export async function setNotificationChannel( )
{
	if ( Platform.OS === 'android' )
	{
		await Notifications.setNotificationChannelAsync( "default",
		{
			name: "default",
			importance: Notifications.AndroidImportance.MAX,
		});
    }
}