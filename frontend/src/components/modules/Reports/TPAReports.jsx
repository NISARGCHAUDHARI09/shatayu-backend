import React, { useState } from 'react';
import {
  Box,
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
  Shield,
  FileText,
  BarChart3,
  Filter,
  Eye,
  Printer
} from 'lucide-react';

const TPAReports = ({ title = "TPA Reports" }) => {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [reportFormat, setReportFormat] = useState('pdf');
  const { isOpen: isGenerateOpen, onOpen: onGenerateOpen, onClose: onGenerateClose } = useDisclosure();
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">{title}</Text>
          <Text color="gray.600">Third Party Administrator (TPA) insurance analytics and reporting</Text>
        </Box>
        <Button leftIcon={<BarChart3 />} colorScheme="blue" onClick={onGenerateOpen}>
          Generate TPA Report
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Total Claims</StatLabel>
              <StatNumber color="blue.600">₹12,45,600</StatNumber>
            </Stat>
          </CardBody>
        </Card>
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Approved Claims</StatLabel>
              <StatNumber color="green.600">₹9,87,400</StatNumber>
            </Stat>
          </CardBody>
        </Card>
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Pending Claims</StatLabel>
              <StatNumber color="orange.600">₹2,58,200</StatNumber>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      <Card bg={cardBg} border="1px" borderColor={borderColor}>
        <CardBody>
          <Text fontSize="lg" fontWeight="semibold" mb={4}>TPA Insurance Report</Text>
          <Text fontSize="sm" color="gray.600" mb={4}>
            Comprehensive analysis of insurance claims, TPA settlements, and reimbursement tracking
          </Text>
          
          <VStack align="stretch" spacing={2}>
            <Text fontSize="xs" fontWeight="medium" color="gray.700">Report Includes:</Text>
            <HStack wrap="wrap" spacing={1}>
              {['Claim Status', 'Settlement Details', 'TPA Performance', 'Reimbursement Tracking'].map((field, index) => (
                <Badge key={index} size="sm" variant="outline" colorScheme="gray">{field}</Badge>
              ))}
            </HStack>
          </VStack>
        </CardBody>
      </Card>

      <Modal isOpen={isGenerateOpen} onClose={onGenerateClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Generate TPA Report</ModalHeader>
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
                <FormLabel>TPA Company</FormLabel>
                <Select placeholder="Select TPA or all">
                  <option value="all">All TPAs</option>
                  <option value="mediassist">Medi Assist</option>
                  <option value="paramount">Paramount Health</option>
                  <option value="vidal">Vidal Health</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Claim Status</FormLabel>
                <Select placeholder="Select status">
                  <option value="all">All Claims</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Include Details</FormLabel>
                <VStack align="stretch" spacing={2}>
                  <Checkbox defaultChecked>Claim Details</Checkbox>
                  <Checkbox defaultChecked>Patient Information</Checkbox>
                  <Checkbox defaultChecked>Settlement Amounts</Checkbox>
                  <Checkbox>TPA Processing Time</Checkbox>
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

export default TPAReports;
