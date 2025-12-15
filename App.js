import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import initializeDatabase from './Database/initializeDatabase.js';

import HomeScreen from './Routes/HomeScreen.js';
import EmergencyDataScreen from './Routes/EmergencyDataScreen.js';


const Stack = createNativeStackNavigator();


////// Setup Notifications \\\\\\
Notifications.setNotificationHandler (
{
	handleNotification: async () =>
	({
		shouldShowBanner: true,
		shouldPlaySound: false,
		shouldSetBadge: false,
	}),
});


const requestNotificationPermission = async () =>
{
	const { status } = await Notifications.requestPermissionsAsync();

	if (status !== 'granted') 
	{
		console.log('Permission not granted');
		return;
	}
};


const setNotificationChannel = async () =>
{
	if (Platform.OS === 'android')
	{
		await Notifications.setNotificationChannelAsync('hazard_alert',
		{
			name: 'Hazard Alert',
			importance: Notifications.AndroidImportance.HIGH
		});
	}
}




export default function App()
{
	useEffect( () => 
	{
		requestNotificationPermission();
		setNotificationChannel();
	}, []);

	return (
		<SQLiteProvider databaseName='Safe.db' onInit={ initializeDatabase }>
			<NavigationContainer>
				<Stack.Navigator>
					<Stack.Screen name="Home" component={HomeScreen}/>
					<Stack.Screen name="EmergencyDataScreen" component={EmergencyDataScreen}/>
				</Stack.Navigator>
			</NavigationContainer>
		</SQLiteProvider>
	);
}