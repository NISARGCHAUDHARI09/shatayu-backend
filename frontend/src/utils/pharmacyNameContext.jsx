import React, { createContext, useContext, useState } from 'react';

const PharmacyNameContext = createContext();

export const PharmacyNameProvider = ({ children }) => {
  const [pharmacyName, setPharmacyName] = useState('Ayurvedic Pharmacy');
  return (
    <PharmacyNameContext.Provider value={{ pharmacyName, setPharmacyName }}>
      {children}
    </PharmacyNameContext.Provider>
  );
};

export const usePharmacyName = () => useContext(PharmacyNameContext);
