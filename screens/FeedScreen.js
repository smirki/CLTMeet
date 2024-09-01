import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { supabase } from './supabaseClient';
import styles from './styles';

export default function FeedScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  useEffect(() => {
    fetchEvents();
    fetchSuggestedUsers();
  }, []);

  async function fetchEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) console.error('Error fetching events:', error);
    else setEvents(data);
  }

  async function fetchSuggestedUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(5);

    if (error) console.error('Error fetching suggested users:', error);
    else setSuggestedUsers(data);
  }

  const renderEvent = ({ item }) => (
    <TouchableOpacity style={styles.eventCard}>
      <Image source={{ uri: item.image }} style={styles.eventImage} />
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventDate}>{new Date(item.date).toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSuggestedUser = ({ item }) => (
    <TouchableOpacity style={styles.suggestedUserCard} onPress={() => navigation.navigate('UserProfile', { userId: item.id })}>
      <Image source={{ uri: item.avatar_url }} style={styles.suggestedUserAvatar} />
      <Text style={styles.suggestedUserName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Upcoming Events</Text>
      <FlatList
        data={events}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />

      <Text style={styles.sectionTitle}>Suggested People</Text>
      <FlatList
        data={suggestedUsers}
        renderItem={renderSuggestedUser}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}
