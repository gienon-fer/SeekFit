import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { fetchWeatherForecast } from '../WeatherLocationService'; // Adjust the import path as needed

const Planner = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWeatherData();
  }, []);

  const loadWeatherData = async () => {
    try {
      const forecast = await fetchWeatherForecast();
      if (forecast) {
        setWeatherData(forecast);
      } else {
        setError('Unable to load weather data');
      }
    } catch (err) {
      setError('Error loading weather data');
    } finally {
      setLoading(false);
    }
  };

  const renderWeatherInfo = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
      return <Text style={styles.errorText}>{error}</Text>;
    }

    if (weatherData && weatherData.list && weatherData.list[0]) {
      const currentWeather = weatherData.list[0];
      return (
        <View style={styles.weatherContainer}>
          <Text style={styles.weatherTitle}>Current Weather</Text>
          <Text style={styles.weatherText}>
            Temperature: {Math.round(currentWeather.main.temp)}°C
          </Text>
          <Text style={styles.weatherText}>
            {currentWeather.weather[0].description}
          </Text>
          <Text style={styles.weatherText}>
            Humidity: {currentWeather.main.humidity}%
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      {renderWeatherInfo()}
      <Calendar
        initialDate={new Date().toISOString().split('T')[0]}
        minDate={new Date().toISOString().split('T')[0]}
        onDayPress={day => {
          console.log('selected day', day);
        }}
        onDayLongPress={day => {
          console.log('selected day', day);
        }}
        monthFormat={'MMMM yyyy'}
        enableSwipeMonths={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  weatherContainer: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  weatherTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  weatherText: {
    fontSize: 16,
    marginBottom: 4,
  },
  errorText: {
    color: 'red',
    padding: 16,
    textAlign: 'center',
  }
});

export default Planner;