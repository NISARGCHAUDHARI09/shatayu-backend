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
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useColorModeValue,
  Avatar,
  IconButton,
  Tooltip,
  Input,
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
  SimpleGrid,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
  Divider,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react';
import {
  Calendar,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit,
  RotateCcw,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  Calendar as CalendarIcon,
  BarChart3,
  TrendingUp,
  Shield,
  Bell,
  ChevronDown,
  FileText,
  MoreVertical,
  Trash2,
  Copy,
  Settings
} from 'lucide-react';

// Mock duty roster data with enhanced information
const mockRoster = {
  'Monday': [
    { 
      id: 1,
      name: 'Dr. Ramesh Ayurveda', 
      shift: 'Morning', 
      time: '09:00-17:00', 
      department: 'Medical',
      status: 'confirmed',
      role: 'Senior Doctor',
      experience: '15 years',
      specialization: 'Panchakarma'
    },
    { 
      id: 2,
      name: 'Nurse Priya Sharma', 
      shift: 'Day', 
      time: '08:00-20:00', 
      department: 'Nursing',
      status: 'confirmed',
      role: 'Head Nurse',
      experience: '8 years',
      specialization: 'Critical Care'
    }
  ],
  'Tuesday': [
    { 
      id: 3,
      name: 'Dr. Sunita Herbs', 
      shift: 'Morning', 
      time: '09:00-17:00', 
      department: 'Medical',
      status: 'pending',
      role: 'Junior Doctor',
      experience: '5 years',
      specialization: 'Herbal Medicine'
    },
    { 
      id: 4,
      name: 'Nurse Meera Reddy', 
      shift: 'Day', 
      time: '08:00-20:00', 
      department: 'Nursing',
      status: 'confirmed',
      role: 'Staff Nurse',
      experience: '3 years',
      specialization: 'General Care'
    },
    { 
      id: 5,
      name: 'Mr. Amit Patel', 
      shift: 'Evening', 
      time: '14:00-22:00', 
      department: 'Pharmacy',
      status: 'confirmed',
      role: 'Senior Pharmacist',
      experience: '7 years',
      specialization: 'Ayurvedic Medicines'
    }
  ],
  'Wednesday': [
    { 
      id: 6,
      name: 'Dr. Vishnu Panchakarma', 
      shift: 'Morning', 
      time: '09:00-17:00', 
      department: 'Medical',
      status: 'confirmed',
      role: 'Specialist',
      experience: '12 years',
      specialization: 'Panchakarma Therapy'
    },
    { 
      id: 7,
      name: 'Nurse Priya Sharma', 
      shift: 'Day', 
      time: '08:00-20:00', 
      department: 'Nursing',
      status: 'confirmed',
      role: 'Head Nurse',
      experience: '8 years',
      specialization: 'Critical Care'
    }
  ],
  'Thursday': [
    { 
      id: 8,
      name: 'Dr. Lakshmi Skin', 
      shift: 'Morning', 
      time: '09:00-17:00', 
      department: 'Medical',
      status: 'confirmed',
      role: 'Specialist',
      experience: '10 years',
      specialization: 'Dermatology'
    },
    { 
      id: 9,
      name: 'Nurse Kavya', 
      shift: 'Day', 
      time: '08:00-20:00', 
      department: 'Nursing',
      status: 'pending',
      role: 'Staff Nurse',
      experience: '4 years',
      specialization: 'General Care'
    },
    { 
      id: 10,
      name: 'Mr. Amit Patel', 
      shift: 'Evening', 
      time: '14:00-22:00', 
      department: 'Pharmacy',
      status: 'confirmed',
      role: 'Senior Pharmacist',
      experience: '7 years',
      specialization: 'Ayurvedic Medicines'
    }
  ],
  'Friday': [
    { 
      id: 11,
      name: 'Dr. Kumar Wellness', 
      shift: 'Morning', 
      time: '09:00-17:00', 
      department: 'Medical',
      status: 'confirmed',
      role: 'Senior Doctor',
      experience: '18 years',
      specialization: 'Wellness & Prevention'
    },
    { 
      id: 12,
      name: 'Nurse Priya Sharma', 
      shift: 'Day', 
      time: '08:00-20:00', 
      department: 'Nursing',
      status: 'confirmed',
      role: 'Head Nurse',
      experience: '8 years',
      specialization: 'Critical Care'
    }
  ],
  'Saturday': [
    { 
      id: 13,
      name: 'Dr. Ramesh Ayurveda', 
      shift: 'Morning', 
      time: '09:00-14:00', 
      department: 'Medical',
      status: 'confirmed',
      role: 'Senior Doctor',
      experience: '15 years',
      specialization: 'Panchakarma'
    },
    { 
      id: 14,
      name: 'Nurse Weekend', 
      shift: 'Day', 
      time: '08:00-20:00', 
      department: 'Nursing',
      status: 'confirmed',
      role: 'Weekend Staff',
      experience: '6 years',
      specialization: 'Emergency Care'
    },
    { 
      id: 15,
      name: 'Emergency Staff', 
      shift: 'Night', 
      time: '20:00-08:00', 
      department: 'Emergency',
      status: 'confirmed',
      role: 'Emergency Coordinator',
      experience: '9 years',
      specialization: 'Emergency Response'
    }
  ],
  'Sunday': [
    { 
      id: 16,
      name: 'Dr. Emergency', 
      shift: 'Morning', 
      time: '09:00-14:00', 
      department: 'Medical',
      status: 'confirmed',
      role: 'Emergency Doctor',
      experience: '11 years',
      specialization: 'Emergency Medicine'
    },
    { 
      id: 17,
      name: 'Nurse Weekend', 
      shift: 'Day', 
      time: '08:00-20:00', 
      department: 'Nursing',
      status: 'confirmed',
      role: 'Weekend Staff',
      experience: '6 years',
      specialization: 'Emergency Care'
    },
    { 
      id: 18,
      name: 'Emergency Staff', 
      shift: 'Night', 
      time: '20:00-08:00', 
      department: 'Emergency',
      status: 'confirmed',
      role: 'Emergency Coordinator',
      experience: '9 years',
      specialization: 'Emergency Response'
    }
  ]
};

const DutyRoster = ({ title = "Duty Roster Management", showAddButton = true }) => {
  const [selectedWeek, setSelectedWeek] = useState('current');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  
  // Form state for add duty
  const [dutyForm, setDutyForm] = useState({
    staffName: '',
    department: '',
    day: '',
    shift: 'Morning',
    location: '',
    status: 'pending',
    notes: ''
  });
  
  // Modal states
  const { isOpen: isViewModalOpen, onOpen: onViewModalOpen, onClose: onViewModalClose } = useDisclosure();
  const { isOpen: isAddModalOpen, onOpen: onAddModalOpen, onClose: onAddModalClose } = useDisclosure();
  const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure();
  
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Calculate statistics
  const totalShifts = Object.values(mockRoster).flat().length;
  const confirmedShifts = Object.values(mockRoster).flat().filter(s => s.status === 'confirmed').length;
  const pendingShifts = Object.values(mockRoster).flat().filter(s => s.status === 'pending').length;
  const coveragePercentage = Math.round((confirmedShifts / totalShifts) * 100);
  
  const getShiftColor = (shift) => {
    switch (shift.toLowerCase()) {
      case 'morning': return 'blue';
      case 'day': return 'green';
      case 'evening': return 'orange';
      case 'night': return 'purple';
      case 'all day': return 'red';
      default: return 'gray';
    }
  };

  const getDepartmentColor = (department) => {
    switch (department.toLowerCase()) {
      case 'medical': return 'blue';
      case 'nursing': return 'teal';
      case 'pharmacy': return 'purple';
      case 'emergency': return 'red';
      case 'laboratory': return 'orange';
      default: return 'gray';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'green';
      case 'pending': return 'yellow';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };

  // Filter roster based on department and search
  const getFilteredRoster = (dayRoster) => {
    let filtered = dayRoster;
    
    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(staff => staff.department.toLowerCase() === selectedDepartment);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(staff => 
        staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.specialization.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const handleViewStaff = (staff) => {
    setSelectedStaff(staff);
    setSelectedSchedule(null); // Clear any selected schedule
    onViewModalOpen();
  };

  const handleAutoGenerate = () => {
    toast({
      title: "Auto Generate Schedule",
      description: "Duty roster has been automatically generated based on availability and preferences.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleDutyFormChange = (field, value) => {
    setDutyForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddStaff = (day = '') => {
    // Pre-fill the form with the selected day
    if (day) {
      setDutyForm(prev => ({
        ...prev,
        day: day
      }));
    }
    onAddModalOpen();
  };

  const handleAddDuty = () => {
    if (!dutyForm.staffName || !dutyForm.department || !dutyForm.day || !dutyForm.shift) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Here you would typically save to database
    toast({
      title: "Duty Added",
      description: `Duty assigned to ${dutyForm.staffName} for ${dutyForm.day} ${dutyForm.shift} shift.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    // Reset form and close modal
    setDutyForm({
      staffName: '',
      department: '',
      day: '',
      shift: 'Morning',
      location: '',
      status: 'pending',
      notes: ''
    });
    onAddModalClose();
  };

  // Export functions
  const exportToCSV = () => {
    const exportData = [];
    
    daysOfWeek.forEach(day => {
      if (mockRoster[day]) {
        mockRoster[day].forEach(assignment => {
          exportData.push({
            'Day': day,
            'Staff Name': assignment.name,
            'Department': assignment.department,
            'Shift': assignment.shift,
            'Time': assignment.time,
            'Status': assignment.status,
            'Location': assignment.location || 'General Ward',
            'Experience': assignment.experience,
            'Specialization': assignment.specialization || 'General'
          });
        });
      }
    });

    const headers = Object.keys(exportData[0] || {});
    let csvContent = headers.join(',') + '\n';
    
    exportData.forEach(row => {
      const values = headers.map(header => {
        let value = row[header] || '';
        value = String(value);
        // Escape quotes and wrap in quotes if contains comma
        if (value.includes(',') || value.includes('"')) {
          value = '"' + value.replace(/"/g, '""') + '"';
        }
        return value;
      });
      csvContent += values.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Duty_Roster_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "CSV Export Complete",
      description: "Duty roster has been downloaded as CSV file.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const exportToExcel = () => {
    const exportData = [];
    
    daysOfWeek.forEach(day => {
      if (mockRoster[day]) {
        mockRoster[day].forEach(assignment => {
          exportData.push({
            'Day': day,
            'Staff Name': assignment.name,
            'Department': assignment.department,
            'Shift': assignment.shift,
            'Time': assignment.time,
            'Status': assignment.status,
            'Location': assignment.location || 'General Ward',
            'Experience': assignment.experience,
            'Specialization': assignment.specialization || 'General'
          });
        });
      }
    });

    const headers = Object.keys(exportData[0] || {});
    
    let excelContent = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Title>Duty Roster Export</Title>
 </DocumentProperties>
 <Worksheet ss:Name="Duty Roster">
  <Table>`;

    // Add header row
    excelContent += `
   <Row>`;
    headers.forEach(header => {
      excelContent += `
    <Cell><Data ss:Type="String">${header}</Data></Cell>`;
    });
    excelContent += `
   </Row>`;

    // Add data rows
    exportData.forEach(row => {
      excelContent += `
   <Row>`;
      headers.forEach(header => {
        let value = row[header] || '';
        value = String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        excelContent += `
    <Cell><Data ss:Type="String">${value}</Data></Cell>`;
      });
      excelContent += `
   </Row>`;
    });

    excelContent += `
  </Table>
 </Worksheet>
</Workbook>`;

    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Duty_Roster_${new Date().toISOString().split('T')[0]}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Excel Export Complete",
      description: "Duty roster has been downloaded as Excel file.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const exportToPDF = () => {
    const exportData = [];
    
    daysOfWeek.forEach(day => {
      if (mockRoster[day]) {
        mockRoster[day].forEach(assignment => {
          exportData.push({
            day,
            name: assignment.name,
            department: assignment.department,
            shift: assignment.shift,
            time: assignment.time,
            status: assignment.status,
            location: assignment.location || 'General Ward'
          });
        });
      }
    });

    let pdfContent = `DUTY ROSTER REPORT
Generated on: ${new Date().toLocaleDateString()}
==================================================

`;

    daysOfWeek.forEach(day => {
      pdfContent += `\n${day.toUpperCase()}\n`;
      pdfContent += '----------------------------------------\n';
      
      const dayAssignments = exportData.filter(item => item.day === day);
      if (dayAssignments.length === 0) {
        pdfContent += 'No assignments\n';
      } else {
        dayAssignments.forEach(assignment => {
          pdfContent += `${assignment.name} | ${assignment.department} | ${assignment.shift} | ${assignment.time} | ${assignment.status}\n`;
        });
      }
      pdfContent += '\n';
    });

    pdfContent += `\n==================================================
SUMMARY:
Total Assignments: ${exportData.length}
Confirmed: ${exportData.filter(a => a.status === 'confirmed').length}
Pending: ${exportData.filter(a => a.status === 'pending').length}
Cancelled: ${exportData.filter(a => a.status === 'cancelled').length}
==================================================`;

    const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Duty_Roster_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "PDF Export Complete",
      description: "Duty roster has been downloaded as PDF report.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Action handlers for duty roster management
  const handleEditSchedule = (day) => {
    setSelectedSchedule({ day, assignments: mockRoster[day] || [] });
    onEditModalOpen();
  };

  const handleViewDayDetails = (day) => {
    setSelectedSchedule({ day, assignments: mockRoster[day] || [] });
    setSelectedStaff(null); // Clear any selected staff
    onViewModalOpen();
  };

  const handleDeleteAssignment = (day, assignmentId) => {
    const daySchedule = mockRoster[day] || [];
    
    if (assignmentId === 'all') {
      // This was the old clear day function, now redirected
      handleClearDay(day);
      return;
    }
    
    // Handle individual assignment deletion
    const assignment = daySchedule.find(staff => staff.id === assignmentId);
    if (assignment) {
      toast({
        title: "Assignment Deleted",
        description: `${assignment.name} has been removed from ${day} ${assignment.shift} shift.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Assignment Not Found",
        description: `Could not find assignment to delete for ${day}.`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDuplicateSchedule = (day) => {
    // Copy the current day's schedule to clipboard as JSON
    const daySchedule = mockRoster[day] || [];
    const scheduleText = JSON.stringify(daySchedule, null, 2);
    
    // Try to copy to clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText(scheduleText).then(() => {
        toast({
          title: "Schedule Duplicated",
          description: `${day} schedule has been copied to clipboard. You can paste it to another day.`,
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      }).catch(() => {
        toast({
          title: "Copy Failed",
          description: "Could not copy to clipboard. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
    } else {
      // Fallback for older browsers
      toast({
        title: "Schedule Data",
        description: `${day} has ${daySchedule.length} staff assignments. Check console for details.`,
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      console.log(`${day} Schedule:`, daySchedule);
    }
  };

  const handleManageShifts = (day) => {
    // Show detailed shift management information
    const daySchedule = mockRoster[day] || [];
    const shiftCounts = daySchedule.reduce((acc, staff) => {
      acc[staff.shift] = (acc[staff.shift] || 0) + 1;
      return acc;
    }, {});
    
    const shiftSummary = Object.entries(shiftCounts)
      .map(([shift, count]) => `${shift}: ${count}`)
      .join(', ');
    
    toast({
      title: `${day} Shift Management`,
      description: shiftSummary || 'No shifts assigned. Click "Add Staff" to create assignments.',
      status: "info",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleClearDay = (day) => {
    // Show confirmation and simulate clearing the day
    const daySchedule = mockRoster[day] || [];
    
    if (daySchedule.length === 0) {
      toast({
        title: "Day Already Empty",
        description: `${day} has no staff assignments to clear.`,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // In a real app, you would show a confirmation dialog here
    toast({
      title: "Day Cleared",
      description: `All ${daySchedule.length} staff assignments have been removed from ${day}.`,
      status: "success",
      duration: 4000,
      isClosable: true,
    });
    
    // Log the action for debugging
    console.log(`Cleared ${daySchedule.length} assignments from ${day}:`, daySchedule);
  };

  // Custom modal close handlers
  const handleViewModalClose = () => {
    setSelectedStaff(null);
    setSelectedSchedule(null);
    onViewModalClose();
  };

  const handleEditModalClose = () => {
    setSelectedSchedule(null);
    onEditModalClose();
  };

  return (
    <Box p={6}>
      {/* Enhanced Header */}
      <Flex justify="space-between" align="center" mb={8}>
        <Box>
          <Text fontSize="3xl" fontWeight="bold" bgGradient="linear(to-r, blue.600, purple.600)" bgClip="text">
            {title}
          </Text>
          <Text color="gray.600" fontSize="lg">
            Manage staff duty schedules and shift assignments across all departments
          </Text>
        </Box>
        {showAddButton && (
          <HStack spacing={3}>
            <Menu>
              <MenuButton 
                as={Button}
                leftIcon={<Download size={20} />} 
                rightIcon={<ChevronDown size={16} />}
                variant="outline" 
                colorScheme="green"
                size="lg"
              >
                Export Schedule
              </MenuButton>
              <MenuList>
                <MenuItem 
                  icon={<FileText size={16} />}
                  onClick={exportToPDF}
                >
                  Export as PDF
                </MenuItem>
                <MenuItem 
                  icon={<FileText size={16} />}
                  onClick={exportToExcel}
                >
                  Export as Excel
                </MenuItem>
                <MenuItem 
                  icon={<FileText size={16} />}
                  onClick={exportToCSV}
                >
                  Export as CSV
                </MenuItem>
              </MenuList>
            </Menu>
            <Button 
              leftIcon={<RotateCcw size={20} />} 
              variant="outline"
              colorScheme="orange"
              size="lg"
              onClick={handleAutoGenerate}
            >
              Auto Generate
            </Button>
            <Button 
              colorScheme="blue" 
              leftIcon={<Plus size={20} />}
              size="lg"
              onClick={onAddModalOpen}
            >
              Add Duty
            </Button>
          </HStack>
        )}
      </Flex>

      {/* Enhanced KPI Cards */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={6} mb={8}>
        <Card bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" color="white">
          <CardBody>
            <HStack spacing={4}>
              <Icon as={CalendarIcon} size={40} />
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" opacity={0.9}>Total Shifts</Text>
                <Text fontSize="2xl" fontWeight="bold">{totalShifts}</Text>
                <Text fontSize="xs" opacity={0.8}>This week</Text>
              </VStack>
            </HStack>
          </CardBody>
        </Card>

        <Card bg="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" color="white">
          <CardBody>
            <HStack spacing={4}>
              <Icon as={UserCheck} size={40} />
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" opacity={0.9}>Confirmed Shifts</Text>
                <Text fontSize="2xl" fontWeight="bold">{confirmedShifts}</Text>
                <Text fontSize="xs" opacity={0.8}>{pendingShifts} pending</Text>
              </VStack>
            </HStack>
          </CardBody>
        </Card>

        <Card bg="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" color="white">
          <CardBody>
            <HStack spacing={4}>
              <Icon as={Shield} size={40} />
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" opacity={0.9}>Coverage</Text>
                <Text fontSize="2xl" fontWeight="bold">{coveragePercentage}%</Text>
                <Text fontSize="xs" opacity={0.8}>Overall coverage</Text>
              </VStack>
            </HStack>
          </CardBody>
        </Card>

        <Card bg="linear-gradient(135deg, #fa709a 0%, #fee140 100%)" color="white">
          <CardBody>
            <HStack spacing={4}>
              <Icon as={Bell} size={40} />
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" opacity={0.9}>Alerts</Text>
                <Text fontSize="2xl" fontWeight="bold">{pendingShifts}</Text>
                <Text fontSize="xs" opacity={0.8}>Require attention</Text>
              </VStack>
            </HStack>
          </CardBody>
        </Card>
      </Grid>

      {/* Enhanced Week Navigation and Filters */}
      <Card bg={cardBg} mb={6}>
        <CardBody>
          <Flex direction={{ base: "column", lg: "row" }} gap={6} align="center">
            {/* Week Navigation */}
            <HStack spacing={4}>
              <IconButton
                icon={<ChevronLeft />}
                variant="outline"
                size="md"
                colorScheme="blue"
                aria-label="Previous week"
              />
              <VStack spacing={1}>
                <Text fontWeight="bold" fontSize="lg">Week of Dec 16-22, 2024</Text>
                <Text fontSize="sm" color="gray.500">Current Week</Text>
              </VStack>
              <IconButton
                icon={<ChevronRight />}
                variant="outline"
                size="md"
                colorScheme="blue"
                aria-label="Next week"
              />
            </HStack>
            
            {/* Search and Filters */}
            <Flex gap={4} align="center" flex="1">
              <HStack spacing={2} flex="1" maxW="400px">
                <Icon as={Search} color="gray.400" />
                <Input
                  placeholder="Search staff by name, role, or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  bg="white"
                  border="2px solid"
                  borderColor="gray.200"
                  _focus={{ borderColor: "blue.400" }}
                />
              </HStack>
              <Select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                w="200px"
                bg="white"
                border="2px solid"
                borderColor="gray.200"
                _focus={{ borderColor: "blue.400" }}
              >
                <option value="all">All Departments</option>
                <option value="medical">Medical</option>
                <option value="nursing">Nursing</option>
                <option value="pharmacy">Pharmacy</option>
                <option value="emergency">Emergency</option>
                <option value="laboratory">Laboratory</option>
              </Select>
            </Flex>
          </Flex>
        </CardBody>
      </Card>

      {/* Enhanced Roster Table */}
      <Card bg={cardBg}>
        <CardBody p={0}>
          <TableContainer>
            <Table variant="simple" size="md">
              <Thead bg="gray.50">
                <Tr>
                  <Th>Day & Date</Th>
                  <Th>Morning Shift (9AM-5PM)</Th>
                  <Th>Day Shift (8AM-8PM)</Th>
                  <Th>Evening Shift (2PM-10PM)</Th>
                  <Th>Night Shift (8PM-8AM)</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {daysOfWeek.map((day) => {
                  const dayRoster = getFilteredRoster(mockRoster[day] || []);
                  const morningShift = dayRoster.filter(s => s.shift === 'Morning');
                  const dayShift = dayRoster.filter(s => s.shift === 'Day');
                  const eveningShift = dayRoster.filter(s => s.shift === 'Evening');
                  const nightShift = dayRoster.filter(s => s.shift === 'Night');
                  
                  return (
                    <Tr key={day} _hover={{ bg: "gray.50" }}>
                      <Td>
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="bold" fontSize="md">{day}</Text>
                          <Text fontSize="sm" color="gray.500">Dec {16 + daysOfWeek.indexOf(day)}, 2024</Text>
                          <Badge 
                            colorScheme={day === 'Saturday' || day === 'Sunday' ? 'orange' : 'blue'}
                            size="sm"
                          >
                            {day === 'Saturday' || day === 'Sunday' ? 'Weekend' : 'Weekday'}
                          </Badge>
                        </VStack>
                      </Td>
                      
                      {/* Morning Shift */}
                      <Td>
                        <VStack align="start" spacing={2}>
                          {morningShift.map((staff, idx) => (
                            <Card key={idx} variant="outline" size="sm" w="full" cursor="pointer" 
                                  onClick={() => handleViewStaff(staff)}
                                  _hover={{ shadow: "md", transform: "translateY(-1px)" }}
                                  transition="all 0.2s">
                              <CardBody p={3}>
                                <HStack spacing={3}>
                                  <Avatar 
                                    size="sm" 
                                    name={staff.name}
                                    bg={`${getDepartmentColor(staff.department)}.500`}
                                    color="white"
                                  />
                                  <VStack align="start" spacing={1} flex="1">
                                    <Text fontSize="sm" fontWeight="semibold">{staff.name}</Text>
                                    <Text fontSize="xs" color="gray.600">{staff.role}</Text>
                                    <HStack spacing={2}>
                                      <Badge 
                                        colorScheme={getDepartmentColor(staff.department)} 
                                        size="sm"
                                        variant="subtle"
                                      >
                                        {staff.department}
                                      </Badge>
                                      <Badge 
                                        colorScheme={getStatusColor(staff.status)} 
                                        size="sm"
                                      >
                                        {staff.status}
                                      </Badge>
                                    </HStack>
                                    <Text fontSize="xs" color="gray.500">
                                      <Clock size={10} style={{ display: 'inline', marginRight: '4px' }} />
                                      {staff.time}
                                    </Text>
                                  </VStack>
                                </HStack>
                              </CardBody>
                            </Card>
                          ))}
                          {morningShift.length === 0 && (
                            <Box 
                              p={4} 
                              borderRadius="md" 
                              border="2px dashed" 
                              borderColor="gray.300"
                              textAlign="center"
                              w="full"
                            >
                              <Text fontSize="sm" color="gray.400">No staff assigned</Text>
                              <Button size="xs" variant="ghost" mt={1}>
                                <Plus size={12} />
                              </Button>
                            </Box>
                          )}
                        </VStack>
                      </Td>
                      
                      {/* Day Shift */}
                      <Td>
                        <VStack align="start" spacing={2}>
                          {dayShift.map((staff, idx) => (
                            <Card key={idx} variant="outline" size="sm" w="full" cursor="pointer" 
                                  onClick={() => handleViewStaff(staff)}
                                  _hover={{ shadow: "md", transform: "translateY(-1px)" }}
                                  transition="all 0.2s">
                              <CardBody p={3}>
                                <HStack spacing={3}>
                                  <Avatar 
                                    size="sm" 
                                    name={staff.name}
                                    bg={`${getDepartmentColor(staff.department)}.500`}
                                    color="white"
                                  />
                                  <VStack align="start" spacing={1} flex="1">
                                    <Text fontSize="sm" fontWeight="semibold">{staff.name}</Text>
                                    <Text fontSize="xs" color="gray.600">{staff.role}</Text>
                                    <HStack spacing={2}>
                                      <Badge 
                                        colorScheme={getDepartmentColor(staff.department)} 
                                        size="sm"
                                        variant="subtle"
                                      >
                                        {staff.department}
                                      </Badge>
                                      <Badge 
                                        colorScheme={getStatusColor(staff.status)} 
                                        size="sm"
                                      >
                                        {staff.status}
                                      </Badge>
                                    </HStack>
                                    <Text fontSize="xs" color="gray.500">
                                      <Clock size={10} style={{ display: 'inline', marginRight: '4px' }} />
                                      {staff.time}
                                    </Text>
                                  </VStack>
                                </HStack>
                              </CardBody>
                            </Card>
                          ))}
                          {dayShift.length === 0 && (
                            <Box 
                              p={4} 
                              borderRadius="md" 
                              border="2px dashed" 
                              borderColor="gray.300"
                              textAlign="center"
                              w="full"
                            >
                              <Text fontSize="sm" color="gray.400">No staff assigned</Text>
                              <Button size="xs" variant="ghost" mt={1}>
                                <Plus size={12} />
                              </Button>
                            </Box>
                          )}
                        </VStack>
                      </Td>
                      
                      {/* Evening Shift */}
                      <Td>
                        <VStack align="start" spacing={2}>
                          {eveningShift.map((staff, idx) => (
                            <Card key={idx} variant="outline" size="sm" w="full" cursor="pointer" 
                                  onClick={() => handleViewStaff(staff)}
                                  _hover={{ shadow: "md", transform: "translateY(-1px)" }}
                                  transition="all 0.2s">
                              <CardBody p={3}>
                                <HStack spacing={3}>
                                  <Avatar 
                                    size="sm" 
                                    name={staff.name}
                                    bg={`${getDepartmentColor(staff.department)}.500`}
                                    color="white"
                                  />
                                  <VStack align="start" spacing={1} flex="1">
                                    <Text fontSize="sm" fontWeight="semibold">{staff.name}</Text>
                                    <Text fontSize="xs" color="gray.600">{staff.role}</Text>
                                    <HStack spacing={2}>
                                      <Badge 
                                        colorScheme={getDepartmentColor(staff.department)} 
                                        size="sm"
                                        variant="subtle"
                                      >
                                        {staff.department}
                                      </Badge>
                                      <Badge 
                                        colorScheme={getStatusColor(staff.status)} 
                                        size="sm"
                                      >
                                        {staff.status}
                                      </Badge>
                                    </HStack>
                                    <Text fontSize="xs" color="gray.500">
                                      <Clock size={10} style={{ display: 'inline', marginRight: '4px' }} />
                                      {staff.time}
                                    </Text>
                                  </VStack>
                                </HStack>
                              </CardBody>
                            </Card>
                          ))}
                          {eveningShift.length === 0 && (
                            <Box 
                              p={4} 
                              borderRadius="md" 
                              border="2px dashed" 
                              borderColor="gray.300"
                              textAlign="center"
                              w="full"
                            >
                              <Text fontSize="sm" color="gray.400">No staff assigned</Text>
                              <Button size="xs" variant="ghost" mt={1}>
                                <Plus size={12} />
                              </Button>
                            </Box>
                          )}
                        </VStack>
                      </Td>
                      
                      {/* Night Shift */}
                      <Td>
                        <VStack align="start" spacing={2}>
                          {nightShift.map((staff, idx) => (
                            <Card key={idx} variant="outline" size="sm" w="full" cursor="pointer" 
                                  onClick={() => handleViewStaff(staff)}
                                  _hover={{ shadow: "md", transform: "translateY(-1px)" }}
                                  transition="all 0.2s">
                              <CardBody p={3}>
                                <HStack spacing={3}>
                                  <Avatar 
                                    size="sm" 
                                    name={staff.name}
                                    bg={`${getDepartmentColor(staff.department)}.500`}
                                    color="white"
                                  />
                                  <VStack align="start" spacing={1} flex="1">
                                    <Text fontSize="sm" fontWeight="semibold">{staff.name}</Text>
                                    <Text fontSize="xs" color="gray.600">{staff.role}</Text>
                                    <HStack spacing={2}>
                                      <Badge 
                                        colorScheme={getDepartmentColor(staff.department)} 
                                        size="sm"
                                        variant="subtle"
                                      >
                                        {staff.department}
                                      </Badge>
                                      <Badge 
                                        colorScheme={getStatusColor(staff.status)} 
                                        size="sm"
                                      >
                                        {staff.status}
                                      </Badge>
                                    </HStack>
                                    <Text fontSize="xs" color="gray.500">
                                      <Clock size={10} style={{ display: 'inline', marginRight: '4px' }} />
                                      {staff.time}
                                    </Text>
                                  </VStack>
                                </HStack>
                              </CardBody>
                            </Card>
                          ))}
                          {nightShift.length === 0 && (
                            <Box 
                              p={4} 
                              borderRadius="md" 
                              border="2px dashed" 
                              borderColor="gray.300"
                              textAlign="center"
                              w="full"
                            >
                              <Text fontSize="sm" color="gray.400">No staff assigned</Text>
                              <Button size="xs" variant="ghost" mt={1}>
                                <Plus size={12} />
                              </Button>
                            </Box>
                          )}
                        </VStack>
                      </Td>
                      
                      {/* Actions */}
                      <Td>
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            aria-label="Actions"
                            icon={<MoreVertical size={16} />}
                            variant="ghost"
                            size="sm"
                          />
                          <MenuList>
                            <MenuItem 
                              icon={<Eye size={16} />}
                              onClick={() => handleViewDayDetails(day)}
                            >
                              View Day Details
                            </MenuItem>
                            <MenuItem 
                              icon={<Edit size={16} />}
                              onClick={() => handleEditSchedule(day)}
                            >
                              Edit Schedule
                            </MenuItem>
                            <MenuItem 
                              icon={<Plus size={16} />}
                              onClick={() => handleAddStaff(day)}
                            >
                              Add Staff
                            </MenuItem>
                            <MenuItem 
                              icon={<Copy size={16} />}
                              onClick={() => handleDuplicateSchedule(day)}
                            >
                              Duplicate Schedule
                            </MenuItem>
                            <MenuItem 
                              icon={<Settings size={16} />}
                              onClick={() => handleManageShifts(day)}
                            >
                              Manage Shifts
                            </MenuItem>
                            <MenuItem 
                              icon={<Trash2 size={16} />}
                              color="red.500"
                              onClick={() => handleClearDay(day)}
                            >
                              Clear Day
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </CardBody>
      </Card>

      {/* View Staff Details Modal */}
      <Modal isOpen={isViewModalOpen} onClose={handleViewModalClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" color="white">
            <HStack spacing={3}>
              <Icon as={Eye} />
              <Text>{selectedSchedule ? `${selectedSchedule.day} Schedule Details` : 'Staff Details'}</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody p={6}>
            {selectedSchedule ? (
              // Show day schedule details
              <VStack spacing={4} align="start">
                <Text fontSize="lg" fontWeight="semibold" color="blue.600">
                  {selectedSchedule.day} Assignments
                </Text>
                {selectedSchedule.assignments.length > 0 ? (
                  <SimpleGrid columns={1} spacing={3} w="full">
                    {selectedSchedule.assignments.map((staff, idx) => (
                      <Card key={idx} variant="outline">
                        <CardBody p={4}>
                          <HStack spacing={4}>
                            <Avatar 
                              size="md" 
                              name={staff.name}
                              bg={`${getDepartmentColor(staff.department)}.500`}
                              color="white"
                            />
                            <VStack align="start" spacing={1} flex="1">
                              <Text fontWeight="semibold">{staff.name}</Text>
                              <Text fontSize="sm" color="gray.600">{staff.role}</Text>
                              <HStack spacing={2}>
                                <Badge colorScheme={getDepartmentColor(staff.department)} size="sm">
                                  {staff.department}
                                </Badge>
                                <Badge colorScheme={getShiftColor(staff.shift)} size="sm">
                                  {staff.shift}
                                </Badge>
                                <Badge colorScheme={getStatusColor(staff.status)} size="sm">
                                  {staff.status}
                                </Badge>
                              </HStack>
                              <Text fontSize="xs" color="gray.500">
                                <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                                {staff.time}
                              </Text>
                            </VStack>
                          </HStack>
                        </CardBody>
                      </Card>
                    ))}
                  </SimpleGrid>
                ) : (
                  <Box textAlign="center" py={8}>
                    <Text color="gray.500">No staff assigned for {selectedSchedule.day}</Text>
                  </Box>
                )}
              </VStack>
            ) : selectedStaff ? (
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
                <Box>
                  <Text fontSize="lg" fontWeight="semibold" mb={4} color="blue.600">
                    Personal Information
                  </Text>
                  <VStack align="start" spacing={3}>
                    <HStack>
                      <Avatar 
                        size="lg" 
                        name={selectedStaff.name}
                        bg={`${getDepartmentColor(selectedStaff.department)}.500`}
                        color="white"
                      />
                      <VStack align="start">
                        <Text fontWeight="bold">{selectedStaff.name}</Text>
                        <Text color="gray.600">{selectedStaff.role}</Text>
                        <Badge colorScheme={getDepartmentColor(selectedStaff.department)}>
                          {selectedStaff.department}
                        </Badge>
                      </VStack>
                    </HStack>
                    <SimpleGrid columns={1} spacing={3} w="full">
                      <Box>
                        <Text fontSize="sm" color="gray.600">Experience</Text>
                        <Text fontWeight="semibold">{selectedStaff.experience}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Specialization</Text>
                        <Text fontWeight="semibold">{selectedStaff.specialization}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Shift Status</Text>
                        <Badge colorScheme={getStatusColor(selectedStaff.status)} size="lg">
                          {selectedStaff.status}
                        </Badge>
                      </Box>
                    </SimpleGrid>
                  </VStack>
                </Box>

                <Box>
                  <Text fontSize="lg" fontWeight="semibold" mb={4} color="green.600">
                    Shift Information
                  </Text>
                  <VStack align="start" spacing={3}>
                    <SimpleGrid columns={1} spacing={3} w="full">
                      <Box>
                        <Text fontSize="sm" color="gray.600">Shift Type</Text>
                        <Badge colorScheme={getShiftColor(selectedStaff.shift)} size="lg">
                          {selectedStaff.shift} Shift
                        </Badge>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Time</Text>
                        <HStack>
                          <Clock size={16} />
                          <Text fontWeight="semibold">{selectedStaff.time}</Text>
                        </HStack>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Department</Text>
                        <Text fontWeight="semibold">{selectedStaff.department}</Text>
                      </Box>
                    </SimpleGrid>
                  </VStack>
                </Box>
              </Grid>
            ) : null}
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button colorScheme="blue" leftIcon={<Edit size={16} />}>
                Edit Assignment
              </Button>
              <Button variant="outline" onClick={handleViewModalClose}>
                Close
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add Staff Duty Modal */}
      <Modal isOpen={isAddModalOpen} onClose={onAddModalClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" color="white">
            <HStack spacing={3}>
              <Icon as={Plus} />
              <Text>Add Staff Duty</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody p={6}>
            <VStack spacing={4}>
              <SimpleGrid columns={2} spacing={4} w="full">
                <FormControl isRequired>
                  <FormLabel>Day</FormLabel>
                  <Select 
                    placeholder="Select day"
                    value={dutyForm.day}
                    onChange={(e) => handleDutyFormChange('day', e.target.value)}
                  >
                    {daysOfWeek.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Shift</FormLabel>
                  <Select 
                    value={dutyForm.shift}
                    onChange={(e) => handleDutyFormChange('shift', e.target.value)}
                  >
                    <option value="Morning">Morning (9AM-5PM)</option>
                    <option value="Day">Day (8AM-8PM)</option>
                    <option value="Evening">Evening (2PM-10PM)</option>
                    <option value="Night">Night (8PM-8AM)</option>
                  </Select>
                </FormControl>
              </SimpleGrid>
              <FormControl isRequired>
                <FormLabel>Staff Member</FormLabel>
                <Select 
                  placeholder="Select staff member"
                  value={dutyForm.staffName}
                  onChange={(e) => handleDutyFormChange('staffName', e.target.value)}
                >
                  <option value="Dr. Ramesh Ayurveda">Dr. Ramesh Ayurveda</option>
                  <option value="Nurse Priya Sharma">Nurse Priya Sharma</option>
                  <option value="Dr. Sunita Herbs">Dr. Sunita Herbs</option>
                  <option value="Nurse Meera Reddy">Nurse Meera Reddy</option>
                  <option value="Mr. Amit Patel">Mr. Amit Patel</option>
                  <option value="Lab Tech Suresh">Lab Tech Suresh</option>
                  <option value="Admin Anita Singh">Admin Anita Singh</option>
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Department</FormLabel>
                <Select 
                  placeholder="Select department"
                  value={dutyForm.department}
                  onChange={(e) => handleDutyFormChange('department', e.target.value)}
                >
                  <option value="Medical">Medical</option>
                  <option value="Nursing">Nursing</option>
                  <option value="Pharmacy">Pharmacy</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Laboratory">Laboratory</option>
                  <option value="Administration">Administration</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Location</FormLabel>
                <Input 
                  placeholder="e.g., Ward 1, OPD, Emergency Room"
                  value={dutyForm.location}
                  onChange={(e) => handleDutyFormChange('location', e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select 
                  value={dutyForm.status}
                  onChange={(e) => handleDutyFormChange('status', e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Notes (Optional)</FormLabel>
                <Input 
                  placeholder="Additional notes or instructions"
                  value={dutyForm.notes}
                  onChange={(e) => handleDutyFormChange('notes', e.target.value)}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button 
                colorScheme="blue"
                onClick={handleAddDuty}
                leftIcon={<Plus size={16} />}
              >
                Add Duty
              </Button>
              <Button variant="outline" onClick={onAddModalClose}>
                Cancel
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Schedule Modal */}
      <Modal isOpen={isEditModalOpen} onClose={onEditModalClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" color="white">
            <HStack spacing={3}>
              <Icon as={Edit} />
              <Text>Edit Schedule - {selectedStaff?.day}</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody p={6}>
            {selectedStaff && (
              <VStack spacing={6}>
                <Box w="full">
                  <Text fontSize="lg" fontWeight="semibold" mb={4} color="blue.600">
                    Current Assignments for {selectedStaff.day}
                  </Text>
                  {selectedStaff.assignments.length > 0 ? (
                    <VStack spacing={3}>
                      {selectedStaff.assignments.map((assignment, index) => (
                        <Card key={index} w="full" variant="outline">
                          <CardBody p={4}>
                            <Flex justify="space-between" align="center">
                              <VStack align="start" spacing={1}>
                                <HStack>
                                  <Text fontWeight="semibold">{assignment.name}</Text>
                                  <Badge colorScheme="blue">{assignment.department}</Badge>
                                </HStack>
                                <HStack spacing={4} fontSize="sm" color="gray.600">
                                  <HStack spacing={1}>
                                    <Clock size={14} />
                                    <Text>{assignment.time}</Text>
                                  </HStack>
                                  <HStack spacing={1}>
                                    <Shield size={14} />
                                    <Text>{assignment.shift}</Text>
                                  </HStack>
                                </HStack>
                              </VStack>
                              <HStack spacing={2}>
                                <Badge 
                                  colorScheme={assignment.status === 'confirmed' ? 'green' : 'yellow'}
                                >
                                  {assignment.status}
                                </Badge>
                                <IconButton
                                  icon={<Trash2 size={16} />}
                                  size="sm"
                                  variant="ghost"
                                  colorScheme="red"
                                  aria-label="Remove assignment"
                                  onClick={() => handleDeleteAssignment(selectedStaff.day, assignment.id)}
                                />
                              </HStack>
                            </Flex>
                          </CardBody>
                        </Card>
                      ))}
                    </VStack>
                  ) : (
                    <Box textAlign="center" py={8} color="gray.500">
                      <Text>No assignments for this day</Text>
                      <Button
                        mt={3}
                        colorScheme="blue"
                        size="sm"
                        leftIcon={<Plus size={16} />}
                        onClick={() => {
                          onEditModalClose();
                          onAddModalOpen();
                        }}
                      >
                        Add First Assignment
                      </Button>
                    </Box>
                  )}
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button 
                colorScheme="blue" 
                leftIcon={<Plus size={16} />}
                onClick={() => {
                  onEditModalClose();
                  onAddModalOpen();
                }}
              >
                Add New Assignment
              </Button>
              <Button 
                colorScheme="green" 
                leftIcon={<Copy size={16} />}
                onClick={() => handleDuplicateSchedule(selectedStaff?.day)}
              >
                Duplicate Day
              </Button>
              <Button variant="outline" onClick={onEditModalClose}>
                Close
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DutyRoster;
