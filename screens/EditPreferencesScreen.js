import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditPreferencesScreen({ navigation }) {
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [about, setAbout] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchPreferences() {
            const userId = await AsyncStorage.getItem('userId');
            const response = await axios.get(`http://localhost:3009/users/${userId}`);
            const { age, gender, about } = response.data;
            setAge(age);
            setGender(gender);
            setAbout(about);
        }
        fetchPreferences();
    }, []);

    const savePreferences = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            await axios.put(`http://localhost:3009/users/${userId}/preferences`, { age, gender, about });
            navigation.goBack();
        } catch (err) {
            setError('Failed to save preferences');
            Alert.alert('Error', 'Failed to save preferences');
        }
    };

    return (
        <View>
            <Text>Age:</Text>
            <TextInput value={age} onChangeText={setAge} />
            <Text>Gender:</Text>
            <TextInput value={gender} onChangeText={setGender} />
            <Text>About Me:</Text>
            <TextInput value={about} onChangeText={setAbout} />
            <Button title="Save" onPress={savePreferences} />
            {error ? <Text>{error}</Text> : null}
        </View>
    );
}
