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
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Textarea,
  SimpleGrid,
  Tooltip,
  Progress,
  CircularProgress,
  CircularProgressLabel,
  InputGroup,
  InputLeftElement,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider,
  Avatar,
  Wrap,
  WrapItem,
  useToast
} from '@chakra-ui/react';
import {
  Search,
  Plus,
  MoreVertical,
  Eye,
  Download,
  TrendingUp,
  TrendingDown,
  Calendar,
  FileText,
  Edit,
  Trash2,
  CreditCard,
  Banknote,
  Smartphone,
  DollarSign,
  Receipt,
  Users,
  Activity,
  BarChart3,
  PieChart,
  Filter,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertTriangle,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const Income = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isExportOpen, onOpen: onExportOpen, onClose: onExportClose } = useDisclosure();
  
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const gradientBg = useColorModeValue('linear(to-r, blue.400, purple.500)', 'linear(to-r, blue.600, purple.700)');

  // Enhanced mock data
  const incomeData = [
    {
      id: 'INC001',
      date: '2024-12-15',
      time: '09:30 AM',
      description: 'Patient Consultation - Dr. Priya Sharma',
      category: 'Consultation Fees',
      subcategory: 'General Consultation',
      amount: 2500,
      paymentMethod: 'UPI',
      patientId: '10001',
      patientName: 'Rajesh Kumar',
      doctorId: 'DOC001',
      doctorName: 'Dr. Priya Sharma',
      invoiceNumber: 'INV001',
      status: 'Received',
      department: 'General Medicine',
      paymentReference: 'UPI12345',
      commission: 500,
      netAmount: 2000,
      receivedBy: 'Reception'
    },
    {
      id: 'INC002',
      date: '2024-12-15',
      time: '11:15 AM',
      description: 'Panchakarma Treatment Package',
      category: 'Treatment Fees',
      subcategory: 'Panchakarma',
      amount: 15000,
      paymentMethod: 'Bank Transfer',
      patientId: '10002',
      patientName: 'Priya Sharma',
      doctorId: 'DOC002',
      doctorName: 'Dr. Amit Patel',
      invoiceNumber: 'INV002',
      status: 'Received',
      department: 'Panchakarma',
      paymentReference: 'NEFT87654',
      commission: 3000,
      netAmount: 12000,
      receivedBy: 'Billing'
    },
    {
      id: 'INC003',
      date: '2024-12-14',
      time: '02:45 PM',
      description: 'Ayurvedic Medicine Sales',
      category: 'Pharmacy Sales',
      subcategory: 'Medicines',
      amount: 3200,
      paymentMethod: 'Cash',
      patientId: 'P003',
      patientName: 'Anita Sharma',
      invoiceNumber: 'INV003',
      status: 'Received',
      department: 'Pharmacy',
      paymentReference: 'CASH003',
      commission: 0,
      netAmount: 3200,
      receivedBy: 'Pharmacy'
    },
    {
      id: 'INC004',
      date: '2024-12-14',
      time: '04:20 PM',
      description: 'Diagnostic Tests - Blood Work',
      category: 'Laboratory Fees',
      subcategory: 'Blood Tests',
      amount: 1800,
      paymentMethod: 'Credit Card',
      patientId: '10004',
      patientName: 'Suresh Gupta',
      doctorId: 'DOC003',
      doctorName: 'Dr. Meera Singh',
      invoiceNumber: 'INV004',
      status: 'Received',
      department: 'Laboratory',
      paymentReference: 'CC9876',
      commission: 360,
      netAmount: 1440,
      receivedBy: 'Lab Tech'
    },
    {
      id: 'INC005',
      date: '2024-12-13',
      time: '10:00 AM',
      description: 'Ayurvedic Massage Therapy',
      category: 'Treatment Fees',
      subcategory: 'Massage Therapy',
      amount: 4500,
      paymentMethod: 'UPI',
      patientId: '10005',
      patientName: 'Kavya Reddy',
      doctorId: 'DOC004',
      doctorName: 'Dr. Ramesh Iyer',
      invoiceNumber: 'INV005',
      status: 'Pending',
      department: 'Therapy',
      paymentReference: 'UPI56789',
      commission: 900,
      netAmount: 3600,
      receivedBy: 'Therapist'
    },
    {
      id: 'INC006',
      date: '2024-12-13',
      time: '03:30 PM',
      description: 'Herbal Supplements Sale',
      category: 'Pharmacy Sales',
      subcategory: 'Supplements',
      amount: 2800,
      paymentMethod: 'Debit Card',
      patientId: 'P006',
      patientName: 'Deepak Shah',
      invoiceNumber: 'INV006',
      status: 'Received',
      department: 'Pharmacy',
      paymentReference: 'DC4567',
      commission: 0,
      netAmount: 2800,
      receivedBy: 'Pharmacy'
    },
    {
      id: 'INC007',
      date: '2024-12-12',
      time: '01:15 PM',
      description: 'Specialized Consultation - Skin Care',
      category: 'Consultation Fees',
      subcategory: 'Specialist Consultation',
      amount: 3500,
      paymentMethod: 'Cash',
      patientId: '10007',
      patientName: 'Ritu Varma',
      doctorId: 'DOC005',
      doctorName: 'Dr. Sunita Rao',
      invoiceNumber: 'INV007',
      status: 'Received',
      department: 'Dermatology',
      paymentReference: 'CASH007',
      commission: 700,
      netAmount: 2800,
      receivedBy: 'Reception'
    },
    {
      id: 'INC008',
      date: '2024-12-12',
      time: '05:45 PM',
      description: 'Yoga Therapy Session',
      category: 'Treatment Fees',
      subcategory: 'Yoga Therapy',
      amount: 2000,
      paymentMethod: 'UPI',
      patientId: '10008',
      patientName: 'Manoj Agarwal',
      doctorId: 'DOC006',
      doctorName: 'Dr. Lakshmi Nair',
      invoiceNumber: 'INV008',
      status: 'Overdue',
      department: 'Yoga Therapy',
      paymentReference: 'UPI98765',
      commission: 400,
      netAmount: 1600,
      receivedBy: 'Instructor'
    }
  ];

  // Chart data
  const categoryData = [
    { category: 'Consultation Fees', amount: 6000, percentage: 18.5, color: '#4299E1' },
    { category: 'Treatment Fees', amount: 21500, percentage: 66.2, color: '#38B2AC' },
    { category: 'Pharmacy Sales', amount: 6000, percentage: 18.5, color: '#9F7AEA' },
    { category: 'Laboratory Fees', amount: 1800, percentage: 5.5, color: '#F56565' }
  ];

  const monthlyTrends = [
    { month: 'Jan', income: 45000, target: 50000 },
    { month: 'Feb', income: 52000, target: 50000 },
    { month: 'Mar', income: 48000, target: 50000 },
    { month: 'Apr', income: 55000, target: 50000 },
    { month: 'May', income: 58000, target: 50000 },
    { month: 'Jun', income: 62000, target: 50000 }
  ];

  const paymentMethods = [
    { method: 'UPI', count: 3, amount: 9000, icon: Smartphone, color: 'purple' },
    { method: 'Cash', count: 2, amount: 6300, icon: Banknote, color: 'green' },
    { method: 'Bank Transfer', count: 1, amount: 15000, icon: CreditCard, color: 'blue' },
    { method: 'Credit Card', count: 1, amount: 1800, icon: CreditCard, color: 'orange' },
    { method: 'Debit Card', count: 1, amount: 2800, icon: CreditCard, color: 'teal' }
  ];

  // Calculations
  const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0);
  const receivedIncome = incomeData.filter(i => i.status === 'Received').reduce((sum, i) => sum + i.amount, 0);
  const pendingIncome = incomeData.filter(i => i.status === 'Pending').reduce((sum, i) => sum + i.amount, 0);
  const overdueIncome = incomeData.filter(i => i.status === 'Overdue').reduce((sum, i) => sum + i.amount, 0);
  const todayIncome = incomeData.filter(i => i.date === '2024-12-15').reduce((sum, i) => sum + i.amount, 0);

  // Export functions
  const exportToPDF = () => {
    toast({
      title: "PDF Export",
      description: "Income report has been exported to PDF successfully!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onExportClose();
  };

  const exportToExcel = () => {
    toast({
      title: "Excel Export",
      description: "Income report has been exported to Excel successfully!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onExportClose();
  };

  const exportToCSV = () => {
    const csvContent = [
      ['ID', 'Date', 'Description', 'Category', 'Amount', 'Payment Method', 'Patient Name', 'Status'],
      ...filteredIncome.map(item => [
        item.id,
        item.date,
        item.description,
        item.category,
        item.amount,
        item.paymentMethod,
        item.patientName,
        item.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'income_report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "CSV Export",
      description: "Income report has been exported to CSV successfully!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onExportClose();
  };

  // Action handlers
  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
    onViewOpen();
  };

  const handleEditTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    onEditOpen();
  };

  const handleDeleteTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    onDeleteOpen();
  };

  const confirmDelete = () => {
    toast({
      title: "Transaction Deleted",
      description: `Transaction ${selectedTransaction?.id} has been deleted successfully.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onDeleteClose();
  };

  const downloadReceipt = (transaction) => {
    toast({
      title: "Receipt Downloaded",
      description: `Receipt for transaction ${transaction.id} has been downloaded.`,
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  // Filter function
  const filteredIncome = incomeData.filter(income => {
    const matchesSearch = income.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         income.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         income.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || income.category.toLowerCase().includes(categoryFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || income.status.toLowerCase() === statusFilter;
    const matchesDate = dateFilter === 'all' || income.date === dateFilter;
    return matchesSearch && matchesCategory && matchesStatus && matchesDate;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'received': return 'green';
      case 'pending': return 'yellow';
      case 'overdue': return 'red';
      default: return 'gray';
    }
  };

  const getPaymentIcon = (method) => {
    switch (method.toLowerCase()) {
      case 'upi': return <Smartphone size={16} />;
      case 'cash': return <Banknote size={16} />;
      case 'credit card':
      case 'debit card': return <CreditCard size={16} />;
      case 'bank transfer': return <FileText size={16} />;
      default: return <Receipt size={16} />;
    }
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <Box p={6} bg={useColorModeValue('gray.50', 'gray.900')} minH="100vh">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={8}>
        <Box>
          <Text fontSize="3xl" fontWeight="bold" color="gray.800">
            Income Management
          </Text>
          <Text color="gray.600" fontSize="lg">
            Track revenue streams and financial performance
          </Text>
        </Box>
        <HStack spacing={4}>
          <Menu>
            <MenuButton as={Button} leftIcon={<Download />} variant="outline" colorScheme="blue">
              Export Report
            </MenuButton>
            <MenuList>
              <MenuItem icon={<FileText size={16} />} onClick={exportToPDF}>
                Export as PDF
              </MenuItem>
              <MenuItem icon={<FileText size={16} />} onClick={exportToExcel}>
                Export as Excel
              </MenuItem>
              <MenuItem icon={<FileText size={16} />} onClick={exportToCSV}>
                Export as CSV
              </MenuItem>
            </MenuList>
          </Menu>
          <Button colorScheme="green" leftIcon={<Plus />} onClick={onAddOpen}>
            Add Income
          </Button>
        </HStack>
      </Flex>

      {/* KPI Cards with Gradients */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 5 }} spacing={6} mb={8}>
        <Card bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" color="white">
          <CardBody>
            <Flex align="center" justify="space-between">
              <Box>
                <Text fontSize="sm" opacity={0.8}>Total Revenue</Text>
                <Text fontSize="2xl" fontWeight="bold">{formatCurrency(totalIncome)}</Text>
                <HStack spacing={1}>
                  <TrendingUp size={12} />
                  <Text fontSize="xs">+12.5% from last month</Text>
                </HStack>
              </Box>
              <Box bg="whiteAlpha.200" p={3} borderRadius="full">
                <DollarSign size={24} />
              </Box>
            </Flex>
          </CardBody>
        </Card>

        <Card bg="linear-gradient(135deg, #48bb78 0%, #38a169 100%)" color="white">
          <CardBody>
            <Flex align="center" justify="space-between">
              <Box>
                <Text fontSize="sm" opacity={0.8}>Received</Text>
                <Text fontSize="2xl" fontWeight="bold">{formatCurrency(receivedIncome)}</Text>
                <HStack spacing={1}>
                  <CheckCircle size={12} />
                  <Text fontSize="xs">{Math.round((receivedIncome/totalIncome)*100)}% of total</Text>
                </HStack>
              </Box>
              <Box bg="whiteAlpha.200" p={3} borderRadius="full">
                <CheckCircle size={24} />
              </Box>
            </Flex>
          </CardBody>
        </Card>

        <Card bg="linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)" color="white">
          <CardBody>
            <Flex align="center" justify="space-between">
              <Box>
                <Text fontSize="sm" opacity={0.8}>Pending</Text>
                <Text fontSize="2xl" fontWeight="bold">{formatCurrency(pendingIncome)}</Text>
                <HStack spacing={1}>
                  <Clock size={12} />
                  <Text fontSize="xs">{Math.round((pendingIncome/totalIncome)*100)}% of total</Text>
                </HStack>
              </Box>
              <Box bg="whiteAlpha.200" p={3} borderRadius="full">
                <Clock size={24} />
              </Box>
            </Flex>
          </CardBody>
        </Card>

        <Card bg="linear-gradient(135deg, #e53e3e 0%, #c53030 100%)" color="white">
          <CardBody>
            <Flex align="center" justify="space-between">
              <Box>
                <Text fontSize="sm" opacity={0.8}>Overdue</Text>
                <Text fontSize="2xl" fontWeight="bold">{formatCurrency(overdueIncome)}</Text>
                <HStack spacing={1}>
                  <AlertTriangle size={12} />
                  <Text fontSize="xs">Needs attention</Text>
                </HStack>
              </Box>
              <Box bg="whiteAlpha.200" p={3} borderRadius="full">
                <AlertTriangle size={24} />
              </Box>
            </Flex>
          </CardBody>
        </Card>

        <Card bg="linear-gradient(135deg, #3182ce 0%, #2c5282 100%)" color="white">
          <CardBody>
            <Flex align="center" justify="space-between">
              <Box>
                <Text fontSize="sm" opacity={0.8}>Today's Income</Text>
                <Text fontSize="2xl" fontWeight="bold">{formatCurrency(todayIncome)}</Text>
                <HStack spacing={1}>
                  <Calendar size={12} />
                  <Text fontSize="xs">Daily earnings</Text>
                </HStack>
              </Box>
              <Box bg="whiteAlpha.200" p={3} borderRadius="full">
                <Target size={24} />
              </Box>
            </Flex>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Charts and Analytics */}
      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6} mb={8}>
        {/* Revenue Breakdown */}
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardHeader>
            <Flex align="center" justify="space-between">
              <HStack>
                <BarChart3 size={20} />
                <Text fontSize="lg" fontWeight="semibold">Revenue by Category</Text>
              </HStack>
              <Button size="sm" variant="outline" leftIcon={<RefreshCw size={16} />}>
                Refresh
              </Button>
            </Flex>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              {categoryData.map((item) => (
                <Box key={item.category}>
                  <Flex justify="space-between" mb={2}>
                    <HStack>
                      <Box w={3} h={3} bg={item.color} borderRadius="full" />
                      <Text fontSize="sm" fontWeight="medium">{item.category}</Text>
                    </HStack>
                    <VStack spacing={0} align="end">
                      <Text fontSize="sm" fontWeight="bold">{formatCurrency(item.amount)}</Text>
                      <Text fontSize="xs" color="gray.500">{item.percentage}%</Text>
                    </VStack>
                  </Flex>
                  <Progress value={item.percentage} colorScheme="blue" size="sm" />
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>

        {/* Payment Methods */}
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardHeader>
            <HStack>
              <PieChart size={20} />
              <Text fontSize="lg" fontWeight="semibold">Payment Methods</Text>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              {paymentMethods.map((method) => (
                <Flex key={method.method} align="center" justify="space-between" p={3} bg="gray.50" borderRadius="md">
                  <HStack>
                    <Box color={`${method.color}.500`}>
                      <method.icon size={20} />
                    </Box>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" fontWeight="medium">{method.method}</Text>
                      <Text fontSize="xs" color="gray.500">{method.count} transactions</Text>
                    </VStack>
                  </HStack>
                  <Text fontSize="sm" fontWeight="bold" color={`${method.color}.600`}>
                    {formatCurrency(method.amount)}
                  </Text>
                </Flex>
              ))}
            </VStack>
          </CardBody>
        </Card>
      </Grid>

      {/* Income Transactions Table */}
      <Card bg={cardBg} border="1px" borderColor={borderColor}>
        <CardHeader>
          <Flex justify="space-between" align="center">
            <HStack>
              <Activity size={20} />
              <Text fontSize="lg" fontWeight="semibold">Income Transactions</Text>
              <Badge colorScheme="blue">{filteredIncome.length} records</Badge>
            </HStack>
          </Flex>

          {/* Filters */}
          <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4} mt={4}>
            <InputGroup>
              <InputLeftElement>
                <Search size={16} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              placeholder="All Categories"
            >
              <option value="consultation fees">Consultation Fees</option>
              <option value="treatment fees">Treatment Fees</option>
              <option value="pharmacy sales">Pharmacy Sales</option>
              <option value="laboratory fees">Laboratory Fees</option>
            </Select>
            
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              placeholder="All Status"
            >
              <option value="received">Received</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </Select>

            <Select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              placeholder="All Dates"
            >
              <option value="2024-12-15">Today (15 Dec)</option>
              <option value="2024-12-14">Yesterday (14 Dec)</option>
              <option value="2024-12-13">13 Dec 2024</option>
              <option value="2024-12-12">12 Dec 2024</option>
            </Select>
          </Grid>
        </CardHeader>

        <CardBody>
          <TableContainer>
            <Table variant="simple" size="md">
              <Thead>
                <Tr>
                  <Th>Transaction Details</Th>
                  <Th>Patient/Customer</Th>
                  <Th>Category</Th>
                  <Th>Financial Details</Th>
                  <Th>Payment Method</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredIncome.map((income) => (
                  <Tr key={income.id} _hover={{ bg: 'gray.50' }}>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="medium" fontSize="sm">{income.description}</Text>
                        <HStack fontSize="xs" color="gray.500">
                          <Calendar size={12} />
                          <Text>{income.date} • {income.time}</Text>
                        </HStack>
                        <HStack fontSize="xs" color="gray.400">
                          <Receipt size={12} />
                          <Text>#{income.invoiceNumber}</Text>
                          <Text>• ID: {income.id}</Text>
                        </HStack>
                      </VStack>
                    </Td>
                    <Td>
                      <HStack>
                        <Avatar size="sm" name={income.patientName} />
                        <VStack align="start" spacing={0}>
                          <Text fontSize="sm" fontWeight="medium">{income.patientName}</Text>
                          <Text fontSize="xs" color="gray.500">ID: {income.patientId}</Text>
                          {income.doctorName && (
                            <Text fontSize="xs" color="blue.500">Dr: {income.doctorName}</Text>
                          )}
                        </VStack>
                      </HStack>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <Badge colorScheme="blue" variant="outline" size="sm">
                          {income.category}
                        </Badge>
                        {income.department && (
                          <Text fontSize="xs" color="gray.500">{income.department}</Text>
                        )}
                      </VStack>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold" color="green.600" fontSize="sm">
                          {formatCurrency(income.amount)}
                        </Text>
                        {income.commission > 0 && (
                          <Text fontSize="xs" color="purple.500">
                            Commission: {formatCurrency(income.commission)}
                          </Text>
                        )}
                        <Text fontSize="xs" color="gray.500">
                          Net: {formatCurrency(income.netAmount || income.amount)}
                        </Text>
                      </VStack>
                    </Td>
                    <Td>
                      <HStack>
                        {getPaymentIcon(income.paymentMethod)}
                        <VStack align="start" spacing={0}>
                          <Text fontSize="sm">{income.paymentMethod}</Text>
                          <Text fontSize="xs" color="gray.500">{income.paymentReference}</Text>
                        </VStack>
                      </HStack>
                    </Td>
                    <Td>
                      <Badge colorScheme={getStatusColor(income.status)} variant="subtle">
                        {income.status}
                      </Badge>
                    </Td>
                    <Td>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<MoreVertical />}
                          variant="ghost"
                          size="sm"
                        />
                        <MenuList>
                          <MenuItem icon={<Eye size={16} />} onClick={() => handleViewDetails(income)}>
                            View Details
                          </MenuItem>
                          <MenuItem icon={<Edit size={16} />} onClick={() => handleEditTransaction(income)}>
                            Edit Transaction
                          </MenuItem>
                          <MenuItem icon={<Download size={16} />} onClick={() => downloadReceipt(income)}>
                            Download Receipt
                          </MenuItem>
                          <MenuItem icon={<Trash2 size={16} />} color="red.500" onClick={() => handleDeleteTransaction(income)}>
                            Delete
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

      {/* Add Income Modal */}
      <Modal isOpen={isAddOpen} onClose={onAddClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Income</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input placeholder="Enter income description" />
              </FormControl>
              
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <FormControl>
                  <FormLabel>Category</FormLabel>
                  <Select placeholder="Select category">
                    <option value="consultation">Consultation Fees</option>
                    <option value="treatment">Treatment Fees</option>
                    <option value="pharmacy">Pharmacy Sales</option>
                    <option value="laboratory">Laboratory Fees</option>
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Amount (₹)</FormLabel>
                  <Input type="number" placeholder="0.00" />
                </FormControl>
              </Grid>
              
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <FormControl>
                  <FormLabel>Payment Method</FormLabel>
                  <Select placeholder="Select method">
                    <option value="cash">Cash</option>
                    <option value="upi">UPI</option>
                    <option value="card">Credit/Debit Card</option>
                    <option value="transfer">Bank Transfer</option>
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Patient ID</FormLabel>
                  <Input placeholder="P001" />
                </FormControl>
              </Grid>
              
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <FormControl>
                  <FormLabel>Invoice Number</FormLabel>
                  <Input placeholder="INV001" />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <Select placeholder="Select status">
                    <option value="received">Received</option>
                    <option value="pending">Pending</option>
                  </Select>
                </FormControl>
              </Grid>
              
              <FormControl>
                <FormLabel>Notes</FormLabel>
                <Textarea placeholder="Additional notes (optional)" rows={3} />
              </FormControl>
            </VStack>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onAddClose}>
              Cancel
            </Button>
            <Button colorScheme="green" leftIcon={<Plus />}>
              Add Income
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View Details Modal */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Transaction Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedTransaction && (
              <VStack spacing={4} align="stretch">
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <FormControl>
                    <FormLabel fontSize="sm" color="gray.600">Transaction ID</FormLabel>
                    <Text fontWeight="medium">{selectedTransaction.id}</Text>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm" color="gray.600">Date & Time</FormLabel>
                    <Text fontWeight="medium">{selectedTransaction.date}, {selectedTransaction.time}</Text>
                  </FormControl>
                </Grid>
                
                <FormControl>
                  <FormLabel fontSize="sm" color="gray.600">Description</FormLabel>
                  <Text fontWeight="medium">{selectedTransaction.description}</Text>
                </FormControl>
                
                <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                  <FormControl>
                    <FormLabel fontSize="sm" color="gray.600">Amount</FormLabel>
                    <Text fontWeight="bold" color="green.600">{formatCurrency(selectedTransaction.amount)}</Text>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm" color="gray.600">Commission</FormLabel>
                    <Text fontWeight="medium">{formatCurrency(selectedTransaction.commission || 0)}</Text>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm" color="gray.600">Net Amount</FormLabel>
                    <Text fontWeight="medium">{formatCurrency(selectedTransaction.netAmount || selectedTransaction.amount)}</Text>
                  </FormControl>
                </Grid>
                
                <Divider />
                
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <FormControl>
                    <FormLabel fontSize="sm" color="gray.600">Patient Name</FormLabel>
                    <Text fontWeight="medium">{selectedTransaction.patientName}</Text>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm" color="gray.600">Patient ID</FormLabel>
                    <Text fontWeight="medium">{selectedTransaction.patientId}</Text>
                  </FormControl>
                </Grid>
                
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <FormControl>
                    <FormLabel fontSize="sm" color="gray.600">Doctor</FormLabel>
                    <Text fontWeight="medium">{selectedTransaction.doctorName || 'N/A'}</Text>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm" color="gray.600">Department</FormLabel>
                    <Text fontWeight="medium">{selectedTransaction.department}</Text>
                  </FormControl>
                </Grid>
                
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <FormControl>
                    <FormLabel fontSize="sm" color="gray.600">Payment Method</FormLabel>
                    <HStack>
                      {getPaymentIcon(selectedTransaction.paymentMethod)}
                      <Text fontWeight="medium">{selectedTransaction.paymentMethod}</Text>
                    </HStack>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm" color="gray.600">Reference</FormLabel>
                    <Text fontWeight="medium">{selectedTransaction.paymentReference}</Text>
                  </FormControl>
                </Grid>
              </VStack>
            )}
          </ModalBody>
          
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onViewClose}>
              Close
            </Button>
            <Button colorScheme="blue" leftIcon={<Download />} onClick={() => downloadReceipt(selectedTransaction)}>
              Download Receipt
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Transaction Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Transaction</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedTransaction && (
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Input defaultValue={selectedTransaction.description} />
                </FormControl>
                
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <FormControl>
                    <FormLabel>Category</FormLabel>
                    <Select defaultValue={selectedTransaction.category}>
                      <option value="Consultation Fees">Consultation Fees</option>
                      <option value="Treatment Fees">Treatment Fees</option>
                      <option value="Pharmacy Sales">Pharmacy Sales</option>
                      <option value="Laboratory Fees">Laboratory Fees</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Amount (₹)</FormLabel>
                    <Input type="number" defaultValue={selectedTransaction.amount} />
                  </FormControl>
                </Grid>
                
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <FormControl>
                    <FormLabel>Payment Method</FormLabel>
                    <Select defaultValue={selectedTransaction.paymentMethod}>
                      <option value="Cash">Cash</option>
                      <option value="UPI">UPI</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Debit Card">Debit Card</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Status</FormLabel>
                    <Select defaultValue={selectedTransaction.status}>
                      <option value="Received">Received</option>
                      <option value="Pending">Pending</option>
                      <option value="Overdue">Overdue</option>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <FormControl>
                    <FormLabel>Patient Name</FormLabel>
                    <Input defaultValue={selectedTransaction.patientName} />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Patient ID</FormLabel>
                    <Input defaultValue={selectedTransaction.patientId} />
                  </FormControl>
                </Grid>
                
                <FormControl>
                  <FormLabel>Payment Reference</FormLabel>
                  <Input defaultValue={selectedTransaction.paymentReference} />
                </FormControl>
              </VStack>
            )}
          </ModalBody>
          
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onEditClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" leftIcon={<Edit />}>
              Update Transaction
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Transaction</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedTransaction && (
              <VStack spacing={4} align="stretch">
                <Text>Are you sure you want to delete this transaction?</Text>
                <Box p={4} bg="gray.50" borderRadius="md">
                  <VStack align="start" spacing={2}>
                    <Text fontSize="sm"><strong>ID:</strong> {selectedTransaction.id}</Text>
                    <Text fontSize="sm"><strong>Description:</strong> {selectedTransaction.description}</Text>
                    <Text fontSize="sm"><strong>Amount:</strong> {formatCurrency(selectedTransaction.amount)}</Text>
                    <Text fontSize="sm"><strong>Patient:</strong> {selectedTransaction.patientName}</Text>
                  </VStack>
                </Box>
                <Text fontSize="sm" color="red.500">This action cannot be undone.</Text>
              </VStack>
            )}
          </ModalBody>
          
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onDeleteClose}>
              Cancel
            </Button>
            <Button colorScheme="red" leftIcon={<Trash2 />} onClick={confirmDelete}>
              Delete Transaction
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Income;