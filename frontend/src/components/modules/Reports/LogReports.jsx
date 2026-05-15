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
  useColorModeValue,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Checkbox
} from '@chakra-ui/react';
import {
  Download,
  FileText,
  Activity,
  Shield,
  BarChart3,
  Filter,
  Eye,
  Printer,
  AlertTriangle
} from 'lucide-react';

const LogReports = ({ title = "Log Reports" }) => {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [reportFormat, setReportFormat] = useState('pdf');
  const { isOpen: isGenerateOpen, onOpen: onGenerateOpen, onClose: onGenerateClose } = useDisclosure();
  const [selectedReportType, setSelectedReportType] = useState('');
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const reportTypes = [
    {
      id: 'user-log',
      title: 'User Log',
      description: 'Comprehensive user activity logs including login, logout, and system interactions',
      icon: Activity,
      color: 'blue',
      fields: ['Login Events', 'User Actions', 'Session Details', 'Access Patterns']
    },
    {
      id: 'email-sms-log',
      title: 'Email / SMS Log',
      description: 'Communication logs for all email and SMS notifications sent through the system',
      icon: FileText,
      color: 'green',
      fields: ['Email Logs', 'SMS Logs', 'Delivery Status', 'Communication History']
    },
    {
      id: 'audit-trail-report',
      title: 'Audit Trail Report',
      description: 'Security and compliance audit trails with data modification history and access tracking',
      icon: Shield,
      color: 'purple',
      fields: ['Data Changes', 'Security Events', 'Compliance Tracking', 'Admin Actions']
    }
  ];

  const quickStats = [
    { label: 'User Log Entries', value: '12,456', color: 'blue' },
    { label: 'Email/SMS Sent', value: '3,234', color: 'green' },
    { label: 'Audit Events', value: '1,567', color: 'purple' },
    { label: 'Today\'s Activities', value: '234', color: 'orange' }
  ];

  const handleGenerateReport = (reportType) => {
    setSelectedReportType(reportType);
    onGenerateOpen();
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">{title}</Text>
          <Text color="gray.600">System logs, audit trails, and error tracking reports</Text>
        </Box>
        <HStack>
          <Button leftIcon={<Filter />} variant="outline">Advanced Filters</Button>
          <Button leftIcon={<AlertTriangle />} variant="outline" colorScheme="red">Error Alerts</Button>
        </HStack>
      </Flex>

      <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={6} mb={6}>
        {quickStats.map((stat, index) => (
          <Card key={index} bg={cardBg} border="1px" borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel color="gray.600">{stat.label}</StatLabel>
                <StatNumber color={`${stat.color}.600`}>{stat.value}</StatNumber>
              </Stat>
            </CardBody>
          </Card>
        ))}
      </Grid>

      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6} mb={6}>
        {/* Report Categories */}
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <Text fontSize="lg" fontWeight="semibold" mb={6}>Log Report Categories</Text>
            
            <VStack spacing={4} align="stretch">
              {reportTypes.map((report) => (
                <Card key={report.id} variant="outline" _hover={{ shadow: 'md' }}>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <HStack>
                        <Box p={3} bg={`${report.color}.100`} borderRadius="lg">
                          <report.icon size={24} color={report.color} />
                        </Box>
                        <VStack align="start" spacing={1} flex={1}>
                          <Text fontWeight="semibold">{report.title}</Text>
                          <Badge colorScheme={report.color} variant="subtle">Log Report</Badge>
                        </VStack>
                      </HStack>
                      
                      <Text fontSize="sm" color="gray.600">{report.description}</Text>
                      
                      <VStack align="stretch" spacing={2}>
                        <Text fontSize="xs" fontWeight="medium" color="gray.700">Report Includes:</Text>
                        <HStack wrap="wrap" spacing={1}>
                          {report.fields.map((field, index) => (
                            <Badge key={index} size="sm" variant="outline" colorScheme="gray">{field}</Badge>
                          ))}
                        </HStack>
                      </VStack>
                      
                      <HStack spacing={2}>
                        <Button 
                          size="sm" 
                          colorScheme={report.color} 
                          leftIcon={<BarChart3 />}
                          onClick={() => handleGenerateReport(report)}
                          flex={1}
                        >
                          Generate Report
                        </Button>
                        <Button size="sm" variant="outline" leftIcon={<Eye />}>Preview</Button>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          </CardBody>
        </Card>

        {/* Recent Log Summary */}
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <Text fontSize="lg" fontWeight="semibold" mb={4}>Log Categories Summary</Text>
            
            <VStack spacing={4} align="stretch">
              <Box p={3} bg="blue.50" borderRadius="md" borderLeft="4px solid" borderLeftColor="blue.500">
                <VStack spacing={2} align="stretch">
                  <HStack justify="space-between">
                    <Text fontWeight="medium" fontSize="sm" color="blue.700">User Log</Text>
                    <Badge colorScheme="blue">12,456</Badge>
                  </HStack>
                  <Text fontSize="xs" color="blue.600">Login/logout activities, user actions</Text>
                </VStack>
              </Box>
              
              <Box p={3} bg="green.50" borderRadius="md" borderLeft="4px solid" borderLeftColor="green.500">
                <VStack spacing={2} align="stretch">
                  <HStack justify="space-between">
                    <Text fontWeight="medium" fontSize="sm" color="green.700">Email / SMS Log</Text>
                    <Badge colorScheme="green">3,234</Badge>
                  </HStack>
                  <Text fontSize="xs" color="green.600">Communication delivery tracking</Text>
                </VStack>
              </Box>
              
              <Box p={3} bg="purple.50" borderRadius="md" borderLeft="4px solid" borderLeftColor="purple.500">
                <VStack spacing={2} align="stretch">
                  <HStack justify="space-between">
                    <Text fontWeight="medium" fontSize="sm" color="purple.700">Audit Trail Report</Text>
                    <Badge colorScheme="purple">1,567</Badge>
                  </HStack>
                  <Text fontSize="xs" color="purple.600">Security & compliance tracking</Text>
                </VStack>
              </Box>
              
              <Box p={3} bg="orange.50" borderRadius="md" borderLeft="4px solid" borderLeftColor="orange.500">
                <VStack spacing={2} align="stretch">
                  <HStack justify="space-between">
                    <Text fontWeight="medium" fontSize="sm" color="orange.700">Today's Summary</Text>
                    <Badge colorScheme="orange">234</Badge>
                  </HStack>
                  <Text fontSize="xs" color="orange.600">All activities in last 24 hours</Text>
                </VStack>
              </Box>
            </VStack>
          </CardBody>
        </Card>
      </Grid>

      {/* Recent Log Entries */}
      <Card bg={cardBg} border="1px" borderColor={borderColor} mb={6}>
        <CardBody>
          <Flex justify="space-between" align="center" mb={4}>
            <Text fontSize="lg" fontWeight="semibold">Recent Log Entries</Text>
            <Button size="sm" leftIcon={<Activity />} variant="outline">
              Live Logs
            </Button>
          </Flex>
          
          <Box overflowX="auto">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '8px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#4a5568' }}>Timestamp</th>
                  <th style={{ padding: '8px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#4a5568' }}>Level</th>
                  <th style={{ padding: '8px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#4a5568' }}>Module</th>
                  <th style={{ padding: '8px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#4a5568' }}>User</th>
                  <th style={{ padding: '8px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#4a5568' }}>Message</th>
                  <th style={{ padding: '8px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#4a5568' }}>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { 
                    timestamp: '2025-08-26 14:32:15', 
                    level: 'INFO', 
                    module: 'Authentication', 
                    user: 'dr.priya', 
                    message: 'User login successful',
                    ip: '192.168.1.105'
                  },
                  { 
                    timestamp: '2025-08-26 14:31:45', 
                    level: 'ERROR', 
                    module: 'Billing', 
                    user: 'admin', 
                    message: 'Payment gateway timeout',
                    ip: '192.168.1.100'
                  },
                  { 
                    timestamp: '2025-08-26 14:30:22', 
                    level: 'WARNING', 
                    module: 'Inventory', 
                    user: 'pharmacy.staff', 
                    message: 'Low stock alert: Ashwagandha',
                    ip: '192.168.1.112'
                  },
                  { 
                    timestamp: '2025-08-26 14:29:58', 
                    level: 'INFO', 
                    module: 'Patient Management', 
                    user: 'nurse.anjali', 
                    message: 'New patient registered: PAT1156',
                    ip: '192.168.1.108'
                  },
                  { 
                    timestamp: '2025-08-26 14:28:33', 
                    level: 'ERROR', 
                    module: 'Reports', 
                    user: 'admin', 
                    message: 'Report generation failed: Insufficient data',
                    ip: '192.168.1.100'
                  },
                  { 
                    timestamp: '2025-08-26 14:27:14', 
                    level: 'INFO', 
                    module: 'Appointments', 
                    user: 'receptionist', 
                    message: 'Appointment scheduled for patient PAT1155',
                    ip: '192.168.1.103'
                  },
                  { 
                    timestamp: '2025-08-26 14:26:47', 
                    level: 'AUDIT', 
                    module: 'User Management', 
                    user: 'superadmin', 
                    message: 'User permissions updated for dr.arjun',
                    ip: '192.168.1.101'
                  },
                  { 
                    timestamp: '2025-08-26 14:25:19', 
                    level: 'INFO', 
                    module: 'Pharmacy', 
                    user: 'pharmacy.manager', 
                    message: 'Medicine dispensed: Triphala Churna',
                    ip: '192.168.1.115'
                  }
                ].map((log, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #f7fafc' }}>
                    <td style={{ padding: '8px', fontSize: '12px', color: '#2d3748', fontFamily: 'monospace' }}>{log.timestamp}</td>
                    <td style={{ padding: '8px' }}>
                      <Badge 
                        colorScheme={
                          log.level === 'ERROR' ? 'red' : 
                          log.level === 'WARNING' ? 'orange' : 
                          log.level === 'AUDIT' ? 'purple' : 'blue'
                        }
                        size="sm"
                      >
                        {log.level}
                      </Badge>
                    </td>
                    <td style={{ padding: '8px', fontSize: '13px', color: '#2d3748' }}>{log.module}</td>
                    <td style={{ padding: '8px', fontSize: '13px', color: '#2d3748' }}>{log.user}</td>
                    <td style={{ padding: '8px', fontSize: '13px', color: '#2d3748' }}>{log.message}</td>
                    <td style={{ padding: '8px', fontSize: '12px', color: '#718096', fontFamily: 'monospace' }}>{log.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
          
          <Flex justify="between" align="center" mt={4} fontSize="sm" color="gray.600">
            <Text>Records: 1 to 8 of 45,678</Text>
            <HStack spacing={2}>
              <Button size="xs" variant="outline">Previous</Button>
              <Button size="xs" variant="outline">1</Button>
              <Button size="xs" variant="outline">2</Button>
              <Button size="xs" variant="outline">Next</Button>
            </HStack>
          </Flex>
        </CardBody>
      </Card>

      {/* Audit Trail Report List */}
      <Card bg={cardBg} border="1px" borderColor={borderColor} mb={6}>
        <CardBody>
          <Flex justify="space-between" align="center" mb={4}>
            <Text fontSize="lg" fontWeight="semibold">Audit Trail Report List</Text>
            <Button size="sm" leftIcon={<AlertTriangle />} colorScheme="red">
              Delete All
            </Button>
          </Flex>
          
          <VStack spacing={4} align="stretch" mb={4}>
            <HStack spacing={4}>
              <Box>
                <Text fontSize="sm" fontWeight="medium" mb={1}>Time Duration *</Text>
                <Select placeholder="Last 3 Months" width="200px" size="sm">
                  <option value="last-month">Last Month</option>
                  <option value="last-3-months">Last 3 Months</option>
                  <option value="last-6-months">Last 6 Months</option>
                  <option value="last-year">Last Year</option>
                </Select>
              </Box>
              <Box flex="1">
                <Text fontSize="sm" fontWeight="medium" mb={1}>Search</Text>
                <Input placeholder="Search..." size="sm" />
              </Box>
              <Box alignSelf="end">
                <Button size="sm" colorScheme="blue">Search</Button>
              </Box>
            </HStack>
            
            <Flex justify="space-between" align="center">
              <HStack spacing={2}>
                <Button size="sm" leftIcon={<Download />} variant="outline">Export</Button>
                <Button size="sm" leftIcon={<Printer />} variant="outline">Print</Button>
                <Button size="sm" leftIcon={<FileText />} variant="outline">PDF</Button>
                <Button size="sm" leftIcon={<FileText />} variant="outline">CSV</Button>
                <Button size="sm" leftIcon={<Eye />} variant="outline">View</Button>
              </HStack>
              <Text fontSize="sm" color="gray.600">100 entries per page</Text>
            </Flex>
          </VStack>
          
          <Box overflowX="auto">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #e9ecef' }}>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', color: '#495057', borderRight: '1px solid #dee2e6' }}>Message ↕</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', color: '#495057', borderRight: '1px solid #dee2e6' }}>Users ↕</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', color: '#495057', borderRight: '1px solid #dee2e6' }}>IP Address ↕</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', color: '#495057', borderRight: '1px solid #dee2e6' }}>Action ↕</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', color: '#495057', borderRight: '1px solid #dee2e6' }}>Platform ↕</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', color: '#495057', borderRight: '1px solid #dee2e6' }}>Agent ↕</th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600', color: '#495057' }}>Date Time ↕</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    message: 'Record deleted Where Ambulance Call id 380',
                    user: 'Super Admin (9001)',
                    ip: '1.22.208.8',
                    action: 'Delete',
                    platform: 'Windows 10',
                    agent: 'Chrome 138.0.0.0',
                    dateTime: '08/04/2025 03:01 PM'
                  },
                  {
                    message: 'Record deleted Where Ambulance Call id 379',
                    user: 'Super Admin (9001)',
                    ip: '1.22.208.8',
                    action: 'Delete',
                    platform: 'Windows 10',
                    agent: 'Chrome 138.0.0.0',
                    dateTime: '08/04/2025 03:01 PM'
                  },
                  {
                    message: 'Record deleted Where Ambulance Call id 378',
                    user: 'Super Admin (9001)',
                    ip: '1.22.208.8',
                    action: 'Delete',
                    platform: 'Windows 10',
                    agent: 'Chrome 138.0.0.0',
                    dateTime: '08/04/2025 03:01 PM'
                  },
                  {
                    message: 'Record deleted Where Ambulance Call id 377',
                    user: 'Super Admin (9001)',
                    ip: '1.22.208.8',
                    action: 'Delete',
                    platform: 'Windows 10',
                    agent: 'Chrome 138.0.0.0',
                    dateTime: '08/04/2025 03:01 PM'
                  },
                  {
                    message: 'Record deleted Where Ambulance Call id 375',
                    user: 'Super Admin (9001)',
                    ip: '1.22.208.8',
                    action: 'Delete',
                    platform: 'Windows 10',
                    agent: 'Chrome 138.0.0.0',
                    dateTime: '08/04/2025 03:01 PM'
                  },
                  {
                    message: 'Record deleted Where Ambulance Call id 374',
                    user: 'Super Admin (9001)',
                    ip: '1.22.208.8',
                    action: 'Delete',
                    platform: 'Windows 10',
                    agent: 'Chrome 138.0.0.0',
                    dateTime: '08/04/2025 03:00 PM'
                  },
                  {
                    message: 'Record deleted Where Ambulance Call id 373',
                    user: 'Super Admin (9001)',
                    ip: '1.22.208.8',
                    action: 'Delete',
                    platform: 'Windows 10',
                    agent: 'Chrome 138.0.0.0',
                    dateTime: '08/04/2025 03:00 PM'
                  },
                  {
                    message: 'Record deleted Where Ambulance Call id 372',
                    user: 'Super Admin (9001)',
                    ip: '1.22.208.8',
                    action: 'Delete',
                    platform: 'Windows 10',
                    agent: 'Chrome 138.0.0.0',
                    dateTime: '08/04/2025 03:00 PM'
                  },
                  {
                    message: 'Record deleted Where Ambulance Call id 371',
                    user: 'Super Admin (9001)',
                    ip: '1.22.208.8',
                    action: 'Delete',
                    platform: 'Windows 10',
                    agent: 'Chrome 138.0.0.0',
                    dateTime: '08/04/2025 03:00 PM'
                  },
                  {
                    message: 'Record deleted On Radiology Billing id 418',
                    user: 'Super Admin (9001)',
                    ip: '1.22.208.8',
                    action: 'Delete',
                    platform: 'Windows 10',
                    agent: 'Chrome 138.0.0.0',
                    dateTime: '08/04/2025 02:59 PM'
                  },
                  {
                    message: 'Record deleted On Radiology Billing id 420',
                    user: 'Super Admin (9001)',
                    ip: '1.22.208.8',
                    action: 'Delete',
                    platform: 'Windows 10',
                    agent: 'Chrome 138.0.0.0',
                    dateTime: '08/04/2025 02:59 PM'
                  },
                  {
                    message: 'Record deleted On Radiology Billing id 425',
                    user: 'Super Admin (9001)',
                    ip: '1.22.208.8',
                    action: 'Delete',
                    platform: 'Windows 10',
                    agent: 'Chrome 138.0.0.0',
                    dateTime: '08/04/2025 02:59 PM'
                  },
                  {
                    message: 'Record deleted On Radiology Billing id 415',
                    user: 'Super Admin (9001)',
                    ip: '1.22.208.8',
                    action: 'Delete',
                    platform: 'Windows 10',
                    agent: 'Chrome 138.0.0.0',
                    dateTime: '08/04/2025 02:58 PM'
                  },
                  {
                    message: 'Record deleted On Radiology Billing id 412',
                    user: 'Super Admin (9001)',
                    ip: '1.22.208.8',
                    action: 'Delete',
                    platform: 'Windows 10',
                    agent: 'Chrome 138.0.0.0',
                    dateTime: '08/04/2025 02:58 PM'
                  },
                  {
                    message: 'Record deleted On Radiology Billing id 410',
                    user: 'Super Admin (9001)',
                    ip: '1.22.208.8',
                    action: 'Delete',
                    platform: 'Windows 10',
                    agent: 'Chrome 138.0.0.0',
                    dateTime: '08/04/2025 02:58 PM'
                  }
                ].map((record, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #dee2e6' }}>
                    <td style={{ padding: '8px', borderRight: '1px solid #f1f3f4', color: '#212529' }}>{record.message}</td>
                    <td style={{ padding: '8px', borderRight: '1px solid #f1f3f4', color: '#212529' }}>{record.user}</td>
                    <td style={{ padding: '8px', borderRight: '1px solid #f1f3f4', color: '#212529' }}>{record.ip}</td>
                    <td style={{ padding: '8px', borderRight: '1px solid #f1f3f4', color: '#212529' }}>{record.action}</td>
                    <td style={{ padding: '8px', borderRight: '1px solid #f1f3f4', color: '#212529' }}>{record.platform}</td>
                    <td style={{ padding: '8px', borderRight: '1px solid #f1f3f4', color: '#212529' }}>{record.agent}</td>
                    <td style={{ padding: '8px', color: '#212529' }}>{record.dateTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </CardBody>
      </Card>

      {/* Today's Log Activity */}
      <Card bg={cardBg} border="1px" borderColor={borderColor}>
        <CardBody>
          <Text fontSize="lg" fontWeight="semibold" mb={4}>Today's Log Activity</Text>
          
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
            <VStack align="stretch" spacing={3}>
              <Text fontSize="sm" fontWeight="medium" color="gray.700">User Log Activity</Text>
              <HStack justify="space-between">
                <Text fontSize="sm">Login Events</Text>
                <Badge colorScheme="blue">145</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">User Actions</Text>
                <Badge colorScheme="green">234</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">Session Timeouts</Text>
                <Badge colorScheme="orange">12</Badge>
              </HStack>
            </VStack>
            
            <VStack align="stretch" spacing={3}>
              <Text fontSize="sm" fontWeight="medium" color="gray.700">Email / SMS Activity</Text>
              <HStack justify="space-between">
                <Text fontSize="sm">Emails Sent</Text>
                <Badge colorScheme="green">67</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">SMS Sent</Text>
                <Badge colorScheme="blue">89</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">Delivery Failures</Text>
                <Badge colorScheme="red">3</Badge>
              </HStack>
            </VStack>
            
            <VStack align="stretch" spacing={3}>
              <Text fontSize="sm" fontWeight="medium" color="gray.700">Audit Trail Events</Text>
              <HStack justify="space-between">
                <Text fontSize="sm">Data Changes</Text>
                <Badge colorScheme="purple">45</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">Access Changes</Text>
                <Badge colorScheme="orange">8</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">Security Events</Text>
                <Badge colorScheme="red">2</Badge>
              </HStack>
            </VStack>
            
            <VStack align="stretch" spacing={3}>
              <Text fontSize="sm" fontWeight="medium" color="gray.700">Summary</Text>
              <HStack justify="space-between">
                <Text fontSize="sm">Total Events</Text>
                <Badge colorScheme="blue">605</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">Critical Events</Text>
                <Badge colorScheme="red">5</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">Success Rate</Text>
                <Badge colorScheme="green">98.2%</Badge>
              </HStack>
            </VStack>
          </SimpleGrid>
        </CardBody>
      </Card>

      <Modal isOpen={isGenerateOpen} onClose={onGenerateClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Generate {selectedReportType?.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <HStack>
                <FormControl>
                  <FormLabel>From Date</FormLabel>
                  <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                </FormControl>
                <FormControl>
                  <FormLabel>To Date</FormLabel>
                  <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                </FormControl>
              </HStack>
              
              <FormControl>
                <FormLabel>Log Level</FormLabel>
                <Select placeholder="Select log level">
                  <option value="all">All Levels</option>
                  <option value="error">Error</option>
                  <option value="warning">Warning</option>
                  <option value="info">Info</option>
                  <option value="debug">Debug</option>
                </Select>
              </FormControl>
              
              {selectedReportType?.id === 'user-log' && (
                <>
                  <FormControl>
                    <FormLabel>User Type</FormLabel>
                    <Select placeholder="Select user type">
                      <option value="all">All Users</option>
                      <option value="admin">Admin Users</option>
                      <option value="doctors">Doctors</option>
                      <option value="nurses">Nurses</option>
                      <option value="pharmacy">Pharmacy Staff</option>
                      <option value="reception">Reception Staff</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Activity Type</FormLabel>
                    <Select placeholder="Select activity type">
                      <option value="all">All Activities</option>
                      <option value="login">Login/Logout</option>
                      <option value="patient-access">Patient Access</option>
                      <option value="data-entry">Data Entry</option>
                      <option value="report-generation">Report Generation</option>
                    </Select>
                  </FormControl>
                </>
              )}
              
              {selectedReportType?.id === 'email-sms-log' && (
                <>
                  <FormControl>
                    <FormLabel>Communication Type</FormLabel>
                    <Select placeholder="Select communication type">
                      <option value="all">All Communications</option>
                      <option value="email">Email Only</option>
                      <option value="sms">SMS Only</option>
                      <option value="notifications">System Notifications</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Delivery Status</FormLabel>
                    <Select placeholder="Select delivery status">
                      <option value="all">All Statuses</option>
                      <option value="delivered">Delivered</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                      <option value="bounced">Bounced</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Message Category</FormLabel>
                    <Select placeholder="Select message category">
                      <option value="all">All Categories</option>
                      <option value="appointment-reminders">Appointment Reminders</option>
                      <option value="billing-notifications">Billing Notifications</option>
                      <option value="treatment-alerts">Treatment Alerts</option>
                      <option value="system-updates">System Updates</option>
                    </Select>
                  </FormControl>
                </>
              )}
              
              {selectedReportType?.id === 'audit-trail-report' && (
                <>
                  <FormControl>
                    <FormLabel>Audit Event Type</FormLabel>
                    <Select placeholder="Select audit event type">
                      <option value="all">All Events</option>
                      <option value="data-modification">Data Modifications</option>
                      <option value="access-control">Access Control Changes</option>
                      <option value="system-configuration">System Configuration</option>
                      <option value="security-events">Security Events</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Risk Level</FormLabel>
                    <Select placeholder="Select risk level">
                      <option value="all">All Risk Levels</option>
                      <option value="high">High Risk</option>
                      <option value="medium">Medium Risk</option>
                      <option value="low">Low Risk</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Compliance Category</FormLabel>
                    <Select placeholder="Select compliance category">
                      <option value="all">All Categories</option>
                      <option value="hipaa">HIPAA Compliance</option>
                      <option value="data-protection">Data Protection</option>
                      <option value="financial">Financial Compliance</option>
                      <option value="medical-records">Medical Records</option>
                    </Select>
                  </FormControl>
                </>
              )}
              
              <FormControl>
                <FormLabel>User/Module</FormLabel>
                <Select placeholder="Select user or module">
                  <option value="all">All Users/Modules</option>
                  <option value="admin">Admin Users</option>
                  <option value="doctors">Doctors</option>
                  <option value="nurses">Nurses</option>
                  <option value="pharmacy">Pharmacy Module</option>
                  <option value="billing">Billing Module</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Include Details</FormLabel>
                <VStack align="stretch" spacing={2}>
                  {selectedReportType?.id === 'user-log' && (
                    <>
                      <Checkbox defaultChecked>Timestamps</Checkbox>
                      <Checkbox defaultChecked>User Information</Checkbox>
                      <Checkbox defaultChecked>IP Addresses</Checkbox>
                      <Checkbox defaultChecked>Session Details</Checkbox>
                      <Checkbox>Device Information</Checkbox>
                      <Checkbox>Location Data</Checkbox>
                    </>
                  )}
                  {selectedReportType?.id === 'email-sms-log' && (
                    <>
                      <Checkbox defaultChecked>Delivery Timestamps</Checkbox>
                      <Checkbox defaultChecked>Recipient Details</Checkbox>
                      <Checkbox defaultChecked>Message Content</Checkbox>
                      <Checkbox defaultChecked>Delivery Status</Checkbox>
                      <Checkbox>Provider Information</Checkbox>
                      <Checkbox>Error Messages</Checkbox>
                    </>
                  )}
                  {selectedReportType?.id === 'audit-trail-report' && (
                    <>
                      <Checkbox defaultChecked>Event Timestamps</Checkbox>
                      <Checkbox defaultChecked>User Responsible</Checkbox>
                      <Checkbox defaultChecked>Data Changes</Checkbox>
                      <Checkbox defaultChecked>Risk Assessment</Checkbox>
                      <Checkbox>Before/After Values</Checkbox>
                      <Checkbox>Compliance Status</Checkbox>
                    </>
                  )}
                  {!selectedReportType?.id && (
                    <>
                      <Checkbox defaultChecked>Timestamps</Checkbox>
                      <Checkbox defaultChecked>User Information</Checkbox>
                      <Checkbox defaultChecked>Event Details</Checkbox>
                      <Checkbox>Additional Metadata</Checkbox>
                    </>
                  )}
                </VStack>
              </FormControl>
              
              <FormControl>
                <FormLabel>Report Format</FormLabel>
                <Select value={reportFormat} onChange={(e) => setReportFormat(e.target.value)}>
                  <option value="pdf">PDF Report</option>
                  <option value="excel">Excel Spreadsheet</option>
                  <option value="csv">CSV Data File</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onGenerateClose}>Cancel</Button>
            <Button colorScheme="blue" leftIcon={<Download />}>Generate Report</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default LogReports;
