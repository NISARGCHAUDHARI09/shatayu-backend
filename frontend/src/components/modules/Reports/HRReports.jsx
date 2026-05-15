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
  Textarea
} from '@chakra-ui/react';
import {
  Download,
  UserCheck,
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
  Award,
  AlertCircle
} from 'lucide-react';

const HRReports = ({ title = "HR Reports" }) => {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [reportFormat, setReportFormat] = useState('pdf');
  const { isOpen: isGenerateOpen, onOpen: onGenerateOpen, onClose: onGenerateClose } = useDisclosure();
  const [selectedReportType, setSelectedReportType] = useState('');
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const reportTypes = [
    {
      id: 'employee-report',
      title: 'Employee Report',
      description: 'Comprehensive employee information including demographics, roles, performance, and employment history',
      icon: Users,
      color: 'blue',
      fields: ['Employee Details', 'Department Wise', 'Performance Metrics', 'Employment Status']
    },
    {
      id: 'payroll-report',
      title: 'Payroll Report',
      description: 'Detailed payroll analysis including salaries, deductions, benefits, and tax calculations',
      icon: DollarSign,
      color: 'green',
      fields: ['Salary Details', 'Deductions', 'Benefits', 'Tax Calculations']
    }
  ];

  const quickStats = [
    { label: 'Total Employees', value: '156', change: '+8.3%', trend: 'up' },
    { label: 'Monthly Payroll', value: '₹18,45,000', change: '+5.2%', trend: 'up' },
    { label: 'New Hires', value: '12', change: '+20.0%', trend: 'up' },
    { label: 'Attendance Rate', value: '94.5%', change: '+1.2%', trend: 'up' }
  ];

  const departmentStats = [
    { name: 'Medical Staff', count: 45, payroll: '₹8,45,000', color: 'blue' },
    { name: 'Nursing', count: 38, payroll: '₹5,70,000', color: 'green' },
    { name: 'Administration', count: 25, payroll: '₹2,50,000', color: 'purple' },
    { name: 'Support Staff', count: 32, payroll: '₹1,92,000', color: 'orange' },
    { name: 'Pharmacy', count: 16, payroll: '₹1,28,000', color: 'pink' }
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
            Human resources analytics and employee management reports
          </Text>
        </Box>
        <HStack>
          <Button leftIcon={<Filter />} variant="outline">
            Advanced Filters
          </Button>
          <Button leftIcon={<Calendar />} variant="outline">
            Attendance Reports
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
            <Text fontSize="lg" fontWeight="semibold" mb={6}>HR Report Categories</Text>
            
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
                            HR Report
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
            <Text fontSize="lg" fontWeight="semibold" mb={4}>Department Breakdown</Text>
            
            <VStack spacing={4} align="stretch">
              {departmentStats.map((dept, index) => (
                <Box key={index} p={3} bg="gray.50" borderRadius="md">
                  <VStack spacing={2} align="stretch">
                    <Text fontWeight="medium" fontSize="sm">
                      {dept.name}
                    </Text>
                    <HStack justify="space-between">
                      <Text fontSize="xs" color="gray.600">Employees</Text>
                      <Badge colorScheme={dept.color}>{dept.count}</Badge>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontSize="xs" color="gray.600">Monthly Payroll</Text>
                      <Text fontSize="xs" fontWeight="semibold" color="green.600">
                        {dept.payroll}
                      </Text>
                    </HStack>
                  </VStack>
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>
      </Grid>

      {/* Today's Activity */}
      <Card bg={cardBg} border="1px" borderColor={borderColor}>
        <CardBody>
          <Text fontSize="lg" fontWeight="semibold" mb={4}>Today's HR Activity</Text>
          
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
            <VStack align="stretch" spacing={3}>
              <Text fontSize="sm" fontWeight="medium" color="gray.700">Attendance</Text>
              <HStack justify="space-between">
                <Text fontSize="sm">Present</Text>
                <Badge colorScheme="green">148</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">Absent</Text>
                <Badge colorScheme="red">5</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">On Leave</Text>
                <Badge colorScheme="orange">3</Badge>
              </HStack>
            </VStack>
            
            <VStack align="stretch" spacing={3}>
              <Text fontSize="sm" fontWeight="medium" color="gray.700">Shifts</Text>
              <HStack justify="space-between">
                <Text fontSize="sm">Day Shift</Text>
                <Badge>89</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">Night Shift</Text>
                <Badge>34</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">Flexible</Text>
                <Badge>25</Badge>
              </HStack>
            </VStack>
            
            <VStack align="stretch" spacing={3}>
              <Text fontSize="sm" fontWeight="medium" color="gray.700">Performance</Text>
              <HStack justify="space-between">
                <Text fontSize="sm">Excellent</Text>
                <Badge colorScheme="green">67</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">Good</Text>
                <Badge colorScheme="blue">78</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">Needs Improvement</Text>
                <Badge colorScheme="orange">11</Badge>
              </HStack>
            </VStack>
            
            <VStack align="stretch" spacing={3}>
              <Text fontSize="sm" fontWeight="medium" color="gray.700">Actions Required</Text>
              <HStack justify="space-between">
                <Text fontSize="sm">Pending Reviews</Text>
                <Badge colorScheme="orange">8</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">Training Due</Text>
                <Badge colorScheme="blue">12</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">Document Updates</Text>
                <Badge colorScheme="purple">5</Badge>
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
                  <option value="medical">Medical Staff</option>
                  <option value="nursing">Nursing</option>
                  <option value="administration">Administration</option>
                  <option value="support">Support Staff</option>
                  <option value="pharmacy">Pharmacy</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Employment Type</FormLabel>
                <Select placeholder="Select employment type or all">
                  <option value="all">All Types</option>
                  <option value="permanent">Permanent</option>
                  <option value="contract">Contract</option>
                  <option value="part-time">Part Time</option>
                  <option value="intern">Intern</option>
                </Select>
              </FormControl>
              
              {selectedReportType?.id === 'employee-report' && (
                <>
                  <FormControl>
                    <FormLabel>Employee Status</FormLabel>
                    <Select placeholder="Select status">
                      <option value="all">All Employees</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="on-leave">On Leave</option>
                      <option value="terminated">Terminated</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Experience Level</FormLabel>
                    <Select placeholder="Select experience level">
                      <option value="all">All Levels</option>
                      <option value="entry">Entry Level (0-2 years)</option>
                      <option value="mid">Mid Level (2-5 years)</option>
                      <option value="senior">Senior Level (5-10 years)</option>
                      <option value="expert">Expert Level (10+ years)</option>
                    </Select>
                  </FormControl>
                </>
              )}
              
              {selectedReportType?.id === 'payroll-report' && (
                <>
                  <FormControl>
                    <FormLabel>Salary Range</FormLabel>
                    <HStack>
                      <Input placeholder="Min salary" type="number" />
                      <Input placeholder="Max salary" type="number" />
                    </HStack>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Pay Period</FormLabel>
                    <Select placeholder="Select pay period">
                      <option value="current-month">Current Month</option>
                      <option value="last-month">Last Month</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                      <option value="custom">Custom Range</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Include Components</FormLabel>
                    <VStack align="stretch" spacing={2}>
                      <Checkbox defaultChecked>Basic Salary</Checkbox>
                      <Checkbox defaultChecked>Allowances</Checkbox>
                      <Checkbox defaultChecked>Deductions</Checkbox>
                      <Checkbox>Overtime</Checkbox>
                      <Checkbox>Bonuses</Checkbox>
                      <Checkbox>Tax Details</Checkbox>
                    </VStack>
                  </FormControl>
                </>
              )}
              
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

export default HRReports;
