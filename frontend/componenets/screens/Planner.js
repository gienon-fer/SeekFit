import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { fetchWeatherForecast } from '../WeatherLocationService';
import { Feather } from '@expo/vector-icons';

const Planner = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [sixDayForecast, setSixDayForecast] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWeatherData();
  }, []);

  const loadWeatherData = async () => {
    try {
      console.log('Starting to fetch weather data...');
      const forecast = await fetchWeatherForecast();
      console.log('Received forecast:', forecast);
      
      if (forecast?.list) {
        setWeatherData(forecast);
        processSixDayForecast(forecast.list);
      } else {
        console.log('No forecast list found in the response');
        // Add fallback data for testing
        const fallbackData = [{
          date: new Date().toISOString().split('T')[0],
          temp: 20,
          icon: '01d',
          description: 'clear sky',
          humidity: 65,
          windSpeed: 3.5
        }];
        setSixDayForecast(fallbackData);
      }
    } catch (error) {
      console.error('Error loading weather:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const processSixDayForecast = (forecastList) => {
    // Get unique dates and their first forecast
    const uniqueDays = {};
    const today = new Date().setHours(0, 0, 0, 0);
    
    forecastList.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dateString = date.toISOString().split('T')[0];
      
      // Only process if it's a future date and we don't have this date yet
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

    // Convert to array and take only next 6 days
    const sixDays = Object.values(uniqueDays)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 6);

    setSixDayForecast(sixDays);
  };

  const getWeatherIcon = (iconCode) => {
    const iconMap = {
      '01d': 'sun',
      '01n': 'moon',
      '02d': 'cloud',
      '02n': 'cloud',
      '03d': 'cloud',
      '03n': 'cloud',
      '04d': 'cloud',
      '04n': 'cloud',
      '09d': 'cloud-drizzle',
      '09n': 'cloud-drizzle',
      '10d': 'cloud-rain',
      '10n': 'cloud-rain',
      '11d': 'cloud-lightning',
      '11n': 'cloud-lightning',
      '13d': 'cloud-snow',
      '13n': 'cloud-snow',
      '50d': 'wind',
      '50n': 'wind'
    };
    return iconMap[iconCode] || 'cloud';
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <ScrollView style={styles.container}>
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
        initialDate={new Date().toISOString().split('T')[0]}
        minDate={new Date().toISOString().split('T')[0]}
        onDayPress={day => {
          console.log('selected day', day);
        }}
        monthFormat={'MMMM yyyy'}
        enableSwipeMonths={true}
      />

      <View style={styles.forecastContainer}>
        <Text style={styles.forecastTitle}>6-Day Forecast</Text>
        <View style={styles.forecastList}>
          {isLoading ? (
            <Text style={styles.messageText}>Loading weather forecast...</Text>
          ) : error ? (
            <Text style={styles.messageText}>Error: {error}</Text>
          ) : sixDayForecast.length === 0 ? (
            <Text style={styles.messageText}>No forecast data available</Text>
          ) : (
            sixDayForecast.map((day, index) => (
              <View 
                key={day.date} 
                style={[
                  styles.forecastDay,
                  index < sixDayForecast.length - 1 && styles.forecastDayBorder
                ]}
              >
                <Text style={styles.dateText}>{formatDate(day.date)}</Text>
                <View style={styles.weatherInfo}>
                  <Feather 
                    name={getWeatherIcon(day.icon)} 
                    size={24} 
                    color="#2d4150" 
                    style={styles.weatherIcon}
                  />
                  <Text style={styles.tempText}>{day.temp}°C</Text>
                </View>
                <Text style={styles.descriptionText}>
                  {day.description.charAt(0).toUpperCase() + day.description.slice(1)}
                </Text>
                <View style={styles.detailsRow}>
                  <Text style={styles.detailText}>💧 {day.humidity}%</Text>
                  <Text style={styles.detailText}>💨 {day.windSpeed} m/s</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  calendar: {
    borderRadius: 10,
    elevation: 4,
    backgroundColor: '#fff',
    margin: 10,
  },
  forecastContainer: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    margin: 10,
  },
  forecastTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2d4150',
  },
  forecastList: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
  },
  forecastDay: {
    padding: 15,
  },
  forecastDayBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2d4150',
    marginBottom: 8,
  },
  weatherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  weatherIcon: {
    marginRight: 10,
  },
  tempText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d4150',
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  messageText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    padding: 20,
  },
});

export default Planner;