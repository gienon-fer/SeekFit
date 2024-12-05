import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';

const UserProfileScreen = () => {
  const [height, setHeight] = useState('');
  const [shoeSize, setShoeSize] = useState('');
  const [chest, setChest] = useState('');
  const [waist, setWaist] = useState('');
  const [hips, setHips] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '<292694167327-5s1uh3512vkn2aebclm5hchicokjmpa6.apps.googleusercontent.com>',
    });
  }, []);

  const handleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUserInfo(userInfo);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      } else if (error.code === statusCodes.IN_PROGRESS) {
      } else {
        Alert.alert('Error', error.message);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await GoogleSignin.signOut();
      setUserInfo(null);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleSave = () => {
    if (!height || !shoeSize || !chest || !waist || !hips) {
      Alert.alert('Invalid input', 'All measurement data must be filled.');
      return;
    }

    const errors = [];
    errors.push(validateMeasurement(height, 50, 250, 'Height'));
    errors.push(validateMeasurement(shoeSize, 1, 50, 'Shoe Size'));
    errors.push(validateMeasurement(chest, 70, 170, 'Chest'));
    errors.push(validateMeasurement(waist, 50, 125, 'Waist'));
    errors.push(validateMeasurement(hips, 70, 150, 'Hips'));

    const errorMessages = errors.filter((error) => error !== null);

    if (errorMessages.length > 0) {
      Alert.alert('Invalid Input', errorMessages.join('\n'));
    } else {
      Alert.alert('Success', 'Measurements saved successfully!');
    }
  };

  const validateMeasurement = (value, min, max, fieldName) => {
    const num = parseFloat(value);
    if (isNaN(num)) {
      return `${fieldName} value must be a number.`;
    }
    if (num < min || num > max) {
      return `${fieldName} must be between ${min} and ${max}.`;
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {/* User info */}
      {userInfo ? (
        <>
          <Text style={styles.username}>{userInfo.user.name}</Text>
          <Button title="Sign Out" onPress={handleSignOut} />
        </>
      ) : (
        <View style={styles.buttonContainer}>
          <Button title="Log In" onPress={handleSignIn} />
        </View>
      )}

      {/* Divider */}
      <View style={styles.divider} />

      {/* My Measurements Section */}
      <View style={styles.measurementsContainer}>
        <Text style={styles.sectionTitle}>My Measurements</Text>

        {/* Measurement Fields */}
        <View style={styles.measurementRow}>
          <Text style={styles.measurementLabel}>Height</Text>
          <TextInput
            style={styles.measurementInput}
            placeholder="Enter height"
            keyboardType="numeric"
            value={height}
            onChangeText={setHeight}
          />
        </View>

        <View style={styles.measurementRow}>
          <Text style={styles.measurementLabel}>Shoe Size</Text>
          <TextInput
            style={styles.measurementInput}
            placeholder="Enter shoe size"
            keyboardType="numeric"
            value={shoeSize}
            onChangeText={setShoeSize}
          />
        </View>

        <View style={styles.measurementRow}>
          <Text style={styles.measurementLabel}>Chest</Text>
          <TextInput
            style={styles.measurementInput}
            placeholder="Enter chest size"
            keyboardType="numeric"
            value={chest}
            onChangeText={setChest}
          />
        </View>

        <View style={styles.measurementRow}>
          <Text style={styles.measurementLabel}>Waist</Text>
          <TextInput
            style={styles.measurementInput}
            placeholder="Enter waist size"
            keyboardType="numeric"
            value={waist}
            onChangeText={setWaist}
          />
        </View>

        <View style={styles.measurementRow}>
          <Text style={styles.measurementLabel}>Hips</Text>
          <TextInput
            style={styles.measurementInput}
            placeholder="Enter hips size"
            keyboardType="numeric"
            value={hips}
            onChangeText={setHips}
          />
        </View>

        {/* Save Button */}
        <View style={styles.buttonContainer}>
          <Button title="Save Measurements" onPress={handleSave} />
        </View>
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
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
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
});

export default UserProfileScreen;