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
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
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
  StatHelpText,
  StatArrow,
  Checkbox,
  Textarea
} from '@chakra-ui/react';
import {
  Download,
  Stethoscope,
  Users,
  DollarSign,
  TrendingUp,
  BarChart3,
  Filter,
  Eye,
  Printer,
  FileText,
  Calendar,
  Clock,
  UserCheck,
  Activity
} from 'lucide-react';

const OPDReports = ({ title = "OPD Reports" }) => {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [reportFormat, setReportFormat] = useState('pdf');
  const { isOpen: isGenerateOpen, onOpen: onGenerateOpen, onClose: onGenerateClose } = useDisclosure();
  const [selectedReportType, setSelectedReportType] = useState('');
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const reportTypes = [
    {
      id: 'opd-report',
      title: 'OPD Report',
      description: 'Comprehensive outpatient department activity report with patient flow and consultation details',
      icon: Stethoscope,
      color: 'blue',
      fields: ['Patient Demographics', 'Doctor Consultations', 'Treatment Plans', 'Follow-up Status']
    },
    {
      id: 'balance-report',
      title: 'OPD Balance Report',
      description: 'Outstanding payments and financial balances for OPD services and treatments',
      icon: DollarSign,
      color: 'green',
      fields: ['Outstanding Amounts', 'Payment History', 'Insurance Claims', 'Discount Applied']
    },
    {
      id: 'discharged-patients',
      title: 'Discharged Patients Report',
      description: 'Complete report of patients discharged from OPD with treatment outcomes and follow-up instructions',
      icon: UserCheck,
      color: 'purple',
      fields: ['Discharge Summary', 'Treatment Outcome', 'Medications Prescribed', 'Follow-up Plans']
    }
  ];

  const quickStats = [
    { label: 'Total OPD Visits', value: '2,456', change: '+15.3%', trend: 'up' },
    { label: 'New Patients', value: '543', change: '+22.1%', trend: 'up' },
    { label: 'Follow-up Visits', value: '1,913', change: '+12.8%', trend: 'up' },
    { label: 'Outstanding Amount', value: '₹3,45,600', change: '-8.5%', trend: 'down' }
  ];

  const departmentStats = [
    { name: 'General Medicine', patients: 456, revenue: '₹2,28,000', color: 'blue' },
    { name: 'Panchakarma', patients: 234, revenue: '₹4,68,000', color: 'green' },
    { name: 'Gynecology', patients: 189, revenue: '₹1,89,000', color: 'purple' },
    { name: 'Pediatrics', patients: 145, revenue: '₹1,45,000', color: 'orange' },
    { name: 'Dermatology', patients: 123, revenue: '₹1,84,500', color: 'pink' }
  ];

  const handleGenerateReport = (reportType) => {
    setSelectedReportType(reportType);
    onGenerateOpen();
  };

  const getIconComponent = (IconComponent, color) => {
    return <IconComponent size={24} color={color} />;
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
            Outpatient department analytics and comprehensive reporting
          </Text>
        </Box>
        <HStack>
          <Button leftIcon={<Filter />} variant="outline">
            Advanced Filters
          </Button>
          <Button leftIcon={<Calendar />} variant="outline">
            Daily Reports
          </Button>
        </HStack>
      </Flex>

      {/* Quick Stats */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={6} mb={6}>
        {quickStats.map((stat, index) => (
          <Card key={index} bg={cardBg} border="1px" borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel color="gray.600">{stat.label}</StatLabel>
                <StatNumber color={stat.trend === 'up' ? 'green.600' : 'red.600'}>
                  {stat.value}
                </StatNumber>
                <StatHelpText>
                  <StatArrow type={stat.trend === 'up' ? 'increase' : 'decrease'} />
                  {stat.change} from last month
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        ))}
      </Grid>

      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6} mb={6}>
        {/* Report Categories */}
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <Text fontSize="lg" fontWeight="semibold" mb={6}>OPD Report Categories</Text>
            
            <VStack spacing={4} align="stretch">
              {reportTypes.map((report) => (
                <Card key={report.id} variant="outline" _hover={{ shadow: 'md' }}>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <HStack>
                        <Box p={3} bg={`${report.color}.100`} borderRadius="lg">
                          {getIconComponent(report.icon, report.color)}
                        </Box>
                        <VStack align="start" spacing={1} flex={1}>
                          <Text fontWeight="semibold">
                            {report.title}
                          </Text>
                          <Badge colorScheme={report.color} variant="subtle">
                            OPD Report
                          </Badge>
                        </VStack>
                      </HStack>
                      
                      <Text fontSize="sm" color="gray.600">
                        {report.description}
                      </Text>
                      
                      <VStack align="stretch" spacing={2}>
                        <Text fontSize="xs" fontWeight="medium" color="gray.700">
                          Report Includes:
                        </Text>
                        <HStack wrap="wrap" spacing={1}>
                          {report.fields.map((field, index) => (
                            <Badge key={index} size="sm" variant="outline" colorScheme="gray">
                              {field}
                            </Badge>
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
                        <Button size="sm" variant="outline" leftIcon={<Eye />}>
                          Preview
                        </Button>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          </CardBody>
        </Card>

        {/* Department Statistics */}
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <Text fontSize="lg" fontWeight="semibold" mb={4}>Department Performance</Text>
            
            <VStack spacing={4} align="stretch">
              {departmentStats.map((dept, index) => (
                <Box key={index} p={3} bg="gray.50" borderRadius="md">
                  <VStack spacing={2} align="stretch">
                    <Text fontWeight="medium" fontSize="sm">
                      {dept.name}
                    </Text>
                    <HStack justify="space-between">
                      <Text fontSize="xs" color="gray.600">Patients</Text>
                      <Badge colorScheme={dept.color}>{dept.patients}</Badge>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontSize="xs" color="gray.600">Revenue</Text>
                      <Text fontSize="xs" fontWeight="semibold" color="green.600">
                        {dept.revenue}
                      </Text>
                    </HStack>
                  </VStack>
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>
      </Grid>

      {/* Recent Activity */}
      <Card bg={cardBg} border="1px" borderColor={borderColor}>
        <CardBody>
          <Flex justify="space-between" align="center" mb={4}>
            <Text fontSize="lg" fontWeight="semibold">Today's OPD Activity</Text>
            <Button size="sm" leftIcon={<Activity />} variant="outline">
              Live Dashboard
            </Button>
          </Flex>
          
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
            <VStack align="stretch" spacing={3}>
              <Text fontSize="sm" fontWeight="medium" color="gray.700">Patient Flow</Text>
              <HStack justify="space-between">
                <Text fontSize="sm">Current Waiting</Text>
                <Badge colorScheme="orange">23</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">In Consultation</Text>
                <Badge colorScheme="blue">15</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">Completed Today</Text>
                <Badge colorScheme="green">87</Badge>
              </HStack>
            </VStack>
            
            <VStack align="stretch" spacing={3}>
              <Text fontSize="sm" fontWeight="medium" color="gray.700">Top Conditions</Text>
              <HStack justify="space-between">
                <Text fontSize="sm">Digestive Issues</Text>
                <Badge>24</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">Joint Pain</Text>
                <Badge>18</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">Stress/Anxiety</Text>
                <Badge>15</Badge>
              </HStack>
            </VStack>
            
            <VStack align="stretch" spacing={3}>
              <Text fontSize="sm" fontWeight="medium" color="gray.700">Payment Status</Text>
              <HStack justify="space-between">
                <Text fontSize="sm">Paid</Text>
                <Badge colorScheme="green">₹45,600</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">Pending</Text>
                <Badge colorScheme="orange">₹12,400</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">Insurance</Text>
                <Badge colorScheme="blue">₹8,900</Badge>
              </HStack>
            </VStack>
            
            <VStack align="stretch" spacing={3}>
              <Text fontSize="sm" fontWeight="medium" color="gray.700">Follow-up Required</Text>
              <HStack justify="space-between">
                <Text fontSize="sm">Within 7 days</Text>
                <Badge colorScheme="red">12</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">Within 30 days</Text>
                <Badge colorScheme="orange">34</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">As needed</Text>
                <Badge colorScheme="gray">67</Badge>
              </HStack>
            </VStack>
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Generate Report Modal */}
      <Modal isOpen={isGenerateOpen} onClose={onGenerateClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Generate {selectedReportType?.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text fontSize="sm" color="gray.600">
                {selectedReportType?.description}
              </Text>
              
              <HStack>
                <FormControl>
                  <FormLabel>From Date</FormLabel>
                  <Input 
                    type="date" 
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>To Date</FormLabel>
                  <Input 
                    type="date" 
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </FormControl>
              </HStack>
              
              <FormControl>
                <FormLabel>Department</FormLabel>
                <Select placeholder="Select department or all">
                  <option value="all">All Departments</option>
                  <option value="general">General Medicine</option>
                  <option value="panchakarma">Panchakarma</option>
                  <option value="gynecology">Ayurvedic Gynecology</option>
                  <option value="pediatrics">Ayurvedic Pediatrics</option>
                  <option value="dermatology">Ayurvedic Dermatology</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Doctor</FormLabel>
                <Select placeholder="Select doctor or all">
                  <option value="all">All Doctors</option>
                  <option value="dr-priya">Dr. Priya Sharma</option>
                  <option value="dr-anjali">Dr. Anjali Nair</option>
                  <option value="dr-arjun">Dr. Arjun Kumar</option>
                  <option value="dr-meera">Dr. Meera Patel</option>
                </Select>
              </FormControl>
              
              {selectedReportType?.id === 'opd-report' && (
                <>
                  <FormControl>
                    <FormLabel>Patient Type</FormLabel>
                    <Select placeholder="Select patient type">
                      <option value="all">All Patients</option>
                      <option value="new">New Patients</option>
                      <option value="follow-up">Follow-up Patients</option>
                      <option value="emergency">Emergency Cases</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Treatment Category</FormLabel>
                    <Select placeholder="Select treatment category">
                      <option value="all">All Treatments</option>
                      <option value="consultation">Consultation Only</option>
                      <option value="medication">Herbal Medicines</option>
                      <option value="therapy">Therapy Sessions</option>
                      <option value="panchakarma">Panchakarma Treatments</option>
                    </Select>
                  </FormControl>
                </>
              )}
              
              {selectedReportType?.id === 'balance-report' && (
                <>
                  <FormControl>
                    <FormLabel>Payment Status</FormLabel>
                    <Select placeholder="Select payment status">
                      <option value="all">All Statuses</option>
                      <option value="paid">Fully Paid</option>
                      <option value="partial">Partially Paid</option>
                      <option value="pending">Payment Pending</option>
                      <option value="overdue">Overdue</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Amount Range</FormLabel>
                    <HStack>
                      <Input placeholder="Min amount" type="number" />
                      <Input placeholder="Max amount" type="number" />
                    </HStack>
                  </FormControl>
                </>
              )}
              
              {selectedReportType?.id === 'discharged-patients' && (
                <>
                  <FormControl>
                    <FormLabel>Discharge Type</FormLabel>
                    <Select placeholder="Select discharge type">
                      <option value="all">All Discharges</option>
                      <option value="regular">Regular Discharge</option>
                      <option value="ama">Against Medical Advice</option>
                      <option value="referred">Referred to Other Facility</option>
                      <option value="completed">Treatment Completed</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Follow-up Required</FormLabel>
                    <Select placeholder="Select follow-up requirement">
                      <option value="all">All Cases</option>
                      <option value="required">Follow-up Required</option>
                      <option value="optional">Follow-up Optional</option>
                      <option value="completed">Treatment Completed</option>
                    </Select>
                  </FormControl>
                </>
              )}
              
              <FormControl>
                <FormLabel>Include Details</FormLabel>
                <VStack align="stretch" spacing={2}>
                  <Checkbox defaultChecked>Patient Demographics</Checkbox>
                  <Checkbox defaultChecked>Treatment History</Checkbox>
                  <Checkbox defaultChecked>Billing Information</Checkbox>
                  <Checkbox>Doctor Notes</Checkbox>
                  <Checkbox>Prescription Details</Checkbox>
                </VStack>
              </FormControl>
              
              <FormControl>
                <FormLabel>Report Format</FormLabel>
                <Select 
                  value={reportFormat}
                  onChange={(e) => setReportFormat(e.target.value)}
                >
                  <option value="pdf">PDF Report</option>
                  <option value="excel">Excel Spreadsheet</option>
                  <option value="csv">CSV Data File</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Additional Notes</FormLabel>
                <Textarea 
                  placeholder="Any specific requirements or notes for this report..."
                  rows={3}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onGenerateClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" leftIcon={<Download />}>
              Generate Report
            </Button>
            <Button colorScheme="gray" leftIcon={<Printer />} ml={2}>
              Print Preview
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default OPDReports;
