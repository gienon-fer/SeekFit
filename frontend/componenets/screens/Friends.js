import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Alert,
  TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '../../contexts/UserContext';

const Friends = () => {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (user) {
      const loadUsersAndFriends = async () => {
        try {
          const storedUsers = await AsyncStorage.getItem('users');
          const parsedUsers = storedUsers ? JSON.parse(storedUsers) : [
            { id: '1', name: 'Ivan' },
            { id: '2', name: 'Josip' },
            { id: '3', name: 'Marko' },
          ];
  
          const storedFriends = await AsyncStorage.getItem('friends');
          const parsedFriends = storedFriends ? JSON.parse(storedFriends) : [];
  
          setUsers(parsedUsers.map(u => ({
            ...u,
            isFriend: parsedFriends.some(f => f.id === u.id),
          })));
  
          setFriends(parsedFriends);
        } catch (error) {
          console.error('Error loading users or friends:', error);
        }
      };
  
      loadUsersAndFriends();
    }
  }, [user]);

  const handleAddFriend = async (friendId) => {
    try {
      const newFriend = users.find(u => u.id === friendId);
      if (!newFriend) return;

      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === friendId ? { ...user, isFriend: true } : user
        )
      );

      const updatedFriends = [...friends, newFriend];
      setFriends(updatedFriends);

      await AsyncStorage.setItem('friends', JSON.stringify(updatedFriends));
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  const handleRemoveFriend = async (friendId) => {
    Alert.alert(
      'Remove Friend',
      'Are you sure you want to remove this friend?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          onPress: async () => {
            try {
              setUsers(prevUsers =>
                prevUsers.map(user =>
                  user.id === friendId ? { ...user, isFriend: false } : user
                )
              );

              const updatedFriends = friends.filter(friend => friend.id !== friendId);
              setFriends(updatedFriends);

              await AsyncStorage.setItem('friends', JSON.stringify(updatedFriends));
            } catch (error) {
              console.error('Error removing friend:', error);
            }
          },
        },
      ]
    );
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.userItem}>
      <Text style={styles.userName}>{item.name}</Text>
      {item.isFriend ? (
        <TouchableOpacity
          style={styles.friendButton}
          onPress={() => handleRemoveFriend(item.id)}
        >
          <Text style={styles.buttonText}>Friends</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleAddFriend(item.id)}
        >
          <Text style={styles.buttonText}>Add Friend</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Please sign in to see your friends.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search for users..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()))}
        keyExtractor={item => item.id}
        renderItem={renderUserItem}
      />

      <Text style={styles.sectionTitle}>Your Friends</Text>
      <FlatList
        data={friends}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <Text style={styles.friendName}>{item.name}</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
  },
  friendButton: {
    backgroundColor: '#6c63ff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  friendName: {
    fontSize: 16,
    paddingVertical: 4,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Friends;