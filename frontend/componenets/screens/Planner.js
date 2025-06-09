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
import { useCalendar } from '../../contexts/CalendarContext'; // Import the new context
import { useActiveOutfitFilters } from '../../contexts/OutfitFilterContext';
import { useUser } from '../../contexts/UserContext';  // Import UserContext to get the current user
import { Calendar } from 'react-native-calendars';

const PlannerScreen = () => {
  const navigation = useNavigation();
  const { outfits } = useWardrobe();
  const { calendarOutfits, addOutfitToDate, removeOutfitFromDate } = useCalendar(); // Use CalendarContext
  const activeFilters = useActiveOutfitFilters();
  const { user, googleId } = useUser(); // Get current user info
  
  const [weatherData, setWeatherData] = useState(null);
  const [sixDayForecast, setSixDayForecast] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [showOutfitPicker, setShowOutfitPicker] = useState(false);
  const [filteredOutfits, setFilteredOutfits] = useState([]);
  const [expandedDay, setExpandedDay] = useState(null);
  const [expandedView, setExpandedView] = useState(false);
  const [selectedOutfit, setSelectedOutfit] = useState(null);
  const [showOutfitViewModal, setShowOutfitViewModal] = useState(false);
  const [isExistingOutfit, setIsExistingOutfit] = useState(false);
  const [weatherForDay, setWeatherForDay] = useState(null);

  // Screen dimensions for outfit grid
  const numColumns = 4;
  const screenWidth = Dimensions.get('window').width;
  const imageWidth = screenWidth / numColumns;
  const imageHeight = imageWidth * 1.75;

  useEffect(() => {
    loadWeatherData();
  }, []);

  useEffect(() => {
    // Filter outfits to only show the current user's outfits
    const userOutfits = outfits.filter(outfit => {
      return googleId ? outfit.owner === googleId : outfit.owner === 'guest';
    });
    
    // Apply any active filters
    if (Object.keys(activeFilters).length === 0) {
      setFilteredOutfits(userOutfits);
      return;
    }
  
    const filtered = userOutfits.filter((item) => {
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
  }, [outfits, activeFilters, googleId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // No automatic reopening of modals
    });
  
    return unsubscribe;
  }, [navigation]);

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
    console.log("Day pressed:", date);
    console.log("Current outfits in calendar:", calendarOutfits);
    
    setSelectedDate(date);
    
    if (calendarOutfits[date]) {
      console.log("Found outfit for date:", calendarOutfits[date]);
      setSelectedOutfit(calendarOutfits[date]);
      setIsExistingOutfit(true);
      setShowOutfitViewModal(true);
    } else {
      console.log("No outfit for this date");
      const forecast = sixDayForecast.find(day => day.date === date);
      setWeatherForDay(forecast);
      setSelectedOutfit(null);
      setIsExistingOutfit(false);
      setShowOutfitViewModal(true);
    }

    // Force modal to show as a fallback
    setTimeout(() => {
      setShowOutfitViewModal(true);
    }, 100);
  };

  const handleOutfitDelete = (date) => {
    // Use the context function to remove the outfit
    removeOutfitFromDate(date);
    setShowOutfitViewModal(false);
  };

  const handleOutfitSelect = (outfit) => {
    // Use the context function to add the outfit to the date
    addOutfitToDate(selectedDate, outfit);
    setShowOutfitPicker(false);
  };

  const handleOutfitLongPress = (outfit) => {
    // Only allow users to modify their own outfits
    if (outfit.owner !== googleId && outfit.owner !== 'guest') {
      Alert.alert('Cannot modify', 'You can only modify your own outfits');
      return;
    }
    
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

  const handleForecastPress = (date) => {
    if (expandedDay === date) {
      setExpandedDay(null); // Collapse if already expanded
    } else {
      setExpandedDay(date); // Expand this day
    }
  };

  const toggleExpandedView = () => {
    setExpandedView(!expandedView);
  };
  
  const handleSelectOutfitPress = () => {
    setShowOutfitViewModal(false);
    setShowOutfitPicker(true);
  };

  // Format date to DD.MM.YYYY format
  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
  };

  const OutfitPickerModal = () => (
    <Modal
        visible={showOutfitPicker}
        animationType="slide"
        transparent={false}
    >
        <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Outfit for {formatDate(selectedDate)}</Text>
                <View style={styles.headerButtons}>
                    <TouchableOpacity
                        onPress={() => {
                            setShowOutfitPicker(false);
                        }}
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 18,
                            backgroundColor: '#e0e0e0',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginLeft: 10,
                        }}
                    >
                        <Ionicons name="close" size={24} color="#757575" />
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

  const OutfitViewModal = () => (
    <Modal
      visible={showOutfitViewModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowOutfitViewModal(false)}
    >
      <View style={styles.viewModalOverlay}>
        <View style={styles.viewModalContent}>
          <Text style={styles.viewModalTitle}>
            {formatDate(selectedDate)}
          </Text>
          
          {isExistingOutfit && selectedOutfit ? (
            <Image 
              source={{ uri: selectedOutfit.image }}
              style={styles.viewModalImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.emptyOutfitContainer}>
              <Ionicons name="calendar-outline" size={80} color="#ccc" />
              <Text style={styles.emptyOutfitText}>
                No outfit planned for this day
              </Text>
              {weatherForDay && (
                <Text style={styles.weatherInfoText}>
                  Weather: {weatherForDay.temp}°C, {weatherForDay.description}
                </Text>
              )}
            </View>
          )}
          
          <View style={styles.viewModalButtons}>
            <TouchableOpacity 
              style={styles.viewModalButton} 
              onPress={handleSelectOutfitPress}
            >
              <Text style={styles.viewModalButtonText}>Select</Text>
            </TouchableOpacity>
            
            {isExistingOutfit && (
              <TouchableOpacity 
                style={[styles.viewModalButton, styles.deleteButton]} 
                onPress={() => handleOutfitDelete(selectedDate)}
              >
                <Text style={styles.viewModalButtonText}>Delete</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[styles.viewModalButton, styles.closeButton]} 
              onPress={() => setShowOutfitViewModal(false)}
            >
              <Text style={styles.viewModalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
  
  // Render weather forecast
  const renderWeatherForecast = () => (
    <View style={styles.forecastContainer}>
      <View style={styles.forecastHeader}>
        <Text style={styles.forecastTitle}>6-Day Forecast</Text>
        <TouchableOpacity onPress={toggleExpandedView}>
          <Ionicons name={expandedView ? "contract-outline" : "expand-outline"} size={24} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        pagingEnabled={expandedView}
        snapToInterval={expandedView ? screenWidth - 35 : undefined}
        decelerationRate={expandedView ? 'fast' : 'normal'}
        contentContainerStyle={expandedView ? { paddingRight: 10 } : null}
      >
        {sixDayForecast.map((day) => (
          <TouchableOpacity 
            key={day.date} 
            style={[
              styles.forecastDay,
              expandedView && {
                width: screenWidth - 50,
                padding: 20,
                marginRight: 15
              }
            ]}
            onPress={() => {}}
          >
            <Text style={[
              styles.dateText, 
              expandedView && {fontSize: 18, marginBottom: 10}
            ]}>
              {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}, {formatDate(day.date)}
            </Text>
            <Text style={[
              styles.tempText, 
              expandedView && {fontSize: 32, marginBottom: 15}
            ]}>
              {day.temp}°C
            </Text>
            <Text style={[
              styles.weatherDescription, 
              expandedView && {fontSize: 20, marginBottom: 15}
            ]}>
              {day.description}
            </Text>
            <View style={styles.weatherDetails}>
              <Text style={expandedView ? {fontSize: 18} : {fontSize: 11}}>
                💧 {day.humidity}%
              </Text>
              <Text style={expandedView ? {fontSize: 18} : {fontSize: 11}}>
                💨 {day.windSpeed} m/s
              </Text>
            </View>
            
            {expandedView && (
              <Text style={{marginTop: 20, fontSize: 16}}>
                Based on this weather, we recommend outfits suitable for {getTemperatureTag(day.temp)}.
              </Text>
            )}
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
          firstDay={1}
          onDayPress={(day) => handleDayPress(day.dateString)}
          theme={{
            'stylesheet.calendar.main': {
              week: {
                margin: 0,
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginTop: 14, // Reduce vertical spacing between weeks
                paddingVertical: 0,
              }
            },
            'stylesheet.day.basic': {
              base: {
                width: tileWidth,
                height: tileHeight,
                marginVertical: 0, // Reduce vertical space between tiles
              }
            }
          }}
          dayComponent={({ date }) => {
            const isToday = date.dateString === todayString;
            const assignedOutfit = calendarOutfits[date.dateString];
            
            // Add check for days outside the current month
            const isCurrentMonth = date.month === new Date().getMonth() + 1; // +1 because JS months are 0-indexed
            
            return (
              <TouchableOpacity 
                style={[
                  styles.calendarTile, 
                  { 
                    width: tileWidth, 
                    height: tileHeight,
                    marginVertical: -6.5, // Match the negative margin from theme
                  },
                  isToday && {
                    borderWidth: 2,
                    borderColor: '#4287f5', // Blue outline
                  }
                ]} 
                onPress={() => handleDayPress(date.dateString)}
              >
                {assignedOutfit && (
                  <Image
                    source={{ uri: assignedOutfit.image }}
                    style={styles.outfitImageTile}
                  />
                )}
                <Text style={[
                  styles.dateOverlay, 
                  !isCurrentMonth ? { color: '#D3D3D3' } : {}, // Gray color for days not in current month
                  isToday ? { 
                    fontWeight: 'bold',
                    color: '#4287f5', // Blue for today overrides the gray
                  } : {}
                ]}>
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
      <OutfitViewModal />
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
        // elevation: 4, // Removed shadow
        margin: 10,
    },
    forecastContainer: {
        padding: 15,
        backgroundColor: '#f5f5f5',
        margin: 10,
        borderRadius: 10,
        // No shadow
    },
    forecastHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
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
        // elevation: 3, // Removed shadow
        // transition: '0.3s', // Not supported in React Native styles
    },
    expandedDetails: {
        marginTop: 15,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    detailTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 10,
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
        paddingBottom: 15, // Added bottom padding to prevent border cutoff
        marginBottom: 20, // Increased bottom margin
        overflow: 'visible', // Changed from 'hidden' to show the complete borders
    },
    calendarTile: {
        position: 'relative',
        borderWidth: 1,
        borderColor: '#D3D3D3',
        // Width and height are set dynamically in the component
    },
    outfitImageTile: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    dateOverlay: {
        position: 'absolute',
        top: 1,
        right: 5,
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
    viewModalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    viewModalContent: {
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 20,
      width: '90%',
      maxHeight: '80%',
    },
    viewModalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 15,
      textAlign: 'center',
    },
    viewModalImage: {
      width: '100%',
      height: 350,
      borderRadius: 8,
      marginBottom: 15,
    },
    viewModalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    viewModalButton: {
      padding: 12,
      borderRadius: 8,
      backgroundColor: '#4287f5',
      flex: 1,
      marginHorizontal: 5,
      alignItems: 'center',
    },
    viewModalButtonText: {
      color: 'white',
      fontWeight: '500',
    },
    deleteButton: {
      backgroundColor: '#ff5252',
    },
    closeButton: {
      backgroundColor: '#757575',
    },
    emptyOutfitContainer: {
      height: 300,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f9f9f9',
      borderRadius: 8,
      marginBottom: 15,
    },
    emptyOutfitText: {
      fontSize: 18,
      color: '#666',
      marginTop: 10,
    },
    weatherInfoText: {
      fontSize: 14,
      color: '#888',
      marginTop: 10,
      textAlign: 'center',
    },
});

export default PlannerScreen;
