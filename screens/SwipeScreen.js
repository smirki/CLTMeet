import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Button, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';

export default function SwipeScreen({ route, navigation }) {
    const { user } = route.params; // Retrieve user from route params
    const [people, setPeople] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch people with error handling and data validation
    const fetchPeople = useCallback(async () => {
        try {
            if (user && user.token) {
                const response = await axios.get('http://10.0.0.4:3009/people', {
                    headers: { Authorization: `Bearer ${user.token}` },
                });

                if (Array.isArray(response.data)) {
                    setPeople(response.data);
                } else {
                    throw new Error('Unexpected response format');
                }
            } else {
                throw new Error('User or token is undefined');
            }
        } catch (err) {
            console.error('Failed to fetch people:', err.message);
            setError(err.message);
            Alert.alert('Error', err.message); // Alert user about the error
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchPeople();
    }, [fetchPeople]);

    // Handle swipe right action
    const swipeRight = async (targetUserId) => {
        try {
            if (user && user.token) {
                await axios.post(`http://10.0.0.4:3009/swipe-right/${targetUserId}`, {}, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
            } else {
                throw new Error('User or token is undefined');
            }
        } catch (err) {
            console.error('Failed to swipe right:', err.message);
            Alert.alert('Error', err.message); // Alert user about the error
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return (
            <View>
                <Text>Error: {error}</Text>
            </View>
        );
    }

    if (!Array.isArray(people) || people.length === 0) {
        return (
            <View>
                <Text>No users found to swipe on.</Text>
            </View>
        );
    }

    return (
        <View>
            {people.map((person) => (
                <View key={person._id}>
                    <Text>{person.name}</Text>
                    <Button title="Swipe Right" onPress={() => swipeRight(person._id)} />
                </View>
            ))}
        </View>
    );
}
