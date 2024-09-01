import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import styles from './styles';

export default function MatchesScreen() {
  const [matches] = useState([
    { _id: '1', name: 'Alice' },
    { _id: '2', name: 'Bob' },
  ]);

  const renderMatchItem = ({ item }) => (
    <View style={styles.listItem}>
      <Text style={styles.listItemText}>{item.name}</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Remove Match</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Matches</Text>
      <FlatList
        data={matches}
        renderItem={renderMatchItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
}
