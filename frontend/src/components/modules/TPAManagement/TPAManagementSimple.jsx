import React, { useState } from 'react';
import {
  Box,
  Text,
  Card,
  CardBody,
  Button,
  HStack,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  useColorModeValue
} from '@chakra-ui/react';
import { Plus, Shield } from 'lucide-react';

// Simplified mock data
const simpleMockData = [
  {
    id: 'TPA001',
    name: 'Star Health Insurance',
    contactPerson: 'Priya Sharma',
    phone: '+91 98765 43210',
    email: 'priya@starhealth.com',
    status: 'Active',
    type: 'Health Insurance',
    claimsProcessed: 156,
    pendingClaims: 23,
    totalAmount: 4500000,
    approvalRate: 92
  },
  {
    id: 'TPA002',
    name: 'HDFC ERGO General Insurance',
    contactPerson: 'Rajesh Kumar',
    phone: '+91 87654 32109',
    email: 'rajesh@hdfcergo.com',
    status: 'Active',
    type: 'General Insurance',
    claimsProcessed: 89,
    pendingClaims: 12,
    totalAmount: 2800000,
    approvalRate: 88
  }
];

const TPAManagementSimple = () => {
  const [tpaList] = useState(simpleMockData);
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'green';
      case 'inactive': return 'red';
      default: return 'gray';
    }
  };

  return (
    <Box p={6}>
      {/* Simple Header */}
      <HStack justify="space-between" align="center" mb={6}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold">
            TPA Management
          </Text>
          <Text color="gray.600">
            Manage Third Party Administrator partnerships
          </Text>
        </Box>
        <Button colorScheme="blue" leftIcon={<Plus size={18} />}>
          Add TPA Partner
        </Button>
      </HStack>

      {/* Simple Stats */}
      <HStack spacing={4} mb={6}>
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody textAlign="center">
            <HStack justify="center" mb={2}>
              <Shield size={24} color="blue" />
              <Text fontSize="lg" fontWeight="bold">
                {tpaList.length}
              </Text>
            </HStack>
            <Text fontSize="sm" color="gray.600">Total TPAs</Text>
          </CardBody>
        </Card>
        
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody textAlign="center">
            <Text fontSize="lg" fontWeight="bold" color="green.600">
              {tpaList.filter(tpa => tpa.status === 'Active').length}
            </Text>
            <Text fontSize="sm" color="gray.600">Active TPAs</Text>
          </CardBody>
        </Card>
      </HStack>

      {/* Simple Table */}
      <Card bg={cardBg} border="1px" borderColor={borderColor}>
        <CardBody>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>TPA Details</Th>
                  <Th>Contact</Th>
                  <Th>Claims</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {tpaList.map((tpa) => (
                  <Tr key={tpa.id}>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="semibold">{tpa.name}</Text>
                        <Text fontSize="sm" color="gray.500">{tpa.id}</Text>
                        <Badge colorScheme="blue" variant="outline" size="sm">
                          {tpa.type}
                        </Badge>
                      </VStack>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="medium" fontSize="sm">{tpa.contactPerson}</Text>
                        <Text fontSize="xs" color="gray.500">{tpa.phone}</Text>
                        <Text fontSize="xs" color="gray.500">{tpa.email}</Text>
                      </VStack>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <Text fontSize="sm" fontWeight="medium">
                          {tpa.claimsProcessed} Processed
                        </Text>
                        <Text fontSize="sm" color="orange.600">
                          {tpa.pendingClaims} Pending
                        </Text>
                        <Text fontSize="sm" color="green.600">
                          {tpa.approvalRate}% Approval
                        </Text>
                      </VStack>
                    </Td>
                    <Td>
                      <Badge colorScheme={getStatusColor(tpa.status)} variant="subtle">
                        {tpa.status}
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </CardBody>
      </Card>
    </Box>
  );
};

export default TPAManagementSimple;
