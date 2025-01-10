import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useOutfit } from '../../../contexts/OutfitContext';
import TagsInput from '../../TagsInput';

export default function OutfitForm({ route, navigation }) {
  const { addOutfit, editOutfit, removeOutfit } = useOutfit();
  const { outfitToEdit } = route.params || {};

  const [image, setImage] = useState(outfitToEdit ? outfitToEdit.image : null);
  const [description, setDescription] = useState(outfitToEdit ? outfitToEdit.description : '');
  const [styleTags, setStyleTags] = useState(outfitToEdit ? outfitToEdit.tags.style : []);
  const [occasionTags, setOccasionTags] = useState(outfitToEdit ? outfitToEdit.tags.occasion : []);
  const [temperatureTags, setTemperatureTags] = useState(outfitToEdit ? outfitToEdit.tags.temperature : []);
  const [weatherTags, setWeatherTags] = useState(outfitToEdit ? outfitToEdit.tags.weather : []);

  const styleValues = ['Casual', 'Formal', 'Sport', 'Party'];
  const occasionValues = ['Work', 'Date', 'Wedding', 'Birthday'];
  const temperatureValues = ['Below 0°C (Freezing)', '0°C to 10°C (Cold)', '10°C to 15°C (Cool)', '15°C to 20°C (Mild)', '20°C to 25°C (Warm)', '25°C to 30°C (Hot)', 'Above 30°C (Very Hot)'];
  const weatherValues = ['Rain', 'Snow', 'Wind'];

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

  const saveOutfit = async () => {
    if (image) {
      const outfitData = {
        image,
        description,
        tags: {
          style: styleTags,
          occasion: occasionTags,
          temperature: temperatureTags,
          weather: weatherTags,
        },
      };

      if (outfitToEdit) {
        await editOutfit(outfitToEdit.id, outfitData);
      } else {
        const newOutfit = { id: new Date().toString(), ...outfitData };
        await addOutfit(newOutfit);
      }

      navigation.goBack();
    } else {
      alert('Please add an image.');
    }
  };

  const deleteOutfit = async () => {
    if (outfitToEdit) {
      await removeOutfit(outfitToEdit.id);
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
        name={'Style'}
        tags={styleTags}
        values={styleValues}
        onTagsChange={setStyleTags}
      />
      <TagsInput 
        name={'Occasion'}
        tags={occasionTags}
        values={occasionValues}
        onTagsChange={setOccasionTags}
      />
      <TagsInput
        name={'Temperature'}
        tags={temperatureTags}
        values={temperatureValues}
        onTagsChange={setTemperatureTags}
      />
      <TagsInput
        name={'Weather'}
        tags={weatherTags}
        values={weatherValues}
        onTagsChange={setWeatherTags}
      />

      <TouchableOpacity style={styles.saveButton} onPress={saveOutfit}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>

      {outfitToEdit && (
        <TouchableOpacity style={styles.deleteButton} onPress={deleteOutfit}>
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
