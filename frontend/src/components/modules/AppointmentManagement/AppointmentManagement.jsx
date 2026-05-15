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
  Avatar,
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
  Stat,
  StatLabel,
  StatNumber,
  Heading,
  Divider,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Tag,
  TagLabel,
  TagLeftIcon,
  Tooltip
} from '@chakra-ui/react';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Plus,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  Edit,
  Eye,
  UserCheck,
  CalendarDays,
  Activity,
  TrendingUp,
  MapPin,
  Mail,
  FileText,
  Bell,
  Download,
  Stethoscope,
  Trash2
} from 'lucide-react';

// ...existing code...
// No mock appointment data

const AppointmentManagement = ({ title = "Appointment Management", showAddButton = true }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [appointments, setAppointments] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Form state for new appointment
  const [formData, setFormData] = useState({
    patientName: '',
    patientId: '',
    doctorName: '',
    appointmentType: '',
    date: '',
    time: '',
    phone: '',
    condition: ''
  });

  // Export functionality
  const { isOpen: isExportOpen, onOpen: onExportOpen, onClose: onExportClose } = useDisclosure();

  // Filter appointments
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status.toLowerCase() === statusFilter;
    const matchesDate = dateFilter === 'all' || 
                       (dateFilter === 'today' && appointment.date === '2024-12-16') ||
                       (dateFilter === 'tomorrow' && appointment.date === '2024-12-17');
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Calculate statistics
  const totalAppointments = appointments.length;
  const todayAppointments = 0;
  const confirmedAppointments = 0;
  const pendingAppointments = 0;

  // Handle status change
  const handleStatusChange = (appointmentId, newStatus) => {
    setAppointments(prevAppointments =>
      prevAppointments.map(apt =>
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt
      )
    );
  };

  // Form handling functions
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateAppointment = () => {
    // Validate form data
    if (!formData.patientName || !formData.doctorName || !formData.date || !formData.time) {
      alert('Please fill in all required fields');
      return;
    }

    // Create new appointment object
    const newAppointment = {
      id: `APT${String(appointments.length + 1).padStart(3, '0')}`,
      patientName: formData.patientName,
      patientId: formData.patientId || `P${String(appointments.length + 1).padStart(3, '0')}`,
      doctorName: formData.doctorName,
      date: formData.date,
      time: formData.time,
      type: formData.appointmentType,
      status: 'Pending',
      phone: formData.phone,
      condition: formData.condition
    };

    // Add to appointments
    setAppointments(prev => [...prev, newAppointment]);
    
    // Reset form and close modal
    resetForm();
    onClose();
    
    // Show success message
    alert('Appointment created successfully!');
  };

  const resetForm = () => {
    setFormData({
      patientName: '',
      patientId: '',
      doctorName: '',
      appointmentType: '',
      date: '',
      time: '',
      phone: '',
      condition: ''
    });
  };

  const handleModalClose = () => {
    resetForm();
    onClose();
  };

  // Export functions
  const exportToPDF = () => {
    // Convert appointments data to PDF format
    const appointmentData = filteredAppointments.map(apt => [
      apt.id,
      apt.patientName,
      apt.patientId,
      apt.doctorName,
      apt.date,
      apt.time,
      apt.type,
      apt.status,
      apt.phone,
      apt.condition
    ]);

    console.log('Exporting to PDF:', appointmentData);
    alert('PDF export functionality would be implemented here using libraries like jsPDF or react-pdf');
    onExportClose();
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Patient Name', 'Patient ID', 'Doctor', 'Date', 'Time', 'Type', 'Status', 'Phone', 'Condition'];
    const csvData = filteredAppointments.map(apt => [
      apt.id,
      apt.patientName,
      apt.patientId,
      apt.doctorName,
      apt.date,
      apt.time,
      apt.type,
      apt.status,
      apt.phone,
      apt.condition
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `appointments_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    onExportClose();
  };

  const exportToExcel = () => {
    // Excel export would typically use a library like xlsx
    const appointmentData = filteredAppointments.map(apt => ({
      'ID': apt.id,
      'Patient Name': apt.patientName,
      'Patient ID': apt.patientId,
      'Doctor': apt.doctorName,
      'Date': apt.date,
      'Time': apt.time,
      'Type': apt.type,
      'Status': apt.status,
      'Phone': apt.phone,
      'Condition': apt.condition
    }));

    console.log('Exporting to Excel:', appointmentData);
    alert('Excel export functionality would be implemented here using libraries like xlsx or exceljs');
    onExportClose();
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'green';
      case 'pending': return 'yellow';
      case 'completed': return 'blue';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'consultation': return 'blue';
      case 'treatment': return 'purple';
      case 'panchakarma': return 'orange';
      case 'follow-up': return 'teal';
      default: return 'gray';
    }
  };

  return (
    <Box 
      bg="linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)" 
      minH="calc(100vh - 70px)"
      position="relative"
    >
      {/* Background Pattern */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        opacity={0.02}
        bgImage="data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234299e1' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"
        zIndex={0}
      />

      {/* Page Header */}
      <Box position="relative" zIndex={1} mb={8}>
        <Card
          bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          color="white"
          borderRadius="2xl"
          overflow="hidden"
          position="relative"
          boxShadow="0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        >
          <CardBody p={8} position="relative" zIndex={1}>
            <Flex justify="space-between" align="center" direction={{ base: 'column', md: 'row' }} gap={4}>
              <VStack align={{ base: 'center', md: 'start' }} spacing={2}>
                <HStack spacing={3}>
                  <Box
                    p={3}
                    bg="rgba(255, 255, 255, 0.2)"
                    borderRadius="xl"
                    backdropFilter="blur(10px)"
                  >
                    <CalendarDays size={24} />
                  </Box>
                  <Box>
                    <Heading size="xl" fontWeight="bold">
                      {title}
                    </Heading>
                    <Text fontSize="lg" opacity={0.9}>
                      Manage appointments and scheduling
                    </Text>
                  </Box>
                </HStack>
                
                <HStack spacing={4} mt={2}>
                  <HStack spacing={2}>
                    <Box w="3" h="3" bg="green.400" borderRadius="full" />
                    <Text fontSize="sm" opacity={0.8}>Live Updates</Text>
                  </HStack>
                  <HStack spacing={2}>
                    <Box w="3" h="3" bg="blue.400" borderRadius="full" />
                    <Text fontSize="sm" opacity={0.8}>{totalAppointments} Total</Text>
                  </HStack>
                  <HStack spacing={2}>
                    <Box w="3" h="3" bg="yellow.400" borderRadius="full" />
                    <Text fontSize="sm" opacity={0.8}>{pendingAppointments} Pending</Text>
                  </HStack>
                </HStack>
              </VStack>

              {showAddButton && (
                <HStack spacing={3}>
                  <Button
                    leftIcon={<Download size={16} />}
                    variant="outline"
                    color="white"
                    borderColor="rgba(255,255,255,0.3)"
                    _hover={{
                      bg: "rgba(255,255,255,0.1)",
                      borderColor: "rgba(255,255,255,0.5)"
                    }}
                    size="lg"
                    onClick={onExportOpen}
                  >
                    Export
                  </Button>
                  <Button
                    leftIcon={<Plus size={16} />}
                    bg="rgba(255, 255, 255, 0.2)"
                    color="white"
                    _hover={{
                      bg: "rgba(255, 255, 255, 0.3)",
                      transform: "translateY(-2px)"
                    }}
                    backdropFilter="blur(10px)"
                    size="lg"
                    onClick={onOpen}
                  >
                    New Appointment
                  </Button>
                </HStack>
              )}
            </Flex>
          </CardBody>
        </Card>
      </Box>

      {/* Statistics Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8} position="relative" zIndex={1}>
        <Card
          bg="rgba(255, 255, 255, 0.9)"
          backdropFilter="blur(20px)"
          boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.15)"
          borderRadius="2xl"
          border="1px solid"
          borderColor="rgba(255, 255, 255, 0.18)"
          _hover={{
            transform: "translateY(-4px)",
            boxShadow: "0 12px 40px 0 rgba(31, 38, 135, 0.2)"
          }}
          transition="all 0.3s"
          overflow="hidden"
          position="relative"
        >
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            h="3px"
            bg="linear-gradient(90deg, #3182ce 0%, #3182ce80 100%)"
          />
          <CardBody p={6}>
            <Flex align="center" justify="space-between">
              <Box>
                <Text fontSize="sm" color="gray.600" fontWeight="medium">Total Appointments</Text>
                <Text fontSize="3xl" fontWeight="bold" color="blue.600">{totalAppointments}</Text>
                <HStack spacing={1} mt={1}>
                  <TrendingUp size={12} color="#10b981" />
                  <Text fontSize="xs" color="green.500" fontWeight="medium">+12% from last month</Text>
                </HStack>
              </Box>
              <Box
                p={3}
                bg="blue.50"
                borderRadius="xl"
                border="1px solid"
                borderColor="blue.100"
              >
                <CalendarDays size={24} color="#3182ce" />
              </Box>
            </Flex>
          </CardBody>
        </Card>

        <Card
          bg="rgba(255, 255, 255, 0.9)"
          backdropFilter="blur(20px)"
          boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.15)"
          borderRadius="2xl"
          border="1px solid"
          borderColor="rgba(255, 255, 255, 0.18)"
          _hover={{
            transform: "translateY(-4px)",
            boxShadow: "0 12px 40px 0 rgba(31, 38, 135, 0.2)"
          }}
          transition="all 0.3s"
          overflow="hidden"
          position="relative"
        >
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            h="3px"
            bg="linear-gradient(90deg, #38a169 0%, #38a16980 100%)"
          />
          <CardBody p={6}>
            <Flex align="center" justify="space-between">
              <Box>
                <Text fontSize="sm" color="gray.600" fontWeight="medium">Today's Appointments</Text>
                <Text fontSize="3xl" fontWeight="bold" color="green.600">{todayAppointments}</Text>
                <HStack spacing={1} mt={1}>
                  <Activity size={12} color="#10b981" />
                  <Text fontSize="xs" color="green.500" fontWeight="medium">Active today</Text>
                </HStack>
              </Box>
              <Box
                p={3}
                bg="green.50"
                borderRadius="xl"
                border="1px solid"
                borderColor="green.100"
              >
                <Clock size={24} color="#38a169" />
              </Box>
            </Flex>
          </CardBody>
        </Card>

        <Card
          bg="rgba(255, 255, 255, 0.9)"
          backdropFilter="blur(20px)"
          boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.15)"
          borderRadius="2xl"
          border="1px solid"
          borderColor="rgba(255, 255, 255, 0.18)"
          _hover={{
            transform: "translateY(-4px)",
            boxShadow: "0 12px 40px 0 rgba(31, 38, 135, 0.2)"
          }}
          transition="all 0.3s"
          overflow="hidden"
          position="relative"
        >
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            h="3px"
            bg="linear-gradient(90deg, #38b2ac 0%, #38b2ac80 100%)"
          />
          <CardBody p={6}>
            <Flex align="center" justify="space-between">
              <Box>
                <Text fontSize="sm" color="gray.600" fontWeight="medium">Confirmed</Text>
                <Text fontSize="3xl" fontWeight="bold" color="teal.600">{confirmedAppointments}</Text>
                <HStack spacing={1} mt={1}>
                  <CheckCircle size={12} color="#10b981" />
                  <Text fontSize="xs" color="green.500" fontWeight="medium">Ready to go</Text>
                </HStack>
              </Box>
              <Box
                p={3}
                bg="teal.50"
                borderRadius="xl"
                border="1px solid"
                borderColor="teal.100"
              >
                <UserCheck size={24} color="#38b2ac" />
              </Box>
            </Flex>
          </CardBody>
        </Card>

        <Card
          bg="rgba(255, 255, 255, 0.9)"
          backdropFilter="blur(20px)"
          boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.15)"
          borderRadius="2xl"
          border="1px solid"
          borderColor="rgba(255, 255, 255, 0.18)"
          _hover={{
            transform: "translateY(-4px)",
            boxShadow: "0 12px 40px 0 rgba(31, 38, 135, 0.2)"
          }}
          transition="all 0.3s"
          overflow="hidden"
          position="relative"
        >
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            h="3px"
            bg="linear-gradient(90deg, #ed8936 0%, #ed893680 100%)"
          />
          <CardBody p={6}>
            <Flex align="center" justify="space-between">
              <Box>
                <Text fontSize="sm" color="gray.600" fontWeight="medium">Pending</Text>
                <Text fontSize="3xl" fontWeight="bold" color="orange.600">{pendingAppointments}</Text>
                <HStack spacing={1} mt={1}>
                  <Bell size={12} color="#f59e0b" />
                  <Text fontSize="xs" color="orange.500" fontWeight="medium">Needs attention</Text>
                </HStack>
              </Box>
              <Box
                p={3}
                bg="orange.50"
                borderRadius="xl"
                border="1px solid"
                borderColor="orange.100"
              >
                <Clock size={24} color="#ed8936" />
              </Box>
            </Flex>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Appointments Table - Simple Version */}
      <Card
        bg="rgba(255, 255, 255, 0.9)"
        backdropFilter="blur(20px)"
        boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.15)"
        borderRadius="2xl"
        border="1px solid"
        borderColor="rgba(255, 255, 255, 0.18)"
        position="relative"
        zIndex={1}
        overflow="hidden"
      >
        <CardBody p={6}>
          <Flex justify="space-between" align="center" mb={4}>
            <Text fontSize="lg" fontWeight="bold">
              Appointments List ({filteredAppointments.length} appointments)
            </Text>
            <Button
              leftIcon={<Download size={16} />}
              variant="outline"
              colorScheme="blue"
              size="sm"
              onClick={onExportOpen}
            >
              Export
            </Button>
          </Flex>
          
          {filteredAppointments.map((appointment) => (
            <Card key={appointment.id} mb={4} border="1px solid" borderColor="gray.200" 
                  _hover={{ borderColor: "blue.300", shadow: "md" }} transition="all 0.2s">
              <CardBody>
                <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4} alignItems="center">
                  <Box>
                    <Text fontWeight="bold" color="blue.600">{appointment.patientName}</Text>
                    <Text fontSize="sm" color="gray.600">ID: {appointment.patientId}</Text>
                    <HStack spacing={1} mt={1}>
                      <Phone size={12} color="#718096" />
                      <Text fontSize="xs" color="gray.500">{appointment.phone}</Text>
                    </HStack>
                  </Box>
                  <Box>
                    <Text fontWeight="medium" color="gray.700">{appointment.doctorName}</Text>
                    <Text fontSize="sm" color="gray.600">{appointment.date} at {appointment.time}</Text>
                    <Badge colorScheme={getTypeColor(appointment.type)} variant="subtle" fontSize="xs" mt={1}>
                      {appointment.type}
                    </Badge>
                  </Box>
                  <Box>
                    <Text fontSize="sm" color="gray.600" mb={1}>
                      <strong>Condition:</strong> {appointment.condition}
                    </Text>
                    <Badge colorScheme={getStatusColor(appointment.status)} variant="solid" borderRadius="full">
                      {appointment.status}
                    </Badge>
                  </Box>
                  <Box>
                    <HStack spacing={2} justify="end">
                      <Tooltip label="View Details">
                        <IconButton
                          icon={<Eye size={16} />}
                          size="sm"
                          variant="ghost"
                          colorScheme="blue"
                          aria-label="View appointment"
                        />
                      </Tooltip>
                      <Tooltip label="Edit Appointment">
                        <IconButton
                          icon={<Edit size={16} />}
                          size="sm"
                          variant="ghost"
                          colorScheme="orange"
                          aria-label="Edit appointment"
                        />
                      </Tooltip>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<MoreVertical size={16} />}
                          size="sm"
                          variant="ghost"
                          colorScheme="gray"
                          aria-label="More actions"
                        />
                        <MenuList>
                          <MenuItem 
                            icon={<CheckCircle size={16} color="#10b981" />}
                            onClick={() => handleStatusChange(appointment.id, 'Confirmed')}
                            isDisabled={appointment.status === 'Confirmed'}
                          >
                            Mark as Confirmed
                          </MenuItem>
                          <MenuItem 
                            icon={<Clock size={16} color="#f59e0b" />}
                            onClick={() => handleStatusChange(appointment.id, 'Pending')}
                            isDisabled={appointment.status === 'Pending'}
                          >
                            Mark as Pending
                          </MenuItem>
                          <MenuItem 
                            icon={<CheckCircle size={16} color="#3182ce" />}
                            onClick={() => handleStatusChange(appointment.id, 'Completed')}
                            isDisabled={appointment.status === 'Completed'}
                          >
                            Mark as Completed
                          </MenuItem>
                          <MenuItem 
                            icon={<XCircle size={16} color="#ef4444" />}
                            onClick={() => handleStatusChange(appointment.id, 'Cancelled')}
                            isDisabled={appointment.status === 'Cancelled'}
                            color="red.500"
                          >
                            Cancel Appointment
                          </MenuItem>
                          <Divider />
                          <MenuItem 
                            icon={<Phone size={16} color="#3182ce" />}
                          >
                            Call Patient
                          </MenuItem>
                          <MenuItem 
                            icon={<Mail size={16} color="#3182ce" />}
                          >
                            Send Reminder
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </HStack>
                  </Box>
                </Grid>
              </CardBody>
            </Card>
          ))}
        </CardBody>
      </Card>

      {/* New Appointment Modal */}
      <Modal isOpen={isOpen} onClose={handleModalClose} size="xl">
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent
          bg="rgba(255, 255, 255, 0.95)"
          backdropFilter="blur(20px)"
          border="1px solid"
          borderColor="rgba(255, 255, 255, 0.18)"
        >
          <ModalHeader>
            <HStack spacing={3}>
              <Box
                p={2}
                bg="blue.100"
                borderRadius="lg"
              >
                <Plus size={20} color="#3182ce" />
              </Box>
              <Text>Create New Appointment</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Box>
                <Text mb={2} fontWeight="medium" color="gray.700">
                  Patient Name <Text as="span" color="red.500">*</Text>
                </Text>
                <Input 
                  placeholder="Enter patient name" 
                  value={formData.patientName}
                  onChange={(e) => handleInputChange('patientName', e.target.value)}
                />
              </Box>
              <Box>
                <Text mb={2} fontWeight="medium" color="gray.700">Patient ID</Text>
                <Input 
                  placeholder="Auto-generated if empty" 
                  value={formData.patientId}
                  onChange={(e) => handleInputChange('patientId', e.target.value)}
                />
              </Box>
              <Box>
                <Text mb={2} fontWeight="medium" color="gray.700">
                  Doctor <Text as="span" color="red.500">*</Text>
                </Text>
                <Select 
                  placeholder="Select doctor"
                  value={formData.doctorName}
                  onChange={(e) => handleInputChange('doctorName', e.target.value)}
                >
                  <option value="Dr. Ravi Ayurveda">Dr. Ravi Ayurveda</option>
                  <option value="Dr. Priya Herbs">Dr. Priya Herbs</option>
                  <option value="Dr. Vishnu Panchakarma">Dr. Vishnu Panchakarma</option>
                  <option value="Dr. Lakshmi Skin">Dr. Lakshmi Skin</option>
                  <option value="Dr. Kumar Wellness">Dr. Kumar Wellness</option>
                </Select>
              </Box>
              <Box>
                <Text mb={2} fontWeight="medium" color="gray.700">Appointment Type</Text>
                <Select 
                  placeholder="Select type"
                  value={formData.appointmentType}
                  onChange={(e) => handleInputChange('appointmentType', e.target.value)}
                >
                  <option value="Consultation">Consultation</option>
                  <option value="Treatment">Treatment</option>
                  <option value="Panchakarma">Panchakarma</option>
                  <option value="Follow-up">Follow-up</option>
                </Select>
              </Box>
              <Box>
                <Text mb={2} fontWeight="medium" color="gray.700">
                  Date <Text as="span" color="red.500">*</Text>
                </Text>
                <Input 
                  type="date" 
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </Box>
              <Box>
                <Text mb={2} fontWeight="medium" color="gray.700">
                  Time <Text as="span" color="red.500">*</Text>
                </Text>
                <Input 
                  type="time" 
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                />
              </Box>
              <Box gridColumn="span 2">
                <Text mb={2} fontWeight="medium" color="gray.700">Phone Number</Text>
                <Input 
                  placeholder="Enter phone number" 
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </Box>
              <Box gridColumn="span 2">
                <Text mb={2} fontWeight="medium" color="gray.700">Condition/Notes</Text>
                <Input 
                  placeholder="Enter condition or notes" 
                  value={formData.condition}
                  onChange={(e) => handleInputChange('condition', e.target.value)}
                />
              </Box>
            </SimpleGrid>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleModalClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              leftIcon={<Plus size={16} />}
              onClick={handleCreateAppointment}
              isDisabled={!formData.patientName || !formData.doctorName || !formData.date || !formData.time}
            >
              Create Appointment
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Export Options Modal */}
      <Modal isOpen={isExportOpen} onClose={onExportClose} size="md">
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent
          bg="rgba(255, 255, 255, 0.95)"
          backdropFilter="blur(20px)"
          border="1px solid"
          borderColor="rgba(255, 255, 255, 0.18)"
        >
          <ModalHeader>
            <HStack spacing={3}>
              <Box
                p={2}
                bg="green.100"
                borderRadius="lg"
              >
                <Download size={20} color="#38a169" />
              </Box>
              <Text>Export Appointments</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              <Text fontSize="sm" color="gray.600" mb={2}>
                Choose your preferred export format for {filteredAppointments.length} appointments:
              </Text>
              
              <Button
                leftIcon={<FileText size={20} color="#dc2626" />}
                onClick={exportToPDF}
                variant="outline"
                borderColor="red.200"
                _hover={{
                  bg: "red.50",
                  borderColor: "red.300"
                }}
                justifyContent="flex-start"
                h="60px"
              >
                <VStack align="start" spacing={0} ml={2}>
                  <Text fontWeight="bold">Export as PDF</Text>
                  <Text fontSize="xs" color="gray.500">
                    Formatted document with styling
                  </Text>
                </VStack>
              </Button>

              <Button
                leftIcon={<FileText size={20} color="#059669" />}
                onClick={exportToCSV}
                variant="outline"
                borderColor="green.200"
                _hover={{
                  bg: "green.50",
                  borderColor: "green.300"
                }}
                justifyContent="flex-start"
                h="60px"
              >
                <VStack align="start" spacing={0} ml={2}>
                  <Text fontWeight="bold">Export as CSV</Text>
                  <Text fontSize="xs" color="gray.500">
                    Comma-separated values for data analysis
                  </Text>
                </VStack>
              </Button>

              <Button
                leftIcon={<FileText size={20} color="#0369a1" />}
                onClick={exportToExcel}
                variant="outline"
                borderColor="blue.200"
                _hover={{
                  bg: "blue.50",
                  borderColor: "blue.300"
                }}
                justifyContent="flex-start"
                h="60px"
              >
                <VStack align="start" spacing={0} ml={2}>
                  <Text fontWeight="bold">Export as Excel</Text>
                  <Text fontSize="xs" color="gray.500">
                    Spreadsheet with formatting and formulas
                  </Text>
                </VStack>
              </Button>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onExportClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AppointmentManagement;
