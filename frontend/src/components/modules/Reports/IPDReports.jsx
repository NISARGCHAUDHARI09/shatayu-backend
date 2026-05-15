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
  StatHelpText,
  StatArrow,
  Checkbox,
  Textarea,
  Progress
} from '@chakra-ui/react';
import {
  Download,
  BedDouble,
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
  Activity,
  Heart,
  Shield
} from 'lucide-react';

const IPDReports = ({ title = "IPD Reports" }) => {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [reportFormat, setReportFormat] = useState('pdf');
  const { isOpen: isGenerateOpen, onOpen: onGenerateOpen, onClose: onGenerateClose } = useDisclosure();
  const [selectedReportType, setSelectedReportType] = useState('');
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const reportTypes = [
    {
      id: 'ipd-report',
      title: 'IPD Report',
      description: 'Comprehensive inpatient department report with admission details, treatment progress, and bed occupancy',
      icon: BedDouble,
      color: 'blue',
      fields: ['Patient Admissions', 'Treatment Plans', 'Bed Allocation', 'Medical History']
    },
    {
      id: 'balance-report',
      title: 'IPD Balance Report',
      description: 'Financial overview of inpatient services including outstanding balances and payment tracking',
      icon: DollarSign,
      color: 'green',
      fields: ['Outstanding Bills', 'Insurance Claims', 'Payment History', 'Deposit Status']
    },
    {
      id: 'discharged-patients',
      title: 'Discharged Patients Report',
      description: 'Detailed report of patients discharged from IPD with treatment outcomes and discharge summaries',
      icon: UserCheck,
      color: 'purple',
      fields: ['Discharge Summary', 'Treatment Outcome', 'Medications', 'Follow-up Instructions']
    }
  ];

  const quickStats = [
    { label: 'Total Admissions', value: '156', change: '+8.2%', trend: 'up' },
    { label: 'Current Inpatients', value: '89', change: '+5.4%', trend: 'up' },
    { label: 'Bed Occupancy', value: '74%', change: '+3.1%', trend: 'up' },
    { label: 'Avg. Length of Stay', value: '12.5 days', change: '-2.3%', trend: 'down' }
  ];

  const bedOccupancy = [
    { ward: 'General Ward', total: 50, occupied: 37, occupancy: 74 },
    { ward: 'Panchakarma Ward', total: 20, occupied: 18, occupancy: 90 },
    { ward: 'Private Rooms', total: 15, occupied: 12, occupancy: 80 },
    { ward: 'ICU', total: 8, occupied: 6, occupancy: 75 },
    { ward: 'Isolation Ward', total: 10, occupied: 4, occupancy: 40 }
  ];

  const treatmentCategories = [
    { name: 'Panchakarma Therapy', patients: 45, avgStay: '14 days', color: 'green' },
    { name: 'Post-surgical Care', patients: 23, avgStay: '8 days', color: 'blue' },
    { name: 'Chronic Disease Management', patients: 18, avgStay: '21 days', color: 'purple' },
    { name: 'Detoxification Program', patients: 15, avgStay: '10 days', color: 'orange' },
    { name: 'Rehabilitation', patients: 12, avgStay: '28 days', color: 'pink' }
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
      {/* Enhanced Header */}
      <Box
        bgGradient="linear(to-r, blue.50, white)"
        borderRadius="2xl"
        boxShadow="lg"
        p={{ base: 4, md: 8 }}
        mb={8}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <HStack spacing={4} align="center">
          <Box bg="blue.100" p={3} borderRadius="full" boxShadow="md">
            <BedDouble size={32} color="#2563eb" />
          </Box>
          <Box>
            <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold" color="blue.800">
              {title}
            </Text>
            <Text color="gray.600" fontSize={{ base: 'sm', md: 'md' }}>
              Inpatient department analytics and comprehensive reporting
            </Text>
          </Box>
        </HStack>
        <HStack spacing={3}>
          <Button leftIcon={<Filter />} variant="outline" colorScheme="blue" boxShadow="sm">
            Advanced Filters
          </Button>
          <Button leftIcon={<Activity />} variant="solid" colorScheme="blue" boxShadow="sm">
            Live Ward Status
          </Button>
        </HStack>
      </Box>
      <Divider mb={8} />

      {/* Quick Stats */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={6} mb={8}>
        {quickStats.map((stat, index) => (
          <Card
            key={index}
            bgGradient="linear(to-br, white, blue.50)"
            border="none"
            boxShadow="xl"
            transition="transform 0.2s"
            _hover={{ transform: 'scale(1.04)', boxShadow: '2xl' }}
          >
            <CardBody>
              <Stat>
                <StatLabel color="gray.600">{stat.label}</StatLabel>
                <StatNumber color={stat.trend === 'up' ? 'green.600' : 'red.600'} fontSize="2xl">
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

  <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8} mb={8}>
        {/* Report Categories */}
  <Card bg={cardBg} border="none" boxShadow="lg" _hover={{ boxShadow: '2xl' }}>
          <CardBody>
            <Text fontSize="lg" fontWeight="semibold" mb={6}>IPD Report Categories</Text>
            
            <VStack spacing={4} align="stretch">
              {reportTypes.map((report) => (
                <Card key={report.id} variant="outline" boxShadow="md" borderColor={`${report.color}.200`} _hover={{ shadow: 'xl', borderColor: `${report.color}.400` }} transition="all 0.2s">
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <HStack>
                        <Box p={3} bg={`${report.color}.100`} borderRadius="lg" boxShadow="sm">
                          {getIconComponent(report.icon, report.color)}
                        </Box>
                        <VStack align="start" spacing={1} flex={1}>
                          <Text fontWeight="semibold">
                            {report.title}
                          </Text>
                          <Badge colorScheme={report.color} variant="subtle">
                            IPD Report
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

        {/* Bed Occupancy Status */}
  <Card bg={cardBg} border="none" boxShadow="lg" _hover={{ boxShadow: '2xl' }}>
          <CardBody>
            <Text fontSize="lg" fontWeight="semibold" mb={4}>Current Bed Occupancy</Text>
            
            <VStack spacing={4} align="stretch">
              {bedOccupancy.map((ward, index) => (
                <Box key={index} p={3} bg="gray.50" borderRadius="md" boxShadow="sm" _hover={{ boxShadow: 'md', bg: 'blue.50' }} transition="all 0.2s">
                  <VStack spacing={3} align="stretch">
                    <HStack justify="space-between">
                      <Text fontWeight="medium" fontSize="sm">
                        {ward.ward}
                      </Text>
                      <Badge 
                        colorScheme={ward.occupancy >= 80 ? 'red' : ward.occupancy >= 60 ? 'orange' : 'green'}
                      >
                        {ward.occupancy}%
                      </Badge>
                    </HStack>
                    <Progress 
                      value={ward.occupancy} 
                      colorScheme={ward.occupancy >= 80 ? 'red' : ward.occupancy >= 60 ? 'orange' : 'green'}
                      size="sm"
                    />
                    <HStack justify="space-between" fontSize="xs" color="gray.600">
                      <Text>Occupied: {ward.occupied}</Text>
                      <Text>Total: {ward.total}</Text>
                    </HStack>
                  </VStack>
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>
      </Grid>

      {/* Treatment Categories */}
  <Card bg={cardBg} border="none" boxShadow="lg" mb={8} _hover={{ boxShadow: '2xl' }}>
        <CardBody>
          <Text fontSize="lg" fontWeight="semibold" mb={4}>Treatment Categories Analysis</Text>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={4}>
            {treatmentCategories.map((category, index) => (
              <Box key={index} p={4} bg="gray.50" borderRadius="md" boxShadow="sm" _hover={{ boxShadow: 'md', bg: `${category.color}.50` }} transition="all 0.2s">
                <VStack spacing={2} align="center">
                  <Text fontWeight="medium" fontSize="sm" textAlign="center">
                    {category.name}
                  </Text>
                  <Badge colorScheme={category.color} size="lg">
                    {category.patients} patients
                  </Badge>
                  <Text fontSize="xs" color="gray.600">
                    Avg: {category.avgStay}
                  </Text>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Recent Activity */}
  <Card bg={cardBg} border="none" boxShadow="lg" _hover={{ boxShadow: '2xl' }}>
        <CardBody>
          <Flex justify="space-between" align="center" mb={4}>
            <Text fontSize="lg" fontWeight="semibold">Today's IPD Activity</Text>
            <Button size="sm" leftIcon={<Heart />} variant="outline">
              Critical Alerts
            </Button>
          </Flex>
          
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
            <VStack align="stretch" spacing={3}>
              <Text fontSize="sm" fontWeight="medium" color="gray.700">Admissions Today</Text>
              <HStack justify="space-between">
                <Text fontSize="sm">New Admissions</Text>
                <Badge colorScheme="blue">8</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">Emergency</Text>
                <Badge colorScheme="red">2</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">Planned</Text>
                <Badge colorScheme="green">6</Badge>
              </HStack>
            </VStack>
            
            <VStack align="stretch" spacing={3}>
              <Text fontSize="sm" fontWeight="medium" color="gray.700">Discharges Today</Text>
              <HStack justify="space-between">
                <Text fontSize="sm">Regular Discharge</Text>
                <Badge colorScheme="green">5</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">Against Advice</Text>
                <Badge colorScheme="orange">1</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">Referred</Text>
                <Badge colorScheme="purple">1</Badge>
              </HStack>
            </VStack>
            
            <VStack align="stretch" spacing={3}>
              <Text fontSize="sm" fontWeight="medium" color="gray.700">Revenue Today</Text>
              <HStack justify="space-between">
                <Text fontSize="sm">Room Charges</Text>
                <Text fontSize="sm" fontWeight="semibold" color="green.600">₹28,500</Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">Treatment</Text>
                <Text fontSize="sm" fontWeight="semibold" color="green.600">₹45,200</Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">Total</Text>
                <Text fontSize="sm" fontWeight="semibold" color="green.600">₹73,700</Text>
              </HStack>
            </VStack>
            
            <VStack align="stretch" spacing={3}>
              <Text fontSize="sm" fontWeight="medium" color="gray.700">Critical Updates</Text>
              <HStack justify="space-between">
                <Text fontSize="sm">ICU Patients</Text>
                <Badge colorScheme="red">6</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">Pending Surgery</Text>
                <Badge colorScheme="orange">3</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">Discharge Ready</Text>
                <Badge colorScheme="blue">12</Badge>
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
                <FormLabel>Ward/Department</FormLabel>
                <Select placeholder="Select ward or all">
                  <option value="all">All Wards</option>
                  <option value="general">General Ward</option>
                  <option value="panchakarma">Panchakarma Ward</option>
                  <option value="private">Private Rooms</option>
                  <option value="icu">ICU</option>
                  <option value="isolation">Isolation Ward</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Attending Doctor</FormLabel>
                <Select placeholder="Select doctor or all">
                  <option value="all">All Doctors</option>
                  <option value="dr-priya">Dr. Priya Sharma</option>
                  <option value="dr-anjali">Dr. Anjali Nair</option>
                  <option value="dr-arjun">Dr. Arjun Kumar</option>
                  <option value="dr-meera">Dr. Meera Patel</option>
                </Select>
              </FormControl>
              
              {selectedReportType?.id === 'ipd-report' && (
                <>
                  <FormControl>
                    <FormLabel>Admission Type</FormLabel>
                    <Select placeholder="Select admission type">
                      <option value="all">All Admissions</option>
                      <option value="emergency">Emergency</option>
                      <option value="planned">Planned</option>
                      <option value="transfer">Transfer</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Treatment Category</FormLabel>
                    <Select placeholder="Select treatment category">
                      <option value="all">All Treatments</option>
                      <option value="panchakarma">Panchakarma Therapy</option>
                      <option value="surgical">Post-surgical Care</option>
                      <option value="chronic">Chronic Disease Management</option>
                      <option value="detox">Detoxification</option>
                      <option value="rehab">Rehabilitation</option>
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
                    <FormLabel>Insurance Status</FormLabel>
                    <Select placeholder="Select insurance status">
                      <option value="all">All Cases</option>
                      <option value="insured">Insurance Claims</option>
                      <option value="self-pay">Self Pay</option>
                      <option value="pending-approval">Pending Approval</option>
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
                      <option value="referred">Referred</option>
                      <option value="expired">Expired</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Treatment Outcome</FormLabel>
                    <Select placeholder="Select treatment outcome">
                      <option value="all">All Outcomes</option>
                      <option value="improved">Improved</option>
                      <option value="cured">Cured</option>
                      <option value="stable">Stable</option>
                      <option value="referred">Referred for Further Treatment</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Length of Stay</FormLabel>
                    <HStack>
                      <Input placeholder="Min days" type="number" />
                      <Input placeholder="Max days" type="number" />
                    </HStack>
                  </FormControl>
                </>
              )}
              
              <FormControl>
                <FormLabel>Include Details</FormLabel>
                <VStack align="stretch" spacing={2}>
                  <Checkbox defaultChecked>Patient Demographics</Checkbox>
                  <Checkbox defaultChecked>Treatment History</Checkbox>
                  <Checkbox defaultChecked>Billing Information</Checkbox>
                  <Checkbox>Daily Progress Notes</Checkbox>
                  <Checkbox>Medication Details</Checkbox>
                  <Checkbox>Nursing Care Plans</Checkbox>
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
                <FormLabel>Special Instructions</FormLabel>
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

export default IPDReports;
