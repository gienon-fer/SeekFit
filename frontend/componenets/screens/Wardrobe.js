// screens/Wardrobe.js
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import Clothes from './wardrobe/Clothes';
import ClothingForm from './wardrobe/ClothingForm';
import Outfits from './wardrobe/Outfits';
import OutfitForm from './wardrobe/OutfitForm';
import SelectTagView from './SelectTagView';

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
        name="ClothingForm"
        component={ClothingForm}
        options={{ headerShown: false }} 
      />
      <Stack.Screen
        name="OutfitForm"
        component={OutfitForm}
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
}

