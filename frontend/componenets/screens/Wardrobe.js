// screens/Wardrobe.js
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import Clothes from './wardrobe/Clothes';
import EditClothing from './wardrobe/EditClothing';
import AddClothing from './wardrobe/AddClothing';
import Outfits from './wardrobe/Outfits';


const Stack = createStackNavigator();
const TopTab = createMaterialTopTabNavigator();

function WardrobeTabs() {
  return (
    <TopTab.Navigator>
      <TopTab.Screen name="Clothes" component={Clothes} />
      <TopTab.Screen name="Outfits" component={Outfits} />
    </TopTab.Navigator>
  );
}

export default function Wardrobe() {
  return (
    <Stack.Navigator>
      {/* Hide the header for the WardrobeTabs screen */}
      <Stack.Screen
        name="WardrobeTabs"
        component={WardrobeTabs}
        options={{ headerShown: false }} // Hide header for Tab navigator screen
      />

      {/* Other stack screens */}
      <Stack.Screen
        name="AddClothing"
        component={AddClothing}
        options={{ headerShown: false }} // Hide header for AddClothing screen
      />
      <Stack.Screen
        name="EditClothing"
        component={EditClothing}
        options={{ headerShown: false }} // Hide header for EditClothing screen
      />
    </Stack.Navigator>
  );
}

