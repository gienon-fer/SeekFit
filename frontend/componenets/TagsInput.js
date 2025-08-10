import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import SelectTagView from './screens/SelectTagView.js';

const TagsInput = ({ name, tags, values = [], onTagsChange }) => {
  const [showSelectTagView, setShowSelectTagView] = useState(false);
  const [currentTags, setCurrentTags] = useState(tags || []);
  const prevTagsRef = useRef(tags);

//   useEffect(() => {
//     setCurrentTags(tags || []);
//   }, [tags]);

  useEffect(() => {
    if (prevTagsRef.current !== currentTags) {
      onTagsChange(currentTags);
      prevTagsRef.current = currentTags;
    }
  }, [currentTags, onTagsChange]);

  const availableValues = values.filter(value => !currentTags.includes(value));

  const handleAddButtonPress = () => {
    if (availableValues.length > 0) {
      setShowSelectTagView(true);
    }
  };

  const handleCancel = () => {
    setShowSelectTagView(false);
  };

  const handleSelect = (value) => {
    setCurrentTags([...currentTags, value]);
    setShowSelectTagView(false);
  };

  const removeTag = (index) => {
    setCurrentTags(currentTags.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={handleAddButtonPress}>
          <Text style={styles.addButton}>+</Text>
        </TouchableOpacity>
        {name && <Text style={styles.name}>{name}</Text>}
      </View>
      <View style={styles.divider} />
      <View style={styles.tagsInputContainer}>
        {currentTags.length === 0 ? (
          <Text style={styles.placeholder}>Press + to add tags</Text>
        ) : (
          currentTags.map((tag, index) => (
            <View key={index} style={styles.tagItem}>
              <Text style={styles.text}>{tag}</Text>
              <TouchableOpacity onPress={() => removeTag(index)}>
                <Text style={styles.close}>&times;</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
      {showSelectTagView && availableValues.length > 0 && (
        <SelectTagView values={availableValues} onCancel={handleCancel} onSelect={handleSelect} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tagsInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 15
  },
  tagsInput: {
    flex: 1,
    height: 40,
    padding: 10,
  },
  addButton: {
    fontSize: 24,
    color: '#007BFF',
    paddingRight: 10,
    marginBottom: 10,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
    backgroundColor: '#cccccc', 
    borderRadius: 10,
    padding: 5,
  },
  text: {
    marginRight: 5,
  },
  close: {
    color: '#888',
    fontSize: 18,
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
  placeholder: {
    color: '#ccc',
    fontStyle: 'italic',
  },
});

export default TagsInput;