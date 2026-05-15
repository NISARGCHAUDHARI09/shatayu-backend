import React, { useState } from 'react';
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
  Badge
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { Calendar } from 'lucide-react';

// RemindersList component to show scheduled reminders
const RemindersList = () => {
  const [reminders, setReminders] = React.useState([]);

  React.useEffect(() => {
    const loadReminders = () => {
      try {
        const stored = JSON.parse(localStorage.getItem('patientReminders') || '[]');
        const recent = stored.slice(-3); // Show last 3 reminders
        setReminders(recent);
      } catch (error) {
        console.error('Error loading reminders:', error);
      }
    };

    loadReminders();
    const interval = setInterval(loadReminders, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  if (reminders.length === 0) {
    return (
      <Text fontSize="xs" color="gray.500" fontStyle="italic">
        No reminders scheduled yet
      </Text>
    );
  }

  return (
    <VStack align="stretch" spacing={2}>
      <Text fontSize="xs" fontWeight="semibold" color="blue.700">Recent Reminders:</Text>
      {reminders.map((reminder) => (
        <Box key={reminder.id} p={2} bg="white" borderRadius="md" border="1px solid #e2e8f0">
          <HStack justify="space-between">
            <VStack align="start" spacing={0}>
              <Text fontSize="xs" fontWeight="semibold">
                {reminder.patientInfo.name} - {reminder.medicine.name}
              </Text>
              <Text fontSize="xs" color="gray.600">
                Reminder: {new Date(reminder.reminderDate).toLocaleDateString()}
              </Text>
            </VStack>
            <Badge 
              colorScheme={reminder.status === 'sent' ? 'green' : 'orange'} 
              size="sm"
            >
              {reminder.status}
            </Badge>
          </HStack>
        </Box>
      ))}
    </VStack>
  );
};



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



const Medicine = ({ medicines: externalMedicines, setMedicines: setExternalMedicines, onMedicinesChange }) => {
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

  // Schedule WhatsApp reminder for patient re-visit
  const schedulePatientReminder = (medicineData) => {
    try {
      const durationDays = parseDurationToDays(medicineData.duration);
      const currentDate = new Date();
      const reminderDate = new Date(currentDate.getTime() + (durationDays - 1) * 24 * 60 * 60 * 1000);
      
      // Create reminder object
      const reminder = {
        id: `reminder_${Date.now()}`,
        patientInfo: patientInfo,
        medicine: medicineData,
        durationDays: durationDays,
        reminderDate: reminderDate.toISOString(),
        status: 'scheduled',
        createdAt: currentDate.toISOString(),
        message: `Dear ${patientInfo.name}, this is a reminder that your medication "${medicineData.name}" course will end tomorrow. Please visit for your follow-up consultation. Contact us for appointment booking.`
      };
      
      // Store reminder in localStorage for now (in production, use backend API)
      const existingReminders = JSON.parse(localStorage.getItem('patientReminders') || '[]');
      existingReminders.push(reminder);
      localStorage.setItem('patientReminders', JSON.stringify(existingReminders));
      
      // Schedule the actual reminder check
      scheduleReminderCheck(reminder);
      
      toast({
        title: 'Reminder Scheduled',
        description: `WhatsApp reminder scheduled for ${reminderDate.toLocaleDateString()} for ${medicineData.name}`,
        status: 'info',
        duration: 3000,
        isClosable: true
      });
      
    } catch (error) {
      console.error('Error scheduling reminder:', error);
      toast({
        title: 'Reminder Schedule Failed',
        description: 'Could not schedule WhatsApp reminder',
        status: 'warning',
        duration: 2000,
        isClosable: true
      });
    }
  };

  // Check and send reminders (this would typically run on a server)
  const scheduleReminderCheck = (reminder) => {
    const now = new Date();
    const reminderTime = new Date(reminder.reminderDate);
    const timeUntilReminder = reminderTime.getTime() - now.getTime();
    
    if (timeUntilReminder > 0) {
      // Schedule the reminder to be sent
      setTimeout(() => {
        sendWhatsAppReminder(reminder);
      }, Math.min(timeUntilReminder, 2147483647)); // Max setTimeout value
    }
  };

  // Send WhatsApp reminder (placeholder for actual WhatsApp API integration)
  const sendWhatsAppReminder = (reminder) => {
    try {
      // In a real implementation, this would call WhatsApp Business API
      // For now, we'll simulate the sending and show a notification
      
      const whatsappMessage = encodeURIComponent(reminder.message);
      const phoneNumber = reminder.patientInfo.phone || patientInfo.phone;
      
      // WhatsApp Web URL format
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;
      
      // Update reminder status
      const reminders = JSON.parse(localStorage.getItem('patientReminders') || '[]');
      const updatedReminders = reminders.map(r => 
        r.id === reminder.id ? { ...r, status: 'sent', sentAt: new Date().toISOString() } : r
      );
      localStorage.setItem('patientReminders', JSON.stringify(updatedReminders));
      
      // Show notification to staff
      toast({
        title: 'Reminder Ready',
        description: `WhatsApp reminder for ${reminder.patientInfo.name} is ready to send`,
        status: 'success',
        duration: 5000,
        isClosable: true
      });
      
      // Auto-open WhatsApp (optional)
      if (confirm(`Send WhatsApp reminder to ${reminder.patientInfo.name}?`)) {
        window.open(whatsappUrl, '_blank');
      }
      
    } catch (error) {
      console.error('Error sending WhatsApp reminder:', error);
    }
  };

  // Add medicine with all required fields
  const handleAddMedicine = (e) => {
    e.preventDefault();
    if (!form.name || !form.type || !form.dose || !form.duration || !form.mfd || !form.exp || !form.unitPrice || !form.quantity) {
      toast({ title: 'Please fill all required fields', status: 'warning', duration: 2000, isClosable: true });
      return;
    }
    
    // Schedule WhatsApp reminder for patient re-visit
    schedulePatientReminder(form);
    
    setMedicines((prev) => [...prev, { ...form, id: Date.now() }]);
    setForm(initialForm);
  };

  // Calculate bill total
  const getTotal = () => {
    return medicines.reduce((sum, med) => {
      const price = parseFloat(med.unitPrice) || 0;
      const qty = parseFloat(med.quantity) || 0;
      return sum + price * qty;
    }, 0);
  };

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

  // Check for due reminders on component mount
  React.useEffect(() => {
    checkDueReminders();
    // Set up interval to check reminders every hour
    const reminderInterval = setInterval(checkDueReminders, 60 * 60 * 1000);
    
    return () => clearInterval(reminderInterval);
  }, []);

  // Check for reminders that are due
  const checkDueReminders = () => {
    try {
      const reminders = JSON.parse(localStorage.getItem('patientReminders') || '[]');
      const now = new Date();
      
      const dueReminders = reminders.filter(reminder => {
        const reminderTime = new Date(reminder.reminderDate);
        return reminder.status === 'scheduled' && reminderTime <= now;
      });
      
      dueReminders.forEach(reminder => {
        sendWhatsAppReminder(reminder);
      });
      
    } catch (error) {
      console.error('Error checking due reminders:', error);
    }
  };

  return (
    <>
      <button id="medicine-print-proxy" style={{ display: 'none' }} onClick={handlePrint} tabIndex={-1} aria-hidden />
      <Box w="100%" maxW="1200px" mx="auto" py={4}>
      <Box display="flex" alignItems="stretch" w="full" bg="white" borderRadius="2xl" boxShadow="2xl" border="1px solid #e2e8f0" overflow="hidden">
        {/* Column 1: Medicine Form */}
        <Box flex={1} minW="320px" borderRight="1px solid #e2e8f0" p={6}>
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
        </Box>
        {/* Column 2: Selected Medicines List */}
        <Box flex={1} minW="320px" borderRight="1px solid #e2e8f0" p={6} display="flex" flexDirection="column">
          <div className="print-page medicine-list-print" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Heading size="md" color="teal.600" mb={4}>Selected Medicines</Heading>
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
            </Box>
          </div>
        </Box>
        {/* Column 3: Bill Format */}
        <Box flex={1.5} minW="400px" p={6} display="flex" flexDirection="column">
          <div className="print-page medicine-bill-print" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Heading size="md" color="teal.600" mb={4}>Pharmacy Bill</Heading>
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
              {/* Medicine List Table */}
              <Box as="table" w="full" fontSize="sm" borderWidth={1} borderRadius="md" overflow="hidden">
                <Box as="thead" bg="teal.100">
                  <Box as="tr" display="flex">
                    <Box as="th" flex={2} p={1}>Name</Box>
                    <Box as="th" flex={1} p={1}>Mfd</Box>
                    <Box as="th" flex={1} p={1}>Exp</Box>
                    <Box as="th" flex={1} p={1}>Unit</Box>
                    <Box as="th" flex={1} p={1}>Qty</Box>
                    <Box as="th" flex={1} p={1}>Total</Box>
                  </Box>
                </Box>
                <Box as="tbody">
                  {medicines.map((med) => (
                    <Box as="tr" display="flex" key={med.id} borderBottom="1px solid #e2e8f0" alignItems="center">
                      <Box as="td" flex={2} p={1} display="flex" alignItems="center">
                        {med.name}
                      </Box>
                      <Box as="td" flex={1} p={1}>{med.mfd}</Box>
                      <Box as="td" flex={1} p={1}>{med.exp}</Box>
                      <Box as="td" flex={1} p={1}>₹{med.unitPrice}</Box>
                      <Box as="td" flex={1} p={1}>{med.quantity}</Box>
                      <Box as="td" flex={1} p={1}>₹{(parseFloat(med.unitPrice || 0) * parseFloat(med.quantity || 0)).toFixed(2)}</Box>
                    </Box>
                  ))}
                </Box>
              </Box>
              <Divider my={2} />
              {/* Bill Footer */}
              <Box textAlign="right" fontWeight="bold" fontSize="lg">
                Total: ₹{getTotal().toFixed(2)}
              </Box>
              <Box textAlign="center" mt={4}>
                {footer.split('\n').map((line, i) => (
                  <Text key={i} fontSize="sm" color="gray.500">{line}</Text>
                ))}
              </Box>
            </Box>
          </div>
        </Box>
      </Box>

      {/* Reminder Status */}
      <Box mt={4} p={4} bg="blue.50" borderRadius="lg" border="1px solid #bee3f8">
        <HStack spacing={3} mb={3}>
          <Icon as={Calendar} color="blue.500" />
          <Heading size="sm" color="blue.700">Automatic Reminder System</Heading>
        </HStack>
        <VStack align="stretch" spacing={2}>
          <Text fontSize="sm" color="blue.600">
            📱 WhatsApp reminders will be automatically scheduled for patient re-visits
          </Text>
          <Text fontSize="sm" color="blue.600">
            ⏰ Alerts are sent 1 day before the medicine duration ends
          </Text>
          <Text fontSize="sm" color="blue.600">
            ✅ Duration field is now mandatory for all medicines
          </Text>
          <RemindersList />
        </VStack>
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
            font-size: 24px !important;
            font-weight: bold !important;
            text-align: center !important;
            color: #2c5282 !important;
            margin-bottom: 5px !important;
            text-transform: uppercase !important;
            letter-spacing: 2px !important;
          }
          
          /* Hospital Address/Info Style */
          .medicine-list-print .chakra-box:first-child .chakra-text:not(:first-child),
          .medicine-bill-print .chakra-box:first-child .chakra-text:not(:first-child) {
            font-size: 14px !important;
            text-align: center !important;
            color: #4a5568 !important;
            margin: 2px 0 !important;
          }
          
          /* Main heading style like official document */
          .medicine-list-print .chakra-heading,
          .medicine-bill-print .chakra-heading {
            display: block !important;
            visibility: visible !important;
            color: #2c5282 !important;
            font-size: 22px !important;
            font-weight: bold !important;
            text-align: center !important;
            margin: 30px 0 20px 0 !important;
            text-transform: uppercase !important;
            border-bottom: 3px solid #2c5282 !important;
            padding-bottom: 10px !important;
            letter-spacing: 1px !important;
          }
          
          /* Content text styling */
          .medicine-list-print .chakra-text,
          .medicine-bill-print .chakra-text {
            display: block !important;
            visibility: visible !important;
            color: #2d3748 !important;
            font-size: 14px !important;
            line-height: 1.6 !important;
            margin-bottom: 8px !important;
          }
          
          /* Medicine boxes like official document entries */
          .medicine-list-print .chakra-box[style*="teal.50"],
          .medicine-bill-print .chakra-box {
            display: block !important;
            visibility: visible !important;
            border: 2px solid #2c5282 !important;
            background: #f7fafc !important;
            margin-bottom: 15px !important;
            padding: 15px !important;
            border-radius: 8px !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
          }
          
          /* Strong text in medicine entries */
          .medicine-list-print .chakra-text[style*="fontWeight: bold"],
          .medicine-bill-print .chakra-text[style*="fontWeight: bold"] {
            font-size: 16px !important;
            font-weight: bold !important;
            color: #2c5282 !important;
            margin-bottom: 8px !important;
          }
          
          /* Show dividers as letterhead separators */
          .medicine-list-print .chakra-divider,
          .medicine-bill-print .chakra-divider {
            display: block !important;
            visibility: visible !important;
            border-color: #2c5282 !important;
            border-width: 2px !important;
            margin: 20px 0 !important;
          }
          
          /* Patient info section styling */
          .medicine-bill-print .chakra-text[style*="fontWeight: semibold"] {
            font-size: 16px !important;
            font-weight: bold !important;
            color: #2c5282 !important;
          }
          
          /* Table styling for professional bill */
          .medicine-bill-print .chakra-box[style*="table"] {
            border: 3px solid #2c5282 !important;
            border-radius: 8px !important;
            overflow: hidden !important;
          }
          
          .medicine-bill-print .chakra-box[style*="thead"] {
            background: #2c5282 !important;
            color: white !important;
          }
          
          .medicine-bill-print .chakra-box[style*="thead"] .chakra-box {
            color: white !important;
            font-weight: bold !important;
            font-size: 14px !important;
            text-align: center !important;
            padding: 12px 8px !important;
          }
          
          .medicine-bill-print .chakra-box[style*="tbody"] .chakra-box {
            border-bottom: 1px solid #e2e8f0 !important;
            padding: 10px 8px !important;
            font-size: 13px !important;
          }
          
          /* Total amount styling like official document */
          .medicine-bill-print .chakra-box[style*="textAlign: right"] {
            background: #2c5282 !important;
            color: white !important;
            font-size: 20px !important;
            font-weight: bold !important;
            padding: 15px !important;
            border-radius: 8px !important;
            margin-top: 20px !important;
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
