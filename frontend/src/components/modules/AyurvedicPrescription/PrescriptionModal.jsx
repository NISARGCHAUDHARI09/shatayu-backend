import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Grid,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
  useColorModeValue,
  useToast,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Divider,
  SimpleGrid,
  Box
} from '@chakra-ui/react';
import { 
  Plus, 
  Trash2,
  Save,
  Printer
} from 'lucide-react';

const PrescriptionModal = ({ isOpen, onClose, patient }) => {
  const [prescriptionDate, setPrescriptionDate] = useState(new Date().toISOString().split('T')[0]);
  const [prescription, setPrescription] = useState({
    // Present Complaint - 5 fields
    presentComplaints: [
      { complaint: '', duration: '' },
      { complaint: '', duration: '' },
      { complaint: '', duration: '' },
      { complaint: '', duration: '' },
      { complaint: '', duration: '' }
    ],
    
    // Ayurvedic Assessment
    prakriti: '',
    vikriti: '',
    agni: '',
    ojas: '',
    
    // Examination
    nadi: '',
    mutra: '',
    mala: '',
    jihva: '',
    
    // Clinical Assessment
    roga: '',
    
    // Treatment Plan
    chikitsa: '',
    pathya: '',
    apathya: '',
    vihara: '',
    
    // Medicines
    medicines: [],
    
    // Panchkarma
    panchkarma: {
      isRequired: false,
      name: '',
      startDate: '',
      duration: '',
      notes: ''
    },
    
    // Follow-up
    followUpDate: '',
    specialInstructions: ''
  });

  const [currentMedicine, setCurrentMedicine] = useState({
    medicineDetails: '',
    type: '',
    dose: '',
    anupana: '',
    duration: '',
    notes: ''
  });

  const [showAddMedicine, setShowAddMedicine] = useState(false);
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const toast = useToast();
  
  // Medicine types
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

  // Dose options
  const doseOptions = [
    '1 spoon',
    '2 spoons',
    '1 tablet',
    '2 tablets',
    '5ml',
    '10ml',
    '15ml',
    '20ml',
    'As directed',
    'Custom'
  ];

  // Panchkarma categories and subcategories data
  const panchkarmaCategories = {
    'Basti': {
      subcategories: [
        'Niruha Basti',
        'Anuvasana Basti',
        'Uttara Basti',
        'Kashaya Basti',
        'Sneha Basti'
      ]
    },
    'Nasya': {
      subcategories: [
        'Rechana Nasya',
        'Brinhana Nasya',
        'Shamana Nasya',
        'Navana Nasya',
        'Marshya Nasya'
      ]
    },
    'Vamana': {
      subcategories: []
    },
    'Virechana': {
      subcategories: []
    },
    'Raktamokshana': {
      subcategories: [
        'Jalaukavacharana',
        'Shringa',
        'Alabu',
        'Siravyadha'
      ]
    },
    'Shirodhara': {
      subcategories: [
        'Taila Dhara',
        'Takra Dhara',
        'Ksheer Dhara',
        'Jala Dhara'
      ]
    },
    'Abhyanga': {
      subcategories: []
    },
    'Swedana': {
      subcategories: [
        'Bashpa Sweda',
        'Upanaha Sweda',
        'Pinda Sweda',
        'Avagaha Sweda'
      ]
    }
  };

  // State for Panchkarma section
  const [panchkarmas, setPanchkarmas] = useState([]);

  // Add new panchkarma
  const addPanchkarma = (category) => {
    const categoryData = panchkarmaCategories[category];
    const newPanchkarma = {
      id: Date.now(),
      category: category,
      subcategories: categoryData.subcategories.length > 0 
        ? categoryData.subcategories.map(sub => ({ name: sub, duration: '', isCustom: false }))
        : [{ name: '', duration: '', isCustom: true }],
      overallDuration: '',
      notes: ''
    };
    setPanchkarmas(prev => [...prev, newPanchkarma]);
  };

  // Update subcategory duration
  const updateSubcategoryDuration = (panchkarmaId, subcategoryIndex, duration) => {
    setPanchkarmas(prev => prev.map(p => 
      p.id === panchkarmaId ? {
        ...p,
        subcategories: p.subcategories.map((sub, index) =>
          index === subcategoryIndex ? { ...sub, duration } : sub
        )
      } : p
    ));
  };

  // Update overall duration
  const updateOverallDuration = (panchkarmaId, duration) => {
    setPanchkarmas(prev => prev.map(p => 
      p.id === panchkarmaId ? { ...p, overallDuration: duration } : p
    ));
  };

  // Update notes
  const updatePanchkarmaNotes = (panchkarmaId, notes) => {
    setPanchkarmas(prev => prev.map(p => 
      p.id === panchkarmaId ? { ...p, notes } : p
    ));
  };

  // Add subcategory to existing panchkarma
  const addSubcategory = (panchkarmaId) => {
    setPanchkarmas(prev => prev.map(p => 
      p.id === panchkarmaId ? {
        ...p,
        subcategories: [...p.subcategories, { name: '', duration: '', isCustom: true }]
      } : p
    ));
  };

  // Update subcategory name (for custom subcategories)
  const updateSubcategoryName = (panchkarmaId, subcategoryIndex, name) => {
    setPanchkarmas(prev => prev.map(p => 
      p.id === panchkarmaId ? {
        ...p,
        subcategories: p.subcategories.map((sub, index) =>
          index === subcategoryIndex ? { ...sub, name } : sub
        )
      } : p
    ));
  };

  // Remove subcategory
  const removeSubcategory = (panchkarmaId, subcategoryIndex) => {
    setPanchkarmas(prev => prev.map(p => 
      p.id === panchkarmaId ? {
        ...p,
        subcategories: p.subcategories.length > 1 
          ? p.subcategories.filter((_, index) => index !== subcategoryIndex)
          : p.subcategories
      } : p
    ));
  };

  // Remove panchkarma
  const removePanchkarma = (panchkarmaId) => {
    setPanchkarmas(prev => prev.filter(p => p.id !== panchkarmaId));
  };

  // Present Complaints management functions
  const addPresentComplaint = () => {
    setPrescription(prev => ({
      ...prev,
      presentComplaints: [...prev.presentComplaints, { complaint: '', duration: '' }]
    }));
  };

  const removePresentComplaint = (index) => {
    if (prescription.presentComplaints.length > 1) {
      setPrescription(prev => ({
        ...prev,
        presentComplaints: prev.presentComplaints.filter((_, i) => i !== index)
      }));
    }
  };

  const updatePresentComplaint = (index, field, value) => {
    setPrescription(prev => ({
      ...prev,
      presentComplaints: prev.presentComplaints.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  // Anupana options
  const anupanaOptions = [
    'Ushna Jala (Warm Water)',
    'Madhu (Honey)',
    'Ghrita (Ghee)',
    'Dugdha (Milk)',
    'Takra (Buttermilk)',
    'Coconut Water',
    'After meals',
    'Before meals'
  ];

  // Kala options
  const kalaOptions = [
    'Pratar (Morning)',
    'Madhyahna (Afternoon)', 
    'Sayam (Evening)',
    'Ratri (Night)',
    'Pratah-Sayam (Morning-Evening)',
    'Bhojana Purva (Before meals)',
    'Bhojana Anta (After meals)',
    'As required'
  ];

  // Prakriti types
  const prakritiTypes = [
    'Vata Prakriti',
    'Pitta Prakriti', 
    'Kapha Prakriti',
    'Vata-Pitta',
    'Vata-Kapha',
    'Pitta-Kapha',
    'Tridoshaja'
  ];

  // Agni states
  const agniStates = [
    'Sama Agni (Balanced)',
    'Vishama Agni (Irregular)',
    'Tikshna Agni (Sharp)',
    'Manda Agni (Weak)'
  ];

  const addMedicine = () => {
    if (currentMedicine.medicineDetails && currentMedicine.dose) {
      setPrescription(prev => ({
        ...prev,
        medicines: [...prev.medicines, { ...currentMedicine, id: Date.now() }]
      }));
      setCurrentMedicine({
        medicineDetails: '',
        type: '',
        dose: '',
        anupana: '',
        duration: '',
        notes: ''
      });
      setShowAddMedicine(false);
    }
  };

  const removeMedicine = (id) => {
    setPrescription(prev => ({
      ...prev,
      medicines: prev.medicines.filter(med => med.id !== id)
    }));
  };

  const handleSave = () => {
    console.log('Debug: PrescriptionModal - handleSave called for patient:', patient?.caseId, prescription);
    
    // Save patient to OPD based on prescription date
    const opdPatientData = {
      id: patient?.id || Date.now(),
      caseId: patient?.caseId || `OPD${Date.now()}`,
      patientName: patient?.patientName || patient?.name,
      patientAge: patient?.patientAge || patient?.age,
      patientGender: patient?.patientGender || patient?.gender,
      patientPhone: patient?.patientPhone || patient?.phone || patient?.contact,
      patientEmail: patient?.patientEmail || patient?.email,
      patientAddress: patient?.patientAddress || patient?.address,
      appointmentDate: prescriptionDate, // Use prescription date
      appointmentTime: new Date().toLocaleTimeString('en-US', { hour12: false }),
      consultant: patient?.consultant || patient?.doctor || 'Current Doctor',
      presentComplaints: prescription.presentComplaints?.map(c => c.complaint).filter(Boolean).join(', ') || '',
      diagnosis: prescription.roga || '',
      status: 'Completed',
      prescription: {
        ...prescription,
        prescriptionDate: prescriptionDate,
        medicines: prescription.medicines,
        panchkarmas: panchkarmas
      }
    };

    // Determine if it's today, upcoming, or old based on prescription date
    const today = new Date().toISOString().split('T')[0];
    const prescDate = new Date(prescriptionDate);
    const todayDate = new Date(today);
    
    try {
      const existingOPDPatients = JSON.parse(localStorage.getItem('opdPatients') || '[]');
      
      // Check if patient already exists in OPD
      const existingIndex = existingOPDPatients.findIndex(p => p.caseId === opdPatientData.caseId);
      
      if (existingIndex >= 0) {
        // Update existing patient
        existingOPDPatients[existingIndex] = {
          ...existingOPDPatients[existingIndex],
          ...opdPatientData,
          lastUpdated: new Date().toISOString()
        };
        console.log('Debug: Updated existing OPD patient:', existingOPDPatients[existingIndex]);
      } else {
        // Add new patient
        existingOPDPatients.push(opdPatientData);
        console.log('Debug: Added new OPD patient:', opdPatientData);
      }
      
      localStorage.setItem('opdPatients', JSON.stringify(existingOPDPatients));
      
      let opdCategory = 'OPD';
      if (prescDate < todayDate) {
        opdCategory = 'Old OPD';
      } else if (prescDate.toISOString().split('T')[0] === today) {
        opdCategory = 'Today OPD';
      } else {
        opdCategory = 'Upcoming OPD';
      }
      
      console.log('Debug: Patient saved to', opdCategory, 'with date:', prescriptionDate);
      
    } catch (error) {
      console.error('Error saving to OPD:', error);
    }
    
    // Check if Panchkarma is required and send to IPD
    const hasPanchkarma = panchkarmas.length > 0;
    
    console.log('Debug: PrescriptionModal - Checking Panchkarma transfer:', {
      panchkarmas,
      hasPanchkarma,
      panchkarmaCount: panchkarmas.length
    });

    if (hasPanchkarma) {
      console.log('Debug: PrescriptionModal - Transferring patient to IPD:', patient?.patientName);
      handleSendToIPD();
    }

    const opdMessage = prescriptionDate === new Date().toISOString().split('T')[0] 
      ? 'saved to Today OPD' 
      : prescriptionDate < new Date().toISOString().split('T')[0]
        ? 'saved to Old OPD'
        : 'saved to Upcoming OPD';

    const successMessage = hasPanchkarma 
      ? `Prescription ${opdMessage} and patient transferred to IPD for Panchkarma treatments`
      : `Prescription saved successfully and patient ${opdMessage}`;

    toast({
      title: 'Prescription Saved',
      description: successMessage,
      status: 'success',
      duration: 4000,
      isClosable: true,
    });    
    onClose();
  };

  const handleSendToPharmacy = () => {
    const pharmacyData = {
      patient: {
        name: patient?.patientName,
        number: patient?.patientPhone,
        age: patient?.patientAge,
        date: prescriptionDate // Use prescription date
      },
      medicines: prescription.medicines,
      prescribedBy: 'Current Doctor',
      prescriptionDate: prescriptionDate
    };

    console.log('Debug: PrescriptionModal - Sending to Pharmacy:', pharmacyData);
    
    // Save patient to OPD based on prescription date
    const opdPatientData = {
      id: patient?.id || Date.now(),
      caseId: patient?.caseId || `OPD${Date.now()}`,
      patientName: patient?.patientName || patient?.name,
      patientAge: patient?.patientAge || patient?.age,
      patientGender: patient?.patientGender || patient?.gender,
      patientPhone: patient?.patientPhone || patient?.phone || patient?.contact,
      patientEmail: patient?.patientEmail || patient?.email,
      patientAddress: patient?.patientAddress || patient?.address,
      appointmentDate: prescriptionDate,
      appointmentTime: new Date().toLocaleTimeString('en-US', { hour12: false }),
      consultant: patient?.consultant || patient?.doctor || 'Current Doctor',
      presentComplaints: prescription.presentComplaints?.map(c => c.complaint).filter(Boolean).join(', ') || '',
      diagnosis: prescription.roga || '',
      status: 'Completed',
      prescription: {
        ...prescription,
        prescriptionDate: prescriptionDate,
        medicines: prescription.medicines,
        panchkarmas: panchkarmas
      }
    };

    try {
      const existingOPDPatients = JSON.parse(localStorage.getItem('opdPatients') || '[]');
      const existingIndex = existingOPDPatients.findIndex(p => p.caseId === opdPatientData.caseId);
      
      if (existingIndex >= 0) {
        existingOPDPatients[existingIndex] = {
          ...existingOPDPatients[existingIndex],
          ...opdPatientData,
          lastUpdated: new Date().toISOString()
        };
      } else {
        existingOPDPatients.push(opdPatientData);
      }
      
      localStorage.setItem('opdPatients', JSON.stringify(existingOPDPatients));
      console.log('Debug: Patient saved to OPD with prescription date:', prescriptionDate);
    } catch (error) {
      console.error('Error saving to OPD:', error);
    }
    
    // Check if Panchkarma is required and send to IPD
    const hasPanchkarma = panchkarmas.length > 0;
    
    console.log('Debug: PrescriptionModal - handleSendToPharmacy - Checking Panchkarma transfer:', {
      panchkarmas,
      hasPanchkarma,
      panchkarmaCount: panchkarmas.length
    });

    if (hasPanchkarma) {
      console.log('Debug: PrescriptionModal - handleSendToPharmacy - Transferring patient to IPD:', patient?.patientName);
      handleSendToIPD();
    }    
    
    const opdMessage = prescriptionDate === new Date().toISOString().split('T')[0] 
      ? 'added to Today OPD' 
      : prescriptionDate < new Date().toISOString().split('T')[0]
        ? 'added to Old OPD'
        : 'added to Upcoming OPD';
    
    toast({
      title: 'Sent to Pharmacy',
      description: `Prescription sent to pharmacy, patient ${opdMessage}`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    
    onClose();
  };

  const handleSendToIPD = () => {
    // Generate new IPD number starting from IP00001
    const generateNewIPDNumber = () => {
      const existingIPDPatients = JSON.parse(localStorage.getItem('ipdPatients') || '[]');
      
      if (existingIPDPatients.length === 0) {
        return 'IP00001';
      }
      
      // Find the highest existing IPD number
      let maxNumber = 0;
      existingIPDPatients.forEach(patient => {
        if (patient.caseId && patient.caseId.startsWith('IP')) {
          const numberPart = patient.caseId.substring(2); // Remove 'IP' prefix
          const currentNumber = parseInt(numberPart, 10);
          if (!isNaN(currentNumber) && currentNumber > maxNumber) {
            maxNumber = currentNumber;
          }
        }
      });
      
      // Generate next number with 5-digit padding
      const nextNumber = maxNumber + 1;
      return `IP${nextNumber.toString().padStart(5, '0')}`;
    };
    
    const newIPDNumber = generateNewIPDNumber();
    
    const ipdPatientData = {
      id: Date.now(), // Unique ID for IPD
      // Map OPD field names to IPD field names
      name: patient?.patientName, // IPD uses 'name' instead of 'patientName'
      patientName: patient?.patientName, // Keep original for compatibility
      caseId: newIPDNumber, // Use new IPD number format
      regNo: patient?.caseId, // Store original OPD caseId as regNo
      opdId: patient?.id, // Reference to OPD patient
      age: patient?.patientAge || patient?.age,
      gender: patient?.patientGender || patient?.gender,
      phone: patient?.patientPhone || patient?.contact, // IPD uses 'phone' field
      contactNumber: patient?.patientPhone || patient?.contact,
      email: patient?.patientEmail || patient?.email,
      address: patient?.patientAddress || patient?.address,
      bloodGroup: patient?.bloodGroup || '',
      emergencyContact: patient?.emergencyContact || '',
      roomNumber: '', // To be assigned by IPD staff
      bedNumber: '', // To be assigned by IPD staff
      admissionDate: new Date().toISOString().split('T')[0],
      admissionTime: new Date().toLocaleTimeString('en-US', { hour12: false }),
      consultant: patient?.consultant || '',
      doctor: patient?.consultant || '', // IPD uses 'doctor' field
      treatmentType: 'Panchkarma',
      therapy: 'Panchkarma Treatment', // IPD field
      panchakarma: panchkarmas?.map(p => p.category).join(', ') || '', // IPD field
      ayurvedicDiagnosis: prescription.roga || 'Panchkarma Treatment',
      prakriti: prescription.prakriti || '',
      dosha: prescription.vikriti || '',
      status: 'Active Treatment', // IPD status format
      panchkarmas: panchkarmas.map(p => ({
        id: p.id,
        category: p.category,
        subcategories: p.subcategories,
        overallDuration: p.overallDuration,
        notes: p.notes,
        startDate: new Date().toISOString().split('T')[0]
      })),
      admittedBy: 'OPD Prescription',
      presentComplaints: patient?.presentComplaints || prescription.presentComplaints || [],
      ayurvedicAssessment: {
        prakriti: prescription.prakriti,
        vikriti: prescription.vikriti,
        agni: prescription.agni,
        ojas: prescription.ojas
      },
      examination: {
        nadi: prescription.nadi,
        mutra: prescription.mutra,
        mala: prescription.mala,
        jihva: prescription.jihva
      },
      clinicalAssessment: {
        roga: prescription.roga
      },
      familyHistory: patient?.familyHistory || {},
      medicines: prescription.medicines || [],
      treatmentPlan: prescription.specialInstructions || '',
      // IPD specific fields
      dischargeSummary: '',
      treatmentProgress: [],
      dailyAssessments: [],
      nursingNotes: [],
      billingInfo: {
        totalAmount: 0,
        paidAmount: 0,
        dueAmount: 0,
        paymentMethod: '',
        insuranceDetails: ''
      }
    };

    // Store in localStorage for IPD component to access
    try {
      console.log('Debug: PrescriptionModal - Attempting to save patient to IPD localStorage:', {
        patientName: ipdPatientData.name,
        caseId: ipdPatientData.caseId,
        panchkarmas: ipdPatientData.panchkarmas,
        panchkarmaCount: panchkarmas.length
      });
      
      const existingIPDPatients = JSON.parse(localStorage.getItem('ipdPatients') || '[]');
      
      // Check if patient already exists in IPD (by caseId)
      const existingPatient = existingIPDPatients.find(p => p.caseId === patient?.caseId);
      
      if (existingPatient) {
        console.log('Debug: Patient already exists in IPD, updating with additional treatments');
        // Update existing patient with new Panchkarma treatment
        const updatedPatients = existingIPDPatients.map(p => 
          p.caseId === patient?.caseId 
            ? { 
                ...p, 
                panchkarmas: [...(p.panchkarmas || []), ...ipdPatientData.panchkarmas],
                medicines: [...(p.medicines || []), ...ipdPatientData.medicines],
                treatmentPlan: ipdPatientData.treatmentPlan
              }
            : p
        );
        localStorage.setItem('ipdPatients', JSON.stringify(updatedPatients));
        
        toast({
          title: 'Treatment Added to IPD',
          description: `Additional Panchkarma treatments added to existing IPD record ${newIPDNumber} for ${patient?.patientName}`,
          status: 'success',
          duration: 6000,
          isClosable: true,
        });
      } else {
        console.log('Debug: Adding new patient to IPD');
        // Add new patient to IPD
        const updatedIPDPatients = [...existingIPDPatients, ipdPatientData];
        localStorage.setItem('ipdPatients', JSON.stringify(updatedIPDPatients));
        
        toast({
          title: 'Patient Transferred to IPD',
          description: `Patient ${patient?.patientName} successfully transferred to IPD with IPD Number: ${newIPDNumber} for Panchkarma treatments`,
          status: 'success',
          duration: 6000,
          isClosable: true,
        });
      }
      
      console.log('Debug: Successfully saved to localStorage. Total IPD patients:', JSON.parse(localStorage.getItem('ipdPatients') || '[]').length);
      
      // Trigger storage event for other components to listen
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'ipdPatients',
        newValue: localStorage.getItem('ipdPatients')
      }));

      console.log('Debug: Patient successfully transferred to IPD from prescription:', ipdPatientData.name);
      
    } catch (error) {
      console.error('Error saving to IPD:', error);
      toast({
        title: 'Transfer Error',
        description: 'Failed to transfer patient to IPD. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!patient) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxH="95vh" m={4}>
        <ModalHeader>
          <VStack align="start" spacing={1}>
            <Heading size="lg" color="green.600">आयुर्वेदिक पर्चा (Ayurvedic Prescription)</Heading>
            <Text fontSize="sm" color="gray.500">
              Patient: {patient.patientName} | Case ID: {patient.caseId} | Age: {patient.patientAge} | Gender: {patient.patientGender}
            </Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody p={6}>
          <VStack spacing={8} align="stretch">
            {/* Prescription Date */}
            <Card variant="outline" size="sm" bg="blue.50">
              <CardBody py={3}>
                <HStack spacing={4} align="center">
                  <FormControl maxW="300px">
                    <FormLabel fontSize="sm" fontWeight="bold" mb={1}>
                      Prescription Date / पर्चा तारीख
                    </FormLabel>
                    <Input 
                      type="date"
                      size="md"
                      value={prescriptionDate}
                      onChange={(e) => setPrescriptionDate(e.target.value)}
                      bg="white"
                    />
                  </FormControl>
                  <Text fontSize="sm" color="gray.600" mt={6}>
                    This date will be used for the prescription record
                  </Text>
                </HStack>
              </CardBody>
            </Card>

            {/* Present Complaint */}
            <Card variant="outline" size="sm">
              <CardHeader py={3}>
                <Heading size="md" color="green.600">वर्तमान शिकायत (Present Complaint)</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4}>
                  {prescription.presentComplaints.map((item, index) => (
                    <SimpleGrid key={index} columns={{ base: 1, md: 2 }} spacing={4} width="100%">
                      <FormControl>
                        <FormLabel fontSize="sm">Complaint {index + 1} / शिकायत {index + 1}</FormLabel>
                        <Textarea 
                          size="sm"
                          value={item.complaint}
                          onChange={(e) => updatePresentComplaint(index, 'complaint', e.target.value)}
                          placeholder="Enter complaint details"
                          rows={2}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel fontSize="sm">Duration / अवधि</FormLabel>
                        <Input 
                          size="sm"
                          value={item.duration}
                          onChange={(e) => updatePresentComplaint(index, 'duration', e.target.value)}
                          placeholder="e.g., 2 weeks, 1 month"
                        />
                        {prescription.presentComplaints.length > 5 && index >= 5 && (
                          <IconButton
                            size="xs"
                            colorScheme="red"
                            variant="ghost"
                            icon={<Trash2 size={14} />}
                            onClick={() => removePresentComplaint(index)}
                            mt={1}
                          />
                        )}
                      </FormControl>
                    </SimpleGrid>
                  ))}
                  <Button
                    leftIcon={<Plus size={16} />}
                    onClick={addPresentComplaint}
                    size="sm"
                    colorScheme="green"
                    variant="outline"
                  >
                    Add More Complaints
                  </Button>
                </VStack>
              </CardBody>
            </Card>

            {/* Ayurvedic Assessment */}
            <Card variant="outline" size="sm">
              <CardHeader py={3}>
                <Heading size="md" color="green.600">आयुर्वेदिक निदान (Ayurvedic Assessment)</Heading>
              </CardHeader>
              <CardBody>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                  <FormControl>
                    <FormLabel fontSize="md">Prakriti / प्रकृति</FormLabel>
                    <Select 
                      size="md"
                      value={prescription.prakriti}
                      onChange={(e) => setPrescription(prev => ({...prev, prakriti: e.target.value}))}
                    >
                      <option value="">Select Prakriti</option>
                      {prakritiTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="md">Vikriti / विकृति</FormLabel>
                    <Input 
                      size="md"
                      value={prescription.vikriti}
                      onChange={(e) => setPrescription(prev => ({...prev, vikriti: e.target.value}))}
                      placeholder="Current imbalance"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="md">Agni / अग्नि</FormLabel>
                    <Select 
                      size="md"
                      value={prescription.agni}
                      onChange={(e) => setPrescription(prev => ({...prev, agni: e.target.value}))}
                    >
                      <option value="">Select Agni</option>
                      {agniStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="md">Ojas / ओजस्</FormLabel>
                    <Select 
                      size="md"
                      value={prescription.ojas}
                      onChange={(e) => setPrescription(prev => ({...prev, ojas: e.target.value}))}
                    >
                      <option value="">Select Ojas</option>
                      <option value="Uttama">Uttama (Excellent)</option>
                      <option value="Madhya">Madhya (Moderate)</option>
                      <option value="Hina">Hina (Poor)</option>
                    </Select>
                  </FormControl>
                </SimpleGrid>
              </CardBody>
            </Card>

            {/* Quick Examination */}
            <Card variant="outline" size="sm">
              <CardHeader py={3}>
                <Heading size="md" color="green.600">परीक्षा (Examination)</Heading>
              </CardHeader>
              <CardBody>
                <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
                  <FormControl>
                    <FormLabel fontSize="md">Nadi / नाड़ी</FormLabel>
                    <Input 
                      size="md"
                      value={prescription.nadi}
                      onChange={(e) => setPrescription(prev => ({...prev, nadi: e.target.value}))}
                      placeholder="Pulse"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="md">Mutra / मूत्र</FormLabel>
                    <Input 
                      size="md"
                      value={prescription.mutra}
                      onChange={(e) => setPrescription(prev => ({...prev, mutra: e.target.value}))}
                      placeholder="Urine"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="md">Mala / मल</FormLabel>
                    <Input 
                      size="md"
                      value={prescription.mala}
                      onChange={(e) => setPrescription(prev => ({...prev, mala: e.target.value}))}
                      placeholder="Stool"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="md">Jihva / जिह्वा</FormLabel>
                    <Input 
                      size="md"
                      value={prescription.jihva}
                      onChange={(e) => setPrescription(prev => ({...prev, jihva: e.target.value}))}
                      placeholder="Tongue"
                    />
                  </FormControl>
                </SimpleGrid>
              </CardBody>
            </Card>

            {/* Clinical Assessment */}
            <Card variant="outline" size="sm">
              <CardHeader py={3}>
                <Heading size="md" color="green.600">रोग निदान (Clinical Assessment)</Heading>
              </CardHeader>
              <CardBody>
                <FormControl>
                  <FormLabel fontSize="md">Roga / रोग</FormLabel>
                  <Textarea 
                    size="md"
                    value={prescription.roga}
                    onChange={(e) => {
                      const words = e.target.value.split(/\s+/).length;
                      if (words <= 150 || e.target.value === '') {
                        setPrescription(prev => ({...prev, roga: e.target.value}));
                      }
                    }}
                    placeholder="Disease/condition diagnosis (maximum 150 words)"
                    rows={4}
                  />
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    {prescription.roga.split(/\s+/).filter(word => word.length > 0).length}/150 words
                  </Text>
                </FormControl>
              </CardBody>
            </Card>

            {/* Medicines */}
            <Card variant="outline" size="sm">
              <CardHeader py={3}>
                <HStack justify="space-between">
                  <Heading size="md" color="green.600">औषधि योजना (Medicines)</Heading>
                  <Button leftIcon={<Plus />} size="md" colorScheme="green" onClick={() => setShowAddMedicine(true)}>
                    Add Medicine
                  </Button>
                </HStack>
              </CardHeader>
              <CardBody>
                {showAddMedicine && (
                  <Card variant="filled" mb={4}>
                    <CardBody>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={3}>
                        <FormControl>
                          <FormLabel fontSize="sm">Medicine Details</FormLabel>
                          <Input 
                            size="sm"
                            value={currentMedicine.medicineDetails}
                            onChange={(e) => setCurrentMedicine(prev => ({...prev, medicineDetails: e.target.value}))}
                            placeholder="Medicine name/number (searchable)"
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="sm">Type</FormLabel>
                          <Select 
                            size="sm"
                            value={currentMedicine.type}
                            onChange={(e) => setCurrentMedicine(prev => ({...prev, type: e.target.value}))}
                          >
                            <option value="">Select Type</option>
                            {medicineTypes.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="sm">Dose</FormLabel>
                          <Select 
                            size="sm"
                            value={currentMedicine.dose}
                            onChange={(e) => setCurrentMedicine(prev => ({...prev, dose: e.target.value}))}
                          >
                            <option value="">Select Dose</option>
                            {doseOptions.map(dose => (
                              <option key={dose} value={dose}>{dose}</option>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="sm">Anupana</FormLabel>
                          <Select 
                            size="sm"
                            value={currentMedicine.anupana}
                            onChange={(e) => setCurrentMedicine(prev => ({...prev, anupana: e.target.value}))}
                          >
                            <option value="">Select Vehicle</option>
                            {anupanaOptions.map(option => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="sm">Duration</FormLabel>
                          <Input 
                            size="sm"
                            value={currentMedicine.duration}
                            onChange={(e) => setCurrentMedicine(prev => ({...prev, duration: e.target.value}))}
                            placeholder="Duration (e.g., 7 days, 2 weeks)"
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="sm">Notes</FormLabel>
                          <Textarea 
                            size="sm"
                            value={currentMedicine.notes}
                            onChange={(e) => setCurrentMedicine(prev => ({...prev, notes: e.target.value}))}
                            placeholder="Additional notes or instructions"
                            rows={2}
                          />
                        </FormControl>
                      </SimpleGrid>
                      <HStack justify="flex-end" spacing={3}>
                        <Button size="sm" onClick={() => setShowAddMedicine(false)}>Cancel</Button>
                        <Button size="sm" colorScheme="green" onClick={addMedicine}>Add</Button>
                      </HStack>
                    </CardBody>
                  </Card>
                )}
                
                {prescription.medicines.length > 0 ? (
                  <TableContainer>
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th fontSize="sm">Medicine</Th>
                          <Th fontSize="sm">Type</Th>
                          <Th fontSize="sm">Dose</Th>
                          <Th fontSize="sm">Anupana</Th>
                          <Th fontSize="sm">Kala</Th>
                          <Th fontSize="sm">Duration</Th>
                          <Th fontSize="sm">Action</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {prescription.medicines.map((medicine) => (
                          <Tr key={medicine.id}>
                            <Td fontSize="sm">{medicine.name}</Td>
                            <Td fontSize="xs">
                              <Badge colorScheme="green" variant="subtle" fontSize="xs">
                                {medicine.type}
                              </Badge>
                            </Td>
                            <Td fontSize="sm">{medicine.dose}</Td>
                            <Td fontSize="sm">{medicine.anupana}</Td>
                            <Td fontSize="sm">{medicine.kala}</Td>
                            <Td fontSize="sm">{medicine.duration}</Td>
                            <Td>
                              <IconButton
                                icon={<Trash2 />}
                                size="xs"
                                colorScheme="red"
                                variant="ghost"
                                onClick={() => removeMedicine(medicine.id)}
                              />
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Text color="gray.500" textAlign="center" py={4} fontSize="sm">
                    No medicines added yet.
                  </Text>
                )}
              </CardBody>
            </Card>

            {/* Treatment Plan */}
            <Card variant="outline" size="sm">
              <CardHeader py={3}>
                <Heading size="md" color="green.600">चिकित्सा योजना (Treatment Plan)</Heading>
              </CardHeader>
              <CardBody>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <FormControl>
                    <FormLabel fontSize="md">Pathya / पथ्य</FormLabel>
                    <Textarea 
                      size="md"
                      value={prescription.pathya}
                      onChange={(e) => setPrescription(prev => ({...prev, pathya: e.target.value}))}
                      placeholder="Diet recommendations"
                      rows={3}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="md">Apathya / अपथ्य</FormLabel>
                    <Textarea 
                      size="md"
                      value={prescription.apathya}
                      onChange={(e) => setPrescription(prev => ({...prev, apathya: e.target.value}))}
                      placeholder="Things to avoid"
                      rows={3}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="md">Vihara / विहार</FormLabel>
                    <Textarea 
                      size="md"
                      value={prescription.vihara}
                      onChange={(e) => setPrescription(prev => ({...prev, vihara: e.target.value}))}
                      placeholder="Lifestyle recommendations"
                      rows={3}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="md">Follow-up Date</FormLabel>
                    <Input 
                      size="md"
                      type="date"
                      value={prescription.followUpDate}
                      onChange={(e) => setPrescription(prev => ({...prev, followUpDate: e.target.value}))}
                    />
                  </FormControl>
                </SimpleGrid>
              </CardBody>
            </Card>

            {/* Panchkarma Section */}
            <Card variant="outline" size="sm">
              <CardHeader py={3}>
                <HStack justify="space-between">
                  <Heading size="md" color="purple.600">पंचकर्म (Panchkarma) - Updated</Heading>
                  <Select 
                    placeholder="Add Panchkarma Category" 
                    onChange={(e) => {
                      if (e.target.value) {
                        addPanchkarma(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    size="sm"
                    maxW="200px"
                  >
                    {Object.keys(panchkarmaCategories).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </Select>
                </HStack>
              </CardHeader>
              {panchkarmas.length > 0 && (
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    {panchkarmas.map((panchkarma) => (
                      <Box key={panchkarma.id} p={4} border="1px" borderColor="gray.200" borderRadius="md">
                        <HStack justify="space-between" mb={3}>
                          <Text fontWeight="bold" color="purple.600">{panchkarma.category}</Text>
                          <IconButton
                            icon={<Trash2 size={16} />}
                            onClick={() => removePanchkarma(panchkarma.id)}
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                          />
                        </HStack>
                        
                        {/* Subcategories */}
                        {panchkarma.subcategories.map((subcategory, subIndex) => (
                          <HStack key={subIndex} spacing={3} mb={2}>
                            <Box flex="1">
                              {subcategory.isCustom ? (
                                <Input
                                  value={subcategory.name}
                                  onChange={(e) => updateSubcategoryName(panchkarma.id, subIndex, e.target.value)}
                                  placeholder="Enter treatment name"
                                  size="sm"
                                />
                              ) : (
                                <Text fontSize="sm" p={2} bg="gray.50" borderRadius="md">
                                  {subcategory.name}
                                </Text>
                              )}
                            </Box>
                            <Input
                              value={subcategory.duration}
                              onChange={(e) => updateSubcategoryDuration(panchkarma.id, subIndex, e.target.value)}
                              placeholder="Duration"
                              size="sm"
                              maxW="120px"
                            />
                            {panchkarma.subcategories.length > 1 && (
                              <IconButton
                                icon={<Trash2 size={14} />}
                                onClick={() => removeSubcategory(panchkarma.id, subIndex)}
                                size="sm"
                                variant="ghost"
                                colorScheme="red"
                              />
                            )}
                          </HStack>
                        ))}
                        
                        <HStack spacing={3} mt={3}>
                          <Button
                            leftIcon={<Plus size={14} />}
                            onClick={() => addSubcategory(panchkarma.id)}
                            size="sm"
                            variant="outline"
                            colorScheme="purple"
                          >
                            Add Treatment
                          </Button>
                        </HStack>
                        
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3} mt={3}>
                          <FormControl>
                            <FormLabel fontSize="sm">Overall Duration</FormLabel>
                            <Input
                              value={panchkarma.overallDuration}
                              onChange={(e) => updateOverallDuration(panchkarma.id, e.target.value)}
                              placeholder="e.g., 21 days"
                              size="sm"
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel fontSize="sm">Notes</FormLabel>
                            <Textarea
                              value={panchkarma.notes}
                              onChange={(e) => updatePanchkarmaNotes(panchkarma.id, e.target.value)}
                              placeholder="Additional notes"
                              size="sm"
                              rows={2}
                            />
                          </FormControl>
                        </SimpleGrid>
                      </Box>
                    ))}
                  </VStack>
                </CardBody>
              )}
            </Card>
          </VStack>
        </ModalBody>

        <ModalFooter py={6} px={6}>
          <HStack spacing={3}>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button leftIcon={<Printer />} colorScheme="blue" onClick={handlePrint}>
              Print
            </Button>
            <Button 
              leftIcon={<Plus />} 
              colorScheme="teal" 
              onClick={handleSendToPharmacy}
              isDisabled={prescription.medicines.length === 0}
            >
              Send to Pharmacy
            </Button>
            <Button leftIcon={<Save />} colorScheme="green" onClick={handleSave}>
              Save Prescription
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PrescriptionModal;
