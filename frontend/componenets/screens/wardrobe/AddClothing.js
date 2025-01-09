// screens/wardrobe/AddClothing.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet, ScrollView, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useClothing } from '../../../contexts/ClothingContext';

export default function AddClothing({ navigation }) {
  const { addClothing } = useClothing();
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const takePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to use camera is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
    setModalVisible(false);
  };

  const selectFromGallery = async () => {
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
    setModalVisible(false);
  };

  const saveClothing = async () => {
    if (image) {
      const newClothing = { id: new Date().toString(), image, description: description || '' };
      await addClothing(newClothing);
      navigation.goBack();
    } else {
      alert('Please add an image.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity 
        style={styles.imagePicker} 
        onPress={() => setModalVisible(true)}
      >
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.imagePickerText}>Add Picture +</Text>
        )}
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={takePicture}
            >
              <Text style={styles.modalButtonText}>Take a Picture</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={selectFromGallery}
            >
              <Text style={styles.modalButtonText}>Choose from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalButton: {
    width: '100%',
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  modalButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#dc3545',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
});
