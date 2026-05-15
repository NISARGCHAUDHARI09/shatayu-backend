
import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { useDisclosure, useToast } from '@chakra-ui/react';
import { Box, VStack, Card, CardHeader, CardBody, HStack, Heading, Text, Button, IconButton, Tooltip, SimpleGrid, Badge, Flex, Modal, ModalContent, ModalFooter, Tabs, TabList, Tab, TabPanels, TabPanel, InputGroup, InputLeftElement, Input, Select, TableContainer, Table, Thead, Tr, Th, Tbody, Td, ModalOverlay, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, NumberInput, NumberInputField, Textarea, Divider, Icon, Spinner } from '@chakra-ui/react';
import { Stethoscope, Download, UserPlus, Users, CalendarCheck, TrendingUp, Upload, ClipboardList, Search, Filter, RefreshCw, ChevronLeft, ChevronRight, Plus, Edit, FileText } from 'lucide-react';
import { FileSpreadsheet } from 'lucide-react';
import { Printer, Eye, FilePlus, Edit3, PlusCircle, Trash2, Pill, Paperclip, X, Bed, History, MoreVertical, Menu as MenuIcon, Calendar, Clock } from 'lucide-react';
import { Menu, MenuButton, MenuList, MenuItem, Avatar } from '@chakra-ui/react';
import { jsPDF } from 'jspdf';
import PrescriptionModal from '../AyurvedicPrescription/PrescriptionModal';
import Medicine from '../Medicine/Medicine';
import { FaUser } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { useRef } from 'react';
import { countryList } from '../../../utils/countryList.js';
import { saveDraftBill } from '../../../utils/draftBillUtils.js';
import DraftQuickAccess from '../../common/DraftQuickAccess.jsx';
import AddPatientForm from './AddPatientForm.jsx';

// Example API endpoint (replace with your real endpoint)
const OPD_API_URL = 'https://shatayu-backend.onrender.com/api/opd-patients';

// Helper to get initial newPatient state
function getInitialNewPatient() {
  // Auto-fetch current date and time
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().slice(0, 5);
  
  return {
    patientName: '',
    caseId: '',
    appointmentDate: currentDate,
    appointmentTime: currentTime,
    presentComplaints: [
      { complaint: '', duration: '' },
      { complaint: '', duration: '' },
      { complaint: '', duration: '' },
      { complaint: '', duration: '' },
      { complaint: '', duration: '' }
    ],
    ayurvedicAssessment: {},
    examination: {},
    clinicalAssessment: {},
    documents: [],
    panchkarmas: []
  };
}

function OPDComponent() {
  // Panchkarma categories and subcategories data
  const panchkarmaCategories = {
    'Vamana': {
      subcategories: [
        { name: 'Pre-Vamana (Snehana + Swedana)', defaultDuration: 7 },
        { name: 'Vamana Procedure', defaultDuration: 1 },
        { name: 'Post-Vamana (Samsarjana Krama)', defaultDuration: 7 }
      ]
    },
    'Virechana': {
      subcategories: [
        { name: 'Pre-Virechana (Snehana + Swedana)', defaultDuration: 7 },
        { name: 'Virechana Procedure', defaultDuration: 1 },
        { name: 'Post-Virechana (Samsarjana Krama)', defaultDuration: 7 }
      ]
    },
    'Basti': {
      subcategories: [
        { name: 'Anuvasana Basti', defaultDuration: 3 },
        { name: 'Niruha Basti', defaultDuration: 3 },
        { name: 'Kala Basti (16 days)', defaultDuration: 16 },
        { name: 'Karma Basti (30 days)', defaultDuration: 30 },
        { name: 'Yoga Basti (8 days)', defaultDuration: 8 }
      ]
    },
    'Nasya': {
      subcategories: [
        { name: 'Pradhamana Nasya', defaultDuration: 7 },
        { name: 'Bruhana Nasya', defaultDuration: 7 },
        { name: 'Shamana Nasya', defaultDuration: 7 },
        { name: 'Navana Nasya', defaultDuration: 7 },
        { name: 'Marshya Nasya', defaultDuration: 7 }
      ]
    },
    'Raktamokshana': {
      subcategories: [
        { name: 'Jalaukavacharana (Leech Therapy)', defaultDuration: 1 },
        { name: 'Pracchana (Scarification)', defaultDuration: 1 },
        { name: 'Siravyadha (Venepuncture)', defaultDuration: 1 }
      ]
    }
  };

  // Navigation hook
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminPortal = location.pathname.includes('/admin/');
  const basePath = isAdminPortal ? '/admin' : '/doctor';

  // State for Panchkarma section
  const [showPanchkarmaSection, setShowPanchkarmaSection] = useState(false);

  // Memoized input handlers for better performance with debouncing
  const [inputBuffer, setInputBuffer] = useState({});
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.keys(inputBuffer).length > 0) {
        setNewPatient(prev => ({ ...prev, ...inputBuffer }));
        setInputBuffer({});
      }
    }, 50); // 50ms debounce for smooth typing
    return () => clearTimeout(timer);
  }, [inputBuffer]);
  
  const handlePatientInputChange = useCallback((field, value) => {
    setInputBuffer(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleAyurvedicAssessmentChange = useCallback((field, value) => {
    setNewPatient(prev => ({
      ...prev,
      ayurvedicAssessment: { ...(prev.ayurvedicAssessment || {}), [field]: value }
    }));
  }, []);

  const handleExaminationChange = useCallback((field, value) => {
    setNewPatient(prev => ({
      ...prev,
      examination: { ...(prev.examination || {}), [field]: value }
    }));
  }, []);

  const handleClinicalAssessmentChange = useCallback((field, value) => {
    setNewPatient(prev => ({
      ...prev,
      clinicalAssessment: { ...(prev.clinicalAssessment || {}), [field]: value }
    }));
  }, []);

  const handleFamilyHistoryChange = useCallback((field, value) => {
    setNewPatient(prev => ({
      ...prev,
      familyHistory: { ...(prev.familyHistory || {}), [field]: value }
    }));
  }, []);

  // Calculate end date based on start date and total duration
  const calculateEndDate = (startDate, subcategories) => {
    if (!startDate) return '';
    
    const totalDays = subcategories.reduce((sum, sub) => {
      return sum + (parseInt(sub.duration) || 0);
    }, 0);
    
    if (totalDays === 0) return '';
    
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + totalDays - 1);
    
    return end.toISOString().split('T')[0];
  };

  // Add new panchkarma block
  const addPanchkarmaBlock = () => {
    const newPanchkarma = {
      id: Date.now(),
      category: '',
      subcategories: [],
      startDate: '',
      endDate: '',
      notes: ''
    };
    
    setNewPatient(prev => ({
      ...prev,
      panchkarmas: [...(prev.panchkarmas || []), newPanchkarma]
    }));
  };

  // Remove panchkarma block
  const removePanchkarmaBlock = (id) => {
    setNewPatient(prev => ({
      ...prev,
      panchkarmas: prev.panchkarmas.filter(p => p.id !== id)
    }));
  };

  // Update panchkarma category
  const updatePanchkarmaCategory = (id, category) => {
    const categoryData = panchkarmaCategories[category];
    const initialSubcategories = categoryData?.subcategories.length > 0
      ? categoryData.subcategories.map(name => ({ name, duration: '', isCustom: false }))
      : [{ name: category, duration: '', isCustom: false }];

    setNewPatient(prev => ({
      ...prev,
      panchkarmas: prev.panchkarmas.map(p => 
        p.id === id 
          ? { 
              ...p, 
              category,
              subcategories: initialSubcategories,
              endDate: calculateEndDate(p.startDate, initialSubcategories)
            }
          : p
      )
    }));
  };

  // Update subcategory duration
  const updateSubcategoryDuration = (panchkarmaId, subcategoryIndex, duration) => {
    setNewPatient(prev => ({
      ...prev,
      panchkarmas: prev.panchkarmas.map(p => {
        if (p.id === panchkarmaId) {
          const updatedSubcategories = p.subcategories.map((sub, index) =>
            index === subcategoryIndex ? { ...sub, duration } : sub
          );
          return {
            ...p,
            subcategories: updatedSubcategories,
            endDate: calculateEndDate(p.startDate, updatedSubcategories)
          };
        }
        return p;
      })
    }));
  };

  // Update start date
  const updatePanchkarmaStartDate = (id, startDate) => {
    setNewPatient(prev => ({
      ...prev,
      panchkarmas: prev.panchkarmas.map(p => {
        if (p.id === id) {
          return {
            ...p,
            startDate,
            endDate: calculateEndDate(startDate, p.subcategories)
          };
        }
        return p;
      })
    }));
  };

  // Add subcategory to existing panchkarma
  const addSubcategory = (panchkarmaId) => {
    setNewPatient(prev => ({
      ...prev,
      panchkarmas: prev.panchkarmas.map(p => {
        if (p.id === panchkarmaId) {
          const updatedSubcategories = [...p.subcategories, { name: '', duration: '', isCustom: true }];
          return {
            ...p,
            subcategories: updatedSubcategories,
            endDate: calculateEndDate(p.startDate, updatedSubcategories)
          };
        }
        return p;
      })
    }));
  };

  // Update subcategory name (for custom subcategories)
  const updateSubcategoryName = (panchkarmaId, subcategoryIndex, name) => {
    setNewPatient(prev => ({
      ...prev,
      panchkarmas: prev.panchkarmas.map(p => {
        if (p.id === panchkarmaId) {
          const updatedSubcategories = p.subcategories.map((sub, index) =>
            index === subcategoryIndex ? { ...sub, name } : sub
          );
          return {
            ...p,
            subcategories: updatedSubcategories
          };
        }
        return p;
      })
    }));
  };

  // Remove subcategory
  const removeSubcategory = (panchkarmaId, subcategoryIndex) => {
    setNewPatient(prev => ({
      ...prev,
      panchkarmas: prev.panchkarmas.map(p => {
        if (p.id === panchkarmaId) {
          const updatedSubcategories = p.subcategories.filter((_, index) => index !== subcategoryIndex);
          return {
            ...p,
            subcategories: updatedSubcategories,
            endDate: calculateEndDate(p.startDate, updatedSubcategories)
          };
        }
        return p;
      })
    }));
  };

  // Save handler for medicine modal
  const handleSaveMedicineBill = () => {
    if (!selectedMedicinePatient) {
      toast({
        title: 'Error',
        description: 'No patient selected for medicine bill.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Get medicines from Medicine component state
    const medicines = currentMedicines || [];

    if (medicines.length === 0) {
      toast({
        title: 'No Medicines',
        description: 'Please add medicines before saving the bill.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const billData = {
      patientName: selectedMedicinePatient.patientName,
      caseId: selectedMedicinePatient.caseId,
      patientAge: selectedMedicinePatient.patientAge,
      patientGender: selectedMedicinePatient.patientGender,
      patientPhone: selectedMedicinePatient.patientPhone,
      doctorName: selectedMedicinePatient.consultant || 'Dr. Default',
      medicines: medicines,
      notes: '',
      billType: medicineTab // 'draft' or 'bill'
    };

    try {
      if (medicineTab === 'draft') {
        const savedBill = saveDraftBill(billData);
        toast({
          title: 'Draft Saved',
          description: `Bill #${savedBill.id} saved to Draft section successfully!`,
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
      } else if (medicineTab === 'bill') {
        // For now, we'll also save to draft but mark as finalized
        const savedBill = saveDraftBill({ ...billData, status: 'finalized' });
        toast({
          title: 'Bill Finalized',
          description: `Bill #${savedBill.id} saved to Billing module successfully!`,
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
      }
      
      // Close the medicine modal after saving
      onMedicineModalClose();
      
      // Optionally, show a link to view drafts
      if (medicineTab === 'draft') {
        setTimeout(() => {
          toast({
            title: 'Quick Access',
            description: 'You can view all draft bills in the Draft Bills section from the sidebar menu.',
            status: 'info',
            duration: 6000,
            isClosable: true,
          });
        }, 2000);
      }
    } catch (error) {
      toast({
        title: 'Save Failed',
        description: 'Could not save the bill. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  // State for segmented control selection
  const [medicineTab, setMedicineTab] = useState('draft');
  // Diagnosis modal state and handler
  const { isOpen: isDiagnosisModalOpen, onOpen: onDiagnosisModalOpen, onClose: onDiagnosisModalClose } = useDisclosure();
  const [selectedDiagnosisPatient, setSelectedDiagnosisPatient] = useState(null);
  const handleOpenDiagnosisModal = (patient) => {
    setSelectedDiagnosisPatient(patient);
    onDiagnosisModalOpen();
  };
  
  // Action modal state and handler
  const { isOpen: isActionModalOpen, onOpen: onActionModalOpen, onClose: onActionModalClose } = useDisclosure();
  const [selectedActionPatient, setSelectedActionPatient] = useState(null);
  const handleOpenActionModal = (patient) => {
    setSelectedActionPatient(patient);
    onActionModalOpen();
  };
  // Medicine modal state and handler
  const { isOpen: isMedicineModalOpen, onOpen: onMedicineModalOpen, onClose: onMedicineModalClose } = useDisclosure();
  const [selectedMedicinePatient, setSelectedMedicinePatient] = useState(null);
  const [currentMedicines, setCurrentMedicines] = useState([]);
  
  const handleOpenMedicineModal = (patient) => {
    console.log('handleOpenMedicineModal called', patient);
    setSelectedMedicinePatient(patient);
    setCurrentMedicines([]); // Reset medicines when opening modal
    setTimeout(() => {
      console.log('Opening modal, selectedMedicinePatient:', patient);
      onMedicineModalOpen();
    }, 0);
  };
  
  // Prescription Modal (the actual PrescriptionModal component)
  const { isOpen: isPrescriptionModalOpen, onOpen: onPrescriptionModalOpen, onClose: onPrescriptionModalClose } = useDisclosure();
  const [selectedPrescriptionModalPatient, setSelectedPrescriptionModalPatient] = useState(null);
  
  const handleOpenPrescriptionModal = (patient) => {
    console.log('Debug: Opening PrescriptionModal for patient:', patient.patientName, patient.caseId);
    setSelectedPrescriptionModalPatient(patient);
    onPrescriptionModalOpen();
  };
  
  // Prescription Form Modal (the old form-based modal)
  const { isOpen: isPrescriptionFormOpen, onOpen: onPrescriptionFormOpen, onClose: onPrescriptionFormClose } = useDisclosure();
  const [selectedPrescriptionFormPatient, setSelectedPrescriptionFormPatient] = useState(null);
  
  const handleOpenPrescriptionFormModal = (patient) => {
    setSelectedPrescriptionFormPatient(patient);
    // Reset the form to include patient data
    setNewPatient({
      ...getInitialNewPatient(),
      patientName: patient.patientName,
      caseId: patient.caseId,
      appointmentDate: patient.appointmentDate,
      appointmentTime: patient.appointmentTime,
      consultant: patient.consultant,
      patientAge: patient.age,
      patientGender: patient.gender,
      patientPhone: patient.contact,
      patientAddress: patient.patientAddress
    });
    onPrescriptionFormOpen();
  };
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
      try {
        let data = new Uint8Array(e.target.result);
        let workbook = XLSX.read(data, { type: 'array' });
        let sheetName = workbook.SheetNames[0];
        let sheet = workbook.Sheets[sheetName];
        // Read with options to handle empty cells and headers better
        let json = XLSX.utils.sheet_to_json(sheet, { 
          defval: '', // Default value for empty cells
          blankrows: false, // Skip completely blank rows
          raw: false // Convert dates to strings
        });
        
        // Filter out completely empty rows
        json = json.filter(row => {
          // Check if row has at least one non-empty value
          return Object.values(row).some(val => val !== '' && val !== null && val !== undefined);
        });

        if (json.length === 0) {
          toast({ title: 'No valid data found', description: 'The file appears to be empty or has no valid data rows.', status: 'warning', duration: 3000 });
          return;
        }

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
        
        // Clean and validate imported data
        const cleanedData = json.map((row, i) => ({
          ...row,
          id: Date.now() + i,
          // Ensure required fields have defaults
          patientName: row.patientName || '',
          appointmentDate: row.appointmentDate || '',
          appointmentTime: row.appointmentTime || '',
          consultant: row.consultant || '',
          symptoms: row.symptoms || '',
          status: row.status || 'Pending',
          // Handle any other fields that might be present
        }));
        
        // Add imported patients
        setOpdPatients(prev => [...prev, ...cleanedData]);
        toast({ 
          title: 'Patients Imported', 
          description: `Successfully imported ${cleanedData.length} patient record(s)`,
          status: 'success', 
          duration: 3000 
        });
      } catch (error) {
        console.error('Import error:', error);
        toast({ 
          title: 'Import Failed', 
          description: 'Failed to import file. Please check the file format and try again.',
          status: 'error', 
          duration: 5000 
        });
      }
    };
    reader.readAsArrayBuffer(file);
    // Reset file input
    event.target.value = '';
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
  const { isOpen: isComplaintsOpen, onOpen: onComplaintsOpen, onClose: onComplaintsClose } = useDisclosure();
  
  // State for complaints modal
  const [selectedComplaintsPatient, setSelectedComplaintsPatient] = useState(null);

  // Handle opening complaints modal
  const handleOpenComplaintsModal = (patient) => {
    setSelectedComplaintsPatient(patient);
    onComplaintsOpen();
  };
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
  const [itemsPerPage, setItemsPerPage] = useState(25);
  // State for search term
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  // State for active tab - default to Old OPD (index 2)
  const [activeTab, setActiveTab] = useState(2);

  // State for OPD patients
  const [opdPatients, setOpdPatients] = useState([]);
  // State for Patient Management patients (for Patient View tab)
  const [patientManagementList, setPatientManagementList] = useState([]);
  const [pmLoading, setPmLoading] = useState(false);
  const [pmDataLoaded, setPmDataLoaded] = useState(false); // Track if data has been loaded
  
  // Load OPD patients from localStorage on mount (fast initial load)
  useEffect(() => {
    try {
      const storedPatients = JSON.parse(localStorage.getItem('opdPatients') || '[]');
      setOpdPatients(storedPatients);
      setLoading(false);
    } catch (error) {
      console.error('Error loading OPD patients from localStorage:', error);
      setOpdPatients([]);
      setLoading(false);
    }
  }, []);

  // Automatic date-based OPD transfer: Move yesterday's "Today OPD" to "Old OPD"
  useEffect(() => {
    const checkAndTransferOldOPD = () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const lastCheckDate = localStorage.getItem('lastOPDCheckDate');

        // Only run if it's a new day
        if (lastCheckDate !== today) {
          const storedPatients = JSON.parse(localStorage.getItem('opdPatients') || '[]');
          
          // Update appointment dates that are older than today
          const updatedPatients = storedPatients.map(patient => {
            if (patient.appointmentDate && patient.appointmentDate < today && !patient.transferredToOld) {
              return {
                ...patient,
                transferredToOld: true,
                transferDate: today
              };
            }
            return patient;
          });

          // Only update if there were actual changes
          if (JSON.stringify(storedPatients) !== JSON.stringify(updatedPatients)) {
            localStorage.setItem('opdPatients', JSON.stringify(updatedPatients));
            setOpdPatients(updatedPatients);
          }

          // Update the last check date
          localStorage.setItem('lastOPDCheckDate', today);
        }
      } catch (error) {
        console.error('Error in automatic OPD transfer:', error);
      }
    };

    // Check only once on component mount
    checkAndTransferOldOPD();
  }, []);



  // Debounce search term for Patient View tab
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch Patient Management patients ONCE on initial mount (not on tab switch)
  useEffect(() => {
    // Check if we need to load data
    const shouldLoadData = !pmDataLoaded && !debouncedSearchTerm;
    
    if (!shouldLoadData) return;
    
    // Try to load from cache first
    const cachedData = localStorage.getItem('patientManagementCache');
    const cacheTimestamp = localStorage.getItem('patientManagementCacheTime');
    const now = Date.now();
    
    // Use cache if it's less than 24 hours old (86400000 ms)
    if (cachedData && cacheTimestamp && (now - parseInt(cacheTimestamp)) < 86400000) {
      try {
        const patients = JSON.parse(cachedData);
        console.log('📦 Using cached patient data:', patients.length, 'patients (cached', Math.round((now - parseInt(cacheTimestamp)) / 60000), 'minutes ago)');
        setPatientManagementList(patients);
        setPmDataLoaded(true);
        setPmLoading(false);
        return;
      } catch (e) {
        console.error('Error parsing cached data:', e);
        // Continue to fetch if cache is corrupted
      }
    }
    
    // Only fetch if cache is expired or doesn't exist
    console.log('🔄 Loading patient data from API...');
    setPmLoading(true);
    
    const baseURL = import.meta.env.VITE_API_URL || 'https://shatayu-backend.onrender.com';
    
    // Use a longer timeout and don't abort on unmount for initial load
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn('⏱️ Request timeout after 30 seconds');
      controller.abort();
    }, 30000);
    
    fetch(`${baseURL}/api/patients?limit=20000`, { signal: controller.signal })
      .then(res => {
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        return res.json();
      })
      .then(data => {
        const patients = Array.isArray(data.data) ? data.data : [];
        console.log('✅ Successfully loaded', patients.length, 'patients from API');
        
        if (patients.length > 0) {
          console.log('🔢 OPD range:', patients[0].patient_id || patients[0].patientId, 'to', patients[patients.length - 1].patient_id || patients[patients.length - 1].patientId);
        }
        
        // Cache the data for 24 hours
        try {
          localStorage.setItem('patientManagementCache', JSON.stringify(patients));
          localStorage.setItem('patientManagementCacheTime', Date.now().toString());
          console.log('💾 Patient data cached successfully');
        } catch (e) {
          console.error('Error caching data:', e);
        }
        
        setPatientManagementList(patients);
        setPmDataLoaded(true);
        setPmLoading(false);
      })
      .catch((err) => {
        clearTimeout(timeoutId);
        if (err.name === 'AbortError') {
          console.warn('⚠️ Request was aborted');
        } else {
          console.error('❌ Failed to fetch patients:', err.message);
        }
        
        // Try to use old cache even if expired as fallback
        if (cachedData) {
          try {
            const patients = JSON.parse(cachedData);
            console.log('📦 Using expired cache as fallback:', patients.length, 'patients');
            setPatientManagementList(patients);
            setPmDataLoaded(true);
          } catch (e) {
            setPatientManagementList([]);
          }
        } else {
          setPatientManagementList([]);
        }
        setPmLoading(false);
      });
    
    // Don't cleanup on unmount - let the request complete
    return () => {
      clearTimeout(timeoutId);
    };
  }, [pmDataLoaded, debouncedSearchTerm]);
  
  // Separate effect for search functionality
  useEffect(() => {
    if (!debouncedSearchTerm || !pmDataLoaded) return;
    
    console.log('🔍 Searching patients:', debouncedSearchTerm);
    setPmLoading(true);
    
    const baseURL = import.meta.env.VITE_API_URL || 'https://shatayu-backend.onrender.com';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    fetch(`${baseURL}/api/patients?limit=20000&search=${encodeURIComponent(debouncedSearchTerm)}`, { signal: controller.signal })
      .then(res => res.ok ? res.json() : Promise.reject(new Error('Search failed')))
      .then(data => {
        const patients = Array.isArray(data.data) ? data.data : [];
        console.log('🔍 Search results:', patients.length, 'patients');
        setPatientManagementList(patients);
        setPmLoading(false);
        clearTimeout(timeoutId);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error('Search error:', err);
        }
        setPmLoading(false);
        clearTimeout(timeoutId);
      });
    
    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [debouncedSearchTerm, pmDataLoaded]);
  
  // Memoize filtered patients to avoid recalculating on every render
  const filteredPatients = useMemo(() => {
    let filtered = opdPatients;
    const today = new Date().toISOString().split('T')[0];
    
    // Filter by tab
    switch (activeTab) {
      case 0: // Today OPD
        filtered = filtered.filter(patient => {
          if (!patient.appointmentDate) return false;
          const appointmentDate = new Date(patient.appointmentDate).toISOString().split('T')[0];
          return appointmentDate === today;
        });
        break;
      case 1: // Upcoming OPD
        filtered = filtered.filter(patient => {
          if (!patient.appointmentDate) return false;
          const appointmentDate = new Date(patient.appointmentDate).toISOString().split('T')[0];
          return appointmentDate > today;
        });
        break;
      case 2: // Old OPD - Use Patient Management list sorted by OPD number descending
        // Use patientManagementList directly since it's already fetched from backend
        // No need to merge with old OPD patients as API provides all patients
        filtered = [...patientManagementList];
        
        // Optimized sorting: pre-extract OPD numbers for faster sorting
        const getOpdNumber = (patient) => {
          // Check all possible OPD number fields
          const value = patient.patient_id || patient.patientId || patient.opd_no || patient.opdNo || patient.caseId || patient.id;
          const num = parseInt(String(value).replace(/\D/g, ''), 10);
          return isNaN(num) ? 0 : num;
        };
        
        // Sort by OPD number descending (highest first: 11094, 11093, 11092...)
        filtered.sort((a, b) => {
          const numA = getOpdNumber(a);
          const numB = getOpdNumber(b);
          return numB - numA; // Descending order
        });
        break;
    }
    
    // Filter by search term (Old OPD search includes both OPD and Patient Management data)
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(patient => {
        return (patient?.patientName || patient?.name || '').toLowerCase().includes(lowerSearch) ||
          (patient?.caseId ? patient.caseId.toString() : '').includes(searchTerm) ||
          (patient?.patient_id ? patient.patient_id.toString() : '').includes(searchTerm) ||
          (patient?.patientId ? patient.patientId.toString() : '').includes(searchTerm) ||
          (patient?.opd_no ? patient.opd_no.toString() : '').includes(searchTerm) ||
          (patient?.opdNo ? patient.opdNo.toString() : '').includes(searchTerm) ||
          (patient?.consultant || '').toLowerCase().includes(lowerSearch) ||
          (patient?.symptoms || '').toLowerCase().includes(lowerSearch) ||
          (patient?.phone || '').includes(searchTerm);
      });
    }
    
    return filtered;
  }, [opdPatients, patientManagementList, activeTab, searchTerm, debouncedSearchTerm]);
  
  // Memoize statistics calculations
  const statistics = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    // Combine OPD patients and Patient Management list for accurate total
    const allPatients = [...opdPatients, ...patientManagementList];
    return {
      total: allPatients.length,
      today: opdPatients.filter(p => {
        if (!p.appointmentDate) return false;
        const date = new Date(p.appointmentDate).toISOString().split('T')[0];
        return date === today;
      }).length,
      upcoming: opdPatients.filter(p => {
        if (!p.appointmentDate) return false;
        const date = new Date(p.appointmentDate).toISOString().split('T')[0];
        return date > today;
      }).length,
      completed: opdPatients.filter(p => {
        if (!p.appointmentDate) return false;
        const date = new Date(p.appointmentDate).toISOString().split('T')[0];
        return date < today;
      }).length
    };
  }, [opdPatients, patientManagementList]);
  
  // Memoize pagination with optimized slicing
  const paginationData = useMemo(() => {
    const length = filteredPatients?.length || 0;
    if (length === 0) return { totalPages: 0, paginatedPatients: [], startIndex: 0 };
    
    const pages = Math.ceil(length / itemsPerPage);
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = Math.min(startIdx + itemsPerPage, length);
    const paginated = filteredPatients.slice(startIdx, endIdx);
    return { totalPages: pages, paginatedPatients: paginated, startIndex: startIdx };
  }, [filteredPatients, currentPage, itemsPerPage]);
  
  const totalPages = paginationData.totalPages;
  const paginatedPatients = paginationData.paginatedPatients;
  const startIndex = paginationData.startIndex;

  // Function to generate next OPD number and set it in the form
  const generateAndSetOPDNumber = async () => {
    try {
      const baseURL = import.meta.env.VITE_API_URL || 'https://shatayu-backend.onrender.com';

      // Ask backend for next patient/OPD number based on ALL patients
      // (including soft-deleted ones) so numbers are never reused.
      const response = await fetch(`${baseURL}/api/patients/next-number`);
      if (!response.ok) {
        throw new Error('Failed to generate next OPD number');
      }

      const data = await response.json();
      const nextOPDNumber = data.nextId || 0;

      setNewPatient(prev => ({ ...prev, caseId: nextOPDNumber }));
      return nextOPDNumber;
    } catch (error) {
      console.error('Error generating OPD number:', error);
      const fallbackCaseId = Math.max(...opdPatients.map(p => p.caseId || 0), 0) + 1;
      setNewPatient(prev => ({ ...prev, caseId: fallbackCaseId }));
      return fallbackCaseId;
    }
  };

  // Open Add Patient modal and generate OPD number (open first so UI never blocks)
  const handleOpenAddPatient = () => {
    onAddOpen();
    generateAndSetOPDNumber()
      .then((nextOPDNumber) => {
        console.log('🎫 Generated OPD Number:', nextOPDNumber);
      })
      .catch((error) => {
        console.error('Error generating OPD number after opening modal:', error);
      });
  };

  const handleAddPatient = async () => {
    try {
      // Use the already generated caseId from the form
      const newPatientData = {
        ...newPatient,
        id: opdPatients.length + 1,
        caseId: newPatient.caseId, // Already set when modal opened
        generatedBy: 'Current User (9999)',
        status: 'scheduled'
      };
      
      // Save patient to database via API
      const baseURL = import.meta.env.VITE_API_URL || 'https://shatayu-backend.onrender.com';
      
      // Prepare data for API (map OPD fields to Patient Management API fields)
      const apiData = {
        name: newPatientData.patientName,
        age: newPatientData.patientAge,
        gender: newPatientData.patientGender,
        phone: newPatientData.patientPhone,
        email: newPatientData.patientEmail || '',
        address: newPatientData.patientAddress || '',
        city: newPatientData.city || '',
        postal_code: newPatientData.postalCode || '',
        country: newPatientData.country || '',
        blood_group: newPatientData.bloodGroup || '',
        emergency_contact: newPatientData.emergencyContact || '',
        emergency_phone: newPatientData.emergencyPhone || '',
        status: 'active'
      };
      
      // Make API call to save patient
      const response = await fetch(`${baseURL}/api/patients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save patient to database');
      }
      
      const savedPatient = await response.json();
      console.log('✅ Patient saved to database:', savedPatient);
      
      // Clear cache to force refresh of patient list
      localStorage.removeItem('patientManagementCache');
      localStorage.removeItem('patientManagementCacheTime');
      setPmDataLoaded(false);
      
      // Update local state
      setOpdPatients([...opdPatients, newPatientData]);
      setNewPatient(getInitialNewPatient());
      setCurrentMedicine({
      medicineDetails: '',
      type: '',
      dose: '',
      anupana: '',
      duration: '',
      note: ''
    });
    
    // Check if any Panchkarma treatments are configured and send to IPD
    const panchkarmas = newPatient.panchkarmas || [];
    const hasValidPanchkarma = panchkarmas.length > 0 && 
      panchkarmas.some(p => p.category && p.category.trim() !== '');
    
    console.log('Debug: Checking Panchkarma transfer in handleAddPatient:', {
      panchkarmas,
      hasValidPanchkarma,
      panchkarmaCount: panchkarmas.length
    });
    
    if (hasValidPanchkarma) {
      console.log('Debug: Transferring patient to IPD from handleAddPatient:', newPatientData.patientName);
      handleSendToIPD(newPatientData);
    }
    
    // Show success toast
    const panchkarmaCount = panchkarmas.length;
    const panchkarmaMessage = hasValidPanchkarma
      ? ` & transferred to IPD for ${panchkarmaCount} Panchkarma treatment${panchkarmaCount > 1 ? 's' : ''}`
      : '';
    toast({
      title: 'Patient Added Successfully',
      description: `Patient ${newPatient.patientName} saved to database${panchkarmaMessage}`,
      status: 'success',
      duration: 4000,
      isClosable: true,
      position: 'top-right'
    });
    
    onAddClose();
    setShowPanchkarmaSection(false); // Reset Panchkarma section visibility
    } catch (error) {
      console.error('Error saving patient:', error);
      // Fallback to local storage only if API fails
      const fallbackCaseId = Math.max(...opdPatients.map(p => p.caseId || 0), 0) + 1;
      const newPatientData = {
        ...newPatient,
        id: opdPatients.length + 1,
        caseId: fallbackCaseId,
        generatedBy: 'Current User (9999)',
        status: 'scheduled'
      };
      
      setOpdPatients([...opdPatients, newPatientData]);
      setNewPatient(getInitialNewPatient());
      setCurrentMedicine({
        medicineDetails: '',
        type: '',
        dose: '',
        anupana: '',
        duration: '',
        note: ''
      });
      
      toast({
        title: 'Error Saving Patient',
        description: 'Patient added locally but failed to save to database. Please check your connection.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
      
      onAddClose();
      setShowPanchkarmaSection(false);
    }
  };

  // Send patient and Panchkarma details to IPD
  const handleSendToIPD = async (patientData) => {
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
      // Map OPD field names to IPD field names
      name: patientData.patientName, // IPD uses 'name' instead of 'patientName'
      patientName: patientData.patientName, // Keep original for compatibility
      caseId: newIPDNumber, // Use new IPD number format
      regNo: patientData.caseId, // Store original OPD caseId as regNo
      opdId: patientData.id, // Reference to OPD patient
      age: patientData.patientAge,
      gender: patientData.patientGender,
      phone: patientData.patientPhone, // IPD uses 'phone' field
      contactNumber: patientData.patientPhone,
      email: patientData.patientEmail,
      address: patientData.patientAddress,
      bloodGroup: patientData.bloodGroup,
      emergencyContact: patientData.emergencyContact,
      roomNumber: '', // To be assigned by IPD staff
      bedNumber: '', // To be assigned by IPD staff
      admissionDate: new Date().toISOString().split('T')[0],
      admissionTime: new Date().toLocaleTimeString('en-US', { hour12: false }),
      consultant: patientData.consultant,
      doctor: patientData.consultant, // IPD uses 'doctor' field
      treatmentType: 'Panchkarma',
      therapy: 'Panchkarma Treatment', // IPD field
      panchakarma: patientData.panchkarmas?.map(p => p.category).join(', ') || '', // IPD field
      panchkarmas: patientData.panchkarmas || [],
      ayurvedicDiagnosis: patientData.clinicalAssessment?.roga || 'Panchkarma Treatment',
      prakriti: patientData.ayurvedicAssessment?.prakriti || '',
      dosha: patientData.ayurvedicAssessment?.vikriti || '',
      status: 'Active Treatment', // IPD status format
      admittedBy: 'OPD Transfer',
      presentComplaints: patientData.presentComplaints || [],
      ayurvedicAssessment: patientData.ayurvedicAssessment || {},
      examination: patientData.examination || {},
      clinicalAssessment: patientData.clinicalAssessment || {},
      familyHistory: patientData.familyHistory || {},
      medicines: patientData.medicines || [],
      treatmentPlan: patientData.treatmentPlan || '',
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

    // First, attempt to persist this IPD admission in the backend (D1)
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Missing auth token for IPD transfer');

      const baseURL = import.meta.env.VITE_API_URL || 'https://shatayu-backend.onrender.com';
      const payload = {
        regNo: ipdPatientData.regNo,
        caseId: ipdPatientData.caseId,
        name: ipdPatientData.name,
        age: ipdPatientData.age,
        gender: ipdPatientData.gender,
        phone: ipdPatientData.phone,
        admissionDate: ipdPatientData.admissionDate,
        room: ipdPatientData.roomNumber || '',
        doctor: ipdPatientData.doctor,
        condition: ipdPatientData.condition,
        prakriti: ipdPatientData.prakriti,
        dosha: ipdPatientData.dosha,
        ayurvedicDiagnosis: ipdPatientData.ayurvedicDiagnosis,
        therapy: ipdPatientData.therapy,
        panchakarma: ipdPatientData.panchakarma,
        treatmentDuration: ipdPatientData.treatmentDuration,
        diet: ipdPatientData.diet,
        yoga: ipdPatientData.yoga,
        status: ipdPatientData.status,
        panchkarmas: ipdPatientData.panchkarmas,
        progressNotes: [],
        medicines: []
      };

      const response = await axios.post(
        `${baseURL}/api/ipd/patients`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const newDbId = response.data?.id || Date.now();
      ipdPatientData.id = newDbId;
    } catch (error) {
      console.error('Error saving IPD admission to database, falling back to local only:', error);
      ipdPatientData.id = Date.now(); // Fallback local-only ID
    }

    // Store in localStorage for IPD component to access
    try {
      console.log('Debug: Attempting to save patient to IPD localStorage:', {
        patientName: ipdPatientData.name,
        caseId: ipdPatientData.caseId,
        panchkarmas: ipdPatientData.panchkarmas
      });
      
      const existingIPDPatients = JSON.parse(localStorage.getItem('ipdPatients') || '[]');
      const updatedIPDPatients = [...existingIPDPatients, ipdPatientData];
      localStorage.setItem('ipdPatients', JSON.stringify(updatedIPDPatients));
      
      console.log('Debug: Successfully saved to localStorage. Total IPD patients:', updatedIPDPatients.length);
      
      // Also trigger storage event for other components to listen
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'ipdPatients',
        newValue: JSON.stringify(updatedIPDPatients)
      }));

      console.log('Debug: Patient successfully transferred to IPD:', ipdPatientData.name);
    } catch (error) {
      console.error('Error saving to IPD:', error);
      toast({
        title: 'Transfer Error',
        description: 'Failed to transfer patient to IPD. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right'
      });
      return;
    }
    
    // Show IPD booking confirmation
    const treatmentNames = patientData.panchkarmas?.map(p => p.category).join(', ') || '';
    toast({
      title: 'IPD Transfer Successful',
      description: `Patient ${patientData.patientName} has been successfully transferred to IPD with IPD Number: ${newIPDNumber} for Panchkarma treatments: ${treatmentNames}`,
      status: 'success',
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
    
    // Check if any Panchkarma treatments are configured and send to IPD
    const panchkarmas = newPatient.panchkarmas || [];
    const hasValidPanchkarma = panchkarmas.length > 0 && 
      panchkarmas.some(p => p.category && p.category.trim() !== '');
    
    console.log('Debug: Checking Panchkarma transfer in handleSendToPharmacy:', {
      panchkarmas,
      hasValidPanchkarma,
      panchkarmaCount: panchkarmas.length
    });
    
    if (hasValidPanchkarma) {
      console.log('Debug: Transferring patient to IPD from handleSendToPharmacy:', newPatientData.patientName);
      handleSendToIPD(newPatientData);
    }
    
    // Reset form after adding patient and sending to pharmacy
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5);
    
    setNewPatient({
      patientName: '',
      caseId: '',
      appointmentDate: currentDate,
      appointmentTime: currentTime,
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
      panchkarmas: [], // Reset to empty array
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
    const panchkarmaCount = (newPatient.panchkarmas || []).length;
    const panchkarmaMessage = hasValidPanchkarma
      ? ` & transferred to IPD for ${panchkarmaCount} Panchkarma treatment${panchkarmaCount > 1 ? 's' : ''}`
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

  // Update complaint handler with useCallback for performance
  const updatePresentComplaint = useCallback((index, field, value) => {
    setNewPatient(prev => ({
      ...prev,
      presentComplaints: prev.presentComplaints.map((complaint, i) =>
        i === index ? { ...complaint, [field]: value } : complaint
      )
    }));
  }, []);

  // Medicine management for selected patient in modal
  const handleAddMedicineToForm = () => {
    // Use name/dose for modal, medicineDetails for add patient form
    const isModal = !!selectedMedicinePatient;
    if (isModal) {
      if (!(currentMedicine.name && currentMedicine.dose)) return;
      // Add to selectedMedicinePatient
      const newMed = { ...currentMedicine, id: Date.now() };
      setOpdPatients(prev => prev.map(p =>
        p.id === selectedMedicinePatient.id
          ? { ...p, medicines: [...(p.medicines || []), newMed] }
          : p
      ));
      setSelectedMedicinePatient(prev => ({ ...prev, medicines: [...(prev.medicines || []), newMed] }));
      setCurrentMedicine({});
    } else {
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
    }
  };

  const handleRemoveMedicine = (medicineId) => {
    const isModal = !!selectedMedicinePatient;
    if (isModal) {
      setOpdPatients(prev => prev.map(p =>
        p.id === selectedMedicinePatient.id
          ? { ...p, medicines: (p.medicines || []).filter(m => m.id !== medicineId) }
          : p
      ));
      setSelectedMedicinePatient(prev => ({ ...prev, medicines: (prev.medicines || []).filter(m => m.id !== medicineId) }));
    } else {
      const updatedMedicines = newPatient.medicines.filter(m => m.id !== medicineId);
      setNewPatient(prev => ({ ...prev, medicines: updatedMedicines }));
    }
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
    // Navigate to patient details page with patient data
    if (activeTab === 2 && !patient.appointmentDate) {
      // For Old OPD tab - Patient Management patients (no appointment), use patient ID
      navigate(`${basePath}/patient-details/${patient.id}`, { state: { patient } });
    } else {
      // For OPD patients (with appointments), use case ID
      navigate(`${basePath}/patient-details/${patient.caseId}`, { state: { patient } });
    }
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

  // Handle delete patient
  const handleDeletePatient = async (patient) => {
    if (window.confirm(`Are you sure you want to delete patient ${patient.patientName || patient.name}?`)) {
      try {
        const token = localStorage.getItem('authToken');
        const baseURL = import.meta.env.VITE_API_URL || 'https://shatayu-backend.onrender.com';
        
        // STEP 1: Use EXACT patient_id as stored in database (DO NOT strip "P")
        const deleteId = patient.patient_id || patient.patientId || patient.id;
        
        console.log('🗑️ Deleting patient with EXACT ID:', deleteId);
        console.log('🗑️ DELETE URL:', `${baseURL}/api/patients/${deleteId}`);
        
        // Delete from database via API
        const response = await fetch(`${baseURL}/api/patients/${deleteId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('🗑️ Delete response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.text();
          console.error('❌ Delete API error response:', errorData);
          throw new Error(`Failed to delete patient from database: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('✅ Patient deleted from database:', result);
        
        // STEP 3 & 5: Update React state directly + Clear cache
        localStorage.removeItem('patientManagementCache');
        localStorage.removeItem('patientManagementCacheTime');
        
        // Update OPD patients list
        setOpdPatients(prev => {
          const filtered = prev.filter(p => (p.patient_id || p.patientId || p.id) !== deleteId);
          console.log('🗑️ OPD patients:', prev.length, '→', filtered.length);
          return filtered;
        });
        
        // Update patient management list
        setPatientManagementList(prev => {
          const filtered = prev.filter(p => (p.patient_id || p.patientId || p.id) !== deleteId);
          console.log('🗑️ Patient management list:', prev.length, '→', filtered.length);
          console.log('🔍 Deleted patient still exists?:', filtered.find(p => (p.patient_id || p.patientId || p.id) === deleteId) ? 'YES ❌' : 'NO ✅');
          return filtered;
        });
        
        // STEP 4: DO NOT trigger automatic reload (keep pmDataLoaded as true)
        // Removed: setPmDataLoaded(false);
        
        toast({
          title: 'Patient Deleted',
          description: `Patient ${patient.patientName || patient.name} has been removed`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error('❌ Error deleting patient:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to delete patient',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  // Handle file upload for Add Patient modal (document section)
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => {
      const fileType = file.type;
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      return validTypes.includes(fileType) && file.size <= 5 * 1024 * 1024; // 5MB limit
    });

    if (validFiles.length !== files.length) {
      toast({
        title: "Invalid Files",
        description: "Only PDF, JPEG, and PNG files under 5MB are allowed.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }

    // Add documents to newPatient state
    if (validFiles.length > 0) {
      setNewPatient(prev => ({
        ...prev,
        documents: [...(prev.documents || []), ...validFiles.map(file => ({
          id: `doc_${Date.now()}_${Math.random()}`,
          name: file.name,
          type: file.type,
          size: file.size,
          file: file,
          url: URL.createObjectURL(file)
        }))]
      }));
    }
  };

  // Remove document from newPatient
  const removeDocument = (docId) => {
    setNewPatient(prev => ({
      ...prev,
      documents: (prev.documents || []).filter(doc => doc.id !== docId)
    }));
  };

  // Helper to get file icon based on file type
  const getFileIcon = (fileType) => {
    if (fileType === 'application/pdf') {
      return <FileText size={20} color="#ef4444" />;
    } else if (fileType.startsWith('image/')) {
      return <FileText size={20} color="#3b82f6" />;
    }
    return <FileText size={20} color="#6b7280" />;
  };

  // Helper to format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
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
    
    const headers = [
      'Case ID',
      'Patient Name',
      'Age',
      'Gender',
      'Phone',
      'Appointment Date',
      'Appointment Time',
      'Consultant',
      'Symptoms',
      'Status',
      'Address',
      'City',
      'Postal Code',
      'Country',
      'Complaints',
      'Diagnosis'
    ];
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
        doc.text(`Tab: ${['Today OPD', 'Upcoming OPD', 'Old OPD'][activeTab]}`, 20, 46);
        
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
            patient.status,
            patient.patientAddress || '',
            patient.city || '',
            patient.postalCode || '',
            patient.country || '',
            Array.isArray(patient.presentComplaints)
              ? patient.presentComplaints.map(c => `${c.complaint} (${c.duration})`).join('; ')
              : '',
            patient.clinicalAssessment?.roga || patient.diagnosis || ''
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
          { wch: 12 }, // Status
          { wch: 30 }, // Address
          { wch: 18 }, // City
          { wch: 12 }, // Postal Code
          { wch: 18 }, // Country
          { wch: 30 }, // Complaints
          { wch: 30 }  // Diagnosis
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
          ['Active Tab', ['Today OPD', 'Upcoming OPD', 'Old OPD'][activeTab]],
          ['Total Records', filteredPatients.length],
          ['Hospital', 'Hospital Management System - OPD'],
          [''],
          ['Statistics'],
          ['Today Patients', statistics.today],
          ['Upcoming Patients', statistics.upcoming],
          ['Completed Patients', statistics.completed]
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

  const tabLabels = ['Today OPD', 'Upcoming OPD', 'Old OPD'];

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
        {/* Draft Bills Quick Access - Only show for doctors */}
        <DraftQuickAccess />
        
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
                  leftIcon={<UserPlus />} 
                  colorScheme="blue" 
                  size="md"
                  borderRadius="lg"
                  px={6}
                  onClick={handleOpenAddPatient}
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
                    {statistics.total}
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
                    {statistics.today}
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
                    {statistics.upcoming}
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
                    {statistics.completed}
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

                  {/* Info banner for Old OPD tab */}
                  {activeTab === 2 && (
                    <Box bg="blue.50" border="1px" borderColor="blue.200" borderRadius="md" p={3} mb={4}>
                      <HStack spacing={2}>
                        <Icon as={CalendarCheck} color="blue.500" />
                        <Text fontSize="sm" color="blue.700">
                          {pmLoading ? 'Loading patients...' : `Showing ${filteredPatients.length} patients sorted by OPD number (latest first)`}
                        </Text>
                      </HStack>
                    </Box>
                  )}

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
                            {activeTab === 2 ? (
                              // Old OPD - Merged columns (OPD + Patient Management)
                              <>
                                <Th borderColor="blue.200" color="blue.700" fontWeight="semibold">OPD No.</Th>
                                <Th borderColor="blue.200" color="blue.700" fontWeight="semibold">Patient Details</Th>
                                <Th borderColor="blue.200" color="blue.700" fontWeight="semibold">Contact</Th>
                                <Th borderColor="blue.200" color="blue.700" fontWeight="semibold">Appointment</Th>
                                <Th borderColor="blue.200" color="blue.700" fontWeight="semibold" display={{ base: 'none', lg: 'table-cell' }}>Consultant</Th>
                                <Th borderColor="blue.200" color="blue.700" fontWeight="semibold">Address / City</Th>
                                <Th borderColor="blue.200" color="blue.700" fontWeight="semibold">Country</Th>
                                <Th borderColor="blue.200" color="blue.700" fontWeight="semibold">Status</Th>
                                <Th borderColor="blue.200" color="blue.700" fontWeight="semibold">Action</Th>
                              </>
                            ) : (
                              // Today OPD and Upcoming OPD columns
                              <>
                                <Th borderColor="blue.200" color="blue.700" fontWeight="semibold">Case ID</Th>
                                <Th borderColor="blue.200" color="blue.700" fontWeight="semibold">Patient Details</Th>
                                <Th borderColor="blue.200" color="blue.700" fontWeight="semibold" display={{ base: 'none', md: 'table-cell' }}>Appointment</Th>
                                <Th borderColor="blue.200" color="blue.700" fontWeight="semibold" display={{ base: 'none', lg: 'table-cell' }}>Consultant</Th>
                                <Th borderColor="blue.200" color="blue.700" fontWeight="semibold" colSpan={2}>Address / City & Postal Code</Th>
                                <Th borderColor="blue.200" color="blue.700" fontWeight="semibold">Country</Th>
                                <Th borderColor="blue.200" color="blue.700" fontWeight="semibold">Complaints</Th>
                                <Th borderColor="blue.200" color="blue.700" fontWeight="semibold">Diagnosis</Th>
                                <Th borderColor="blue.200" color="blue.700" fontWeight="semibold">Action</Th>
                              </>
                            )}
                          </Tr>
                        </Thead>
                      <Tbody>
                        {(activeTab === 2 && pmLoading) ? (
                          <Tr>
                            <Td colSpan={9} textAlign="center" py={10}>
                              <Spinner size="lg" color="blue.500" />
                              <Text mt={2} color="gray.600">Loading patients...</Text>
                            </Td>
                          </Tr>
                        ) : paginatedPatients.length > 0 ? (
                          paginatedPatients.map((patient) => (
                            <Tr 
                              key={patient.id} 
                              _hover={{ bg: 'blue.25' }}
                              transition="background-color 0.2s ease"
                              borderBottom="1px"
                              borderBottomColor="blue.100"
                            >
                              {activeTab === 2 ? (
                                <React.Fragment key={`old-opd-${patient.id}`}>
                                  <Td>{patient.caseId || patient.patient_id || patient.patientId || patient.opd_no || patient.opdNo || '-'}</Td>
                                  <Td>
                                    <Box fontWeight="semibold">{patient.patientName || patient.name}</Box>
                                    <Box fontSize="sm" color="gray.600">{patient.patientAge || patient.age} years / {patient.patientGender || patient.gender}</Box>
                                  </Td>
                                  <Td>
                                    <Box fontSize="sm">{patient.patientPhone || patient.phone}</Box>
                                    <Box fontSize="xs" color="gray.500">{patient.patientEmail || patient.email || '-'}</Box>
                                  </Td>
                                  <Td>
                                    {patient.appointmentDate ? (
                                      <VStack align="start" spacing={0}>
                                        <Box>{patient.appointmentDate}</Box>
                                        <Box fontSize="sm" color="gray.500">{patient.appointmentTime}</Box>
                                      </VStack>
                                    ) : (
                                      <Badge colorScheme="gray">No Appointment</Badge>
                                    )}
                                  </Td>
                                  <Td display={{ base: 'none', lg: 'table-cell' }}>{patient.consultant || '-'}</Td>
                                  <Td>
                                    <Box>
                                      <Text fontWeight="medium">{patient.patientAddress || patient.address || '-'}</Text>
                                      <Text fontSize="sm" color="gray.600">
                                        {patient.city || '-'}{patient.postalCode || patient.postal_code ? ` / ${patient.postalCode || patient.postal_code}` : ''}
                                      </Text>
                                    </Box>
                                  </Td>
                                  <Td>{patient.country || '-'}</Td>
                                  <Td>
                                    <Badge colorScheme={patient.status === 'active' ? 'green' : patient.status === 'admitted' ? 'blue' : 'gray'}>
                                      {patient.status || 'completed'}
                                    </Badge>
                                  </Td>
                                  <Td>
                                    <Menu placement="bottom-end" strategy="fixed">
                                      <MenuButton
                                        as={IconButton}
                                        icon={<MoreVertical size={18} />}
                                        variant="ghost"
                                        aria-label="Actions"
                                      />
                                      <MenuList zIndex={2000}>
                                        <MenuItem
                                          icon={<Eye size={16} />}
                                          onClick={() => handleViewPatient(patient)}
                                        >
                                          View
                                        </MenuItem>
                                        <MenuItem
                                          icon={<Edit3 size={16} />}
                                          onClick={() => handleEditPatient(patient)}
                                        >
                                          Edit
                                        </MenuItem>
                                        <MenuItem
                                          icon={<FileText size={16} />}
                                          onClick={() => handleOpenPrescriptionModal(patient)}
                                        >
                                          Prescription
                                        </MenuItem>
                                        <MenuItem
                                          icon={<Pill size={16} />}
                                          onClick={() => handleOpenMedicineModal(patient)}
                                        >
                                          Medicine
                                        </MenuItem>
                                        <MenuItem
                                          icon={<Calendar size={16} />}
                                          onClick={() => handleScheduleAppointment(patient)}
                                        >
                                          Schedule Appointment
                                        </MenuItem>
                                        <MenuItem
                                          icon={<Trash2 size={16} />}
                                          onClick={() => handleDeletePatient(patient)}
                                          color="red.500"
                                        >
                                          Delete
                                        </MenuItem>
                                      </MenuList>
                                    </Menu>
                                  </Td>
                                </React.Fragment>
                              ) : (
                                <React.Fragment key={`today-opd-${patient.id}`}>
                                  <Td>{patient.caseId}</Td>
                                  <Td>
                                    <Box fontWeight="semibold">{patient.patientName}</Box>
                                    <Box fontSize="sm" color="gray.600">{patient.patientAge} / {patient.patientGender}</Box>
                                    <Box fontSize="sm" color="gray.500">{patient.patientPhone}</Box>
                                  </Td>
                                  <Td display={{ base: 'none', md: 'table-cell' }}>
                                    <VStack align="start" spacing={0}>
                                      <Box>{patient.appointmentDate}</Box>
                                      <Box fontSize="sm" color="gray.500">{patient.appointmentTime}</Box>
                                    </VStack>
                                  </Td>
                                  <Td display={{ base: 'none', lg: 'table-cell' }}>{patient.consultant}</Td>
                                  <Td colSpan={2}>
                                    <Box>
                                      <Text fontWeight="medium">{patient.patientAddress || '-'}</Text>
                                      <Text fontSize="sm" color="gray.600">
                                        {(patient.city ? patient.city : '-')}{(patient.postalCode ? ` / ${patient.postalCode}` : '')}
                                      </Text>
                                    </Box>
                                  </Td>
                                  <Td>{patient.country || '-'}</Td>
                                  <Td>
                                    <Tooltip label="View Complaints History" placement="top">
                                      <IconButton
                                        icon={<Eye size={16} />}
                                        size="sm"
                                        colorScheme="purple"
                                        variant="outline"
                                        onClick={() => handleOpenComplaintsModal(patient)}
                                        aria-label="View complaints"
                                      />
                                    </Tooltip>
                                  </Td>
                                  <Td>
                                    <Button size="sm" colorScheme="blue" onClick={() => handleOpenDiagnosisModal(patient)}>View</Button>
                                  </Td>
                                  <Td>
                                    <Menu placement="bottom-end" strategy="fixed">
                                      <MenuButton
                                        as={IconButton}
                                        icon={<MoreVertical size={18} />}
                                        variant="ghost"
                                        aria-label="Actions"
                                      />
                                      <MenuList zIndex={2000}>
                                        <MenuItem
                                          icon={<Eye size={16} />}
                                          onClick={() => handleViewPatient(patient)}
                                        >
                                          View
                                        </MenuItem>
                                        <MenuItem
                                          icon={<Edit3 size={16} />}
                                          onClick={() => handleEditPatient(patient)}
                                        >
                                          Edit
                                        </MenuItem>
                                        <MenuItem
                                          icon={<Pill size={16} />}
                                          onClick={() => handleOpenMedicineModal(patient)}
                                        >
                                          Medicine
                                        </MenuItem>
                                        <MenuItem
                                          icon={<FileText size={16} />}
                                          onClick={() => handleOpenPrescriptionModal(patient)}
                                        >
                                          Prescription
                                        </MenuItem>

                                        <MenuItem
                                          icon={<Trash2 size={16} />}
                                          onClick={() => handleDeletePatient(patient)}
                                          color="red.500"
                                        >
                                          Delete
                                        </MenuItem>
                                      </MenuList>
                                    </Menu>
                                  </Td>
                                </React.Fragment>
                              )}
                            </Tr>
                          ))
                        ) : (
                          <Tr>
                            <Td colSpan={activeTab === 2 ? 9 : 10} textAlign="center" py={10}>
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
        </VStack>
      </Box>
    </Box>

      {/* Add Patient Modal - New Optimized Form */}
      <AddPatientForm
        isOpen={isAddOpen}
        onClose={() => {
          setPmDataLoaded(false); // Force refresh of patient list
          onAddClose();
        }}
        onSave={(savedPatient) => {
          console.log('📝 Patient saved with data:', savedPatient);
          // Update local state with saved patient - ensure caseId is set
          const patientWithCaseId = {
            ...savedPatient,
            caseId: savedPatient.patient_id || savedPatient.patientId || savedPatient.id,
            opdNo: savedPatient.patient_id || savedPatient.patientId || savedPatient.id,
            // Use the appointment date entered in the form so
            // Today / Upcoming tabs classify correctly by date.
            appointmentDate: savedPatient.appointmentDate || new Date().toISOString().split('T')[0],
            status: 'scheduled'
          };
          setOpdPatients(prev => [...prev, patientWithCaseId]);

          // If Panchkarma section is filled, automatically transfer to IPD
          const pkList = patientWithCaseId.panchkarmas || [];
          const hasPanchkarma = pkList.length > 0 && pkList.some(p => p.category && p.category.trim() !== '');
          if (hasPanchkarma) {
            handleSendToIPD(patientWithCaseId);
          }

          // Force refresh of patient list from cache/API
          setPmDataLoaded(false);
          toast({
            title: 'Success!',
            description: `Patient added successfully with OPD No: ${patientWithCaseId.caseId}`,
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        }}
        generatedCaseId={newPatient.caseId}
      />

      {/* OLD MODAL - KEEPING FOR REFERENCE, REMOVE LATER */}
      {false && (
      <Modal isOpen={isAddOpen} onClose={() => {
        setNewPatient(getInitialNewPatient());
        setShowPanchkarmaSection(false);
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
                      onChange={e => handlePatientInputChange('patientName', e.target.value)}
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
                        onChange={(e) => handlePatientInputChange('patientAge', e.target.value)}
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
                      onChange={(e) => handlePatientInputChange('patientGender', e.target.value)}
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
                      onChange={(e) => handlePatientInputChange('patientPhone', e.target.value)}
                      onKeyDown={e => handleEnter(e, bloodRef)}
                      placeholder="Enter phone number"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>City</FormLabel>
                    <Input
                      value={newPatient.city || ''}
                      onChange={e => handlePatientInputChange('city', e.target.value)}
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
                    <FormLabel>Appointment Date (Auto-fetched)</FormLabel>
                    <Input
                      type="date"
                      value={newPatient.appointmentDate}
                      onChange={e => setNewPatient(prev => ({ ...prev, appointmentDate: e.target.value }))}
                      bg="gray.50"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Appointment Time (Auto-fetched)</FormLabel>
                    <Input
                      type="time"
                      value={newPatient.appointmentTime}
                      onChange={e => setNewPatient(prev => ({ ...prev, appointmentTime: e.target.value }))}
                      bg="gray.50"
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
                          onChange={(e) => handleAyurvedicAssessmentChange('prakriti', e.target.value)}
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
                          onChange={(e) => handleAyurvedicAssessmentChange('vikriti', e.target.value)}
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
                          onChange={(e) => handleAyurvedicAssessmentChange('agni', e.target.value)}
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
                          onChange={(e) => handleAyurvedicAssessmentChange('ojas', e.target.value)}
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
                          onChange={(e) => handleExaminationChange('nadi', e.target.value)}
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
                          onChange={(e) => handleExaminationChange('jihva', e.target.value)}
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
                          onChange={(e) => handleExaminationChange('eyes', e.target.value)}
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
                          onChange={(e) => handleFamilyHistoryChange('father', e.target.value)}
                          placeholder="Father's medical history"
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Mother</FormLabel>
                        <Input
                          value={newPatient.familyHistory ? newPatient.familyHistory.mother || '' : ''}
                          onChange={(e) => handleFamilyHistoryChange('mother', e.target.value)}
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

                  {/* Add Panchkarma Button */}
                  <Box textAlign="center" py={4}>
                    <Button
                      leftIcon={<PlusCircle />}
                      colorScheme="purple"
                      variant="outline"
                      onClick={() => {
                        setShowPanchkarmaSection(true);
                        // Add first Panchkarma block automatically
                        if (!newPatient.panchkarmas || newPatient.panchkarmas.length === 0) {
                          addPanchkarmaBlock();
                        }
                      }}
                      size="md"
                    >
                      Add Panchkarma
                    </Button>
                  </Box>

                  {/* Panchkarma Section */}
                  {showPanchkarmaSection && (
                    <>
                      <Divider />
                      <Box>
                        <HStack justify="space-between" align="center" mb={4}>
                          <Text fontSize="md" fontWeight="semibold" color="purple.600">
                            7. Panchkarma Treatment
                          </Text>
                          <Button
                            leftIcon={<Plus />}
                            colorScheme="purple"
                            size="sm"
                            onClick={addPanchkarmaBlock}
                          >
                            Add Panchkarma
                          </Button>
                        </HStack>

                        {/* Panchkarma Cards */}
                        <VStack spacing={4} align="stretch">
                          {(newPatient.panchkarmas || []).map((panchkarma, index) => (
                            <Card key={panchkarma.id} border="1px solid" borderColor="purple.200" bg="purple.50">
                              <CardHeader pb={2}>
                                <HStack justify="space-between">
                                  <Text fontWeight="semibold" color="purple.700">
                                    Panchkarma {index + 1}
                                  </Text>
                                  <IconButton
                                    icon={<X />}
                                    size="sm"
                                    colorScheme="red"
                                    variant="ghost"
                                    onClick={() => removePanchkarmaBlock(panchkarma.id)}
                                    aria-label="Remove Panchkarma"
                                  />
                                </HStack>
                              </CardHeader>
                              <CardBody pt={0}>
                                <VStack spacing={4} align="stretch">
                                  {/* Category Selection */}
                                  <FormControl>
                                    <FormLabel>Panchkarma Category</FormLabel>
                                    <Select
                                      value={panchkarma.category}
                                      onChange={(e) => updatePanchkarmaCategory(panchkarma.id, e.target.value)}
                                      placeholder="Select Panchkarma category"
                                    >
                                      {Object.keys(panchkarmaCategories).map(category => (
                                        <option key={category} value={category}>{category}</option>
                                      ))}
                                    </Select>
                                  </FormControl>

                                  {/* Subcategories or Direct Duration */}
                                  {panchkarma.category && (
                                    <Box>
                                      <Text fontWeight="medium" mb={2} color="gray.700">
                                        Treatment Details
                                      </Text>
                                      <Text fontSize="xs" color="gray.500" mb={3}>
                                        Predefined subcategories are shown with gray background. You can add custom subcategories using the button below.
                                      </Text>
                                      <VStack spacing={3} align="stretch">
                                        {panchkarma.subcategories.map((subcategory, subIndex) => (
                                          <HStack key={subIndex} spacing={3} align="center">
                                            <Box flex="1" minW="180px">
                                              {subcategory.isCustom ? (
                                                <Input
                                                  value={subcategory.name}
                                                  onChange={(e) => updateSubcategoryName(panchkarma.id, subIndex, e.target.value)}
                                                  placeholder="Enter custom subcategory"
                                                  size="sm"
                                                  bg="white"
                                                  border="1px solid"
                                                  borderColor="purple.300"
                                                  _focus={{ borderColor: "purple.500", boxShadow: "0 0 0 1px #805AD5" }}
                                                />
                                              ) : (
                                                <Text
                                                  fontSize="sm"
                                                  fontWeight="medium"
                                                  color="gray.700"
                                                  bg="gray.50"
                                                  px={3}
                                                  py={2}
                                                  borderRadius="md"
                                                  border="1px solid"
                                                  borderColor="gray.200"
                                                >
                                                  {subcategory.name}
                                                </Text>
                                              )}
                                            </Box>
                                            <HStack spacing={2} align="center">
                                              <NumberInput
                                                value={subcategory.duration}
                                                onChange={(value) => updateSubcategoryDuration(panchkarma.id, subIndex, value)}
                                                min={1}
                                                max={30}
                                                size="sm"
                                                width="90px"
                                              >
                                                <NumberInputField placeholder="Days" textAlign="center" />
                                              </NumberInput>
                                              <Text fontSize="sm" color="gray.500" minW="35px">days</Text>
                                              {subcategory.isCustom && (
                                                <IconButton
                                                  icon={<X />}
                                                  size="sm"
                                                  colorScheme="red"
                                                  variant="ghost"
                                                  onClick={() => removeSubcategory(panchkarma.id, subIndex)}
                                                  aria-label="Remove subcategory"
                                                />
                                              )}
                                            </HStack>
                                          </HStack>
                                        ))}

                                        {/* Add Subcategory Button (only for categories with subcategories) */}
                                        {panchkarmaCategories[panchkarma.category]?.subcategories.length > 0 && (
                                          <Button
                                            leftIcon={<Plus />}
                                            size="sm"
                                            variant="outline"
                                            colorScheme="purple"
                                            onClick={() => addSubcategory(panchkarma.id)}
                                            alignSelf="flex-start"
                                          >
                                            Add Custom Subcategory
                                          </Button>
                                        )}
                                      </VStack>
                                    </Box>
                                  )}

                                  {/* Treatment Dates */}
                                  <SimpleGrid columns={2} spacing={4}>
                                    <FormControl>
                                      <FormLabel fontSize="sm">
                                        <HStack>
                                          <Calendar size={16} />
                                          <Text>Treatment Start Date</Text>
                                        </HStack>
                                      </FormLabel>
                                      <Input
                                        type="date"
                                        value={panchkarma.startDate}
                                        onChange={(e) => updatePanchkarmaStartDate(panchkarma.id, e.target.value)}
                                        size="sm"
                                      />
                                    </FormControl>
                                    <FormControl>
                                      <FormLabel fontSize="sm">
                                        <HStack>
                                          <Clock size={16} />
                                          <Text>Treatment End Date</Text>
                                        </HStack>
                                      </FormLabel>
                                      <Input
                                        type="date"
                                        value={panchkarma.endDate}
                                        isReadOnly
                                        bg="gray.100"
                                        size="sm"
                                        placeholder="Auto-calculated"
                                      />
                                    </FormControl>
                                  </SimpleGrid>

                                  {/* Notes */}
                                  <FormControl>
                                    <FormLabel fontSize="sm">Notes</FormLabel>
                                    <Textarea
                                      value={panchkarma.notes || ''}
                                      onChange={(e) => setNewPatient(prev => ({
                                        ...prev,
                                        panchkarmas: prev.panchkarmas.map(p =>
                                          p.id === panchkarma.id ? { ...p, notes: e.target.value } : p
                                        )
                                      }))}
                                      placeholder="Additional notes for this Panchkarma treatment..."
                                      size="sm"
                                      rows={2}
                                    />
                                  </FormControl>
                                </VStack>
                              </CardBody>
                            </Card>
                          ))}

                          {/* Empty state message */}
                          {(!newPatient.panchkarmas || newPatient.panchkarmas.length === 0) && (
                            <Card border="2px dashed" borderColor="purple.300" bg="purple.25">
                              <CardBody textAlign="center" py={8}>
                                <Text color="purple.600" fontWeight="medium">
                                  No Panchkarma treatments added yet.
                                </Text>
                                <Text fontSize="sm" color="purple.500" mt={1}>
                                  Click "Add Panchkarma" to add a treatment plan.
                                </Text>
                              </CardBody>
                            </Card>
                          )}
                        </VStack>
                      </Box>
                    </>
                  )}

                  <Divider />
                </VStack>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter bg="gray.50" borderTop="1px" borderColor="gray.200">
            <HStack spacing={4} w="full" justify="flex-end">
              <Button
                variant="ghost"
                onClick={() => {
                  setNewPatient(getInitialNewPatient());
                  onAddClose();
                }}
                size="lg"
              >
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleAddPatient}
                size="lg"
                px={8}
              >
                Save Patient
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
      )}

      {/* Medicine Management Modal - always rendered at root of OPD */}
  <Modal isOpen={isMedicineModalOpen} onClose={onMedicineModalClose} size="6xl">
        <ModalOverlay />
  <ModalContent maxW="1400px">
          <ModalCloseButton />
          <Box px={8} pt={8} pb={0}>
            <HStack spacing={0} mb={4} justify="center">
              <Button
                variant="solid"
                borderRightRadius={0}
                borderLeftRadius="md"
                borderWidth={1}
                borderColor={medicineTab === 'draft' ? 'blue.400' : 'teal.200'}
                borderRight="none"
                px={8}
                bg={medicineTab === 'draft' ? 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)' : 'white'}
                color={medicineTab === 'draft' ? 'white' : 'gray.700'}
                fontWeight={medicineTab === 'draft' ? 'bold' : 'normal'}
                boxShadow={medicineTab === 'draft' ? 'md' : 'none'}
                onClick={() => setMedicineTab('draft')}
                _hover={{ bg: medicineTab === 'draft' ? 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)' : 'gray.50' }}
              >
                Draft
              </Button>
              <Button
                variant="solid"
                borderLeftRadius={0}
                borderRightRadius="md"
                borderWidth={1}
                borderColor={medicineTab === 'bill' ? 'blue.400' : 'teal.200'}
                px={8}
                bg={medicineTab === 'bill' ? 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)' : 'white'}
                color={medicineTab === 'bill' ? 'white' : 'gray.700'}
                fontWeight={medicineTab === 'bill' ? 'bold' : 'normal'}
                boxShadow={medicineTab === 'bill' ? 'md' : 'none'}
                onClick={() => setMedicineTab('bill')}
                _hover={{ bg: medicineTab === 'bill' ? 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)' : 'gray.50' }}
              >
                Bill
              </Button>
            </HStack>
          </Box>
          <ModalBody pt={2}>
            {selectedMedicinePatient ? (
              <Medicine 
                medicines={currentMedicines}
                setMedicines={setCurrentMedicines}
                onMedicinesChange={setCurrentMedicines}
                patientData={selectedMedicinePatient}
              />
            ) : (
              <div>No patient selected for medicine.</div>
            )}
          </ModalBody>
          <ModalFooter>
            <HStack w="full" justify="flex-end" spacing={6}>
              <Button colorScheme="gray" variant="outline" onClick={onMedicineModalClose}>Close</Button>
              <Button colorScheme="teal" variant="solid" px={8} onClick={handleSaveMedicineBill}>Save</Button>
              <Button colorScheme="blue" variant="outline" px={8} onClick={() => document.querySelector('#medicine-print-proxy')?.click()}>Print</Button>
            </HStack>
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
    
    {/* Diagnosis Modal */}
    <Modal isOpen={isDiagnosisModalOpen} onClose={onDiagnosisModalClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Diagnosis History for {selectedDiagnosisPatient?.patientName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {Array.isArray(selectedDiagnosisPatient?.diagnosisHistory) && selectedDiagnosisPatient.diagnosisHistory.length > 0 ? (
            <VStack align="stretch" spacing={3}>
              {selectedDiagnosisPatient.diagnosisHistory.map((diag, idx) => (
                <Box key={idx} p={3} borderWidth={1} borderRadius="md" bg="gray.50">
                  <Text fontWeight="semibold">{diag.date}</Text>
                  <Text>{diag.text}</Text>
                </Box>
              ))}
            </VStack>
          ) : (
            <Text color="gray.500">No diagnosis history found.</Text>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={onDiagnosisModalClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>

    {/* Prescription Form Modal */}
    <Modal isOpen={isPrescriptionFormOpen} onClose={onPrescriptionFormClose} size="6xl">
      <ModalOverlay />
      <ModalContent maxH="90vh" overflowY="auto">
        <ModalHeader>
          <HStack>
            <FileText size={24} />
            <Text>Patient Prescription - {selectedPrescriptionFormPatient?.patientName}</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Basic Patient Information - Read Only */}
            <Box>
              <Text fontSize="lg" fontWeight="semibold" mb={3} color="blue.600">
                Patient Information
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl>
                  <FormLabel>Patient Name</FormLabel>
                  <Input value={newPatient.patientName} isReadOnly bg="gray.50" />
                </FormControl>
                <FormControl>
                  <FormLabel>Case ID</FormLabel>
                  <Input value={newPatient.caseId} isReadOnly bg="gray.50" />
                </FormControl>
                <FormControl>
                  <FormLabel>Age</FormLabel>
                  <Input value={newPatient.patientAge} isReadOnly bg="gray.50" />
                </FormControl>
                <FormControl>
                  <FormLabel>Gender</FormLabel>
                  <Input value={newPatient.patientGender} isReadOnly bg="gray.50" />
                </FormControl>
              </SimpleGrid>
            </Box>

            <Divider />

            {/* Appointment Details */}
            <Box>
              <Text fontSize="lg" fontWeight="semibold" mb={3} color="green.600">
                Appointment Details
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl>
                  <FormLabel>Appointment Date</FormLabel>
                  <Input
                    type="date"
                    value={newPatient.appointmentDate}
                    onChange={e => setNewPatient(prev => ({ ...prev, appointmentDate: e.target.value }))}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Appointment Time</FormLabel>
                  <Input
                    type="time"
                    value={newPatient.appointmentTime}
                    onChange={e => setNewPatient(prev => ({ ...prev, appointmentTime: e.target.value }))}
                  />
                </FormControl>
                <FormControl>
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

            {/* Medical Information */}
            <Box>
              <Text fontSize="lg" fontWeight="semibold" mb={4} color="red.600">
                Medical Information
              </Text>
              <VStack spacing={6} align="stretch">

                {/* Present Complaint Section */}
                <Box>
                  <HStack justify="space-between" mb={3}>
                    <Text fontSize="md" fontWeight="semibold" color="blue.600">
                      Present Complaint
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

                {/* Ayurvedic Assessment Section */}
                <Box>
                  <Text fontSize="md" fontWeight="semibold" mb={3} color="orange.600">
                    Ayurvedic Assessment
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

                {/* Examination Section */}
                <Box>
                  <Text fontSize="md" fontWeight="semibold" mb={3} color="green.600">
                    Examination
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

                {/* Clinical Assessment Section */}
                <Box>
                  <Text fontSize="md" fontWeight="semibold" mb={3} color="purple.600">
                    Clinical Assessment
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

                {/* Upload Documents Section */}
                <Box>
                  <Text fontSize="md" fontWeight="semibold" mb={3} color="teal.600">
                    Upload Documents
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

                <Divider />

                {/* Panchkarma Section */}
                <Box>
                  <HStack justify="space-between" align="center" mb={4}>
                    <Text fontSize="md" fontWeight="semibold" color="purple.600">
                      Panchkarma Treatment
                    </Text>
                    <Button
                      leftIcon={<Plus />}
                      colorScheme="purple"
                      size="sm"
                      onClick={addPanchkarmaBlock}
                    >
                      Add Panchkarma
                    </Button>
                  </HStack>

                  {/* Panchkarma Cards */}
                  <VStack spacing={4} align="stretch">
                    {(newPatient.panchkarmas || []).map((panchkarma, index) => (
                      <Card key={panchkarma.id} border="1px solid" borderColor="purple.200" bg="purple.50">
                        <CardHeader pb={2}>
                          <HStack justify="space-between">
                            <Text fontWeight="semibold" color="purple.700">
                              Panchkarma {index + 1}
                            </Text>
                            <IconButton
                              icon={<X />}
                              size="sm"
                              colorScheme="red"
                              variant="ghost"
                              onClick={() => removePanchkarmaBlock(panchkarma.id)}
                              aria-label="Remove Panchkarma"
                            />
                          </HStack>
                        </CardHeader>
                        <CardBody pt={0}>
                          <VStack spacing={4} align="stretch">
                            {/* Category Selection */}
                            <FormControl>
                              <FormLabel>Panchkarma Category</FormLabel>
                              <Select
                                value={panchkarma.category}
                                onChange={(e) => updatePanchkarmaCategory(panchkarma.id, e.target.value)}
                                placeholder="Select Panchkarma category"
                              >
                                {Object.keys(panchkarmaCategories).map(category => (
                                  <option key={category} value={category}>{category}</option>
                                ))}
                              </Select>
                            </FormControl>

                            {/* Subcategories or Direct Duration */}
                            {panchkarma.category && (
                              <Box>
                                <Text fontWeight="medium" mb={2} color="gray.700">
                                  Treatment Details
                                </Text>
                                <Text fontSize="xs" color="gray.500" mb={3}>
                                  Predefined subcategories are shown with gray background. You can add custom subcategories using the button below.
                                </Text>
                                <VStack spacing={3} align="stretch">
                                  {panchkarma.subcategories.map((subcategory, subIndex) => (
                                    <HStack key={subIndex} spacing={3} align="center">
                                      <Box flex="1" minW="180px">
                                        {subcategory.isCustom ? (
                                          <Input
                                            value={subcategory.name}
                                            onChange={(e) => updateSubcategoryName(panchkarma.id, subIndex, e.target.value)}
                                            placeholder="Enter custom subcategory"
                                            size="sm"
                                            bg="white"
                                            border="1px solid"
                                            borderColor="purple.300"
                                            _focus={{ borderColor: "purple.500", boxShadow: "0 0 0 1px #805AD5" }}
                                          />
                                        ) : (
                                          <Text
                                            fontSize="sm"
                                            fontWeight="medium"
                                            color="gray.700"
                                            bg="gray.50"
                                            px={3}
                                            py={2}
                                            borderRadius="md"
                                            border="1px solid"
                                            borderColor="gray.200"
                                          >
                                            {subcategory.name}
                                          </Text>
                                        )}
                                      </Box>
                                      <HStack spacing={2} align="center">
                                        <NumberInput
                                          value={subcategory.duration}
                                          onChange={(value) => updateSubcategoryDuration(panchkarma.id, subIndex, value)}
                                          min={1}
                                          max={30}
                                          size="sm"
                                          width="90px"
                                        >
                                          <NumberInputField placeholder="Days" textAlign="center" />
                                        </NumberInput>
                                        <Text fontSize="sm" color="gray.500" minW="35px">days</Text>
                                        {subcategory.isCustom && (
                                          <IconButton
                                            icon={<X />}
                                            size="sm"
                                            colorScheme="red"
                                            variant="ghost"
                                            onClick={() => removeSubcategory(panchkarma.id, subIndex)}
                                            aria-label="Remove subcategory"
                                          />
                                        )}
                                      </HStack>
                                    </HStack>
                                  ))}

                                  {/* Add Subcategory Button (only for categories with subcategories) */}
                                  {panchkarmaCategories[panchkarma.category]?.subcategories.length > 0 && (
                                    <Button
                                      leftIcon={<Plus />}
                                      size="sm"
                                      variant="outline"
                                      colorScheme="purple"
                                      onClick={() => addSubcategory(panchkarma.id)}
                                      alignSelf="flex-start"
                                    >
                                      Add Custom Subcategory
                                    </Button>
                                  )}
                                </VStack>
                              </Box>
                            )}

                            {/* Treatment Dates */}
                            <SimpleGrid columns={2} spacing={4}>
                              <FormControl>
                                <FormLabel fontSize="sm">
                                  <HStack>
                                    <Calendar size={16} />
                                    <Text>Treatment Start Date</Text>
                                  </HStack>
                                </FormLabel>
                                <Input
                                  type="date"
                                  value={panchkarma.startDate}
                                  onChange={(e) => updatePanchkarmaStartDate(panchkarma.id, e.target.value)}
                                  size="sm"
                                />
                              </FormControl>
                              <FormControl>
                                <FormLabel fontSize="sm">
                                  <HStack>
                                    <Clock size={16} />
                                    <Text>Treatment End Date</Text>
                                  </HStack>
                                </FormLabel>
                                <Input
                                  type="date"
                                  value={panchkarma.endDate}
                                  isReadOnly
                                  bg="gray.100"
                                  size="sm"
                                  placeholder="Auto-calculated"
                                />
                              </FormControl>
                            </SimpleGrid>

                            {/* Notes */}
                            <FormControl>
                              <FormLabel fontSize="sm">Notes</FormLabel>
                              <Textarea
                                value={panchkarma.notes || ''}
                                onChange={(e) => setNewPatient(prev => ({
                                  ...prev,
                                  panchkarmas: prev.panchkarmas.map(p =>
                                    p.id === panchkarma.id ? { ...p, notes: e.target.value } : p
                                  )
                                }))}
                                placeholder="Additional notes for this Panchkarma treatment..."
                                size="sm"
                                rows={2}
                              />
                            </FormControl>
                          </VStack>
                        </CardBody>
                      </Card>
                    ))}

                    {/* Empty state message */}
                    {(!newPatient.panchkarmas || newPatient.panchkarmas.length === 0) && (
                      <Card border="2px dashed" borderColor="purple.300" bg="purple.25">
                        <CardBody textAlign="center" py={8}>
                          <Text color="purple.600" fontWeight="medium">
                            No Panchkarma treatments added yet.
                          </Text>
                          <Text fontSize="sm" color="purple.500" mt={1}>
                            Click "Add Panchkarma" to add a treatment plan.
                          </Text>
                        </CardBody>
                      </Card>
                    )}
                  </VStack>
                </Box>
              </VStack>
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onPrescriptionFormClose}>
            Cancel
          </Button>
          <Button 
            colorScheme="blue" 
            onClick={() => {
              // Save prescription logic here
              toast({
                title: "Prescription Saved",
                description: `Prescription for ${newPatient.patientName} has been saved successfully.`,
                status: "success",
                duration: 3000,
                isClosable: true,
              });
              onPrescriptionFormClose();
            }}
          >
            Save Prescription
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>

    {/* Complaints Modal */}
    <Modal isOpen={isComplaintsOpen} onClose={onComplaintsClose} size="4xl">
      <ModalOverlay />
      <ModalContent maxH="80vh" overflowY="auto">
        <ModalHeader>
          <HStack spacing={3}>
            <IconButton
              icon={<ClipboardList size={24} />}
              variant="ghost"
              colorScheme="purple"
              isDisabled
            />
            <VStack align="start" spacing={0}>
              <Text fontSize="xl" fontWeight="bold" color="purple.600">
                Patient Complaints History
              </Text>
              {selectedComplaintsPatient && (
                <Text fontSize="sm" color="gray.600">
                  {selectedComplaintsPatient.patientName} (Case ID: {selectedComplaintsPatient.caseId})
                </Text>
              )}
            </VStack>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {selectedComplaintsPatient ? (
            <VStack spacing={4} align="stretch">
              {/* Current Appointment Complaints */}
              <Card border="1px solid" borderColor="purple.200" bg="purple.50">
                <CardHeader pb={2}>
                  <HStack justify="space-between">
                    <Text fontWeight="semibold" color="purple.700">
                      Current Appointment ({selectedComplaintsPatient.appointmentDate})
                    </Text>
                    <Badge colorScheme="purple" variant="subtle">Latest</Badge>
                  </HStack>
                </CardHeader>
                <CardBody pt={0}>
                  <VStack spacing={3} align="stretch">
                    {selectedComplaintsPatient.presentComplaints && selectedComplaintsPatient.presentComplaints.length > 0 ? (
                      selectedComplaintsPatient.presentComplaints.map((complaint, index) => (
                        complaint.complaint && complaint.complaint.trim() !== '' && (
                          <HStack key={index} spacing={3} align="start">
                            <Badge colorScheme="blue" variant="outline" fontSize="xs" minW="60px" textAlign="center">
                              {index + 1}
                            </Badge>
                            <Box flex="1">
                              <Text fontWeight="medium" color="gray.800">
                                {complaint.complaint}
                              </Text>
                              {complaint.duration && (
                                <Text fontSize="sm" color="gray.600" mt={1}>
                                  Duration: {complaint.duration}
                                </Text>
                              )}
                            </Box>
                          </HStack>
                        )
                      ))
                    ) : (
                      <Text color="gray.500" textAlign="center" py={4}>
                        No complaints recorded for current appointment
                      </Text>
                    )}
                  </VStack>
                </CardBody>
              </Card>

              {/* Previous Complaints History */}
              <Card border="1px solid" borderColor="gray.200">
                <CardHeader pb={2}>
                  <Text fontWeight="semibold" color="gray.700">
                    Previous Appointments History
                  </Text>
                </CardHeader>
                <CardBody pt={0}>
                  <VStack spacing={4} align="stretch">
                    {/* Real previous appointments should be mapped here from API data */}
                    {selectedComplaintsPatient.previousAppointments && selectedComplaintsPatient.previousAppointments.length > 0 ? (
                      selectedComplaintsPatient.previousAppointments.map((appointment, idx) => (
                        <Box key={idx} p={4} border="1px solid" borderColor="gray.100" borderRadius="md" bg="gray.25">
                          <HStack justify="space-between" mb={2}>
                            <Text fontWeight="medium" color="gray.700">Appointment Date: {appointment.appointmentDate}</Text>
                            <Badge colorScheme="gray" variant="outline">Previous</Badge>
                          </HStack>
                          <VStack spacing={2} align="stretch">
                            {appointment.complaints && appointment.complaints.length > 0 ? (
                              appointment.complaints.map((complaint, cidx) => (
                                <HStack key={cidx} spacing={3} align="start">
                                  <Badge colorScheme="blue" variant="outline" fontSize="xs" minW="60px" textAlign="center">{cidx + 1}</Badge>
                                  <Box flex="1">
                                    <Text fontWeight="medium" color="gray.700">{complaint.complaint}</Text>
                                    {complaint.duration && (
                                      <Text fontSize="sm" color="gray.600">Duration: {complaint.duration}</Text>
                                    )}
                                  </Box>
                                </HStack>
                              ))
                            ) : (
                              <Text color="gray.500" textAlign="center" py={4}>
                                No complaints recorded for this appointment
                              </Text>
                            )}
                          </VStack>
                        </Box>
                      ))
                    ) : (
                      <Text color="gray.500" textAlign="center" py={4} fontStyle="italic">
                        No previous appointment history available
                      </Text>
                    )}
                  </VStack>
                </CardBody>
              </Card>

              {/* Summary */}
              <Card border="1px solid" borderColor="blue.200" bg="blue.50">
                <CardBody>
                  <VStack spacing={2} align="stretch">
                    <Text fontWeight="semibold" color="blue.700">
                      Complaints Summary
                    </Text>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <Box>
                        <Text fontSize="sm" color="blue.600">Total Appointments:</Text>
                        <Text fontWeight="bold" color="blue.800">{selectedComplaintsPatient.totalAppointments || 0}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="blue.600">Most Recent Visit:</Text>
                        <Text fontWeight="bold" color="blue.800">
                          {selectedComplaintsPatient.appointmentDate || 'N/A'}
                        </Text>
                      </Box>
                    </SimpleGrid>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          ) : (
            <Text color="gray.500" textAlign="center" py={8}>
              No patient selected
            </Text>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={onComplaintsClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    
    {/* Prescription Modal */}
    <PrescriptionModal 
      isOpen={isPrescriptionModalOpen} 
      onClose={onPrescriptionModalClose} 
      patient={selectedPrescriptionModalPatient} 
    />
    </>
  );
}

export default function OPD(props) {
  return (
    <ChakraProvider>
      <OPDComponent {...props} />
    </ChakraProvider>
  );
}
