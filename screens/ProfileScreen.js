import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function ProfileScreen({ navigation }) {
  const [user] = useState({
    name: 'You',
    email: 'you@example.com',
    age: 25,
    gender: 'Female',
    about: 'Love to travel and meet new people!',
  });

  return (
    <View style={styles.container}>
      <Text style={styles.profileText}>Name: {user.name}</Text>
      <Text style={styles.profileText}>Email: {user.email}</Text>
      <Text style={styles.profileText}>Age: {user.age}</Text>
      <Text style={styles.profileText}>Gender: {user.gender}</Text>
      <Text style={styles.profileText}>About Me: {user.about}</Text>
      <Button title="Edit Profile" onPress={() => navigation.navigate('EditPreferences')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F3DF',
    padding: 20,
  },
  profileText: {
    fontSize: 18,
    marginBottom: 10,
  },
});
