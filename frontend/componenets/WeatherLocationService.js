import * as Location from 'expo-location';

const API_KEY = 'a5456126acecf7ef3be591ddff273cbb';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getCurrentLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Location permission denied');
      return null;
    }

    const location = await Location.getCurrentPositionAsync({});
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Error getting location:', error);
    return null;
  }
};

export const fetchWeatherForecast = async () => {
  try {
    // First get the current location
    const location = await getCurrentLocation();
    if (!location) {
      throw new Error('Unable to get location');
    }

    // Use the location coordinates in the weather API call
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${location.latitude}&lon=${location.longitude}&units=metric&appid=${API_KEY}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
};