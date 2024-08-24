import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import axios from 'axios';

export default function UserProfileScreen({ route }) {
    const { userId } = route.params;
    const [user, setUser] = useState({});

    useEffect(() => {
        async function fetchUser() {
            const response = await axios.get(`http://10.0.0.4:3009/users/${userId}`);
            setUser(response.data);
        }
        fetchUser();
    }, [userId]);

    return (
        <View>
            <Text>Name: {user.name}</Text>
            <Text>Email: {user.email}</Text>
        </View>
    );
}
