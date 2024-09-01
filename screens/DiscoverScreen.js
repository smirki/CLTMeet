import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import styles from './styles';

export default function DiscoverScreen() {
  const [businesses] = useState([
    { _id: '1', name: 'Cafe Good Vibes' },
    { _id: '2', name: 'Art Studio' },
  ]);
  const [artists] = useState([
    { _id: '1', name: 'John Doe' },
    { _id: '2', name: 'Jane Smith' },
  ]);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Local Businesses</Text>
      <FlatList
        data={businesses}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>{item.name}</Text>
          </View>
        )}
        keyExtractor={item => item._id}
      />
      <Text style={styles.sectionTitle}>Local Artists</Text>
      <FlatList
        data={artists}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>{item.name}</Text>
          </View>
        )}
        keyExtractor={item => item._id}
      />
    </View>
  );
}
