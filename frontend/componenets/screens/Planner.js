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
  const { outfits, addOutfit, removeOutfit } = useOutfit();
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

  const handleDayPress = (date) => {
    if (calendarOutfits[date]) {
      // If an outfit exists, show the menu
      Alert.alert(
        'Manage Outfit',
        `Options for ${date}`,
        [
          { text: 'Change Outfit', onPress: () => setShowOutfitPicker(true) },
          { text: 'Delete Outfit', onPress: () => handleOutfitDelete(date) },
          { text: 'Cancel', style: 'cancel' },
        ],
        { cancelable: true }
      );
    } else {
      // If no outfit, directly open outfit picker
      setSelectedDate(date);
      setShowOutfitPicker(true);
    }
  };

  const handleOutfitDelete = (date) => {
    setCalendarOutfits((prev) => {
      const updated = { ...prev };
      delete updated[date];
      return updated;
    });
  };

  const handleOutfitSelect = (outfit) => {
    setCalendarOutfits((prev) => ({
      ...prev,
      [selectedDate]: outfit, // Save the outfit for this date
    }));
  
    setShowOutfitPicker(false); // Close modal after selection
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
              onPress={() => handleOutfitSelect(item)} // Select the outfit
              onLongPress={() => handleOutfitLongPress(item)} // Edit or delete outfit
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

  // Render weather forecast
  const renderWeatherForecast = () => (
    <View style={styles.forecastContainer}>
      <Text style={styles.forecastTitle}>6-Day Forecast</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {sixDayForecast.map((day) => (
          <TouchableOpacity 
            key={day.date} 
            style={styles.forecastDay}
            onPress={() => {}}
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

  const renderCalendar = () => (
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
        arrowColor: '#00adf5',
        monthTextColor: '#2d4150',
        textDayFontSize: 16,
        textMonthFontSize: 16,
        textDayHeaderFontSize: 16,
      }}
      dayComponent={({ date, state }) => {
        const outfit = calendarOutfits[date.dateString];
  
        return (
          <TouchableOpacity onPress={() => handleDayPress(date.dateString)}>
            <View style={styles.calendarCell}>
              {/* Date number positioned at top-left */}
              <Text
                style={{
                  position: 'absolute',
                  top: 5,
                  left: 5,
                  color: state === 'disabled' ? '#d9e1e8' : '#2d4150',
                  fontSize: 16,
                  fontWeight: 'bold',
                }}
              >
                {date.day}
              </Text>
  
              {/* Image placeholder to maintain spacing */}
              <View style={styles.outfitContainer}>
                {outfit ? (
                  <Image
                    source={{ uri: outfit.image }}
                    style={styles.outfitImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.emptyOutfitPlaceholder} />
                )}
              </View>
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
  
  
  return (
    <View style={styles.container}>
      <ScrollView>
        {renderWeatherForecast()}
        {renderCalendar()}
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
  calendarCell: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80, // Increased from 60
    height: 100, // Increased from 80
  },
  outfitContainer: {
    marginTop: 5,
    width: 75,  // Increase width
    height: 95, // Increase height
    justifyContent: 'center',
    alignItems: 'center',
  },
  outfitImage: {
    width: '90%',  // Increase width
    height: '90%', // Increase height
    borderRadius: 5,
  },  
  emptyOutfitPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent', // Keep it invisible but maintaining spacing
  },
});

export default PlannerScreen;
