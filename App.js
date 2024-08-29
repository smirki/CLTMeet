import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import FeedScreen from './screens/FeedScreen';
import MeetScreen from './screens/MeetScreen';
import MessagesScreen from './screens/MessagesScreen';
import DiscoverScreen from './screens/DiscoverScreen';
import ProfileScreen from './screens/ProfileScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import SwipeScreen from './screens/SwipeScreen';
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
    <Tab.Navigator>
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Meet" component={MeetScreen} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [fontsLoaded, fontsError] = useFonts({
    'Recoleta': require('./assets/fonts/Recoleta.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontsError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontsError]);

  // Return null or a loading indicator while fonts are loading or if an error occurred
  if (!fontsLoaded && !fontsError) {
    return null; // You could also return a loading indicator here
  }

  useEffect(() => {
    async function clearStorageOnce() {
      const isCleared = await AsyncStorage.getItem('isCleared');
      if (!isCleared) {
        await AsyncStorage.clear();
        await AsyncStorage.setItem('isCleared', 'true');
      }
    }
    clearStorageOnce();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Swipe" component={SwipeScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="UserProfile" component={UserProfileScreen} />
        <Stack.Screen name="EditPreferences" component={EditPreferencesScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Matches" component={MatchesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
