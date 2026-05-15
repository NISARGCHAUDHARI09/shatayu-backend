import React, { useState, useEffect } from 'react';
import { getPharmacyBillHeaderFooter } from '../../../utils/pharmacyBillTemplate.js';
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Button,
  useToast,
  HStack,
  Text,
  Divider,
  IconButton
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

// Mock medicine database (replace with real API/db call)
const medicineDB = [
  { name: 'Ashwagandha', mfd: '2025-01-01', exp: '2027-01-01', unitPrice: '120' },
  { name: 'Triphala', mfd: '2024-12-01', exp: '2026-12-01', unitPrice: '80' },
  { name: 'Giloy', mfd: '2025-03-15', exp: '2027-03-15', unitPrice: '95' },
  { name: 'Chyawanprash', mfd: '2025-02-10', exp: '2026-08-10', unitPrice: '250' },
];

const initialForm = {
  name: '',
  type: '',
  dose: '',
  anupana: '',
  duration: '',
  notes: '',
  mfd: '',
  exp: '',
  unitPrice: '',
  quantity: '',
};

const typeOptions = [
  'Kashaya (Decoction)',
  'Churna (Powder)',
  'Vati/Gutika (Tablet)',
  'Avaleha (Jam/Paste)',
  'Ghrita (Medicated Ghee)',
  'Taila (Medicated Oil)',
  'Asava/Arishta (Fermented)',
  'Bhasma (Calcined)',
  'Rasa (Mercury preparations)',
  'Kwatha (Concentrated decoction)',
  'Other'
];

const doseOptions = [
  '1 tablet',
  '2 tablets',
  '5 ml',
  '10 ml',
  '1 spoon',
  '2 spoons',
  'As directed',
];

const anupanaOptions = [
  'Water',
  'Honey',
  'Ghee',
  'Milk',
  'Buttermilk',
  'Other'
];

const Medicine = ({ medicines: externalMedicines, setMedicines: setExternalMedicines, onMedicinesChange, patientData }) => {
  const [form, setForm] = useState(initialForm);
  const [medicines, setMedicines] = useState(externalMedicines || []);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const toast = useToast();

  // Update external medicines when internal medicines change
  React.useEffect(() => {
    if (setExternalMedicines) {
      setExternalMedicines(medicines);
    }
    if (onMedicinesChange) {
      onMedicinesChange(medicines);
    }
  }, [medicines, setExternalMedicines, onMedicinesChange]);

  // Update internal medicines when external medicines change
  React.useEffect(() => {
    if (externalMedicines) {
      setMedicines(externalMedicines);
    }
  }, [externalMedicines]);

  // Handle input changes and autofill
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') {
      setShowSuggestions(true);
      const med = medicineDB.find(m => m.name.toLowerCase() === value.toLowerCase());
      if (med) {
        setForm((prev) => ({
          ...prev,
          name: value,
          mfd: med.mfd,
          exp: med.exp,
          unitPrice: med.unitPrice
        }));
        return;
      }
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Add medicine with all required fields
  const handleAddMedicine = (e) => {
    e.preventDefault();
    if (!form.name || !form.type || !form.dose || !form.duration || !form.mfd || !form.exp || !form.unitPrice || !form.quantity) {
      toast({ title: 'Please fill all required fields', status: 'warning', duration: 2000, isClosable: true });
      return;
    }
    
    setMedicines((prev) => [...prev, { ...form, id: Date.now() }]);
    setForm(initialForm);
  };

  // Calculate total for billing
  const getTotal = () => {
    return medicines.reduce((sum, med) => {
      const price = parseFloat(med.unitPrice) || 0;
      const qty = parseFloat(med.quantity) || 0;
      return sum + price * qty;
    }, 0);
  };

  // Simple print handler
  const handlePrint = () => {
    window.print();
  };

  // Dummy patient info (replace with real data if available)
  const patientInfo = {
    name: 'John Doe',
    caseId: 'OPD001',
    age: 35,
    gender: 'Male',
    date: new Date().toLocaleDateString(),
  };

  // Get header/footer from setup
  const { header, footer } = getPharmacyBillHeaderFooter();

  return (
    <>
      <button id="medicine-print-proxy" style={{ display: 'none' }} onClick={handlePrint} tabIndex={-1} aria-hidden />
      <Box w="100%" maxW="1400px" mx="auto" py={4}>
        <Box display="flex" alignItems="stretch" w="full" bg="white" borderRadius="2xl" boxShadow="2xl" border="1px solid #e2e8f0" overflow="hidden">
          
          {/* Column 1: Medicine Form */}
          <Box flex={1} minW="300px" p={6} borderRight="1px solid #e2e8f0">
            <Heading size="md" color="teal.600" mb={4}>Add Medicine</Heading>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="medium">Medicine Name</FormLabel>
                <Input name="name" value={form.name} onChange={handleChange} placeholder="Search medicine..." size="sm" />
                {showSuggestions && form.name && (
                  <Box mt={1} maxH="100px" overflowY="auto" borderWidth={1} borderRadius="md" bg="white" zIndex={10}>
                    {medicineDB.filter(m => m.name.toLowerCase().includes(form.name.toLowerCase())).map((med, idx) => (
                      <Box key={idx} p={2} cursor="pointer" _hover={{ bg: "teal.50" }} onClick={() => {
                        setForm(prev => ({ ...prev, name: med.name, mfd: med.mfd, exp: med.exp, unitPrice: med.unitPrice }));
                        setShowSuggestions(false);
                      }}>
                        {med.name}
                      </Box>
                    ))}
                  </Box>
                )}
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="medium">Type</FormLabel>
                <Select name="type" value={form.type} onChange={handleChange} placeholder="Select type" size="sm">
                  {typeOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </Select>
              </FormControl>
              <HStack spacing={2}>
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="medium">Dose</FormLabel>
                  <Select name="dose" value={form.dose} onChange={handleChange} placeholder="Select dose" size="sm">
                    {doseOptions.map(option => <option key={option} value={option}>{option}</option>)}
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="medium">Anupana</FormLabel>
                  <Select name="anupana" value={form.anupana} onChange={handleChange} placeholder="Select anupana" size="sm">
                    {anupanaOptions.map(option => <option key={option} value={option}>{option}</option>)}
                  </Select>
                </FormControl>
              </HStack>
              <HStack spacing={2}>
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="medium">Duration</FormLabel>
                  <Input name="duration" value={form.duration} onChange={handleChange} placeholder="e.g., 7 days, 2 weeks" size="sm" />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="medium">Notes</FormLabel>
                  <Textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Additional instructions" size="sm" rows={2} />
                </FormControl>
              </HStack>
              <HStack spacing={2}>
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="medium">MFD</FormLabel>
                  <Input name="mfd" type="date" value={form.mfd} onChange={handleChange} size="sm" />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="medium">EXP</FormLabel>
                  <Input name="exp" type="date" value={form.exp} onChange={handleChange} size="sm" />
                </FormControl>
              </HStack>
              <HStack spacing={2}>
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="medium">Unit Price (₹)</FormLabel>
                  <Input name="unitPrice" type="number" value={form.unitPrice} onChange={handleChange} placeholder="0.00" size="sm" />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="medium">Quantity</FormLabel>
                  <Input name="quantity" type="number" value={form.quantity} onChange={handleChange} placeholder="1" size="sm" />
                </FormControl>
              </HStack>
              <Button colorScheme="teal" size="sm" onClick={handleAddMedicine}>Add Medicine</Button>
            </VStack>
          </Box>

          {/* Column 2: Medicine List */}
          <Box flex={1.2} minW="400px" p={6} borderRight="1px solid #e2e8f0">
            <Heading size="md" color="teal.600" mb={4}>Prescribed Medicines ({medicines.length})</Heading>
            {/* Clinical Header */}
            <Box textAlign="center" mb={4}>
              {header.split('\n').map((line, i) => (
                <Text key={i} fontWeight={i === 0 ? 'bold' : 'normal'} fontSize={i === 0 ? 'lg' : 'sm'}>{line}</Text>
              ))}
              <Divider my={2} />
            </Box>
            {/* Patient Info */}
            <Box mb={4}>
              <Text fontWeight="semibold">Patient: {patientData?.patientName || patientInfo.name}</Text>
              <Text fontSize="sm">Case ID: {patientData?.caseId || patientInfo.caseId}</Text>
              <Text fontSize="sm">Age/Gender: {patientData?.patientAge || patientInfo.age} / {patientData?.patientGender || patientInfo.gender}</Text>
              <Text fontSize="sm">Date: {patientInfo.date}</Text>
            </Box>
            <Divider my={2} />
            {medicines.length === 0 ? (
              <Text textAlign="center" color="gray.500" fontStyle="italic" py={8}>No medicines added yet</Text>
            ) : (
              <VStack spacing={3} align="stretch" maxH="400px" overflowY="auto">
                {medicines.map((med) => (
                  <Box key={med.id} p={3} borderWidth={1} borderRadius="md" bg="teal.50" position="relative">
                    <IconButton
                      icon={<CloseIcon boxSize={2.5} />}
                      size="xs"
                      colorScheme="red"
                      aria-label="Remove medicine"
                      position="absolute"
                      top={2}
                      right={2}
                      onClick={() => setMedicines(meds => meds.filter(m => m.id !== med.id))}
                    />
                    <Text fontWeight="bold">{med.name}</Text>
                    <Text fontSize="sm">Type: {med.type} | Dose: {med.dose} | Anupana: {med.anupana}</Text>
                    <Text fontSize="sm">Duration: {med.duration} | Notes: {med.notes}</Text>
                    <Text fontSize="sm">Mfd: {med.mfd} | Exp: {med.exp}</Text>
                    <Text fontSize="sm">Unit Price: ₹{med.unitPrice} | Qty: {med.quantity}</Text>
                  </Box>
                ))}
              </VStack>
            )}
            <Box textAlign="center" mt={4}>
              {footer.split('\n').map((line, i) => (
                <Text key={i} fontSize="sm" color="gray.500">{line}</Text>
              ))}
            </Box>
          </Box>

          {/* Column 3: Bill Format */}
          <Box flex={1.1} minW="350px" p={6}>
            <Heading size="md" color="teal.600" mb={4}>Pharmacy Bill</Heading>
            {/* Pharmacy Header */}
            <Box textAlign="center" mb={2}>
              {header.split('\n').map((line, i) => (
                <Text key={i} fontWeight={i === 0 ? 'bold' : 'normal'} fontSize={i === 0 ? 'lg' : 'sm'}>{line}</Text>
              ))}
              <Divider my={2} />
            </Box>
            {/* Patient Info */}
            <Box mb={2}>
              <Text fontWeight="semibold">Patient: {patientData?.patientName || patientInfo.name}</Text>
              <Text fontSize="sm">Case ID: {patientData?.caseId || patientInfo.caseId}</Text>
              <Text fontSize="sm">Age/Gender: {patientData?.patientAge || patientInfo.age} / {patientData?.patientGender || patientInfo.gender}</Text>
              <Text fontSize="sm">Date: {patientInfo.date}</Text>
            </Box>
            <Divider my={2} />
            {/* Simple Medicine Bill Table */}
            {medicines.length === 0 ? (
              <Box textAlign="center" fontStyle="italic" color="gray.500" py={4}>
                No medicines to bill
              </Box>
            ) : (
              <Box as="table" w="full" fontSize="sm" borderWidth={1} borderRadius="md" overflow="hidden">
                <Box as="thead" bg="teal.100">
                  <Box as="tr" display="flex">
                    <Box as="th" flex={2} p={2} textAlign="left" fontWeight="bold">Medicine</Box>
                    <Box as="th" flex={1} p={2} textAlign="center" fontWeight="bold">Qty</Box>
                    <Box as="th" flex={1} p={2} textAlign="right" fontWeight="bold">Price</Box>
                    <Box as="th" flex={1} p={2} textAlign="right" fontWeight="bold">Total</Box>
                  </Box>
                </Box>
                <Box as="tbody">
                  {medicines.map((med, idx) => (
                    <Box as="tr" display="flex" key={med.id} borderBottom="1px solid #e2e8f0" alignItems="center" _hover={{ bg: "gray.50" }}>
                      <Box as="td" flex={2} p={2} textAlign="left">{med.name}</Box>
                      <Box as="td" flex={1} p={2} textAlign="center">{med.quantity}</Box>
                      <Box as="td" flex={1} p={2} textAlign="right">₹{parseFloat(med.unitPrice || 0).toFixed(2)}</Box>
                      <Box as="td" flex={1} p={2} textAlign="right">₹{(parseFloat(med.unitPrice || 0) * parseFloat(med.quantity || 0)).toFixed(2)}</Box>
                    </Box>
                  ))}
                  {/* Total */}
                  <Box as="tr" display="flex" borderTop="2px solid #2d3748" bg="teal.100">
                    <Box as="td" flex={3} p={3} textAlign="right" fontWeight="bold" fontSize="md">TOTAL:</Box>
                    <Box as="td" flex={1} p={3} textAlign="right" fontWeight="bold" fontSize="md">₹{getTotal().toFixed(2)}</Box>
                  </Box>
                </Box>
              </Box>
            )}
            <Divider my={2} />
            <Box textAlign="center" mt={4}>
              {footer.split('\n').map((line, i) => (
                <Text key={i} fontSize="sm" color="gray.500">{line}</Text>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Medicine;
