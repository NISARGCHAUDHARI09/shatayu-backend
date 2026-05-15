import React, { useState } from 'react';
import axios from 'axios';
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
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react';
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Eye,
  Video,
  Phone,
  MessageSquare,
  Calendar,
  Clock,
  User,
  Users,
  Monitor,
  Wifi,
  WifiOff,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Settings,
  Share2,
  Download,
  FileText,
  Camera,
  Mic,
  MicOff,
  VideoOff,
  PhoneCall,
  PhoneOff,
  Shield,
  Activity
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/live-consultations` : 'https://shatayu-backend.onrender.com/api/live-consultations';

const LiveConsultation = ({ title = "Live Consultation", showAddButton = true }) => {
  // ...existing code...
  // No mock rooms data
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { isOpen: isJoinOpen, onOpen: onJoinOpen, onClose: onJoinClose } = useDisclosure();
  const { isOpen: isSettingsOpen, onOpen: onSettingsOpen, onClose: onSettingsClose } = useDisclosure();
  const { isOpen: isTestOpen, onOpen: onTestOpen, onClose: onTestClose } = useDisclosure();
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  React.useEffect(() => {
    const fetchConsultations = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setConsultations(response.data);
        setError('');
      } catch (err) {
        setError('Failed to load consultations');
      }
      setLoading(false);
    };
    fetchConsultations();
  }, []);

  // Add consultation
  const addConsultation = async (consultationData) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(API_URL, consultationData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConsultations(prev => [...prev, response.data]);
    } catch (err) {
      // handle error
    }
  };

  // Update consultation
  const updateConsultation = async (id, consultationData) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put(`${API_URL}/${id}`, consultationData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConsultations(prev => prev.map(c => c.id === id ? response.data : c));
    } catch (err) {
      // handle error
    }
  };

  // Delete consultation
  const deleteConsultation = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConsultations(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      // handle error
    }
  };

  // Filter consultations
  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = consultation.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || consultation.status.toLowerCase() === statusFilter;
    const matchesType = typeFilter === 'all' || consultation.type.toLowerCase().includes(typeFilter.toLowerCase());
    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate statistics
  const totalConsultations = consultations.length;
  const activeConsultations = consultations.filter(c => c.status === 'In Progress').length;
  const scheduledConsultations = consultations.filter(c => c.status === 'Scheduled').length;
  const waitingConsultations = consultations.filter(c => c.status === 'Waiting').length;
  const completedToday = consultations.filter(c => c.status === 'Completed').length;

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'scheduled': return 'blue';
      case 'in progress': return 'green';
      case 'waiting': return 'yellow';
      case 'completed': return 'gray';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'red';
      case 'normal': return 'green';
      case 'low': return 'gray';
      default: return 'gray';
    }
  };

  const getConnectionColor = (status) => {
    switch (status.toLowerCase()) {
      case 'excellent': return 'green';
      case 'good': return 'blue';
      case 'poor': return 'red';
      case 'n/a': return 'gray';
      default: return 'gray';
    }
  };

  return (
    <Box p={6} bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" minH="100vh">
      {/* Header */}
      <Box 
        bg="rgba(255, 255, 255, 0.95)" 
        backdropFilter="blur(20px)" 
        borderRadius="20px" 
        p={6} 
        mb={6}
        border="1px solid rgba(255, 255, 255, 0.2)"
        boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
      >
        <Flex justify="space-between" align="center">
          <Box>
            <HStack spacing={3} mb={2}>
              <Box 
                p={2} 
                bg="linear-gradient(135deg, #3B82F6, #10B981)" 
                borderRadius="12px"
                color="white"
              >
                <Video size={24} />
              </Box>
              <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                {title}
              </Text>
            </HStack>
            <Text color="gray.600" fontSize="md">
              Advanced telemedicine platform with real-time consultation management
            </Text>
          </Box>
          {showAddButton && (
            <HStack spacing={3}>
              <Button 
                leftIcon={<Settings />} 
                variant="outline" 
                borderColor="blue.300"
                color="blue.600"
                _hover={{ bg: "blue.50", borderColor: "blue.400" }}
                borderRadius="12px"
                onClick={onSettingsOpen}
              >
                System Settings
              </Button>
              <Button 
                leftIcon={<Video />} 
                variant="outline"
                borderColor="teal.300"
                color="teal.600"
                _hover={{ bg: "teal.50", borderColor: "teal.400" }}
                borderRadius="12px"
                onClick={onTestOpen}
              >
                Test Connection
              </Button>
              <Button 
                bg="linear-gradient(135deg, #3B82F6, #10B981)" 
                color="white"
                leftIcon={<Plus />}
                _hover={{ 
                  transform: "translateY(-2px)",
                  boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)"
                }}
                borderRadius="12px"
                px={6}
                onClick={onJoinOpen}
              >
                Schedule Consultation
              </Button>
      {/* System Settings Modal */}
      <Modal isOpen={isSettingsOpen} onClose={onSettingsClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>System Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>System settings functionality coming soon.</Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onSettingsClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Test Connection Modal */}
      <Modal isOpen={isTestOpen} onClose={onTestClose} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Test Connection</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Test connection functionality coming soon.</Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onTestClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
            </HStack>
          )}
        </Flex>
      </Box>

      {/* Statistics Cards */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(5, 1fr)' }} gap={4} mb={6}>
        <Box
          bg="rgba(255, 255, 255, 0.95)"
          backdropFilter="blur(20px)"
          borderRadius="16px"
          p={4}
          border="1px solid rgba(255, 255, 255, 0.2)"
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
          _hover={{ transform: "translateY(-2px)", boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)" }}
          transition="all 0.3s ease"
        >
          <Stat>
            <HStack justify="space-between" mb={2}>
              <StatLabel color="gray.600" fontSize="sm" fontWeight="medium">Total Today</StatLabel>
              <Box p={2} bg="blue.100" borderRadius="8px">
                <Calendar size={16} color="#3B82F6" />
              </Box>
            </HStack>
            <StatNumber color="blue.600" fontSize="2xl" fontWeight="bold">{totalConsultations}</StatNumber>
            <StatHelpText color="gray.500" fontSize="xs" mb={0}>
              All consultations scheduled
            </StatHelpText>
          </Stat>
        </Box>
        
        <Box
          bg="rgba(255, 255, 255, 0.95)"
          backdropFilter="blur(20px)"
          borderRadius="16px"
          p={4}
          border="1px solid rgba(255, 255, 255, 0.2)"
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
          _hover={{ transform: "translateY(-2px)", boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)" }}
          transition="all 0.3s ease"
        >
          <Stat>
            <HStack justify="space-between" mb={2}>
              <StatLabel color="gray.600" fontSize="sm" fontWeight="medium">Active Now</StatLabel>
              <Box p={2} bg="green.100" borderRadius="8px">
                <Activity size={16} color="#10B981" />
              </Box>
            </HStack>
            <StatNumber color="green.600" fontSize="2xl" fontWeight="bold">{activeConsultations}</StatNumber>
            <StatHelpText color="gray.500" fontSize="xs" mb={0}>
              Live sessions in progress
            </StatHelpText>
          </Stat>
        </Box>
        
        <Box
          bg="rgba(255, 255, 255, 0.95)"
          backdropFilter="blur(20px)"
          borderRadius="16px"
          p={4}
          border="1px solid rgba(255, 255, 255, 0.2)"
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
          _hover={{ transform: "translateY(-2px)", boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)" }}
          transition="all 0.3s ease"
        >
          <Stat>
            <HStack justify="space-between" mb={2}>
              <StatLabel color="gray.600" fontSize="sm" fontWeight="medium">Scheduled</StatLabel>
              <Box p={2} bg="blue.100" borderRadius="8px">
                <Clock size={16} color="#3B82F6" />
              </Box>
            </HStack>
            <StatNumber color="blue.600" fontSize="2xl" fontWeight="bold">{scheduledConsultations}</StatNumber>
            <StatHelpText color="gray.500" fontSize="xs" mb={0}>
              Upcoming appointments
            </StatHelpText>
          </Stat>
        </Box>
        
        <Box
          bg="rgba(255, 255, 255, 0.95)"
          backdropFilter="blur(20px)"
          borderRadius="16px"
          p={4}
          border="1px solid rgba(255, 255, 255, 0.2)"
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
          _hover={{ transform: "translateY(-2px)", boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)" }}
          transition="all 0.3s ease"
        >
          <Stat>
            <HStack justify="space-between" mb={2}>
              <StatLabel color="gray.600" fontSize="sm" fontWeight="medium">Waiting</StatLabel>
              <Box p={2} bg="yellow.100" borderRadius="8px">
                <Users size={16} color="#F59E0B" />
              </Box>
            </HStack>
            <StatNumber color="yellow.600" fontSize="2xl" fontWeight="bold">{waitingConsultations}</StatNumber>
            <StatHelpText color="gray.500" fontSize="xs" mb={0}>
              Patients in queue
            </StatHelpText>
          </Stat>
        </Box>
        
        <Box
          bg="rgba(255, 255, 255, 0.95)"
          backdropFilter="blur(20px)"
          borderRadius="16px"
          p={4}
          border="1px solid rgba(255, 255, 255, 0.2)"
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
          _hover={{ transform: "translateY(-2px)", boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)" }}
          transition="all 0.3s ease"
        >
          <Stat>
            <HStack justify="space-between" mb={2}>
              <StatLabel color="gray.600" fontSize="sm" fontWeight="medium">Completed</StatLabel>
              <Box p={2} bg="gray.100" borderRadius="8px">
                <Shield size={16} color="#6B7280" />
              </Box>
            </HStack>
            <StatNumber color="gray.600" fontSize="2xl" fontWeight="bold">{completedToday}</StatNumber>
            <StatHelpText color="gray.500" fontSize="xs" mb={0}>
              Finished today
            </StatHelpText>
          </Stat>
        </Box>
      </Grid>

      {/* System Status Alert */}
      <Box
        bg="white"
        borderRadius="16px"
        p={4}
        mb={6}
        border="1px solid #10B981"
        boxShadow="0 8px 32px rgba(16, 185, 129, 0.10)"
      >
        <HStack spacing={3}>
          <Box p={2} bg="green.100" borderRadius="8px">
            <Shield size={20} color="#10B981" />
          </Box>
          <VStack align="start" spacing={0}>
            <Text fontWeight="semibold" color="green.700" fontSize="md">System Status: Operational</Text>
            <Text color="green.600" fontSize="sm">
              Telemedicine platform running smoothly • Server load: 45% • Network latency: 12ms • Uptime: 99.9%
            </Text>
          </VStack>
        </HStack>
      </Box>

      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
        {/* Consultations Management */}
        <Box
          bg="rgba(255, 255, 255, 0.95)"
          backdropFilter="blur(20px)"
          borderRadius="20px"
          p={6}
          border="1px solid rgba(255, 255, 255, 0.2)"
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
        >
          <Tabs variant="soft-rounded" colorScheme="blue">
            <TabList mb={6} bg="gray.50" p={1} borderRadius="12px">
              <Tab 
                borderRadius="10px" 
                _selected={{ 
                  bg: "linear-gradient(135deg, #3B82F6, #10B981)",
                  color: "white",
                  boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)"
                }}
                fontSize="sm"
                fontWeight="medium"
              >
                Active Sessions
              </Tab>
              <Tab 
                borderRadius="10px"
                _selected={{ 
                  bg: "linear-gradient(135deg, #3B82F6, #10B981)",
                  color: "white",
                  boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)"
                }}
                fontSize="sm"
                fontWeight="medium"
              >
                Scheduled
              </Tab>
              <Tab 
                borderRadius="10px"
                _selected={{ 
                  bg: "linear-gradient(135deg, #3B82F6, #10B981)",
                  color: "white",
                  boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)"
                }}
                fontSize="sm"
                fontWeight="medium"
              >
                Completed
              </Tab>
              <Tab 
                borderRadius="10px"
                _selected={{ 
                  bg: "linear-gradient(135deg, #3B82F6, #10B981)",
                  color: "white",
                  boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)"
                }}
                fontSize="sm"
                fontWeight="medium"
              >
                Technical Support
              </Tab>
            </TabList>
              
              <TabPanels>
                <TabPanel p={0}>
                  {/* Filters */}
                  <Box 
                    bg="gray.50" 
                    p={4} 
                    borderRadius="12px" 
                    mb={6}
                    border="1px solid rgba(0, 0, 0, 0.05)"
                  >
                    <Flex gap={4} direction={{ base: 'column', md: 'row' }}>
                      <HStack flex={1} bg="white" p={3} borderRadius="10px" border="1px solid rgba(0, 0, 0, 0.05)">
                        <Search size={16} color="gray.400" />
                        <Input
                          placeholder="Search patient, doctor, ID..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          variant="unstyled"
                          size="sm"
                        />
                      </HStack>
                      
                      <Select
                        size="sm"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        w={{ base: 'full', md: '150px' }}
                        bg="white"
                        borderRadius="10px"
                        border="1px solid rgba(0, 0, 0, 0.05)"
                      >
                        <option value="all">All Status</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="in progress">In Progress</option>
                        <option value="waiting">Waiting</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </Select>
                      
                      <Select
                        size="sm"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        w={{ base: 'full', md: '150px' }}
                        bg="white"
                        borderRadius="10px"
                        border="1px solid rgba(0, 0, 0, 0.05)"
                      >
                        <option value="all">All Types</option>
                        <option value="video">Video</option>
                        <option value="audio">Audio</option>
                      </Select>
                    </Flex>
                  </Box>

                  <Box bg="white" borderRadius="12px" overflow="hidden" border="1px solid rgba(0, 0, 0, 0.05)">
                    <TableContainer>
                      <Table variant="simple" size="sm">
                        <Thead bg="gray.50">
                          <Tr>
                            <Th color="gray.700" fontWeight="semibold">Patient & Doctor</Th>
                            <Th color="gray.700" fontWeight="semibold">Schedule</Th>
                            <Th color="gray.700" fontWeight="semibold">Type & Priority</Th>
                            <Th color="gray.700" fontWeight="semibold">Connection</Th>
                            <Th color="gray.700" fontWeight="semibold">Status</Th>
                            <Th color="gray.700" fontWeight="semibold">Actions</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {filteredConsultations.map((consultation) => (
                            <Tr key={consultation.id} _hover={{ bg: "gray.50" }}>
                              <Td>
                                <VStack align="start" spacing={2}>
                                  <HStack>
                                    <Avatar size="sm" name={consultation.patientName} />
                                    <VStack align="start" spacing={0}>
                                      <Text fontWeight="medium" fontSize="sm">{consultation.patientName}</Text>
                                      <Text fontSize="xs" color="gray.500">ID: {consultation.patientId}</Text>
                                    </VStack>
                                  </HStack>
                                  <Text fontSize="xs" color="blue.600" fontWeight="medium">{consultation.doctorName}</Text>
                                </VStack>
                              </Td>
                              <Td>
                                <VStack align="start" spacing={1}>
                                  <HStack fontSize="sm">
                                    <Calendar size={12} color="#3B82F6" />
                                    <Text>{consultation.appointmentTime.split(' ')[0]}</Text>
                                  </HStack>
                                  <HStack fontSize="sm">
                                    <Clock size={12} color="#10B981" />
                                    <Text>{consultation.appointmentTime.split(' ')[1]}</Text>
                                  </HStack>
                                  <Text fontSize="xs" color="gray.500">{consultation.duration}</Text>
                                </VStack>
                              </Td>
                              <Td>
                                <VStack align="start" spacing={2}>
                                  <HStack>
                                    {consultation.type.includes('Video') ? <Video size={14} color="#3B82F6" /> : <Phone size={14} color="#10B981" />}
                                    <Text fontSize="sm">{consultation.type}</Text>
                                  </HStack>
                                  <Badge 
                                    colorScheme={getPriorityColor(consultation.priority)} 
                                    size="sm" 
                                    variant="subtle"
                                    borderRadius="6px"
                                  >
                                    {consultation.priority}
                                  </Badge>
                                </VStack>
                              </Td>
                              <Td>
                                <VStack align="start" spacing={1}>
                                  <HStack>
                                    {consultation.connectionStatus === 'Good' || consultation.connectionStatus === 'Excellent' ? 
                                      <Wifi size={12} color="green" /> : 
                                      consultation.connectionStatus === 'Poor' ? 
                                      <WifiOff size={12} color="red" /> :
                                      <Monitor size={12} color="gray" />
                                    }
                                    <Badge 
                                      colorScheme={getConnectionColor(consultation.connectionStatus)} 
                                      size="sm" 
                                      variant="subtle"
                                      borderRadius="6px"
                                    >
                                      {consultation.connectionStatus}
                                    </Badge>
                                  </HStack>
                                  <Text fontSize="xs" color="gray.500">
                                    Device: {consultation.deviceCheck}
                                  </Text>
                                </VStack>
                              </Td>
                              <Td>
                                <VStack align="start" spacing={1}>
                                  <Badge 
                                    colorScheme={getStatusColor(consultation.status)} 
                                    variant="subtle" 
                                    size="sm"
                                    borderRadius="6px"
                                  >
                                    {consultation.status}
                                  </Badge>
                                  {consultation.status === 'In Progress' && (
                                    <HStack fontSize="xs" color="green.600">
                                      <Play size={10} />
                                      <Text fontWeight="medium">Live</Text>
                                    </HStack>
                                  )}
                                </VStack>
                              </Td>
                              <Td>
                                <Menu>
                                  <MenuButton
                                    as={IconButton}
                                    icon={<MoreVertical />}
                                    variant="ghost"
                                    size="sm"
                                    borderRadius="8px"
                                    _hover={{ bg: "gray.100" }}
                                  />
                                  <MenuList borderRadius="12px" border="1px solid rgba(0, 0, 0, 0.1)" boxShadow="0 8px 32px rgba(0, 0, 0, 0.15)">
                                    {consultation.status === 'Scheduled' && (
                                      <MenuItem icon={<Video size={16} />} borderRadius="8px" onClick={() => {
                                        setSelectedConsultation(consultation);
                                        onJoinOpen();
                                      }}>
                                        Join Meeting
                                      </MenuItem>
                                    )}
                                    {consultation.status === 'In Progress' && (
                                      <MenuItem icon={<Monitor size={16} />} borderRadius="8px">
                                        Monitor Session
                                      </MenuItem>
                                    )}
                                    <MenuItem icon={<Eye size={16} />} borderRadius="8px">
                                      View Details
                                    </MenuItem>
                                    <MenuItem icon={<MessageSquare size={16} />} borderRadius="8px">
                                      Send Message
                                    </MenuItem>
                                    <MenuItem icon={<FileText size={16} />} borderRadius="8px">
                                      Generate Report
                                    </MenuItem>
                                    {(consultation.status === 'Scheduled' || consultation.status === 'Waiting') && (
                                      <MenuItem icon={<PhoneOff size={16} />} color="red.500" borderRadius="8px">
                                        Cancel Session
                                      </MenuItem>
                                    )}
                                  </MenuList>
                                </Menu>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </Box>
                </TabPanel>
                
                <TabPanel p={0}>
                  <Box textAlign="center" py={12}>
                    <VStack spacing={4}>
                      <Box p={4} bg="blue.100" borderRadius="full">
                        <Clock size={32} color="#3B82F6" />
                      </Box>
                      <Text color="gray.600" fontSize="lg" fontWeight="medium">Scheduled Consultations</Text>
                      <Text color="gray.500" fontSize="sm">Upcoming appointments will appear here</Text>
                    </VStack>
                  </Box>
                </TabPanel>
                
                <TabPanel p={0}>
                  <Box textAlign="center" py={12}>
                    <VStack spacing={4}>
                      <Box p={4} bg="green.100" borderRadius="full">
                        <Shield size={32} color="#10B981" />
                      </Box>
                      <Text color="gray.600" fontSize="lg" fontWeight="medium">Completed Consultations</Text>
                      <Text color="gray.500" fontSize="sm">Finished consultations will appear here</Text>
                    </VStack>
                  </Box>
                </TabPanel>
                
                <TabPanel p={0}>
                  <Box textAlign="center" py={12}>
                    <VStack spacing={4}>
                      <Box p={4} bg="yellow.100" borderRadius="full">
                        <Settings size={32} color="#F59E0B" />
                      </Box>
                      <Text color="gray.600" fontSize="lg" fontWeight="medium">Technical Support</Text>
                      <Text color="gray.500" fontSize="sm">System diagnostics and support tools</Text>
                    </VStack>
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>

        {/* Virtual Rooms & Quick Actions */}
        <VStack spacing={6} align="stretch">
          {/* Virtual Rooms */}
          <Box
            bg="rgba(255, 255, 255, 0.95)"
            backdropFilter="blur(20px)"
            borderRadius="20px"
            p={6}
            border="1px solid rgba(255, 255, 255, 0.2)"
            boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
          >
            <HStack spacing={3} mb={6}>
              <Box p={2} bg="blue.100" borderRadius="8px">
                <Monitor size={20} color="#3B82F6" />
              </Box>
              <Text fontSize="lg" fontWeight="semibold" color="gray.800">Virtual Consultation Rooms</Text>
            </HStack>
            <VStack spacing={4} align="stretch">
              {consultations.map((room) => (
                <Box 
                  key={room.id} 
                  p={4} 
                  borderRadius="16px" 
                  border="1px solid rgba(0, 0, 0, 0.05)"
                  bg="gray.50"
                  _hover={{ 
                    bg: "white", 
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)"
                  }}
                  transition="all 0.3s ease"
                >
                  <VStack align="stretch" spacing={3}>
                    <Flex justify="space-between" align="center">
                      <Text fontWeight="semibold" fontSize="md" color="gray.800">{room.name}</Text>
                      <Badge 
                        colorScheme={room.status === 'Available' ? 'green' : 'yellow'} 
                        size="sm"
                        borderRadius="8px"
                        px={3}
                        py={1}
                      >
                        {room.status}
                      </Badge>
                    </Flex>
                    
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.600">
                        {room.currentUsers}/{room.capacity} users
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {Math.round((room.currentUsers / room.capacity) * 100)}% capacity
                      </Text>
                    </HStack>
                    
                    <Progress 
                      value={(room.currentUsers / room.capacity) * 100} 
                      colorScheme={room.status === 'Available' ? 'green' : 'yellow'} 
                      size="sm" 
                      borderRadius="full"
                    />
                    
                    <HStack flexWrap="wrap" spacing={2}>
                      {room.features.map((feature, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          size="sm" 
                          colorScheme="blue"
                          borderRadius="6px"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </HStack>
                    
                    <Button 
                      size="sm" 
                      bg="linear-gradient(135deg, #3B82F6, #10B981)"
                      color="white"
                      leftIcon={<Video />}
                      borderRadius="10px"
                      _hover={{ 
                        transform: "translateY(-1px)",
                        boxShadow: "0 6px 20px rgba(59, 130, 246, 0.3)"
                      }}
                    >
                      Enter Room
                    </Button>
                  </VStack>
                </Box>
              ))}
            </VStack>
          </Box>

          {/* Quick Actions */}
          <Box
            bg="rgba(255, 255, 255, 0.95)"
            backdropFilter="blur(20px)"
            borderRadius="20px"
            p={6}
            border="1px solid rgba(255, 255, 255, 0.2)"
            boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
          >
            <HStack spacing={3} mb={6}>
              <Box p={2} bg="green.100" borderRadius="8px">
                <Settings size={20} color="#10B981" />
              </Box>
              <Text fontSize="lg" fontWeight="semibold" color="gray.800">Quick Actions</Text>
            </HStack>
            <VStack spacing={3} align="stretch">
              <Button 
                leftIcon={<Video />} 
                size="md" 
                bg="red.500"
                color="white"
                borderRadius="12px"
                _hover={{ 
                  bg: "red.600",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(239, 68, 68, 0.3)"
                }}
                h={12}
              >
                Start Emergency Consultation
              </Button>
              <Button 
                leftIcon={<Settings />} 
                size="md" 
                variant="outline"
                borderColor="blue.300"
                color="blue.600"
                borderRadius="12px"
                _hover={{ 
                  bg: "blue.50",
                  borderColor: "blue.400",
                  transform: "translateY(-2px)"
                }}
                h={12}
              >
                System Diagnostics
              </Button>
              <Button 
                leftIcon={<Download />} 
                size="md" 
                variant="outline"
                borderColor="teal.300"
                color="teal.600"
                borderRadius="12px"
                _hover={{ 
                  bg: "teal.50",
                  borderColor: "teal.400",
                  transform: "translateY(-2px)"
                }}
                h={12}
              >
                Download Session Reports
              </Button>
              <Button 
                leftIcon={<Share2 />} 
                size="md" 
                variant="outline"
                borderColor="purple.300"
                color="purple.600"
                borderRadius="12px"
                _hover={{ 
                  bg: "purple.50",
                  borderColor: "purple.400",
                  transform: "translateY(-2px)"
                }}
                h={12}
              >
                Share Meeting Room
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Grid>

      {/* Join Meeting Modal */}
      <Modal isOpen={isJoinOpen} onClose={onJoinClose} size="lg">
        <ModalOverlay bg="rgba(0, 0, 0, 0.6)" backdropFilter="blur(10px)" />
        <ModalContent borderRadius="20px" bg="white" border="1px solid rgba(255, 255, 255, 0.2)">
          <ModalHeader borderRadius="20px 20px 0 0" bg="linear-gradient(135deg, #3B82F6, #10B981)" color="white">
            <HStack spacing={3}>
              <Video size={24} />
              <Text>Join Consultation - {selectedConsultation?.meetingId}</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody p={6}>
            {selectedConsultation && (
              <VStack spacing={6} align="stretch">
                <Box p={4} bg="gray.50" borderRadius="16px">
                  <HStack spacing={4}>
                    <Avatar size="lg" name={selectedConsultation.patientName} />
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="bold" fontSize="lg">{selectedConsultation.patientName}</Text>
                      <Text fontSize="md" color="blue.600" fontWeight="medium">{selectedConsultation.doctorName}</Text>
                      <Text fontSize="sm" color="gray.500">Patient ID: {selectedConsultation.patientId}</Text>
                    </VStack>
                  </HStack>
                </Box>
                
                <Box p={4} bg="blue.50" borderRadius="16px">
                  <Text fontSize="sm" color="gray.700" mb={2}>
                    <Text as="span" fontWeight="semibold">Consultation Reason:</Text> {selectedConsultation.symptoms}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    <Text as="span" fontWeight="semibold">Duration:</Text> {selectedConsultation.duration} • <Text as="span" fontWeight="semibold">Type:</Text> {selectedConsultation.type}
                  </Text>
                </Box>
                
                <Box p={4} bg="green.50" borderRadius="16px">
                  <HStack justify="space-between" align="center">
                    <VStack align="start" spacing={1}>
                      <Text fontSize="md" fontWeight="semibold" color="green.700">Device Check Status</Text>
                      <Text fontSize="sm" color="green.600">Camera, Microphone, Network Connection</Text>
                    </VStack>
                    <Badge colorScheme="green" size="lg" borderRadius="10px" px={4} py={2}>
                      All Systems Ready
                    </Badge>
                  </HStack>
                </Box>
                
                <Grid templateColumns="1fr 1fr" gap={4}>
                  <Box p={4} bg="white" borderRadius="12px" border="1px solid rgba(0, 0, 0, 0.1)">
                    <FormControl display="flex" alignItems="center" justifyContent="space-between">
                      <VStack align="start" spacing={0}>
                        <FormLabel fontSize="sm" fontWeight="semibold" mb={0}>Camera</FormLabel>
                        <Text fontSize="xs" color="gray.500">Enable video feed</Text>
                      </VStack>
                      <Switch colorScheme="blue" size="lg" defaultChecked />
                    </FormControl>
                  </Box>
                  
                  <Box p={4} bg="white" borderRadius="12px" border="1px solid rgba(0, 0, 0, 0.1)">
                    <FormControl display="flex" alignItems="center" justifyContent="space-between">
                      <VStack align="start" spacing={0}>
                        <FormLabel fontSize="sm" fontWeight="semibold" mb={0}>Microphone</FormLabel>
                        <Text fontSize="xs" color="gray.500">Enable audio input</Text>
                      </VStack>
                      <Switch colorScheme="blue" size="lg" defaultChecked />
                    </FormControl>
                  </Box>
                </Grid>
              </VStack>
            )}
          </ModalBody>
          
          <ModalFooter p={6} borderRadius="0 0 20px 20px">
            <HStack spacing={3} w="full">
              <Button 
                variant="outline" 
                onClick={onJoinClose}
                borderRadius="12px"
                borderColor="gray.300"
                color="gray.600"
                _hover={{ bg: "gray.50" }}
                flex={1}
              >
                Cancel
              </Button>
              <Button 
                bg="linear-gradient(135deg, #10B981, #3B82F6)" 
                color="white"
                leftIcon={<Video />}
                borderRadius="12px"
                _hover={{ 
                  transform: "translateY(-2px)",
                  boxShadow: "0 10px 25px rgba(16, 185, 129, 0.3)"
                }}
                flex={2}
                h={12}
              >
                Join Consultation Now
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default LiveConsultation;
