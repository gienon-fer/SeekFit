import { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import { ClothingProvider } from './contexts/ClothingContext';
import { UserProvider } from './contexts/UserContext';
import { OutfitProvider } from './contexts/OutfitContext';
import { ClothingTagValuesProvider } from './contexts/ClothingTagValuesContext'; 
import { ClothingFilterProvider } from './contexts/ClothingFilterContext'; 
import { OutfitTagValuesProvider } from './contexts/OutfitTagValuesContext'; 
import { OutfitFilterProvider } from './contexts/OutfitFilterContext'; 

import Profile from "./componenets/screens/Profile";
import Wardrobe from "./componenets/screens/Wardrobe";
import Planner from "./componenets/screens/Planner";
import Clothes from './componenets/screens/wardrobe/Clothes';
import ClothingForm from './componenets/screens/wardrobe/ClothingForm';
import Outfits from './componenets/screens/wardrobe/Outfits';
import OutfitForm from './componenets/screens/wardrobe/OutfitForm';
import FilterClothing from './componenets/screens/wardrobe/FilterClothing'; 
import FilterOutfit from './componenets/screens/wardrobe/FilterOutfit';

const Tab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

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

function WardrobeTabs() {
  return (
    <TopTab.Navigator>
      <TopTab.Screen name="Clothes" component={Clothes} />
      <TopTab.Screen name="Outfits" component={Outfits} />
    </TopTab.Navigator>
  );
}

function WardrobeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="WardrobeTabs"
        component={WardrobeTabs}
        options={{ headerShown: false }} 
      />
      <Stack.Screen
        name="ClothingForm"
        component={ClothingForm}
        options={{ headerShown: false }} 
      />
      <Stack.Screen
        name="OutfitForm"
        component={OutfitForm}
        options={{ headerShown: false }} 
      />
      <Stack.Screen
        name="FilterClothing"
        component={FilterClothing}
        options={{ headerShown: false }} 
      />
      <Stack.Screen
        name="FilterOutfit"
        component={FilterOutfit}
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <SafeAreaProvider>
      <UserProvider>
        <OutfitProvider>
          <ClothingProvider>
            <ClothingTagValuesProvider>
              <ClothingFilterProvider>
                <OutfitTagValuesProvider>
                  <OutfitFilterProvider>
                    <NavigationContainer>
                      <Tab.Navigator screenOptions={({ route }) => ({
                        tabBarStyle: ((route) => {
                          const routeName = getFocusedRouteNameFromRoute(route) ?? "";
                          if (routeName === 'ClothingForm' || routeName === 'OutfitForm') {
                            return { display: "none" };
                          }
                          return;
                        })(route),
                        headerShown: ((route) => {
                          const routeName = getFocusedRouteNameFromRoute(route) ?? "";
                          if (routeName === 'ClothingForm' || routeName === 'OutfitForm') {
                            return false;
                          }
                          return true;
                        })(route),
                      })}>
                        <Tab.Screen
                          name="Wardrobe"
                          component={WardrobeStack}
                          options={{
                            tabBarLabel: 'Wardrobe',
                            tabBarIcon: ({ color, size }) => (
                              <MaterialIcons name="door-sliding" color={color} size={size} />
                            ),
                            headerTitle: 'Wardrobe'
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
                  </OutfitFilterProvider>
                </OutfitTagValuesProvider>
              </ClothingFilterProvider>
            </ClothingTagValuesProvider>
          </ClothingProvider>
        </OutfitProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}