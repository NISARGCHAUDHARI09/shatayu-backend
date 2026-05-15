import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardBody,
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
  Divider,
  Progress
} from '@chakra-ui/react';
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Eye,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  PieChart,
  BarChart3,
  Calendar,
  FileText,
  Calculator
} from 'lucide-react';

// Mock finance data
const mockTransactions = [
  {
    id: 'TXN001',
    date: '2024-12-15',
    description: 'Patient Payment - Consultation',
    category: 'Revenue',
    type: 'Income',
    amount: 2500,
    paymentMethod: 'UPI',
    status: 'Completed',
    reference: 'INV001'
  },
  {
    id: 'TXN002',
    date: '2024-12-15',
    description: 'Medical Supplies Purchase',
    category: 'Inventory',
    type: 'Expense',
    amount: 15000,
    paymentMethod: 'Bank Transfer',
    status: 'Completed',
    reference: 'PO001'
  },
  {
    id: 'TXN003',
    date: '2024-12-14',
    description: 'Staff Salary - December',
    category: 'Payroll',
    type: 'Expense',
    amount: 185000,
    paymentMethod: 'Bank Transfer',
    status: 'Completed',
    reference: 'SAL001'
  },
  {
    id: 'TXN004',
    date: '2024-12-14',
    description: 'Insurance Claim - TPA Payment',
    category: 'Insurance',
    type: 'Income',
    amount: 45000,
    paymentMethod: 'NEFT',
    status: 'Pending',
    reference: 'INS001'
  },
  {
    id: 'TXN005',
    date: '2024-12-13',
    description: 'Equipment Maintenance',
    category: 'Maintenance',
    type: 'Expense',
    amount: 8500,
    paymentMethod: 'Cash',
    status: 'Completed',
    reference: 'MAINT001'
  }
];

const mockBudgets = [
  { category: 'Revenue Target', budgeted: 500000, actual: 475000, percentage: 95 },
  { category: 'Staff Salaries', budgeted: 200000, actual: 185000, percentage: 92.5 },
  { category: 'Medical Supplies', budgeted: 50000, actual: 62000, percentage: 124 },
  { category: 'Equipment', budgeted: 30000, actual: 25000, percentage: 83.3 },
  { category: 'Utilities', budgeted: 15000, actual: 14200, percentage: 94.7 },
  { category: 'Marketing', budgeted: 10000, actual: 8500, percentage: 85 }
];

const Finance = ({ title = "Finance Management", showAddButton = true }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('thisMonth');
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Filter transactions
  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || transaction.category.toLowerCase() === categoryFilter;
    const matchesType = typeFilter === 'all' || transaction.type.toLowerCase() === typeFilter;
    return matchesSearch && matchesCategory && matchesType;
  });

  // Calculate statistics
  const totalIncome = mockTransactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = mockTransactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncome - totalExpenses;
  const pendingAmount = mockTransactions.filter(t => t.status === 'Pending').reduce((sum, t) => sum + t.amount, 0);

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'income': return 'green';
      case 'expense': return 'red';
      default: return 'gray';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'green';
      case 'pending': return 'yellow';
      case 'failed': return 'red';
      default: return 'gray';
    }
  };

  const getBudgetColor = (percentage) => {
    if (percentage <= 80) return 'green';
    if (percentage <= 100) return 'yellow';
    return 'red';
  };

  return (
    <Box>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
            {title}
          </Text>
          <Text color="gray.600">
            Hospital financial management and budget tracking
          </Text>
        </Box>
        {showAddButton && (
          <HStack>
            <Button leftIcon={<Calculator />} variant="outline">
              Budget Planner
            </Button>
            <Button colorScheme="blue" leftIcon={<Plus />}>
              Add Transaction
            </Button>
          </HStack>
        )}
      </Flex>

      {/* Financial Overview Cards */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={6} mb={6}>
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Total Income</StatLabel>
              <StatNumber color="green.600">₹{totalIncome.toLocaleString('en-IN')}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                12.5% from last month
              </StatHelpText>
            </Stat>
            <HStack mt={2}>
              <TrendingUp size={16} color="green" />
              <Text fontSize="sm" color="gray.500">This month</Text>
            </HStack>
          </CardBody>
        </Card>
        
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Total Expenses</StatLabel>
              <StatNumber color="red.600">₹{totalExpenses.toLocaleString('en-IN')}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                5.2% from last month
              </StatHelpText>
            </Stat>
            <HStack mt={2}>
              <TrendingDown size={16} color="red" />
              <Text fontSize="sm" color="gray.500">This month</Text>
            </HStack>
          </CardBody>
        </Card>
        
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Net Profit</StatLabel>
              <StatNumber color={netProfit >= 0 ? "green.600" : "red.600"}>
                ₹{netProfit.toLocaleString('en-IN')}
              </StatNumber>
              <StatHelpText>
                <StatArrow type={netProfit >= 0 ? "increase" : "decrease"} />
                {Math.abs((netProfit/totalIncome) * 100).toFixed(1)}% margin
              </StatHelpText>
            </Stat>
            <HStack mt={2}>
              <PieChart size={16} color="purple" />
              <Text fontSize="sm" color="gray.500">Profit margin</Text>
            </HStack>
          </CardBody>
        </Card>
        
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Pending Amount</StatLabel>
              <StatNumber color="orange.600">₹{pendingAmount.toLocaleString('en-IN')}</StatNumber>
              <StatHelpText>
                Outstanding payments
              </StatHelpText>
            </Stat>
            <HStack mt={2}>
              <Clock size={16} color="orange" />
              <Text fontSize="sm" color="gray.500">To be received</Text>
            </HStack>
          </CardBody>
        </Card>
      </Grid>

      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6} mb={6}>
        {/* Transactions */}
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <Flex justify="space-between" align="center" mb={4}>
              <Text fontSize="lg" fontWeight="semibold">Recent Transactions</Text>
              <HStack>
                <Button leftIcon={<Download />} size="sm" variant="outline">
                  Export
                </Button>
              </HStack>
            </Flex>

            {/* Filters */}
            <Flex gap={4} direction={{ base: 'column', md: 'row' }} mb={4}>
              <HStack flex={1}>
                <Search size={16} color="gray.400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  variant="unstyled"
                  size="sm"
                />
              </HStack>
              
              <Select
                size="sm"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                w={{ base: 'full', md: '150px' }}
              >
                <option value="all">All Categories</option>
                <option value="revenue">Revenue</option>
                <option value="payroll">Payroll</option>
                <option value="inventory">Inventory</option>
                <option value="insurance">Insurance</option>
                <option value="maintenance">Maintenance</option>
              </Select>
              
              <Select
                size="sm"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                w={{ base: 'full', md: '120px' }}
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </Select>
            </Flex>

            <TableContainer>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Transaction Details</Th>
                    <Th>Category</Th>
                    <Th>Amount</Th>
                    <Th>Status</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredTransactions.map((transaction) => (
                    <Tr key={transaction.id} _hover={{ bg: 'gray.50' }}>
                      <Td>
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="medium" fontSize="sm">{transaction.description}</Text>
                          <HStack fontSize="xs" color="gray.500">
                            <Calendar size={10} />
                            <Text>{transaction.date}</Text>
                            <Text>•</Text>
                            <Text>{transaction.paymentMethod}</Text>
                          </HStack>
                          <Text fontSize="xs" color="gray.400">Ref: {transaction.reference}</Text>
                        </VStack>
                      </Td>
                      <Td>
                        <VStack align="start" spacing={0}>
                          <Badge colorScheme={getTypeColor(transaction.type)} variant="outline" size="sm">
                            {transaction.type}
                          </Badge>
                          <Text fontSize="xs" color="gray.500">{transaction.category}</Text>
                        </VStack>
                      </Td>
                      <Td>
                        <Text 
                          fontWeight="semibold" 
                          color={transaction.type === 'Income' ? 'green.600' : 'red.600'}
                        >
                          {transaction.type === 'Income' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
                        </Text>
                      </Td>
                      <Td>
                        <Badge colorScheme={getStatusColor(transaction.status)} variant="subtle" size="sm">
                          {transaction.status}
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
                            <MenuItem icon={<Eye size={16} />}>
                              View Details
                            </MenuItem>
                            <MenuItem icon={<Download size={16} />}>
                              Download Receipt
                            </MenuItem>
                            <MenuItem icon={<FileText size={16} />}>
                              Edit Transaction
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

        {/* Budget Overview */}
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <Text fontSize="lg" fontWeight="semibold" mb={4}>Budget Overview</Text>
            <VStack spacing={4} align="stretch">
              {mockBudgets.map((budget, index) => (
                <Box key={index}>
                  <Flex justify="space-between" mb={2}>
                    <Text fontSize="sm" fontWeight="medium">{budget.category}</Text>
                    <Text fontSize="sm" color={getBudgetColor(budget.percentage) + '.600'}>
                      {budget.percentage.toFixed(1)}%
                    </Text>
                  </Flex>
                  <Progress 
                    value={budget.percentage > 100 ? 100 : budget.percentage} 
                    colorScheme={getBudgetColor(budget.percentage)} 
                    size="sm" 
                    borderRadius="md"
                  />
                  <Flex justify="space-between" mt={1}>
                    <Text fontSize="xs" color="gray.500">
                      ₹{budget.actual.toLocaleString('en-IN')} / ₹{budget.budgeted.toLocaleString('en-IN')}
                    </Text>
                    {budget.percentage > 100 && (
                      <Text fontSize="xs" color="red.500">
                        Over by ₹{(budget.actual - budget.budgeted).toLocaleString('en-IN')}
                      </Text>
                    )}
                  </Flex>
                  {index < mockBudgets.length - 1 && <Divider mt={3} />}
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>
      </Grid>
    </Box>
  );
};

export default Finance;
