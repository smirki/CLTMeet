import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native';

export default function MessagesScreen({ navigation }) {
  const [chats] = useState([
    {
      _id: '1',
      participants: [{ _id: '1', name: 'Alice' }, { _id: '2', name: 'You' }],
      lastMessage: { content: 'Hey, how are you?' },
    },
    {
      _id: '2',
      participants: [{ _id: '1', name: 'Bob' }, { _id: '2', name: 'You' }],
      lastMessage: { content: 'Let\'s grab coffee!' },
    },
  ]);

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Chat', { chatId: item._id, chatParticipants: item.participants })}
          >
            <View style={styles.listItem}>
              <Text style={styles.listItemText}>
                {item.participants
                  .filter(p => p._id !== '2')
                  .map(p => p.name)
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F3DF',
    padding: 20,
  },
  listItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: '#e8e8e8',
    borderWidth: 1,
  },
  listItemText: {
    fontSize: 16,
    color: '#231F20',
  },
});
