import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import axios from 'axios';

export default function DiscoverScreen() {
    const [businesses, setBusinesses] = useState([]);
    const [artists, setArtists] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const businessesResponse = await axios.get('http://10.0.0.4:3009/businesses');
            const artistsResponse = await axios.get('http://10.0.0.4:3009/artists');

            setBusinesses(businessesResponse.data);
            setArtists(artistsResponse.data);
        }

        fetchData();
    }, []);

    return (
        <View>
            <Text>Local Businesses</Text>
            <FlatList
                data={businesses}
                renderItem={({ item }) => <Text>{item.name}</Text>}
                keyExtractor={item => item._id}
            />

            <Text>Local Artists</Text>
            <FlatList
                data={artists}
                renderItem={({ item }) => <Text>{item.name}</Text>}
                keyExtractor={item => item._id}
            />
        </View>
    );
}
