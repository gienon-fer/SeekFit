import React, { useState } from 'react';
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
  const { user, signOutUser } = useUser();
  const [height, setHeight] = useState('');
  const [shoeSize, setShoeSize] = useState('');
  const [chest, setChest] = useState('');
  const [waist, setWaist] = useState('');
  const [hips, setHips] = useState('');

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
          <Button title="Sign Out" onPress={signOutUser} />
        ) : (
          <Auth />
        )}
      </View>

      <View style={styles.measurementsContainer}>
        <Text style={styles.sectionTitle}>My Measurements</Text>

        <MeasurementInput
          label="Height"
          value={height}
          onChangeValue={setHeight}
          min={50}
          max={250}
          unit="cm"
        />
        <MeasurementInput
          label="Shoe Size"
          value={shoeSize}
          onChangeValue={setShoeSize}
          min={1}
          max={50}
          unit="EU size"
        />
        <MeasurementInput
          label="Chest"
          value={chest}
          onChangeValue={setChest}
          min={70}
          max={170}
          unit="cm"
        />
        <MeasurementInput
          label="Waist"
          value={waist}
          onChangeValue={setWaist}
          min={50}
          max={125}
          unit="cm"
        />
        <MeasurementInput
          label="Hips"
          value={hips}
          onChangeValue={setHips}
          min={70}
          max={150}
          unit="cm"
        />
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
