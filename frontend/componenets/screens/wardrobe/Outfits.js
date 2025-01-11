// screens/wardrobe/Outfits.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useOutfit } from '../../../contexts/OutfitContext';
import { Ionicons } from '@expo/vector-icons';
import { useActiveOutfitFilters, useSetActiveOutfitFilters } from '../../../contexts/OutfitFilterContext'; // Import outfit filter context

export default function Outfits() {
  const { outfits, removeOutfit } = useOutfit();
  const navigation = useNavigation();
  const numColumns = 4;

  const activeFilters = useActiveOutfitFilters(); // Use the hook to get active filters
  const [filteredOutfits, setFilteredOutfits] = useState(outfits);

  useEffect(() => {
    applyFilters();
  }, [outfits, activeFilters]);

  const screenWidth = Dimensions.get('window').width;
  const imageWidth = screenWidth / numColumns;
  const imageHeight = imageWidth * 1.75;

  const navigateToOutfitForm = (outfit) => {
    navigation.navigate('OutfitForm', { outfitToEdit: outfit });
  };

  const openFilter = () => {
    navigation.navigate('FilterOutfit');
  };

  const applyFilters = () => {
    if (Object.keys(activeFilters).length === 0) {
      setFilteredOutfits(outfits);
      return;
    }

    const filtered = outfits.filter((item) => {
      return Object.keys(activeFilters).every((category) => {
        const categoryTags = activeFilters[category];
        return categoryTags.every((tag) => item.tags[category.toLowerCase()]?.includes(tag));
      });
    });

    setFilteredOutfits(filtered);
  };

  const handlePress = (outfit) => {
    navigation.navigate('OutfitForm', { outfitToEdit: outfit });
  };

  const handleLongPress = (outfit) => {
    Alert.alert(
      'What do you want to do?',
      '',
      [
        { text: 'Delete', onPress: () => removeOutfit(outfit.id) },
        { text: 'Edit', onPress: () => navigateToOutfitForm(outfit) },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={filteredOutfits}
        numColumns={numColumns}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handlePress(item)}
            onLongPress={() => handleLongPress(item)}
          >
            <Image source={{ uri: item.image }} style={[styles.image, { width: imageWidth, height: imageHeight }]} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Your wardrobe is empty. Add some outfits!</Text>
        }
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={Object.keys(activeFilters).length > 0 ? styles.activeFilterButton : styles.filterButton}
          onPress={openFilter}
        >
          <Ionicons name="filter" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigateToOutfitForm(null)}
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
  activeFilterButton: {
    backgroundColor: 'darkblue',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
});