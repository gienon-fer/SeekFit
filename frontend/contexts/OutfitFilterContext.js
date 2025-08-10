import React, { createContext, useContext, useState } from 'react';

const OutfitFilterContext = createContext();

export const useActiveOutfitFilters = () => {
  return useContext(OutfitFilterContext).activeFilters;
};

export const useSetActiveOutfitFilters = () => {
  return useContext(OutfitFilterContext).setActiveFilters;
};

export const OutfitFilterProvider = ({ children }) => {
  const [activeFilters, setActiveFilters] = useState({});

  return (
    <OutfitFilterContext.Provider value={{ activeFilters, setActiveFilters }}>
      {children}
    </OutfitFilterContext.Provider>
  );
};
