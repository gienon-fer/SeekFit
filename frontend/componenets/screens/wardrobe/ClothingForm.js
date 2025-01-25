import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';
import { useWardrobe } from '../../../contexts/WardrobeContext';
import { useClothingTagValues } from '../../../contexts/ClothingTagValuesContext'; 
import TagsInput from '../../TagsInput';
import ImageTagsInput from '../../ImageTagsInput'; // Import ImageTagsInput
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
//import ImageSelectionModal from '../../ImageSelectionModal';
//import * as ImageManipulator from 'expo-image-manipulator';
//import ImagePicker from 'react-native-image-crop-picker';

export default function ClothingForm({ route, navigation }) {
  const { addClothing, editClothing, removeClothing } = useWardrobe();
  const { clothingToEdit } = route.params || {};

  const [image, setImage] = useState(clothingToEdit ? clothingToEdit.image : null);
  const [description, setDescription] = useState(clothingToEdit ? clothingToEdit.description : '');
  const [colorTags, setColorTags] = useState(clothingToEdit ? clothingToEdit.tags.colorTags : []);
  const [typeTags, setTypeTags] = useState(clothingToEdit ? clothingToEdit.tags.typeTags : []);
  const [materialTags, setMaterialTags] = useState(clothingToEdit ? clothingToEdit.tags.materialTags : []);
  const [statusTags, setStatusTags] = useState(clothingToEdit ? clothingToEdit.tags.statusTags : []);
  const [sizeTags, setSizeTags] = useState(clothingToEdit ? (Array.isArray(clothingToEdit.tags.sizeTags) ? clothingToEdit.tags.sizeTags[0] : clothingToEdit.tags.sizeTags) : undefined);
  const [open, setOpen] = useState(false);
  const clothingTagValues = useClothingTagValues(); 
  const [items, setItems] = useState(clothingTagValues.Size.map(size => ({ label: size, value: size })) || []);

  const [washingTags, setWashingTags] = useState(clothingToEdit?.tags?.washingTags || []);
  const [bleachingTags, setBleachingTags] = useState(clothingToEdit?.tags?.bleachingTags || []);
  const [dryingTags, setDryingTags] = useState(clothingToEdit?.tags?.dryingTags || []);
  const [ironingTags, setIroningTags] = useState(clothingToEdit?.tags?.ironingTags || []);
  const [professionalTextileCareTags, setProfessionalTextileCareTags] = useState(clothingToEdit?.tags?.professionalTextileCareTags || []);

  const selectImage = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        //console.log('Permission status:', status);
        if (status !== 'granted') {
          alert('Permission to access gallery is required!');
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
        //console.log('Image URI:', result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  };

  const saveClothing = async () => {
    if (image) {
      const clothingData = { 
        image, 
        description, 
        tags: {
          washingTags,
          bleachingTags,
          dryingTags,
          ironingTags,
          professionalTextileCareTags,
          colorTags, 
          typeTags,
          materialTags,
          statusTags,
          sizeTags,
        }
      };

      if (clothingToEdit) {
        await editClothing(clothingToEdit.id, clothingData);
      } else {
        await addClothing(clothingData); // Call addClothing which triggers the POST action
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

    // image crop
    // <TouchableOpacity 
    //     style={styles.imagePicker} 
    //     onPress={() => setIsImageModalVisible(true)}
    //   >
    //     {image ? (
    //       <>
    //         <Image source={{ uri: image }} style={styles.image} />
    //         <TouchableOpacity 
    //           style={styles.cropButton} 
    //           onPress={handleCropImage}
    //         >
    //           <Text style={styles.cropButtonText}>Crop</Text>
    //         </TouchableOpacity>
    //       </>
    //     ) : (
    //       <Text style={styles.imagePickerText}>Add Picture +</Text>
    //     )}
    // </TouchableOpacity>
    
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity 
        style={styles.imagePicker} 
        onPress={() => selectImage()}
      >
        {image ? (
          <>
            <Image source={{ uri: image }} style={styles.image} />
          </>
        ) : (
          <Text style={styles.imagePickerText}>Add Picture +</Text>
        )}
      </TouchableOpacity>

      <DropDownPicker
        open={open}
        value={sizeTags}
        items={items}
        setOpen={setOpen}
        setValue={setSizeTags}
        setItems={setItems}
        placeholder="Select a size"
        containerStyle={{ marginBottom: 20 }}
        zIndex={6000}
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
        values={clothingTagValues.Type}
        onTagsChange={setTypeTags}
      />
      <TagsInput 
        name={'Color'}
        tags={colorTags}
        values={clothingTagValues.Color}
        onTagsChange={setColorTags}
      />
      <TagsInput 
        name={'Material'}
        tags={materialTags}
        values={clothingTagValues.Material}
        onTagsChange={setMaterialTags}
      />
      <TagsInput 
        name={'Status'}
        tags={statusTags}
        values={clothingTagValues.Status}
        onTagsChange={setStatusTags}
      />
      <ImageTagsInput
        name={'Washing'}
        tags={washingTags}
        onTagsChange={setWashingTags}
      />
      <ImageTagsInput
        name={'Bleaching'}
        tags={bleachingTags}
        onTagsChange={setBleachingTags}
      />
      <ImageTagsInput
        name={'Drying'}
        tags={dryingTags}
        onTagsChange={setDryingTags}
      />
      <ImageTagsInput
        name={'Ironing'}
        tags={ironingTags}
        onTagsChange={setIroningTags}
      />
      <ImageTagsInput
        name={'Professional Textile Care'}
        tags={professionalTextileCareTags}
        onTagsChange={setProfessionalTextileCareTags}
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
  cropButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(33, 150, 243, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  cropButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
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