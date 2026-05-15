import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import OPD from './OPD';

// Test component to demonstrate OPD usage
const OPDTest = () => {
  return (
    <ChakraProvider>
      <OPD />
    </ChakraProvider>
  );
};

export default OPDTest;
