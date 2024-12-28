// screens/wardrobe/EditClothing.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useClothing } from '../../../contexts/ClothingContext';
import { useNavigation } from '@react-navigation/native';

export default function EditClothing({ route, navigation }) {
  const { clothes, editClothing, removeClothing } = useClothing(); 
  const { clothingToEdit } = route.params;  

  const [image, setImage] = useState(clothingToEdit.image); 
  const [description, setDescription] = useState(clothingToEdit.description);

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
    if (image && description) {
      const updatedClothing = { image, description };
      await editClothing(clothingToEdit.id, updatedClothing); 
      navigation.goBack();
    } else {
      alert('Please add an image.');
    }
  };

  const deleteClothing = async () => {
    await removeClothing(clothingToEdit.id); 
    navigation.goBack();
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

      <TouchableOpacity style={styles.saveButton} onPress={saveClothing}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={deleteClothing}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
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