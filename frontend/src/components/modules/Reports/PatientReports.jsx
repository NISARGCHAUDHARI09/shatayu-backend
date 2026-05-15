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
  Users,
  User,
  BarChart3,
  Filter,
  Eye,
  Printer,
  Calendar,
  TrendingUp
} from 'lucide-react';

const PatientReports = ({ title = "Patient Reports" }) => {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [reportFormat, setReportFormat] = useState('pdf');
  const { isOpen: isGenerateOpen, onOpen: onGenerateOpen, onClose: onGenerateClose } = useDisclosure();
  const [selectedReportType, setSelectedReportType] = useState('');
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const reportTypes = [
    {
      id: 'patient-demographics',
      title: 'Patient Demographics Report',
      description: 'Comprehensive analysis of patient demographics, age groups, geographic distribution, and population trends',
      icon: Users,
      color: 'blue',
      fields: ['Age Distribution', 'Gender Analysis', 'Geographic Data', 'Registration Trends']
    },
    {
      id: 'patient-visit-analysis',
      title: 'Patient Visit Analysis Report',
      description: 'Detailed analysis of patient visit patterns, frequency, treatment outcomes, and satisfaction metrics',
      icon: TrendingUp,
      color: 'green',
      fields: ['Visit Patterns', 'Treatment History', 'Outcome Analysis', 'Satisfaction Scores']
    },
    {
      id: 'patient-login-credentials',
      title: 'Patient Login Credentials Report',
      description: 'Complete list of patient login credentials including usernames, passwords, and account status for patient portal access',
      icon: User,
      color: 'purple',
      fields: ['Patient ID', 'Username', 'Password', 'Account Status', 'Last Login', 'Registration Date']
    }
  ];

  const quickStats = [
    { label: 'Total Patients', value: '8,456', color: 'blue' },
    { label: 'Active Login Accounts', value: '6,234', color: 'green' },
    { label: 'New Registrations', value: '234', color: 'purple' },
    { label: 'Login Success Rate', value: '94.5%', color: 'orange' }
  ];

  const patientCategories = [
    { category: 'Adults (18-60)', count: 4567, percentage: 54, color: 'blue' },
    { category: 'Seniors (60+)', count: 2134, percentage: 25, color: 'purple' },
    { category: 'Children (0-18)', count: 1755, percentage: 21, color: 'green' }
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
          <Text color="gray.600">Patient demographics and visit analysis reporting</Text>
        </Box>
        <HStack>
          <Button leftIcon={<Filter />} variant="outline">Advanced Filters</Button>
          <Button leftIcon={<Calendar />} variant="outline">Monthly Trends</Button>
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
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <Text fontSize="lg" fontWeight="semibold" mb={6}>Patient Report Categories</Text>
            
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
                          <Badge colorScheme={report.color} variant="subtle">Patient Report</Badge>
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

        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <Text fontSize="lg" fontWeight="semibold" mb={4}>Patient Demographics</Text>
            
            <VStack spacing={4} align="stretch">
              {patientCategories.map((category, index) => (
                <Box key={index} p={3} bg="gray.50" borderRadius="md">
                  <VStack spacing={2} align="stretch">
                    <HStack justify="space-between">
                      <Text fontWeight="medium" fontSize="sm">{category.category}</Text>
                      <Badge colorScheme={category.color}>{category.percentage}%</Badge>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontSize="xs" color="gray.600">Count: {category.count}</Text>
                      <Text fontSize="xs" color="gray.600">Total Visits: {Math.floor(category.count * 3.2)}</Text>
                    </HStack>
                  </VStack>
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>
      </Grid>

      <Card bg={cardBg} border="1px" borderColor={borderColor}>
        <CardBody>
          <Text fontSize="lg" fontWeight="semibold" mb={4}>Recent Patient Activity</Text>
          
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
            <VStack align="stretch" spacing={3}>
              <Text fontSize="sm" fontWeight="medium" color="gray.700">New Registrations</Text>
              <HStack justify="space-between">
                <Text fontSize="sm">Today</Text>
                <Badge colorScheme="green">12</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">This Week</Text>
                <Badge colorScheme="blue">67</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">This Month</Text>
                <Badge colorScheme="purple">234</Badge>
              </HStack>
            </VStack>
            
            <VStack align="stretch" spacing={3}>
              <Text fontSize="sm" fontWeight="medium" color="gray.700">Login Activity</Text>
              <HStack justify="space-between">
                <Text fontSize="sm">Active Today</Text>
                <Badge colorScheme="green">145</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">Failed Logins</Text>
                <Badge colorScheme="red">23</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">Never Logged In</Text>
                <Badge colorScheme="orange">1,234</Badge>
              </HStack>
            </VStack>
            
            <VStack align="stretch" spacing={3}>
              <Text fontSize="sm" fontWeight="medium" color="gray.700">Account Status</Text>
              <HStack justify="space-between">
                <Text fontSize="sm">Active Accounts</Text>
                <Badge colorScheme="green">6,234</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">Suspended</Text>
                <Badge colorScheme="red">67</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">Pending</Text>
                <Badge colorScheme="orange">155</Badge>
              </HStack>
            </VStack>
            
            <VStack align="stretch" spacing={3}>
              <Text fontSize="sm" fontWeight="medium" color="gray.700">Security Metrics</Text>
              <HStack justify="space-between">
                <Text fontSize="sm">Password Resets</Text>
                <Badge colorScheme="orange">45</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">2FA Enabled</Text>
                <Badge colorScheme="green">2,145</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">Locked Accounts</Text>
                <Badge colorScheme="red">12</Badge>
              </HStack>
            </VStack>
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Patient Login Credentials Table Preview */}
      <Card bg={cardBg} border="1px" borderColor={borderColor}>
        <CardBody>
          <Flex justify="space-between" align="center" mb={4}>
            <Text fontSize="lg" fontWeight="semibold">Recent Patient Login Credentials</Text>
            <Button size="sm" leftIcon={<Eye />} variant="outline">
              View All Credentials
            </Button>
          </Flex>
          
          <Box overflowX="auto">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '8px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#4a5568' }}>Patient ID</th>
                  <th style={{ padding: '8px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#4a5568' }}>Patient Name</th>
                  <th style={{ padding: '8px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#4a5568' }}>Username</th>
                  <th style={{ padding: '8px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#4a5568' }}>Password</th>
                  <th style={{ padding: '8px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#4a5568' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: '1152', name: 'Rajesh Kumar', username: 'pat1152', password: 'aszh8e', status: 'Active' },
                  { id: '1151', name: 'Priya Sharma', username: 'pat1151', password: 'vtm2h1', status: 'Active' },
                  { id: '1148', name: 'Arjun Patel', username: 'pat1148', password: 'bmtllo', status: 'Active' },
                  { id: '1147', name: 'Meera Singh', username: 'pat1147', password: '306igm', status: 'Inactive' },
                  { id: '1146', name: 'Vikram Joshi', username: 'pat1146', password: 'kq0ihg', status: 'Active' },
                  { id: '1145', name: 'Kavya Nair', username: 'pat1145', password: 'uc7b5i', status: 'Active' },
                  { id: '1125', name: 'Ravi Gupta', username: 'pat1125', password: 'd5ywlv', status: 'Active' },
                  { id: '937', name: 'Anjali Verma', username: 'pat937', password: 'ce8km1', status: 'Suspended' }
                ].map((patient, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #f7fafc' }}>
                    <td style={{ padding: '8px', fontSize: '14px', color: '#2d3748' }}>{patient.id}</td>
                    <td style={{ padding: '8px', fontSize: '14px', color: '#2d3748' }}>{patient.name}</td>
                    <td style={{ padding: '8px', fontSize: '14px', color: '#2d3748' }}>{patient.username}</td>
                    <td style={{ padding: '8px', fontSize: '14px', color: '#2d3748', fontFamily: 'monospace' }}>{patient.password}</td>
                    <td style={{ padding: '8px' }}>
                      <Badge 
                        colorScheme={
                          patient.status === 'Active' ? 'green' : 
                          patient.status === 'Inactive' ? 'orange' : 'red'
                        }
                        size="sm"
                      >
                        {patient.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
          
          <Flex justify="between" align="center" mt={4} fontSize="sm" color="gray.600">
            <Text>Records: 1 to 8 of 8,456</Text>
            <HStack spacing={2}>
              <Button size="xs" variant="outline">Previous</Button>
              <Button size="xs" variant="outline">1</Button>
              <Button size="xs" variant="outline">2</Button>
              <Button size="xs" variant="outline">Next</Button>
            </HStack>
          </Flex>
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
                <FormLabel>Age Group</FormLabel>
                <Select placeholder="Select age group or all">
                  <option value="all">All Age Groups</option>
                  <option value="children">Children (0-18)</option>
                  <option value="adults">Adults (18-60)</option>
                  <option value="seniors">Seniors (60+)</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Gender</FormLabel>
                <Select placeholder="Select gender or all">
                  <option value="all">All Genders</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Visit Type</FormLabel>
                <Select placeholder="Select visit type or all">
                  <option value="all">All Visit Types</option>
                  <option value="opd">OPD</option>
                  <option value="ipd">IPD</option>
                  <option value="emergency">Emergency</option>
                  <option value="consultation">Consultation</option>
                </Select>
              </FormControl>
              
              {selectedReportType?.id === 'patient-login-credentials' && (
                <>
                  <FormControl>
                    <FormLabel>Account Status</FormLabel>
                    <Select placeholder="Select account status">
                      <option value="all">All Statuses</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                      <option value="pending">Pending Activation</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Registration Period</FormLabel>
                    <Select placeholder="Select registration period">
                      <option value="all">All Time</option>
                      <option value="last-month">Last Month</option>
                      <option value="last-3-months">Last 3 Months</option>
                      <option value="last-6-months">Last 6 Months</option>
                      <option value="this-year">This Year</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Last Login Activity</FormLabel>
                    <Select placeholder="Select login activity">
                      <option value="all">All Users</option>
                      <option value="active-users">Active Users (Last 30 days)</option>
                      <option value="inactive-users">Inactive Users (30+ days)</option>
                      <option value="never-logged">Never Logged In</option>
                    </Select>
                  </FormControl>
                </>
              )}
              
              <FormControl>
                <FormLabel>Include Details</FormLabel>
                <VStack align="stretch" spacing={2}>
                  <Checkbox defaultChecked>Patient Demographics</Checkbox>
                  <Checkbox defaultChecked>Visit History</Checkbox>
                  <Checkbox defaultChecked>Treatment Details</Checkbox>
                  {selectedReportType?.id === 'patient-login-credentials' && (
                    <>
                      <Checkbox defaultChecked>Patient ID</Checkbox>
                      <Checkbox defaultChecked>Username</Checkbox>
                      <Checkbox defaultChecked>Password</Checkbox>
                      <Checkbox defaultChecked>Account Status</Checkbox>
                      <Checkbox>Last Login Date</Checkbox>
                      <Checkbox>Registration Date</Checkbox>
                      <Checkbox>Failed Login Attempts</Checkbox>
                    </>
                  )}
                  {selectedReportType?.id !== 'patient-login-credentials' && (
                    <>
                      <Checkbox>Contact Information</Checkbox>
                      <Checkbox>Insurance Details</Checkbox>
                      <Checkbox>Billing Information</Checkbox>
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

export default PatientReports;
