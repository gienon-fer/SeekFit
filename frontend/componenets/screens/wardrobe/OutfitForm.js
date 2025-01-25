import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet, ScrollView, Modal, FlatList, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useWardrobe } from '../../../contexts/WardrobeContext';
import { useOutfitTagValues } from '../../../contexts/OutfitTagValuesContext';
import TagsInput from '../../TagsInput';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
//import ImageSelectionModal from '../../ImageSelectionModal';
//import ImagePicker from 'react-native-image-crop-picker';

export default function OutfitForm({ route, navigation }) {
  const { addOutfit, editOutfit, removeOutfit, clothes } = useWardrobe();
  const { outfitToEdit } = route.params || {};
  const [image, setImage] = useState(outfitToEdit ? outfitToEdit.image : null);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [description, setDescription] = useState(outfitToEdit ? outfitToEdit.description : '');
  const [styleTags, setStyleTags] = useState(outfitToEdit ? outfitToEdit.tags.style : []);
  const [occasionTags, setOccasionTags] = useState(outfitToEdit ? outfitToEdit.tags.occasion : []);
  const [temperatureTags, setTemperatureTags] = useState(outfitToEdit ? outfitToEdit.tags.temperature : []);
  const [weatherTags, setWeatherTags] = useState(outfitToEdit ? outfitToEdit.tags.weather : []);
  const [selectedClothing, setSelectedClothing] = useState(outfitToEdit ? outfitToEdit.clothing : []);
  const [showClothingSelector, setShowClothingSelector] = useState(false);
  const [tempSelectedClothing, setTempSelectedClothing] = useState([...selectedClothing]);

  const outfitTagValues = useOutfitTagValues();
  const numColumns = 5;
  const screenWidth = Dimensions.get('window').width;
  const flatListWidth = screenWidth * 0.9;
  const imageWidth = (flatListWidth - 4) / numColumns;
  const imageHeight = imageWidth * 1.75;

  useFocusEffect(
    useCallback(() => {
      if (outfitToEdit) {
        //console.log('Outfit to edit:', outfitToEdit);
        setImage(outfitToEdit.image);
        setDescription(outfitToEdit.description);
        setStyleTags(outfitToEdit.tags.style);
        setOccasionTags(outfitToEdit.tags.occasion);
        setTemperatureTags(outfitToEdit.tags.temperature);
        setWeatherTags(outfitToEdit.tags.weather);
        
        // Update selected clothing with the most current images
        const updatedClothing = outfitToEdit.clothing.map(clothingItem => {
          const updatedItem = clothes.find(item => item.id === clothingItem.id);
          return updatedItem ? { ...clothingItem, image: updatedItem.image } : clothingItem;
        });
        setSelectedClothing(updatedClothing);
      }
    }, [outfitToEdit, clothes])
  );

  const handleImageSelected = (selectedImage) => {
    setImage(selectedImage);
  };

  const selectImage = async () => {
      try {

        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        //console.log('Permission status:', status);
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
          //console.log('Image URI:', result.assets[0].uri);
        }
      } catch (error) {
        console.error('Error selecting image:', error);
      }
    };

  const handleCropImage = async () => {
    if (!image) {
      alert('Please select an image first.');
      return;
    }
  
    try {
      const croppedImage = await ImagePicker.openCropper({
        path: image,  
        width: 300,   
        height: 300,  
        cropping: true,
      });

      if (croppedImage) {
        setImage(croppedImage.path);
      }
    } catch (error) {
      console.log('Error cropping image:', error);
      alert('Could not crop the image');
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
        clothing: selectedClothing,
      };
      if (outfitToEdit) {
        await editOutfit(outfitToEdit.id, outfitData);
      } else {
        const newOutfit = { id: new Date().toString(), ...outfitData };
        console.log(JSON.stringify(newOutfit));
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

  const toggleClothingSelection = (item) => {
    if (tempSelectedClothing.some(clothing => clothing.id === item.id)) {
      setTempSelectedClothing(tempSelectedClothing.filter(clothing => clothing.id !== item.id));
    } else {
      setTempSelectedClothing([...tempSelectedClothing, item]);
    }
  };

  const removeClothingItem = (index) => {
    const updatedClothing = selectedClothing.filter((_, i) => i !== index);
    setSelectedClothing(updatedClothing);
    setTempSelectedClothing(updatedClothing);
  };

  const ClothingSelector = () => (
    <Modal
      visible={showClothingSelector}
      animationType="fade"
      animationInTiming={0.00001}
      animationOutTiming={0.00001}
      onRequestClose={() => {
        setShowClothingSelector(false);
      }}
    >
      <View style={styles.clothingSelectorContainer}>
        <FlatList
          data={clothes}
          numColumns={numColumns}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => toggleClothingSelection(item)}>
              <Image
                source={{ uri: item.image }}
                style={[
                  styles.clothingImage,
                  { width: imageWidth, height: imageHeight },
                  tempSelectedClothing.some(clothing => clothing.id === item.id) && styles.selectedClothingImage
                ]}
              />
            </TouchableOpacity>
          )}
          contentContainerStyle={{ width: flatListWidth }}
        />
        <View style={styles.clothingSelectorButtons}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => {
              setSelectedClothing(tempSelectedClothing);
              setShowClothingSelector(false);
            }}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.discardButton}
            onPress={() => {
              setTempSelectedClothing([...selectedClothing]);
              setShowClothingSelector(false);
            }}
          >
            <Text style={styles.discardButtonText}>Discard</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

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
      
      {/* <ImageSelectionModal
        visible={isImageModalVisible}
        onClose={() => setIsImageModalVisible(false)}
        onImageSelected={handleImageSelected}
      /> */}

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TagsInput 
        name={'Style'}
        tags={styleTags}
        values={outfitTagValues.Style}
        onTagsChange={setStyleTags}
      />
      <TagsInput 
        name={'Occasion'}
        tags={occasionTags}
        values={outfitTagValues.Occasion}
        onTagsChange={setOccasionTags}
      />
      <TagsInput
        name={'Temperature'}
        tags={temperatureTags}
        values={outfitTagValues.Temperature}
        onTagsChange={setTemperatureTags}
      />
      <TagsInput
        name={'Weather'}
        tags={weatherTags}
        values={outfitTagValues.Weather}
        onTagsChange={setWeatherTags}
      />

      <View style={styles.clothingInputContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => setShowClothingSelector(true)}>
            <Text style={styles.addButton}>+</Text>
          </TouchableOpacity>
          <Text style={styles.name}>Clothing</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.clothingTagsContainer}>
          {selectedClothing.length === 0 ? (
            <Text style={styles.placeholder}>Press + to add clothing</Text>
          ) : (
            selectedClothing.map((item, index) => (
              <View key={index} style={styles.clothingTagItem}>
                <Image source={{ uri: item.image }} style={styles.clothingTagImage} />
                <TouchableOpacity onPress={() => removeClothingItem(index)}>
                  <Text style={styles.close}>&times;</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </View>

      <View style={outfitToEdit ? styles.buttonContainer : styles.singleButtonContainer}>
        <TouchableOpacity style={outfitToEdit ? styles.saveButton : styles.fullWidthSaveButton} onPress={saveOutfit}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>

        {outfitToEdit && (
          <TouchableOpacity style={styles.deleteButton} onPress={deleteOutfit}>
            <Ionicons name="trash" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>

      <ClothingSelector />
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  clothingInputContainer: {
    marginBottom: 20,
  },
  addButton: {
    fontSize: 24,
    color: '#007BFF',
    paddingRight: 10,
    marginBottom: 10,
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
  clothingTagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  clothingTagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
    backgroundColor: '#cccccc',
    borderRadius: 10,
    padding: 5,
  },
  clothingTagImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 5,
  },
  close: {
    color: '#888',
    fontSize: 18,
  },
  placeholder: {
    color: '#ccc',
    fontStyle: 'italic',
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

  clothingSelectorContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  clothingImage: {
    width: '100%',
    height: 100,
    margin: 0.2,
  },
  selectedClothingImage: {
    borderWidth: 2,
    borderColor: 'blue',
  },
  clothingSelectorButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  discardButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    width: '25%',
  },
  discardButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
