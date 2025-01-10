import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useClothing } from '../../../contexts/ClothingContext'; 

export default function Clothes() {
  const { clothes, resetClothing } = useClothing();  
  const navigation = useNavigation();
  const numColumns = 4;

  const screenWidth = Dimensions.get('window').width;
  const imageWidth = screenWidth / numColumns; 
  const imageHeight = imageWidth; 

  const navigateToClothingForm = (clothing) => {
    navigation.navigate('ClothingForm', { clothingToEdit: clothing }); 
  };

  //console.log('Clothing IDs:', clothes.map(item => item.id));

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={clothes}
        numColumns={numColumns}  // 3 columns for the images
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
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigateToClothingForm(null)}
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
