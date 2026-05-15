import React, { useState } from 'react';
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Input,
  HStack,
  Text,
  Badge,
  IconButton,
  Select,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
  Spacer,
} from '@chakra-ui/react';
import { 
  Plus, 
  Upload, 
  Users, 
  Trash2, 
  MoreVertical,
  Search,
  FileText,
  Download,
  Print
} from 'lucide-react';

const PatientListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [pageSize, setPageSize] = useState(100);

  // Mock patient data
  const patients = [
    {
      id: 1,
      name: "Olivier Thomas",
      age: "41 Year, 4 Month, 30 Day",
      gender: "Male",
      phone: "7896541230",
      guardian: "Edward Thomas",
      address: "482 Kingsway, Brooklyn West, CA",
      dead: false
    },
    {
      id: 2,
      name: "John Marshall",
      age: "30 Year, 6 Month, 21 Day",
      gender: "Male",
      phone: "9856475632",
      guardian: "Smith Marshall",
      address: "Blackstone Park, Brooklyn North, CA",
      dead: false
    },
    {
      id: 121,
      name: "Maria Taylor",
      age: "14 Year, 10 Month, 5 Day",
      gender: "Female",
      phone: "7488548942",
      guardian: "Jonson",
      address: "CA,USA",
      dead: false
    },
    {
      id: 363,
      name: "Mahima Shinde",
      age: "25 Year, 3 Month, 10 Day",
      gender: "Female",
      phone: "94894161854",
      guardian: "",
      address: "",
      dead: false
    },
    {
      id: 484,
      name: "Dhawan Kulkarni",
      age: "11 Year, 6 Month, 2 Day",
      gender: "Male",
      phone: "8908067876",
      guardian: "Mohan Kulkarni",
      address: "DP Patil Road",
      dead: false
    },
    {
      id: 489,
      name: "Gaurav Patel",
      age: "8 Year, 3 Month, 23 Day",
      gender: "Male",
      phone: "769787087989",
      guardian: "kunal Patel",
      address: "Delhi Road",
      dead: true
    },
    {
      id: 493,
      name: "Ankit Singh",
      age: "13 Year, 8 Month, 5 Day",
      gender: "Male",
      phone: "898797856",
      guardian: "Jatin singh",
      address: "Delhi Road",
      dead: false
    },
    {
      id: 509,
      name: "Daniel Wood",
      age: "15 Year, 3 Month, 15 Day",
      gender: "Male",
      phone: "78909806787",
      guardian: "",
      address: "",
      dead: false
    },
    {
      id: 520,
      name: "Shakib Khanna",
      age: "8 Year, 2 Month, 11 Day",
      gender: "Male",
      phone: "789090890",
      guardian: "Usman Khnna",
      address: "",
      dead: false
    },
    {
      id: 531,
      name: "Olivier Thomas",
      age: "25 Year, 9 Month, 5 Day",
      gender: "Male",
      phone: "962547581",
      guardian: "Edward Thomas",
      address: "482 Kingsway, Brooklyn West, CA",
      dead: false
    },
    {
      id: 539,
      name: "David Hussan",
      age: "22 Year, 8 Month, 0 Day",
      gender: "Male",
      phone: "89080867876",
      guardian: "Peter Hussan",
      address: "CA",
      dead: true
    },
    {
      id: 542,
      name: "Olivier Thomas",
      age: "0 Year, 0 Month, 0 Day",
      gender: "Male",
      phone: "9254582321",
      guardian: "",
      address: "",
      dead: false
    },
    {
      id: 561,
      name: "Olivier Thomas",
      age: "0 Year, 0 Month, 0 Day",
      gender: "Male",
      phone: "9214711125",
      guardian: "",
      address: "",
      dead: false
    },
    {
      id: 563,
      name: "Nivetha Thomas",
      age: "27 Year, 9 Month, 30 Day",
      gender: "Female",
      phone: "08907867876",
      guardian: "Alishter Thomas",
      address: "",
      dead: false
    },
    {
      id: 578,
      name: "Ashutosh pandey",
      age: "7 Year, 10 Month, 7 Day",
      gender: "Male",
      phone: "897646216",
      guardian: "Devendra",
      address: "Ca , Delhi Road",
      dead: false
    },
    {
      id: 580,
      name: "Stuart Wood",
      age: "13 Year, 10 Month, 7 Day",
      gender: "Male",
      phone: "87969078",
      guardian: "Martin Wood",
      address: "",
      dead: false
    },
    {
      id: 584,
      name: "Jamesh Wood",
      age: "13 Year, 8 Month, 2 Day",
      gender: "Male",
      phone: "8979006786",
      guardian: "David Wood",
      address: "",
      dead: false
    }
  ];

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm) ||
    patient.guardian.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedPatients(filteredPatients.map(p => p.id));
    } else {
      setSelectedPatients([]);
    }
  };

  const handleSelectPatient = (patientId, checked) => {
    if (checked) {
      setSelectedPatients([...selectedPatients, patientId]);
    } else {
      setSelectedPatients(selectedPatients.filter(id => id !== patientId));
    }
  };

  return (
    <Box p={6} bg="white" borderRadius="lg" boxShadow="sm">
      {/* Header */}
      <Flex mb={4} align="center">
        <Text fontSize="xl" fontWeight="bold">Patient List</Text>
        <Spacer />
        <HStack spacing={2}>
          <Button leftIcon={<Plus size={16} />} colorScheme="blue" size="sm">
            Add New Patient
          </Button>
          <Button leftIcon={<Upload size={16} />} colorScheme="green" size="sm">
            Export Patient
          </Button>
          <Button leftIcon={<Users size={16} />} colorScheme="blue" size="sm">
            Disabled Patient List
          </Button>
          {selectedPatients.length > 0 && (
            <Button leftIcon={<Trash2 size={16} />} colorScheme="red" size="sm">
              Delete Selected
            </Button>
          )}
        </HStack>
      </Flex>

      {/* Search and Controls */}
      <Flex mb={4} align="center" gap={4}>
        <Box position="relative" flex={1} maxW="400px">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            pr={10}
          />
          <Box position="absolute" right={3} top={2}>
            <Search size={16} color="gray" />
          </Box>
        </Box>
        <Spacer />
        <HStack>
          <Select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} size="sm" w="80px">
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </Select>
          <IconButton icon={<FileText size={16} />} size="sm" variant="outline" />
          <IconButton icon={<Download size={16} />} size="sm" variant="outline" />
          <IconButton icon={<Print size={16} />} size="sm" variant="outline" />
        </HStack>
      </Flex>

      {/* Table */}
      <Box overflowX="auto">
        <Table variant="simple" size="sm">
          <Thead>
            <Tr bg="gray.50">
              <Th width="40px">
                <Checkbox
                  isChecked={selectedPatients.length === filteredPatients.length && filteredPatients.length > 0}
                  isIndeterminate={selectedPatients.length > 0 && selectedPatients.length < filteredPatients.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </Th>
              <Th>Patient Name</Th>
              <Th>Age</Th>
              <Th>Gender</Th>
              <Th>Phone</Th>
              <Th>Guardian Name</Th>
              <Th>Address</Th>
              <Th>Dead</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredPatients.slice(0, pageSize).map((patient) => (
              <Tr key={patient.id} _hover={{ bg: "gray.50" }}>
                <Td>
                  <Checkbox
                    isChecked={selectedPatients.includes(patient.id)}
                    onChange={(e) => handleSelectPatient(patient.id, e.target.checked)}
                  />
                </Td>
                <Td>
                  <Text color="blue.600" fontWeight="medium">
                    {patient.name} ({patient.id})
                  </Text>
                </Td>
                <Td>{patient.age}</Td>
                <Td>
                  <Text color={patient.gender === "Male" ? "blue.600" : "pink.600"}>
                    {patient.gender}
                  </Text>
                </Td>
                <Td>{patient.phone}</Td>
                <Td>{patient.guardian}</Td>
                <Td>{patient.address}</Td>
                <Td>
                  <Badge colorScheme={patient.dead ? "red" : "green"}>
                    {patient.dead ? "Yes" : "No"}
                  </Badge>
                </Td>
                <Td>
                  <Menu>
                    <MenuButton as={IconButton} icon={<MoreVertical size={16} />} size="sm" variant="ghost" />
                    <MenuList>
                      <MenuItem>View Details</MenuItem>
                      <MenuItem>Edit Patient</MenuItem>
                      <MenuItem>Medical History</MenuItem>
                      <MenuItem>Appointments</MenuItem>
                      <MenuItem color="red.600">Delete</MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Footer */}
      <Flex mt={4} justify="space-between" align="center">
        <Text fontSize="sm" color="gray.600">
          Showing {Math.min(filteredPatients.length, pageSize)} of {filteredPatients.length} entries
        </Text>
        <HStack>
          <Button size="sm" variant="outline">Previous</Button>
          <Button size="sm" variant="outline">Next</Button>
        </HStack>
      </Flex>
    </Box>
  );
};

export default PatientListPage;
