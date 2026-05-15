import React, { useState, useEffect } from 'react';
import { getPharmacyBillHeaderFooter } from '../../../utils/pharmacyBillTemplate.js';
import MedicinePrint from './medicine_print.jsx';
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
  const [reminderInfo, setReminderInfo] = useState({ days: 0, date: '', isEditable: false });
  const toast = useToast();

  // Indian Festival Days 2025 (major festivals)
  const indianFestivals2025 = [
    '2025-01-14', // Makar Sankranti
    '2025-01-26', // Republic Day
    '2025-03-14', // Holi
    '2025-04-13', // Ram Navami
    '2025-04-14', // Good Friday
    '2025-05-01', // May Day
    '2025-08-15', // Independence Day
    '2025-08-19', // Janmashtami
    '2025-09-07', // Ganesh Chaturthi
    '2025-10-02', // Gandhi Jayanti
    '2025-10-12', // Dussehra
    '2025-11-01', // Diwali
    '2025-11-05', // Bhai Dooj
    '2025-12-25', // Christmas
  ];

  // Parse duration string to days
  const parseDurationToDays = (duration) => {
    if (!duration) return 0;
    const durationLower = duration.toLowerCase();
    
    if (durationLower.includes('day')) {
      return parseInt(durationLower.match(/(\d+)/)?.[1] || '0');
    } else if (durationLower.includes('week')) {
      const weeks = parseInt(durationLower.match(/(\d+)/)?.[1] || '0');
      return weeks * 7;
    } else if (durationLower.includes('month')) {
      const months = parseInt(durationLower.match(/(\d+)/)?.[1] || '0');
      return months * 30; // Approximate
    } else if (durationLower.includes('year')) {
      const years = parseInt(durationLower.match(/(\d+)/)?.[1] || '0');
      return years * 365; // Approximate
    }
    return 0;
  };

  // Calculate business days excluding Sundays and festivals
  const calculateBusinessDate = (startDate, daysToAdd) => {
    let currentDate = new Date(startDate);
    let addedDays = 0;
    
    while (addedDays < daysToAdd) {
      currentDate.setDate(currentDate.getDate() + 1);
      
      // Check if it's not a Sunday (0 = Sunday)
      const isNotSunday = currentDate.getDay() !== 0;
      
      // Check if it's not a festival
      const dateStr = currentDate.toISOString().split('T')[0];
      const isNotFestival = !indianFestivals2025.includes(dateStr);
      
      if (isNotSunday && isNotFestival) {
        addedDays++;
      }
    }
    
    return currentDate;
  };

  // Calculate maximum duration and re-visit date
  const calculateReminderInfo = () => {
    if (medicines.length === 0) {
      setReminderInfo({ days: 0, date: '', isEditable: false });
      return;
    }

    // Find maximum duration from all medicines
    const maxDays = Math.max(...medicines.map(med => parseDurationToDays(med.duration)));
    
    if (maxDays > 0) {
      const today = new Date();
      const revisitDate = calculateBusinessDate(today, maxDays);
      
      setReminderInfo({
        days: maxDays,
        date: revisitDate.toISOString().split('T')[0],
        isEditable: false
      });
    } else {
      setReminderInfo({ days: 0, date: '', isEditable: false });
    }
  };

  // Handle days field change and update date accordingly
  const handleDaysChange = (days) => {
    const daysNum = parseInt(days) || 0;
    if (daysNum > 0) {
      const today = new Date();
      const newDate = calculateBusinessDate(today, daysNum);
      setReminderInfo(prev => ({
        ...prev,
        days: daysNum,
        date: newDate.toISOString().split('T')[0]
      }));
    } else {
      setReminderInfo(prev => ({ ...prev, days: daysNum, date: '' }));
    }
  };

  // Handle date field change and update days accordingly
  const handleDateChange = (dateStr) => {
    if (dateStr) {
      const selectedDate = new Date(dateStr);
      const today = new Date();
      
      // Calculate business days between today and selected date
      let daysDiff = 0;
      let currentDate = new Date(today);
      
      while (currentDate < selectedDate) {
        currentDate.setDate(currentDate.getDate() + 1);
        
        // Check if it's not a Sunday and not a festival
        const isNotSunday = currentDate.getDay() !== 0;
        const dateStr = currentDate.toISOString().split('T')[0];
        const isNotFestival = !indianFestivals2025.includes(dateStr);
        
        if (isNotSunday && isNotFestival && currentDate <= selectedDate) {
          daysDiff++;
        }
      }
      
      setReminderInfo(prev => ({
        ...prev,
        days: daysDiff,
        date: dateStr
      }));
    } else {
      setReminderInfo(prev => ({ ...prev, date: dateStr }));
    }
  };

  // Update external medicines when internal medicines change
  React.useEffect(() => {
    if (setExternalMedicines) {
      setExternalMedicines(medicines);
    }
    if (onMedicinesChange) {
      onMedicinesChange(medicines);
    }
    // Recalculate reminder info when medicines change
    calculateReminderInfo();
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

  // Schedule WhatsApp reminder based on reminder field (not individual medicines)
  const scheduleReminderBasedReminder = () => {
    if (patientData && reminderInfo.date && reminderInfo.days > 0) {
      const reminderDate = new Date(reminderInfo.date);
      reminderDate.setDate(reminderDate.getDate() - 1); // One day before the visit date
      
      // Store reminder in localStorage for automatic processing
      const reminders = JSON.parse(localStorage.getItem('patientReminders') || '[]');
      
      // Remove any existing reminder for this patient to avoid duplicates
      const filteredReminders = reminders.filter(r => r.patientId !== patientData.id);
      
      const newReminder = {
        id: Date.now(),
        patientId: patientData.id,
        patientName: patientData.name,
        patientPhone: patientData.phone,
        treatmentDuration: `${reminderInfo.days} days`,
        visitDate: reminderInfo.date,
        reminderDate: reminderDate.toISOString(),
        message: `Dear ${patientData.name}, you have a follow-up appointment scheduled for ${new Date(reminderInfo.date).toLocaleDateString('en-IN')}. Please visit the clinic as per your treatment plan.`,
        status: 'scheduled',
        createdAt: new Date().toISOString()
      };
      
      filteredReminders.push(newReminder);
      localStorage.setItem('patientReminders', JSON.stringify(filteredReminders));
      
      toast({
        title: 'WhatsApp Reminder Scheduled',
        description: `Reminder will be sent on ${reminderDate.toLocaleDateString('en-IN')} for visit on ${new Date(reminderInfo.date).toLocaleDateString('en-IN')}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Auto-schedule reminder when reminder info changes
  React.useEffect(() => {
    if (reminderInfo.date && reminderInfo.days > 0) {
      scheduleReminderBasedReminder();
    }
  }, [reminderInfo.date, reminderInfo.days]);

  // Calculate total for billing
  const getTotal = () => {
    return medicines.reduce((sum, med) => {
      const price = parseFloat(med.unitPrice) || 0;
      const qty = parseFloat(med.quantity) || 0;
      return sum + price * qty;
    }, 0);
  };

  // Print handler - now delegates to dedicated print component
  const handlePrint = () => {
    // Trigger the dedicated print component
    const printButton = document.querySelector('.medicine-print-button');
    if (printButton) {
      printButton.click();
    }
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

        {/* Column 2: Reminder System */}
        <Box flex={0.8} minW="280px" p={6} borderRight="1px solid #e2e8f0" bg="gray.50">
          <Heading size="md" color="purple.600" mb={4}>Reminder System</Heading>
          <VStack spacing={4} align="stretch">
            <Text fontSize="sm" color="gray.600">
              Automatic WhatsApp reminders will be sent based on the re-visit date below (excluding Sundays & festivals).
            </Text>
            
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="medium">
                Days until re-visit 
                <Text as="span" fontSize="xs" color="gray.500" ml={2}>
                  (Max duration: {reminderInfo.days} days)
                </Text>
              </FormLabel>
              <Input 
                type="number" 
                value={reminderInfo.days} 
                onChange={(e) => handleDaysChange(e.target.value)}
                placeholder="Enter days"
                size="sm"
                isDisabled={!reminderInfo.isEditable && medicines.length > 0}
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm" fontWeight="medium">Re-visit Date</FormLabel>
              <Input 
                type="date" 
                value={reminderInfo.date} 
                onChange={(e) => handleDateChange(e.target.value)}
                size="sm"
                min={new Date().toISOString().split('T')[0]}
                isDisabled={!reminderInfo.isEditable && medicines.length > 0}
              />
            </FormControl>

            <Button 
              size="sm" 
              variant="outline" 
              colorScheme="purple"
              onClick={() => setReminderInfo(prev => ({ ...prev, isEditable: !prev.isEditable }))}
            >
              {reminderInfo.isEditable ? 'Lock' : 'Edit'} Reminder
            </Button>

            {reminderInfo.date && (
              <Box p={3} bg="purple.50" borderRadius="md" border="1px solid" borderColor="purple.200">
                <Text fontSize="sm" fontWeight="medium" color="purple.700">
                  WhatsApp Reminder Scheduled
                </Text>
                <Text fontSize="xs" color="purple.600">
                  Patient will be reminded on {new Date(new Date(reminderInfo.date).getTime() - 24*60*60*1000).toLocaleDateString('en-IN')} for visit on {new Date(reminderInfo.date).toLocaleDateString('en-IN')}
                </Text>
              </Box>
            )}
          </VStack>
        </Box>

        {/* Column 3: Medicine List */}
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
        {/* Column 4: Bill Format */}
        <Box flex={1.1} minW="350px" p={6}>
          {/* UI Display - Not for printing */}
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
            {/* Medicine Bill Table - Enhanced Format */}
            {medicines.length === 0 ? (
              <Box textAlign="center" fontStyle="italic" color="gray.500" py={4}>
                No medicines to bill
              </Box>
            ) : (
              <Box as="table" w="full" fontSize="sm" borderWidth={1} borderRadius="md" overflow="hidden">
                <Box as="thead" bg="teal.100">
                  <Box as="tr" display="flex">
                    <Box as="th" w="8%" p={2} textAlign="center" fontWeight="bold">S.No.</Box>
                    <Box as="th" w="25%" p={2} textAlign="left" fontWeight="bold">Medicine Name</Box>
                    <Box as="th" w="12%" p={2} textAlign="center" fontWeight="bold">Batch No.</Box>
                    <Box as="th" w="12%" p={2} textAlign="center" fontWeight="bold">MFD</Box>
                    <Box as="th" w="12%" p={2} textAlign="center" fontWeight="bold">EXP</Box>
                    <Box as="th" w="12%" p={2} textAlign="right" fontWeight="bold">Unit Price</Box>
                    <Box as="th" w="9%" p={2} textAlign="center" fontWeight="bold">Qty</Box>
                    <Box as="th" w="10%" p={2} textAlign="right" fontWeight="bold">Total</Box>
                  </Box>
                </Box>
                <Box as="tbody">
                  {medicines.map((med, idx) => (
                    <Box as="tr" display="flex" key={med.id} borderBottom="1px solid #e2e8f0" alignItems="center" _hover={{ bg: "gray.50" }}>
                      <Box as="td" w="8%" p={2} textAlign="center">{idx + 1}</Box>
                      <Box as="td" w="25%" p={2} textAlign="left">{med.name}</Box>
                      <Box as="td" w="12%" p={2} textAlign="center">{med.batchNo || 'B' + Math.random().toString().substr(2, 6)}</Box>
                      <Box as="td" w="12%" p={2} textAlign="center">{med.mfd}</Box>
                      <Box as="td" w="12%" p={2} textAlign="center">{med.exp}</Box>
                      <Box as="td" w="12%" p={2} textAlign="right">₹{parseFloat(med.unitPrice || 0).toFixed(2)}</Box>
                      <Box as="td" w="9%" p={2} textAlign="center">{med.quantity}</Box>
                      <Box as="td" w="10%" p={2} textAlign="right">₹{(parseFloat(med.unitPrice || 0) * parseFloat(med.quantity || 0)).toFixed(2)}</Box>
                    </Box>
                  ))}
                  {/* Billing Summary */}
                  <Box as="tr" display="flex" borderTop="2px solid #2d3748" bg="gray.50">
                    <Box as="td" w="79%" p={2} textAlign="right" fontWeight="bold">SUB TOTAL:</Box>
                    <Box as="td" w="21%" p={2} textAlign="right" fontWeight="bold">₹{getTotal().toFixed(2)}</Box>
                  </Box>
                  <Box as="tr" display="flex" bg="gray.50">
                    <Box as="td" w="79%" p={2} textAlign="right">GST (18%):</Box>
                    <Box as="td" w="21%" p={2} textAlign="right">₹{(getTotal() * 0.18).toFixed(2)}</Box>
                  </Box>
                  <Box as="tr" display="flex" bg="gray.50">
                    <Box as="td" w="79%" p={2} textAlign="right">Discount:</Box>
                    <Box as="td" w="21%" p={2} textAlign="right">₹0.00</Box>
                  </Box>
                  <Box as="tr" display="flex" borderTop="2px solid #2d3748" bg="teal.100">
                    <Box as="td" w="79%" p={3} textAlign="right" fontWeight="bold" fontSize="md">GRAND TOTAL:</Box>
                    <Box as="td" w="21%" p={3} textAlign="right" fontWeight="bold" fontSize="md">₹{(getTotal() * 1.18).toFixed(2)}</Box>
                  </Box>
                </Box>
              </Box>
            )}
            <Divider my={2} />
            {/* Bill Footer - Updated to show Grand Total with Tax */}
            <Box textAlign="right" mt={2}>
              <Text fontSize="sm" color="gray.600">Amount Payable: ₹{(getTotal() * 1.18).toFixed(2)} (Including GST)</Text>
            </Box>
            <Box textAlign="center" mt={4}>
              {footer.split('\n').map((line, i) => (
                <Text key={i} fontSize="sm" color="gray.500">{line}</Text>
              ))}
            </Box>
        </Box>
      </Box>

      {/* Add the dedicated print component */}
      <MedicinePrint 
        medicines={medicines} 
        patientData={patientData} 
        onPrint={() => console.log('Print completed')}
      />
    </Box>
    </>
  );
};

export default Medicine;
