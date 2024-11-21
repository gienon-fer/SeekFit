import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function AddClothing({ route, navigation }) {
  const { addClothing } = route.params;  // Get the addClothing function from props
  const [image, setImage] = useState(null);  // Store the selected image
  const [description, setDescription] = useState('');  // Store the description

  // Handle image selection
  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,  // Use the new MediaType API
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);  // Update the state with the selected image
    }
  };

  // Handle saving the clothing
  const saveClothing = () => {
    if (image && description) {
      const newClothing = { image, description };
      addClothing(newClothing);  // Call the addClothing function passed via props
      navigation.goBack();  // Go back to the previous screen
    } else {
      alert('Please add an image and description.');
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

      <TouchableOpacity style={styles.saveButton} onPress={saveClothing}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  imagePicker: {
    height: 200,
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
    backgroundColor: 'blue',
    padding: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
  },
});
