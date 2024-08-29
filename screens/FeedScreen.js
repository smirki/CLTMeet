import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FeedScreen() {
    const [events, setEvents] = useState([]);
    const [suggestedUsers, setSuggestedUsers] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const userId = await AsyncStorage.getItem('userId'); // Retrieve userId from AsyncStorage
            const eventsResponse = await axios.get('http://localhost:3009/events');
            const suggestionsResponse = await axios.get(`http://localhost:3009/search/recommendations/${userId}`);

            setEvents(eventsResponse.data);
            setSuggestedUsers(suggestionsResponse.data);
        }

        fetchData();
    }, []);

    return (
        <View>
            <Text>Latest Events</Text>
            <FlatList
                data={events}
                renderItem={({ item }) => <Text>{item.title}</Text>}
                keyExtractor={item => item._id}
            />

            <Text>Suggested People</Text>
            <FlatList
                data={suggestedUsers}
                renderItem={({ item }) => <Text>{item.name}</Text>}
                keyExtractor={item => item._id}
            />
        </View>
    );
}
