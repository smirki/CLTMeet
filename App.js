import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import FeedScreen from './screens/FeedScreen';
import MeetScreen from './screens/MeetScreen';
import MessagesScreen from './screens/MessagesScreen';
import DiscoverScreen from './screens/DiscoverScreen';
import ProfileScreen from './screens/ProfileScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import EditPreferencesScreen from './screens/EditPreferencesScreen';
import ChatScreen from './screens/ChatScreen';
import MatchesScreen from './screens/MatchesScreen';

SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Feed') {
            iconName = 'home';
          } else if (route.name === 'Meet') {
            iconName = 'users';
          } else if (route.name === 'Messages') {
            iconName = 'message-square';
          } else if (route.name === 'Discover') {
            iconName = 'compass';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          }

          return <Feather name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#F48278',
        inactiveTintColor: '#231F20',
      }}
    >
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Meet" component={MeetScreen} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    'Recoleta': require('./assets/fonts/Recoleta.ttf'),
  });
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    async function checkLoginStatus() {
      const token = await AsyncStorage.getItem('token');
      setIsLoggedIn(!!token);
    }

    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (fontsLoaded && isLoggedIn !== null) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isLoggedIn]);

  if (!fontsLoaded || isLoggedIn === null) {
    return <Text>Loading...</Text>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="UserProfile" component={UserProfileScreen} />
            <Stack.Screen name="EditPreferences" component={EditPreferencesScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="Matches" component={MatchesScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}