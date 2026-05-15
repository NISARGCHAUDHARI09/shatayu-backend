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
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Progress,
  Divider,
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
  Switch,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb
} from '@chakra-ui/react';
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Eye,
  Download,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Users,
  Activity,
  DollarSign,
  FileText,
  PieChart,
  BarChart,
  LineChart,
  Settings,
  Share2,
  RefreshCw,
  Database,
  Target,
  Award,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

// Mock reports data
const mockReports = [
  {
    id: 'RPT001',
    name: 'Patient Demographics Report',
    category: 'Clinical Analytics',
    type: 'Demographics',
    lastGenerated: '2024-12-15',
    frequency: 'Monthly',
    status: 'Ready',
    insights: 'Patient age distribution shows 45% in 30-50 age group',
    kpis: { totalPatients: 1250, newPatients: 85, avgAge: 42 }
  },
  {
    id: 'RPT002',
    name: 'Treatment Effectiveness Analysis',
    category: 'Clinical Analytics',
    type: 'Treatment Outcomes',
    lastGenerated: '2024-12-14',
    frequency: 'Weekly',
    status: 'Ready',
    insights: 'Panchakarma treatments show 89% success rate',
    kpis: { successRate: 89, treatmentCount: 156, avgDuration: 21 }
  },
  {
    id: 'RPT003',
    name: 'Revenue Performance Dashboard',
    category: 'Financial Analytics',
    type: 'Revenue Analysis',
    lastGenerated: '2024-12-15',
    frequency: 'Daily',
    status: 'Ready',
    insights: 'December revenue up 15% compared to November',
    kpis: { totalRevenue: 485000, growth: 15, avgBilling: 2340 }
  },
  {
    id: 'RPT004',
    name: 'Staff Performance Metrics',
    category: 'HR Analytics',
    type: 'Performance',
    lastGenerated: '2024-12-13',
    frequency: 'Bi-weekly',
    status: 'Generating',
    insights: 'Staff satisfaction increased by 12% this quarter',
    kpis: { satisfaction: 87, productivity: 92, attendance: 95 }
  },
  {
    id: 'RPT005',
    name: 'Inventory Turnover Analysis',
    category: 'Operations Analytics',
    type: 'Inventory',
    lastGenerated: '2024-12-12',
    frequency: 'Monthly',
    status: 'Ready',
    insights: 'Ayurvedic medicines have fastest turnover rate',
    kpis: { turnoverRate: 6.2, stockValue: 125000, wastage: 2.1 }
  },
  {
    id: 'RPT006',
    name: 'Patient Satisfaction Survey',
    category: 'Quality Analytics',
    type: 'Satisfaction',
    lastGenerated: '2024-12-11',
    frequency: 'Monthly',
    status: 'Ready',
    insights: 'Overall satisfaction rating: 4.6/5.0',
    kpis: { satisfaction: 4.6, responseRate: 78, nps: 72 }
  }
];

const mockKPIs = [
  {
    category: 'Patient Care',
    metrics: [
      { name: 'Patient Satisfaction', value: 4.6, target: 4.5, unit: '/5.0', trend: 'up', change: 0.2 },
      { name: 'Treatment Success Rate', value: 89, target: 85, unit: '%', trend: 'up', change: 4 },
      { name: 'Average Waiting Time', value: 18, target: 20, unit: 'mins', trend: 'down', change: -3 },
      { name: 'Readmission Rate', value: 5.2, target: 8, unit: '%', trend: 'down', change: -1.1 }
    ]
  },
  {
    category: 'Financial',
    metrics: [
      { name: 'Monthly Revenue', value: 485000, target: 450000, unit: '₹', trend: 'up', change: 15 },
      { name: 'Operating Margin', value: 23, target: 20, unit: '%', trend: 'up', change: 3 },
      { name: 'Collection Rate', value: 94, target: 90, unit: '%', trend: 'up', change: 2 },
      { name: 'Cost per Patient', value: 2340, target: 2500, unit: '₹', trend: 'down', change: -160 }
    ]
  },
  {
    category: 'Operations',
    metrics: [
      { name: 'Bed Occupancy', value: 78, target: 75, unit: '%', trend: 'up', change: 5 },
      { name: 'Staff Utilization', value: 92, target: 90, unit: '%', trend: 'up', change: 3 },
      { name: 'Equipment Uptime', value: 97, target: 95, unit: '%', trend: 'up', change: 2 },
      { name: 'Inventory Turnover', value: 6.2, target: 6, unit: 'x', trend: 'up', change: 0.4 }
    ]
  }
];

const Reports = ({ title = "Reports & Analytics", showAddButton = true }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [dateRange, setDateRange] = useState([7, 30]);
  
  const { isOpen: isCustomOpen, onOpen: onCustomOpen, onClose: onCustomClose } = useDisclosure();
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Filter reports
  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.insights.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || report.category.toLowerCase().includes(categoryFilter);
    const matchesStatus = statusFilter === 'all' || report.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate statistics
  const totalReports = mockReports.length;
  const readyReports = mockReports.filter(r => r.status === 'Ready').length;
  const generatingReports = mockReports.filter(r => r.status === 'Generating').length;
  const scheduledReports = mockReports.filter(r => r.frequency !== 'On-demand').length;

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'ready': return 'green';
      case 'generating': return 'yellow';
      case 'error': return 'red';
      default: return 'gray';
    }
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />;
  };

  const getTrendColor = (trend, isPositive = true) => {
    if (trend === 'up') return isPositive ? 'green.600' : 'red.600';
    return isPositive ? 'red.600' : 'green.600';
  };

  const formatValue = (value, unit) => {
    if (unit === '₹') {
      return `₹${value.toLocaleString('en-IN')}`;
    }
    return `${value}${unit}`;
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
            Business intelligence and performance analytics dashboard
          </Text>
        </Box>
        {showAddButton && (
          <HStack>
            <Button leftIcon={<RefreshCw />} variant="outline">
              Refresh Data
            </Button>
            <Button leftIcon={<Settings />} variant="outline">
              Configure KPIs
            </Button>
            <Button colorScheme="blue" leftIcon={<Plus />} onClick={onCustomOpen}>
              Custom Report
            </Button>
          </HStack>
        )}
      </Flex>

      {/* Statistics Cards */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={6} mb={6}>
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Total Reports</StatLabel>
              <StatNumber color="blue.600">{totalReports}</StatNumber>
              <StatHelpText>
                <HStack>
                  <FileText size={16} />
                  <Text>Available</Text>
                </HStack>
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Ready Reports</StatLabel>
              <StatNumber color="green.600">{readyReports}</StatNumber>
              <StatHelpText>
                <HStack>
                  <CheckCircle size={16} />
                  <Text>Up to date</Text>
                </HStack>
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Generating</StatLabel>
              <StatNumber color="yellow.600">{generatingReports}</StatNumber>
              <StatHelpText>
                <HStack>
                  <Activity size={16} />
                  <Text>In progress</Text>
                </HStack>
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Scheduled</StatLabel>
              <StatNumber color="purple.600">{scheduledReports}</StatNumber>
              <StatHelpText>
                <HStack>
                  <Calendar size={16} />
                  <Text>Automated</Text>
                </HStack>
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </Grid>

      {/* Main Content */}
      <Card bg={cardBg} border="1px" borderColor={borderColor}>
        <CardBody>
          <Tabs variant="soft-rounded" colorScheme="blue">
            <TabList mb={4}>
              <Tab>KPI Dashboard</Tab>
              <Tab>Report Library</Tab>
              <Tab>Analytics Tools</Tab>
              <Tab>Data Export</Tab>
            </TabList>
            
            <TabPanels>
              {/* KPI Dashboard Tab */}
              <TabPanel p={0}>
                <VStack spacing={6} align="stretch">
                  {mockKPIs.map((category, categoryIndex) => (
                    <Box key={categoryIndex}>
                      <Text fontSize="lg" fontWeight="semibold" mb={4} color="gray.700">
                        {category.category} Metrics
                      </Text>
                      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                        {category.metrics.map((metric, metricIndex) => (
                          <Card key={metricIndex} variant="outline">
                            <CardBody>
                              <VStack align="stretch" spacing={3}>
                                <Text fontSize="sm" color="gray.600" fontWeight="medium">
                                  {metric.name}
                                </Text>
                                
                                <HStack justify="space-between">
                                  <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                                    {formatValue(metric.value, metric.unit)}
                                  </Text>
                                  <VStack align="end" spacing={0}>
                                    <HStack color={getTrendColor(metric.trend, metric.name !== 'Average Waiting Time' && metric.name !== 'Readmission Rate' && metric.name !== 'Cost per Patient')}>
                                      {getTrendIcon(metric.trend)}
                                      <Text fontSize="sm" fontWeight="medium">
                                        {Math.abs(metric.change)}{metric.unit === '₹' ? '₹' : metric.unit === '/5.0' ? '' : metric.unit}
                                      </Text>
                                    </HStack>
                                  </VStack>
                                </HStack>
                                
                                <Box>
                                  <Flex justify="space-between" mb={1}>
                                    <Text fontSize="xs" color="gray.500">Target</Text>
                                    <Text fontSize="xs" color="gray.600">
                                      {formatValue(metric.target, metric.unit)}
                                    </Text>
                                  </Flex>
                                  <Progress 
                                    value={Math.min((metric.value / metric.target) * 100, 100)}
                                    colorScheme={metric.value >= metric.target ? 'green' : 'yellow'}
                                    size="sm"
                                    borderRadius="md"
                                  />
                                </Box>
                                
                                <HStack justify="space-between">
                                  <Badge 
                                    colorScheme={metric.value >= metric.target ? 'green' : 'yellow'} 
                                    variant="subtle" 
                                    size="sm"
                                  >
                                    {metric.value >= metric.target ? 'On Target' : 'Below Target'}
                                  </Badge>
                                  <HStack>
                                    {metric.value >= metric.target ? 
                                      <CheckCircle size={12} color="green" /> : 
                                      <AlertCircle size={12} color="orange" />
                                    }
                                  </HStack>
                                </HStack>
                              </VStack>
                            </CardBody>
                          </Card>
                        ))}
                      </SimpleGrid>
                      {categoryIndex < mockKPIs.length - 1 && <Divider mt={6} />}
                    </Box>
                  ))}
                </VStack>
              </TabPanel>

              {/* Report Library Tab */}
              <TabPanel p={0}>
                {/* Filters */}
                <Flex gap={4} direction={{ base: 'column', md: 'row' }} mb={4}>
                  <HStack flex={1}>
                    <Search size={16} color="gray.400" />
                    <Input
                      placeholder="Search reports..."
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
                    w={{ base: 'full', md: '200px' }}
                  >
                    <option value="all">All Categories</option>
                    <option value="clinical">Clinical Analytics</option>
                    <option value="financial">Financial Analytics</option>
                    <option value="operations">Operations Analytics</option>
                    <option value="hr">HR Analytics</option>
                    <option value="quality">Quality Analytics</option>
                  </Select>
                  
                  <Select
                    size="sm"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    w={{ base: 'full', md: '150px' }}
                  >
                    <option value="all">All Status</option>
                    <option value="ready">Ready</option>
                    <option value="generating">Generating</option>
                    <option value="error">Error</option>
                  </Select>
                </Flex>

                <TableContainer>
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Report Details</Th>
                        <Th>Category</Th>
                        <Th>Key Insights</Th>
                        <Th>KPIs</Th>
                        <Th>Schedule</Th>
                        <Th>Status</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredReports.map((report) => (
                        <Tr key={report.id}>
                          <Td>
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="medium" fontSize="sm">{report.name}</Text>
                              <Text fontSize="xs" color="gray.500">Type: {report.type}</Text>
                              <Text fontSize="xs" color="gray.400">ID: {report.id}</Text>
                            </VStack>
                          </Td>
                          <Td>
                            <Badge colorScheme="blue" variant="outline" size="sm">
                              {report.category}
                            </Badge>
                          </Td>
                          <Td>
                            <Text fontSize="sm" color="gray.700" noOfLines={2}>
                              {report.insights}
                            </Text>
                          </Td>
                          <Td>
                            <VStack align="start" spacing={1}>
                              {Object.entries(report.kpis).slice(0, 2).map(([key, value]) => (
                                <Text key={key} fontSize="xs" color="gray.600">
                                  {key}: <strong>{typeof value === 'number' && value > 1000 ? value.toLocaleString() : value}</strong>
                                </Text>
                              ))}
                            </VStack>
                          </Td>
                          <Td>
                            <VStack align="start" spacing={1}>
                              <Badge colorScheme="purple" variant="subtle" size="sm">
                                {report.frequency}
                              </Badge>
                              <Text fontSize="xs" color="gray.500">
                                Last: {report.lastGenerated}
                              </Text>
                            </VStack>
                          </Td>
                          <Td>
                            <VStack align="start" spacing={1}>
                              <Badge colorScheme={getStatusColor(report.status)} variant="subtle" size="sm">
                                {report.status}
                              </Badge>
                              {report.status === 'Generating' && (
                                <Progress value={65} colorScheme="yellow" size="sm" w="60px" />
                              )}
                            </VStack>
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
                                  View Report
                                </MenuItem>
                                <MenuItem icon={<Download size={16} />}>
                                  Download
                                </MenuItem>
                                <MenuItem icon={<Share2 size={16} />}>
                                  Share
                                </MenuItem>
                                <MenuItem icon={<RefreshCw size={16} />}>
                                  Regenerate
                                </MenuItem>
                                <MenuItem icon={<Settings size={16} />}>
                                  Configure
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </TabPanel>

              {/* Analytics Tools Tab */}
              <TabPanel p={0}>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  <Card variant="outline">
                    <CardBody>
                      <VStack align="stretch" spacing={4}>
                        <HStack>
                          <BarChart3 size={20} color="blue" />
                          <Text fontWeight="semibold">Trend Analysis</Text>
                        </HStack>
                        <Text fontSize="sm" color="gray.600">
                          Analyze trends across multiple time periods and identify patterns in your data.
                        </Text>
                        <Button size="sm" leftIcon={<LineChart />}>
                          Create Trend Analysis
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>

                  <Card variant="outline">
                    <CardBody>
                      <VStack align="stretch" spacing={4}>
                        <HStack>
                          <PieChart size={20} color="green" />
                          <Text fontWeight="semibold">Comparative Analysis</Text>
                        </HStack>
                        <Text fontSize="sm" color="gray.600">
                          Compare performance across departments, time periods, or patient groups.
                        </Text>
                        <Button size="sm" leftIcon={<BarChart />}>
                          Create Comparison
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>

                  <Card variant="outline">
                    <CardBody>
                      <VStack align="stretch" spacing={4}>
                        <HStack>
                          <Target size={20} color="purple" />
                          <Text fontWeight="semibold">Goal Tracking</Text>
                        </HStack>
                        <Text fontSize="sm" color="gray.600">
                          Set and track progress towards specific business goals and targets.
                        </Text>
                        <Button size="sm" leftIcon={<Award />}>
                          Set Goals
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>

                  <Card variant="outline">
                    <CardBody>
                      <VStack align="stretch" spacing={4}>
                        <HStack>
                          <Database size={20} color="orange" />
                          <Text fontWeight="semibold">Data Mining</Text>
                        </HStack>
                        <Text fontSize="sm" color="gray.600">
                          Discover hidden patterns and insights in your hospital data.
                        </Text>
                        <Button size="sm" leftIcon={<Search />}>
                          Mine Data
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>

                  <Card variant="outline">
                    <CardBody>
                      <VStack align="stretch" spacing={4}>
                        <HStack>
                          <Activity size={20} color="red" />
                          <Text fontWeight="semibold">Real-time Monitoring</Text>
                        </HStack>
                        <Text fontSize="sm" color="gray.600">
                          Monitor key metrics in real-time with customizable dashboards.
                        </Text>
                        <Button size="sm" leftIcon={<Monitor />}>
                          Setup Monitoring
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>

                  <Card variant="outline">
                    <CardBody>
                      <VStack align="stretch" spacing={4}>
                        <HStack>
                          <AlertCircle size={20} color="gray" />
                          <Text fontWeight="semibold">Predictive Analytics</Text>
                        </HStack>
                        <Text fontSize="sm" color="gray.600">
                          Use AI to predict future trends and potential issues.
                        </Text>
                        <Button size="sm" leftIcon={<TrendingUp />}>
                          Enable Predictions
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                </SimpleGrid>
              </TabPanel>

              {/* Data Export Tab */}
              <TabPanel p={0}>
                <Text fontSize="lg" fontWeight="semibold" mb={4}>Data Export Center</Text>
                <Text fontSize="sm" color="gray.600" mb={6}>
                  Export hospital data in various formats for external analysis or compliance reporting.
                </Text>
                
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <Card variant="outline">
                    <CardBody>
                      <VStack align="stretch" spacing={4}>
                        <Text fontWeight="semibold">Quick Exports</Text>
                        <VStack spacing={3} align="stretch">
                          <Button leftIcon={<Download />} size="sm" variant="outline">
                            Patient Data (CSV)
                          </Button>
                          <Button leftIcon={<Download />} size="sm" variant="outline">
                            Financial Reports (Excel)
                          </Button>
                          <Button leftIcon={<Download />} size="sm" variant="outline">
                            Staff Records (PDF)
                          </Button>
                          <Button leftIcon={<Download />} size="sm" variant="outline">
                            Inventory Data (CSV)
                          </Button>
                        </VStack>
                      </VStack>
                    </CardBody>
                  </Card>

                  <Card variant="outline">
                    <CardBody>
                      <VStack align="stretch" spacing={4}>
                        <Text fontWeight="semibold">Custom Export</Text>
                        <FormControl>
                          <FormLabel fontSize="sm">Data Type</FormLabel>
                          <Select size="sm">
                            <option>Patient Records</option>
                            <option>Financial Data</option>
                            <option>Clinical Data</option>
                            <option>Operational Data</option>
                          </Select>
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel fontSize="sm">Date Range</FormLabel>
                          <HStack>
                            <Input type="date" size="sm" />
                            <Text fontSize="sm">to</Text>
                            <Input type="date" size="sm" />
                          </HStack>
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel fontSize="sm">Format</FormLabel>
                          <Select size="sm">
                            <option>CSV</option>
                            <option>Excel (XLSX)</option>
                            <option>PDF Report</option>
                            <option>JSON</option>
                          </Select>
                        </FormControl>
                        
                        <Button colorScheme="blue" leftIcon={<Download />}>
                          Generate Export
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                </SimpleGrid>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CardBody>
      </Card>

      {/* Custom Report Modal */}
      <Modal isOpen={isCustomOpen} onClose={onCustomClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Custom Report</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Report Name</FormLabel>
                <Input placeholder="Enter report name" />
              </FormControl>
              
              <FormControl>
                <FormLabel>Report Type</FormLabel>
                <Select placeholder="Select report type">
                  <option value="clinical">Clinical Analytics</option>
                  <option value="financial">Financial Analytics</option>
                  <option value="operational">Operational Analytics</option>
                  <option value="quality">Quality Analytics</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Data Sources</FormLabel>
                <VStack align="start">
                  <Checkbox>Patient Records</Checkbox>
                  <Checkbox>Financial Transactions</Checkbox>
                  <Checkbox>Staff Performance</Checkbox>
                  <Checkbox>Inventory Data</Checkbox>
                  <Checkbox>Quality Metrics</Checkbox>
                </VStack>
              </FormControl>
              
              <FormControl>
                <FormLabel>Report Description</FormLabel>
                <Textarea placeholder="Describe what this report should analyze..." rows={3} />
              </FormControl>
              
              <FormControl>
                <FormLabel>Schedule</FormLabel>
                <HStack>
                  <Select>
                    <option value="once">One-time</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </Select>
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="auto-email" mb="0" fontSize="sm">
                      Email when ready
                    </FormLabel>
                    <Switch id="auto-email" />
                  </FormControl>
                </HStack>
              </FormControl>
            </VStack>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCustomClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" leftIcon={<BarChart3 />}>
              Create Report
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Reports;
