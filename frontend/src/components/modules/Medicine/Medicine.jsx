import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getPharmacyBillHeaderFooter } from '../../../utils/pharmacyBillTemplate.js';
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Heading,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Button,
  useToast,
  Text,
  Divider,
  IconButton,
  Icon,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { Calendar } from 'lucide-react';

// Mock medicine database (replace with real API/db call)
// Will be fetched from MedicineManagement API
const VEDIC_MEDICINE_API_URL = 'https://shatayu-backend.onrender.com/api/medicines/vedic';
const CUSTOM_MEDICINE_API_URL = 'https://shatayu-backend.onrender.com/api/medicines/custom';

// medicineDB will be state, fetched from API

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



const Medicine = ({ medicines: externalMedicines, setMedicines: setExternalMedicines, onMedicinesChange }) => {
  const [form, setForm] = useState(initialForm);
  const [medicines, setMedicines] = useState(externalMedicines || []);
  const [medicineDB, setMedicineDB] = useState([]); // fetched from API
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [discountPrice, setDiscountPrice] = useState('');
  const [reminderDays, setReminderDays] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const toast = useToast();

  // Fetch medicines from MedicineManagement API on mount
  useEffect(() => {
    Promise.all([
      axios.get(VEDIC_MEDICINE_API_URL),
      axios.get(CUSTOM_MEDICINE_API_URL)
    ]).then(([vedicRes, customRes]) => {
      const vedic = Array.isArray(vedicRes.data) ? vedicRes.data : [];
      const custom = Array.isArray(customRes.data) ? customRes.data : [];
      setMedicineDB([...vedic, ...custom]);
    }).catch(() => {
      setMedicineDB([]);
    });
  }, []);

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

  // Parse duration string to extract number of days
  const parseDurationToDays = (duration) => {
    if (!duration) return 0;
    
    const durationStr = duration.toLowerCase().trim();
    const dayPattern = /(\d+)\s*days?/;
    const weekPattern = /(\d+)\s*weeks?/;
    const monthPattern = /(\d+)\s*months?/;
    
    if (dayPattern.test(durationStr)) {
      return parseInt(durationStr.match(dayPattern)[1]);
    } else if (weekPattern.test(durationStr)) {
      return parseInt(durationStr.match(weekPattern)[1]) * 7;
    } else if (monthPattern.test(durationStr)) {
      return parseInt(durationStr.match(monthPattern)[1]) * 30;
    }
    
    // Default fallback - try to extract any number and assume days
    const numberPattern = /(\d+)/;
    if (numberPattern.test(durationStr)) {
      return parseInt(durationStr.match(numberPattern)[1]);
    }
    
    return 7; // Default to 7 days if can't parse
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

  // Calculate bill total
  const getTotal = () => {
    return medicines.reduce((sum, med) => {
      const price = parseFloat(med.unitPrice) || 0;
      const qty = parseFloat(med.quantity) || 0;
      return sum + (price * qty);
    }, 0);
  };

  // Calculate final total with discount
  const getFinalTotal = () => {
    const originalTotal = getTotal();
    const discount = parseFloat(discountPrice) || 0;
    return discount > 0 ? discount : originalTotal;
  };

  // Calculate maximum duration from all medicines for reminder
  const getMaxDurationAndReminderDate = () => {
    if (medicines.length === 0) return { maxDays: 0, reminderDate: null, maxDurationMedicine: null };
    
    let maxDays = 0;
    let maxDurationMedicine = null;
    
    medicines.forEach(med => {
      const days = parseDurationToDays(med.duration);
      if (days > maxDays) {
        maxDays = days;
        maxDurationMedicine = med.name;
      }
    });
    
    if (maxDays > 0) {
      const currentDate = new Date();
      const reminderDate = new Date(currentDate.getTime() + (maxDays - 1) * 24 * 60 * 60 * 1000);
      return { maxDays, reminderDate, maxDurationMedicine };
    }
    
    return { maxDays: 0, reminderDate: null, maxDurationMedicine: null };
  };

  // Handle reminder days change
  const handleReminderDaysChange = (days) => {
    setReminderDays(days);
    if (days && parseInt(days) > 0) {
      const currentDate = new Date();
      const newReminderDate = new Date(currentDate.getTime() + (parseInt(days) - 1) * 24 * 60 * 60 * 1000);
      setReminderDate(newReminderDate.toISOString().split('T')[0]);
    } else {
      setReminderDate('');
    }
  };

  // Handle reminder date change
  const handleReminderDateChange = (dateString) => {
    setReminderDate(dateString);
    if (dateString) {
      const currentDate = new Date();
      const selectedDate = new Date(dateString);
      const diffTime = selectedDate.getTime() - currentDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 because reminder is 1 day before
      setReminderDays(diffDays > 0 ? diffDays.toString() : '');
    } else {
      setReminderDays('');
    }
  };

  // Update reminder fields when medicines change
  React.useEffect(() => {
    const { maxDays } = getMaxDurationAndReminderDate();
    if (maxDays > 0 && !reminderDays) {
      handleReminderDaysChange(maxDays.toString());
    }
  }, [medicines]);

  // Print handler
  const handlePrint = () => {
    if (medicines.length === 0) {
      toast({ title: 'Please add medicines before printing', status: 'warning', duration: 2000, isClosable: true });
      return;
    }
    
    // Add a small delay to ensure styles are applied
    setTimeout(() => {
      window.print();
    }, 100);
  };

  // Hidden proxy button for parent modal to trigger print
  // (ensures print is triggered from modal footer)

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
      <Box w="100%" maxW="1600px" mx="auto" py={4}>
      <Box display="flex" alignItems="stretch" w="full" bg="white" borderRadius="2xl" boxShadow="2xl" border="1px solid #e2e8f0" overflow="hidden">
        {/* Column 1: Medicine Form */}
        <Box flex={1} minW="380px" borderRight="1px solid #e2e8f0" p={6}>
          <Heading size="md" color="teal.600" mb={4}>Ayurvedic Medicine Form</Heading>
          <form onSubmit={handleAddMedicine} autoComplete="off">
            <VStack spacing={3} align="stretch">
              <FormControl isRequired>
                <FormLabel>Medicine Name</FormLabel>
                <Box position="relative">
                  <Input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Type or select medicine name"
                    autoComplete="off"
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                    onKeyDown={e => {
                      if (showSuggestions && e.key === 'Enter') {
                        const filtered = medicineDB.filter(m => m.name.toLowerCase().includes(form.name.toLowerCase()));
                        if (filtered.length > 0) {
                          setForm((prev) => ({
                            ...prev,
                            name: filtered[0].name,
                            mfd: filtered[0].mfd,
                            exp: filtered[0].exp,
                            unitPrice: filtered[0].unitPrice
                          }));
                          setShowSuggestions(false);
                          e.preventDefault();
                        }
                      }
                    }}
                  />
                  {showSuggestions && form.name && medicineDB.filter(m => m.name.toLowerCase().includes(form.name.toLowerCase())).length > 0 && (
                    <Box position="absolute" zIndex={10} bg="white" borderWidth={1} borderRadius="md" w="100%" maxH="150px" overflowY="auto" mt={1} boxShadow="md">
                      {medicineDB.filter(m => m.name.toLowerCase().includes(form.name.toLowerCase())).map((med) => (
                        <Box
                          key={med.name}
                          px={3} py={2}
                          _hover={{ bg: 'teal.100', cursor: 'pointer' }}
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => {
                            setForm((prev) => ({
                              ...prev,
                              name: med.name,
                              mfd: med.mfd,
                              exp: med.exp,
                              unitPrice: med.unitPrice
                            }));
                            setShowSuggestions(false);
                          }}
                        >
                          {med.name}
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Type</FormLabel>
                <Select name="type" value={form.type} onChange={handleChange} placeholder="Select type">
                  {typeOptions.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Dose</FormLabel>
                <Select name="dose" value={form.dose} onChange={handleChange} placeholder="Select dose">
                  {doseOptions.map((dose) => (
                    <option key={dose} value={dose}>{dose}</option>
                  ))}
                </Select>
              </FormControl>

              {/* Timing input + dropdown */}
              <FormControl isRequired>
                <FormLabel>Timing</FormLabel>
                <Select
                  name="timing"
                  value={form.timing || ''}
                  onChange={handleChange}
                  placeholder="Select timing"
                >
                  {/* Fetch timing options from MedicineManagement table's timing field */}
                  {[
                    'A-0-A', 'B-B-B', 'A-A-A', 'M-0-M', 'A-0-A', 'B-0-B'
                  ].map((timing) => (
                    <option key={timing} value={timing}>{timing}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Anupana (Vehicle)</FormLabel>
                <Select name="anupana" value={form.anupana} onChange={handleChange} placeholder="Select anupana">
                  {anupanaOptions.map((anupana) => (
                    <option key={anupana} value={anupana}>{anupana}</option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Duration</FormLabel>
                <Input name="duration" value={form.duration} onChange={handleChange} placeholder="e.g. 7 days, 1 month" />
              </FormControl>
              <FormControl>
                <FormLabel>Notes</FormLabel>
                <Textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Additional instructions or notes" rows={2} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Mfd</FormLabel>
                <Input name="mfd" value={form.mfd} onChange={handleChange} placeholder="Manufacture date" type="date" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Exp</FormLabel>
                <Input name="exp" value={form.exp} onChange={handleChange} placeholder="Expiry date" type="date" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Unit Price</FormLabel>
                <Input name="unitPrice" value={form.unitPrice} onChange={handleChange} placeholder="Unit price" type="number" min={0} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Quantity</FormLabel>
                <Input name="quantity" value={form.quantity} onChange={handleChange} placeholder="Quantity" type="number" min={1} />
              </FormControl>
              <Button colorScheme="teal" type="submit" px={8} alignSelf="flex-end">Add</Button>
            </VStack>
          </form>
          
          {/* Reminder Information */}
          <Box mt={6} p={4} bg="blue.50" borderRadius="lg" border="1px solid #bee3f8">
            <VStack align="stretch" spacing={3}>
              <HStack spacing={2}>
                <Icon as={Calendar} color="blue.500" />
                <Text fontSize="sm" fontWeight="bold" color="blue.700">Patient Reminder Settings</Text>
              </HStack>
              
              <HStack spacing={4}>
                <FormControl flex={1}>
                  <FormLabel fontSize="xs" color="blue.600">Treatment Days:</FormLabel>
                  <Input
                    value={reminderDays}
                    onChange={(e) => handleReminderDaysChange(e.target.value)}
                    placeholder="Enter days"
                    type="number"
                    min={1}
                    size="sm"
                    bg="white"
                    border="1px solid"
                    borderColor="blue.300"
                    _focus={{ borderColor: "blue.400", bg: "blue.50" }}
                  />
                </FormControl>
                
                <FormControl flex={1}>
                  <FormLabel fontSize="xs" color="blue.600">Reminder Date:</FormLabel>
                  <Input
                    value={reminderDate}
                    onChange={(e) => handleReminderDateChange(e.target.value)}
                    type="date"
                    size="sm"
                    bg="white"
                    border="1px solid"
                    borderColor="blue.300"
                    _focus={{ borderColor: "blue.400", bg: "blue.50" }}
                  />
                </FormControl>
              </HStack>
              
              <Text fontSize="xs" color="blue.500" fontStyle="italic" textAlign="center">
                📱 WhatsApp reminder will be sent on the selected date
              </Text>
            </VStack>
          </Box>
        </Box>
        {/* Column 2: Selected Medicines List */}
        <Box flex={1} minW="380px" borderRight="1px solid #e2e8f0" p={6} display="flex" flexDirection="column">
          <div className="print-page medicine-list-print" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Heading size="md" color="teal.600" mb={4} className="section-heading-hide-print">Selected Medicines</Heading>
            <Box textAlign="center" mb={2}>
              {header.split('\n').map((line, i) => (
                <Text key={i} fontWeight={i === 0 ? 'bold' : 'normal'} fontSize={i === 0 ? 'lg' : 'sm'}>{line}</Text>
              ))}
              <Divider my={2} />
            </Box>
            <Box flex="1">
              {medicines.length === 0 ? (
                <Text color="gray.500">No medicines added yet.</Text>
              ) : (
                <VStack spacing={3} align="stretch">
                  {medicines.map((med, idx) => (
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
            </Box>
            <Box textAlign="center" mt={4}>
              {footer.split('\n').map((line, i) => (
                <Text key={i} fontSize="sm" color="gray.500">{line}</Text>
              ))}
              <Text fontSize="sm" color="gray.600" mt={2}>
                A=After meal, B=Before meal, M=Middle of meal
              </Text>
            </Box>
          </div>
        </Box>
        {/* Column 3: Bill Format */}
        <Box flex={2} minW="600px" p={6} display="flex" flexDirection="column">
          <div className="print-page medicine-bill-print" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Heading size="md" color="teal.600" mb={4} className="section-heading-hide-print">Pharmacy Bill</Heading>
            {/* Pharmacy Header */}
            <Box textAlign="center" mb={2}>
              {header.split('\n').map((line, i) => (
                <Text key={i} fontWeight={i === 0 ? 'bold' : 'normal'} fontSize={i === 0 ? 'lg' : 'sm'}>{line}</Text>
              ))}
              <Divider my={2} />
            </Box>
            <Box flex="1">
              {/* Patient Info */}
              <Box mb={2}>
                <Text fontWeight="semibold">Patient: {patientInfo.name}</Text>
                <Text fontSize="sm">Case ID: {patientInfo.caseId}</Text>
                <Text fontSize="sm">Age/Gender: {patientInfo.age} / {patientInfo.gender}</Text>
                <Text fontSize="sm">Date: {patientInfo.date}</Text>
              </Box>
              <Divider my={2} />
              {/* Simple Medicine Bill Table */}
              {medicines.length === 0 ? (
                <Box textAlign="center" fontStyle="italic" color="gray.500" py={8}>
                  No medicines to bill
                </Box>
              ) : (
                <Box>
                  {/* Clean Bill Table */}
                  <Table variant="simple" size="sm" bg="white" borderWidth={1} borderColor="gray.300">
                    <Thead bg="teal.50">
                      <Tr>
                        <Th fontSize="xs" py={3} px={3} borderColor="gray.300">#</Th>
                        <Th fontSize="xs" py={3} px={3} borderColor="gray.300">Medicine</Th>
                        <Th fontSize="xs" py={3} px={3} borderColor="gray.300" textAlign="center">Qty</Th>
                        <Th fontSize="xs" py={3} px={3} borderColor="gray.300" textAlign="center">MFD</Th>
                        <Th fontSize="xs" py={3} px={3} borderColor="gray.300" textAlign="center">EXP</Th>
                        <Th fontSize="xs" py={3} px={3} borderColor="gray.300" textAlign="right">Rate</Th>
                        <Th fontSize="xs" py={3} px={3} borderColor="gray.300" textAlign="right">Total</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {medicines.map((med, index) => {
                        const unitPrice = parseFloat(med.unitPrice || 0);
                        const quantity = parseFloat(med.quantity || 0);
                        const total = unitPrice * quantity;
                        
                        return (
                          <Tr key={med.id} _hover={{ bg: "gray.50" }}>
                            <Td fontSize="sm" py={2} px={3} borderColor="gray.300" textAlign="center">
                              {index + 1}
                            </Td>
                            <Td fontSize="sm" py={2} px={3} borderColor="gray.300">
                              <Text fontWeight="medium">{med.name}</Text>
                              <Text fontSize="xs" color="gray.600">{med.type}</Text>
                            </Td>
                            <Td fontSize="sm" py={2} px={3} borderColor="gray.300" textAlign="center">
                              {med.quantity}
                            </Td>
                            <Td fontSize="xs" py={2} px={2} borderColor="gray.300" textAlign="center">
                              {med.mfd ? new Date(med.mfd).toLocaleDateString('en-GB', { 
                                day: '2-digit', 
                                month: '2-digit', 
                                year: '2-digit' 
                              }) : '-'}
                            </Td>
                            <Td fontSize="xs" py={2} px={2} borderColor="gray.300" textAlign="center">
                              {med.exp ? new Date(med.exp).toLocaleDateString('en-GB', { 
                                day: '2-digit', 
                                month: '2-digit', 
                                year: '2-digit' 
                              }) : '-'}
                            </Td>
                            <Td fontSize="sm" py={2} px={3} borderColor="gray.300" textAlign="right">
                              ₹{unitPrice.toFixed(2)}
                            </Td>
                            <Td fontSize="sm" py={2} px={3} borderColor="gray.300" textAlign="right" fontWeight="medium">
                              ₹{total.toFixed(2)}
                            </Td>
                          </Tr>
                        );
                      })}
                      
                      {/* Total Row */}
                      <Tr bg="teal.100" borderTop="2px solid" borderColor="teal.400">
                        <Td colSpan={6} fontSize="md" py={3} px={3} borderColor="gray.300" fontWeight="bold" textAlign="right">
                          TOTAL:
                        </Td>
                        <Td fontSize="lg" py={3} px={3} borderColor="gray.300" fontWeight="bold" textAlign="right" color="teal.700">
                          ₹{getTotal().toFixed(2)}
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                  
                  {/* Bill Summary */}
                  <Box mt={4} p={3} bg="gray.50" borderRadius="md" border="1px solid" borderColor="gray.200">
                    <VStack align="stretch" spacing={2}>
                      <HStack justify="space-between">
                        <Text fontSize="xs" fontWeight="medium">Items:</Text>
                        <Text fontSize="xs">{medicines.length}</Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text fontSize="xs" fontWeight="medium">Total Quantity:</Text>
                        <Text fontSize="xs">{medicines.reduce((sum, med) => sum + parseInt(med.quantity || 0), 0)}</Text>
                      </HStack>
                      <Divider />
                      <HStack justify="space-between">
                        <Text fontSize="sm" fontWeight="bold" color="teal.700">Grand Total:</Text>
                        <Text fontSize="sm" fontWeight="bold" color="teal.700">₹{getTotal().toFixed(2)}</Text>
                      </HStack>
                      
                      {/* Discount Section - Only show in print if discount is applied */}
                      <Box className={discountPrice ? "discount-section-show" : "discount-section-hide"}>
                        <Divider />
                        <FormControl>
                          <FormLabel fontSize="xs" fontWeight="medium" color="green.700">Discounted Price (Optional):</FormLabel>
                          <Input
                            value={discountPrice}
                            onChange={(e) => setDiscountPrice(e.target.value)}
                            placeholder="Enter final price after discount"
                            type="number"
                            min={0}
                            max={getTotal()}
                            size="sm"
                            bg="white"
                            border="2px solid"
                            borderColor="green.300"
                            _focus={{ borderColor: "green.400", bg: "green.50" }}
                          />
                        </FormControl>
                      </Box>
                      
                      {/* Final Total */}
                      <Divider />
                      <HStack justify="space-between">
                        <Text fontSize="md" fontWeight="bold" color={discountPrice ? "green.700" : "teal.700"}>
                          Final Total:
                        </Text>
                        <VStack align="end" spacing={0}>
                          {discountPrice && parseFloat(discountPrice) < getTotal() && (
                            <Text fontSize="xs" color="gray.500" textDecoration="line-through">
                              ₹{getTotal().toFixed(2)}
                            </Text>
                          )}
                          <Text fontSize="sm" fontWeight="bold" color={discountPrice ? "green.700" : "teal.700"} className="final-total-price">
                            ₹{getFinalTotal().toFixed(2)}
                          </Text>
                          {discountPrice && parseFloat(discountPrice) < getTotal() && (
                            <Badge colorScheme="green" variant="subtle" fontSize="xs">
                              Discount Applied
                            </Badge>
                          )}
                        </VStack>
                      </HStack>
                    </VStack>
                  </Box>
                </Box>
              )}
              <Box textAlign="center" mt={4}>
                {footer.split('\n').map((line, i) => (
                  <Text key={i} fontSize="sm" color="gray.500">{line}</Text>
                ))}
              </Box>
            </Box>
          </div>
        </Box>
      </Box>

  {/* Print button at the bottom removed as per requirements */}
      {/* Print CSS for page breaks and hiding non-print elements */}
      <style>{`
        @media print {
          /* Remove browser default margins for full page coverage */
          @page {
            margin: 0;
            size: A4;
          }
          
          /* Hide all screen elements initially */
          body * {
            visibility: hidden !important;
          }
          
          /* Show only print content */
          .medicine-list-print,
          .medicine-list-print *,
          .medicine-bill-print,
          .medicine-bill-print * {
            visibility: visible !important;
          }
          
          /* Reset body for full page print */
          html, body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
          }
          
          /* Page 1: Medicine List - Full page coverage like letterhead */
          .medicine-list-print {
            display: block !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background: white !important;
            page-break-after: always !important;
            padding: 40px !important;
            box-sizing: border-box !important;
            z-index: 1000 !important;
          }
          
          /* Page 2: Medicine Bill - Full page coverage like letterhead */
          .medicine-bill-print {
            display: block !important;
            position: fixed !important;
            top: 100vh !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background: white !important;
            page-break-before: always !important;
            padding: 40px !important;
            box-sizing: border-box !important;
            z-index: 1001 !important;
          }
          
          /* Hospital Letterhead Style Header */
          .medicine-list-print .chakra-text:first-child,
          .medicine-bill-print .chakra-text:first-child {
            font-size: 12px !important;
            font-weight: bold !important;
            text-align: center !important;
            color: #2c5282 !important;
            margin-bottom: 5px !important;
            text-transform: uppercase !important;
            letter-spacing: 1px !important;
          }
          
          /* Hospital Address/Info Style */
          .medicine-list-print .chakra-box:first-child .chakra-text:not(:first-child),
          .medicine-bill-print .chakra-box:first-child .chakra-text:not(:first-child) {
            font-size: 7px !important;
            text-align: center !important;
            color: #4a5568 !important;
            margin: 1px 0 !important;
          }
          
          /* Main heading style like official document */
          .medicine-list-print .chakra-heading,
          .medicine-bill-print .chakra-heading {
            display: none !important;
            visibility: hidden !important;
          }
          
          /* Content text styling - Different sizes for list vs bill */
          .medicine-list-print .chakra-text {
            display: block !important;
            visibility: visible !important;
            color: #2d3748 !important;
            font-size: 10px !important;
            line-height: 1.3 !important;
            margin-bottom: 4px !important;
          }
          
          .medicine-bill-print .chakra-text {
            display: block !important;
            visibility: visible !important;
            color: #2d3748 !important;
            font-size: 6px !important;
            line-height: 1.2 !important;
            margin-bottom: 3px !important;
          }
          
          /* Medicine boxes - Different sizes for list vs bill */
          .medicine-list-print .chakra-box[style*="teal.50"] {
            display: block !important;
            visibility: visible !important;
            border: 1px solid #2c5282 !important;
            background: #f7fafc !important;
            margin-bottom: 8px !important;
            padding: 8px !important;
            border-radius: 4px !important;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1) !important;
          }
          
          .medicine-bill-print .chakra-box {
            display: block !important;
            visibility: visible !important;
            border: 1px solid #2c5282 !important;
            background: #f7fafc !important;
            margin-bottom: 5px !important;
            padding: 5px !important;
            border-radius: 3px !important;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1) !important;
          }
          
          /* Strong text in medicine entries - Different sizes for list vs bill */
          .medicine-list-print .chakra-text[style*="fontWeight: bold"] {
            font-size: 11px !important;
            font-weight: bold !important;
            color: #2c5282 !important;
            margin-bottom: 4px !important;
          }
          
          .medicine-bill-print .chakra-text[style*="fontWeight: bold"] {
            font-size: 6.5px !important;
            font-weight: bold !important;
            color: #2c5282 !important;
            margin-bottom: 3px !important;
          }
          
          /* Show dividers as letterhead separators - Different spacing */
          .medicine-list-print .chakra-divider {
            display: block !important;
            visibility: visible !important;
            border-color: #2c5282 !important;
            border-width: 1px !important;
            margin: 8px 0 !important;
          }
          
          .medicine-bill-print .chakra-divider {
            display: block !important;
            visibility: visible !important;
            border-color: #2c5282 !important;
            border-width: 0.5px !important;
            margin: 5px 0 !important;
          }
          
          /* Patient info section styling - Reduced font size to half */
          .medicine-bill-print .chakra-text[style*="fontWeight: semibold"] {
            font-size: 6.5px !important;
            font-weight: bold !important;
            color: #2c5282 !important;
          }
          
          /* Table styling for professional bill */
          .medicine-bill-print .chakra-box[style*="table"] {
            border: 1px solid #2c5282 !important;
            border-radius: 3px !important;
            overflow: hidden !important;
          }
          
          .medicine-bill-print .chakra-box[style*="thead"] {
            background: #2c5282 !important;
            color: white !important;
          }
          
          .medicine-bill-print .chakra-box[style*="thead"] .chakra-box {
            color: white !important;
            font-weight: bold !important;
            font-size: 5.5px !important;
            text-align: center !important;
            padding: 4px 3px !important;
          }
          
          .medicine-bill-print .chakra-box[style*="tbody"] .chakra-box {
            border-bottom: 1px solid #e2e8f0 !important;
            padding: 3px 2px !important;
            font-size: 5.5px !important;
          }
          
          /* Total amount styling - Reduced font size to half */
          .medicine-bill-print .chakra-box[style*="textAlign: right"] {
            background: #2c5282 !important;
            color: white !important;
            font-size: 6px !important;
            font-weight: bold !important;
            padding: 4px !important;
            border-radius: 3px !important;
            margin-top: 5px !important;
          }
          
          /* Bill summary section - Reduced font sizes to half */
          .medicine-bill-print .chakra-box[style*="gray.50"] .chakra-text {
            font-size: 5.5px !important;
            margin-bottom: 2px !important;
          }
          
          /* Hide discount section in print if no discount applied */
          @media print {
            .discount-section-hide {
              display: none !important;
              visibility: hidden !important;
            }
            .discount-section-show {
              display: block !important;
              visibility: visible !important;
            }
            
            /* Hide section headings in print to save space */
            .section-heading-hide-print {
              display: none !important;
              visibility: hidden !important;
            }
            
            /* Final Total Price - Keep consistent readable size in print */
            .medicine-bill-print .final-total-price {
              font-size: 10px !important;
              font-weight: bold !important;
            }
            
            /* Override general text size for final total specifically */
            .medicine-bill-print .chakra-box[style*="gray.50"] .final-total-price {
              font-size: 10px !important;
              font-weight: bold !important;
            }
          }
          
          /* Footer styling like letterhead */
          .medicine-list-print .chakra-box:last-child .chakra-text,
          .medicine-bill-print .chakra-box:last-child .chakra-text {
            font-size: 12px !important;
            color: #718096 !important;
            text-align: center !important;
            margin: 2px 0 !important;
            font-style: italic !important;
          }
          
          /* Hide all UI elements during print */
          .chakra-button,
          .chakra-iconbutton {
            display: none !important;
            visibility: hidden !important;
          }
          
          /* Ensure full page utilization */
          .medicine-list-print > *,
          .medicine-bill-print > * {
            max-width: 100% !important;
            width: 100% !important;
          }
        }
      `}</style>
    </Box>
    </>
  );

};

export default Medicine;
