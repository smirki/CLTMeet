// screens/NotificationsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import axios from 'axios';

export default function NotificationsScreen({ route }) {
    const { user } = route.params;
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            const response = await axios.get('http://localhost:3009/notifications', {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setNotifications(response.data);
        };
        fetchNotifications();
    }, []);

    const acceptMatch = async (targetUserId) => {
        await axios.post(`http://localhost:3009/accept-match/${targetUserId}`, {}, {
            headers: { Authorization: `Bearer ${user.token}` },
        });
    };

    const denyMatch = async (targetUserId) => {
        await axios.post(`http://localhost:3009/deny-match/${targetUserId}`, {}, {
            headers: { Authorization: `Bearer ${user.token}` },
        });
    };

    return (
        <View>
            {notifications.map((person) => (
                <View key={person._id}>
                    <Text>{person.name}</Text>
                    <Button title="Accept" onPress={() => acceptMatch(person._id)} />
                    <Button title="Deny" onPress={() => denyMatch(person._id)} />
                </View>
            ))}
        </View>
    );
}
