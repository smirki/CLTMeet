import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { StyleSheet } from 'react-native';

export default function MeetScreen({ navigation }) {
  const [users] = useState([
    { _id: '1', name: 'Alice', about: 'Loves hiking and the outdoors.' },
    { _id: '2', name: 'Bob', about: 'Avid reader and coffee enthusiast.' },
    { _id: '3', name: 'Charlie', about: 'Enjoys painting and music.' },
  ]);

  const renderCard = (user) => (
    <View style={styles.card}>
      <Text style={styles.cardText}>{user.name}</Text>
      <Text style={styles.cardText}>{user.about}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('UserProfile', { userId: user._id })}
      >
        <Text style={styles.buttonText}>View Profile</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Swiper
        cards={users}
        renderCard={renderCard}
        onSwipedRight={(index) => console.log('Swiped right on', users[index].name)}
        onSwipedLeft={(index) => console.log('Swiped left on', users[index].name)}
        cardIndex={0}
        backgroundColor="#F8F3DF"
        stackSize={3}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F3DF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    marginBottom: 20,
  },
  cardText: {
    fontSize: 18,
    color: '#231F20',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#F48278',
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
