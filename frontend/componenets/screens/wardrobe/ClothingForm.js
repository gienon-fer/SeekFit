// screens/wardrobe/EditClothing.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet, ScrollView} from 'react-native';
import { useClothing } from '../../../contexts/ClothingContext';
import TagsInput from '../../TagsInput';
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import ImageSelectionModal from '../../ImageSelectionModal';

export default function ClothingForm({ route, navigation }) {
  const { addClothing, editClothing, removeClothing } = useClothing();
  const { clothingToEdit } = route.params || {};

  const [image, setImage] = useState(clothingToEdit ? clothingToEdit.image : null);
  const [description, setDescription] = useState(clothingToEdit ? clothingToEdit.description : '');
  const [colorTags, setColorTags] = useState(clothingToEdit ? clothingToEdit.colorTags : []);
  const [typeTags, setTypeTags] = useState(clothingToEdit ? clothingToEdit.weatherTags : []);
  const [materialTags, setMaterialTags] = useState(clothingToEdit ? clothingToEdit.materialTags : []);
  const [statusTags, setStatusTags] = useState(clothingToEdit ? clothingToEdit.statusTags : []);
  const [size, setSize] = useState(clothingToEdit ? clothingToEdit.size : null);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'XS', value: 'XS' },
    { label: 'S', value: 'S' },
    { label: 'M', value: 'M' },
    { label: 'L', value: 'L' },
    { label: 'XL', value: 'XL' },
  ]);

  const colorValues = ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Pink', 'Brown', 'Black', 'White', 'Grey', 'Brown', 'Beige'];
  const materialValues = ['Cotton', 'Polyester', 'Wool', 'Silk', 'Linen', 'Leather'];
  const statusValues = ['Borrowed', 'In Wash', 'Unavailable'];
  const typeValues = [
    "Tops",
    "Trousers and shorts",
    "Footwear",
    "Dresses",
    "Coats",
    "Jackets",
    "Skirts",
    "Sportswear",
    "Suits",
    "Handwear",
    "Accessories",
    "Outerwear"
  ];

  const handleImageSelected = (selectedImage) => {
    setImage(selectedImage);
  };

  const saveClothing = async () => {
    if (image) {
      const clothingData = { 
        image, 
        description, 
        colorTags, 
        typeTags,
        materialTags,
        statusTags,
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
      <TouchableOpacity 
        style={styles.imagePicker} 
        onPress={() => setIsImageModalVisible(true)}
      >
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.imagePickerText}>Add Picture +</Text>
        )}
      </TouchableOpacity>

      <ImageSelectionModal
        visible={isImageModalVisible}
        onClose={() => setIsImageModalVisible(false)}
        onImageSelected={handleImageSelected}
      />

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TagsInput 
        name={'Type'}
        tags={typeTags}
        values={typeValues}
        onTagsChange={setTypeTags}
      />
      <TagsInput 
        name={'Color'}
        tags={colorTags}
        values={colorValues}
        onTagsChange={setColorTags}
      />
      <TagsInput 
        name={'Material'}
        tags={materialTags}
        values={materialValues}
        onTagsChange={setMaterialTags}
      />
      <TagsInput 
        name={'Status'}
        tags={statusTags}
        values={statusValues}
        onTagsChange={setStatusTags}
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

      <View style={clothingToEdit ? styles.buttonContainer : styles.singleButtonContainer}>
        <TouchableOpacity 
          style={clothingToEdit ? styles.saveButton : styles.fullWidthSaveButton} 
          onPress={saveClothing}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>

        {clothingToEdit && (
          <TouchableOpacity style={styles.deleteButton} onPress={deleteClothing}>
            <Ionicons name="trash" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>
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
    borderRadius: 10,
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
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    width: '80%',
  },
  fullWidthSaveButton: {
    backgroundColor: '#28a745',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    width: '100%',
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
    width: '18%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  singleButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});