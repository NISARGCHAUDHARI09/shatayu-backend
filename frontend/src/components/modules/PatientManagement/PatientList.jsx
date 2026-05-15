import React, { useState, useContext } from 'react';
import AuthContext from '../../../contexts/AuthContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import axios from 'axios';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Avatar,
  Text,
  Badge,
  Button,
  HStack,
  VStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Card,
  CardBody,
  CardHeader,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Grid,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  SimpleGrid,
  Divider,
  Tooltip,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  useToast,
  Progress,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  List,
  ListItem,
  ListIcon
} from '@chakra-ui/react';
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Edit,
  Eye,
  Trash2,
  UserPlus,
  Users,
  Activity,
  UserCheck,
  UserX,
  Download,
  Calendar,
  Phone,
  MapPin,
  Heart,
  FileText,
  FileSpreadsheet,
  Leaf,
  Flower2,
  TreePine,
  Upload,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/patients` : 'https://shatayu-backend.onrender.com/api/patients';

const PatientList = ({ title = "Patient Management" }) => {
  console.log('PatientList component mounted');

  // Pagination and Search states
  const [patients, setPatients] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // KPI stats from total database (unaffected by search/pagination)
  const [kpiStats, setKpiStats] = useState({
    totalPatients: 0,
    active: 0,
    admitted: 0,
    discharged: 0
  });
  
  // UI states
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isExportOpen, onOpen: onExportOpen, onClose: onExportClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isScheduleOpen, onOpen: onScheduleOpen, onClose: onScheduleClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isFilterOpen, onOpen: onFilterOpen, onClose: onFilterClose } = useDisclosure();

  // Import Patients state
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importStatus, setImportStatus] = useState(''); // 'processing' | 'complete' | 'error' | ''
  const [importStats, setImportStats] = useState({ total: 0, imported: 0, failed: 0, skipped: 0 });
  const [importErrors, setImportErrors] = useState([]);
  const [abortController, setAbortController] = useState(null);
  const fileInputRef = React.useRef();
  const { isOpen: isImportSummaryOpen, onOpen: onImportSummaryOpen, onClose: onImportSummaryClose } = useDisclosure();

  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgGradient = "linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(16, 185, 129, 0.08) 50%, rgba(139, 92, 246, 0.08) 100%)";
  const headerGradient = "linear(135deg, #3B82F6, #10B981, #8B5CF6)";
  const primaryBlue = "#3B82F6";
  const accentTeal = "#10B981";

  // Expected patient field mappings (flexible headers)
  const fieldMappings = {
    patientId: ['patientid', 'patient id', 'id', 'patient_id', 'opd no', 'opd no.', 'opdno', 'opd_no', 'opd number', 'registration no', 'registration number'],
    name: ['name', 'patient name', 'patientname', 'full name', 'fullname'],
    age: ['age'],
    gender: ['gender', 'sex'],
    phone: ['phone', 'phone number', 'phonenumber', 'mobile', 'contact'],
    email: ['email', 'e-mail', 'email address'],
    address: ['address', 'location', 'residence'],
    city: ['city', 'town'],
    state: ['state', 'province'],
    country: ['country', 'nation'],
    postalCode: ['postal code', 'postalcode', 'zip code', 'zipcode', 'zip', 'pincode', 'pin code'],
    constitution: ['constitution', 'prakriti', 'body type'],
    primaryTreatment: ['primary treatment', 'primarytreatment', 'treatment', 'primary_treatment'],
    status: ['status', 'patient status'],
    lastVisit: ['last visit', 'lastvisit', 'last_visit', 'visit date'],
    dateOfBirth: ['date of birth', 'dateofbirth', 'dob', 'birth date'],
    bloodGroup: ['blood group', 'bloodgroup', 'blood type'],
    emergencyContact: ['emergency contact', 'emergencycontact', 'emergency phone'],
    medicalHistory: ['medical history', 'medicalhistory', 'history'],
    allergies: ['allergies', 'allergy'],
    currentMedication: ['current medication', 'currentmedication', 'medications']
  };

  // Map spreadsheet row to patient object
  const mapRowToPatient = (row, headers) => {
    // Initialize patient with default values
    const patient = {
      patientId: '',
      name: '',
      age: '',
      gender: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
      constitution: '',
      primaryTreatment: '',
      status: 'active', // Default status
      lastVisit: new Date().toISOString().split('T')[0], // Today's date
      dateOfBirth: '',
      bloodGroup: '',
      emergencyContact: '',
      medicalHistory: '',
      allergies: '',
      currentMedication: '',
      patientType: 'OPD' // Default type
    };

    const rowLowerKeys = Object.keys(row).reduce((acc, key) => {
      const value = row[key];
      // Clean the value - replace "/" and "-" with empty string if they are standalone
      const cleanedValue = (value && typeof value === 'string') 
        ? (value.trim() === '/' || value.trim() === '-' || value.trim() === 'N/A' ? '' : value.trim())
        : value;
      acc[key.toLowerCase().trim()] = cleanedValue;
      return acc;
    }, {});

    // Map fields from CSV to patient object
    for (const [field, variations] of Object.entries(fieldMappings)) {
      for (const variation of variations) {
        if (rowLowerKeys[variation] !== undefined && rowLowerKeys[variation] !== '') {
          let value = rowLowerKeys[variation];
          
          // Special handling for phone numbers - don't store if it's all zeros
          if (field === 'phone') {
            const phoneStr = value.toString().replace(/\D/g, '');
            if (phoneStr === '' || /^0+$/.test(phoneStr)) {
              // Skip if empty or all zeros
              continue;
            }
          }
          
          // Special handling for age - keep original format (e.g., "5 years", "6 months")
          if (field === 'age') {
            value = value.toString().trim();
          }
          
          // Special handling for gender - normalize to database constraint values
          if (field === 'gender') {
            const genderStr = value.toString().toLowerCase().trim();
            if (genderStr === '' || genderStr === '/' || genderStr === '-' || genderStr === 'n/a') {
              // Skip empty gender - it's optional
              continue;
            } else if (genderStr === 'm' || genderStr === 'male' || genderStr === 'man') {
              value = 'Male';
            } else if (genderStr === 'f' || genderStr === 'female' || genderStr === 'woman') {
              value = 'Female';
            } else if (genderStr === 'o' || genderStr === 'other' || genderStr === 'others' || genderStr === 'transgender' || genderStr === 'non-binary') {
              value = 'Other';
            } else {
              // If unrecognized, skip it (leave empty)
              continue;
            }
          }
          
          patient[field] = value;
          break;
        }
      }
    }

    // Clean up empty fields - replace with meaningful defaults or empty strings
    Object.keys(patient).forEach(key => {
      if (patient[key] === '/' || patient[key] === '-' || patient[key] === 'N/A') {
        patient[key] = '';
      }
      // Don't store phone numbers that are all zeros
      if (key === 'phone' && patient[key]) {
        const phoneStr = patient[key].toString().replace(/\D/g, '');
        if (/^0+$/.test(phoneStr)) {
          patient[key] = '';
        }
      }
    });

    // Generate patientId if not provided
    if (!patient.patientId) {
      patient.patientId = `P${Date.now()}${Math.floor(Math.random() * 1000)}`;
    }

    return patient;
  };

  // Validate required fields
  const validatePatient = (patient, rowIndex) => {
    // Only patientId (OPD No.) and name are required
    const required = ['patientId', 'name'];
    const missing = required.filter(field => !patient[field] || patient[field].toString().trim() === '');
    
    if (missing.length > 0) {
      const fieldNames = missing.map(f => f === 'patientId' ? 'OPD No.' : f);
      return { valid: false, error: `Row ${rowIndex}: Missing required fields: ${fieldNames.join(', ')}` };
    }

    // All other fields are optional - no validation needed
    // Phone, age, gender, etc. can be empty or in any format

    return { valid: true };
  };

  // Retry with exponential backoff (reduced for speed)
  const retryWithBackoff = async (fn, maxRetries = 2, baseDelay = 500) => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (attempt === maxRetries - 1) throw error;
        // Only retry on network errors, not validation errors
        if (error.response?.status >= 400 && error.response?.status < 500) {
          throw error; // Don't retry client errors
        }
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  };

  // Cancel import
  const handleCancelImport = () => {
    if (abortController) {
      abortController.abort();
      setImportStatus('error');
      toast({ title: 'Import cancelled', description: 'The import process was cancelled by user.', status: 'warning', duration: 3000 });
      setImporting(false);
      setImportProgress(0);
    }
  };

  // Handler for file import with all enhancements
  const handleImportPatients = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Reset state
    setImporting(true);
    setImportProgress(0);
    setImportStatus('processing');
    setImportStats({ total: 0, imported: 0, failed: 0, skipped: 0 });
    setImportErrors([]);
    
    const controller = new AbortController();
    setAbortController(controller);

    try {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          let data = evt.target.result;
          let workbook;
          
          if (file.name.endsWith('.csv')) {
            workbook = XLSX.read(data, { type: 'binary', codepage: 65001 });
          } else {
            workbook = XLSX.read(data, { type: 'binary' });
          }
          
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          // Get headers
          const range = XLSX.utils.decode_range(worksheet['!ref']);
          const headers = [];
          for (let col = range.s.c; col <= range.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: range.s.r, c: col });
            const cell = worksheet[cellAddress];
            headers.push(cell ? cell.v : '');
          }

          // Validate headers - patientId (OPD No.) and name are required
          const requiredFields = ['patientId', 'name'];
          const missingHeaders = requiredFields.filter(required => 
            !headers.some(h => fieldMappings[required].includes(h.toLowerCase().trim()))
          );

          if (missingHeaders.length > 0) {
            const fieldNames = missingHeaders.map(f => f === 'patientId' ? 'OPD No.' : 'Patient Name');
            throw new Error(`Missing required columns: ${fieldNames.join(', ')}. Please ensure your file has columns for OPD No. and Patient Name.`);
          }

          // Parse rows
          let json = XLSX.utils.sheet_to_json(worksheet, { defval: '', raw: false, blankrows: false });
          json = json.filter(row => Object.values(row).some(v => v !== '' && v !== null && v !== undefined));

          if (json.length === 0) {
            throw new Error('The file contains no valid data to import.');
          }

          // Map and validate patients
          const patients = [];
          const errors = [];
          let skippedCount = 0;

          console.log(`📋 Processing ${json.length} rows from Excel...`);

          json.forEach((row, index) => {
            const mappedPatient = mapRowToPatient(row, headers);
            const validation = validatePatient(mappedPatient, index + 2); // +2 for header and 0-index
            
            if (validation.valid) {
              patients.push(mappedPatient);
            } else {
              errors.push(validation.error);
              skippedCount++;
              console.log(`⚠️ Skipped row ${index + 2}:`, validation.error);
            }
          });

          // Debug: Log first patient to see structure
          if (patients.length > 0) {
            console.log('✅ Sample mapped patient:', patients[0]);
            console.log(`✅ Total valid patients: ${patients.length}`);
          }

          setImportStats(prev => ({ ...prev, total: json.length, skipped: skippedCount }));

          if (patients.length === 0) {
            console.error('❌ No valid patients found!');
            console.log('Validation errors:', errors);
            throw new Error('No valid patients found after validation. Please check your data.');
          }

          // Optimized chunk upload with parallel processing
          const chunkSize = 50; // Smaller chunks for faster processing
          const parallelChunks = 4; // Process 4 chunks simultaneously for speed
          const token = (user && user.token) || localStorage.getItem('authToken');
          console.log('🔐 Auth token check:', {
            hasUser: !!user,
            hasUserToken: !!(user && user.token),
            hasLocalStorageToken: !!localStorage.getItem('authToken'),
            tokenLength: token ? token.length : 0,
            tokenPreview: token ? `${token.substring(0, 20)}...` : 'NO TOKEN'
          });
          const headers_auth = token ? { Authorization: `Bearer ${token}` } : {};
          console.log('📤 Request headers:', headers_auth);
          console.log(`📊 Uploading ${patients.length} patients in chunks of ${chunkSize} (${Math.ceil(patients.length / chunkSize)} total chunks)`);

          let importedCount = 0;
          const failedRows = [];

          // Process chunks in parallel batches for maximum speed
          const uploadChunk = async (chunk, chunkStart) => {
            if (controller.signal.aborted) {
              throw new Error('Import cancelled by user');
            }

            try {
              await retryWithBackoff(async () => {
                const response = await axios.post(
                  `${API_URL}/import`, 
                  { patients: chunk }, 
                  { 
                    headers: headers_auth,
                    signal: controller.signal,
                    timeout: 60000 // 60 second timeout per chunk
                  }
                );
                return response;
              });

              return { success: true, count: chunk.length };
            } catch (chunkErr) {
              if (chunkErr.name === 'AbortError' || chunkErr.message.includes('cancelled')) {
                throw chunkErr;
              }
              
              console.error('Chunk import failed', chunkErr);
              
              // Track failed rows
              const failedRowNums = [];
              chunk.forEach((_, idx) => {
                const rowNum = chunkStart + idx + 2;
                failedRowNums.push(rowNum);
                errors.push(`Row ${rowNum}: ${chunkErr.response?.data?.message || chunkErr.message || 'Failed to import'}`);
              });
              
              return { success: false, count: 0, failed: chunk.length, rows: failedRowNums };
            }
          };

          // Process in parallel batches
          for (let i = 0; i < patients.length; i += chunkSize * parallelChunks) {
            if (controller.signal.aborted) {
              throw new Error('Import cancelled by user');
            }

            // Create batch of chunks to process in parallel
            const chunkPromises = [];
            for (let j = 0; j < parallelChunks; j++) {
              const chunkIndex = i + (j * chunkSize);
              if (chunkIndex >= patients.length) break;
              
              const chunk = patients.slice(chunkIndex, Math.min(chunkIndex + chunkSize, patients.length));
              chunkPromises.push(uploadChunk(chunk, chunkIndex));
            }

            // Wait for all chunks in this batch to complete
            const results = await Promise.all(chunkPromises);
            
            // Update stats
            results.forEach(result => {
              if (result.success) {
                importedCount += result.count;
              } else {
                failedRows.push(...result.rows);
              }
            });

            setImportStats(prev => ({ 
              ...prev, 
              imported: importedCount,
              failed: failedRows.length
            }));
            
            // Update progress
            const progress = Math.round((importedCount / patients.length) * 100);
            setImportProgress(progress);
          }

          setImportErrors(errors);

          // Refresh patient list if any imported
          if (importedCount > 0) {
            try {
              console.log('🔄 Refreshing patient list...');
              const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString()
              });
              const resp = await axios.get(`${API_URL}?${queryParams}`, { 
                headers: headers_auth,
                timeout: 10000 // 10 second timeout for refresh
              });
              console.log('✅ Patient list refreshed:', resp.data?.data?.length || 0);
              
              // Use proper response structure
              const refreshedData = Array.isArray(resp.data.data) ? resp.data.data : 
                                   Array.isArray(resp.data) ? resp.data : [];
              setPatients(refreshedData);
              setTotal(resp.data.total || refreshedData.length || 0);
            } catch (fetchErr) {
              console.error('❌ Failed to refresh patients after import', fetchErr);
              // Don't update patients list if refresh fails - just show success message
              console.log('⚠️ Import succeeded but list refresh failed. Please refresh manually.');
            }
          }

          // Set completion status
          if (failedRows.length === 0 && skippedCount === 0) {
            setImportStatus('complete');
            toast({ 
              title: 'Import completed successfully', 
              description: `Successfully imported ${importedCount} patients.`, 
              status: 'success', 
              duration: 4000 
            });
          } else {
            setImportStatus('complete');
            // Show summary modal
            onImportSummaryOpen();
          }

        } catch (readErr) {
          console.error('Import processing error', readErr);
          setImportStatus('error');
          setImportErrors([readErr.message || 'Failed to process file']);
          toast({ 
            title: 'Import Failed', 
            description: readErr.message || 'Failed to process file', 
            status: 'error', 
            duration: 6000 
          });
        } finally {
          setImporting(false);
          setAbortController(null);
        }
      };

      reader.onerror = () => {
        setImportStatus('error');
        setImportErrors(['Unable to read the file']);
        toast({ title: 'File Read Error', description: 'Unable to read the file.', status: 'error', duration: 4000 });
        setImporting(false);
      };

      reader.readAsBinaryString(file);
    } catch (err) {
      console.error('Import failed', err);
      setImportStatus('error');
      setImportErrors([err.message]);
      toast({ title: 'Import failed', description: err.message, status: 'error', duration: 5000 });
      setImporting(false);
      setAbortController(null);
    }
    
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const { user } = useContext(AuthContext);
  
  // Fetch KPI stats once on mount (unaffected by search/pagination)
  React.useEffect(() => {
    const fetchKPIStats = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_URL || 'https://shatayu-backend.onrender.com';
        console.log('📊 Fetching KPI stats from:', `${baseURL}/api/patients/stats`);
        
        // Use dedicated stats endpoint for better performance
        // Note: Render free tier has cold starts, first request may take 30-60 seconds
        const response = await axios.get(
          `${baseURL}/api/patients/stats`,
          {
            timeout: 45000 // 45 seconds to handle Render cold starts
          }
        );
        
        console.log('✅ KPI stats received:', response.data);
        
        setKpiStats({
          totalPatients: response.data.totalPatients || 0,
          active: response.data.activePatients || 0,
          admitted: response.data.admittedPatients || 0,
          discharged: response.data.dischargedPatients || 0
        });
      } catch (error) {
        console.error('❌ KPI stats fetch error:', error.response?.status, error.message);
        console.error('Full error:', error);
        if (error.code === 'ECONNABORTED') {
          console.warn('⏱️ Timeout - Backend may be cold starting (Render free tier). Try refreshing in 30 seconds.');
        }
        // Keep default values on error
      }
    };
    
    fetchKPIStats();
  }, []); // Only fetch once on mount
  
  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to page 1 when search changes
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  // Fetch patients with pagination and search
  React.useEffect(() => {
    const controller = new AbortController();
    
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const token = user?.token;
        
        console.log(`📥 Fetching patients - Page: ${page}, Search: "${debouncedSearch}"`);
        
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(debouncedSearch && { search: debouncedSearch })
        });
        
        const response = await axios.get(`${API_URL}?${queryParams}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          signal: controller.signal,
          timeout: 30000 // 30 seconds for Render cold starts
        });
        
        console.log(`✅ Fetched ${response.data.data?.length || 0} patients (Total: ${response.data.total})`);
        
        // Ensure patients is always an array
        const patientsData = Array.isArray(response.data.data) ? response.data.data : 
                            Array.isArray(response.data) ? response.data : [];
        setPatients(patientsData);
        setTotal(response.data.total || patientsData.length || 0);
        setError('');
      } catch (err) {
        // Don't show error if request was cancelled due to cleanup
        if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
          console.log('🔄 Request cancelled (component cleanup or new request)');
          return;
        }
        
        console.error('❌ Failed to fetch patients:', err);
        
        if (err.code === 'ECONNABORTED') {
          setError('Request timeout. Backend is starting up (Render cold start). Please wait 30 seconds and refresh.');
        } else if (err.response?.status === 401) {
          setError('Unauthorized. Please login again.');
        } else if (err.code === 'ERR_NETWORK' || err.message?.includes('Network')) {
          setError('Network error. Check your internet connection.');
        } else {
          setError('Unable to fetch patients. Please try again later.');
        }
        
        setPatients([]); // Always show UI, even if empty
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatients();
    
    // Cleanup function to abort request if component unmounts or dependencies change
    return () => {
      controller.abort();
    };
  }, [page, debouncedSearch, user?.token]);

  // Filter patients for frontend display (status/type filters ONLY)
  // NOTE: Search is handled by backend, NOT here
  const filteredPatients = Array.isArray(patients) ? patients.filter(patient => {
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
    const matchesType = typeFilter === 'all' || patient.patientType?.toLowerCase() === typeFilter;
    
    return matchesStatus && matchesType;
  }).sort((a, b) => {
    // Sort by OPD No. (patient_id) in ascending order
    const opdA = (a.patient_id || a.patientId || '').toString().toLowerCase();
    const opdB = (b.patient_id || b.patientId || '').toString().toLowerCase();
    return opdA.localeCompare(opdB, undefined, { numeric: true, sensitivity: 'base' });
  }) : [];

  // Pagination helpers
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    onViewOpen();
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setEditFormData({
      name: patient.name || '',
      age: patient.age || '',
      gender: patient.gender || '',
      constitution: patient.constitution || '',
      phone: patient.phone || '',
      email: patient.email || '',
      patientType: patient.patientType || patient.patient_type || '',
      status: patient.status || '',
      address: patient.address || ''
    });
    onEditOpen();
  };

  const handleUpdatePatient = async () => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${API_URL}/${selectedPatient.id}`,
        editFormData,
        {
          timeout: 8000
        }
      );
      
      // Update patient in local state
      setPatients(prev => prev.map(p => 
        p.id === selectedPatient.id ? { ...p, ...editFormData } : p
      ));
      
      toast({
        title: 'Patient updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true
      });
      
      onEditClose();
      setSelectedPatient(null);
    } catch (err) {
      console.error('Update patient error:', err);
      toast({
        title: 'Failed to update patient',
        description: err.response?.data?.error || err.message,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleAppointment = (patient) => {
    setSelectedPatient(patient);
    onScheduleOpen();
  };

  const handleDeletePatient = (patient) => {
    setSelectedPatient(patient);
    onDeleteOpen();
  };

  const confirmDeletePatient = async () => {
    try {
      await axios.delete(`${API_URL}/${selectedPatient.id}`);
      setPatients(prev => prev.filter(p => p.id !== selectedPatient.id));
      toast({ title: 'Patient deleted successfully', status: 'success' });
    } catch (err) {
      toast({ title: 'Failed to delete patient', status: 'error' });
    }
    onDeleteClose();
    setSelectedPatient(null);
  };

  const generateAvatar = (name) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4338CA&color=fff&size=40`;
  };

  const handleExport = (format) => {
    console.log('Export function called with format:', format);
    console.log('Filtered patients:', filteredPatients);
    
    const headers = ['Patient ID', 'Name', 'Age', 'Gender', 'Phone', 'Email', 'Address', 'Constitution', 'Primary Treatment', 'Status', 'Last Visit'];
    const currentDate = new Date().toISOString().split('T')[0];
    
    if (format === 'csv') {
      const csvContent = [
        headers.join(','),
        ...filteredPatients.map(patient => [
          patient.patientId,
          `"${patient.name}"`,
          patient.age,
          patient.gender,
          patient.phone,
          `"${patient.email}"`,
          `"${patient.address}"`,
          patient.constitution,
          `"${patient.primaryTreatment}"`,
          patient.status,
          patient.lastVisit
        ].join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ayurvedic_patients_${currentDate}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
    } else if (format === 'pdf') {
      try {
        console.log('Starting PDF generation...');
        const doc = new jsPDF('l', 'mm', 'a4'); // landscape orientation
        
        // Add title
        doc.setFontSize(18);
        doc.setTextColor(59, 130, 246); // Blue color
        doc.text('Ayurvedic Hospital - Patient Records', 20, 20);
        
        // Add subtitle
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
        doc.text(`Total Patients: ${filteredPatients.length}`, 20, 38);
        
        // Check if jsPDF autotable is available
        if (doc.autoTable) {
          console.log('Using autoTable for PDF generation');
          
          // Prepare table data
          const tableData = filteredPatients.map(patient => [
            patient.patientId || 'N/A',
            patient.name || 'N/A',
            patient.age?.toString() || 'N/A',
            patient.gender || 'N/A',
            patient.phone || 'N/A',
            patient.constitution || 'N/A',
            patient.primaryTreatment || 'N/A',
            patient.status || 'N/A',
            patient.lastVisit || 'N/A'
          ]);
          
          // Add table with simpler configuration
          doc.autoTable({
            head: [['ID', 'Name', 'Age', 'Gender', 'Phone', 'Constitution', 'Treatment', 'Status', 'Last Visit']],
            body: tableData,
            startY: 50,
            theme: 'striped',
            headStyles: {
              fillColor: [59, 130, 246],
              textColor: [255, 255, 255],
              fontStyle: 'bold',
              fontSize: 10
            },
            bodyStyles: {
              fontSize: 8
            },
            margin: { top: 50 },
            styles: {
              cellPadding: 2,
              fontSize: 8
            }
          });
        } else {
          console.log('autoTable not available, using simple text output');
          // Fallback: Simple text output
          let yPosition = 50;
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          
          // Add headers
          doc.text('ID', 20, yPosition);
          doc.text('Name', 50, yPosition);
          doc.text('Age', 100, yPosition);
          doc.text('Gender', 120, yPosition);
          doc.text('Phone', 150, yPosition);
          doc.text('Status', 200, yPosition);
          
          yPosition += 10;
          
          // Add patient data
          filteredPatients.forEach((patient, index) => {
            if (yPosition > 180) { // New page if needed
              doc.addPage();
              yPosition = 20;
            }
            
            doc.text(patient.patientId || 'N/A', 20, yPosition);
            doc.text(patient.name || 'N/A', 50, yPosition);
            doc.text(patient.age?.toString() || 'N/A', 100, yPosition);
            doc.text(patient.gender || 'N/A', 120, yPosition);
            doc.text(patient.phone || 'N/A', 150, yPosition);
            doc.text(patient.status || 'N/A', 200, yPosition);
            
            yPosition += 8;
          });
        }
        
        // Save the PDF
        doc.save(`ayurvedic_patients_${currentDate}.pdf`);
        console.log('PDF generated successfully');
        
      } catch (error) {
        console.error('PDF generation error:', error);
        alert('Error generating PDF: ' + error.message);
      }
      
    } else if (format === 'excel') {
      // Prepare data for Excel
      const excelData = [
        headers,
        ...filteredPatients.map(patient => [
          patient.patientId,
          patient.name,
          patient.age,
          patient.gender,
          patient.phone,
          patient.email,
          patient.address,
          patient.constitution,
          patient.primaryTreatment,
          patient.status,
          patient.lastVisit
        ])
      ];
      
      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(excelData);
      
      // Set column widths
      const colWidths = [
        { wch: 12 }, // Patient ID
        { wch: 20 }, // Name
        { wch: 8 },  // Age
        { wch: 10 }, // Gender
        { wch: 15 }, // Phone
        { wch: 25 }, // Email
        { wch: 30 }, // Address
        { wch: 15 }, // Constitution
        { wch: 20 }, // Primary Treatment
        { wch: 12 }, // Status
        { wch: 12 }  // Last Visit
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
      XLSX.utils.book_append_sheet(wb, ws, "Patient Records");
      
      // Add metadata sheet
      const metaData = [
        ['Report Information'],
        ['Generated Date', new Date().toLocaleDateString()],
        ['Generated Time', new Date().toLocaleTimeString()],
        ['Total Patients', filteredPatients.length],
        ['Hospital', 'Ayurvedic Hospital Management System'],
        [''],
        ['Statistics'],
        ['Active Patients', filteredPatients.filter(p => p.status === 'active').length],
        ['Admitted Patients', filteredPatients.filter(p => p.status === 'admitted').length],
        ['Discharged Patients', filteredPatients.filter(p => p.status === 'discharged').length]
      ];
      
      const metaWs = XLSX.utils.aoa_to_sheet(metaData);
      metaWs['!cols'] = [{ wch: 20 }, { wch: 30 }];
      XLSX.utils.book_append_sheet(wb, metaWs, "Report Info");
      
      // Save file
      XLSX.writeFile(wb, `ayurvedic_patients_${currentDate}.xlsx`);
    }
    
    onExportClose();
  };

  return (
    <Box 
      minH="100vh" 
      bg="gray.50"
      bgImage={`url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233B82F6' fill-opacity='0.04'%3E%3Cpath d='M30 30c0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12 12-5.373 12-12zm12 0c0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12 12-5.373 12-12z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"), ${bgGradient}`}
      p={6}
    >
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Card 
          bg={cardBg} 
          border="1px" 
          borderColor="blue.200"
          boxShadow="xl"
          borderRadius="xl"
          overflow="hidden"
          position="relative"
        >
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            height="4px"
            bgGradient={headerGradient}
          />
          <CardHeader pb={4} bg="blue.50">
            <Flex justifyContent="space-between" alignItems="center">
              <VStack align="start" spacing={1}>
                <Heading size="lg" color="blue.700" display="flex" alignItems="center" gap={2}>
                  <Box p={2} bg="blue.100" borderRadius="lg">
                    <Leaf size={28} color={primaryBlue} />
                  </Box>
                  {title}
                </Heading>
                <Text color="blue.600" fontSize="sm" fontWeight="medium">
                  Manage Ayurvedic patient records and constitutional assessments
                </Text>
              </VStack>
              <HStack spacing={3}>
                <Button
                  leftIcon={<Download size={18} />}
                  colorScheme="teal"
                  variant="solid"
                  borderRadius="lg"
                  size="md"
                  isLoading={importing}
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                >
                  Import Patients
                </Button>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                  onChange={handleImportPatients}
                />
                <Button
                  leftIcon={<Upload size={18} />}
                  colorScheme="blue"
                  variant="outline"
                  borderRadius="lg"
                  size="md"
                  onClick={onExportOpen}
                >
                  Export
                </Button>
              </HStack>
            </Flex>

            {/* Import Progress Bar */}
            {importing && (
              <Box mt={4} p={4} bg="blue.50" borderRadius="lg" border="1px" borderColor="blue.200">
                <Flex justifyContent="space-between" alignItems="center" mb={2}>
                  <Text fontSize="sm" fontWeight="semibold" color="blue.700">
                    Importing patients...
                  </Text>
                  <HStack>
                    <Text fontSize="sm" color="blue.600">
                      {importStats.imported} / {importStats.total}
                    </Text>
                    <IconButton
                      icon={<X size={16} />}
                      size="xs"
                      colorScheme="red"
                      variant="ghost"
                      onClick={handleCancelImport}
                      aria-label="Cancel import"
                    />
                  </HStack>
                </Flex>
                <Progress 
                  value={importProgress} 
                  size="sm" 
                  colorScheme="blue" 
                  borderRadius="full"
                  hasStripe
                  isAnimated
                />
                <Text fontSize="xs" color="gray.600" mt={2}>
                  {importProgress}% complete
                </Text>
              </Box>
            )}
          </CardHeader>
        </Card>

        {/* Statistics Cards */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <Card 
            bg="white" 
            borderRadius="xl" 
            boxShadow="lg"
            border="1px solid"
            borderColor="blue.100"
            overflow="hidden"
            position="relative"
            _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
            transition="all 0.3s"
          >
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              height="4px"
              bgGradient="linear(90deg, blue.400, blue.500, blue.600)"
            />
            <CardBody>
              <Stat>
                <Flex justifyContent="space-between" alignItems="start">
                  <Box>
                    <StatLabel color="gray.600" fontSize="sm" fontWeight="medium">Total Patients</StatLabel>
                    <StatNumber fontSize="2xl" fontWeight="bold" color="blue.600">{kpiStats.totalPatients.toLocaleString()}</StatNumber>
                    <StatHelpText color="blue.500" fontSize="xs">
                      Database records
                    </StatHelpText>
                  </Box>
                  <Box bg="blue.50" p={3} borderRadius="lg" border="1px" borderColor="blue.100">
                    <Users size={24} color="#3B82F6" />
                  </Box>
                </Flex>
              </Stat>
            </CardBody>
          </Card>

          <Card 
            bg="white" 
            borderRadius="xl" 
            boxShadow="lg"
            border="1px solid"
            borderColor="teal.100"
            overflow="hidden"
            position="relative"
            _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
            transition="all 0.3s"
          >
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              height="4px"
              bgGradient="linear(90deg, teal.400, teal.500, teal.600)"
            />
            <CardBody>
              <Stat>
                <Flex justifyContent="space-between" alignItems="start">
                  <Box>
                    <StatLabel color="gray.600" fontSize="sm" fontWeight="medium">Active Patients</StatLabel>
                    <StatNumber fontSize="2xl" fontWeight="bold" color="teal.600">{kpiStats.active}</StatNumber>
                    <StatHelpText color="teal.500" fontSize="xs">
                      <StatArrow type="increase" />
                      8% from last week
                    </StatHelpText>
                  </Box>
                  <Box bg="teal.50" p={3} borderRadius="lg" border="1px" borderColor="teal.100">
                    <UserCheck size={24} color="#10B981" />
                  </Box>
                </Flex>
              </Stat>
            </CardBody>
          </Card>

          <Card 
            bg="white" 
            borderRadius="xl" 
            boxShadow="lg"
            border="1px solid"
            borderColor="purple.100"
            overflow="hidden"
            position="relative"
            _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
            transition="all 0.3s"
          >
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              height="4px"
              bgGradient="linear(90deg, purple.400, purple.500, purple.600)"
            />
            <CardBody>
              <Stat>
                <Flex justifyContent="space-between" alignItems="start">
                  <Box>
                    <StatLabel color="gray.600" fontSize="sm" fontWeight="medium">Undergoing Treatment</StatLabel>
                    <StatNumber fontSize="2xl" fontWeight="bold" color="purple.600">{kpiStats.admitted}</StatNumber>
                    <StatHelpText color="purple.500" fontSize="xs">
                      <TreePine size={12} />
                      Ayurvedic Therapies
                    </StatHelpText>
                  </Box>
                  <Box bg="purple.50" p={3} borderRadius="lg" border="1px" borderColor="purple.100">
                    <Activity size={24} color="#8B5CF6" />
                  </Box>
                </Flex>
              </Stat>
            </CardBody>
          </Card>

          <Card 
            bg="white" 
            borderRadius="xl" 
            boxShadow="lg"
            border="1px solid"
            borderColor="gray.100"
            overflow="hidden"
            position="relative"
            _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
            transition="all 0.3s"
          >
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              height="4px"
              bgGradient="linear(90deg, gray.400, gray.500, gray.600)"
            />
            <CardBody>
              <Stat>
                <Flex justifyContent="space-between" alignItems="start">
                  <Box>
                    <StatLabel color="gray.600" fontSize="sm" fontWeight="medium">Treatment Complete</StatLabel>
                    <StatNumber fontSize="2xl" fontWeight="bold" color="gray.600">{kpiStats.discharged}</StatNumber>
                    <StatHelpText color="gray.500" fontSize="xs">
                      <UserX size={12} />
                      This month
                    </StatHelpText>
                  </Box>
                  <Box bg="gray.50" p={3} borderRadius="lg" border="1px" borderColor="gray.100">
                    <UserX size={24} color="#6B7280" />
                  </Box>
                </Flex>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Search and Filters */}
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
            bgGradient="linear(90deg, blue.300, teal.400, purple.500)"
          />
          <CardBody bg="blue.25">
            <Grid templateColumns={{ base: "1fr", md: "2fr 1fr 1fr" }} gap={6}>
              <InputGroup size="md">
                <InputLeftElement>
                  <Search color="#3B82F6" size={18} />
                </InputLeftElement>
                <Input
                  placeholder="Search by name, ID, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  borderRadius="lg"
                  borderColor="blue.200"
                  bg="white"
                  _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px #3B82F6' }}
                  _hover={{ borderColor: 'blue.300' }}
                />
              </InputGroup>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                borderRadius="lg"
                borderColor="blue.200"
                bg="white"
                _focus={{ borderColor: 'blue.400' }}
                _hover={{ borderColor: 'blue.300' }}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="discharged">Discharged</option>
                <option value="admitted">Admitted</option>
              </Select>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                borderRadius="lg"
                borderColor="blue.200"
                bg="white"
                _focus={{ borderColor: 'blue.400' }}
                _hover={{ borderColor: 'blue.300' }}
              >
                <option value="all">All Types</option>
                <option value="opd">OPD</option>
                <option value="ipd">IPD</option>
              </Select>
            </Grid>
          </CardBody>
        </Card>

        {/* Patient Table */}
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
              <Heading size="md" color="blue.700">
                Patient Records ({filteredPatients.length} on this page)
              </Heading>
              <Text fontSize="sm" color="blue.600" fontWeight="medium">
                Total: {total.toLocaleString()} patients | Page {page} of {totalPages}
              </Text>
            </Flex>
            <Divider borderColor="blue.200" />
          </CardHeader>
          <CardBody p={0}>
            <TableContainer maxHeight="500px" overflowY="auto" position="relative">
              <Table variant="simple" size="md">
                <Thead bg="blue.50" position="sticky" top={0} zIndex={1}>
                  <Tr>
                    <Th borderColor="blue.200" color="blue.700" fontWeight="semibold">OPD No.</Th>
                    <Th borderColor="blue.200" color="blue.700" fontWeight="semibold">Patient</Th>
                    <Th borderColor="blue.200" color="blue.700" fontWeight="semibold">Contact</Th>
                    <Th borderColor="blue.200" color="blue.700" fontWeight="semibold">Address</Th>
                    <Th borderColor="blue.200" color="blue.700" fontWeight="semibold">City / Postal Code</Th>
                    <Th borderColor="blue.200" color="blue.700" fontWeight="semibold">Country</Th>
                    <Th borderColor="blue.200" color="blue.700" fontWeight="semibold">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredPatients.map((patient, index) => (
                    <Tr 
                      key={patient.id}
                      _hover={{ bg: 'blue.25' }}
                      borderBottom="1px"
                      borderColor="blue.100"
                    >
                      <Td>
                        <Text fontSize="sm" fontWeight="medium" color="blue.600">
                          {patient.patient_id || patient.patientId || patient.opd_no || patient.opdNo || 'N/A'}
                        </Text>
                      </Td>
                      <Td py={4}>
                        <HStack spacing={3}>
                          <Avatar 
                            size="md" 
                            name={patient.name}
                            src={generateAvatar(patient.name)}
                            bg="blue.500"
                          />
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="semibold" color="gray.700">
                              {patient.name}
                            </Text>
                            <Text fontSize="sm" color="blue.600" fontWeight="medium">
                              {patient.patient_id || patient.patientId}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              {patient.age} years • {patient.gender}
                            </Text>
                          </VStack>
                        </HStack>
                      </Td>
                      <Td>
                        <VStack align="start" spacing={1}>
                          <HStack spacing={1}>
                            <Phone size={14} color="#6B7280" />
                            <Text fontSize="sm" color="gray.600">
                              {patient.phone}
                            </Text>
                          </HStack>
                          <Text fontSize="xs" color="gray.500">
                            {patient.email}
                          </Text>
                        </VStack>
                      </Td>
                      <Td>
                        <Text fontSize="sm" color="gray.600" isTruncated maxW="150px">
                          {patient.address}
                        </Text>
                      </Td>
                      <Td>
                        <Text fontSize="sm" color="gray.600">
                          {patient.city}{patient.postalCode ? `, ${patient.postalCode}` : ''}
                        </Text>
                      </Td>
                      <Td>
                        <Text fontSize="sm" color="gray.600">
                          {patient.country}
                        </Text>
                      </Td>
                      <Td>
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            aria-label="Patient Actions"
                            icon={<MoreVertical />}
                            variant="ghost"
                            size="sm"
                            colorScheme="blue"
                            borderRadius="lg"
                            _hover={{ bg: 'blue.100' }}
                          />
                          <MenuList borderRadius="lg" boxShadow="xl" border="1px" borderColor="blue.200">
                            <MenuItem 
                              icon={<Eye />} 
                              onClick={() => handleViewPatient(patient)}
                              _hover={{ bg: 'blue.50' }}
                            >
                              View Details
                            </MenuItem>
                            <MenuItem 
                              icon={<Edit />}
                              onClick={() => handleEditPatient(patient)}
                              _hover={{ bg: 'green.50' }}
                            >
                              Edit Patient
                            </MenuItem>
                            <MenuItem 
                              icon={<Calendar />}
                              onClick={() => handleScheduleAppointment(patient)}
                              _hover={{ bg: 'purple.50' }}
                            >
                              Schedule Appointment
                            </MenuItem>
                            <Divider />
                            <MenuItem 
                              icon={<Trash2 />} 
                              color="red.500"
                              onClick={() => handleDeletePatient(patient)}
                              _hover={{ bg: 'red.50' }}
                            >
                              Delete Patient
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>

            {/* Pagination Controls */}
            {filteredPatients.length > 0 && (
              <Flex justify="space-between" align="center" p={4} borderTop="1px" borderColor={borderColor} bg="white" position="sticky" bottom={0} zIndex={1}>
                <Button
                  onClick={() => setPage(page - 1)}
                  isDisabled={!hasPrevPage || loading}
                  size="sm"
                  variant="outline"
                >
                  ← Previous
                </Button>
                
                <HStack spacing={2}>
                  <Text fontSize="sm" color="gray.600">
                    Page
                  </Text>
                  <Input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={page}
                    onChange={(e) => {
                      const newPage = parseInt(e.target.value);
                      if (newPage >= 1 && newPage <= totalPages) {
                        setPage(newPage);
                      }
                    }}
                    width="70px"
                    size="sm"
                    textAlign="center"
                  />
                  <Text fontSize="sm" color="gray.600">
                    of {totalPages}
                  </Text>
                  <Text fontSize="sm" color="gray.400" ml={2}>
                    ({total.toLocaleString()} total)
                  </Text>
                </HStack>
                
                <Button
                  onClick={() => setPage(page + 1)}
                  isDisabled={!hasNextPage || loading}
                  size="sm"
                  variant="outline"
                >
                  Next →
                </Button>
              </Flex>
            )}

            {filteredPatients.length === 0 && (
              <Box textAlign="center" py={20}>
                <VStack spacing={4}>
                  <Users size={48} color="#CBD5E0" />
                  <VStack spacing={2}>
                    <Text fontSize="lg" fontWeight="semibold" color="gray.500">
                      No patients found
                    </Text>
                    <Text fontSize="sm" color="gray.400">
                      Try adjusting your search criteria.
                    </Text>
                  </VStack>
                </VStack>
              </Box>
            )}
          </CardBody>
        </Card>

        {/* Patient Details Modal */}
        {selectedPatient && (
          <Modal isOpen={isViewOpen} onClose={onViewClose} size="xl">
            <ModalOverlay backdropFilter="blur(4px)" />
            <ModalContent borderRadius="xl" boxShadow="2xl">
              <ModalHeader bg="blue.500" color="white" borderTopRadius="xl">
                <HStack spacing={3}>
                  <Avatar 
                    size="md" 
                    name={selectedPatient.name}
                    src={generateAvatar(selectedPatient.name)}
                  />
                  <VStack align="start" spacing={0}>
                    <Text fontSize="lg" fontWeight="bold">
                      {selectedPatient.name}
                    </Text>
                    <Text fontSize="sm" opacity={0.9}>
                      Patient ID: {selectedPatient.patientId}
                    </Text>
                  </VStack>
                </HStack>
              </ModalHeader>
              <ModalCloseButton color="white" />
              <ModalBody p={6}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <VStack align="start" spacing={4}>
                    <Box>
                      <Text fontSize="sm" fontWeight="semibold" color="gray.500" mb={1}>
                        PERSONAL INFORMATION
                      </Text>
                      <VStack align="start" spacing={2}>
                        <Text><strong>Age:</strong> {selectedPatient.age} years</Text>
                        <Text><strong>Gender:</strong> {selectedPatient.gender}</Text>
                        <Text><strong>Constitution:</strong> {selectedPatient.constitution}</Text>
                      </VStack>
                    </Box>
                    <Box>
                      <Text fontSize="sm" fontWeight="semibold" color="gray.500" mb={1}>
                        CONTACT DETAILS
                      </Text>
                      <VStack align="start" spacing={2}>
                        <Text><strong>Phone:</strong> {selectedPatient.phone}</Text>
                        <Text><strong>Email:</strong> {selectedPatient.email}</Text>
                        <Text><strong>Emergency:</strong> {selectedPatient.emergencyContact}</Text>
                        <Text><strong>Address:</strong> {selectedPatient.address}</Text>
                      </VStack>
                    </Box>
                  </VStack>
                  <VStack align="start" spacing={4}>
                    <Box>
                      <Text fontSize="sm" fontWeight="semibold" color="gray.500" mb={1}>
                        AYURVEDIC INFORMATION
                      </Text>
                      <VStack align="start" spacing={2}>
                        <Text><strong>Constitution (Prakriti):</strong> {selectedPatient.constitution}</Text>
                        <Text><strong>Primary Treatment:</strong> {selectedPatient.primaryTreatment}</Text>
                        <Text><strong>Patient Type:</strong> {selectedPatient.patientType}</Text>
                        <Text><strong>Status:</strong> 
                          <Badge ml={2} colorScheme={
                            selectedPatient.status === 'active' ? 'green' : 
                            selectedPatient.status === 'admitted' ? 'blue' : 'gray'
                          }>
                            {selectedPatient.status}
                          </Badge>
                        </Text>
                      </VStack>
                    </Box>
                    <Box>
                      <Text fontSize="sm" fontWeight="semibold" color="gray.500" mb={1}>
                        VISIT INFORMATION
                      </Text>
                      <VStack align="start" spacing={2}>
                        <Text><strong>Last Visit:</strong> {selectedPatient.lastVisit}</Text>
                        <Text><strong>Next Appointment:</strong> {selectedPatient.nextAppointment || 'Not scheduled'}</Text>
                      </VStack>
                    </Box>
                  </VStack>
                </SimpleGrid>
              </ModalBody>
              <ModalFooter>
                <HStack spacing={3}>
                  <Button variant="outline" onClick={onViewClose}>
                    Close
                  </Button>
                  <Button colorScheme="blue" leftIcon={<Edit />}>
                    Edit Patient
                  </Button>
                </HStack>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}

        {/* Add Patient Modal */}
        <Modal isOpen={isAddOpen} onClose={onAddClose} size="xl">
          <ModalOverlay backdropFilter="blur(4px)" />
          <ModalContent borderRadius="xl" boxShadow="2xl">
            <ModalHeader bg="blue.500" color="white" borderTopRadius="xl">
              <HStack spacing={3}>
                <UserPlus size={24} />
                <Text fontSize="lg" fontWeight="bold">
                  Add New Patient
                </Text>
              </HStack>
            </ModalHeader>
            <ModalCloseButton color="white" />
            <ModalBody p={6}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Full Name</FormLabel>
                  <Input placeholder="Enter patient name" borderRadius="lg" />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Age</FormLabel>
                  <Input type="number" placeholder="Enter age" borderRadius="lg" />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Gender</FormLabel>
                  <Select placeholder="Select gender" borderRadius="lg">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Constitution (Prakriti)</FormLabel>
                  <Select placeholder="Select constitution" borderRadius="lg">
                    <option value="Vata">Vata</option>
                    <option value="Pitta">Pitta</option>
                    <option value="Kapha">Kapha</option>
                    <option value="Vata-Pitta">Vata-Pitta</option>
                    <option value="Vata-Kapha">Vata-Kapha</option>
                    <option value="Pitta-Kapha">Pitta-Kapha</option>
                    <option value="Tridosha">Tridosha</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Primary Treatment</FormLabel>
                  <Select placeholder="Select treatment" borderRadius="lg">
                    <option value="Panchakarma">Panchakarma</option>
                    <option value="Abhyanga">Abhyanga</option>
                    <option value="Shirodhara">Shirodhara</option>
                    <option value="Herbal Medicine">Herbal Medicine</option>
                    <option value="Nasya Therapy">Nasya Therapy</option>
                    <option value="Udvartana">Udvartana</option>
                    <option value="Rasayana Therapy">Rasayana Therapy</option>
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Phone Number</FormLabel>
                  <Input placeholder="Enter phone number" borderRadius="lg" />
                </FormControl>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input type="email" placeholder="Enter email address" borderRadius="lg" />
                </FormControl>
                <FormControl>
                  <FormLabel>Emergency Contact</FormLabel>
                  <Input placeholder="Enter emergency contact" borderRadius="lg" />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Patient Type</FormLabel>
                  <Select placeholder="Select patient type" borderRadius="lg">
                    <option value="OPD">OPD</option>
                    <option value="IPD">IPD</option>
                  </Select>
                </FormControl>
              </SimpleGrid>
              <FormControl mt={4}>
                <FormLabel>Address</FormLabel>
                <Textarea placeholder="Enter complete address" borderRadius="lg" />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <HStack spacing={3}>
                <Button variant="outline" onClick={onAddClose}>
                  Cancel
                </Button>
                <Button colorScheme="blue" leftIcon={<UserPlus />}>
                  Add Patient
                </Button>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Edit Patient Modal */}
        {selectedPatient && (
          <Modal isOpen={isEditOpen} onClose={onEditClose} size="xl">
            <ModalOverlay backdropFilter="blur(4px)" />
            <ModalContent borderRadius="xl" boxShadow="2xl">
              <ModalHeader bg="teal.500" color="white" borderTopRadius="xl">
                <HStack spacing={3}>
                  <Edit size={24} />
                  <Text fontSize="lg" fontWeight="bold">
                    Edit Patient - {selectedPatient.name}
                  </Text>
                </HStack>
              </ModalHeader>
              <ModalCloseButton color="white" />
              <ModalBody p={6}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Full Name</FormLabel>
                    <Input 
                      value={editFormData.name} 
                      onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                      borderRadius="lg" 
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Age</FormLabel>
                    <Input 
                      type="number" 
                      value={editFormData.age} 
                      onChange={(e) => setEditFormData({...editFormData, age: e.target.value})}
                      borderRadius="lg" 
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Gender</FormLabel>
                    <Select 
                      value={editFormData.gender || ''} 
                      onChange={(e) => setEditFormData({...editFormData, gender: e.target.value})}
                      borderRadius="lg"
                      placeholder="Select gender"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Select>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Constitution (Prakriti)</FormLabel>
                    <Select 
                      value={editFormData.constitution || ''} 
                      onChange={(e) => setEditFormData({...editFormData, constitution: e.target.value})}
                      borderRadius="lg"
                      placeholder="Select constitution"
                    >
                      <option value="Vata">Vata</option>
                      <option value="Pitta">Pitta</option>
                      <option value="Kapha">Kapha</option>
                      <option value="Vata-Pitta">Vata-Pitta</option>
                      <option value="Vata-Kapha">Vata-Kapha</option>
                      <option value="Pitta-Kapha">Pitta-Kapha</option>
                      <option value="Tridosha">Tridosha</option>
                    </Select>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Phone Number</FormLabel>
                    <Input 
                      value={editFormData.phone} 
                      onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                      borderRadius="lg" 
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input 
                      type="email" 
                      value={editFormData.email} 
                      onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                      borderRadius="lg" 
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Patient Type</FormLabel>
                    <Select 
                      value={editFormData.patientType || ''} 
                      onChange={(e) => setEditFormData({...editFormData, patientType: e.target.value})}
                      borderRadius="lg"
                      placeholder="Select patient type"
                    >
                      <option value="OPD">OPD</option>
                      <option value="IPD">IPD</option>
                    </Select>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      value={editFormData.status || ''} 
                      onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                      borderRadius="lg"
                      placeholder="Select status"
                    >
                      <option value="active">Active</option>
                      <option value="admitted">Admitted</option>
                      <option value="discharged">Discharged</option>
                    </Select>
                  </FormControl>
                </SimpleGrid>
                <FormControl mt={4}>
                  <FormLabel>Address</FormLabel>
                  <Textarea 
                    value={editFormData.address} 
                    onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
                    borderRadius="lg" 
                  />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <HStack spacing={3}>
                  <Button variant="outline" onClick={onEditClose}>
                    Cancel
                  </Button>
                  <Button 
                    colorScheme="teal" 
                    leftIcon={<Edit />}
                    onClick={handleUpdatePatient}
                    isLoading={loading}
                  >
                    Update Patient
                  </Button>
                </HStack>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}

        {/* Schedule Appointment Modal */}
        {selectedPatient && (
          <Modal isOpen={isScheduleOpen} onClose={onScheduleClose} size="lg">
            <ModalOverlay backdropFilter="blur(4px)" />
            <ModalContent borderRadius="xl" boxShadow="2xl">
              <ModalHeader bg="purple.500" color="white" borderTopRadius="xl">
                <HStack spacing={3}>
                  <Calendar size={24} />
                  <Text fontSize="lg" fontWeight="bold">
                    Schedule Appointment - {selectedPatient.name}
                  </Text>
                </HStack>
              </ModalHeader>
              <ModalCloseButton color="white" />
              <ModalBody p={6}>
                <VStack spacing={4} align="stretch">
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Appointment Date</FormLabel>
                      <Input type="date" borderRadius="lg" />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Appointment Time</FormLabel>
                      <Input type="time" borderRadius="lg" />
                    </FormControl>
                  </SimpleGrid>
                  
                  <FormControl isRequired>
                    <FormLabel>Treatment Type</FormLabel>
                    <Select placeholder="Select treatment type" borderRadius="lg">
                      <option value="Consultation">General Consultation</option>
                      <option value="Panchakarma">Panchakarma Session</option>
                      <option value="Abhyanga">Abhyanga Therapy</option>
                      <option value="Shirodhara">Shirodhara Treatment</option>
                      <option value="Herbal Medicine">Herbal Medicine Consultation</option>
                      <option value="Nasya Therapy">Nasya Therapy</option>
                      <option value="Follow-up">Follow-up Visit</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Assigned Practitioner</FormLabel>
                    <Select placeholder="Select practitioner" borderRadius="lg">
                      <option value="Dr. Sharma">Dr. Rajesh Sharma</option>
                      <option value="Dr. Patel">Dr. Priya Patel</option>
                      <option value="Dr. Gupta">Dr. Amit Gupta</option>
                      <option value="Dr. Nair">Dr. Meera Nair</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Special Instructions</FormLabel>
                    <Textarea 
                      placeholder="Any special instructions or notes for the appointment..."
                      borderRadius="lg"
                      rows={3}
                    />
                  </FormControl>

                  <Box p={4} bg="blue.50" borderRadius="lg" border="1px" borderColor="blue.100">
                    <Text fontSize="sm" color="blue.700" fontWeight="semibold" mb={2}>
                      Patient Information:
                    </Text>
                    <VStack align="start" spacing={1}>
                      <Text fontSize="sm"><strong>Constitution:</strong> {selectedPatient.constitution}</Text>
                      <Text fontSize="sm"><strong>Current Treatment:</strong> {selectedPatient.primaryTreatment}</Text>
                      <Text fontSize="sm"><strong>Last Visit:</strong> {selectedPatient.lastVisit}</Text>
                    </VStack>
                  </Box>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <HStack spacing={3}>
                  <Button variant="outline" onClick={onScheduleClose}>
                    Cancel
                  </Button>
                  <Button colorScheme="blue" leftIcon={<Calendar />}>
                    Schedule Appointment
                  </Button>
                </HStack>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}

        {/* Delete Confirmation Modal */}
        {selectedPatient && (
          <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} size="md">
            <ModalOverlay backdropFilter="blur(4px)" />
            <ModalContent borderRadius="xl" boxShadow="2xl">
              <ModalHeader bg="red.500" color="white" borderTopRadius="xl">
                <HStack spacing={3}>
                  <Trash2 size={24} />
                  <Text fontSize="lg" fontWeight="bold">
                    Confirm Delete Patient
                  </Text>
                </HStack>
              </ModalHeader>
              <ModalCloseButton color="white" />
              <ModalBody p={6}>
                <VStack spacing={4} align="center">
                  <Box p={4} bg="red.50" borderRadius="lg" border="1px" borderColor="red.200">
                    <Text textAlign="center" color="red.700">
                      Are you sure you want to delete patient{' '}
                      <Text as="span" fontWeight="bold">
                        {selectedPatient.name}
                      </Text>
                      ?
                    </Text>
                  </Box>
                  
                  <VStack spacing={2} align="start" w="100%">
                    <Text fontSize="sm" color="gray.600">
                      <strong>Patient ID:</strong> {selectedPatient.patientId}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      <strong>Constitution:</strong> {selectedPatient.constitution}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      <strong>Last Visit:</strong> {selectedPatient.lastVisit}
                    </Text>
                  </VStack>

                  <Box p={3} bg="yellow.50" borderRadius="lg" border="1px" borderColor="yellow.200" w="100%">
                    <Text fontSize="sm" color="yellow.800" textAlign="center">
                      ⚠️ This action cannot be undone. All patient records will be permanently deleted.
                    </Text>
                  </Box>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <HStack spacing={3}>
                  <Button variant="outline" onClick={onDeleteClose}>
                    Cancel
                  </Button>
                  <Button colorScheme="red" leftIcon={<Trash2 />} onClick={confirmDeletePatient}>
                    Delete Patient
                  </Button>
                </HStack>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}

        {/* Export Options Modal */}
        <Modal isOpen={isExportOpen} onClose={onExportClose} size="md">
          <ModalOverlay backdropFilter="blur(4px)" />
          <ModalContent borderRadius="xl" boxShadow="2xl">
            <ModalHeader bg="blue.500" color="white" borderTopRadius="xl">
              <HStack spacing={3}>
                <Download size={24} />
                <Text fontSize="lg" fontWeight="bold">
                  Export Patient Data
                </Text>
              </HStack>
            </ModalHeader>
            <ModalCloseButton color="white" />
            <ModalBody p={6}>
              <VStack spacing={4} align="stretch">
                <Text color="gray.600" mb={2}>
                  Choose your preferred export format:
                </Text>
                
                <Button
                  leftIcon={<FileText />}
                  size="lg"
                  variant="outline"
                  colorScheme="red"
                  justifyContent="flex-start"
                  h={12}
                  onClick={() => handleExport('pdf')}
                  _hover={{ bg: 'red.50', borderColor: 'red.300' }}
                >
                  <VStack align="start" spacing={0} ml={2}>
                    <Text fontWeight="semibold">Export as PDF</Text>
                    <Text fontSize="sm" color="gray.500">
                      Formatted document for printing
                    </Text>
                  </VStack>
                </Button>

                <Button
                  leftIcon={<FileSpreadsheet />}
                  size="lg"
                  variant="outline"
                  colorScheme="green"
                  justifyContent="flex-start"
                  h={12}
                  onClick={() => handleExport('excel')}
                  _hover={{ bg: 'green.50', borderColor: 'green.300' }}
                >
                  <VStack align="start" spacing={0} ml={2}>
                    <Text fontWeight="semibold">Export as Excel</Text>
                    <Text fontSize="sm" color="gray.500">
                      Spreadsheet for data analysis
                    </Text>
                  </VStack>
                </Button>

                <Button
                  leftIcon={<Download />}
                  size="lg"
                  variant="outline"
                  colorScheme="blue"
                  justifyContent="flex-start"
                  h={12}
                  onClick={() => handleExport('csv')}
                  _hover={{ bg: 'blue.50', borderColor: 'blue.300' }}
                >
                  <VStack align="start" spacing={0} ml={2}>
                    <Text fontWeight="semibold">Export as CSV</Text>
                    <Text fontSize="sm" color="gray.500">
                      Comma-separated values file
                    </Text>
                  </VStack>
                </Button>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="outline" onClick={onExportClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Import Summary Modal */}
        <Modal isOpen={isImportSummaryOpen} onClose={onImportSummaryClose} size="xl">
          <ModalOverlay backdropFilter="blur(4px)" />
          <ModalContent borderRadius="xl" border="2px" borderColor="blue.200">
            <ModalHeader bgGradient={headerGradient} color="white" borderTopRadius="xl">
              <HStack spacing={3}>
                <Box p={2} bg="whiteAlpha.300" borderRadius="lg">
                  <FileSpreadsheet size={24} />
                </Box>
                <Text fontSize="lg" fontWeight="bold">
                  Import Summary
                </Text>
              </HStack>
            </ModalHeader>
            <ModalCloseButton color="white" />
            <ModalBody p={6}>
              <VStack spacing={4} align="stretch">
                {/* Summary Stats */}
                <SimpleGrid columns={2} spacing={4}>
                  <Card bg="green.50" borderColor="green.200" border="1px">
                    <CardBody>
                      <Stat>
                        <StatLabel color="green.700">Successfully Imported</StatLabel>
                        <StatNumber color="green.600" fontSize="3xl">
                          {importStats.imported}
                        </StatNumber>
                      </Stat>
                    </CardBody>
                  </Card>
                  
                  <Card bg="red.50" borderColor="red.200" border="1px">
                    <CardBody>
                      <Stat>
                        <StatLabel color="red.700">Failed</StatLabel>
                        <StatNumber color="red.600" fontSize="3xl">
                          {importStats.failed}
                        </StatNumber>
                      </Stat>
                    </CardBody>
                  </Card>

                  <Card bg="orange.50" borderColor="orange.200" border="1px">
                    <CardBody>
                      <Stat>
                        <StatLabel color="orange.700">Skipped</StatLabel>
                        <StatNumber color="orange.600" fontSize="3xl">
                          {importStats.skipped}
                        </StatNumber>
                      </Stat>
                    </CardBody>
                  </Card>

                  <Card bg="blue.50" borderColor="blue.200" border="1px">
                    <CardBody>
                      <Stat>
                        <StatLabel color="blue.700">Total Rows</StatLabel>
                        <StatNumber color="blue.600" fontSize="3xl">
                          {importStats.total}
                        </StatNumber>
                      </Stat>
                    </CardBody>
                  </Card>
                </SimpleGrid>

                {/* Error Details */}
                {importErrors.length > 0 && (
                  <Box>
                    <Alert status="warning" borderRadius="lg" mb={2}>
                      <AlertIcon />
                      <Box flex="1">
                        <AlertTitle>Issues Found</AlertTitle>
                        <AlertDescription>
                          The following rows had issues and were not imported:
                        </AlertDescription>
                      </Box>
                    </Alert>
                    <Box 
                      maxH="300px" 
                      overflowY="auto" 
                      bg="gray.50" 
                      p={3} 
                      borderRadius="lg"
                      border="1px"
                      borderColor="gray.200"
                    >
                      <List spacing={2}>
                        {importErrors.slice(0, 50).map((error, idx) => (
                          <ListItem key={idx} fontSize="sm" color="gray.700">
                            <ListIcon as={AlertCircle} color="orange.500" />
                            {error}
                          </ListItem>
                        ))}
                        {importErrors.length > 50 && (
                          <ListItem fontSize="sm" color="gray.500" fontStyle="italic">
                            ... and {importErrors.length - 50} more errors
                          </ListItem>
                        )}
                      </List>
                    </Box>
                  </Box>
                )}

                {/* Success Message */}
                {importErrors.length === 0 && importStats.imported > 0 && (
                  <Alert status="success" borderRadius="lg">
                    <AlertIcon as={CheckCircle} />
                    <Box flex="1">
                      <AlertTitle>All records imported successfully!</AlertTitle>
                      <AlertDescription>
                        {importStats.imported} patient records were added to the system.
                      </AlertDescription>
                    </Box>
                  </Alert>
                )}
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={onImportSummaryClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
};

export default PatientList;
