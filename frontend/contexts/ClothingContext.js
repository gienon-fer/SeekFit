// contexts/ClothingContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { useOutfit } from './OutfitContext'; // Import useOutfit

const ClothingContext = createContext();

export function useClothing() {
  return useContext(ClothingContext);
}

export function ClothingProvider({ children }) {
  const [clothes, setClothes] = useState([]);
  const outfitContext = useOutfit(); // Get the outfit context
  const { outfits, editOutfit } = outfitContext || {}; // Destructure outfits and editOutfit from outfitContext

  useEffect(() => {
    const loadClothes = async () => {
      try {
        const storedClothes = await AsyncStorage.getItem('clothes');
        if (storedClothes) {
          setClothes(JSON.parse(storedClothes));
        }
      } catch (err) {
        console.error('Error loading clothes from AsyncStorage:', err);
      }
    };

    loadClothes();
  }, []);

  const addClothing = async (newClothing) => {
    try {
      const updatedClothes = [...clothes, { ...newClothing, id: Date.now().toString() }];
      await AsyncStorage.setItem('clothes', JSON.stringify(updatedClothes)); 
      setClothes(updatedClothes); 
    } catch (err) {
      console.error('Error adding clothing to AsyncStorage:', err);
    }
  };

  const removeClothing = async (id) => {
    try {
      const updatedClothes = clothes.filter((item) => item.id !== id);
      await AsyncStorage.setItem('clothes', JSON.stringify(updatedClothes)); 
      setClothes(updatedClothes); 

      // Iterate over outfits and delete the clothing tags that point to the removed item
      if (outfits) {
        outfits.forEach(async (outfit) => {
          const updatedClothing = outfit.clothing.filter((clothing) => clothing.id !== id);
          if (updatedClothing.length !== outfit.clothing.length) {
            await editOutfit(outfit.id, { clothing: updatedClothing });
          }
        });
      }
    } catch (err) {
      console.error('Error removing clothing from AsyncStorage:', err);
    }
  };

  const editClothing = async (id, updatedClothing) => {
    try {
      const updatedClothes = clothes.map((item) =>
        item.id === id ? { ...item, ...updatedClothing } : item
      );
      await AsyncStorage.setItem('clothes', JSON.stringify(updatedClothes));
      setClothes(updatedClothes);
    } catch (err) {
      console.error('Error editing clothing in AsyncStorage:', err);
    }
  };

  const resetClothing = async () => {
    try {
      await AsyncStorage.removeItem('clothes');
      setClothes([]);
    } catch (err) {
      console.error('Error resetting clothes in AsyncStorage:', err);
    }
  };

  return (
    <ClothingContext.Provider value={{ clothes, addClothing, removeClothing, editClothing, resetClothing }}>
      {children}
    </ClothingContext.Provider>
  );
}