import * as Notifications from "expo-notifications";
import { createContext, useContext, useState, useEffect } from "react";
import { registerForPushNotificationsAsync } from "../registerForPushNotifications.js";

const NotificationContext = createContext( undefined );

/*
 *	This code is not written by me ( I did change it to js ).
 *	Title: NotificationContext from expo-notifications-app
 *	Author: Betomodeano
 *	Date published: Aug 26, 2024
 *	Code version: unknown
 *	Availability: https://github.com/betomoedano/expo-notifications-app
 */
export const useNotification = ( ) =>
{
	const context = useContext( NotificationContext );

	if ( context === undefined )
	{
		throw new Error(
			"useNotification must be used within a NotificationProvider"
		);
	}

	return context;
};



export const NotificationProvider = ({ children }) =>
{
	const [ devicePushToken, setDevicePushToken ] = useState( null );
	const [ error, setError ] = useState( null );
	const [ expoPushToken, setExpoPushToken ] = useState( null );
	const [ notification, setNotification ] = useState( null );

	useEffect( ( ) =>
	{
		registerForPushNotificationsAsync( ).then(
			( token ) => setExpoPushToken( token ),
			( error ) => setError( error )
			);

			Notifications.getDevicePushTokenAsync( ).then(
				( devicePushToken ) =>
				{
					setDevicePushToken( devicePushToken.data );
				},
			( error ) =>
			{
				setError( error );
			}
		);

		const notificationListener = Notifications.addNotificationReceivedListener(
			( notification ) =>
			{
				setNotification( notification );
			}
		);

		const responseListener =
		Notifications.addNotificationResponseReceivedListener( ( response ) =>
		{
			console.log( "Notification Response: ", response );
		});

		return () =>
		{
			notificationListener.remove( );
			responseListener.remove( );
		};
	}, [ ]);

	return (
		<NotificationContext.Provider
			value={{ devicePushToken, error, expoPushToken, notification }}
		>
			{ children }
		</NotificationContext.Provider>
	);
};