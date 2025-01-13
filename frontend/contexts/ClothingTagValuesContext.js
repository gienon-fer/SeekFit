import React, { createContext, useContext } from 'react';

export const ClothingTagValuesContext = createContext();

export const clothingTagValues = {
  Type: [
    "Tops",
    "Trousers and shorts",
    "Footwear",
    "Dresses",
    "Coats",
    "Jackets",
    "Skirts",
    "Sportswear",
    "Suits",
    "Handwear",
    "Accessories",
    "Outerwear"
  ],
  Color: ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Pink', 'Brown', 'Black', 'White', 'Grey', 'Beige'],
  Material: ['Cotton', 'Polyester', 'Wool', 'Silk', 'Linen', 'Leather'],
  Status: ['Borrowed', 'In Wash', 'Unavailable'],
  Size: ['XS', 'S', 'M', 'L', 'XL'],
};

export const ClothingTagValuesProvider = ({ children }) => {
  return (
    <ClothingTagValuesContext.Provider value={clothingTagValues}>
      {children}
    </ClothingTagValuesContext.Provider>
  );
};

export const useClothingTagValues = () => useContext(ClothingTagValuesContext);
