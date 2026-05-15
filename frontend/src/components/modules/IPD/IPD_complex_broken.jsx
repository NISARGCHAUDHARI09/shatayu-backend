import React, { useState } from 'react';
import {
  Box,
  Card,
  CardBody,
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
  useToast
} from '@chakra-ui/react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useEffect } from 'react';
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
  X
} from 'lucide-react';
import PrescriptionModal from '../AyurvedicPrescription/PrescriptionModal';

const IPD = () => {
  const title = "Ayurvedic Clinic - IPD Management";
  
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

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
  const { isOpen: isDiagnosisOpen, onOpen: onDiagnosisOpen, onClose: onDiagnosisClose } = useDisclosure();
  const { isOpen: isTransferOpen, onOpen: onTransferOpen, onClose: onTransferClose } = useDisclosure();
  const { isOpen: isAssignTreatmentOpen, onOpen: onAssignTreatmentOpen, onClose: onAssignTreatmentClose } = useDisclosure();
  const { isOpen: isAssignMedicineOpen, onOpen: onAssignMedicineOpen, onClose: onAssignMedicineClose } = useDisclosure();

  const toast = useToast();

  // Sample Ayurvedic clinic patients
  // Complete patient database for auto-fill functionality
  const [allPatientRecords] = useState([
    // Current IPD patients
    {
      id: 1,
      regNo: '12345001',
      ipdNo: 'IPD001',
      name: 'Suresh Sharma',
      age: 45,
      gender: 'Male',
      phone: '9876543210',
      prakriti: 'Vata-Pitta',
      dosha: 'Vata Aggravated',
      ayurvedicDiagnosis: 'Sandhivata (Arthritis)',
      diagnosisDetails: 'Patient presents with chronic joint pain, stiffness, and inflammation. Vata dosha aggravation leading to sandhivata. Primary joints affected are knees and shoulders. Pain intensity 7/10, worsens in cold weather. Limited range of motion observed.',
      therapy: 'Abhyanga + Swedana',
      panchakarma: 'Basti',
      status: 'Active'
    },
    {
      id: 2,
      regNo: '12345002',
      ipdNo: 'IPD002', 
      name: 'Meena Devi',
      age: 38,
      gender: 'Female',
      phone: '9876543211',
      prakriti: 'Kapha-Pitta',
      dosha: 'Kapha Vitiated',
      ayurvedicDiagnosis: 'Prameha (Diabetes)',
      diagnosisDetails: 'Type 2 diabetes mellitus with kapha dosha imbalance. HbA1c 8.2%, frequent urination, excessive thirst. Patient shows symptoms of prameha with sweet taste in urine. Requires complete panchakarma therapy along with dietary modifications.',
      therapy: 'Udwartana',
      panchakarma: 'Virechana',
      status: 'Active'
    },
    {
      id: 3,
      regNo: '12345003',
      ipdNo: 'IPD003',
      name: 'Raj Kumar',
      age: 52,
      gender: 'Male',
      phone: '9876543212',
      prakriti: 'Pitta',
      dosha: 'Pitta Elevated',
      ayurvedicDiagnosis: 'Amlapitta (Hyperacidity)',
      diagnosisDetails: 'Chronic hyperacidity with burning sensation in stomach, acid reflux, and nausea. Pitta dosha severely aggravated due to lifestyle and dietary factors. Patient reports heartburn especially after spicy food intake.',
      therapy: 'Shirodhara',
      panchakarma: 'Vamana',
      status: 'Discharged'
    },
    // Additional patient records for auto-fill
    {
      id: 4,
      regNo: '12345004',
      name: 'Priya Patel',
      age: 29,
      gender: 'Female',
      phone: '9876543213',
      prakriti: 'Vata',
      dosha: 'Vata Aggravated',
      ayurvedicDiagnosis: 'Anidra (Insomnia)',
      therapy: 'Abhyanga + Shirodhara',
      panchakarma: 'Nasya',
      diet: 'Vata pacifying, warm foods',
      yoga: 'Restorative yoga, meditation',
      status: 'Discharged'
    },
    {
      id: 5,
      regNo: '12345005',
      name: 'Arjun Singh',
      age: 41,
      gender: 'Male',
      phone: '9876543214',
      prakriti: 'Kapha',
      dosha: 'Kapha Vitiated',
      ayurvedicDiagnosis: 'Sthaulya (Obesity)',
      therapy: 'Udwartana + Swedana',
      panchakarma: 'Virechana',
      diet: 'Light, spicy foods, fasting',
      yoga: 'Dynamic yoga, cardio',
      status: 'Discharged'
    },
    {
      id: 6,
      regNo: '12345006',
      name: 'Kavita Sharma',
      age: 35,
      gender: 'Female',
      phone: '9876543215',
      prakriti: 'Pitta-Kapha',
      dosha: 'Pitta Elevated',
      ayurvedicDiagnosis: 'Yakrut Vikara (Liver disorders)',
      therapy: 'Virechana + Basti',
      panchakarma: 'Virechana',
      diet: 'Bitter, cooling foods',
      yoga: 'Gentle yoga, cooling pranayama',
      status: 'Discharged'
    },
    {
      id: 7,
      regNo: '12345007',
      name: 'Deepak Verma',
      age: 48,
      gender: 'Male',
      phone: '9876543216',
      prakriti: 'Vata-Kapha',
      dosha: 'Vata Aggravated',
      ayurvedicDiagnosis: 'Pakshaghata (Paralysis)',
      therapy: 'Panchakarma intensive',
      panchakarma: 'Basti',
      diet: 'Nourishing, warm foods',
      yoga: 'Physiotherapy, adapted yoga',
      status: 'Discharged'
    },
    {
      id: 8,
      regNo: '12345008',
      name: 'Sunita Agarwal',
      age: 42,
      gender: 'Female',
      phone: '9876543217',
      prakriti: 'Pitta',
      dosha: 'Pitta Elevated',
      ayurvedicDiagnosis: 'Raktapitta (Bleeding disorders)',
      therapy: 'Cooling therapies',
      panchakarma: 'Raktamokshana',
      diet: 'Cooling, sweet foods',
      yoga: 'Restorative yoga, Sheetali',
      status: 'Discharged'
    }
  ]);

  const [initialPatients] = useState([
    {
      id: 1,
      regNo: '12345001',
      ipdNo: 'IPD001',
      name: 'Suresh Sharma',
      age: 45,
      gender: 'Male',
      phone: '9876543210',
      prakriti: 'Vata-Pitta',
      dosha: 'Vata Aggravated',
      ayurvedicDiagnosis: 'Sandhivata (Arthritis)',
      diagnosisDetails: 'Patient presents with chronic joint pain, stiffness, and inflammation. Vata dosha aggravation leading to sandhivata. Primary joints affected are knees and shoulders. Pain intensity 7/10, worsens in cold weather. Limited range of motion observed.',
      therapy: 'Abhyanga + Swedana',
      panchakarma: 'Basti',
      status: 'Active'
    },
    {
      id: 2,
      regNo: '12345002',
      ipdNo: 'IPD002', 
      name: 'Meena Devi',
      age: 38,
      gender: 'Female',
      phone: '9876543211',
      prakriti: 'Kapha-Pitta',
      dosha: 'Kapha Vitiated',
      ayurvedicDiagnosis: 'Prameha (Diabetes)',
      diagnosisDetails: 'Type 2 diabetes mellitus with kapha dosha imbalance. HbA1c 8.2%, frequent urination, excessive thirst. Patient shows symptoms of prameha with sweet taste in urine. Requires complete panchakarma therapy along with dietary modifications.',
      therapy: 'Udwartana',
      panchakarma: 'Virechana',
      status: 'Active'
    },
    {
      id: 3,
      regNo: '12345003',
      ipdNo: 'IPD003',
      name: 'Raj Kumar',
      age: 52,
      gender: 'Male',
      phone: '9876543212',
      prakriti: 'Pitta',
      dosha: 'Pitta Elevated',
      ayurvedicDiagnosis: 'Amlapitta (Hyperacidity)',
      diagnosisDetails: 'Chronic hyperacidity with burning sensation in stomach, acid reflux, and nausea. Pitta dosha severely aggravated due to lifestyle and dietary factors. Patient reports heartburn especially after spicy food intake.',
      therapy: 'Shirodhara',
      panchakarma: 'Vamana',
      status: 'Discharged'
    }
  ]);

  const [patients, setPatients] = useState(initialPatients);
  
  const [newPatient, setNewPatient] = useState({
    regNo: '',
    ipdNo: '',
    name: '',
    age: '',
    gender: '',
    phone: '',
    prakriti: '',
    dosha: '',
    ayurvedicDiagnosis: '',
    diagnosisDetails: '',
    therapy: '',
    panchakarma: '',
    status: 'Active',
    // Chart data
    treatmentChart: {
      treatments: [],
      startDate: '',
      duration: '',
      frequency: '',
      notes: ''
    },
    medicineChart: {
      medicines: [],
      instructions: '',
      duration: '',
      notes: ''
    },
    // Transfer specific fields
    transferredFrom: '', // 'OPD' or 'Direct'
    opdHistory: null
  });

  // Treatment and Medicine Chart states
  const [treatmentChart, setTreatmentChart] = useState({
    treatments: [],
    startDate: new Date().toISOString().split('T')[0],
    duration: '',
    frequency: '',
    notes: ''
  });

  const [medicineChart, setMedicineChart] = useState({
    medicines: [],
    instructions: '',
    duration: '',
    notes: ''
  });

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

    const matches = allPatientRecords.filter(patient => 
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
      ipdNo: '',
      name: '',
      age: '',
      gender: '',
      phone: '',
      prakriti: '',
      dosha: '',
      ayurvedicDiagnosis: '',
      diagnosisDetails: '',
      therapy: '',
      panchakarma: '',
      status: 'Active',
      treatmentChart: {
        treatments: [],
        startDate: '',
        duration: '',
        frequency: '',
        notes: ''
      },
      medicineChart: {
        medicines: [],
        instructions: '',
        duration: '',
        notes: ''
      },
      transferredFrom: '',
      opdHistory: null
    });
    // Reset chart states
    setTreatmentChart({
      treatments: [],
      startDate: new Date().toISOString().split('T')[0],
      duration: '',
      frequency: '',
      notes: ''
    });
    setMedicineChart({
      medicines: [],
      instructions: '',
      duration: '',
      notes: ''
    });
    onAddClose();
  };

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Filter patients based on search and status
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.regNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.ayurvedicDiagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || patient.status.toLowerCase().includes(filterStatus.toLowerCase());
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
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
    setNewPatient(patient);
    onEditOpen();
  };

  const handleAddPatient = () => {
    // Generate numerical registration number if not provided
    let finalRegNo = newPatient.regNo;
    if (!finalRegNo) {
      finalRegNo = String(Date.now()).slice(-8); // 8-digit numerical ID
    }
    
    // Generate IPD number if not provided
    let finalIpdNo = newPatient.ipdNo;
    if (!finalIpdNo) {
      const nextIpdNumber = String(patients.length + 1).padStart(3, '0');
      finalIpdNo = `IPD${nextIpdNumber}`;
    }
    
    const newId = Math.max(...patients.map(p => p.id)) + 1;
    const patientToAdd = {
      ...newPatient,
      id: newId,
      regNo: finalRegNo,
      ipdNo: finalIpdNo,
      admissionDate: new Date().toLocaleDateString(),
      room: `Room ${101 + patients.length}`,
      doctor: 'Dr. Ayurveda Specialist',
      condition: newPatient.ayurvedicDiagnosis || 'General Treatment'
    };
    setPatients(prev => [...prev, patientToAdd]);
    setNewPatient({
      regNo: '',
      ipdNo: '',
      name: '',
      age: '',
      gender: '',
      phone: '',
      prakriti: '',
      dosha: '',
      ayurvedicDiagnosis: '',
      diagnosisDetails: '',
      therapy: '',
      panchakarma: '',
      status: 'Active'
    });
    
    toast({
      title: "Patient Added Successfully",
      description: `${newPatient.name} has been admitted to IPD with IPD No: ${finalIpdNo} and registration number: ${finalRegNo}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    
    onAddClose();
  };

  const handleUpdatePatient = () => {
    const updatedPatients = patients.map(patient => 
      patient.id === selectedPatient.id 
        ? { ...patient, ...newPatient }
        : patient
    );
    setPatients(updatedPatients);
    
    toast({
      title: "Patient Updated Successfully",
      description: `${newPatient.name}'s information has been updated`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    
    onEditClose();
  };

  // Chart Management Functions
  const handleTransferFromOPD = (opdPatient) => {
    // Pre-fill form with OPD patient data
    setNewPatient({
      regNo: opdPatient.regNo,
      ipdNo: '', // Will be auto-generated
      name: opdPatient.name,
      age: opdPatient.age,
      gender: opdPatient.gender,
      phone: opdPatient.phone,
      prakriti: opdPatient.prakriti || '',
      dosha: opdPatient.dosha || '',
      ayurvedicDiagnosis: opdPatient.diagnosis || '',
      diagnosisDetails: opdPatient.diagnosisDetails || '',
      therapy: '',
      panchakarma: '',
      status: 'Active',
      transferredFrom: 'OPD',
      opdHistory: opdPatient,
      treatmentChart: {
        treatments: [],
        startDate: new Date().toISOString().split('T')[0],
        duration: '',
        frequency: '',
        notes: `Transferred from OPD. Previous consultation: ${opdPatient.lastConsultation || 'N/A'}`
      },
      medicineChart: {
        medicines: opdPatient.currentMedicines || [],
        instructions: '',
        duration: '',
        notes: `Continuing from OPD treatment plan.`
      }
    });
    
    onAddOpen();
  };

  const handleAssignTreatmentChart = () => {
    setNewPatient(prev => ({
      ...prev,
      treatmentChart: treatmentChart
    }));
    
    toast({
      title: "Treatment Chart Assigned",
      description: "Treatment plan has been added to patient record",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    
    onAssignTreatmentClose();
  };

  const handleAssignMedicineChart = () => {
    setNewPatient(prev => ({
      ...prev,
      medicineChart: medicineChart
    }));
    
    toast({
      title: "Medicine Chart Assigned",
      description: "Medicine schedule has been added to patient record",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    
    onAssignMedicineClose();
  };

  const addTreatmentToChart = () => {
    const newTreatment = {
      id: Date.now(),
      time: '',
      treatment: '',
      duration: '',
      therapist: '',
      room: '',
      status: 'Scheduled'
    };
    
    setTreatmentChart(prev => ({
      ...prev,
      treatments: [...prev.treatments, newTreatment]
    }));
  };

  const addMedicineToChart = () => {
    const newMedicine = {
      id: Date.now(),
      medicine: '',
      dosage: '',
      frequency: '',
      timing: '',
      duration: '',
      instructions: ''
    };
    
    setMedicineChart(prev => ({
      ...prev,
      medicines: [...prev.medicines, newMedicine]
    }));
  };

  const removeTreatmentFromChart = (treatmentId) => {
    setTreatmentChart(prev => ({
      ...prev,
      treatments: prev.treatments.filter(t => t.id !== treatmentId)
    }));
  };

  const removeMedicineFromChart = (medicineId) => {
    setMedicineChart(prev => ({
      ...prev,
      medicines: prev.medicines.filter(m => m.id !== medicineId)
    }));
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

  const handlePrintPatient = (patient) => {
    const printWindow = window.open('', '_blank');
    const currentDate = new Date().toLocaleDateString('en-GB');
    const currentTime = new Date().toLocaleTimeString('en-GB');
    
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>IPD Treatment Report - ${patient.name}</title>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
          <style>
            * {
              box-sizing: border-box;
            }
            body {
              font-family: 'Times New Roman', serif;
              margin: 20px;
              line-height: 1.4;
              color: #333;
              font-size: 14px;
            }
            .print-controls {
              position: fixed;
              top: 20px;
              right: 20px;
              z-index: 1000;
              background: white;
              padding: 15px;
              border-radius: 10px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
              border: 2px solid #3B82F6;
            }
            .print-btn {
              background: linear-gradient(135deg, #3B82F6 0%, #10B981 100%);
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              font-size: 16px;
              font-weight: bold;
              cursor: pointer;
              margin-right: 10px;
              transition: transform 0.2s;
            }
            .print-btn:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
            }
            .close-btn {
              background: #EF4444;
              color: white;
              border: none;
              padding: 12px 20px;
              border-radius: 8px;
              font-size: 16px;
              font-weight: bold;
              cursor: pointer;
              transition: transform 0.2s;
            }
            .close-btn:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
            }
            .official-header {
              text-align: center;
              border: 2px solid #000;
              margin-bottom: 15px;
              margin-top: 60px;
              padding: 12px;
              background: #f8f9fa;
            }
            .header-logo {
              font-size: 24px;
              margin-bottom: 3px;
            }
            .hospital-name {
              font-size: 20px;
              font-weight: bold;
              color: #000;
              margin-bottom: 3px;
              text-transform: uppercase;
              letter-spacing: 2px;
            }
            .hospital-address {
              font-size: 10px;
              margin-bottom: 5px;
              color: #666;
              line-height: 1.2;
            }
            .department {
              font-size: 14px;
              color: #000;
              margin-bottom: 5px;
              font-weight: bold;
              text-transform: uppercase;
            }
            .report-title {
              font-size: 16px;
              color: #000;
              margin-top: 8px;
              font-weight: bold;
              text-decoration: underline;
              text-transform: uppercase;
            }
            .document-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
              font-size: 12px;
              border-bottom: 2px solid #000;
              padding-bottom: 10px;
            }
            .patient-info {
              border: 2px solid #000;
              padding: 15px;
              margin-bottom: 20px;
              background: #fff;
            }
            .patient-info h3 {
              margin: 0 0 15px 0;
              font-size: 16px;
              font-weight: bold;
              text-transform: uppercase;
              border-bottom: 1px solid #000;
              padding-bottom: 5px;
            }
            .info-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 10px;
            }
            .info-table td {
              padding: 5px;
              border: 1px solid #000;
              font-size: 12px;
            }
            .info-table .label {
              font-weight: bold;
              background: #f0f0f0;
              width: 30%;
            }
            .section {
              border: 2px solid #000;
              margin-bottom: 12px;
              padding: 10px;
              background: #fff;
            }
            .section-title {
              font-size: 14px;
              font-weight: bold;
              color: #000;
              margin: 0 0 10px 0;
              text-transform: uppercase;
              border-bottom: 2px solid #000;
              padding-bottom: 5px;
            }
            .status-badge {
              display: inline-block;
              padding: 4px 8px;
              border: 1px solid #000;
              font-weight: bold;
              font-size: 12px;
              background: #f0f0f0;
            }
            .signature-section {
              margin-top: 40px;
              display: flex;
              justify-content: space-between;
              border-top: 2px solid #000;
              padding-top: 20px;
            }
            .signature-box {
              text-align: center;
              width: 200px;
              border: 1px solid #000;
              padding: 10px;
              background: #f8f9fa;
            }
            .signature-line {
              border-top: 1px solid #000;
              margin-top: 40px;
              padding-top: 5px;
              font-size: 12px;
              font-weight: bold;
            }
            .official-footer {
              margin-top: 40px;
              background: #f8f9fa;
              border-top: 3px solid #000;
              padding: 15px;
              text-align: center;
              font-size: 12px;
              page-break-inside: avoid;
            }
            .footer-content {
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .hospital-seal {
              width: 80px;
              height: 80px;
              border: 2px solid #000;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 10px;
              text-align: center;
              background: #f0f0f0;
              margin: 0 auto;
            }
            .main-content {
              margin-bottom: 60px;
              min-height: calc(100vh - 200px);
            }
            ul {
              margin: 10px 0;
              padding-left: 20px;
            }
            li {
              margin-bottom: 8px;
              font-size: 13px;
              line-height: 1.4;
            }
            @media print {
              * {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              
              @page {
                margin: 1.5cm !important;
                size: A4 !important;
                /* Completely suppress all browser headers and footers */
                @top-left-corner { content: "" !important; visibility: hidden !important; display: none !important; }
                @top-left { content: "" !important; visibility: hidden !important; display: none !important; }
                @top-center { content: "" !important; visibility: hidden !important; display: none !important; }
                @top-right { content: "" !important; visibility: hidden !important; display: none !important; }
                @top-right-corner { content: "" !important; visibility: hidden !important; display: none !important; }
                @bottom-left-corner { content: "" !important; visibility: hidden !important; display: none !important; }
                @bottom-left { content: "" !important; visibility: hidden !important; display: none !important; }
                @bottom-center { content: "" !important; visibility: hidden !important; display: none !important; }
                @bottom-right { content: "" !important; visibility: hidden !important; display: none !important; }
                @bottom-right-corner { content: "" !important; visibility: hidden !important; display: none !important; }
              }
              
              html, body {
                margin: 0 !important;
                padding: 0 !important;
                font-family: 'Times New Roman', serif !important;
                font-size: 12px !important;
                line-height: 1.3 !important;
                color: #000 !important;
                background: white !important;
                overflow: hidden !important;
              }
              
              body {
                margin: 0 !important;
                padding: 1.5cm !important;
                font-family: 'Times New Roman', serif !important;
                font-size: 12px !important;
                line-height: 1.3 !important;
                color: #000 !important;
              }
              .print-controls { 
                display: none !important; 
              }
              .official-header { 
                margin-top: 0 !important;
                page-break-after: avoid !important;
                border: 3px solid #000 !important;
                background: #f8f9fa !important;
              }
              .hospital-name {
                color: #000 !important;
              }
              .department {
                color: #000 !important;
              }
              .report-title {
                color: #000 !important;
              }
              .document-info {
                border-bottom: 2px solid #000 !important;
              }
              .patient-info {
                page-break-after: avoid !important;
                border: 2px solid #000 !important;
                background: #fff !important;
              }
              .section {
                page-break-inside: avoid !important;
                border: 2px solid #000 !important;
                background: #fff !important;
                margin-bottom: 15px !important;
              }
              .section-title {
                border-bottom: 2px solid #000 !important;
                color: #000 !important;
              }
              .info-table {
                border-collapse: collapse !important;
              }
              .info-table td {
                border: 1px solid #000 !important;
                padding: 4px !important;
                font-size: 11px !important;
              }
              .info-table .label {
                background: #f0f0f0 !important;
              }
              .signature-section {
                page-break-before: avoid !important;
                page-break-inside: avoid !important;
                border-top: 2px solid #000 !important;
              }
              .signature-box {
                border: 1px solid #000 !important;
                background: #f8f9fa !important;
              }
              .signature-line {
                border-top: 1px solid #000 !important;
              }
              .official-footer {
                border-top: 3px solid #000 !important;
                background: #f8f9fa !important;
                margin-top: 30px !important;
                page-break-inside: avoid !important;
                position: relative !important;
              }
              .main-content {
                margin-bottom: 0 !important;
                min-height: auto !important;
              }
              .hospital-seal {
                border: 2px solid #000 !important;
                background: #f0f0f0 !important;
              }
              .status-badge {
                border: 1px solid #000 !important;
                background: #f0f0f0 !important;
              }
            }
            @page {
              size: A4;
              margin: 0;
              /* Completely remove all browser-generated content */
              @top-left-corner { content: "" !important; display: none !important; }
              @top-left { content: "" !important; display: none !important; }
              @top-center { content: "" !important; display: none !important; }
              @top-right { content: "" !important; display: none !important; }
              @top-right-corner { content: "" !important; display: none !important; }
              @bottom-left-corner { content: "" !important; display: none !important; }
              @bottom-left { content: "" !important; display: none !important; }
              @bottom-center { content: "" !important; display: none !important; }
              @bottom-right { content: "" !important; display: none !important; }
              @bottom-right-corner { content: "" !important; display: none !important; }
              /* Additional browser overrides */
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              color-adjust: exact;
            }
            
            /* Print-specific body styling */
            .print-mode {
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
            }
            
            /* Additional print controls */
            @media print {
              /* Override any browser-generated content */
              body::before,
              body::after,
              html::before,
              html::after {
                display: none !important;
                content: none !important;
              }
              
              /* Hide URL and other browser info */
              .no-print {
                display: none !important;
                visibility: hidden !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-controls">
            <button class="print-btn" onclick="
              // Hide print controls
              document.querySelector('.print-controls').style.display = 'none';
              
              // Apply comprehensive print styles to remove browser headers/footers
              const printStyle = document.createElement('style');
              printStyle.textContent = \`
                @media print {
                  html {
                    -webkit-print-color-adjust: exact !important;
                    color-adjust: exact !important;
                    print-color-adjust: exact !important;
                  }
                  
                  @page {
                    margin: 0 !important;
                    size: A4 !important;
                    /* Attempt to hide browser headers/footers */
                    header: none;
                    footer: none;
                    @top-left { content: '' !important; }
                    @top-center { content: '' !important; }
                    @top-right { content: '' !important; }
                    @bottom-left { content: '' !important; }
                    @bottom-center { content: '' !important; }
                    @bottom-right { content: '' !important; }
                  }
                  
                  body {
                    margin: 0 !important;
                    padding: 1.5cm !important;
                    background: white !important;
                    color: black !important;
                    font-family: 'Times New Roman', serif !important;
                  }
                  
                  .print-controls {
                    display: none !important;
                    visibility: hidden !important;
                  }
                }
              \`;
              document.head.appendChild(printStyle);
              
              // Trigger print with delay
              setTimeout(() => {
                window.print();
                
                // Clean up after printing
                setTimeout(() => {
                  document.head.removeChild(printStyle);
                  document.querySelector('.print-controls').style.display = 'block';
                }, 1000);
              }, 100);
            ">
              🖨️ Print Report
            </button>
            <button class="pdf-btn" style="background: #10B981; color: white; border: none; padding: 12px 20px; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; margin-right: 10px; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(16, 185, 129, 0.4)'" onmouseout="this.style.transform=''; this.style.boxShadow=''" onclick="
              // Generate PDF using jsPDF (assuming it's loaded)
              if (typeof jsPDF !== 'undefined') {
                const doc = new jsPDF('p', 'mm', 'a4');
                
                // Hospital Header
                doc.setFontSize(16);
                doc.setFont('times', 'bold');
                doc.text('🏥 Ayurvedic Medical Center', 105, 20, { align: 'center' });
                
                doc.setFontSize(10);
                doc.setFont('times', 'normal');
                doc.text('123 Wellness Street, Healing City, State - 12345', 105, 30, { align: 'center' });
                doc.text('Phone: +91-1234567890 | Email: info@ayurvediccenter.com', 105, 35, { align: 'center' });
                
                // Title
                doc.setFontSize(14);
                doc.setFont('times', 'bold');
                doc.text('IPD TREATMENT REPORT', 105, 50, { align: 'center' });
                
                // Patient Details
                let yPos = 70;
                doc.setFontSize(12);
                doc.setFont('times', 'bold');
                doc.text('Patient Information:', 20, yPos);
                
                yPos += 10;
                doc.setFontSize(10);
                doc.setFont('times', 'normal');
                doc.text('Name: ${patient.name}', 20, yPos);
                doc.text('Age: ${patient.age}', 120, yPos);
                
                yPos += 7;
                doc.text('Gender: ${patient.gender}', 20, yPos);
                doc.text('Room: ${patient.room}', 120, yPos);
                
                yPos += 7;
                doc.text('Admission Date: ${patient.admissionDate}', 20, yPos);
                doc.text('Doctor: ${patient.doctor}', 120, yPos);
                
                yPos += 7;
                doc.text('Condition: ${patient.condition}', 20, yPos);
                
                // Treatment Plan
                yPos += 20;
                doc.setFontSize(12);
                doc.setFont('times', 'bold');
                doc.text('Treatment Plan & Medications:', 20, yPos);
                
                yPos += 10;
                doc.setFontSize(10);
                doc.setFont('times', 'normal');
                doc.text('• Daily Panchakarma therapy sessions', 20, yPos);
                yPos += 5;
                doc.text('• Herbal medicines as prescribed', 20, yPos);
                yPos += 5;
                doc.text('• Dietary modifications according to Ayurvedic principles', 20, yPos);
                yPos += 5;
                doc.text('• Panchakarma therapy sessions', 20, yPos);
                
                // Footer
                yPos += 30;
                doc.setFontSize(10);
                doc.setFont('times', 'normal');
                doc.text('Doctor Signature: ____________________', 20, yPos);
                doc.text('Date: ____________________', 120, yPos);
                
                yPos += 20;
                doc.text('This is a computer-generated document.', 105, yPos, { align: 'center' });
                doc.text('Valid without signature as per hospital policy.', 105, yPos + 5, { align: 'center' });
                
                // Save the PDF
                doc.save('IPD_Report_' + '${patient.name}'.replace(/\\s+/g, '_') + '_' + new Date().getTime() + '.pdf');
              } else {
                alert('PDF generation library not loaded. Please use the Print option.');
              }
            ">
              📄 Download PDF
            </button>
            <button class="close-btn" onclick="window.close()">
              ❌ Close
            </button>
          </div>

          <div class="main-content">
            <div class="official-header">
            <div class="header-logo">🏥</div>
            <div class="hospital-name">Ayurvedic Medical Center</div>
            <div class="hospital-address">
              123 Wellness Street, Healing City, State - 12345<br>
              Phone: +91-1234567890 | Email: info@ayurvediccenter.com<br>
              License No: AMC/2024/001 | Registration No: REG/AMC/2024
            </div>
            <div class="department">Inpatient Department (IPD)</div>
            <div class="report-title">Patient Treatment Report</div>
          </div>

          <div class="document-info">
            <div><strong>Document ID:</strong> IPD/${patient.regNo}/${currentDate.replace(/\//g, '')}</div>
            <div><strong>Generated:</strong> ${currentDate} at ${currentTime}</div>
            <div><strong>Valid Until:</strong> ${new Date(Date.now() + 90*24*60*60*1000).toLocaleDateString('en-GB')}</div>
          </div>

          <div class="patient-info">
            <h3>📋 Patient Information</h3>
            <table class="info-table">
              <tr>
                <td class="label">Registration Number</td>
                <td>${patient.regNo}</td>
                <td class="label">Patient Name</td>
                <td>${patient.name}</td>
              </tr>
              <tr>
                <td class="label">Age</td>
                <td>${patient.age} years</td>
                <td class="label">Gender</td>
                <td>${patient.gender}</td>
              </tr>
              <tr>
                <td class="label">Contact Number</td>
                <td>${patient.phone}</td>
                <td class="label">Treatment Status</td>
                <td><span class="status-badge">${patient.status}</span></td>
              </tr>
            </table>
          </div>

          <div class="section">
            <div class="section-title">🌿 Ayurvedic Assessment & Diagnosis</div>
            <table class="info-table">
              <tr>
                <td class="label">Prakriti (Constitution)</td>
                <td>${patient.prakriti}</td>
              </tr>
              <tr>
                <td class="label">Dosha Condition</td>
                <td>${patient.dosha}</td>
              </tr>
              <tr>
                <td class="label">Ayurvedic Diagnosis</td>
                <td>${patient.ayurvedicDiagnosis}</td>
              </tr>
            </table>
          </div>

          <div class="section">
            <div class="section-title">💆‍♂️ Treatment Plan & Prescriptions</div>
            <table class="info-table">
              <tr>
                <td class="label">Primary Therapy</td>
                <td>${patient.therapy}</td>
              </tr>
              <tr>
                <td class="label">Panchakarma Treatment</td>
                <td>${patient.panchakarma}</td>
              </tr>
            </table>
          </div>

          <div class="section">
            <div class="section-title">📋 Medical Instructions & Guidelines</div>
            <div style="text-align: justify; line-height: 1.5;">
              <p><strong>TREATMENT PROTOCOL:</strong></p>
              <ul style="margin: 10px 0; padding-left: 25px;">
                <li><strong>Daily Routine:</strong> Follow prescribed Dinacharya (daily routine) as per Ayurvedic principles and maintain regular sleep-wake cycle.</li>
                <li><strong>Therapy Sessions:</strong> ${patient.therapy} as prescribed by the treating physician under qualified supervision.</li>
                <li><strong>Panchakarma Protocol:</strong> ${patient.panchakarma} to be administered by certified Panchakarma specialists only.</li>
                <li><strong>Lifestyle Management:</strong> Practice Sattvavajaya Chikitsa (psychotherapy) and stress management techniques.</li>
                <li><strong>Follow-up:</strong> Regular consultation with treating physician as per appointment schedule.</li>
              </ul>
              
              <p><strong>IMPORTANT NOTES:</strong></p>
              <ul style="margin: 10px 0; padding-left: 25px;">
                <li>This document is valid for medical and legal purposes as per Indian Medical Council regulations.</li>
                <li>Any changes in treatment plan require prior consultation with the treating physician.</li>
                <li>In case of emergency, contact the hospital immediately at the provided emergency number.</li>
                <li>Keep this document safe for future medical references and insurance claims.</li>
              </ul>
            </div>
          </div>

          <div class="signature-section">
            <div class="signature-box">
              <div style="height: 50px; border-bottom: 1px solid #000; margin-bottom: 5px;"></div>
              <div class="signature-line">Dr. [Treating Physician Name]</div>
              <div style="font-size: 10px; margin-top: 5px;">
                BAMS, MD (Ayurveda)<br>
                Reg. No: AMC/DOC/001
              </div>
            </div>
            <div class="signature-box">
              <div class="hospital-seal">
                <div>
                  OFFICIAL<br>
                  HOSPITAL<br>
                  SEAL
                </div>
              </div>
            </div>
            <div class="signature-box">
              <div style="height: 50px; border-bottom: 1px solid #000; margin-bottom: 5px;"></div>
              <div class="signature-line">Dr. [Department Head]</div>
              <div style="font-size: 10px; margin-top: 5px;">
                Head, IPD Department<br>
                Reg. No: AMC/HOD/001
              </div>
            </div>
          </div>
          </div>

          <div class="official-footer">
            <div class="footer-content">
              <div style="font-size: 11px; text-align: left;">
                <strong>Ayurvedic Medical Center - IPD Department</strong><br>
                "Holistic Healing Through Traditional Medicine"<br>
                Accredited by National Accreditation Board for Hospitals (NABH)
              </div>
              <div style="font-size: 10px; text-align: center;">
                <strong>CONFIDENTIAL MEDICAL DOCUMENT</strong><br>
                This document contains sensitive medical information.<br>
                Handle with appropriate confidentiality as per medical ethics.
              </div>
              <div style="font-size: 11px; text-align: right;">
                <strong>Emergency Contact:</strong><br>
                24x7 Helpline: +91-9876543210<br>
                Website: www.ayurvediccenter.com
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    toast({
      title: "Treatment Report Opened",
      description: `Treatment report for ${patient.name} is ready for review and printing`,
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top-right"
    });
  };

  const handleCompleteToken = (patient) => {
    const confirmComplete = window.confirm(`Are you sure you want to complete treatment for ${patient.name}? This will mark the patient as discharged.`);
    if (confirmComplete) {
      // Update patient status to completed
      const updatedPatients = patients.map(p => 
        p.id === patient.id ? { ...p, status: 'Discharged' } : p
      );
      setPatients(updatedPatients);
      alert(`Treatment completed successfully for ${patient.name}. Patient has been discharged from the Ayurvedic IPD program.`);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'green';
      case 'discharged':
        return 'gray';
      default:
        return 'green';
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
          'Panchakarma', 'Diet', 'Yoga', 'Status'
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
          patient.panchakarma,
          patient.diet,
          patient.yoga,
          patient.status
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
            9: { cellWidth: 20 },  // Panchakarma
            10: { cellWidth: 25 }, // Diet
            11: { cellWidth: 25 }, // Yoga
            12: { cellWidth: 20 }  // Status
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
          'Panchakarma': patient.panchakarma,
          'Diet Plan': patient.diet,
          'Yoga Prescription': patient.yoga,
          'Treatment Status': patient.status
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
          'Panchakarma': patient.panchakarma,
          'Diet Plan': patient.diet,
          'Yoga Prescription': patient.yoga,
          'Treatment Status': patient.status
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
    <>
    <Box minH="100vh" bg="gray.50">
      {/* Modern Header with Blue/Teal Gradient */}
      <Box 
        bg="linear-gradient(135deg, #3B82F6 0%, #10B981 100%)" 
        color="white" 
        py={4} 
        px={6}
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
          opacity={0.1}
          bgImage="data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"
        />
        
        <VStack spacing={3} position="relative" zIndex={1}>
          <HStack spacing={3}>
            <Box
              p={2}
              bg="rgba(255,255,255,0.2)"
              borderRadius="lg"
              backdropFilter="blur(10px)"
              border="1px solid rgba(255,255,255,0.3)"
            >
              <Activity size={24} />
            </Box>
            <VStack align="start" spacing={0}>
              <Text fontSize="2xl" fontWeight="bold" letterSpacing="tight">
                🏥 Ayurvedic IPD Management
              </Text>
              <Text fontSize="md" opacity={0.9}>
                Panchakarma & Residential Care Excellence
              </Text>
            </VStack>
          </HStack>
          
          {/* Enhanced Stats Cards */}
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} w="full" maxW="1000px">
            <Card 
              bg="rgba(255,255,255,0.15)" 
              backdropFilter="blur(10px)"
              border="1px solid rgba(255,255,255,0.2)"
              _hover={{ transform: "translateY(-2px)", transition: "all 0.3s" }}
            >
              <CardBody p={4}>
                <VStack spacing={2}>
                  <HStack spacing={2}>
                    <Box p={1.5} bg="rgba(255,255,255,0.2)" borderRadius="md">
                      <User size={20} />
                    </Box>
                    <Text fontSize="xs" fontWeight="semibold" opacity={0.9}>Total Patients</Text>
                  </HStack>
                  <Text fontSize="2xl" fontWeight="bold">{patients.length}</Text>
                  <Text fontSize="xs" opacity={0.8}>Registered in IPD</Text>
                </VStack>
              </CardBody>
            </Card>
            
            <Card 
              bg="rgba(255,255,255,0.15)" 
              backdropFilter="blur(10px)"
              border="1px solid rgba(255,255,255,0.2)"
              _hover={{ transform: "translateY(-2px)", transition: "all 0.3s" }}
            >
              <CardBody p={4}>
                <VStack spacing={2}>
                  <HStack spacing={2}>
                    <Box p={1.5} bg="rgba(255,255,255,0.2)" borderRadius="md">
                      <Activity size={20} />
                    </Box>
                    <Text fontSize="xs" fontWeight="semibold" opacity={0.9}>Active Treatments</Text>
                  </HStack>
                  <Text fontSize="2xl" fontWeight="bold">
                    {patients.filter(p => p.status === 'Active Treatment').length}
                  </Text>
                  <Text fontSize="xs" opacity={0.8}>Currently ongoing</Text>
                </VStack>
              </CardBody>
            </Card>
            
            <Card 
              bg="rgba(255,255,255,0.15)" 
              backdropFilter="blur(10px)"
              border="1px solid rgba(255,255,255,0.2)"
              _hover={{ transform: "translateY(-2px)", transition: "all 0.3s" }}
            >
              <CardBody p={4}>
                <VStack spacing={2}>
                  <HStack spacing={2}>
                    <Box p={1.5} bg="rgba(255,255,255,0.2)" borderRadius="md">
                      <CheckCircle size={20} />
                    </Box>
                    <Text fontSize="xs" fontWeight="semibold" opacity={0.9}>Recovery Phase</Text>
                  </HStack>
                  <Text fontSize="2xl" fontWeight="bold">
                    {patients.filter(p => p.status === 'Recovery').length}
                  </Text>
                  <Text fontSize="xs" opacity={0.8}>Improving steadily</Text>
                </VStack>
              </CardBody>
            </Card>
            
            <Card 
              bg="rgba(255,255,255,0.15)" 
              backdropFilter="blur(10px)"
              border="1px solid rgba(255,255,255,0.2)"
              _hover={{ transform: "translateY(-2px)", transition: "all 0.3s" }}
            >
              <CardBody p={4}>
                <VStack spacing={2}>
                  <HStack spacing={2}>
                    <Box p={1.5} bg="rgba(255,255,255,0.2)" borderRadius="md">
                      <Stethoscope size={20} />
                    </Box>
                    <Text fontSize="xs" fontWeight="semibold" opacity={0.9}>Panchakarma</Text>
                  </HStack>
                  <Text fontSize="2xl" fontWeight="bold">
                    {patients.filter(p => p.panchakarma && p.panchakarma !== 'None').length}
                  </Text>
                  <Text fontSize="xs" opacity={0.8}>Specialized therapy</Text>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>
        </VStack>
      </Box>

      {/* Main Content with Modern Card Design */}
      <Box p={6}>
        <Card 
          shadow="xl" 
          borderRadius="2xl" 
          bg="white"
          border="1px solid"
          borderColor="blue.100"
          overflow="hidden"
        >
          <CardBody p={0}>
            {/* Enhanced Controls Bar with Blue Theme */}
            <Box 
              p={6} 
              borderBottom="1px solid" 
              borderColor="blue.100"
              bg="linear-gradient(135deg, #EBF8FF 0%, #E6FFFA 100%)"
              borderTopRadius="2xl"
            >
              <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                <HStack spacing={4}>
                  <InputGroup maxW="400px" size="lg">
                    <InputLeftElement pointerEvents="none">
                      <Search color="gray.400" size={20} />
                    </InputLeftElement>
                    <Input
                      placeholder="Search patients, treatments, or conditions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      bg="white"
                      border="2px solid"
                      borderColor="blue.200"
                      _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #3B82F6" }}
                      borderRadius="xl"
                      _hover={{ borderColor: "blue.300" }}
                    />
                  </InputGroup>
                  
                  <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    maxW="200px"
                    size="lg"
                    bg="white"
                    border="2px solid"
                    borderColor="blue.200"
                    borderRadius="xl"
                    _focus={{ borderColor: "blue.400" }}
                    _hover={{ borderColor: "blue.300" }}
                  >
                    <option value="all">All Status</option>
                    <option value="Active Treatment">Active Treatment</option>
                    <option value="Under Treatment">Under Treatment</option>
                    <option value="Critical Care">Critical Care</option>
                    <option value="Treatment Completed">Completed</option>
                  </Select>
                </HStack>
                
                <HStack spacing={3}>
                  <Button
                    leftIcon={<FileSpreadsheet size={18} />}
                    variant="outline"
                    size="lg"
                    borderRadius="xl"
                    border="2px solid"
                    borderColor="teal.300"
                    color="teal.600"
                    _hover={{ 
                      borderColor: "teal.400", 
                      bg: "teal.50",
                      transform: "translateY(-1px)" 
                    }}
                    onClick={onExportOpen}
                  >
                    Export
                  </Button>
                  
                  <Button
                    leftIcon={<RefreshCw size={18} />}
                    variant="outline"
                    size="lg"
                    borderRadius="xl"
                    border="2px solid"
                    borderColor="blue.300"
                    color="blue.600"
                    _hover={{ 
                      borderColor: "blue.400", 
                      bg: "blue.50",
                      transform: "translateY(-1px)" 
                    }}
                  >
                    Refresh
                  </Button>
                  
                  <Button
                    leftIcon={<UserPlus size={18} />}
                    colorScheme="blue"
                    size="lg"
                    borderRadius="xl"
                    bg="linear-gradient(135deg, #3B82F6 0%, #10B981 100%)"
                    _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                    onClick={onAddOpen}
                  >
                    Add Patient
                  </Button>
                  
                  <Button
                    leftIcon={<RefreshCw size={18} />}
                    variant="outline"
                    size="lg"
                    borderRadius="xl"
                    border="2px solid"
                    borderColor="orange.300"
                    color="orange.600"
                    _hover={{ 
                      borderColor: "orange.400", 
                      bg: "orange.50",
                      transform: "translateY(-1px)" 
                    }}
                    onClick={() => {
                      toast({
                        title: "Transfer from OPD",
                        description: "In real implementation, this would show OPD patients available for transfer",
                        status: "info",
                        duration: 3000,
                        isClosable: true,
                      });
                    }}
                  >
                    Transfer from OPD
                  </Button>
                </HStack>
            </Flex>
          </Box>

          {/* Enhanced Summary Cards with Modern Blue/Teal Theme */}
          <Box p={4}>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} mb={4}>
              <Card 
                bg="linear-gradient(135deg, #EBF8FF 0%, #E6FFFA 100%)" 
                border="1px solid" 
                borderColor="blue.200"
                borderRadius="lg"
                _hover={{ transform: "translateY(-2px)", transition: "all 0.3s", shadow: "lg" }}
              >
                <CardBody p={4}>
                  <VStack align="start" spacing={2}>
                    <HStack spacing={2}>
                      <Box p={1.5} bg="blue.100" borderRadius="md">
                        <User size={16} color="#3B82F6" />
                      </Box>
                      <Text fontSize="xs" color="blue.700" fontWeight="semibold">Total Patients</Text>
                    </HStack>
                    <Text fontSize="2xl" fontWeight="bold" color="blue.800">
                      {patients.length}
                    </Text>
                    <Text fontSize="xs" color="blue.600">Registered in IPD</Text>
                  </VStack>
                </CardBody>
              </Card>
              
              <Card 
                bg="linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)" 
                border="1px solid" 
                borderColor="teal.200"
                borderRadius="lg"
                _hover={{ transform: "translateY(-2px)", transition: "all 0.3s", shadow: "lg" }}
              >
                <CardBody p={4}>
                  <VStack align="start" spacing={2}>
                    <HStack spacing={2}>
                      <Box p={1.5} bg="teal.100" borderRadius="md">
                        <Activity size={16} color="#10B981" />
                      </Box>
                      <Text fontSize="xs" color="teal.700" fontWeight="semibold">Under Treatment</Text>
                    </HStack>
                    <Text fontSize="2xl" fontWeight="bold" color="teal.800">
                      {patients.filter(p => p.status.includes('Treatment')).length}
                    </Text>
                    <Text fontSize="xs" color="teal.600">Currently ongoing</Text>
                  </VStack>
                </CardBody>
              </Card>
              
              <Card 
                bg="linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)" 
                border="1px solid" 
                borderColor="green.200"
                borderRadius="lg"
                _hover={{ transform: "translateY(-2px)", transition: "all 0.3s", shadow: "lg" }}
              >
                <CardBody p={4}>
                  <VStack align="start" spacing={2}>
                    <HStack spacing={2}>
                      <Box p={1.5} bg="green.100" borderRadius="md">
                        <CheckCircle size={16} color="#059669" />
                      </Box>
                      <Text fontSize="xs" color="green.700" fontWeight="semibold">Recovery</Text>
                    </HStack>
                    <Text fontSize="2xl" fontWeight="bold" color="green.800">
                      {patients.filter(p => p.status === 'Recovery').length}
                    </Text>
                    <Text fontSize="xs" color="green.600">Improving steadily</Text>
                  </VStack>
                </CardBody>
              </Card>
              
              <Card 
                bg="linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)" 
                border="1px solid" 
                borderColor="purple.200"
                borderRadius="lg"
                _hover={{ transform: "translateY(-2px)", transition: "all 0.3s", shadow: "lg" }}
              >
                <CardBody p={4}>
                  <VStack align="start" spacing={2}>
                    <HStack spacing={2}>
                      <Box p={1.5} bg="purple.100" borderRadius="md">
                        <Stethoscope size={16} color="#7C3AED" />
                      </Box>
                      <Text fontSize="xs" color="purple.700" fontWeight="semibold">Panchakarma</Text>
                    </HStack>
                    <Text fontSize="2xl" fontWeight="bold" color="purple.800">
                      {patients.filter(p => p.panchakarma && p.panchakarma !== 'None').length}
                    </Text>
                    <Text fontSize="xs" color="purple.600">Specialized therapy</Text>
                  </VStack>
                </CardBody>
              </Card>
            </SimpleGrid>
          </Box>
          </CardBody>
        </Card>

      {/* Modern Patients Table with Blue/Teal Theme */}
      <Card 
        border="1px" 
        borderColor="blue.200" 
        borderRadius="2xl"
        overflow="hidden"
        shadow="lg"
        mt={8}
      >
        <CardBody p={0}>
          <TableContainer>
            <Table variant="simple" size="md">
              <Thead bg="linear-gradient(135deg, #3B82F6 0%, #10B981 100%)">
                <Tr>
                  <Th width="40px" color="white" fontSize="sm">
                    <Checkbox
                      isChecked={selectedPatients.length === currentPatients.length && currentPatients.length > 0}
                      isIndeterminate={selectedPatients.length > 0 && selectedPatients.length < currentPatients.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      colorScheme="whiteAlpha"
                    />
                  </Th>
                  <Th color="white" fontSize="sm" fontWeight="bold">IPD No</Th>
                  <Th color="white" fontSize="sm" fontWeight="bold">Patient</Th>
                  <Th color="white" fontSize="sm" fontWeight="bold">Phone</Th>
                  <Th color="white" fontSize="sm" fontWeight="bold">Prakriti</Th>
                  <Th color="white" fontSize="sm" fontWeight="bold">Dosha</Th>
                  <Th color="white" fontSize="sm" fontWeight="bold" textAlign="center">Diagnosis</Th>
                  <Th color="white" fontSize="sm" fontWeight="bold">Therapy</Th>
                  <Th color="white" fontSize="sm" fontWeight="bold">Panchakarma</Th>
                  <Th color="white" fontSize="sm" fontWeight="bold">Status</Th>
                  <Th width="100px" color="white" fontSize="sm" fontWeight="bold">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentPatients.map((patient, index) => (
                  <Tr 
                    key={patient.id} 
                    _hover={{ 
                      bg: "blue.50"
                    }}
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
                      <Text color="blue.600" fontWeight="medium">{patient.ipdNo}</Text>
                    </Td>
                    <Td>
                      <HStack spacing={3}>
                        <Avatar size="sm" name={patient.name} />
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="medium">{patient.name}</Text>
                          <Text fontSize="xs" color="gray.500">{patient.age} years, {patient.gender}</Text>
                        </VStack>
                      </HStack>
                    </Td>
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
                    <Td textAlign="center">
                      <IconButton
                        icon={<Eye size={16} />}
                        size="sm"
                        variant="ghost"
                        colorScheme="purple"
                        onClick={() => {
                          setSelectedPatient(patient);
                          onDiagnosisOpen();
                        }}
                        aria-label="View diagnosis details"
                        _hover={{ bg: "purple.50" }}
                      />
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
                      <Badge colorScheme={patient.status === 'Active' ? 'green' : 'gray'} size="sm">
                        {patient.status}
                      </Badge>
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
                            icon={<Printer size={16} />} 
                            onClick={() => handlePrintPatient(patient)}
                            _hover={{ bg: "blue.50" }}
                          >
                            Print Details
                          </MenuItem>
                          <MenuItem 
                            icon={<Home size={16} />} 
                            onClick={() => handleCompleteToken(patient)} 
                            color="green.600"
                            _hover={{ bg: "green.50" }}
                          >
                            Complete Treatment
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>

          {/* Pagination */}
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

      {/* Enhanced Add Patient Modal with Chart Assignment */}
      <Modal isOpen={isAddOpen} onClose={handleModalClose} size="6xl">
        <ModalOverlay />
        <ModalContent maxH="90vh" overflowY="auto">
          <ModalHeader bg="blue.500" color="white">
            <HStack spacing={2}>
              <UserPlus size={20} />
              <Text>Add New IPD Patient</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody p={6}>
            <VStack spacing={6} align="stretch">
              {/* Patient Basic Information */}
              <Box>
                <Text fontSize="lg" fontWeight="bold" mb={4} color="blue.600">
                  📋 Patient Information
                </Text>
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
                  <FormControl isRequired>
                    <FormLabel>IPD Number</FormLabel>
                    <Input
                      value={newPatient.ipdNo}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, ipdNo: e.target.value }))}
                      placeholder="Auto-generated"
                      isReadOnly
                      bg="gray.50"
                    />
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
                    <FormLabel>Diagnosis Details</FormLabel>
                    <Textarea
                      value={newPatient.diagnosisDetails}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, diagnosisDetails: e.target.value }))}
                      placeholder="Enter detailed diagnosis"
                      rows={3}
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
                </SimpleGrid>
              </Box>

              <Divider />

              {/* Treatment Chart Assignment */}
              <Box>
                <HStack justify="space-between" mb={4}>
                  <Text fontSize="lg" fontWeight="bold" color="green.600">
                    💆‍♂️ Treatment Chart Assignment
                  </Text>
                  <Button
                    size="sm"
                    colorScheme="green"
                    onClick={onAssignTreatmentOpen}
                    leftIcon={<Plus size={16} />}
                  >
                    Assign Treatment Plan
                  </Button>
                </HStack>
                
                {newPatient.treatmentChart.treatments.length > 0 ? (
                  <Card variant="outline">
                    <CardBody p={4}>
                      <VStack spacing={2} align="stretch">
                        {newPatient.treatmentChart.treatments.map((treatment, index) => (
                          <HStack key={treatment.id} justify="space-between" p={2} bg="green.50" borderRadius="md">
                            <VStack align="start" spacing={0}>
                              <Text fontSize="sm" fontWeight="semibold">{treatment.treatment}</Text>
                              <Text fontSize="xs" color="gray.600">
                                {treatment.time} - {treatment.duration} mins
                              </Text>
                            </VStack>
                            <Badge colorScheme="green">{treatment.status}</Badge>
                          </HStack>
                        ))}
                      </VStack>
                    </CardBody>
                  </Card>
                ) : (
                  <Box p={4} border="2px dashed" borderColor="green.200" borderRadius="md" textAlign="center">
                    <Text color="gray.500" fontSize="sm">
                      No treatment plan assigned. Click "Assign Treatment Plan" to add treatments.
                    </Text>
                  </Box>
                )}
              </Box>

              <Divider />

              {/* Medicine Chart Assignment */}
              <Box>
                <HStack justify="space-between" mb={4}>
                  <Text fontSize="lg" fontWeight="bold" color="purple.600">
                    💊 Medicine Chart Assignment
                  </Text>
                  <Button
                    size="sm"
                    colorScheme="purple"
                    onClick={onAssignMedicineOpen}
                    leftIcon={<Plus size={16} />}
                  >
                    Assign Medicine Plan
                  </Button>
                </HStack>
                
                {newPatient.medicineChart.medicines.length > 0 ? (
                  <Card variant="outline">
                    <CardBody p={4}>
                      <VStack spacing={2} align="stretch">
                        {newPatient.medicineChart.medicines.map((medicine, index) => (
                          <HStack key={medicine.id} justify="space-between" p={2} bg="purple.50" borderRadius="md">
                            <VStack align="start" spacing={0}>
                              <Text fontSize="sm" fontWeight="semibold">{medicine.medicine}</Text>
                              <Text fontSize="xs" color="gray.600">
                                {medicine.dosage} - {medicine.frequency}
                              </Text>
                            </VStack>
                            <Badge colorScheme="purple">{medicine.timing}</Badge>
                          </HStack>
                        ))}
                      </VStack>
                    </CardBody>
                  </Card>
                ) : (
                  <Box p={4} border="2px dashed" borderColor="purple.200" borderRadius="md" textAlign="center">
                    <Text color="gray.500" fontSize="sm">
                      No medicine plan assigned. Click "Assign Medicine Plan" to add medications.
                    </Text>
                  </Box>
                )}
              </Box>
            </VStack>
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
              Add Patient to IPD
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
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
              <FormControl isRequired>
                <FormLabel>IPD Number</FormLabel>
                <Input
                  value={newPatient.ipdNo}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, ipdNo: e.target.value }))}
                  placeholder="Enter IPD number"
                  autoComplete="off"
                />
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
            </SimpleGrid>
          </Box>

          <Divider />

          {/* Treatment Chart Assignment */}
          <Box>
            <HStack justify="space-between" mb={4}>
              <Text fontSize="lg" fontWeight="bold" color="green.600">
                💆‍♂️ Treatment Chart Assignment
              </Text>
              <Button
                size="sm"
                colorScheme="green"
                onClick={onAssignTreatmentOpen}
                leftIcon={<Plus size={16} />}
              >
                Assign Treatment Plan
              </Button>
            </HStack>
            
            {newPatient.treatmentChart.treatments.length > 0 ? (
              <Card variant="outline">
                <CardBody p={4}>
                  <VStack spacing={2} align="stretch">
                    {newPatient.treatmentChart.treatments.map((treatment, index) => (
                      <HStack key={treatment.id} justify="space-between" p={2} bg="green.50" borderRadius="md">
                        <VStack align="start" spacing={0}>
                          <Text fontSize="sm" fontWeight="semibold">{treatment.treatment}</Text>
                          <Text fontSize="xs" color="gray.600">
                            {treatment.time} - {treatment.duration} mins
                          </Text>
                        </VStack>
                        <Badge colorScheme="green">{treatment.status}</Badge>
                      </HStack>
                    ))}
                  </VStack>
                </CardBody>
              </Card>
            ) : (
              <Box p={4} border="2px dashed" borderColor="green.200" borderRadius="md" textAlign="center">
                <Text color="gray.500" fontSize="sm">
                  No treatment plan assigned. Click "Assign Treatment Plan" to add treatments.
                </Text>
              </Box>
            )}
          </Box>

          <Divider />

          {/* Medicine Chart Assignment */}
          <Box>
            <HStack justify="space-between" mb={4}>
              <Text fontSize="lg" fontWeight="bold" color="purple.600">
                💊 Medicine Chart Assignment
              </Text>
              <Button
                size="sm"
                colorScheme="purple"
                onClick={onAssignMedicineOpen}
                leftIcon={<Plus size={16} />}
              >
                Assign Medicine Plan
              </Button>
            </HStack>
            
            {newPatient.medicineChart.medicines.length > 0 ? (
              <Card variant="outline">
                <CardBody p={4}>
                  <VStack spacing={2} align="stretch">
                    {newPatient.medicineChart.medicines.map((medicine, index) => (
                      <HStack key={medicine.id} justify="space-between" p={2} bg="purple.50" borderRadius="md">
                        <VStack align="start" spacing={0}>
                          <Text fontSize="sm" fontWeight="semibold">{medicine.medicine}</Text>
                          <Text fontSize="xs" color="gray.600">
                            {medicine.dosage} - {medicine.frequency}
                          </Text>
                        </VStack>
                        <Badge colorScheme="purple">{medicine.timing}</Badge>
                      </HStack>
                    ))}
                  </VStack>
                </CardBody>
              </Card>
            ) : (
              <Box p={4} border="2px dashed" borderColor="purple.200" borderRadius="md" textAlign="center">
                <Text color="gray.500" fontSize="sm">
                  No medicine plan assigned. Click "Assign Medicine Plan" to add medications.
                </Text>
              </Box>
            )}
          </Box>
        </VStack>
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
                    <Text fontSize="sm" color="gray.600">Registration Number</Text>
                    <Text fontWeight="medium">{selectedPatient.regNo}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.600">IPD Number</Text>
                    <Text fontWeight="medium">{selectedPatient.ipdNo}</Text>
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
                  <Box>
                    <Text fontSize="sm" color="gray.600">Status</Text>
                    <Badge colorScheme={getStatusColor(selectedPatient.status)}>
                      {selectedPatient.status}
                    </Badge>
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
                      <Text fontSize="sm" color="gray.600" mb={2}>Treatment Status</Text>
                      <Badge 
                        colorScheme={getStatusColor(selectedPatient.status)} 
                        size="lg"
                        p={2}
                        borderRadius="md"
                      >
                        {selectedPatient.status}
                      </Badge>
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

      {/* Treatment Chart Modal */}
      <Modal isOpen={isTreatmentChartOpen} onClose={onTreatmentChartClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text fontSize="xl" fontWeight="bold" color="green.600">
              📊 Treatment Chart - {selectedPatient?.name}
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedPatient && (
              <VStack spacing={6} align="stretch">
                <Card variant="outline">
                  <CardBody>
                    <Text fontSize="lg" fontWeight="bold" mb={4} color="green.600">
                      Daily Treatment Schedule
                    </Text>
                    <TableContainer>
                      <Table variant="simple" size="sm">
                        <Thead>
                          <Tr>
                            <Th>Time</Th>
                            <Th>Treatment</Th>
                            <Th>Duration</Th>
                            <Th>Status</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          <Tr>
                            <Td>6:00 AM</Td>
                            <Td>Abhyanga (Oil Massage)</Td>
                            <Td>45 mins</Td>
                            <Td><Badge colorScheme="green">Completed</Badge></Td>
                          </Tr>
                          <Tr>
                            <Td>7:00 AM</Td>
                            <Td>Swedana (Steam Therapy)</Td>
                            <Td>30 mins</Td>
                            <Td><Badge colorScheme="green">Completed</Badge></Td>
                          </Tr>
                          <Tr>
                            <Td>8:30 AM</Td>
                            <Td>Yoga & Pranayama</Td>
                            <Td>60 mins</Td>
                            <Td><Badge colorScheme="orange">In Progress</Badge></Td>
                          </Tr>
                          <Tr>
                            <Td>4:00 PM</Td>
                            <Td>Herbal Medicine</Td>
                            <Td>-</Td>
                            <Td><Badge colorScheme="gray">Scheduled</Badge></Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </CardBody>
                </Card>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" onClick={onTreatmentChartClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Progress Notes Modal */}
      <Modal isOpen={isProgressNotesOpen} onClose={onProgressNotesClose} size="5xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text fontSize="xl" fontWeight="bold" color="blue.600">
              📝 Progress Notes - {selectedPatient?.name}
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedPatient && (
              <VStack spacing={6} align="stretch">
                <Card variant="outline">
                  <CardBody>
                    <Text fontSize="lg" fontWeight="bold" mb={4} color="blue.600">
                      Daily Progress Reports
                    </Text>
                    <VStack spacing={4} align="stretch">
                      <Box p={4} border="1px" borderColor="green.200" borderRadius="md" bg="green.50">
                        <HStack justify="space-between" mb={3}>
                          <Text fontWeight="bold" color="green.700">Day 1 - Admission</Text>
                          <Text fontSize="sm" color="gray.600">Today</Text>
                        </HStack>
                        <Text fontSize="sm" mb={2}>
                          <strong>Assessment:</strong> Patient admitted with chronic joint pain. Initial Prakriti assessment shows {selectedPatient.prakriti} constitution.
                        </Text>
                        <Text fontSize="sm" mb={2}>
                          <strong>Treatment Started:</strong> Abhyanga with Mahanarayan oil, mild Swedana therapy.
                        </Text>
                        <Text fontSize="sm">
                          <strong>Response:</strong> Patient responsive to treatment, shows improvement in mobility.
                        </Text>
                      </Box>
                      
                      <Box p={4} border="1px" borderColor="blue.200" borderRadius="md" bg="blue.50">
                        <HStack justify="space-between" mb={3}>
                          <Text fontWeight="bold" color="blue.700">Planned - Day 2</Text>
                          <Text fontSize="sm" color="gray.600">Tomorrow</Text>
                        </HStack>
                        <Text fontSize="sm" mb={2}>
                          <strong>Plan:</strong> Continue Abhyanga, introduce specialized Panchakarma therapy.
                        </Text>
                        <Text fontSize="sm">
                          <strong>Monitoring:</strong> Track pain levels, joint mobility, and overall wellness indicators.
                        </Text>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>

                <Card variant="outline">
                  <CardBody>
                    <Text fontSize="lg" fontWeight="bold" mb={4} color="blue.600">
                      Add New Progress Note
                    </Text>
                    <VStack spacing={4}>
                      <Textarea 
                        placeholder="Enter today's progress notes..."
                        rows={5}
                      />
                      <HStack justify="flex-end" w="full">
                        <Button colorScheme="blue" size="sm">
                          Save Note
                        </Button>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onProgressNotesClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Medicine Chart Modal */}
      <Modal isOpen={isMedicineChartOpen} onClose={onMedicineChartClose} size="5xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text fontSize="xl" fontWeight="bold" color="purple.600">
              💊 Medicine Chart - {selectedPatient?.name}
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedPatient && (
              <VStack spacing={6} align="stretch">
                <Card variant="outline">
                  <CardBody>
                    <Text fontSize="lg" fontWeight="bold" mb={4} color="purple.600">
                      Current Medications
                    </Text>
                    <TableContainer>
                      <Table variant="simple" size="sm">
                        <Thead>
                          <Tr>
                            <Th>Medicine</Th>
                            <Th>Dosage</Th>
                            <Th>Time</Th>
                            <Th>Duration</Th>
                            <Th>Status</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          <Tr>
                            <Td>Ashwagandha Churna</Td>
                            <Td>5g</Td>
                            <Td>Morning & Evening</Td>
                            <Td>21 days</Td>
                            <Td><Badge colorScheme="green">Active</Badge></Td>
                          </Tr>
                          <Tr>
                            <Td>Triphala Tablets</Td>
                            <Td>2 tablets</Td>
                            <Td>Before sleep</Td>
                            <Td>30 days</Td>
                            <Td><Badge colorScheme="green">Active</Badge></Td>
                          </Tr>
                          <Tr>
                            <Td>Mahanarayan Oil</Td>
                            <Td>External use</Td>
                            <Td>Daily massage</Td>
                            <Td>15 days</Td>
                            <Td><Badge colorScheme="blue">Ongoing</Badge></Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </CardBody>
                </Card>

                <Card variant="outline">
                  <CardBody>
                    <Text fontSize="lg" fontWeight="bold" mb={4} color="purple.600">
                      Medicine Administration Record
                    </Text>
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                      <Box p={4} bg="green.50" borderRadius="md">
                        <Text fontSize="sm" fontWeight="bold" color="green.700">Morning Dose</Text>
                        <Text fontSize="xs" color="gray.600">6:00 AM - Ashwagandha ✓</Text>
                        <Text fontSize="xs" color="gray.600">8:00 AM - Breakfast medicines ✓</Text>
                      </Box>
                      <Box p={4} bg="yellow.50" borderRadius="md">
                        <Text fontSize="sm" fontWeight="bold" color="yellow.700">Afternoon Dose</Text>
                        <Text fontSize="xs" color="gray.600">2:00 PM - Post lunch medicines ✓</Text>
                      </Box>
                      <Box p={4} bg="blue.50" borderRadius="md">
                        <Text fontSize="sm" fontWeight="bold" color="blue.700">Evening Dose</Text>
                        <Text fontSize="xs" color="gray.600">8:00 PM - Ashwagandha ✓</Text>
                        <Text fontSize="xs" color="gray.600">10:00 PM - Triphala ⏳</Text>
                      </Box>
                    </SimpleGrid>
                  </CardBody>
                </Card>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" onClick={onMedicineChartClose}>
              Close
            </Button>
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

      {/* Diagnosis Details Modal */}
      <Modal isOpen={isDiagnosisOpen} onClose={onDiagnosisClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <Stethoscope size={20} />
              <Text>Diagnosis Details - {selectedPatient?.name}</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedPatient && (
              <VStack spacing={4} align="stretch">
                <Box p={4} bg="purple.50" borderRadius="lg">
                  <VStack align="start" spacing={2}>
                    <Text fontWeight="bold" color="purple.700">
                      Ayurvedic Diagnosis: {selectedPatient.ayurvedicDiagnosis}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      IPD No: {selectedPatient.ipdNo} | Patient: {selectedPatient.name}
                    </Text>
                  </VStack>
                </Box>
                
                <Box>
                  <Text fontWeight="semibold" mb={2} color="gray.700">
                    Detailed Diagnosis:
                  </Text>
                  <Text p={3} bg="gray.50" borderRadius="md" fontSize="sm" lineHeight="tall">
                    {selectedPatient.diagnosisDetails || 'No detailed diagnosis available.'}
                  </Text>
                </Box>

                <SimpleGrid columns={2} spacing={4}>
                  <Box>
                    <Text fontWeight="semibold" mb={1} color="gray.700" fontSize="sm">
                      Prakriti:
                    </Text>
                    <Badge colorScheme="teal">{selectedPatient.prakriti}</Badge>
                  </Box>
                  <Box>
                    <Text fontWeight="semibold" mb={1} color="gray.700" fontSize="sm">
                      Dosha Status:
                    </Text>
                    <Badge colorScheme="orange">{selectedPatient.dosha}</Badge>
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text fontWeight="semibold" mb={2} color="gray.700">
                    Treatment Plan:
                  </Text>
                  <VStack align="start" spacing={2}>
                    <HStack>
                      <Text fontSize="sm" fontWeight="medium">Therapy:</Text>
                      <Text fontSize="sm">{selectedPatient.therapy}</Text>
                    </HStack>
                    <HStack>
                      <Text fontSize="sm" fontWeight="medium">Panchakarma:</Text>
                      <Text fontSize="sm" color="orange.600">{selectedPatient.panchakarma}</Text>
                    </HStack>
                  </VStack>
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" onClick={onDiagnosisClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Patient Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="orange.500" color="white">
            <HStack spacing={2}>
              <Edit3 size={20} />
              <Text>Edit Patient - {selectedPatient?.name}</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody p={6}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl isRequired>
                <FormLabel>Registration Number</FormLabel>
                <Input
                  value={newPatient.regNo}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, regNo: e.target.value }))}
                  placeholder="Enter registration number"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>IPD Number</FormLabel>
                <Input
                  value={newPatient.ipdNo}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, ipdNo: e.target.value }))}
                  placeholder="Enter IPD number"
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
                <FormLabel>Diagnosis Details</FormLabel>
                <Textarea
                  value={newPatient.diagnosisDetails}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, diagnosisDetails: e.target.value }))}
                  placeholder="Enter detailed diagnosis"
                  rows={3}
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
                <FormLabel>Status</FormLabel>
                <Select
                  value={newPatient.status}
                  onChange={(e) => setNewPatient(prev => ({ ...prev, status: e.target.value }))}
                  placeholder="Select status"
                >
                  <option value="Active">Active</option>
                  <option value="Discharged">Discharged</option>
                </Select>
              </FormControl>
            </SimpleGrid>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onEditClose}>
              Cancel
            </Button>
            <Button
              colorScheme="orange"
              onClick={handleUpdatePatient}
              isDisabled={!newPatient.name || !newPatient.regNo}
            >
              Update Patient
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Treatment Chart Assignment Modal */}
      <Modal isOpen={isAssignTreatmentOpen} onClose={onAssignTreatmentClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="green.500" color="white">
            <HStack spacing={2}>
              <Activity size={20} />
              <Text>Assign Treatment Chart</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody p={6}>
            <VStack spacing={6} align="stretch">
              {/* Treatment Plan Overview */}
              <Box>
                <Text fontSize="lg" fontWeight="bold" mb={4} color="green.600">
                  Treatment Plan Details
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl>
                    <FormLabel>Start Date</FormLabel>
                    <Input
                      type="date"
                      value={treatmentChart.startDate}
                      onChange={(e) => setTreatmentChart(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Duration (Days)</FormLabel>
                    <Input
                      value={treatmentChart.duration}
                      onChange={(e) => setTreatmentChart(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="e.g., 7, 14, 21"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Frequency</FormLabel>
                    <Select
                      value={treatmentChart.frequency}
                      onChange={(e) => setTreatmentChart(prev => ({ ...prev, frequency: e.target.value }))}
                      placeholder="Select frequency"
                    >
                      <option value="Daily">Daily</option>
                      <option value="Twice Daily">Twice Daily</option>
                      <option value="Alternate Days">Alternate Days</option>
                      <option value="Weekly">Weekly</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Notes</FormLabel>
                    <Textarea
                      value={treatmentChart.notes}
                      onChange={(e) => setTreatmentChart(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Special instructions or notes"
                      rows={2}
                    />
                  </FormControl>
                </SimpleGrid>
              </Box>

              <Divider />

              {/* Individual Treatments */}
              <Box>
                <HStack justify="space-between" mb={4}>
                  <Text fontSize="lg" fontWeight="bold" color="green.600">
                    Daily Treatment Schedule
                  </Text>
                  <Button
                    size="sm"
                    colorScheme="green"
                    onClick={addTreatmentToChart}
                    leftIcon={<Plus size={16} />}
                  >
                    Add Treatment
                  </Button>
                </HStack>
                
                <VStack spacing={4} align="stretch">
                  {treatmentChart.treatments.map((treatment, index) => (
                    <Card key={treatment.id} variant="outline">
                      <CardBody p={4}>
                        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                          <FormControl>
                            <FormLabel fontSize="sm">Time</FormLabel>
                            <Input
                              type="time"
                              value={treatment.time}
                              onChange={(e) => {
                                const updatedTreatments = treatmentChart.treatments.map(t =>
                                  t.id === treatment.id ? { ...t, time: e.target.value } : t
                                );
                                setTreatmentChart(prev => ({ ...prev, treatments: updatedTreatments }));
                              }}
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel fontSize="sm">Treatment</FormLabel>
                            <Select
                              value={treatment.treatment}
                              onChange={(e) => {
                                const updatedTreatments = treatmentChart.treatments.map(t =>
                                  t.id === treatment.id ? { ...t, treatment: e.target.value } : t
                                );
                                setTreatmentChart(prev => ({ ...prev, treatments: updatedTreatments }));
                              }}
                              placeholder="Select treatment"
                            >
                              <option value="Abhyanga (Oil Massage)">Abhyanga (Oil Massage)</option>
                              <option value="Swedana (Steam Therapy)">Swedana (Steam Therapy)</option>
                              <option value="Shirodhara">Shirodhara</option>
                              <option value="Panchakarma Therapy">Panchakarma Therapy</option>
                              <option value="Yoga & Pranayama">Yoga & Pranayama</option>
                              <option value="Physiotherapy">Physiotherapy</option>
                              <option value="Meditation">Meditation</option>
                            </Select>
                          </FormControl>
                          <FormControl>
                            <FormLabel fontSize="sm">Duration (mins)</FormLabel>
                            <HStack>
                              <Input
                                value={treatment.duration}
                                onChange={(e) => {
                                  const updatedTreatments = treatmentChart.treatments.map(t =>
                                    t.id === treatment.id ? { ...t, duration: e.target.value } : t
                                  );
                                  setTreatmentChart(prev => ({ ...prev, treatments: updatedTreatments }));
                                }}
                                placeholder="30"
                              />
                              <IconButton
                                icon={<X size={16} />}
                                size="sm"
                                colorScheme="red"
                                variant="ghost"
                                onClick={() => removeTreatmentFromChart(treatment.id)}
                              />
                            </HStack>
                          </FormControl>
                        </SimpleGrid>
                      </CardBody>
                    </Card>
                  ))}
                </VStack>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onAssignTreatmentClose}>
              Cancel
            </Button>
            <Button
              colorScheme="green"
              onClick={handleAssignTreatmentChart}
              isDisabled={treatmentChart.treatments.length === 0}
            >
              Assign Treatment Chart
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Medicine Chart Assignment Modal */}
      <Modal isOpen={isAssignMedicineOpen} onClose={onAssignMedicineClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="purple.500" color="white">
            <HStack spacing={2}>
              <Clipboard size={20} />
              <Text>Assign Medicine Chart</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody p={6}>
            <VStack spacing={6} align="stretch">
              {/* Medicine Plan Overview */}
              <Box>
                <Text fontSize="lg" fontWeight="bold" mb={4} color="purple.600">
                  Medicine Plan Details
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl>
                    <FormLabel>Treatment Duration</FormLabel>
                    <Input
                      value={medicineChart.duration}
                      onChange={(e) => setMedicineChart(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="e.g., 7 days, 2 weeks, 1 month"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Special Instructions</FormLabel>
                    <Textarea
                      value={medicineChart.instructions}
                      onChange={(e) => setMedicineChart(prev => ({ ...prev, instructions: e.target.value }))}
                      placeholder="Dietary restrictions, timing notes, etc."
                      rows={2}
                    />
                  </FormControl>
                </SimpleGrid>
              </Box>

              <Divider />

              {/* Individual Medicines */}
              <Box>
                <HStack justify="space-between" mb={4}>
                  <Text fontSize="lg" fontWeight="bold" color="purple.600">
                    Medicine Schedule
                  </Text>
                  <Button
                    size="sm"
                    colorScheme="purple"
                    onClick={addMedicineToChart}
                    leftIcon={<Plus size={16} />}
                  >
                    Add Medicine
                  </Button>
                </HStack>
                
                <VStack spacing={4} align="stretch">
                  {medicineChart.medicines.map((medicine, index) => (
                    <Card key={medicine.id} variant="outline">
                      <CardBody p={4}>
                        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                          <FormControl>
                            <FormLabel fontSize="sm">Medicine Name</FormLabel>
                            <Input
                              value={medicine.medicine}
                              onChange={(e) => {
                                const updatedMedicines = medicineChart.medicines.map(m =>
                                  m.id === medicine.id ? { ...m, medicine: e.target.value } : m
                                );
                                setMedicineChart(prev => ({ ...prev, medicines: updatedMedicines }));
                              }}
                              placeholder="e.g., Ashwagandha Churna"
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel fontSize="sm">Dosage</FormLabel>
                            <Input
                              value={medicine.dosage}
                              onChange={(e) => {
                                const updatedMedicines = medicineChart.medicines.map(m =>
                                  m.id === medicine.id ? { ...m, dosage: e.target.value } : m
                                );
                                setMedicineChart(prev => ({ ...prev, medicines: updatedMedicines }));
                              }}
                              placeholder="e.g., 5g, 2 tablets"
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel fontSize="sm">Frequency</FormLabel>
                            <HStack>
                              <Select
                                value={medicine.frequency}
                                onChange={(e) => {
                                  const updatedMedicines = medicineChart.medicines.map(m =>
                                    m.id === medicine.id ? { ...m, frequency: e.target.value } : m
                                  );
                                  setMedicineChart(prev => ({ ...prev, medicines: updatedMedicines }));
                                }}
                                placeholder="Select frequency"
                              >
                                <option value="Once Daily">Once Daily</option>
                                <option value="Twice Daily">Twice Daily</option>
                                <option value="Thrice Daily">Thrice Daily</option>
                                <option value="As Needed">As Needed</option>
                              </Select>
                              <IconButton
                                icon={<X size={16} />}
                                size="sm"
                                colorScheme="red"
                                variant="ghost"
                                onClick={() => removeMedicineFromChart(medicine.id)}
                              />
                            </HStack>
                          </FormControl>
                          <FormControl>
                            <FormLabel fontSize="sm">Timing</FormLabel>
                            <Select
                              value={medicine.timing}
                              onChange={(e) => {
                                const updatedMedicines = medicineChart.medicines.map(m =>
                                  m.id === medicine.id ? { ...m, timing: e.target.value } : m
                                );
                                setMedicineChart(prev => ({ ...prev, medicines: updatedMedicines }));
                              }}
                              placeholder="Select timing"
                            >
                              <option value="Before Meals">Before Meals</option>
                              <option value="After Meals">After Meals</option>
                              <option value="With Meals">With Meals</option>
                              <option value="Empty Stomach">Empty Stomach</option>
                              <option value="Before Sleep">Before Sleep</option>
                            </Select>
                          </FormControl>
                          <FormControl>
                            <FormLabel fontSize="sm">Duration</FormLabel>
                            <Input
                              value={medicine.duration}
                              onChange={(e) => {
                                const updatedMedicines = medicineChart.medicines.map(m =>
                                  m.id === medicine.id ? { ...m, duration: e.target.value } : m
                                );
                                setMedicineChart(prev => ({ ...prev, medicines: updatedMedicines }));
                              }}
                              placeholder="e.g., 7 days, 2 weeks"
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel fontSize="sm">Instructions</FormLabel>
                            <Input
                              value={medicine.instructions}
                              onChange={(e) => {
                                const updatedMedicines = medicineChart.medicines.map(m =>
                                  m.id === medicine.id ? { ...m, instructions: e.target.value } : m
                                );
                                setMedicineChart(prev => ({ ...prev, medicines: updatedMedicines }));
                              }}
                              placeholder="Special instructions"
                            />
                          </FormControl>
                        </SimpleGrid>
                      </CardBody>
                    </Card>
                  ))}
                </VStack>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onAssignMedicineClose}>
              Cancel
            </Button>
            <Button
              colorScheme="purple"
              onClick={handleAssignMedicineChart}
              isDisabled={medicineChart.medicines.length === 0}
            >
              Assign Medicine Chart
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
    </>
  );
}

export default IPD;