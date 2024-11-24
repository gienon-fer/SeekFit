// App.js
import 'regenerator-runtime/runtime'; // Add this line at the top
import 'expo-firestore-offline-persistence'; // This MUST be imported first
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

import Wardrobe from './screens/Wardrobe';
import AddClothing from './screens/wardrobe/AddClothing';
import EditClothing from './screens/wardrobe/EditClothing';
import { ClothingProvider } from './contexts/ClothingContext';

import Profile from './screens/Profile';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}> SeekFit </Text>
    </View>
  );
};

const ComingSoon = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: 18 }}>Coming Soon!</Text>
  </View>
);

function WardrobeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Wardrobe" component={Wardrobe} />
      <Stack.Screen name="AddClothing" component={AddClothing} />
      <Stack.Screen name="EditClothing" component={EditClothing} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <ClothingProvider>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen
              name="WardrobeTab"
              component={WardrobeStack}
              options={{
                tabBarLabel: 'Wardrobe',
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <MaterialIcons name="door-sliding" color={color} size={size} />
                ),
              }}
          />
          <Tab.Screen
              name="Profile"
              component={Profile}
              options={{
                tabBarLabel: 'Profile',
                tabBarIcon: ({ color, size }) => (
                  <MaterialIcons name="person" color={color} size={size} />
                ),
              }}
          />
          <Tab.Screen
              name="Friends"
              component={ComingSoon}
              options={{
                tabBarLabel: 'Friends',
                tabBarIcon: ({ color, size }) => (
                  <MaterialIcons name="group" color={color} size={size} />
                ),
              }}
            />
          <Tab.Screen
              name="Planer"
              component={ComingSoon}
              options={{
                tabBarLabel: 'Planer',
                tabBarIcon: ({ color, size }) => (
                  <MaterialIcons name="calendar-month" color={color} size={size} />
                ),
              }}
            />
        </Tab.Navigator>
      </NavigationContainer>
    </ClothingProvider>
  );
};