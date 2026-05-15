import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  SimpleGrid,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Icon,
  Card,
  CardBody,
  Divider,
  Heading,
  Flex,
  Textarea,
  Input,
  IconButton,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Tooltip
} from '@chakra-ui/react';
import { ArrowLeft, User, Phone, Mail, Calendar, Clock, FileText, Edit2, Save, X, Plus, Trash2 } from 'lucide-react';
import PrescriptionModal from '../AyurvedicPrescription/PrescriptionModal';

// Mock patient data - in real app, this would come from API based on patient ID
const mockPatientData = {
  10001: {
    id: 10001,
    patientName: 'Rajesh Kumar',
    caseId: 'OPD001',
    age: 45,
    gender: 'Male',
    contact: '+91 9876543210',
    email: 'rajesh.kumar@email.com',
    address: '123 Main Street, Mumbai, Maharashtra 400001',
    status: 'Completed',
    doctor: 'Dr. Ramesh Ayurveda',
    date: '2024-12-15',
    time: '09:30 AM',
    complaint: 'Joint pain and stiffness',
    diagnosis: 'Arthritis',
    treatment: 'Panchakarma therapy',
    pastMedicalHistory: [
      {
        condition: 'Hypertension',
        year: '2019',
        description: 'Diagnosed with high blood pressure, controlled with medication',
        treatment: 'ACE inhibitors, lifestyle modifications'
      },
      {
        condition: 'Diabetes Type 2',
        year: '2021',
        description: 'Adult-onset diabetes, well controlled with diet and medication',
        treatment: 'Metformin, dietary management'
      }
    ],
    visitHistory: [
      {
        date: '2024-12-15',
        complaint: 'Joint pain and stiffness',
        diagnosis: 'Arthritis',
        treatment: 'Panchakarma therapy',
        doctor: 'Dr. Ramesh Ayurveda',
        followUp: '2024-12-29'
      },
      {
        date: '2024-11-20',
        complaint: 'Back pain',
        diagnosis: 'Muscle strain',
        treatment: 'Abhyanga massage',
        doctor: 'Dr. Ramesh Ayurveda',
        followUp: '2024-12-05'
      },
      {
        date: '2024-10-15',
        complaint: 'Digestive issues',
        diagnosis: 'Indigestion',
        treatment: 'Triphala churna',
        doctor: 'Dr. Priya Sharma',
        followUp: '2024-10-30'
      }
    ],
    labInvestigations: [
      {
        date: '2024-12-10',
        investigation: 'Complete Blood Count',
        result: 'Normal',
        normalRange: '4.5-11.0 x10³/μL',
        status: 'Normal'
      },
      {
        date: '2024-12-10',
        investigation: 'ESR',
        result: '25 mm/hr',
        normalRange: '0-20 mm/hr',
        status: 'Abnormal'
      },
      {
        date: '2024-11-15',
        investigation: 'Blood Sugar (Fasting)',
        result: '98 mg/dL',
        normalRange: '70-100 mg/dL',
        status: 'Normal'
      },
      {
        date: '2024-11-15',
        investigation: 'Blood Pressure',
        result: '140/90 mmHg',
        normalRange: '120/80 mmHg',
        status: 'Abnormal'
      }
    ],
    treatmentHistory: [
      {
        date: '2024-12-15',
        treatment: 'Panchakarma Therapy',
        duration: '21 days',
        dosage: 'Daily sessions',
        notes: 'Complete detoxification and rejuvenation therapy'
      },
      {
        date: '2024-11-20',
        treatment: 'Abhyanga Massage',
        duration: '14 days',
        dosage: 'Twice daily',
        notes: 'Ayurvedic oil massage for muscle relaxation'
      },
      {
        date: '2024-10-15',
        treatment: 'Triphala Churna',
        duration: '30 days',
        dosage: '1 tsp twice daily',
        notes: 'For digestive health and detoxification'
      }
    ]
  },
  // Add more mock patients as needed
  10002: {
    id: 10002,
    patientName: 'Priya Sharma',
    caseId: 'OPD002',
    age: 32,
    gender: 'Female',
    contact: '+91 9876543211',
    email: 'priya.sharma@email.com',
    address: '456 Garden Street, Delhi, Delhi 110001',
    status: 'In Progress',
    doctor: 'Dr. Priya Sharma',
    date: '2024-12-16',
    time: '10:00 AM',
    complaint: 'Stress and anxiety',
    diagnosis: 'Anxiety disorder',
    treatment: 'Shirodhara therapy',
    pastMedicalHistory: [
      {
        condition: 'Migraine',
        year: '2020',
        description: 'Chronic headaches, triggered by stress',
        treatment: 'Ayurvedic herbs and lifestyle modifications'
      }
    ],
    visitHistory: [
      {
        date: '2024-12-16',
        complaint: 'Stress and anxiety',
        diagnosis: 'Anxiety disorder',
        treatment: 'Shirodhara therapy',
        doctor: 'Dr. Priya Sharma',
        followUp: '2024-12-30'
      }
    ],
    labInvestigations: [
      {
        date: '2024-12-12',
        investigation: 'Thyroid Function Test',
        result: 'Normal',
        normalRange: '0.4-4.0 mIU/L',
        status: 'Normal'
      }
    ],
    treatmentHistory: [
      {
        date: '2024-12-16',
        treatment: 'Shirodhara Therapy',
        duration: '14 days',
        dosage: 'Daily sessions',
        notes: 'Continuous oil pouring on forehead for stress relief'
      }
    ]
  }
};

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [patient, setPatient] = useState(location.state?.patient || null);
  const [loading, setLoading] = useState(!location.state?.patient);
  const [error, setError] = useState(null);

  // Detect if we're in admin or doctor portal
  const isAdminPortal = location.pathname.includes('/admin/');
  const basePath = isAdminPortal ? '/admin' : '/doctor';

  // Editable states
  const [editingCurrentTreatment, setEditingCurrentTreatment] = useState(false);
  const [currentTreatment, setCurrentTreatment] = useState({
    treatment: '',
    doctor: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [editingDoctorNotes, setEditingDoctorNotes] = useState(false);
  const [doctorNotes, setDoctorNotes] = useState({
    notes: '',
    doctor: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [pastTreatments, setPastTreatments] = useState([]);
  const [editingPastTreatment, setEditingPastTreatment] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newPastTreatment, setNewPastTreatment] = useState({
    treatment: '',
    date: new Date().toISOString().split('T')[0],
    duration: '',
    dosage: '',
    notes: ''
  });

  // Prescription Modal state
  const { 
    isOpen: isPrescriptionModalOpen, 
    onOpen: onPrescriptionModalOpen, 
    onClose: onPrescriptionModalClose 
  } = useDisclosure();
  const [selectedPrescriptionPatient, setSelectedPrescriptionPatient] = useState(null);
  const [prescriptionDate, setPrescriptionDate] = useState(new Date().toISOString().split('T')[0]);

  // Delete confirmation modal
  const { 
    isOpen: isDeleteModalOpen, 
    onOpen: onDeleteModalOpen, 
    onClose: onDeleteModalClose 
  } = useDisclosure();
  const [deleteTarget, setDeleteTarget] = useState({ type: '', index: null });

  console.log('=== PatientDetails Component ===');
  console.log('URL Param ID:', id);
  console.log('Location pathname:', location.pathname);
  console.log('Location state:', location.state);
  console.log('Patient data:', patient);
  console.log('Loading:', loading);
  console.log('Error:', error);

  useEffect(() => {
    // If patient data wasn't passed via navigation state, fetch it from API
    if (!location.state?.patient && id) {
      console.log('Fetching patient from API...');
      setLoading(true);
      const baseURL = import.meta.env.VITE_API_URL || 'https://shatayu-backend.onrender.com';
      fetch(`${baseURL}/api/patients/${id}`)
        .then(res => {
          console.log('API Response status:', res.status);
          if (!res.ok) throw new Error('Failed to fetch patient');
          return res.json();
        })
        .then(data => {
          console.log('Fetched patient data:', data);
          setPatient(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching patient:', err);
          setError(err.message);
          setLoading(false);
        });
    } else {
      console.log('Using patient data from navigation state');
    }
  }, [id, location.state]);

  // Initialize editable data when patient is loaded
  useEffect(() => {
    if (patient) {
      // Try to load saved treatments from localStorage based on patient ID
      const patientId = patient.id || patient.patient_id;
      const savedTreatments = localStorage.getItem(`patient_treatments_${patientId}`);
      
      if (savedTreatments) {
        const treatments = JSON.parse(savedTreatments);
        
        setCurrentTreatment(treatments.currentTreatment || {
          treatment: patient.treatment || patient.primary_treatment || '',
          doctor: patient.doctor || '',
          date: patient.date || patient.last_visit || new Date().toISOString().split('T')[0],
          notes: patient.treatmentNotes || ''
        });

        setDoctorNotes(treatments.doctorNotes || {
          notes: patient.doctorNotes || '',
          doctor: patient.doctor || '',
          date: patient.notesDate || new Date().toISOString().split('T')[0]
        });

        setPastTreatments(treatments.pastTreatments || []);
      } else {
        // Initialize with patient data
        setCurrentTreatment({
          treatment: patient.treatment || patient.primary_treatment || '',
          doctor: patient.doctor || '',
          date: patient.date || patient.last_visit || new Date().toISOString().split('T')[0],
          notes: patient.treatmentNotes || ''
        });

        setDoctorNotes({
          notes: patient.doctorNotes || '',
          doctor: patient.doctor || '',
          date: patient.notesDate || new Date().toISOString().split('T')[0]
        });

        setPastTreatments(patient.treatmentHistory || patient.pastTreatments || []);
      }
    }
  }, [patient]);

  // Save treatments to localStorage whenever they change
  const saveTreatmentsToStorage = (current, notes, past) => {
    if (patient) {
      const patientId = patient.id || patient.patient_id;
      const treatmentsData = {
        currentTreatment: current,
        doctorNotes: notes,
        pastTreatments: past,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(`patient_treatments_${patientId}`, JSON.stringify(treatmentsData));
      console.log('Saved treatments to localStorage for patient:', patientId);
    }
  };

  // Save handlers
  const handleOpenCurrentTreatmentPrescription = () => {
    setSelectedPrescriptionPatient(patient);
    setPrescriptionDate(currentTreatment.date);
    onPrescriptionModalOpen();
  };

  const handleOpenPastTreatmentPrescription = (treatment, index) => {
    // Pass the treatment data along with patient
    setSelectedPrescriptionPatient({
      ...patient,
      existingTreatment: treatment,
      treatmentIndex: index
    });
    setPrescriptionDate(treatment.date);
    onPrescriptionModalOpen();
  };

  const handleSaveCurrentTreatment = () => {
    saveTreatmentsToStorage(currentTreatment, doctorNotes, pastTreatments);
    toast({
      title: 'Current Treatment Saved',
      description: 'Treatment information has been updated successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    setEditingCurrentTreatment(false);
  };

  const handleSaveDoctorNotes = () => {
    saveTreatmentsToStorage(currentTreatment, doctorNotes, pastTreatments);
    toast({
      title: 'Doctor Notes Saved',
      description: 'Notes have been updated successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    setEditingDoctorNotes(false);
  };

  const handleAddPastTreatment = () => {
    if (!newPastTreatment.treatment || !newPastTreatment.date) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in treatment name and date.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const updatedTreatments = [...pastTreatments, { ...newPastTreatment, id: Date.now() }];
    setPastTreatments(updatedTreatments);
    saveTreatmentsToStorage(currentTreatment, doctorNotes, updatedTreatments);
    
    toast({
      title: 'Past Treatment Added',
      description: 'New treatment has been added to history.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    setNewPastTreatment({
      treatment: '',
      date: new Date().toISOString().split('T')[0],
      duration: '',
      dosage: '',
      notes: ''
    });
    onClose();
  };

  const handleDeletePastTreatment = (index) => {
    setDeleteTarget({ type: 'pastTreatment', index });
    onDeleteModalOpen();
  };

  const handleDeleteCurrentTreatment = () => {
    setDeleteTarget({ type: 'currentTreatment', index: null });
    onDeleteModalOpen();
  };

  const handleDeleteDoctorNotes = () => {
    setDeleteTarget({ type: 'doctorNotes', index: null });
    onDeleteModalOpen();
  };

  const confirmDelete = () => {
    const { type, index } = deleteTarget;

    if (type === 'pastTreatment') {
      const updatedTreatments = pastTreatments.filter((_, i) => i !== index);
      setPastTreatments(updatedTreatments);
      saveTreatmentsToStorage(currentTreatment, doctorNotes, updatedTreatments);
      
      toast({
        title: 'Past Treatment Deleted',
        description: 'Treatment has been removed from history.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    } else if (type === 'currentTreatment') {
      const clearedTreatment = {
        treatment: '',
        doctor: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      };
      setCurrentTreatment(clearedTreatment);
      saveTreatmentsToStorage(clearedTreatment, doctorNotes, pastTreatments);
      
      toast({
        title: 'Current Treatment Deleted',
        description: 'Current treatment has been cleared.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    } else if (type === 'doctorNotes') {
      const clearedNotes = {
        notes: '',
        doctor: '',
        date: new Date().toISOString().split('T')[0]
      };
      setDoctorNotes(clearedNotes);
      saveTreatmentsToStorage(currentTreatment, clearedNotes, pastTreatments);
      
      toast({
        title: 'Doctor Notes Deleted',
        description: 'Doctor notes have been cleared.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    }

    onDeleteModalClose();
    setDeleteTarget({ type: '', index: null });
  };

  const handleUpdatePastTreatment = (index, updatedData) => {
    const updatedTreatments = pastTreatments.map((treatment, i) => 
      i === index ? { ...treatment, ...updatedData } : treatment
    );
    setPastTreatments(updatedTreatments);
    saveTreatmentsToStorage(currentTreatment, doctorNotes, updatedTreatments);
    
    toast({
      title: 'Past Treatment Updated',
      description: 'Treatment has been updated successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    setEditingPastTreatment(null);
  };

  if (loading) {
    return (
      <Box p={6} display="flex" justifyContent="center" alignItems="center" minH="50vh" bg="white">
        <VStack>
          <Text fontSize="2xl" fontWeight="bold" color="blue.600">Loading patient details...</Text>
          <Text fontSize="md" color="gray.600">Patient ID: {id}</Text>
        </VStack>
      </Box>
    );
  }
  
  if (error || !patient) {
    return (
      <Box p={6} bg="white">
        <Text fontSize="2xl" fontWeight="bold" color="red.500" mb={4}>
          {error || 'Patient not found'}
        </Text>
        <Text mb={4}>Patient ID: {id}</Text>
        <Text mb={4}>Location state: {JSON.stringify(location.state)}</Text>
        <Button onClick={() => navigate(`${basePath}/opd`)} leftIcon={<ArrowLeft />} colorScheme="blue">
          Back to OPD
        </Button>
      </Box>
    );
  }

  return (
    <Box p={6} bg="gray.50" minH="100vh">
      {/* Header */}
      <HStack mb={6} spacing={4}>
        <Button 
          leftIcon={<ArrowLeft />} 
          onClick={() => navigate(`${basePath}/opd`)}
          variant="outline"
          colorScheme="blue"
        >
          Back to OPD
        </Button>
        <Heading size="lg" color="blue.600">
          Patient Details
        </Heading>
      </HStack>

      {/* Patient Information Card */}
      <Card mb={6}>
        <CardBody>
          <HStack spacing={4} mb={4}>
            <Icon as={User} boxSize={8} color="blue.500" />
            <VStack align="start" spacing={0}>
              <Text fontSize="2xl" fontWeight="bold">{patient.name || patient.patientName}</Text>
              <Text color="gray.600">{
                patient.opd_no || patient.caseId || `Patient ID: ${patient.id || patient.patient_id}`
              }</Text>
            </VStack>
            <Badge 
              colorScheme={
                patient.status === 'Completed' || patient.status === 'Active' ? 'green' :
                patient.status === 'In Progress' ? 'yellow' : 'blue'
              }
              px={3}
              py={1}
              fontSize="sm"
            >
              {patient.status || 'Active'}
            </Badge>
          </HStack>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            <Box>
              <Text fontSize="sm" color="gray.600" mb={1}>Age</Text>
              <Text fontWeight="medium">{patient.age || 'N/A'} {patient.age ? 'years' : ''}</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600" mb={1}>Gender</Text>
              <Text fontWeight="medium">{patient.gender || 'N/A'}</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600" mb={1}>Contact</Text>
              <Text fontWeight="medium">{patient.phone || patient.contact || 'N/A'}</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600" mb={1}>Email</Text>
              <Text fontWeight="medium">{patient.email || 'N/A'}</Text>
            </Box>
            {patient.constitution && (
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>Constitution</Text>
                <Text fontWeight="medium">{patient.constitution}</Text>
              </Box>
            )}
            {patient.patient_type && (
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>Patient Type</Text>
                <Text fontWeight="medium">{patient.patient_type}</Text>
              </Box>
            )}
            {patient.last_visit && (
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>Last Visit</Text>
                <Text fontWeight="medium">{patient.last_visit}</Text>
              </Box>
            )}
            {patient.doctor && (
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>Doctor</Text>
                <Text fontWeight="medium">{patient.doctor}</Text>
              </Box>
            )}
            {patient.date && (
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>Date</Text>
                <Text fontWeight="medium">{patient.date}</Text>
              </Box>
            )}
            {patient.time && (
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>Time</Text>
                <Text fontWeight="medium">{patient.time}</Text>
              </Box>
            )}
            {patient.complaint && (
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>Complaint</Text>
                <Text fontWeight="medium">{patient.complaint}</Text>
              </Box>
            )}
            {patient.diagnosis && (
              <Box>
                <Text fontSize="sm" color="gray.600" mb={1}>Diagnosis</Text>
                <Text fontWeight="medium">{patient.diagnosis}</Text>
              </Box>
            )}
          </SimpleGrid>
          
          {(patient.address || patient.city || patient.country) && (
            <Box mt={4}>
              <Text fontSize="sm" color="gray.600" mb={1}>Address</Text>
              <Text fontWeight="medium">{
                [patient.address, patient.city, patient.postal_code, patient.country]
                  .filter(Boolean)
                  .join(', ')
              }</Text>
            </Box>
          )}
        </CardBody>
      </Card>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {/* Past Medical History */}
        {patient.pastMedicalHistory && patient.pastMedicalHistory.length > 0 && (
          <Card>
            <CardBody>
              <Heading size="md" mb={4} color="blue.600">
                Past Medical History
              </Heading>
              <VStack spacing={4} align="stretch">
                {patient.pastMedicalHistory.map((history, index) => (
                  <Box key={index} p={4} border="1px" borderColor="gray.200" borderRadius="md">
                    <HStack justify="space-between" mb={2}>
                      <Text fontWeight="semibold">{history.condition}</Text>
                      <Badge colorScheme="blue">{history.year}</Badge>
                    </HStack>
                    <Text fontSize="sm" color="gray.700" mb={2}>{history.description}</Text>
                    {history.treatment && (
                      <Text fontSize="sm" color="green.600">
                        <strong>Treatment:</strong> {history.treatment}
                      </Text>
                    )}
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* Current Treatment */}
        <Card>
          <CardBody>
            <Heading size="md" color="blue.600" mb={4}>
              Current Treatment
            </Heading>
            
            {currentTreatment.treatment ? (
              <Box p={4} bg="blue.50" borderRadius="md" position="relative">
                <HStack justify="space-between" align="start" mb={2}>
                  <Text fontWeight="semibold" flex={1}>{currentTreatment.treatment}</Text>
                  <HStack spacing={1}>
                    <Tooltip label="Edit treatment" placement="top">
                      <IconButton
                        icon={<Edit2 size={16} />}
                        size="sm"
                        colorScheme="blue"
                        variant="ghost"
                        onClick={handleOpenCurrentTreatmentPrescription}
                        aria-label="Edit current treatment"
                      />
                    </Tooltip>
                    <Tooltip label="Delete treatment" placement="top">
                      <IconButton
                        icon={<Trash2 size={16} />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={handleDeleteCurrentTreatment}
                        aria-label="Delete current treatment"
                      />
                    </Tooltip>
                  </HStack>
                </HStack>
                <Text fontSize="sm" color="gray.700" mb={1}>
                  Prescribed by {currentTreatment.doctor || 'N/A'} on {currentTreatment.date}
                </Text>
                {currentTreatment.notes && (
                  <Text fontSize="sm" color="gray.600" mt={2}>
                    {currentTreatment.notes}
                  </Text>
                )}
              </Box>
            ) : (
              <Box p={4} bg="gray.50" borderRadius="md" textAlign="center">
                <Text color="gray.500" fontSize="sm" mb={2}>
                  No current treatment recorded
                </Text>
                <Button
                  size="sm"
                  colorScheme="blue"
                  leftIcon={<Plus size={16} />}
                  onClick={handleOpenCurrentTreatmentPrescription}
                >
                  Add Treatment
                </Button>
              </Box>
            )}
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Visit History */}
      {patient.visitHistory && patient.visitHistory.length > 0 && (
        <Card mt={6}>
          <CardBody>
            <Heading size="md" mb={4} color="blue.600">
              Visit History
            </Heading>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Date</Th>
                  <Th display={{ base: 'none', md: 'table-cell' }}>Complaint</Th>
                  <Th>Diagnosis</Th>
                  <Th display={{ base: 'none', lg: 'table-cell' }}>Treatment</Th>
                  <Th display={{ base: 'none', md: 'table-cell' }}>Doctor</Th>
                  <Th display={{ base: 'none', lg: 'table-cell' }}>Follow-up</Th>
                </Tr>
              </Thead>
              <Tbody>
                {patient.visitHistory.map((visit, index) => (
                  <Tr key={index}>
                    <Td>
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm" fontWeight="medium">{visit.date}</Text>
                        <Text fontSize="xs" color="gray.500" display={{ base: 'block', md: 'none' }}>
                          {visit.complaint}
                        </Text>
                      </VStack>
                    </Td>
                    <Td display={{ base: 'none', md: 'table-cell' }}>{visit.complaint}</Td>
                    <Td>
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm">{visit.diagnosis}</Text>
                        <Text fontSize="xs" color="gray.500" display={{ base: 'block', lg: 'none' }}>
                          By: {visit.doctor}
                        </Text>
                      </VStack>
                    </Td>
                    <Td display={{ base: 'none', lg: 'table-cell' }}>{visit.treatment}</Td>
                    <Td display={{ base: 'none', md: 'table-cell' }}>{visit.doctor}</Td>
                    <Td display={{ base: 'none', lg: 'table-cell' }}>{visit.followUp || 'N/A'}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      )}

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mt={6}>
        {/* Lab Investigations */}
        {patient.labInvestigations && patient.labInvestigations.length > 0 && (
          <Card>
            <CardBody>
              <Heading size="md" mb={4} color="blue.600">
                Lab Investigations
              </Heading>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Date</Th>
                    <Th>Investigation</Th>
                    <Th display={{ base: 'none', md: 'table-cell' }}>Result</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {patient.labInvestigations.map((lab, index) => (
                    <Tr key={index}>
                      <Td>
                        <VStack align="start" spacing={0}>
                          <Text fontSize="sm" fontWeight="medium">{lab.date}</Text>
                        </VStack>
                      </Td>
                      <Td>
                        <VStack align="start" spacing={0}>
                          <Text fontSize="sm">{lab.investigation}</Text>
                          <Text fontSize="xs" color="gray.500" display={{ base: 'block', md: 'none' }}>
                            Result: {lab.result}
                          </Text>
                        </VStack>
                      </Td>
                      <Td display={{ base: 'none', md: 'table-cell' }}>{lab.result}</Td>
                      <Td>
                        <Badge colorScheme={
                          lab.status === 'Normal' ? 'green' :
                          lab.status === 'Abnormal' ? 'red' : 'yellow'
                        }>
                          {lab.status}
                        </Badge>
                      </Td>
                    </Tr>
                  ))}
                  </Tbody>
                </Table>
            </CardBody>
          </Card>
        )}

        {/* Past Treatments - New Editable Section */}
        <Card>
          <CardBody>
            <HStack justify="space-between" mb={4}>
              <Heading size="md" color="blue.600">
                Past Treatments
              </Heading>
              <Button
                leftIcon={<Plus size={18} />}
                size="sm"
                colorScheme="blue"
                onClick={onOpen}
              >
                Add Treatment
              </Button>
            </HStack>
            
            {pastTreatments.length > 0 ? (
              <VStack spacing={4} align="stretch">
                {pastTreatments.map((treatment, index) => (
                  <Box key={index} p={4} border="1px" borderColor="gray.200" borderRadius="md" bg="white" position="relative">
                    <HStack justify="space-between" align="start" mb={2}>
                      <Text fontWeight="semibold" flex={1}>{treatment.treatment}</Text>
                      <HStack spacing={1}>
                        <Tooltip label="Edit treatment" placement="top">
                          <IconButton
                            icon={<Edit2 size={16} />}
                            size="sm"
                            variant="ghost"
                            colorScheme="blue"
                            onClick={() => handleOpenPastTreatmentPrescription(treatment, index)}
                            aria-label="Edit treatment"
                          />
                        </Tooltip>
                        <Tooltip label="Delete treatment" placement="top">
                          <IconButton
                            icon={<Trash2 size={16} />}
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                            onClick={() => handleDeletePastTreatment(index)}
                            aria-label="Delete treatment"
                          />
                        </Tooltip>
                      </HStack>
                    </HStack>
                    <HStack spacing={4} mb={2}>
                      <Text fontSize="sm" color="gray.600">
                        <strong>Date:</strong> {treatment.date}
                      </Text>
                      {treatment.duration && (
                        <Text fontSize="sm" color="gray.600">
                          <strong>Duration:</strong> {treatment.duration}
                        </Text>
                      )}
                      {treatment.dosage && (
                        <Text fontSize="sm" color="gray.600">
                          <strong>Dosage:</strong> {treatment.dosage}
                        </Text>
                      )}
                    </HStack>
                    {treatment.notes && (
                      <Box mt={2}>
                        <Text fontSize="sm" color="gray.600"><strong>Notes:</strong></Text>
                        <Text fontSize="sm" color="gray.700">{treatment.notes}</Text>
                      </Box>
                    )}
                  </Box>
                ))}
              </VStack>
            ) : (
              <Text color="gray.500" fontSize="sm" textAlign="center" py={4}>
                No past treatments recorded. Click "Add Treatment" to add one.
              </Text>
            )}
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Add Past Treatment Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Past Treatment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Box w="100%">
                <Text fontSize="sm" fontWeight="medium" mb={1}>Treatment Name *</Text>
                <Input
                  value={newPastTreatment.treatment}
                  onChange={(e) => setNewPastTreatment({ ...newPastTreatment, treatment: e.target.value })}
                  placeholder="Enter treatment name"
                />
              </Box>
              <Box w="100%">
                <Text fontSize="sm" fontWeight="medium" mb={1}>Date *</Text>
                <Input
                  type="date"
                  value={newPastTreatment.date}
                  onChange={(e) => setNewPastTreatment({ ...newPastTreatment, date: e.target.value })}
                />
              </Box>
              <SimpleGrid columns={2} spacing={4} w="100%">
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={1}>Duration</Text>
                  <Input
                    value={newPastTreatment.duration}
                    onChange={(e) => setNewPastTreatment({ ...newPastTreatment, duration: e.target.value })}
                    placeholder="e.g., 14 days"
                  />
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={1}>Dosage</Text>
                  <Input
                    value={newPastTreatment.dosage}
                    onChange={(e) => setNewPastTreatment({ ...newPastTreatment, dosage: e.target.value })}
                    placeholder="e.g., Twice daily"
                  />
                </Box>
              </SimpleGrid>
              <Box w="100%">
                <Text fontSize="sm" fontWeight="medium" mb={1}>Notes</Text>
                <Textarea
                  value={newPastTreatment.notes}
                  onChange={(e) => setNewPastTreatment({ ...newPastTreatment, notes: e.target.value })}
                  placeholder="Enter treatment notes"
                  rows={3}
                />
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" leftIcon={<Plus size={18} />} onClick={handleAddPastTreatment}>
              Add Treatment
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Doctor's Latest Notes - Editable */}
      <Card mt={6}>
        <CardBody>
          <Heading size="md" color="blue.600" mb={4}>
            Latest Doctor's Notes
          </Heading>
          
          {editingDoctorNotes ? (
            <VStack spacing={3} align="stretch">
              <Box>
                <Text fontSize="sm" fontWeight="medium" mb={1}>Notes</Text>
                <Textarea
                  value={doctorNotes.notes}
                  onChange={(e) => setDoctorNotes({ ...doctorNotes, notes: e.target.value })}
                  placeholder="Enter doctor's notes"
                  rows={4}
                />
              </Box>
              <SimpleGrid columns={2} spacing={3}>
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={1}>Doctor Name</Text>
                  <Input
                    value={doctorNotes.doctor}
                    onChange={(e) => setDoctorNotes({ ...doctorNotes, doctor: e.target.value })}
                    placeholder="Enter doctor name"
                  />
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={1}>Date</Text>
                  <Input
                    type="date"
                    value={doctorNotes.date}
                    onChange={(e) => setDoctorNotes({ ...doctorNotes, date: e.target.value })}
                  />
                </Box>
              </SimpleGrid>
              <HStack justify="flex-end">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditingDoctorNotes(false)}
                  leftIcon={<X size={16} />}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  colorScheme="green"
                  onClick={handleSaveDoctorNotes}
                  leftIcon={<Save size={16} />}
                >
                  Save
                </Button>
              </HStack>
            </VStack>
          ) : doctorNotes.notes ? (
            <Box p={4} bg="yellow.50" border="1px" borderColor="yellow.200" borderRadius="md" position="relative">
              <HStack justify="space-between" align="start" mb={2}>
                <Box flex={1}>
                  <Text fontSize="sm" color="gray.700" mb={2}>
                    {doctorNotes.notes}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    - {doctorNotes.doctor || 'N/A'} ({doctorNotes.date})
                  </Text>
                </Box>
                <HStack spacing={1}>
                  <Tooltip label="Edit notes" placement="top">
                    <IconButton
                      icon={<Edit2 size={16} />}
                      size="sm"
                      colorScheme="blue"
                      variant="ghost"
                      onClick={() => setEditingDoctorNotes(true)}
                      aria-label="Edit doctor notes"
                    />
                  </Tooltip>
                  <Tooltip label="Delete notes" placement="top">
                    <IconButton
                      icon={<Trash2 size={16} />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={handleDeleteDoctorNotes}
                      aria-label="Delete doctor notes"
                    />
                  </Tooltip>
                </HStack>
              </HStack>
            </Box>
          ) : (
            <Box p={4} bg="gray.50" borderRadius="md" textAlign="center">
              <Text color="gray.500" fontSize="sm" mb={2}>
                No doctor's notes available
              </Text>
              <Button
                size="sm"
                colorScheme="blue"
                leftIcon={<Plus size={16} />}
                onClick={() => setEditingDoctorNotes(true)}
              >
                Add Notes
              </Button>
            </Box>
          )}
        </CardBody>
      </Card>

      {/* Prescription Modal */}
      {selectedPrescriptionPatient && (
        <PrescriptionModal
          isOpen={isPrescriptionModalOpen}
          onClose={onPrescriptionModalClose}
          patient={selectedPrescriptionPatient}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={3} align="start">
              <Text>
                Are you sure you want to delete this{' '}
                {deleteTarget.type === 'pastTreatment' && 'past treatment'}
                {deleteTarget.type === 'currentTreatment' && 'current treatment'}
                {deleteTarget.type === 'doctorNotes' && 'doctor notes'}?
              </Text>
              <Text fontSize="sm" color="red.500">
                This action cannot be undone.
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onDeleteModalClose}>
              Cancel
            </Button>
            <Button colorScheme="red" leftIcon={<Trash2 size={18} />} onClick={confirmDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PatientDetails;
