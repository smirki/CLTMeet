import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:3009';

export default function MeetScreen({ navigation }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState('');

    const fetchPotentialMatches = useCallback(async () => {
        console.log('Fetching potential matches...');
        try {
            const id = await AsyncStorage.getItem('userId');
            console.log('User ID retrieved from AsyncStorage:', id);
            setUserId(id);

            const response = await axios.get(`${API_BASE_URL}/social/potential-matches/${id}`);
            console.log('Response data from fetching potential matches:', response.data);
            setUsers(response.data);
        } catch (err) {
            console.error('Failed to load potential matches:', err);
            setError('Failed to load data');
        } finally {
            setLoading(false);
            console.log('Finished fetching potential matches. Loading set to false.');
        }
    }, []);

    useEffect(() => {
        console.log('MeetScreen component mounted.');
        fetchPotentialMatches();
    }, [fetchPotentialMatches]);

    const swipeRight = async (index) => {
        console.log(`Swiping right on user index ${index}`);
        const targetUserId = users[index]._id;
        console.log('Target user ID:', targetUserId);
    
        try {
            const response = await axios.post(`${API_BASE_URL}/social/swipe-right`, { userId, targetUserId });
            console.log('Response data from swipe right:', response.data);
            if (response.data.match) {
                Alert.alert('Match!', 'You have a new match!');
                console.log('New match found!');
            }
            // Instead of removing the user, update the list after fetching new potential matches
            await fetchPotentialMatches();
        } catch (err) {
            console.error('Failed to swipe right:', err);
            Alert.alert('Error', 'Failed to swipe');
        }
    };
    
    const swipeLeft = async (index) => {
        console.log(`Swiping left on user index ${index}`);
        const targetUserId = users[index]._id;
        console.log('Target user ID:', targetUserId);
    
        try {
            await axios.post(`${API_BASE_URL}/social/swipe-left`, { userId, targetUserId });
            // Instead of removing the user, update the list after fetching new potential matches
            await fetchPotentialMatches();
        } catch (err) {
            console.error('Failed to swipe left:', err);
            Alert.alert('Error', 'Failed to swipe');
        }
    };
    

    const renderCard = (user) => {
        console.log('Rendering card for user:', user);
        if (!user) {
            console.log('No more users to swipe on.');
            return (
                <View style={styles.card}>
                    <Text style={styles.noMoreUsersText}>No more people to swipe on.</Text>
                </View>
            );
        }
    
        return (
            <View style={styles.card}>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.about}>{user.about}</Text>
                <TouchableOpacity
                    style={styles.profileButton}
                    onPress={() => {
                        console.log('Navigating to UserProfile for user ID:', user._id);
                        navigation.navigate('UserProfile', { userId: user._id });
                    }}
                >
                    <Text style={styles.profileButtonText}>View Profile</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {loading && users.length === 0 ? (
                <Text>Loading...</Text>
            ) : error ? (
                <Text>{error}</Text>
            ) : (
                <>
                    <Swiper
                        cards={users}
                        renderCard={renderCard}
                        onSwipedRight={swipeRight}
                        onSwipedLeft={swipeLeft}
                        onSwipedAll={() => {
                            console.log('All users swiped, fetching more potential matches.');
                            fetchPotentialMatches();
                        }}
                        cardIndex={0}
                        backgroundColor="#f0f0f0"
                        stackSize={3}
                        infinite
                        showSecondCard
                    />
                    <TouchableOpacity 
                        style={styles.matchesButton}
                        onPress={() => {
                            console.log('Navigating to Matches screen.');
                            navigation.navigate('Matches');
                        }}
                    >
                        <Text style={styles.matchesButtonText}>View Matches</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    card: {
        flex: 1,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e8e8e8',
        padding: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    about: {
        fontSize: 16,
        marginVertical: 10,
    },
    profileButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 5,
    },
    profileButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    noMoreUsersText: {
        textAlign: 'center',
        fontSize: 18,
        marginTop: 20,
        color: 'gray',
    },
    matchesButton: {
        marginTop: 20,
    },
    matchesButtonText: {
        textAlign: 'center',
        color: '#007bff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
