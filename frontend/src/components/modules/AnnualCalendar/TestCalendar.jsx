import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const TestCalendar = () => {
  return (
    <Box p={6}>
      <Text fontSize="2xl" fontWeight="bold" color="blue.600">
        Test Calendar Component
      </Text>
      <Text color="gray.600" mt={2}>
        This is a test to see if the calendar page can render basic content.
      </Text>
    </Box>
  );
};

export default TestCalendar;
