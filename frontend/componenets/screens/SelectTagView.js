import React from 'react';
import { View, Text, ScrollView, Button, StyleSheet, TouchableOpacity } from 'react-native';

const SelectTagView = ({ values = [], onCancel, onSelect }) => {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        {values.map((value, index) => (
          <TouchableOpacity key={index} onPress={() => onSelect(value)}>
            <Text style={styles.valueText}>{value}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.cancelButtonContainer}>
        <Button title="Cancel" onPress={onCancel} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollView: {
    flex: 1,
    marginBottom: -10,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  valueText: {
    padding: 10,
    fontSize: 18,
  },
  cancelButtonContainer: {
    width: '100%',
    padding: 10,
    backgroundColor: '#fff',
  },
});

export default SelectTagView;