import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';

import { useEffect } from 'react';

import initializeDatabase from './database/initializeDatabase.js';

import { notificationHandlerSetup, requestNotificationPermission, setNotificationChannel } from './services/notificationSetup.js'


import HomeScreen from './screens/HomeScreen.js';
import EmergencyDataScreen from './screens/EmergencyDataScreen.js';
import MatchingScreen from './screens/MatchingScreen.js';
import MultipleChoiceScreen from './screens/MultipleChoiceScreen.js';



const Stack = createNativeStackNavigator();



notificationHandlerSetup();



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
				<Stack.Navigator screenOptions={{ headerShown: false }}>
					<Stack.Screen name="Home" component={HomeScreen}/>
					<Stack.Screen name="EmergencyDataScreen" component={EmergencyDataScreen}/>
					<Stack.Screen name="MatchingScreen" component={MatchingScreen}/>
					<Stack.Screen name="MultipleChoiceScreen" component={MultipleChoiceScreen}/>
				</Stack.Navigator>
			</NavigationContainer>
		</SQLiteProvider>
	);
}