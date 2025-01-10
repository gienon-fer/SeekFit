// screens/wardrobe/Outfits.js
import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useOutfit } from '../../../contexts/OutfitContext';

export default function Outfits() {
  const { outfits, resetOutfits } = useOutfit();
  const navigation = useNavigation();
  const numColumns = 4;

  const screenWidth = Dimensions.get('window').width;
  const imageWidth = screenWidth / numColumns;
  const imageHeight = imageWidth;

  const navigateToOutfitForm = (outfit) => {
    navigation.navigate('OutfitForm', { outfitToEdit: outfit });
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={outfits}
        numColumns={numColumns}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigateToOutfitForm(item)}>
            <Image source={{ uri: item.image }} style={[styles.image, { width: imageWidth, height: imageHeight }]} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Your wardrobe is empty. Add some outfits!</Text>
        }
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigateToOutfitForm(null)}
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