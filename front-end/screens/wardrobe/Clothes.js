// screens/wardrobe/Clothes.js
import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useClothing } from '../../contexts/ClothingContext'; // Import the useClothing hook

export default function Clothes() {
  const { clothes } = useClothing();  // Get clothing items from context
  const navigation = useNavigation();

  const navigateToEditClothing = (clothing) => {
    navigation.navigate('EditClothing', { clothingToEdit: clothing });  // Pass clothing to be edited
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={clothes}
        numColumns={3}
        keyExtractor={(item) => item.image}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigateToEditClothing(item)}>
            <Image source={{ uri: item.image }} style={styles.image} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Your wardrobe is empty. Add some clothes!</Text>
        }
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddClothing')}
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