import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, FlatList, Text } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChatScreen({ route }) {
    const { chatId, chatParticipants } = route.params;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        async function fetchMessages() {
            const response = await axios.get(`http://localhost:3009/social/chats/${chatId}/messages`);
            setMessages(response.data);
        }

        fetchMessages();
    }, [chatId]);

    const sendMessage = async () => {
        const userId = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('token');
        await axios.post(`http://localhost:3009/social/chats/${chatId}/messages`, {
            senderId: userId,
            content: newMessage,
        }, {
            headers: { Authorization: `Bearer ${token}` },
        });

        setNewMessage('');
        fetchMessages();  // Refresh messages
    };

    return (
        <View>
            <FlatList
                data={messages}
                renderItem={({ item }) => (
                    <Text>{item.sender.name}: {item.content}</Text>
                )}
                keyExtractor={item => item._id}
            />
            <TextInput
                value={newMessage}
                onChangeText={setNewMessage}
                placeholder="Type a message..."
            />
            <Button title="Send" onPress={sendMessage} />
        </View>
    );
}
