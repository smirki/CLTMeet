import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MessagesScreen({ navigation }) {
    const [chats, setChats] = useState([]);
    const [userId, setUserId] = useState('');

    useEffect(() => {
        async function fetchData() {
            const id = await AsyncStorage.getItem('userId');
            setUserId(id);

            try {
                const response = await axios.get(`http://localhost:3009/social/chats/${id}`);
                setChats(response.data);
            } catch (err) {
                console.error(err);
                Alert.alert('Error', 'Failed to load chats');
            }
        }

        fetchData();
    }, []);

    return (
        <View>
            <FlatList
                data={chats}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Chat', { chatId: item._id, chatParticipants: item.participants })}
                    >
                        <View>
                            <Text>
                                {item.participants
                                    .filter(p => p._id !== userId) // Exclude the current user from the list
                                    .map(p => p.name) // Extract and display the names of the participants
                                    .join(', ')}
                            </Text>
                            <Text>{item.lastMessage ? item.lastMessage.content : 'No messages yet'}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={item => item._id}
            />
        </View>
    );
}
