import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { useClothingTagValues } from '../contexts/ClothingTagValuesContext';

const ImageTagsInput = ({ name, tags, onTagsChange }) => {
  const tagValues = useClothingTagValues();
  const [selectedTags, setSelectedTags] = useState(tags || []);

  useEffect(() => {
    onTagsChange(selectedTags);
  }, [selectedTags]);

  const toggleTag = (tag) => {
    setSelectedTags((prevSelectedTags) => {
      if (prevSelectedTags.includes(tag.label)) {
        return prevSelectedTags.filter((t) => t !== tag.label);
      } else {
        return [...prevSelectedTags, tag.label];
      }
    });
  };

  const screenWidth = Dimensions.get('window').width;
  const imageSize = screenWidth / 5 - 10; // 5 pictograms in a row with some margin

  const sanitizedCategoryName = name.replace(/\s+/g, '');

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {name && <Text style={styles.name}>{name}</Text>}
      </View>
      <View style={styles.divider} />
      <View style={styles.imageTagsContainer}>
        {tagValues[sanitizedCategoryName]?.map((tag) => (
          <TouchableOpacity key={`${sanitizedCategoryName}-${tag.label}`} onPress={() => toggleTag(tag)}>
            <Image
              source={tag.image}
              style={[
                styles.imageTag,
                { width: imageSize, height: imageSize },
                selectedTags.includes(tag.label) && styles.selectedImageTag,
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 20,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
    marginBottom: 3,
    marginTop: 0,
  },
  imageTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageTag: {
    margin: 5,
    borderRadius: 5,
  },
  selectedImageTag: {
    borderWidth: 2,
    borderColor: 'blue',
  },
  imageTagLabel: {
    textAlign: 'center',
    marginTop: 5,
  },
});

export default ImageTagsInput;
