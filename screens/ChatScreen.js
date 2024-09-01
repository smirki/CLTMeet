import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text } from 'react-native';
import styles from './styles';

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    { _id: '1', sender: { name: 'Alice' }, content: 'Hey, how are you?' },
    { _id: '2', sender: { name: 'You' }, content: 'I am good, thanks!' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    setMessages([
      ...messages,
      { _id: Math.random().toString(), sender: { name: 'You' }, content: newMessage },
    ]);
    setNewMessage('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>
              {item.sender.name}: {item.content}
            </Text>
          </View>
        )}
        keyExtractor={item => item._id}
      />
      <TextInput
        value={newMessage}
        onChangeText={setNewMessage}
        placeholder="Type a message..."
        style={styles.input}
      />
      <Button title="Send" onPress={sendMessage} color="#F48278" />
    </View>
  );
}
