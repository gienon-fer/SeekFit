// screens/wardrobe/EditClothing.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet, ScrollView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import * as ImagePicker from 'expo-image-picker';
import { useClothing } from '../../../contexts/ClothingContext';
import { useNavigation } from '@react-navigation/native';
import TagsInput from '../../TagsInput';

export default function ClothingForm({ route, navigation }) {
  const { addClothing, editClothing, removeClothing } = useClothing();
  const { clothingToEdit } = route.params || {};

  const [image, setImage] = useState(clothingToEdit ? clothingToEdit.image : null);
  const [description, setDescription] = useState(clothingToEdit ? clothingToEdit.description : '');
  const [colorTags, setColorTags] = useState(clothingToEdit ? clothingToEdit.colorTags : []);
  const [weatherTags, setWeatherTags] = useState(clothingToEdit ? clothingToEdit.weatherTags : []);
  const colorValues = ['Red', 'Blue', 'Green', 'Yellow', 'Black', 'White'];
  const weatherValues = ['Rain', 'Snow', 'Wind'];
  const [size, setSize] = useState(clothingToEdit ? clothingToEdit.size : null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'XS', value: 'XS' },
    { label: 'S', value: 'S' },
    { label: 'M', value: 'M' },
    { label: 'L', value: 'L' },
    { label: 'XL', value: 'XL' },
  ]);

  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const saveClothing = async () => {
    if (image) {
      const clothingData = { 
        image, 
        description, 
        colorTags, 
        weatherTags, 
        size
      };

      if (clothingToEdit) {
        await editClothing(clothingToEdit.id, clothingData);
      } else {
        const newClothing = { id: new Date().toString(), ...clothingData };
        await addClothing(newClothing);
      }

      navigation.goBack();
    } else {
      alert('Please add an image.');
    }
  };

  const deleteClothing = async () => {
    if (clothingToEdit) {
      await removeClothing(clothingToEdit.id);
      navigation.goBack();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.imagePicker} onPress={selectImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.imagePickerText}>Add Picture +</Text>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TagsInput 
        name={'Color'}
        tags={colorTags}
        values={colorValues}
        onTagsChange={setColorTags}
      />
      <TagsInput 
        name={'Weather Conditions'}
        tags={weatherTags}
        values={weatherValues}
        onTagsChange={setWeatherTags}
      />

      <DropDownPicker
        open={open}
        value={size}
        items={items}
        setOpen={setOpen}
        setValue={setSize}
        setItems={setItems}
        placeholder="Select a size"
        containerStyle={{ marginBottom: 20 }}
        zIndex={5000}
      />

      <TouchableOpacity style={styles.saveButton} onPress={saveClothing}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>

      {clothingToEdit && (
        <TouchableOpacity style={styles.deleteButton} onPress={deleteClothing}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  imagePicker: {
    height: 600,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePickerText: {
    fontSize: 16,
    color: '#888',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
  },
});