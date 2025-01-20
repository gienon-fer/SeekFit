import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useClothingTagValues } from '../../../contexts/ClothingTagValuesContext'; 
import { useActiveClothingFilters, useSetActiveClothingFilters } from '../../../contexts/ClothingFilterContext';

export default function FilterClothing() {
  const navigation = useNavigation();
  const clothingTagValues = useClothingTagValues(); 
  const activeFilters = useActiveClothingFilters(); 
  const setActiveFilters = useSetActiveClothingFilters(); 
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
      {Object.keys(clothingTagValues).map((category) => (
        <View key={category} style={styles.categoryContainer}>
          <Text style={styles.categoryName}>{category}</Text>
          <View style={styles.tagContainer}>
            {clothingTagValues[category].map((value) => (
                value = value.label ? value.label : value, 
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
