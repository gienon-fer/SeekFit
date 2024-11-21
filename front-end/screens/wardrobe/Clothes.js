import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AddClothing from './AddClothing';

export default function Clothes() {
  const [clothes, setClothes] = useState([]); // Stores the clothes
  const navigation = useNavigation();

  // Function to handle adding new clothes
  const addClothing = (newClothing) => {
    setClothes([...clothes, newClothing]);
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={clothes}
        numColumns={3}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image source={{ uri: item.image }} style={styles.image} />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Your wardrobe is empty. Add some clothes!</Text>
        }
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddClothing', { onSave: addClothing })} // pass a callback
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    margin: 5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'blue',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 30,
  },
});