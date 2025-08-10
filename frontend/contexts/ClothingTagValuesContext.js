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
    { label: "Wash at or below 30°C", image: require('../assets/wash30.png'), width: 110, height: 100  },
    { label: "Wash at or below 40°C", image: require('../assets/wash40.png'), width: 110, height: 100  },
    { label: "Wash at or below 50°C", image: require('../assets/wash50.png'), width: 110, height: 100  },
    { label: "Wash at or below 60°C", image: require('../assets/wash60.png'), width: 110, height: 100  },
    { label: "Wash at or below 70°C", image: require('../assets/wash70.png'), width: 110, height: 100  },
    { label: "Wash at or below 80°C", image: require('../assets/wash80.png'), width: 110, height: 100  },
    { label: "Wash at or below 90°C", image: require('../assets/wash90.png'), width: 110, height: 100  },
    { label: "Hand wash", image: require('../assets/handwash.png'), width: 110, height: 100  },
    { label: "Do not wash", image: require('../assets/wash0.png'), width: 110, height: 100  },
  ],
  Bleaching: [
    { label: "Bleaching allowed", image: require('../assets/triangle1.png') , width: 110, height: 110 },
    { label: "Do not bleach", image: require('../assets/triangle2.png') , width: 110, height: 110 },
    { label: "Bleaching with chlorine allowed ", image: require('../assets/triangle3.png') , width: 110, height: 110 },
    { label: "Non-chlorine bleach only", image: require('../assets/triangle4.png'), width: 110, height: 110  },
  ],
  Drying: [
    { label: "Tumble dry", image: require('../assets/tumble0.png') , width: 110, height: 110 },
    { label: "Tumble dry (low temperature)", image: require('../assets/tumble1.png'), width: 110, height: 110  },
    { label: "Tumble dry (normal)", image: require('../assets/tumble2.png') , width: 110, height: 110 },
    { label: "Do not tumble dry", image: require('../assets/tumble3.png') , width: 110, height: 110 },
    { label: "Dry", image: require('../assets/dry0.png') , width: 110, height: 110 },
    { label: "Line dry", image: require('../assets/dry5.png') , width: 110, height: 110 },
    { label: "Dry flat", image: require('../assets/dry1.png') , width: 110, height: 110 },
    { label: "Drip dry", image: require('../assets/dry3.png') , width: 110, height: 110 },
    { label: "Dry in the shade", image: require('../assets/dry6.png') , width: 110, height: 110 },
    { label: "Line dry in the shade", image: require('../assets/dry7.png'), width: 110, height: 110  },
    { label: "Dry flat in shade", image: require('../assets/dry4.png') , width: 110, height: 110 },
    { label: "Drip dry in shade", image: require('../assets/dry2.png'), width: 110, height: 110  },
  ],
  Ironing: [
    { label: "Don't iron", image: require('../assets/noironing.png'), width: 110, height: 80 },
    { label: "Iron", image: require('../assets/ironing0.png'), width: 110, height: 80 },
    { label: "Iron at low temperature", image: require('../assets/ironing1.png'), width: 110, height: 80 },
    { label: "Iron at medium temperature", image: require('../assets/ironing2.png'), width: 110, height: 80 },
    { label: "Iron at high temperature", image: require('../assets/ironing3.png'), width: 110, height: 80 },
  ],
  ProfessionalTextileCare: [
    { label: "Professional cleaning", image: require('../assets/circ0.png'), width: 110, height: 125 },
    { label: "Dry clean, HCS only", image: require('../assets/F.png'), width: 110, height: 125  },
    { label: "Gentle cleaning with HCS", image: require('../assets/F1.png'), width: 110, height: 125  },
    { label: "Very gentle cleaning with HCS", image: require('../assets/F2.png'), width: 110, height: 125  },
    { label: "Dry clean, PCE only", image: require('../assets/P.png'), width: 110, height: 125 },
    { label: "Gentle cleaning with PCE", image: require('../assets/P1.png'), width: 110, height: 125  },
    { label: "Very gentle cleaning with PCE", image: require('../assets/P2.png'), width: 110, height: 125  },
    { label: "Do not dry clean", image: require('../assets/circ1.png') , width: 110, height: 125 },
    { label: "Professional wet cleaning", image: require('../assets/W.png'), width: 110, height: 125  },
    { label: "Gentle wet cleaning", image: require('../assets/W1.png'), width: 110, height: 125  },
    { label: "Very gentle wet cleaning", image: require('../assets/W2.png') , width: 110, height: 125 },
    { label: "Do not wet clean", image: require('../assets/circ2.png'), width: 110, height: 125  },
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
