import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

import Wardrobe from './screens/Wardrobe';
import AddClothing from './screens/wardrobe/AddClothing';
import EditClothing from './screens/wardrobe/EditClothing';
import Profile from './screens/Profile';
import { ClothingProvider } from './contexts/ClothingContext';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}> SeekFit </Text>
    </View>
  );
};

const ComingSoon = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: 18 }}>Coming Soon!</Text>
  </View>
);
/*
function WardrobeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Wardrobe" component={Wardrobe} />
      <Stack.Screen name="AddClothing" component={AddClothing} />
      <Stack.Screen name="EditClothing" component={EditClothing} />
    </Stack.Navigator>
  );
}*/


const TopTab = createMaterialTopTabNavigator();

function WardrobeStack() {
    return (
        <TopTab.Navigator>
          <TopTab.Screen name="Clothes" component={ComingSoon} />
          <TopTab.Screen name="Outfits" component={ComingSoon} />
        </TopTab.Navigator>
    );
}


export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  /*const [isInitialized, setIsInitialized] = useState(false);

     if (process.env.NODE_ENV === 'development') {
        useEffect(() => {
          try {
            console.log('App initialization started');
            setIsInitialized(true);
          } catch (error) {
            console.error('Initialization error:', error);
          }
        }, []);
      } else {
        // Directly set isInitialized to true in production
        setIsInitialized(true);
      }

  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <Text>Initializing...</Text>
      </View>
    );
  }*/

  if (showSplash) {
      return <SplashScreen onFinish={() => setShowSplash(false)} />;
    }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      /*<ClothingProvider>*/
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen
              name="WardrobeTab"
              component={WardrobeStack}
              options={{
                tabBarLabel: 'Wardrobe',
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
              name="Planner"
              component={ComingSoon}
              options={{
                tabBarLabel: 'Planner',
                tabBarIcon: ({ color, size }) => (
                  <MaterialIcons name="calendar-month" color={color} size={size} />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      /*</ClothingProvider>*/
    </GestureHandlerRootView>
  );
}