import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
} from 'react-native';

const UserProfileScreen = () => {
  return (
    <View style={styles.container}>
      {/* Username Section */}
      <Text style={styles.username}>Guest User</Text>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Login Button */}
      <View style={styles.buttonContainer}>
        <Button title="Log In" onPress={() => {}} />
      </View>

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
          />
        </View>

        <View style={styles.measurementRow}>
          <Text style={styles.measurementLabel}>Shoe Size</Text>
          <TextInput
            style={styles.measurementInput}
            placeholder="Enter shoe size"
            keyboardType="numeric"
          />
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
