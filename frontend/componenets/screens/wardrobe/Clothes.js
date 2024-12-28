import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useClothing } from '../../../contexts/ClothingContext'; 

export default function Clothes() {
  const { clothes } = useClothing();  
  const navigation = useNavigation();

  const screenWidth = Dimensions.get('window').width;
  const imageWidth = screenWidth / 3; 
  const imageHeight = imageWidth; 

  const navigateToEditClothing = (clothing) => {
    navigation.navigate('EditClothing', { clothingToEdit: clothing }); 
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={clothes}
        numColumns={3}  // 3 columns for the images
        keyExtractor={(item) => item.image}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigateToEditClothing(item)}>
            <Image source={{ uri: item.image }} style={[styles.image, { width: imageWidth, height: imageHeight }]} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Your wardrobe is empty. Add some clothes!</Text>
        }
        columnWrapperStyle={{
          justifyContent: 'space-between', 
        }}
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
    marginBottom: 0,
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
