import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useClothing } from '../../../contexts/ClothingContext';
import { Ionicons } from '@expo/vector-icons';

export default function Clothes() {
  const { clothes, resetClothing } = useClothing();
  const navigation = useNavigation();
  const numColumns = 4;

  const screenWidth = Dimensions.get('window').width;
  const imageWidth = screenWidth / numColumns;
  const imageHeight = imageWidth * 1.75;

  const navigateToClothingForm = (clothing) => {
    navigation.navigate('ClothingForm', { clothingToEdit: clothing });
  };

  const openFilter = () => {
    navigation.navigate('FilterClothing');
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={clothes}
        numColumns={numColumns}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigateToClothingForm(item)}>
            <Image source={{ uri: item.image }} style={[styles.image, { width: imageWidth, height: imageHeight }]} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Your wardrobe is empty. Add some clothes!</Text>
        }
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={openFilter}
        >
          <Ionicons name="filter" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigateToClothingForm(null)}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    marginBottom: 0,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 10,
    flexDirection: 'row',
  },
  addButton: {
    backgroundColor: 'blue',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 30,
  },
  filterButton: {
    backgroundColor: 'blue',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
});
