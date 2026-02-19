import { SQLiteProvider } from 'expo-sqlite';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import initializeDatabase from './database/initializeDatabase.js';

import { notificationHandlerSetup, requestNotificationPermission, setNotificationChannel } from './common/home/notificationSetup.js';

import HomeScreen from './screens/HomeScreen.js';

import EmergencyDataScreen from './screens/userDataScreens/EmergencyDataScreen.js';

import AllergyScreen from './screens/userDataScreens/AllergyScreen.js';
import DoctorScreen from './screens/userDataScreens/DoctorScreen.js';
import InsuranceScreen from './screens/userDataScreens/InsuranceScreen.js';
import MedicalConditionScreen from './screens/userDataScreens/MedicalConditionScreen.js';
import MedicationScreen from './screens/userDataScreens/MedicationScreen.js';
import PersonScreen from './screens/userDataScreens/PersonScreen.js';

import GameScreen from './screens/gameScreens/GameScreen.js';
import MatchingScreen from './screens/gameScreens/MatchingScreen.js';
import MultipleChoiceScreen from './screens/gameScreens/MultipleChoiceScreen.js';
import TrueFalseScreen from './screens/gameScreens/TrueFalseScreen.js';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator()
{
	return (
		<Tab.Navigator screenOptions={{ headerShown: false }} >
			<Tab.Screen
				name='Personal'
				component={ PersonScreen }
				options={{
							tabBarIcon: ({ color, size }) => (
								<MaterialCommunityIcons name="account" size={size} color={color} />
							),
				}}
			/>
			<Tab.Screen
				name='Conditions'
				component={ MedicalConditionScreen }
				options={{
							tabBarIcon: ({ color, size }) => (
								<MaterialCommunityIcons name="account" size={size} color={color} />
							),
				}}
				
			/>
			<Tab.Screen
				name='Medication'
				component={ MedicationScreen }
				options={{
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons name="account" size={size} color={color} />
					),
				}}
			/>

			<Tab.Screen
				name='Allergies'
				component={ AllergyScreen }
				options={{
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons name="account" size={size} color={color} />
					),
				}}
			/> 

			<Tab.Screen
				name='Insurance'
				component={ InsuranceScreen }
				options={{
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons name="account" size={size} color={color} />
					),
				}}
			/>

			<Tab.Screen
				name='Doctor'
				component={ DoctorScreen }
				options={{
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons name="account" size={size} color={color} />
					),
				}}
			/>		
		</Tab.Navigator>
		
	)
}


notificationHandlerSetup();



export default function App()
{
	useEffect( ( ) =>
	{(
		async () =>
		{
			await requestNotificationPermission();
			await setNotificationChannel();
		}
	)();
	}, []);

	return (
		<SQLiteProvider databaseName='Safe.db' onInit={ initializeDatabase }>
			<NavigationContainer>
				<Stack.Navigator screenOptions={{ headerShown: false }}>
					<Stack.Screen name="Home" component={ HomeScreen }/>

					<Stack.Screen name="GameScreen" component={ GameScreen }/>
					<Stack.Screen name="MatchingScreen" component={ MatchingScreen }/>
					<Stack.Screen name="MultipleChoiceScreen" component={ MultipleChoiceScreen }/>
					<Stack.Screen name="TrueFalseScreen" component={ TrueFalseScreen }/>

					<Stack.Screen name="EmergencyDataScreen" component={ EmergencyDataScreen }/>					
					<Stack.Screen name="EmergencyDataFormScreen" component={ TabNavigator }/>

					<Stack.Screen name="AllergyScreen" component={ AllergyScreen }/>
					<Stack.Screen name="InsuranceScreen" component={ InsuranceScreen }/>
					<Stack.Screen name="DoctorScreen" component={ DoctorScreen }/>
					<Stack.Screen name="PersonScreen" component={ PersonScreen }/>
					<Stack.Screen name="MedicalConditionScreen" component={ MedicalConditionScreen }/>
				</Stack.Navigator>
			</NavigationContainer>
		</SQLiteProvider>
	);
}