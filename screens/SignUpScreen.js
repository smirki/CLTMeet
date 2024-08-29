import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Alert, ScrollView, TouchableOpacity, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import styles from './styles';

const API_BASE_URL = 'http://localhost:3009';

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('18');
  const [gender, setGender] = useState('male');
  const [about, setAbout] = useState('');
  const [error, setError] = useState('');

  const signUp = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permission to access location was denied');
      }

      let location = await Location.getCurrentPositionAsync({});

      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        name,
        email,
        password,
        age: parseInt(age),
        gender,
        about,
        location: [location.coords.longitude, location.coords.latitude]
      });

      if (response.data.token && response.data.user) {
        const { token, user } = response.data;
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('userId', user._id);
        navigation.navigate('EditPreferences');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error("SignUp Error:", err.response?.data?.error || err.message);
      setError(err.response?.data?.error || 'Registration failed');
      Alert.alert('Error', err.response?.data?.error || 'Registration failed');
    }
  };

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      // Handle keyboard show event if needed
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      // Handle keyboard hide event if needed
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Cltmeet</Text>

        <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
        
        <TextInput style={styles.input} placeholder="Age" value={age} onChangeText={setAge} keyboardType="number-pad" />
        <TextInput style={styles.input} placeholder="Gender" value={gender} onChangeText={setGender} />
        <TextInput style={styles.input} placeholder="About" value={about} onChangeText={setAbout} multiline />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity style={styles.signUpButton} onPress={signUp}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>or</Text>

        <TouchableOpacity style={styles.ssoButton}>
          <Text style={styles.ssoButtonText}>Sign Up with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.ssoButton}>
          <Text style={styles.ssoButtonText}>Sign Up with Apple</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
