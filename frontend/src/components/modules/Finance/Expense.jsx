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
  InputGroup,
  InputLeftElement,
  Divider,
  Avatar,
  useToast
} from '@chakra-ui/react';
import {
  Search,
  Plus,
  MoreVertical,
  Eye,
  Download,
  TrendingDown,
  TrendingUp,
  Calendar,
  FileText,
  Edit,
  Trash2,
  CreditCard,
  Banknote,
  Smartphone,
  Users,
  Package,
  Wrench,
  Building,
  Receipt,
  AlertTriangle,
  Clock,
  CheckCircle,
  Target,
  Activity,
  BarChart3,
  PieChart,
  DollarSign,
  RefreshCw,
  Filter
} from 'lucide-react';

const Expense = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedExpense, setSelectedExpense] = useState(null);
  
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Enhanced mock expense data
  const expenseData = [
    {
      id: 'EXP001',
      date: '2024-12-15',
      time: '09:30 AM',
      description: 'Medical Equipment Purchase - BP Monitor',
      category: 'Equipment',
      subcategory: 'Medical Devices',
      amount: 25000,
      paymentMethod: 'Bank Transfer',
      vendor: 'Omron Healthcare',
      vendorId: 'V001',
      invoiceNumber: 'PO001',
      status: 'Paid',
      approvedBy: 'Dr. Priya Sharma',
      department: 'General Medicine',
      paymentReference: 'NEFT25000',
      dueDate: '2024-12-20',
      notes: 'Essential equipment for patient monitoring'
    },
    {
      id: 'EXP002',
      date: '2024-12-14',
      time: '11:00 AM',
      description: 'Staff Salary - December 2024',
      category: 'Payroll',
      subcategory: 'Monthly Salaries',
      amount: 185000,
      paymentMethod: 'Bank Transfer',
      vendor: 'Employee Salaries',
      vendorId: 'PAYROLL',
      invoiceNumber: 'SAL001',
      status: 'Paid',
      approvedBy: 'Admin Team',
      department: 'Human Resources',
      paymentReference: 'SALARY_DEC24',
      dueDate: '2024-12-15',
      notes: 'Monthly salary disbursement for all staff'
    },
    {
      id: 'EXP003',
      date: '2024-12-14',
      time: '02:45 PM',
      description: 'Ayurvedic Medicine Stock Purchase',
      category: 'Inventory',
      subcategory: 'Medicines',
      amount: 35000,
      paymentMethod: 'NEFT',
      vendor: 'Himalaya Wellness',
      vendorId: 'V002',
      invoiceNumber: 'PO002',
      status: 'Paid',
      approvedBy: 'Dr. Amit Patel',
      department: 'Pharmacy',
      paymentReference: 'NEFT35000',
      dueDate: '2024-12-18',
      notes: 'Quarterly stock replenishment'
    },
    {
      id: 'EXP004',
      date: '2024-12-13',
      time: '10:15 AM',
      description: 'Facility Maintenance - HVAC System',
      category: 'Maintenance',
      subcategory: 'HVAC',
      amount: 15000,
      paymentMethod: 'Cash',
      vendor: 'Climate Control Solutions',
      vendorId: 'V003',
      invoiceNumber: 'SRV001',
      status: 'Paid',
      approvedBy: 'Facility Manager',
      department: 'Maintenance',
      paymentReference: 'CASH15000',
      dueDate: '2024-12-13',
      notes: 'Emergency repair of main HVAC unit'
    },
    {
      id: 'EXP005',
      date: '2024-12-13',
      time: '03:30 PM',
      description: 'Office Supplies - Stationery & Forms',
      category: 'Office Supplies',
      subcategory: 'Stationery',
      amount: 8500,
      paymentMethod: 'Credit Card',
      vendor: 'Office Depot',
      vendorId: 'V004',
      invoiceNumber: 'OFF001',
      status: 'Pending',
      approvedBy: 'Office Manager',
      department: 'Administration',
      paymentReference: 'CC8500',
      dueDate: '2024-12-20',
      notes: 'Monthly office supplies order'
    },
    {
      id: 'EXP006',
      date: '2024-12-12',
      time: '01:20 PM',
      description: 'Utility Bills - Electricity & Water',
      category: 'Utilities',
      subcategory: 'Electricity',
      amount: 22000,
      paymentMethod: 'UPI',
      vendor: 'State Electricity Board',
      vendorId: 'UTILITY',
      invoiceNumber: 'ELEC001',
      status: 'Paid',
      approvedBy: 'Admin Team',
      department: 'Administration',
      paymentReference: 'UPI22000',
      dueDate: '2024-12-15',
      notes: 'Monthly utility payment'
    },
    {
      id: 'EXP007',
      date: '2024-12-12',
      time: '04:45 PM',
      description: 'Insurance Premium - Medical Malpractice',
      category: 'Insurance',
      subcategory: 'Professional Insurance',
      amount: 45000,
      paymentMethod: 'Bank Transfer',
      vendor: 'Healthcare Insurance Co.',
      vendorId: 'V005',
      invoiceNumber: 'INS001',
      status: 'Pending',
      approvedBy: 'Dr. Priya Sharma',
      department: 'Administration',
      paymentReference: 'PENDING',
      dueDate: '2024-12-18',
      notes: 'Quarterly insurance premium'
    },
    {
      id: 'EXP008',
      date: '2024-12-11',
      time: '09:00 AM',
      description: 'Marketing Campaign - Health Awareness',
      category: 'Marketing',
      subcategory: 'Digital Marketing',
      amount: 12000,
      paymentMethod: 'Credit Card',
      vendor: 'Digital Marketing Agency',
      vendorId: 'V006',
      invoiceNumber: 'MKT001',
      status: 'Overdue',
      approvedBy: 'Marketing Head',
      department: 'Marketing',
      paymentReference: 'CC12000',
      dueDate: '2024-12-10',
      notes: 'Social media and digital advertising'
    }
  ];

  // Chart data for expense categories
  const categoryData = [
    { category: 'Payroll', amount: 185000, percentage: 52.1, color: '#4299E1' },
    { category: 'Insurance', amount: 45000, percentage: 12.7, color: '#38B2AC' },
    { category: 'Inventory', amount: 35000, percentage: 9.9, color: '#9F7AEA' },
    { category: 'Equipment', amount: 25000, percentage: 7.0, color: '#F56565' },
    { category: 'Utilities', amount: 22000, percentage: 6.2, color: '#ED8936' },
    { category: 'Maintenance', amount: 15000, percentage: 4.2, color: '#48BB78' },
    { category: 'Marketing', amount: 12000, percentage: 3.4, color: '#805AD5' },
    { category: 'Office Supplies', amount: 8500, percentage: 2.4, color: '#D69E2E' }
  ];

  const paymentMethods = [
    { method: 'Bank Transfer', count: 3, amount: 255000, icon: CreditCard, color: 'blue' },
    { method: 'Credit Card', count: 2, amount: 20500, icon: CreditCard, color: 'purple' },
    { method: 'UPI', count: 1, amount: 22000, icon: Smartphone, color: 'green' },
    { method: 'NEFT', count: 1, amount: 35000, icon: FileText, color: 'teal' },
    { method: 'Cash', count: 1, amount: 15000, icon: Banknote, color: 'orange' }
  ];

  // Calculations
  const totalExpenses = expenseData.reduce((sum, item) => sum + item.amount, 0);
  const paidExpenses = expenseData.filter(e => e.status === 'Paid').reduce((sum, e) => sum + e.amount, 0);
  const pendingExpenses = expenseData.filter(e => e.status === 'Pending').reduce((sum, e) => sum + e.amount, 0);
  const overdueExpenses = expenseData.filter(e => e.status === 'Overdue').reduce((sum, e) => sum + e.amount, 0);
  const todayExpenses = expenseData.filter(e => e.date === '2024-12-15').reduce((sum, e) => sum + e.amount, 0);

  // Export functions
  const exportToPDF = () => {
    toast({
      title: "PDF Export",
      description: "Expense report has been exported to PDF successfully!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const exportToExcel = () => {
    toast({
      title: "Excel Export",
      description: "Expense report has been exported to Excel successfully!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const exportToCSV = () => {
    const csvContent = [
      ['ID', 'Date', 'Description', 'Category', 'Amount', 'Payment Method', 'Vendor', 'Status'],
      ...filteredExpenses.map(item => [
        item.id,
        item.date,
        item.description,
        item.category,
        item.amount,
        item.paymentMethod,
        item.vendor,
        item.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expense_report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "CSV Export",
      description: "Expense report has been exported to CSV successfully!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Action handlers
  const handleViewDetails = (expense) => {
    setSelectedExpense(expense);
    onViewOpen();
  };

  const handleEditExpense = (expense) => {
    setSelectedExpense(expense);
    onEditOpen();
  };

  const handleDeleteExpense = (expense) => {
    setSelectedExpense(expense);
    onDeleteOpen();
  };

  const confirmDelete = () => {
    toast({
      title: "Expense Deleted",
      description: `Expense ${selectedExpense?.id} has been deleted successfully.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onDeleteClose();
  };

  const downloadReceipt = (expense) => {
    toast({
      title: "Receipt Downloaded",
      description: `Receipt for expense ${expense.id} has been downloaded.`,
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  // Filter function
  const filteredExpenses = expenseData.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || expense.category.toLowerCase().includes(categoryFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || expense.status.toLowerCase() === statusFilter;
    const matchesDate = dateFilter === 'all' || expense.date === dateFilter;
    return matchesSearch && matchesCategory && matchesStatus && matchesDate;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'green';
      case 'pending': return 'yellow';
      case 'overdue': return 'red';
      default: return 'gray';
    }
  };

  const getPaymentIcon = (method) => {
    switch (method.toLowerCase()) {
      case 'upi': return <Smartphone size={16} />;
      case 'cash': return <Banknote size={16} />;
      case 'credit card': return <CreditCard size={16} />;
      case 'bank transfer':
      case 'neft': return <FileText size={16} />;
      default: return <Receipt size={16} />;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'equipment': return <Wrench size={16} />;
      case 'payroll': return <Users size={16} />;
      case 'inventory': return <Package size={16} />;
      case 'maintenance': return <Wrench size={16} />;
      case 'utilities': return <Building size={16} />;
      default: return <FileText size={16} />;
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
            Expense Management
          </Text>
          <Text color="gray.600" fontSize="lg">
            Track expenditures and financial outflows
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
          <Button colorScheme="red" leftIcon={<Plus />} onClick={onAddOpen}>
            Add Expense
          </Button>
        </HStack>
      </Flex>

      {/* KPI Cards with Gradients */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 5 }} spacing={6} mb={8}>
        <Card bg="linear-gradient(135deg, #e53e3e 0%, #c53030 100%)" color="white">
          <CardBody>
            <Flex align="center" justify="space-between">
              <Box>
                <Text fontSize="sm" opacity={0.8}>Total Expenses</Text>
                <Text fontSize="2xl" fontWeight="bold">{formatCurrency(totalExpenses)}</Text>
                <HStack spacing={1}>
                  <TrendingDown size={12} />
                  <Text fontSize="xs">Monthly outflow</Text>
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
                <Text fontSize="sm" opacity={0.8}>Paid</Text>
                <Text fontSize="2xl" fontWeight="bold">{formatCurrency(paidExpenses)}</Text>
                <HStack spacing={1}>
                  <CheckCircle size={12} />
                  <Text fontSize="xs">{Math.round((paidExpenses/totalExpenses)*100)}% of total</Text>
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
                <Text fontSize="2xl" fontWeight="bold">{formatCurrency(pendingExpenses)}</Text>
                <HStack spacing={1}>
                  <Clock size={12} />
                  <Text fontSize="xs">{Math.round((pendingExpenses/totalExpenses)*100)}% of total</Text>
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
                <Text fontSize="2xl" fontWeight="bold">{formatCurrency(overdueExpenses)}</Text>
                <HStack spacing={1}>
                  <AlertTriangle size={12} />
                  <Text fontSize="xs">Requires attention</Text>
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
                <Text fontSize="sm" opacity={0.8}>Today's Expenses</Text>
                <Text fontSize="2xl" fontWeight="bold">{formatCurrency(todayExpenses)}</Text>
                <HStack spacing={1}>
                  <Calendar size={12} />
                  <Text fontSize="xs">Daily spending</Text>
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
        {/* Expense Breakdown */}
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardHeader>
            <Flex align="center" justify="space-between">
              <HStack>
                <BarChart3 size={20} />
                <Text fontSize="lg" fontWeight="semibold">Expense by Category</Text>
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
                  <Progress value={item.percentage} colorScheme="red" size="sm" />
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

      {/* Expense Transactions Table */}
      <Card bg={cardBg} border="1px" borderColor={borderColor}>
        <CardHeader>
          <Flex justify="space-between" align="center">
            <HStack>
              <Activity size={20} />
              <Text fontSize="lg" fontWeight="semibold">Expense Transactions</Text>
              <Badge colorScheme="red">{filteredExpenses.length} records</Badge>
            </HStack>
          </Flex>

          {/* Filters */}
          <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4} mt={4}>
            <InputGroup>
              <InputLeftElement>
                <Search size={16} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              placeholder="All Categories"
            >
              <option value="equipment">Equipment</option>
              <option value="payroll">Payroll</option>
              <option value="inventory">Inventory</option>
              <option value="maintenance">Maintenance</option>
              <option value="utilities">Utilities</option>
              <option value="office supplies">Office Supplies</option>
              <option value="insurance">Insurance</option>
              <option value="marketing">Marketing</option>
            </Select>
            
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              placeholder="All Status"
            >
              <option value="paid">Paid</option>
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
                  <Th>Vendor Info</Th>
                  <Th>Category</Th>
                  <Th>Financial Details</Th>
                  <Th>Payment Method</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredExpenses.map((expense) => (
                  <Tr key={expense.id} _hover={{ bg: 'gray.50' }}>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="medium" fontSize="sm">{expense.description}</Text>
                        <HStack fontSize="xs" color="gray.500">
                          <Calendar size={12} />
                          <Text>{expense.date} • {expense.time}</Text>
                        </HStack>
                        <HStack fontSize="xs" color="gray.400">
                          <Receipt size={12} />
                          <Text>#{expense.invoiceNumber}</Text>
                          <Text>• ID: {expense.id}</Text>
                        </HStack>
                      </VStack>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <Text fontSize="sm" fontWeight="medium">{expense.vendor}</Text>
                        <Text fontSize="xs" color="gray.500">ID: {expense.vendorId}</Text>
                        <Text fontSize="xs" color="blue.500">
                          Approved: {expense.approvedBy}
                        </Text>
                      </VStack>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <HStack>
                          {getCategoryIcon(expense.category)}
                          <Badge colorScheme="red" variant="outline" size="sm">
                            {expense.category}
                          </Badge>
                        </HStack>
                        {expense.department && (
                          <Text fontSize="xs" color="gray.500">{expense.department}</Text>
                        )}
                      </VStack>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold" color="red.600" fontSize="sm">
                          {formatCurrency(expense.amount)}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          Due: {expense.dueDate}
                        </Text>
                      </VStack>
                    </Td>
                    <Td>
                      <HStack>
                        {getPaymentIcon(expense.paymentMethod)}
                        <VStack align="start" spacing={0}>
                          <Text fontSize="sm">{expense.paymentMethod}</Text>
                          <Text fontSize="xs" color="gray.500">{expense.paymentReference}</Text>
                        </VStack>
                      </HStack>
                    </Td>
                    <Td>
                      <Badge colorScheme={getStatusColor(expense.status)} variant="subtle">
                        {expense.status}
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
                          <MenuItem icon={<Eye size={16} />} onClick={() => handleViewDetails(expense)}>
                            View Details
                          </MenuItem>
                          <MenuItem icon={<Edit size={16} />} onClick={() => handleEditExpense(expense)}>
                            Edit Expense
                          </MenuItem>
                          <MenuItem icon={<Download size={16} />} onClick={() => downloadReceipt(expense)}>
                            Download Receipt
                          </MenuItem>
                          <MenuItem icon={<Trash2 size={16} />} color="red.500" onClick={() => handleDeleteExpense(expense)}>
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

      {/* Add Expense Modal */}
      <Modal isOpen={isAddOpen} onClose={onAddClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Expense</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input placeholder="Enter expense description" />
              </FormControl>
              
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <FormControl>
                  <FormLabel>Category</FormLabel>
                  <Select placeholder="Select category">
                    <option value="equipment">Equipment</option>
                    <option value="payroll">Payroll</option>
                    <option value="inventory">Inventory</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="utilities">Utilities</option>
                    <option value="office supplies">Office Supplies</option>
                    <option value="insurance">Insurance</option>
                    <option value="marketing">Marketing</option>
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
                    <option value="neft">NEFT</option>
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Vendor</FormLabel>
                  <Input placeholder="Vendor name" />
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
                    <option value="paid">Paid</option>
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
            <Button colorScheme="red" leftIcon={<Plus />}>
              Add Expense
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View Details Modal */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Expense Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedExpense && (
              <VStack spacing={4} align="stretch">
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <FormControl>
                    <FormLabel fontSize="sm" color="gray.600">Expense ID</FormLabel>
                    <Text fontWeight="medium">{selectedExpense.id}</Text>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm" color="gray.600">Date & Time</FormLabel>
                    <Text fontWeight="medium">{selectedExpense.date}, {selectedExpense.time}</Text>
                  </FormControl>
                </Grid>
                
                <FormControl>
                  <FormLabel fontSize="sm" color="gray.600">Description</FormLabel>
                  <Text fontWeight="medium">{selectedExpense.description}</Text>
                </FormControl>
                
                <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                  <FormControl>
                    <FormLabel fontSize="sm" color="gray.600">Amount</FormLabel>
                    <Text fontWeight="bold" color="red.600">{formatCurrency(selectedExpense.amount)}</Text>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm" color="gray.600">Category</FormLabel>
                    <Text fontWeight="medium">{selectedExpense.category}</Text>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm" color="gray.600">Department</FormLabel>
                    <Text fontWeight="medium">{selectedExpense.department}</Text>
                  </FormControl>
                </Grid>
                
                <Divider />
                
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <FormControl>
                    <FormLabel fontSize="sm" color="gray.600">Vendor</FormLabel>
                    <Text fontWeight="medium">{selectedExpense.vendor}</Text>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm" color="gray.600">Vendor ID</FormLabel>
                    <Text fontWeight="medium">{selectedExpense.vendorId}</Text>
                  </FormControl>
                </Grid>
                
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <FormControl>
                    <FormLabel fontSize="sm" color="gray.600">Payment Method</FormLabel>
                    <HStack>
                      {getPaymentIcon(selectedExpense.paymentMethod)}
                      <Text fontWeight="medium">{selectedExpense.paymentMethod}</Text>
                    </HStack>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm" color="gray.600">Reference</FormLabel>
                    <Text fontWeight="medium">{selectedExpense.paymentReference}</Text>
                  </FormControl>
                </Grid>
                
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <FormControl>
                    <FormLabel fontSize="sm" color="gray.600">Approved By</FormLabel>
                    <Text fontWeight="medium">{selectedExpense.approvedBy}</Text>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm" color="gray.600">Due Date</FormLabel>
                    <Text fontWeight="medium">{selectedExpense.dueDate}</Text>
                  </FormControl>
                </Grid>
                
                {selectedExpense.notes && (
                  <FormControl>
                    <FormLabel fontSize="sm" color="gray.600">Notes</FormLabel>
                    <Text fontWeight="medium">{selectedExpense.notes}</Text>
                  </FormControl>
                )}
              </VStack>
            )}
          </ModalBody>
          
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onViewClose}>
              Close
            </Button>
            <Button colorScheme="blue" leftIcon={<Download />} onClick={() => downloadReceipt(selectedExpense)}>
              Download Receipt
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Expense Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Expense</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedExpense && (
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Input defaultValue={selectedExpense.description} />
                </FormControl>
                
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <FormControl>
                    <FormLabel>Category</FormLabel>
                    <Select defaultValue={selectedExpense.category}>
                      <option value="Equipment">Equipment</option>
                      <option value="Payroll">Payroll</option>
                      <option value="Inventory">Inventory</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Office Supplies">Office Supplies</option>
                      <option value="Insurance">Insurance</option>
                      <option value="Marketing">Marketing</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Amount (₹)</FormLabel>
                    <Input type="number" defaultValue={selectedExpense.amount} />
                  </FormControl>
                </Grid>
                
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <FormControl>
                    <FormLabel>Payment Method</FormLabel>
                    <Select defaultValue={selectedExpense.paymentMethod}>
                      <option value="Cash">Cash</option>
                      <option value="UPI">UPI</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="NEFT">NEFT</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Status</FormLabel>
                    <Select defaultValue={selectedExpense.status}>
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                      <option value="Overdue">Overdue</option>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <FormControl>
                    <FormLabel>Vendor</FormLabel>
                    <Input defaultValue={selectedExpense.vendor} />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Invoice Number</FormLabel>
                    <Input defaultValue={selectedExpense.invoiceNumber} />
                  </FormControl>
                </Grid>
                
                <FormControl>
                  <FormLabel>Payment Reference</FormLabel>
                  <Input defaultValue={selectedExpense.paymentReference} />
                </FormControl>
              </VStack>
            )}
          </ModalBody>
          
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onEditClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" leftIcon={<Edit />}>
              Update Expense
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Expense</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedExpense && (
              <VStack spacing={4} align="stretch">
                <Text>Are you sure you want to delete this expense?</Text>
                <Box p={4} bg="gray.50" borderRadius="md">
                  <VStack align="start" spacing={2}>
                    <Text fontSize="sm"><strong>ID:</strong> {selectedExpense.id}</Text>
                    <Text fontSize="sm"><strong>Description:</strong> {selectedExpense.description}</Text>
                    <Text fontSize="sm"><strong>Amount:</strong> {formatCurrency(selectedExpense.amount)}</Text>
                    <Text fontSize="sm"><strong>Vendor:</strong> {selectedExpense.vendor}</Text>
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
              Delete Expense
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Expense;
