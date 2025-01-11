// contexts/ClothingFilterContext.js
import React, { createContext, useContext, useState } from 'react';

const ClothingFilterContext = createContext();

export const useActiveClothingFilters = () => {
  return useContext(ClothingFilterContext).activeFilters;
};

export const useSetActiveClothingFilters = () => {
  return useContext(ClothingFilterContext).setActiveFilters;
};

export const ClothingFilterProvider = ({ children }) => {
  const [activeFilters, setActiveFilters] = useState({});

  return (
    <ClothingFilterContext.Provider value={{ activeFilters, setActiveFilters }}>
      {children}
    </ClothingFilterContext.Provider>
  );
};
