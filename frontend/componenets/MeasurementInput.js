import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';

const MeasurementInput = ({ label, value, onChangeValue, min, max, unit }) => {
  const [input, setInput] = useState(value);

  const handleEndEditing = () => {
    const num = parseFloat(input);

    if (isNaN(num) || num < min || num > max) {
      Alert.alert(
        'Invalid Input',
        `${label} value should be between ${min} ${unit} and ${max} ${unit}.`
      );
      setInput(value); 
    } else {
      onChangeValue(input); 
    }
  };

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={`Enter ${label.toLowerCase()}`}
          keyboardType="numeric"
          value={input}
          onChangeText={setInput}
          onEndEditing={handleEndEditing}
        />
        <Text style={styles.unit}>{unit}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    flex: 1,
  },
  inputContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 40,
  },
  unit: {
    marginLeft: 8,
    fontSize: 16,
    color: '#555',
  },
});

export default MeasurementInput;
