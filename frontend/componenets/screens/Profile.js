import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image
} from 'react-native';
import Auth from "../Auth";
import { useUser } from '../../contexts/UserContext';
import MeasurementInput from '../MeasurementInput';

const UserProfileScreen = () => {
  const { user, signOutUser, measurements, updateMeasurements } = useUser();

  useEffect(() => {
    //console.log('UserProfileScreen: Measurements updated:', measurements);
  }, [measurements]);

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={user?.photo ? { uri: user.photo } : require('../../assets/guest_icon.png')}
          style={styles.profileImage}
        />
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

      <View style={styles.measurementsContainer}>
        <Text style={styles.sectionTitle}>My Measurements</Text>

        <MeasurementInput
          label="Height"
          value={measurements.height}
          onChangeValue={(value) => {
            console.log('Height changed:', value);
            updateMeasurements({ ...measurements, height: value });
          }}
          min={50}
          max={250}
          unit="cm"
        />
        <MeasurementInput
          label="Shoe Size"
          value={measurements.shoe_size}
          onChangeValue={(value) => {
            console.log('Shoe Size changed:', value);
            updateMeasurements({ ...measurements, shoe_size: value });
          }}
          min={1}
          max={50}
          unit="EU size"
        />
        <MeasurementInput
          label="Chest"
          value={measurements.chest}
          onChangeValue={(value) => {
            console.log('Chest changed:', value);
            updateMeasurements({ ...measurements, chest: value });
          }}
          min={70}
          max={170}
          unit="cm"
        />
        <MeasurementInput
          label="Waist"
          value={measurements.waist}
          onChangeValue={(value) => {
            console.log('Waist changed:', value);
            updateMeasurements({ ...measurements, waist: value });
          }}
          min={50}
          max={125}
          unit="cm"
        />
        <MeasurementInput
          label="Hips"
          value={measurements.hips}
          onChangeValue={(value) => {
            console.log('Hips changed:', value);
            updateMeasurements({ ...measurements, hips: value });
          }}
          min={70}
          max={150}
          unit="cm"
        />
        {!user && (
            <Text style={{ textAlign: 'center', color: 'red', marginTop: 20 }}>
                Log in to store measurements permanently!
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
});

export default UserProfileScreen;
