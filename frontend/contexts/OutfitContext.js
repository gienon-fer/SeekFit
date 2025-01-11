import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OutfitContext = createContext();

export function useOutfit() {
  return useContext(OutfitContext);
}

export function OutfitProvider({ children }) {
  const [outfits, setOutfits] = useState([]);

  useEffect(() => {
    const loadOutfits = async () => {
      try {
        const storedOutfits = await AsyncStorage.getItem('outfits');
        if (storedOutfits) {
          setOutfits(JSON.parse(storedOutfits));
        }
      } catch (err) {
        console.error('Error loading outfits from AsyncStorage:', err);
      }
    };

    loadOutfits();
  }, []);

  const addOutfit = async (newOutfit) => {
    try {
      const updatedOutfits = [...outfits, { ...newOutfit, id: Date.now().toString() }];
      await AsyncStorage.setItem('outfits', JSON.stringify(updatedOutfits));
      setOutfits(updatedOutfits);
    } catch (err) {
      console.error('Error adding outfit to AsyncStorage:', err);
    }
  };

  const removeOutfit = async (id) => {
    try {
      const updatedOutfits = outfits.filter((item) => item.id !== id);
      await AsyncStorage.setItem('outfits', JSON.stringify(updatedOutfits));
      setOutfits(updatedOutfits);
    } catch (err) {
      console.error('Error removing outfit from AsyncStorage:', err);
    }
  };

  const editOutfit = async (id, updatedOutfit) => {
    try {
      const updatedOutfits = outfits.map((item) =>
        item.id === id ? { ...item, ...updatedOutfit } : item
      );
      await AsyncStorage.setItem('outfits', JSON.stringify(updatedOutfits));
      setOutfits(updatedOutfits);
    } catch (err) {
      console.error('Error editing outfit in AsyncStorage:', err);
    }
  };

  const resetOutfits = async () => {
    try {
      await AsyncStorage.removeItem('outfits');
      setOutfits([]);
    } catch (err) {
      console.error('Error resetting outfits in AsyncStorage:', err);
    }
  };

  return (
    <OutfitContext.Provider value={{ outfits, addOutfit, removeOutfit, editOutfit, resetOutfits }}>
      {children}
    </OutfitContext.Provider>
  );
}

