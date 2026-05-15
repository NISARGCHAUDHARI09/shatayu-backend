import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import {
  Box,
  Grid,
  Card,
  CardBody,
  CardHeader,
  Text,
  Badge,
  Button,
  HStack,
  VStack,
  Flex,
  Input,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Textarea,
  NumberInput,
  NumberInputField,
  InputGroup,
  InputLeftElement,
  Heading,
  Divider,
  Tooltip,
  useToast,
  Progress,
  Switch,
  FormErrorMessage,
  Checkbox,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spacer,
  Center,
  Icon,
  Fade,
  ScaleFade,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  ButtonGroup,
  Skeleton,
  SkeletonText,
  Wrap,
  WrapItem
} from '@chakra-ui/react';
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  Package,
  Calendar,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  RefreshCw,
  ShoppingCart,
  BarChart3,
  Archive,
  Edit3,
  BookOpen,
  User,
  Star,
  CheckCircle,
  Clock,
  Layers,
  Shield,
  Award,
  Settings,
  Filter as FilterIcon,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

const MedicineInventoryManagement = ({ title = "Ayurvedic Medicine Inventory" }) => {
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [medicineCategory, setMedicineCategory] = useState('all'); // 'owned', 'vedic', 'all'
  const [selectedMedicines, setSelectedMedicines] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBulkEditMode, setIsBulkEditMode] = useState(false);
  const [editingMedicines, setEditingMedicines] = useState({});
  const [medicineStats, setMedicineStats] = useState({
    totalMedicines: 0,
    vedicMedicines: 0,
    ownedMedicines: 0,
    lowStockMedicines: 0,
    expiredMedicines: 0,
    totalInventoryValue: 0
  });
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isStockOpen, onOpen: onStockOpen, onClose: onStockClose } = useDisclosure();
  
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const accentColor = useColorModeValue('blue.500', 'blue.300');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  // Dynamic API base URL based on category
  const getApiBaseUrl = () => {
    if (medicineCategory === 'vedic') return 'https://shatayu-backend.onrender.com/api/medicines/vedic';
    if (medicineCategory === 'owned') return 'https://shatayu-backend.onrender.com/api/medicines/custom';
    return null;
  };

  // API Functions
  const fetchMedicines = async () => {
    const API_BASE_URL = getApiBaseUrl();
    if (!API_BASE_URL) return setMedicines([]);
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (filterType !== 'all') params.append('type', filterType);
      if (filterStatus !== 'all') params.append('status', filterStatus);
      
      const response = await axios.get(`${API_BASE_URL}?${params.toString()}`);
      if (response.data.success) {
        setMedicines(response.data.data);
        setFilteredMedicines(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching medicines:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch medicines. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMedicineStats = async () => {
    const API_BASE_URL = getApiBaseUrl();
    if (!API_BASE_URL) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/statistics`);
      if (response.data.success) {
        setMedicineStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching medicine statistics:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch statistics. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const createMedicineAPI = async (medicineData) => {
    const API_BASE_URL = getApiBaseUrl();
    if (!API_BASE_URL) return false;
    try {
      setIsLoading(true);
      const response = await axios.post(API_BASE_URL, medicineData);
      if (response.data.success) {
        toast({
          title: 'Success',
          description: 'Medicine created successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        await fetchMedicines();
        return true;
      }
    } catch (error) {
      console.error('Error creating medicine:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create medicine.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateMedicineAPI = async (id, medicineData) => {
    const API_BASE_URL = getApiBaseUrl();
    if (!API_BASE_URL) return false;
    try {
      setIsLoading(true);
      const response = await axios.put(`${API_BASE_URL}/${id}`, medicineData);
      if (response.data.success) {
        toast({
          title: 'Success',
          description: 'Medicine updated successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        await fetchMedicines();
        return true;
      }
    } catch (error) {
      console.error('Error updating medicine:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update medicine.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMedicineAPI = async (id) => {
    const API_BASE_URL = getApiBaseUrl();
    if (!API_BASE_URL) return false;
    try {
      setIsLoading(true);
      const response = await axios.delete(`${API_BASE_URL}/${id}`);
      if (response.data.success) {
        toast({
          title: 'Success',
          description: 'Medicine deleted successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        await fetchMedicines();
        return true;
      }
    } catch (error) {
      console.error('Error deleting medicine:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete medicine.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateStockAPI = async (id, stockData) => {
    const API_BASE_URL = getApiBaseUrl();
    if (!API_BASE_URL) return false;
    try {
      setIsLoading(true);
      const response = await axios.put(`${API_BASE_URL}/${id}`, stockData);
      if (response.data.success) {
        toast({
          title: 'Success',
          description: 'Stock updated successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        await fetchMedicines();
        return true;
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update stock.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const bulkEditMedicinesAPI = async (medicineUpdates) => {
    const API_BASE_URL = getApiBaseUrl();
    if (!API_BASE_URL) return false;
    try {
      setIsLoading(true);
      const medicineIds = Array.from(selectedMedicines);
      // For simplicity, send bulk update as multiple requests
      const promises = medicineIds.map(id => axios.put(`${API_BASE_URL}/${id}`, medicineUpdates[id]));
      await Promise.all(promises);
      await fetchMedicines();
      return true;
    } catch (error) {
      console.error('Error bulk editing medicines:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to bulk edit medicines.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const importMedicinesAPI = async (medicineData, category) => {
    const API_BASE_URL = getApiBaseUrl();
    if (!API_BASE_URL) return false;
    try {
      setIsLoading(true);
      // For demo, just send as multiple POST requests
      const promises = medicineData.map(data => axios.post(API_BASE_URL, data));
      await Promise.all(promises);
      await fetchMedicines();
      return true;
    } catch (error) {
      console.error('Error importing medicines:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to import medicines.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data for Ayurvedic medicine inventory
  const mockMedicines = [
    {
      id: 1,
      name: 'Triphala Churna',
      type: 'Churna (Powder)',
      dose: { quantity: '5g', timing: 'A-0-A' },
      batch: 'TRP2024001',
      mfd: '2024-01-15',
      exp: '2026-01-15',
      unitPrice: 45.00,
      costPrice: 30.00,
      stock: 150,
      minStock: 50,
      maxStock: 500,
      status: 'In Stock',
      supplier: 'Himalaya Herbal',
      location: 'Rack A-1',
      lastRestocked: '2024-08-15',
      totalSold: 25,
      category: 'vedic',
      createdBy: 'Ancient Texts',
      description: 'Traditional Ayurvedic formulation for digestive health',
      properties: ['Digestive', 'Detoxifying', 'Antioxidant']
    },
    {
      id: 2,
      name: 'Ashwagandha Capsules',
      type: 'Capsule',
      dose: { quantity: '500mg', timing: 'B-B-B' },
      batch: 'ASH2024002',
      mfd: '2024-03-10',
      exp: '2025-03-10',
      unitPrice: 85.75,
      costPrice: 60.00,
      stock: 25,
      minStock: 50,
      maxStock: 300,
      status: 'Low Stock',
      supplier: 'Patanjali Ayurved',
      location: 'Rack B-2',
      lastRestocked: '2024-06-20',
      totalSold: 75,
      category: 'vedic',
      createdBy: 'Classical Texts',
      description: 'Adaptogenic herb for stress relief and vitality',
      properties: ['Adaptogenic', 'Stress Relief', 'Energy Booster']
    },
    {
      id: 3,
      name: 'Brahmi Ghrita',
      type: 'Ghrita (Medicated Ghee)',
      dose: { quantity: '10ml', timing: 'A-A-A' },
      batch: 'BRM2024003',
      mfd: '2024-02-20',
      exp: '2026-02-20',
      unitPrice: 125.25,
      costPrice: 90.00,
      stock: 80,
      minStock: 30,
      maxStock: 200,
      status: 'In Stock',
      supplier: 'Baidyanath',
      location: 'Rack C-1',
      lastRestocked: '2024-07-10',
      totalSold: 15,
      category: 'vedic',
      createdBy: 'Charaka Samhita',
      description: 'Memory enhancing medicated ghee',
      properties: ['Memory Enhancement', 'Cognitive Support', 'Nervine Tonic']
    },
    {
      id: 4,
      name: 'Tulsi Kwath',
      type: 'Kwath (Decoction)',
      batch: 'TUL2024004',
      dose: { quantity: '15ml', timing: 'M-0-M' },
      mfd: '2024-04-05',
      exp: '2025-04-05',
      unitPrice: 65.90,
      costPrice: 45.00,
      stock: 15,
      minStock: 40,
      maxStock: 250,
      status: 'Critical Low',
      supplier: 'Organic India',
      location: 'Rack D-3',
      lastRestocked: '2024-05-15',
      totalSold: 85,
      category: 'vedic',
      createdBy: 'Traditional Knowledge',
      description: 'Sacred basil decoction for respiratory health',
      properties: ['Respiratory Support', 'Immunity Booster', 'Antimicrobial']
    },
    {
      id: 5,
      name: 'Dr. Sharma\'s Special Immunity Blend',
      type: 'Custom Formulation',
      dose: { quantity: '2 tablets', timing: 'A-0-A' },
      batch: 'DSS2024001',
      mfd: '2024-05-01',
      exp: '2025-05-01',
      unitPrice: 120.00,
      costPrice: 75.00,
      stock: 60,
      minStock: 25,
      maxStock: 150,
      status: 'In Stock',
      supplier: 'In-house Production',
      location: 'Rack F-1',
      lastRestocked: '2024-09-01',
      totalSold: 40,
      category: 'owned',
      createdBy: 'Dr. Rajesh Sharma',
      description: 'Custom immunity formulation for seasonal wellness',
      properties: ['Immunity Booster', 'Seasonal Support', 'Antioxidant']
    },
    {
      id: 6,
      name: 'Patient-Specific Digestive Formula',
      type: 'Custom Mix',
      dose: { quantity: '1 tsp', timing: 'B-0-B' },
      batch: 'PSD2024001',
      mfd: '2024-06-15',
      exp: '2025-06-15',
      unitPrice: 95.00,
      costPrice: 60.00,
      stock: 35,
      minStock: 15,
      maxStock: 100,
      status: 'In Stock',
      supplier: 'Custom Pharmacy',
      location: 'Rack G-2',
      lastRestocked: '2024-08-20',
      totalSold: 12,
      category: 'owned',
      createdBy: 'Patient Mr. Patel',
      description: 'Personalized digestive support blend',
      properties: ['Digestive Support', 'Personalized', 'Gentle Action']
    }
  ];

  useEffect(() => {
    fetchMedicines();
    fetchMedicineStats();
  }, []);

  // Refetch when filters change
  useEffect(() => {
    fetchMedicines();
  }, [searchTerm, medicineCategory, filterType, filterStatus]);

  // Filter and search functionality (now handled by API but keeping for client-side filtering if needed)
  useEffect(() => {
    setFilteredMedicines(medicines);
  }, [medicines]);

  // Use inventory metrics from API stats
  const {
    totalMedicines = 0,
    vedicMedicines = 0,
    ownedMedicines = 0,
    lowStockMedicines = 0,
    expiredMedicines = 0,
    totalInventoryValue = 0,
    totalCostValue = 0
  } = medicineStats;

  const handleView = (medicine) => {
    setSelectedMedicine(medicine);
    onOpen();
  };

  const handleEdit = (medicine) => {
    setSelectedMedicine(medicine);
    onAddOpen();
  };

  const handleStockUpdate = (medicine) => {
    setSelectedMedicine(medicine);
    onStockOpen();
  };

  const handleDelete = async (medicineId) => {
    if (window.confirm('Are you sure you want to remove this medicine from inventory?')) {
      await deleteMedicineAPI(medicineId);
    }
  };

  // Bulk selection handlers
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedMedicines(new Set());
    } else {
      setSelectedMedicines(new Set(filteredMedicines.map(m => m.id)));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectMedicine = (medicineId) => {
    const newSelected = new Set(selectedMedicines);
    if (newSelected.has(medicineId)) {
      newSelected.delete(medicineId);
    } else {
      newSelected.add(medicineId);
    }
    setSelectedMedicines(newSelected);
    setSelectAll(newSelected.size === filteredMedicines.length);
  };

  const handleBulkEdit = () => {
    if (selectedMedicines.size === 0) {
      toast({
        title: 'No medicines selected',
        description: 'Please select medicines to edit.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsBulkEditMode(!isBulkEditMode);
    
    if (!isBulkEditMode) {
      // Initialize editing data for selected medicines
      const editingData = {};
      selectedMedicines.forEach(id => {
        const medicine = medicines.find(m => m.id === id);
        if (medicine) {
          editingData[id] = {
            unitPrice: medicine.unitPrice,
            costPrice: medicine.costPrice,
            stock: medicine.stock,
            minStock: medicine.minStock,
            maxStock: medicine.maxStock,
            supplier: medicine.supplier,
            location: medicine.location
          };
        }
      });
      setEditingMedicines(editingData);
      
      toast({
        title: 'Bulk Edit Mode Activated',
        description: `${selectedMedicines.size} medicines are now editable. Click Save Changes when done.`,
        status: 'info',
        duration: 4000,
        isClosable: true,
      });
    } else {
      setEditingMedicines({});
    }
  };

  const handleSaveBulkChanges = async () => {
    const success = await bulkEditMedicinesAPI(editingMedicines);
    if (success) {
      setIsBulkEditMode(false);
      setEditingMedicines({});
      setSelectedMedicines(new Set());
      setSelectAll(false);
    }
  };

  const handleCancelBulkEdit = () => {
    setIsBulkEditMode(false);
    setEditingMedicines({});
    toast({
      title: 'Bulk Edit Cancelled',
      description: 'All changes discarded.',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleImport = (format, category) => {
    // Create file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = format === 'csv' ? '.csv' : '.xlsx,.xls';
    
    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        toast({
          title: `${format.toUpperCase()} Import Started`,
          description: `Processing ${file.name}...`,
          status: 'info',
          duration: 2000,
          isClosable: true,
        });
        
        try {
          const reader = new FileReader();
          
          reader.onload = async (e) => {
            try {
              const data = e.target.result;
              let workbook;
              
              if (format === 'csv') {
                workbook = XLSX.read(data, { type: 'string' });
              } else {
                workbook = XLSX.read(data, { type: 'binary' });
              }
              
              const sheetName = workbook.SheetNames[0];
              const worksheet = workbook.Sheets[sheetName];
              const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
              
              if (jsonData.length === 0) {
                toast({
                  title: 'Import Failed',
                  description: 'File is empty or has no valid data.',
                  status: 'error',
                  duration: 4000,
                  isClosable: true,
                });
                return;
              }
              
              // Map imported data to medicine format based on category
              const importedMedicines = [];
              const errors = [];
              
              jsonData.forEach((row, index) => {
                try {
                  // Normalize header names (case-insensitive)
                  const normalizedRow = {};
                  Object.keys(row).forEach(key => {
                    normalizedRow[key.toLowerCase().trim()] = row[key];
                  });
                  
                  // Skip empty rows
                  if (!normalizedRow['medicine name'] && !normalizedRow['name']) {
                    return;
                  }
                  
                  let medicineData;
                  
                  if (category === 'vedic') {
                    medicineData = {
                      medicineNumber: normalizedRow['medicine number'] || normalizedRow['medicine_number'] || normalizedRow['medicinenumber'] || '',
                      medicine_number: normalizedRow['medicine number'] || normalizedRow['medicine_number'] || normalizedRow['medicinenumber'] || '',
                      name: normalizedRow['medicine name'] || normalizedRow['name'] || '',
                      type: normalizedRow['type/form'] || normalizedRow['type'] || normalizedRow['form'] || '',
                      form: normalizedRow['type/form'] || normalizedRow['form'] || '',
                      batch: normalizedRow['batch'] || normalizedRow['batch no'] || normalizedRow['batch_no'] || '',
                      batch_no: normalizedRow['batch'] || normalizedRow['batch no'] || normalizedRow['batch_no'] || '',
                      dose: {
                        quantity: normalizedRow['dose quantity'] || normalizedRow['dose_quantity'] || '',
                        timing: normalizedRow['dose timing'] || normalizedRow['dose_timing'] || ''
                      },
                      mfd: normalizedRow['manufacturing date (mfd)'] || normalizedRow['mfd'] || '',
                      exp: normalizedRow['expiry date (exp)'] || normalizedRow['exp'] || normalizedRow['expiry date'] || normalizedRow['expiry_date'] || '',
                      expiry_date: normalizedRow['expiry date (exp)'] || normalizedRow['exp'] || normalizedRow['expiry date'] || normalizedRow['expiry_date'] || '',
                      unitPrice: parseFloat(normalizedRow['unit price (₹)'] || normalizedRow['unit price'] || normalizedRow['unit_price'] || normalizedRow['unitprice'] || 0),
                      unit_price: parseFloat(normalizedRow['unit price (₹)'] || normalizedRow['unit price'] || normalizedRow['unit_price'] || normalizedRow['unitprice'] || 0),
                      costPrice: parseFloat(normalizedRow['cost price (₹)'] || normalizedRow['cost price'] || normalizedRow['cost_price'] || normalizedRow['costprice'] || 0),
                      cost_price: parseFloat(normalizedRow['cost price (₹)'] || normalizedRow['cost price'] || normalizedRow['cost_price'] || normalizedRow['costprice'] || 0),
                      stock: parseInt(normalizedRow['current stock'] || normalizedRow['stock'] || normalizedRow['quantity in stock'] || normalizedRow['quantity_in_stock'] || 0),
                      quantity_in_stock: parseInt(normalizedRow['current stock'] || normalizedRow['stock'] || normalizedRow['quantity in stock'] || normalizedRow['quantity_in_stock'] || 0),
                      minStock: parseInt(normalizedRow['min stock'] || normalizedRow['min_stock'] || normalizedRow['minstock'] || 0),
                      min_stock: parseInt(normalizedRow['min stock'] || normalizedRow['min_stock'] || normalizedRow['minstock'] || 0),
                      maxStock: parseInt(normalizedRow['max stock'] || normalizedRow['max_stock'] || normalizedRow['maxstock'] || 0),
                      max_stock: parseInt(normalizedRow['max stock'] || normalizedRow['max_stock'] || normalizedRow['maxstock'] || 0),
                      totalSold: parseInt(normalizedRow['total sold'] || normalizedRow['total_sold'] || 0),
                      status: normalizedRow['status'] || '',
                      supplier: normalizedRow['supplier'] || normalizedRow['manufacturer'] || '',
                      manufacturer: normalizedRow['supplier'] || normalizedRow['manufacturer'] || '',
                      location: normalizedRow['storage location'] || normalizedRow['location'] || '',
                      lastRestocked: normalizedRow['last restocked'] || normalizedRow['last_restocked'] || '',
                      createdBy: normalizedRow['created by'] || normalizedRow['created_by'] || '',
                      description: normalizedRow['description'] || '',
                      sku: normalizedRow['sku'] || '',
                      category: 'vedic'
                    };
                  } else if (category === 'owned') {
                    medicineData = {
                      medicineNumber: normalizedRow['medicine number'] || normalizedRow['medicine_number'] || normalizedRow['medicinenumber'] || '',
                      medicine_number: normalizedRow['medicine number'] || normalizedRow['medicine_number'] || normalizedRow['medicinenumber'] || '',
                      name: normalizedRow['medicine name'] || normalizedRow['name'] || '',
                      type: normalizedRow['type/form'] || normalizedRow['type'] || normalizedRow['preparation'] || '',
                      preparation: normalizedRow['type/form'] || normalizedRow['preparation'] || '',
                      batch: normalizedRow['batch'] || normalizedRow['batch no'] || normalizedRow['batch_no'] || '',
                      batch_no: normalizedRow['batch'] || normalizedRow['batch no'] || normalizedRow['batch_no'] || '',
                      dose: {
                        quantity: normalizedRow['dose quantity'] || normalizedRow['dose_quantity'] || '',
                        timing: normalizedRow['dose timing'] || normalizedRow['dose_timing'] || ''
                      },
                      mfd: normalizedRow['manufacturing date (mfd)'] || normalizedRow['mfd'] || '',
                      exp: normalizedRow['expiry date (exp)'] || normalizedRow['exp'] || normalizedRow['expiry date'] || normalizedRow['expiry_date'] || '',
                      expiry_date: normalizedRow['expiry date (exp)'] || normalizedRow['exp'] || normalizedRow['expiry date'] || normalizedRow['expiry_date'] || '',
                      unitPrice: parseFloat(normalizedRow['unit price (₹)'] || normalizedRow['unit price'] || normalizedRow['unit_price'] || normalizedRow['unitprice'] || 0),
                      unit_price: parseFloat(normalizedRow['unit price (₹)'] || normalizedRow['unit price'] || normalizedRow['unit_price'] || normalizedRow['unitprice'] || 0),
                      costPrice: parseFloat(normalizedRow['cost price (₹)'] || normalizedRow['cost price'] || normalizedRow['cost_price'] || normalizedRow['costprice'] || 0),
                      cost_price: parseFloat(normalizedRow['cost price (₹)'] || normalizedRow['cost price'] || normalizedRow['cost_price'] || normalizedRow['costprice'] || 0),
                      stock: parseInt(normalizedRow['current stock'] || normalizedRow['stock'] || normalizedRow['quantity in stock'] || normalizedRow['quantity_in_stock'] || 0),
                      quantity_in_stock: parseInt(normalizedRow['current stock'] || normalizedRow['stock'] || normalizedRow['quantity in stock'] || normalizedRow['quantity_in_stock'] || 0),
                      minStock: parseInt(normalizedRow['min stock'] || normalizedRow['min_stock'] || normalizedRow['minstock'] || 0),
                      min_stock: parseInt(normalizedRow['min stock'] || normalizedRow['min_stock'] || normalizedRow['minstock'] || 0),
                      maxStock: parseInt(normalizedRow['max stock'] || normalizedRow['max_stock'] || normalizedRow['maxstock'] || 0),
                      max_stock: parseInt(normalizedRow['max stock'] || normalizedRow['max_stock'] || normalizedRow['maxstock'] || 0),
                      totalSold: parseInt(normalizedRow['total sold'] || normalizedRow['total_sold'] || 0),
                      status: normalizedRow['status'] || '',
                      supplier: normalizedRow['supplier'] || '',
                      location: normalizedRow['storage location'] || normalizedRow['location'] || '',
                      lastRestocked: normalizedRow['last restocked'] || normalizedRow['last_restocked'] || '',
                      createdBy: normalizedRow['created by'] || normalizedRow['created_by'] || normalizedRow['prepared by'] || normalizedRow['prepared_by'] || '',
                      prepared_by: normalizedRow['created by'] || normalizedRow['created_by'] || normalizedRow['prepared by'] || normalizedRow['prepared_by'] || '',
                      description: normalizedRow['description'] || '',
                      composition: normalizedRow['composition'] || '',
                      notes: normalizedRow['description'] || normalizedRow['notes'] || '',
                      sku: normalizedRow['sku'] || '',
                      category: 'owned'
                    };
                  } else {
                    // Generic import for 'all' category
                    medicineData = {
                      medicineNumber: normalizedRow['medicine number'] || normalizedRow['medicine_number'] || normalizedRow['medicinenumber'] || '',
                      medicine_number: normalizedRow['medicine number'] || normalizedRow['medicine_number'] || normalizedRow['medicinenumber'] || '',
                      name: normalizedRow['medicine name'] || normalizedRow['name'] || '',
                      type: normalizedRow['type/form'] || normalizedRow['type'] || normalizedRow['form'] || normalizedRow['preparation'] || '',
                      form: normalizedRow['type/form'] || normalizedRow['form'] || normalizedRow['preparation'] || '',
                      batch: normalizedRow['batch'] || normalizedRow['batch no'] || normalizedRow['batch_no'] || '',
                      batch_no: normalizedRow['batch'] || normalizedRow['batch no'] || normalizedRow['batch_no'] || '',
                      dose: {
                        quantity: normalizedRow['dose quantity'] || normalizedRow['dose_quantity'] || '',
                        timing: normalizedRow['dose timing'] || normalizedRow['dose_timing'] || ''
                      },
                      mfd: normalizedRow['manufacturing date (mfd)'] || normalizedRow['mfd'] || '',
                      exp: normalizedRow['expiry date (exp)'] || normalizedRow['exp'] || normalizedRow['expiry date'] || normalizedRow['expiry_date'] || '',
                      expiry_date: normalizedRow['expiry date (exp)'] || normalizedRow['exp'] || normalizedRow['expiry date'] || normalizedRow['expiry_date'] || '',
                      unitPrice: parseFloat(normalizedRow['unit price (₹)'] || normalizedRow['unit price'] || normalizedRow['unit_price'] || normalizedRow['unitprice'] || 0),
                      unit_price: parseFloat(normalizedRow['unit price (₹)'] || normalizedRow['unit price'] || normalizedRow['unit_price'] || normalizedRow['unitprice'] || 0),
                      costPrice: parseFloat(normalizedRow['cost price (₹)'] || normalizedRow['cost price'] || normalizedRow['cost_price'] || normalizedRow['costprice'] || 0),
                      cost_price: parseFloat(normalizedRow['cost price (₹)'] || normalizedRow['cost price'] || normalizedRow['cost_price'] || normalizedRow['costprice'] || 0),
                      stock: parseInt(normalizedRow['current stock'] || normalizedRow['stock'] || normalizedRow['quantity in stock'] || normalizedRow['quantity_in_stock'] || 0),
                      quantity_in_stock: parseInt(normalizedRow['current stock'] || normalizedRow['stock'] || normalizedRow['quantity in stock'] || normalizedRow['quantity_in_stock'] || 0),
                      minStock: parseInt(normalizedRow['min stock'] || normalizedRow['min_stock'] || normalizedRow['minstock'] || 0),
                      min_stock: parseInt(normalizedRow['min stock'] || normalizedRow['min_stock'] || normalizedRow['minstock'] || 0),
                      maxStock: parseInt(normalizedRow['max stock'] || normalizedRow['max_stock'] || normalizedRow['maxstock'] || 0),
                      max_stock: parseInt(normalizedRow['max stock'] || normalizedRow['max_stock'] || normalizedRow['maxstock'] || 0),
                      totalSold: parseInt(normalizedRow['total sold'] || normalizedRow['total_sold'] || 0),
                      status: normalizedRow['status'] || '',
                      supplier: normalizedRow['supplier'] || normalizedRow['manufacturer'] || '',
                      manufacturer: normalizedRow['supplier'] || normalizedRow['manufacturer'] || '',
                      location: normalizedRow['storage location'] || normalizedRow['location'] || '',
                      lastRestocked: normalizedRow['last restocked'] || normalizedRow['last_restocked'] || '',
                      createdBy: normalizedRow['created by'] || normalizedRow['created_by'] || '',
                      description: normalizedRow['description'] || '',
                      sku: normalizedRow['sku'] || '',
                      category: normalizedRow['category'] === 'Custom' ? 'owned' : 'vedic'
                    };
                  }
                  
                  // Validate required fields
                  if (!medicineData.name) {
                    errors.push(`Row ${index + 2}: Medicine name is required`);
                    return;
                  }
                  
                  importedMedicines.push(medicineData);
                } catch (rowError) {
                  errors.push(`Row ${index + 2}: ${rowError.message}`);
                }
              });
              
              if (importedMedicines.length === 0) {
                toast({
                  title: 'Import Failed',
                  description: errors.length > 0 ? errors[0] : 'No valid medicines found in file.',
                  status: 'error',
                  duration: 5000,
                  isClosable: true,
                });
                return;
              }
              
              // Show warnings if there are errors but also valid data
              if (errors.length > 0) {
                toast({
                  title: 'Import Warning',
                  description: `${errors.length} row(s) skipped. Importing ${importedMedicines.length} valid medicines.`,
                  status: 'warning',
                  duration: 4000,
                  isClosable: true,
                });
                console.warn('Import errors:', errors);
              }
              
              // Import the medicines
              const success = await importMedicinesAPI(importedMedicines, category);
              
              if (success) {
                toast({
                  title: 'Import Successful',
                  description: `Successfully imported ${importedMedicines.length} medicine(s).`,
                  status: 'success',
                  duration: 4000,
                  isClosable: true,
                });
              }
            } catch (parseError) {
              console.error('Parse error:', parseError);
              toast({
                title: 'Import Failed',
                description: `Error parsing file: ${parseError.message}`,
                status: 'error',
                duration: 5000,
                isClosable: true,
              });
            }
          };
          
          reader.onerror = () => {
            toast({
              title: 'Import Failed',
              description: 'Error reading file. Please try again.',
              status: 'error',
              duration: 4000,
              isClosable: true,
            });
          };
          
          if (format === 'csv') {
            reader.readAsText(file);
          } else {
            reader.readAsBinaryString(file);
          }
        } catch (error) {
          console.error('Import error:', error);
          toast({
            title: 'Import Failed',
            description: error.message || 'An error occurred during import.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      }
    };
    
    input.click();
  };

  const handleExport = (format) => {
    try {
      const dataToExport = filteredMedicines.length > 0 ? filteredMedicines : medicines;
      
      // Allow exporting empty table structure
      const hasData = dataToExport && dataToExport.length > 0;
      
      if (!hasData) {
        toast({ 
          title: 'Exporting empty template', 
          description: 'Creating file with column headers only.', 
          status: 'info', 
          duration: 3000 
        });
      }
      
      if (format === 'pdf') {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('Medicine Inventory Report', 14, 22);
        doc.setFontSize(11);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
        doc.text(`Category: ${medicineCategory === 'all' ? 'All Medicines' : medicineCategory === 'vedic' ? 'Vedic Medicines' : 'Custom Medicines'}`, 14, 36);
        
        const tableData = hasData ? dataToExport.map(med => [
          med.medicineNumber || med.medicine_number || 'N/A',
          med.name || 'N/A',
          med.form || med.preparation || 'N/A',
          med.quantity_in_stock || 0,
          med.unit || 'N/A',
          med.unit_price ? `₹${med.unit_price}` : 'N/A',
          med.expiry_date || 'N/A',
          med.batch_no || 'N/A'
        ]) : [];
        
        doc.autoTable({
          startY: 42,
          head: [['Medicine No.', 'Medicine Name', 'Type/Form', 'Stock', 'Unit', 'Unit Price', 'Expiry Date', 'Batch No.']],
          body: tableData,
          theme: 'grid',
          styles: { fontSize: 8 },
          headStyles: { fillColor: [66, 139, 202] }
        });
        
        doc.save(`medicine-inventory-${medicineCategory}-${new Date().getTime()}.pdf`);
        toast({ title: 'PDF exported successfully', status: 'success', duration: 3000 });
      } else if (format === 'csv' || format === 'excel') {
        let exportData;
        
        // Export structure based on medicine category - matching frontend display
        if (medicineCategory === 'vedic') {
          exportData = hasData ? dataToExport.map(med => ({
            'Medicine Number': med.medicineNumber || med.medicine_number || '',
            'Medicine Name': med.name || '',
            'Type/Form': med.type || med.form || '',
            'Category': 'Vedic',
            'Batch': med.batch || med.batch_no || '',
            'Dose Quantity': med.dose?.quantity || '',
            'Dose Timing': med.dose?.timing || '',
            'Manufacturing Date (MFD)': med.mfd || '',
            'Expiry Date (EXP)': med.exp || med.expiry_date || '',
            'Unit Price (₹)': med.unitPrice || med.unit_price || 0,
            'Cost Price (₹)': med.costPrice || med.cost_price || 0,
            'Current Stock': med.stock || med.quantity_in_stock || 0,
            'Min Stock': med.minStock || med.min_stock || 0,
            'Max Stock': med.maxStock || med.max_stock || 0,
            'Total Sold': med.totalSold || med.total_sold || 0,
            'Status': med.status || '',
            'Supplier': med.supplier || med.manufacturer || '',
            'Storage Location': med.location || '',
            'Last Restocked': med.lastRestocked || med.last_restocked || '',
            'Created By': med.createdBy || med.created_by || '',
            'Description': med.description || '',
            'SKU': med.sku || ''
          })) : [{
            'Medicine Number': '',
            'Medicine Name': '',
            'Type/Form': '',
            'Category': 'Vedic',
            'Batch': '',
            'Dose Quantity': '',
            'Dose Timing': '',
            'Manufacturing Date (MFD)': '',
            'Expiry Date (EXP)': '',
            'Unit Price (₹)': '',
            'Cost Price (₹)': '',
            'Current Stock': '',
            'Min Stock': '',
            'Max Stock': '',
            'Total Sold': '',
            'Status': '',
            'Supplier': '',
            'Storage Location': '',
            'Last Restocked': '',
            'Created By': '',
            'Description': '',
            'SKU': ''
          }];
        } else if (medicineCategory === 'owned') {
          exportData = hasData ? dataToExport.map(med => ({
            'Medicine Number': med.medicineNumber || med.medicine_number || '',
            'Medicine Name': med.name || '',
            'Type/Form': med.type || med.preparation || '',
            'Category': 'Custom',
            'Batch': med.batch || med.batch_no || '',
            'Dose Quantity': med.dose?.quantity || '',
            'Dose Timing': med.dose?.timing || '',
            'Manufacturing Date (MFD)': med.mfd || '',
            'Expiry Date (EXP)': med.exp || med.expiry_date || '',
            'Unit Price (₹)': med.unitPrice || med.unit_price || 0,
            'Cost Price (₹)': med.costPrice || med.cost_price || 0,
            'Current Stock': med.stock || med.quantity_in_stock || 0,
            'Min Stock': med.minStock || med.min_stock || 0,
            'Max Stock': med.maxStock || med.max_stock || 0,
            'Total Sold': med.totalSold || med.total_sold || 0,
            'Status': med.status || '',
            'Supplier': med.supplier || '',
            'Storage Location': med.location || '',
            'Last Restocked': med.lastRestocked || med.last_restocked || '',
            'Created By': med.createdBy || med.created_by || med.prepared_by || '',
            'Description': med.description || med.notes || '',
            'Composition': med.composition || '',
            'SKU': med.sku || ''
          })) : [{
            'Medicine Number': '',
            'Medicine Name': '',
            'Type/Form': '',
            'Category': 'Custom',
            'Batch': '',
            'Dose Quantity': '',
            'Dose Timing': '',
            'Manufacturing Date (MFD)': '',
            'Expiry Date (EXP)': '',
            'Unit Price (₹)': '',
            'Cost Price (₹)': '',
            'Current Stock': '',
            'Min Stock': '',
            'Max Stock': '',
            'Total Sold': '',
            'Status': '',
            'Supplier': '',
            'Storage Location': '',
            'Last Restocked': '',
            'Created By': '',
            'Description': '',
            'Composition': '',
            'SKU': ''
          }];
        } else {
          // Generic export for 'all' category
          exportData = hasData ? dataToExport.map(med => ({
            'Medicine Number': med.medicineNumber || med.medicine_number || '',
            'Medicine Name': med.name || '',
            'Type/Form': med.type || med.form || med.preparation || '',
            'Category': med.category === 'owned' ? 'Custom' : 'Vedic',
            'Batch': med.batch || med.batch_no || '',
            'Dose Quantity': med.dose?.quantity || '',
            'Dose Timing': med.dose?.timing || '',
            'Manufacturing Date (MFD)': med.mfd || '',
            'Expiry Date (EXP)': med.exp || med.expiry_date || '',
            'Unit Price (₹)': med.unitPrice || med.unit_price || 0,
            'Cost Price (₹)': med.costPrice || med.cost_price || 0,
            'Current Stock': med.stock || med.quantity_in_stock || 0,
            'Min Stock': med.minStock || med.min_stock || 0,
            'Max Stock': med.maxStock || med.max_stock || 0,
            'Total Sold': med.totalSold || med.total_sold || 0,
            'Status': med.status || '',
            'Supplier': med.supplier || med.manufacturer || '',
            'Storage Location': med.location || '',
            'Last Restocked': med.lastRestocked || med.last_restocked || '',
            'Created By': med.createdBy || med.created_by || '',
            'Description': med.description || med.notes || '',
            'SKU': med.sku || ''
          })) : [{
            'Medicine Number': '',
            'Medicine Name': '',
            'Type/Form': '',
            'Category': '',
            'Batch': '',
            'Dose Quantity': '',
            'Dose Timing': '',
            'Manufacturing Date (MFD)': '',
            'Expiry Date (EXP)': '',
            'Unit Price (₹)': '',
            'Cost Price (₹)': '',
            'Current Stock': '',
            'Min Stock': '',
            'Max Stock': '',
            'Total Sold': '',
            'Status': '',
            'Supplier': '',
            'Storage Location': '',
            'Last Restocked': '',
            'Created By': '',
            'Description': '',
            'SKU': ''
          }];
        }
        
        const ws = XLSX.utils.json_to_sheet(exportData);
        
        // Set column widths for better readability
        const colWidths = [
          { wch: 8 },  // ID
          { wch: 12 }, // SKU
          { wch: 25 }, // Name
          { wch: 15 }, // Form/Preparation
          { wch: 20 }, // Manufacturer/Prepared By
          { wch: 12 }, // Batch No
          { wch: 12 }, // Expiry Date
          { wch: 8 },  // Unit
          { wch: 10 }, // Unit Price
          { wch: 12 }, // Quantity
          { wch: 30 }, // Description/Notes
          { wch: 18 }, // Created At
          { wch: 18 }  // Updated At
        ];
        ws['!cols'] = colWidths;
        
        const wb = XLSX.utils.book_new();
        const sheetName = medicineCategory === 'vedic' ? 'Vedic Medicines' : 
                         medicineCategory === 'owned' ? 'Custom Medicines' : 'All Medicines';
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
        
        const fileName = `medicine-inventory-${medicineCategory}-${new Date().getTime()}.${format === 'csv' ? 'csv' : 'xlsx'}`;
        XLSX.writeFile(wb, fileName);
        
        toast({ 
          title: `${format.toUpperCase()} exported successfully`, 
          description: `Exported ${exportData.length} medicine records`,
          status: 'success', 
          duration: 3000 
        });
      }
    } catch (error) {
      console.error('Export error:', error);
      toast({ 
        title: 'Export failed', 
        description: error.message, 
        status: 'error', 
        duration: 5000 
      });
    }
  };

  const updateEditingMedicine = (medicineId, field, value) => {
    setEditingMedicines(prev => ({
      ...prev,
      [medicineId]: {
        ...prev[medicineId],
        [field]: value
      }
    }));
  };

  const getCategoryIcon = (category) => {
    return category === 'owned' ? <User size={16} /> : <BookOpen size={16} />;
  };

  const getCategoryColor = (category) => {
    return category === 'owned' ? 'purple' : 'teal';
  };

  const formatDose = (dose) => {
    const timingMap = {
      'A': 'After meal',
      'B': 'Before meal', 
      'M': 'Middle of meal',
      '0': 'No intake'
    };
    
    const [morning, afternoon, evening] = dose.timing.split('-');
    return `${dose.quantity} (${timingMap[morning]}-${timingMap[afternoon]}-${timingMap[evening]})`;
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'in stock': return 'green';
      case 'low stock': return 'orange';
      case 'critical low': return 'red';
      case 'expired': return 'red';
      case 'out of stock': return 'gray';
      default: return 'gray';
    }
  };

  const getStockLevel = (medicine) => {
    const percentage = (medicine.stock / medicine.maxStock) * 100;
    return Math.min(percentage, 100);
  };

  const isExpiringSoon = (expDate) => {
    const exp = new Date(expDate);
    const today = new Date();
    const daysDiff = (exp - today) / (1000 * 60 * 60 * 24);
    return daysDiff <= 90 && daysDiff > 0;
  };

  const isExpired = (expDate) => {
    const exp = new Date(expDate);
    const today = new Date();
    return exp < today;
  };

  return (
    <Box p={6} bg={useColorModeValue('gray.50', 'gray.900')} minH="100vh">
      {/* Header Section */}
      <Fade in={true}>
        <Card 
          bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
          border="1px" 
          borderColor={borderColor} 
          mb={6} 
          shadow="xl"
          _dark={{
            bg: "linear-gradient(135deg, #2D3748 0%, #4A5568 100%)"
          }}
        >
          <CardBody>
            <Flex justify="space-between" align="center">
              <VStack align="start" spacing={2}>
                <HStack>
                  <Icon as={Package} boxSize={8} color="white" />
                  <Heading size="xl" color="white">
                    {title}
                  </Heading>
                </HStack>
                <Text color="white" fontSize="lg" opacity={0.9}>
                  Advanced inventory management for Ayurvedic medicines
                </Text>
                <HStack spacing={4}>
                  <Badge 
                    bg="rgba(255, 255, 255, 0.2)" 
                    color="white" 
                    fontSize="sm" 
                    px={3} 
                    py={1}
                    backdropFilter="blur(10px)"
                    border="1px solid rgba(255, 255, 255, 0.3)"
                  >
                    <HStack spacing={1}>
                      <Icon as={CheckCircle} boxSize={3} />
                      <Text>Smart Tracking</Text>
                    </HStack>
                  </Badge>
                  <Badge 
                    bg="rgba(255, 255, 255, 0.2)" 
                    color="white" 
                    fontSize="sm" 
                    px={3} 
                    py={1}
                    backdropFilter="blur(10px)"
                    border="1px solid rgba(255, 255, 255, 0.3)"
                  >
                    <HStack spacing={1}>
                      <Icon as={Shield} boxSize={3} />
                      <Text>Quality Assured</Text>
                    </HStack>
                  </Badge>
                  <Badge 
                    bg="rgba(255, 255, 255, 0.2)" 
                    color="white" 
                    fontSize="sm" 
                    px={3} 
                    py={1}
                    backdropFilter="blur(10px)"
                    border="1px solid rgba(255, 255, 255, 0.3)"
                  >
                    <HStack spacing={1}>
                      <Icon as={Award} boxSize={3} />
                      <Text>Ayurvedic Certified</Text>
                    </HStack>
                  </Badge>
                </HStack>
              </VStack>
              <VStack spacing={3}>
                <Button 
                  leftIcon={<Plus size={16} />} 
                  colorScheme="whiteAlpha" 
                  onClick={onAddOpen} 
                  size="lg"
                  variant="solid"
                  bg="rgba(255, 255, 255, 0.2)"
                  color="white"
                  _hover={{
                    bg: "rgba(255, 255, 255, 0.3)",
                    transform: "translateY(-2px)",
                    shadow: "lg"
                  }}
                  backdropFilter="blur(10px)"
                  border="1px solid rgba(255, 255, 255, 0.3)"
                >
                  Add {medicineCategory === 'vedic' ? 'Vedic' : medicineCategory === 'owned' ? 'Custom' : ''} Medicine
                </Button>
              </VStack>
            </Flex>
          </CardBody>
        </Card>
      </Fade>

      {/* Enhanced KPI Cards */}
      <ScaleFade in={true} initialScale={0.9}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 6 }} spacing={6} mb={6}>
          <Card 
            bg="linear-gradient(135deg, #4299e1 0%, #3182ce 100%)" 
            border="1px" 
            borderColor="transparent" 
            _hover={{ shadow: 'xl', transform: 'translateY(-4px)' }} 
            transition="all 0.3s"
            _dark={{
              bg: "linear-gradient(135deg, #2B6CB0 0%, #2C5282 100%)"
            }}
          >
            <CardBody>
              <Stat>
                <StatLabel color="white" opacity={0.9}>
                  Total Medicines
                </StatLabel>
                <StatNumber fontSize="2xl" color="white" fontWeight="bold">
                  {totalMedicines}
                </StatNumber>
                <StatHelpText>
                  <HStack>
                    <Package size={16} color="white" />
                    <Text color="white" opacity={0.8}>SKUs in inventory</Text>
                  </HStack>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card 
            bg="linear-gradient(135deg, #38b2ac 0%, #319795 100%)" 
            border="1px" 
            borderColor="transparent" 
            _hover={{ shadow: 'xl', transform: 'translateY(-4px)' }} 
            transition="all 0.3s"
            _dark={{
              bg: "linear-gradient(135deg, #2C7A7B 0%, #285E61 100%)"
            }}
          >
            <CardBody>
              <Stat>
                <StatLabel color="white" opacity={0.9}>
                  Vedic Medicines
                </StatLabel>
                <StatNumber fontSize="2xl" color="white" fontWeight="bold">
                  {vedicMedicines}
                </StatNumber>
                <StatHelpText>
                  <HStack>
                    <BookOpen size={16} color="white" />
                    <Text color="white" opacity={0.8}>Traditional formulas</Text>
                  </HStack>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card 
            bg="linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)" 
            border="1px" 
            borderColor="transparent" 
            _hover={{ shadow: 'xl', transform: 'translateY(-4px)' }} 
            transition="all 0.3s"
            _dark={{
              bg: "linear-gradient(135deg, #7C3AED 0%, #6B46C1 100%)"
            }}
          >
            <CardBody>
              <Stat>
                <StatLabel color="white" opacity={0.9}>
                  Custom Medicines
                </StatLabel>
                <StatNumber fontSize="2xl" color="white" fontWeight="bold">
                  {ownedMedicines}
                </StatNumber>
                <StatHelpText>
                  <HStack>
                    <User size={16} color="white" />
                    <Text color="white" opacity={0.8}>Doctor/Patient created</Text>
                  </HStack>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card 
            bg="linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)" 
            border="1px" 
            borderColor="transparent" 
            _hover={{ shadow: 'xl', transform: 'translateY(-4px)' }} 
            transition="all 0.3s"
            _dark={{
              bg: "linear-gradient(135deg, #EA580C 0%, #C2410C 100%)"
            }}
          >
            <CardBody>
              <Stat>
                <StatLabel color="white" opacity={0.9}>
                  Stock Alerts
                </StatLabel>
                <StatNumber fontSize="2xl" color="white" fontWeight="bold">
                  {lowStockMedicines}
                </StatNumber>
                <StatHelpText>
                  <HStack>
                    <AlertTriangle size={16} color="white" />
                    <Text color="white" opacity={0.8}>Need reordering</Text>
                  </HStack>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card 
            bg="linear-gradient(135deg, #f56565 0%, #e53e3e 100%)" 
            border="1px" 
            borderColor="transparent" 
            _hover={{ shadow: 'xl', transform: 'translateY(-4px)' }} 
            transition="all 0.3s"
            _dark={{
              bg: "linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)"
            }}
          >
            <CardBody>
              <Stat>
                <StatLabel color="white" opacity={0.9}>
                  Expired Items
                </StatLabel>
                <StatNumber fontSize="2xl" color="white" fontWeight="bold">
                  {expiredMedicines}
                </StatNumber>
                <StatHelpText>
                  <HStack>
                    <Calendar size={16} color="white" />
                    <Text color="white" opacity={0.8}>Disposal needed</Text>
                  </HStack>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card 
            bg="linear-gradient(135deg, #48bb78 0%, #38a169 100%)" 
            border="1px" 
            borderColor="transparent" 
            _hover={{ shadow: 'xl', transform: 'translateY(-4px)' }} 
            transition="all 0.3s"
            _dark={{
              bg: "linear-gradient(135deg, #059669 0%, #047857 100%)"
            }}
          >
            <CardBody>
              <Stat>
                <StatLabel color="white" opacity={0.9}>
                  Inventory Value
                </StatLabel>
                <StatNumber fontSize="2xl" color="white" fontWeight="bold">
                  ₹{totalInventoryValue.toFixed(2)}
                </StatNumber>
                <StatHelpText>
                  <HStack>
                    <DollarSign size={16} color="white" />
                    <Text color="white" opacity={0.8}>Total retail value</Text>
                  </HStack>
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>
      </ScaleFade>

      {/* Advanced Search and Filter Section */}
      <Card bg={bgColor} border="1px" borderColor={borderColor} mb={6} shadow="md">
        <CardHeader>
          <HStack justify="space-between">
            <HStack>
              <Icon as={FilterIcon} boxSize={5} color={accentColor} />
              <Text fontSize="lg" fontWeight="semibold">Search & Filters</Text>
            </HStack>
            {/* Medicine Category Switch */}
            <HStack spacing={4}>
              <Text fontSize="sm" fontWeight="medium">Medicine Category:</Text>
              <Tabs 
                variant="soft-rounded" 
                colorScheme="blue" 
                size="sm"
                index={medicineCategory === 'all' ? 0 : medicineCategory === 'vedic' ? 1 : 2}
                onChange={(index) => {
                  const categories = ['all', 'vedic', 'owned'];
                  setMedicineCategory(categories[index]);
                }}
              >
                <TabList>
                  <Tab><HStack><Icon as={Layers} boxSize={4} /><Text>All</Text></HStack></Tab>
                  <Tab><HStack><Icon as={BookOpen} boxSize={4} /><Text>Vedic</Text></HStack></Tab>
                  <Tab><HStack><Icon as={User} boxSize={4} /><Text>Custom</Text></HStack></Tab>
                </TabList>
              </Tabs>
            </HStack>
          </HStack>
        </CardHeader>
        <CardBody pt={0}>
          <VStack spacing={4}>
            <HStack spacing={4} w="full">
              <InputGroup flex={1}>
                <InputLeftElement>
                  <Search size={20} color="gray" />
                </InputLeftElement>
                <Input
                  placeholder="Search by name, batch, type, supplier, or creator..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="lg"
                />
              </InputGroup>
              <Select
                w="200px"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                size="lg"
              >
                <option value="all">All Types</option>
                <option value="churna">Churna (Powder)</option>
                <option value="capsule">Capsule</option>
                <option value="ghrita">Ghrita (Medicated Ghee)</option>
                <option value="kwath">Kwath (Decoction)</option>
                <option value="avaleha">Avaleha (Jam)</option>
                <option value="arishta">Arishta (Fermented)</option>
                <option value="taila">Taila (Oil)</option>
                <option value="vati">Vati (Tablet)</option>
                <option value="custom">Custom Formulation</option>
              </Select>
              <Select
                w="200px"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                size="lg"
              >
                <option value="all">All Status</option>
                <option value="instock">In Stock</option>
                <option value="lowstock">Low Stock</option>
                <option value="criticallow">Critical Low</option>
                <option value="expired">Expired</option>
              </Select>
              <IconButton
                icon={<RefreshCw size={20} />}
                aria-label="Refresh"
                variant="outline"
                size="lg"
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('all');
                  setFilterStatus('all');
                  setMedicineCategory('all');
                }}
              />
            </HStack>
            
            {/* Category Info Alert */}
            {medicineCategory !== 'all' && (
              <Alert status="info" variant="left-accent">
                <AlertIcon />
                <AlertTitle>
                  {medicineCategory === 'vedic' ? 'Vedic Medicines' : 'Custom Medicines'}
                </AlertTitle>
                <AlertDescription>
                  {medicineCategory === 'vedic' 
                    ? 'Showing traditional Ayurvedic formulations from classical texts and ancient knowledge.'
                    : 'Showing custom formulations created by doctors or personalized for patients.'
                  }
                </AlertDescription>
              </Alert>
            )}
          </VStack>
        </CardBody>
      </Card>

      {/* Enhanced Medicine Inventory Table */}
      <Card bg={bgColor} border="1px" borderColor={borderColor} shadow="lg">
        <CardHeader>
          <Flex justify="space-between" align="center">
            <HStack>
              <Text fontSize="lg" fontWeight="semibold">
                Medicine Inventory ({filteredMedicines.length})
              </Text>
              <Wrap>
                <WrapItem>
                  <Badge colorScheme="green" variant="solid">{medicines.filter(m => m.status === 'In Stock').length} In Stock</Badge>
                </WrapItem>
                <WrapItem>
                  <Badge colorScheme="orange" variant="solid">{lowStockMedicines} Low Stock</Badge>
                </WrapItem>
                <WrapItem>
                  <Badge colorScheme="red" variant="solid">{expiredMedicines} Expired</Badge>
                </WrapItem>
                <WrapItem>
                  <Badge colorScheme="teal" variant="outline">{vedicMedicines} Vedic</Badge>
                </WrapItem>
                <WrapItem>
                  <Badge colorScheme="purple" variant="outline">{ownedMedicines} Custom</Badge>
                </WrapItem>
              </Wrap>
            </HStack>
            <HStack spacing={3}>
              {selectedMedicines.size > 0 && (
                <Badge colorScheme="blue" variant="solid" px={3} py={2} borderRadius="md">
                  {selectedMedicines.size} selected
                </Badge>
              )}
              
              {/* Import Button with Options */}
              <Menu>
                <MenuButton as={Button} leftIcon={<Upload size={16} />} variant="outline" size="sm">
                  Import {medicineCategory === 'vedic' ? 'Vedic' : medicineCategory === 'owned' ? 'Custom' : ''} Data
                </MenuButton>
                <MenuList>
                  <MenuItem 
                    icon={<Upload size={16} />} 
                    onClick={() => handleImport('csv', medicineCategory)}
                  >
                    Import from CSV
                  </MenuItem>
                  <MenuItem 
                    icon={<Upload size={16} />} 
                    onClick={() => handleImport('excel', medicineCategory)}
                  >
                    Import from Excel
                  </MenuItem>
                </MenuList>
              </Menu>
              
              {/* Export Button with Options */}
              <Menu>
                <MenuButton as={Button} leftIcon={<Download size={16} />} variant="outline" size="sm">
                  Export Data
                </MenuButton>
                <MenuList>
                  <MenuItem 
                    icon={<Download size={16} />} 
                    onClick={() => handleExport('pdf')}
                  >
                    Export as PDF
                  </MenuItem>
                  <MenuItem 
                    icon={<Download size={16} />} 
                    onClick={() => handleExport('csv')}
                  >
                    Export as CSV
                  </MenuItem>
                  <MenuItem 
                    icon={<Download size={16} />} 
                    onClick={() => handleExport('excel')}
                  >
                    Export as Excel
                  </MenuItem>
                </MenuList>
              </Menu>
              
              {isBulkEditMode ? (
                <HStack spacing={2}>
                  <Button
                    leftIcon={<CheckCircle size={16} />}
                    colorScheme="green"
                    onClick={handleSaveBulkChanges}
                    size="sm"
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancelBulkEdit}
                    size="sm"
                  >
                    Cancel
                  </Button>
                </HStack>
              ) : (
                <Button
                  leftIcon={<Edit3 size={16} />}
                  colorScheme="purple"
                  variant="outline"
                  onClick={handleBulkEdit}
                  isDisabled={selectedMedicines.size === 0}
                  size="sm"
                >
                  Bulk Edit ({selectedMedicines.size})
                </Button>
              )}
            </HStack>
          </Flex>
          
          {isBulkEditMode && (
            <Alert status="info" mt={4} borderRadius="md">
              <AlertIcon />
              <VStack align="start" spacing={1} flex={1}>
                <AlertTitle fontSize="sm">Bulk Edit Mode Active</AlertTitle>
                <AlertDescription fontSize="xs">
                  Edit the selected medicines directly in the table. Changes are highlighted in blue. 
                  Click "Save Changes" to apply or "Cancel" to discard.
                </AlertDescription>
              </VStack>
            </Alert>
          )}
        </CardHeader>
        <CardBody pt={0}>
          <TableContainer>
            <Table variant="simple" size="md">
              <Thead bg={useColorModeValue('gray.50', 'gray.700')}>
                <Tr>
                  <Th>
                    <Checkbox
                      isChecked={selectAll}
                      isIndeterminate={selectedMedicines.size > 0 && selectedMedicines.size < filteredMedicines.length}
                      onChange={handleSelectAll}
                    />
                  </Th>
                  <Th>Medicine No.</Th>
                  <Th>Medicine Details</Th>
                  <Th>Category & Type</Th>
                  <Th>Dose</Th>
                  <Th>Dates</Th>
                  <Th>Pricing</Th>
                  <Th>Stock</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredMedicines.map((medicine) => {
                  const isEditing = isBulkEditMode && selectedMedicines.has(medicine.id);
                  const editData = editingMedicines[medicine.id] || {};
                  
                  return (
                    <Tr 
                      key={medicine.id}
                      _hover={{ bg: hoverBg }}
                      bg={selectedMedicines.has(medicine.id) ? useColorModeValue('blue.50', 'blue.900') : 'transparent'}
                      borderLeft={isEditing ? "4px solid" : "none"}
                      borderColor={isEditing ? "blue.500" : "transparent"}
                    >
                      <Td>
                        <Checkbox
                          isChecked={selectedMedicines.has(medicine.id)}
                          onChange={() => handleSelectMedicine(medicine.id)}
                          isDisabled={isBulkEditMode}
                        />
                      </Td>
                      <Td>
                        <Badge 
                          colorScheme={medicine.category === 'vedic' ? 'green' : 'purple'} 
                          fontSize="md"
                          px={3}
                          py={1}
                          borderRadius="md"
                        >
                          {medicine.medicineNumber || medicine.medicine_number || 'N/A'}
                        </Badge>
                      </Td>
                      <Td>
                        <VStack align="start" spacing={2}>
                          <HStack>
                            <Icon as={Package} boxSize={4} color="blue.500" />
                            <Text fontWeight="bold" fontSize="md">{medicine.name}</Text>
                          </HStack>
                          <Text fontSize="xs" color="gray.500">Batch: {medicine.batch}</Text>
                          {isEditing ? (
                            <VStack align="start" spacing={1} w="full">
                              <Text fontSize="xs" fontWeight="medium">Supplier:</Text>
                              <Input
                                size="xs"
                                value={editData.supplier || medicine.supplier}
                                onChange={(e) => updateEditingMedicine(medicine.id, 'supplier', e.target.value)}
                                bg="white"
                                border="2px solid"
                                borderColor="blue.300"
                              />
                            </VStack>
                          ) : (
                            <Text fontSize="xs" color="gray.500">Supplier: {medicine.supplier}</Text>
                          )}
                          {medicine.description && (
                            <Text fontSize="xs" color="gray.600" maxW="200px" isTruncated>
                              {medicine.description}
                            </Text>
                          )}
                        </VStack>
                      </Td>
                      <Td>
                        <VStack align="start" spacing={2}>
                          <Badge 
                            colorScheme={getCategoryColor(medicine.category)} 
                            variant="solid"
                            size="sm"
                          >
                            <HStack spacing={1}>
                              {getCategoryIcon(medicine.category)}
                              <Text>{medicine.category === 'owned' ? 'Custom' : 'Vedic'}</Text>
                            </HStack>
                          </Badge>
                          <Badge variant="outline" size="sm">{medicine.type}</Badge>
                          <Text fontSize="xs" color="gray.500">
                            By: {medicine.createdBy}
                          </Text>
                        </VStack>
                      </Td>
                      <Td>
                        <Tooltip label={formatDose(medicine.dose)} placement="top">
                          <VStack align="start" spacing={1}>
                            <Text fontSize="sm" fontWeight="medium" cursor="help">
                              {medicine.dose.quantity}
                            </Text>
                            <Badge size="xs" colorScheme="gray">
                              {medicine.dose.timing}
                            </Badge>
                          </VStack>
                        </Tooltip>
                      </Td>
                      <Td>
                        <VStack align="start" spacing={1}>
                          <Text fontSize="xs">MFD: {medicine.mfd}</Text>
                          <Text 
                            fontSize="xs" 
                            color={isExpiringSoon(medicine.exp) || isExpired(medicine.exp) ? 'red.500' : 'inherit'}
                            fontWeight={isExpiringSoon(medicine.exp) || isExpired(medicine.exp) ? 'bold' : 'normal'}
                          >
                            EXP: {medicine.exp}
                          </Text>
                          {isExpiringSoon(medicine.exp) && (
                            <Badge colorScheme="orange" size="xs">Expiring Soon</Badge>
                          )}
                          {isExpired(medicine.exp) && (
                            <Badge colorScheme="red" size="xs">Expired</Badge>
                          )}
                        </VStack>
                      </Td>
                      <Td>
                        {isEditing ? (
                          <VStack align="start" spacing={2}>
                            <VStack align="start" spacing={1}>
                              <Text fontSize="xs" fontWeight="medium">Unit Price:</Text>
                              <NumberInput
                                size="xs"
                                value={editData.unitPrice || medicine.unitPrice}
                                onChange={(value) => updateEditingMedicine(medicine.id, 'unitPrice', parseFloat(value) || 0)}
                                min={0}
                                precision={2}
                              >
                                <NumberInputField
                                  bg="white"
                                  border="2px solid"
                                  borderColor="blue.300"
                                />
                              </NumberInput>
                            </VStack>
                            <VStack align="start" spacing={1}>
                              <Text fontSize="xs" fontWeight="medium">Cost Price:</Text>
                              <NumberInput
                                size="xs"
                                value={editData.costPrice || medicine.costPrice}
                                onChange={(value) => updateEditingMedicine(medicine.id, 'costPrice', parseFloat(value) || 0)}
                                min={0}
                                precision={2}
                              >
                                <NumberInputField
                                  bg="white"
                                  border="2px solid"
                                  borderColor="blue.300"
                                />
                              </NumberInput>
                            </VStack>
                          </VStack>
                        ) : (
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="bold" fontSize="sm">₹{medicine.unitPrice}</Text>
                            <Text fontSize="xs" color="gray.500">Cost: ₹{medicine.costPrice}</Text>
                            <Badge size="xs" colorScheme="green">
                              Margin: {(((medicine.unitPrice - medicine.costPrice) / medicine.costPrice) * 100).toFixed(1)}%
                            </Badge>
                          </VStack>
                        )}
                      </Td>
                      <Td>
                        {isEditing ? (
                          <VStack align="start" spacing={2}>
                            <VStack align="start" spacing={1}>
                              <Text fontSize="xs" fontWeight="medium">Current Stock:</Text>
                              <NumberInput
                                size="xs"
                                value={editData.stock || medicine.stock}
                                onChange={(value) => updateEditingMedicine(medicine.id, 'stock', parseInt(value) || 0)}
                                min={0}
                              >
                                <NumberInputField
                                  bg="white"
                                  border="2px solid"
                                  borderColor="blue.300"
                                />
                              </NumberInput>
                            </VStack>
                            <HStack spacing={2}>
                              <VStack align="start" spacing={1}>
                                <Text fontSize="xs" fontWeight="medium">Min:</Text>
                                <NumberInput
                                  size="xs"
                                  value={editData.minStock || medicine.minStock}
                                  onChange={(value) => updateEditingMedicine(medicine.id, 'minStock', parseInt(value) || 0)}
                                  min={0}
                                  w="60px"
                                >
                                  <NumberInputField
                                    bg="white"
                                    border="2px solid"
                                    borderColor="blue.300"
                                  />
                                </NumberInput>
                              </VStack>
                              <VStack align="start" spacing={1}>
                                <Text fontSize="xs" fontWeight="medium">Max:</Text>
                                <NumberInput
                                  size="xs"
                                  value={editData.maxStock || medicine.maxStock}
                                  onChange={(value) => updateEditingMedicine(medicine.id, 'maxStock', parseInt(value) || 0)}
                                  min={0}
                                  w="60px"
                                >
                                  <NumberInputField
                                    bg="white"
                                    border="2px solid"
                                    borderColor="blue.300"
                                  />
                                </NumberInput>
                              </VStack>
                            </HStack>
                          </VStack>
                        ) : (
                          <VStack align="start" spacing={2}>
                            <HStack>
                              <Text 
                                fontSize="lg" 
                                fontWeight="bold"
                                color={medicine.stock < medicine.minStock ? 'red.500' : 'green.500'}
                              >
                                {medicine.stock}
                              </Text>
                              <Text fontSize="xs" color="gray.500">/ {medicine.maxStock}</Text>
                            </HStack>
                            <Progress 
                              value={getStockLevel(medicine)} 
                              size="sm" 
                              colorScheme={medicine.stock < medicine.minStock ? 'red' : 'green'}
                              w="80px"
                              borderRadius="md"
                            />
                            <Text fontSize="xs" color="gray.500">
                              Min: {medicine.minStock} | Sold: {medicine.totalSold}
                            </Text>
                          </VStack>
                        )}
                      </Td>
                      <Td>
                        <Badge 
                          colorScheme={getStatusColor(medicine.status)}
                          variant="solid"
                          size="sm"
                          px={3}
                          py={1}
                        >
                          {medicine.status}
                        </Badge>
                      </Td>
                      <Td>
                        {isEditing ? (
                          <VStack align="start" spacing={1}>
                            <Text fontSize="xs" fontWeight="medium">Location:</Text>
                            <Input
                              size="xs"
                              value={editData.location || medicine.location}
                              onChange={(e) => updateEditingMedicine(medicine.id, 'location', e.target.value)}
                              bg="white"
                              border="2px solid"
                              borderColor="blue.300"
                              placeholder="Storage location"
                            />
                          </VStack>
                        ) : (
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              icon={<MoreVertical size={16} />}
                              variant="ghost"
                              size="sm"
                              _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
                            />
                            <MenuList>
                              <MenuItem icon={<Eye size={16} />} onClick={() => handleView(medicine)}>
                                View Details
                              </MenuItem>
                              <MenuItem icon={<Edit size={16} />} onClick={() => handleEdit(medicine)}>
                                Edit Medicine
                              </MenuItem>
                              <MenuItem icon={<ShoppingCart size={16} />} onClick={() => handleStockUpdate(medicine)}>
                                Update Stock
                              </MenuItem>
                              <MenuItem icon={<BarChart3 size={16} />}>
                                View Analytics
                              </MenuItem>
                              <MenuItem icon={<Archive size={16} />}>
                                Archive Medicine
                              </MenuItem>
                              <Divider />
                              <MenuItem 
                                icon={<Trash2 size={16} />} 
                                color="red.500"
                                onClick={() => handleDelete(medicine.id)}
                              >
                                Delete Medicine
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        )}
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>

          {filteredMedicines.length === 0 && (
            <Center py={20}>
              <VStack spacing={4}>
                <Icon as={Package} boxSize={16} color="gray.300" />
                <Text fontSize="xl" color="gray.500" fontWeight="medium">
                  No medicines found
                </Text>
                <Text fontSize="md" color="gray.400" textAlign="center">
                  {medicineCategory !== 'all' 
                    ? `No ${medicineCategory} medicines match your search criteria`
                    : 'Try adjusting your search or filter criteria'
                  }
                </Text>
                <Button 
                  leftIcon={<Plus size={16} />} 
                  colorScheme="blue" 
                  onClick={onAddOpen}
                  mt={4}
                >
                  Add First Medicine
                </Button>
              </VStack>
            </Center>
          )}
        </CardBody>
      </Card>

      {/* View Medicine Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Medicine Inventory Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedMedicine && (
              <VStack spacing={4} align="stretch">
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <FormControl>
                    <FormLabel>Medicine Name</FormLabel>
                    <Text fontWeight="medium">{selectedMedicine.name}</Text>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Type</FormLabel>
                    <Badge>{selectedMedicine.type}</Badge>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Batch Number</FormLabel>
                    <Text>{selectedMedicine.batch}</Text>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Supplier</FormLabel>
                    <Text>{selectedMedicine.supplier}</Text>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Current Stock</FormLabel>
                    <Text fontWeight="medium">{selectedMedicine.stock} units</Text>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Stock Status</FormLabel>
                    <Badge colorScheme={getStatusColor(selectedMedicine.status)}>
                      {selectedMedicine.status}
                    </Badge>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Manufacturing Date</FormLabel>
                    <Text>{selectedMedicine.mfd}</Text>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Expiry Date</FormLabel>
                    <Text>{selectedMedicine.exp}</Text>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Unit Price</FormLabel>
                    <Text fontWeight="medium">₹{selectedMedicine.unitPrice}</Text>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Cost Price</FormLabel>
                    <Text>₹{selectedMedicine.costPrice}</Text>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Storage Location</FormLabel>
                    <Text>{selectedMedicine.location}</Text>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Total Sold</FormLabel>
                    <Text>{selectedMedicine.totalSold} units</Text>
                  </FormControl>
                </Grid>
                <Divider />
                <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                  <FormControl>
                    <FormLabel>Minimum Stock</FormLabel>
                    <Text color="orange.500">{selectedMedicine.minStock} units</Text>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Maximum Stock</FormLabel>
                    <Text color="green.500">{selectedMedicine.maxStock} units</Text>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Stock Level</FormLabel>
                    <Progress 
                      value={getStockLevel(selectedMedicine)} 
                      colorScheme={selectedMedicine.stock < selectedMedicine.minStock ? 'red' : 'green'}
                    />
                  </FormControl>
                </Grid>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button 
              colorScheme="blue" 
              leftIcon={<Edit size={16} />}
              onClick={() => {
                onClose();
                handleEdit(selectedMedicine);
              }}
            >
              Edit Medicine
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add/Edit Medicine Modal */}
      <Modal isOpen={isAddOpen} onClose={onAddClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedMedicine ? 'Edit Medicine' : `Add New ${medicineCategory === 'vedic' ? 'Vedic' : medicineCategory === 'owned' ? 'Custom' : ''} Medicine to Inventory`}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {medicineCategory !== 'all' && (
              <Alert status="info" mb={4} borderRadius="md">
                <AlertIcon />
                <VStack align="start" spacing={1} flex={1}>
                  <AlertTitle fontSize="sm">
                    {medicineCategory === 'vedic' ? 'Adding Vedic Medicine' : 'Adding Custom Medicine'}
                  </AlertTitle>
                  <AlertDescription fontSize="xs">
                    {medicineCategory === 'vedic' 
                      ? 'This medicine will be categorized as a traditional Vedic formulation from classical texts.'
                      : 'This medicine will be categorized as a custom formulation created by doctor or for specific patient.'
                    }
                  </AlertDescription>
                </VStack>
              </Alert>
            )}
            
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <FormControl>
                <FormLabel>Medicine Number</FormLabel>
                <Input 
                  placeholder={medicineCategory === 'vedic' ? 'e.g., VED-001' : medicineCategory === 'owned' ? 'e.g., CUST-001' : 'e.g., VED-001 or CUST-001'} 
                />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Suggested format: {medicineCategory === 'vedic' ? 'VED-XXX' : medicineCategory === 'owned' ? 'CUST-XXX' : 'VED-XXX for Vedic, CUST-XXX for Custom'}
                </Text>
              </FormControl>
              
              <FormControl>
                <FormLabel>Medicine Name *</FormLabel>
                <Input placeholder="Enter medicine name" />
              </FormControl>
              
              {medicineCategory === 'all' && (
                <FormControl>
                  <FormLabel>Category *</FormLabel>
                  <Select placeholder="Select category">
                    <option value="vedic">Vedic Medicine</option>
                    <option value="owned">Custom Medicine</option>
                  </Select>
                </FormControl>
              )}
              
              <FormControl>
                <FormLabel>Type *</FormLabel>
                <Select placeholder="Select type">
                  {medicineCategory === 'vedic' || medicineCategory === 'all' ? (
                    <>
                      <option value="churna">Churna (Powder)</option>
                      <option value="ghrita">Ghrita (Medicated Ghee)</option>
                      <option value="kwath">Kwath (Decoction)</option>
                      <option value="avaleha">Avaleha (Jam)</option>
                      <option value="arishta">Arishta (Fermented)</option>
                      <option value="taila">Taila (Oil)</option>
                      <option value="vati">Vati (Tablet)</option>
                    </>
                  ) : null}
                  {medicineCategory === 'owned' || medicineCategory === 'all' ? (
                    <>
                      <option value="capsule">Capsule</option>
                      <option value="custom">Custom Formulation</option>
                      <option value="tablet">Tablet</option>
                      <option value="syrup">Syrup</option>
                      <option value="powder">Powder Mix</option>
                    </>
                  ) : null}
                </Select>
              </FormControl>
              
              {medicineCategory === 'vedic' && (
                <FormControl>
                  <FormLabel>Source Text/Reference</FormLabel>
                  <Input placeholder="e.g., Charaka Samhita, Sushruta Samhita" />
                </FormControl>
              )}
              
              {medicineCategory === 'owned' && (
                <FormControl>
                  <FormLabel>Created By *</FormLabel>
                  <Select placeholder="Select creator">
                    <option value="doctor">Doctor/Practitioner</option>
                    <option value="patient">Patient Specific</option>
                    <option value="clinic">Clinic Formulation</option>
                  </Select>
                </FormControl>
              )}
              
              <FormControl>
                <FormLabel>Dose Quantity *</FormLabel>
                <Input placeholder="e.g., 5g, 10ml, 2 tablets" />
              </FormControl>
              <FormControl>
                <FormLabel>Timing *</FormLabel>
                <Select placeholder="Select timing">
                  <option value="A-0-A">After-None-After</option>
                  <option value="B-B-B">Before-Before-Before</option>
                  <option value="A-A-A">After-After-After</option>
                  <option value="M-0-M">Middle-None-Middle</option>
                  <option value="A-0-0">After-None-None</option>
                  <option value="0-A-0">None-After-None</option>
                  <option value="0-0-A">None-None-After</option>
                  <option value="0-0-0">External Use Only</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Batch Number *</FormLabel>
                <Input placeholder="e.g., TRP2024001" />
              </FormControl>
              <FormControl>
                <FormLabel>Supplier *</FormLabel>
                <Input placeholder="Enter supplier name" />
              </FormControl>
              <FormControl>
                <FormLabel>Manufacturing Date *</FormLabel>
                <Input type="date" />
              </FormControl>
              <FormControl>
                <FormLabel>Expiry Date *</FormLabel>
                <Input type="date" />
              </FormControl>
              <FormControl>
                <FormLabel>Cost Price *</FormLabel>
                <NumberInput min={0} precision={2}>
                  <NumberInputField placeholder="0.00" />
                </NumberInput>
              </FormControl>
              <FormControl>
                <FormLabel>Unit Price *</FormLabel>
                <NumberInput min={0} precision={2}>
                  <NumberInputField placeholder="0.00" />
                </NumberInput>
              </FormControl>
              <FormControl>
                <FormLabel>Initial Stock *</FormLabel>
                <NumberInput min={0}>
                  <NumberInputField placeholder="0" />
                </NumberInput>
              </FormControl>
              <FormControl>
                <FormLabel>Minimum Stock Level *</FormLabel>
                <NumberInput min={0}>
                  <NumberInputField placeholder="0" />
                </NumberInput>
              </FormControl>
              <FormControl>
                <FormLabel>Maximum Stock Level *</FormLabel>
                <NumberInput min={0}>
                  <NumberInputField placeholder="0" />
                </NumberInput>
              </FormControl>
              <FormControl>
                <FormLabel>Storage Location</FormLabel>
                <Input placeholder="e.g., Rack A-1" />
              </FormControl>
            </Grid>
            
            {medicineCategory === 'vedic' && (
              <FormControl mt={4}>
                <FormLabel>Traditional Properties</FormLabel>
                <Textarea placeholder="Enter traditional properties like Rasa, Guna, Virya, Prabhava etc." />
              </FormControl>
            )}
            
            <FormControl mt={4}>
              <FormLabel>
                {medicineCategory === 'vedic' ? 'Traditional Uses & Description' : 'Notes & Description'}
              </FormLabel>
              <Textarea placeholder={
                medicineCategory === 'vedic' 
                  ? "Traditional uses, indications, and classical references"
                  : "Additional notes about the medicine (optional)"
              } />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onAddClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">
              {selectedMedicine ? 'Update Medicine' : `Add to ${medicineCategory === 'vedic' ? 'Vedic' : medicineCategory === 'owned' ? 'Custom' : ''} Inventory`}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Stock Update Modal */}
      <Modal isOpen={isStockOpen} onClose={onStockClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Stock Level</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedMedicine && (
              <VStack spacing={4} align="stretch">
                <Text fontWeight="medium" fontSize="lg">
                  {selectedMedicine.name}
                </Text>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <FormControl>
                    <FormLabel>Current Stock</FormLabel>
                    <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                      {selectedMedicine.stock} units
                    </Text>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Stock Status</FormLabel>
                    <Badge colorScheme={getStatusColor(selectedMedicine.status)} fontSize="md" p={2}>
                      {selectedMedicine.status}
                    </Badge>
                  </FormControl>
                </Grid>
                <Divider />
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <FormControl>
                    <FormLabel>Add Stock</FormLabel>
                    <NumberInput min={0}>
                      <NumberInputField placeholder="Enter quantity to add" />
                    </NumberInput>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Remove Stock</FormLabel>
                    <NumberInput min={0} max={selectedMedicine.stock}>
                      <NumberInputField placeholder="Enter quantity to remove" />
                    </NumberInput>
                  </FormControl>
                </Grid>
                <FormControl>
                  <FormLabel>Reason for Stock Update</FormLabel>
                  <Select placeholder="Select reason">
                    <option value="purchase">New Purchase</option>
                    <option value="return">Customer Return</option>
                    <option value="sale">Sale/Dispensed</option>
                    <option value="expired">Expired/Disposed</option>
                    <option value="damaged">Damaged</option>
                    <option value="audit">Stock Audit Adjustment</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Notes</FormLabel>
                  <Textarea placeholder="Additional notes about this stock update" />
                </FormControl>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onStockClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">
              Update Stock
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Box>
  );
};

export default MedicineInventoryManagement;
