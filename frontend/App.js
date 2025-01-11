import { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { ClothingProvider } from './contexts/ClothingContext';
import { UserProvider } from './contexts/UserContext';
import { OutfitProvider } from './contexts/OutfitContext';
import { ClothingTagValuesProvider } from './contexts/ClothingTagValuesContext'; 

import Profile from "./componenets/screens/Profile";
import Wardrobe from "./componenets/screens/Wardrobe";
import Planner from "./componenets/screens/Planner";

const Tab = createBottomTabNavigator();

const ComingSoon = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: 18 }}>Coming Soon!</Text>
  </View>
);

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

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <SafeAreaProvider>
      <UserProvider>
        <ClothingProvider>
          <OutfitProvider>
            <ClothingTagValuesProvider>
              <NavigationContainer>
                <Tab.Navigator>
                  <Tab.Screen
                    name="Wardrobe"
                    component={Wardrobe}
                    options={{
                      tabBarLabel: 'Wardrobe',
                      tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="door-sliding" color={color} size={size} />
                      )
                    }}
                  />
                  <Tab.Screen
                    name="Planner"
                    component={Planner}
                    options={{
                      tabBarLabel: 'Planner',
                      tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="calendar-month" color={color} size={size} />
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
                    name="Profile"
                    component={Profile}
                    options={{
                      tabBarLabel: 'Profile',
                      tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="person" color={color} size={size} />
                      ),
                    }}
                  />
                </Tab.Navigator>
              </NavigationContainer>
            </ClothingTagValuesProvider>
          </OutfitProvider>
        </ClothingProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}