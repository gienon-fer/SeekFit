import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
  Dimensions,
  Alert
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Feather, Ionicons } from '@expo/vector-icons';
import { fetchWeatherForecast } from '../WeatherLocationService';
import { useNavigation } from '@react-navigation/native';
import { useOutfit } from '../../contexts/OutfitContext';
import { useActiveOutfitFilters } from '../../contexts/OutfitFilterContext';

const PlannerScreen = () => {
  const navigation = useNavigation();
  const { outfits, removeOutfit } = useOutfit();
  const activeFilters = useActiveOutfitFilters();
  
  const [weatherData, setWeatherData] = useState(null);
  const [sixDayForecast, setSixDayForecast] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [showOutfitPicker, setShowOutfitPicker] = useState(false);
  const [calendarOutfits, setCalendarOutfits] = useState({});
  const [filteredOutfits, setFilteredOutfits] = useState(outfits);

  // Screen dimensions for outfit grid
  const numColumns = 4;
  const screenWidth = Dimensions.get('window').width;
  const imageWidth = screenWidth / numColumns;
  const imageHeight = imageWidth * 1.75;

  useEffect(() => {
    loadWeatherData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [outfits, activeFilters]);

  // Filter outfits based on active filters
  const applyFilters = () => {
    if (Object.keys(activeFilters).length === 0) {
      setFilteredOutfits(outfits);
      return;
    }

    const filtered = outfits.filter((item) => {
      return Object.keys(activeFilters).every((category) => {
        const categoryTags = activeFilters[category];
        return categoryTags.every((tag) => item.tags[category.toLowerCase()]?.includes(tag));
      });
    });

    setFilteredOutfits(filtered);
  };

  const loadWeatherData = async () => {
    try {
      const forecast = await fetchWeatherForecast();
      if (forecast?.list) {
        setWeatherData(forecast);
        processSixDayForecast(forecast.list);
      }
    } catch (error) {
      console.error('Error loading weather:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const processSixDayForecast = (forecastList) => {
    const uniqueDays = {};
    const today = new Date().setHours(0, 0, 0, 0);
    
    forecastList.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dateString = date.toISOString().split('T')[0];
      
      if (date.setHours(0, 0, 0, 0) >= today && !uniqueDays[dateString]) {
        uniqueDays[dateString] = {
          date: dateString,
          temp: Math.round(item.main.temp),
          icon: item.weather[0].icon,
          description: item.weather[0].description,
          humidity: item.main.humidity,
          windSpeed: item.wind.speed
        };
      }
    });

    setSixDayForecast(Object.values(uniqueDays).slice(0, 6));
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setShowOutfitPicker(true);
  };

  const handleOutfitSelect = (outfit) => {
    setCalendarOutfits(prev => ({
      ...prev,
      [selectedDate]: outfit
    }));
    setShowOutfitPicker(false);
  };

  const handleOutfitLongPress = (outfit) => {
    Alert.alert(
      'What do you want to do?',
      '',
      [
        { text: 'Delete', onPress: () => removeOutfit(outfit.id) },
        { text: 'Edit', onPress: () => navigation.navigate('OutfitForm', { outfitToEdit: outfit }) },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  // Outfit picker modal
  const OutfitPickerModal = () => (
    <Modal
      visible={showOutfitPicker}
      animationType="slide"
      transparent={false}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Select Outfit for {selectedDate}</Text>
          <TouchableOpacity
            onPress={() => setShowOutfitPicker(false)}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={filteredOutfits}
          numColumns={numColumns}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleOutfitSelect(item)}
              onLongPress={() => handleOutfitLongPress(item)}
            >
              <Image 
                source={{ uri: item.image }} 
                style={[styles.outfitImage, { width: imageWidth, height: imageHeight }]} 
              />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No outfits available. Add some in your wardrobe!
            </Text>
          }
        />
      </View>
    </Modal>
  );

  // Weather forecast render
  const renderWeatherForecast = () => (
    <View style={styles.forecastContainer}>
      <Text style={styles.forecastTitle}>6-Day Forecast</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {sixDayForecast.map((day) => (
          <TouchableOpacity 
            key={day.date} 
            style={styles.forecastDay}
            onPress={() => handleDayPress({ dateString: day.date })}
          >
            <Text style={styles.dateText}>
              {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </Text>
            <Text style={styles.tempText}>{day.temp}°C</Text>
            <Text style={styles.weatherDescription}>{day.description}</Text>
            <View style={styles.weatherDetails}>
              <Text>💧 {day.humidity}%</Text>
              <Text>💨 {day.windSpeed} m/s</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        {renderWeatherForecast()}
        <Calendar
          style={styles.calendar}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: '#00adf5',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#00adf5',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
            dotColor: '#00adf5',
            selectedDotColor: '#ffffff',
            arrowColor: '#00adf5',
            monthTextColor: '#2d4150',
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 16
          }}
          markedDates={{
            ...Object.keys(calendarOutfits).reduce((acc, date) => ({
              ...acc,
              [date]: { marked: true, dotColor: '#2ecc71' }
            }), {})
          }}
          onDayPress={handleDayPress}
          enableSwipeMonths={true}
        />
      </ScrollView>
      <OutfitPickerModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  calendar: {
    marginBottom: 10,
    borderRadius: 10,
    elevation: 4,
    margin: 10,
  },
  forecastContainer: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    margin: 10,
    borderRadius: 10,
  },
  forecastTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  forecastDay: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    minWidth: 120,
    elevation: 3,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  outfitImage: {
    marginBottom: 0,
  },
  emptyText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 30,
    fontSize: 16,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  tempText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  weatherDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
});

export default PlannerScreen;