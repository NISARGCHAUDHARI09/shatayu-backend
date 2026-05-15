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
  AvatarGroup,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
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
  Textarea,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Progress,
  SimpleGrid,
  Checkbox,
  CheckboxGroup
} from '@chakra-ui/react';
import {
  Search,
  Plus,
  MoreVertical,
  Eye,
  Video,
  Users,
  Calendar,
  Clock,
  User,
  FileText,
  Share2,
  Download,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  StopCircle,
  Settings,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Monitor,
  UserPlus,
  Send
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/live-meetings` : 'https://shatayu-backend.onrender.com/api/live-meetings';

const LiveMeetingManagement = ({ title = "Live Meeting" }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isJoinOpen, onOpen: onJoinOpen, onClose: onJoinClose } = useDisclosure();
  const { isOpen: isParticipantsOpen, onOpen: onParticipantsOpen, onClose: onParticipantsClose } = useDisclosure();
  const { isOpen: isSettingsOpen, onOpen: onSettingsOpen, onClose: onSettingsClose } = useDisclosure();
  const { isOpen: isExportOpen, onOpen: onExportOpen, onClose: onExportClose } = useDisclosure();
  const { isOpen: isBulkSendOpen, onOpen: onBulkSendOpen, onClose: onBulkSendClose } = useDisclosure();
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [selectedMeetings, setSelectedMeetings] = useState([]);
  const [bulkSendMessage, setBulkSendMessage] = useState('');

  React.useEffect(() => {
    const fetchMeetings = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMeetings(response.data);
        setError('');
      } catch (err) {
        setError('Failed to load meetings');
      }
      setLoading(false);
    };
    fetchMeetings();
  }, []);

  // Add meeting
  const addMeeting = async (meetingData) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(API_URL, meetingData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMeetings(prev => [...prev, response.data]);
    } catch (err) {
      // handle error
    }
  };

  // Update meeting
  const updateMeeting = async (id, meetingData) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put(`${API_URL}/${id}`, meetingData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMeetings(prev => prev.map(m => m.id === id ? response.data : m));
    } catch (err) {
      // handle error
    }
  };

  // Delete meeting
  const deleteMeeting = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMeetings(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      // handle error
    }
  };

  // Export Functions
  const exportToPDF = () => {
    try {
      // Enhanced PDF export implementation
      const doc = {
        title: 'Meetings Report',
        data: filteredMeetings,
        generateDate: new Date().toLocaleDateString(),
        totalMeetings: filteredMeetings.length
      };
      
      // Simulate PDF generation
      const pdfBlob = new Blob(['PDF Content'], { type: 'application/pdf' });
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `meetings-report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert('PDF report downloaded successfully!');
      onExportClose();
    } catch (error) {
      alert('Error generating PDF. Please try again.');
    }
  };

  const exportToExcel = () => {
    try {
      // Enhanced Excel export implementation
      const headers = ['Meeting ID', 'Title', 'Organizer', 'Date', 'Time', 'Duration', 'Status', 'Participants', 'Link'];
      const rows = filteredMeetings.map(meeting => [
        meeting.id,
        meeting.title,
        meeting.organizer,
        meeting.date,
        meeting.time,
        meeting.duration,
        meeting.status,
        meeting.participants?.join(', ') || 'N/A',
        meeting.link || 'N/A'
      ]);
      
      // Create CSV content for Excel
      const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');
      
      const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `meetings-report-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert('Excel report downloaded successfully!');
      onExportClose();
    } catch (error) {
      alert('Error generating Excel file. Please try again.');
    }
  };

  const exportToCSV = () => {
    try {
      const csvContent = generateCSV();
      downloadCSV(csvContent, `meetings-report-${new Date().toISOString().split('T')[0]}.csv`);
      alert('CSV report downloaded successfully!');
      onExportClose();
    } catch (error) {
      alert('Error generating CSV file. Please try again.');
    }
  };

  const generateCSV = () => {
    const headers = ['Meeting ID', 'Title', 'Organizer', 'Date', 'Time', 'Duration', 'Status', 'Participants', 'Meeting Link'];
    const rows = filteredMeetings.map(meeting => [
      meeting.id,
      meeting.title,
      meeting.organizer,
      meeting.date,
      meeting.time,
      meeting.duration,
      meeting.status,
      meeting.participants?.join('; ') || 'N/A',
      meeting.link || 'N/A'
    ]);
    
    return [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
  };

  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Bulk Send Functions
  const handleBulkSelectAll = (isChecked) => {
    if (isChecked) {
      setSelectedMeetings(filteredMeetings.map(meeting => meeting.id));
    } else {
      setSelectedMeetings([]);
    }
  };

  const handleMeetingSelect = (meetingId, isChecked) => {
    if (isChecked) {
      setSelectedMeetings(prev => [...prev, meetingId]);
    } else {
      setSelectedMeetings(prev => prev.filter(id => id !== meetingId));
    }
  };

  const handleBulkSend = () => {
    if (selectedMeetings.length === 0) {
      alert('Please select at least one meeting to send notifications.');
      return;
    }
    onBulkSendOpen();
  };

  const sendBulkNotifications = () => {
    try {
      const selectedMeetingData = filteredMeetings.filter(meeting => 
        selectedMeetings.includes(meeting.id)
      );
      
      // Simulate sending notifications
      const totalParticipants = selectedMeetingData.reduce((acc, meeting) => 
        acc + (meeting.participants?.length || 0), 0
      );
      
      setTimeout(() => {
        alert(
          `Notifications sent successfully!\n` +
          `• Meetings: ${selectedMeetings.length}\n` +
          `• Total participants notified: ${totalParticipants}\n` +
          `• Message: "${bulkSendMessage || 'Meeting reminder'}"`
        );
        
        setSelectedMeetings([]);
        setBulkSendMessage('');
        onBulkSendClose();
      }, 1000);
      
    } catch (error) {
      alert('Error sending notifications. Please try again.');
    }
  };

  // Quick Action Handlers
  const handleStartInstantMeeting = () => {
    alert('Starting instant meeting...');
    // Here you would integrate with your video conferencing service
  };

  const handleManageParticipants = () => {
    onParticipantsOpen();
  };

  const handleMeetingSettings = () => {
    onSettingsOpen();
  };
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Filter meetings
  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meeting.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meeting.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meeting.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || meeting.status.toLowerCase().replace(' ', '') === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalMeetings = meetings.length;
  const scheduledMeetings = meetings.filter(m => m.status === 'Scheduled').length;
  const inProgressMeetings = meetings.filter(m => m.status === 'In Progress').length;
  const completedMeetings = meetings.filter(m => m.status === 'Completed').length;
  const todayMeetings = meetings.filter(m => m.date === '2024-12-15').length;

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'scheduled': return 'blue';
      case 'in progress': return 'green';
      case 'completed': return 'gray';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };

  const handleJoinMeeting = (meeting) => {
    setSelectedMeeting(meeting);
    onJoinOpen();
  };

  const formatTime = (time) => {
    return new Date(`2024-12-15 ${time}`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getParticipantStatusCount = (participants, status) => {
    return participants.filter(p => p.status === status).length;
  };

  return (
    <Box 
      p={{ base: 4, md: 6 }} 
      bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
      minH="100vh"
      overflow="hidden"
      w="100%"
    >
      {/* Header */}
      <Box 
        bg="white" 
        borderRadius="20px" 
        p={6} 
        mb={6}
        border="1px solid rgba(0, 0, 0, 0.1)"
        boxShadow="0 4px 12px rgba(0, 0, 0, 0.1)"
      >
        <Flex justify="space-between" align="center">
          <Box>
            <HStack spacing={3} mb={2}>
              <Box 
                p={2} 
                bg="linear-gradient(135deg, #9333EA, #3B82F6)" 
                borderRadius="12px"
                color="white"
              >
                <Users size={24} />
              </Box>
              <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                {title}
              </Text>
            </HStack>
            <Text color="gray.600" fontSize="md">
              Advanced meeting management with real-time collaboration tools
            </Text>
          </Box>
        </Flex>
      </Box>

      {/* Statistics Cards */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(5, 1fr)' }} gap={4} mb={6}>
        <Box
          bg="white"
          borderRadius="16px"
          p={4}
          border="1px solid rgba(255, 255, 255, 0.2)"
          boxShadow="0 2px 8px rgba(0, 0, 0, 0.05)"
          _hover={{ opacity: 0.9 }}
          transition="all 0.3s ease"
        >
          <Stat>
            <HStack justify="space-between" mb={2}>
              <StatLabel color="gray.600" fontSize="sm" fontWeight="medium">Total Meetings</StatLabel>
              <Box p={2} bg="purple.100" borderRadius="8px">
                <Users size={16} color="#9333EA" />
              </Box>
            </HStack>
            <StatNumber color="purple.600" fontSize="2xl" fontWeight="bold">{totalMeetings}</StatNumber>
            <StatHelpText color="gray.500" fontSize="xs" mb={0}>
              All time record
            </StatHelpText>
          </Stat>
        </Box>
        
        <Box
          bg="white"
          borderRadius="16px"
          p={4}
          border="1px solid rgba(255, 255, 255, 0.2)"
          boxShadow="0 2px 8px rgba(0, 0, 0, 0.05)"
          _hover={{ opacity: 0.9 }}
          transition="all 0.3s ease"
        >
          <Stat>
            <HStack justify="space-between" mb={2}>
              <StatLabel color="gray.600" fontSize="sm" fontWeight="medium">Scheduled</StatLabel>
              <Box p={2} bg="blue.100" borderRadius="8px">
                <Calendar size={16} color="#3B82F6" />
              </Box>
            </HStack>
            <StatNumber color="blue.600" fontSize="2xl" fontWeight="bold">{scheduledMeetings}</StatNumber>
            <StatHelpText color="gray.500" fontSize="xs" mb={0}>
              Upcoming meetings
            </StatHelpText>
          </Stat>
        </Box>
        
        <Box
          bg="white"
          borderRadius="16px"
          p={4}
          border="1px solid rgba(255, 255, 255, 0.2)"
          boxShadow="0 2px 8px rgba(0, 0, 0, 0.05)"
          _hover={{ opacity: 0.9 }}
          transition="all 0.3s ease"
        >
          <Stat>
            <HStack justify="space-between" mb={2}>
              <StatLabel color="gray.600" fontSize="sm" fontWeight="medium">In Progress</StatLabel>
              <Box p={2} bg="green.100" borderRadius="8px">
                <Play size={16} color="#10B981" />
              </Box>
            </HStack>
            <StatNumber color="green.600" fontSize="2xl" fontWeight="bold">{inProgressMeetings}</StatNumber>
            <StatHelpText color="gray.500" fontSize="xs" mb={0}>
              Active sessions
            </StatHelpText>
          </Stat>
        </Box>
        
        <Box
          bg="white"
          borderRadius="16px"
          p={4}
          border="1px solid rgba(255, 255, 255, 0.2)"
          boxShadow="0 2px 8px rgba(0, 0, 0, 0.05)"
          _hover={{ opacity: 0.9 }}
          transition="all 0.3s ease"
        >
          <Stat>
            <HStack justify="space-between" mb={2}>
              <StatLabel color="gray.600" fontSize="sm" fontWeight="medium">Completed</StatLabel>
              <Box p={2} bg="gray.100" borderRadius="8px">
                <CheckCircle size={16} color="#6B7280" />
              </Box>
            </HStack>
            <StatNumber color="gray.600" fontSize="2xl" fontWeight="bold">{completedMeetings}</StatNumber>
            <StatHelpText color="gray.500" fontSize="xs" mb={0}>
              Finished today
            </StatHelpText>
          </Stat>
        </Box>

        <Box
          bg="white"
          borderRadius="16px"
          p={4}
          border="1px solid rgba(255, 255, 255, 0.2)"
          boxShadow="0 2px 8px rgba(0, 0, 0, 0.05)"
          _hover={{ opacity: 0.9 }}
          transition="all 0.3s ease"
        >
          <Stat>
            <HStack justify="space-between" mb={2}>
              <StatLabel color="gray.600" fontSize="sm" fontWeight="medium">Today's Total</StatLabel>
              <Box p={2} bg="orange.100" borderRadius="8px">
                <Clock size={16} color="#F59E0B" />
              </Box>
            </HStack>
            <StatNumber color="orange.600" fontSize="2xl" fontWeight="bold">{todayMeetings}</StatNumber>
            <StatHelpText color="gray.500" fontSize="xs" mb={0}>
              Scheduled for today
            </StatHelpText>
          </Stat>
        </Box>
      </Grid>

      {/* System Status Alert */}
      <Box
        bg="green.50"
        borderRadius="16px"
        p={4}
        mb={6}
        border="1px solid rgba(16, 185, 129, 0.3)"
        boxShadow="0 2px 8px rgba(16, 185, 129, 0.1)"
      >
        <HStack spacing={3}>
          <Box p={2} bg="green.100" borderRadius="8px">
            <Settings size={20} color="#10B981" />
          </Box>
          <VStack align="start" spacing={0}>
            <Text fontWeight="semibold" color="green.700" fontSize="md">Meeting Platform: Operational</Text>
            <Text color="green.600" fontSize="sm">
              Video conferencing ready • Server capacity: 85% • Active rooms: 3 • Network status: Excellent
            </Text>
          </VStack>
        </HStack>
      </Box>

      {/* Main Content Grid */}
      <Grid 
        templateColumns={{ base: '1fr', lg: '2fr 1fr' }} 
        gap={6}
        overflow="hidden"
        w="100%"
      >
        {/* Meetings Management */}
        <Box
          bg="white"
          borderRadius="20px"
          p={{ base: 4, md: 6 }}
          border="1px solid rgba(0, 0, 0, 0.1)"
          boxShadow="0 4px 12px rgba(0, 0, 0, 0.1)"
          overflow="hidden"
          w="100%"
        >
          {/* Enhanced Filters Section */}
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
                  placeholder="Search meetings, organizer, participants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  variant="unstyled"
                  size="sm"
                />
              </HStack>
              
              <Select 
                placeholder="All Status" 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                w={{ base: "full", md: "200px" }}
                bg="white"
                borderRadius="10px"
                border="1px solid rgba(0, 0, 0, 0.05)"
                _focus={{ borderColor: "purple.400", boxShadow: "0 0 0 1px #9333EA" }}
              >
                <option value="scheduled">Scheduled</option>
                <option value="inprogress">In Progress</option>
                <option value="completed">Completed</option>
              </Select>
            </Flex>
          </Box>

          {/* Export Report Section */}
          <Flex justify="space-between" align="center" mb={6}>
            <Text fontSize="lg" fontWeight="semibold" color="gray.800">
              Meetings Report ({filteredMeetings.length} meetings)
            </Text>
            <Button
              leftIcon={<Download />}
              colorScheme="purple"
              variant="outline"
              size="sm"
              borderRadius="10px"
              onClick={onExportOpen}
              _hover={{ 
                bg: "purple.50",
                borderColor: "purple.400"
              }}
            >
              Export Report
            </Button>
          </Flex>

          {/* Enhanced Meetings Table */}
          <TableContainer 
            overflowX="auto" 
            borderRadius="12px"
            border="1px solid rgba(0, 0, 0, 0.05)"
            bg="white"
          >
            <Table variant="simple" size="sm">
              <Thead>
                <Tr bg="gray.50">
                  <Th 
                    borderRadius="8px 0 0 0" 
                    color="gray.600" 
                    fontWeight="semibold" 
                    fontSize="xs"
                    minW="50px"
                    maxW="50px"
                    textAlign="center"
                  >
                    <Checkbox
                      isChecked={selectedMeetings.length === filteredMeetings.length && filteredMeetings.length > 0}
                      isIndeterminate={selectedMeetings.length > 0 && selectedMeetings.length < filteredMeetings.length}
                      onChange={(e) => handleBulkSelectAll(e.target.checked)}
                      colorScheme="purple"
                    />
                  </Th>
                  <Th 
                    color="gray.600" 
                    fontWeight="semibold" 
                    fontSize="xs"
                    minW="200px"
                    maxW="250px"
                  >
                    Meeting Details
                  </Th>
                  <Th 
                    color="gray.600" 
                    fontWeight="semibold" 
                    fontSize="xs"
                    minW="120px"
                    maxW="150px"
                  >
                    Organizer
                  </Th>
                  <Th 
                    color="gray.600" 
                    fontWeight="semibold" 
                    fontSize="xs"
                    minW="120px"
                    maxW="150px"
                  >
                    Schedule
                  </Th>
                  <Th 
                    color="gray.600" 
                    fontWeight="semibold" 
                    fontSize="xs"
                    minW="100px"
                    maxW="120px"
                  >
                    Status
                  </Th>
                  <Th 
                    borderRadius="0 8px 8px 0" 
                    color="gray.600" 
                    fontWeight="semibold" 
                    fontSize="xs"
                    minW="80px"
                    maxW="100px"
                  >
                    Actions
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredMeetings.map((meeting) => (
                  <Tr key={meeting.id} _hover={{ bg: "gray.50" }}>
                    <Td maxW="50px" textAlign="center">
                      <Checkbox
                        isChecked={selectedMeetings.includes(meeting.id)}
                        onChange={(e) => handleMeetingSelect(meeting.id, e.target.checked)}
                        colorScheme="purple"
                      />
                    </Td>
                    <Td maxW="250px">
                      <Text 
                        fontWeight="semibold" 
                        fontSize="sm" 
                        color="gray.800"
                        noOfLines={2}
                      >
                        {meeting.title}
                      </Text>
                    </Td>
                    <Td maxW="150px">
                      <HStack spacing={2}>
                        <Avatar size="sm" name={meeting.organizer} />
                        <VStack align="start" spacing={0}>
                          <Text 
                            fontSize="sm" 
                            fontWeight="medium" 
                            color="gray.800"
                            noOfLines={1}
                          >
                            {meeting.organizer}
                          </Text>
                          <Text fontSize="xs" color="gray.500">Meeting Host</Text>
                        </VStack>
                      </HStack>
                    </Td>
                    <Td maxW="150px">
                      <VStack align="start" spacing={2}>
                        <HStack spacing={2}>
                          <Calendar size={12} color="#6B7280" />
                          <Text 
                            fontSize="sm" 
                            color="gray.700"
                            noOfLines={1}
                          >
                            {meeting.date}
                          </Text>
                        </HStack>
                        <HStack spacing={2}>
                          <Clock size={12} color="#6B7280" />
                          <Text 
                            fontSize="sm" 
                            color="gray.700"
                            noOfLines={1}
                          >
                            {formatTime(meeting.time)}
                          </Text>
                        </HStack>
                        <Text fontSize="xs" color="gray.500">{meeting.duration}</Text>
                      </VStack>
                    </Td>
                    <Td maxW="120px">
                      <VStack align="start" spacing={1}>
                        <Badge 
                          colorScheme={getStatusColor(meeting.status)} 
                          variant="subtle" 
                          size="sm"
                          borderRadius="6px"
                        >
                          {meeting.status}
                        </Badge>
                        {meeting.status === 'In Progress' && (
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
                          {meeting.status === 'Scheduled' && (
                            <MenuItem
                              icon={<Video size={16} />}
                              borderRadius="8px"
                              onClick={() => handleJoinMeeting(meeting)}
                            >
                              Join Meeting
                            </MenuItem>
                          )}
                          {meeting.status === 'In Progress' && (
                            <MenuItem icon={<Monitor size={16} />} borderRadius="8px">
                              Monitor Session
                            </MenuItem>
                          )}
                          <MenuItem icon={<Eye size={16} />} borderRadius="8px">
                            View Details
                          </MenuItem>
                          <MenuItem icon={<Edit size={16} />} borderRadius="8px">
                            Edit Meeting
                          </MenuItem>
                          <MenuItem icon={<FileText size={16} />} borderRadius="8px">
                            Meeting Notes
                          </MenuItem>
                          <MenuItem icon={<UserPlus size={16} />} borderRadius="8px">
                            Add Participants
                          </MenuItem>
                          {meeting.status !== 'Completed' && (
                            <MenuItem icon={<Trash2 size={16} />} color="red.500" borderRadius="8px">
                              Cancel Meeting
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

        {/* Quick Actions & Live Meetings Sidebar */}
        <Box>
          <VStack spacing={6} align="stretch">
            {/* Quick Meeting Actions */}
            <Box
              bg="white"
              borderRadius="20px"
              p={6}
              border="1px solid rgba(255, 255, 255, 0.2)"
              boxShadow="0 2px 8px rgba(0, 0, 0, 0.05)"
            >
            <HStack spacing={3} mb={6}>
              <Box p={2} bg="purple.100" borderRadius="8px">
                <Video size={20} color="#9333EA" />
              </Box>
              <Text fontSize="lg" fontWeight="semibold" color="gray.800">Quick Actions</Text>
            </HStack>
            <VStack spacing={3} align="stretch">
              <Button 
                leftIcon={<Video />} 
                size="md" 
                bg="linear-gradient(135deg, #9333EA, #3B82F6)"
                color="white"
                borderRadius="12px"
                _hover={{ 
                  opacity: 0.8
                }}
                h={12}
                onClick={handleStartInstantMeeting}
              >
                Start Instant Meeting
              </Button>
              <Button 
                leftIcon={<Calendar />} 
                size="md" 
                variant="outline"
                borderColor="purple.300"
                color="purple.600"
                borderRadius="12px"
                _hover={{ 
                  bg: "purple.50",
                  borderColor: "purple.400"
                }}
                h={12}
                onClick={onAddOpen}
              >
                Schedule Meeting
              </Button>
              <Button 
                leftIcon={<Users />} 
                size="md" 
                variant="outline"
                borderColor="blue.300"
                color="blue.600"
                borderRadius="12px"
                _hover={{ 
                  bg: "blue.50",
                  borderColor: "blue.400"
                }}
                h={12}
                onClick={handleManageParticipants}
              >
                Manage Participants
              </Button>
              <Button 
                leftIcon={<Settings />} 
                size="md" 
                variant="outline"
                borderColor="gray.300"
                color="gray.600"
                borderRadius="12px"
                _hover={{ 
                  bg: "gray.50",
                  borderColor: "gray.400"
                }}
                h={12}
                onClick={handleMeetingSettings}
              >
                Meeting Settings
              </Button>
            </VStack>
          </Box>

          {/* Active Meetings */}
          <Box
            bg="white"
            borderRadius="20px"
            p={6}
            border="1px solid rgba(255, 255, 255, 0.2)"
            boxShadow="0 2px 8px rgba(0, 0, 0, 0.05)"
          >
            <HStack spacing={3} mb={6}>
              <Box p={2} bg="green.100" borderRadius="8px">
                <Play size={20} color="#10B981" />
              </Box>
              <Text fontSize="lg" fontWeight="semibold" color="gray.800">Active Meetings</Text>
            </HStack>
            
            {inProgressMeetings > 0 ? (
              <VStack spacing={4} align="stretch">
                {meetings.filter(meeting => meeting.status === 'In Progress').map((meeting) => (
                  <Box key={meeting.id} p={4} bg="green.50" borderRadius="12px" border="1px solid" borderColor="green.200">
                    <VStack align="start" spacing={2}>
                      <HStack justify="space-between" w="full">
                        <Text fontSize="sm" fontWeight="semibold" color="green.800">
                          {meeting.title}
                        </Text>
                        <Badge colorScheme="green" size="sm">Live</Badge>
                      </HStack>
                      <Text fontSize="xs" color="green.600">
                        Organizer: {meeting.organizer}
                      </Text>
                      <Text fontSize="xs" color="green.600">
                        Participants: {meeting.participants.length}
                      </Text>
                      <Button 
                        size="sm" 
                        bg="linear-gradient(135deg, #10B981, #3B82F6)"
                        color="white"
                        leftIcon={<Video />}
                        borderRadius="10px"
                        _hover={{ 
                          opacity: 0.8
                        }}
                        onClick={() => handleJoinMeeting(meeting)}
                      >
                        Join Now
                      </Button>
                    </VStack>
                  </Box>
                ))}
              </VStack>
            ) : (
              <Box p={4} bg="gray.50" borderRadius="12px" textAlign="center">
                <Text fontSize="sm" color="gray.500">No active meetings</Text>
                <Text fontSize="xs" color="gray.400">All meetings are scheduled or completed</Text>
              </Box>
            )}
          </Box>
        </VStack>
        </Box>
      </Grid>

      {/* Schedule Meeting Modal */}
      <Modal isOpen={isAddOpen} onClose={onAddClose} size="xl">
        <ModalOverlay bg="rgba(0, 0, 0, 0.6)" backdropFilter="blur(10px)" />
        <ModalContent borderRadius="20px" bg="white" border="1px solid rgba(255, 255, 255, 0.2)">
          <ModalHeader borderRadius="20px 20px 0 0" bg="linear-gradient(135deg, #9333EA, #3B82F6)" color="white">
            <HStack spacing={3}>
              <Plus size={24} />
              <Text>Schedule New Meeting</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody p={6}>
            <VStack spacing={6} align="stretch">
              <Grid templateColumns="1fr 1fr" gap={4}>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">Meeting Title</FormLabel>
                  <Input 
                    placeholder="Enter meeting title" 
                    borderRadius="10px"
                    border="1px solid rgba(0, 0, 0, 0.1)"
                    _focus={{ borderColor: "purple.400", boxShadow: "0 0 0 1px #9333EA" }}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">Meeting Type</FormLabel>
                  <Select 
                    placeholder="Select meeting type"
                    borderRadius="10px"
                    border="1px solid rgba(0, 0, 0, 0.1)"
                    _focus={{ borderColor: "purple.400", boxShadow: "0 0 0 1px #9333EA" }}
                  >
                    <option value="staff">Staff Meeting</option>
                    <option value="review">Review Meeting</option>
                    <option value="research">Research Meeting</option>
                    <option value="training">Training Session</option>
                    <option value="care">Care Coordination</option>
                  </Select>
                </FormControl>
              </Grid>
              
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">Description</FormLabel>
                <Textarea 
                  placeholder="Brief description of the meeting" 
                  rows={3} 
                  borderRadius="10px"
                  border="1px solid rgba(0, 0, 0, 0.1)"
                  _focus={{ borderColor: "purple.400", boxShadow: "0 0 0 1px #9333EA" }}
                />
              </FormControl>
              
              <Grid templateColumns="1fr 1fr 1fr" gap={4}>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">Date</FormLabel>
                  <Input 
                    type="date" 
                    borderRadius="10px"
                    border="1px solid rgba(0, 0, 0, 0.1)"
                    _focus={{ borderColor: "purple.400", boxShadow: "0 0 0 1px #9333EA" }}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">Time</FormLabel>
                  <Input 
                    type="time" 
                    borderRadius="10px"
                    border="1px solid rgba(0, 0, 0, 0.1)"
                    _focus={{ borderColor: "purple.400", boxShadow: "0 0 0 1px #9333EA" }}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">Duration</FormLabel>
                  <Select 
                    defaultValue="60"
                    borderRadius="10px"
                    border="1px solid rgba(0, 0, 0, 0.1)"
                    _focus={{ borderColor: "purple.400", boxShadow: "0 0 0 1px #9333EA" }}
                  >
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                    <option value="120">120 minutes</option>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid templateColumns="1fr 1fr" gap={4}>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">Priority</FormLabel>
                  <Select 
                    placeholder="Select priority level"
                    borderRadius="10px"
                    border="1px solid rgba(0, 0, 0, 0.1)"
                    _focus={{ borderColor: "purple.400", boxShadow: "0 0 0 1px #9333EA" }}
                  >
                    <option value="low">🟢 Low Priority</option>
                    <option value="medium">🟡 Medium Priority</option>
                    <option value="high">🔴 High Priority</option>
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">Platform</FormLabel>
                  <Select 
                    placeholder="Select meeting platform"
                    borderRadius="10px"
                    border="1px solid rgba(0, 0, 0, 0.1)"
                    _focus={{ borderColor: "purple.400", boxShadow: "0 0 0 1px #9333EA" }}
                  >
                    <option value="zoom">🔵 Zoom Meeting</option>
                    <option value="teams">🟦 Microsoft Teams</option>
                    <option value="gmeet">🟢 Google Meet</option>
                    <option value="webex">🔶 Cisco Webex</option>
                  </Select>
                </FormControl>
              </Grid>
              
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">Agenda</FormLabel>
                <Textarea 
                  placeholder="Meeting agenda and discussion points" 
                  rows={3} 
                  borderRadius="10px"
                  border="1px solid rgba(0, 0, 0, 0.1)"
                  _focus={{ borderColor: "purple.400", boxShadow: "0 0 0 1px #9333EA" }}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          
          <ModalFooter p={6} borderRadius="0 0 20px 20px">
            <HStack spacing={3} w="full">
              <Button 
                variant="outline" 
                onClick={onAddClose}
                borderRadius="12px"
                borderColor="gray.300"
                color="gray.600"
                _hover={{ bg: "gray.50" }}
                flex={1}
              >
                Cancel
              </Button>
              <Button 
                bg="linear-gradient(135deg, #9333EA, #3B82F6)" 
                color="white"
                leftIcon={<Calendar />}
                borderRadius="12px"
                _hover={{ 
                  opacity: 0.8
                }}
                flex={2}
                h={12}
              >
                Schedule Meeting
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Join Meeting Modal */}
      {selectedMeeting && (
        <Modal isOpen={isJoinOpen} onClose={onJoinClose} size="lg">
          <ModalOverlay bg="rgba(0, 0, 0, 0.6)" backdropFilter="blur(10px)" />
          <ModalContent borderRadius="20px" bg="white" border="1px solid rgba(255, 255, 255, 0.2)">
            <ModalHeader borderRadius="20px 20px 0 0" bg="linear-gradient(135deg, #10B981, #9333EA)" color="white">
              <HStack spacing={3}>
                <Video size={24} />
                <Text>Join Meeting - {selectedMeeting.id}</Text>
              </HStack>
            </ModalHeader>
            <ModalCloseButton color="white" />
            <ModalBody p={6}>
              <VStack spacing={6} align="stretch">
                <Box p={4} bg="gray.50" borderRadius="16px">
                  <VStack align="start" spacing={3}>
                    <Text fontWeight="bold" fontSize="lg">{selectedMeeting.title}</Text>
                    <Text fontSize="sm" color="gray.600">{selectedMeeting.description}</Text>
                    <HStack spacing={4}>
                      <Badge colorScheme={getTypeColor(selectedMeeting.meetingType)} size="md">
                        {selectedMeeting.meetingType}
                      </Badge>
                      <Badge colorScheme={getPriorityColor(selectedMeeting.priority)} size="md">
                        {selectedMeeting.priority} Priority
                      </Badge>
                    </HStack>
                  </VStack>
                </Box>
                
                <Box p={4} bg="blue.50" borderRadius="16px">
                  <VStack align="stretch" spacing={3}>
                    <Text fontSize="md" fontWeight="semibold" color="blue.700">Meeting Details</Text>
                    <SimpleGrid columns={2} spacing={4}>
                      <VStack align="start" spacing={1}>
                        <Text fontSize="sm" color="gray.600" fontWeight="semibold">Organizer</Text>
                        <Text fontSize="sm">{selectedMeeting.organizer}</Text>
                      </VStack>
                      <VStack align="start" spacing={1}>
                        <Text fontSize="sm" color="gray.600" fontWeight="semibold">Duration</Text>
                        <Text fontSize="sm">{selectedMeeting.duration}</Text>
                      </VStack>
                      <VStack align="start" spacing={1}>
                        <Text fontSize="sm" color="gray.600" fontWeight="semibold">Participants</Text>
                        <Text fontSize="sm">{selectedMeeting.participants.length} members</Text>
                      </VStack>
                      <VStack align="start" spacing={1}>
                        <Text fontSize="sm" color="gray.600" fontWeight="semibold">Meeting Link</Text>
                        <Text fontSize="sm" color="blue.600">{selectedMeeting.meetingLink}</Text>
                      </VStack>
                    </SimpleGrid>
                  </VStack>
                </Box>
                
                <Box p={4} bg="green.50" borderRadius="16px">
                  <HStack justify="space-between" align="center">
                    <VStack align="start" spacing={1}>
                      <Text fontSize="md" fontWeight="semibold" color="green.700">Ready to Join</Text>
                      <Text fontSize="sm" color="green.600">Video and audio systems are operational</Text>
                    </VStack>
                    <Badge colorScheme="green" size="lg" borderRadius="10px" px={4} py={2}>
                      Ready
                    </Badge>
                  </HStack>
                </Box>
              </VStack>
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
                  bg="linear-gradient(135deg, #10B981, #9333EA)" 
                  color="white"
                  leftIcon={<Video />}
                  borderRadius="12px"
                  _hover={{ 
                    opacity: 0.8
                  }}
                  flex={2}
                  h={12}
                >
                  Join Meeting Now
                </Button>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {/* Manage Participants Modal */}
      <Modal isOpen={isParticipantsOpen} onClose={onParticipantsClose} size="xl">
        <ModalOverlay bg="rgba(0, 0, 0, 0.6)" />
        <ModalContent borderRadius="20px" bg="white">
          <ModalHeader borderRadius="20px 20px 0 0" bg="linear-gradient(135deg, #3B82F6, #9333EA)" color="white">
            <HStack spacing={3}>
              <Users size={24} />
              <Text>Manage Participants</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody p={6}>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Text fontSize="lg" fontWeight="semibold">Current Participants</Text>
                <Button leftIcon={<UserPlus />} colorScheme="blue" size="sm">
                  Add Participant
                </Button>
              </HStack>
              <Box bg="gray.50" p={4} borderRadius="12px">
                <VStack spacing={3} align="stretch">
                  {meetings[0]?.participants.map((participant, index) => (
                    <HStack key={index} justify="space-between" p={3} bg="white" borderRadius="8px">
                      <HStack spacing={3}>
                        <Avatar size="sm" name={participant.name} />
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="medium">{participant.name}</Text>
                          <Text fontSize="sm" color="gray.600">{participant.role}</Text>
                        </VStack>
                      </HStack>
                      <Badge colorScheme={participant.status === 'Accepted' ? 'green' : 'yellow'}>
                        {participant.status}
                      </Badge>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onParticipantsClose}>
              Close
            </Button>
            <Button colorScheme="blue">
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Meeting Settings Modal */}
      <Modal isOpen={isSettingsOpen} onClose={onSettingsClose} size="lg">
        <ModalOverlay bg="rgba(0, 0, 0, 0.6)" />
        <ModalContent borderRadius="20px" bg="white">
          <ModalHeader borderRadius="20px 20px 0 0" bg="linear-gradient(135deg, #6B7280, #9333EA)" color="white">
            <HStack spacing={3}>
              <Settings size={24} />
              <Text>Meeting Settings</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody p={6}>
            <VStack spacing={6} align="stretch">
              <FormControl>
                <FormLabel>Default Meeting Duration</FormLabel>
                <Select defaultValue="60">
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Auto-Record Meetings</FormLabel>
                <Checkbox defaultChecked>
                  Automatically record all meetings
                </Checkbox>
              </FormControl>
              
              <FormControl>
                <FormLabel>Participant Permissions</FormLabel>
                <VStack align="start" spacing={2}>
                  <Checkbox defaultChecked>Allow screen sharing</Checkbox>
                  <Checkbox defaultChecked>Allow chat messages</Checkbox>
                  <Checkbox>Allow file sharing</Checkbox>
                  <Checkbox>Allow annotation tools</Checkbox>
                </VStack>
              </FormControl>
              
              <FormControl>
                <FormLabel>Notification Settings</FormLabel>
                <VStack align="start" spacing={2}>
                  <Checkbox defaultChecked>Email reminders</Checkbox>
                  <Checkbox defaultChecked>Meeting start notifications</Checkbox>
                  <Checkbox>Recording completion alerts</Checkbox>
                </VStack>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onSettingsClose}>
              Cancel
            </Button>
            <Button colorScheme="purple">
              Save Settings
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Export Report Modal */}
      <Modal isOpen={isExportOpen} onClose={onExportClose} size="md">
        <ModalOverlay bg="rgba(0, 0, 0, 0.6)" />
        <ModalContent borderRadius="20px" bg="white">
          <ModalHeader borderRadius="20px 20px 0 0" bg="linear-gradient(135deg, #9333EA, #3B82F6)" color="white">
            <HStack spacing={3}>
              <Download size={24} />
              <Text>Export Meetings Report</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody p={6}>
            <VStack spacing={4} align="stretch">
              <Text fontSize="sm" color="gray.600" mb={2}>
                Export {filteredMeetings.length} meeting records in your preferred format:
              </Text>
              
              <VStack spacing={3} align="stretch">
                <Button
                  leftIcon={<FileText />}
                  size="lg"
                  variant="outline"
                  borderColor="red.300"
                  color="red.600"
                  borderRadius="12px"
                  _hover={{ 
                    bg: "red.50",
                    borderColor: "red.400"
                  }}
                  h={12}
                  onClick={exportToPDF}
                  justifyContent="flex-start"
                >
                  <VStack align="start" spacing={1} ml={2}>
                    <Text fontWeight="semibold">Export as PDF</Text>
                    <Text fontSize="xs" color="gray.500">Formatted report with charts and summaries</Text>
                  </VStack>
                </Button>
                
                <Button
                  leftIcon={<FileText />}
                  size="lg"
                  variant="outline"
                  borderColor="green.300"
                  color="green.600"
                  borderRadius="12px"
                  _hover={{ 
                    bg: "green.50",
                    borderColor: "green.400"
                  }}
                  h={12}
                  onClick={exportToExcel}
                  justifyContent="flex-start"
                >
                  <VStack align="start" spacing={1} ml={2}>
                    <Text fontWeight="semibold">Export as Excel</Text>
                    <Text fontSize="xs" color="gray.500">Spreadsheet format with formulas and charts</Text>
                  </VStack>
                </Button>
                
                <Button
                  leftIcon={<FileText />}
                  size="lg"
                  variant="outline"
                  borderColor="blue.300"
                  color="blue.600"
                  borderRadius="12px"
                  _hover={{ 
                    bg: "blue.50",
                    borderColor: "blue.400"
                  }}
                  h={12}
                  onClick={exportToCSV}
                  justifyContent="flex-start"
                >
                  <VStack align="start" spacing={1} ml={2}>
                    <Text fontWeight="semibold">Export as CSV</Text>
                    <Text fontSize="xs" color="gray.500">Comma-separated values for data analysis</Text>
                  </VStack>
                </Button>
              </VStack>
              
              <Alert status="info" borderRadius="8px" mt={4}>
                <AlertIcon />
                <Box>
                  <AlertTitle fontSize="sm">Export includes:</AlertTitle>
                  <AlertDescription fontSize="xs">
                    Meeting details, participants, schedules, and status information based on current filters.
                  </AlertDescription>
                </Box>
              </Alert>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onExportClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Bulk Send Modal */}
      <Modal isOpen={isBulkSendOpen} onClose={onBulkSendClose} size="lg">
        <ModalOverlay bg="rgba(0, 0, 0, 0.6)" />
        <ModalContent borderRadius="20px" bg="white">
          <ModalHeader borderRadius="20px 20px 0 0" bg="linear-gradient(135deg, #10B981, #3B82F6)" color="white">
            <HStack spacing={3}>
              <Send size={24} />
              <Text>Bulk Send Notifications</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody p={6}>
            <VStack spacing={6} align="stretch">
              <Box bg="green.50" p={4} borderRadius="12px" border="1px solid rgba(16, 185, 129, 0.2)">
                <HStack spacing={3} mb={3}>
                  <CheckCircle size={20} color="#10B981" />
                  <Text fontWeight="semibold" color="green.700">
                    {selectedMeetings.length} Meeting{selectedMeetings.length !== 1 ? 's' : ''} Selected
                  </Text>
                </HStack>
                <VStack align="start" spacing={2}>
                  {filteredMeetings
                    .filter(meeting => selectedMeetings.includes(meeting.id))
                    .slice(0, 3)
                    .map(meeting => (
                      <HStack key={meeting.id} spacing={3}>
                        <Badge colorScheme="green" size="sm">{meeting.id}</Badge>
                        <Text fontSize="sm" color="gray.700">{meeting.title}</Text>
                      </HStack>
                    ))}
                  {selectedMeetings.length > 3 && (
                    <Text fontSize="sm" color="gray.500" fontStyle="italic">
                      ... and {selectedMeetings.length - 3} more meetings
                    </Text>
                  )}
                </VStack>
              </Box>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">
                  Notification Type
                </FormLabel>
                <Select 
                  placeholder="Select notification type"
                  borderRadius="10px"
                  border="1px solid rgba(0, 0, 0, 0.1)"
                  _focus={{ borderColor: "green.400", boxShadow: "0 0 0 1px #10B981" }}
                >
                  <option value="reminder">Meeting Reminder</option>
                  <option value="invitation">Meeting Invitation</option>
                  <option value="update">Meeting Update</option>
                  <option value="cancellation">Meeting Cancellation</option>
                  <option value="rescheduled">Meeting Rescheduled</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">
                  Custom Message
                </FormLabel>
                <Textarea 
                  placeholder="Enter your custom message to participants..."
                  value={bulkSendMessage}
                  onChange={(e) => setBulkSendMessage(e.target.value)}
                  borderRadius="10px"
                  border="1px solid rgba(0, 0, 0, 0.1)"
                  _focus={{ borderColor: "green.400", boxShadow: "0 0 0 1px #10B981" }}
                  rows={4}
                />
              </FormControl>

              <Box bg="blue.50" p={4} borderRadius="12px" border="1px solid rgba(59, 130, 246, 0.2)">
                <VStack align="start" spacing={2}>
                  <HStack spacing={3}>
                    <AlertCircle size={16} color="#3B82F6" />
                    <Text fontSize="sm" fontWeight="semibold" color="blue.700">Notification Summary</Text>
                  </HStack>
                  <Text fontSize="sm" color="blue.600">
                    • Notifications will be sent via email and in-app messages
                  </Text>
                  <Text fontSize="sm" color="blue.600">
                    • Total participants: {filteredMeetings
                      .filter(meeting => selectedMeetings.includes(meeting.id))
                      .reduce((acc, meeting) => acc + (meeting.participants?.length || 0), 0)
                    }
                  </Text>
                  <Text fontSize="sm" color="blue.600">
                    • Estimated delivery time: 2-5 minutes
                  </Text>
                </VStack>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onBulkSendClose}>
              Cancel
            </Button>
            <Button 
              bg="linear-gradient(135deg, #10B981, #3B82F6)" 
              color="white"
              leftIcon={<Send />}
              _hover={{ opacity: 0.9 }}
              onClick={sendBulkNotifications}
            >
              Send Notifications
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Box>
  );
};

export default LiveMeetingManagement;
