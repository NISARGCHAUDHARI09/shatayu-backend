import React, { useState } from 'react';
import {
  Box,
  Grid,
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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Avatar,
  AvatarGroup,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
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
  Switch,
  Divider,
  SimpleGrid,
  Icon,
  Heading,
  StatGroup,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
  InputGroup,
  InputLeftElement,
  useToast,
  Checkbox,
  CheckboxGroup,
  Stack
} from '@chakra-ui/react';
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Eye,
  MessageSquare,
  Send,
  Users,
  Bell,
  Phone,
  Video,
  Mail,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Paperclip,
  Download,
  Archive,
  Trash2,
  MessageCircle,
  Smartphone,
  Settings,
  TrendingUp,
  BarChart3,
  Globe,
  Target,
  Zap,
  Activity
} from 'lucide-react';

// Mock SMS data
const mockSMSMessages = [
  {
    id: 'SMS001',
    recipient: 'Rajesh Kumar (+91 9876543210)',
    message: 'Dear Mr. Kumar, your appointment with Dr. Priya Sharma is scheduled for tomorrow at 10:00 AM. Please arrive 15 minutes early.',
    status: 'delivered',
    timestamp: '2024-12-15 14:30',
    type: 'appointment_reminder',
    cost: '₹0.50',
    template: 'Appointment Reminder'
  },
  {
    id: 'SMS002',
    recipient: 'Meera Patel (+91 9876543211)',
    message: 'Your lab reports are ready. Please visit our reception to collect them. For queries, call: 080-12345678',
    status: 'delivered',
    timestamp: '2024-12-15 13:45',
    type: 'lab_report',
    cost: '₹0.50',
    template: 'Lab Report Ready'
  },
  {
    id: 'SMS003',
    recipient: 'Arjun Singh (+91 9876543212)',
    message: 'Please take your prescribed medicines: Ashwagandha 2 tablets morning, Triphala 1 tablet night. Continue for 15 days.',
    status: 'sent',
    timestamp: '2024-12-15 12:15',
    type: 'medicine_reminder',
    cost: '₹0.50',
    template: 'Medicine Reminder'
  },
  {
    id: 'SMS004',
    recipient: 'Priya Sharma (+91 9876543213)',
    message: 'Your payment of ₹2,500 has been received. Your next appointment is confirmed for 20th Dec 2024.',
    status: 'failed',
    timestamp: '2024-12-15 11:30',
    type: 'payment_confirmation',
    cost: '₹0.50',
    template: 'Payment Confirmation'
  }
];

// Mock WhatsApp data
const mockWhatsAppMessages = [
  {
    id: 'WA001',
    recipient: 'Anjali Desai (+91 9876543214)',
    message: '🏥 *Ayurvedic Hospital* 🌿\n\nDear Anjali,\n\nYour Panchakarma treatment schedule:\n📅 Tomorrow 9:00 AM - Abhyanga\n📅 11:00 AM - Swedana\n\nPlease bring comfortable clothes. 🙏',
    status: 'read',
    timestamp: '2024-12-15 15:00',
    type: 'treatment_schedule',
    template: 'Treatment Schedule',
    hasMedia: false
  },
  {
    id: 'WA002',
    recipient: 'Vikram Gupta (+91 9876543215)',
    message: '🌟 *Diet Plan for Diabetes* 🌟\n\n✅ Morning: Methi water\n✅ Breakfast: Oats with almonds\n✅ Lunch: Brown rice + vegetables\n✅ Dinner: Light soup\n\nAvoid: Sugar, fried foods\n\nFor questions, reply here! 💬',
    status: 'delivered',
    timestamp: '2024-12-15 14:20',
    type: 'diet_plan',
    template: 'Diet Consultation',
    hasMedia: false
  },
  {
    id: 'WA003',
    recipient: 'Sunita Rao (+91 9876543216)',
    message: '📋 *Lab Report Results* 📋\n\nYour Prakriti analysis is complete! 🎉\n\nResults show Vata-Pitta constitution.\n\nRecommended treatments attached.\n\nSchedule follow-up: bit.ly/book-appointment',
    status: 'delivered',
    timestamp: '2024-12-15 13:10',
    type: 'lab_results',
    template: 'Lab Results',
    hasMedia: true
  },
  {
    id: 'WA004',
    recipient: 'Rohit Kumar (+91 9876543217)',
    message: '💰 *Payment Received* 💰\n\nThank you! ₹3,500 received for consultation.\n\nReceipt: #RCP2024-001\n📄 Download: bit.ly/receipt-download\n\nNext appointment: 22 Dec 2024, 2:00 PM ⏰',
    status: 'read',
    timestamp: '2024-12-15 12:45',
    type: 'payment_receipt',
    template: 'Payment Receipt',
    hasMedia: true
  }
];

// Mock campaign data
const mockCampaigns = [
  {
    id: 'CAM001',
    name: 'Monthly Health Tips',
    type: 'sms',
    recipients: 245,
    sent: 245,
    delivered: 242,
    status: 'completed',
    date: '2024-12-15',
    cost: '₹122.50'
  },
  {
    id: 'CAM002',
    name: 'Appointment Reminders',
    type: 'whatsapp',
    recipients: 156,
    sent: 156,
    delivered: 154,
    status: 'completed',
    date: '2024-12-15',
    cost: '₹0.00'
  },
  {
    id: 'CAM003',
    name: 'Panchakarma Package Offer',
    type: 'whatsapp',
    recipients: 89,
    sent: 45,
    delivered: 43,
    status: 'in_progress',
    date: '2024-12-15',
    cost: '₹0.00'
  }
];

// Mock messaging templates
const smsTemplates = [
  { id: 1, name: 'Appointment Reminder', category: 'Appointments', usage: 245 },
  { id: 2, name: 'Lab Report Ready', category: 'Reports', usage: 89 },
  { id: 3, name: 'Medicine Reminder', category: 'Treatment', usage: 156 },
  { id: 4, name: 'Payment Confirmation', category: 'Billing', usage: 78 }
];

const whatsappTemplates = [
  { id: 1, name: 'Treatment Schedule', category: 'Treatment', usage: 134 },
  { id: 2, name: 'Diet Consultation', category: 'Consultation', usage: 98 },
  { id: 3, name: 'Lab Results', category: 'Reports', usage: 67 },
  { id: 4, name: 'Payment Receipt', category: 'Billing', usage: 45 }
];

const Messaging = ({ title = "Messaging Center", showAddButton = true }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  
  const { isOpen: isComposeOpen, onOpen: onComposeOpen, onClose: onComposeClose } = useDisclosure();
  const { isOpen: isCampaignOpen, onOpen: onCampaignOpen, onClose: onCampaignClose } = useDisclosure();
  const { isOpen: isTemplateOpen, onOpen: onTemplateOpen, onClose: onTemplateClose } = useDisclosure();
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headerGradient = useColorModeValue(
    'linear(135deg, #667eea 0%, #764ba2 100%)',
    'linear(135deg, #667eea 0%, #764ba2 100%)'
  );
  
  const toast = useToast();

  // Helper functions
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'green';
      case 'sent': return 'blue';
      case 'failed': return 'red';
      case 'read': return 'purple';
      case 'pending': return 'yellow';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return CheckCircle;
      case 'sent': return Send;
      case 'failed': return AlertCircle;
      case 'read': return Eye;
      case 'pending': return Clock;
      default: return Clock;
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true 
    });
  };

  // Statistics calculations
  const smsStats = {
    total: mockSMSMessages.length,
    delivered: mockSMSMessages.filter(m => m.status === 'delivered').length,
    failed: mockSMSMessages.filter(m => m.status === 'failed').length,
    cost: mockSMSMessages.reduce((sum, m) => sum + parseFloat(m.cost.replace('₹', '')), 0)
  };

  const whatsappStats = {
    total: mockWhatsAppMessages.length,
    delivered: mockWhatsAppMessages.filter(m => m.status === 'delivered').length,
    read: mockWhatsAppMessages.filter(m => m.status === 'read').length,
    withMedia: mockWhatsAppMessages.filter(m => m.hasMedia).length
  };

  const campaignStats = {
    total: mockCampaigns.length,
    active: mockCampaigns.filter(c => c.status === 'in_progress').length,
    completed: mockCampaigns.filter(c => c.status === 'completed').length
  };

  return (
    <Box p={6} bg="gray.50" minH="100vh">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={8}>
        <Box>
          <Heading size="lg" color="gray.800" mb={2}>
            {title}
          </Heading>
          <Text color="gray.600" fontSize="md">
            SMS & WhatsApp messaging platform for patient communication
          </Text>
        </Box>
        {showAddButton && (
          <HStack spacing={3}>
            <Button 
              leftIcon={<BarChart3 size={18} />} 
              variant="outline" 
              colorScheme="purple"
              onClick={onCampaignOpen}
            >
              View Campaigns
            </Button>
            <Button 
              leftIcon={<Plus size={18} />} 
              colorScheme="blue" 
              bg="blue.500"
              _hover={{ bg: "blue.600" }}
              onClick={onComposeOpen}
            >
              Send Message
            </Button>
          </HStack>
        )}
      </Flex>

      {/* Overall Statistics Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <Card bg="white" shadow="lg" border="1px solid" borderColor="blue.100">
          <CardBody>
            <HStack>
              <Box p={3} bg="blue.50" borderRadius="xl">
                <Icon as={MessageSquare} color="blue.500" boxSize={6} />
              </Box>
              <VStack align="start" spacing={0}>
                <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                  {smsStats.total + whatsappStats.total}
                </Text>
                <Text fontSize="sm" color="gray.600">Total Messages</Text>
              </VStack>
            </HStack>
          </CardBody>
        </Card>

        <Card bg="white" shadow="lg" border="1px solid" borderColor="green.100">
          <CardBody>
            <HStack>
              <Box p={3} bg="green.50" borderRadius="xl">
                <Icon as={CheckCircle} color="green.500" boxSize={6} />
              </Box>
              <VStack align="start" spacing={0}>
                <Text fontSize="2xl" fontWeight="bold" color="green.600">
                  {smsStats.delivered + whatsappStats.delivered}
                </Text>
                <Text fontSize="sm" color="gray.600">Delivered</Text>
              </VStack>
            </HStack>
          </CardBody>
        </Card>

        <Card bg="white" shadow="lg" border="1px solid" borderColor="purple.100">
          <CardBody>
            <HStack>
              <Box p={3} bg="purple.50" borderRadius="xl">
                <Icon as={TrendingUp} color="purple.500" boxSize={6} />
              </Box>
              <VStack align="start" spacing={0}>
                <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                  {campaignStats.active}
                </Text>
                <Text fontSize="sm" color="gray.600">Active Campaigns</Text>
              </VStack>
            </HStack>
          </CardBody>
        </Card>

        <Card bg="white" shadow="lg" border="1px solid" borderColor="orange.100">
          <CardBody>
            <HStack>
              <Box p={3} bg="orange.50" borderRadius="xl">
                <Icon as={Activity} color="orange.500" boxSize={6} />
              </Box>
              <VStack align="start" spacing={0}>
                <Text fontSize="2xl" fontWeight="bold" color="orange.600">
                  ₹{smsStats.cost.toFixed(2)}
                </Text>
                <Text fontSize="sm" color="gray.600">SMS Cost Today</Text>
              </VStack>
            </HStack>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Main Content Tabs */}
      <Card bg="white" shadow="xl" borderRadius="xl">
        <CardBody p={0}>
          <Tabs 
            variant="soft-rounded" 
            colorScheme="blue" 
            value={activeTab}
            onChange={setActiveTab}
          >
            <TabList p={6} pb={0}>
              <HStack spacing={4} w="full">
                <Tab 
                  leftIcon={<Smartphone size={18} />}
                  _selected={{ 
                    bg: "blue.500", 
                    color: "white",
                    transform: "translateY(-2px)",
                    shadow: "lg"
                  }}
                  px={8}
                  py={3}
                  borderRadius="xl"
                  transition="all 0.3s"
                >
                  SMS Messages
                </Tab>
                <Tab 
                  leftIcon={<MessageCircle size={18} />}
                  _selected={{ 
                    bg: "green.500", 
                    color: "white",
                    transform: "translateY(-2px)",
                    shadow: "lg"
                  }}
                  px={8}
                  py={3}
                  borderRadius="xl"
                  transition="all 0.3s"
                >
                  WhatsApp Messages
                </Tab>
                <Tab 
                  leftIcon={<BarChart3 size={18} />}
                  _selected={{ 
                    bg: "purple.500", 
                    color: "white",
                    transform: "translateY(-2px)",
                    shadow: "lg"
                  }}
                  px={8}
                  py={3}
                  borderRadius="xl"
                  transition="all 0.3s"
                >
                  Analytics
                </Tab>
              </HStack>
            </TabList>

            <TabPanels>
              {/* SMS Messages Tab */}
              <TabPanel p={6}>
                <VStack spacing={6} align="stretch">
                  {/* SMS Statistics */}
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                    <Card variant="outline" borderColor="blue.200">
                      <CardBody>
                        <Stat>
                          <StatLabel color="blue.600">Total SMS Sent</StatLabel>
                          <StatNumber color="blue.700">{smsStats.total}</StatNumber>
                          <StatHelpText color="green.500">
                            <Icon as={TrendingUp} /> +12% from last week
                          </StatHelpText>
                        </Stat>
                      </CardBody>
                    </Card>
                    
                    <Card variant="outline" borderColor="green.200">
                      <CardBody>
                        <Stat>
                          <StatLabel color="green.600">Delivery Rate</StatLabel>
                          <StatNumber color="green.700">
                            {((smsStats.delivered / smsStats.total) * 100).toFixed(1)}%
                          </StatNumber>
                          <StatHelpText color="green.500">
                            {smsStats.delivered}/{smsStats.total} delivered
                          </StatHelpText>
                        </Stat>
                      </CardBody>
                    </Card>
                    
                    <Card variant="outline" borderColor="orange.200">
                      <CardBody>
                        <Stat>
                          <StatLabel color="orange.600">Total Cost</StatLabel>
                          <StatNumber color="orange.700">₹{smsStats.cost.toFixed(2)}</StatNumber>
                          <StatHelpText color="gray.500">
                            ₹{(smsStats.cost / smsStats.total).toFixed(2)} per SMS
                          </StatHelpText>
                        </Stat>
                      </CardBody>
                    </Card>
                  </SimpleGrid>

                  {/* SMS Messages List */}
                  <Card variant="outline">
                    <CardHeader>
                      <HStack justify="space-between">
                        <Text fontSize="lg" fontWeight="bold" color="blue.700">
                          Recent SMS Messages
                        </Text>
                        <HStack>
                          <InputGroup maxW="300px">
                            <InputLeftElement>
                              <Search size={16} color="gray.400" />
                            </InputLeftElement>
                            <Input
                              placeholder="Search messages..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              size="sm"
                            />
                          </InputGroup>
                          <Select 
                            size="sm" 
                            value={typeFilter} 
                            onChange={(e) => setTypeFilter(e.target.value)}
                            maxW="150px"
                          >
                            <option value="all">All Types</option>
                            <option value="appointment_reminder">Appointments</option>
                            <option value="lab_report">Lab Reports</option>
                            <option value="medicine_reminder">Medicine</option>
                            <option value="payment_confirmation">Payments</option>
                          </Select>
                        </HStack>
                      </HStack>
                    </CardHeader>
                    <CardBody p={0}>
                      <TableContainer>
                        <Table variant="simple" size="sm">
                          <Thead bg="blue.50">
                            <Tr>
                              <Th>Recipient</Th>
                              <Th>Message</Th>
                              <Th>Type</Th>
                              <Th>Status</Th>
                              <Th>Time</Th>
                              <Th>Cost</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {mockSMSMessages
                              .filter(msg => 
                                (typeFilter === 'all' || msg.type === typeFilter) &&
                                (msg.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 msg.message.toLowerCase().includes(searchTerm.toLowerCase()))
                              )
                              .map((message) => {
                                const StatusIcon = getStatusIcon(message.status);
                                return (
                                  <Tr key={message.id} _hover={{ bg: "blue.25" }}>
                                    <Td>
                                      <VStack align="start" spacing={0}>
                                        <Text fontWeight="medium" fontSize="sm">
                                          {message.recipient.split(' (')[0]}
                                        </Text>
                                        <Text fontSize="xs" color="gray.500">
                                          {message.recipient.split(' (')[1]?.replace(')', '')}
                                        </Text>
                                      </VStack>
                                    </Td>
                                    <Td maxW="300px">
                                      <Text fontSize="sm" noOfLines={2}>
                                        {message.message}
                                      </Text>
                                    </Td>
                                    <Td>
                                      <Badge colorScheme="blue" size="sm">
                                        {message.template}
                                      </Badge>
                                    </Td>
                                    <Td>
                                      <HStack spacing={2}>
                                        <Icon 
                                          as={StatusIcon} 
                                          color={`${getStatusColor(message.status)}.500`}
                                          boxSize={4}
                                        />
                                        <Badge 
                                          colorScheme={getStatusColor(message.status)} 
                                          size="sm"
                                          textTransform="capitalize"
                                        >
                                          {message.status}
                                        </Badge>
                                      </HStack>
                                    </Td>
                                    <Td>
                                      <Text fontSize="xs" color="gray.600">
                                        {formatTimestamp(message.timestamp)}
                                      </Text>
                                    </Td>
                                    <Td>
                                      <Text fontSize="sm" fontWeight="medium" color="orange.600">
                                        {message.cost}
                                      </Text>
                                    </Td>
                                  </Tr>
                                );
                              })}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </CardBody>
                  </Card>
                </VStack>
              </TabPanel>

              {/* WhatsApp Messages Tab */}
              <TabPanel p={6}>
                <VStack spacing={6} align="stretch">
                  {/* WhatsApp Statistics */}
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                    <Card variant="outline" borderColor="green.200">
                      <CardBody>
                        <Stat>
                          <StatLabel color="green.600">Total WhatsApp Sent</StatLabel>
                          <StatNumber color="green.700">{whatsappStats.total}</StatNumber>
                          <StatHelpText color="green.500">
                            <Icon as={TrendingUp} /> +18% from last week
                          </StatHelpText>
                        </Stat>
                      </CardBody>
                    </Card>
                    
                    <Card variant="outline" borderColor="purple.200">
                      <CardBody>
                        <Stat>
                          <StatLabel color="purple.600">Read Rate</StatLabel>
                          <StatNumber color="purple.700">
                            {((whatsappStats.read / whatsappStats.total) * 100).toFixed(1)}%
                          </StatNumber>
                          <StatHelpText color="purple.500">
                            {whatsappStats.read} messages read
                          </StatHelpText>
                        </Stat>
                      </CardBody>
                    </Card>
                    
                    <Card variant="outline" borderColor="blue.200">
                      <CardBody>
                        <Stat>
                          <StatLabel color="blue.600">Media Messages</StatLabel>
                          <StatNumber color="blue.700">{whatsappStats.withMedia}</StatNumber>
                          <StatHelpText color="gray.500">
                            {((whatsappStats.withMedia / whatsappStats.total) * 100).toFixed(1)}% with attachments
                          </StatHelpText>
                        </Stat>
                      </CardBody>
                    </Card>
                  </SimpleGrid>

                  {/* WhatsApp Messages List */}
                  <Card variant="outline">
                    <CardHeader>
                      <HStack justify="space-between">
                        <Text fontSize="lg" fontWeight="bold" color="green.700">
                          Recent WhatsApp Messages
                        </Text>
                        <HStack>
                          <InputGroup maxW="300px">
                            <InputLeftElement>
                              <Search size={16} color="gray.400" />
                            </InputLeftElement>
                            <Input
                              placeholder="Search messages..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              size="sm"
                            />
                          </InputGroup>
                          <Select 
                            size="sm" 
                            value={typeFilter} 
                            onChange={(e) => setTypeFilter(e.target.value)}
                            maxW="150px"
                          >
                            <option value="all">All Types</option>
                            <option value="treatment_schedule">Treatment</option>
                            <option value="diet_plan">Diet Plans</option>
                            <option value="lab_results">Lab Results</option>
                            <option value="payment_receipt">Payments</option>
                          </Select>
                        </HStack>
                      </HStack>
                    </CardHeader>
                    <CardBody p={0}>
                      <TableContainer>
                        <Table variant="simple" size="sm">
                          <Thead bg="green.50">
                            <Tr>
                              <Th>Recipient</Th>
                              <Th>Message Preview</Th>
                              <Th>Type</Th>
                              <Th>Status</Th>
                              <Th>Time</Th>
                              <Th>Media</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {mockWhatsAppMessages
                              .filter(msg => 
                                (typeFilter === 'all' || msg.type === typeFilter) &&
                                (msg.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 msg.message.toLowerCase().includes(searchTerm.toLowerCase()))
                              )
                              .map((message) => {
                                const StatusIcon = getStatusIcon(message.status);
                                return (
                                  <Tr key={message.id} _hover={{ bg: "green.25" }}>
                                    <Td>
                                      <VStack align="start" spacing={0}>
                                        <Text fontWeight="medium" fontSize="sm">
                                          {message.recipient.split(' (')[0]}
                                        </Text>
                                        <Text fontSize="xs" color="gray.500">
                                          {message.recipient.split(' (')[1]?.replace(')', '')}
                                        </Text>
                                      </VStack>
                                    </Td>
                                    <Td maxW="350px">
                                      <Text fontSize="sm" noOfLines={3} fontFamily="mono">
                                        {message.message}
                                      </Text>
                                    </Td>
                                    <Td>
                                      <Badge colorScheme="green" size="sm">
                                        {message.template}
                                      </Badge>
                                    </Td>
                                    <Td>
                                      <HStack spacing={2}>
                                        <Icon 
                                          as={StatusIcon} 
                                          color={`${getStatusColor(message.status)}.500`}
                                          boxSize={4}
                                        />
                                        <Badge 
                                          colorScheme={getStatusColor(message.status)} 
                                          size="sm"
                                          textTransform="capitalize"
                                        >
                                          {message.status}
                                        </Badge>
                                      </HStack>
                                    </Td>
                                    <Td>
                                      <Text fontSize="xs" color="gray.600">
                                        {formatTimestamp(message.timestamp)}
                                      </Text>
                                    </Td>
                                    <Td>
                                      {message.hasMedia ? (
                                        <Badge colorScheme="blue" size="sm">
                                          <HStack spacing={1}>
                                            <Icon as={Paperclip} boxSize={3} />
                                            <Text>Media</Text>
                                          </HStack>
                                        </Badge>
                                      ) : (
                                        <Text fontSize="xs" color="gray.400">Text only</Text>
                                      )}
                                    </Td>
                                  </Tr>
                                );
                              })}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </CardBody>
                  </Card>
                </VStack>
              </TabPanel>

              {/* Analytics Tab */}
              <TabPanel p={6}>
                <VStack spacing={6} align="stretch">
                  <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                    {/* Campaign Overview */}
                    <Card variant="outline">
                      <CardHeader>
                        <Text fontSize="lg" fontWeight="bold" color="purple.700">
                          Recent Campaigns
                        </Text>
                      </CardHeader>
                      <CardBody>
                        <VStack spacing={4} align="stretch">
                          {mockCampaigns.map((campaign) => (
                            <Box 
                              key={campaign.id}
                              p={4}
                              border="1px solid"
                              borderColor="gray.200"
                              borderRadius="lg"
                              _hover={{ shadow: "md", transform: "translateY(-2px)" }}
                              transition="all 0.3s"
                            >
                              <HStack justify="space-between" mb={2}>
                                <VStack align="start" spacing={0}>
                                  <Text fontWeight="bold" color="gray.700">
                                    {campaign.name}
                                  </Text>
                                  <HStack spacing={2}>
                                    <Badge 
                                      colorScheme={campaign.type === 'sms' ? 'blue' : 'green'}
                                      size="sm"
                                    >
                                      {campaign.type.toUpperCase()}
                                    </Badge>
                                    <Badge 
                                      colorScheme={campaign.status === 'completed' ? 'green' : 'orange'}
                                      size="sm"
                                    >
                                      {campaign.status.replace('_', ' ').toUpperCase()}
                                    </Badge>
                                  </HStack>
                                </VStack>
                                <VStack align="end" spacing={0}>
                                  <Text fontSize="lg" fontWeight="bold" color="purple.600">
                                    {campaign.delivered}/{campaign.recipients}
                                  </Text>
                                  <Text fontSize="xs" color="gray.500">
                                    Delivered
                                  </Text>
                                </VStack>
                              </HStack>
                              <Progress 
                                value={(campaign.delivered / campaign.recipients) * 100}
                                colorScheme={campaign.type === 'sms' ? 'blue' : 'green'}
                                size="sm"
                                borderRadius="full"
                              />
                              <HStack justify="space-between" mt={2}>
                                <Text fontSize="xs" color="gray.500">
                                  {formatTimestamp(campaign.date)}
                                </Text>
                                <Text fontSize="xs" color="orange.600" fontWeight="medium">
                                  {campaign.cost}
                                </Text>
                              </HStack>
                            </Box>
                          ))}
                        </VStack>
                      </CardBody>
                    </Card>

                    {/* Templates Usage */}
                    <Card variant="outline">
                      <CardHeader>
                        <Text fontSize="lg" fontWeight="bold" color="purple.700">
                          Template Usage
                        </Text>
                      </CardHeader>
                      <CardBody>
                        <VStack spacing={4} align="stretch">
                          <Box>
                            <Text fontSize="md" fontWeight="semibold" color="blue.600" mb={2}>
                              SMS Templates
                            </Text>
                            {smsTemplates.map((template) => (
                              <HStack key={template.id} justify="space-between" py={2}>
                                <VStack align="start" spacing={0}>
                                  <Text fontSize="sm" fontWeight="medium">
                                    {template.name}
                                  </Text>
                                  <Text fontSize="xs" color="gray.500">
                                    {template.category}
                                  </Text>
                                </VStack>
                                <Badge colorScheme="blue" size="sm">
                                  {template.usage} uses
                                </Badge>
                              </HStack>
                            ))}
                          </Box>
                          
                          <Divider />
                          
                          <Box>
                            <Text fontSize="md" fontWeight="semibold" color="green.600" mb={2}>
                              WhatsApp Templates
                            </Text>
                            {whatsappTemplates.map((template) => (
                              <HStack key={template.id} justify="space-between" py={2}>
                                <VStack align="start" spacing={0}>
                                  <Text fontSize="sm" fontWeight="medium">
                                    {template.name}
                                  </Text>
                                  <Text fontSize="xs" color="gray.500">
                                    {template.category}
                                  </Text>
                                </VStack>
                                <Badge colorScheme="green" size="sm">
                                  {template.usage} uses
                                </Badge>
                              </HStack>
                            ))}
                          </Box>
                        </VStack>
                      </CardBody>
                    </Card>
                  </SimpleGrid>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CardBody>
      </Card>
    </Box>
  );
};

export default Messaging;
        
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <HStack>
              <Box p={3} bg="red.100" borderRadius="lg">
                <Mail size={20} color="red" />
              </Box>
              <VStack align="start" spacing={0}>
                <Text fontSize="2xl" fontWeight="bold" color="red.600">
                  {unreadMessages}
                </Text>
                <Text fontSize="sm" color="gray.600">Unread Messages</Text>
              </VStack>
            </HStack>
          </CardBody>
        </Card>
        
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <HStack>
              <Box p={3} bg="orange.100" borderRadius="lg">
                <AlertCircle size={20} color="orange" />
              </Box>
              <VStack align="start" spacing={0}>
                <Text fontSize="2xl" fontWeight="bold" color="orange.600">
                  {highPriorityMessages}
                </Text>
                <Text fontSize="sm" color="gray.600">High Priority</Text>
              </VStack>
            </HStack>
          </CardBody>
        </Card>
        
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <HStack>
              <Box p={3} bg="green.100" borderRadius="lg">
                <Users size={20} color="green" />
              </Box>
              <VStack align="start" spacing={0}>
                <Text fontSize="2xl" fontWeight="bold" color="green.600">
                  {mockContacts.filter(c => c.status === 'online').length}
                </Text>
                <Text fontSize="sm" color="gray.600">Online Staff</Text>
              </VStack>
            </HStack>
          </CardBody>
        </Card>
      </Grid>

      <Grid templateColumns={{ base: '1fr', lg: '1fr 300px' }} gap={6}>
        {/* Messages List */}
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <Tabs variant="soft-rounded" colorScheme="blue">
              <TabList mb={4}>
                <Tab>Inbox</Tab>
                <Tab>Sent</Tab>
                <Tab>Drafts</Tab>
                <Tab>Archived</Tab>
              </TabList>
              
              <TabPanels>
                <TabPanel p={0}>
                  {/* Filters */}
                  <Flex gap={4} direction={{ base: 'column', md: 'row' }} mb={4}>
                    <HStack flex={1}>
                      <Search size={16} color="gray.400" />
                      <Input
                        placeholder="Search messages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        variant="unstyled"
                        size="sm"
                      />
                    </HStack>
                    
                    <Select
                      size="sm"
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      w={{ base: 'full', md: '150px' }}
                    >
                      <option value="all">All Types</option>
                      <option value="internal">Internal</option>
                      <option value="patient">Patient</option>
                      <option value="system">System</option>
                    </Select>
                    
                    <Select
                      size="sm"
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      w={{ base: 'full', md: '120px' }}
                    >
                      <option value="all">All Priority</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </Select>
                  </Flex>

                  {/* Messages List */}
                  <VStack spacing={2} align="stretch">
                    {filteredMessages.map((message) => (
                      <Box
                        key={message.id}
                        p={4}
                        borderRadius="lg"
                        border="1px"
                        borderColor={message.status === 'unread' ? 'blue.200' : 'gray.200'}
                        bg={message.status === 'unread' ? 'blue.50' : 'gray.50'}
                        cursor="pointer"
                        _hover={{ bg: 'gray.100' }}
                        onClick={() => setSelectedMessage(message)}
                      >
                        <Flex justify="space-between" align="start">
                          <HStack spacing={3} flex={1}>
                            <Avatar size="sm" src={message.avatar} name={message.sender} />
                            <VStack align="start" spacing={1} flex={1}>
                              <HStack spacing={2}>
                                <Text fontWeight={message.status === 'unread' ? 'bold' : 'medium'} fontSize="sm">
                                  {message.sender}
                                </Text>
                                <Badge colorScheme={getTypeColor(message.type)} size="sm" variant="subtle">
                                  {message.type}
                                </Badge>
                                <Badge colorScheme={getPriorityColor(message.priority)} size="sm" variant="outline">
                                  {message.priority}
                                </Badge>
                              </HStack>
                              <Text fontWeight={message.status === 'unread' ? 'semibold' : 'normal'} fontSize="sm" noOfLines={1}>
                                {message.subject}
                              </Text>
                              <Text fontSize="xs" color="gray.600" noOfLines={2}>
                                {message.preview}
                              </Text>
                              <HStack fontSize="xs" color="gray.500">
                                <Clock size={10} />
                                <Text>{formatTime(message.timestamp)}</Text>
                                {message.hasAttachment && (
                                  <>
                                    <Paperclip size={10} />
                                    <Text>Attachment</Text>
                                  </>
                                )}
                                {message.thread > 1 && (
                                  <>
                                    <MessageSquare size={10} />
                                    <Text>{message.thread} replies</Text>
                                  </>
                                )}
                              </HStack>
                            </VStack>
                          </HStack>
                          
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              icon={<MoreVertical />}
                              variant="ghost"
                              size="sm"
                            />
                            <MenuList>
                              <MenuItem icon={<Eye size={16} />}>
                                Mark as Read
                              </MenuItem>
                              <MenuItem icon={<Star size={16} />}>
                                Star Message
                              </MenuItem>
                              <MenuItem icon={<Archive size={16} />}>
                                Archive
                              </MenuItem>
                              <MenuItem icon={<Trash2 size={16} />} color="red.500">
                                Delete
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </Flex>
                      </Box>
                    ))}
                  </VStack>
                </TabPanel>
                
                <TabPanel p={0}>
                  <Text textAlign="center" color="gray.500" py={8}>
                    Sent messages will appear here
                  </Text>
                </TabPanel>
                
                <TabPanel p={0}>
                  <Text textAlign="center" color="gray.500" py={8}>
                    Draft messages will appear here
                  </Text>
                </TabPanel>
                
                <TabPanel p={0}>
                  <Text textAlign="center" color="gray.500" py={8}>
                    Archived messages will appear here
                  </Text>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>

        {/* Sidebar */}
        <VStack spacing={6} align="stretch">
          {/* Online Staff */}
          <Card bg={cardBg} border="1px" borderColor={borderColor}>
            <CardBody>
              <Text fontSize="md" fontWeight="semibold" mb={4}>Online Staff</Text>
              <VStack spacing={3} align="stretch">
                {mockContacts.map((contact) => (
                  <HStack key={contact.id}>
                    <Box position="relative">
                      <Avatar size="sm" src={contact.avatar} name={contact.name} />
                      <Box
                        position="absolute"
                        bottom={0}
                        right={0}
                        w={3}
                        h={3}
                        borderRadius="full"
                        bg={getStatusColor(contact.status) + '.500'}
                        border="2px solid white"
                      />
                    </Box>
                    <VStack align="start" spacing={0} flex={1}>
                      <Text fontSize="sm" fontWeight="medium">{contact.name}</Text>
                      <Text fontSize="xs" color="gray.500">{contact.role}</Text>
                    </VStack>
                    <HStack>
                      <IconButton icon={<MessageSquare />} size="sm" variant="ghost" />
                      <IconButton icon={<Video />} size="sm" variant="ghost" />
                    </HStack>
                  </HStack>
                ))}
              </VStack>
            </CardBody>
          </Card>

          {/* Recent Notifications */}
          <Card bg={cardBg} border="1px" borderColor={borderColor}>
            <CardBody>
              <Text fontSize="md" fontWeight="semibold" mb={4}>Recent Notifications</Text>
              <VStack spacing={3} align="stretch">
                {mockNotifications.slice(0, 4).map((notification) => (
                  <Box key={notification.id} p={3} borderRadius="md" bg={notification.read ? 'gray.50' : 'blue.50'}>
                    <HStack align="start">
                      <Box
                        p={1}
                        borderRadius="full"
                        bg={notification.read ? 'gray.100' : 'blue.100'}
                      >
                        <Bell size={12} color={notification.read ? 'gray' : 'blue'} />
                      </Box>
                      <VStack align="start" spacing={1} flex={1}>
                        <Text fontSize="sm" fontWeight={notification.read ? 'normal' : 'semibold'}>
                          {notification.title}
                        </Text>
                        <Text fontSize="xs" color="gray.600" noOfLines={2}>
                          {notification.message}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {formatTime(notification.timestamp)}
                        </Text>
                      </VStack>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Grid>

      {/* Compose Message Modal */}
      <Modal isOpen={isComposeOpen} onClose={onComposeClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Compose New Message</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>To</FormLabel>
                <Select placeholder="Select recipient">
                  <option value="all-doctors">All Doctors</option>
                  <option value="all-nurses">All Nurses</option>
                  <option value="all-staff">All Staff</option>
                  <option value="admin">Admin Team</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Subject</FormLabel>
                <Input placeholder="Message subject" />
              </FormControl>
              
              <FormControl>
                <FormLabel>Priority</FormLabel>
                <Select defaultValue="medium">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Message</FormLabel>
                <Textarea 
                  placeholder="Type your message here..."
                  rows={6}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
              </FormControl>
              
              <HStack>
                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="email-notification" mb="0">
                    Send email notification
                  </FormLabel>
                  <Switch id="email-notification" />
                </FormControl>
                
                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="sms-notification" mb="0">
                    Send SMS notification
                  </FormLabel>
                  <Switch id="sms-notification" />
                </FormControl>
              </HStack>
            </VStack>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onComposeClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" leftIcon={<Send />}>
              Send Message
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Messaging;
