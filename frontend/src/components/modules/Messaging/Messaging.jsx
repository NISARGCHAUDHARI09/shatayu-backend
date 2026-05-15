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
  Divider
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
  Trash2
} from 'lucide-react';

// Mock messaging data
const mockMessages = [
  {
    id: 'MSG001',
    sender: 'Dr. Priya Sharma',
    avatar: '/api/placeholder/32/32',
    recipient: 'Nursing Team',
    subject: 'Patient Care Instructions - Room 201',
    preview: 'Please monitor Mr. Kumar\'s vitals every 2 hours and ensure...',
    timestamp: '2024-12-15 14:30',
    status: 'read',
    priority: 'high',
    type: 'internal',
    hasAttachment: true,
    thread: 5
  },
  {
    id: 'MSG002',
    sender: 'Reception',
    avatar: '/api/placeholder/32/32',
    recipient: 'All Doctors',
    subject: 'Appointment Cancellation - Emergency',
    preview: 'Mrs. Patel has canceled her 3 PM appointment due to...',
    timestamp: '2024-12-15 13:45',
    status: 'unread',
    priority: 'medium',
    type: 'internal',
    hasAttachment: false,
    thread: 1
  },
  {
    id: 'MSG003',
    sender: 'System',
    avatar: '/api/placeholder/32/32',
    recipient: 'Admin Team',
    subject: 'Inventory Alert - Low Stock',
    preview: 'The following items are running low in stock: Ayurvedic...',
    timestamp: '2024-12-15 12:15',
    status: 'read',
    priority: 'medium',
    type: 'system',
    hasAttachment: false,
    thread: 1
  },
  {
    id: 'MSG004',
    sender: 'Ravi Kumar',
    avatar: '/api/placeholder/32/32',
    recipient: 'Dr. Anjali Nair',
    subject: 'Consultation Follow-up Query',
    preview: 'Doctor, I have a question about the prescribed Ayurvedic...',
    timestamp: '2024-12-15 11:30',
    status: 'unread',
    priority: 'low',
    type: 'patient',
    hasAttachment: false,
    thread: 3
  },
  {
    id: 'MSG005',
    sender: 'Pharmacy',
    avatar: '/api/placeholder/32/32',
    recipient: 'All Staff',
    subject: 'New Ayurvedic Medicines Arrived',
    preview: 'We have received a fresh batch of premium Ayurvedic...',
    timestamp: '2024-12-15 10:00',
    status: 'read',
    priority: 'low',
    type: 'internal',
    hasAttachment: true,
    thread: 2
  }
];

const mockNotifications = [
  {
    id: 'NOT001',
    title: 'Appointment Reminder',
    message: 'Patient Mrs. Gupta has an appointment in 30 minutes',
    timestamp: '2024-12-15 14:45',
    type: 'appointment',
    read: false
  },
  {
    id: 'NOT002',
    title: 'Lab Results Ready',
    message: 'Prakriti analysis results for Patient ID: P001 are ready',
    timestamp: '2024-12-15 14:20',
    type: 'lab',
    read: false
  },
  {
    id: 'NOT003',
    title: 'Medicine Expired',
    message: 'Batch #MED001 Triphala tablets expired today',
    timestamp: '2024-12-15 09:00',
    type: 'inventory',
    read: true
  },
  {
    id: 'NOT004',
    title: 'Payment Received',
    message: '₹2,500 payment received from Patient ID: P025',
    timestamp: '2024-12-15 08:30',
    type: 'payment',
    read: true
  }
];

const mockContacts = [
  { id: 1, name: 'Dr. Priya Sharma', role: 'Ayurvedic Physician', status: 'online', avatar: '/api/placeholder/40/40' },
  { id: 2, name: 'Dr. Anjali Nair', role: 'Panchakarma Specialist', status: 'away', avatar: '/api/placeholder/40/40' },
  { id: 3, name: 'Ravi Kumar', role: 'Head Nurse', status: 'online', avatar: '/api/placeholder/40/40' },
  { id: 4, name: 'Meera Patel', role: 'Receptionist', status: 'offline', avatar: '/api/placeholder/40/40' },
  { id: 5, name: 'Dr. Vikram Singh', role: 'Consultant', status: 'busy', avatar: '/api/placeholder/40/40' }
];

const Messaging = ({ title = "Messaging Center", showAddButton = true }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messageText, setMessageText] = useState('');
  
  const { isOpen: isComposeOpen, onOpen: onComposeOpen, onClose: onComposeClose } = useDisclosure();
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Filter messages
  const filteredMessages = mockMessages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.preview.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || message.type === typeFilter;
    const matchesPriority = priorityFilter === 'all' || message.priority === priorityFilter;
    return matchesSearch && matchesType && matchesPriority;
  });

  // Calculate statistics
  const totalMessages = mockMessages.length;
  const unreadMessages = mockMessages.filter(m => m.status === 'unread').length;
  const highPriorityMessages = mockMessages.filter(m => m.priority === 'high').length;
  const unreadNotifications = mockNotifications.filter(n => !n.read).length;

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'red';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'patient': return 'blue';
      case 'internal': return 'purple';
      case 'system': return 'orange';
      default: return 'gray';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'online': return 'green';
      case 'away': return 'yellow';
      case 'busy': return 'red';
      case 'offline': return 'gray';
      default: return 'gray';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
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
            Internal communication and patient messaging system
          </Text>
        </Box>
        {showAddButton && (
          <HStack>
            <Button leftIcon={<Bell />} variant="outline">
              Notifications ({unreadNotifications})
            </Button>
            <Button colorScheme="blue" leftIcon={<Plus />} onClick={onComposeOpen}>
              Compose Message
            </Button>
          </HStack>
        )}
      </Flex>

      {/* Statistics Cards */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={6} mb={6}>
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <HStack>
              <Box p={3} bg="blue.100" borderRadius="lg">
                <MessageSquare size={20} color="blue" />
              </Box>
              <VStack align="start" spacing={0}>
                <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                  {totalMessages}
                </Text>
                <Text fontSize="sm" color="gray.600">Total Messages</Text>
              </VStack>
            </HStack>
          </CardBody>
        </Card>
        
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
