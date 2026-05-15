import React, { useState } from 'react';
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
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  SimpleGrid,
  Avatar,
  Divider,
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
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Tooltip,
  Icon,
  chakra,
  Skeleton,
  SkeletonText
} from '@chakra-ui/react';
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Eye,
  Package,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  ShoppingCart,
  Pill,
  Thermometer,
  Stethoscope,
  Calendar,
  Download,
  Upload,
  Edit,
  Trash2,
  BarChart3,
  Zap,
  Heart,
  Activity,
  Users,
  DollarSign,
  Target,
  Layers,
  RefreshCw,
  Bell,
  Settings,
  Star
} from 'lucide-react';

// Mock inventory data
export const mockInventoryItems = [
  {
    id: 'INV001',
    name: 'Triphala Tablets',
    category: 'Ayurvedic Medicine',
    subcategory: 'Digestive Health',
    currentStock: 45,
    minStock: 50,
    maxStock: 200,
    unit: 'Bottles',
    unitPrice: 250,
    totalValue: 11250,
    supplier: 'Himalaya Wellness',
    expiryDate: '2025-06-15',
    batchNumber: 'TRP001',
    location: 'Pharmacy-A1',
    status: 'Low Stock'
  },
  {
    id: 'INV002',
    name: 'Ashwagandha Capsules',
    category: 'Ayurvedic Medicine',
    subcategory: 'Immunity Booster',
    currentStock: 120,
    minStock: 30,
    maxStock: 150,
    unit: 'Bottles',
    unitPrice: 450,
    totalValue: 54000,
    supplier: 'Patanjali Ayurved',
    expiryDate: '2025-12-20',
    batchNumber: 'ASH002',
    location: 'Pharmacy-B2',
    status: 'In Stock'
  },
  {
    id: 'INV003',
    name: 'Digital Blood Pressure Monitor',
    category: 'Medical Equipment',
    subcategory: 'Diagnostic Tools',
    currentStock: 8,
    minStock: 5,
    maxStock: 15,
    unit: 'Units',
    unitPrice: 2500,
    totalValue: 20000,
    supplier: 'Omron Healthcare',
    expiryDate: null,
    batchNumber: 'BPM003',
    location: 'Equipment-C1',
    status: 'In Stock'
  },
  {
    id: 'INV004',
    name: 'Brahmi Oil',
    category: 'Panchakarma Supplies',
    subcategory: 'Massage Oils',
    currentStock: 25,
    minStock: 20,
    maxStock: 100,
    unit: 'Bottles',
    unitPrice: 180,
    totalValue: 4500,
    supplier: 'Kottakkal Arya Vaidya Sala',
    expiryDate: '2025-03-10',
    batchNumber: 'BRM004',
    location: 'Therapy-D1',
    status: 'In Stock'
  },
  {
    id: 'INV005',
    name: 'Disposable Syringes (5ml)',
    category: 'Medical Supplies',
    subcategory: 'Consumables',
    currentStock: 15,
    minStock: 100,
    maxStock: 500,
    unit: 'Boxes',
    unitPrice: 150,
    totalValue: 2250,
    supplier: 'BD Medical',
    expiryDate: '2026-01-15',
    batchNumber: 'SYR005',
    location: 'Supplies-E1',
    status: 'Critical'
  },
  {
    id: 'INV006',
    name: 'Chyawanprash',
    category: 'Ayurvedic Medicine',
    subcategory: 'General Health',
    currentStock: 0,
    minStock: 25,
    maxStock: 75,
    unit: 'Bottles',
    unitPrice: 320,
    totalValue: 0,
    supplier: 'Dabur India',
    expiryDate: null,
    batchNumber: null,
    location: 'Pharmacy-A3',
    status: 'Out of Stock'
  }
];

const mockMovements = [
  {
    id: 'MOV001',
    item: 'Triphala Tablets',
    type: 'Outgoing',
    quantity: 5,
    reason: 'Patient Prescription',
    date: '2024-12-15',
    time: '14:30',
    handledBy: 'Dr. Priya Sharma',
    reference: 'PRES001'
  },
  {
    id: 'MOV002',
    item: 'Ashwagandha Capsules',
    type: 'Incoming',
    quantity: 50,
    reason: 'Stock Replenishment',
    date: '2024-12-15',
    time: '10:00',
    handledBy: 'Pharmacy Staff',
    reference: 'PO001'
  },
  {
    id: 'MOV003',
    item: 'Disposable Syringes (5ml)',
    type: 'Outgoing',
    quantity: 20,
    reason: 'Treatment Usage',
    date: '2024-12-14',
    time: '16:45',
    handledBy: 'Nurse Ravi Kumar',
    reference: 'TREAT001'
  }
];

// Mock supplier data with categories
const mockSuppliers = [
  // Company - Patient Product Suppliers
  {
    id: 'SUP001',
    name: 'Himalaya Wellness',
    category: 'company',
    subcategory: 'patient product supplier',
    type: 'Pharmaceutical Company',
    contact: '+91 98765 43210',
    email: 'contact@himalayawellness.com',
    address: 'Bangalore, Karnataka',
    itemsSupplied: 8,
    totalValue: 125000,
    rating: 4.5,
    reliabilityScore: 95,
    lastOrderDate: '2024-12-10',
    paymentTerms: 'Net 30',
    minimumOrder: 50000
  },
  {
    id: 'SUP002',
    name: 'Patanjali Ayurved',
    category: 'company',
    subcategory: 'patient product supplier',
    type: 'Ayurvedic Company',
    contact: '+91 98765 43211',
    email: 'orders@patanjali.com',
    address: 'Haridwar, Uttarakhand',
    itemsSupplied: 12,
    totalValue: 180000,
    rating: 4.2,
    reliabilityScore: 88,
    lastOrderDate: '2024-12-08',
    paymentTerms: 'Net 15',
    minimumOrder: 25000
  },
  {
    id: 'SUP003',
    name: 'Omron Healthcare',
    category: 'company',
    subcategory: 'patient product supplier',
    type: 'Medical Equipment',
    contact: '+91 98765 43212',
    email: 'sales@omron.co.in',
    address: 'Gurgaon, Haryana',
    itemsSupplied: 5,
    totalValue: 95000,
    rating: 4.7,
    reliabilityScore: 98,
    lastOrderDate: '2024-12-05',
    paymentTerms: 'Net 45',
    minimumOrder: 75000
  },
  
  // Company - Raw Product Suppliers
  {
    id: 'SUP004',
    name: 'Ayurvedic Herbs Ltd',
    category: 'company',
    subcategory: 'raw product supplier',
    type: 'Raw Materials',
    contact: '+91 98765 43213',
    email: 'bulk@ayurvedicherbs.com',
    address: 'Kerala, India',
    itemsSupplied: 15,
    totalValue: 220000,
    rating: 4.3,
    reliabilityScore: 92,
    lastOrderDate: '2024-12-12',
    paymentTerms: 'Net 30',
    minimumOrder: 100000
  },
  {
    id: 'SUP005',
    name: 'Natural Extracts Co.',
    category: 'company',
    subcategory: 'raw product supplier',
    type: 'Herbal Extracts',
    contact: '+91 98765 43214',
    email: 'info@naturalextracts.in',
    address: 'Pune, Maharashtra',
    itemsSupplied: 10,
    totalValue: 150000,
    rating: 4.1,
    reliabilityScore: 85,
    lastOrderDate: '2024-12-07',
    paymentTerms: 'Net 60',
    minimumOrder: 80000
  },
  
  // Farmer - Own Product
  {
    id: 'SUP006',
    name: 'Organic Farms Collective',
    category: 'farmer',
    subcategory: 'own product',
    type: 'Organic Herbs',
    contact: '+91 98765 43215',
    email: 'harvest@organicfarms.in',
    address: 'Rishikesh, Uttarakhand',
    itemsSupplied: 6,
    totalValue: 45000,
    rating: 4.4,
    reliabilityScore: 90,
    lastOrderDate: '2024-12-09',
    paymentTerms: 'Net 15',
    minimumOrder: 15000
  },
  {
    id: 'SUP007',
    name: 'Krishna Herbal Farm',
    category: 'farmer',
    subcategory: 'own product',
    type: 'Fresh Herbs',
    contact: '+91 98765 43216',
    email: 'krishna@herbalfarm.com',
    address: 'Vrindavan, Uttar Pradesh',
    itemsSupplied: 4,
    totalValue: 32000,
    rating: 4.6,
    reliabilityScore: 93,
    lastOrderDate: '2024-12-11',
    paymentTerms: 'Cash on Delivery',
    minimumOrder: 10000
  },
  
  // Farmer - Other's Product
  {
    id: 'SUP008',
    name: 'Regional Herb Traders',
    category: 'farmer',
    subcategory: "other's product",
    type: 'Herb Distributor',
    contact: '+91 98765 43217',
    email: 'trade@regionalherbtraders.in',
    address: 'Nashik, Maharashtra',
    itemsSupplied: 8,
    totalValue: 65000,
    rating: 3.8,
    reliabilityScore: 78,
    lastOrderDate: '2024-12-06',
    paymentTerms: 'Net 30',
    minimumOrder: 20000
  },
  
  // Self
  {
    id: 'SUP009',
    name: 'Hospital Pharmacy',
    category: 'self',
    subcategory: 'internal production',
    type: 'In-house Manufacturing',
    contact: 'Internal',
    email: 'pharmacy@hospital.com',
    address: 'Hospital Campus',
    itemsSupplied: 3,
    totalValue: 25000,
    rating: 5.0,
    reliabilityScore: 100,
    lastOrderDate: '2024-12-13',
    paymentTerms: 'Internal',
    minimumOrder: 0
  },
  
  // Other
  {
    id: 'SUP010',
    name: 'Emergency Medical Supplies',
    category: 'other',
    subcategory: 'emergency supplier',
    type: 'Emergency/Urgent',
    contact: '+91 98765 43219',
    email: 'urgent@emergencymed.com',
    address: 'Multiple Locations',
    itemsSupplied: 2,
    totalValue: 18000,
    rating: 3.9,
    reliabilityScore: 82,
    lastOrderDate: '2024-12-04',
    paymentTerms: 'Advance Payment',
    minimumOrder: 5000
  }
];

const Inventory = ({ title = "Inventory Management", showAddButton = true }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState(0);
  const [selectedView, setSelectedView] = useState('grid'); // 'grid' or 'table'
  const [isLoading, setIsLoading] = useState(false);
  const [supplierCategoryFilter, setSupplierCategoryFilter] = useState('all');
  
  // Modal states
  const addItemModal = useDisclosure();
  const viewItemModal = useDisclosure();
  const stockModal = useDisclosure();
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Form states
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'ayurvedic medicine',
    subcategory: '',
    currentStock: 0,
    minStock: 0,
    maxStock: 100,
    unitPrice: 0,
    supplier: '',
    expiryDate: '',
    location: ''
  });
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const textSecondary = useColorModeValue('gray.600', 'gray.400');

  // Filter inventory items
  const filteredItems = mockInventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.batchNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category.toLowerCase() === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status.toLowerCase().replace(' ', '') === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate statistics
  const totalItems = mockInventoryItems.length;
  const lowStockItems = mockInventoryItems.filter(item => item.currentStock <= item.minStock).length;
  const outOfStockItems = mockInventoryItems.filter(item => item.currentStock === 0).length;
  const totalValue = mockInventoryItems.reduce((sum, item) => sum + item.totalValue, 0);
  const criticalItems = mockInventoryItems.filter(item => item.status === 'Critical').length;

  // Get expiring items (within 60 days)
  const expiringItems = mockInventoryItems.filter(item => {
    if (!item.expiryDate) return false;
    const expiryDate = new Date(item.expiryDate);
    const today = new Date();
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 60 && diffDays > 0;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'in stock': return 'green';
      case 'low stock': return 'yellow';
      case 'critical': return 'red';
      case 'out of stock': return 'red';
      default: return 'gray';
    }
  };

  const getStockPercentage = (current, max) => {
    return (current / max) * 100;
  };

  const getStockColor = (current, min, max) => {
    const percentage = (current / max) * 100;
    if (current === 0) return 'red';
    if (current <= min) return 'red';
    if (percentage <= 30) return 'yellow';
    return 'green';
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <Box p={6} bg={useColorModeValue('gray.50', 'gray.900')} minH="100vh">
      {/* Enhanced Header */}
      <Card mb={6} shadow="xl" borderRadius="2xl" bg="gradient-to-r" bgGradient="linear(to-r, blue.600, purple.600)">
        <CardBody p={8}>
          <Flex justify="space-between" align="center" color="white">
            <Box>
              <HStack spacing={3} mb={2}>
                <Icon as={Package} boxSize={8} />
                <Text fontSize="3xl" fontWeight="bold">
                  {title}
                </Text>
              </HStack>
              <Text fontSize="lg" opacity={0.9}>
                Smart inventory management with real-time tracking
              </Text>
              <HStack spacing={4} mt={3}>
                <Badge colorScheme="whiteAlpha" variant="solid" px={3} py={1}>
                  <HStack spacing={1}>
                    <Icon as={Activity} boxSize={3} />
                    <Text>Live Updates</Text>
                  </HStack>
                </Badge>
                <Badge colorScheme="whiteAlpha" variant="solid" px={3} py={1}>
                  <HStack spacing={1}>
                    <Icon as={Bell} boxSize={3} />
                    <Text>Smart Alerts</Text>
                  </HStack>
                </Badge>
              </HStack>
            </Box>
            {showAddButton && (
              <VStack spacing={3}>
                <HStack spacing={3}>
                  <Button 
                    leftIcon={<RefreshCw />} 
                    variant="outline" 
                    colorScheme="whiteAlpha"
                    _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                    transition="all 0.2s"
                  >
                    Sync Data
                  </Button>
                  <Button 
                    leftIcon={<Download />} 
                    variant="outline" 
                    colorScheme="whiteAlpha"
                    _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                    transition="all 0.2s"
                  >
                    Import
                  </Button>
                  <Button 
                    leftIcon={<Upload />} 
                    variant="outline" 
                    colorScheme="whiteAlpha"
                    _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                    transition="all 0.2s"
                  >
                    Export
                  </Button>
                </HStack>
                <Button 
                  colorScheme="yellow" 
                  leftIcon={<Plus />} 
                  size="lg"
                  _hover={{ transform: 'translateY(-2px)', shadow: 'xl' }}
                  transition="all 0.2s"
                  onClick={addItemModal.onOpen}
                  px={8}
                >
                  Add New Item
                </Button>
              </VStack>
            )}
          </Flex>
        </CardBody>
      </Card>

      {/* Enhanced Statistics Cards */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(5, 1fr)' }} gap={6} mb={8}>
        <Card 
          bg="gradient-to-br" 
          bgGradient="linear(to-br, blue.400, blue.600)" 
          color="white" 
          shadow="xl" 
          borderRadius="2xl"
          _hover={{ transform: 'translateY(-4px)', shadow: '2xl' }}
          transition="all 0.3s"
          cursor="pointer"
        >
          <CardBody p={6}>
            <HStack justify="space-between">
              <Box>
                <Text fontSize="sm" opacity={0.9} mb={1}>Total Items</Text>
                <Text fontSize="3xl" fontWeight="bold" mb={1}>{totalItems}</Text>
                <HStack spacing={2}>
                  <Icon as={Package} boxSize={4} />
                  <Text fontSize="sm" opacity={0.8}>Active inventory</Text>
                </HStack>
              </Box>
              <Box p={3} bg="whiteAlpha.200" borderRadius="xl">
                <Icon as={Layers} boxSize={8} />
              </Box>
            </HStack>
          </CardBody>
        </Card>
        
        <Card 
          bg="gradient-to-br" 
          bgGradient="linear(to-br, yellow.400, orange.500)" 
          color="white" 
          shadow="xl" 
          borderRadius="2xl"
          _hover={{ transform: 'translateY(-4px)', shadow: '2xl' }}
          transition="all 0.3s"
          cursor="pointer"
        >
          <CardBody p={6}>
            <HStack justify="space-between">
              <Box>
                <Text fontSize="sm" opacity={0.9} mb={1}>Low Stock</Text>
                <Text fontSize="3xl" fontWeight="bold" mb={1}>{lowStockItems}</Text>
                <HStack spacing={2}>
                  <Icon as={TrendingDown} boxSize={4} />
                  <Text fontSize="sm" opacity={0.8}>Need reorder</Text>
                </HStack>
              </Box>
              <Box p={3} bg="whiteAlpha.200" borderRadius="xl">
                <Icon as={AlertTriangle} boxSize={8} />
              </Box>
            </HStack>
          </CardBody>
        </Card>
        
        <Card 
          bg="gradient-to-br" 
          bgGradient="linear(to-br, red.400, red.600)" 
          color="white" 
          shadow="xl" 
          borderRadius="2xl"
          _hover={{ transform: 'translateY(-4px)', shadow: '2xl' }}
          transition="all 0.3s"
          cursor="pointer"
        >
          <CardBody p={6}>
            <HStack justify="space-between">
              <Box>
                <Text fontSize="sm" opacity={0.9} mb={1}>Critical</Text>
                <Text fontSize="3xl" fontWeight="bold" mb={1}>{criticalItems + outOfStockItems}</Text>
                <HStack spacing={2}>
                  <Icon as={Zap} boxSize={4} />
                  <Text fontSize="sm" opacity={0.8}>Urgent action</Text>
                </HStack>
              </Box>
              <Box p={3} bg="whiteAlpha.200" borderRadius="xl">
                <Icon as={Heart} boxSize={8} />
              </Box>
            </HStack>
          </CardBody>
        </Card>
        
        <Card 
          bg="gradient-to-br" 
          bgGradient="linear(to-br, purple.400, purple.600)" 
          color="white" 
          shadow="xl" 
          borderRadius="2xl"
          _hover={{ transform: 'translateY(-4px)', shadow: '2xl' }}
          transition="all 0.3s"
          cursor="pointer"
        >
          <CardBody p={6}>
            <HStack justify="space-between">
              <Box>
                <Text fontSize="sm" opacity={0.9} mb={1}>Expiring Soon</Text>
                <Text fontSize="3xl" fontWeight="bold" mb={1}>{expiringItems.length}</Text>
                <HStack spacing={2}>
                  <Icon as={Clock} boxSize={4} />
                  <Text fontSize="sm" opacity={0.8}>Within 60 days</Text>
                </HStack>
              </Box>
              <Box p={3} bg="whiteAlpha.200" borderRadius="xl">
                <Icon as={Calendar} boxSize={8} />
              </Box>
            </HStack>
          </CardBody>
        </Card>
        
        <Card 
          bg="gradient-to-br" 
          bgGradient="linear(to-br, green.400, green.600)" 
          color="white" 
          shadow="xl" 
          borderRadius="2xl"
          _hover={{ transform: 'translateY(-4px)', shadow: '2xl' }}
          transition="all 0.3s"
          cursor="pointer"
        >
          <CardBody p={6}>
            <HStack justify="space-between">
              <Box>
                <Text fontSize="sm" opacity={0.9} mb={1}>Total Value</Text>
                <Text fontSize="2xl" fontWeight="bold" mb={1}>{formatCurrency(totalValue)}</Text>
                <HStack spacing={2}>
                  <Icon as={TrendingUp} boxSize={4} />
                  <Text fontSize="sm" opacity={0.8}>Inventory worth</Text>
                </HStack>
              </Box>
              <Box p={3} bg="whiteAlpha.200" borderRadius="xl">
                <Icon as={DollarSign} boxSize={8} />
              </Box>
            </HStack>
          </CardBody>
        </Card>
      </Grid>

      {/* Enhanced Alerts Section */}
      {(lowStockItems > 0 || outOfStockItems > 0 || expiringItems.length > 0) && (
        <Grid templateColumns={{ base: '1fr', lg: 'repeat(3, 1fr)' }} gap={4} mb={8}>
          {outOfStockItems > 0 && (
            <Alert 
              status="error" 
              borderRadius="xl" 
              p={4}
              border="1px solid"
              borderColor="red.200"
              bg="red.50"
              _dark={{ bg: 'red.900', borderColor: 'red.700' }}
            >
              <AlertIcon boxSize={6} />
              <Box>
                <AlertTitle fontSize="sm" mb={1}>Out of Stock!</AlertTitle>
                <AlertDescription fontSize="xs">
                  {outOfStockItems} item(s) need immediate replenishment
                </AlertDescription>
              </Box>
            </Alert>
          )}
          
          {criticalItems > 0 && (
            <Alert 
              status="warning" 
              borderRadius="xl" 
              p={4}
              border="1px solid"
              borderColor="orange.200"
              bg="orange.50"
              _dark={{ bg: 'orange.900', borderColor: 'orange.700' }}
            >
              <AlertIcon boxSize={6} />
              <Box>
                <AlertTitle fontSize="sm" mb={1}>Critical Stock!</AlertTitle>
                <AlertDescription fontSize="xs">
                  {criticalItems} item(s) at critical levels
                </AlertDescription>
              </Box>
            </Alert>
          )}
          
          {expiringItems.length > 0 && (
            <Alert 
              status="info" 
              borderRadius="xl" 
              p={4}
              border="1px solid"
              borderColor="blue.200"
              bg="blue.50"
              _dark={{ bg: 'blue.900', borderColor: 'blue.700' }}
            >
              <AlertIcon boxSize={6} />
              <Box>
                <AlertTitle fontSize="sm" mb={1}>Expiry Alert!</AlertTitle>
                <AlertDescription fontSize="xs">
                  {expiringItems.length} item(s) expiring soon
                </AlertDescription>
              </Box>
            </Alert>
          )}
        </Grid>
      )}

      {/* Enhanced Main Content */}
      <Card bg={cardBg} shadow="2xl" borderRadius="2xl" overflow="hidden">
        <CardHeader bg={useColorModeValue('gray.50', 'gray.800')} py={4}>
          <Flex justify="space-between" align="center">
            <Text fontSize="xl" fontWeight="bold">
              Inventory Dashboard
            </Text>
            <HStack spacing={2}>
              <Badge colorScheme="blue" px={3} py={1}>
                <HStack spacing={1}>
                  <Icon as={Package} boxSize={3} />
                  <Text fontSize="sm">Table View</Text>
                </HStack>
              </Badge>
            </HStack>
          </Flex>
        </CardHeader>
        <CardBody p={6}>
          <Tabs 
            index={activeTab} 
            onChange={setActiveTab} 
            variant="soft-rounded" 
            colorScheme="blue"
            size="lg"
          >
            <TabList mb={6} bg={useColorModeValue('gray.100', 'gray.700')} p={2} borderRadius="xl">
              <Tab _selected={{ bg: 'blue.500', color: 'white' }} fontWeight="semibold">
                <HStack spacing={2}>
                  <Icon as={Package} boxSize={4} />
                  <Text>Items</Text>
                </HStack>
              </Tab>
              <Tab _selected={{ bg: 'blue.500', color: 'white' }} fontWeight="semibold">
                <HStack spacing={2}>
                  <Icon as={Activity} boxSize={4} />
                  <Text>Movements</Text>
                </HStack>
              </Tab>
              <Tab _selected={{ bg: 'blue.500', color: 'white' }} fontWeight="semibold">
                <HStack spacing={2}>
                  <Icon as={BarChart3} boxSize={4} />
                  <Text>Analytics</Text>
                </HStack>
              </Tab>
              <Tab _selected={{ bg: 'blue.500', color: 'white' }} fontWeight="semibold">
                <HStack spacing={2}>
                  <Icon as={Users} boxSize={4} />
                  <Text>Suppliers</Text>
                </HStack>
              </Tab>
            </TabList>
            
            <TabPanels>
              {/* Enhanced Inventory Items Tab */}
              <TabPanel p={0}>
                {/* Enhanced Filters */}
                <Card mb={6} bg={useColorModeValue('blue.50', 'blue.900')} borderRadius="xl">
                  <CardBody p={4}>
                    <Grid templateColumns={{ base: '1fr', md: '2fr 1fr 1fr auto' }} gap={4} alignItems="end">
                      <FormControl>
                        <FormLabel fontSize="sm" color={textSecondary} mb={2}>Search Inventory</FormLabel>
                        <HStack bg="white" borderRadius="lg" px={4} py={2} border="1px solid" borderColor="gray.200">
                          <Icon as={Search} color="gray.400" boxSize={5} />
                          <Input
                            placeholder="Search items, batch, supplier..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            variant="unstyled"
                            size="sm"
                          />
                        </HStack>
                      </FormControl>
                      
                      <FormControl>
                        <FormLabel fontSize="sm" color={textSecondary} mb={2}>Category</FormLabel>
                        <Select
                          size="md"
                          value={categoryFilter}
                          onChange={(e) => setCategoryFilter(e.target.value)}
                          bg="white"
                          borderRadius="lg"
                        >
                          <option value="all">All Categories</option>
                          <option value="ayurvedic medicine">Ayurvedic Medicine</option>
                          <option value="medical equipment">Medical Equipment</option>
                          <option value="panchakarma supplies">Panchakarma Supplies</option>
                          <option value="medical supplies">Medical Supplies</option>
                        </Select>
                      </FormControl>
                      
                      <FormControl>
                        <FormLabel fontSize="sm" color={textSecondary} mb={2}>Status</FormLabel>
                        <Select
                          size="md"
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          bg="white"
                          borderRadius="lg"
                        >
                          <option value="all">All Status</option>
                          <option value="instock">In Stock</option>
                          <option value="lowstock">Low Stock</option>
                          <option value="critical">Critical</option>
                          <option value="outofstock">Out of Stock</option>
                        </Select>
                      </FormControl>

                      <Button
                        leftIcon={<Filter />}
                        colorScheme="blue"
                        variant="outline"
                        onClick={() => {
                          setSearchTerm('');
                          setCategoryFilter('all');
                          setStatusFilter('all');
                        }}
                      >
                        Clear
                      </Button>
                    </Grid>
                  </CardBody>
                </Card>

                {/* Enhanced Table View */}
                <TableContainer>
                  <Table variant="simple" size="md">
                    <Thead bg={useColorModeValue('gray.100', 'gray.700')}>
                      <Tr>
                        <Th py={4}>
                          <HStack spacing={2}>
                            <Icon as={Package} boxSize={4} />
                            <Text>Item Details</Text>
                          </HStack>
                        </Th>
                        <Th py={4}>
                          <HStack spacing={2}>
                            <Icon as={Layers} boxSize={4} />
                            <Text>Category</Text>
                          </HStack>
                        </Th>
                        <Th py={4}>
                          <HStack spacing={2}>
                            <Icon as={BarChart3} boxSize={4} />
                            <Text>Stock Status</Text>
                          </HStack>
                        </Th>
                        <Th py={4}>
                          <HStack spacing={2}>
                            <Icon as={DollarSign} boxSize={4} />
                            <Text>Value</Text>
                          </HStack>
                        </Th>
                        <Th py={4}>
                          <HStack spacing={2}>
                            <Icon as={Users} boxSize={4} />
                            <Text>Supplier</Text>
                          </HStack>
                        </Th>
                        <Th py={4}>
                          <HStack spacing={2}>
                            <Icon as={Calendar} boxSize={4} />
                            <Text>Expiry</Text>
                          </HStack>
                        </Th>
                        <Th py={4}>
                          <HStack spacing={2}>
                            <Icon as={Settings} boxSize={4} />
                            <Text>Actions</Text>
                          </HStack>
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredItems.map((item, index) => (
                        <Tr 
                          key={item.id} 
                          _hover={{ bg: hoverBg, transform: 'scale(1.01)' }}
                          transition="all 0.2s"
                          cursor="pointer"
                          onClick={() => {
                            setSelectedItem(item);
                            viewItemModal.onOpen();
                          }}
                          borderLeft="4px solid"
                          borderLeftColor={`${getStatusColor(item.status)}.400`}
                        >
                          <Td py={4}>
                            <VStack align="start" spacing={2}>
                              <HStack spacing={3}>
                                <Box
                                  w={10}
                                  h={10}
                                  bg={`${getStatusColor(item.status)}.100`}
                                  borderRadius="lg"
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="center"
                                >
                                  <Text fontSize="xs" fontWeight="bold" color={`${getStatusColor(item.status)}.600`}>
                                    {index + 1}
                                  </Text>
                                </Box>
                                <VStack align="start" spacing={0}>
                                  <Text fontWeight="bold" fontSize="md" color="gray.800" _dark={{ color: 'white' }}>
                                    {item.name}
                                  </Text>
                                  <HStack fontSize="xs" color={textSecondary} spacing={3}>
                                    <Text>ID: {item.id}</Text>
                                    <Text>•</Text>
                                    <Text>Batch: {item.batchNumber || 'N/A'}</Text>
                                  </HStack>
                                  <Badge size="sm" colorScheme="gray" variant="outline" mt={1}>
                                    📍 {item.location}
                                  </Badge>
                                </VStack>
                              </HStack>
                            </VStack>
                          </Td>
                          <Td py={4}>
                            <VStack align="start" spacing={1}>
                              <Badge colorScheme="blue" variant="subtle" borderRadius="md">
                                {item.category}
                              </Badge>
                              <Text fontSize="sm" color={textSecondary}>
                                {item.subcategory}
                              </Text>
                            </VStack>
                          </Td>
                          <Td py={4}>
                            <VStack align="start" spacing={3}>
                              <HStack spacing={3}>
                                <Badge 
                                  colorScheme={getStatusColor(item.status)} 
                                  variant="solid" 
                                  borderRadius="md"
                                  px={3}
                                  py={1}
                                >
                                  {item.status}
                                </Badge>
                              </HStack>
                              <Box w="120px">
                                <HStack justify="space-between" mb={2}>
                                  <Text fontSize="sm" fontWeight="medium">
                                    {item.currentStock}
                                  </Text>
                                  <Text fontSize="xs" color={textSecondary}>
                                    /{item.maxStock}
                                  </Text>
                                </HStack>
                                <Progress 
                                  value={getStockPercentage(item.currentStock, item.maxStock)}
                                  colorScheme={getStockColor(item.currentStock, item.minStock, item.maxStock)}
                                  size="lg"
                                  borderRadius="md"
                                  bg="gray.100"
                                />
                                <HStack justify="space-between" mt={1}>
                                  <Text fontSize="xs" color={textSecondary}>
                                    Min: {item.minStock}
                                  </Text>
                                  <Text fontSize="xs" color={textSecondary}>
                                    {item.unit}
                                  </Text>
                                </HStack>
                              </Box>
                            </VStack>
                          </Td>
                          <Td py={4}>
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="bold" fontSize="lg" color="green.600">
                                {formatCurrency(item.totalValue)}
                              </Text>
                              <Text fontSize="sm" color={textSecondary}>
                                {formatCurrency(item.unitPrice)} per {item.unit.toLowerCase().slice(0, -1)}
                              </Text>
                              <HStack spacing={1}>
                                <Text fontSize="xs" color={textSecondary}>Qty:</Text>
                                <Text fontSize="xs" fontWeight="medium">{item.currentStock} {item.unit.toLowerCase()}</Text>
                              </HStack>
                            </VStack>
                          </Td>
                          <Td py={4}>
                            <VStack align="start" spacing={2}>
                              <Text fontSize="sm" fontWeight="medium" color="blue.600">
                                {item.supplier}
                              </Text>
                              <Badge colorScheme="blue" variant="outline" size="sm">
                                Trusted Supplier
                              </Badge>
                            </VStack>
                          </Td>
                          <Td py={4}>
                            {item.expiryDate ? (
                              <VStack align="start" spacing={2}>
                                <Text fontSize="sm" fontWeight="medium">
                                  {new Date(item.expiryDate).toLocaleDateString()}
                                </Text>
                                {(() => {
                                  const expiryDate = new Date(item.expiryDate);
                                  const today = new Date();
                                  const diffTime = expiryDate - today;
                                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                  
                                  if (diffDays <= 0) {
                                    return (
                                      <Badge colorScheme="red" size="sm" variant="solid">
                                        ⚠️ Expired
                                      </Badge>
                                    );
                                  } else if (diffDays <= 30) {
                                    return (
                                      <Badge colorScheme="red" size="sm" variant="solid">
                                        🔥 {diffDays} days left
                                      </Badge>
                                    );
                                  } else if (diffDays <= 60) {
                                    return (
                                      <Badge colorScheme="yellow" size="sm" variant="solid">
                                        ⏰ {diffDays} days left
                                      </Badge>
                                    );
                                  } else {
                                    return (
                                      <Badge colorScheme="green" size="sm" variant="outline">
                                        ✅ Good
                                      </Badge>
                                    );
                                  }
                                })()}
                              </VStack>
                            ) : (
                              <VStack align="start" spacing={1}>
                                <Text fontSize="sm" color={textSecondary}>No Expiry</Text>
                                <Badge colorScheme="gray" size="sm" variant="outline">
                                  N/A
                                </Badge>
                              </VStack>
                            )}
                          </Td>
                          <Td py={4}>
                            <HStack spacing={2}>
                              <Tooltip label="View Details" placement="top">
                                <IconButton
                                  size="sm"
                                  colorScheme="blue"
                                  variant="outline"
                                  icon={<Eye />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedItem(item);
                                    viewItemModal.onOpen();
                                  }}
                                />
                              </Tooltip>
                              <Menu>
                                <MenuButton
                                  as={IconButton}
                                  icon={<MoreVertical />}
                                  variant="outline"
                                  size="sm"
                                  colorScheme="gray"
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <MenuList
                                  bg="#FFFFFF" // solid white
                                  border="1px solid"
                                  borderColor="gray.300"
                                  shadow="md"
                                  borderRadius="6px"
                                  zIndex={2000}
                                  position="absolute" // important: let Chakra handle positioning
                                  minW="180px"
                                  py={2}
                                  _focus={{
                                    bg: "#FFFFFF",
                                    borderColor: "gray.400",
                                  }}
                                  _hover={{
                                    bg: "#FFFFFF",
                                  }}
                                >

                                  <MenuItem icon={<Eye size={16} />}>
                                    View Details
                                  </MenuItem>
                                  <MenuItem icon={<Edit size={16} />}>
                                    Edit Item
                                  </MenuItem>
                                  <MenuItem icon={<ShoppingCart size={16} />}>
                                    Add Stock
                                  </MenuItem>
                                  <MenuItem icon={<Download size={16} />}>
                                    Generate Report
                                  </MenuItem>
                                  <Divider />
                                  <MenuItem icon={<Trash2 size={16} />} color="red.500">
                                    Delete Item
                                  </MenuItem>
                                </MenuList>
                              </Menu>
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </TabPanel>

              {/* Stock Movements Tab */}
              <TabPanel p={0}>
                <Text fontSize="lg" fontWeight="semibold" mb={4}>Recent Stock Movements</Text>
                <TableContainer>
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Item</Th>
                        <Th>Movement Type</Th>
                        <Th>Quantity</Th>
                        <Th>Reason</Th>
                        <Th>Date & Time</Th>
                        <Th>Handled By</Th>
                        <Th>Reference</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {mockMovements.map((movement) => (
                        <Tr key={movement.id}>
                          <Td>
                            <Text fontWeight="medium" fontSize="sm">{movement.item}</Text>
                          </Td>
                          <Td>
                            <Badge 
                              colorScheme={movement.type === 'Incoming' ? 'green' : 'red'} 
                              variant="subtle"
                            >
                              {movement.type}
                            </Badge>
                          </Td>
                          <Td>
                            <Text 
                              fontSize="sm" 
                              color={movement.type === 'Incoming' ? 'green.600' : 'red.600'}
                              fontWeight="medium"
                            >
                              {movement.type === 'Incoming' ? '+' : '-'}{movement.quantity}
                            </Text>
                          </Td>
                          <Td>
                            <Text fontSize="sm">{movement.reason}</Text>
                          </Td>
                          <Td>
                            <VStack align="start" spacing={0}>
                              <Text fontSize="sm">{movement.date}</Text>
                              <Text fontSize="xs" color="gray.500">{movement.time}</Text>
                            </VStack>
                          </Td>
                          <Td>
                            <Text fontSize="sm">{movement.handledBy}</Text>
                          </Td>
                          <Td>
                            <Text fontSize="sm" color="blue.600">{movement.reference}</Text>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </TabPanel>

              {/* Analytics Tab */}
              <TabPanel p={0}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <Card variant="outline">
                    <CardBody>
                      <Text fontSize="lg" fontWeight="semibold" mb={4}>Stock Distribution by Category</Text>
                      <VStack spacing={3} align="stretch">
                        {Object.entries(
                          mockInventoryItems.reduce((acc, item) => {
                            acc[item.category] = (acc[item.category] || 0) + 1;
                            return acc;
                          }, {})
                        ).map(([category, count]) => (
                          <Flex key={category} justify="space-between" align="center">
                            <Text fontSize="sm">{category}</Text>
                            <Badge colorScheme="blue" variant="outline">{count} items</Badge>
                          </Flex>
                        ))}
                      </VStack>
                    </CardBody>
                  </Card>

                  <Card variant="outline">
                    <CardBody>
                      <Text fontSize="lg" fontWeight="semibold" mb={4}>Value Distribution</Text>
                      <VStack spacing={3} align="stretch">
                        {Object.entries(
                          mockInventoryItems.reduce((acc, item) => {
                            acc[item.category] = (acc[item.category] || 0) + item.totalValue;
                            return acc;
                          }, {})
                        ).map(([category, value]) => (
                          <Flex key={category} justify="space-between" align="center">
                            <Text fontSize="sm">{category}</Text>
                            <Text fontSize="sm" fontWeight="medium" color="green.600">
                              {formatCurrency(value)}
                            </Text>
                          </Flex>
                        ))}
                      </VStack>
                    </CardBody>
                  </Card>
                </SimpleGrid>
              </TabPanel>

              {/* Enhanced Suppliers Tab */}
              <TabPanel p={0}>
                <VStack align="stretch" spacing={6}>
                  {/* Supplier Category Filter */}
                  <Card bg={useColorModeValue('purple.50', 'purple.900')} borderRadius="xl">
                    <CardBody p={4}>
                      <HStack spacing={4} wrap="wrap">
                        <Text fontSize="sm" fontWeight="semibold" color={textSecondary} minW="fit-content">
                          Filter by Category:
                        </Text>
                        <HStack spacing={2} wrap="wrap">
                          {[
                            { value: 'all', label: 'All Categories', color: 'gray' },
                            { value: 'company', label: 'Company', color: 'blue' },
                            { value: 'farmer', label: 'Farmer', color: 'green' },
                            { value: 'self', label: 'Self', color: 'purple' },
                            { value: 'other', label: 'Other', color: 'orange' }
                          ].map((cat) => (
                            <Button
                              key={cat.value}
                              size="sm"
                              variant={supplierCategoryFilter === cat.value ? 'solid' : 'outline'}
                              colorScheme={cat.color}
                              onClick={() => setSupplierCategoryFilter(cat.value)}
                              _hover={{ transform: 'translateY(-1px)' }}
                              transition="all 0.2s"
                            >
                              {cat.label}
                            </Button>
                          ))}
                        </HStack>
                      </HStack>
                    </CardBody>
                  </Card>

                  {/* Suppliers Table */}
                  <Card shadow="xl" borderRadius="xl">
                    <CardHeader bg={useColorModeValue('gray.50', 'gray.800')} py={4}>
                      <HStack justify="space-between">
                        <HStack spacing={3}>
                          <Icon as={Users} color="purple.500" boxSize={6} />
                          <Text fontSize="xl" fontWeight="bold">
                            Suppliers Management
                          </Text>
                        </HStack>
                        <Badge colorScheme="purple" px={3} py={1}>
                          <HStack spacing={1}>
                            <Icon as={BarChart3} boxSize={3} />
                            <Text fontSize="sm">Table View</Text>
                          </HStack>
                        </Badge>
                      </HStack>
                    </CardHeader>
                    <CardBody p={0}>
                      <TableContainer>
                        <Table variant="simple" size="md">
                          <Thead bg={useColorModeValue('gray.100', 'gray.700')}>
                            <Tr>
                              <Th py={4}>Supplier Details</Th>
                              <Th py={4}>Category</Th>
                              <Th py={4}>Items & Value</Th>
                              <Th py={4}>Performance</Th>
                              <Th py={4}>Last Order</Th>
                              <Th py={4}>Terms</Th>
                              <Th py={4}>Actions</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {mockSuppliers
                              .filter(supplier => supplierCategoryFilter === 'all' || supplier.category === supplierCategoryFilter)
                              .map((supplier, index) => {
                                const getCategoryColor = (category) => {
                                  switch(category) {
                                    case 'company': return 'blue';
                                    case 'farmer': return 'green';
                                    case 'self': return 'purple';
                                    case 'other': return 'orange';
                                    default: return 'gray';
                                  }
                                };
                                
                                const categoryColor = getCategoryColor(supplier.category);
                                
                                return (
                                  <Tr 
                                    key={supplier.id} 
                                    _hover={{ bg: hoverBg, transform: 'scale(1.01)' }}
                                    transition="all 0.2s"
                                    cursor="pointer"
                                    borderLeft="4px solid"
                                    borderLeftColor={`${categoryColor}.400`}
                                  >
                                    <Td py={4}>
                                      <VStack align="start" spacing={2}>
                                        <HStack spacing={3}>
                                          <Box
                                            w={10}
                                            h={10}
                                            bg={`${categoryColor}.100`}
                                            borderRadius="lg"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                          >
                                            <Text fontSize="xs" fontWeight="bold" color={`${categoryColor}.600`}>
                                              {index + 1}
                                            </Text>
                                          </Box>
                                          <VStack align="start" spacing={0}>
                                            <Text fontWeight="bold" fontSize="md" color="gray.800" _dark={{ color: 'white' }}>
                                              {supplier.name}
                                            </Text>
                                            <Text fontSize="sm" color={textSecondary}>
                                              {supplier.type}
                                            </Text>
                                            <HStack fontSize="xs" color={textSecondary} spacing={3}>
                                              <Text>ID: {supplier.id}</Text>
                                              <Text>•</Text>
                                              <Text>📞 {supplier.contact}</Text>
                                            </HStack>
                                            <Text fontSize="xs" color={textSecondary} mt={1}>
                                              📍 {supplier.address}
                                            </Text>
                                          </VStack>
                                        </HStack>
                                      </VStack>
                                    </Td>
                                    <Td py={4}>
                                      <VStack align="start" spacing={2}>
                                        <Badge colorScheme={categoryColor} variant="solid" borderRadius="md" px={3}>
                                          {supplier.category.toUpperCase()}
                                        </Badge>
                                        <Badge colorScheme={categoryColor} variant="outline" size="sm">
                                          {supplier.subcategory}
                                        </Badge>
                                      </VStack>
                                    </Td>
                                    <Td py={4}>
                                      <VStack align="start" spacing={2}>
                                        <HStack spacing={2}>
                                          <Icon as={Package} color={`${categoryColor}.500`} boxSize={4} />
                                          <Text fontSize="lg" fontWeight="bold">
                                            {supplier.itemsSupplied}
                                          </Text>
                                          <Text fontSize="sm" color={textSecondary}>items</Text>
                                        </HStack>
                                        <Text fontWeight="bold" fontSize="lg" color="green.600">
                                          {formatCurrency(supplier.totalValue)}
                                        </Text>
                                        <Text fontSize="xs" color={textSecondary}>
                                          Min Order: {formatCurrency(supplier.minimumOrder)}
                                        </Text>
                                      </VStack>
                                    </Td>
                                    <Td py={4}>
                                      <VStack align="start" spacing={3}>
                                        <HStack spacing={2}>
                                          <Icon as={Star} color="yellow.400" boxSize={4} />
                                          <Text fontSize="md" fontWeight="bold">
                                            {supplier.rating}
                                          </Text>
                                          <Text fontSize="sm" color={textSecondary}>/5.0</Text>
                                        </HStack>
                                        <Box w="100px">
                                          <HStack justify="space-between" mb={1}>
                                            <Text fontSize="xs" color={textSecondary}>Reliability</Text>
                                            <Text fontSize="xs" fontWeight="medium">
                                              {supplier.reliabilityScore}%
                                            </Text>
                                          </HStack>
                                          <Progress 
                                            value={supplier.reliabilityScore} 
                                            colorScheme={supplier.reliabilityScore >= 90 ? 'green' : supplier.reliabilityScore >= 75 ? 'yellow' : 'red'}
                                            size="lg"
                                            borderRadius="md"
                                          />
                                        </Box>
                                      </VStack>
                                    </Td>
                                    <Td py={4}>
                                      <VStack align="start" spacing={1}>
                                        <Text fontSize="sm" fontWeight="medium">
                                          {new Date(supplier.lastOrderDate).toLocaleDateString()}
                                        </Text>
                                        <Badge 
                                          colorScheme={
                                            new Date() - new Date(supplier.lastOrderDate) <= 7 * 24 * 60 * 60 * 1000 ? 'green' :
                                            new Date() - new Date(supplier.lastOrderDate) <= 30 * 24 * 60 * 60 * 1000 ? 'yellow' : 'red'
                                          } 
                                          size="sm" 
                                          variant="subtle"
                                        >
                                          {Math.ceil((new Date() - new Date(supplier.lastOrderDate)) / (1000 * 60 * 60 * 24))} days ago
                                        </Badge>
                                      </VStack>
                                    </Td>
                                    <Td py={4}>
                                      <VStack align="start" spacing={1}>
                                        <Badge colorScheme="blue" variant="outline" size="sm">
                                          {supplier.paymentTerms}
                                        </Badge>
                                        <Text fontSize="xs" color={textSecondary}>
                                          📧 {supplier.email}
                                        </Text>
                                      </VStack>
                                    </Td>
                                    <Td py={4}>
                                      <HStack spacing={2}>
                                        <Tooltip label="View Details" placement="top">
                                          <IconButton
                                            size="sm"
                                            colorScheme={categoryColor}
                                            variant="outline"
                                            icon={<Eye />}
                                          />
                                        </Tooltip>
                                        <Menu>
                                          <MenuButton
                                            as={IconButton}
                                            icon={<MoreVertical />}
                                            variant="outline"
                                            size="sm"
                                            colorScheme="gray"
                                          />
                                          <MenuList>
                                            <MenuItem icon={<Eye size={16} />}>
                                              View Profile
                                            </MenuItem>
                                            <MenuItem icon={<Edit size={16} />}>
                                              Edit Supplier
                                            </MenuItem>
                                            <MenuItem icon={<ShoppingCart size={16} />}>
                                              Place Order
                                            </MenuItem>
                                            <MenuItem icon={<BarChart3 size={16} />}>
                                              View Analytics
                                            </MenuItem>
                                            <MenuItem icon={<Download size={16} />}>
                                              Export Data
                                            </MenuItem>
                                            <Divider />
                                            <MenuItem icon={<Trash2 size={16} />} color="red.500">
                                              Remove Supplier
                                            </MenuItem>
                                          </MenuList>
                                        </Menu>
                                      </HStack>
                                    </Td>
                                  </Tr>
                                );
                              })}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </CardBody>
                  </Card>
                      
                      {/* Patient Product Suppliers */}
                      <Box mb={6}>
                        <Text fontSize="md" fontWeight="semibold" color={textSecondary} mb={3}>
                          Patient Product Suppliers
                        </Text>
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                          {mockSuppliers
                            .filter(supplier => supplier.category === 'company' && supplier.subcategory === 'patient product supplier')
                            .map((supplier) => (
                              <Card
                                key={supplier.id}
                                shadow="lg"
                                borderRadius="xl"
                                border="2px solid"
                                borderColor="blue.100"
                                _hover={{ transform: 'translateY(-4px)', shadow: '2xl', borderColor: 'blue.200' }}
                                transition="all 0.3s"
                              >
                                <CardBody p={5}>
                                  <VStack align="start" spacing={3}>
                                    <HStack justify="space-between" w="full">
                                      <Badge colorScheme="blue" variant="solid" borderRadius="md">
                                        {supplier.type}
                                      </Badge>
                                      <HStack spacing={1}>
                                        <Icon as={Star} color="yellow.400" boxSize={4} />
                                        <Text fontSize="sm" fontWeight="medium">{supplier.rating}</Text>
                                      </HStack>
                                    </HStack>
                                    
                                    <Text fontWeight="bold" fontSize="lg" color="blue.700">
                                      {supplier.name}
                                    </Text>
                                    
                                    <VStack align="start" spacing={2} w="full">
                                      <HStack justify="space-between" w="full">
                                        <Text fontSize="sm" color={textSecondary}>Items:</Text>
                                        <Badge colorScheme="blue" variant="outline">{supplier.itemsSupplied}</Badge>
                                      </HStack>
                                      <HStack justify="space-between" w="full">
                                        <Text fontSize="sm" color={textSecondary}>Value:</Text>
                                        <Text fontSize="sm" fontWeight="bold" color="green.600">
                                          {formatCurrency(supplier.totalValue)}
                                        </Text>
                                      </HStack>
                                      <HStack justify="space-between" w="full">
                                        <Text fontSize="sm" color={textSecondary}>Reliability:</Text>
                                        <HStack spacing={2}>
                                          <Progress 
                                            value={supplier.reliabilityScore} 
                                            size="sm" 
                                            colorScheme="blue" 
                                            w="60px"
                                            borderRadius="md"
                                          />
                                          <Text fontSize="xs" color={textSecondary}>{supplier.reliabilityScore}%</Text>
                                        </HStack>
                                      </HStack>
                                    </VStack>
                                    
                                    <Divider />
                                    
                                    <HStack spacing={2} w="full">
                                      <Button size="sm" colorScheme="blue" flex={1} leftIcon={<Eye />}>
                                        Details
                                      </Button>
                                      <IconButton
                                        size="sm"
                                        variant="outline"
                                        colorScheme="blue"
                                        icon={<MoreVertical />}
                                      />
                                    </HStack>
                                  </VStack>
                                </CardBody>
                              </Card>
                            ))}
                        </SimpleGrid>
                      </Box>
                      
                      {/* Raw Product Suppliers */}
                      <Box mb={6}>
                        <Text fontSize="md" fontWeight="semibold" color={textSecondary} mb={3}>
                          Raw Product Suppliers
                        </Text>
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                          {mockSuppliers
                            .filter(supplier => supplier.category === 'company' && supplier.subcategory === 'raw product supplier')
                            .map((supplier) => (
                              <Card
                                key={supplier.id}
                                shadow="lg"
                                borderRadius="xl"
                                border="2px solid"
                                borderColor="cyan.100"
                                _hover={{ transform: 'translateY(-4px)', shadow: '2xl', borderColor: 'cyan.200' }}
                                transition="all 0.3s"
                              >
                                <CardBody p={5}>
                                  <VStack align="start" spacing={3}>
                                    <HStack justify="space-between" w="full">
                                      <Badge colorScheme="cyan" variant="solid" borderRadius="md">
                                        {supplier.type}
                                      </Badge>
                                      <HStack spacing={1}>
                                        <Icon as={Star} color="yellow.400" boxSize={4} />
                                        <Text fontSize="sm" fontWeight="medium">{supplier.rating}</Text>
                                      </HStack>
                                    </HStack>
                                    
                                    <Text fontWeight="bold" fontSize="lg" color="cyan.700">
                                      {supplier.name}
                                    </Text>
                                    
                                    <VStack align="start" spacing={2} w="full">
                                      <HStack justify="space-between" w="full">
                                        <Text fontSize="sm" color={textSecondary}>Items:</Text>
                                        <Badge colorScheme="cyan" variant="outline">{supplier.itemsSupplied}</Badge>
                                      </HStack>
                                      <HStack justify="space-between" w="full">
                                        <Text fontSize="sm" color={textSecondary}>Value:</Text>
                                        <Text fontSize="sm" fontWeight="bold" color="green.600">
                                          {formatCurrency(supplier.totalValue)}
                                        </Text>
                                      </HStack>
                                      <HStack justify="space-between" w="full">
                                        <Text fontSize="sm" color={textSecondary}>Reliability:</Text>
                                        <HStack spacing={2}>
                                          <Progress 
                                            value={supplier.reliabilityScore} 
                                            size="sm" 
                                            colorScheme="cyan" 
                                            w="60px"
                                            borderRadius="md"
                                          />
                                          <Text fontSize="xs" color={textSecondary}>{supplier.reliabilityScore}%</Text>
                                        </HStack>
                                      </HStack>
                                    </VStack>
                                    
                                    <Divider />
                                    
                                    <HStack spacing={2} w="full">
                                      <Button size="sm" colorScheme="cyan" flex={1} leftIcon={<Eye />}>
                                        Details
                                      </Button>
                                    </HStack>
                                  </VStack>
                                </CardBody>
                              </Card>
                            ))}
                        </SimpleGrid>
                      </Box>
                      
                    </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CardBody>
      </Card>

      {/* Add Item Modal */}
      <Modal isOpen={addItemModal.isOpen} onClose={addItemModal.onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Inventory Item</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl isRequired>
                <FormLabel>Item Name</FormLabel>
                <Input
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="Enter item name"
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Category</FormLabel>
                <Select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                >
                  <option value="ayurvedic medicine">Ayurvedic Medicine</option>
                  <option value="medical equipment">Medical Equipment</option>
                  <option value="panchakarma supplies">Panchakarma Supplies</option>
                  <option value="medical supplies">Medical Supplies</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Subcategory</FormLabel>
                <Input
                  value={newItem.subcategory}
                  onChange={(e) => setNewItem({ ...newItem, subcategory: e.target.value })}
                  placeholder="Enter subcategory"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Supplier</FormLabel>
                <Input
                  value={newItem.supplier}
                  onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                  placeholder="Enter supplier name"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Current Stock</FormLabel>
                <NumberInput
                  value={newItem.currentStock}
                  onChange={(value) => setNewItem({ ...newItem, currentStock: parseInt(value) })}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel>Unit Price (₹)</FormLabel>
                <NumberInput
                  value={newItem.unitPrice}
                  onChange={(value) => setNewItem({ ...newItem, unitPrice: parseFloat(value) })}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel>Expiry Date</FormLabel>
                <Input
                  type="date"
                  value={newItem.expiryDate}
                  onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Storage Location</FormLabel>
                <Input
                  value={newItem.location}
                  onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                  placeholder="e.g., Pharmacy-A1"
                />
              </FormControl>
            </SimpleGrid>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                console.log('Adding new item:', newItem);
                addItemModal.onClose();
              }}
            >
              Add Item
            </Button>
            <Button variant="outline" onClick={addItemModal.onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View Item Modal */}
      <Modal isOpen={viewItemModal.isOpen} onClose={viewItemModal.onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Item Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedItem && (
              <VStack align="stretch" spacing={4}>
                <HStack justify="space-between">
                  <Text fontSize="xl" fontWeight="bold">{selectedItem.name}</Text>
                  <Badge colorScheme={getStatusColor(selectedItem.status)} size="lg">
                    {selectedItem.status}
                  </Badge>
                </HStack>
                
                <SimpleGrid columns={2} spacing={4}>
                  <Box>
                    <Text fontSize="sm" color={textSecondary} mb={1}>Category</Text>
                    <Text fontWeight="medium">{selectedItem.category}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color={textSecondary} mb={1}>Subcategory</Text>
                    <Text fontWeight="medium">{selectedItem.subcategory}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color={textSecondary} mb={1}>Current Stock</Text>
                    <Text fontWeight="medium">{selectedItem.currentStock} {selectedItem.unit}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color={textSecondary} mb={1}>Unit Price</Text>
                    <Text fontWeight="medium">{formatCurrency(selectedItem.unitPrice)}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color={textSecondary} mb={1}>Total Value</Text>
                    <Text fontWeight="bold" color="green.600">{formatCurrency(selectedItem.totalValue)}</Text>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color={textSecondary} mb={1}>Supplier</Text>
                    <Text fontWeight="medium">{selectedItem.supplier}</Text>
                  </Box>
                </SimpleGrid>

                <Divider />

                <Box>
                  <Text fontSize="sm" color={textSecondary} mb={2}>Stock Progress</Text>
                  <Progress
                    value={getStockPercentage(selectedItem.currentStock, selectedItem.maxStock)}
                    colorScheme={getStockColor(selectedItem.currentStock, selectedItem.minStock, selectedItem.maxStock)}
                    size="lg"
                    borderRadius="md"
                  />
                  <HStack justify="space-between" mt={2}>
                    <Text fontSize="sm">Min: {selectedItem.minStock}</Text>
                    <Text fontSize="sm">Current: {selectedItem.currentStock}</Text>
                    <Text fontSize="sm">Max: {selectedItem.maxStock}</Text>
                  </HStack>
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} leftIcon={<Edit />}>
              Edit Item
            </Button>
            <Button variant="outline" onClick={viewItemModal.onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Inventory;
