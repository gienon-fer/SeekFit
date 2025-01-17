import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useClothing } from '../../../contexts/ClothingContext';
import { Ionicons } from '@expo/vector-icons';
import { useActiveClothingFilters, useSetActiveClothingFilters } from '../../../contexts/ClothingFilterContext'; // Import clothing filter context

export default function Clothes() {
  const { clothes, removeClothing } = useClothing();
  const navigation = useNavigation();
  const numColumns = 4;

  const activeFilters = useActiveClothingFilters();
  const [filteredClothes, setFilteredClothes] = useState(clothes);

  useEffect(() => {
    applyFilters();
  }, [clothes, activeFilters]);

  const screenWidth = Dimensions.get('window').width;
  const imageWidth = screenWidth / numColumns;
  const imageHeight = imageWidth * 1.75;

  const navigateToClothingForm = (clothing) => {
    navigation.navigate('ClothingForm', { clothingToEdit: clothing });
  };

  const openFilter = () => {
    navigation.navigate('FilterClothing');
  };

  const applyFilters = () => {
    if (Object.keys(activeFilters).length === 0) {
      setFilteredClothes(clothes);
      return;
    }

    const filtered = clothes.filter((item) => {
      return Object.keys(activeFilters).every((category) => {
        const categoryTags = activeFilters[category];
        return categoryTags.every((tag) => item[`${category.toLowerCase()}Tags`]?.includes(tag));
      });
    });

    setFilteredClothes(filtered);
  };

  const handlePress = (clothing) => {
    navigation.navigate('ClothingForm', { clothingToEdit: clothing });
  };

  const deleteClothing = async () => {
    if (clothingToEdit) {
      await removeClothing(clothingToEdit.id);
      navigation.goBack();
    }
  };

  const handleLongPress = (clothing) => {
    Alert.alert(
      'What do you want to do?',
      '',
      [
        { text: 'Delete', onPress: () => deleteClothing() },
        { text: 'Edit', onPress: () => navigateToClothingForm(clothing) },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={filteredClothes}
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
          <Text style={styles.emptyText}>
            {Object.keys(activeFilters).length > 0 
              ? "You don't have any clothes with these filters..." 
              : "You don't have any clothes...\n Add some by pressing '+'!"}
          </Text>
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
    color: 'gray',
    marginTop: 30,
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
