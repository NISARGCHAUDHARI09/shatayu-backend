import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Text,
  Button,
  Input,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  HStack,
  VStack,
  Grid,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Flex,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  Alert,
  AlertIcon,
  AlertDescription,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Progress
} from '@chakra-ui/react';

import {
  Package2,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  BarChart3,
  Package,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Star,
  RefreshCw,
  Home,
  ChevronRight,
  Settings,
  Bell
} from 'lucide-react';


const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/inventory` : 'https://shatayu-backend.onrender.com/api/inventory';


const Inventory = () => {
  // State Management
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inventoryData, setInventoryData] = useState([]);

  // Fetch inventory from backend
  useEffect(() => {
    const fetchInventory = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setInventoryData(res.data);
      } catch (err) {
        // Optionally handle error
      } finally {
        setIsLoading(false);
      }
    };
    fetchInventory();
  }, []);

  // CRUD operations
  const addInventoryItem = async (itemData) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.post(API_URL, itemData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInventoryData(prev => [...prev, res.data]);
    } catch (err) {
      // Optionally handle error
    } finally {
      setIsLoading(false);
    }
  };

  const updateInventoryItem = async (id, itemData) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.put(`${API_URL}/${id}`, itemData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInventoryData(prev => prev.map(item => item.id === id ? res.data : item));
    } catch (err) {
      // Optionally handle error
    } finally {
      setIsLoading(false);
    }
  };

  const deleteInventoryItem = async (id) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInventoryData(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      // Optionally handle error
    } finally {
      setIsLoading(false);
    }
  };

  // Color Mode Values
  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Filtered and Sorted Items
  const filteredItems = useMemo(() => {
    return inventoryData.filter(item => {
      const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      let matchesStatus = true;
      if (statusFilter === 'in_stock') matchesStatus = item.currentStock > item.minStock * 2;
      else if (statusFilter === 'low_stock') matchesStatus = item.currentStock > 0 && item.currentStock <= item.minStock * 2;
      else if (statusFilter === 'out_of_stock') matchesStatus = item.currentStock === 0;
      return matchesSearch && matchesCategory && matchesStatus;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'currentStock': return b.currentStock - a.currentStock;
        case 'price': return a.price - b.price;
        case 'rating': return b.rating - a.rating;
        default: return a.name.localeCompare(b.name);
      }
    });
  }, [searchTerm, categoryFilter, statusFilter, sortBy, inventoryData]);

  // Statistics Calculations
  const totalItems = inventoryData.reduce((sum, item) => sum + (item.currentStock || 0), 0);
  const lowStockItems = inventoryData.filter(item => 
    item.currentStock > 0 && item.currentStock <= item.minStock
  ).length;
  const outOfStockItems = inventoryData.filter(item => item.currentStock === 0).length;
  const totalValue = inventoryData.reduce((sum, item) => 
    sum + ((item.currentStock || 0) * (item.price || 0)), 0
  );
  const averageRating = inventoryData.length > 0 ? inventoryData.reduce((sum, item) => 
    sum + (item.rating || 0), 0) / inventoryData.length : 0;

  // Utility Functions
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInventoryData(res.data);
    } catch (err) {
      // Optionally handle error
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStock = (itemId) => {
    // Implement add stock logic here, e.g., open modal and call updateInventoryItem
    console.log('Add stock for item:', itemId);
  };

  return (
    <Box bg={bg} minH="100vh" p={8}>
      <Box maxW="7xl" mx="auto">
        
        {/* Enhanced Header with Glass Morphism */}
        <Card
          shadow="2xl"
          borderRadius="2xl"
          overflow="hidden"
          mb={8}
          bgGradient="linear(135deg, blue.500, purple.600)"
          color="white"
          position="relative"
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgGradient: 'linear(135deg, blue.400/80, purple.500/80)',
            backdropFilter: 'blur(10px)',
            zIndex: 0,
          }}
        >
          <CardHeader py={8} position="relative" zIndex={1}>
            <VStack spacing={6} align="center">
              <HStack spacing={4}>
                <Box
                  w={16} h={16} borderRadius="2xl"
                  bg="white/20" backdropFilter="blur(10px)"
                  display="flex" alignItems="center" justifyContent="center"
                  border="2px solid" borderColor="white/30"
                >
                  <Icon as={Package} boxSize={8} color="white" />
                </Box>
                <VStack align="start" spacing={1}>
                  <Text fontSize="3xl" fontWeight="bold">
                    Smart Inventory Management
                  </Text>
                  <Text fontSize="lg" opacity={0.9}>
                    Advanced ayurvedic medicine and equipment tracking system
                  </Text>
                </VStack>
              </HStack>
              
              <Breadcrumb
                spacing={2}
                separator={<ChevronRight color="white" size={16} />}
                color="white/80"
                fontSize="sm"
              >
                <BreadcrumbItem>
                  <BreadcrumbLink href="#" display="flex" alignItems="center">
                    <Home size={16} />
                    <Text ml={2}>Admin Dashboard</Text>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrentPage>
                  <Text>Inventory Management</Text>
                </BreadcrumbItem>
              </Breadcrumb>
            </VStack>
          </CardHeader>
        </Card>

        {/* Enhanced Statistics Cards */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(5, 1fr)' }} gap={6} mb={8}>
          <Card
            shadow="xl"
            borderRadius="2xl"
            overflow="hidden"
            border="1px solid"
            borderColor="blue.100"
            _hover={{ transform: 'translateY(-4px)', shadow: '2xl' }}
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          >
            <CardBody p={6}>
              <HStack spacing={4}>
                <Box
                  w={14} h={14} borderRadius="2xl"
                  bgGradient="linear(135deg, blue.400, blue.600)"
                  display="flex" alignItems="center" justifyContent="center"
                  color="white" shadow="lg"
                >
                  <Icon as={Package2} boxSize={7} />
                </Box>
                <VStack align="start" spacing={1} flex={1}>
                  <Text fontSize="sm" color="gray.500" fontWeight="semibold">
                    Total Items
                  </Text>
                  <Text fontSize="3xl" fontWeight="bold" color="blue.600">
                    {totalItems}
                  </Text>
                  <Text fontSize="xs" color="green.500" fontWeight="semibold">
                    +12% from last month
                  </Text>
                </VStack>
              </HStack>
            </CardBody>
          </Card>

          <Card
            shadow="xl"
            borderRadius="2xl"
            overflow="hidden"
            border="1px solid"
            borderColor="yellow.100"
            _hover={{ transform: 'translateY(-4px)', shadow: '2xl' }}
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          >
            <CardBody p={6}>
              <HStack spacing={4}>
                <Box
                  w={14} h={14} borderRadius="2xl"
                  bgGradient="linear(135deg, yellow.400, orange.500)"
                  display="flex" alignItems="center" justifyContent="center"
                  color="white" shadow="lg"
                >
                  <Icon as={AlertTriangle} boxSize={7} />
                </Box>
                <VStack align="start" spacing={1} flex={1}>
                  <Text fontSize="sm" color="gray.500" fontWeight="semibold">
                    Low Stock
                  </Text>
                  <Text fontSize="3xl" fontWeight="bold" color="yellow.600">
                    {lowStockItems}
                  </Text>
                  <Text fontSize="xs" color="yellow.600" fontWeight="semibold">
                    Needs attention
                  </Text>
                </VStack>
              </HStack>
            </CardBody>
          </Card>

          <Card
            shadow="xl"
            borderRadius="2xl"
            overflow="hidden"
            border="1px solid"
            borderColor="red.100"
            _hover={{ transform: 'translateY(-4px)', shadow: '2xl' }}
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          >
            <CardBody p={6}>
              <HStack spacing={4}>
                <Box
                  w={14} h={14} borderRadius="2xl"
                  bgGradient="linear(135deg, red.400, red.600)"
                  display="flex" alignItems="center" justifyContent="center"
                  color="white" shadow="lg"
                >
                  <Icon as={AlertTriangle} boxSize={7} />
                </Box>
                <VStack align="start" spacing={1} flex={1}>
                  <Text fontSize="sm" color="gray.500" fontWeight="semibold">
                    Out of Stock
                  </Text>
                  <Text fontSize="3xl" fontWeight="bold" color="red.600">
                    {outOfStockItems}
                  </Text>
                  <Text fontSize="xs" color="red.600" fontWeight="semibold">
                    Critical items
                  </Text>
                </VStack>
              </HStack>
            </CardBody>
          </Card>

          <Card
            shadow="xl"
            borderRadius="2xl"
            overflow="hidden"
            border="1px solid"
            borderColor="green.100"
            _hover={{ transform: 'translateY(-4px)', shadow: '2xl' }}
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          >
            <CardBody p={6}>
              <HStack spacing={4}>
                <Box
                  w={14} h={14} borderRadius="2xl"
                  bgGradient="linear(135deg, green.400, green.600)"
                  display="flex" alignItems="center" justifyContent="center"
                  color="white" shadow="lg"
                >
                  <Icon as={DollarSign} boxSize={7} />
                </Box>
                <VStack align="start" spacing={1} flex={1}>
                  <Text fontSize="sm" color="gray.500" fontWeight="semibold">
                    Total Value
                  </Text>
                  <Text fontSize="3xl" fontWeight="bold" color="green.600">
                    ₹{(totalValue / 1000).toFixed(0)}K
                  </Text>
                  <Text fontSize="xs" color="green.500" fontWeight="semibold">
                    Inventory worth
                  </Text>
                </VStack>
              </HStack>
            </CardBody>
          </Card>

          <Card
            shadow="xl"
            borderRadius="2xl"
            overflow="hidden"
            border="1px solid"
            borderColor="purple.100"
            _hover={{ transform: 'translateY(-4px)', shadow: '2xl' }}
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
          >
            <CardBody p={6}>
              <HStack spacing={4}>
                <Box
                  w={14} h={14} borderRadius="2xl"
                  bgGradient="linear(135deg, purple.400, purple.600)"
                  display="flex" alignItems="center" justifyContent="center"
                  color="white" shadow="lg"
                >
                  <Icon as={Star} boxSize={7} />
                </Box>
                <VStack align="start" spacing={1} flex={1}>
                  <Text fontSize="sm" color="gray.500" fontWeight="semibold">
                    Avg Rating
                  </Text>
                  <Text fontSize="3xl" fontWeight="bold" color="purple.600">
                    {averageRating.toFixed(1)}
                  </Text>
                  <Text fontSize="xs" color="purple.500" fontWeight="semibold">
                    Customer satisfaction
                  </Text>
                </VStack>
              </HStack>
            </CardBody>
          </Card>
        </Grid>

        {/* Smart Alert Notifications */}
        <VStack spacing={4} mb={8}>
          {outOfStockItems > 0 && (
            <Alert status="error" borderRadius="2xl" shadow="lg">
              <AlertIcon />
              <AlertDescription fontWeight="semibold">
                🚨 {outOfStockItems} items are out of stock! Immediate restocking required.
              </AlertDescription>
            </Alert>
          )}
          {lowStockItems > 0 && (
            <Alert status="warning" borderRadius="2xl" shadow="lg">
              <AlertIcon />
              <AlertDescription fontWeight="semibold">
                ⚠️ {lowStockItems} items are running low on stock. Consider restocking soon.
              </AlertDescription>
            </Alert>
          )}
        </VStack>

        {/* Ultra-Smart Filters & Controls */}
        <Card
          shadow="2xl"
          borderRadius="2xl"
          overflow="hidden"
          bg={cardBg}
          border="1px solid"
          borderColor={borderColor}
          mb={8}
        >
          <CardHeader
            bgGradient="linear(135deg, blue.50, purple.50)"
            _dark={{ bgGradient: 'linear(135deg, blue.900/30, purple.900/30)' }}
            py={6}
          >
            <Flex justify="space-between" align="center">
              <HStack spacing={4}>
                <Box
                  w={12} h={12} borderRadius="xl"
                  bgGradient="linear(135deg, blue.500, purple.600)"
                  display="flex" alignItems="center" justifyContent="center"
                  color="white"
                >
                  <Icon as={Filter} boxSize={6} />
                </Box>
                <VStack align="start" spacing={1}>
                  <Text fontSize="xl" fontWeight="bold" color="gray.800" _dark={{ color: 'white' }}>
                    Smart Inventory Filters
                  </Text>
                  <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
                    Advanced search and filtering with real-time results
                  </Text>
                </VStack>
              </HStack>
              <HStack spacing={3}>
                <Badge
                  colorScheme="blue"
                  fontSize="md"
                  px={4} py={2}
                  borderRadius="full"
                  fontWeight="bold"
                >
                  {filteredItems.length} Results
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="gray"
                  leftIcon={<RefreshCw size={16} />}
                  onClick={handleRefresh}
                  isLoading={isLoading}
                >
                  Refresh
                </Button>
              </HStack>
            </Flex>
          </CardHeader>

          <CardBody p={6}>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(5, 1fr)' }} gap={6}>
              {/* Smart Search */}
              <VStack align="start" spacing={3}>
                <Text fontSize="sm" fontWeight="semibold" color="gray.700" _dark={{ color: 'gray.300' }}>
                  Smart Search
                </Text>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={Search} color="gray.400" boxSize={5} />
                  </InputLeftElement>
                  <Input
                    placeholder="Search items, suppliers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    bg="white"
                    borderColor="gray.200"
                    _dark={{ bg: 'gray.700', borderColor: 'gray.600' }}
                    _hover={{ borderColor: 'blue.400' }}
                    _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
                    borderRadius="xl"
                  />
                </InputGroup>
              </VStack>

              {/* Category Filter */}
              <VStack align="start" spacing={3}>
                <Text fontSize="sm" fontWeight="semibold" color="gray.700" _dark={{ color: 'gray.300' }}>
                  Category
                </Text>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  bg="white"
                  borderColor="gray.200"
                  _dark={{ bg: 'gray.700', borderColor: 'gray.600' }}
                  _hover={{ borderColor: 'blue.400' }}
                  _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
                  borderRadius="xl"
                >
                  <option value="all">All Categories</option>
                  <option value="Ayurvedic Medicine">Ayurvedic Medicine</option>
                  <option value="Medical Equipment">Medical Equipment</option>
                  <option value="Panchakarma Supplies">Panchakarma Supplies</option>
                </Select>
              </VStack>

              {/* Status Filter */}
              <VStack align="start" spacing={3}>
                <Text fontSize="sm" fontWeight="semibold" color="gray.700" _dark={{ color: 'gray.300' }}>
                  Stock Status
                </Text>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  bg="white"
                  borderColor="gray.200"
                  _dark={{ bg: 'gray.700', borderColor: 'gray.600' }}
                  _hover={{ borderColor: 'blue.400' }}
                  _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
                  borderRadius="xl"
                >
                  <option value="all">All Status</option>
                  <option value="in_stock">✅ In Stock</option>
                  <option value="low_stock">⚠️ Low Stock</option>
                  <option value="out_of_stock">🚫 Out of Stock</option>
                </Select>
              </VStack>

              {/* Sort Options */}
              <VStack align="start" spacing={3}>
                <Text fontSize="sm" fontWeight="semibold" color="gray.700" _dark={{ color: 'gray.300' }}>
                  Sort By
                </Text>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  bg="white"
                  borderColor="gray.200"
                  _dark={{ bg: 'gray.700', borderColor: 'gray.600' }}
                  _hover={{ borderColor: 'blue.400' }}
                  _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
                  borderRadius="xl"
                >
                  <option value="name">Name A-Z</option>
                  <option value="currentStock">Stock Level</option>
                  <option value="price">Price</option>
                  <option value="rating">Rating</option>
                </Select>
              </VStack>

              {/* Quick Actions */}
              <VStack align="start" spacing={3}>
                <Text fontSize="sm" fontWeight="semibold" color="gray.700" _dark={{ color: 'gray.300' }}>
                  Quick Actions
                </Text>
                <Button
                  w="100%"
                  leftIcon={<BarChart3 />}
                  variant="outline"
                  colorScheme="blue"
                  borderRadius="xl"
                  _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
                  transition="all 0.2s"
                >
                  Analytics
                </Button>
              </VStack>
            </Grid>
          </CardBody>
        </Card>

        {/* Ultra-Enhanced Inventory Table */}
        <Card
          shadow="2xl"
          borderRadius="2xl"
          overflow="hidden"
          bg={cardBg}
          border="1px solid"
          borderColor={borderColor}
        >
          <CardHeader
            bgGradient="linear(135deg, blue.50, cyan.50)"
            _dark={{ bgGradient: 'linear(135deg, blue.900/30, cyan.900/30)' }}
            py={6}
          >
            <Flex justify="space-between" align="center">
              <HStack spacing={4}>
                <Box
                  w={12} h={12} borderRadius="xl"
                  bgGradient="linear(135deg, blue.500, cyan.600)"
                  display="flex" alignItems="center" justifyContent="center"
                  color="white"
                >
                  <Icon as={Package} boxSize={6} />
                </Box>
                <VStack align="start" spacing={1}>
                  <Text fontSize="xl" fontWeight="bold" color="gray.800" _dark={{ color: 'white' }}>
                    Inventory Items
                  </Text>
                  <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
                    {filteredItems.length} items found - Advanced management system
                  </Text>
                </VStack>
              </HStack>
              <Button
                bgGradient="linear(135deg, blue.500, purple.600)"
                color="white"
                leftIcon={<Plus />}
                onClick={() => setIsAddItemModalOpen(true)}
                borderRadius="xl"
                shadow="lg"
                _hover={{
                  bgGradient: 'linear(135deg, blue.600, purple.700)',
                  transform: 'translateY(-2px)',
                  shadow: '2xl'
                }}
                transition="all 0.3s"
              >
                Add New Item
              </Button>
            </Flex>
          </CardHeader>

          <CardBody p={0}>
            <TableContainer>
              <Table variant="simple" size="md">
                <Thead bg={useColorModeValue('gray.50', 'gray.800')}>
                  <Tr>
                    <Th color="gray.600" fontWeight="bold" fontSize="sm" py={4}>
                      Item Details
                    </Th>
                    <Th color="gray.600" fontWeight="bold" fontSize="sm" py={4}>
                      Category
                    </Th>
                    <Th color="gray.600" fontWeight="bold" fontSize="sm" py={4}>
                      Stock & Pricing
                    </Th>
                    <Th color="gray.600" fontWeight="bold" fontSize="sm" py={4}>
                      Status
                    </Th>
                    <Th color="gray.600" fontWeight="bold" fontSize="sm" py={4}>
                      Actions
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredItems.map((item, index) => (
                    <Tr
                      key={item.id}
                      _hover={{
                        bg: useColorModeValue('blue.50', 'gray.700'),
                        transform: 'scale(1.01)'
                      }}
                      transition="all 0.2s"
                    >
                      <Td py={4}>
                        <HStack spacing={4}>
                          <Box
                            w={12} h={12}
                            borderRadius="xl"
                            bgGradient={`linear(135deg, ${
                              index % 3 === 0 ? 'blue.400, blue.600' :
                              index % 3 === 1 ? 'green.400, green.600' :
                              'purple.400, purple.600'
                            })`}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            color="white"
                            shadow="md"
                          >
                            <Icon as={Package2} boxSize={6} />
                          </Box>
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="bold" fontSize="md">{item.name}</Text>
                            <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
                              {item.description}
                            </Text>
                            {item.batchNumber && (
                              <Badge colorScheme="gray" size="sm">
                                Batch: {item.batchNumber}
                              </Badge>
                            )}
                          </VStack>
                        </HStack>
                      </Td>
                      <Td py={4}>
                        <Badge
                          colorScheme={
                            item.category === 'Ayurvedic Medicine' ? 'green' :
                            item.category === 'Medical Equipment' ? 'blue' : 'purple'
                          }
                          variant="subtle"
                          fontSize="sm"
                          px={3} py={1}
                          borderRadius="full"
                        >
                          {item.category}
                        </Badge>
                      </Td>
                      <Td py={4}>
                        <VStack align="start" spacing={2}>
                          <HStack spacing={3}>
                            <Text fontWeight="bold" fontSize="lg">
                              {item.currentStock}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                              / {item.minStock} min
                            </Text>
                          </HStack>
                          <Progress
                            value={(item.currentStock / (item.minStock * 3)) * 100}
                            size="sm"
                            w="100px"
                            colorScheme={
                              item.currentStock > item.minStock * 2 ? 'green' :
                              item.currentStock > item.minStock ? 'yellow' : 'red'
                            }
                            borderRadius="full"
                          />
                          <Text fontWeight="bold" color="green.600" fontSize="md">
                            ₹{item.price}
                          </Text>
                        </VStack>
                      </Td>
                      <Td py={4}>
                        <Badge
                          colorScheme={
                            item.currentStock > item.minStock * 2 ? 'green' :
                            item.currentStock > item.minStock ? 'yellow' : 'red'
                          }
                          variant="solid"
                          fontSize="sm"
                          px={4} py={2}
                          borderRadius="full"
                        >
                          {item.currentStock > item.minStock * 2 ? '✅ In Stock' :
                           item.currentStock > item.minStock ? '⚠️ Low Stock' : '🚫 Out of Stock'}
                        </Badge>
                      </Td>
                      <Td py={4}>
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            icon={<MoreHorizontal />}
                            variant="ghost"
                            size="sm"
                            borderRadius="full"
                            _hover={{
                              bg: 'blue.100',
                              transform: 'rotate(90deg)'
                            }}
                            transition="all 0.3s"
                          />
                          <MenuList
                            borderRadius="xl"
                            shadow="2xl"
                            border="1px solid"
                            borderColor={useColorModeValue('gray.200', 'gray.600')}
                            backgroundColor={useColorModeValue('white', 'gray.800')}
                          >
                            <MenuItem
                              icon={<Eye />}
                              onClick={() => setSelectedItem(item)}
                              borderRadius="lg"
                              _hover={{ bg: 'blue.50' }}                              
                              backgroundColor={'whiteAlpha.500'}
                            >
                              View Details
                            </MenuItem>
                            <MenuItem
                              icon={<Edit />}
                              borderRadius="lg"
                              _hover={{ bg: 'green.50' }}
                              backgroundColor={'whiteAlpha.500'}
                            >
                              Edit Item
                            </MenuItem>
                            <MenuItem
                              icon={<Plus />}
                              onClick={() => handleAddStock(item.id)}
                              borderRadius="lg"
                              _hover={{ bg: 'yellow.50' }}
                              backgroundColor={'whiteAlpha.500'}
                            >
                              Add Stock
                            </MenuItem>
                            <MenuDivider />
                            <MenuItem
                              icon={<Trash2 />}
                              color="red.500"
                              borderRadius="lg"
                              _hover={{ bg: 'red.50' }}
                            >
                              Delete Item
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>
      </Box>
    </Box>
  );
};

export default Inventory;
