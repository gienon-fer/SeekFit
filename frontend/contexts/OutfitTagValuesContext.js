import React, { createContext, useContext } from 'react';

const OutfitTagValuesContext = createContext();

export const outfitTagValues = {
  Style: ['Casual', 'Formal'],
  Occasion: ['Work', 'Date', 'Wedding', 'Birthday', 'Party'],
  Temperature: ['Below 0°C (Freezing)', '0°C to 10°C (Cold)', '10°C to 15°C (Cool)', '15°C to 20°C (Mild)', '20°C to 25°C (Warm)', '25°C to 30°C (Hot)', 'Above 30°C (Very Hot)'],
  Weather: ['Sunny', 'Rain', 'Snow', 'Wind'],
};

export const OutfitTagValuesProvider = ({ children }) => {
  return (
    <OutfitTagValuesContext.Provider value={outfitTagValues}>
      {children}
    </OutfitTagValuesContext.Provider>
  );
};

export const useOutfitTagValues = () => useContext(OutfitTagValuesContext);
