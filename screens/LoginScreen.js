import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Alert, TouchableOpacity, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';

const API_BASE_URL = 'http://localhost:3009';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const login = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      const { token, user } = response.data;
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('userId', user._id);
      navigation.navigate('Main');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials');
      Alert.alert('Error', err.response?.data?.error || 'Invalid credentials');
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
      <View style={styles.scrollContainer}>
        <Text style={styles.title}>Clt<Text style={styles.meetText}>meet</Text></Text>

        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity style={styles.loginButton} onPress={login}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>or</Text>

        <TouchableOpacity style={styles.ssoButton}>
          <Text style={styles.ssoButtonText}>Login with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.ssoButton}>
          <Text style={styles.ssoButtonText}>Login with Apple</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.ssoButton} onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.ssoButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
