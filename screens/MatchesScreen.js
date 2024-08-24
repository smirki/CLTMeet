import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://10.0.0.4:3009';

export default function MatchesScreen() {
    const [matches, setMatches] = useState([]);
    const [outgoingRequests, setOutgoingRequests] = useState([]);
    const [incomingRequests, setIncomingRequests] = useState([]);
    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        const id = await AsyncStorage.getItem('userId');
        setUserId(id);
    
        try {
            const response = await axios.get(`${API_BASE_URL}/social/matches/${id}`);
            console.log('Matches fetched:', response.data.matches);
            console.log('Outgoing requests fetched:', response.data.outgoingRequests);
            console.log('Incoming requests fetched:', response.data.incomingRequests);
    
            setMatches(response.data.matches);
            setOutgoingRequests(response.data.outgoingRequests);
            setIncomingRequests(response.data.incomingRequests);
        } catch (err) {
            console.error('Failed to load matches and requests:', err);
            Alert.alert('Error', 'Failed to load matches and requests');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const acceptMatch = async (targetUserId) => {
        try {
            await axios.post(`${API_BASE_URL}/social/accept-match`, { userId, targetUserId });
            const acceptedUser = incomingRequests.find(request => request._id === targetUserId);
            setIncomingRequests(incomingRequests.filter(request => request._id !== targetUserId));
            setMatches([...matches, acceptedUser]);
        } catch (err) {
            Alert.alert('Error', 'Failed to accept match');
        }
    };

    const denyMatch = async (targetUserId) => {
        try {
            await axios.post(`${API_BASE_URL}/social/deny-match`, { userId, targetUserId });
            setIncomingRequests(incomingRequests.filter(request => request._id !== targetUserId));
        } catch (err) {
            Alert.alert('Error', 'Failed to deny match');
        }
    };

    const cancelRequest = async (targetUserId) => {
        try {
            await axios.post(`${API_BASE_URL}/social/cancel-request`, { userId, targetUserId });
            setOutgoingRequests(outgoingRequests.filter(request => request._id !== targetUserId));
        } catch (err) {
            Alert.alert('Error', 'Failed to cancel request');
        }
    };

    const removeMatch = async (targetUserId) => {
        try {
            await axios.post(`${API_BASE_URL}/social/remove-match`, { userId, targetUserId });
            setMatches(matches.filter(match => match._id !== targetUserId));
        } catch (err) {
            Alert.alert('Error', 'Failed to remove match');
        }
    };

    const renderMatchItem = ({ item }) => (
        <View style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
            <TouchableOpacity style={[styles.button, styles.removeButton]} onPress={() => removeMatch(item._id)}>
                <Text style={styles.buttonText}>Remove Match</Text>
            </TouchableOpacity>
        </View>
    );

    const renderOutgoingRequestItem = ({ item }) => (
        <View style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => cancelRequest(item._id)}>
                <Text style={styles.buttonText}>Cancel Request</Text>
            </TouchableOpacity>
        </View>
    );

    const renderIncomingRequestItem = ({ item }) => (
        <View style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
            <View style={styles.buttonGroup}>
                <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={() => acceptMatch(item._id)}>
                    <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.denyButton]} onPress={() => denyMatch(item._id)}>
                    <Text style={styles.buttonText}>Deny</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Matches</Text>
            <FlatList
                data={matches}
                renderItem={renderMatchItem}
                keyExtractor={(item) => item._id}
                ListEmptyComponent={<Text style={styles.emptyText}>No matches yet</Text>}
            />

            <Text style={styles.sectionTitle}>Outgoing Requests</Text>
            <FlatList
                data={outgoingRequests}
                renderItem={renderOutgoingRequestItem}
                keyExtractor={(item) => item._id}
                ListEmptyComponent={<Text style={styles.emptyText}>No outgoing requests</Text>}
            />

            <Text style={styles.sectionTitle}>Incoming Requests</Text>
            <FlatList
                data={incomingRequests}
                renderItem={renderIncomingRequestItem}
                keyExtractor={(item) => item._id}
                ListEmptyComponent={<Text style={styles.emptyText}>No incoming requests</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 20,
    },
    item: {
        backgroundColor: '#f8f8f8',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemText: {
        fontSize: 16,
        fontWeight: '500',
    },
    button: {
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    buttonGroup: {
        flexDirection: 'row',
    },
    removeButton: {
        backgroundColor: '#dc3545',
    },
    cancelButton: {
        backgroundColor: '#ffc107',
    },
    acceptButton: {
        backgroundColor: '#28a745',
        marginRight: 10,
    },
    denyButton: {
        backgroundColor: '#dc3545',
    },
    emptyText: {
        textAlign: 'center',
        color: 'gray',
        marginVertical: 10,
    },
});
