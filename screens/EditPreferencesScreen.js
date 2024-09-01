import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import styles from './styles';

export default function EditPreferencesScreen() {
  const [age, setAge] = useState('25');
  const [gender, setGender] = useState('Female');
  const [about, setAbout] = useState('Love to travel and meet new people!');

  const savePreferences = () => {
    console.log('Preferences saved:', { age, gender, about });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Edit Preferences</Text>
      <TextInput value={age} onChangeText={setAge} placeholder="Age" style={styles.input} />
      <TextInput value={gender} onChangeText={setGender} placeholder="Gender" style={styles.input} />
      <TextInput
        value={about}
        onChangeText={setAbout}
        placeholder="About Me"
        style={styles.input}
        multiline
      />
      <Button title="Save" onPress={savePreferences} color="#F48278" />
    </View>
  );
}
