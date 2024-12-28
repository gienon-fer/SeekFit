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
      <Stack.Screen
        name="WardrobeTabs"
        component={WardrobeTabs}
        options={{ headerShown: false }} 
      />
      <Stack.Screen
        name="AddClothing"
        component={AddClothing}
        options={{ headerShown: false }} 
      />
      <Stack.Screen
        name="EditClothing"
        component={EditClothing}
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
}

