import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useOutfitTagValues } from '../../../contexts/OutfitTagValuesContext'; // Import useOutfitTagValues
import { useActiveOutfitFilters, useSetActiveOutfitFilters } from '../../../contexts/OutfitFilterContext'; // Import outfit filter context

export default function FilterOutfit() {
  const navigation = useNavigation();
  const outfitTagValues = useOutfitTagValues(); // Use the hook to get tag values
  const activeFilters = useActiveOutfitFilters(); // Use the hook to get active filters
  const setActiveFilters = useSetActiveOutfitFilters(); // Use the hook to set active filters
  const [selectedTags, setSelectedTags] = useState(activeFilters || {});

  useEffect(() => {
    setSelectedTags(activeFilters);
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

  const applyFilters = () => {
    const isEmpty = Object.keys(selectedTags).every(
      (category) => selectedTags[category].length === 0
    );

    if (isEmpty) {
      setSelectedTags({});
      setActiveFilters({});
    } else {
      setActiveFilters(selectedTags);
    }

    navigation.goBack();
  };

  const clearFilters = () => {
    setSelectedTags({});
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
    backgroundColor: '#ffc107',
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
  },
  applyButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
