import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Clothes from './wardrobe/Clothes';
import Outfits from './wardrobe/Outfits';

const TopTab = createMaterialTopTabNavigator();

export default function Wardrobe() {
  return (
    <TopTab.Navigator>
      <TopTab.Screen name="Clothes" component={Clothes} />
      <TopTab.Screen name="Outfits" component={Outfits} />
    </TopTab.Navigator>
  );
}