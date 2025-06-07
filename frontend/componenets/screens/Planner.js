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
import { Feather, Ionicons } from '@expo/vector-icons';
import { fetchWeatherForecast } from '../WeatherLocationService';
import { useNavigation } from '@react-navigation/native';
import { useWardrobe } from '../../contexts/WardrobeContext';
import { useActiveOutfitFilters } from '../../contexts/OutfitFilterContext';
import { Calendar } from 'react-native-calendars';

const PlannerScreen = () => {
  const navigation = useNavigation();
  const { outfits, addOutfit, removeOutfit } = useWardrobe();
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

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Only show the picker if we were previously showing it
      if (selectedDate) {
        setShowOutfitPicker(true);
      }
    });
  
    return unsubscribe;
  }, [navigation, selectedDate]);

  useEffect(() => {
    if (Object.keys(activeFilters).length === 0) {
      setFilteredOutfits(outfits);
      return;
    }
  
    const filtered = outfits.filter((item) => {
      // Check for tag matches
      const matchesTags = Object.keys(activeFilters).every((category) => {
        if (category === 'clothing') return true; // Skip clothing here, handle separately
        const categoryTags = activeFilters[category];
        return categoryTags.every((tag) => 
          item.tags[category.toLowerCase()]?.includes(tag)
        );
      });
  
      // Check for clothing matches if clothing filters exist
      const matchesClothing = activeFilters.clothing?.length > 0 
        ? activeFilters.clothing.every((filterClothing) =>
            item.clothing.some((outfitClothing) => outfitClothing.id === filterClothing.id)
          )
        : true;
  
      return matchesTags && matchesClothing;
    });
  
    setFilteredOutfits(filtered);
  }, [outfits, activeFilters]);

  const getWeatherTag = (description) => {
    // Normalize the description to handle various possible responses
    const normalizedDescription = description.toLowerCase();
    
    let weatherTags = [];
    
    if (normalizedDescription.includes("rain") || normalizedDescription.includes("drizzle")) {
      weatherTags.push("Rain");
    }
    if (normalizedDescription.includes("snow")) {
      weatherTags.push("Snow");
    }
    if (normalizedDescription.includes("wind")) {
      weatherTags.push("Wind");
    }
    if (normalizedDescription.includes("clouds")) {
      weatherTags.push("Cloudy");
    }
  
    return weatherTags;
  };
  
  const getTemperatureTag = (temp) => {
    if (temp < 0) return 'Below 0°C (Freezing)';
    if (temp >= 0 && temp < 10) return '0°C to 10°C (Cold)';
    if (temp >= 10 && temp < 15) return '10°C to 15°C (Cool)';
    if (temp >= 15 && temp < 20) return '15°C to 20°C (Mild)';
    if (temp >= 20 && temp < 25) return '20°C to 25°C (Warm)';
    if (temp >= 25 && temp < 30) return '25°C to 30°C (Hot)';
    return 'Above 30°C (Very Hot)';
  };

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
    setSelectedDate(date); // Set the selected date immediately
    
    if (calendarOutfits[date]) {
      Alert.alert(
        'Manage Outfit',
        `Options for ${date}`,
        [
          { 
            text: 'Change Outfit', 
            onPress: () => {
              setSelectedDate(date); // Ensure date is set before showing picker
              setShowOutfitPicker(true);
            }
          },
          { 
            text: 'Delete Outfit', 
            onPress: () => handleOutfitDelete(date) 
          },
          { text: 'Cancel', style: 'cancel' },
        ],
        { cancelable: true }
      );
    } else {
      Alert.alert(
        'Take into account weather forecast for the day?',
        '',
        [
          {
            text: 'No',
            onPress: () => {
              setFilteredOutfits(outfits);
              setShowOutfitPicker(true);
            }
          },
          {
            text: 'Yes',
            onPress: () => {
              const forecast = sixDayForecast.find(day => day.date === date);
  
              if (forecast) {
                const temperatureTag = getTemperatureTag(forecast.temp);
                const weatherTags = getWeatherTag(forecast.description);
  
                const filtered = outfits.filter((item) => {
                  const matchesTemperature = item.tags.temperature?.includes(temperatureTag);
                  const matchesWeather = weatherTags.every(tag => 
                    item.tags.weather?.includes(tag)
                  );
                  return matchesTemperature && matchesWeather;
                });
  
                setFilteredOutfits(filtered);
              } else {
                setFilteredOutfits(outfits);
              }
  
              setShowOutfitPicker(true);
            }
          },
          { text: 'Cancel', style: 'cancel' }
        ],
        { cancelable: true }
      );
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
    setCalendarOutfits(prev => {
      // Create a new object to ensure state update
      const updated = { ...prev };
      // Use the selectedDate that was set in handleDayPress
      updated[selectedDate] = outfit;
      return updated;
    });
  
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

  const OutfitPickerModal = () => (
    <Modal
      visible={showOutfitPicker}
      animationType="slide"
      transparent={false}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Select Outfit for {selectedDate}</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                Object.keys(activeFilters).length > 0 && styles.activeFilterButton
              ]}
              onPress={() => {
                setShowOutfitPicker(false);
                setTimeout(() => {
                  navigation.navigate('FilterOutfit');
                }, 100);
              }}
            >
              <Ionicons name="filter" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowOutfitPicker(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
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
              {Object.keys(activeFilters).length > 0 
                ? "No outfits match the current filters..." 
                : "No outfits available. Add some in your wardrobe!"}
            </Text>
          }
        />
      </View>
    </Modal>
  );

  // Render weather forecast
const renderWeatherForecast = () => (
    <View style={[styles.forecastContainer, { paddingVertical: 8 }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {sixDayForecast.map((day) => (
                <TouchableOpacity 
                    key={day.date} 
                    style={[styles.forecastDay, { padding: 8, minWidth: 90 }]}
                    onPress={() => {}}
                >
                    <Text style={[styles.dateText, { marginBottom: 2, fontSize: 13 }]}>
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </Text>
                    <Text style={[styles.tempText, { fontSize: 16, marginBottom: 2 }]}>{day.temp}°C</Text>
                    <Text style={[styles.weatherDescription, { fontSize: 12, marginBottom: 2 }]} numberOfLines={1}>
                        {day.description}
                    </Text>
                    <View style={[styles.weatherDetails, { marginTop: 2 }]}>
                        <Text style={{ fontSize: 11 }}>💧 {day.humidity}% </Text>
                        <Text style={{ fontSize: 11 }}>💨 {day.windSpeed} m/s</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    </View>
);

  const renderCalendar = () => {
    const todayString = new Date().toISOString().split('T')[0];
    
    // Calculate tile size based on screen width
    const screenWidth = Dimensions.get('window').width;
    const calendarPadding = 20; // 10px padding on each side
    const tileWidth = (screenWidth - (calendarPadding * 2)) / 7; // 7 days per week
    const tileHeight = tileWidth * 1.45; // Make height 1.45 times the width
    
    return (
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={(day) => handleDayPress(day.dateString)}
          dayComponent={({ date }) => {
            const isToday = date.dateString === todayString;
            const assignedOutfit = calendarOutfits[date.dateString];
            return (
              <TouchableOpacity 
                style={[styles.calendarTile, { width: tileWidth, height: tileHeight }]} 
                onPress={() => handleDayPress(date.dateString)}
              >
                {assignedOutfit && (
                  <Image
                    source={{ uri: assignedOutfit.image }}
                    style={styles.outfitImageTile}
                  />
                )}
                <Text style={[styles.dateOverlay, isToday ? { fontWeight: 'bold' } : {}]}>
                  {date.day}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  };
  
  
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
  calendarContainer: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  calendarTile: {
    position: 'relative',
    borderWidth: 1,
    borderColor: 'gray',
    // Width and height are set dynamically in the component
  },
  outfitImageTile: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  dateOverlay: {
    position: 'absolute',
    top: 2,
    right: 8,
    color: 'black',
  },
  outfitContainer: {
    marginTop: 5,
    width: 75,  // Increase width
    height: 95, // Increase height
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    backgroundColor: 'blue',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  activeFilterButton: {
    backgroundColor: 'darkblue',
  },
});

export default PlannerScreen;
