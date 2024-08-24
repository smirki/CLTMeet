import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

const API_BASE_URL = 'http://10.0.0.4:3009';

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
  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      
      <Text style={styles.label}>Age:</Text>
      <Picker
        selectedValue={age}
        style={styles.picker}
        onValueChange={(itemValue) => setAge(itemValue)}
      >
        {[...Array(83)].map((_, i) => (
          <Picker.Item key={i} label={(i + 18).toString()} value={(i + 18).toString()} />
        ))}
      </Picker>

      <Text style={styles.label}>Gender:</Text>
      <Picker
        selectedValue={gender}
        style={styles.picker}
        onValueChange={(itemValue) => setGender(itemValue)}
      >
        <Picker.Item label="Male" value="male" />
        <Picker.Item label="Female" value="female" />
        <Picker.Item label="Other" value="other" />
      </Picker>

      <TextInput style={styles.input} placeholder="About" value={about} onChangeText={setAbout} multiline />
      <Button title="Sign Up" onPress={signUp} />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
});