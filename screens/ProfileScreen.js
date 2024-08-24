import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen({ navigation }) {
    const [user, setUser] = useState({});

    useEffect(() => {
        async function fetchData() {
            const userId = await AsyncStorage.getItem('userId');
            const response = await axios.get(`http://10.0.0.4:3009/users/${userId}`);
            setUser(response.data);
        }

        fetchData();
    }, []);

    return (
        <View>
            <Text>Name: {user.name}</Text>
            <Text>Email: {user.email}</Text>
            <Text>Age: {user.age}</Text>
            <Text>Gender: {user.gender}</Text>
            <Text>About Me: {user.about}</Text>
            <Button title="Edit Profile" onPress={() => navigation.navigate('EditPreferences')} />
        </View>
    );
}
