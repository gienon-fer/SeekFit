// contexts/ClothingContext.js
import React, { createContext, useContext, useState } from 'react';

const ClothingContext = createContext();

export function useClothing() {
  return useContext(ClothingContext);
}

export function ClothingProvider({ children }) {
  const [clothes, setClothes] = useState([]);  // Array to store clothing items

  const addClothing = (newClothing) => {
    setClothes((prevClothes) => [...prevClothes, newClothing]);
  };

  const removeClothing = (image) => {
    setClothes((prevClothes) => prevClothes.filter((item) => item.image !== image));
  };

  const editClothing = (updatedClothing) => {
    setClothes((prevClothes) =>
      prevClothes.map((item) =>
        item.image === updatedClothing.image ? updatedClothing : item
      )
    );
  };

  return (
    <ClothingContext.Provider value={{ clothes, addClothing, removeClothing, editClothing }}>
      {children}
    </ClothingContext.Provider>
  );
}