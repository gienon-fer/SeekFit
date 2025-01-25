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
  Size: ['XS', 'S', 'M', 'L', 'XL', 'unspecified'],
  Washing: [
    { label: "Hand wash", image: require('../assets/icon.png') },
    { label: "Machine wash", image: require('../assets/icon.png') },
    { label: "Do not wash", image: require('../assets/icon.png') },
    { label: "Dry clean only", image: require('../assets/icon.png') },
  ],
  Bleaching: [
    { label: "Do not bleach", image: require('../assets/icon.png') },
    { label: "Bleach when needed", image: require('../assets/icon.png') },
    { label: "Non-chlorine bleach only", image: require('../assets/icon.png') },
  ],
  Drying: [
    { label: "Tumble dry", image: require('../assets/icon.png') },
    { label: "Do not tumble dry", image: require('../assets/icon.png') },
    { label: "Line dry", image: require('../assets/icon.png') },
    { label: "Dry flat", image: require('../assets/icon.png') },
  ],
  Ironing: [
    { labe: "Don't iron", image: require('../assets/noironing.png'), width: 110, height: 80 },
    { label: "Iron", image: require('../assets/ironing0.png'), width: 110, height: 80 },
    { label: "Iron at low temperature", image: require('../assets/ironing1.png'), width: 110, height: 80 },
    { label: "Iron at medium temperature", image: require('../assets/ironing2.png'), width: 110, height: 80 },
    { label: "Iron at high temperature", image: require('../assets/ironing3.png'), width: 110, height: 80 },
  ],
  ProfessionalTextileCare: [
    { label: "Professional dry clean", image: require('../assets/icon.png') },
    { label: "Do not dry clean", image: require('../assets/icon.png') },
    { label: "Professional wet clean", image: require('../assets/icon.png') },
  ],
};

export const ClothingTagValuesProvider = ({ children }) => {
  return (
    <ClothingTagValuesContext.Provider value={clothingTagValues}>
      {children}
    </ClothingTagValuesContext.Provider>
  );
};

export const useClothingTagValues = () => useContext(ClothingTagValuesContext);
