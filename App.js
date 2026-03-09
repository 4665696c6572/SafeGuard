import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { Doctor03Icon, MedicalMaskIcon, Medicine02Icon, UserAccountIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import initializeDatabase from './database/initializeDatabase.js';

import { notificationHandlerSetup, requestNotificationPermission, setNotificationChannel } from './common/home/notificationSetup.js';

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

// import LearningHomeScreen from './screens/learningScreens/LearningHomeScreen.js';




const Stack = createNativeStackNavigator( );
const Tab = createBottomTabNavigator( );
notificationHandlerSetup( );

function TabNavigator( )
{
	return (
		<Tab.Navigator
			shifting={false}
			labeled={true}
			detachInactiveScreens={true}
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
			>
			<Tab.Screen
				name='Personal'
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
	useEffect( ( ) =>
	{(
		async ( ) =>
		{
			await requestNotificationPermission( );
			await setNotificationChannel( );
		}
	)( );
	}, [ ]);


	return (
		<SafeAreaProvider>
			<SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
				<SQLiteProvider databaseName='Safe.db' onInit={ initializeDatabase }>
					{/* <StatusBar style="automatic" /> */}
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

							{/* <Stack.Screen name="LearningHomeScreen" component={ LearningHomeScreen }/> */}
						</Stack.Navigator>
					</NavigationContainer>
				</SQLiteProvider>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}