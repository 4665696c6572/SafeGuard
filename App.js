import * as Notifications from "expo-notifications";
import { SQLiteProvider } from 'expo-sqlite';
import { Doctor03Icon, MedicalMaskIcon, Medicine02Icon, UserAccountIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import initializeDatabase from './database/initializeDatabase.js';


import {  NotificationProvider } from "./common/home/context/NotificationContext.js";


import HomeScreen from './screens/HomeScreen.js';
import EmergencyDataScreen from './screens/userDataScreens/EmergencyDataScreen.js';
import ContactScreen from './screens/userDataScreens/ContactScreen.js';
import DoctorScreen from './screens/userDataScreens/DoctorScreen.js';
import MedicalConditionScreen from './screens/userDataScreens/MedicalConditionScreen.js';
import MedicationScreen from './screens/userDataScreens/MedicationScreen.js';
import PersonScreen from './screens/userDataScreens/PersonScreen.js';

import GameScreen from './screens/gameScreens/GameScreen.js';
import MatchingScreen from './screens/gameScreens/MatchingScreen.js';
import MultipleChoiceScreen from './screens/gameScreens/MultipleChoiceScreen.js';
import TrueFalseScreen from './screens/gameScreens/TrueFalseScreen.js';




const Stack = createNativeStackNavigator( );
const Tab = createBottomTabNavigator( );

Notifications.setNotificationHandler(
{
	handleNotification: async ( ) =>
	({
		shouldShowBanner: true,
		shouldShowList: true,
		shouldPlaySound: false,
		shouldSetBadge: false,
	}),
});


function TabNavigator( )
{
	return (
		<Tab.Navigator
			detachInactiveScreens={ true }
			initialRouteName={ 'Person' }
			labeled={ true }
			screenOptions=
			{{
				headerShown: false,
				tabBarActiveTintColor: '#d1dce4ff',
				tabBarInactiveTintColor: '#d1dce4ff',
				tabBarLabelStyle:
				{
					color: '#d1dce4ff',
					fontSize: 13,
					marginTop: -4
				},
				tabBarShowLabel: true,
				tabBarStyle:
				{
					backgroundColor: '#0b3e82ff',
					height: 50,
					paddingBottom: 0,
					paddingTop: 0
				},
			}}
			shifting={false}
		>

			<Tab.Screen
				name='Person'
				component={ PersonScreen }
				options=
				{{
					tabBarIcon: ({ color, size }) =>
					(
						<HugeiconsIcon
							color={ color }
							icon={ UserAccountIcon }
							size={ size }									
							strokeWidth={ 1.5 }
						/>
					),
					tabBarLabel:'Personal'
				}}
			/>

			<Tab.Screen
				name='Condition'
				component={ MedicalConditionScreen }
				options=
				{{
					tabBarIcon: ({ color, size }) =>
					(
						<HugeiconsIcon
							color={ color }
							icon={ MedicalMaskIcon }
							size={ size }	
							strokeWidth={ 1.5 }
						/>
					),
					tabBarLabel:'Condition'
				}}
			/>

			<Tab.Screen
				name='Medication'
				component={ MedicationScreen }
				options=
				{{
					tabBarIcon: ({ color, size }) =>
					(
						<HugeiconsIcon
							color={ color }
							icon={ Medicine02Icon }
							size={ size }	
							strokeWidth={ 1.5 }
						/>
					),
					tabBarLabel:'Medication'
				}}
			/>

			<Tab.Screen
				name='Doctor'
				component={ DoctorScreen }
				options=
				{{
					tabBarIcon: ({ color, size }) =>
					(
						<HugeiconsIcon
							color={ color }
							icon={ Doctor03Icon }
							size={ size }	
							strokeWidth={ 1.5 }
						/>
					),
					tabBarLabel:'Doctor'
				}}
			/>
		</Tab.Navigator>
	)
}


export default function App( )
{
	return (
		<NotificationProvider>
			<SafeAreaProvider>
				<SafeAreaView style={{ flex: 1, backgroundColor: 'rgb(0, 0, 0)' }}>
					<SQLiteProvider databaseName='Safe.db' onInit={ initializeDatabase }>
						<NavigationContainer>
							<Stack.Navigator screenOptions={{ headerShown: false }}>
								<Stack.Screen name="Home" component={ HomeScreen }/>
								<Stack.Screen name="GameScreen" component={ GameScreen }/>
								<Stack.Screen name="MatchingScreen" component={ MatchingScreen }/>
								<Stack.Screen name="MultipleChoiceScreen" component={ MultipleChoiceScreen }/>
								<Stack.Screen name="TrueFalseScreen" component={ TrueFalseScreen }/>

								<Stack.Screen name="EmergencyDataScreen" component={ EmergencyDataScreen }/>
								<Stack.Screen name="PersonScreen" component={ TabNavigator }/>
								<Stack.Screen name="ContactScreen" component={ ContactScreen }/>
							</Stack.Navigator>
						</NavigationContainer>
					</SQLiteProvider>
				</SafeAreaView>
			</SafeAreaProvider>
		</NotificationProvider>
	);
}