import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Button,
  HStack,
  VStack,
  Badge,
  Avatar,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Checkbox,
  Flex,
  SimpleGrid,
  TableContainer,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Textarea,
  NumberInput,
  NumberInputField,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from '@chakra-ui/react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import axios from 'axios';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit3,
  MoreVertical,
  LogOut,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  FileText,
  Activity,
  Clipboard,
  FilePlus,
  Printer,
  Home,
  User,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Stethoscope,
  Calendar,
  FileSpreadsheet,
  Download,
  Upload,
  X
} from 'lucide-react';
import PrescriptionModal from '../AyurvedicPrescription/PrescriptionModal';

const API_URL = (import.meta.env.VITE_API_URL || 'https://shatayu-backend.onrender.com') + '/api/ipd/patients';

// Simple in-memory medicine catalogue used to suggest medicines
// for Panchkarma and therapies when detailed medicine data is
// not yet coming from the backend.
const MEDICINE_DATABASE = [
  { id: 1, name: 'Triphala Churna', category: 'general', type: 'powder' },
  { id: 2, name: 'Ashwagandha Tablet', category: 'general', type: 'tablet' },
  { id: 3, name: 'Vamana Decoction', category: 'vamana', type: 'decoction' },
  { id: 4, name: 'Virechana Powder', category: 'virechana', type: 'powder' },
  { id: 5, name: 'Basti Oil', category: 'basti', type: 'oil' },
  { id: 6, name: 'Nasya Oil', category: 'nasya', type: 'oil' },
  { id: 7, name: 'Abhyanga Oil', category: 'external', type: 'oil' }
];

// ...existing code...
// No mock medicine database

const IPD = () => {
  // State for new patient form
  const [newPatient, setNewPatient] = useState({
    regNo: '',
    name: '',
    age: '',
    gender: '',
    phone: '',
    prakriti: '',
    dosha: '',
    ayurvedicDiagnosis: '',
    therapy: '',
    panchakarma: '',
    diet: '',
    yoga: '',
    status: 'Active Treatment'
  });
  const title = "Ayurvedic Clinic - IPD Management";
  
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Medicine management states
  const [medicineSearchTerm, setMedicineSearchTerm] = useState({});
  const [selectedMedicines, setSelectedMedicines] = useState({});
  const [medicineSearchResults, setMedicineSearchResults] = useState({});
  const [showMedicineDropdown, setShowMedicineDropdown] = useState({});

  // Progress Chart states
  const [progressNotes, setProgressNotes] = useState({});
  const [currentProgressDate, setCurrentProgressDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTreatment, setSelectedTreatment] = useState('');
  const [customTreatment, setCustomTreatment] = useState('');
  const [progressText, setProgressText] = useState('');
  const [treatmentDates, setTreatmentDates] = useState([]);
  const [availableTreatments, setAvailableTreatments] = useState([]);
  const [isCustomDate, setIsCustomDate] = useState(false);
  const [isCustomTreatment, setIsCustomTreatment] = useState(false);

  // Modal controls
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDischargeOpen, onOpen: onDischargeOpen, onClose: onDischargeClose } = useDisclosure();
  const { isOpen: isTreatmentChartOpen, onOpen: onTreatmentChartOpen, onClose: onTreatmentChartClose } = useDisclosure();
  const { isOpen: isProgressNotesOpen, onOpen: onProgressNotesOpen, onClose: onProgressNotesClose } = useDisclosure();
  const { isOpen: isMedicineChartOpen, onOpen: onMedicineChartOpen, onClose: onMedicineChartClose } = useDisclosure();
  const { isOpen: isPrescriptionOpen, onOpen: onPrescriptionOpen, onClose: onPrescriptionClose } = useDisclosure();
  const { isOpen: isExportOpen, onOpen: onExportOpen, onClose: onExportClose } = useDisclosure();

  const toast = useToast();

  // Patients data with comprehensive mock data
  // Patients state
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Function to generate the next IPD number in format IP00001, IP00002, etc.
  const generateNextIPDNumber = () => {
    if (patients.length === 0) {
      return 'IP00001';
    }
    
    // Find the highest existing IPD number
    let maxNumber = 0;
    patients.forEach(patient => {
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

  // Fetch patients data from API and localStorage
  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        // First load from localStorage (transferred from OPD)
        const localStoragePatients = JSON.parse(localStorage.getItem('ipdPatients') || '[]');

        // Then try to load from API with auth token (same as OPD)
        try {
          const token = localStorage.getItem('authToken');
          const response = await axios.get(API_URL, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          });

          const payload = response.data;
          const rawApiPatients = Array.isArray(payload) ? payload : (payload?.data || []);

          // Normalize D1 rows (snake_case) into the shape IPD.jsx expects
          const apiPatients = rawApiPatients.map(row => ({
            id: row.id,
            regNo: row.reg_no?.toString() || '',
            caseId: row.case_id?.toString() || '',
            name: row.name || '',
            age: row.age || '',
            gender: row.gender || '',
            phone: row.phone || '',
            admissionDate: row.admission_date || '',
            room: row.room || '',
            doctor: row.doctor || '',
            condition: row.condition || '',
            prakriti: row.prakriti || '',
            dosha: row.dosha || '',
            ayurvedicDiagnosis: row.ayurvedic_diagnosis || '',
            therapy: row.therapy || '',
            panchakarma: row.panchakarma || '',
            treatmentDuration: row.treatment_duration || '',
            diet: row.diet || '',
            yoga: row.yoga || '',
            status: row.status || 'Active',
            panchkarmas: row.panchkarmas ? JSON.parse(row.panchkarmas) : [],
            progressNotesFromDb: row.progress_notes ? JSON.parse(row.progress_notes) : [],
            medicinesFromDb: row.medicines ? JSON.parse(row.medicines) : []
          }));

          // Merge API patients with any localStorage transfers from OPD, avoiding duplicates by caseId/regNo
          const allPatients = [...apiPatients];

          localStoragePatients.forEach(localPatient => {
            const exists = allPatients.find(p =>
              (p.caseId && localPatient.caseId && p.caseId === localPatient.caseId) ||
              (p.regNo && localPatient.regNo && p.regNo === localPatient.regNo)
            );
            if (!exists) {
              allPatients.push(localPatient);
            }
          });

          setPatients(allPatients);
        } catch (apiErr) {
          // If API fails, merge localStorage with mock data
          console.warn('API failed, using localStorage and mock data:', apiErr);
          // Fallback: only localStorage-based patients
          const mergedData = [];
          localStoragePatients.forEach(localPatient => {
            if (!mergedData.find(p => p.caseId === localPatient.caseId || p.regNo === localPatient.regNo)) {
              mergedData.push(localPatient);
            }
          });

          setPatients(mergedData);
        }
        
        setError('');
      } catch (err) {
        setError('Failed to load IPD patients');
        // Keep mock data even if everything fails
        console.error('All data loading failed, keeping mock data:', err);
      }
      setLoading(false);
    };

    fetchPatients();

    // Listen for localStorage changes (when OPD transfers patients)
    const handleStorageChange = (e) => {
      if (e.key === 'ipdPatients') {
        const updatedPatients = JSON.parse(e.newValue || '[]');
        setPatients(prev => {
          // Merge with existing patients, avoiding duplicates
          const existingCaseIds = prev.map(p => p.caseId || p.regNo);
          const newPatients = updatedPatients.filter(p => !existingCaseIds.includes(p.caseId || p.regNo));
          return [...prev, ...newPatients];
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Empty dependency array to run only once

  // Add patient (D1-backed)
  const addPatient = async (patientData) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Missing auth token');

      const response = await axios.post(API_URL, patientData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const newId = response.data?.id;
      const newPatient = { ...patientData, id: newId || patientData.id };

      setPatients(prev => [...prev, newPatient]);
      toast({ title: 'IPD patient stored in database', status: 'success' });
    } catch (err) {
      console.error('Failed to add IPD patient to DB, keeping local only:', err);
      // Fallback: keep patient only in local state
      setPatients(prev => [...prev, patientData]);
      toast({ title: 'Patient added locally (DB error)', status: 'warning' });
    }
  };

  // Update patient (D1-backed)
  const updatePatient = async (id, patientData) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Missing auth token');

      await axios.put(`${API_URL}/${id}`, patientData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPatients(prev => prev.map(p => (p.id === id ? { ...p, ...patientData } : p)));
      toast({ title: 'Patient updated', status: 'success' });
    } catch (err) {
      console.error('Failed to update IPD patient in DB, keeping local change only:', err);
      // Still update local state so UI reflects the change
      setPatients(prev => prev.map(p => (p.id === id ? { ...p, ...patientData } : p)));
      toast({ title: 'Patient updated locally (DB error)', status: 'warning' });
    }
  };

  // Delete patient (D1-backed)
  const deletePatient = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Missing auth token');

      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPatients(prev => prev.filter(p => p.id !== id));
      toast({ title: 'Patient deleted', status: 'info' });
    } catch (err) {
      console.error('Failed to delete IPD patient from DB:', err);
      toast({ title: 'Failed to delete patient', status: 'error' });
    }
  };

  // Auto-fill functionality
  const [autoFillSuggestions, setAutoFillSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Function to search for existing patient by name or registration number
  const searchPatientRecord = (searchValue) => {
    if (!searchValue || searchValue.length < 2) {
      setAutoFillSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const matches = patients.filter(patient => 
      patient.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      patient.regNo.toLowerCase().includes(searchValue.toLowerCase())
    );

    setAutoFillSuggestions(matches);
    setShowSuggestions(matches.length > 0);
  };

  // Function to auto-fill form with selected patient data
  const autoFillPatientData = (selectedPatient) => {
    // Generate new numerical registration number for IPD admission
    const newRegNo = String(Date.now()).slice(-8); // 8-digit numerical ID
    
    setNewPatient({
      regNo: newRegNo,
      name: selectedPatient.name,
      age: selectedPatient.age,
      gender: selectedPatient.gender,
      phone: selectedPatient.phone,
      prakriti: selectedPatient.prakriti || '',
      dosha: selectedPatient.dosha || '',
      ayurvedicDiagnosis: selectedPatient.ayurvedicDiagnosis || '',
      therapy: selectedPatient.therapy || '',
      panchakarma: selectedPatient.panchakarma || '',
      diet: selectedPatient.diet || '',
      yoga: selectedPatient.yoga || '',
      status: 'Active'
    });

    setShowSuggestions(false);
    setAutoFillSuggestions([]);

    toast({
      title: "Patient Data Auto-Filled",
      description: `Information for ${selectedPatient.name} has been populated. New IPD registration number: ${newRegNo}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Function to handle name input changes with auto-fill search
  const handleNameChange = (value) => {
    setNewPatient(prev => ({ ...prev, name: value }));
    searchPatientRecord(value);
  };

  // Function to handle registration number input changes with auto-fill search
  const handleRegNoChange = (value) => {
    // Allow only numerical values
    const numericValue = value.replace(/[^0-9]/g, '');
    setNewPatient(prev => ({ ...prev, regNo: numericValue }));
    searchPatientRecord(numericValue);
  };

  // Custom close handler to clear suggestions
  const handleModalClose = () => {
    setShowSuggestions(false);
    setAutoFillSuggestions([]);
    setNewPatient({
      regNo: '',
      name: '',
      age: '',
      gender: '',
      phone: '',
      prakriti: '',
      dosha: '',
      ayurvedicDiagnosis: '',
      therapy: '',
      panchakarma: '',
      diet: '',
      yoga: '',
      status: 'Active'
    });
    onAddClose();
  };

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Tab state: 0 = Current IPD, 1 = Old IPD
  const [ipdTab, setIpdTab] = useState(0);

  // Filter logic for tabs
  const currentIpdStatuses = ['active', 'active treatment', 'under treatment', 'critical care', 'admitted'];
  const oldIpdStatuses = ['completed', 'treatment completed', 'cancelled', 'discharged'];

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.regNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.ayurvedicDiagnosis.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesTab = false;
    if (ipdTab === 0) {
      matchesTab = currentIpdStatuses.includes(patient.status.toLowerCase());
    } else {
      matchesTab = oldIpdStatuses.includes(patient.status.toLowerCase());
    }

    return matchesSearch && matchesTab;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPatients = filteredPatients.slice(startIndex, endIndex);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedPatients(currentPatients.map(p => p.id));
    } else {
      setSelectedPatients([]);
    }
  };

  const handleSelectPatient = (patientId, checked) => {
    if (checked) {
      setSelectedPatients(prev => [...prev, patientId]);
    } else {
      setSelectedPatients(prev => prev.filter(id => id !== patientId));
    }
  };

  const handleView = (patient) => {
    setSelectedPatient(patient);
    onViewOpen();
  };

  const handleEdit = (patient) => {
    setSelectedPatient(patient);
    // Ensure all fields have default values to prevent undefined errors
    setNewPatient({
      regNo: patient.regNo || '',
      name: patient.name || '',
      age: patient.age || '',
      gender: patient.gender || '',
      phone: patient.phone || '',
      prakriti: patient.prakriti || '',
      dosha: patient.dosha || '',
      ayurvedicDiagnosis: patient.ayurvedicDiagnosis || '',
      therapy: patient.therapy || '',
      panchakarma: patient.panchakarma || '',
      status: patient.status || 'Active',
      room: patient.room || '',
      doctor: patient.doctor || '',
      treatmentDuration: patient.treatmentDuration || '',
      condition: patient.condition || ''
    });
    onEditOpen();
  };

  // Treatment status change handlers
  const handleStatusChange = (patient, newStatus) => {
    const updatedPatient = { ...patient, status: newStatus };
    setPatients(prev => prev.map(p => (p.id === patient.id ? updatedPatient : p)));

    if (patient.id) {
      updatePatient(patient.id, { status: newStatus });
    }

    toast({
      title: 'Treatment Status Updated',
      description: `${patient.name}'s treatment status changed to ${newStatus}`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleCancelTreatment = (patient) => {
    handleStatusChange(patient, 'Cancelled');
  };

  const handleActivateTreatment = (patient) => {
    handleStatusChange(patient, 'Active');
  };

  // Medicine search and management functions
  const searchMedicines = (searchTerm, category = 'all') => {
    if (!searchTerm || searchTerm.length < 2) {
      return [];
    }
    
    return MEDICINE_DATABASE.filter(medicine => {
      const nameMatch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase());
      const categoryMatch = category === 'all' || medicine.category === category;
      return nameMatch && categoryMatch;
    }).slice(0, 10); // Limit to 10 results
  };

  const handleMedicineSearch = (subcategoryKey, searchTerm) => {
    setMedicineSearchTerm(prev => ({ ...prev, [subcategoryKey]: searchTerm }));
    
    if (searchTerm.length >= 2) {
      const results = searchMedicines(searchTerm);
      setMedicineSearchResults(prev => ({ ...prev, [subcategoryKey]: results }));
      setShowMedicineDropdown(prev => ({ ...prev, [subcategoryKey]: true }));
    } else {
      setShowMedicineDropdown(prev => ({ ...prev, [subcategoryKey]: false }));
    }
  };

  const addMedicineToSubcategory = async (subcategoryKey, medicine) => {
    const medicineEntry = {
      id: Date.now(),
      name: medicine.name || medicineSearchTerm[subcategoryKey],
      type: medicine.type || 'custom',
      dosage: medicine.dosage || '',
      timing: '',
      duration: '',
      notes: ''
    };

    setSelectedMedicines(prev => ({
      ...prev,
      [subcategoryKey]: [...(prev[subcategoryKey] || []), medicineEntry]
    }));

    // Send to backend
    if (selectedPatient) {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No auth token found');
        }

        const baseURL = import.meta.env.VITE_API_URL || 'https://shatayu-backend.onrender.com';
        await axios.post(
          `${baseURL}/api/ipd/patients/${selectedPatient.id}/medicine`,
          {
            patientId: selectedPatient.id,
            medicine: medicineEntry
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        toast({ title: 'Medicine added to patient', status: 'success' });
      } catch (err) {
        toast({ title: 'Failed to add medicine', status: 'error' });
      }
    }

    // Clear search
    setMedicineSearchTerm(prev => ({ ...prev, [subcategoryKey]: '' }));
    setShowMedicineDropdown(prev => ({ ...prev, [subcategoryKey]: false }));
  };

  const removeMedicineFromSubcategory = (subcategoryKey, medicineId) => {
    setSelectedMedicines(prev => ({
      ...prev,
      [subcategoryKey]: prev[subcategoryKey]?.filter(med => med.id !== medicineId) || []
    }));
  };

  const updateMedicineDetails = (subcategoryKey, medicineId, field, value) => {
    setSelectedMedicines(prev => ({
      ...prev,
      [subcategoryKey]: prev[subcategoryKey]?.map(med => 
        med.id === medicineId ? { ...med, [field]: value } : med
      ) || []
    }));
  };

  // Update medicines directly from the Medicine Chart view
  const updateMedicineFromChart = (medicine, field, value) => {
    if (!medicine || !medicine.treatmentType || !medicine.id) return;

    // Only update if this medicine actually exists in selectedMedicines
    const subcategoryKey = medicine.treatmentType;
    const hasBackingEntry = selectedMedicines[subcategoryKey]?.some(m => m.id === medicine.id);
    if (!hasBackingEntry) return;

    updateMedicineDetails(subcategoryKey, medicine.id, field, value);
  };

  // Remove medicines directly from the Medicine Chart view
  const removeMedicineFromChart = (medicine) => {
    if (!medicine || !medicine.treatmentType || !medicine.id) return;

    const subcategoryKey = medicine.treatmentType;
    const hasBackingEntry = selectedMedicines[subcategoryKey]?.some(m => m.id === medicine.id);
    if (!hasBackingEntry) return;

    removeMedicineFromSubcategory(subcategoryKey, medicine.id);
  };

  // Progress Chart Management Functions
  const generateTreatmentDates = (patient) => {
    if (!patient || !patient.admissionDate) return [];
    
    const admissionDate = new Date(patient.admissionDate);
    const dates = [];
    
    // Generate dates for the treatment duration (example: 21 days)
    const treatmentDuration = patient.treatmentDuration ? parseInt(patient.treatmentDuration) : 21;
    
    for (let i = 0; i < treatmentDuration; i++) {
      const currentDate = new Date(admissionDate);
      currentDate.setDate(currentDate.getDate() + i);
      dates.push({
        date: currentDate.toISOString().split('T')[0],
        day: i + 1,
        dayName: currentDate.toLocaleDateString('en-US', { weekday: 'short' })
      });
    }
    
    return dates;
  };

  const generateAvailableTreatments = (patient) => {
    if (!patient) return [];
    
    const treatments = [];
    
    // Add general treatments
    if (patient.therapy) {
      const therapies = patient.therapy.split('+').map(t => t.trim());
      therapies.forEach(therapy => {
        treatments.push({
          id: therapy.toLowerCase().replace(/\s+/g, '-'),
          name: therapy,
          category: 'External Therapy'
        });
      });
    }
    
    // Add Panchakarma treatments
    if (patient.panchkarmas && patient.panchkarmas.length > 0) {
      patient.panchkarmas.forEach(panchkarma => {
        const categoryName = typeof panchkarma.category === 'string'
          ? panchkarma.category.trim()
          : (panchkarma.category?.name || '').trim();

        if (categoryName) {
          treatments.push({
            id: categoryName.toLowerCase().replace(/\s+/g, '-'),
            name: categoryName,
            category: 'Panchakarma'
          });
        }
        
        // Add subcategories
        if (Array.isArray(panchkarma.subcategories)) {
          panchkarma.subcategories.forEach(sub => {
            const subName = typeof sub === 'string'
              ? sub.trim()
              : (sub?.name || '').trim();

            if (!subName || !categoryName) return;

            treatments.push({
              id: `${categoryName.toLowerCase().replace(/\s+/g, '-')}-${subName.toLowerCase().replace(/\s+/g, '-')}`,
              name: `${categoryName} - ${subName}`,
              category: 'Panchakarma Subcategory'
            });
          });
        }
      });
    } else if (patient.panchakarma) {
      // Handle single panchakarma string
      const panchkarmas = patient.panchakarma.split(',').map(p => p.trim());
      panchkarmas.forEach(pk => {
        treatments.push({
          id: pk.toLowerCase().replace(/\s+/g, '-'),
          name: pk,
          category: 'Panchakarma'
        });
      });
    }
    
    // Add medicine administration
    treatments.push(
      { id: 'medicine-administration', name: 'Medicine Administration', category: 'Medication' },
      { id: 'diet-counseling', name: 'Diet Counseling', category: 'Lifestyle' },
      { id: 'yoga-session', name: 'Yoga Session', category: 'Lifestyle' },
      { id: 'consultation', name: 'Doctor Consultation', category: 'Consultation' },
      { id: 'assessment', name: 'Progress Assessment', category: 'Assessment' }
    );
    
    return treatments;
  };

  const saveProgressNote = async () => {
    const finalTreatment = isCustomTreatment ? customTreatment : selectedTreatment;
    const finalTreatmentName = isCustomTreatment ? customTreatment : 
      (availableTreatments.find(t => t.id === selectedTreatment)?.name || selectedTreatment);

    if (!selectedPatient || !currentProgressDate || !finalTreatment || !progressText.trim()) {
      toast({
        title: 'Incomplete Information',
        description: 'Please fill all fields before saving the progress note.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const noteId = `${selectedPatient.id}-${currentProgressDate}-${finalTreatment}-${Date.now()}`;
    const newNote = {
      id: noteId,
      patientId: selectedPatient.id,
      date: currentProgressDate,
      treatment: finalTreatment,
      treatmentName: finalTreatmentName,
      progress: progressText,
      timestamp: new Date().toISOString(),
      doctor: selectedPatient.doctor || 'Current Doctor',
      isCustomTreatment: isCustomTreatment
    };

    // Send to backend
    try {
  const baseURL = import.meta.env.VITE_API_URL || 'https://shatayu-backend.onrender.com';
  await axios.post(`${baseURL}/api/ipd/patients/${selectedPatient.id}/progress-note`, {
        patientId: selectedPatient.id,
        note: newNote
      });
      toast({ title: 'Progress Note Saved', status: 'success' });
    } catch (err) {
      toast({ title: 'Failed to save progress note', status: 'error' });
    }

    setProgressNotes(prev => ({
      ...prev,
      [selectedPatient.id]: [...(prev[selectedPatient.id] || []), newNote]
    }));

    // Clear form
    setProgressText('');
    setSelectedTreatment('');
    setCustomTreatment('');
    setIsCustomTreatment(false);
  };

  const getProgressNotesForPatient = async (patientId) => {
    // Skip API call for mock patients (those with string IDs or high numbers)
    if (!patientId || typeof patientId === 'string' || patientId > 1000) {
      return progressNotes[patientId] || [];
    }
    
    try {
      const baseURL = import.meta.env.VITE_API_URL || 'https://shatayu-backend.onrender.com';
      const response = await axios.get(`${baseURL}/api/ipd/patients/${patientId}/progress-notes`);
      setProgressNotes(prev => ({ ...prev, [patientId]: response.data }));
      return response.data;
    } catch (err) {
      // If API fails, return local notes without showing error for mock patients
      console.warn('Failed to fetch progress notes for patient', patientId, err.message);
      return progressNotes[patientId] || [];
    }
  };

  const getProgressNotesByDate = (patientId, date) => {
    const notes = getProgressNotesForPatient(patientId);
    return notes.filter(note => note.date === date);
  };

  const deleteProgressNote = (noteId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this progress note?');
    if (confirmDelete) {
      setProgressNotes(prev => {
        const updatedNotes = { ...prev };
        Object.keys(updatedNotes).forEach(patientId => {
          updatedNotes[patientId] = updatedNotes[patientId].filter(note => note.id !== noteId);
        });
        return updatedNotes;
      });

      toast({
        title: 'Progress Note Deleted',
        description: 'The progress note has been successfully deleted.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Initialize treatment data when patient is selected for progress notes
  useEffect(() => {
    if (selectedPatient && isProgressNotesOpen) {
      const dates = generateTreatmentDates(selectedPatient);
      const treatments = generateAvailableTreatments(selectedPatient);
      setTreatmentDates(dates);
      setAvailableTreatments(treatments);
      
      // Auto-set today's date if it's within treatment period
      const today = new Date().toISOString().split('T')[0];
      const todayInTreatment = dates.find(d => d.date === today);
      if (todayInTreatment) {
        setCurrentProgressDate(today);
        setIsCustomDate(false);
      } else {
        // Set to the next available treatment date
        const nextDate = dates.find(d => new Date(d.date) >= new Date()) || dates[0];
        if (nextDate) {
          setCurrentProgressDate(nextDate.date);
          setIsCustomDate(false);
        }
      }
      
      // Auto-select most common treatment if available
      if (treatments.length > 0) {
        const primaryTreatment = treatments.find(t => t.category === 'Panchakarma') || treatments[0];
        setSelectedTreatment(primaryTreatment.id);
        setIsCustomTreatment(false);
      }
    }
  }, [selectedPatient, isProgressNotesOpen]);

  // Function to get treatment-wise medicines for the patient
  const getTreatmentWiseMedicines = (patient) => {
    if (!patient) return [];
    
    const treatmentMedicines = [];
    
    // Get medicines from treatment chart (if saved)
    if (selectedMedicines && Object.keys(selectedMedicines).length > 0) {
      Object.keys(selectedMedicines).forEach(subcategoryKey => {
        const medicines = selectedMedicines[subcategoryKey] || [];
        medicines.forEach(medicine => {
          treatmentMedicines.push({
            ...medicine,
            treatmentType: subcategoryKey,
            treatmentName: getSubcategoryDisplayName(subcategoryKey),
            category: getCategoryFromSubcategory(subcategoryKey)
          });
        });
      });
    } else {
      // Generate sample medicines based on patient's treatments
      if (patient.panchkarmas && patient.panchkarmas.length > 0) {
        patient.panchkarmas.forEach(panchkarma => {
          const categoryMedicines = getMedicinesForCategory(panchkarma.category);
          categoryMedicines.forEach(medicine => {
            treatmentMedicines.push({
              ...medicine,
              treatmentType: panchkarma.category.toLowerCase(),
              treatmentName: panchkarma.category,
              category: 'Panchakarma',
              status: 'Active'
            });
          });
        });
      } else if (patient.panchakarma && patient.panchakarma !== 'None') {
        // Handle single panchakarma string
        const panchkarmas = patient.panchakarma.split(',').map(p => p.trim());
        panchkarmas.forEach(pk => {
          const categoryMedicines = getMedicinesForCategory(pk);
          categoryMedicines.forEach(medicine => {
            treatmentMedicines.push({
              ...medicine,
              treatmentType: pk.toLowerCase().replace(/\s+/g, '-'),
              treatmentName: pk,
              category: 'Panchakarma',
              status: 'Active'
            });
          });
        });
      }
      
      // Add therapy-based medicines
      if (patient.therapy) {
        const therapies = patient.therapy.split('+').map(t => t.trim());
        therapies.forEach(therapy => {
          const therapyMedicines = getMedicinesForTherapy(therapy);
          therapyMedicines.forEach(medicine => {
            treatmentMedicines.push({
              ...medicine,
              treatmentType: therapy.toLowerCase().replace(/\s+/g, '-'),
              treatmentName: therapy,
              category: 'External Therapy',
              status: 'Active'
            });
          });
        });
      }
    }
    
    return treatmentMedicines;
  };

  const getSubcategoryDisplayName = (subcategoryKey) => {
    const keyMap = {
      'vamana-purva': 'Vamana - Purva Karma',
      'vamana-pradhana': 'Vamana - Pradhana Karma',
      'vamana-pashchat': 'Vamana - Pashchat Karma',
      'virechana-purva': 'Virechana - Purva Karma',
      'virechana-pradhana': 'Virechana - Pradhana Karma',
      'virechana-pashchat': 'Virechana - Pashchat Karma',
      'basti-niruha': 'Basti - Niruha',
      'basti-anuvasana': 'Basti - Anuvasana',
      'nasya-rechana': 'Nasya - Rechana',
      'nasya-brihana': 'Nasya - Brihana',
      'nasya-shamana': 'Nasya - Shamana',
      'raktamokshana-jalauka': 'Raktamokshana - Jalauka',
      'raktamokshana-prachhana': 'Raktamokshana - Prachhana'
    };
    return keyMap[subcategoryKey] || subcategoryKey;
  };

  const getCategoryFromSubcategory = (subcategoryKey) => {
    if (subcategoryKey.includes('vamana')) return 'Vamana';
    if (subcategoryKey.includes('virechana')) return 'Virechana';
    if (subcategoryKey.includes('basti')) return 'Basti';
    if (subcategoryKey.includes('nasya')) return 'Nasya';
    if (subcategoryKey.includes('raktamokshana')) return 'Raktamokshana';
    return 'General';
  };

  const getMedicinesForCategory = (category) => {
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('vamana')) {
      return MEDICINE_DATABASE.filter(m => m.category === 'vamana' || m.category === 'general').slice(0, 3);
    } else if (categoryLower.includes('virechana')) {
      return MEDICINE_DATABASE.filter(m => m.category === 'virechana' || m.category === 'general').slice(0, 3);
    } else if (categoryLower.includes('basti')) {
      return MEDICINE_DATABASE.filter(m => m.category === 'basti' || m.category === 'general').slice(0, 4);
    } else if (categoryLower.includes('nasya')) {
      return MEDICINE_DATABASE.filter(m => m.category === 'nasya' || m.category === 'general').slice(0, 2);
    } else {
      return MEDICINE_DATABASE.filter(m => m.category === 'general').slice(0, 2);
    }
  };

  const getMedicinesForTherapy = (therapy) => {
    const therapyLower = therapy.toLowerCase();
    if (therapyLower.includes('abhyanga') || therapyLower.includes('massage')) {
      return MEDICINE_DATABASE.filter(m => m.category === 'external' || m.type === 'oil').slice(0, 2);
    } else if (therapyLower.includes('swedana') || therapyLower.includes('steam')) {
      return MEDICINE_DATABASE.filter(m => m.category === 'external').slice(0, 1);
    } else if (therapyLower.includes('shirodhara')) {
      return MEDICINE_DATABASE.filter(m => m.type === 'oil' && m.category === 'external').slice(0, 2);
    } else {
      return MEDICINE_DATABASE.filter(m => m.category === 'external').slice(0, 1);
    }
  };

  const handleAddPatient = async () => {
    // Generate numerical registration number if not provided
    let finalRegNo = newPatient.regNo;
    if (!finalRegNo) {
      finalRegNo = String(Date.now()).slice(-8); // 8-digit numerical ID
    }
    
    // Generate new IPD number
    const newIPDNumber = generateNextIPDNumber();

    const basePatient = {
      ...newPatient,
      regNo: finalRegNo,
      caseId: newIPDNumber, // IPD number stored as caseId
      admissionDate: new Date().toISOString().split('T')[0],
      room: newPatient.room || `Room ${101 + patients.length}`,
      doctor: newPatient.doctor || 'Dr. Ayurveda Specialist',
      condition: newPatient.ayurvedicDiagnosis || 'General Treatment'
    };

    // Persist to D1 via backend; addPatient will also push into local state
    await addPatient(basePatient);
    setNewPatient({
      regNo: '',
      name: '',
      age: '',
      gender: '',
      phone: '',
      prakriti: '',
      dosha: '',
      ayurvedicDiagnosis: '',
      therapy: '',
      panchakarma: '',
      diet: '',
      yoga: '',
      status: 'Active'
    });
    
    toast({
      title: 'Patient Added Successfully',
      description: `${newPatient.name} has been admitted to IPD with IPD Number: ${newIPDNumber} and registration number: ${finalRegNo}`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    
    onAddClose();
  };

  const handleUpdatePatient = () => {
    if (!selectedPatient) return;
    
    const updatedPatient = {
      ...selectedPatient,
      ...newPatient,
      id: selectedPatient.id, // Preserve original ID
      caseId: selectedPatient.caseId, // Preserve original case ID
      admissionDate: selectedPatient.admissionDate, // Preserve admission date
      // Allow updating room, doctor, treatmentDuration, and condition
      room: newPatient.room || selectedPatient.room,
      doctor: newPatient.doctor || selectedPatient.doctor,
      treatmentDuration: newPatient.treatmentDuration || selectedPatient.treatmentDuration,
      condition: newPatient.condition || selectedPatient.condition
    };
    
    setPatients(prev => prev.map(p => p.id === selectedPatient.id ? updatedPatient : p));
    
    // Clear form
    setNewPatient({
      regNo: '',
      name: '',
      age: '',
      gender: '',
      phone: '',
      prakriti: '',
      dosha: '',
      ayurvedicDiagnosis: '',
      therapy: '',
      panchakarma: '',
      status: 'Active Treatment',
      room: '',
      doctor: '',
      treatmentDuration: '',
      condition: ''
    });
    setSelectedPatient(null);
    
    toast({
      title: "Patient Updated Successfully",
      description: `${updatedPatient.name}'s information has been updated`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    
    onEditClose();
  };

  // Effect to close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSuggestions && !event.target.closest('.suggestions-container')) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSuggestions]);

  // Additional handler functions for IPD actions
  const handleViewTreatmentChart = (patient) => {
    setSelectedPatient(patient);
    onTreatmentChartOpen();
  };

  const handleProgressNotes = (patient) => {
    setSelectedPatient(patient);
    onProgressNotesOpen();
  };

  const handleMedicineChart = (patient) => {
    setSelectedPatient(patient);
    onMedicineChartOpen();
  };

  const handleAddPrescription = (patient) => {
    setSelectedPatient(patient);
    onPrescriptionOpen();
  };

  const handleCompleteToken = (patient) => {
    const confirmComplete = window.confirm(`Are you sure you want to complete treatment for ${patient.name}? This will mark the patient as discharged.`);
    if (confirmComplete) {
      // Update patient status to completed
    const confirmComplete = window.confirm(`Are you sure you want to complete treatment for ${patient.name}? This will change the treatment status to Completed.`);
    if (confirmComplete) {
      const updatedPatients = patients.map(p => 
        p.id === patient.id ? { ...p, status: 'Completed' } : p
      );
      setPatients(updatedPatients);
      // Optionally, show a toast instead of alert
      toast({
        title: 'Treatment Completed',
        description: `${patient.name}'s treatment has been marked as completed.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right'
      });
    }
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'blue';
      case 'cancelled':
        return 'red';
      case 'completed':
        return 'green';
      // Legacy status support for backward compatibility
      case 'active treatment':
        return 'blue';
      case 'under treatment':
        return 'blue';
      case 'critical care':
        return 'orange';
      case 'treatment completed':
        return 'green';
      case 'recovery':
        return 'green';
      default:
        return 'blue';
    }
  };

  const getDoshaColor = (dosha) => {
    if (dosha.includes('Vata')) return 'purple';
    if (dosha.includes('Pitta')) return 'orange';
    if (dosha.includes('Kapha')) return 'green';
    return 'gray';
  };

  // Comprehensive Export Function
  const handleExport = async (format) => {
    try {
      const exportData = filteredPatients;
      const timestamp = new Date().toLocaleDateString('en-GB');
      
      // Calculate statistics
      const totalPatients = exportData.length;
      const activePatients = exportData.filter(p => p.status === 'Active Treatment').length;
      const underTreatment = exportData.filter(p => p.status === 'Under Treatment').length;
      const recovery = exportData.filter(p => p.status === 'Recovery').length;
      const completed = exportData.filter(p => p.status === 'Treatment Completed').length;

      if (format === 'pdf') {
        const doc = new jsPDF('landscape');
        
        // Header
        doc.setFontSize(20);
        doc.setTextColor(44, 82, 130);
        doc.text('Ayurvedic IPD Management Report', 20, 25);
        
        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text(`Generated on: ${timestamp}`, 20, 35);
        doc.text(`Total Records: ${totalPatients}`, 20, 45);
        
        // Statistics
        doc.setFontSize(14);
        doc.setTextColor(44, 82, 130);
        doc.text('Summary Statistics:', 20, 60);
        
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Active Treatment: ${activePatients}`, 20, 70);
        doc.text(`Under Treatment: ${underTreatment}`, 80, 70);
        doc.text(`Recovery: ${recovery}`, 140, 70);
        doc.text(`Completed: ${completed}`, 200, 70);
        
        // Table
        const tableColumns = [
          'Reg No', 'Name', 'Age', 'Gender', 'Phone', 
          'Prakriti', 'Dosha', 'Diagnosis', 'Therapy', 
          'Panchakarma'
        ];
        
        const tableRows = exportData.map(patient => [
          patient.regNo,
          patient.name,
          patient.age.toString(),
          patient.gender,
          patient.phone,
          patient.prakriti,
          patient.dosha,
          patient.ayurvedicDiagnosis,
          patient.therapy,
          patient.panchakarma
        ]);
        
        doc.autoTable({
          head: [tableColumns],
          body: tableRows,
          startY: 85,
          styles: {
            fontSize: 8,
            cellPadding: 2,
          },
          headStyles: {
            fillColor: [44, 82, 130],
            textColor: 255,
            fontStyle: 'bold'
          },
          alternateRowStyles: {
            fillColor: [240, 248, 255]
          },
          columnStyles: {
            0: { cellWidth: 15 },  // Reg No
            1: { cellWidth: 25 },  // Name
            2: { cellWidth: 10 },  // Age
            3: { cellWidth: 15 },  // Gender
            4: { cellWidth: 20 },  // Phone
            5: { cellWidth: 20 },  // Prakriti
            6: { cellWidth: 25 },  // Dosha
            7: { cellWidth: 30 },  // Diagnosis
            8: { cellWidth: 25 },  // Therapy
            9: { cellWidth: 25 }   // Panchakarma
          }
        });
        
        doc.save(`Ayurvedic_IPD_Report_${timestamp.replace(/\//g, '-')}.pdf`);
        
      } else if (format === 'excel') {
        const workbook = XLSX.utils.book_new();
        
        // Main data worksheet
        const mainData = exportData.map(patient => ({
          'Registration No': patient.regNo,
          'Patient Name': patient.name,
          'Age': patient.age,
          'Gender': patient.gender,
          'Phone': patient.phone,
          'Prakriti': patient.prakriti,
          'Dosha Condition': patient.dosha,
          'Ayurvedic Diagnosis': patient.ayurvedicDiagnosis,
          'Therapy': patient.therapy,
          'Panchakarma': patient.panchakarma
        }));
        
        // Statistics worksheet
        const statsData = [
          ['Metric', 'Count'],
          ['Total Patients', totalPatients],
          ['Active Treatment', activePatients],
          ['Under Treatment', underTreatment],
          ['Recovery Phase', recovery],
          ['Completed', completed],
          ['', ''],
          ['Report Generated', timestamp],
          ['Department', 'Ayurvedic IPD Management']
        ];
        
        const mainSheet = XLSX.utils.json_to_sheet(mainData);
        const statsSheet = XLSX.utils.aoa_to_sheet(statsData);
        
        // Style the headers
        const range = XLSX.utils.decode_range(mainSheet['!ref']);
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const address = XLSX.utils.encode_cell({ r: 0, c: C });
          if (!mainSheet[address]) continue;
          mainSheet[address].s = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "2C5282" } }
          };
        }
        
        XLSX.utils.book_append_sheet(workbook, mainSheet, 'IPD Patients');
        XLSX.utils.book_append_sheet(workbook, statsSheet, 'Statistics');
        
        XLSX.writeFile(workbook, `Ayurvedic_IPD_Report_${timestamp.replace(/\//g, '-')}.xlsx`);
        
      } else if (format === 'csv') {
        const csvData = exportData.map(patient => ({
          'Registration No': patient.regNo,
          'Patient Name': patient.name,
          'Age': patient.age,
          'Gender': patient.gender,
          'Phone': patient.phone,
          'Prakriti': patient.prakriti,
          'Dosha Condition': patient.dosha,
          'Ayurvedic Diagnosis': patient.ayurvedicDiagnosis,
          'Therapy': patient.therapy,
          'Panchakarma': patient.panchakarma
        }));
        
        const headers = Object.keys(csvData[0]);
        const csvContent = [
          headers.join(','),
          ...csvData.map(row => 
            headers.map(header => {
              const value = row[header] || '';
              return `"${value.toString().replace(/"/g, '""')}"`;
            }).join(',')
          )
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `Ayurvedic_IPD_Report_${timestamp.replace(/\//g, '-')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      onExportClose();
      toast({
        title: "Export Successful",
        description: `IPD data has been exported as ${format.toUpperCase()}`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right"
      });
      
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right"
      });
    }
  };

  return (
    <Box minH="100vh" bgGradient="linear(to-br, gray.50, blue.50)">
      {/* Enhanced Header */}
      <Box
        bgGradient="linear(to-r, #2563eb, #10b981)"
        color="white"
        py={{ base: 6, md: 8 }}
        px={{ base: 4, md: 12 }}
        borderBottomLeftRadius="3xl"
        borderBottomRightRadius="3xl"
        boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.15)"
        mb={10}
        position="relative"
        overflow="hidden"
      >
        {/* Background Pattern */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          opacity={0.08}
          bgImage="data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"
        />
        <VStack spacing={4} position="relative" zIndex={1} align="flex-start">
          <Flex w="full" align="center" justify="space-between">
            <HStack spacing={4}>
              <Box
                p={3}
                bg="rgba(255,255,255,0.18)"
                borderRadius="xl"
                boxShadow="md"
                border="1px solid rgba(255,255,255,0.25)"
              >
                <Activity size={28} />
              </Box>
              <VStack align="start" spacing={1}>
                <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="extrabold" letterSpacing="tight">
                  🏥 Ayurvedic IPD Management
                </Text>
                <Text fontSize={{ base: "md", md: "lg" }} opacity={0.92} fontWeight="medium">
                  Panchakarma & Residential Care Excellence
                </Text>
              </VStack>
            </HStack>
            <Button
              leftIcon={<UserPlus size={18} />}
              bg="white"
              color="blue.600"
              border="2px solid"
              borderColor="blue.400"
              size="lg"
              borderRadius="xl"
              fontWeight="bold"
              boxShadow="md"
              _hover={{ bg: 'blue.50', color: 'blue.700', borderColor: 'blue.600', transform: 'translateY(-2px)', boxShadow: 'lg' }}
              onClick={onAddOpen}
            >
              Add Patient
            </Button>
          </Flex>
        </VStack>
      </Box>

      {/* Enhanced KPI Cards and Search Section */}
      <Box maxW="1200px" mx="auto" px={{ base: 2, md: 0 }}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6} mb={8}>
          <Card
            bgGradient="linear(to-br, white, blue.50)"
            borderRadius="2xl"
            boxShadow="lg"
            border="1px solid"
            borderColor="blue.100"
            _hover={{ transform: "translateY(-4px)", boxShadow: "2xl", transition: "all 0.3s" }}
          >
            <CardBody p={6}>
              <VStack spacing={3}>
                <HStack spacing={3}>
                  <Box p={2} bg="blue.50" borderRadius="md">
                    <User size={22} color="#2563eb" />
                  </Box>
                  <Text fontSize="sm" fontWeight="semibold" color="blue.700">Total Patients</Text>
                </HStack>
                <Text fontSize="3xl" fontWeight="bold" color="blue.800">{patients.length}</Text>
                <Text fontSize="xs" color="blue.500">Registered in IPD</Text>
              </VStack>
            </CardBody>
          </Card>
          <Card
            bgGradient="linear(to-br, white, teal.50)"
            borderRadius="2xl"
            boxShadow="lg"
            border="1px solid"
            borderColor="teal.100"
            _hover={{ transform: "translateY(-4px)", boxShadow: "2xl", transition: "all 0.3s" }}
          >
            <CardBody p={6}>
              <VStack spacing={3}>
                <HStack spacing={3}>
                  <Box p={2} bg="teal.50" borderRadius="md">
                    <Activity size={22} color="#10b981" />
                  </Box>
                  <Text fontSize="sm" fontWeight="semibold" color="teal.700">Active Treatments</Text>
                </HStack>
                <Text fontSize="3xl" fontWeight="bold" color="teal.800">
                  {patients.filter(p => p.status === 'Active Treatment').length}
                </Text>
                <Text fontSize="xs" color="teal.500">Currently ongoing</Text>
              </VStack>
            </CardBody>
          </Card>
          <Card
            bgGradient="linear(to-br, white, green.50)"
            borderRadius="2xl"
            boxShadow="lg"
            border="1px solid"
            borderColor="green.100"
            _hover={{ transform: "translateY(-4px)", boxShadow: "2xl", transition: "all 0.3s" }}
          >
            <CardBody p={6}>
              <VStack spacing={3}>
                <HStack spacing={3}>
                  <Box p={2} bg="green.50" borderRadius="md">
                    <CheckCircle size={22} color="#22c55e" />
                  </Box>
                  <Text fontSize="sm" fontWeight="semibold" color="green.700">Recovery Phase</Text>
                </HStack>
                <Text fontSize="3xl" fontWeight="bold" color="green.800">
                  {patients.filter(p => p.status === 'Recovery').length}
                </Text>
                <Text fontSize="xs" color="green.500">Improving steadily</Text>
              </VStack>
            </CardBody>
          </Card>
          <Card
            bgGradient="linear(to-br, white, purple.50)"
            borderRadius="2xl"
            boxShadow="lg"
            border="1px solid"
            borderColor="purple.100"
            _hover={{ transform: "translateY(-4px)", boxShadow: "2xl", transition: "all 0.3s" }}
          >
            <CardBody p={6}>
              <VStack spacing={3}>
                <HStack spacing={3}>
                  <Box p={2} bg="purple.50" borderRadius="md">
                    <Stethoscope size={22} color="#a21caf" />
                  </Box>
                  <Text fontSize="sm" fontWeight="semibold" color="purple.700">Panchakarma</Text>
                </HStack>
                <Text fontSize="3xl" fontWeight="bold" color="purple.800">
                  {patients.filter(p => p.panchakarma && p.panchakarma !== 'None').length}
                </Text>
                <Text fontSize="xs" color="purple.500">Specialized therapy</Text>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>
        {/* Enhanced Search and filter controls below KPI cards */}
        <Box
          bg="white"
          borderRadius="2xl"
          boxShadow="md"
          border="1px solid"
          borderColor="gray.100"
          px={{ base: 4, md: 8 }}
          py={{ base: 4, md: 6 }}
          mb={8}
        >
          <Flex justify="space-between" align="center" wrap="wrap" gap={4} w="full">
            <InputGroup size="lg" flex="1" minW={{ base: "250px", md: "300px" }} maxW="400px">
              <InputLeftElement pointerEvents="none">
                <Search color="gray.400" size={20} />
              </InputLeftElement>
              <Input
                placeholder="Search by patient name, IPD number, or diagnosis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                bg="gray.50"
                border="2px solid"
                borderColor="blue.100"
                _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #3B82F6" }}
                borderRadius="xl"
                _hover={{ borderColor: "blue.300" }}
              />
            </InputGroup>
            
            <HStack spacing={4} wrap="wrap">
              <Button
                leftIcon={<RefreshCw size={18} />}
                colorScheme="gray"
                variant="outline"
                size="lg"
                borderRadius="xl"
                flexShrink={0}
                _hover={{
                  bg: "gray.100",
                  transform: "translateY(-1px)"
                }}
              >
                Refresh
              </Button>
              
              <Button
                leftIcon={<FileSpreadsheet size={18} />}
                colorScheme="purple"
                variant="outline"
                size="lg"
                borderRadius="xl"
                onClick={onExportOpen}
                flexShrink={0}
                _hover={{ 
                  bg: 'purple.50', 
                  borderColor: 'purple.400',
                  transform: 'translateY(-1px)', 
                  boxShadow: 'md' 
                }}
              >
                Export
              </Button>
            </HStack>
          </Flex>
        </Box>
      </Box>

  {/* Tabs for Current/Old IPD */}
  <Tabs index={ipdTab} onChange={setIpdTab} colorScheme="blue" mt={8} variant="enclosed">
        <TabList>
          <Tab fontWeight="bold">Current IPD</Tab>
          <Tab fontWeight="bold">Old IPD</Tab>
        </TabList>
        <TabPanels>
          <TabPanel px={0}>
            {/* Current IPD Table */}
            {/** ...existing code for table and pagination, but use filteredPatients for current tab... **/}
            <Card 
              border="1px" 
              borderColor="blue.200" 
              borderRadius="2xl"
              overflow="hidden"
              shadow="lg"
            >
              <CardBody p={0}>
                <TableContainer>
                  <Table variant="simple" size="md">
                    <Thead bg="linear-gradient(135deg, #3B82F6 0%, #10B981 100%)">
                      <Tr>
                        <Th width="40px" color="white" fontSize="sm">
                          <Checkbox
                            isChecked={selectedPatients.length === filteredPatients.length && filteredPatients.length > 0}
                            isIndeterminate={selectedPatients.length > 0 && selectedPatients.length < filteredPatients.length}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                            colorScheme="whiteAlpha"
                          />
                        </Th>
                        <Th color="white" fontSize="sm" fontWeight="bold">IPD No</Th>
                        <Th color="white" fontSize="sm" fontWeight="bold">Case ID</Th>
                        <Th color="white" fontSize="sm" fontWeight="bold">Patient Name</Th>
                        <Th color="white" fontSize="sm" fontWeight="bold">Age</Th>
                        <Th color="white" fontSize="sm" fontWeight="bold">Gender</Th>
                        <Th color="white" fontSize="sm" fontWeight="bold">Phone</Th>
                        <Th color="white" fontSize="sm" fontWeight="bold">Prakriti</Th>
                        <Th color="white" fontSize="sm" fontWeight="bold">Dosha</Th>
                        <Th color="white" fontSize="sm" fontWeight="bold">Ayurvedic Diagnosis</Th>
                        <Th color="white" fontSize="sm" fontWeight="bold">Therapy</Th>
                        <Th color="white" fontSize="sm" fontWeight="bold">Panchakarma</Th>

                        <Th width="100px" color="white" fontSize="sm" fontWeight="bold">Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredPatients.map((patient, index) => (
                        <Tr 
                          key={patient.id} 
                          _hover={{ bg: "blue.50" }}
                          bg={index % 2 === 0 ? "white" : "blue.25"}
                          position="relative"
                        >
                          <Td>
                            <Checkbox
                              isChecked={selectedPatients.includes(patient.id)}
                              onChange={(e) => handleSelectPatient(patient.id, e.target.checked)}
                            />
                          </Td>
                          <Td>
                            <Text color="blue.600" fontWeight="medium">{patient.caseId}</Text>
                          </Td>
                          <Td>
                            <Text color="blue.600">{patient.regNo}</Text>
                          </Td>
                          <Td>
                            <HStack spacing={2}>
                              <Avatar size="sm" name={patient.name} />
                              <Text fontWeight="medium">{patient.name}</Text>
                            </HStack>
                          </Td>
                          <Td>{patient.age}</Td>
                          <Td>{patient.gender}</Td>
                          <Td>{patient.phone}</Td>
                          <Td>
                            <Badge colorScheme="teal" size="sm">
                              {patient.prakriti}
                            </Badge>
                          </Td>
                          <Td>
                            <Badge colorScheme={getDoshaColor(patient.dosha)} size="sm">
                              {patient.dosha}
                            </Badge>
                          </Td>
                          <Td>
                            <Text fontSize="sm" color="purple.600">
                              {patient.ayurvedicDiagnosis}
                            </Text>
                          </Td>
                          <Td>
                            <Text fontSize="sm">{patient.therapy}</Text>
                          </Td>
                          <Td>
                            <Text fontSize="sm" color="orange.600">
                              {patient.panchakarma}
                            </Text>
                          </Td>

                          <Td>
                            <Menu placement="bottom-end" strategy="fixed">
                              <MenuButton
                                as={IconButton}
                                icon={<MoreVertical size={16} />}
                                variant="ghost"
                                size="sm"
                                _hover={{ bg: "blue.100" }}
                                _active={{ bg: "blue.200" }}
                              />
                              <MenuList 
                                zIndex={1000}
                                bg="white"
                                shadow="xl"
                                border="1px solid"
                                borderColor="blue.200"
                              >
                                <MenuItem 
                                  icon={<Eye size={16} />} 
                                  onClick={() => handleView(patient)}
                                  _hover={{ bg: "blue.50" }}
                                >
                                  View Details
                                </MenuItem>
                                <MenuItem 
                                  icon={<Edit3 size={16} />} 
                                  onClick={() => handleEdit(patient)}
                                  _hover={{ bg: "blue.50" }}
                                >
                                  Edit Patient
                                </MenuItem>
                                <MenuItem 
                                  icon={<FileText size={16} />} 
                                  onClick={() => handleViewTreatmentChart(patient)}
                                  _hover={{ bg: "blue.50" }}
                                >
                                  Treatment Chart
                                </MenuItem>
                                <MenuItem 
                                  icon={<Activity size={16} />} 
                                  onClick={() => handleProgressNotes(patient)}
                                  _hover={{ bg: "blue.50" }}
                                >
                                  Progress Notes
                                </MenuItem>
                                <MenuItem 
                                  icon={<Clipboard size={16} />} 
                                  onClick={() => handleMedicineChart(patient)}
                                  _hover={{ bg: "blue.50" }}
                                >
                                  Medicine Chart
                                </MenuItem>
                                <MenuItem 
                                  icon={<FilePlus size={16} />} 
                                  onClick={() => handleAddPrescription(patient)}
                                  _hover={{ bg: "blue.50" }}
                                >
                                  Add Prescription
                                </MenuItem>
                                <MenuItem 
                                  icon={<CheckCircle size={16} />} 
                                  onClick={() => handleCompleteToken(patient)} 
                                  color="green.600"
                                  _hover={{ bg: "green.50" }}
                                  isDisabled={patient.status === 'Completed'}
                                >
                                  Complete Treatment
                                </MenuItem>
                                <MenuItem 
                                  icon={<X size={16} />} 
                                  onClick={() => handleCancelTreatment(patient)} 
                                  color="red.600"
                                  _hover={{ bg: "red.50" }}
                                  isDisabled={patient.status === 'Cancelled'}
                                >
                                  Cancel Treatment
                                </MenuItem>
                                <MenuItem 
                                  icon={<RefreshCw size={16} />} 
                                  onClick={() => handleActivateTreatment(patient)} 
                                  color="blue.600"
                                  _hover={{ bg: "blue.50" }}
                                  isDisabled={patient.status === 'Active'}
                                >
                                  Activate Treatment
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
                {/* Pagination (reuse existing logic) */}
                <Flex justify="space-between" align="center" p={4} borderTop="1px" borderColor={borderColor}>
                  <Text fontSize="sm" color="gray.600">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredPatients.length)} of {filteredPatients.length} patients
                  </Text>
                  <HStack spacing={2}>
                    <IconButton
                      icon={<ChevronLeft size={16} />}
                      size="sm"
                      variant="outline"
                      isDisabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    />
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = Math.max(1, currentPage - 2) + i;
                      if (pageNum <= totalPages) {
                        return (
                          <Button
                            key={pageNum}
                            size="sm"
                            variant={pageNum === currentPage ? "solid" : "outline"}
                            colorScheme={pageNum === currentPage ? "blue" : "gray"}
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      }
                      return null;
                    })}
                    <IconButton
                      icon={<ChevronRight size={16} />}
                      size="sm"
                      variant="outline"
                      isDisabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    />
                  </HStack>
                </Flex>
              </CardBody>
            </Card>
          </TabPanel>
          <TabPanel px={0}>
            {/* Old IPD Table (same table, but filteredPatients for old IPD) */}
            <Card 
              border="1px" 
              borderColor="blue.200" 
              borderRadius="2xl"
              overflow="hidden"
              shadow="lg"
            >
              <CardBody p={0}>
                <TableContainer>
                  <Table variant="simple" size="md">
                    <Thead bg="linear-gradient(135deg, #3B82F6 0%, #10B981 100%)">
                      <Tr>
                        <Th width="40px" color="white" fontSize="sm">
                          <Checkbox
                            isChecked={selectedPatients.length === filteredPatients.length && filteredPatients.length > 0}
                            isIndeterminate={selectedPatients.length > 0 && selectedPatients.length < filteredPatients.length}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                            colorScheme="whiteAlpha"
                          />
                        </Th>
                        <Th color="white" fontSize="sm" fontWeight="bold">IPD No</Th>
                        <Th color="white" fontSize="sm" fontWeight="bold">Case ID</Th>
                        <Th color="white" fontSize="sm" fontWeight="bold">Patient Name</Th>
                        <Th color="white" fontSize="sm" fontWeight="bold">Age</Th>
                        <Th color="white" fontSize="sm" fontWeight="bold">Gender</Th>
                        <Th color="white" fontSize="sm" fontWeight="bold">Phone</Th>
                        <Th color="white" fontSize="sm" fontWeight="bold">Prakriti</Th>
                        <Th color="white" fontSize="sm" fontWeight="bold">Dosha</Th>
                        <Th color="white" fontSize="sm" fontWeight="bold">Ayurvedic Diagnosis</Th>
                        <Th color="white" fontSize="sm" fontWeight="bold">Therapy</Th>
                        <Th color="white" fontSize="sm" fontWeight="bold">Panchakarma</Th>

                        <Th width="100px" color="white" fontSize="sm" fontWeight="bold">Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredPatients.map((patient, index) => (
                        <Tr 
                          key={patient.id} 
                          _hover={{ bg: "blue.50" }}
                          bg={index % 2 === 0 ? "white" : "blue.25"}
                          position="relative"
                        >
                          <Td>
                            <Checkbox
                              isChecked={selectedPatients.includes(patient.id)}
                              onChange={(e) => handleSelectPatient(patient.id, e.target.checked)}
                            />
                          </Td>
                          <Td>
                            <Text color="blue.600" fontWeight="medium">{patient.caseId}</Text>
                          </Td>
                          <Td>
                            <Text color="blue.600">{patient.regNo}</Text>
                          </Td>
                          <Td>
                            <HStack spacing={2}>
                              <Avatar size="sm" name={patient.name} />
                              <Text fontWeight="medium">{patient.name}</Text>
                            </HStack>
                          </Td>
                          <Td>{patient.age}</Td>
                          <Td>{patient.gender}</Td>
                          <Td>{patient.phone}</Td>
                          <Td>
                            <Badge colorScheme="teal" size="sm">
                              {patient.prakriti}
                            </Badge>
                          </Td>
                          <Td>
                            <Badge colorScheme={getDoshaColor(patient.dosha)} size="sm">
                              {patient.dosha}
                            </Badge>
                          </Td>
                          <Td>
                            <Text fontSize="sm" color="purple.600">
                              {patient.ayurvedicDiagnosis}
                            </Text>
                          </Td>
                          <Td>
                            <Text fontSize="sm">{patient.therapy}</Text>
                          </Td>
                          <Td>
                            <Text fontSize="sm" color="orange.600">
                              {patient.panchakarma}
                            </Text>
                          </Td>

                          <Td>
                            <Menu placement="bottom-end" strategy="fixed">
                              <MenuButton
                                as={IconButton}
                                icon={<MoreVertical size={16} />}
                                variant="ghost"
                                size="sm"
                                _hover={{ bg: "blue.100" }}
                                _active={{ bg: "blue.200" }}
                              />
                              <MenuList 
                                zIndex={1000}
                                bg="white"
                                shadow="xl"
                                border="1px solid"
                                borderColor="blue.200"
                              >
                                <MenuItem 
                                  icon={<Eye size={16} />} 
                                  onClick={() => handleView(patient)}
                                  _hover={{ bg: "blue.50" }}
                                >
                                  View Details
                                </MenuItem>
                                <MenuItem 
                                  icon={<Edit3 size={16} />} 
                                  onClick={() => handleEdit(patient)}
                                  _hover={{ bg: "blue.50" }}
                                >
                                  Edit Patient
                                </MenuItem>
                                <MenuItem 
                                  icon={<FileText size={16} />} 
                                  onClick={() => handleViewTreatmentChart(patient)}
                                  _hover={{ bg: "blue.50" }}
                                >
                                  Treatment Chart
                                </MenuItem>
                                <MenuItem 
                                  icon={<Activity size={16} />} 
                                  onClick={() => handleProgressNotes(patient)}
                                  _hover={{ bg: "blue.50" }}
                                >
                                  Progress Notes
                                </MenuItem>
                                <MenuItem 
                                  icon={<Clipboard size={16} />} 
                                  onClick={() => handleMedicineChart(patient)}
                                  _hover={{ bg: "blue.50" }}
                                >
                                  Medicine Chart
                                </MenuItem>
                                <MenuItem 
                                  icon={<FilePlus size={16} />} 
                                  onClick={() => handleAddPrescription(patient)}
                                  _hover={{ bg: "blue.50" }}
                                >
                                  Add Prescription
                                </MenuItem>
                                <MenuItem 
                                  icon={<RefreshCw size={16} />} 
                                  onClick={() => handleActivateTreatment(patient)} 
                                  color="blue.600"
                                  _hover={{ bg: "blue.50" }}
                                  isDisabled={patient.status === 'Active'}
                                >
                                  Reactivate Treatment
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
                {/* Pagination (reuse existing logic) */}
                <Flex justify="space-between" align="center" p={4} borderTop="1px" borderColor={borderColor}>
                  <Text fontSize="sm" color="gray.600">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredPatients.length)} of {filteredPatients.length} patients
                  </Text>
                  <HStack spacing={2}>
                    <IconButton
                      icon={<ChevronLeft size={16} />}
                      size="sm"
                      variant="outline"
                      isDisabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    />
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = Math.max(1, currentPage - 2) + i;
                      if (pageNum <= totalPages) {
                        return (
                          <Button
                            key={pageNum}
                            size="sm"
                            variant={pageNum === currentPage ? "solid" : "outline"}
                            colorScheme={pageNum === currentPage ? "blue" : "gray"}
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      }
                      return null;
                    })}
                    <IconButton
                      icon={<ChevronRight size={16} />}
                      size="sm"
                      variant="outline"
                      isDisabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    />
                  </HStack>
                </Flex>
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Add Patient Modal */}
      <Modal isOpen={isAddOpen} onClose={handleModalClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="blue.500" color="white">
            <HStack spacing={2}>
              <UserPlus size={20} />
              <Text>Add New Patient</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody p={6}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl isRequired position="relative">
                <FormLabel>Registration Number</FormLabel>
                <Input
                  value={newPatient.regNo}
                  onChange={(e) => handleRegNoChange(e.target.value)}
                  placeholder="Enter numerical registration number (e.g., 12345001)"
                  autoComplete="off"
                  pattern="[0-9]*"
                  inputMode="numeric"
                />
                {/* Auto-fill suggestions dropdown */}
                {showSuggestions && autoFillSuggestions.length > 0 && (
                  <Box
                    className="suggestions-container"
                    position="absolute"
                    top="100%"
                    left="0"
                    right="0"
                    bg="white"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    boxShadow="lg"
                    zIndex="1000"
                    maxH="200px"
                    overflowY="auto"
                  >
                    <Text fontSize="xs" color="gray.500" p={2} bg="gray.50" fontWeight="semibold">
                      Found existing patient records:
                    </Text>
                    {autoFillSuggestions.map((patient, index) => (
                      <Box
                        key={patient.id}
                        p={3}
                        cursor="pointer"
                        borderBottom={index < autoFillSuggestions.length - 1 ? "1px solid" : "none"}
                        borderColor="gray.100"
                        _hover={{ bg: "blue.50" }}
                        onClick={() => autoFillPatientData(patient)}
                      >
                        <Text fontWeight="semibold" color="blue.600">{patient.name}</Text>
                        <Text fontSize="sm" color="gray.600">Reg: {patient.regNo} | Age: {patient.age} | {patient.gender}</Text>
                        <Text fontSize="xs" color="gray.500">Last diagnosis: {patient.ayurvedicDiagnosis}</Text>
                      </Box>
                    ))}
                  </Box>
                )}
              </FormControl>
              <FormControl isRequired position="relative">
                <FormLabel>Patient Name</FormLabel>
                <Input
                  value={newPatient.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Enter patient name or search existing"
                  autoComplete="off"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Age</FormLabel>
                <NumberInput
                  value={newPatient.age}
                  onChange={(value) => setNewPatient(prev => ({ ...prev, age: value }))}
                >
                  <NumberInputField placeholder="Enter age" />
                </NumberInput>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Gender</FormLabel>
                <Select
                  value={newPatient.gender}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, gender: e.target.value }))}
                  placeholder="Select gender"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Phone</FormLabel>
                <Input
                  value={newPatient.phone}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Prakriti (Constitution)</FormLabel>
                <Select
                  value={newPatient.prakriti}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, prakriti: e.target.value }))}
                  placeholder="Select prakriti"
                >
                  <option value="Vata">Vata</option>
                  <option value="Pitta">Pitta</option>
                  <option value="Kapha">Kapha</option>
                  <option value="Vata-Pitta">Vata-Pitta</option>
                  <option value="Pitta-Kapha">Pitta-Kapha</option>
                  <option value="Vata-Kapha">Vata-Kapha</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Current Dosha Status</FormLabel>
                <Select
                  value={newPatient.dosha}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, dosha: e.target.value }))}
                  placeholder="Select dosha status"
                >
                  <option value="Vata Aggravated">Vata Aggravated</option>
                  <option value="Pitta Elevated">Pitta Elevated</option>
                  <option value="Kapha Vitiated">Kapha Vitiated</option>
                  <option value="Balanced">Balanced</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Ayurvedic Diagnosis</FormLabel>
                <Input
                  value={newPatient.ayurvedicDiagnosis}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, ayurvedicDiagnosis: e.target.value }))}
                  placeholder="Enter ayurvedic diagnosis"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Therapy</FormLabel>
                <Input
                  value={newPatient.therapy}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, therapy: e.target.value }))}
                  placeholder="Enter therapy type"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Panchakarma</FormLabel>
                <Select
                  value={newPatient.panchakarma}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, panchakarma: e.target.value }))}
                  placeholder="Select panchakarma"
                >
                  <option value="Vamana">Vamana</option>
                  <option value="Virechana">Virechana</option>
                  <option value="Basti">Basti</option>
                  <option value="Nasya">Nasya</option>
                  <option value="Raktamokshana">Raktamokshana</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Diet Plan</FormLabel>
                <Textarea
                  value={newPatient.diet}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, diet: e.target.value }))}
                  placeholder="Enter diet recommendations"
                  rows={2}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Yoga/Exercise</FormLabel>
                <Textarea
                  value={newPatient.yoga}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, yoga: e.target.value }))}
                  placeholder="Enter yoga/exercise recommendations"
                  rows={2}
                />
              </FormControl>
            </SimpleGrid>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleModalClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleAddPatient}
              isDisabled={!newPatient.name || !newPatient.regNo}
            >
              Add Patient
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View Patient Modal */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="green.500" color="white">
            <HStack spacing={2}>
              <Eye size={20} />
              <Text>Patient Details - {selectedPatient?.name}</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody p={6}>
            {selectedPatient && (
              <VStack spacing={6} align="stretch">
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <Box>
                    <Text fontSize="sm" color="gray.600">IPD Number</Text>
                    <Text fontWeight="medium">{selectedPatient.caseId}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.600">Patient Name</Text>
                    <Text fontWeight="medium">{selectedPatient.name}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.600">Age</Text>
                    <Text fontWeight="medium">{selectedPatient.age} years</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.600">Gender</Text>
                    <Text fontWeight="medium">{selectedPatient.gender}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.600">Phone</Text>
                    <Text fontWeight="medium">{selectedPatient.phone}</Text>
                  </Box>
                </SimpleGrid>
                
                <Divider />
                
                <Box>
                  <Text fontSize="lg" fontWeight="semibold" mb={4} color="purple.600">
                    Ayurvedic Assessment
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <Box>
                      <Text fontSize="sm" color="gray.600">Prakriti (Constitution)</Text>
                      <Badge colorScheme="teal" size="lg">{selectedPatient.prakriti}</Badge>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.600">Current Dosha Status</Text>
                      <Badge colorScheme={getDoshaColor(selectedPatient.dosha)} size="lg">
                        {selectedPatient.dosha}
                      </Badge>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.600">Ayurvedic Diagnosis</Text>
                      <Text fontWeight="medium" color="purple.600">{selectedPatient.ayurvedicDiagnosis}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.600">Therapy</Text>
                      <Text fontWeight="medium">{selectedPatient.therapy}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.600">Panchakarma</Text>
                      <Text fontWeight="medium" color="orange.600">{selectedPatient.panchakarma}</Text>
                    </Box>
                  </SimpleGrid>
                </Box>
                
                <Divider />
                
                <Box>
                  <Text fontSize="lg" fontWeight="semibold" mb={4} color="green.600">
                    Treatment Plan
                  </Text>
                  <VStack spacing={4} align="stretch">
                    <Box>
                      <Text fontSize="sm" color="gray.600" mb={2}>Diet Plan</Text>
                      <Text fontSize="sm" p={3} bg="green.50" borderRadius="md" border="1px" borderColor="green.200">
                        {selectedPatient.diet}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.600" mb={2}>Yoga/Exercise</Text>
                      <Text fontSize="sm" p={3} bg="blue.50" borderRadius="md" border="1px" borderColor="blue.200">
                        {selectedPatient.yoga}
                      </Text>
                    </Box>
                  </VStack>
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" onClick={onViewClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Patient Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="green.500" color="white">
            <HStack spacing={2}>
              <Edit3 size={20} />
              <Text>Edit Patient - {selectedPatient?.name}</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody p={6}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl isRequired>
                <FormLabel>IPD Number</FormLabel>
                <Input
                  value={selectedPatient?.caseId || ''}
                  placeholder="IPD Number (Auto-generated)"
                  isReadOnly
                  bg="gray.100"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Patient Name</FormLabel>
                <Input
                  value={newPatient.name}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter patient name"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Age</FormLabel>
                <NumberInput
                  value={newPatient.age}
                  onChange={(value) => setNewPatient(prev => ({ ...prev, age: value }))}
                >
                  <NumberInputField placeholder="Enter age" />
                </NumberInput>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Gender</FormLabel>
                <Select
                  value={newPatient.gender}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, gender: e.target.value }))}
                  placeholder="Select gender"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Phone</FormLabel>
                <Input
                  value={newPatient.phone}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Prakriti (Constitution)</FormLabel>
                <Select
                  value={newPatient.prakriti}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, prakriti: e.target.value }))}
                  placeholder="Select prakriti"
                >
                  <option value="Vata">Vata</option>
                  <option value="Pitta">Pitta</option>
                  <option value="Kapha">Kapha</option>
                  <option value="Vata-Pitta">Vata-Pitta</option>
                  <option value="Pitta-Kapha">Pitta-Kapha</option>
                  <option value="Vata-Kapha">Vata-Kapha</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Current Dosha Status</FormLabel>
                <Select
                  value={newPatient.dosha}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, dosha: e.target.value }))}
                  placeholder="Select dosha status"
                >
                  <option value="Vata Aggravated">Vata Aggravated</option>
                  <option value="Pitta Elevated">Pitta Elevated</option>
                  <option value="Kapha Vitiated">Kapha Vitiated</option>
                  <option value="Balanced">Balanced</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Ayurvedic Diagnosis</FormLabel>
                <Input
                  value={newPatient.ayurvedicDiagnosis}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, ayurvedicDiagnosis: e.target.value }))}
                  placeholder="Enter ayurvedic diagnosis"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Therapy</FormLabel>
                <Input
                  value={newPatient.therapy}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, therapy: e.target.value }))}
                  placeholder="Enter therapy type"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Panchakarma</FormLabel>
                <Select
                  value={newPatient.panchakarma}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, panchakarma: e.target.value }))}
                  placeholder="Select panchakarma"
                >
                  <option value="Vamana">Vamana</option>
                  <option value="Virechana">Virechana</option>
                  <option value="Basti">Basti</option>
                  <option value="Nasya">Nasya</option>
                  <option value="Raktamokshana">Raktamokshana</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Room Assignment</FormLabel>
                <Input
                  value={newPatient.room || selectedPatient?.room || ''}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, room: e.target.value }))}
                  placeholder="Enter room number (e.g., Room 101)"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Assigned Doctor</FormLabel>
                <Input
                  value={newPatient.doctor || selectedPatient?.doctor || ''}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, doctor: e.target.value }))}
                  placeholder="Enter doctor name"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Treatment Duration</FormLabel>
                <Input
                  value={newPatient.treatmentDuration || selectedPatient?.treatmentDuration || ''}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, treatmentDuration: e.target.value }))}
                  placeholder="Enter duration (e.g., 21 days)"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Medical Condition</FormLabel>
                <Input
                  value={newPatient.condition || selectedPatient?.condition || ''}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, condition: e.target.value }))}
                  placeholder="Enter medical condition"
                />
              </FormControl>
            </SimpleGrid>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onEditClose}>
              Cancel
            </Button>
            <Button
              colorScheme="green"
              onClick={handleUpdatePatient}
              isDisabled={!newPatient.name || !newPatient.regNo}
            >
              Update Patient
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Enhanced Treatment Chart Modal */}
      <Modal isOpen={isTreatmentChartOpen} onClose={onTreatmentChartClose} size="6xl">
        <ModalOverlay />
        <ModalContent maxH="90vh" overflowY="auto">
          <ModalHeader>
            <VStack align="start" spacing={2}>
              <Text fontSize="xl" fontWeight="bold" color="green.600">
                🌿 Panchkarma Treatment Chart - {selectedPatient?.name}
              </Text>
              <Text fontSize="sm" color="gray.600">
                IPD No: {selectedPatient?.caseId} | Room: {selectedPatient?.room} | Admission: {selectedPatient?.admissionDate}
              </Text>
            </VStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedPatient && (
              <VStack spacing={6} align="stretch">
                {/* Patient Summary Card */}
                <Card variant="outline" bg="green.50" borderColor="green.200">
                  <CardBody>
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                      <Box>
                        <Text fontSize="sm" color="green.700" fontWeight="semibold">Assigned Panchkarma</Text>
                        <Text fontSize="lg" fontWeight="bold" color="green.800">
                          {selectedPatient.panchakarma || 'Multiple Treatments'}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="green.700" fontWeight="semibold">Treatment Duration</Text>
                        <Text fontSize="lg" fontWeight="bold" color="green.800">
                          {selectedPatient.treatmentDuration || '21 days'}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="green.700" fontWeight="semibold">Current Status</Text>
                        <Badge colorScheme="green" size="lg">
                          {selectedPatient.status}
                        </Badge>
                      </Box>
                    </SimpleGrid>
                  </CardBody>
                </Card>

                {/* Panchkarma Categories with Subcategories */}
                <VStack spacing={6} align="stretch">
                  {/* Vamana Treatment */}
                  {(selectedPatient.panchakarma?.includes('Vamana') || selectedPatient.panchkarmas?.some(p => p.category === 'Vamana')) && (
                    <Card variant="outline" borderColor="orange.300">
                      <CardHeader bg="orange.100" py={3}>
                        <HStack justify="space-between">
                          <Text fontSize="lg" fontWeight="bold" color="orange.700">
                            🤢 Vamana (Therapeutic Emesis)
                          </Text>
                          <Badge colorScheme="orange">Active</Badge>
                        </HStack>
                      </CardHeader>
                      <CardBody>
                        <VStack spacing={4} align="stretch">
                          {/* Subcategories */}
                          <Box>
                            <Text fontSize="md" fontWeight="semibold" mb={3} color="orange.600">
                              Treatment Subcategories:
                            </Text>
                            
                            {/* Purva Karma */}
                            <Card size="sm" variant="outline" mb={4}>
                              <CardHeader py={2}>
                                <Text fontSize="sm" fontWeight="bold" color="orange.700">
                                  1. Purva Karma (Preparatory Phase)
                                </Text>
                              </CardHeader>
                              <CardBody>
                                <VStack spacing={3} align="stretch">
                                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                    <FormControl>
                                      <FormLabel fontSize="xs">Date Schedule</FormLabel>
                                      <Input size="sm" type="date" />
                                    </FormControl>
                                    <FormControl>
                                      <FormLabel fontSize="xs">Time Duration</FormLabel>
                                      <Select size="sm" placeholder="Select duration">
                                        <option value="3-days">3 Days</option>
                                        <option value="5-days">5 Days</option>
                                        <option value="7-days">7 Days</option>
                                      </Select>
                                    </FormControl>
                                  </SimpleGrid>
                                  <FormControl>
                                    <FormLabel fontSize="xs">Treatment Notes</FormLabel>
                                    <Textarea 
                                      size="sm" 
                                      rows={2} 
                                      placeholder="Snehana with ghee, Swedana with steam..."
                                    />
                                  </FormControl>
                                  <FormControl>
                                    <FormLabel fontSize="xs">Medicines Used</FormLabel>
                                    <VStack spacing={2} align="stretch">
                                      {/* Medicine Search Input */}
                                      <Box position="relative">
                                        <HStack spacing={2}>
                                          <Input 
                                            size="sm" 
                                            placeholder="Search medicine (e.g., Madanaphala)..." 
                                            value={medicineSearchTerm['vamana-purva'] || ''}
                                            onChange={(e) => handleMedicineSearch('vamana-purva', e.target.value)}
                                            flex={1}
                                          />
                                          <Button 
                                            size="sm" 
                                            colorScheme="green" 
                                            onClick={() => addMedicineToSubcategory('vamana-purva', { name: medicineSearchTerm['vamana-purva'] })}
                                            isDisabled={!medicineSearchTerm['vamana-purva']}
                                          >
                                            Add
                                          </Button>
                                        </HStack>
                                        
                                        {/* Medicine Search Dropdown */}
                                        {showMedicineDropdown['vamana-purva'] && medicineSearchResults['vamana-purva']?.length > 0 && (
                                          <Box 
                                            position="absolute" 
                                            top="100%" 
                                            left={0} 
                                            right={0} 
                                            bg="white" 
                                            border="1px solid" 
                                            borderColor="orange.200" 
                                            borderRadius="md" 
                                            boxShadow="lg" 
                                            zIndex={1000}
                                            maxH="200px"
                                            overflowY="auto"
                                          >
                                            {medicineSearchResults['vamana-purva']?.map((medicine) => (
                                              <Box 
                                                key={medicine.id}
                                                p={2}
                                                cursor="pointer"
                                                _hover={{ bg: "orange.50" }}
                                                onClick={() => addMedicineToSubcategory('vamana-purva', medicine)}
                                              >
                                                <Text fontSize="sm" fontWeight="semibold">{medicine.name}</Text>
                                                <Text fontSize="xs" color="gray.600">
                                                  {medicine.type} • {medicine.category} • {medicine.dosage}
                                                </Text>
                                              </Box>
                                            ))}
                                          </Box>
                                        )}
                                      </Box>

                                      {/* Added Medicines List */}
                                      {selectedMedicines['vamana-purva']?.map((medicine) => (
                                        <Card key={medicine.id} size="sm" variant="outline" bg="orange.25">
                                          <CardBody p={2}>
                                            <VStack spacing={2} align="stretch">
                                              <HStack justify="space-between">
                                                <Text fontSize="sm" fontWeight="semibold" color="orange.700">
                                                  {medicine.name}
                                                </Text>
                                                <IconButton 
                                                  size="xs" 
                                                  icon={<X size={12} />} 
                                                  colorScheme="red" 
                                                  variant="ghost"
                                                  onClick={() => removeMedicineFromSubcategory('vamana-purva', medicine.id)}
                                                />
                                              </HStack>
                                              <SimpleGrid columns={3} spacing={2}>
                                                <FormControl>
                                                  <FormLabel fontSize="xs">Dosage</FormLabel>
                                                  <Input 
                                                    size="xs" 
                                                    placeholder="5-10g"
                                                    value={medicine.dosage}
                                                    onChange={(e) => updateMedicineDetails('vamana-purva', medicine.id, 'dosage', e.target.value)}
                                                  />
                                                </FormControl>
                                                <FormControl>
                                                  <FormLabel fontSize="xs">Timing</FormLabel>
                                                  <Select 
                                                    size="xs" 
                                                    placeholder="Select"
                                                    value={medicine.timing}
                                                    onChange={(e) => updateMedicineDetails('vamana-purva', medicine.id, 'timing', e.target.value)}
                                                  >
                                                    <option value="morning">Morning</option>
                                                    <option value="afternoon">Afternoon</option>
                                                    <option value="evening">Evening</option>
                                                    <option value="night">Night</option>
                                                    <option value="empty-stomach">Empty Stomach</option>
                                                    <option value="after-food">After Food</option>
                                                  </Select>
                                                </FormControl>
                                                <FormControl>
                                                  <FormLabel fontSize="xs">Duration</FormLabel>
                                                  <Input 
                                                    size="xs" 
                                                    placeholder="3 days"
                                                    value={medicine.duration}
                                                    onChange={(e) => updateMedicineDetails('vamana-purva', medicine.id, 'duration', e.target.value)}
                                                  />
                                                </FormControl>
                                              </SimpleGrid>
                                              <FormControl>
                                                <FormLabel fontSize="xs">Notes</FormLabel>
                                                <Textarea 
                                                  size="xs" 
                                                  rows={1}
                                                  placeholder="With warm water, honey..."
                                                  value={medicine.notes}
                                                  onChange={(e) => updateMedicineDetails('vamana-purva', medicine.id, 'notes', e.target.value)}
                                                />
                                              </FormControl>
                                            </VStack>
                                          </CardBody>
                                        </Card>
                                      ))}

                                      {selectedMedicines['vamana-purva']?.length === 0 && (
                                        <Text fontSize="xs" color="gray.500" textAlign="center">
                                          No medicines added yet. Search and add medicines above.
                                        </Text>
                                      )}
                                    </VStack>
                                  </FormControl>
                                </VStack>
                              </CardBody>
                            </Card>

                            {/* Pradhana Karma */}
                            <Card size="sm" variant="outline" mb={4}>
                              <CardHeader py={2}>
                                <Text fontSize="sm" fontWeight="bold" color="orange.700">
                                  2. Pradhana Karma (Main Treatment)
                                </Text>
                              </CardHeader>
                              <CardBody>
                                <VStack spacing={3} align="stretch">
                                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                    <FormControl>
                                      <FormLabel fontSize="xs">Treatment Date</FormLabel>
                                      <Input size="sm" type="date" />
                                    </FormControl>
                                    <FormControl>
                                      <FormLabel fontSize="xs">Time Slot</FormLabel>
                                      <Select size="sm" placeholder="Select time">
                                        <option value="morning">Morning (6-8 AM)</option>
                                        <option value="afternoon">Afternoon (2-4 PM)</option>
                                      </Select>
                                    </FormControl>
                                  </SimpleGrid>
                                  <FormControl>
                                    <FormLabel fontSize="xs">Treatment Notes</FormLabel>
                                    <Textarea 
                                      size="sm" 
                                      rows={2} 
                                      placeholder="Emetic medicine administered, patient response..."
                                    />
                                  </FormControl>
                                  <FormControl>
                                    <FormLabel fontSize="xs">Emetic Medicines</FormLabel>
                                    <VStack spacing={2} align="stretch">
                                      {/* Medicine Search Input */}
                                      <Box position="relative">
                                        <HStack spacing={2}>
                                          <Input 
                                            size="sm" 
                                            placeholder="Search emetic medicine (e.g., Madanaphala Churna)..." 
                                            value={medicineSearchTerm['vamana-pradhana'] || ''}
                                            onChange={(e) => handleMedicineSearch('vamana-pradhana', e.target.value)}
                                            flex={1}
                                          />
                                          <Button 
                                            size="sm" 
                                            colorScheme="green" 
                                            onClick={() => addMedicineToSubcategory('vamana-pradhana', { name: medicineSearchTerm['vamana-pradhana'] })}
                                            isDisabled={!medicineSearchTerm['vamana-pradhana']}
                                          >
                                            Add
                                          </Button>
                                        </HStack>
                                        
                                        {/* Medicine Search Dropdown */}
                                        {showMedicineDropdown['vamana-pradhana'] && medicineSearchResults['vamana-pradhana']?.length > 0 && (
                                          <Box 
                                            position="absolute" 
                                            top="100%" 
                                            left={0} 
                                            right={0} 
                                            bg="white" 
                                            border="1px solid" 
                                            borderColor="orange.200" 
                                            borderRadius="md" 
                                            boxShadow="lg" 
                                            zIndex={1000}
                                            maxH="200px"
                                            overflowY="auto"
                                          >
                                            {medicineSearchResults['vamana-pradhana']?.map((medicine) => (
                                              <Box 
                                                key={medicine.id}
                                                p={2}
                                                cursor="pointer"
                                                _hover={{ bg: "orange.50" }}
                                                onClick={() => addMedicineToSubcategory('vamana-pradhana', medicine)}
                                              >
                                                <Text fontSize="sm" fontWeight="semibold">{medicine.name}</Text>
                                                <Text fontSize="xs" color="gray.600">
                                                  {medicine.type} • {medicine.category} • {medicine.dosage}
                                                </Text>
                                              </Box>
                                            ))}
                                          </Box>
                                        )}
                                      </Box>

                                      {/* Added Medicines List */}
                                      {selectedMedicines['vamana-pradhana']?.map((medicine) => (
                                        <Card key={medicine.id} size="sm" variant="outline" bg="orange.25">
                                          <CardBody p={2}>
                                            <VStack spacing={2} align="stretch">
                                              <HStack justify="space-between">
                                                <Text fontSize="sm" fontWeight="semibold" color="orange.700">
                                                  {medicine.name}
                                                </Text>
                                                <IconButton 
                                                  size="xs" 
                                                  icon={<X size={12} />} 
                                                  colorScheme="red" 
                                                  variant="ghost"
                                                  onClick={() => removeMedicineFromSubcategory('vamana-pradhana', medicine.id)}
                                                />
                                              </HStack>
                                              <SimpleGrid columns={3} spacing={2}>
                                                <FormControl>
                                                  <FormLabel fontSize="xs">Dosage</FormLabel>
                                                  <Input 
                                                    size="xs" 
                                                    placeholder="10g"
                                                    value={medicine.dosage}
                                                    onChange={(e) => updateMedicineDetails('vamana-pradhana', medicine.id, 'dosage', e.target.value)}
                                                  />
                                                </FormControl>
                                                <FormControl>
                                                  <FormLabel fontSize="xs">Timing</FormLabel>
                                                  <Select 
                                                    size="xs" 
                                                    placeholder="Select"
                                                    value={medicine.timing}
                                                    onChange={(e) => updateMedicineDetails('vamana-pradhana', medicine.id, 'timing', e.target.value)}
                                                  >
                                                    <option value="morning">Morning</option>
                                                    <option value="empty-stomach">Empty Stomach</option>
                                                    <option value="with-warm-water">With Warm Water</option>
                                                  </Select>
                                                </FormControl>
                                                <FormControl>
                                                  <FormLabel fontSize="xs">Duration</FormLabel>
                                                  <Input 
                                                    size="xs" 
                                                    placeholder="1 day"
                                                    value={medicine.duration}
                                                    onChange={(e) => updateMedicineDetails('vamana-pradhana', medicine.id, 'duration', e.target.value)}
                                                  />
                                                </FormControl>
                                              </SimpleGrid>
                                              <FormControl>
                                                <FormLabel fontSize="xs">Administration Notes</FormLabel>
                                                <Textarea 
                                                  size="xs" 
                                                  rows={1}
                                                  placeholder="With honey and warm water, followed by milk..."
                                                  value={medicine.notes}
                                                  onChange={(e) => updateMedicineDetails('vamana-pradhana', medicine.id, 'notes', e.target.value)}
                                                />
                                              </FormControl>
                                            </VStack>
                                          </CardBody>
                                        </Card>
                                      ))}

                                      {/* Pre-filled common emetic medicine */}
                                      {!selectedMedicines['vamana-pradhana']?.length && (
                                        <Card size="sm" variant="outline" bg="orange.50">
                                          <CardBody p={2}>
                                            <Text fontSize="xs" color="orange.600" textAlign="center">
                                              💡 Common: Madanaphala Churna (10g), Honey (1 tsp), Warm Water (200ml)
                                            </Text>
                                          </CardBody>
                                        </Card>
                                      )}
                                    </VStack>
                                  </FormControl>
                                </VStack>
                              </CardBody>
                            </Card>

                            {/* Pashchat Karma */}
                            <Card size="sm" variant="outline">
                              <CardHeader py={2}>
                                <Text fontSize="sm" fontWeight="bold" color="orange.700">
                                  3. Pashchat Karma (Post-treatment Care)
                                </Text>
                              </CardHeader>
                              <CardBody>
                                <VStack spacing={3} align="stretch">
                                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                                    <FormControl>
                                      <FormLabel fontSize="xs">Recovery Period</FormLabel>
                                      <Select size="sm" placeholder="Select period">
                                        <option value="3-days">3 Days</option>
                                        <option value="7-days">7 Days</option>
                                        <option value="14-days">14 Days</option>
                                      </Select>
                                    </FormControl>
                                    <FormControl>
                                      <FormLabel fontSize="xs">Diet Regimen</FormLabel>
                                      <Select size="sm" placeholder="Select diet">
                                        <option value="liquid">Liquid Diet</option>
                                        <option value="semi-solid">Semi-solid Diet</option>
                                        <option value="normal">Normal Diet</option>
                                      </Select>
                                    </FormControl>
                                  </SimpleGrid>
                                  <FormControl>
                                    <FormLabel fontSize="xs">Recovery Notes</FormLabel>
                                    <Textarea 
                                      size="sm" 
                                      rows={2} 
                                      placeholder="Patient recovery plan, dietary instructions..."
                                    />
                                  </FormControl>
                                  <FormControl>
                                    <FormLabel fontSize="xs">Recovery Medicines</FormLabel>
                                    <VStack spacing={2} align="stretch">
                                      {/* Medicine Search Input */}
                                      <Box position="relative">
                                        <HStack spacing={2}>
                                          <Input 
                                            size="sm" 
                                            placeholder="Search recovery medicine (e.g., Guduchi Satva)..." 
                                            value={medicineSearchTerm['vamana-pashchat'] || ''}
                                            onChange={(e) => handleMedicineSearch('vamana-pashchat', e.target.value)}
                                            flex={1}
                                          />
                                          <Button 
                                            size="sm" 
                                            colorScheme="green" 
                                            onClick={() => addMedicineToSubcategory('vamana-pashchat', { name: medicineSearchTerm['vamana-pashchat'] })}
                                            isDisabled={!medicineSearchTerm['vamana-pashchat']}
                                          >
                                            Add
                                          </Button>
                                        </HStack>
                                        
                                        {/* Medicine Search Dropdown */}
                                        {showMedicineDropdown['vamana-pashchat'] && medicineSearchResults['vamana-pashchat']?.length > 0 && (
                                          <Box 
                                            position="absolute" 
                                            top="100%" 
                                            left={0} 
                                            right={0} 
                                            bg="white" 
                                            border="1px solid" 
                                            borderColor="orange.200" 
                                            borderRadius="md" 
                                            boxShadow="lg" 
                                            zIndex={1000}
                                            maxH="200px"
                                            overflowY="auto"
                                          >
                                            {medicineSearchResults['vamana-pashchat']?.map((medicine) => (
                                              <Box 
                                                key={medicine.id}
                                                p={2}
                                                cursor="pointer"
                                                _hover={{ bg: "orange.50" }}
                                                onClick={() => addMedicineToSubcategory('vamana-pashchat', medicine)}
                                              >
                                                <Text fontSize="sm" fontWeight="semibold">{medicine.name}</Text>
                                                <Text fontSize="xs" color="gray.600">
                                                  {medicine.type} • {medicine.category} • {medicine.dosage}
                                                </Text>
                                              </Box>
                                            ))}
                                          </Box>
                                        )}
                                      </Box>

                                      {/* Added Medicines List */}
                                      {selectedMedicines['vamana-pashchat']?.map((medicine) => (
                                        <Card key={medicine.id} size="sm" variant="outline" bg="green.25">
                                          <CardBody p={2}>
                                            <VStack spacing={2} align="stretch">
                                              <HStack justify="space-between">
                                                <Text fontSize="sm" fontWeight="semibold" color="green.700">
                                                  {medicine.name}
                                                </Text>
                                                <IconButton 
                                                  size="xs" 
                                                  icon={<X size={12} />} 
                                                  colorScheme="red" 
                                                  variant="ghost"
                                                  onClick={() => removeMedicineFromSubcategory('vamana-pashchat', medicine.id)}
                                                />
                                              </HStack>
                                              <SimpleGrid columns={3} spacing={2}>
                                                <FormControl>
                                                  <FormLabel fontSize="xs">Dosage</FormLabel>
                                                  <Input 
                                                    size="xs" 
                                                    placeholder="1-2g"
                                                    value={medicine.dosage}
                                                    onChange={(e) => updateMedicineDetails('vamana-pashchat', medicine.id, 'dosage', e.target.value)}
                                                  />
                                                </FormControl>
                                                <FormControl>
                                                  <FormLabel fontSize="xs">Timing</FormLabel>
                                                  <Select 
                                                    size="xs" 
                                                    placeholder="Select"
                                                    value={medicine.timing}
                                                    onChange={(e) => updateMedicineDetails('vamana-pashchat', medicine.id, 'timing', e.target.value)}
                                                  >
                                                    <option value="after-food">After Food</option>
                                                    <option value="morning">Morning</option>
                                                    <option value="evening">Evening</option>
                                                    <option value="night">Night</option>
                                                  </Select>
                                                </FormControl>
                                                <FormControl>
                                                  <FormLabel fontSize="xs">Duration</FormLabel>
                                                  <Input 
                                                    size="xs" 
                                                    placeholder="7 days"
                                                    value={medicine.duration}
                                                    onChange={(e) => updateMedicineDetails('vamana-pashchat', medicine.id, 'duration', e.target.value)}
                                                  />
                                                </FormControl>
                                              </SimpleGrid>
                                              <FormControl>
                                                <FormLabel fontSize="xs">Recovery Notes</FormLabel>
                                                <Textarea 
                                                  size="xs" 
                                                  rows={1}
                                                  placeholder="For digestive health, immunity boost..."
                                                  value={medicine.notes}
                                                  onChange={(e) => updateMedicineDetails('vamana-pashchat', medicine.id, 'notes', e.target.value)}
                                                />
                                              </FormControl>
                                            </VStack>
                                          </CardBody>
                                        </Card>
                                      ))}

                                      {selectedMedicines['vamana-pashchat']?.length === 0 && (
                                        <Card size="sm" variant="outline" bg="green.50">
                                          <CardBody p={2}>
                                            <Text fontSize="xs" color="green.600" textAlign="center">
                                              💡 Add digestive medicines for post-treatment recovery
                                            </Text>
                                          </CardBody>
                                        </Card>
                                      )}
                                    </VStack>
                                  </FormControl>
                                </VStack>
                              </CardBody>
                            </Card>
                          </Box>
                        </VStack>
                      </CardBody>
                    </Card>
                  )}

                  {/* Virechana Treatment */}
                  {(selectedPatient.panchakarma?.includes('Virechana') || selectedPatient.panchkarmas?.some(p => p.category === 'Virechana')) && (
                    <Card variant="outline" borderColor="red.300">
                      <CardHeader bg="red.100" py={3}>
                        <HStack justify="space-between">
                          <Text fontSize="lg" fontWeight="bold" color="red.700">
                            💩 Virechana (Therapeutic Purgation)
                          </Text>
                          <Badge colorScheme="red">Scheduled</Badge>
                        </HStack>
                      </CardHeader>
                      <CardBody>
                        <VStack spacing={4} align="stretch">
                          <Box>
                            <Text fontSize="md" fontWeight="semibold" mb={3} color="red.600">
                              Treatment Subcategories:
                            </Text>
                            
                            {/* Virechana Phases with Medicine Search */}
                            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                              {/* Purva Karma */}
                              <Card size="sm" variant="outline">
                                <CardHeader py={2}>
                                  <Text fontSize="sm" fontWeight="bold" color="red.700">
                                    1. Purva Karma
                                  </Text>
                                </CardHeader>
                                <CardBody>
                                  <VStack spacing={2} align="stretch">
                                    <FormControl>
                                      <FormLabel fontSize="xs">Date</FormLabel>
                                      <Input size="sm" type="date" />
                                    </FormControl>
                                    <FormControl>
                                      <FormLabel fontSize="xs">Notes</FormLabel>
                                      <Textarea size="sm" rows={2} placeholder="Snehana and Swedana preparation..." />
                                    </FormControl>
                                    <FormControl>
                                      <FormLabel fontSize="xs">Preparatory Medicines</FormLabel>
                                      <VStack spacing={2} align="stretch">
                                        {/* Medicine Search Input */}
                                        <Box position="relative">
                                          <HStack spacing={2}>
                                            <Input 
                                              size="sm" 
                                              placeholder="Search medicine (e.g., Panchatikta Ghrita)..." 
                                              value={medicineSearchTerm['virechana-purva'] || ''}
                                              onChange={(e) => handleMedicineSearch('virechana-purva', e.target.value)}
                                              flex={1}
                                            />
                                            <Button 
                                              size="sm" 
                                              colorScheme="red" 
                                              onClick={() => addMedicineToSubcategory('virechana-purva', { name: medicineSearchTerm['virechana-purva'] })}
                                              isDisabled={!medicineSearchTerm['virechana-purva']}
                                            >
                                              Add
                                            </Button>
                                          </HStack>
                                          
                                          {/* Medicine Search Dropdown */}
                                          {showMedicineDropdown['virechana-purva'] && medicineSearchResults['virechana-purva']?.length > 0 && (
                                            <Box 
                                              position="absolute" 
                                              top="100%" 
                                              left={0} 
                                              right={0} 
                                              bg="white" 
                                              border="1px solid" 
                                              borderColor="red.200" 
                                              borderRadius="md" 
                                              boxShadow="lg" 
                                              zIndex={1000}
                                              maxH="200px"
                                              overflowY="auto"
                                            >
                                              {medicineSearchResults['virechana-purva']?.map((medicine) => (
                                                <Box 
                                                  key={medicine.id}
                                                  p={2}
                                                  cursor="pointer"
                                                  _hover={{ bg: "red.50" }}
                                                  onClick={() => addMedicineToSubcategory('virechana-purva', medicine)}
                                                >
                                                  <Text fontSize="sm" fontWeight="semibold">{medicine.name}</Text>
                                                  <Text fontSize="xs" color="gray.600">
                                                    {medicine.type} • {medicine.category} • {medicine.dosage}
                                                  </Text>
                                                </Box>
                                              ))}
                                            </Box>
                                          )}
                                        </Box>

                                        {/* Added Medicines List */}
                                        {selectedMedicines['virechana-purva']?.map((medicine) => (
                                          <Card key={medicine.id} size="sm" variant="outline" bg="red.25">
                                            <CardBody p={2}>
                                              <VStack spacing={2} align="stretch">
                                                <HStack justify="space-between">
                                                  <Text fontSize="sm" fontWeight="semibold" color="red.700">
                                                    {medicine.name}
                                                  </Text>
                                                  <IconButton 
                                                    size="xs" 
                                                    icon={<X size={12} />} 
                                                    colorScheme="red" 
                                                    variant="ghost"
                                                    onClick={() => removeMedicineFromSubcategory('virechana-purva', medicine.id)}
                                                  />
                                                </HStack>
                                                <SimpleGrid columns={3} spacing={2}>
                                                  <FormControl>
                                                    <FormLabel fontSize="xs">Dosage</FormLabel>
                                                    <Input 
                                                      size="xs" 
                                                      placeholder="1-2 tsp"
                                                      value={medicine.dosage}
                                                      onChange={(e) => updateMedicineDetails('virechana-purva', medicine.id, 'dosage', e.target.value)}
                                                    />
                                                  </FormControl>
                                                  <FormControl>
                                                    <FormLabel fontSize="xs">Timing</FormLabel>
                                                    <Select 
                                                      size="xs" 
                                                      placeholder="Select"
                                                      value={medicine.timing}
                                                      onChange={(e) => updateMedicineDetails('virechana-purva', medicine.id, 'timing', e.target.value)}
                                                    >
                                                      <option value="morning">Morning</option>
                                                      <option value="evening">Evening</option>
                                                      <option value="empty-stomach">Empty Stomach</option>
                                                    </Select>
                                                  </FormControl>
                                                  <FormControl>
                                                    <FormLabel fontSize="xs">Duration</FormLabel>
                                                    <Input 
                                                      size="xs" 
                                                      placeholder="3-5 days"
                                                      value={medicine.duration}
                                                      onChange={(e) => updateMedicineDetails('virechana-purva', medicine.id, 'duration', e.target.value)}
                                                    />
                                                  </FormControl>
                                                </SimpleGrid>
                                                <FormControl>
                                                  <FormLabel fontSize="xs">Notes</FormLabel>
                                                  <Textarea 
                                                    size="xs" 
                                                    rows={1}
                                                    placeholder="For Snehana preparation..."
                                                    value={medicine.notes}
                                                    onChange={(e) => updateMedicineDetails('virechana-purva', medicine.id, 'notes', e.target.value)}
                                                  />
                                                </FormControl>
                                              </VStack>
                                            </CardBody>
                                          </Card>
                                        ))}

                                        {selectedMedicines['virechana-purva']?.length === 0 && (
                                          <Text fontSize="xs" color="gray.500" textAlign="center">
                                            No medicines added. Search and add above.
                                          </Text>
                                        )}
                                      </VStack>
                                    </FormControl>
                                  </VStack>
                                </CardBody>
                              </Card>

                              {/* Pradhana Karma */}
                              <Card size="sm" variant="outline">
                                <CardHeader py={2}>
                                  <Text fontSize="sm" fontWeight="bold" color="red.700">
                                    2. Pradhana Karma
                                  </Text>
                                </CardHeader>
                                <CardBody>
                                  <VStack spacing={2} align="stretch">
                                    <FormControl>
                                      <FormLabel fontSize="xs">Date</FormLabel>
                                      <Input size="sm" type="date" />
                                    </FormControl>
                                    <FormControl>
                                      <FormLabel fontSize="xs">Notes</FormLabel>
                                      <Textarea size="sm" rows={2} placeholder="Purgative medicine administered..." />
                                    </FormControl>
                                    <FormControl>
                                      <FormLabel fontSize="xs">Purgative Medicines</FormLabel>
                                      <VStack spacing={2} align="stretch">
                                        {/* Medicine Search Input */}
                                        <Box position="relative">
                                          <HStack spacing={2}>
                                            <Input 
                                              size="sm" 
                                              placeholder="Search purgative (e.g., Trivrit Lehya, Castor Oil)..." 
                                              value={medicineSearchTerm['virechana-pradhana'] || ''}
                                              onChange={(e) => handleMedicineSearch('virechana-pradhana', e.target.value)}
                                              flex={1}
                                            />
                                            <Button 
                                              size="sm" 
                                              colorScheme="red" 
                                              onClick={() => addMedicineToSubcategory('virechana-pradhana', { name: medicineSearchTerm['virechana-pradhana'] })}
                                              isDisabled={!medicineSearchTerm['virechana-pradhana']}
                                            >
                                              Add
                                            </Button>
                                          </HStack>
                                          
                                          {/* Medicine Search Dropdown */}
                                          {showMedicineDropdown['virechana-pradhana'] && medicineSearchResults['virechana-pradhana']?.length > 0 && (
                                            <Box 
                                              position="absolute" 
                                              top="100%" 
                                              left={0} 
                                              right={0} 
                                              bg="white" 
                                              border="1px solid" 
                                              borderColor="red.200" 
                                              borderRadius="md" 
                                              boxShadow="lg" 
                                              zIndex={1000}
                                              maxH="200px"
                                              overflowY="auto"
                                            >
                                              {medicineSearchResults['virechana-pradhana']?.map((medicine) => (
                                                <Box 
                                                  key={medicine.id}
                                                  p={2}
                                                  cursor="pointer"
                                                  _hover={{ bg: "red.50" }}
                                                  onClick={() => addMedicineToSubcategory('virechana-pradhana', medicine)}
                                                >
                                                  <Text fontSize="sm" fontWeight="semibold">{medicine.name}</Text>
                                                  <Text fontSize="xs" color="gray.600">
                                                    {medicine.type} • {medicine.category} • {medicine.dosage}
                                                  </Text>
                                                </Box>
                                              ))}
                                            </Box>
                                          )}
                                        </Box>

                                        {/* Added Medicines List */}
                                        {selectedMedicines['virechana-pradhana']?.map((medicine) => (
                                          <Card key={medicine.id} size="sm" variant="outline" bg="red.25">
                                            <CardBody p={2}>
                                              <VStack spacing={2} align="stretch">
                                                <HStack justify="space-between">
                                                  <Text fontSize="sm" fontWeight="semibold" color="red.700">
                                                    {medicine.name}
                                                  </Text>
                                                  <IconButton 
                                                    size="xs" 
                                                    icon={<X size={12} />} 
                                                    colorScheme="red" 
                                                    variant="ghost"
                                                    onClick={() => removeMedicineFromSubcategory('virechana-pradhana', medicine.id)}
                                                  />
                                                </HStack>
                                                <SimpleGrid columns={3} spacing={2}>
                                                  <FormControl>
                                                    <FormLabel fontSize="xs">Dosage</FormLabel>
                                                    <Input 
                                                      size="xs" 
                                                      placeholder="15-30ml"
                                                      value={medicine.dosage}
                                                      onChange={(e) => updateMedicineDetails('virechana-pradhana', medicine.id, 'dosage', e.target.value)}
                                                    />
                                                  </FormControl>
                                                  <FormControl>
                                                    <FormLabel fontSize="xs">Timing</FormLabel>
                                                    <Select 
                                                      size="xs" 
                                                      placeholder="Select"
                                                      value={medicine.timing}
                                                      onChange={(e) => updateMedicineDetails('virechana-pradhana', medicine.id, 'timing', e.target.value)}
                                                    >
                                                      <option value="early-morning">Early Morning</option>
                                                      <option value="empty-stomach">Empty Stomach</option>
                                                      <option value="with-warm-water">With Warm Water</option>
                                                    </Select>
                                                  </FormControl>
                                                  <FormControl>
                                                    <FormLabel fontSize="xs">Duration</FormLabel>
                                                    <Input 
                                                      size="xs" 
                                                      placeholder="1 day"
                                                      value={medicine.duration}
                                                      onChange={(e) => updateMedicineDetails('virechana-pradhana', medicine.id, 'duration', e.target.value)}
                                                    />
                                                  </FormControl>
                                                </SimpleGrid>
                                                <FormControl>
                                                  <FormLabel fontSize="xs">Administration Notes</FormLabel>
                                                  <Textarea 
                                                    size="xs" 
                                                    rows={1}
                                                    placeholder="With warm water, monitor patient response..."
                                                    value={medicine.notes}
                                                    onChange={(e) => updateMedicineDetails('virechana-pradhana', medicine.id, 'notes', e.target.value)}
                                                  />
                                                </FormControl>
                                              </VStack>
                                            </CardBody>
                                          </Card>
                                        ))}

                                        {selectedMedicines['virechana-pradhana']?.length === 0 && (
                                          <Card size="sm" variant="outline" bg="red.50">
                                            <CardBody p={2}>
                                              <Text fontSize="xs" color="red.600" textAlign="center">
                                                💡 Common: Trivrit Lehya (10-20g), Castor Oil (15-30ml)
                                              </Text>
                                            </CardBody>
                                          </Card>
                                        )}
                                      </VStack>
                                    </FormControl>
                                  </VStack>
                                </CardBody>
                              </Card>

                              {/* Pashchat Karma */}
                              <Card size="sm" variant="outline">
                                <CardHeader py={2}>
                                  <Text fontSize="sm" fontWeight="bold" color="red.700">
                                    3. Pashchat Karma
                                  </Text>
                                </CardHeader>
                                <CardBody>
                                  <VStack spacing={2} align="stretch">
                                    <FormControl>
                                      <FormLabel fontSize="xs">Date</FormLabel>
                                      <Input size="sm" type="date" />
                                    </FormControl>
                                    <FormControl>
                                      <FormLabel fontSize="xs">Notes</FormLabel>
                                      <Textarea size="sm" rows={2} placeholder="Post-treatment recovery and diet..." />
                                    </FormControl>
                                    <FormControl>
                                      <FormLabel fontSize="xs">Recovery Medicines</FormLabel>
                                      <VStack spacing={2} align="stretch">
                                        {/* Medicine Search Input */}
                                        <Box position="relative">
                                          <HStack spacing={2}>
                                            <Input 
                                              size="sm" 
                                              placeholder="Search recovery medicine (e.g., Guduchi Satva)..." 
                                              value={medicineSearchTerm['virechana-pashchat'] || ''}
                                              onChange={(e) => handleMedicineSearch('virechana-pashchat', e.target.value)}
                                              flex={1}
                                            />
                                            <Button 
                                              size="sm" 
                                              colorScheme="red" 
                                              onClick={() => addMedicineToSubcategory('virechana-pashchat', { name: medicineSearchTerm['virechana-pashchat'] })}
                                              isDisabled={!medicineSearchTerm['virechana-pashchat']}
                                            >
                                              Add
                                            </Button>
                                          </HStack>
                                          
                                          {/* Medicine Search Dropdown */}
                                          {showMedicineDropdown['virechana-pashchat'] && medicineSearchResults['virechana-pashchat']?.length > 0 && (
                                            <Box 
                                              position="absolute" 
                                              top="100%" 
                                              left={0} 
                                              right={0} 
                                              bg="white" 
                                              border="1px solid" 
                                              borderColor="red.200" 
                                              borderRadius="md" 
                                              boxShadow="lg" 
                                              zIndex={1000}
                                              maxH="200px"
                                              overflowY="auto"
                                            >
                                              {medicineSearchResults['virechana-pashchat']?.map((medicine) => (
                                                <Box 
                                                  key={medicine.id}
                                                  p={2}
                                                  cursor="pointer"
                                                  _hover={{ bg: "red.50" }}
                                                  onClick={() => addMedicineToSubcategory('virechana-pashchat', medicine)}
                                                >
                                                  <Text fontSize="sm" fontWeight="semibold">{medicine.name}</Text>
                                                  <Text fontSize="xs" color="gray.600">
                                                    {medicine.type} • {medicine.category} • {medicine.dosage}
                                                  </Text>
                                                </Box>
                                              ))}
                                            </Box>
                                          )}
                                        </Box>

                                        {/* Added Medicines List */}
                                        {selectedMedicines['virechana-pashchat']?.map((medicine) => (
                                          <Card key={medicine.id} size="sm" variant="outline" bg="green.25">
                                            <CardBody p={2}>
                                              <VStack spacing={2} align="stretch">
                                                <HStack justify="space-between">
                                                  <Text fontSize="sm" fontWeight="semibold" color="green.700">
                                                    {medicine.name}
                                                  </Text>
                                                  <IconButton 
                                                    size="xs" 
                                                    icon={<X size={12} />} 
                                                    colorScheme="red" 
                                                    variant="ghost"
                                                    onClick={() => removeMedicineFromSubcategory('virechana-pashchat', medicine.id)}
                                                  />
                                                </HStack>
                                                <SimpleGrid columns={3} spacing={2}>
                                                  <FormControl>
                                                    <FormLabel fontSize="xs">Dosage</FormLabel>
                                                    <Input 
                                                      size="xs" 
                                                      placeholder="1-2g"
                                                      value={medicine.dosage}
                                                      onChange={(e) => updateMedicineDetails('virechana-pashchat', medicine.id, 'dosage', e.target.value)}
                                                    />
                                                  </FormControl>
                                                  <FormControl>
                                                    <FormLabel fontSize="xs">Timing</FormLabel>
                                                    <Select 
                                                      size="xs" 
                                                      placeholder="Select"
                                                      value={medicine.timing}
                                                      onChange={(e) => updateMedicineDetails('virechana-pashchat', medicine.id, 'timing', e.target.value)}
                                                    >
                                                      <option value="after-food">After Food</option>
                                                      <option value="morning">Morning</option>
                                                      <option value="evening">Evening</option>
                                                    </Select>
                                                  </FormControl>
                                                  <FormControl>
                                                    <FormLabel fontSize="xs">Duration</FormLabel>
                                                    <Input 
                                                      size="xs" 
                                                      placeholder="5-7 days"
                                                      value={medicine.duration}
                                                      onChange={(e) => updateMedicineDetails('virechana-pashchat', medicine.id, 'duration', e.target.value)}
                                                    />
                                                  </FormControl>
                                                </SimpleGrid>
                                                <FormControl>
                                                  <FormLabel fontSize="xs">Recovery Notes</FormLabel>
                                                  <Textarea 
                                                    size="xs" 
                                                    rows={1}
                                                    placeholder="For digestive health restoration..."
                                                    value={medicine.notes}
                                                    onChange={(e) => updateMedicineDetails('virechana-pashchat', medicine.id, 'notes', e.target.value)}
                                                  />
                                                </FormControl>
                                              </VStack>
                                            </CardBody>
                                          </Card>
                                        ))}

                                        {selectedMedicines['virechana-pashchat']?.length === 0 && (
                                          <Text fontSize="xs" color="gray.500" textAlign="center">
                                            No recovery medicines added yet.
                                          </Text>
                                        )}
                                      </VStack>
                                    </FormControl>
                                  </VStack>
                                </CardBody>
                              </Card>
                            </SimpleGrid>
                          </Box>
                        </VStack>
                      </CardBody>
                    </Card>
                  )}

                  {/* Basti Treatment */}
                  {(selectedPatient.panchakarma?.includes('Basti') || selectedPatient.panchkarmas?.some(p => p.category === 'Basti')) && (
                    <Card variant="outline" borderColor="blue.300">
                      <CardHeader bg="blue.100" py={3}>
                        <HStack justify="space-between">
                          <Text fontSize="lg" fontWeight="bold" color="blue.700">
                            🌊 Basti (Medicated Enema)
                          </Text>
                          <Badge colorScheme="blue">Active</Badge>
                        </HStack>
                      </CardHeader>
                      <CardBody>
                        <VStack spacing={4} align="stretch">
                          <Box>
                            <Text fontSize="md" fontWeight="semibold" mb={3} color="blue.600">
                              Basti Protocol Schedule:
                            </Text>
                            
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                              {/* Niruha Basti */}
                              <Card size="sm" variant="outline">
                                <CardHeader py={2}>
                                  <Text fontSize="sm" fontWeight="bold" color="blue.700">
                                    Niruha Basti (Cleansing)
                                  </Text>
                                </CardHeader>
                                <CardBody>
                                  <VStack spacing={2} align="stretch">
                                    <FormControl>
                                      <FormLabel fontSize="xs">Schedule Days</FormLabel>
                                      <Input size="sm" placeholder="Day 1, 3, 5, 7..." />
                                    </FormControl>
                                    <FormControl>
                                      <FormLabel fontSize="xs">Formulation</FormLabel>
                                      <Textarea size="sm" rows={2} placeholder="Dashamoola kwatha, honey, oil..." />
                                    </FormControl>
                                    <FormControl>
                                      <FormLabel fontSize="xs">Medicines Used</FormLabel>
                                      <VStack spacing={2} align="stretch">
                                        {/* Medicine Search Input */}
                                        <Box position="relative">
                                          <HStack spacing={2}>
                                            <Input 
                                              size="sm" 
                                              placeholder="Search Basti medicine (e.g., Dashamoola Kwatha)..." 
                                              value={medicineSearchTerm['basti-niruha'] || ''}
                                              onChange={(e) => handleMedicineSearch('basti-niruha', e.target.value)}
                                              flex={1}
                                            />
                                            <Button 
                                              size="sm" 
                                              colorScheme="blue" 
                                              onClick={() => addMedicineToSubcategory('basti-niruha', { name: medicineSearchTerm['basti-niruha'] })}
                                              isDisabled={!medicineSearchTerm['basti-niruha']}
                                            >
                                              Add
                                            </Button>
                                          </HStack>
                                          
                                          {/* Medicine Search Dropdown */}
                                          {showMedicineDropdown['basti-niruha'] && medicineSearchResults['basti-niruha']?.length > 0 && (
                                            <Box 
                                              position="absolute" 
                                              top="100%" 
                                              left={0} 
                                              right={0} 
                                              bg="white" 
                                              border="1px solid" 
                                              borderColor="blue.200" 
                                              borderRadius="md" 
                                              boxShadow="lg" 
                                              zIndex={1000}
                                              maxH="200px"
                                              overflowY="auto"
                                            >
                                              {medicineSearchResults['basti-niruha']?.map((medicine) => (
                                                <Box 
                                                  key={medicine.id}
                                                  p={2}
                                                  cursor="pointer"
                                                  _hover={{ bg: "blue.50" }}
                                                  onClick={() => addMedicineToSubcategory('basti-niruha', medicine)}
                                                >
                                                  <Text fontSize="sm" fontWeight="semibold">{medicine.name}</Text>
                                                  <Text fontSize="xs" color="gray.600">
                                                    {medicine.type} • {medicine.category} • {medicine.dosage}
                                                  </Text>
                                                </Box>
                                              ))}
                                            </Box>
                                          )}
                                        </Box>

                                        {/* Added Medicines List */}
                                        {selectedMedicines['basti-niruha']?.map((medicine) => (
                                          <Card key={medicine.id} size="sm" variant="outline" bg="blue.25">
                                            <CardBody p={2}>
                                              <VStack spacing={2} align="stretch">
                                                <HStack justify="space-between">
                                                  <Text fontSize="sm" fontWeight="semibold" color="blue.700">
                                                    {medicine.name}
                                                  </Text>
                                                  <IconButton 
                                                    size="xs" 
                                                    icon={<X size={12} />} 
                                                    colorScheme="red" 
                                                    variant="ghost"
                                                    onClick={() => removeMedicineFromSubcategory('basti-niruha', medicine.id)}
                                                  />
                                                </HStack>
                                                <SimpleGrid columns={3} spacing={2}>
                                                  <FormControl>
                                                    <FormLabel fontSize="xs">Quantity</FormLabel>
                                                    <Input 
                                                      size="xs" 
                                                      placeholder="50ml"
                                                      value={medicine.dosage}
                                                      onChange={(e) => updateMedicineDetails('basti-niruha', medicine.id, 'dosage', e.target.value)}
                                                    />
                                                  </FormControl>
                                                  <FormControl>
                                                    <FormLabel fontSize="xs">Temperature</FormLabel>
                                                    <Select 
                                                      size="xs" 
                                                      placeholder="Select"
                                                      value={medicine.timing}
                                                      onChange={(e) => updateMedicineDetails('basti-niruha', medicine.id, 'timing', e.target.value)}
                                                    >
                                                      <option value="warm">Warm</option>
                                                      <option value="body-temp">Body Temperature</option>
                                                      <option value="room-temp">Room Temperature</option>
                                                    </Select>
                                                  </FormControl>
                                                  <FormControl>
                                                    <FormLabel fontSize="xs">Schedule</FormLabel>
                                                    <Input 
                                                      size="xs" 
                                                      placeholder="Day 1,3,5"
                                                      value={medicine.duration}
                                                      onChange={(e) => updateMedicineDetails('basti-niruha', medicine.id, 'duration', e.target.value)}
                                                    />
                                                  </FormControl>
                                                </SimpleGrid>
                                                <FormControl>
                                                  <FormLabel fontSize="xs">Preparation Notes</FormLabel>
                                                  <Textarea 
                                                    size="xs" 
                                                    rows={1}
                                                    placeholder="Mix with honey, warm to body temperature..."
                                                    value={medicine.notes}
                                                    onChange={(e) => updateMedicineDetails('basti-niruha', medicine.id, 'notes', e.target.value)}
                                                  />
                                                </FormControl>
                                              </VStack>
                                            </CardBody>
                                          </Card>
                                        ))}

                                        {selectedMedicines['basti-niruha']?.length === 0 && (
                                          <Card size="sm" variant="outline" bg="blue.50">
                                            <CardBody p={2}>
                                              <Text fontSize="xs" color="blue.600" textAlign="center">
                                                💡 Common: Dashamoola Kwatha, Honey, Medicated Oil
                                              </Text>
                                            </CardBody>
                                          </Card>
                                        )}
                                      </VStack>
                                    </FormControl>
                                  </VStack>
                                </CardBody>
                              </Card>

                              {/* Anuvasana Basti */}
                              <Card size="sm" variant="outline">
                                <CardHeader py={2}>
                                  <Text fontSize="sm" fontWeight="bold" color="blue.700">
                                    Anuvasana Basti (Oil Enema)
                                  </Text>
                                </CardHeader>
                                <CardBody>
                                  <VStack spacing={2} align="stretch">
                                    <FormControl>
                                      <FormLabel fontSize="xs">Schedule Days</FormLabel>
                                      <Input size="sm" placeholder="Day 2, 4, 6, 8..." />
                                    </FormControl>
                                    <FormControl>
                                      <FormLabel fontSize="xs">Treatment Notes</FormLabel>
                                      <Textarea size="sm" rows={2} placeholder="Oil quantity, temperature, patient response..." />
                                    </FormControl>
                                    <FormControl>
                                      <FormLabel fontSize="xs">Medicated Oils Used</FormLabel>
                                      <VStack spacing={2} align="stretch">
                                        {/* Medicine Search Input */}
                                        <Box position="relative">
                                          <HStack spacing={2}>
                                            <Input 
                                              size="sm" 
                                              placeholder="Search oil (e.g., Til Oil, Bala Oil)..." 
                                              value={medicineSearchTerm['basti-anuvasana'] || ''}
                                              onChange={(e) => handleMedicineSearch('basti-anuvasana', e.target.value)}
                                              flex={1}
                                            />
                                            <Button 
                                              size="sm" 
                                              colorScheme="blue" 
                                              onClick={() => addMedicineToSubcategory('basti-anuvasana', { name: medicineSearchTerm['basti-anuvasana'] })}
                                              isDisabled={!medicineSearchTerm['basti-anuvasana']}
                                            >
                                              Add
                                            </Button>
                                          </HStack>
                                          
                                          {/* Medicine Search Dropdown */}
                                          {showMedicineDropdown['basti-anuvasana'] && medicineSearchResults['basti-anuvasana']?.length > 0 && (
                                            <Box 
                                              position="absolute" 
                                              top="100%" 
                                              left={0} 
                                              right={0} 
                                              bg="white" 
                                              border="1px solid" 
                                              borderColor="blue.200" 
                                              borderRadius="md" 
                                              boxShadow="lg" 
                                              zIndex={1000}
                                              maxH="200px"
                                              overflowY="auto"
                                            >
                                              {medicineSearchResults['basti-anuvasana']?.map((medicine) => (
                                                <Box 
                                                  key={medicine.id}
                                                  p={2}
                                                  cursor="pointer"
                                                  _hover={{ bg: "blue.50" }}
                                                  onClick={() => addMedicineToSubcategory('basti-anuvasana', medicine)}
                                                >
                                                  <Text fontSize="sm" fontWeight="semibold">{medicine.name}</Text>
                                                  <Text fontSize="xs" color="gray.600">
                                                    {medicine.type} • {medicine.category} • {medicine.dosage}
                                                  </Text>
                                                </Box>
                                              ))}
                                            </Box>
                                          )}
                                        </Box>

                                        {/* Added Medicines List */}
                                        {selectedMedicines['basti-anuvasana']?.map((medicine) => (
                                          <Card key={medicine.id} size="sm" variant="outline" bg="blue.25">
                                            <CardBody p={2}>
                                              <VStack spacing={2} align="stretch">
                                                <HStack justify="space-between">
                                                  <Text fontSize="sm" fontWeight="semibold" color="blue.700">
                                                    {medicine.name}
                                                  </Text>
                                                  <IconButton 
                                                    size="xs" 
                                                    icon={<X size={12} />} 
                                                    colorScheme="red" 
                                                    variant="ghost"
                                                    onClick={() => removeMedicineFromSubcategory('basti-anuvasana', medicine.id)}
                                                  />
                                                </HStack>
                                                <SimpleGrid columns={3} spacing={2}>
                                                  <FormControl>
                                                    <FormLabel fontSize="xs">Quantity</FormLabel>
                                                    <Input 
                                                      size="xs" 
                                                      placeholder="50-100ml"
                                                      value={medicine.dosage}
                                                      onChange={(e) => updateMedicineDetails('basti-anuvasana', medicine.id, 'dosage', e.target.value)}
                                                    />
                                                  </FormControl>
                                                  <FormControl>
                                                    <FormLabel fontSize="xs">Temperature</FormLabel>
                                                    <Select 
                                                      size="xs" 
                                                      placeholder="Select"
                                                      value={medicine.timing}
                                                      onChange={(e) => updateMedicineDetails('basti-anuvasana', medicine.id, 'timing', e.target.value)}
                                                    >
                                                      <option value="warm">Warm</option>
                                                      <option value="body-temp">Body Temperature</option>
                                                      <option value="luke-warm">Luke Warm</option>
                                                    </Select>
                                                  </FormControl>
                                                  <FormControl>
                                                    <FormLabel fontSize="xs">Schedule</FormLabel>
                                                    <Input 
                                                      size="xs" 
                                                      placeholder="Day 2,4,6"
                                                      value={medicine.duration}
                                                      onChange={(e) => updateMedicineDetails('basti-anuvasana', medicine.id, 'duration', e.target.value)}
                                                    />
                                                  </FormControl>
                                                </SimpleGrid>
                                                <FormControl>
                                                  <FormLabel fontSize="xs">Oil Preparation Notes</FormLabel>
                                                  <Textarea 
                                                    size="xs" 
                                                    rows={1}
                                                    placeholder="Warm oil, gentle administration..."
                                                    value={medicine.notes}
                                                    onChange={(e) => updateMedicineDetails('basti-anuvasana', medicine.id, 'notes', e.target.value)}
                                                  />
                                                </FormControl>
                                              </VStack>
                                            </CardBody>
                                          </Card>
                                        ))}

                                        {selectedMedicines['basti-anuvasana']?.length === 0 && (
                                          <Card size="sm" variant="outline" bg="blue.50">
                                            <CardBody p={2}>
                                              <Text fontSize="xs" color="blue.600" textAlign="center">
                                                💡 Common: Til Oil (50-100ml), Bala Oil, Ksheerabala Oil
                                              </Text>
                                            </CardBody>
                                          </Card>
                                        )}
                                      </VStack>
                                    </FormControl>
                                  </VStack>
                                </CardBody>
                              </Card>
                            </SimpleGrid>
                          </Box>
                        </VStack>
                      </CardBody>
                    </Card>
                  )}

                  {/* Nasya Treatment */}
                  {(selectedPatient.panchakarma?.includes('Nasya') || selectedPatient.panchkarmas?.some(p => p.category === 'Nasya')) && (
                    <Card variant="outline" borderColor="purple.300">
                      <CardHeader bg="purple.100" py={3}>
                        <HStack justify="space-between">
                          <Text fontSize="lg" fontWeight="bold" color="purple.700">
                            👃 Nasya (Nasal Administration)
                          </Text>
                          <Badge colorScheme="purple">Scheduled</Badge>
                        </HStack>
                      </CardHeader>
                      <CardBody>
                        <VStack spacing={4} align="stretch">
                          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                            {/* Rechana Nasya */}
                            <Card size="sm" variant="outline">
                              <CardHeader py={2}>
                                <Text fontSize="sm" fontWeight="bold" color="purple.700">
                                  Rechana Nasya
                                </Text>
                              </CardHeader>
                              <CardBody>
                                <VStack spacing={2} align="stretch">
                                  <FormControl>
                                    <FormLabel fontSize="xs">Treatment Date</FormLabel>
                                    <Input size="sm" type="date" />
                                  </FormControl>
                                  <FormControl>
                                    <FormLabel fontSize="xs">Treatment Notes</FormLabel>
                                    <Textarea size="sm" rows={2} placeholder="Nasal cleansing treatment..." />
                                  </FormControl>
                                  <FormControl>
                                    <FormLabel fontSize="xs">Nasal Medicines</FormLabel>
                                    <VStack spacing={2} align="stretch">
                                      {/* Medicine Search Input */}
                                      <Box position="relative">
                                        <HStack spacing={2}>
                                          <Input 
                                            size="sm" 
                                            placeholder="Search nasal medicine (e.g., Anu Taila)..." 
                                            value={medicineSearchTerm['nasya-rechana'] || ''}
                                            onChange={(e) => handleMedicineSearch('nasya-rechana', e.target.value)}
                                            flex={1}
                                          />
                                          <Button 
                                            size="sm" 
                                            colorScheme="purple" 
                                            onClick={() => addMedicineToSubcategory('nasya-rechana', { name: medicineSearchTerm['nasya-rechana'] })}
                                            isDisabled={!medicineSearchTerm['nasya-rechana']}
                                          >
                                            Add
                                          </Button>
                                        </HStack>
                                        
                                        {/* Medicine Search Dropdown */}
                                        {showMedicineDropdown['nasya-rechana'] && medicineSearchResults['nasya-rechana']?.length > 0 && (
                                          <Box 
                                            position="absolute" 
                                            top="100%" 
                                            left={0} 
                                            right={0} 
                                            bg="white" 
                                            border="1px solid" 
                                            borderColor="purple.200" 
                                            borderRadius="md" 
                                            boxShadow="lg" 
                                            zIndex={1000}
                                            maxH="200px"
                                            overflowY="auto"
                                          >
                                            {medicineSearchResults['nasya-rechana']?.map((medicine) => (
                                              <Box 
                                                key={medicine.id}
                                                p={2}
                                                cursor="pointer"
                                                _hover={{ bg: "purple.50" }}
                                                onClick={() => addMedicineToSubcategory('nasya-rechana', medicine)}
                                              >
                                                <Text fontSize="sm" fontWeight="semibold">{medicine.name}</Text>
                                                <Text fontSize="xs" color="gray.600">
                                                  {medicine.type} • {medicine.category} • {medicine.dosage}
                                                </Text>
                                              </Box>
                                            ))}
                                          </Box>
                                        )}
                                      </Box>

                                      {/* Added Medicines List */}
                                      {selectedMedicines['nasya-rechana']?.map((medicine) => (
                                        <Card key={medicine.id} size="sm" variant="outline" bg="purple.25">
                                          <CardBody p={2}>
                                            <VStack spacing={2} align="stretch">
                                              <HStack justify="space-between">
                                                <Text fontSize="sm" fontWeight="semibold" color="purple.700">
                                                  {medicine.name}
                                                </Text>
                                                <IconButton 
                                                  size="xs" 
                                                  icon={<X size={12} />} 
                                                  colorScheme="red" 
                                                  variant="ghost"
                                                  onClick={() => removeMedicineFromSubcategory('nasya-rechana', medicine.id)}
                                                />
                                              </HStack>
                                              <SimpleGrid columns={3} spacing={2}>
                                                <FormControl>
                                                  <FormLabel fontSize="xs">Dosage</FormLabel>
                                                  <Input 
                                                    size="xs" 
                                                    placeholder="2-4 drops"
                                                    value={medicine.dosage}
                                                    onChange={(e) => updateMedicineDetails('nasya-rechana', medicine.id, 'dosage', e.target.value)}
                                                  />
                                                </FormControl>
                                                <FormControl>
                                                  <FormLabel fontSize="xs">Nostril</FormLabel>
                                                  <Select 
                                                    size="xs" 
                                                    placeholder="Select"
                                                    value={medicine.timing}
                                                    onChange={(e) => updateMedicineDetails('nasya-rechana', medicine.id, 'timing', e.target.value)}
                                                  >
                                                    <option value="both">Both Nostrils</option>
                                                    <option value="left">Left Nostril</option>
                                                    <option value="right">Right Nostril</option>
                                                    <option value="alternate">Alternative</option>
                                                  </Select>
                                                </FormControl>
                                                <FormControl>
                                                  <FormLabel fontSize="xs">Duration</FormLabel>
                                                  <Input 
                                                    size="xs" 
                                                    placeholder="3-7 days"
                                                    value={medicine.duration}
                                                    onChange={(e) => updateMedicineDetails('nasya-rechana', medicine.id, 'duration', e.target.value)}
                                                  />
                                                </FormControl>
                                              </SimpleGrid>
                                              <FormControl>
                                                <FormLabel fontSize="xs">Administration Notes</FormLabel>
                                                <Textarea 
                                                  size="xs" 
                                                  rows={1}
                                                  placeholder="Patient position, post-treatment care..."
                                                  value={medicine.notes}
                                                  onChange={(e) => updateMedicineDetails('nasya-rechana', medicine.id, 'notes', e.target.value)}
                                                />
                                              </FormControl>
                                            </VStack>
                                          </CardBody>
                                        </Card>
                                      ))}

                                      {selectedMedicines['nasya-rechana']?.length === 0 && (
                                        <Text fontSize="xs" color="gray.500" textAlign="center">
                                          No medicines added yet.
                                        </Text>
                                      )}
                                    </VStack>
                                  </FormControl>
                                </VStack>
                              </CardBody>
                            </Card>

                            {/* Brihana Nasya */}
                            <Card size="sm" variant="outline">
                              <CardHeader py={2}>
                                <Text fontSize="sm" fontWeight="bold" color="purple.700">
                                  Brihana Nasya
                                </Text>
                              </CardHeader>
                              <CardBody>
                                <VStack spacing={2} align="stretch">
                                  <FormControl>
                                    <FormLabel fontSize="xs">Treatment Date</FormLabel>
                                    <Input size="sm" type="date" />
                                  </FormControl>
                                  <FormControl>
                                    <FormLabel fontSize="xs">Treatment Notes</FormLabel>
                                    <Textarea size="sm" rows={2} placeholder="Nutritive nasal therapy..." />
                                  </FormControl>
                                  <FormControl>
                                    <FormLabel fontSize="xs">Nutritive Medicines</FormLabel>
                                    <VStack spacing={2} align="stretch">
                                      {/* Medicine Search Input */}
                                      <Box position="relative">
                                        <HStack spacing={2}>
                                          <Input 
                                            size="sm" 
                                            placeholder="Search nutritive medicine (e.g., Panchagavya Ghrita)..." 
                                            value={medicineSearchTerm['nasya-brihana'] || ''}
                                            onChange={(e) => handleMedicineSearch('nasya-brihana', e.target.value)}
                                            flex={1}
                                          />
                                          <Button 
                                            size="sm" 
                                            colorScheme="purple" 
                                            onClick={() => addMedicineToSubcategory('nasya-brihana', { name: medicineSearchTerm['nasya-brihana'] })}
                                            isDisabled={!medicineSearchTerm['nasya-brihana']}
                                          >
                                            Add
                                          </Button>
                                        </HStack>
                                        
                                        {/* Medicine Search Dropdown */}
                                        {showMedicineDropdown['nasya-brihana'] && medicineSearchResults['nasya-brihana']?.length > 0 && (
                                          <Box 
                                            position="absolute" 
                                            top="100%" 
                                            left={0} 
                                            right={0} 
                                            bg="white" 
                                            border="1px solid" 
                                            borderColor="purple.200" 
                                            borderRadius="md" 
                                            boxShadow="lg" 
                                            zIndex={1000}
                                            maxH="200px"
                                            overflowY="auto"
                                          >
                                            {medicineSearchResults['nasya-brihana']?.map((medicine) => (
                                              <Box 
                                                key={medicine.id}
                                                p={2}
                                                cursor="pointer"
                                                _hover={{ bg: "purple.50" }}
                                                onClick={() => addMedicineToSubcategory('nasya-brihana', medicine)}
                                              >
                                                <Text fontSize="sm" fontWeight="semibold">{medicine.name}</Text>
                                                <Text fontSize="xs" color="gray.600">
                                                  {medicine.type} • {medicine.category} • {medicine.dosage}
                                                </Text>
                                              </Box>
                                            ))}
                                          </Box>
                                        )}
                                      </Box>

                                      {/* Added Medicines List */}
                                      {selectedMedicines['nasya-brihana']?.map((medicine) => (
                                        <Card key={medicine.id} size="sm" variant="outline" bg="purple.25">
                                          <CardBody p={2}>
                                            <VStack spacing={2} align="stretch">
                                              <HStack justify="space-between">
                                                <Text fontSize="sm" fontWeight="semibold" color="purple.700">
                                                  {medicine.name}
                                                </Text>
                                                <IconButton 
                                                  size="xs" 
                                                  icon={<X size={12} />} 
                                                  colorScheme="red" 
                                                  variant="ghost"
                                                  onClick={() => removeMedicineFromSubcategory('nasya-brihana', medicine.id)}
                                                />
                                              </HStack>
                                              <SimpleGrid columns={3} spacing={2}>
                                                <FormControl>
                                                  <FormLabel fontSize="xs">Dosage</FormLabel>
                                                  <Input 
                                                    size="xs" 
                                                    placeholder="2-4 drops"
                                                    value={medicine.dosage}
                                                    onChange={(e) => updateMedicineDetails('nasya-brihana', medicine.id, 'dosage', e.target.value)}
                                                  />
                                                </FormControl>
                                                <FormControl>
                                                  <FormLabel fontSize="xs">Application</FormLabel>
                                                  <Select 
                                                    size="xs" 
                                                    placeholder="Select"
                                                    value={medicine.timing}
                                                    onChange={(e) => updateMedicineDetails('nasya-brihana', medicine.id, 'timing', e.target.value)}
                                                  >
                                                    <option value="morning">Morning</option>
                                                    <option value="evening">Evening</option>
                                                    <option value="both-times">Both Times</option>
                                                  </Select>
                                                </FormControl>
                                                <FormControl>
                                                  <FormLabel fontSize="xs">Duration</FormLabel>
                                                  <Input 
                                                    size="xs" 
                                                    placeholder="7-14 days"
                                                    value={medicine.duration}
                                                    onChange={(e) => updateMedicineDetails('nasya-brihana', medicine.id, 'duration', e.target.value)}
                                                  />
                                                </FormControl>
                                              </SimpleGrid>
                                              <FormControl>
                                                <FormLabel fontSize="xs">Nutritive Notes</FormLabel>
                                                <Textarea 
                                                  size="xs" 
                                                  rows={1}
                                                  placeholder="For brain nutrition, memory enhancement..."
                                                  value={medicine.notes}
                                                  onChange={(e) => updateMedicineDetails('nasya-brihana', medicine.id, 'notes', e.target.value)}
                                                />
                                              </FormControl>
                                            </VStack>
                                          </CardBody>
                                        </Card>
                                      ))}

                                      {selectedMedicines['nasya-brihana']?.length === 0 && (
                                        <Card size="sm" variant="outline" bg="purple.50">
                                          <CardBody p={2}>
                                            <Text fontSize="xs" color="purple.600" textAlign="center">
                                              💡 Common: Panchagavya Ghrita, Brahmi Ghrita
                                            </Text>
                                          </CardBody>
                                        </Card>
                                      )}
                                    </VStack>
                                  </FormControl>
                                </VStack>
                              </CardBody>
                            </Card>

                            {/* Shamana Nasya */}
                            <Card size="sm" variant="outline">
                              <CardHeader py={2}>
                                <Text fontSize="sm" fontWeight="bold" color="purple.700">
                                  Shamana Nasya
                                </Text>
                              </CardHeader>
                              <CardBody>
                                <VStack spacing={2} align="stretch">
                                  <FormControl>
                                    <FormLabel fontSize="xs">Treatment Date</FormLabel>
                                    <Input size="sm" type="date" />
                                  </FormControl>
                                  <FormControl>
                                    <FormLabel fontSize="xs">Treatment Notes</FormLabel>
                                    <Textarea size="sm" rows={2} placeholder="Balancing nasal therapy..." />
                                  </FormControl>
                                  <FormControl>
                                    <FormLabel fontSize="xs">Balancing Medicines</FormLabel>
                                    <VStack spacing={2} align="stretch">
                                      {/* Medicine Search Input */}
                                      <Box position="relative">
                                        <HStack spacing={2}>
                                          <Input 
                                            size="sm" 
                                            placeholder="Search balancing medicine (e.g., Shadbindu Oil)..." 
                                            value={medicineSearchTerm['nasya-shamana'] || ''}
                                            onChange={(e) => handleMedicineSearch('nasya-shamana', e.target.value)}
                                            flex={1}
                                          />
                                          <Button 
                                            size="sm" 
                                            colorScheme="purple" 
                                            onClick={() => addMedicineToSubcategory('nasya-shamana', { name: medicineSearchTerm['nasya-shamana'] })}
                                            isDisabled={!medicineSearchTerm['nasya-shamana']}
                                          >
                                            Add
                                          </Button>
                                        </HStack>
                                        
                                        {/* Medicine Search Dropdown */}
                                        {showMedicineDropdown['nasya-shamana'] && medicineSearchResults['nasya-shamana']?.length > 0 && (
                                          <Box 
                                            position="absolute" 
                                            top="100%" 
                                            left={0} 
                                            right={0} 
                                            bg="white" 
                                            border="1px solid" 
                                            borderColor="purple.200" 
                                            borderRadius="md" 
                                            boxShadow="lg" 
                                            zIndex={1000}
                                            maxH="200px"
                                            overflowY="auto"
                                          >
                                            {medicineSearchResults['nasya-shamana']?.map((medicine) => (
                                              <Box 
                                                key={medicine.id}
                                                p={2}
                                                cursor="pointer"
                                                _hover={{ bg: "purple.50" }}
                                                onClick={() => addMedicineToSubcategory('nasya-shamana', medicine)}
                                              >
                                                <Text fontSize="sm" fontWeight="semibold">{medicine.name}</Text>
                                                <Text fontSize="xs" color="gray.600">
                                                  {medicine.type} • {medicine.category} • {medicine.dosage}
                                                </Text>
                                              </Box>
                                            ))}
                                          </Box>
                                        )}
                                      </Box>

                                      {/* Added Medicines List */}
                                      {selectedMedicines['nasya-shamana']?.map((medicine) => (
                                        <Card key={medicine.id} size="sm" variant="outline" bg="purple.25">
                                          <CardBody p={2}>
                                            <VStack spacing={2} align="stretch">
                                              <HStack justify="space-between">
                                                <Text fontSize="sm" fontWeight="semibold" color="purple.700">
                                                  {medicine.name}
                                                </Text>
                                                <IconButton 
                                                  size="xs" 
                                                  icon={<X size={12} />} 
                                                  colorScheme="red" 
                                                  variant="ghost"
                                                  onClick={() => removeMedicineFromSubcategory('nasya-shamana', medicine.id)}
                                                />
                                              </HStack>
                                              <SimpleGrid columns={3} spacing={2}>
                                                <FormControl>
                                                  <FormLabel fontSize="xs">Dosage</FormLabel>
                                                  <Input 
                                                    size="xs" 
                                                    placeholder="2-4 drops"
                                                    value={medicine.dosage}
                                                    onChange={(e) => updateMedicineDetails('nasya-shamana', medicine.id, 'dosage', e.target.value)}
                                                  />
                                                </FormControl>
                                                <FormControl>
                                                  <FormLabel fontSize="xs">Frequency</FormLabel>
                                                  <Select 
                                                    size="xs" 
                                                    placeholder="Select"
                                                    value={medicine.timing}
                                                    onChange={(e) => updateMedicineDetails('nasya-shamana', medicine.id, 'timing', e.target.value)}
                                                  >
                                                    <option value="daily">Daily</option>
                                                    <option value="alternate">Alternate Days</option>
                                                    <option value="twice-daily">Twice Daily</option>
                                                  </Select>
                                                </FormControl>
                                                <FormControl>
                                                  <FormLabel fontSize="xs">Duration</FormLabel>
                                                  <Input 
                                                    size="xs" 
                                                    placeholder="5-10 days"
                                                    value={medicine.duration}
                                                    onChange={(e) => updateMedicineDetails('nasya-shamana', medicine.id, 'duration', e.target.value)}
                                                  />
                                                </FormControl>
                                              </SimpleGrid>
                                              <FormControl>
                                                <FormLabel fontSize="xs">Treatment Notes</FormLabel>
                                                <Textarea 
                                                  size="xs" 
                                                  rows={1}
                                                  placeholder="For dosha balancing, symptom relief..."
                                                  value={medicine.notes}
                                                  onChange={(e) => updateMedicineDetails('nasya-shamana', medicine.id, 'notes', e.target.value)}
                                                />
                                              </FormControl>
                                            </VStack>
                                          </CardBody>
                                        </Card>
                                      ))}

                                      {selectedMedicines['nasya-shamana']?.length === 0 && (
                                        <Text fontSize="xs" color="gray.500" textAlign="center">
                                          No balancing medicines added yet.
                                        </Text>
                                      )}
                                    </VStack>
                                  </FormControl>
                                </VStack>
                              </CardBody>
                            </Card>
                          </SimpleGrid>
                        </VStack>
                      </CardBody>
                    </Card>
                  )}

                  {/* Raktamokshana Treatment */}
                  {(selectedPatient.panchakarma?.includes('Raktamokshana') || selectedPatient.panchkarmas?.some(p => p.category === 'Raktamokshana')) && (
                    <Card variant="outline" borderColor="red.400">
                      <CardHeader bg="red.50" py={3}>
                        <HStack justify="space-between">
                          <Text fontSize="lg" fontWeight="bold" color="red.700">
                            🩸 Raktamokshana (Blood Purification)
                          </Text>
                          <Badge colorScheme="red">Active</Badge>
                        </HStack>
                      </CardHeader>
                      <CardBody>
                        <VStack spacing={4} align="stretch">
                          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                            {/* Jalauka (Leech Therapy) */}
                            <Card size="sm" variant="outline">
                              <CardHeader py={2}>
                                <Text fontSize="sm" fontWeight="bold" color="red.700">
                                  Jalauka (Leech Therapy)
                                </Text>
                              </CardHeader>
                              <CardBody>
                                <VStack spacing={2} align="stretch">
                                  <FormControl>
                                    <FormLabel fontSize="xs">Treatment Date & Time</FormLabel>
                                    <HStack>
                                      <Input size="sm" type="date" />
                                      <Input size="sm" type="time" />
                                    </HStack>
                                  </FormControl>
                                  <FormControl>
                                    <FormLabel fontSize="xs">Treatment Location</FormLabel>
                                    <Input size="sm" placeholder="Body part to treat" />
                                  </FormControl>
                                  <FormControl>
                                    <FormLabel fontSize="xs">Treatment Notes</FormLabel>
                                    <Textarea size="sm" rows={2} placeholder="Leech application details, duration..." />
                                  </FormControl>
                                  <FormControl>
                                    <FormLabel fontSize="xs">Pre-treatment Medicines</FormLabel>
                                    <VStack spacing={2} align="stretch">
                                      {/* Medicine Search Input */}
                                      <Box position="relative">
                                        <HStack spacing={2}>
                                          <Input 
                                            size="sm" 
                                            placeholder="Search pre-treatment medicine..." 
                                            value={medicineSearchTerm['raktamokshana-jalauka'] || ''}
                                            onChange={(e) => handleMedicineSearch('raktamokshana-jalauka', e.target.value)}
                                            flex={1}
                                          />
                                          <Button 
                                            size="sm" 
                                            colorScheme="red" 
                                            onClick={() => addMedicineToSubcategory('raktamokshana-jalauka', { name: medicineSearchTerm['raktamokshana-jalauka'] })}
                                            isDisabled={!medicineSearchTerm['raktamokshana-jalauka']}
                                          >
                                            Add
                                          </Button>
                                        </HStack>
                                        
                                        {/* Medicine Search Dropdown */}
                                        {showMedicineDropdown['raktamokshana-jalauka'] && medicineSearchResults['raktamokshana-jalauka']?.length > 0 && (
                                          <Box 
                                            position="absolute" 
                                            top="100%" 
                                            left={0} 
                                            right={0} 
                                            bg="white" 
                                            border="1px solid" 
                                            borderColor="red.200" 
                                            borderRadius="md" 
                                            boxShadow="lg" 
                                            zIndex={1000}
                                            maxH="200px"
                                            overflowY="auto"
                                          >
                                            {medicineSearchResults['raktamokshana-jalauka']?.map((medicine) => (
                                              <Box 
                                                key={medicine.id}
                                                p={2}
                                                cursor="pointer"
                                                _hover={{ bg: "red.50" }}
                                                onClick={() => addMedicineToSubcategory('raktamokshana-jalauka', medicine)}
                                              >
                                                <Text fontSize="sm" fontWeight="semibold">{medicine.name}</Text>
                                                <Text fontSize="xs" color="gray.600">
                                                  {medicine.type} • {medicine.category} • {medicine.dosage}
                                                </Text>
                                              </Box>
                                            ))}
                                          </Box>
                                        )}
                                      </Box>

                                      {/* Added Medicines List */}
                                      {selectedMedicines['raktamokshana-jalauka']?.map((medicine) => (
                                        <Card key={medicine.id} size="sm" variant="outline" bg="red.25">
                                          <CardBody p={2}>
                                            <VStack spacing={2} align="stretch">
                                              <HStack justify="space-between">
                                                <Text fontSize="sm" fontWeight="semibold" color="red.700">
                                                  {medicine.name}
                                                </Text>
                                                <IconButton 
                                                  size="xs" 
                                                  icon={<X size={12} />} 
                                                  colorScheme="red" 
                                                  variant="ghost"
                                                  onClick={() => removeMedicineFromSubcategory('raktamokshana-jalauka', medicine.id)}
                                                />
                                              </HStack>
                                              <SimpleGrid columns={3} spacing={2}>
                                                <FormControl>
                                                  <FormLabel fontSize="xs">Dosage</FormLabel>
                                                  <Input 
                                                    size="xs" 
                                                    placeholder="As needed"
                                                    value={medicine.dosage}
                                                    onChange={(e) => updateMedicineDetails('raktamokshana-jalauka', medicine.id, 'dosage', e.target.value)}
                                                  />
                                                </FormControl>
                                                <FormControl>
                                                  <FormLabel fontSize="xs">Application</FormLabel>
                                                  <Select 
                                                    size="xs" 
                                                    placeholder="Select"
                                                    value={medicine.timing}
                                                    onChange={(e) => updateMedicineDetails('raktamokshana-jalauka', medicine.id, 'timing', e.target.value)}
                                                  >
                                                    <option value="pre-treatment">Pre-treatment</option>
                                                    <option value="post-treatment">Post-treatment</option>
                                                    <option value="both">Both</option>
                                                  </Select>
                                                </FormControl>
                                                <FormControl>
                                                  <FormLabel fontSize="xs">Purpose</FormLabel>
                                                  <Input 
                                                    size="xs" 
                                                    placeholder="Antiseptic"
                                                    value={medicine.duration}
                                                    onChange={(e) => updateMedicineDetails('raktamokshana-jalauka', medicine.id, 'duration', e.target.value)}
                                                  />
                                                </FormControl>
                                              </SimpleGrid>
                                              <FormControl>
                                                <FormLabel fontSize="xs">Application Notes</FormLabel>
                                                <Textarea 
                                                  size="xs" 
                                                  rows={1}
                                                  placeholder="Antiseptic preparation, wound care..."
                                                  value={medicine.notes}
                                                  onChange={(e) => updateMedicineDetails('raktamokshana-jalauka', medicine.id, 'notes', e.target.value)}
                                                />
                                              </FormControl>
                                            </VStack>
                                          </CardBody>
                                        </Card>
                                      ))}

                                      {selectedMedicines['raktamokshana-jalauka']?.length === 0 && (
                                        <Text fontSize="xs" color="gray.500" textAlign="center">
                                          No medicines added yet.
                                        </Text>
                                      )}
                                    </VStack>
                                  </FormControl>
                                </VStack>
                              </CardBody>
                            </Card>

                            {/* Prachhana (Scarification) */}
                            <Card size="sm" variant="outline">
                              <CardHeader py={2}>
                                <Text fontSize="sm" fontWeight="bold" color="red.700">
                                  Prachhana (Scarification)
                                </Text>
                              </CardHeader>
                              <CardBody>
                                <VStack spacing={2} align="stretch">
                                  <FormControl>
                                    <FormLabel fontSize="xs">Treatment Date & Time</FormLabel>
                                    <HStack>
                                      <Input size="sm" type="date" />
                                      <Input size="sm" type="time" />
                                    </HStack>
                                  </FormControl>
                                  <FormControl>
                                    <FormLabel fontSize="xs">Treatment Location</FormLabel>
                                    <Input size="sm" placeholder="Body part for scarification" />
                                  </FormControl>
                                  <FormControl>
                                    <FormLabel fontSize="xs">Treatment Notes</FormLabel>
                                    <Textarea size="sm" rows={2} placeholder="Scarification procedure details, patient response..." />
                                  </FormControl>
                                  <FormControl>
                                    <FormLabel fontSize="xs">Treatment Medicines</FormLabel>
                                    <VStack spacing={2} align="stretch">
                                      {/* Medicine Search Input */}
                                      <Box position="relative">
                                        <HStack spacing={2}>
                                          <Input 
                                            size="sm" 
                                            placeholder="Search treatment medicine..." 
                                            value={medicineSearchTerm['raktamokshana-prachhana'] || ''}
                                            onChange={(e) => handleMedicineSearch('raktamokshana-prachhana', e.target.value)}
                                            flex={1}
                                          />
                                          <Button 
                                            size="sm" 
                                            colorScheme="red" 
                                            onClick={() => addMedicineToSubcategory('raktamokshana-prachhana', { name: medicineSearchTerm['raktamokshana-prachhana'] })}
                                            isDisabled={!medicineSearchTerm['raktamokshana-prachhana']}
                                          >
                                            Add
                                          </Button>
                                        </HStack>
                                        
                                        {/* Medicine Search Dropdown */}
                                        {showMedicineDropdown['raktamokshana-prachhana'] && medicineSearchResults['raktamokshana-prachhana']?.length > 0 && (
                                          <Box 
                                            position="absolute" 
                                            top="100%" 
                                            left={0} 
                                            right={0} 
                                            bg="white" 
                                            border="1px solid" 
                                            borderColor="red.200" 
                                            borderRadius="md" 
                                            boxShadow="lg" 
                                            zIndex={1000}
                                            maxH="200px"
                                            overflowY="auto"
                                          >
                                            {medicineSearchResults['raktamokshana-prachhana']?.map((medicine) => (
                                              <Box 
                                                key={medicine.id}
                                                p={2}
                                                cursor="pointer"
                                                _hover={{ bg: "red.50" }}
                                                onClick={() => addMedicineToSubcategory('raktamokshana-prachhana', medicine)}
                                              >
                                                <Text fontSize="sm" fontWeight="semibold">{medicine.name}</Text>
                                                <Text fontSize="xs" color="gray.600">
                                                  {medicine.type} • {medicine.category} • {medicine.dosage}
                                                </Text>
                                              </Box>
                                            ))}
                                          </Box>
                                        )}
                                      </Box>

                                      {/* Added Medicines List */}
                                      {selectedMedicines['raktamokshana-prachhana']?.map((medicine) => (
                                        <Card key={medicine.id} size="sm" variant="outline" bg="red.25">
                                          <CardBody p={2}>
                                            <VStack spacing={2} align="stretch">
                                              <HStack justify="space-between">
                                                <Text fontSize="sm" fontWeight="semibold" color="red.700">
                                                  {medicine.name}
                                                </Text>
                                                <IconButton 
                                                  size="xs" 
                                                  icon={<X size={12} />} 
                                                  colorScheme="red" 
                                                  variant="ghost"
                                                  onClick={() => removeMedicineFromSubcategory('raktamokshana-prachhana', medicine.id)}
                                                />
                                              </HStack>
                                              <SimpleGrid columns={3} spacing={2}>
                                                <FormControl>
                                                  <FormLabel fontSize="xs">Dosage</FormLabel>
                                                  <Input 
                                                    size="xs" 
                                                    placeholder="As needed"
                                                    value={medicine.dosage}
                                                    onChange={(e) => updateMedicineDetails('raktamokshana-prachhana', medicine.id, 'dosage', e.target.value)}
                                                  />
                                                </FormControl>
                                                <FormControl>
                                                  <FormLabel fontSize="xs">Application</FormLabel>
                                                  <Select 
                                                    size="xs" 
                                                    placeholder="Select"
                                                    value={medicine.timing}
                                                    onChange={(e) => updateMedicineDetails('raktamokshana-prachhana', medicine.id, 'timing', e.target.value)}
                                                  >
                                                    <option value="pre-procedure">Pre-procedure</option>
                                                    <option value="during-procedure">During Procedure</option>
                                                    <option value="post-procedure">Post-procedure</option>
                                                  </Select>
                                                </FormControl>
                                                <FormControl>
                                                  <FormLabel fontSize="xs">Purpose</FormLabel>
                                                  <Input 
                                                    size="xs" 
                                                    placeholder="Hemostatic"
                                                    value={medicine.duration}
                                                    onChange={(e) => updateMedicineDetails('raktamokshana-prachhana', medicine.id, 'duration', e.target.value)}
                                                  />
                                                </FormControl>
                                              </SimpleGrid>
                                              <FormControl>
                                                <FormLabel fontSize="xs">Usage Notes</FormLabel>
                                                <Textarea 
                                                  size="xs" 
                                                  rows={1}
                                                  placeholder="Hemostatic agent, wound healing..."
                                                  value={medicine.notes}
                                                  onChange={(e) => updateMedicineDetails('raktamokshana-prachhana', medicine.id, 'notes', e.target.value)}
                                                />
                                              </FormControl>
                                            </VStack>
                                          </CardBody>
                                        </Card>
                                      ))}

                                      {selectedMedicines['raktamokshana-prachhana']?.length === 0 && (
                                        <Card size="sm" variant="outline" bg="red.50">
                                          <CardBody p={2}>
                                            <Text fontSize="xs" color="red.600" textAlign="center">
                                              💡 Common: Antiseptic solutions, Hemostatic agents
                                            </Text>
                                          </CardBody>
                                        </Card>
                                      )}
                                    </VStack>
                                  </FormControl>
                                </VStack>
                              </CardBody>
                            </Card>
                          </SimpleGrid>
                        </VStack>
                      </CardBody>
                    </Card>
                  )}
                </VStack>

                {/* Treatment Progress Tracker */}
                <Card variant="outline" bg="gray.50">
                  <CardHeader>
                    <Text fontSize="lg" fontWeight="bold" color="gray.700">
                      📊 Overall Treatment Progress
                    </Text>
                  </CardHeader>
                  <CardBody>
                    <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
                      <Stat>
                        <StatLabel>Days Completed</StatLabel>
                        <StatNumber color="green.600">5 / 21</StatNumber>
                        <StatHelpText>Treatment ongoing</StatHelpText>
                      </Stat>
                      <Stat>
                        <StatLabel>Treatments Given</StatLabel>
                        <StatNumber color="blue.600">12</StatNumber>
                        <StatHelpText>Sessions completed</StatHelpText>
                      </Stat>
                      <Stat>
                        <StatLabel>Patient Response</StatLabel>
                        <StatNumber color="orange.600">Good</StatNumber>
                        <StatHelpText>Improving steadily</StatHelpText>
                      </Stat>
                      <Stat>
                        <StatLabel>Next Session</StatLabel>
                        <StatNumber color="purple.600">Tomorrow</StatNumber>
                        <StatHelpText>8:00 AM</StatHelpText>
                      </Stat>
                    </SimpleGrid>
                  </CardBody>
                </Card>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button colorScheme="green" leftIcon={<FilePlus size={18} />}>
                Save Treatment Plan
              </Button>
              <Button colorScheme="blue" leftIcon={<Printer size={18} />}>
                Print Chart
              </Button>
              <Button variant="outline" onClick={onTreatmentChartClose}>
                Close
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Enhanced Progress Notes Modal */}
      <Modal isOpen={isProgressNotesOpen} onClose={onProgressNotesClose} size="6xl">
        <ModalOverlay />
        <ModalContent maxH="90vh" overflowY="auto">
          <ModalHeader>
            <VStack align="start" spacing={2}>
              <Text fontSize="xl" fontWeight="bold" color="blue.600">
                📝 Progress Chart Report - {selectedPatient?.name}
              </Text>
              <Text fontSize="sm" color="gray.600">
                IPD No: {selectedPatient?.caseId} | Room: {selectedPatient?.room} | Doctor: {selectedPatient?.doctor}
              </Text>
            </VStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedPatient && (
              <VStack spacing={6} align="stretch">
                {/* Patient Summary */}
                <Card variant="outline" bg="blue.50" borderColor="blue.200">
                  <CardBody>
                    <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
                      <Box>
                        <Text fontSize="sm" color="blue.700" fontWeight="semibold">Admission Date</Text>
                        <Text fontSize="md" fontWeight="bold">{selectedPatient.admissionDate}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="blue.700" fontWeight="semibold">Treatment Duration</Text>
                        <Text fontSize="md" fontWeight="bold">{selectedPatient.treatmentDuration || '21 days'}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="blue.700" fontWeight="semibold">Primary Treatment</Text>
                        <Text fontSize="md" fontWeight="bold">{selectedPatient.panchakarma || selectedPatient.therapy}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="blue.700" fontWeight="semibold">Total Progress Notes</Text>
                        <Text fontSize="md" fontWeight="bold">{getProgressNotesForPatient(selectedPatient.id).length}</Text>
                      </Box>
                    </SimpleGrid>
                  </CardBody>
                </Card>

                {/* Progress Entry Form */}
                <Card variant="outline" borderColor="green.300">
                  <CardHeader bg="green.100">
                    <Text fontSize="lg" fontWeight="bold" color="green.700">
                      📅 Add New Progress Entry
                    </Text>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        {/* Smart Date Selection */}
                        <FormControl isRequired>
                          <FormLabel fontSize="sm" fontWeight="semibold">
                            Treatment Date
                            <Badge ml={2} colorScheme={isCustomDate ? 'orange' : 'green'} size="sm">
                              {isCustomDate ? 'Custom' : 'Auto-Selected'}
                            </Badge>
                          </FormLabel>
                          <VStack spacing={2} align="stretch">
                            {!isCustomDate ? (
                              <Select 
                                value={currentProgressDate}
                                onChange={(e) => setCurrentProgressDate(e.target.value)}
                                bg="green.50"
                                borderColor="green.200"
                              >
                                {treatmentDates.map((dateInfo) => {
                                  const isToday = dateInfo.date === new Date().toISOString().split('T')[0];
                                  const isPast = new Date(dateInfo.date) < new Date();
                                  const statusEmoji = isToday ? '📍' : isPast ? '✅' : '📅';
                                  return (
                                    <option key={dateInfo.date} value={dateInfo.date}>
                                      {statusEmoji} Day {dateInfo.day} - {dateInfo.date} ({dateInfo.dayName})
                                    </option>
                                  );
                                })}
                              </Select>
                            ) : (
                              <Input 
                                type="date"
                                value={currentProgressDate}
                                onChange={(e) => setCurrentProgressDate(e.target.value)}
                                bg="orange.50"
                                borderColor="orange.200"
                              />
                            )}
                            <HStack>
                              <Button 
                                size="xs" 
                                variant={!isCustomDate ? 'solid' : 'outline'}
                                colorScheme="green"
                                onClick={() => {
                                  setIsCustomDate(false);
                                  // Reset to today or next available date
                                  const today = new Date().toISOString().split('T')[0];
                                  const todayInTreatment = treatmentDates.find(d => d.date === today);
                                  if (todayInTreatment) {
                                    setCurrentProgressDate(today);
                                  } else {
                                    const nextDate = treatmentDates.find(d => new Date(d.date) >= new Date()) || treatmentDates[0];
                                    if (nextDate) setCurrentProgressDate(nextDate.date);
                                  }
                                }}
                              >
                                📅 Auto Dates
                              </Button>
                              <Button 
                                size="xs" 
                                variant={isCustomDate ? 'solid' : 'outline'}
                                colorScheme="orange"
                                onClick={() => setIsCustomDate(true)}
                              >
                                ✏️ Custom Date
                              </Button>
                            </HStack>
                          </VStack>
                          <Text fontSize="xs" color="gray.600" mt={1}>
                            {!isCustomDate 
                              ? '📍 Auto-selected based on treatment schedule - easily switch between dates'
                              : '✏️ Custom date mode - choose any date for this progress entry'
                            }
                          </Text>
                        </FormControl>

                        {/* Smart Treatment Selection */}
                        <FormControl isRequired>
                          <FormLabel fontSize="sm" fontWeight="semibold">
                            Treatment Type
                            <Badge ml={2} colorScheme={isCustomTreatment ? 'orange' : 'blue'} size="sm">
                              {isCustomTreatment ? 'Custom' : 'Auto-Fetched'}
                            </Badge>
                          </FormLabel>
                          <VStack spacing={2} align="stretch">
                            {!isCustomTreatment ? (
                              <Select 
                                value={selectedTreatment}
                                onChange={(e) => setSelectedTreatment(e.target.value)}
                                bg="blue.50"
                                borderColor="blue.200"
                                placeholder="Choose from assigned treatments"
                              >
                                {availableTreatments.map((treatment) => {
                                  const categoryEmoji = {
                                    'Panchakarma': '🌿',
                                    'External Therapy': '💆',
                                    'Medication': '💊',
                                    'Lifestyle': '🧘',
                                    'Consultation': '👨‍⚕️',
                                    'Assessment': '📋'
                                  }[treatment.category] || '🏥';
                                  return (
                                    <option key={treatment.id} value={treatment.id}>
                                      {categoryEmoji} {treatment.name} ({treatment.category})
                                    </option>
                                  );
                                })}
                              </Select>
                            ) : (
                              <Input 
                                value={customTreatment}
                                onChange={(e) => setCustomTreatment(e.target.value)}
                                placeholder="Enter custom treatment name..."
                                bg="orange.50"
                                borderColor="orange.200"
                              />
                            )}
                            <HStack>
                              <Button 
                                size="xs" 
                                variant={!isCustomTreatment ? 'solid' : 'outline'}
                                colorScheme="blue"
                                onClick={() => {
                                  setIsCustomTreatment(false);
                                  setCustomTreatment('');
                                  // Auto-select primary treatment if none selected
                                  if (!selectedTreatment && availableTreatments.length > 0) {
                                    const primaryTreatment = availableTreatments.find(t => t.category === 'Panchakarma') || availableTreatments[0];
                                    setSelectedTreatment(primaryTreatment.id);
                                  }
                                }}
                              >
                                🎯 Assigned Treatments
                              </Button>
                              <Button 
                                size="xs" 
                                variant={isCustomTreatment ? 'solid' : 'outline'}
                                colorScheme="orange"
                                onClick={() => {
                                  setIsCustomTreatment(true);
                                  setSelectedTreatment('');
                                }}
                              >
                                ✏️ Custom Treatment
                              </Button>
                            </HStack>
                          </VStack>
                          <Text fontSize="xs" color="gray.600" mt={1}>
                            {!isCustomTreatment 
                              ? '🎯 Auto-populated from patient\'s treatment plan - switch anytime'
                              : '✏️ Custom treatment mode - enter any treatment not in the list'
                            }
                          </Text>
                        </FormControl>
                      </SimpleGrid>

                      {/* Treatment Context Helper */}
                      {!isCustomTreatment && selectedTreatment && (
                        <Card size="sm" bg="blue.25" variant="outline" borderColor="blue.200">
                          <CardBody p={3}>
                            <HStack spacing={3}>
                              <Box>
                                <Text fontSize="xs" color="blue.700" fontWeight="bold">Treatment Context:</Text>
                                <Text fontSize="xs" color="blue.600">
                                  {(() => {
                                    const treatment = availableTreatments.find(t => t.id === selectedTreatment);
                                    if (!treatment) return 'N/A';
                                    
                                    if (treatment.category === 'Panchakarma') {
                                      return `Part of ${selectedPatient.panchakarma || 'Panchakarma'} therapy`;
                                    } else if (treatment.category === 'External Therapy') {
                                      return `Daily therapy as prescribed: ${selectedPatient.therapy}`;
                                    } else {
                                      return `Standard ${treatment.category.toLowerCase()} procedure`;
                                    }
                                  })()
                                }
                                </Text>
                              </Box>
                              <Box>
                                <Text fontSize="xs" color="blue.700" fontWeight="bold">Treatment Day:</Text>
                                <Text fontSize="xs" color="blue.600">
                                  {(() => {
                                    const dayInfo = treatmentDates.find(d => d.date === currentProgressDate);
                                    return dayInfo ? `Day ${dayInfo.day} of ${treatmentDates.length}` : 'Custom Date';
                                  })()
                                }
                                </Text>
                              </Box>
                            </HStack>
                          </CardBody>
                        </Card>
                      )}

                      <FormControl isRequired>
                        <FormLabel fontSize="sm" fontWeight="semibold">Progress Notes</FormLabel>
                        <Textarea 
                          value={progressText}
                          onChange={(e) => setProgressText(e.target.value)}
                          placeholder={`Enter detailed progress notes for ${isCustomTreatment ? (customTreatment || 'the treatment') : (availableTreatments.find(t => t.id === selectedTreatment)?.name || 'selected treatment')}...

📝 Include:
• Patient response to treatment
• Any side effects or complications
• Improvement observed
• Next steps or modifications needed
• Patient compliance and feedback
• Vital signs or measurements
• Doctor observations and recommendations`}
                          rows={6}
                          resize="vertical"
                        />
                      </FormControl>

                      <HStack justify="space-between">
                        <HStack spacing={2}>
                          <Text fontSize="xs" color="gray.500">
                            💡 Smart fields reduce manual work while staying flexible
                          </Text>
                        </HStack>
                        <HStack>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setProgressText('');
                              setSelectedTreatment('');
                              setCustomTreatment('');
                              setIsCustomTreatment(false);
                              setIsCustomDate(false);
                              // Reset to auto values
                              const today = new Date().toISOString().split('T')[0];
                              const todayInTreatment = treatmentDates.find(d => d.date === today);
                              if (todayInTreatment) {
                                setCurrentProgressDate(today);
                              }
                              if (availableTreatments.length > 0) {
                                const primaryTreatment = availableTreatments.find(t => t.category === 'Panchakarma') || availableTreatments[0];
                                setSelectedTreatment(primaryTreatment.id);
                              }
                            }}
                          >
                            🔄 Reset Form
                          </Button>
                          <Button
                            colorScheme="green"
                            onClick={saveProgressNote}
                            isDisabled={!currentProgressDate || (!selectedTreatment && !customTreatment) || !progressText.trim()}
                            leftIcon={<FilePlus size={16} />}
                          >
                            Save Progress Note
                          </Button>
                        </HStack>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Progress History */}
                <Card variant="outline">
                  <CardHeader>
                    <HStack justify="space-between">
                      <Text fontSize="lg" fontWeight="bold" color="blue.600">
                        📊 Treatment Progress History
                      </Text>
                      <Badge colorScheme="blue" p={2}>
                        {getProgressNotesForPatient(selectedPatient.id).length} Entries
                      </Badge>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    {getProgressNotesForPatient(selectedPatient.id).length > 0 ? (
                      <VStack spacing={4} align="stretch">
                        {getProgressNotesForPatient(selectedPatient.id)
                          .sort((a, b) => new Date(b.date) - new Date(a.date))
                          .map((note) => {
                            const treatmentInfo = availableTreatments.find(t => t.id === note.treatment);
                            return (
                              <Card key={note.id} size="sm" variant="outline" bg="gray.50">
                                <CardBody>
                                  <VStack spacing={3} align="stretch">
                                    <HStack justify="space-between" align="start">
                                      <VStack align="start" spacing={1}>
                                        <HStack spacing={2}>
                                          <Badge colorScheme="blue">{note.date}</Badge>
                                          <Badge colorScheme="green" variant="outline">
                                            {treatmentInfo?.category || 'Treatment'}
                                          </Badge>
                                        </HStack>
                                        <Text fontSize="md" fontWeight="bold" color="blue.700">
                                          {note.treatmentName}
                                        </Text>
                                      </VStack>
                                      <HStack>
                                        <Text fontSize="xs" color="gray.500">
                                          {new Date(note.timestamp).toLocaleString()}
                                        </Text>
                                        <IconButton
                                          size="xs"
                                          icon={<X size={12} />}
                                          colorScheme="red"
                                          variant="ghost"
                                          onClick={() => deleteProgressNote(note.id)}
                                          title="Delete progress note"
                                        />
                                      </HStack>
                                    </HStack>
                                    
                                    <Box 
                                      p={3} 
                                      bg="white" 
                                      borderRadius="md" 
                                      border="1px solid" 
                                      borderColor="gray.200"
                                    >
                                      <Text fontSize="sm" lineHeight="tall" whiteSpace="pre-wrap">
                                        {note.progress}
                                      </Text>
                                    </Box>
                                    
                                    <HStack justify="space-between" fontSize="xs" color="gray.600">
                                      <Text>Doctor: {note.doctor}</Text>
                                      <Text>
                                        Day {treatmentDates.find(d => d.date === note.date)?.day || 'N/A'} of Treatment
                                      </Text>
                                    </HStack>
                                  </VStack>
                                </CardBody>
                              </Card>
                            );
                          })}
                      </VStack>
                    ) : (
                      <Box p={8} textAlign="center">
                        <VStack spacing={3}>
                          <Text fontSize="lg" color="gray.500">
                            📝 No Progress Notes Yet
                          </Text>
                          <Text fontSize="sm" color="gray.400" maxW="md">
                            Start adding progress notes using the form above. Notes will be organized by date and treatment type for easy tracking.
                          </Text>
                        </VStack>
                      </Box>
                    )}
                  </CardBody>
                </Card>

                {/* Quick Progress Summary */}
                {getProgressNotesForPatient(selectedPatient.id).length > 0 && (
                  <Card variant="outline" bg="purple.50" borderColor="purple.200">
                    <CardHeader>
                      <Text fontSize="lg" fontWeight="bold" color="purple.700">
                        📈 Progress Summary
                      </Text>
                    </CardHeader>
                    <CardBody>
                      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                        <Stat>
                          <StatLabel>Total Days Documented</StatLabel>
                          <StatNumber color="purple.600">
                            {new Set(getProgressNotesForPatient(selectedPatient.id).map(n => n.date)).size}
                          </StatNumber>
                          <StatHelpText>Out of {treatmentDates.length} treatment days</StatHelpText>
                        </Stat>
                        <Stat>
                          <StatLabel>Most Frequent Treatment</StatLabel>
                          <StatNumber color="purple.600" fontSize="sm">
                            {
                              (() => {
                                const notes = getProgressNotesForPatient(selectedPatient.id);
                                const treatments = {};
                                notes.forEach(note => {
                                  treatments[note.treatmentName] = (treatments[note.treatmentName] || 0) + 1;
                                });
                                const mostFrequent = Object.keys(treatments).reduce((a, b) => 
                                  treatments[a] > treatments[b] ? a : b, 'N/A'
                                );
                                return mostFrequent;
                              })()
                            }
                          </StatNumber>
                          <StatHelpText>Based on progress entries</StatHelpText>
                        </Stat>
                        <Stat>
                          <StatLabel>Last Updated</StatLabel>
                          <StatNumber color="purple.600" fontSize="sm">
                            {
                              (() => {
                                const notes = getProgressNotesForPatient(selectedPatient.id);
                                if (notes.length === 0) return 'N/A';
                                const latest = notes.reduce((latest, note) => 
                                  new Date(note.timestamp) > new Date(latest.timestamp) ? note : latest
                                );
                                return new Date(latest.timestamp).toLocaleDateString();
                              })()
                            }
                          </StatNumber>
                          <StatHelpText>Most recent entry</StatHelpText>
                        </Stat>
                      </SimpleGrid>
                    </CardBody>
                  </Card>
                )}
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button 
                colorScheme="blue" 
                leftIcon={<Printer size={16} />}
                onClick={() => {
                  // Print progress chart logic here
                  window.print();
                }}
              >
                Print Progress Chart
              </Button>
              <Button variant="outline" onClick={onProgressNotesClose}>
                Close
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Enhanced Medicine Chart Modal */}
      <Modal isOpen={isMedicineChartOpen} onClose={onMedicineChartClose} size="6xl">
        <ModalOverlay />
        <ModalContent maxH="90vh" overflowY="auto">
          <ModalHeader>
            <VStack align="start" spacing={2}>
              <Text fontSize="xl" fontWeight="bold" color="purple.600">
                💊 Treatment-Wise Medicine Chart - {selectedPatient?.name}
              </Text>
              <Text fontSize="sm" color="gray.600">
                IPD No: {selectedPatient?.caseId} | Room: {selectedPatient?.room} | Doctor: {selectedPatient?.doctor}
              </Text>
            </VStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedPatient && (
              <VStack spacing={6} align="stretch">
                {/* Patient Treatment Summary */}
                <Card variant="outline" bg="purple.50" borderColor="purple.200">
                  <CardBody>
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                      <Box>
                        <Text fontSize="sm" color="purple.700" fontWeight="semibold">Primary Treatment</Text>
                        <Text fontSize="md" fontWeight="bold">{selectedPatient.panchakarma || selectedPatient.therapy}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="purple.700" fontWeight="semibold">Treatment Duration</Text>
                        <Text fontSize="md" fontWeight="bold">{selectedPatient.treatmentDuration || '21 days'}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="purple.700" fontWeight="semibold">Total Medicines</Text>
                        <Text fontSize="md" fontWeight="bold">{getTreatmentWiseMedicines(selectedPatient).length}</Text>
                      </Box>
                    </SimpleGrid>
                  </CardBody>
                </Card>

                {/* Treatment-Wise Medicine Lists */}
                {(() => {
                  const treatmentMedicines = getTreatmentWiseMedicines(selectedPatient);
                  const groupedMedicines = {};
                  
                  treatmentMedicines.forEach(medicine => {
                    const key = medicine.treatmentName;
                    if (!groupedMedicines[key]) {
                      groupedMedicines[key] = [];
                    }
                    groupedMedicines[key].push(medicine);
                  });

                  return Object.keys(groupedMedicines).length > 0 ? (
                    <VStack spacing={4} align="stretch">
                      {Object.keys(groupedMedicines).map((treatmentName, index) => {
                        const medicines = groupedMedicines[treatmentName];
                        const category = medicines[0]?.category || 'Treatment';
                        const colorScheme = {
                          'Panchakarma': 'green',
                          'Vamana': 'orange',
                          'Virechana': 'red',
                          'Basti': 'blue',
                          'Nasya': 'purple',
                          'Raktamokshana': 'pink',
                          'External Therapy': 'teal'
                        }[category] || 'gray';

                        return (
                          <Card key={treatmentName} variant="outline" borderColor={`${colorScheme}.300`}>
                            <CardHeader bg={`${colorScheme}.100`} py={3}>
                              <HStack justify="space-between">
                                <VStack align="start" spacing={1}>
                                  <Text fontSize="lg" fontWeight="bold" color={`${colorScheme}.700`}>
                                    {treatmentName}
                                  </Text>
                                  <HStack spacing={2}>
                                    <Badge colorScheme={colorScheme} size="sm">{category}</Badge>
                                    <Badge colorScheme="gray" variant="outline" size="sm">
                                      {medicines.length} Medicine{medicines.length > 1 ? 's' : ''}
                                    </Badge>
                                  </HStack>
                                </VStack>
                                <Text fontSize="xs" color="gray.600">
                                  Treatment #{index + 1}
                                </Text>
                              </HStack>
                            </CardHeader>
                            <CardBody>
                              <TableContainer>
                                <Table variant="simple" size="sm">
                                  <Thead>
                                    <Tr>
                                      <Th>Medicine/Oil Name</Th>
                                      <Th>Type</Th>
                                      <Th>Dosage</Th>
                                      <Th>Timing</Th>
                                      <Th>Duration</Th>
                                      <Th>Status</Th>
                                      <Th>Notes</Th>
                                      <Th>Actions</Th>
                                    </Tr>
                                  </Thead>
                                  <Tbody>
                                    {medicines.map((medicine, medIndex) => (
                                      <Tr key={`${medicine.id}-${medIndex}`} _hover={{ bg: `${colorScheme}.25` }}>
                                        <Td>
                                          <VStack align="start" spacing={1}>
                                            <Text fontWeight="semibold" color={`${colorScheme}.700`}>
                                              {medicine.name}
                                            </Text>
                                            <Text fontSize="xs" color="gray.500">
                                              {medicine.type === 'oil' ? '🌿 Oil' : 
                                               medicine.type === 'churna' ? '🌾 Powder' :
                                               medicine.type === 'kwatha' ? '🍵 Decoction' :
                                               medicine.type === 'ghrita' ? '🧈 Ghee' :
                                               `📋 ${medicine.type}`}
                                            </Text>
                                          </VStack>
                                        </Td>
                                        <Td>
                                          <Badge 
                                            colorScheme={medicine.type === 'oil' ? 'yellow' : 
                                                        medicine.type === 'churna' ? 'green' :
                                                        medicine.type === 'kwatha' ? 'blue' : 'gray'} 
                                            size="sm"
                                          >
                                            {medicine.type}
                                          </Badge>
                                        </Td>
                                        <Td>
                                          <Text fontSize="sm" fontWeight="medium">
                                            {selectedMedicines[medicine.treatmentType]?.some(m => m.id === medicine.id) ? (
                                              <Input
                                                size="xs"
                                                value={medicine.dosage || ''}
                                                placeholder="As prescribed"
                                                onChange={(e) => updateMedicineFromChart(medicine, 'dosage', e.target.value)}
                                              />
                                            ) : (
                                              medicine.dosage || 'As prescribed'
                                            )}
                                          </Text>
                                        </Td>
                                        <Td>
                                          {selectedMedicines[medicine.treatmentType]?.some(m => m.id === medicine.id) ? (
                                            <Select
                                              size="xs"
                                              value={medicine.timing || ''}
                                              placeholder="As directed"
                                              onChange={(e) => updateMedicineFromChart(medicine, 'timing', e.target.value)}
                                            >
                                              <option value="morning">Morning</option>
                                              <option value="afternoon">Afternoon</option>
                                              <option value="evening">Evening</option>
                                              <option value="night">Night</option>
                                              <option value="empty-stomach">Empty Stomach</option>
                                              <option value="after-food">After Food</option>
                                            </Select>
                                          ) : (
                                            <Text fontSize="sm">
                                              {medicine.timing || 'As directed'}
                                            </Text>
                                          )}
                                        </Td>
                                        <Td>
                                          {selectedMedicines[medicine.treatmentType]?.some(m => m.id === medicine.id) ? (
                                            <Input
                                              size="xs"
                                              value={medicine.duration || ''}
                                              placeholder="Full treatment"
                                              onChange={(e) => updateMedicineFromChart(medicine, 'duration', e.target.value)}
                                            />
                                          ) : (
                                            <Text fontSize="sm">
                                              {medicine.duration || 'Full treatment'}
                                            </Text>
                                          )}
                                        </Td>
                                        <Td>
                                          {selectedMedicines[medicine.treatmentType]?.some(m => m.id === medicine.id) ? (
                                            <Select
                                              size="xs"
                                              value={medicine.status || 'Active'}
                                              onChange={(e) => updateMedicineFromChart(medicine, 'status', e.target.value)}
                                            >
                                              <option value="Active">Active</option>
                                              <option value="Completed">Completed</option>
                                              <option value="On Hold">On Hold</option>
                                            </Select>
                                          ) : (
                                            <Badge 
                                              colorScheme={medicine.status === 'Active' ? 'green' : 
                                                          medicine.status === 'Completed' ? 'blue' : 'orange'} 
                                              size="sm"
                                            >
                                              {medicine.status || 'Active'}
                                            </Badge>
                                          )}
                                        </Td>
                                        <Td>
                                          {selectedMedicines[medicine.treatmentType]?.some(m => m.id === medicine.id) ? (
                                            <Textarea
                                              size="xs"
                                              rows={1}
                                              value={medicine.notes || ''}
                                              placeholder="No special notes"
                                              onChange={(e) => updateMedicineFromChart(medicine, 'notes', e.target.value)}
                                            />
                                          ) : (
                                            <Text fontSize="xs" color="gray.600" maxW="150px" isTruncated>
                                              {medicine.notes || 'No special notes'}
                                            </Text>
                                          )}
                                        </Td>
                                        <Td>
                                          {selectedMedicines[medicine.treatmentType]?.some(m => m.id === medicine.id) ? (
                                            <IconButton
                                              size="xs"
                                              aria-label="Remove medicine"
                                              icon={<X size={12} />}
                                              colorScheme="red"
                                              variant="ghost"
                                              onClick={() => removeMedicineFromChart(medicine)}
                                            />
                                          ) : (
                                            <Text fontSize="xs" color="gray.400">-</Text>
                                          )}
                                        </Td>
                                      </Tr>
                                    ))}
                                  </Tbody>
                                </Table>
                              </TableContainer>

                              {/* Treatment Instructions */}
                              <Box mt={4} p={3} bg={`${colorScheme}.25`} borderRadius="md">
                                <Text fontSize="sm" fontWeight="semibold" color={`${colorScheme}.700`} mb={2}>
                                  📋 Treatment Instructions:
                                </Text>
                                <Text fontSize="sm" color="gray.700">
                                  {(() => {
                                    if (category === 'Panchakarma') {
                                      if (treatmentName.includes('Vamana')) {
                                        return 'Take medicines on empty stomach with warm water. Monitor patient response carefully during emetic process.';
                                      } else if (treatmentName.includes('Virechana')) {
                                        return 'Administer purgative medicines as prescribed. Ensure proper hydration and electrolyte balance.';
                                      } else if (treatmentName.includes('Basti')) {
                                        return 'Prepare medicated enema at body temperature. Follow proper Basti administration protocol.';
                                      } else if (treatmentName.includes('Nasya')) {
                                        return 'Administer nasal drops gently. Patient should lie in supine position during treatment.';
                                      } else {
                                        return 'Follow standard Panchakarma protocols for medicine administration.';
                                      }
                                    } else if (category === 'External Therapy') {
                                      return 'Use oils at appropriate temperature for external application. Follow therapy-specific guidelines.';
                                    } else {
                                      return 'Administer medicines as per standard Ayurvedic principles with proper timing and dosage.';
                                    }
                                  })()
                                }
                                </Text>
                                <Text fontSize="xs" color="gray.500" mt={2}>
                                  💡 Always consult with the treating physician before making any changes to the medicine schedule.
                                </Text>
                              </Box>
                            </CardBody>
                          </Card>
                        );
                      })}
                    </VStack>
                  ) : (
                    <Box p={8} textAlign="center">
                      <VStack spacing={4}>
                        <Text fontSize="lg" color="gray.500">
                          💊 No Treatment-Specific Medicines Assigned Yet
                        </Text>
                        <Text fontSize="sm" color="gray.400" maxW="md">
                          Medicines will appear here once they are added to specific treatments in the Treatment Chart. 
                          Each treatment will show its associated medicines and oils.
                        </Text>
                        <Button 
                          colorScheme="purple" 
                          size="sm" 
                          leftIcon={<Plus size={16} />}
                          onClick={() => {
                            onMedicineChartClose();
                            handleViewTreatmentChart(selectedPatient);
                          }}
                        >
                          Go to Treatment Chart
                        </Button>
                      </VStack>
                    </Box>
                  );
                })()}

                {/* Medicine Administration Schedule */}
                {getTreatmentWiseMedicines(selectedPatient).length > 0 && (
                  <Card variant="outline" bg="blue.50" borderColor="blue.200">
                    <CardHeader>
                      <Text fontSize="lg" fontWeight="bold" color="blue.700">
                        ⏰ Daily Medicine Administration Schedule
                      </Text>
                    </CardHeader>
                    <CardBody>
                      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
                        <Box p={4} bg="green.50" borderRadius="md" border="1px solid" borderColor="green.200">
                          <Text fontSize="sm" fontWeight="bold" color="green.700" mb={2}>Morning (6-8 AM)</Text>
                          <VStack align="start" spacing={1}>
                            <Text fontSize="xs" color="gray.600">• Empty stomach medicines</Text>
                            <Text fontSize="xs" color="gray.600">• Pre-treatment oils</Text>
                            <Text fontSize="xs" color="gray.600">• Panchakarma preparations</Text>
                          </VStack>
                        </Box>
                        <Box p={4} bg="yellow.50" borderRadius="md" border="1px solid" borderColor="yellow.200">
                          <Text fontSize="sm" fontWeight="bold" color="yellow.700" mb={2}>Afternoon (12-2 PM)</Text>
                          <VStack align="start" spacing={1}>
                            <Text fontSize="xs" color="gray.600">• Post-meal medicines</Text>
                            <Text fontSize="xs" color="gray.600">• Treatment-specific doses</Text>
                            <Text fontSize="xs" color="gray.600">• Therapeutic oils</Text>
                          </VStack>
                        </Box>
                        <Box p={4} bg="orange.50" borderRadius="md" border="1px solid" borderColor="orange.200">
                          <Text fontSize="sm" fontWeight="bold" color="orange.700" mb={2}>Evening (6-8 PM)</Text>
                          <VStack align="start" spacing={1}>
                            <Text fontSize="xs" color="gray.600">• Evening doses</Text>
                            <Text fontSize="xs" color="gray.600">• External applications</Text>
                            <Text fontSize="xs" color="gray.600">• Recovery medicines</Text>
                          </VStack>
                        </Box>
                        <Box p={4} bg="purple.50" borderRadius="md" border="1px solid" borderColor="purple.200">
                          <Text fontSize="sm" fontWeight="bold" color="purple.700" mb={2}>Night (8-10 PM)</Text>
                          <VStack align="start" spacing={1}>
                            <Text fontSize="xs" color="gray.600">• Before sleep medicines</Text>
                            <Text fontSize="xs" color="gray.600">• Night-time oils</Text>
                            <Text fontSize="xs" color="gray.600">• Digestive support</Text>
                          </VStack>
                        </Box>
                      </SimpleGrid>
                    </CardBody>
                  </Card>
                )}

                {/* Medicine Summary Statistics */}
                {getTreatmentWiseMedicines(selectedPatient).length > 0 && (
                  <Card variant="outline" bg="gray.50" borderColor="gray.200">
                    <CardHeader>
                      <Text fontSize="lg" fontWeight="bold" color="gray.700">
                        📊 Medicine Usage Summary
                      </Text>
                    </CardHeader>
                    <CardBody>
                      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
                        <Stat>
                          <StatLabel>Total Medicines</StatLabel>
                          <StatNumber color="purple.600">
                            {getTreatmentWiseMedicines(selectedPatient).length}
                          </StatNumber>
                          <StatHelpText>Across all treatments</StatHelpText>
                        </Stat>
                        <Stat>
                          <StatLabel>Medicinal Oils</StatLabel>
                          <StatNumber color="yellow.600">
                            {getTreatmentWiseMedicines(selectedPatient).filter(m => m.type === 'oil').length}
                          </StatNumber>
                          <StatHelpText>For therapies</StatHelpText>
                        </Stat>
                        <Stat>
                          <StatLabel>Oral Medicines</StatLabel>
                          <StatNumber color="green.600">
                            {getTreatmentWiseMedicines(selectedPatient).filter(m => m.type !== 'oil').length}
                          </StatNumber>
                          <StatHelpText>Internal consumption</StatHelpText>
                        </Stat>
                        <Stat>
                          <StatLabel>Active Treatments</StatLabel>
                          <StatNumber color="blue.600">
                            {(() => {
                              const treatments = new Set(getTreatmentWiseMedicines(selectedPatient).map(m => m.treatmentName));
                              return treatments.size;
                            })()}
                          </StatNumber>
                          <StatHelpText>With medicines</StatHelpText>
                        </Stat>
                      </SimpleGrid>
                    </CardBody>
                  </Card>
                )}
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button 
                colorScheme="purple" 
                leftIcon={<Printer size={16} />}
                onClick={() => {
                  window.print();
                }}
              >
                Print Medicine Chart
              </Button>
              <Button 
                colorScheme="blue" 
                leftIcon={<FileText size={16} />}
                onClick={() => {
                  onMedicineChartClose();
                  handleViewTreatmentChart(selectedPatient);
                }}
              >
                View Treatment Chart
              </Button>
              <Button variant="outline" onClick={onMedicineChartClose}>
                Close
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Prescription Modal */}
      <PrescriptionModal 
        isOpen={isPrescriptionOpen} 
        onClose={onPrescriptionClose} 
        patient={selectedPatient} 
      />

      {/* Export Modal */}
      <Modal isOpen={isExportOpen} onClose={onExportClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text fontSize="xl" fontWeight="bold" color="blue.600">
              📊 Export IPD Data
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              <Text color="gray.600" fontSize="sm">
                Choose your preferred export format:
              </Text>
              
              <Button
                leftIcon={<FileSpreadsheet />}
                colorScheme="red"
                variant="outline"
                onClick={() => handleExport('pdf')}
                size="lg"
                justifyContent="flex-start"
              >
                Export as PDF
              </Button>
              
              <Button
                leftIcon={<FileSpreadsheet />}
                colorScheme="green"
                variant="outline"
                onClick={() => handleExport('excel')}
                size="lg"
                justifyContent="flex-start"
              >
                Export as Excel
              </Button>
              
              <Button
                leftIcon={<FileSpreadsheet />}
                colorScheme="blue"
                variant="outline"
                onClick={() => handleExport('csv')}
                size="lg"
                justifyContent="flex-start"
              >
                Export as CSV
              </Button>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onExportClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default IPD;