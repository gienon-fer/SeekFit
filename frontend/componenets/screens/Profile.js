import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  Alert,
  TouchableOpacity,
  Modal
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Auth from "../Auth";
import { useUser } from '../../contexts/UserContext';
import MeasurementInput from '../MeasurementInput';
import { useWardrobe } from '../../contexts/WardrobeContext';

const UserProfileScreen = () => {
  const { user, signOutUser, measurements, updateMeasurements } = useUser();
  const { resetAllWardrobeData } = useWardrobe();
  const [isResetting, setIsResetting] = useState(false);
  const [profileClickCount, setProfileClickCount] = useState(0);
  const [resetModalVisible, setResetModalVisible] = useState(false);

  useEffect(() => {
    //console.log('UserProfileScreen: Measurements updated:', measurements);
  }, [measurements]);

  // Reset click count when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setProfileClickCount(0);
    }, [])
  );

  const handleResetData = () => {
    Alert.alert(
      "Reset App Data",
      "This will delete all clothing and outfit data. Are you sure you want to continue?",
      [
        { 
          text: "Cancel", 
          style: "cancel" 
        },
        { 
          text: "Reset", 
          style: "destructive", 
          onPress: async () => {
            setIsResetting(true);
            try {
              await resetAllWardrobeData();
              Alert.alert("Success", "All wardrobe data has been cleared successfully.");
            } catch (error) {
              Alert.alert("Error", "Failed to reset data. Please try again.");
            } finally {
              setIsResetting(false);
              setResetModalVisible(false);
            }
          } 
        }
      ]
    );
  };

  const handleProfileClick = () => {
    const newCount = profileClickCount + 1;
    setProfileClickCount(newCount);
    
    if (newCount >= 5) {
      setResetModalVisible(true);
      setProfileClickCount(0); // Reset count after showing modal
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={handleProfileClick}>
          <Image
            source={user?.photo ? { uri: user.photo } : require('../../assets/guest_icon.png')}
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <Text style={styles.username}>{user ? user.name : 'Guest User'}</Text>
      </View>
      <View style={styles.divider} />

      <View style={styles.buttonContainer}>
        {user ? (
          <Button title="Sign Out" onPress={() => {
            console.log('Sign out button pressed.');
            signOutUser();
          }} />
        ) : (
          <Auth />
        )}
      </View>

      {/* Reset Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={resetModalVisible}
        onRequestClose={() => setResetModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.resetSection}>
            <Text style={styles.sectionTitle}>Data Management</Text>
            <Text style={styles.description}>
              If you're experiencing issues with missing images or incorrect data, you can reset the app data.
            </Text>
            <TouchableOpacity 
              style={styles.resetButton} 
              onPress={handleResetData}
              disabled={isResetting}
            >
              <Text style={styles.resetButtonText}>
                {isResetting ? "Resetting..." : "Reset App Data"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setResetModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.measurementsContainer}>
        <Text style={styles.sectionTitle}>My Measurements</Text>

        <MeasurementInput
          label="Height"
          value={user ? measurements.height : ''}
          placeholder="Login to set height"
          onChangeValue={(value) => {
            console.log('Height changed:', value);
            updateMeasurements({ ...measurements, height: value });
          }}
          min={50}
          max={250}
          unit="cm"
          disabled={!user}
        />
        <MeasurementInput
          label="Shoe Size"
          value={user ? measurements.shoe_size : ''}
          placeholder="Login to set shoe size"
          onChangeValue={(value) => {
            console.log('Shoe Size changed:', value);
            updateMeasurements({ ...measurements, shoe_size: value });
          }}
          min={1}
          max={50}
          unit="EU size"
          disabled={!user}
        />
        <MeasurementInput
          label="Chest"
          value={user ? measurements.chest : ''}
          placeholder="Login to set chest size"
          onChangeValue={(value) => {
            console.log('Chest changed:', value);
            updateMeasurements({ ...measurements, chest: value });
          }}
          min={70}
          max={170}
          unit="cm"
          disabled={!user}
        />
        <MeasurementInput
          label="Waist"
          value={user ? measurements.waist : ''}
          placeholder="Login to set waist size"
          onChangeValue={(value) => {
            console.log('Waist changed:', value);
            updateMeasurements({ ...measurements, waist: value });
          }}
          min={50}
          max={125}
          unit="cm"
          disabled={!user}
        />
        <MeasurementInput
          label="Hips"
          value={user ? measurements.hips : ''}
          placeholder="Login to set hips size"
          onChangeValue={(value) => {
            console.log('Hips changed:', value);
            updateMeasurements({ ...measurements, hips: value });
          }}
          min={70}
          max={150}
          unit="cm"
          disabled={!user}
        />
        {!user && (
            <Text style={{ textAlign: 'center', color: 'red', marginTop: 20 }}>
                Log in to store measurements, {"\n"}
                clothes, and outfits permanently!
            </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 25,
    marginRight: 12,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 10
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 16,
  },
  buttonContainer: {
    marginVertical: 16,
    paddingHorizontal: 50,
    alignSelf: 'center',
  },
  measurementsContainer: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'left',
  },
  measurementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  measurementLabel: {
    fontSize: 16,
    flex: 1,
  },
  measurementInput: {
    flex: 2,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  resetSection: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  description: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  resetButton: {
    backgroundColor: '#ff5252',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});

export default UserProfileScreen;
