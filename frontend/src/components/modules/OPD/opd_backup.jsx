// Helper to get initial newPatient state
function getInitialNewPatient() {
  return {
    patientName: '',
    caseId: '',
    appointmentDate: '',
    appointmentTime: '',
    consultant: '',
    reference: '',
    presentComplaints: [
      { complaint: '', duration: '' },
      { complaint: '', duration: '' },
      { complaint: '', duration: '' },
      { complaint: '', duration: '' },
      { complaint: '', duration: '' }
    ],
    ayurvedicAssessment: {
      prakriti: '',
      vikriti: '',
      agni: '',
      ojas: ''
    },
    examination: {
      nadi: '',
      jihva: '',
      eyes: ''
    },
    clinicalAssessment: {
      roga: ''
    },
    familyHistory: {
      father: '',
      mother: '',
      brother: '',
      sister: '',
      others: ''
    },
    medicines: [],
    treatmentPlan: '',
    panchkarma: {
      isRequired: false,
      name: '',
      treatmentStartDate: '',
      duration: '',
      treatmentDates: '',
      notes: ''
    },
    patientAge: '',
    patientGender: '',
    patientPhone: '',
    patientEmail: '',
    bloodGroup: '',
    maritalStatus: '',
    patientAddress: '',
    documents: [],
  };
}
// Handle file upload for document upload section
const handleFileUpload = (event) => {
  const files = Array.from(event.target.files);
  // Only allow PDF, JPEG, PNG files up to 5MB each
  const validFiles = files.filter(file => {
    const fileType = file.type;
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    return validTypes.includes(fileType) && file.size <= 5 * 1024 * 1024;
  });
  if (validFiles.length !== files.length) {
    toast({
      title: 'Invalid Files',
      description: 'Only PDF, JPEG, and PNG files up to 5MB are allowed.',
      status: 'warning',
      duration: 3000,
      isClosable: true,
    });
  }
  setNewPatient(prev => ({
    ...prev,
    documents: [...(prev.documents || []), ...validFiles.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file)
    }))]
  }));
};

import React, { useState, useEffect } from 'react';
import { useDisclosure, useToast } from '@chakra-ui/react';
import { Box, VStack, Card, CardHeader, CardBody, HStack, Heading, Text, Button, IconButton, Tooltip, SimpleGrid, Badge, Flex, Modal, ModalContent, ModalFooter, Tabs, TabList, Tab, TabPanels, TabPanel, InputGroup, InputLeftElement, Input, Select, TableContainer, Table, Thead, Tr, Th, Tbody, Td, ModalOverlay, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, NumberInput, NumberInputField, Textarea, Divider, Icon, Spinner } from '@chakra-ui/react';
import { Stethoscope, Download, UserPlus, Users, CalendarCheck, TrendingUp, Upload, ClipboardList, Search, Filter, RefreshCw, ChevronLeft, ChevronRight, Plus, Edit, FileText } from 'lucide-react';
import { FileSpreadsheet } from 'lucide-react';
import { Printer, Eye, FilePlus, Edit3, PlusCircle, Trash2, Pill, Paperclip, X, Bed, History, MoreVertical, Menu as MenuIcon } from 'lucide-react';
import { Menu, MenuButton, MenuList, MenuItem, Avatar } from '@chakra-ui/react';

import { jsPDF } from 'jspdf';
import PrescriptionModal from '../AyurvedicPrescription/PrescriptionModal';
import { FaUser } from 'react-icons/fa';
import * as XLSX from 'xlsx';

import { useRef } from 'react';
import { countryList } from '/src/utils/countryList.js';

// Example API endpoint (replace with your real endpoint)
const OPD_API_URL = '/api/opd-patients';

function OPD() {
  // --- ENTER TO NEXT FIELD REFS ---
  const nameRef = useRef();
  const ageRef = useRef();
  const genderRef = useRef();
  const phoneRef = useRef();
  const emailRef = useRef();
  const bloodRef = useRef();
  const maritalRef = useRef();
  // Helper to focus next
  const handleEnter = (e, nextRef) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextRef && nextRef.current) nextRef.current.focus();
    }
  };
  // Track the highest caseId number for auto-increment
  const [maxCaseIdNum, setMaxCaseIdNum] = useState(0);
  // Import handler for Excel/CSV (must be inside OPD function)
  const handleImportPatients = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      let data = new Uint8Array(e.target.result);
      let workbook = XLSX.read(data, { type: 'array' });
      let sheetName = workbook.SheetNames[0];
      let sheet = workbook.Sheets[sheetName];
      let json = XLSX.utils.sheet_to_json(sheet, { defval: '' });
      // Find max caseId number in import
      let maxNum = maxCaseIdNum;
      json.forEach(row => {
        // Accept caseId as OPD### or number
        let num = 0;
        if (row.caseId) {
          const match = String(row.caseId).match(/OPD(\d+)/i);
          if (match) num = parseInt(match[1]);
          else if (!isNaN(row.caseId)) num = parseInt(row.caseId);
        }
        if (num > maxNum) maxNum = num;
      });
      setMaxCaseIdNum(maxNum);
      // Add imported patients
      setOpdPatients(prev => [...prev, ...json.map((row, i) => ({ ...row, id: Date.now() + i }))]);
      toast({ title: 'Patients Imported', status: 'success', duration: 3000 });
    };
    reader.readAsArrayBuffer(file);
  };
  // Ref for import file input (for patient import)
  const importFileRef = React.useRef(null);
  // Ref for file input in document upload
  const fileInputRef = useRef(null);
  // Loading state for API
  const [loading, setLoading] = useState(true);
  // State for selected patient (for view/edit modals)
  const [selectedPatient, setSelectedPatient] = useState(null);
  // Accent teal color for icons
  const accentTeal = '#14b8a6';
  // Title for the OPD page
  const title = 'Outpatient Department (OPD)';
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isExportOpen, onOpen: onExportOpen, onClose: onExportClose } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isViewPrescriptionOpen, onOpen: onViewPrescriptionOpen, onClose: onViewPrescriptionClose } = useDisclosure();
  const { isOpen: isPrescriptionOpen, onOpen: onPrescriptionOpen, onClose: onPrescriptionClose } = useDisclosure();
  const { isOpen: isUploadOpen, onOpen: onUploadOpen, onClose: onUploadClose } = useDisclosure();
  const { isOpen: isPatientInfoOpen, onOpen: onPatientInfoOpen, onClose: onPatientInfoClose } = useDisclosure();
  const toast = useToast();

  // State for newPatient, currentMedicine, editFormData, isEditMode, editingSection, prescriptionPatient, uploadPatient, uploadFiles, uploadDescription
  const [newPatient, setNewPatient] = useState(getInitialNewPatient());
  const [currentMedicine, setCurrentMedicine] = useState({});
  const [editFormData, setEditFormData] = useState({});
  const [isEditMode, setIsEditMode] = useState({});
  const [editingSection, setEditingSection] = useState(null);
  const [prescriptionPatient, setPrescriptionPatient] = useState(null);
  const [uploadPatient, setUploadPatient] = useState(null);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploadDescription, setUploadDescription] = useState("");
  // Primary blue color for icons
  const primaryBlue = '#2563eb';
  // Default card background color
  const cardBg = 'white';
  // Default background gradient for the page
  const bgGradient = 'linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)';
  // State for current page in pagination
  const [currentPage, setCurrentPage] = useState(1);
  // State for pagination
  const [itemsPerPage, setItemsPerPage] = useState(10);
  // State for search term
  const [searchTerm, setSearchTerm] = useState("");
  // State for active tab
  const [activeTab, setActiveTab] = useState(0);

  // State for OPD patients
  const [opdPatients, setOpdPatients] = useState([]);
  // Fetch OPD patients from backend API on mount
  useEffect(() => {
    setLoading(true);
    fetch(OPD_API_URL)
      .then(res => res.json())
      .then(data => {
        setOpdPatients(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        // Fallback to mock data if API fails
        setOpdPatients([
          {
            id: 1,
            patientName: 'John Doe',
            caseId: 'OPD001',
            appointmentDate: '2025-09-19',
            appointmentTime: '10:00',
            consultant: 'Dr. Smith',
            symptoms: 'Fever, Cough',
            status: 'scheduled',
            patientAge: 35,
            patientGender: 'Male',
            patientPhone: '1234567890',
            patientEmail: 'john@example.com',
            patientAddress: '123 Main St',
            bloodGroup: 'A+',
            maritalStatus: 'Married',
            medicines: [],
            familyHistory: {},
            ayurvedicAssessment: {},
            examination: {},
            clinicalAssessment: {},
            panchkarma: {},
            treatmentPlan: '',
            presentComplaints: [],
            documents: []
          },
          {
            id: 2,
            patientName: 'Jane Smith',
            caseId: 'OPD002',
            appointmentDate: '2025-09-19',
            appointmentTime: '11:00',
            consultant: 'Dr. Patel',
            symptoms: 'Headache',
            status: 'scheduled',
            patientAge: 28,
            patientGender: 'Female',
            patientPhone: '9876543210',
            patientEmail: 'jane@example.com',
            patientAddress: '456 Elm St',
            bloodGroup: 'B-',
            maritalStatus: 'Single',
            medicines: [],
            familyHistory: {},
            ayurvedicAssessment: {},
            examination: {},
            clinicalAssessment: {},
            panchkarma: {},
            treatmentPlan: '',
            presentComplaints: [],
            documents: []
          }
        ]);
        setLoading(false);
      });
  }, []);
  // ...existing code...

  // Filter patients based on active tab and search term
  const getFilteredPatients = () => {
    let filtered = opdPatients;
    // Filter by tab
    const today = new Date().toISOString().split('T')[0];
    switch (activeTab) {
      case 0: // Today OPD
        filtered = filtered.filter(patient => {
          const appointmentDate = new Date(patient.appointmentDate).toISOString().split('T')[0];
          return appointmentDate === today;
        });
        break;
      case 1: // Upcoming OPD
        filtered = filtered.filter(patient => {
          const appointmentDate = new Date(patient.appointmentDate).toISOString().split('T')[0];
          return appointmentDate > today;
        });
        break;
      case 2: // Old OPD
        filtered = filtered.filter(patient => {
          const appointmentDate = new Date(patient.appointmentDate).toISOString().split('T')[0];
          return appointmentDate < today;
        });
        break;
      case 3: // Patient View
        // Show all patients
        break;
    }
      // Filter by search term
      if (searchTerm) {
        filtered = filtered.filter(patient =>
          (patient?.patientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (patient?.caseId ? patient.caseId.toString() : '').includes(searchTerm) ||
          (patient?.consultant || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (patient?.symptoms || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    return filtered;
  };

  const filteredPatients = getFilteredPatients();
  
  // Calculate statistics
  const totalPatients = opdPatients.length;
  const todayPatients = Array.isArray(opdPatients) ? opdPatients.filter(patient => {
    const appointmentDate = new Date(patient.appointmentDate).toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    return appointmentDate === today;
  }).length : 0;
  const upcomingPatients = Array.isArray(opdPatients) ? opdPatients.filter(patient => {
    const appointmentDate = new Date(patient.appointmentDate).toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    return appointmentDate > today;
  }).length : 0;
  const completedPatients = Array.isArray(opdPatients) ? opdPatients.filter(patient => {
    const appointmentDate = new Date(patient.appointmentDate).toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    return appointmentDate < today;
  }).length : 0;
  
  const totalPages = Math.ceil((filteredPatients?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPatients = (filteredPatients || []).slice(startIndex, startIndex + itemsPerPage);

  const handleAddPatient = () => {
    const newCaseId = Math.max(...opdPatients.map(p => p.caseId)) + 1;
    const newPatientData = {
      ...newPatient,
      id: opdPatients.length + 1,
      caseId: newCaseId,
      generatedBy: 'Current User (9999)',
      status: 'scheduled'
    };
    
    setOpdPatients([...opdPatients, newPatientData]);
    setNewPatient({
      patientName: '',
      caseId: '',
      appointmentDate: '',
      appointmentTime: '',
      consultant: '',
      reference: '',
      // Reset Medical Information - New Structure
      presentComplaints: [
        { complaint: '', duration: '' },
        { complaint: '', duration: '' },
        { complaint: '', duration: '' },
        { complaint: '', duration: '' },
        { complaint: '', duration: '' }
      ],
      ayurvedicAssessment: {
        prakriti: '',
        vikriti: '',
        agni: '',
        ojas: ''
      },
      examination: {
        nadi: '',
        jihva: '',
        eyes: ''
      },
      clinicalAssessment: {
        roga: ''
      },
      familyHistory: {
        father: '',
        mother: '',
        brother: '',
        sister: '',
        others: ''
      },
      medicines: [],
      treatmentPlan: '',
      panchkarma: {
        isRequired: false,
        name: '',
        treatmentStartDate: '',
        duration: '',
        treatmentDates: '',
        notes: ''
      },
      patientAge: '',
      patientGender: '',
      patientPhone: '',
      patientEmail: '',
      patientAddress: '',
      bloodGroup: '',
      emergencyContact: '',
      maritalStatus: '',
      occupation: ''
    });
    setCurrentMedicine({
      medicineDetails: '',
      type: '',
      dose: '',
      anupana: '',
      duration: '',
      note: ''
    });
    
    // Check if Panchkarma is required and send to IPD
    if (newPatient.panchkarma && newPatient.panchkarma.isRequired && newPatient.panchkarma.name && newPatient.panchkarma.treatmentStartDate) {
      handleSendToIPD(newPatientData);
    }
    // Show success toast
    const panchkarmaMessage = (newPatient.panchkarma && newPatient.panchkarma.isRequired && newPatient.panchkarma.name)
      ? ` & IPD booking confirmed for ${newPatient.panchkarma.name}`
      : '';
    toast({
      title: 'Patient Added Successfully',
      description: `Patient ${newPatient.patientName} added to OPD${panchkarmaMessage}`,
      status: 'success',
      duration: 4000,
      isClosable: true,
      position: 'top-right'
    });
    
    onAddClose();
  };

  // Send patient and Panchkarma details to IPD
  const handleSendToIPD = (patientData) => {
    const ipdData = {
      patient: {
        name: patientData.patientName,
        caseId: patientData.caseId,
        number: patientData.patientPhone,
        age: patientData.patientAge,
        date: patientData.appointmentDate || new Date().toISOString().split('T')[0]
      },
      panchkarma: patientData.panchkarma,
      treatmentStartDate: patientData.panchkarma.treatmentStartDate,
      bookingDetails: {
        treatmentType: 'Panchkarma',
        duration: patientData.panchkarma.duration,
        treatmentDates: patientData.panchkarma.treatmentDates,
        notes: patientData.panchkarma.notes,
        bookedOn: new Date().toISOString(),
        bookedBy: 'Current User (OPD)'
      }
    };

    // In a real application, this would send data to IPD system/API
    console.log('Sending to IPD for Panchkarma treatment:', ipdData);
    
    // Show IPD booking confirmation
    toast({
      title: 'IPD Booking Confirmed',
      description: `Patient ${patientData.patientName} booked for ${patientData.panchkarma.name} treatment starting ${patientData.panchkarma.treatmentStartDate}`,
      status: 'info',
      duration: 6000,
      isClosable: true,
      position: 'top-right'
    });
  };

  // Send patient and medicine details to pharmacy
  const handleSendToPharmacy = () => {
    // First, add the patient data (same as handleAddPatient)
    const newPatientData = {
      ...newPatient,
      id: Date.now(),
            symptoms: (newPatient.presentComplaints || []).map(pc => pc.complaint).filter(c => c).join(', ') || 'Not specified',
            symptomsDetails: (newPatient.clinicalAssessment?.roga) || 'Assessment pending',
            previousMedicalIssue: (newPatient.familyHistory?.father || newPatient.familyHistory?.mother || 'NA'),
      generatedBy: 'Current User (9999)',
      status: 'scheduled'
    };
    
    // Add patient to the system
    setOpdPatients([...opdPatients, newPatientData]);

    // Prepare pharmacy data with patient's basic details
    const pharmacyData = {
      patient: {
        name: newPatient.patientName,
        caseId: newPatient.caseId,
        age: newPatient.patientAge,
        gender: newPatient.patientGender,
        phone: newPatient.patientPhone,
        mobile: newPatient.patientPhone, // Adding mobile as requested
        date: newPatient.appointmentDate || new Date().toISOString().split('T')[0],
        email: newPatient.patientEmail,
        address: newPatient.patientAddress
      },
      medicines: newPatient.medicines,
      prescribedBy: newPatient.consultant || 'Current Doctor',
      prescriptionDate: new Date().toISOString().split('T')[0],
      notes: newPatient.treatmentPlan
    };

    // In a real application, this would send data to pharmacy system/API
    console.log('Sending to Pharmacy:', pharmacyData);
    
    // Check if Panchkarma is required and send to IPD
    if (newPatient.panchkarma && newPatient.panchkarma.isRequired && newPatient.panchkarma.name && newPatient.panchkarma.treatmentStartDate) {
      handleSendToIPD(newPatientData);
    }
    
    // Reset form after adding patient and sending to pharmacy
    setNewPatient({
      patientName: '',
      caseId: '',
      appointmentDate: '',
      appointmentTime: '',
      consultant: '',
      reference: '',
      // Reset Medical Information - New Structure
      presentComplaints: [
        { complaint: '', duration: '' },
        { complaint: '', duration: '' },
        { complaint: '', duration: '' },
        { complaint: '', duration: '' },
        { complaint: '', duration: '' }
      ],
      ayurvedicAssessment: {
        prakriti: '',
        vikriti: '',
        agni: '',
        ojas: ''
      },
      examination: {
        nadi: '',
        jihva: '',
        eyes: ''
      },
      clinicalAssessment: {
        roga: ''
      },
      familyHistory: {
        father: '',
        mother: '',
        brother: '',
        sister: '',
        others: ''
      },
      medicines: [],
      treatmentPlan: '',
      panchkarma: {
        isRequired: false,
        name: '',
        treatmentStartDate: '',
        duration: '',
        treatmentDates: '',
        notes: ''
      },
      patientAge: '',
      patientGender: '',
      patientPhone: '',
      patientEmail: '',
      patientAddress: '',
      bloodGroup: '',
      emergencyContact: '',
      maritalStatus: '',
      occupation: ''
    });
    
    setCurrentMedicine({
      medicineDetails: '',
      type: '',
      dose: '',
      anupana: '',
      duration: '',
      note: ''
    });

    // Show success toast
    const panchkarmaMessage = (newPatient.panchkarma && newPatient.panchkarma.isRequired && newPatient.panchkarma.name)
      ? ` & IPD booking confirmed for ${newPatient.panchkarma.name}`
      : '';
    toast({
      title: 'Patient Added & Prescription Sent',
      description: `Patient ${newPatient.patientName} added successfully and prescription sent to pharmacy (${(newPatient.medicines?.length || 0)} medicine(s))${panchkarmaMessage}`,
      status: 'success',
      duration: 5000,
      isClosable: true,
      position: 'top-right'
    });

    // Close the modal
    onAddClose();
  };

  // Present Complaints management functions
  const addPresentComplaint = () => {
    setNewPatient(prev => ({
      ...prev,
      presentComplaints: [...prev.presentComplaints, { complaint: '', duration: '' }]
    }));
  };

  const removePresentComplaint = (index) => {
    setNewPatient(prev => ({
      ...prev,
      presentComplaints: prev.presentComplaints.filter((_, i) => i !== index)
    }));
  };

  const updatePresentComplaint = (index, field, value) => {
    setNewPatient(prev => ({
      ...prev,
      presentComplaints: prev.presentComplaints.map((complaint, i) =>
        i === index ? { ...complaint, [field]: value } : complaint
      )
    }));
  };

  // Medicine management functions for new patient form
  const handleAddMedicineToForm = () => {
  if (!(currentMedicine.medicineDetails && typeof currentMedicine.medicineDetails === 'string' && currentMedicine.medicineDetails.trim())) return;
    
    const newMedicines = [...newPatient.medicines, { ...currentMedicine, id: Date.now() }];
    setNewPatient(prev => ({ ...prev, medicines: newMedicines }));
    setCurrentMedicine({
      medicineDetails: '',
      type: '',
      dose: '',
      anupana: '',
      duration: '',
      note: ''
    });
  };

  const handleRemoveMedicine = (medicineId) => {
    const updatedMedicines = newPatient.medicines.filter(m => m.id !== medicineId);
    setNewPatient(prev => ({ ...prev, medicines: updatedMedicines }));
  };

  // Prescription management functions for new patient form
  const handleAddPrescriptionToForm = () => {
  if (!(currentPrescription.medicine && typeof currentPrescription.medicine === 'string' && currentPrescription.medicine.trim())) return;
    
    const newPrescriptions = [...newPatient.prescriptions, { ...currentPrescription, id: Date.now() }];
    setNewPatient(prev => ({ ...prev, prescriptions: newPrescriptions }));
    setCurrentPrescription({
      medicine: '',
      type: '',
      dose: '',
      anupana: '',
      kala: '',
      duration: '',
      instructions: ''
    });
  };

  const handleRemovePrescription = (prescriptionId) => {
    const updatedPrescriptions = newPatient.prescriptions.filter(p => p.id !== prescriptionId);
    setNewPatient(prev => ({ ...prev, prescriptions: updatedPrescriptions }));
  };

  // Ayurvedic Assessment Options
  const prakritiOptions = [
    'Vata Prakriti',
    'Pitta Prakriti',
    'Kapha Prakriti',
    'Vata-Pitta',
    'Vata-Kapha',
    'Pitta-Kapha',
    'Tridoshaja'
  ];

  const vikritiOptions = [
    'Vata Vikriti',
    'Pitta Vikriti',
    'Kapha Vikriti',
    'Vata-Pitta Vikriti',
    'Vata-Kapha Vikriti',
    'Pitta-Kapha Vikriti',
    'Tridosh Vikriti'
  ];

  const agniOptions = [
    'Sama Agni (Balanced)',
    'Vishama Agni (Irregular)',
    'Tikshna Agni (Sharp)',
    'Manda Agni (Weak)'
  ];

  const ojasOptions = [
    'Uttama Ojas (Excellent)',
    'Madhyama Ojas (Moderate)',
    'Hina Ojas (Low)'
  ];

  // Examination Options
  const nadiOptions = [
    'Sama Gati (Normal)',
    'Vata Gati (Fast/Irregular)',
    'Pitta Gati (Strong/Rapid)',
    'Kapha Gati (Slow/Steady)'
  ];

  const jihvaOptions = [
    'Sama Jihva (Normal)',
    'Sama with Coating',
    'Ruksha (Dry)',
    'Snigdha (Moist)',
    'With Ama'
  ];

  const eyesOptions = [
    'Prakrit (Normal)',
    'Rakt Netra (Red)',
    'Peet Netra (Yellow)',
    'Krishna Mandal Spasht (Clear)'
  ];

  // Dose Options
  const doseOptions = [
    '1 Ratti',
    '2 Ratti',
    '3 Ratti',
    '1 Masha',
    '2 Masha',
    '1 Karsha',
    '2 Karsha',
    '1/4 Pala',
    '1/2 Pala',
    '1 Pala'
  ];

  // Ayurvedic Medicine Types
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

  // Anupana (Vehicles)
  const anupanaOptions = [
    'Ushna Jala (Warm Water)',
    'Madhu (Honey)',
    'Ghrita (Ghee)',
    'Dugdha (Milk)',
    'Takra (Buttermilk)',
    'Arista (Fermented liquid)',
    'Swarasa (Fresh juice)',
    'Coconut Water'
  ];

  // Kala (Time of administration)
  const kalaOptions = [
    'Pratar (Morning)',
    'Madhyahna (Afternoon)', 
    'Sayam (Evening)',
    'Ratri (Night)',
    'Pratah-Sayam (Morning-Evening)',
    'Bhojana Purva (Before meals)',
    'Bhojana Madhya (During meals)',
    'Bhojana Anta (After meals)',
    'Nishita (Midnight)',
    'As required'
  ];

  const handleViewPatient = (patient) => {
  if (typeof setSelectedPatient === 'function') setSelectedPatient(patient);
  if (typeof onViewOpen === 'function') onViewOpen();
  };

  const handleEditPatient = (patient) => {
  if (typeof setSelectedPatient === 'function') setSelectedPatient(patient);
  setNewPatient(patient);
  if (typeof onEditOpen === 'function') onEditOpen();
  };

  // Edit section handlers
  const handleEditSection = (sectionName) => {
    setEditingSection(sectionName);
    setIsEditMode(prev => ({ ...prev, [sectionName]: true }));
    
    // Initialize form data with current patient data
    if (selectedPatient) {
      setEditFormData({
        ...selectedPatient,
        // Add default values for new fields if they don't exist
        chiefComplaint: selectedPatient.chiefComplaint || selectedPatient.symptoms || '',
        complaintDuration: selectedPatient.complaintDuration || '',
        severityLevel: selectedPatient.severityLevel || 'Medium',
        runningTreatment: selectedPatient.runningTreatment || '',
        treatmentStartDate: selectedPatient.treatmentStartDate || '',
        treatmentDuration: selectedPatient.treatmentDuration || '',
        familyHistory: {
          father: {
            age: selectedPatient.familyHistory?.father?.age || '',
            healthStatus: selectedPatient.familyHistory?.father?.healthStatus || '',
            conditions: selectedPatient.familyHistory?.father?.conditions || '',
            causeOfDeath: selectedPatient.familyHistory?.father?.causeOfDeath || ''
          },
          mother: {
            age: selectedPatient.familyHistory?.mother?.age || '',
            healthStatus: selectedPatient.familyHistory?.mother?.healthStatus || '',
            conditions: selectedPatient.familyHistory?.mother?.conditions || '',
            causeOfDeath: selectedPatient.familyHistory?.mother?.causeOfDeath || ''
          },
          siblings: selectedPatient.familyHistory?.siblings || [],
          diabetes: selectedPatient.familyHistory?.diabetes || '',
          hypertension: selectedPatient.familyHistory?.hypertension || '',
          heartDisease: selectedPatient.familyHistory?.heartDisease || '',
          cancer: selectedPatient.familyHistory?.cancer || '',
          mentalHealth: selectedPatient.familyHistory?.mentalHealth || '',
          other: selectedPatient.familyHistory?.other || ''
        }
      });
    }
  };

  const handleSaveSection = (sectionName) => {
    // Update the selected patient with new data
    const updatedPatient = {
      ...selectedPatient,
      ...editFormData
    };
    
    setSelectedPatient(updatedPatient);
    
    // Update the patient in the main list
    setOpdPatients(prev => 
      prev.map(patient => 
        patient.id === selectedPatient.id ? updatedPatient : patient
      )
    );
    
    // Exit edit mode
    setIsEditMode(prev => ({ ...prev, [sectionName]: false }));
    setEditingSection(null);
    
    console.log('Section saved:', sectionName, updatedPatient);
  };

  const handleCancelEdit = (sectionName) => {
    setIsEditMode(prev => ({ ...prev, [sectionName]: false }));
    setEditingSection(null);
    setEditFormData({});
  };

  const handleFormDataChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedFormDataChange = (section, field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handlePrintPatient = (patient) => {
    // Handle print functionality
    console.log('Printing details for patient:', patient.caseId);
    // Generate printable content
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Patient Details - ${patient.patientName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .patient-info { margin-bottom: 20px; }
            .section { margin-bottom: 15px; }
            .label { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Patient Details Report</h1>
            <h2>OPD Department</h2>
          </div>
          <div class="patient-info">
            <div class="section"><span class="label">Case ID:</span> ${patient.caseId}</div>
            <div class="section"><span class="label">Patient Name:</span> ${patient.patientName}</div>
            <div class="section"><span class="label">Age:</span> ${patient.age}</div>
            <div class="section"><span class="label">Gender:</span> ${patient.gender}</div>
            <div class="section"><span class="label">Contact:</span> ${patient.contact}</div>
            <div class="section"><span class="label">Doctor:</span> ${patient.doctor}</div>
            <div class="section"><span class="label">Date:</span> ${patient.date}</div>
            <div class="section"><span class="label">Time:</span> ${patient.time}</div>
            <div class="section"><span class="label">Status:</span> ${patient.status}</div>
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const handleViewPrescription = (patient) => {
    setSelectedPatient(patient);
    onViewPrescriptionOpen();
  };

  const handleAddPrescription = (patient) => {
    setPrescriptionPatient(patient);
    onPrescriptionOpen();
  };

  const handleUploadReports = (patient) => {
    setUploadPatient(patient);
    setUploadFiles([]);
    setUploadDescription('');
    onUploadOpen();
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => {
      const fileType = file.type;
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      return validTypes.includes(fileType) && file.size <= 10 * 1024 * 1024; // 10MB limit
    });

    if (validFiles.length !== files.length) {
      toast({
        title: "Invalid Files",
        description: "Only PDF, JPEG, and PNG files under 10MB are allowed.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }

    setUploadFiles(prev => [...prev, ...validFiles]);
  };

  const handleRemoveFile = (index) => {
    setUploadFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitUpload = async () => {
    if (uploadFiles.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select at least one file to upload.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      // Here you would implement the actual file upload logic
      // For now, we'll simulate the upload process
      
      console.log('Uploading files for patient:', uploadPatient?.caseId);
      console.log('Files:', uploadFiles);
      console.log('Description:', uploadDescription);
      
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Reports Uploaded Successfully",
        description: `${uploadFiles.length} file(s) uploaded for ${uploadPatient?.patientName}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Reset form and close modal
      setUploadFiles([]);
      setUploadDescription('');
      setUploadPatient(null);
      onUploadClose();

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading the files. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleMoveToIPD = (patient) => {
    // Handle move to IPD functionality
    console.log('Moving patient to IPD:', patient.caseId);
    // Here you would typically show a confirmation dialog and then move the patient
    const confirmMove = window.confirm(`Are you sure you want to move ${patient.patientName} to IPD?`);
    if (confirmMove) {
      alert(`${patient.patientName} has been moved to IPD`);
      // Update patient status or remove from OPD list
    }
  };

  const handleShowPatientInfo = (patient) => {
    // Handle showing detailed patient information page
    console.log('Showing patient information for:', patient.caseId);
    // This will open the comprehensive patient information modal
    setSelectedPatient(patient);
    onPatientInfoOpen();
  };

  const handleExport = (format) => {
    console.log('Export function called with format:', format);
    console.log('Filtered patients:', filteredPatients);
    
    const headers = ['Case ID', 'Patient Name', 'Age', 'Gender', 'Phone', 'Appointment Date', 'Appointment Time', 'Consultant', 'Symptoms', 'Status'];
    const currentDate = new Date().toISOString().split('T')[0];
    
    if (format === 'csv') {
      const csvContent = [
        headers.join(','),
        ...filteredPatients.map(patient => [
          patient.caseId,
          `"${patient.patientName}"`,
          patient.patientAge,
          patient.patientGender,
          patient.patientPhone,
          patient.appointmentDate,
          patient.appointmentTime,
          `"${patient.consultant}"`,
          `"${patient.symptoms}"`,
          patient.status
        ].join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `opd_patients_${currentDate}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
    } else if (format === 'pdf') {
      try {
        console.log('Starting PDF generation...');
        const doc = new jsPDF('l', 'mm', 'a4'); // landscape orientation
        
        // Add title
        doc.setFontSize(18);
        doc.setTextColor(59, 130, 246); // Blue color
        doc.text('OPD - Outpatient Department Records', 20, 20);
        
        // Add subtitle
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
        doc.text(`Total Records: ${filteredPatients.length}`, 20, 38);
        doc.text(`Tab: ${['Today OPD', 'Upcoming OPD', 'Old OPD', 'Patient View'][activeTab]}`, 20, 46);
        
        // Check if jsPDF autotable is available
        if (doc.autoTable) {
          console.log('Using autoTable for PDF generation');
          
          // Prepare table data
          const tableData = filteredPatients.map(patient => [
            patient.caseId || 'N/A',
            patient.patientName || 'N/A',
            patient.patientAge?.toString() || 'N/A',
            patient.patientGender || 'N/A',
            patient.appointmentDate || 'N/A',
            patient.appointmentTime || 'N/A',
            patient.consultant || 'N/A',
            patient.symptoms || 'N/A',
            patient.status || 'N/A'
          ]);
          
          // Add table with simpler configuration
          doc.autoTable({
            head: [['Case ID', 'Name', 'Age', 'Gender', 'Date', 'Time', 'Consultant', 'Symptoms', 'Status']],
            body: tableData,
            startY: 55,
            theme: 'striped',
            headStyles: {
              fillColor: [59, 130, 246],
              textColor: [255, 255, 255],
              fontStyle: 'bold',
              fontSize: 9
            },
            bodyStyles: {
              fontSize: 8
            },
            margin: { top: 55 },
            styles: {
              cellPadding: 2,
              fontSize: 8
            },
            columnStyles: {
              0: { cellWidth: 20 }, // Case ID
              1: { cellWidth: 35 }, // Name
              2: { cellWidth: 15 }, // Age
              3: { cellWidth: 20 }, // Gender
              4: { cellWidth: 25 }, // Date
              5: { cellWidth: 20 }, // Time
              6: { cellWidth: 35 }, // Consultant
              7: { cellWidth: 40 }, // Symptoms
              8: { cellWidth: 20 }  // Status
            }
          });
        } else {
          console.log('autoTable not available, using simple text output');
          // Fallback: Simple text output
          let yPosition = 55;
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          
          // Add headers
          doc.text('Case ID', 20, yPosition);
          doc.text('Name', 50, yPosition);
          doc.text('Date', 100, yPosition);
          doc.text('Time', 130, yPosition);
          doc.text('Consultant', 160, yPosition);
          doc.text('Status', 220, yPosition);
          
          yPosition += 10;
          
          // Add patient data
          filteredPatients.forEach((patient, index) => {
            if (yPosition > 180) { // New page if needed
              doc.addPage();
              yPosition = 20;
            }
            
            doc.text(patient.caseId?.toString() || 'N/A', 20, yPosition);
            doc.text(patient.patientName || 'N/A', 50, yPosition);
            doc.text(patient.appointmentDate || 'N/A', 100, yPosition);
            doc.text(patient.appointmentTime || 'N/A', 130, yPosition);
            doc.text(patient.consultant || 'N/A', 160, yPosition);
            doc.text(patient.status || 'N/A', 220, yPosition);
            
            yPosition += 8;
          });
        }
        
        // Save the PDF
        doc.save(`opd_patients_${currentDate}.pdf`);
        console.log('PDF generated successfully');
        
      } catch (error) {
        console.error('PDF generation error:', error);
        alert('Error generating PDF: ' + error.message);
      }
      
    } else if (format === 'excel') {
      try {
        // Prepare data for Excel
        const excelData = [
          headers,
          ...filteredPatients.map(patient => [
            patient.caseId,
            patient.patientName,
            patient.patientAge,
            patient.patientGender,
            patient.patientPhone,
            patient.appointmentDate,
            patient.appointmentTime,
            patient.consultant,
            patient.symptoms,
            patient.status
          ])
        ];
        
        // Create workbook and worksheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(excelData);
        
        // Set column widths
        const colWidths = [
          { wch: 12 }, // Case ID
          { wch: 25 }, // Patient Name
          { wch: 8 },  // Age
          { wch: 10 }, // Gender
          { wch: 15 }, // Phone
          { wch: 15 }, // Appointment Date
          { wch: 15 }, // Appointment Time
          { wch: 25 }, // Consultant
          { wch: 30 }, // Symptoms
          { wch: 12 }  // Status
        ];
        ws['!cols'] = colWidths;
        
        // Style the header row
        const headerStyle = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "3B82F6" } },
          alignment: { horizontal: "center", vertical: "center" }
        };
        
        // Apply header styling
        for (let i = 0; i < headers.length; i++) {
          const cellRef = XLSX.utils.encode_cell({ r: 0, c: i });
          if (!ws[cellRef]) ws[cellRef] = {};
          ws[cellRef].s = headerStyle;
        }
        
        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, "OPD Records");
        
        // Add metadata sheet
        const metaData = [
          ['OPD Report Information'],
          ['Generated Date', new Date().toLocaleDateString()],
          ['Generated Time', new Date().toLocaleTimeString()],
          ['Active Tab', ['Today OPD', 'Upcoming OPD', 'Old OPD', 'Patient View'][activeTab]],
          ['Total Records', filteredPatients.length],
          ['Hospital', 'Hospital Management System - OPD'],
          [''],
          ['Statistics'],
          ['Today Patients', todayPatients],
          ['Upcoming Patients', upcomingPatients],
          ['Completed Patients', completedPatients]
        ];
        
        const metaWs = XLSX.utils.aoa_to_sheet(metaData);
        metaWs['!cols'] = [{ wch: 20 }, { wch: 30 }];
        XLSX.utils.book_append_sheet(wb, metaWs, "Report Info");
        
        // Save file
        XLSX.writeFile(wb, `opd_patients_${currentDate}.xlsx`);
        console.log('Excel file generated successfully');
        
      } catch (error) {
        console.error('Excel generation error:', error);
        alert('Error generating Excel file: ' + error.message);
      }
    }
    
    onExportClose();
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { colorScheme: 'green', label: 'Active' },
      completed: { colorScheme: 'blue', label: 'Completed' },
      scheduled: { colorScheme: 'orange', label: 'Scheduled' },
      cancelled: { colorScheme: 'red', label: 'Cancelled' }
    };
    
    const config = statusConfig[status] || statusConfig.scheduled;
    return <Badge colorScheme={config.colorScheme} size="sm">{config.label}</Badge>;
  };

  const tabLabels = ['Today OPD', 'Upcoming OPD', 'Old OPD', 'Patient View'];

  if (loading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50">
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text color="blue.700" fontWeight="semibold">Loading OPD patients...</Text>
        </VStack>
      </Box>
    );
  }
  return (
    <>
      <Box p={6}>
        <Box 
          minH="100vh" 
          bg="gray.50"
          bgImage={`url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233B82F6' fill-opacity='0.04'%3E%3Cpath d='M30 30c0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12 12-5.373 12-12zm12 0c0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12 12-5.373 12-12z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"), ${bgGradient}`}
          p={0}
        >
          <VStack spacing={6} align="stretch">
          {/* Modern Header */}
          <Card 
            bg={cardBg} 
            border="1px" 
            borderColor="blue.200"
            borderRadius="xl"
          boxShadow="lg"
          overflow="hidden"
          position="relative"
        >
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            height="3px"
            bgGradient="linear(90deg, blue.400, teal.500, purple.600)"
          />
          <CardHeader bg="blue.50">
            <Flex justifyContent="space-between" alignItems="center">
              <VStack align="start" spacing={2}>
                <Heading 
                  size="lg" 
                  color="blue.700"
                  display="flex"
                  alignItems="center"
                  gap={3}
                >
                  <Box p={2} bg="blue.100" borderRadius="lg">
                    <Stethoscope size={28} color={primaryBlue} />
                  </Box>
                  {title}
                </Heading>
                <Text color="blue.600" fontSize="sm" fontWeight="medium">
                  Comprehensive outpatient care and consultation management
                </Text>
              </VStack>
              <HStack spacing={3}>
                <Tooltip label="Export OPD Data" bg="blue.600">
                  <IconButton
                    icon={<Upload />}
                    variant="outline"
                    colorScheme="blue"
                    size="md"
                    onClick={onExportOpen}
                    borderColor="blue.300"
                    _hover={{ bg: 'blue.50', borderColor: 'blue.400' }}
                  />
                </Tooltip>
                <Button 
                  leftIcon={<FileSpreadsheet />} 
                  colorScheme="teal" 
                  variant="outline"
                  onClick={() => importFileRef.current.click()}
                  px={4}
                  borderRadius="lg"
                  boxShadow="md"
                  _hover={{ bg: 'teal.50', borderColor: 'teal.400' }}
                  transition="all 0.2s ease"
                >
                  Import Patients
                </Button>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  ref={importFileRef}
                  style={{ display: 'none' }}
                  onChange={handleImportPatients}
                />
                <Button 
                  leftIcon={<UserPlus />} 
                  colorScheme="blue" 
                  size="md"
                  borderRadius="lg"
                  px={6}
                  onClick={onAddOpen}
                  boxShadow="lg"
                  bgGradient="linear(to-r, blue.500, blue.600)"
                  _hover={{ 
                    transform: 'translateY(-2px)', 
                    boxShadow: 'xl',
                    bgGradient: "linear(to-r, blue.600, blue.700)"
                  }}
                  transition="all 0.2s ease"
                >
                  Add Patient
                </Button>
              </HStack>
            </Flex>
          </CardHeader>
        </Card>

        {/* Statistics Cards */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <Card 
            bg="white" 
            border="1px" 
            borderColor="blue.200"
            borderRadius="xl"
            overflow="hidden"
            position="relative"
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
            transition="all 0.2s ease"
          >
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              height="3px"
              bgGradient="linear(90deg, blue.400, blue.600)"
            />
            <CardBody>
              <HStack spacing={4}>
                <Box p={3} bg="blue.100" borderRadius="lg">
                  <Users size={24} color={primaryBlue} />
                </Box>
                <VStack align="start" spacing={1}>
                  <Text fontSize="2xl" fontWeight="bold" color="blue.700">
                    0
                  </Text>
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    Total Patients
                  </Text>
                </VStack>
              </HStack>
            </CardBody>
          </Card>

          <Card 
            bg="white" 
            border="1px" 
            borderColor="teal.200"
            borderRadius="xl"
            overflow="hidden"
            position="relative"
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
            transition="all 0.2s ease"
          >
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              height="3px"
              bgGradient="linear(90deg, teal.400, teal.600)"
            />
            <CardBody>
              <HStack spacing={4}>
                <Box p={3} bg="teal.100" borderRadius="lg">
                  <CalendarCheck size={24} color={accentTeal} />
                </Box>
                <VStack align="start" spacing={1}>
                  <Text fontSize="2xl" fontWeight="bold" color="teal.700">
                    0
                  </Text>
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    Today's Appointments
                  </Text>
                </VStack>
              </HStack>
            </CardBody>
          </Card>

          <Card 
            bg="white" 
            border="1px" 
            borderColor="purple.200"
            borderRadius="xl"
            overflow="hidden"
            position="relative"
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
            transition="all 0.2s ease"
          >
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              height="3px"
              bgGradient="linear(90deg, purple.400, purple.600)"
            />
            <CardBody>
              <HStack spacing={4}>
                <Box p={3} bg="purple.100" borderRadius="lg">
                  <TrendingUp size={24} color="#8B5CF6" />
                </Box>
                <VStack align="start" spacing={1}>
                  <Text fontSize="2xl" fontWeight="bold" color="purple.700">
                    0
                  </Text>
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    Upcoming Appointments
                  </Text>
                </VStack>
              </HStack>
            </CardBody>
          </Card>

          <Card 
            bg="white" 
            border="1px" 
            borderColor="green.200"
            borderRadius="xl"
            overflow="hidden"
            position="relative"
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
            transition="all 0.2s ease"
          >
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              height="3px"
              bgGradient="linear(90deg, green.400, green.600)"
            />
            <CardBody>
              <HStack spacing={4}>
                <Box p={3} bg="green.100" borderRadius="lg">
                  <ClipboardList size={24} color="#10B981" />
                </Box>
                <VStack align="start" spacing={1}>
                  <Text fontSize="2xl" fontWeight="bold" color="green.700">
                    0
                  </Text>
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    Completed Consultations
                  </Text>
                </VStack>
              </HStack>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Modern Tabs and Content */}
        <Card 
          bg={cardBg} 
          border="1px" 
          borderColor="blue.200"
          borderRadius="xl"
          boxShadow="lg"
          overflow="hidden"
        >
          <CardBody p={0}>
            <Tabs index={activeTab} onChange={setActiveTab}>
              <TabList 
                borderBottomColor="blue.200" 
                bg="blue.25"
                borderTopRadius="xl"
              >
                {tabLabels.map((label, index) => (
                  <Tab 
                    key={index} 
                    _selected={{ 
                      color: 'blue.600', 
                      borderBottomColor: 'blue.500',
                      bg: 'blue.50',
                      fontWeight: 'semibold'
                    }}
                    _hover={{ bg: 'blue.50' }}
                    color="blue.700"
                    fontWeight="medium"
                  >
                    {label}
                  </Tab>
                ))}
              </TabList>

            <TabPanels>
              {tabLabels.map((_, index) => (
                <TabPanel key={index} p={6}>
                  {/* Modern Search and Controls */}
                  <Card 
                    bg="blue.25" 
                    border="1px" 
                    borderColor="blue.200"
                    borderRadius="xl"
                    mb={6}
                    overflow="hidden"
                    position="relative"
                  >
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      height="3px"
                      bgGradient="linear(90deg, blue.300, teal.400, purple.500)"
                    />
                    <CardBody>
                      <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
                        <HStack spacing={4} flexWrap="wrap">
                          <InputGroup maxW="400px">
                            <InputLeftElement>
                              <Search size={20} color={primaryBlue} />
                            </InputLeftElement>
                            <Input
                              placeholder="Search patients, case ID, or consultant..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              borderRadius="lg"
                              borderColor="blue.200"
                              bg="white"
                              _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px #3B82F6' }}
                              _hover={{ borderColor: 'blue.300' }}
                            />
                          </InputGroup>
                          <Button 
                            leftIcon={<Filter />} 
                            variant="outline" 
                            colorScheme="blue"
                            borderRadius="lg"
                            _hover={{ bg: 'blue.50' }}
                          >
                            Filter
                          </Button>
                          <Button 
                            leftIcon={<RefreshCw />} 
                            variant="outline" 
                            colorScheme="teal"
                            borderRadius="lg"
                            _hover={{ bg: 'teal.50' }}
                          >
                            Refresh
                          </Button>
                        </HStack>
                        
                        <HStack spacing={3} flexWrap="wrap">
                          <Text fontSize="sm" color="blue.600" fontWeight="medium">
                            Show:
                          </Text>
                          <Select 
                            value={itemsPerPage} 
                            onChange={(e) => setItemsPerPage(Number(e.target.value))} 
                            w="100px"
                            borderRadius="lg"
                            borderColor="blue.200"
                            bg="white"
                            _focus={{ borderColor: 'blue.400' }}
                          >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                          </Select>
                          <Button 
                            leftIcon={<Download />} 
                            variant="outline"
                            colorScheme="purple"
                            borderRadius="lg"
                            onClick={onExportOpen}
                            _hover={{ bg: 'purple.50' }}
                          >
                            Export
                          </Button>
                        </HStack>
                      </Flex>
                    </CardBody>
                  </Card>

                  {/* Modern Patient Table */}
                  <Card 
                    bg={cardBg} 
                    border="1px" 
                    borderColor="blue.200"
                    borderRadius="xl"
                    overflow="hidden"
                    position="relative"
                  >
                    <Box
                      position="absolute"
                      top={0}
                      left={0}
                      right={0}
                      height="3px"
                      bgGradient="linear(90deg, blue.300, teal.400, purple.500)"
                    />
                    <TableContainer 
                      borderRadius="xl"
                      position="relative"
                      overflowX="auto"
                      css={{
                        '&::-webkit-scrollbar': {
                          width: '8px',
                          height: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                          background: '#E2E8F0',
                          borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                          background: '#3B82F6',
                          borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                          background: '#2563EB',
                        },
                      }}
                    >
                      <Table variant="simple" size="sm">
                        <Thead bg="blue.50">
                          <Tr>
                            <Th borderColor="blue.200" color="blue.700" fontWeight="semibold">Case ID</Th>
                            <Th borderColor="blue.200" color="blue.700" fontWeight="semibold">Patient Details</Th>
                            <Th borderColor="blue.200" color="blue.700" fontWeight="semibold" display={{ base: 'none', md: 'table-cell' }}>Appointment</Th>
                            <Th borderColor="blue.200" color="blue.700" fontWeight="semibold" display={{ base: 'none', lg: 'table-cell' }}>Consultant</Th>
                            <Th borderColor="blue.200" color="blue.700" fontWeight="semibold">Address</Th>
                            <Th borderColor="blue.200" color="blue.700" fontWeight="semibold">City / Postal Code</Th>
                            <Th borderColor="blue.200" color="blue.700" fontWeight="semibold">Country</Th>
                            <Th borderColor="blue.200" color="blue.700" fontWeight="semibold">Action</Th>
                          </Tr>
                        </Thead>
                      <Tbody>
                        {paginatedPatients.length > 0 ? (
                          paginatedPatients.map((patient) => (
                            <Tr 
                              key={patient.id} 
                              _hover={{ bg: 'blue.25' }}
                              transition="background-color 0.2s ease"
                              borderBottom="1px"
                              borderBottomColor="blue.100"
                            >
                              <Td>{patient.caseId}</Td>
                              <Td>
                                <Box fontWeight="semibold">{patient.patientName}</Box>
                                <Box fontSize="sm" color="gray.600">{patient.patientAge} / {patient.patientGender}</Box>
                                <Box fontSize="sm" color="gray.500">{patient.patientPhone}</Box>
                              </Td>
                              <Td display={{ base: 'none', md: 'table-cell' }}>
                                <Box>{patient.appointmentDate}</Box>
                                <Box fontSize="sm" color="gray.500">{patient.appointmentTime}</Box>
                              </Td>
                              <Td display={{ base: 'none', lg: 'table-cell' }}>{patient.consultant}</Td>
                              <Td>{patient.patientAddress || '-'}</Td>
                              <Td>{(patient.city ? patient.city : '-')}{(patient.postalCode ? ` / ${patient.postalCode}` : '')}</Td>
                              <Td>{patient.country || '-'}</Td>
                              <Td>
                                {/* Action buttons here */}
                                {/* ...existing action buttons code... */}
                              </Td>
                            </Tr>
                          ))
                        ) : (
                          <Tr>
                            <Td colSpan={8} textAlign="center" py={10}>
                              <VStack spacing={2}>
                                <Stethoscope size={32} color={primaryBlue} />
                                <Text color="blue.700" fontWeight="semibold">No patients found for this tab.</Text>
                                <Text color="gray.500">Try changing the filter or add a new patient.</Text>
                              </VStack>
                            </Td>
                          </Tr>
                        )}
                      </Tbody>
                    </Table>
                  </TableContainer>
                  </Card>

                  {/* Pagination */}
                  <Flex justify="space-between" align="center" mt={6}>
                    <Text color="gray.600">
                      Records: {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredPatients.length)} of {filteredPatients.length}
                    </Text>
                    <HStack spacing={2}>
                      <IconButton
                        icon={<ChevronLeft size={16} />}
                        size="sm"
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        isDisabled={currentPage === 1}
                      />
                      <Text color="gray.600" fontSize="sm">
                        {currentPage}
                      </Text>
                      <IconButton
                        icon={<ChevronRight size={16} />}
                        size="sm"
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        isDisabled={currentPage === totalPages}
                      />
                    </HStack>
                  </Flex>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </CardBody>
      </Card>

      {/* Add Patient Modal */}
      <Modal isOpen={isAddOpen} onClose={() => {
        setNewPatient(getInitialNewPatient());
        onAddClose();
      }} size="4xl">
        <ModalOverlay />
        <ModalContent maxH="90vh" overflowY="auto">
          <ModalHeader>
            <HStack>
              <UserPlus size={24} />
              <Text>Add New OPD Patient</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={6} align="stretch">
              {/* Basic Information */}
              <Box>
                <Text fontSize="lg" fontWeight="semibold" mb={3} color="blue.600">
                  Patient Information
                </Text>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Patient Name</FormLabel>
                    <Input
                      ref={nameRef}
                      value={newPatient.patientName}
                      onChange={e => {
                        const value = e.target.value;
                        setNewPatient(prev => ({ ...prev, patientName: value }));
                      }}
                      onBlur={e => {
                        const value = e.target.value;
                        let generatedCaseId = '';
                        setNewPatient(prev => {
                          let caseId = prev.caseId;
                          let appointmentDate = prev.appointmentDate;
                          let appointmentTime = prev.appointmentTime;
                          if (value && !prev.caseId) {
                            let nextNum = maxCaseIdNum > 0 ? maxCaseIdNum + 1 : Date.now();
                            // Only numerals, no prefix
                            caseId = `${nextNum}`;
                            generatedCaseId = caseId;
                            if (!appointmentDate) {
                              const now = new Date();
                              appointmentDate = now.toISOString().slice(0, 10);
                              appointmentTime = now.toTimeString().slice(0,5);
                            }
                          } else if (!value) {
                            caseId = '';
                            appointmentDate = '';
                            appointmentTime = '';
                          }
                          return { ...prev, caseId, appointmentDate, appointmentTime };
                        });
                        // Only increment maxCaseIdNum if a new caseId was generated
                        if (value && !newPatient.caseId && maxCaseIdNum > 0) {
                          setMaxCaseIdNum(n => n + 1);
                        }
                      }}
                      onKeyDown={e => handleEnter(e, ageRef)}
                      placeholder="Enter patient name"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Case ID</FormLabel>
                    <Input
                      value={newPatient.caseId}
                      isReadOnly
                      placeholder="Auto-generated"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Age</FormLabel>
                    <NumberInput>
                      <NumberInputField
                        ref={ageRef}
                        value={newPatient.patientAge}
                        onChange={(e) => setNewPatient(prev => ({ ...prev, patientAge: e.target.value }))}
                        onKeyDown={e => handleEnter(e, genderRef)}
                        placeholder="Enter age"
                      />
                    </NumberInput>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      ref={genderRef}
                      value={newPatient.patientGender}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, patientGender: e.target.value }))}
                      onKeyDown={e => handleEnter(e, phoneRef)}
                      placeholder="Select gender"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Select>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Phone Number</FormLabel>
                    <Input
                      ref={phoneRef}
                      value={newPatient.patientPhone}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, patientPhone: e.target.value }))}
                      onKeyDown={e => handleEnter(e, bloodRef)}
                      placeholder="Enter phone number"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>City</FormLabel>
                    <Input
                      value={newPatient.city || ''}
                      onChange={e => setNewPatient(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="Enter city"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Postal Code</FormLabel>
                    <Input
                      value={newPatient.postalCode || ''}
                      onChange={e => setNewPatient(prev => ({ ...prev, postalCode: e.target.value }))}
                      placeholder="Enter postal code"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Country</FormLabel>
                    <Box position="relative">
                      <Input
                        value={newPatient.countrySearch || ''}
                        onChange={e => {
                          const val = e.target.value;
                          setNewPatient(prev => ({ ...prev, countrySearch: val, country: val }));
                        }}
                        placeholder="Type country name or code..."
                        autoComplete="off"
                        onFocus={e => setNewPatient(prev => ({ ...prev, showCountryDropdown: true }))}
                        onBlur={e => setTimeout(() => setNewPatient(prev => ({ ...prev, showCountryDropdown: false })), 150)}
                      />
                      {newPatient.showCountryDropdown && (
                        <Box position="absolute" zIndex={10} bg="white" border="1px solid #CBD5E0" borderRadius="md" maxH="200px" overflowY="auto" w="100%" mt={1} boxShadow="md">
                          {countryList.filter(c => {
                            const q = (newPatient.countrySearch || '').toLowerCase();
                            return !q || c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q);
                          }).map(c => (
                            <Box
                              key={c.code}
                              px={3} py={2}
                              _hover={{ bg: 'blue.50', cursor: 'pointer' }}
                              onMouseDown={() => setNewPatient(prev => ({ ...prev, country: c.name, countrySearch: c.name, showCountryDropdown: false }))}
                            >
                              {c.name} <Text as="span" color="gray.500" fontSize="sm">({c.code})</Text>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Box>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Blood Group</FormLabel>
                    <Select
                      ref={bloodRef}
                      value={newPatient.bloodGroup}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, bloodGroup: e.target.value }))}
                      onKeyDown={e => handleEnter(e, maritalRef)}
                      placeholder="Select blood group"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </Select>
                  </FormControl>
                  {/* <FormControl> */}
                    {/* Marital Status field removed, replaced by country above */}
                </SimpleGrid>
                
                <FormControl mt={4}>
                  <FormLabel>Address</FormLabel>
                  <Textarea
                    value={newPatient.patientAddress}
                    onChange={(e) => setNewPatient(prev => ({ ...prev, patientAddress: e.target.value }))}
                    placeholder="Enter complete address"
                    rows={3}
                  />
                </FormControl>
              </Box>

              <Divider />

              {/* Appointment Information */}
              <Box>
                <Text fontSize="lg" fontWeight="semibold" mb={3} color="green.600">
                  Appointment Details
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Appointment Date</FormLabel>
                    <Input
                      type="date"
                      value={newPatient.appointmentDate}
                      onChange={e => setNewPatient(prev => ({ ...prev, appointmentDate: e.target.value }))}
                      placeholder="Auto-fetched"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Appointment Time</FormLabel>
                    <Input
                      type="time"
                      value={newPatient.appointmentTime}
                      onChange={e => setNewPatient(prev => ({ ...prev, appointmentTime: e.target.value }))}
                      placeholder="Auto-fetched"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Consultant</FormLabel>
                    <Select
                      value={newPatient.consultant}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, consultant: e.target.value }))}
                      placeholder="Select consultant"
                    >
                      <option value="Dr. Rajesh Kumar">Dr. Rajesh Kumar</option>
                      <option value="Dr. Sunita Gupta">Dr. Sunita Gupta</option>
                      <option value="Dr. Anjali Desai">Dr. Anjali Desai</option>
                      <option value="Dr. Vikram Patel">Dr. Vikram Patel</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Reference Doctor</FormLabel>
                    <Input
                      value={newPatient.reference}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, reference: e.target.value }))}
                      placeholder="Enter reference doctor"
                    />
                  </FormControl>
                </SimpleGrid>
              </Box>

              <Divider />

              {/* Medical Information - Comprehensive Ayurvedic Form */}
              <Box>
                <Text fontSize="lg" fontWeight="semibold" mb={4} color="red.600">
                  Medical Information
                </Text>
                <VStack spacing={6} align="stretch">

                  {/* 1. Present Complaint Section */}
                  <Box>
                    <HStack justify="space-between" mb={3}>
                      <Text fontSize="md" fontWeight="semibold" color="blue.600">
                        1. Present Complaint
                      </Text>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        leftIcon={<Plus size={16} />}
                        onClick={addPresentComplaint}
                      >
                        Add More
                      </Button>
                    </HStack>
                    <VStack spacing={3} align="stretch">
                      {(newPatient.presentComplaints || []).map((complaint, index) => (
                        <HStack key={index} spacing={3} align="start">
                          <FormControl flex={2}>
                            <FormLabel fontSize="sm">Complaint {index + 1}</FormLabel>
                            <Input
                              value={complaint.complaint}
                              onChange={(e) => updatePresentComplaint(index, 'complaint', e.target.value)}
                              placeholder="Enter complaint"
                            />
                          </FormControl>
                          <FormControl flex={1}>
                            <FormLabel fontSize="sm">Duration</FormLabel>
                            <Input
                              value={complaint.duration}
                              onChange={(e) => updatePresentComplaint(index, 'duration', e.target.value)}
                              placeholder="e.g., 2 weeks"
                            />
                          </FormControl>
                          {index > 0 && (
                            <IconButton
                              icon={<Trash2 size={16} />}
                              colorScheme="red"
                              variant="ghost"
                              size="sm"
                              mt={6}
                              onClick={() => removePresentComplaint(index)}
                            />
                          )}
                        </HStack>
                      ))}
                    </VStack>
                  </Box>

                  <Divider />

                  {/* 2. Ayurvedic Assessment Section */}
                  <Box>
                    <Text fontSize="md" fontWeight="semibold" mb={3} color="orange.600">
                      2. Ayurvedic Assessment
                    </Text>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <FormControl>
                        <FormLabel>Prakriti</FormLabel>
                        <Select
                          value={newPatient.ayurvedicAssessment?.prakriti || ''}
                          onChange={(e) => setNewPatient(prev => ({
                            ...prev,
                            ayurvedicAssessment: { ...(prev.ayurvedicAssessment || {}), prakriti: e.target.value }
                          }))}
                          placeholder="Select Prakriti"
                        >
                          {prakritiOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Vikriti</FormLabel>
                        <Select
                          value={newPatient.ayurvedicAssessment?.vikriti || ''}
                          onChange={(e) => setNewPatient(prev => ({
                            ...prev,
                            ayurvedicAssessment: { ...(prev.ayurvedicAssessment || {}), vikriti: e.target.value }
                          }))}
                          placeholder="Select Vikriti"
                        >
                          {vikritiOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Agni</FormLabel>
                        <Select
                          value={newPatient.ayurvedicAssessment?.agni || ''}
                          onChange={(e) => setNewPatient(prev => ({
                            ...prev,
                            ayurvedicAssessment: { ...(prev.ayurvedicAssessment || {}), agni: e.target.value }
                          }))}
                          placeholder="Select Agni"
                        >
                          {agniOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Ojas</FormLabel>
                        <Select
                          value={newPatient.ayurvedicAssessment?.ojas || ''}
                          onChange={(e) => setNewPatient(prev => ({
                            ...prev,
                            ayurvedicAssessment: { ...(prev.ayurvedicAssessment || {}), ojas: e.target.value }
                          }))}
                          placeholder="Select Ojas"
                        >
                          {ojasOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </Select>
                      </FormControl>
                    </SimpleGrid>
                  </Box>

                  <Divider />

                  {/* 3. Examination Section */}
                  <Box>
                    <Text fontSize="md" fontWeight="semibold" mb={3} color="green.600">
                      3. Examination
                    </Text>
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                      <FormControl>
                        <FormLabel>Nadi</FormLabel>
                        <Select
                          value={newPatient.examination?.nadi || ''}
                          onChange={(e) => setNewPatient(prev => ({
                            ...prev,
                            examination: { ...(prev.examination || {}), nadi: e.target.value }
                          }))}
                          placeholder="Select Nadi"
                        >
                          {nadiOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Jihva</FormLabel>
                        <Select
                          value={newPatient.examination?.jihva || ''}
                          onChange={(e) => setNewPatient(prev => ({
                            ...prev,
                            examination: { ...(prev.examination || {}), jihva: e.target.value }
                          }))}
                          placeholder="Select Jihva"
                        >
                          {jihvaOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Eyes</FormLabel>
                        <Select
                          value={newPatient.examination?.eyes || ''}
                          onChange={(e) => setNewPatient(prev => ({
                            ...prev,
                            examination: { ...(prev.examination || {}), eyes: e.target.value }
                          }))}
                          placeholder="Select Eyes"
                        >
                          {eyesOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </Select>
                      </FormControl>
                    </SimpleGrid>
                  </Box>

                  <Divider />

                  {/* 4. Clinical Assessment Section */}
                  <Box>
                    <Text fontSize="md" fontWeight="semibold" mb={3} color="purple.600">
                      4. Clinical Assessment
                    </Text>
                    <FormControl>
                      <FormLabel>Roga (Disease Description - Max 150 words)</FormLabel>
                      <Textarea
                        value={newPatient.clinicalAssessment?.roga || ''}
                        onChange={(e) => {
                          const wordCount = e.target.value.split(/\s+/).filter(word => word.length > 0).length;
                          if (wordCount <= 150) {
                            setNewPatient(prev => ({
                              ...prev,
                              clinicalAssessment: { ...(prev.clinicalAssessment || {}), roga: e.target.value }
                            }));
                          }
                        }}
                        placeholder="Describe the disease condition in Ayurvedic terms (Maximum 150 words)"
                        rows={4}
                        resize="vertical"
                      />
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        {(newPatient.clinicalAssessment?.roga || '').split(/\s+/).filter(word => word.length > 0).length}/150 words
                      </Text>
                    </FormControl>
                  </Box>

                  <Divider />

                  {/* 5. Document Upload Section */}
                  <Box>
                    <Text fontSize="md" fontWeight="semibold" mb={3} color="teal.600">
                      5. Upload Documents
                    </Text>
                    
                    {/* File Upload Area */}
                    <Box
                      border="2px dashed"
                      borderColor="gray.300"
                      borderRadius="lg"
                      p={6}
                      bg="gray.50"
                      textAlign="center"
                      position="relative"
                    >
                      <VStack spacing={3}>
                        <Icon as={Upload} boxSize={8} color="teal.500" />
                        <Text fontSize="md" fontWeight="medium" color="gray.700">
                          Click to upload documents
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          PDF, JPEG, PNG files up to 5MB each
                        </Text>
                        <Input
                          type="file"
                          multiple
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileUpload}
                          opacity={0}
                          position="absolute"
                          cursor="pointer"
                          w="full"
                          h="full"
                          top={0}
                          left={0}
                          ref={fileInputRef}
                        />
                        <Button
                          leftIcon={<Paperclip size={16} />}
                          colorScheme="teal"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current && fileInputRef.current.click()}
                        >
                          Choose Files
                        </Button>
                      </VStack>
                    </Box>

                    {/* Uploaded Documents List */}
                    {newPatient.documents && newPatient.documents.length > 0 && (
                      <Box mt={4}>
                        <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={3}>
                          Uploaded Documents ({newPatient.documents.length})
                        </Text>
                        {newPatient.documents.map((doc) => (
                          <HStack
                            key={doc.id}
                            p={3}
                            bg="white"
                            border="1px solid"
                            borderColor="gray.200"
                            borderRadius="md"
                            mb={2}
                            justify="space-between"
                          >
                            <HStack spacing={3}>
                              {getFileIcon(doc.type)}
                              <VStack align="start" spacing={0}>
                                <Text fontSize="sm" fontWeight="medium" color="gray.800">
                                  {doc.name}
                                </Text>
                                <Text fontSize="xs" color="gray.500">
                                  {formatFileSize(doc.size)}
                                </Text>
                              </VStack>
                            </HStack>
                            <HStack spacing={1}>
                              <IconButton
                                icon={<Eye size={14} />}
                                size="sm"
                                variant="ghost"
                                colorScheme="blue"
                                onClick={() => window.open(doc.url, '_blank')}
                                aria-label="View Document"
                              />
                              <IconButton
                                icon={<X size={14} />}
                                size="sm"
                                variant="ghost"
                                colorScheme="red"
                                onClick={() => removeDocument(doc.id)}
                                aria-label="Remove Document"
                              />
                            </HStack>
                          </HStack>
                        ))}
                      </Box>
                    )}
                  </Box>

                  <Divider />                  {/* 6. Family History Section */}
                  <Box>
                    <Text fontSize="md" fontWeight="semibold" mb={3} color="blue.600">
                      6. Family History
                    </Text>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <FormControl>
                        <FormLabel>Father</FormLabel>
                        <Input
                          value={newPatient.familyHistory ? newPatient.familyHistory.father || '' : ''}
                          onChange={(e) => setNewPatient(prev => ({
                            ...prev,
                            familyHistory: { ...(prev.familyHistory || {}), father: e.target.value }
                          }))}
                          placeholder="Father's medical history"
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Mother</FormLabel>
                        <Input
                          value={newPatient.familyHistory ? newPatient.familyHistory.mother || '' : ''}
                          onChange={(e) => setNewPatient(prev => ({
                            ...prev,
                            familyHistory: { ...(prev.familyHistory || {}), mother: e.target.value }
                          }))}
                          placeholder="Mother's medical history"
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Brother</FormLabel>
                        <Input
                          value={newPatient.familyHistory ? newPatient.familyHistory.brother || '' : ''}
                          onChange={(e) => setNewPatient(prev => ({
                            ...prev,
                            familyHistory: { ...(prev.familyHistory || {}), brother: e.target.value }
                          }))}
                          placeholder="Brother's medical history"
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Sister</FormLabel>
                        <Input
                          value={newPatient.familyHistory ? newPatient.familyHistory.sister || '' : ''}
                          onChange={(e) => setNewPatient(prev => ({
                            ...prev,
                            familyHistory: { ...(prev.familyHistory || {}), sister: e.target.value }
                          }))}
                          placeholder="Sister's medical history"
                        />
                      </FormControl>
                      <FormControl gridColumn={{ md: "span 2" }}>
                        <FormLabel>Others</FormLabel>
                        <Input
                          value={newPatient.familyHistory ? newPatient.familyHistory.others || '' : ''}
                          onChange={(e) => setNewPatient(prev => ({
                            ...prev,
                            familyHistory: { ...(prev.familyHistory || {}), others: e.target.value }
                          }))}
                          placeholder="Others medical history"
                        />
                      </FormControl>
                    </SimpleGrid>
                  </Box>

                  <Divider />

                  {/* 7. Medicines Section */}
                  <Box>
                    <Text fontSize="md" fontWeight="semibold" mb={3} color="teal.600">
                      7. Medicines
                    </Text>
                    
                    {/* Add Medicine Form */}
                    <Box border="1px solid" borderColor="teal.200" borderRadius="md" p={4} bg="teal.50" mb={4}>
                      <Text fontSize="sm" fontWeight="semibold" mb={3} color="teal.700">
                        Add New Medicine
                      </Text>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                        <FormControl>
                          <FormLabel fontSize="sm">Medicine Details (Search by name/number)</FormLabel>
                          <Input
                            size="sm"
                            value={currentMedicine.medicineDetails}
                            onChange={(e) => setCurrentMedicine(prev => ({ ...prev, medicineDetails: e.target.value }))}
                            placeholder="Search medicine by name or number"
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="sm">Type (Swaroopa)</FormLabel>
                          <Select
                            size="sm"
                            value={currentMedicine.type}
                            onChange={(e) => setCurrentMedicine(prev => ({ ...prev, type: e.target.value }))}
                            placeholder="Select medicine type"
                          >
                            {medicineTypes.map((type) => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="sm">Dose (Matra)</FormLabel>
                          <Select
                            size="sm"
                            value={currentMedicine.dose}
                            onChange={(e) => setCurrentMedicine(prev => ({ ...prev, dose: e.target.value }))}
                            placeholder="Select dose"
                          >
                            {doseOptions.map((dose) => (
                              <option key={dose} value={dose}>{dose}</option>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="sm">Anupana (Vehicle)</FormLabel>
                          <Select
                            size="sm"
                            value={currentMedicine.anupana}
                            onChange={(e) => setCurrentMedicine(prev => ({ ...prev, anupana: e.target.value }))}
                            placeholder="Select Anupana"
                          >
                            {anupanaOptions.map((anupana) => (
                              <option key={anupana} value={anupana}>{anupana}</option>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="sm">Duration</FormLabel>
                          <Input
                            size="sm"
                            value={currentMedicine.duration}
                            onChange={(e) => setCurrentMedicine(prev => ({ ...prev, duration: e.target.value }))}
                            placeholder="e.g., 7 days, 1 month"
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="sm">Note</FormLabel>
                          <Input
                            size="sm"
                            value={currentMedicine.note}
                            onChange={(e) => setCurrentMedicine(prev => ({ ...prev, note: e.target.value }))}
                            placeholder="Additional notes"
                          />
                        </FormControl>
                      </SimpleGrid>
                      <Button
                        size="sm"
                        colorScheme="teal"
                        leftIcon={<PlusCircle size={16} />}
                        onClick={handleAddMedicineToForm}
                        mt={3}
                        isDisabled={!((currentMedicine.medicineDetails || '').trim())}
                      >
                        Add Medicine
                      </Button>
                    </Box>

                    {/* Display Added Medicines */}
                    {Array.isArray(newPatient.medicines) && newPatient.medicines.length > 0 && (
                      <Box>
                        <Text fontSize="sm" fontWeight="semibold" mb={2} color="teal.700">
                          Added Medicines ({newPatient.medicines.length})
                        </Text>
                        <VStack spacing={2} align="stretch">
                          {newPatient.medicines.map((medicine, index) => (
                            <Box
                              key={medicine.id}
                              p={3}
                              border="1px solid"
                              borderColor="teal.200"
                              borderRadius="md"
                              bg="teal.50"
                            >
                              <HStack justify="space-between" align="start">
                                <VStack align="start" spacing={1} flex={1}>
                                  <HStack>
                                    <Icon as={Pill} size={16} color="teal.600" />
                                    <Text fontSize="sm" fontWeight="semibold" color="teal.800">
                                      {medicine.medicineDetails}
                                    </Text>
                                    <Badge colorScheme="teal" size="sm">
                                      {medicine.type}
                                    </Badge>
                                  </HStack>
                                  <Text fontSize="xs" color="gray.600">
                                    <strong>Dose:</strong> {medicine.dose} | <strong>Anupana:</strong> {medicine.anupana}
                                  </Text>
                                  <Text fontSize="xs" color="gray.600">
                                    <strong>Duration:</strong> {medicine.duration} | <strong>Note:</strong> {medicine.note}
                                  </Text>
                                </VStack>
                                <IconButton
                                  size="xs"
                                  colorScheme="red"
                                  variant="ghost"
                                  icon={<Trash2 size={14} />}
                                  onClick={() => handleRemoveMedicine(medicine.id)}
                                />
                              </HStack>
                            </Box>
                          ))}
                        </VStack>
                      </Box>
                    )}
                  </Box>

                  <Divider />

                  {/* 7. Panchkarma Button */}
                  <Box>
                    <HStack justify="space-between" align="center">
                      <Text fontSize="md" fontWeight="semibold" color="purple.600">
                        7. Panchkarma Treatment
                      </Text>
                      <Button
                        colorScheme="purple"
                        leftIcon={<FileText size={16} />}
                        onClick={() => setNewPatient(prev => ({
                          ...prev,
                          panchkarma: {
                            ...(prev.panchkarma || {}),
                            isRequired: !(prev.panchkarma && prev.panchkarma.isRequired)
                          }
                        }))}
                        variant={newPatient.panchkarma && newPatient.panchkarma.isRequired ? "solid" : "outline"}
                      >
                        {newPatient.panchkarma && newPatient.panchkarma.isRequired ? "Panchkarma Planned" : "Add Panchkarma"}
                      </Button>
                    </HStack>
                    {newPatient.panchkarma && newPatient.panchkarma.isRequired && (
                      <Box mt={3} p={4} border="1px solid" borderColor="purple.200" borderRadius="md" bg="purple.50">
                        <VStack spacing={4}>
                          <SimpleGrid columns={2} spacing={4} width="100%">
                            <FormControl>
                              <FormLabel fontSize="sm">Panchkarma Name</FormLabel>
                              <Input
                                size="sm"
                                value={newPatient.panchkarma.name}
                                onChange={(e) => setNewPatient(prev => ({
                                  ...prev,
                                  panchkarma: { ...prev.panchkarma, name: e.target.value }
                                }))}
                                placeholder="Enter Panchkarma procedure name"
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel fontSize="sm">Treatment Start Date</FormLabel>
                              <Input
                                type="date"
                                size="sm"
                                value={newPatient.panchkarma.treatmentStartDate}
                                onChange={(e) => setNewPatient(prev => ({
                                  ...prev,
                                  panchkarma: { ...prev.panchkarma, treatmentStartDate: e.target.value }
                                }))}
                              />
                            </FormControl>
                          </SimpleGrid>
                          
                          <SimpleGrid columns={2} spacing={4} width="100%">
                            <FormControl>
                              <FormLabel fontSize="sm">Duration</FormLabel>
                              <Input
                                size="sm"
                                value={newPatient.panchkarma.duration}
                                onChange={(e) => setNewPatient(prev => ({
                                  ...prev,
                                  panchkarma: { ...prev.panchkarma, duration: e.target.value }
                                }))}
                                placeholder="e.g., 7 days, 2 weeks"
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel fontSize="sm">Treatment Dates</FormLabel>
                              <Input
                                size="sm"
                                value={newPatient.panchkarma.treatmentDates}
                                onChange={(e) => setNewPatient(prev => ({
                                  ...prev,
                                  panchkarma: { ...prev.panchkarma, treatmentDates: e.target.value }
                                }))}
                                placeholder="e.g., Mon-Wed-Fri or Daily"
                              />
                            </FormControl>
                          </SimpleGrid>

                          <FormControl>
                            <FormLabel fontSize="sm">Notes</FormLabel>
                            <Textarea
                              size="sm"
                              value={newPatient.panchkarma.notes}
                              onChange={(e) => setNewPatient(prev => ({
                                ...prev,
                                panchkarma: { ...prev.panchkarma, notes: e.target.value }
                              }))}
                              placeholder="Enter additional notes or instructions for Panchkarma treatment"
                              rows={3}
                            />
                          </FormControl>
                        </VStack>
                      </Box>
                    )}
                  </Box>

                  <Divider />

                  {/* 8. Treatment Plan Section */}
                  <Box>
                    <Text fontSize="md" fontWeight="semibold" mb={3} color="indigo.600">
                      8. Treatment Plan
                    </Text>
                    <FormControl>
                      <FormLabel>Treatment Plan Details</FormLabel>
                      <Textarea
                        value={newPatient.treatmentPlan}
                        onChange={(e) => setNewPatient(prev => ({ ...prev, treatmentPlan: e.target.value }))}
                        placeholder="Enter comprehensive treatment plan including lifestyle modifications, follow-up schedule, etc."
                        rows={4}
                        resize="vertical"
                      />
                    </FormControl>
                  </Box>
                </VStack>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onAddClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="teal" 
              variant="outline"
              mr={3}
              onClick={handleSendToPharmacy}
              isDisabled={!newPatient.patientName || newPatient.medicines.length === 0}
              leftIcon={<Pill size={16} />}
            >
              Send to Pharmacy
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleAddPatient}
              isDisabled={!newPatient.patientName || !newPatient.caseId || !newPatient.appointmentDate}
            >
              Add Patient
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View Patient Modal */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size="6xl">
        <ModalOverlay />
        <ModalContent maxH="90vh">
          <ModalHeader>
            <HStack>
              <History size={24} />
              <Text>Patient Overall Details & Medical History - Case ID: {selectedPatient?.caseId}</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody p={0}>
            {selectedPatient && (
              <Box height="70vh" overflowY="auto" p={6}>
                <VStack spacing={6} align="stretch">
                  {/* Patient Header */}
                  <Box p={6} bg="blue.50" borderRadius="lg">
                    <HStack spacing={4}>
                      <Avatar size="lg" name={selectedPatient.patientName} />
                      <VStack align="start" spacing={1}>
                        <Text fontSize="xl" fontWeight="bold">{selectedPatient.patientName}</Text>
                        <Text color="gray.600">{selectedPatient.patientAge} years, {selectedPatient.patientGender}</Text>
                        <Text color="gray.600">{selectedPatient.patientPhone}</Text>
                        <HStack>
                          {getStatusBadge(selectedPatient.status)}
                          {selectedPatient.isAntenatal && (
                            <Badge colorScheme="pink" size="sm">Antenatal</Badge>
                          )}
                        </HStack>
                      </VStack>
                    </HStack>
                  </Box>

                  {/* Appointment Information */}
                  <Card>
                    <CardHeader>
                      <HStack justify="space-between">
                        <Text fontSize="lg" fontWeight="semibold" color="blue.600">
                          Appointment Information
                        </Text>
                        <IconButton
                          icon={<Edit size={16} />}
                          size="sm"
                          variant="ghost"
                          colorScheme="blue"
                          aria-label="Edit appointment info"
                          onClick={() => handleEditSection('appointment')}
                        />
                      </HStack>
                    </CardHeader>
                    <CardBody>
                      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                        <Box>
                          <Text fontWeight="medium" color="gray.600">OPD Number</Text>
                          <Text>{selectedPatient.opdNo}</Text>
                        </Box>
                        <Box>
                          <Text fontWeight="medium" color="gray.600">Case ID</Text>
                          <Text>{selectedPatient.caseId}</Text>
                        </Box>
                        <Box>
                          <Text fontWeight="medium" color="gray.600">Appointment Date</Text>
                          <Text>{selectedPatient.appointmentDate} at {selectedPatient.appointmentTime}</Text>
                        </Box>
                        <Box>
                          <Text fontWeight="medium" color="gray.600">Consultant</Text>
                          <Text>{selectedPatient.consultant}</Text>
                        </Box>
                        <Box>
                          <Text fontWeight="medium" color="gray.600">Generated By</Text>
                          <Text>{selectedPatient.generatedBy}</Text>
                        </Box>
                        <Box>
                          <Text fontWeight="medium" color="gray.600">Reference</Text>
                          <Text>{selectedPatient.reference || 'N/A'}</Text>
                        </Box>
                      </SimpleGrid>
                    </CardBody>
                  </Card>

                  {/* Chief Complaint & Duration */}
                  <Card>
                    <CardHeader>
                      <HStack justify="space-between">
                        <Text fontSize="lg" fontWeight="semibold" color="red.600">
                          Chief Complaint & Duration
                        </Text>
                        <IconButton
                          icon={<Edit size={16} />}
                          size="sm"
                          variant="ghost"
                          colorScheme="red"
                          aria-label="Edit complaint"
                          onClick={() => handleEditSection('complaint')}
                        />
                      </HStack>
                    </CardHeader>
                    <CardBody>
                      {isEditMode.complaint ? (
                        // Edit Mode for Chief Complaint
                        <VStack spacing={4} align="stretch">
                          <FormControl>
                            <FormLabel>Chief Complaint</FormLabel>
                            <Textarea
                              value={editFormData.chiefComplaint || ''}
                              onChange={(e) => handleFormDataChange('chiefComplaint', e.target.value)}
                              placeholder="Enter chief complaint"
                              size="sm"
                            />
                          </FormControl>
                          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                            <FormControl>
                              <FormLabel>Duration of Complaint</FormLabel>
                              <Input
                                value={editFormData.complaintDuration || ''}
                                onChange={(e) => handleFormDataChange('complaintDuration', e.target.value)}
                                placeholder="e.g., 2 weeks, 3 days"
                                size="sm"
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel>Severity Level</FormLabel>
                              <Select
                                value={editFormData.severityLevel || 'Medium'}
                                onChange={(e) => handleFormDataChange('severityLevel', e.target.value)}
                                size="sm"
                              >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                              </Select>
                            </FormControl>
                          </SimpleGrid>
                          <FormControl>
                            <FormLabel>Detailed Symptoms</FormLabel>
                            <Textarea
                              value={editFormData.symptomsDetails || ''}
                              onChange={(e) => handleFormDataChange('symptomsDetails', e.target.value)}
                              placeholder="Enter detailed symptoms"
                              rows={3}
                              size="sm"
                            />
                          </FormControl>
                          <HStack spacing={3} pt={2}>
                            <Button
                              colorScheme="red"
                              size="sm"
                              onClick={() => handleSaveSection('complaint')}
                            >
                              Save Changes
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelEdit('complaint')}
                            >
                              Cancel
                            </Button>
                          </HStack>
                        </VStack>
                      ) : (
                        // View Mode for Chief Complaint
                        <VStack spacing={4} align="stretch">
                          <Box>
                            <Text fontWeight="medium" color="gray.600" mb={2}>Chief Complaint</Text>
                            <Text p={3} bg="gray.50" borderRadius="md" border="1px solid" borderColor="gray.200">
                              {selectedPatient.chiefComplaint || selectedPatient.symptoms || 'No chief complaint recorded'}
                            </Text>
                          </Box>
                          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                            <Box>
                              <Text fontWeight="medium" color="gray.600" mb={1}>Duration of Complaint</Text>
                              <Text>{selectedPatient.complaintDuration || 'Not specified'}</Text>
                            </Box>
                            <Box>
                              <Text fontWeight="medium" color="gray.600" mb={1}>Severity Level</Text>
                              <Badge colorScheme={
                                selectedPatient.severityLevel === 'High' ? 'red' : 
                                selectedPatient.severityLevel === 'Medium' ? 'orange' : 'green'
                              }>
                                {selectedPatient.severityLevel || 'Not assessed'}
                              </Badge>
                            </Box>
                          </SimpleGrid>
                          <Box>
                            <Text fontWeight="medium" color="gray.600" mb={1}>Detailed Symptoms</Text>
                            <Text>{selectedPatient.symptomsDetails || 'No detailed symptoms recorded'}</Text>
                          </Box>
                        </VStack>
                      )}
                    </CardBody>
                  </Card>

                  {/* Running Treatment & Medicine */}
                  <Card>
                    <CardHeader>
                      <HStack justify="space-between">
                        <Text fontSize="lg" fontWeight="semibold" color="green.600">
                          Current Treatment & Medication
                        </Text>
                        <IconButton
                          icon={<Edit size={16} />}
                          size="sm"
                          variant="ghost"
                          colorScheme="green"
                          aria-label="Edit treatment"
                          onClick={() => handleEditSection('treatment')}
                        />
                      </HStack>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        <Box>
                          <Text fontWeight="medium" color="gray.600" mb={2}>Running Treatment</Text>
                          <Text p={3} bg="green.50" borderRadius="md" border="1px solid" borderColor="green.200">
                            {selectedPatient.runningTreatment || 'No ongoing treatment'}
                          </Text>
                        </Box>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                          <Box>
                            <Text fontWeight="medium" color="gray.600" mb={2}>Current Medications</Text>
                            {selectedPatient.currentMedications && selectedPatient.currentMedications.length > 0 ? (
                              <VStack align="start" spacing={2}>
                                {selectedPatient.currentMedications.map((medication, index) => (
                                  <Box key={index} p={2} bg="blue.50" borderRadius="md" w="full">
                                    <Text fontSize="sm" fontWeight="medium">• {medication.name || medication}</Text>
                                    {medication.dosage && (
                                      <Text fontSize="xs" color="gray.600">Dosage: {medication.dosage}</Text>
                                    )}
                                    {medication.frequency && (
                                      <Text fontSize="xs" color="gray.600">Frequency: {medication.frequency}</Text>
                                    )}
                                  </Box>
                                ))}
                              </VStack>
                            ) : (
                              <Text color="gray.500" fontSize="sm" fontStyle="italic">No current medications</Text>
                            )}
                          </Box>
                          <Box>
                            <Text fontWeight="medium" color="gray.600" mb={2}>Treatment Start Date</Text>
                            <Text>{selectedPatient.treatmentStartDate || 'Not specified'}</Text>
                            <Text fontWeight="medium" color="gray.600" mt={3} mb={1}>Expected Duration</Text>
                            <Text>{selectedPatient.treatmentDuration || 'Not specified'}</Text>
                          </Box>
                        </SimpleGrid>
                      </VStack>
                    </CardBody>
                  </Card>

                  {/* Family History */}
                  <Card>
                    <CardHeader>
                      <HStack justify="space-between">
                        <Text fontSize="lg" fontWeight="semibold" color="purple.600">
                          Family History
                        </Text>
                        <IconButton
                          icon={<Edit size={16} />}
                          size="sm"
                          variant="ghost"
                          colorScheme="purple"
                          aria-label="Edit family history"
                          onClick={() => handleEditSection('familyHistory')}
                        />
                      </HStack>
                    </CardHeader>
                    <CardBody>
                      {isEditMode.familyHistory ? (
                        // Edit Mode for Family History
                        <VStack spacing={6} align="stretch">
                          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                            <Box>
                              <Text fontWeight="medium" color="gray.600" mb={3}>Father's Medical History</Text>
                              <VStack spacing={3}>
                                <FormControl size="sm">
                                  <FormLabel fontSize="sm">Age</FormLabel>
                                  <Input
                                    value={editFormData.familyHistory?.father?.age || ''}
                                    onChange={(e) => handleNestedFormDataChange('familyHistory', 'father', { ...editFormData.familyHistory?.father, age: e.target.value })}
                                    placeholder="Father's age"
                                    size="sm"
                                  />
                                </FormControl>
                                <FormControl size="sm">
                                  <FormLabel fontSize="sm">Health Status</FormLabel>
                                  <Select
                                    value={editFormData.familyHistory?.father?.healthStatus || ''}
                                    onChange={(e) => handleNestedFormDataChange('familyHistory', 'father', { ...editFormData.familyHistory?.father, healthStatus: e.target.value })}
                                    size="sm"
                                  >
                                    <option value="">Select status</option>
                                    <option value="Alive and Healthy">Alive and Healthy</option>
                                    <option value="Alive with Conditions">Alive with Conditions</option>
                                    <option value="Deceased">Deceased</option>
                                  </Select>
                                </FormControl>
                                <FormControl size="sm">
                                  <FormLabel fontSize="sm">Medical Conditions</FormLabel>
                                  <Textarea
                                    value={editFormData.familyHistory?.father?.conditions || ''}
                                    onChange={(e) => handleNestedFormDataChange('familyHistory', 'father', { ...editFormData.familyHistory?.father, conditions: e.target.value })}
                                    placeholder="Any medical conditions"
                                    size="sm"
                                    rows={2}
                                  />
                                </FormControl>
                              </VStack>
                            </Box>
                            
                            <Box>
                              <Text fontWeight="medium" color="gray.600" mb={3}>Mother's Medical History</Text>
                              <VStack spacing={3}>
                                <FormControl size="sm">
                                  <FormLabel fontSize="sm">Age</FormLabel>
                                  <Input
                                    value={editFormData.familyHistory?.mother?.age || ''}
                                    onChange={(e) => handleNestedFormDataChange('familyHistory', 'mother', { ...editFormData.familyHistory?.mother, age: e.target.value })}
                                    placeholder="Mother's age"
                                    size="sm"
                                  />
                                </FormControl>
                                <FormControl size="sm">
                                  <FormLabel fontSize="sm">Health Status</FormLabel>
                                  <Select
                                    value={editFormData.familyHistory?.mother?.healthStatus || ''}
                                    onChange={(e) => handleNestedFormDataChange('familyHistory', 'mother', { ...editFormData.familyHistory?.mother, healthStatus: e.target.value })}
                                    size="sm"
                                  >
                                    <option value="">Select status</option>
                                    <option value="Alive and Healthy">Alive and Healthy</option>
                                    <option value="Alive with Conditions">Alive with Conditions</option>
                                    <option value="Deceased">Deceased</option>
                                  </Select>
                                </FormControl>
                                <FormControl size="sm">
                                  <FormLabel fontSize="sm">Medical Conditions</FormLabel>
                                  <Textarea
                                    value={editFormData.familyHistory?.mother?.conditions || ''}
                                    onChange={(e) => handleNestedFormDataChange('familyHistory', 'mother', { ...editFormData.familyHistory?.mother, conditions: e.target.value })}
                                    placeholder="Any medical conditions"
                                    size="sm"
                                    rows={2}
                                  />
                                </FormControl>
                              </VStack>
                            </Box>
                          </SimpleGrid>
                          
                          <Box>
                            <Text fontWeight="medium" color="gray.600" mb={3}>Other Family History</Text>
                            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                              <FormControl size="sm">
                                <FormLabel fontSize="sm">Diabetes</FormLabel>
                                <Select
                                  value={editFormData.familyHistory?.diabetes || ''}
                                  onChange={(e) => handleNestedFormDataChange('familyHistory', 'diabetes', e.target.value)}
                                  size="sm"
                                >
                                  <option value="">Select</option>
                                  <option value="No family history">No family history</option>
                                  <option value="Father">Father</option>
                                  <option value="Mother">Mother</option>
                                  <option value="Both parents">Both parents</option>
                                  <option value="Grandparents">Grandparents</option>
                                  <option value="Siblings">Siblings</option>
                                </Select>
                              </FormControl>
                              <FormControl size="sm">
                                <FormLabel fontSize="sm">Hypertension</FormLabel>
                                <Select
                                  value={editFormData.familyHistory?.hypertension || ''}
                                  onChange={(e) => handleNestedFormDataChange('familyHistory', 'hypertension', e.target.value)}
                                  size="sm"
                                >
                                  <option value="">Select</option>
                                  <option value="No family history">No family history</option>
                                  <option value="Father">Father</option>
                                  <option value="Mother">Mother</option>
                                  <option value="Both parents">Both parents</option>
                                  <option value="Grandparents">Grandparents</option>
                                  <option value="Siblings">Siblings</option>
                                </Select>
                              </FormControl>
                              <FormControl size="sm">
                                <FormLabel fontSize="sm">Heart Disease</FormLabel>
                                <Select
                                  value={editFormData.familyHistory?.heartDisease || ''}
                                  onChange={(e) => handleNestedFormDataChange('familyHistory', 'heartDisease', e.target.value)}
                                  size="sm"
                                >
                                  <option value="">Select</option>
                                  <option value="No family history">No family history</option>
                                  <option value="Father">Father</option>
                                  <option value="Mother">Mother</option>
                                  <option value="Both parents">Both parents</option>
                                  <option value="Grandparents">Grandparents</option>
                                  <option value="Siblings">Siblings</option>
                                </Select>
                              </FormControl>
                              <FormControl size="sm">
                                <FormLabel fontSize="sm">Cancer</FormLabel>
                                <Input
                                  value={editFormData.familyHistory?.cancer || ''}
                                  onChange={(e) => handleNestedFormDataChange('familyHistory', 'cancer', e.target.value)}
                                  placeholder="Specify type and relation"
                                  size="sm"
                                />
                              </FormControl>
                              <FormControl size="sm">
                                <FormLabel fontSize="sm">Mental Health</FormLabel>
                                <Input
                                  value={editFormData.familyHistory?.mentalHealth || ''}
                                  onChange={(e) => handleNestedFormDataChange('familyHistory', 'mentalHealth', e.target.value)}
                                  placeholder="Any mental health history"
                                  size="sm"
                                />
                              </FormControl>
                              <FormControl size="sm">
                                <FormLabel fontSize="sm">Other</FormLabel>
                                <Input
                                  value={editFormData.familyHistory?.other || ''}
                                  onChange={(e) => handleNestedFormDataChange('familyHistory', 'other', e.target.value)}
                                  placeholder="Other conditions"
                                  size="sm"
                                />
                              </FormControl>
                            </SimpleGrid>
                          </Box>
                          
                          <HStack spacing={3} pt={2}>
                            <Button
                              colorScheme="purple"
                              size="sm"
                              onClick={() => handleSaveSection('familyHistory')}
                            >
                              Save Changes
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelEdit('familyHistory')}
                            >
                              Cancel
                            </Button>
                          </HStack>
                        </VStack>
                      ) : (
                        // View Mode for Family History
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                          <Box>
                            <Text fontWeight="medium" color="gray.600" mb={3}>Father's Medical History</Text>
                            <VStack align="start" spacing={2} p={3} bg="purple.50" borderRadius="md">
                              <Text fontSize="sm"><strong>Age:</strong> {selectedPatient.familyHistory?.father?.age || 'Not specified'}</Text>
                              <Text fontSize="sm"><strong>Health Status:</strong> {selectedPatient.familyHistory?.father?.healthStatus || 'Not specified'}</Text>
                              <Text fontSize="sm"><strong>Medical Conditions:</strong> {selectedPatient.familyHistory?.father?.conditions || 'None reported'}</Text>
                              <Text fontSize="sm"><strong>Cause of Death:</strong> {selectedPatient.familyHistory?.father?.causeOfDeath || 'N/A'}</Text>
                            </VStack>
                          </Box>
                          
                          <Box>
                            <Text fontWeight="medium" color="gray.600" mb={3}>Mother's Medical History</Text>
                            <VStack align="start" spacing={2} p={3} bg="pink.50" borderRadius="md">
                              <Text fontSize="sm"><strong>Age:</strong> {selectedPatient.familyHistory?.mother?.age || 'Not specified'}</Text>
                              <Text fontSize="sm"><strong>Health Status:</strong> {selectedPatient.familyHistory?.mother?.healthStatus || 'Not specified'}</Text>
                              <Text fontSize="sm"><strong>Medical Conditions:</strong> {selectedPatient.familyHistory?.mother?.conditions || 'None reported'}</Text>
                              <Text fontSize="sm"><strong>Cause of Death:</strong> {selectedPatient.familyHistory?.mother?.causeOfDeath || 'N/A'}</Text>
                            </VStack>
                          </Box>
                          
                          <Box>
                            <Text fontWeight="medium" color="gray.600" mb={3}>Siblings</Text>
                            <Box p={3} bg="blue.50" borderRadius="md">
                              {selectedPatient.familyHistory?.siblings && selectedPatient.familyHistory.siblings.length > 0 ? (
                                selectedPatient.familyHistory.siblings.map((sibling, index) => (
                                  <Box key={index} mb={2} p={2} bg="white" borderRadius="sm">
                                    <Text fontSize="sm"><strong>Sibling {index + 1}:</strong> {sibling.age} years old</Text>
                                    <Text fontSize="sm"><strong>Health:</strong> {sibling.healthStatus || 'Not specified'}</Text>
                                    {sibling.conditions && (
                                      <Text fontSize="sm"><strong>Conditions:</strong> {sibling.conditions}</Text>
                                    )}
                                  </Box>
                                ))
                              ) : (
                                <Text fontSize="sm" color="gray.500" fontStyle="italic">No sibling information recorded</Text>
                              )}
                            </Box>
                          </Box>
                          
                          <Box>
                            <Text fontWeight="medium" color="gray.600" mb={3}>Other Family History</Text>
                            <VStack align="start" spacing={2} p={3} bg="orange.50" borderRadius="md">
                              <Text fontSize="sm"><strong>Diabetes:</strong> {selectedPatient.familyHistory?.diabetes || 'No family history'}</Text>
                              <Text fontSize="sm"><strong>Hypertension:</strong> {selectedPatient.familyHistory?.hypertension || 'No family history'}</Text>
                              <Text fontSize="sm"><strong>Heart Disease:</strong> {selectedPatient.familyHistory?.heartDisease || 'No family history'}</Text>
                              <Text fontSize="sm"><strong>Cancer:</strong> {selectedPatient.familyHistory?.cancer || 'No family history'}</Text>
                              <Text fontSize="sm"><strong>Mental Health:</strong> {selectedPatient.familyHistory?.mentalHealth || 'No family history'}</Text>
                              <Text fontSize="sm"><strong>Other:</strong> {selectedPatient.familyHistory?.other || 'None reported'}</Text>
                            </VStack>
                          </Box>
                        </SimpleGrid>
                      )}
                    </CardBody>
                  </Card>

                  {/* Past Medical History */}
                  <Card>
                    <CardHeader>
                      <HStack justify="space-between">
                        <Text fontSize="lg" fontWeight="semibold" color="orange.600">
                          Past Medical History
                        </Text>
                        <IconButton
                          icon={<Edit size={16} />}
                          size="sm"
                          variant="ghost"
                          colorScheme="orange"
                          aria-label="Edit past history"
                          onClick={() => handleEditSection('pastHistory')}
                        />
                      </HStack>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        {selectedPatient.pastMedicalHistory && selectedPatient.pastMedicalHistory.length > 0 ? (
                          selectedPatient.pastMedicalHistory.map((history, index) => (
                            <Box key={index} p={4} bg="orange.50" borderRadius="md" border="1px solid" borderColor="orange.200">
                              <Flex justify="space-between" align="start" mb={2}>
                                <Text fontWeight="bold" color="orange.700">{history.condition}</Text>
                                <Text fontSize="sm" color="gray.600">{history.date}</Text>
                              </Flex>
                              <VStack align="stretch" spacing={2}>
                                <Box>
                                  <Text fontSize="sm" fontWeight="medium" color="gray.600">Treatment:</Text>
                                  <Text fontSize="sm">{history.treatment}</Text>
                                </Box>
                                <Box>
                                  <Text fontSize="sm" fontWeight="medium" color="gray.600">Doctor:</Text>
                                  <Text fontSize="sm">{history.doctor}</Text>
                                </Box>
                                <Box>
                                  <Text fontSize="sm" fontWeight="medium" color="gray.600">Notes:</Text>
                                  <Text fontSize="sm">{history.notes}</Text>
                                </Box>
                              </VStack>
                            </Box>
                          ))
                        ) : (
                          <Text color="gray.500" fontStyle="italic">No past medical history recorded</Text>
                        )}
                        <Box>
                          <Text fontWeight="medium" color="gray.600" mb={1}>Previous Medical Issues</Text>
                          <Text>{selectedPatient.previousMedicalIssue || 'None reported'}</Text>
                        </Box>
                      </VStack>
                    </CardBody>
                  </Card>

                  {/* Medical Summary */}
                  <Card>
                    <CardHeader>
                      <HStack justify="space-between">
                        <Text fontSize="lg" fontWeight="semibold" color="teal.600">
                          Medical Summary
                        </Text>
                        <IconButton
                          icon={<Edit size={16} />}
                          size="sm"
                          variant="ghost"
                          colorScheme="teal"
                          aria-label="Edit medical summary"
                          onClick={() => handleEditSection('medicalSummary')}
                        />
                      </HStack>
                    </CardHeader>
                    <CardBody>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <Box>
                          <Text fontWeight="medium" color="gray.600" mb={2}>Allergies</Text>
                          {selectedPatient.allergies && selectedPatient.allergies.length > 0 ? (
                            <Flex wrap="wrap" gap={2}>
                              {selectedPatient.allergies.map((allergy, index) => (
                                <Badge key={index} colorScheme="red" variant="outline">{allergy}</Badge>
                              ))}
                            </Flex>
                          ) : (
                            <Text color="gray.500" fontSize="sm">No known allergies</Text>
                          )}
                        </Box>
                        <Box>
                          <Text fontWeight="medium" color="gray.600" mb={2}>Chronic Conditions</Text>
                          {selectedPatient.chronicConditions && selectedPatient.chronicConditions.length > 0 ? (
                            <Flex wrap="wrap" gap={2}>
                              {selectedPatient.chronicConditions.map((condition, index) => (
                                <Badge key={index} colorScheme="orange" variant="outline">{condition}</Badge>
                              ))}
                            </Flex>
                          ) : (
                            <Text color="gray.500" fontSize="sm">No chronic conditions</Text>
                          )}
                        </Box>
                      </SimpleGrid>
                    </CardBody>
                  </Card>

                  {/* Personal Information */}
                  <Card>
                    <CardHeader>
                      <HStack justify="space-between">
                        <Text fontSize="lg" fontWeight="semibold" color="cyan.600">
                          Personal Information
                        </Text>
                        <IconButton
                          icon={<Edit size={16} />}
                          size="sm"
                          variant="ghost"
                          colorScheme="cyan"
                          aria-label="Edit personal info"
                          onClick={() => handleEditSection('personalInfo')}
                        />
                      </HStack>
                    </CardHeader>
                    <CardBody>
                      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                        <Box>
                          <Text fontWeight="medium" color="gray.600">Email</Text>
                          <Text>{selectedPatient.patientEmail}</Text>
                        </Box>
                        <Box>
                          <Text fontWeight="medium" color="gray.600">Blood Group</Text>
                          <Text>{selectedPatient.bloodGroup}</Text>
                        </Box>
                        <Box>
                          <Text fontWeight="medium" color="gray.600">Emergency Contact</Text>
                          <Text>{selectedPatient.emergencyContact}</Text>
                        </Box>
                        <Box>
                          <Text fontWeight="medium" color="gray.600">Marital Status</Text>
                          <Text>{selectedPatient.maritalStatus}</Text>
                        </Box>
                        <Box>
                          <Text fontWeight="medium" color="gray.600">Occupation</Text>
                          <Text>{selectedPatient.occupation}</Text>
                        </Box>
                        <Box>
                          <Text fontWeight="medium" color="gray.600">Insurance</Text>
                          <Text>{selectedPatient.insurance || 'Not specified'}</Text>
                        </Box>
                      </SimpleGrid>
                      <Box mt={4}>
                        <Text fontWeight="medium" color="gray.600" mb={1}>Address</Text>
                        <Text>{selectedPatient.patientAddress}</Text>
                      </Box>
                    </CardBody>
                  </Card>
                </VStack>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => {
              onViewClose();
              handleEditPatient(selectedPatient);
            }}>
              Edit Patient
            </Button>
            <Button variant="ghost" onClick={onViewClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Patient Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="4xl">
        <ModalOverlay />
        <ModalContent maxH="90vh" overflowY="auto">
          <ModalHeader>
            <HStack>
              <Edit3 size={24} />
              <Text>Edit Patient - Case ID: {selectedPatient?.caseId}</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Same form as Add Patient but with edit functionality */}
            <VStack spacing={6} align="stretch">
              {/* Basic Information */}
              <Box>
                <Text fontSize="lg" fontWeight="semibold" mb={3} color="blue.600">
                  Patient Information
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Patient Name</FormLabel>
                    <Input
                      value={newPatient.patientName}
                      onChange={(e) => {
                        const value = e.target.value;
                        setNewPatient(prev => {
                          // Only generate caseId if patientName is not empty and caseId is empty
                          let caseId = prev.caseId;
                          if (value && !prev.caseId) {
                            // Example: OPD + current timestamp
                            caseId = `OPD${Date.now()}`;
                          } else if (!value) {
                            caseId = '';
                          }
                          return { ...prev, patientName: value, caseId };
                        });
                      }}
                      placeholder="Enter patient name"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Case ID</FormLabel>
                    <Input
                      value={newPatient.caseId}
                      onChange={(e) => setNewPatient(prev => ({ ...prev, caseId: e.target.value }))}
                      placeholder="Enter case ID"
                    />
                  </FormControl>
                  {/* Add other form fields similar to Add Patient modal */}
                </SimpleGrid>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onEditClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={() => {
                // Update patient logic here
                const updatedPatients = opdPatients.map(p => 
                  p.id === selectedPatient.id ? { ...newPatient, id: selectedPatient.id } : p
                );
                setOpdPatients(updatedPatients);
                onEditClose();
              }}
            >
              Update Patient
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Patient Information Modal */}
      <Modal isOpen={isPatientInfoOpen} onClose={onPatientInfoClose} size="6xl">
        <ModalOverlay />
        <ModalContent maxW="90vw" maxH="90vh">
          <ModalHeader bg="blue.500" color="white" py={4}>
            <HStack spacing={4}>
              <Icon as={FaUser} />
              <VStack align="start" spacing={0}>
                <Text fontSize="lg" fontWeight="bold">Patient Information</Text>
                <Text fontSize="sm" opacity={0.9}>
                  {selectedPatient?.patientName} - {selectedPatient?.caseId}
                </Text>
              </VStack>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody p={6} overflowY="auto">
            {selectedPatient && (
              <VStack spacing={6} align="stretch">
                {/* Patient Basic Information */}
                <Box bg="gray.50" p={4} borderRadius="md">
                  <Text fontSize="lg" fontWeight="semibold" mb={4} color="blue.600">
                    Basic Information
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                    <Box>
                      <Text fontSize="sm" color="gray.600">Patient Name</Text>
                      <Text fontWeight="medium">{selectedPatient.patientName}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.600">Case ID</Text>
                      <Text fontWeight="medium">{selectedPatient.caseId}</Text>
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
                      <Text fontSize="sm" color="gray.600">Contact</Text>
                      <Text fontWeight="medium">{selectedPatient.contact}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.600">Status</Text>
                      <Badge colorScheme={
                        selectedPatient.status === 'Completed' ? 'green' :
                        selectedPatient.status === 'In Progress' ? 'yellow' : 'blue'
                      }>
                        {selectedPatient.status}
                      </Badge>
                    </Box>
                  </SimpleGrid>
                </Box>

                {/* Past Medical History */}
                {selectedPatient.pastMedicalHistory && selectedPatient.pastMedicalHistory.length > 0 && (
                  <Box>
                    <Text fontSize="lg" fontWeight="semibold" mb={4} color="blue.600">
                      Past Medical History
                    </Text>
                    <VStack spacing={3} align="stretch">
                      {selectedPatient.pastMedicalHistory.map((history, index) => (
                        <Box key={index} p={4} border="1px" borderColor="gray.200" borderRadius="md">
                          <HStack justify="space-between" mb={2}>
                            <Text fontWeight="medium">{history.condition}</Text>
                            <Text fontSize="sm" color="gray.600">{history.year}</Text>
                          </HStack>
                          <Text fontSize="sm" color="gray.700">{history.description}</Text>
                          {history.treatment && (
                            <Text fontSize="sm" color="green.600" mt={1}>
                              Treatment: {history.treatment}
                            </Text>
                          )}
                        </Box>
                      ))}
                    </VStack>
                  </Box>
                )}

                {/* Visit History */}
                {selectedPatient.visitHistory && selectedPatient.visitHistory.length > 0 && (
                  <Box>
                    <Text fontSize="lg" fontWeight="semibold" mb={4} color="blue.600">
                      Visit History
                    </Text>
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
                        {selectedPatient.visitHistory.map((visit, index) => (
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
                  </Box>
                )}

                {/* Lab Investigations */}
                {selectedPatient.labInvestigations && selectedPatient.labInvestigations.length > 0 && (
                  <Box>
                    <Text fontSize="lg" fontWeight="semibold" mb={4} color="blue.600">
                      Lab Investigations
                    </Text>
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th>Date</Th>
                          <Th>Investigation</Th>
                          <Th display={{ base: 'none', md: 'table-cell' }}>Result</Th>
                          <Th display={{ base: 'none', lg: 'table-cell' }}>Normal Range</Th>
                          <Th>Status</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {selectedPatient.labInvestigations.map((lab, index) => (
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
                            <Td display={{ base: 'none', lg: 'table-cell' }}>{lab.normalRange}</Td>
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
                  </Box>
                )}

                {/* Treatment History */}
                {selectedPatient.treatmentHistory && selectedPatient.treatmentHistory.length > 0 && (
                  <Box>
                    <Text fontSize="lg" fontWeight="semibold" mb={4} color="blue.600">
                      Treatment History
                    </Text>
                    <VStack spacing={3} align="stretch">
                      {selectedPatient.treatmentHistory.map((treatment, index) => (
                        <Box key={index} p={4} border="1px" borderColor="gray.200" borderRadius="md">
                          <HStack justify="space-between" mb={2}>
                            <Text fontWeight="medium">{treatment.treatment}</Text>
                            <Text fontSize="sm" color="gray.600">{treatment.date}</Text>
                          </HStack>
                          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                            <Box>
                              <Text fontSize="sm" color="gray.600">Duration</Text>
                              <Text fontSize="sm">{treatment.duration}</Text>
                            </Box>
                            <Box>
                              <Text fontSize="sm" color="gray.600">Dosage</Text>
                              <Text fontSize="sm">{treatment.dosage}</Text>
                            </Box>
                          </SimpleGrid>
                          {treatment.notes && (
                            <Box mt={2}>
                              <Text fontSize="sm" color="gray.600">Notes</Text>
                              <Text fontSize="sm">{treatment.notes}</Text>
                            </Box>
                          )}
                        </Box>
                      ))}
                    </VStack>
                  </Box>
                )}

                {/* Current Medications */}
                <Box>
                  <Text fontSize="lg" fontWeight="semibold" mb={4} color="blue.600">
                    Current Medications
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <Box p={4} border="1px" borderColor="gray.200" borderRadius="md">
                      <Text fontWeight="medium" mb={2}>Morning</Text>
                      <Text fontSize="sm" color="gray.700">
                        Ashwagandha - 500mg<br />
                        Triphala - 1 tsp
                      </Text>
                    </Box>
                    <Box p={4} border="1px" borderColor="gray.200" borderRadius="md">
                      <Text fontWeight="medium" mb={2}>Evening</Text>
                      <Text fontSize="sm" color="gray.700">
                        Brahmi - 300mg<br />
                        Tulsi - 2 capsules
                      </Text>
                    </Box>
                  </SimpleGrid>
                </Box>

                {/* Doctor's Notes */}
                <Box>
                  <Text fontSize="lg" fontWeight="semibold" mb={4} color="blue.600">
                    Latest Doctor's Notes
                  </Text>
                  <Box p={4} bg="yellow.50" border="1px" borderColor="yellow.200" borderRadius="md">
                    <Text fontSize="sm" color="gray.700">
                      Patient showing good response to current treatment. Continue with prescribed medications.
                      Next visit scheduled for follow-up. Monitor blood pressure and sugar levels.
                    </Text>
                    <Text fontSize="xs" color="gray.500" mt={2}>
                      - Dr. {selectedPatient.doctor} ({selectedPatient.date})
                    </Text>
                  </Box>
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onPatientInfoClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Prescription Modal */}
      <PrescriptionModal 
        isOpen={isPrescriptionOpen} 
        onClose={onPrescriptionClose} 
        patient={prescriptionPatient} 
      />

      {/* View Prescription Modal */}
      <Modal isOpen={isViewPrescriptionOpen} onClose={onViewPrescriptionClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack spacing={3}>
              <Text fontSize="xl" fontWeight="bold" color="green.600">
                📋 Prescription History
              </Text>
              {selectedPatient && (
                <Badge colorScheme="blue">
                  {selectedPatient.patientName} - {selectedPatient.caseId}
                </Badge>
              )}
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedPatient && (
              <VStack spacing={6} align="stretch">
                {/* Patient Basic Info */}
                <Card variant="outline">
                  <CardBody>
                    <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
                      <Box>
                        <Text fontSize="sm" color="gray.600" mb={1}>Patient Name</Text>
                        <Text fontWeight="semibold">{selectedPatient.patientName}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600" mb={1}>Age</Text>
                        <Text fontWeight="semibold">{selectedPatient.age}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600" mb={1}>Gender</Text>
                        <Text fontWeight="semibold">{selectedPatient.gender}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600" mb={1}>Case ID</Text>
                        <Text fontWeight="semibold">{selectedPatient.caseId}</Text>
                      </Box>
                    </SimpleGrid>
                  </CardBody>
                </Card>

                {/* Recent Prescriptions */}
                <Card variant="outline">
                  <CardBody>
                    <Text fontSize="lg" fontWeight="bold" mb={4} color="green.600">
                      Recent Prescriptions
                    </Text>
                    <VStack spacing={4} align="stretch">
                      {/* Sample Prescription 1 */}
                      <Box p={4} border="1px" borderColor="gray.200" borderRadius="md" bg="green.50">
                        <HStack justify="space-between" mb={3}>
                          <Text fontWeight="bold" color="green.700">Prescription #P001</Text>
                          <Badge colorScheme="green">Latest</Badge>
                        </HStack>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                          <Box>
                            <Text fontSize="sm" color="gray.600" mb={1}>Date Prescribed</Text>
                            <Text fontWeight="semibold">{selectedPatient.date}</Text>
                          </Box>
                          <Box>
                            <Text fontSize="sm" color="gray.600" mb={1}>Doctor</Text>
                            <Text fontWeight="semibold">Dr. {selectedPatient.doctor}</Text>
                          </Box>
                        </SimpleGrid>
                        <Box mt={3}>
                          <Text fontSize="sm" color="gray.600" mb={2}>Medicines</Text>
                          <VStack spacing={2} align="stretch">
                            <Box p={3} bg="white" borderRadius="md">
                              <HStack justify="space-between">
                                <Text fontWeight="medium">Ashwagandha Churna</Text>
                                <Text fontSize="sm" color="gray.600">500mg - Twice daily</Text>
                              </HStack>
                              <Text fontSize="sm" color="gray.500">With warm milk - Morning & Evening - 30 days</Text>
                            </Box>
                            <Box p={3} bg="white" borderRadius="md">
                              <HStack justify="space-between">
                                <Text fontWeight="medium">Triphala Tablets</Text>
                                <Text fontSize="sm" color="gray.600">2 tablets - Once daily</Text>
                              </HStack>
                              <Text fontSize="sm" color="gray.500">With water - After dinner - 30 days</Text>
                            </Box>
                          </VStack>
                        </Box>
                      </Box>

                      {/* Sample Prescription 2 */}
                      <Box p={4} border="1px" borderColor="gray.200" borderRadius="md">
                        <HStack justify="space-between" mb={3}>
                          <Text fontWeight="bold" color="gray.700">Prescription #P002</Text>
                          <Badge colorScheme="blue">Previous</Badge>
                        </HStack>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                          <Box>
                            <Text fontSize="sm" color="gray.600" mb={1}>Date Prescribed</Text>
                            <Text fontWeight="semibold">2024-08-15</Text>
                          </Box>
                          <Box>
                            <Text fontSize="sm" color="gray.600" mb={1}>Status</Text>
                            <Badge colorScheme="gray">Completed</Badge>
                          </Box>
                        </SimpleGrid>
                        <Box mt={3}>
                          <Text fontSize="sm" color="gray.600" mb={2}>Medicines</Text>
                          <VStack spacing={2} align="stretch">
                            <Box p={3} bg="gray.50" borderRadius="md">
                              <HStack justify="space-between">
                                <Text fontWeight="medium">Brahmi Ghrita</Text>
                                <Text fontSize="sm" color="gray.600">5ml - Twice daily</Text>
                              </HStack>
                              <Text fontSize="sm" color="gray.500">With warm water - Before meals - 15 days</Text>
                            </Box>
                          </VStack>
                        </Box>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Treatment Notes */}
                <Card variant="outline">
                  <CardBody>
                    <Text fontSize="lg" fontWeight="bold" mb={4} color="green.600">
                      Treatment Notes & Progress
                    </Text>
                    <VStack spacing={3} align="stretch">
                      <Box p={4} bg="blue.50" borderRadius="md">
                        <Text fontSize="sm" color="blue.700" fontWeight="semibold" mb={2}>
                          Latest Follow-up ({selectedPatient.date})
                        </Text>
                        <Text fontSize="sm" color="gray.700">
                          Patient showing good response to current medication. Digestive issues have improved significantly. 
                          Continue with current prescription for another 2 weeks.
                        </Text>
                      </Box>
                      <Box p={4} bg="yellow.50" borderRadius="md">
                        <Text fontSize="sm" color="yellow.700" fontWeight="semibold" mb={2}>
                          Previous Visit (2024-08-15)
                        </Text>
                        <Text fontSize="sm" color="gray.700">
                          Initial assessment completed. Patient complaints of digestive issues and stress. 
                          Started with basic Ayurvedic formulations.
                        </Text>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button leftIcon={<Printer />} colorScheme="blue" onClick={() => handlePrintPatient(selectedPatient)}>
                Print History
              </Button>
              <Button variant="outline" onClick={onViewPrescriptionClose}>
                Close
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Patient Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text fontSize="xl" fontWeight="bold" color="blue.600">
              ✏️ Edit Patient Information
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedPatient && (
              <VStack spacing={6} align="stretch">
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <FormControl>
                    <FormLabel>Patient Name</FormLabel>
                    <Input defaultValue={selectedPatient.patientName} />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Age</FormLabel>
                    <Input defaultValue={selectedPatient.age} />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Gender</FormLabel>
                    <Select defaultValue={selectedPatient.gender}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Contact Number</FormLabel>
                    <Input defaultValue={selectedPatient.contact} />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Doctor</FormLabel>
                    <Select defaultValue={selectedPatient.doctor}>
                      <option value="Dr. Sharma">Dr. Sharma</option>
                      <option value="Dr. Patel">Dr. Patel</option>
                      <option value="Dr. Kumar">Dr. Kumar</option>
                      <option value="Dr. Singh">Dr. Singh</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Appointment Date</FormLabel>
                    <Input type="date" defaultValue={selectedPatient.date} />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Appointment Time</FormLabel>
                    <Input type="time" defaultValue={selectedPatient.time} />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Status</FormLabel>
                    <Select defaultValue={selectedPatient.status}>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="cancelled">Cancelled</option>
                    </Select>
                  </FormControl>
                </SimpleGrid>
                
                <FormControl>
                  <FormLabel>Chief Complaint</FormLabel>
                  <Textarea 
                    placeholder="Enter patient's main complaints..."
                    defaultValue="Chronic digestive issues, occasional headaches"
                    rows={3}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Medical History</FormLabel>
                  <Textarea 
                    placeholder="Enter relevant medical history..."
                    defaultValue="No major surgeries, family history of diabetes"
                    rows={3}
                  />
                </FormControl>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button variant="outline" onClick={onEditClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={() => {
                alert('Patient information updated successfully!');
                onEditClose();
              }}>
                Update Patient
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Export Modal */}
      <Modal isOpen={isExportOpen} onClose={onExportClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text fontSize="xl" fontWeight="bold" color="blue.600">
              📊 Export OPD Data
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

      {/* Upload Reports Modal */}
      <Modal isOpen={isUploadOpen} onClose={onUploadClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack spacing={3}>
              <Icon as={Upload} color="blue.500" boxSize={6} />
              <VStack align="start" spacing={0}>
                <Text fontSize="xl" fontWeight="bold" color="blue.600">
                  Upload Patient Reports
                </Text>
                {uploadPatient && (
                  <Text fontSize="sm" color="gray.600">
                    Patient: {uploadPatient.patientName} (ID: {uploadPatient.caseId})
                  </Text>
                )}
              </VStack>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={6} align="stretch">
              {/* File Upload Section */}
              <Box>
                <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700" mb={3}>
                  Select Files (PDF, JPEG, PNG - Max 10MB each)
                </FormLabel>
                <Box
                  border="2px dashed"
                  borderColor="gray.300"
                  borderRadius="lg"
                  p={8}
                  textAlign="center"
                  position="relative"
                  _hover={{ borderColor: "blue.400" }}
                  transition="border-color 0.2s"
                >
                  <Input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    position="absolute"
                    top="0"
                    left="0"
                    width="100%"
                    height="100%"
                    opacity="0"
                    cursor="pointer"
                  />
                  <VStack spacing={3}>
                    <Icon as={Upload} boxSize={8} color="gray.400" />
                    <VStack spacing={1}>
                      <Text fontSize="md" fontWeight="semibold" color="gray.600">
                        Drop files here or click to browse
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        Supports PDF, JPEG, PNG files up to 10MB
                      </Text>
                    </VStack>
                  </VStack>
                </Box>
              </Box>

              {/* Selected Files Display */}
              {uploadFiles.length > 0 && (
                <Box>
                  <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700" mb={3}>
                    Selected Files ({uploadFiles.length})
                  </FormLabel>
                  <VStack spacing={2} align="stretch" maxH="200px" overflowY="auto">
                    {uploadFiles.map((file, index) => (
                      <Flex
                        key={index}
                        align="center"
                        justify="space-between"
                        p={3}
                        border="1px"
                        borderColor="gray.200"
                        borderRadius="lg"
                        bg="gray.50"
                      >
                        <HStack spacing={3} flex="1" minW="0">
                          <Icon
                            as={file.type === 'application/pdf' ? FileText : 
                                file.type.startsWith('image/') ? FileText : FileText}
                            color={file.type === 'application/pdf' ? 'red.500' : 'blue.500'}
                            boxSize={5}
                          />
                          <VStack align="start" spacing={0} flex="1" minW="0">
                            <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                              {file.name}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              {(file.size / (1024 * 1024)).toFixed(2)} MB
                            </Text>
                          </VStack>
                        </HStack>
                        <IconButton
                          icon={<Trash2 size={16} />}
                          size="sm"
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => handleRemoveFile(index)}
                          aria-label="Remove file"
                        />
                      </Flex>
                    ))}
                  </VStack>
                </Box>
              )}

              {/* Description Field */}
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">
                  Description (Optional)
                </FormLabel>
                <Input
                  placeholder="Add description for these reports..."
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  size="md"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button variant="ghost" onClick={onUploadClose}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleSubmitUpload}
                isDisabled={uploadFiles.length === 0}
                leftIcon={<Upload size={16} />}
              >
                Upload Reports
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      </VStack>
      </Box>
    </Box>
  </>);
}

export default OPD;
