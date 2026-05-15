import React from 'react';
import { Box, Text, Card, CardBody } from '@chakra-ui/react';

const TPATest = () => {
  return (
    <Box p={8}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        TPA Management Test Component
      </Text>
      <Card>
        <CardBody>
          <Text>If you can see this, the basic structure is working!</Text>
        </CardBody>
      </Card>
    </Box>
  );
};

export default TPATest;
