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
  Video,
  Users,
  Clock,
  BarChart3,
  Filter,
  Eye,
  Printer,
  Calendar
} from 'lucide-react';

const ConsultationReports = ({ title = "Consultation Reports" }) => {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [reportFormat, setReportFormat] = useState('pdf');
  const { isOpen: isGenerateOpen, onOpen: onGenerateOpen, onClose: onGenerateClose } = useDisclosure();
  const [selectedReportType, setSelectedReportType] = useState('');
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const reportTypes = [
    {
      id: 'consultation-usage',
      title: 'Live Consultation Usage Report',
      description: 'Analysis of live consultation platform usage, session durations, and patient engagement',
      icon: Video,
      color: 'blue',
      fields: ['Session Analytics', 'Doctor Availability', 'Patient Satisfaction', 'Technical Issues']
    },
    {
      id: 'meeting-analytics',
      title: 'Live Meeting Analytics Report',
      description: 'Comprehensive analysis of live meetings, participant engagement, and meeting effectiveness',
      icon: Users,
      color: 'green',
      fields: ['Meeting Duration', 'Participant Count', 'Engagement Metrics', 'Meeting Quality']
    }
  ];

  const quickStats = [
    { label: 'Total Consultations', value: '1,234', color: 'blue' },
    { label: 'Avg. Session Time', value: '28 min', color: 'green' },
    { label: 'Patient Satisfaction', value: '4.8/5', color: 'purple' },
    { label: 'Technical Issues', value: '2.1%', color: 'orange' }
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
          <Text color="gray.600">Live consultation and meeting analytics reporting</Text>
        </Box>
        <HStack>
          <Button leftIcon={<Filter />} variant="outline">Advanced Filters</Button>
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

      <Card bg={cardBg} border="1px" borderColor={borderColor}>
        <CardBody>
          <Text fontSize="lg" fontWeight="semibold" mb={6}>Consultation Report Categories</Text>
          
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
                        <Badge colorScheme={report.color} variant="subtle">Consultation Report</Badge>
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
                <FormLabel>Doctor</FormLabel>
                <Select placeholder="Select doctor or all">
                  <option value="all">All Doctors</option>
                  <option value="dr-priya">Dr. Priya Sharma</option>
                  <option value="dr-anjali">Dr. Anjali Nair</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Session Type</FormLabel>
                <Select placeholder="Select session type">
                  <option value="all">All Sessions</option>
                  <option value="consultation">Consultation</option>
                  <option value="follow-up">Follow-up</option>
                  <option value="emergency">Emergency</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Include Details</FormLabel>
                <VStack align="stretch" spacing={2}>
                  <Checkbox defaultChecked>Session Analytics</Checkbox>
                  <Checkbox defaultChecked>Patient Feedback</Checkbox>
                  <Checkbox defaultChecked>Technical Metrics</Checkbox>
                  <Checkbox>Recording Details</Checkbox>
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

export default ConsultationReports;
