import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  HStack,
  Text,
  Badge,
  IconButton,
  Divider,
  Alert,
  AlertIcon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Grid,
  GridItem,
  Card,
  CardBody,
  Flex,
  Spacer
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, EditIcon, PrintIcon } from '@chakra-ui/icons';

// Mock medicine database
const medicineDatabase = [
  { id: 1, name: 'Ashwagandha', category: 'Rasayana', manufacturer: 'Ayur Pharma', price: 120, stock: 50 },
  { id: 2, name: 'Triphala', category: 'Digestive', manufacturer: 'Herbal Health', price: 80, stock: 30 },
  { id: 3, name: 'Giloy', category: 'Immunomodulator', manufacturer: 'Nature Care', price: 95, stock: 25 },
  { id: 4, name: 'Chyawanprash', category: 'Rasayana', manufacturer: 'Wellness Plus', price: 250, stock: 15 },
  { id: 5, name: 'Brahmi', category: 'Medhya Rasayana', manufacturer: 'Mind Care', price: 140, stock: 20 },
  { id: 6, name: 'Arjuna', category: 'Cardiac', manufacturer: 'Heart Health', price: 110, stock: 35 }
];

const medicineTypes = [
  'Kashaya (Decoction)',
  'Churna (Powder)', 
  'Vati/Gutika (Tablet)',
  'Avaleha (Jam/Paste)',
  'Ghrita (Medicated Ghee)',
  'Taila (Medicated Oil)',
  'Asava/Arishta (Fermented)',
  'Bhasma (Calcined)',
  'Rasa (Mercury preparations)',
  'Kwatha (Concentrated decoction)'
];

const dosageOptions = [
  '1 tablet twice daily',
  '2 tablets twice daily', 
  '1 spoon twice daily',
  '2 spoons twice daily',
  '5ml twice daily',
  '10ml twice daily',
  'As directed by physician'
];

const anupanaOptions = [
  'Warm water',
  'Cold water',
  'Honey',
  'Ghee',
  'Milk',
  'Buttermilk',
  'After meals',
  'Before meals',
  'Empty stomach'
];

const MedicinePopup = ({ isOpen, onClose, patientData, onSave }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const toast = useToast();

  const [prescriptionForm, setPrescriptionForm] = useState({
    medicineId: '',
    medicineName: '',
    type: '',
    dosage: '',
    anupana: '',
    duration: '',
    frequency: 'twice daily',
    timing: 'after meals',
    quantity: 1,
    instructions: '',
    unitPrice: 0
  });

  // Filter medicines based on search
  const filteredMedicines = medicineDatabase.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reset form
  const resetForm = () => {
    setPrescriptionForm({
      medicineId: '',
      medicineName: '',
      type: '',
      dosage: '',
      anupana: '',
      duration: '',
      frequency: 'twice daily',
      timing: 'after meals',
      quantity: 1,
      instructions: '',
      unitPrice: 0
    });
    setSelectedMedicine(null);
    setEditingIndex(null);
  };

  // Handle medicine selection from database
  const handleMedicineSelect = (medicine) => {
    setSelectedMedicine(medicine);
    setPrescriptionForm(prev => ({
      ...prev,
      medicineId: medicine.id,
      medicineName: medicine.name,
      unitPrice: medicine.price
    }));
    setActiveTab(1); // Switch to prescription tab
  };

  // Add/Update prescription
  const handleAddPrescription = () => {
    if (!prescriptionForm.medicineName || !prescriptionForm.type || !prescriptionForm.dosage || !prescriptionForm.duration) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const prescription = {
      ...prescriptionForm,
      id: editingIndex !== null ? medicines[editingIndex].id : Date.now(),
      totalPrice: prescriptionForm.unitPrice * prescriptionForm.quantity
    };

    if (editingIndex !== null) {
      const updatedMedicines = [...medicines];
      updatedMedicines[editingIndex] = prescription;
      setMedicines(updatedMedicines);
      toast({
        title: 'Prescription Updated',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } else {
      setMedicines(prev => [...prev, prescription]);
      toast({
        title: 'Medicine Added',
        description: `${prescription.medicineName} added to prescription`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }

    resetForm();
    setActiveTab(2); // Switch to review tab
  };

  // Edit prescription
  const handleEditPrescription = (index) => {
    const medicine = medicines[index];
    setPrescriptionForm(medicine);
    setEditingIndex(index);
    setActiveTab(1);
  };

  // Delete prescription
  const handleDeletePrescription = (index) => {
    const updatedMedicines = medicines.filter((_, i) => i !== index);
    setMedicines(updatedMedicines);
    toast({
      title: 'Medicine Removed',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  // Calculate total bill
  const calculateTotal = () => {
    return medicines.reduce((total, med) => total + (med.unitPrice * med.quantity), 0);
  };

  // Save prescription
  const handleSave = () => {
    if (medicines.length === 0) {
      toast({
        title: 'No Medicines',
        description: 'Please add at least one medicine to the prescription',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const prescriptionData = {
      patientData,
      medicines,
      totalAmount: calculateTotal(),
      prescriptionDate: new Date().toISOString(),
      prescribedBy: 'Dr. Current User' // Replace with actual doctor data
    };

    onSave && onSave(prescriptionData);
    toast({
      title: 'Prescription Saved',
      description: `Prescription for ${patientData?.name || 'Patient'} has been saved successfully`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    onClose();
  };

  // Print prescription
  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" closeOnOverlayClick={false}>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent maxW="90vw" h="90vh">
        <ModalHeader bg="teal.500" color="white" roundedTop="md">
          <Flex align="center">
            <Box>
              <Text fontSize="xl" fontWeight="bold">Medicine Management System</Text>
              <Text fontSize="sm" opacity={0.9}>
                {patientData ? `Patient: ${patientData.name} | ID: ${patientData.id}` : 'New Prescription'}
              </Text>
            </Box>
            <Spacer />
            <HStack spacing={2}>
              <Button leftIcon={<PrintIcon />} variant="outline" colorScheme="whiteAlpha" size="sm" onClick={handlePrint}>
                Print
              </Button>
            </HStack>
          </Flex>
        </ModalHeader>
        <ModalCloseButton color="white" />

        <ModalBody p={0} overflow="hidden">
          <Tabs index={activeTab} onChange={setActiveTab} variant="enclosed" h="full">
            <TabList bg="gray.50" px={6}>
              <Tab>Medicine Database</Tab>
              <Tab>Add Prescription</Tab>
              <Tab>Review & Bill</Tab>
            </TabList>

            <TabPanels h="calc(90vh - 140px)">
              {/* Tab 1: Medicine Database */}
              <TabPanel p={6} h="full" overflow="auto">
                <VStack spacing={4} align="stretch">
                  <Box>
                    <FormControl>
                      <FormLabel>Search Medicines</FormLabel>
                      <Input
                        placeholder="Search by name or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        size="lg"
                      />
                    </FormControl>
                  </Box>

                  <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={4}>
                    {filteredMedicines.map(medicine => (
                      <Card key={medicine.id} cursor="pointer" _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
                            transition="all 0.2s" onClick={() => handleMedicineSelect(medicine)}>
                        <CardBody>
                          <VStack align="start" spacing={2}>
                            <HStack justify="space-between" w="full">
                              <Text fontWeight="bold" fontSize="lg">{medicine.name}</Text>
                              <Badge colorScheme="teal">₹{medicine.price}</Badge>
                            </HStack>
                            <Text color="gray.600">Category: {medicine.category}</Text>
                            <Text fontSize="sm" color="gray.500">Manufacturer: {medicine.manufacturer}</Text>
                            <HStack justify="space-between" w="full">
                              <Badge colorScheme={medicine.stock > 20 ? 'green' : medicine.stock > 10 ? 'yellow' : 'red'}>
                                Stock: {medicine.stock}
                              </Badge>
                              <Button size="sm" colorScheme="teal" leftIcon={<AddIcon />}>
                                Add to Prescription
                              </Button>
                            </HStack>
                          </VStack>
                        </CardBody>
                      </Card>
                    ))}
                  </Grid>
                </VStack>
              </TabPanel>

              {/* Tab 2: Add Prescription */}
              <TabPanel p={6} h="full" overflow="auto">
                <Grid templateColumns="1fr 1fr" gap={8} h="full">
                  <GridItem>
                    <VStack spacing={4} align="stretch">
                      <Text fontSize="lg" fontWeight="bold" color="teal.600">Medicine Details</Text>
                      
                      <FormControl isRequired>
                        <FormLabel>Medicine Name</FormLabel>
                        <Input
                          value={prescriptionForm.medicineName}
                          onChange={(e) => setPrescriptionForm(prev => ({...prev, medicineName: e.target.value}))}
                          placeholder="Enter medicine name"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Type/Form</FormLabel>
                        <Select
                          value={prescriptionForm.type}
                          onChange={(e) => setPrescriptionForm(prev => ({...prev, type: e.target.value}))}
                          placeholder="Select medicine type"
                        >
                          {medicineTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Dosage</FormLabel>
                        <Select
                          value={prescriptionForm.dosage}
                          onChange={(e) => setPrescriptionForm(prev => ({...prev, dosage: e.target.value}))}
                          placeholder="Select dosage"
                        >
                          {dosageOptions.map(dose => (
                            <option key={dose} value={dose}>{dose}</option>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Anupana (Vehicle)</FormLabel>
                        <Select
                          value={prescriptionForm.anupana}
                          onChange={(e) => setPrescriptionForm(prev => ({...prev, anupana: e.target.value}))}
                          placeholder="Select anupana"
                        >
                          {anupanaOptions.map(anupana => (
                            <option key={anupana} value={anupana}>{anupana}</option>
                          ))}
                        </Select>
                      </FormControl>
                    </VStack>
                  </GridItem>

                  <GridItem>
                    <VStack spacing={4} align="stretch">
                      <Text fontSize="lg" fontWeight="bold" color="teal.600">Prescription Details</Text>
                      
                      <HStack spacing={4}>
                        <FormControl isRequired>
                          <FormLabel>Duration</FormLabel>
                          <Input
                            value={prescriptionForm.duration}
                            onChange={(e) => setPrescriptionForm(prev => ({...prev, duration: e.target.value}))}
                            placeholder="e.g., 7 days, 2 weeks"
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Quantity</FormLabel>
                          <Input
                            type="number"
                            value={prescriptionForm.quantity}
                            onChange={(e) => setPrescriptionForm(prev => ({...prev, quantity: parseInt(e.target.value) || 1}))}
                            min={1}
                          />
                        </FormControl>
                      </HStack>

                      <FormControl>
                        <FormLabel>Frequency</FormLabel>
                        <Select
                          value={prescriptionForm.frequency}
                          onChange={(e) => setPrescriptionForm(prev => ({...prev, frequency: e.target.value}))}
                        >
                          <option value="once daily">Once daily</option>
                          <option value="twice daily">Twice daily</option>
                          <option value="thrice daily">Thrice daily</option>
                          <option value="as needed">As needed</option>
                        </Select>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Timing</FormLabel>
                        <Select
                          value={prescriptionForm.timing}
                          onChange={(e) => setPrescriptionForm(prev => ({...prev, timing: e.target.value}))}
                        >
                          <option value="before meals">Before meals</option>
                          <option value="after meals">After meals</option>
                          <option value="empty stomach">Empty stomach</option>
                          <option value="bedtime">Bedtime</option>
                        </Select>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Special Instructions</FormLabel>
                        <Textarea
                          value={prescriptionForm.instructions}
                          onChange={(e) => setPrescriptionForm(prev => ({...prev, instructions: e.target.value}))}
                          placeholder="Any special instructions..."
                          rows={3}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Unit Price (₹)</FormLabel>
                        <Input
                          type="number"
                          value={prescriptionForm.unitPrice}
                          onChange={(e) => setPrescriptionForm(prev => ({...prev, unitPrice: parseFloat(e.target.value) || 0}))}
                          step="0.01"
                        />
                      </FormControl>

                      <HStack spacing={4} pt={4}>
                        <Button colorScheme="teal" onClick={handleAddPrescription} leftIcon={<AddIcon />} flex={1}>
                          {editingIndex !== null ? 'Update Medicine' : 'Add to Prescription'}
                        </Button>
                        <Button variant="outline" onClick={resetForm}>Reset</Button>
                      </HStack>
                    </VStack>
                  </GridItem>
                </Grid>
              </TabPanel>

              {/* Tab 3: Review & Bill */}
              <TabPanel p={6} h="full" overflow="auto">
                <VStack spacing={6} align="stretch">
                  <Box>
                    <Text fontSize="lg" fontWeight="bold" color="teal.600" mb={4}>Prescription Summary</Text>
                    
                    {medicines.length === 0 ? (
                      <Alert status="info">
                        <AlertIcon />
                        No medicines added to prescription yet. Go to previous tabs to add medicines.
                      </Alert>
                    ) : (
                      <Table variant="simple" size="sm">
                        <Thead bg="teal.50">
                          <Tr>
                            <Th>Medicine</Th>
                            <Th>Type</Th>
                            <Th>Dosage</Th>
                            <Th>Duration</Th>
                            <Th>Qty</Th>
                            <Th>Price</Th>
                            <Th>Total</Th>
                            <Th>Actions</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {medicines.map((medicine, index) => (
                            <Tr key={medicine.id}>
                              <Td fontWeight="semibold">{medicine.medicineName}</Td>
                              <Td>{medicine.type}</Td>
                              <Td>{medicine.dosage}</Td>
                              <Td>{medicine.duration}</Td>
                              <Td>{medicine.quantity}</Td>
                              <Td>₹{medicine.unitPrice}</Td>
                              <Td>₹{(medicine.unitPrice * medicine.quantity).toFixed(2)}</Td>
                              <Td>
                                <HStack spacing={1}>
                                  <IconButton
                                    icon={<EditIcon />}
                                    size="sm"
                                    colorScheme="blue"
                                    variant="ghost"
                                    onClick={() => handleEditPrescription(index)}
                                  />
                                  <IconButton
                                    icon={<DeleteIcon />}
                                    size="sm"
                                    colorScheme="red"
                                    variant="ghost"
                                    onClick={() => handleDeletePrescription(index)}
                                  />
                                </HStack>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    )}
                  </Box>

                  {medicines.length > 0 && (
                    <Box bg="teal.50" p={4} borderRadius="md">
                      <HStack justify="space-between">
                        <Text fontSize="lg" fontWeight="bold">Total Amount:</Text>
                        <Text fontSize="2xl" fontWeight="bold" color="teal.600">₹{calculateTotal().toFixed(2)}</Text>
                      </HStack>
                    </Box>
                  )}
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>

        <ModalFooter bg="gray.50">
          <HStack spacing={4}>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button colorScheme="teal" onClick={handleSave} isDisabled={medicines.length === 0}>
              Save Prescription
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MedicinePopup;
