import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useOutfitTagValues } from '../../../contexts/OutfitTagValuesContext'; // Import useOutfitTagValues
import { useActiveOutfitFilters, useSetActiveOutfitFilters } from '../../../contexts/OutfitFilterContext'; // Import outfit filter context
import { useClothing } from '../../../contexts/ClothingContext'; // Import useClothing

export default function FilterOutfit() {
  const navigation = useNavigation();
  const outfitTagValues = useOutfitTagValues(); // Use the hook to get tag values
  const activeFilters = useActiveOutfitFilters(); // Use the hook to get active filters
  const setActiveFilters = useSetActiveOutfitFilters(); // Use the hook to set active filters
  const { clothes } = useClothing(); // Use the hook to get clothing items
  const [selectedTags, setSelectedTags] = useState(activeFilters || {});
  const [selectedClothing, setSelectedClothing] = useState(activeFilters.clothing || []);

  useEffect(() => {
    setSelectedTags(activeFilters);
    setSelectedClothing(activeFilters.clothing || []);
  }, [activeFilters]);

  const toggleTag = (category, value) => {
    setSelectedTags((prevSelectedTags) => {
      const categoryTags = prevSelectedTags[category] || [];
      if (categoryTags.includes(value)) {
        return {
          ...prevSelectedTags,
          [category]: categoryTags.filter((tag) => tag !== value),
        };
      } else {
        return {
          ...prevSelectedTags,
          [category]: [...categoryTags, value],
        };
      }
    });
  };

  const toggleClothingSelection = (item) => {
    if (selectedClothing.some(clothing => clothing.id === item.id)) {
      setSelectedClothing(selectedClothing.filter(clothing => clothing.id !== item.id));
    } else {
      setSelectedClothing([...selectedClothing, item]);
    }
  };

  const applyFilters = () => {
    const isEmpty = Object.keys(selectedTags).every(
      (category) => selectedTags[category].length === 0
    ) && selectedClothing.length === 0;

    if (isEmpty) {
      setSelectedTags({});
      setSelectedClothing([]);
      setActiveFilters({});
    } else {
      setActiveFilters({ ...selectedTags, clothing: selectedClothing });
    }

    navigation.goBack();
  };

  const clearFilters = () => {
    setSelectedTags({});
    setSelectedClothing([]);
    setActiveFilters({});
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
        <Text style={styles.buttonText}>Clear Filters</Text>
      </TouchableOpacity>
      {Object.keys(outfitTagValues).map((category) => (
        <View key={category} style={styles.categoryContainer}>
          <Text style={styles.categoryName}>{category}</Text>
          <View style={styles.tagContainer}>
            {outfitTagValues[category].map((value) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.tagButton,
                  selectedTags[category]?.includes(value) && styles.selectedTagButton,
                ]}
                onPress={() => toggleTag(category, value)}
              >
                <Text style={styles.tagButtonText}>{value}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryName}>Clothing</Text>
        <View style={styles.clothingContainer}>
          {clothes.map((item) => (
            <TouchableOpacity key={item.id} onPress={() => toggleClothingSelection(item)}>
              <Image
                source={{ uri: item.image }}
                style={[
                  styles.clothingImage,
                  selectedClothing.some(clothing => clothing.id === item.id) && styles.selectedClothingImage
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
          <Text style={styles.buttonText}>Apply Filters</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  clearButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagButton: {
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
    margin: 5,
  },
  selectedTagButton: {
    backgroundColor: 'blue',
  },
  tagButtonText: {
    color: 'white',
  },
  clothingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  clothingImage: {
    width: 70,
    height: 70,
    margin: 5,
  },
  selectedClothingImage: {
    borderWidth: 2,
    borderColor: 'blue',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
    width: '28%',
  },
  applyButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    width: '68%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});
