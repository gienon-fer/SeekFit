// contexts/ClothingContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const ClothingContext = createContext();

export function useClothing() {
  return useContext(ClothingContext);
}

export function ClothingProvider({ children }) {
  const [clothes, setClothes] = useState([]);

  // Load clothes from AsyncStorage on component mount
  useEffect(() => {
    const loadClothes = async () => {
      try {
        const storedClothes = await AsyncStorage.getItem('clothes');
        if (storedClothes) {
          setClothes(JSON.parse(storedClothes)); // Load clothes from AsyncStorage
        }
      } catch (err) {
        console.error('Error loading clothes from AsyncStorage:', err);
      }
    };

    loadClothes();
  }, []);

  // Add new clothing to AsyncStorage
  const addClothing = async (newClothing) => {
    try {
      const updatedClothes = [...clothes, newClothing];
      await AsyncStorage.setItem('clothes', JSON.stringify(updatedClothes)); // Save to AsyncStorage
      setClothes(updatedClothes); // Update the state
    } catch (err) {
      console.error('Error adding clothing to AsyncStorage:', err);
    }
  };

  // Remove clothing from AsyncStorage
  const removeClothing = async (id) => {
    try {
      const updatedClothes = clothes.filter((item) => item.id !== id);
      await AsyncStorage.setItem('clothes', JSON.stringify(updatedClothes)); // Save to AsyncStorage
      setClothes(updatedClothes); // Update the state
    } catch (err) {
      console.error('Error removing clothing from AsyncStorage:', err);
    }
  };

  // Edit clothing in AsyncStorage
  const editClothing = async (id, updatedClothing) => {
    try {
      const updatedClothes = clothes.map((item) =>
        item.id === id ? { ...item, ...updatedClothing } : item
      );
      await AsyncStorage.setItem('clothes', JSON.stringify(updatedClothes)); // Save to AsyncStorage
      setClothes(updatedClothes); // Update the state
    } catch (err) {
      console.error('Error editing clothing in AsyncStorage:', err);
    }
  };

  return (
    <ClothingContext.Provider value={{ clothes, addClothing, removeClothing, editClothing }}>
      {children}
    </ClothingContext.Provider>
  );
}