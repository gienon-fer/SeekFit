import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

const Planner = () => {
  return (
    <View style={styles.container}>
      <Calendar
        // Initially visible month. Default = now
        initialDate={new Date().toISOString().split('T')[0]}
        // Minimum date that can be selected, dates before minDate will be grayed out
        minDate={new Date().toISOString().split('T')[0]}
        // Handler which gets executed on day press
        onDayPress={day => {
          console.log('selected day', day);
        }}
        // Handler which gets executed on day long press
        onDayLongPress={day => {
          console.log('selected day', day);
        }}
        // Month format in calendar title
        monthFormat={'MMMM yyyy'}
        // Enable the option to switch months
        enableSwipeMonths={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});

export default Planner;