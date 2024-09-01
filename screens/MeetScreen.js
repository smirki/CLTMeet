import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Swiper from 'react-native-deck-swiper';

export default function MeetScreen() {
  const [cards, setCards] = useState([
    { id: 1, name: 'John Doe', image: 'PLACEHOLDER_IMAGE_1', age: 25 },
    { id: 2, name: 'Jane Smith', image: 'PLACEHOLDER_IMAGE_2', age: 27 },
    { id: 3, name: 'Emily Johnson', image: 'PLACEHOLDER_IMAGE_3', age: 23 },
    // Add more user cards here
  ]);

  const swiperRef = useRef(null);

  const onSwipedLeft = (cardIndex) => {
    console.log(`Swiped left on card ${cards[cardIndex].name}`);
  };

  const onSwipedRight = (cardIndex) => {
    console.log(`Swiped right on card ${cards[cardIndex].name}`);
  };

  const renderCard = (card) => (
    <View style={styles.card}>
      <Image source={{ uri: card.image }} style={styles.cardImage} />
      <Text style={styles.cardName}>{card.name}, {card.age}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Swiper
        ref={swiperRef}
        cards={cards}
        renderCard={renderCard}
        onSwipedLeft={onSwipedLeft}
        onSwipedRight={onSwipedRight}
        cardIndex={0}
        backgroundColor={'#F8F3DF'}
        stackSize={3}
        stackSeparation={15}
        cardVerticalMargin={50}
        disableTopSwipe
        disableBottomSwipe
      />
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => swiperRef.current.swipeLeft()}>
          <Text style={styles.buttonText}>Nope</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => swiperRef.current.swipeRight()}>
          <Text style={styles.buttonText}>Like</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F3DF',
    justifyContent: 'center',
  },
  card: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImage: {
    width: '100%',
    height: 300,
    borderRadius: 20,
    marginBottom: 20,
  },
  cardName: {
    fontSize: 24,
    fontFamily: 'Recoleta',
    color: '#231F20',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#F48278',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#F8F3DF',
    fontSize: 18,
    fontFamily: 'Recoleta',
  },
});
