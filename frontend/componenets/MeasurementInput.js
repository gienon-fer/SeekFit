import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';

const MeasurementInput = ({ label, value, onChangeValue, min, max, unit, disabled, placeholder }) => {
  const [input, setInput] = useState(value);

  useEffect(() => {
    setInput(value);
  }, [value]);

  const handleEndEditing = () => {
    if (disabled) return;
    
    const num = parseFloat(input);
    console.log(input);
    if (input === null || isNaN(num) || num < min || num > max) {
      if (input !== null) {
        Alert.alert(
          'Invalid Input',
          `${label} value should be between ${min} ${unit} and ${max} ${unit}.`
        );
      }
      setInput(value); 
    } else {
      onChangeValue(input); 
    }
  };

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={[
        styles.inputContainer, 
        disabled && styles.disabledContainer
      ]}>
        <TextInput
          style={[styles.input, disabled && styles.disabledInput]}
          placeholder={disabled ? placeholder : `Enter ${label.toLowerCase()}`}
          placeholderTextColor={disabled ? "#999" : "#aaa"}
          keyboardType="numeric"
          value={input ? input.toString() : ''}
          onChangeText={setInput}
          onEndEditing={handleEndEditing}
          editable={!disabled}
        />
        <Text style={[styles.unit, disabled && styles.disabledText]}>{unit}</Text>
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
  disabledContainer: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    height: 40,
  },
  disabledInput: {
    color: '#999',
  },
  unit: {
    marginLeft: 8,
    fontSize: 16,
    color: '#555',
  },
  disabledText: {
    color: '#999',
  },
});

export default MeasurementInput;
