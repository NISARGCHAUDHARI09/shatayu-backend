import React, { useState, useEffect, useRef } from 'react';
import { apiClient } from '../../../lib/apiClient';
import { useAuth } from '../../../contexts/AuthContext';
import {
  Box,
  VStack,
  HStack,
  Card,
  CardHeader,
  CardBody,
  Text,
  Button,
  IconButton,
  Input,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  Badge,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  SimpleGrid,
  useDisclosure,
  useToast,
  Flex,
  Spacer,
  InputGroup,
  InputLeftElement,
  Divider,
  Tooltip,
  useColorModeValue,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Progress,
  Image,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Switch,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay
} from '@chakra-ui/react';
import {
  Users,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  Eye,
  UserPlus,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  MoreVertical,
  User,
  Briefcase,
  Award,
  DollarSign,
  TrendingUp,
  Activity,
  FileText,
  Settings,
  Shield,
  Building,
  UserCheck
} from 'lucide-react';

const StaffManagement = () => {
  // Color mode values
  const bg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  // Modal states
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isLeaveOpen, onOpen: onLeaveOpen, onClose: onLeaveClose } = useDisclosure();

  const toast = useToast();
  const cancelRef = useRef();

  // State management
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState({
    total: 0,
    active: 0,
    onLeave: 0,
    inactive: 0,
    avgPerformance: 0
  });

  const [selectedStaff, setSelectedStaff] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentTab, setCurrentTab] = useState(0);

  // Form state for add/edit
  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    joinDate: '',
    salary: '',
    status: 'Active',
    address: '',
    experience: '',
    qualification: '',
    emergencyContact: '',
    bloodGroup: '',
    workingHours: ''
  });

  // Leave management state
  const [leaveFormData, setLeaveFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
    status: 'Pending'
  });

  // Sample leave data for staff
  const [leaveData, setLeaveData] = useState({});
  const [departments, setDepartments] = useState([]);

  // Reset form
  const resetForm = () => {
    setFormData({
      employeeId: '',
      name: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      joinDate: '',
      salary: '',
      status: 'Active',
      address: '',
      experience: '',
      qualification: '',
      emergencyContact: '',
      bloodGroup: '',
      workingHours: ''
    });
  };

  // Authentication
  const { user } = useAuth();

  // API Functions using authenticated API client
  
  // Fetch all staff
  const fetchStaff = async () => {
    try {
      setLoading(true);
      
      // Check if user has admin access for staff management
      if (user?.role !== 'admin') {
        setNotification({
          type: 'error',
          title: 'Access Denied',
          description: 'Staff management requires admin privileges',
        });
        setLoading(false);
        return;
      }
      
      const response = await apiClient.getStaff(1, 100); // Get more records for staff management
      
      if (response.success) {
        // Map backend fields to frontend format
        const mappedStaff = response.data.map(staff => ({
          id: staff.id,
          employeeId: staff.employee_id,
          name: staff.name,
          email: staff.email,
          phone: staff.phone,
          position: staff.position,
          department: staff.department,
          joinDate: staff.join_date,
          salary: staff.salary,
          status: staff.status,
          avatar: staff.avatar || '',
          address: staff.address || '',
          experience: staff.experience || '',
          qualification: staff.qualification || '',
          emergencyContact: staff.emergency_contact || '',
          bloodGroup: staff.blood_group || '',
          workingHours: staff.working_hours || '',
          performance: staff.performance || 0
        }));
        setStaffList(mappedStaff);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch staff data',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
      toast({
        title: 'Error',
        description: 'Failed to connect to server',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      // Fallback to mock data if API fails
      setStaffList([
        {
          id: 1,
          employeeId: 'EMP001',
          name: 'Dr. Rajesh Kumar',
          email: 'rajesh.kumar@hospital.com',
          phone: '+91 9876543210',
          position: 'Senior Doctor',
          department: 'Cardiology',
          joinDate: '2020-01-15',
          salary: 75000,
          status: 'Active',
          avatar: '',
          address: '123 Medical Street, New Delhi',
          experience: '8 years',
          qualification: 'MBBS, MD Cardiology',
          emergencyContact: '+91 9876543211',
          bloodGroup: 'O+',
          workingHours: '9:00 AM - 6:00 PM',
          performance: 95
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStatistics = async () => {
    try {
      if (user?.role !== 'admin') {
        return; // Skip if not admin
      }
      
      const response = await apiClient.getStaffStatistics();
      if (response.success) {
        const stats = response.data.overall || response.data;
        setStatistics({
          total: stats.total_staff || stats.total || 0,
          active: stats.active_staff || stats.active || 0,
          onLeave: stats.on_leave_staff || stats.onLeave || 0,
          inactive: stats.inactive_staff,
          avgPerformance: Math.round(stats.avg_performance || 0)
        });
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/staff/departments`);
      if (response.data.success) {
        setDepartments(response.data.data.map(dept => dept.name));
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      // Fallback to default departments
      setDepartments([
        'Cardiology', 'ICU', 'Pharmacy', 'Pediatrics', 'Laboratory', 
        'Radiology', 'Emergency', 'Surgery', 'Orthopedics', 'Gynecology'
      ]);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchStaff();
    fetchStatistics();
    fetchDepartments();
  }, []);

  // Reload staff when filters change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchStaff();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, filterDepartment, filterStatus]);

  // Filter staff based on search and filters
  const filteredStaff = staffList.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || staff.department === filterDepartment;
    const matchesStatus = filterStatus === 'all' || staff.status === filterStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Statistics
  const stats = {
    total: statistics.total || staffList.length,
    active: statistics.active || staffList.filter(s => s.status === 'Active').length,
    onLeave: statistics.onLeave || staffList.filter(s => s.status === 'On Leave').length,
    inactive: statistics.inactive || staffList.filter(s => s.status === 'Inactive').length,
    avgPerformance: statistics.avgPerformance || (staffList.length > 0 ? Math.round(staffList.reduce((acc, s) => acc + s.performance, 0) / staffList.length) : 0)
  };

  // Handle add staff
  const handleAddStaff = async () => {
    try {
      setLoading(true);
      
      // Map frontend fields to backend format
      const staffData = {
        employee_id: formData.employeeId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        department: formData.department,
        join_date: formData.joinDate,
        salary: parseFloat(formData.salary) || 0,
        status: formData.status,
        address: formData.address,
        experience: formData.experience,
        qualification: formData.qualification,
        emergency_contact: formData.emergencyContact,
        blood_group: formData.bloodGroup,
        working_hours: formData.workingHours
      };

      const response = await axios.post(`${API_BASE_URL}/staff`, staffData);
      
      if (response.data.success) {
        resetForm();
        onAddClose();
        fetchStaff(); // Reload staff list
        fetchStatistics(); // Update statistics
        toast({
          title: 'Staff Added',
          description: `${formData.name} has been added successfully.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error',
          description: response.data.message || 'Failed to add staff member',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error adding staff:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to add staff member',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle edit staff
  const handleEditStaff = async () => {
    try {
      setLoading(true);
      
      // Map frontend fields to backend format
      const staffData = {
        employee_id: formData.employeeId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        department: formData.department,
        join_date: formData.joinDate,
        salary: parseFloat(formData.salary) || 0,
        status: formData.status,
        address: formData.address,
        experience: formData.experience,
        qualification: formData.qualification,
        emergency_contact: formData.emergencyContact,
        blood_group: formData.bloodGroup,
        working_hours: formData.workingHours,
        performance: formData.performance || 0
      };

      const response = await axios.put(`${API_BASE_URL}/staff/${selectedStaff.id}`, staffData);
      
      if (response.data.success) {
        resetForm();
        setSelectedStaff(null);
        onEditClose();
        fetchStaff(); // Reload staff list
        fetchStatistics(); // Update statistics
        toast({
          title: 'Staff Updated',
          description: `${formData.name} has been updated successfully.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error',
          description: response.data.message || 'Failed to update staff member',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error updating staff:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update staff member',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle delete staff
  const handleDeleteStaff = async () => {
    try {
      setLoading(true);
      
      const response = await axios.delete(`${API_BASE_URL}/staff/${selectedStaff.id}`);
      
      if (response.data.success) {
        onDeleteClose();
        fetchStaff(); // Reload staff list
        fetchStatistics(); // Update statistics
        toast({
          title: 'Staff Deactivated',
          description: `${selectedStaff.name} has been deactivated successfully.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setSelectedStaff(null);
      } else {
        toast({
          title: 'Error',
          description: response.data.message || 'Failed to delete staff member',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error deleting staff:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete staff member',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Open edit modal with staff data
  const openEditModal = (staff) => {
    setSelectedStaff(staff);
    setFormData(staff);
    onEditOpen();
  };

  // Open view modal
  const openViewModal = (staff) => {
    setSelectedStaff(staff);
    onViewOpen();
  };

  // Open delete confirmation
  const openDeleteModal = (staff) => {
    setSelectedStaff(staff);
    onDeleteOpen();
  };

  // Handle staff import
  const handleImportStaff = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      
      // For simplicity, we'll assume the file contains JSON data
      // In a real application, you might want to use a library like XLSX to parse Excel files
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const staffData = JSON.parse(e.target.result);
          
          if (!Array.isArray(staffData)) {
            throw new Error('File should contain an array of staff data');
          }

          const response = await axios.post(`${API_BASE_URL}/staff/import`, { staffData });
          
          if (response.data.success) {
            const results = response.data.data;
            fetchStaff(); // Reload staff list
            fetchStatistics(); // Update statistics
            
            toast({
              title: 'Import Completed',
              description: `Successfully imported ${results.successful} staff members. ${results.failed} failed.`,
              status: results.failed > 0 ? 'warning' : 'success',
              duration: 5000,
              isClosable: true,
            });
          } else {
            toast({
              title: 'Import Failed',
              description: response.data.message || 'Failed to import staff data',
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
          }
        } catch (parseError) {
          console.error('Error parsing file:', parseError);
          toast({
            title: 'File Error',
            description: 'Invalid file format. Please check your file and try again.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error('Error importing staff:', error);
      toast({
        title: 'Import Error',
        description: 'Failed to import staff data',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      // Clear the file input
      event.target.value = '';
    }
  };
  const fetchStaffLeave = async (staffId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/staff/${staffId}/leave`);
      if (response.data.success) {
        const leaves = response.data.data.map(leave => ({
          id: leave.id,
          leaveType: leave.leave_type,
          startDate: leave.start_date,
          endDate: leave.end_date,
          reason: leave.reason,
          status: leave.status,
          appliedDate: leave.applied_date
        }));
        
        setLeaveData(prev => ({
          ...prev,
          [staffId]: leaves
        }));
      }
    } catch (error) {
      console.error('Error fetching leave data:', error);
    }
  };

  // Open leave management modal
  const openLeaveModal = (staff) => {
    setSelectedStaff(staff);
    setLeaveFormData({
      leaveType: '',
      startDate: '',
      endDate: '',
      reason: '',
      status: 'Pending'
    });
    fetchStaffLeave(staff.id); // Load leave data
    onLeaveOpen();
  };

  // Handle apply leave
  const handleApplyLeave = async () => {
    try {
      setLoading(true);
      
      const leaveRequest = {
        staff_id: selectedStaff.id,
        leave_type: leaveFormData.leaveType,
        start_date: leaveFormData.startDate,
        end_date: leaveFormData.endDate,
        reason: leaveFormData.reason,
        status: leaveFormData.status
      };

      const response = await axios.post(`${API_BASE_URL}/staff/leave/apply`, leaveRequest);
      
      if (response.data.success) {
        // Update local leave data
        const newLeave = {
          id: response.data.data.id,
          leaveType: response.data.data.leave_type,
          startDate: response.data.data.start_date,
          endDate: response.data.data.end_date,
          reason: response.data.data.reason,
          status: response.data.data.status,
          appliedDate: response.data.data.applied_date
        };

        setLeaveData(prev => ({
          ...prev,
          [selectedStaff.id]: [...(prev[selectedStaff.id] || []), newLeave]
        }));

        setLeaveFormData({
          leaveType: '',
          startDate: '',
          endDate: '',
          reason: '',
          status: 'Pending'
        });

        toast({
          title: 'Leave Applied',
          description: `Leave application for ${selectedStaff.name} has been submitted successfully.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error',
          description: response.data.message || 'Failed to apply for leave',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error applying for leave:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to apply for leave',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle leave status update
  const handleLeaveStatusUpdate = async (staffId, leaveId, newStatus) => {
    try {
      setLoading(true);
      
      const response = await axios.put(`${API_BASE_URL}/staff/leave/${leaveId}/status`, {
        status: newStatus
      });
      
      if (response.data.success) {
        setLeaveData(prev => ({
          ...prev,
          [staffId]: prev[staffId].map(leave => 
            leave.id === leaveId ? { ...leave, status: newStatus } : leave
          )
        }));

        toast({
          title: 'Leave Status Updated',
          description: `Leave has been ${newStatus.toLowerCase()}.`,
          status: newStatus === 'Approved' ? 'success' : 'warning',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error',
          description: response.data.message || 'Failed to update leave status',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error updating leave status:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update leave status',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Get leave status color
  const getLeaveStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'green';
      case 'Pending': return 'yellow';
      case 'Rejected': return 'red';
      default: return 'gray';
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'green';
      case 'On Leave': return 'yellow';
      case 'Inactive': return 'red';
      default: return 'gray';
    }
  };

  // Get performance color
  const getPerformanceColor = (performance) => {
    if (performance >= 90) return 'green';
    if (performance >= 75) return 'yellow';
    return 'red';
  };

  return (
    <Box p={6} bg={bg} minH="100vh">
      {/* Header */}
      <Card mb={6} shadow="xl" borderRadius="2xl" bg="gradient-to-r" bgGradient="linear(to-r, blue.600, purple.600)">
        <CardBody p={8}>
          <Flex justify="space-between" align="center" color="white">
            <Box>
              <HStack spacing={3} mb={2}>
                <Users size={32} />
                <Text fontSize="3xl" fontWeight="bold">
                  Staff Management
                </Text>
              </HStack>
              <Text fontSize="lg" opacity={0.9}>
                Comprehensive staff administration and management system
              </Text>
              <HStack spacing={4} mt={3}>
                <Badge colorScheme="whiteAlpha" variant="solid" px={3} py={1}>
                  <HStack spacing={1}>
                    <Activity size={14} />
                    <Text>{stats.total} Total Staff</Text>
                  </HStack>
                </Badge>
                <Badge colorScheme="whiteAlpha" variant="solid" px={3} py={1}>
                  <HStack spacing={1}>
                    <CheckCircle size={14} />
                    <Text>{stats.active} Active</Text>
                  </HStack>
                </Badge>
                <Badge colorScheme="whiteAlpha" variant="solid" px={3} py={1}>
                  <HStack spacing={1}>
                    <TrendingUp size={14} />
                    <Text>{stats.avgPerformance}% Avg Performance</Text>
                  </HStack>
                </Badge>
              </HStack>
            </Box>
            <HStack spacing={3}>
              <Button 
                leftIcon={<Download />} 
                bgGradient="linear(to-r, blue.500, blue.700)"
                color="white"
                _hover={{ bgGradient: 'linear(to-r, blue.600, blue.800)', transform: 'translateY(-2px)', shadow: 'lg' }}
                transition="all 0.2s"
                px={6}
              >
                Export
              </Button>
              <Button 
                leftIcon={<Upload />} 
                bgGradient="linear(to-r, blue.500, blue.700)"
                color="white"
                _hover={{ bgGradient: 'linear(to-r, blue.600, blue.800)', transform: 'translateY(-2px)', shadow: 'lg' }}
                transition="all 0.2s"
                px={6}
                as="label"
                cursor="pointer"
              >
                Import
                <input
                  type="file"
                  accept=".json,.xlsx,.csv"
                  onChange={handleImportStaff}
                  style={{ display: 'none' }}
                />
              </Button>
              <Button 
                bgGradient="linear(to-r, blue.500, blue.700)"
                color="white"
                leftIcon={<UserPlus />} 
                size="lg"
                _hover={{ bgGradient: 'linear(to-r, blue.600, blue.800)', transform: 'translateY(-2px)', shadow: 'xl' }}
                transition="all 0.2s"
                onClick={onAddOpen}
                px={8}
                isLoading={loading}
                loadingText="Loading..."
              >
                Add New Staff
              </Button>
            </HStack>
          </Flex>
        </CardBody>
      </Card>

      {/* Statistics Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <Card bg={cardBg} shadow="lg" borderRadius="xl" border="1px" borderColor={borderColor}>
          <CardBody p={6}>
            <Stat>
              <Flex align="center" justify="space-between">
                <Box>
                  <StatLabel color={mutedColor} fontSize="sm" fontWeight="medium">Total Staff</StatLabel>
                  <StatNumber fontSize="2xl" fontWeight="bold" color="blue.500">{stats.total}</StatNumber>
                  <StatHelpText color={mutedColor} fontSize="xs">
                    <StatArrow type="increase" />
                    12% from last month
                  </StatHelpText>
                </Box>
                <Box p={3} bg="blue.100" borderRadius="lg">
                  <Users size={24} color="#3182CE" />
                </Box>
              </Flex>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg} shadow="lg" borderRadius="xl" border="1px" borderColor={borderColor}>
          <CardBody p={6}>
            <Stat>
              <Flex align="center" justify="space-between">
                <Box>
                  <StatLabel color={mutedColor} fontSize="sm" fontWeight="medium">Active Staff</StatLabel>
                  <StatNumber fontSize="2xl" fontWeight="bold" color="green.500">{stats.active}</StatNumber>
                  <StatHelpText color={mutedColor} fontSize="xs">
                    <StatArrow type="increase" />
                    5% from last month
                  </StatHelpText>
                </Box>
                <Box p={3} bg="green.100" borderRadius="lg">
                  <UserCheck size={24} color="#38A169" />
                </Box>
              </Flex>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg} shadow="lg" borderRadius="xl" border="1px" borderColor={borderColor}>
          <CardBody p={6}>
            <Stat>
              <Flex align="center" justify="space-between">
                <Box>
                  <StatLabel color={mutedColor} fontSize="sm" fontWeight="medium">On Leave</StatLabel>
                  <StatNumber fontSize="2xl" fontWeight="bold" color="yellow.500">{stats.onLeave}</StatNumber>
                  <StatHelpText color={mutedColor} fontSize="xs">
                    Temporary absence
                  </StatHelpText>
                </Box>
                <Box p={3} bg="yellow.100" borderRadius="lg">
                  <Calendar size={24} color="#D69E2E" />
                </Box>
              </Flex>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg} shadow="lg" borderRadius="xl" border="1px" borderColor={borderColor}>
          <CardBody p={6}>
            <Stat>
              <Flex align="center" justify="space-between">
                <Box>
                  <StatLabel color={mutedColor} fontSize="sm" fontWeight="medium">Avg Performance</StatLabel>
                  <StatNumber fontSize="2xl" fontWeight="bold" color="purple.500">{stats.avgPerformance}%</StatNumber>
                  <StatHelpText color={mutedColor} fontSize="xs">
                    <StatArrow type="increase" />
                    3% improvement
                  </StatHelpText>
                </Box>
                <Box p={3} bg="purple.100" borderRadius="lg">
                  <Award size={24} color="#805AD5" />
                </Box>
              </Flex>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Search and Filters */}
      <Card bg={cardBg} shadow="lg" borderRadius="xl" mb={6} border="1px" borderColor={borderColor}>
        <CardBody p={6}>
          <Flex direction={{ base: 'column', md: 'row' }} gap={4} align="center">
            <InputGroup maxW="400px">
              <InputLeftElement>
                <Search size={18} color="gray" />
              </InputLeftElement>
              <Input
                placeholder="Search by name, employee ID, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                bg="white"
                border="1px"
                borderColor="gray.300"
                _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182CE' }}
              />
            </InputGroup>
            
            <Select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              maxW="200px"
              bg="white"
              border="1px"
              borderColor="gray.300"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </Select>

            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              maxW="150px"
              bg="white"
              border="1px"
              borderColor="gray.300"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </Select>

            <Spacer />
            
            <HStack spacing={2}>
              <Tooltip label="Reset Filters">
                <IconButton
                  icon={<Filter />}
                  variant="outline"
                  colorScheme="gray"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterDepartment('all');
                    setFilterStatus('all');
                  }}
                />
              </Tooltip>
            </HStack>
          </Flex>
        </CardBody>
      </Card>

      {/* Staff Table */}
      <Card bg={cardBg} shadow="lg" borderRadius="xl" border="1px" borderColor={borderColor}>
        <CardBody p={0}>
          <TableContainer>
            <Table variant="simple">
              <Thead bg="gray.50">
                <Tr>
                  <Th py={4} borderColor={borderColor}>Staff</Th>
                  <Th py={4} borderColor={borderColor}>Employee ID</Th>
                  <Th py={4} borderColor={borderColor}>Position</Th>
                  <Th py={4} borderColor={borderColor}>Department</Th>
                  <Th py={4} borderColor={borderColor}>Contact</Th>
                  <Th py={4} borderColor={borderColor}>Join Date</Th>
                  <Th py={4} borderColor={borderColor}>Performance</Th>
                  <Th py={4} borderColor={borderColor}>Status</Th>
                  <Th py={4} borderColor={borderColor}>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredStaff.map((staff) => (
                  <Tr key={staff.id} _hover={{ bg: "gray.50" }} transition="all 0.2s">
                    <Td py={4} borderColor={borderColor}>
                      <HStack spacing={3}>
                        <Avatar
                          size="md"
                          name={staff.name}
                          src={staff.avatar}
                          bg="blue.500"
                        />
                        <Box>
                          <Text fontWeight="semibold" color={textColor}>{staff.name}</Text>
                          <Text fontSize="sm" color={mutedColor}>{staff.email}</Text>
                        </Box>
                      </HStack>
                    </Td>
                    <Td py={4} borderColor={borderColor}>
                      <Text fontWeight="medium" color={textColor}>{staff.employeeId}</Text>
                    </Td>
                    <Td py={4} borderColor={borderColor}>
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="medium" color={textColor}>{staff.position}</Text>
                        <Text fontSize="sm" color={mutedColor}>{staff.experience}</Text>
                      </VStack>
                    </Td>
                    <Td py={4} borderColor={borderColor}>
                      <Badge colorScheme="blue" variant="outline" fontSize="xs">
                        {staff.department}
                      </Badge>
                    </Td>
                    <Td py={4} borderColor={borderColor}>
                      <VStack align="start" spacing={0}>
                        <HStack spacing={1}>
                          <Phone size={12} />
                          <Text fontSize="sm" color={textColor}>{staff.phone}</Text>
                        </HStack>
                        <HStack spacing={1}>
                          <Mail size={12} />
                          <Text fontSize="xs" color={mutedColor}>{staff.email}</Text>
                        </HStack>
                      </VStack>
                    </Td>
                    <Td py={4} borderColor={borderColor}>
                      <Text fontSize="sm" color={textColor}>{new Date(staff.joinDate).toLocaleDateString()}</Text>
                    </Td>
                    <Td py={4} borderColor={borderColor}>
                      <VStack align="start" spacing={1}>
                        <Text fontSize="sm" fontWeight="medium" color={textColor}>{staff.performance}%</Text>
                        <Progress
                          value={staff.performance}
                          size="sm"
                          colorScheme={getPerformanceColor(staff.performance)}
                          width="60px"
                          borderRadius="full"
                        />
                      </VStack>
                    </Td>
                    <Td py={4} borderColor={borderColor}>
                      <Badge colorScheme={getStatusColor(staff.status)} variant="solid">
                        {staff.status}
                      </Badge>
                    </Td>
                    <Td py={4} borderColor={borderColor}>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<MoreVertical size={18} />}
                          variant="ghost"
                          size="sm"
                        />
                        <MenuList>
                          <MenuItem icon={<Eye size={16} />} onClick={() => openViewModal(staff)}>
                            View Details
                          </MenuItem>
                          <MenuItem icon={<Edit size={16} />} onClick={() => openEditModal(staff)}>
                            Edit Staff
                          </MenuItem>
                          <MenuItem icon={<Calendar size={16} />} onClick={() => openLeaveModal(staff)}>
                            Manage Leave
                          </MenuItem>
                          <MenuItem 
                            icon={<Trash2 size={16} />} 
                            onClick={() => openDeleteModal(staff)}
                            color="red.500"
                          >
                            Delete Staff
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          
          {filteredStaff.length === 0 && (
            <Box textAlign="center" py={10}>
              <Users size={48} color="gray" style={{ margin: '0 auto 16px' }} />
              <Text fontSize="lg" color={mutedColor} fontWeight="medium">No staff found</Text>
              <Text fontSize="sm" color={mutedColor}>Try adjusting your search or filters</Text>
            </Box>
          )}
        </CardBody>
      </Card>

      {/* Add Staff Modal */}
      <Modal isOpen={isAddOpen} onClose={() => { onAddClose(); resetForm(); }} size="4xl">
        <ModalOverlay />
        <ModalContent maxH="90vh" overflowY="auto">
          <ModalHeader>
            <HStack>
              <UserPlus size={24} />
              <Text>Add New Staff Member</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Tabs>
              <TabList>
                <Tab>Basic Information</Tab>
                <Tab>Contact & Personal</Tab>
                <Tab>Employment Details</Tab>
              </TabList>
              <TabPanels>
                <TabPanel px={0}>
                  <VStack spacing={4} align="stretch">
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>Full Name</FormLabel>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="Enter full name"
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Employee ID</FormLabel>
                        <Input
                          value={formData.employeeId}
                          onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                          placeholder="Auto-generated if empty"
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Email Address</FormLabel>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="Enter email address"
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Phone Number</FormLabel>
                        <Input
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="Enter phone number"
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Position</FormLabel>
                        <Input
                          value={formData.position}
                          onChange={(e) => setFormData({...formData, position: e.target.value})}
                          placeholder="Enter position/designation"
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Department</FormLabel>
                        <Select
                          value={formData.department}
                          onChange={(e) => setFormData({...formData, department: e.target.value})}
                          placeholder="Select department"
                        >
                          {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </Select>
                      </FormControl>
                    </SimpleGrid>
                  </VStack>
                </TabPanel>
                
                <TabPanel px={0}>
                  <VStack spacing={4} align="stretch">
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <FormControl>
                        <FormLabel>Address</FormLabel>
                        <Textarea
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          placeholder="Enter full address"
                          rows={3}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Emergency Contact</FormLabel>
                        <Input
                          value={formData.emergencyContact}
                          onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                          placeholder="Emergency contact number"
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Blood Group</FormLabel>
                        <Select
                          value={formData.bloodGroup}
                          onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                          placeholder="Select blood group"
                        >
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </Select>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Qualification</FormLabel>
                        <Input
                          value={formData.qualification}
                          onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                          placeholder="Educational qualification"
                        />
                      </FormControl>
                    </SimpleGrid>
                  </VStack>
                </TabPanel>
                
                <TabPanel px={0}>
                  <VStack spacing={4} align="stretch">
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>Join Date</FormLabel>
                        <Input
                          type="date"
                          value={formData.joinDate}
                          onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Salary</FormLabel>
                        <NumberInput
                          value={formData.salary}
                          onChange={(value) => setFormData({...formData, salary: value})}
                        >
                          <NumberInputField placeholder="Enter salary amount" />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Experience</FormLabel>
                        <Input
                          value={formData.experience}
                          onChange={(e) => setFormData({...formData, experience: e.target.value})}
                          placeholder="e.g., 5 years"
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Working Hours</FormLabel>
                        <Input
                          value={formData.workingHours}
                          onChange={(e) => setFormData({...formData, workingHours: e.target.value})}
                          placeholder="e.g., 9:00 AM - 6:00 PM"
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Status</FormLabel>
                        <Select
                          value={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.value})}
                        >
                          <option value="Active">Active</option>
                          <option value="On Leave">On Leave</option>
                          <option value="Inactive">Inactive</option>
                        </Select>
                      </FormControl>
                    </SimpleGrid>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => { onAddClose(); resetForm(); }}>
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleAddStaff}
              isLoading={loading}
              loadingText="Adding..."
            >
              Add Staff Member
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Staff Modal */}
      <Modal isOpen={isEditOpen} onClose={() => { onEditClose(); resetForm(); setSelectedStaff(null); }} size="4xl">
        <ModalOverlay />
        <ModalContent maxH="90vh" overflowY="auto">
          <ModalHeader>
            <HStack>
              <Edit size={24} />
              <Text>Edit Staff Member</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Tabs>
              <TabList>
                <Tab>Basic Information</Tab>
                <Tab>Contact & Personal</Tab>
                <Tab>Employment Details</Tab>
              </TabList>
              <TabPanels>
                <TabPanel px={0}>
                  <VStack spacing={4} align="stretch">
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>Full Name</FormLabel>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="Enter full name"
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Employee ID</FormLabel>
                        <Input
                          value={formData.employeeId}
                          onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                          placeholder="Employee ID"
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Email Address</FormLabel>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="Enter email address"
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Phone Number</FormLabel>
                        <Input
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="Enter phone number"
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Position</FormLabel>
                        <Input
                          value={formData.position}
                          onChange={(e) => setFormData({...formData, position: e.target.value})}
                          placeholder="Enter position/designation"
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Department</FormLabel>
                        <Select
                          value={formData.department}
                          onChange={(e) => setFormData({...formData, department: e.target.value})}
                          placeholder="Select department"
                        >
                          {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </Select>
                      </FormControl>
                    </SimpleGrid>
                  </VStack>
                </TabPanel>
                
                <TabPanel px={0}>
                  <VStack spacing={4} align="stretch">
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <FormControl>
                        <FormLabel>Address</FormLabel>
                        <Textarea
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          placeholder="Enter full address"
                          rows={3}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Emergency Contact</FormLabel>
                        <Input
                          value={formData.emergencyContact}
                          onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                          placeholder="Emergency contact number"
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Blood Group</FormLabel>
                        <Select
                          value={formData.bloodGroup}
                          onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                          placeholder="Select blood group"
                        >
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </Select>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Qualification</FormLabel>
                        <Input
                          value={formData.qualification}
                          onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                          placeholder="Educational qualification"
                        />
                      </FormControl>
                    </SimpleGrid>
                  </VStack>
                </TabPanel>
                
                <TabPanel px={0}>
                  <VStack spacing={4} align="stretch">
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>Join Date</FormLabel>
                        <Input
                          type="date"
                          value={formData.joinDate}
                          onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Salary</FormLabel>
                        <NumberInput
                          value={formData.salary}
                          onChange={(value) => setFormData({...formData, salary: value})}
                        >
                          <NumberInputField placeholder="Enter salary amount" />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Experience</FormLabel>
                        <Input
                          value={formData.experience}
                          onChange={(e) => setFormData({...formData, experience: e.target.value})}
                          placeholder="e.g., 5 years"
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Working Hours</FormLabel>
                        <Input
                          value={formData.workingHours}
                          onChange={(e) => setFormData({...formData, workingHours: e.target.value})}
                          placeholder="e.g., 9:00 AM - 6:00 PM"
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Status</FormLabel>
                        <Select
                          value={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.value})}
                        >
                          <option value="Active">Active</option>
                          <option value="On Leave">On Leave</option>
                          <option value="Inactive">Inactive</option>
                        </Select>
                      </FormControl>
                    </SimpleGrid>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => { onEditClose(); resetForm(); setSelectedStaff(null); }}>
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleEditStaff}
              isLoading={loading}
              loadingText="Updating..."
            >
              Update Staff Member
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View Staff Modal */}
      <Modal isOpen={isViewOpen} onClose={() => { onViewClose(); setSelectedStaff(null); }} size="4xl">
        <ModalOverlay />
        <ModalContent maxH="90vh" overflowY="auto">
          <ModalHeader>
            <HStack>
              <Eye size={24} />
              <Text>Staff Details</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedStaff && (
              <VStack spacing={6} align="stretch">
                {/* Staff Header */}
                <Box p={6} bg="blue.50" borderRadius="lg">
                  <HStack spacing={4}>
                    <Avatar size="xl" name={selectedStaff.name} src={selectedStaff.avatar} />
                    <VStack align="start" spacing={1}>
                      <Text fontSize="2xl" fontWeight="bold">{selectedStaff.name}</Text>
                      <Text color="gray.600" fontSize="lg">{selectedStaff.position}</Text>
                      <HStack spacing={2}>
                        <Badge colorScheme={getStatusColor(selectedStaff.status)}>
                          {selectedStaff.status}
                        </Badge>
                        <Badge colorScheme="blue" variant="outline">
                          {selectedStaff.department}
                        </Badge>
                      </HStack>
                      <HStack spacing={4} mt={2}>
                        <HStack spacing={1}>
                          <Phone size={16} />
                          <Text fontSize="sm">{selectedStaff.phone}</Text>
                        </HStack>
                        <HStack spacing={1}>
                          <Mail size={16} />
                          <Text fontSize="sm">{selectedStaff.email}</Text>
                        </HStack>
                      </HStack>
                    </VStack>
                  </HStack>
                </Box>

                {/* Details Tabs */}
                <Tabs>
                  <TabList>
                    <Tab>Personal Information</Tab>
                    <Tab>Employment Details</Tab>
                    <Tab>Performance</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel px={0}>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        <Box>
                          <Text fontSize="sm" color="gray.600" mb={1}>Employee ID</Text>
                          <Text fontWeight="medium">{selectedStaff.employeeId}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.600" mb={1}>Blood Group</Text>
                          <Text fontWeight="medium">{selectedStaff.bloodGroup}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.600" mb={1}>Emergency Contact</Text>
                          <Text fontWeight="medium">{selectedStaff.emergencyContact}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.600" mb={1}>Qualification</Text>
                          <Text fontWeight="medium">{selectedStaff.qualification}</Text>
                        </Box>
                        <Box gridColumn={{ md: "span 2" }}>
                          <Text fontSize="sm" color="gray.600" mb={1}>Address</Text>
                          <Text fontWeight="medium">{selectedStaff.address}</Text>
                        </Box>
                      </SimpleGrid>
                    </TabPanel>
                    
                    <TabPanel px={0}>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        <Box>
                          <Text fontSize="sm" color="gray.600" mb={1}>Join Date</Text>
                          <Text fontWeight="medium">{new Date(selectedStaff.joinDate).toLocaleDateString()}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.600" mb={1}>Experience</Text>
                          <Text fontWeight="medium">{selectedStaff.experience}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.600" mb={1}>Working Hours</Text>
                          <Text fontWeight="medium">{selectedStaff.workingHours}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="sm" color="gray.600" mb={1}>Salary</Text>
                          <Text fontWeight="medium">₹{selectedStaff.salary?.toLocaleString()}</Text>
                        </Box>
                      </SimpleGrid>
                    </TabPanel>
                    
                    <TabPanel px={0}>
                      <VStack spacing={6} align="stretch">
                        <Box>
                          <Text fontSize="lg" fontWeight="semibold" mb={4}>Performance Overview</Text>
                          <HStack spacing={4} align="center">
                            <Box flex="1">
                              <Text fontSize="sm" color="gray.600" mb={2}>Overall Performance</Text>
                              <Progress
                                value={selectedStaff.performance}
                                size="lg"
                                colorScheme={getPerformanceColor(selectedStaff.performance)}
                                borderRadius="full"
                              />
                            </Box>
                            <Box>
                              <Text fontSize="2xl" fontWeight="bold" color={`${getPerformanceColor(selectedStaff.performance)}.500`}>
                                {selectedStaff.performance}%
                              </Text>
                            </Box>
                          </HStack>
                        </Box>
                        
                        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                          <Card>
                            <CardBody textAlign="center" py={4}>
                              <Text fontSize="2xl" fontWeight="bold" color="green.500">95%</Text>
                              <Text fontSize="sm" color="gray.600">Attendance</Text>
                            </CardBody>
                          </Card>
                          <Card>
                            <CardBody textAlign="center" py={4}>
                              <Text fontSize="2xl" fontWeight="bold" color="blue.500">4.5</Text>
                              <Text fontSize="sm" color="gray.600">Rating</Text>
                            </CardBody>
                          </Card>
                          <Card>
                            <CardBody textAlign="center" py={4}>
                              <Text fontSize="2xl" fontWeight="bold" color="purple.500">12</Text>
                              <Text fontSize="sm" color="gray.600">Projects</Text>
                            </CardBody>
                          </Card>
                        </SimpleGrid>
                      </VStack>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => { onViewClose(); setSelectedStaff(null); }}>
              Close
            </Button>
            <Button colorScheme="blue" onClick={() => { onViewClose(); openEditModal(selectedStaff); }}>
              Edit Staff
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Staff Member
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete <strong>{selectedStaff?.name}</strong>? 
              This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteStaff} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Leave Management Modal */}
      <Modal isOpen={isLeaveOpen} onClose={() => { onLeaveClose(); setSelectedStaff(null); }} size="5xl">
        <ModalOverlay />
        <ModalContent maxH="90vh" overflowY="auto">
          <ModalHeader>
            <HStack>
              <Calendar size={24} />
              <Text>Leave Management - {selectedStaff?.name}</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedStaff && (
              <VStack spacing={6} align="stretch">
                {/* Staff Info Header */}
                <Box p={4} bg="blue.50" borderRadius="lg">
                  <HStack spacing={4}>
                    <Avatar size="lg" name={selectedStaff.name} src={selectedStaff.avatar} />
                    <VStack align="start" spacing={1}>
                      <Text fontSize="xl" fontWeight="bold">{selectedStaff.name}</Text>
                      <Text color="gray.600">{selectedStaff.position} - {selectedStaff.department}</Text>
                      <Badge colorScheme={getStatusColor(selectedStaff.status)}>
                        {selectedStaff.status}
                      </Badge>
                    </VStack>
                  </HStack>
                </Box>

                <Tabs>
                  <TabList>
                    <Tab>Apply Leave</Tab>
                    <Tab>Leave History</Tab>
                  </TabList>
                  
                  <TabPanels>
                    {/* Apply Leave Tab */}
                    <TabPanel px={0}>
                      <Card>
                        <CardHeader>
                          <Text fontSize="lg" fontWeight="semibold">Apply New Leave</Text>
                        </CardHeader>
                        <CardBody>
                          <VStack spacing={4} align="stretch">
                            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                              <FormControl isRequired>
                                <FormLabel>Leave Type</FormLabel>
                                <Select
                                  value={leaveFormData.leaveType}
                                  onChange={(e) => setLeaveFormData({...leaveFormData, leaveType: e.target.value})}
                                  placeholder="Select leave type"
                                >
                                  <option value="Annual Leave">Annual Leave</option>
                                  <option value="Medical Leave">Medical Leave</option>
                                  <option value="Emergency Leave">Emergency Leave</option>
                                  <option value="Maternity Leave">Maternity Leave</option>
                                  <option value="Paternity Leave">Paternity Leave</option>
                                  <option value="Study Leave">Study Leave</option>
                                  <option value="Casual Leave">Casual Leave</option>
                                </Select>
                              </FormControl>
                              
                              <FormControl>
                                <FormLabel>Status</FormLabel>
                                <Select
                                  value={leaveFormData.status}
                                  onChange={(e) => setLeaveFormData({...leaveFormData, status: e.target.value})}
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Approved">Approved</option>
                                  <option value="Rejected">Rejected</option>
                                </Select>
                              </FormControl>

                              <FormControl isRequired>
                                <FormLabel>Start Date</FormLabel>
                                <Input
                                  type="date"
                                  value={leaveFormData.startDate}
                                  onChange={(e) => setLeaveFormData({...leaveFormData, startDate: e.target.value})}
                                />
                              </FormControl>

                              <FormControl isRequired>
                                <FormLabel>End Date</FormLabel>
                                <Input
                                  type="date"
                                  value={leaveFormData.endDate}
                                  onChange={(e) => setLeaveFormData({...leaveFormData, endDate: e.target.value})}
                                />
                              </FormControl>
                            </SimpleGrid>

                            <FormControl isRequired>
                              <FormLabel>Reason</FormLabel>
                              <Textarea
                                value={leaveFormData.reason}
                                onChange={(e) => setLeaveFormData({...leaveFormData, reason: e.target.value})}
                                placeholder="Enter reason for leave..."
                                rows={4}
                              />
                            </FormControl>

                            <Button
                              colorScheme="blue"
                              onClick={handleApplyLeave}
                              isDisabled={!leaveFormData.leaveType || !leaveFormData.startDate || !leaveFormData.endDate || !leaveFormData.reason}
                            >
                              Apply Leave
                            </Button>
                          </VStack>
                        </CardBody>
                      </Card>
                    </TabPanel>

                    {/* Leave History Tab */}
                    <TabPanel px={0}>
                      <Card>
                        <CardHeader>
                          <Text fontSize="lg" fontWeight="semibold">Leave History</Text>
                        </CardHeader>
                        <CardBody p={0}>
                          {leaveData[selectedStaff.id] && leaveData[selectedStaff.id].length > 0 ? (
                            <TableContainer>
                              <Table variant="simple">
                                <Thead bg="gray.50">
                                  <Tr>
                                    <Th>Leave Type</Th>
                                    <Th>Start Date</Th>
                                    <Th>End Date</Th>
                                    <Th>Duration</Th>
                                    <Th>Reason</Th>
                                    <Th>Applied Date</Th>
                                    <Th>Status</Th>
                                    <Th>Actions</Th>
                                  </Tr>
                                </Thead>
                                <Tbody>
                                  {leaveData[selectedStaff.id].map((leave) => (
                                    <Tr key={leave.id}>
                                      <Td>{leave.leaveType}</Td>
                                      <Td>{new Date(leave.startDate).toLocaleDateString()}</Td>
                                      <Td>{new Date(leave.endDate).toLocaleDateString()}</Td>
                                      <Td>
                                        {Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)) + 1} days
                                      </Td>
                                      <Td>{leave.reason}</Td>
                                      <Td>{new Date(leave.appliedDate).toLocaleDateString()}</Td>
                                      <Td>
                                        <Badge colorScheme={getLeaveStatusColor(leave.status)}>
                                          {leave.status}
                                        </Badge>
                                      </Td>
                                      <Td>
                                        {leave.status === 'Pending' && (
                                          <HStack spacing={2}>
                                            <Button
                                              size="xs"
                                              colorScheme="green"
                                              onClick={() => handleLeaveStatusUpdate(selectedStaff.id, leave.id, 'Approved')}
                                            >
                                              Approve
                                            </Button>
                                            <Button
                                              size="xs"
                                              colorScheme="red"
                                              onClick={() => handleLeaveStatusUpdate(selectedStaff.id, leave.id, 'Rejected')}
                                            >
                                              Reject
                                            </Button>
                                          </HStack>
                                        )}
                                      </Td>
                                    </Tr>
                                  ))}
                                </Tbody>
                              </Table>
                            </TableContainer>
                          ) : (
                            <Box textAlign="center" py={10}>
                              <Calendar size={48} color="gray" style={{ margin: '0 auto 16px' }} />
                              <Text fontSize="lg" color="gray.500" fontWeight="medium">No leave history found</Text>
                              <Text fontSize="sm" color="gray.500">This staff member hasn't applied for any leave yet</Text>
                            </Box>
                          )}
                        </CardBody>
                      </Card>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => { onLeaveClose(); setSelectedStaff(null); }}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default StaffManagement;