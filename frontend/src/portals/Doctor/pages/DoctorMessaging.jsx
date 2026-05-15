import React, { useState } from 'react';
import {
  Box,
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
  Textarea,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Switch,
  SimpleGrid,
  Icon,
  Progress,
  Heading,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Divider
} from '@chakra-ui/react';
import { 
  MessageSquare, 
  CheckCircle, 
  TrendingUp, 
  Activity, 
  Eye, 
  Send, 
  Plus, 
  Smartphone, 
  MessageCircle, 
  BarChart3,
  Users,
  Clock,
  Calendar,
  UserCheck,
  Stethoscope,
  ChevronRight
} from 'lucide-react';

// Message templates for doctors
const doctorTemplates = [
  { id: 'T001', name: 'Appointment Reminder', category: 'patient', text: 'Dear {patient_name}, this is a reminder for your appointment on {date} at {time}. Please arrive 15 minutes early.' },
  { id: 'T002', name: 'Prescription Ready', category: 'patient', text: 'Your prescription is ready for pickup at our pharmacy. Please bring your ID.' },
  { id: 'T003', name: 'Lab Results Available', category: 'patient', text: 'Your lab results are ready. Please schedule a follow-up appointment to discuss the results.' },
  { id: 'T004', name: 'Medical Instructions', category: 'staff', text: 'Patient in {room_number}: {instructions}. Please monitor and update patient chart.' },
  { id: 'T005', name: 'Discharge Instructions', category: 'patient', text: 'You have been discharged. Please follow these instructions: {instructions}. Contact us if you have concerns.' },
  { id: 'T006', name: 'Post-Surgery Care', category: 'patient', text: 'Post-surgery care instructions: {care_instructions}. Follow-up in {days} days.' }
];

const DoctorMessaging = () => {
  // State for messages from API
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [composeChannel, setComposeChannel] = useState('sms');
  const [composeRecipient, setComposeRecipient] = useState('');
  const [composeMessage, setComposeMessage] = useState('');
  const [recipientType, setRecipientType] = useState('patient');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Disclosures
  const composeDisc = useDisclosure();
  const templateDisc = useDisclosure();

  // Calculate statistics from actual messages
  const stats = [
    { 
      label: 'Messages Today', 
      value: messages.filter(msg => {
        const today = new Date().toDateString();
        return new Date(msg.timestamp).toDateString() === today;
      }).length, 
      icon: MessageSquare, 
      color: 'blue.500' 
    },
    { 
      label: 'Patient Communications', 
      value: messages.filter(msg => msg.type === 'patient' || msg.patientId).length, 
      icon: UserCheck, 
      color: 'green.500' 
    },
    { 
      label: 'Staff Messages', 
      value: messages.filter(msg => msg.type === 'staff' || msg.type === 'medical_instruction').length, 
      icon: Users, 
      color: 'purple.500' 
    },
    { 
      label: 'Pending Responses', 
      value: messages.filter(msg => msg.status === 'sent' || msg.status === 'pending').length, 
      icon: Clock, 
      color: 'orange.500' 
    }
  ];

  const handleTemplateSelect = (template) => {
    setComposeMessage(template.text);
    setSelectedTemplate(template.id);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'green';
      case 'read': return 'blue';
      case 'sent': return 'yellow';
      case 'failed': return 'red';
      default: return 'gray';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'prescription': return 'blue';
      case 'lab_report': return 'green';
      case 'medical_instruction': return 'purple';
      case 'appointment': return 'orange';
      default: return 'gray';
    }
  };

  const filteredMessages = messages.filter(msg =>
    msg.recipient?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box p={6}>
      {/* Header with Breadcrumbs */}
      <VStack align="start" spacing={4} mb={6}>
        <Breadcrumb spacing="8px" separator={<ChevronRight size={16} />}>
          <BreadcrumbItem>
            <BreadcrumbLink href="/doctor">Doctor Portal</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>Messaging</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        
        <HStack justify="space-between" w="full">
          <VStack align="start" spacing={1}>
            <Heading size="lg" color="gray.800">Doctor Messaging Center</Heading>
            <Text color="gray.600">Communicate with patients and medical staff</Text>
          </VStack>
          
          <HStack spacing={3}>
            <Button 
              leftIcon={<Plus size={16} />} 
              colorScheme="blue" 
              onClick={composeDisc.onOpen}
            >
              Compose Message
            </Button>
            <Button 
              variant="outline" 
              leftIcon={<MessageCircle size={16} />}
              onClick={templateDisc.onOpen}
            >
              Templates
            </Button>
          </HStack>
        </HStack>
      </VStack>

      {/* Quick Statistics */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        {stats.map((stat, index) => (
          <Card key={index} bg="white" shadow="sm" border="1px solid" borderColor="gray.200">
            <CardBody>
              <HStack spacing={4}>
                <Box p={3} bg={`${stat.color.split('.')[0]}.50`} borderRadius="lg">
                  <Icon as={stat.icon} size="20" color={stat.color} />
                </Box>
                <VStack align="start" spacing={1}>
                  <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                    {stat.value}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {stat.label}
                  </Text>
                </VStack>
              </HStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      <Tabs index={activeTab} onChange={setActiveTab} variant="enclosed">
        <TabList>
          <Tab>Recent Messages</Tab>
          <Tab>Patient Communications</Tab>
          <Tab>Staff Messages</Tab>
          <Tab>Templates</Tab>
        </TabList>

        <TabPanels>
          {/* Recent Messages */}
          <TabPanel p={0} pt={6}>
            <Card>
              <CardHeader>
                <HStack justify="space-between">
                  <Heading size="md">Recent Messages</Heading>
                  <HStack spacing={3}>
                    <Input
                      placeholder="Search messages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      maxW="300px"
                    />
                    <Select maxW="150px" value={recipientType} onChange={(e) => setRecipientType(e.target.value)}>
                      <option value="all">All</option>
                      <option value="patient">Patients</option>
                      <option value="staff">Staff</option>
                    </Select>
                  </HStack>
                </HStack>
              </CardHeader>
              <CardBody pt={0}>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Recipient</Th>
                        <Th>Message Preview</Th>
                        <Th>Type</Th>
                        <Th>Status</Th>
                        <Th>Time</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredMessages.map((msg) => (
                        <Tr key={msg.id}>
                          <Td>
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="medium">{msg.recipient}</Text>
                              <Text fontSize="sm" color="gray.500">{msg.phone}</Text>
                            </VStack>
                          </Td>
                          <Td>
                            <Text noOfLines={2} maxW="300px">
                              {msg.message}
                            </Text>
                          </Td>
                          <Td>
                            <Badge colorScheme={getTypeColor(msg.type)} variant="subtle">
                              {msg.type.replace('_', ' ')}
                            </Badge>
                          </Td>
                          <Td>
                            <Badge colorScheme={getStatusColor(msg.status)}>
                              {msg.status}
                            </Badge>
                          </Td>
                          <Td>
                            <Text fontSize="sm" color="gray.600">
                              {msg.timestamp.toLocaleString()}
                            </Text>
                          </Td>
                          <Td>
                            <HStack spacing={2}>
                              <IconButton
                                icon={<Eye size={16} />}
                                size="sm"
                                variant="ghost"
                                aria-label="View message"
                              />
                              <IconButton
                                icon={<MessageSquare size={16} />}
                                size="sm"
                                variant="ghost"
                                aria-label="Reply"
                                colorScheme="blue"
                              />
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </CardBody>
            </Card>
          </TabPanel>

          {/* Patient Communications */}
          <TabPanel p={0} pt={6}>
            <Card>
              <CardHeader>
                <Heading size="md">Patient Communications</Heading>
              </CardHeader>
              <CardBody pt={0}>
                <Text color="gray.600">
                  Patient-specific messaging interface will be displayed here.
                </Text>
              </CardBody>
            </Card>
          </TabPanel>

          {/* Staff Messages */}
          <TabPanel p={0} pt={6}>
            <Card>
              <CardHeader>
                <Heading size="md">Staff Messages</Heading>
              </CardHeader>
              <CardBody pt={0}>
                <Text color="gray.600">
                  Medical staff communication interface will be displayed here.
                </Text>
              </CardBody>
            </Card>
          </TabPanel>

          {/* Templates */}
          <TabPanel p={0} pt={6}>
            <Card>
              <CardHeader>
                <HStack justify="space-between">
                  <Heading size="md">Message Templates</Heading>
                  <Button leftIcon={<Plus size={16} />} size="sm" colorScheme="green">
                    New Template
                  </Button>
                </HStack>
              </CardHeader>
              <CardBody pt={0}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  {doctorTemplates.map((template) => (
                    <Card key={template.id} variant="outline" _hover={{ shadow: 'md' }}>
                      <CardBody>
                        <VStack align="start" spacing={3}>
                          <HStack justify="space-between" w="full">
                            <Text fontWeight="semibold">{template.name}</Text>
                            <Badge colorScheme={template.category === 'patient' ? 'blue' : 'purple'}>
                              {template.category}
                            </Badge>
                          </HStack>
                          <Text fontSize="sm" color="gray.600" noOfLines={3}>
                            {template.text}
                          </Text>
                          <Button
                            size="sm"
                            colorScheme="blue"
                            variant="ghost"
                            onClick={() => handleTemplateSelect(template)}
                          >
                            Use Template
                          </Button>
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Compose Message Modal */}
      <Modal isOpen={composeDisc.isOpen} onClose={composeDisc.onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Compose Message</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Channel</FormLabel>
                <Select value={composeChannel} onChange={(e) => setComposeChannel(e.target.value)}>
                  <option value="sms">SMS</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="email">Email</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Recipient Type</FormLabel>
                <Select value={recipientType} onChange={(e) => setRecipientType(e.target.value)}>
                  <option value="patient">Patient</option>
                  <option value="staff">Medical Staff</option>
                  <option value="custom">Custom Number</option>
                </Select>
              </FormControl>

              {recipientType === 'patient' && (
                <FormControl>
                  <FormLabel>Select Patient</FormLabel>
                  <Select placeholder="Choose patient...">
                    <option value="P001">Rajesh Kumar - +91 9876543210</option>
                    <option value="P002">Meera Patel - +91 9876543211</option>
                    <option value="P003">Amit Singh - +91 9876543212</option>
                  </Select>
                </FormControl>
              )}

              {recipientType === 'staff' && (
                <FormControl>
                  <FormLabel>Select Staff/Department</FormLabel>
                  <Select placeholder="Choose staff...">
                    <option value="nursing">Nursing Station</option>
                    <option value="pharmacy">Pharmacy</option>
                    <option value="lab">Laboratory</option>
                    <option value="reception">Reception</option>
                  </Select>
                </FormControl>
              )}

              {recipientType === 'custom' && (
                <FormControl>
                  <FormLabel>Phone Number</FormLabel>
                  <Input
                    placeholder="+91 XXXXXXXXXX"
                    value={composeRecipient}
                    onChange={(e) => setComposeRecipient(e.target.value)}
                  />
                </FormControl>
              )}

              <FormControl>
                <FormLabel>Template (Optional)</FormLabel>
                <Select 
                  placeholder="Choose template..."
                  onChange={(e) => {
                    const template = doctorTemplates.find(t => t.id === e.target.value);
                    if (template) handleTemplateSelect(template);
                  }}
                >
                  {doctorTemplates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              {/* Duration field - mandatory for WhatsApp */}
              {composeChannel === 'whatsapp' && (
                <FormControl isRequired>
                  <FormLabel>Duration (Required for WhatsApp)</FormLabel>
                  <Input
                    placeholder="e.g., 1 hour, 2 days, 1 week"
                    value={composeDuration}
                    onChange={(e) => setComposeDuration(e.target.value)}
                  />
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    Specify how long this message should remain available/valid
                  </Text>
                </FormControl>
              )}

              <FormControl>
                <FormLabel>Message</FormLabel>
                <Textarea
                  placeholder="Type your message here..."
                  value={composeMessage}
                  onChange={(e) => setComposeMessage(e.target.value)}
                  rows={5}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={composeDisc.onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" leftIcon={<Send size={16} />}>
              Send Message
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Templates Modal */}
      <Modal isOpen={templateDisc.isOpen} onClose={templateDisc.onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Message Templates</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              {doctorTemplates.map((template) => (
                <Card key={template.id} w="full" variant="outline">
                  <CardBody>
                    <VStack align="start" spacing={3}>
                      <HStack justify="space-between" w="full">
                        <Text fontWeight="semibold">{template.name}</Text>
                        <Badge colorScheme={template.category === 'patient' ? 'blue' : 'purple'}>
                          {template.category}
                        </Badge>
                      </HStack>
                      <Text fontSize="sm" color="gray.600">
                        {template.text}
                      </Text>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        onClick={() => {
                          handleTemplateSelect(template);
                          templateDisc.onClose();
                          composeDisc.onOpen();
                        }}
                      >
                        Use Template
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={templateDisc.onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DoctorMessaging;
