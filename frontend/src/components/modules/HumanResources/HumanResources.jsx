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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  SimpleGrid,
  Divider,
  Icon,
  useToast,
  FormControl,
  FormLabel,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Radio,
  RadioGroup,
  Stack
} from '@chakra-ui/react';
import {
  Users,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Eye,
  Phone,
  Mail,
  Star,
  UserCheck,
  Trash2,
  DollarSign,
  TrendingUp,
  FileText,
  Download,
  ChevronDown,
  FileSpreadsheet,
  FileDown
} from 'lucide-react';

// Mock HR data - Comprehensive employee database
const mockEmployees = [
  {
    id: 'EMP001',
    employeeId: '20001',
    name: 'Dr. Ramesh Ayurveda',
    designation: 'Senior Ayurvedic Doctor',
    department: 'Medical',
    phone: '+91 9876543210',
    email: 'ramesh@hospital.com',
    joinDate: '2020-01-15',
    status: 'Active',
    shift: 'Morning',
    salary: 85000,
    experience: '15 years',
    qualification: 'BAMS, MD (Ayurveda)',
    address: '123 Medical Street, Mumbai',
    emergencyContact: '+91 9876543299',
    bloodGroup: 'O+',
    dateOfBirth: '1978-05-20',
    gender: 'Male',
    maritalStatus: 'Married',
    workLocation: 'Main Building',
    reportingManager: 'Dr. Chief Medical Officer',
    performanceRating: 4.8,
    leaveBalance: 15,
    attendance: 95,
    projects: ['Panchakarma Unit', 'Research Wing'],
    skills: ['Ayurvedic Treatment', 'Patient Care', 'Herbal Medicine'],
    lastAppraisal: '2024-01-15',
    nextAppraisal: '2025-01-15'
  },
  {
    id: 'EMP002',
    employeeId: '20002',
    name: 'Priya Sharma',
    designation: 'Head Nurse',
    department: 'Nursing',
    phone: '+91 9876543211',
    email: 'priya@hospital.com',
    joinDate: '2019-03-10',
    status: 'Active',
    shift: 'Day',
    salary: 45000,
    experience: '8 years',
    qualification: 'B.Sc Nursing, MSc Nursing',
    address: '456 Care Avenue, Delhi',
    emergencyContact: '+91 9876543288',
    bloodGroup: 'A+',
    dateOfBirth: '1985-08-15',
    gender: 'Female',
    maritalStatus: 'Single',
    workLocation: 'Ward 1',
    reportingManager: 'Chief Nursing Officer',
    performanceRating: 4.6,
    leaveBalance: 12,
    attendance: 92,
    projects: ['Patient Care Initiative', 'Quality Improvement'],
    skills: ['Patient Care', 'Emergency Response', 'Administration'],
    lastAppraisal: '2024-03-10',
    nextAppraisal: '2025-03-10'
  },
  {
    id: 'EMP003',
    employeeId: '20003',
    name: 'Amit Patel',
    designation: 'Senior Pharmacist',
    department: 'Pharmacy',
    phone: '+91 9876543212',
    email: 'amit@hospital.com',
    joinDate: '2021-06-20',
    status: 'Active',
    shift: 'Evening',
    salary: 35000,
    experience: '5 years',
    qualification: 'B.Pharm, Pharm.D',
    address: '789 Medicine Lane, Ahmedabad',
    emergencyContact: '+91 9876543277',
    bloodGroup: 'B+',
    dateOfBirth: '1988-12-10',
    gender: 'Male',
    maritalStatus: 'Married',
    workLocation: 'Pharmacy',
    reportingManager: 'Chief Pharmacist',
    performanceRating: 4.4,
    leaveBalance: 18,
    attendance: 88,
    projects: ['Inventory Management', 'Drug Safety Program'],
    skills: ['Drug Management', 'Inventory Control', 'Patient Counseling'],
    lastAppraisal: '2024-06-20',
    nextAppraisal: '2025-06-20'
  },
  {
    id: 'EMP004',
    employeeId: '20004',
    name: 'Dr. Meera Reddy',
    designation: 'Junior Doctor',
    department: 'Medical',
    phone: '+91 9876543213',
    email: 'meera@hospital.com',
    joinDate: '2022-09-01',
    status: 'Active',
    shift: 'Night',
    salary: 65000,
    experience: '3 years',
    qualification: 'MBBS, MD (Dermatology)',
    address: '321 Health Plaza, Hyderabad',
    emergencyContact: '+91 9876543266',
    bloodGroup: 'AB+',
    dateOfBirth: '1990-03-25',
    gender: 'Female',
    maritalStatus: 'Single',
    workLocation: 'OPD',
    reportingManager: 'Dr. Ramesh Ayurveda',
    performanceRating: 4.2,
    leaveBalance: 20,
    attendance: 90,
    projects: ['Skin Care Unit', 'Telemedicine'],
    skills: ['Dermatology', 'Patient Consultation', 'Digital Health'],
    lastAppraisal: '2024-09-01',
    nextAppraisal: '2025-09-01'
  },
  {
    id: 'EMP005',
    employeeId: '20005',
    name: 'Suresh Nair',
    designation: 'Lab Technician',
    department: 'Laboratory',
    phone: '+91 9876543214',
    email: 'suresh@hospital.com',
    joinDate: '2020-11-05',
    status: 'On Leave',
    shift: 'Morning',
    salary: 28000,
    experience: '6 years',
    qualification: 'B.Sc Medical Lab Technology',
    address: '654 Science Road, Kochi',
    emergencyContact: '+91 9876543255',
    bloodGroup: 'B-',
    dateOfBirth: '1987-07-12',
    gender: 'Male',
    maritalStatus: 'Married',
    workLocation: 'Laboratory',
    reportingManager: 'Chief Lab Technician',
    performanceRating: 4.0,
    leaveBalance: 5,
    attendance: 85,
    projects: ['Lab Automation', 'Quality Control'],
    skills: ['Lab Testing', 'Equipment Handling', 'Quality Assurance'],
    lastAppraisal: '2024-11-05',
    nextAppraisal: '2025-11-05'
  },
  {
    id: 'EMP006',
    employeeId: '20006',
    name: 'Anita Singh',
    designation: 'Admin Executive',
    department: 'Administration',
    phone: '+91 9876543215',
    email: 'anita@hospital.com',
    joinDate: '2019-08-12',
    status: 'Active',
    shift: 'Day',
    salary: 32000,
    experience: '7 years',
    qualification: 'MBA (Healthcare Management)',
    address: '987 Admin Block, Jaipur',
    emergencyContact: '+91 9876543244',
    bloodGroup: 'O-',
    dateOfBirth: '1986-11-30',
    gender: 'Female',
    maritalStatus: 'Married',
    workLocation: 'Admin Block',
    reportingManager: 'HR Manager',
    performanceRating: 4.5,
    leaveBalance: 10,
    attendance: 94,
    projects: ['Digital Transformation', 'Process Improvement'],
    skills: ['Administration', 'Process Management', 'Digital Systems'],
    lastAppraisal: '2024-08-12',
    nextAppraisal: '2025-08-12'
  }
];

const HumanResources = ({ title = "Human Resources Management", showAddButton = true }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState(mockEmployees);
  
  // Form state for add employee
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    designation: '',
    department: '',
    phone: '',
    email: '',
    qualification: '',
    salary: '',
    shift: 'Morning',
    address: '',
    emergencyContact: '',
    bloodGroup: '',
    dateOfBirth: '',
    gender: 'Male',
    maritalStatus: 'Single',
    workLocation: '',
    reportingManager: '',
    experience: '',
    skills: '',
    projects: ''
  });
  
  // Modal states
  const { isOpen: isViewModalOpen, onOpen: onViewModalOpen, onClose: onViewModalClose } = useDisclosure();
  const { isOpen: isAddModalOpen, onOpen: onAddModalOpen, onClose: onAddModalClose } = useDisclosure();
  const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure();
  
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');

  // Filter employees
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || employee.department.toLowerCase() === departmentFilter;
    const matchesStatus = statusFilter === 'all' || employee.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Calculate statistics
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status === 'Active').length;
  const totalSalary = employees.reduce((sum, emp) => sum + emp.salary, 0);
  const avgAttendance = employees.reduce((sum, emp) => sum + emp.attendance, 0) / totalEmployees;

  // Helper functions
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'green';
      case 'on leave': return 'yellow';
      case 'inactive': return 'red';
      default: return 'gray';
    }
  };

  const getDepartmentColor = (department) => {
    switch (department.toLowerCase()) {
      case 'medical': return 'blue';
      case 'nursing': return 'teal';
      case 'pharmacy': return 'purple';
      case 'laboratory': return 'orange';
      case 'administration': return 'cyan';
      default: return 'gray';
    }
  };

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    onViewModalOpen();
  };

  const handleDeleteEmployee = (employee) => {
    toast({
      title: "Employee Deleted",
      description: `${employee.name} has been removed from the system.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setEmployeeForm({
      name: employee.name,
      designation: employee.designation,
      department: employee.department,
      phone: employee.phone,
      email: employee.email,
      qualification: employee.qualification,
      salary: employee.salary.toString(),
      shift: employee.shift,
      address: employee.address,
      emergencyContact: employee.emergencyContact,
      bloodGroup: employee.bloodGroup,
      dateOfBirth: employee.dateOfBirth,
      gender: employee.gender,
      maritalStatus: employee.maritalStatus,
      workLocation: employee.workLocation,
      reportingManager: employee.reportingManager,
      experience: employee.experience,
      skills: employee.skills.join(', '),
      projects: employee.projects.join(', ')
    });
    onEditModalOpen();
  };

  const handleUpdateEmployee = () => {
    if (!employeeForm.name || !employeeForm.designation || !employeeForm.department) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const updatedEmployees = employees.map(emp => {
      if (emp.id === selectedEmployee.id) {
        return {
          ...emp,
          name: employeeForm.name,
          designation: employeeForm.designation,
          department: employeeForm.department,
          phone: employeeForm.phone,
          email: employeeForm.email,
          qualification: employeeForm.qualification,
          salary: parseInt(employeeForm.salary) || 0,
          shift: employeeForm.shift,
          address: employeeForm.address,
          emergencyContact: employeeForm.emergencyContact,
          bloodGroup: employeeForm.bloodGroup,
          dateOfBirth: employeeForm.dateOfBirth,
          gender: employeeForm.gender,
          maritalStatus: employeeForm.maritalStatus,
          workLocation: employeeForm.workLocation,
          reportingManager: employeeForm.reportingManager,
          experience: employeeForm.experience,
          skills: employeeForm.skills.split(',').map(s => s.trim()).filter(s => s),
          projects: employeeForm.projects.split(',').map(s => s.trim()).filter(s => s)
        };
      }
      return emp;
    });

    setEmployees(updatedEmployees);
    onEditModalClose();
    
    toast({
      title: "Employee Updated",
      description: `${employeeForm.name} has been updated successfully.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleGenerateReport = (employee) => {
    const reportContent = `EMPLOYEE REPORT
===================

PERSONAL INFORMATION:
- Employee ID: ${employee.employeeId}
- Name: ${employee.name}
- Designation: ${employee.designation}
- Department: ${employee.department}
- Gender: ${employee.gender}
- Date of Birth: ${employee.dateOfBirth}
- Blood Group: ${employee.bloodGroup}
- Marital Status: ${employee.maritalStatus}

CONTACT INFORMATION:
- Phone: ${employee.phone}
- Email: ${employee.email}
- Address: ${employee.address}
- Emergency Contact: ${employee.emergencyContact}

PROFESSIONAL INFORMATION:
- Join Date: ${employee.joinDate}
- Experience: ${employee.experience}
- Qualification: ${employee.qualification}
- Salary: ₹${employee.salary.toLocaleString('en-IN')}
- Work Location: ${employee.workLocation}
- Reporting Manager: ${employee.reportingManager}
- Shift: ${employee.shift}
- Status: ${employee.status}

PERFORMANCE METRICS:
- Performance Rating: ${employee.performanceRating}/5.0
- Attendance: ${employee.attendance}%
- Leave Balance: ${employee.leaveBalance} days

SKILLS & PROJECTS:
- Skills: ${employee.skills.join(', ')}
- Current Projects: ${employee.projects.join(', ')}

APPRAISAL INFORMATION:
- Last Appraisal: ${employee.lastAppraisal}
- Next Appraisal: ${employee.nextAppraisal}

Generated on: ${new Date().toLocaleString()}
Generated by: Hospital Management System`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${employee.name.replace(/\s+/g, '_')}_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Report Generated",
      description: `Employee report for ${employee.name} has been downloaded.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Form handling functions
  const handleFormChange = (field, value) => {
    setEmployeeForm(prev => ({ ...prev, [field]: value }));
  };

  const generateEmployeeId = () => {
    const maxId = Math.max(...employees.map(emp => parseInt(emp.employeeId))) || 20000;
    return (maxId + 1).toString();
  };

  const handleAddEmployee = () => {
    // Validate required fields
    if (!employeeForm.name || !employeeForm.designation || !employeeForm.department || 
        !employeeForm.phone || !employeeForm.email || !employeeForm.salary) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Create new employee object
    const newEmployee = {
      id: `EMP${(employees.length + 1).toString().padStart(3, '0')}`,
      employeeId: generateEmployeeId(),
      ...employeeForm,
      salary: parseInt(employeeForm.salary),
      joinDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      performanceRating: 4.0,
      leaveBalance: 24,
      attendance: 100,
      projects: employeeForm.projects ? employeeForm.projects.split(',').map(p => p.trim()) : [],
      skills: employeeForm.skills ? employeeForm.skills.split(',').map(s => s.trim()) : [],
      lastAppraisal: new Date().toISOString().split('T')[0],
      nextAppraisal: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    // Add to employees list
    setEmployees(prev => [...prev, newEmployee]);

    // Reset form
    setEmployeeForm({
      name: '',
      designation: '',
      department: '',
      phone: '',
      email: '',
      qualification: '',
      salary: '',
      shift: 'Morning',
      address: '',
      emergencyContact: '',
      bloodGroup: '',
      dateOfBirth: '',
      gender: 'Male',
      maritalStatus: 'Single',
      workLocation: '',
      reportingManager: '',
      experience: '',
      skills: '',
      projects: ''
    });

    // Close modal and show success message
    onAddModalClose();
    toast({
      title: "Employee Added",
      description: `${newEmployee.name} has been successfully added to the system.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Export functions
  const exportToPDF = () => {
    const exportData = filteredEmployees.map(emp => ({
      'Employee ID': emp.employeeId,
      'Name': emp.name,
      'Designation': emp.designation,
      'Department': emp.department,
      'Phone': emp.phone,
      'Email': emp.email,
      'Join Date': emp.joinDate,
      'Status': emp.status,
      'Salary': `₹${emp.salary.toLocaleString('en-IN')}`,
      'Performance': emp.performanceRating,
      'Attendance': `${emp.attendance}%`
    }));

    // Create table-formatted PDF content
    let pdfContent = 'EMPLOYEE REPORT\n';
    pdfContent += '='.repeat(120) + '\n\n';
    pdfContent += `Generated on: ${new Date().toLocaleDateString()}\n`;
    pdfContent += `Total Employees: ${exportData.length}\n\n`;
    
    // Table headers
    const headers = ['ID', 'Name', 'Designation', 'Department', 'Phone', 'Status', 'Salary', 'Rating'];
    pdfContent += headers.map(h => h.padEnd(15)).join(' | ') + '\n';
    pdfContent += '-'.repeat(140) + '\n';
    
    // Table rows
    exportData.forEach(emp => {
      const row = [
        emp['Employee ID'].padEnd(15),
        emp.Name.substring(0, 14).padEnd(15),
        emp.Designation.substring(0, 14).padEnd(15),
        emp.Department.padEnd(15),
        emp.Phone.padEnd(15),
        emp.Status.padEnd(15),
        emp.Salary.padEnd(15),
        emp.Performance.toString().padEnd(15)
      ];
      pdfContent += row.join(' | ') + '\n';
    });
    
    pdfContent += '\n' + '='.repeat(120) + '\n';
    pdfContent += 'End of Report\n';

    // Download as formatted text file
    const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Employee_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "PDF Export Complete",
      description: "Employee report has been downloaded as formatted text file.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const exportToExcel = () => {
    const exportData = filteredEmployees.map(emp => ({
      'Employee ID': emp.employeeId,
      'Name': emp.name,
      'Designation': emp.designation,
      'Department': emp.department,
      'Phone': emp.phone,
      'Email': emp.email,
      'Join Date': emp.joinDate,
      'Status': emp.status,
      'Salary': emp.salary,
      'Performance Rating': emp.performanceRating,
      'Attendance (%)': emp.attendance,
      'Leave Balance': emp.leaveBalance,
      'Work Location': emp.workLocation,
      'Reporting Manager': emp.reportingManager,
      'Qualification': emp.qualification,
      'Experience': emp.experience,
      'Blood Group': emp.bloodGroup,
      'Gender': emp.gender,
      'Marital Status': emp.maritalStatus
    }));

    // Create proper Excel XML format
    const headers = Object.keys(exportData[0]);
    
    let excelContent = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Title>Employee Data Export</Title>
 </DocumentProperties>
 <Worksheet ss:Name="Employee Data">
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
        let value = row[header];
        let dataType = "String";
        
        // Determine data type for Excel
        if (header === 'Salary' || header === 'Performance Rating' || header === 'Attendance (%)' || header === 'Leave Balance') {
          dataType = "Number";
          value = value || 0;
        } else {
          value = String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }
        
        excelContent += `
    <Cell><Data ss:Type="${dataType}">${value}</Data></Cell>`;
      });
      excelContent += `
   </Row>`;
    });

    excelContent += `
  </Table>
 </Worksheet>
</Workbook>`;

    const blob = new Blob([excelContent], { 
      type: 'application/vnd.ms-excel' 
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Employee_Data_${new Date().toISOString().split('T')[0]}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Excel Export Complete",
      description: "Employee data has been downloaded as Excel file.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const exportToCSV = () => {
    const exportData = filteredEmployees.map(emp => ({
      'Employee_ID': emp.employeeId,
      'Name': emp.name,
      'Designation': emp.designation,
      'Department': emp.department,
      'Phone': emp.phone,
      'Email': emp.email,
      'Join_Date': emp.joinDate,
      'Status': emp.status,
      'Salary': emp.salary,
      'Performance_Rating': emp.performanceRating,
      'Attendance_Percent': emp.attendance
    }));

    // Create standard CSV content with proper escaping
    const headers = Object.keys(exportData[0]);
    let csvContent = headers.join(',') + '\n';
    
    exportData.forEach(row => {
      const values = headers.map(header => {
        let value = row[header];
        // Convert to string and handle special characters
        value = String(value || '');
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          value = '"' + value.replace(/"/g, '""') + '"';
        }
        return value;
      });
      csvContent += values.join(',') + '\n';
    });

    // Download as CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Employee_Data_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "CSV Export Complete",
      description: "Employee data has been downloaded as CSV file.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box p={6}>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Text fontSize="3xl" fontWeight="bold" bgGradient="linear(to-r, blue.600, purple.600)" bgClip="text">
            {title}
          </Text>
          <Text color="gray.600" fontSize="lg">
            Comprehensive staff management and HR operations
          </Text>
        </Box>
        {showAddButton && (
          <HStack spacing={3}>
            <Button 
              colorScheme="blue" 
              leftIcon={<Plus size={20} />}
              size="lg"
              onClick={onAddModalOpen}
            >
              Add Employee
            </Button>
            <Menu>
              <MenuButton
                as={Button}
                colorScheme="green"
                leftIcon={<Download size={20} />}
                rightIcon={<ChevronDown size={16} />}
                variant="outline"
                size="lg"
              >
                Export
              </MenuButton>
              <MenuList>
                <MenuItem 
                  icon={<FileDown size={16} />}
                  onClick={exportToPDF}
                >
                  Export as PDF
                </MenuItem>
                <MenuItem 
                  icon={<FileSpreadsheet size={16} />}
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
          </HStack>
        )}
      </Flex>

      {/* KPI Cards */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={6} mb={8}>
        <Card bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" color="white">
          <CardBody>
            <HStack spacing={4}>
              <Icon as={Users} size={40} />
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" opacity={0.9}>Total Employees</Text>
                <Text fontSize="2xl" fontWeight="bold">{totalEmployees}</Text>
                <Text fontSize="xs" opacity={0.8}>+2 this month</Text>
              </VStack>
            </HStack>
          </CardBody>
        </Card>

        <Card bg="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" color="white">
          <CardBody>
            <HStack spacing={4}>
              <Icon as={UserCheck} size={40} />
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" opacity={0.9}>Active Staff</Text>
                <Text fontSize="2xl" fontWeight="bold">{activeEmployees}</Text>
                <Text fontSize="xs" opacity={0.8}>{((activeEmployees/totalEmployees)*100).toFixed(1)}% active</Text>
              </VStack>
            </HStack>
          </CardBody>
        </Card>

        <Card bg="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" color="white">
          <CardBody>
            <HStack spacing={4}>
              <Icon as={DollarSign} size={40} />
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" opacity={0.9}>Monthly Payroll</Text>
                <Text fontSize="2xl" fontWeight="bold">₹{(totalSalary/1000).toFixed(0)}K</Text>
                <Text fontSize="xs" opacity={0.8}>All departments</Text>
              </VStack>
            </HStack>
          </CardBody>
        </Card>

        <Card bg="linear-gradient(135deg, #fa709a 0%, #fee140 100%)" color="white">
          <CardBody>
            <HStack spacing={4}>
              <Icon as={TrendingUp} size={40} />
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" opacity={0.9}>Avg Attendance</Text>
                <Text fontSize="2xl" fontWeight="bold">{avgAttendance.toFixed(1)}%</Text>
                <Text fontSize="xs" opacity={0.8}>Last 6 months</Text>
              </VStack>
            </HStack>
          </CardBody>
        </Card>
      </Grid>

      {/* Filters */}
      <Card bg={cardBg} mb={6}>
        <CardBody>
          <Flex gap={4} wrap="wrap" align="center">
            <HStack spacing={2} flex="1" minW="300px">
              <Icon as={Search} color="gray.400" />
              <Input
                placeholder="Search employees by name, ID, or designation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                bg="white"
                border="2px solid"
                borderColor="gray.200"
                _focus={{ borderColor: "blue.400" }}
              />
            </HStack>
            <Select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              w="200px"
              bg="white"
            >
              <option value="all">All Departments</option>
              <option value="medical">Medical</option>
              <option value="nursing">Nursing</option>
              <option value="pharmacy">Pharmacy</option>
              <option value="laboratory">Laboratory</option>
              <option value="administration">Administration</option>
            </Select>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              w="150px"
              bg="white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="on leave">On Leave</option>
              <option value="inactive">Inactive</option>
            </Select>
          </Flex>
        </CardBody>
      </Card>

      {/* Employee Table */}
      <Card bg={cardBg}>
        <CardBody p={0}>
          <TableContainer>
            <Table variant="simple" size="md">
              <Thead bg="gray.50">
                <Tr>
                  <Th>Employee</Th>
                  <Th>Department</Th>
                  <Th>Contact</Th>
                  <Th>Performance</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredEmployees.map((employee) => (
                  <Tr key={employee.id} _hover={{ bg: "gray.50" }}>
                    <Td>
                      <HStack spacing={3}>
                        <Avatar 
                          size="md" 
                          name={employee.name}
                          bg="linear-gradient(135deg, #667eea, #764ba2)"
                          color="white"
                        />
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="semibold" fontSize="sm">{employee.name}</Text>
                          <Text fontSize="xs" color="gray.500">
                            ID: {employee.employeeId}
                          </Text>
                          <Text fontSize="xs" color="gray.500">{employee.designation}</Text>
                        </VStack>
                      </HStack>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <Badge colorScheme={getDepartmentColor(employee.department)} px={2} py={1}>
                          {employee.department}
                        </Badge>
                        <Text fontSize="xs" color="gray.500">{employee.shift} Shift</Text>
                      </VStack>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <HStack fontSize="xs" color="gray.600" spacing={1}>
                          <Phone size={12} />
                          <Text>{employee.phone}</Text>
                        </HStack>
                        <HStack fontSize="xs" color="gray.600" spacing={1}>
                          <Mail size={12} />
                          <Text>{employee.email}</Text>
                        </HStack>
                      </VStack>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={2}>
                        <HStack spacing={2}>
                          <Star size={14} color="gold" />
                          <Text fontSize="sm" fontWeight="semibold">{employee.performanceRating}</Text>
                        </HStack>
                        <VStack align="start" spacing={1}>
                          <Text fontSize="xs" color="gray.600">Attendance: {employee.attendance}%</Text>
                        </VStack>
                      </VStack>
                    </Td>
                    <Td>
                      <Badge 
                        colorScheme={getStatusColor(employee.status)} 
                        px={2} 
                        py={1}
                        borderRadius="full"
                      >
                        {employee.status}
                      </Badge>
                    </Td>
                    <Td>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          aria-label="Options"
                          icon={<MoreVertical size={16} />}
                          variant="ghost"
                          size="sm"
                        />
                        <MenuList>
                          <MenuItem 
                            icon={<Eye size={16} />}
                            onClick={() => handleViewEmployee(employee)}
                          >
                            View Details
                          </MenuItem>
                          <MenuItem 
                            icon={<Edit size={16} />}
                            onClick={() => handleEditEmployee(employee)}
                          >
                            Edit Employee
                          </MenuItem>
                          <MenuItem 
                            icon={<FileText size={16} />}
                            onClick={() => handleGenerateReport(employee)}
                          >
                            Generate Report
                          </MenuItem>
                          <Divider />
                          <MenuItem 
                            icon={<Trash2 size={16} />}
                            color="red.500"
                            onClick={() => handleDeleteEmployee(employee)}
                          >
                            Delete Employee
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          
          {filteredEmployees.length === 0 && (
            <Box textAlign="center" py={8}>
              <Text color="gray.500">No employees found matching your criteria</Text>
            </Box>
          )}
        </CardBody>
      </Card>

      {/* View Employee Modal */}
      <Modal isOpen={isViewModalOpen} onClose={onViewModalClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" color="white">
            <HStack spacing={3}>
              <Icon as={Eye} />
              <Text>Employee Details</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody p={6}>
            {selectedEmployee && (
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
                {/* Personal Information */}
                <Box>
                  <Text fontSize="lg" fontWeight="semibold" mb={4} color="blue.600">
                    Personal Information
                  </Text>
                  <VStack align="start" spacing={3}>
                    <HStack>
                      <Avatar size="lg" name={selectedEmployee.name} />
                      <VStack align="start">
                        <Text fontWeight="bold">{selectedEmployee.name}</Text>
                        <Text color="gray.600">{selectedEmployee.designation}</Text>
                        <Badge colorScheme={getDepartmentColor(selectedEmployee.department)}>
                          {selectedEmployee.department}
                        </Badge>
                      </VStack>
                    </HStack>
                    <SimpleGrid columns={2} spacing={4} w="full">
                      <Box>
                        <Text fontSize="sm" color="gray.600">Employee ID</Text>
                        <Text fontWeight="semibold">{selectedEmployee.employeeId}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Gender</Text>
                        <Text fontWeight="semibold">{selectedEmployee.gender}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Date of Birth</Text>
                        <Text fontWeight="semibold">{selectedEmployee.dateOfBirth}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Blood Group</Text>
                        <Text fontWeight="semibold">{selectedEmployee.bloodGroup}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Marital Status</Text>
                        <Text fontWeight="semibold">{selectedEmployee.maritalStatus}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Experience</Text>
                        <Text fontWeight="semibold">{selectedEmployee.experience}</Text>
                      </Box>
                    </SimpleGrid>
                  </VStack>
                </Box>

                {/* Professional Information */}
                <Box>
                  <Text fontSize="lg" fontWeight="semibold" mb={4} color="green.600">
                    Professional Information
                  </Text>
                  <VStack align="start" spacing={3}>
                    <SimpleGrid columns={1} spacing={4} w="full">
                      <Box>
                        <Text fontSize="sm" color="gray.600">Qualification</Text>
                        <Text fontWeight="semibold">{selectedEmployee.qualification}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Join Date</Text>
                        <Text fontWeight="semibold">{selectedEmployee.joinDate}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Salary</Text>
                        <Text fontWeight="semibold">₹{selectedEmployee.salary.toLocaleString('en-IN')}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Work Location</Text>
                        <Text fontWeight="semibold">{selectedEmployee.workLocation}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Reporting Manager</Text>
                        <Text fontWeight="semibold">{selectedEmployee.reportingManager}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Performance Rating</Text>
                        <HStack>
                          <Text fontWeight="semibold">{selectedEmployee.performanceRating}</Text>
                          <HStack spacing={0}>
                            {[1,2,3,4,5].map((star) => (
                              <Star 
                                key={star} 
                                size={16} 
                                fill={star <= selectedEmployee.performanceRating ? "gold" : "none"}
                                color="gold"
                              />
                            ))}
                          </HStack>
                        </HStack>
                      </Box>
                    </SimpleGrid>
                  </VStack>
                </Box>

                {/* Contact Information */}
                <Box>
                  <Text fontSize="lg" fontWeight="semibold" mb={4} color="purple.600">
                    Contact Information
                  </Text>
                  <VStack align="start" spacing={3}>
                    <Box>
                      <Text fontSize="sm" color="gray.600">Phone</Text>
                      <Text fontWeight="semibold">{selectedEmployee.phone}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.600">Email</Text>
                      <Text fontWeight="semibold">{selectedEmployee.email}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.600">Address</Text>
                      <Text fontWeight="semibold">{selectedEmployee.address}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.600">Emergency Contact</Text>
                      <Text fontWeight="semibold">{selectedEmployee.emergencyContact}</Text>
                    </Box>
                  </VStack>
                </Box>

                {/* Skills & Projects */}
                <Box>
                  <Text fontSize="lg" fontWeight="semibold" mb={4} color="orange.600">
                    Skills & Projects
                  </Text>
                  <VStack align="start" spacing={3}>
                    <Box>
                      <Text fontSize="sm" color="gray.600">Skills</Text>
                      <HStack spacing={2} wrap="wrap">
                        {selectedEmployee.skills.map((skill, index) => (
                          <Badge key={index} colorScheme="blue" variant="subtle">
                            {skill}
                          </Badge>
                        ))}
                      </HStack>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.600">Current Projects</Text>
                      <VStack align="start" spacing={1}>
                        {selectedEmployee.projects.map((project, index) => (
                          <Text key={index} fontSize="sm">• {project}</Text>
                        ))}
                      </VStack>
                    </Box>
                    <SimpleGrid columns={2} spacing={4} w="full">
                      <Box>
                        <Text fontSize="sm" color="gray.600">Leave Balance</Text>
                        <Text fontWeight="semibold">{selectedEmployee.leaveBalance} days</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Attendance</Text>
                        <Text fontWeight="semibold">{selectedEmployee.attendance}%</Text>
                      </Box>
                    </SimpleGrid>
                  </VStack>
                </Box>
              </Grid>
            )}
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button colorScheme="blue" leftIcon={<Edit size={16} />}>
                Edit Employee
              </Button>
              <Button colorScheme="green" leftIcon={<FileText size={16} />}>
                Generate Report
              </Button>
              <Button variant="outline" onClick={onViewModalClose}>
                Close
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add Employee Modal */}
      <Modal isOpen={isAddModalOpen} onClose={onAddModalClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" color="white">
            <HStack spacing={3}>
              <Icon as={Plus} />
              <Text>Add New Employee</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody p={6}>
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
              {/* Personal Information */}
              <Box>
                <Text fontSize="lg" fontWeight="semibold" mb={4} color="blue.600">
                  Personal Information
                </Text>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Full Name</FormLabel>
                    <Input
                      value={employeeForm.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      placeholder="Enter full name"
                    />
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel>Phone Number</FormLabel>
                    <Input
                      value={employeeForm.phone}
                      onChange={(e) => handleFormChange('phone', e.target.value)}
                      placeholder="+91 9876543210"
                    />
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel>Email Address</FormLabel>
                    <Input
                      type="email"
                      value={employeeForm.email}
                      onChange={(e) => handleFormChange('email', e.target.value)}
                      placeholder="employee@hospital.com"
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Date of Birth</FormLabel>
                    <Input
                      type="date"
                      value={employeeForm.dateOfBirth}
                      onChange={(e) => handleFormChange('dateOfBirth', e.target.value)}
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Gender</FormLabel>
                    <RadioGroup
                      value={employeeForm.gender}
                      onChange={(value) => handleFormChange('gender', value)}
                    >
                      <Stack direction="row">
                        <Radio value="Male">Male</Radio>
                        <Radio value="Female">Female</Radio>
                        <Radio value="Other">Other</Radio>
                      </Stack>
                    </RadioGroup>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Blood Group</FormLabel>
                    <Select
                      value={employeeForm.bloodGroup}
                      onChange={(e) => handleFormChange('bloodGroup', e.target.value)}
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
                    <FormLabel>Marital Status</FormLabel>
                    <RadioGroup
                      value={employeeForm.maritalStatus}
                      onChange={(value) => handleFormChange('maritalStatus', value)}
                    >
                      <Stack direction="row">
                        <Radio value="Single">Single</Radio>
                        <Radio value="Married">Married</Radio>
                        <Radio value="Divorced">Divorced</Radio>
                      </Stack>
                    </RadioGroup>
                  </FormControl>
                </VStack>
              </Box>

              {/* Professional Information */}
              <Box>
                <Text fontSize="lg" fontWeight="semibold" mb={4} color="green.600">
                  Professional Information
                </Text>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Designation</FormLabel>
                    <Input
                      value={employeeForm.designation}
                      onChange={(e) => handleFormChange('designation', e.target.value)}
                      placeholder="e.g., Senior Doctor, Nurse, Pharmacist"
                    />
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel>Department</FormLabel>
                    <Select
                      value={employeeForm.department}
                      onChange={(e) => handleFormChange('department', e.target.value)}
                      placeholder="Select department"
                    >
                      <option value="Medical">Medical</option>
                      <option value="Nursing">Nursing</option>
                      <option value="Pharmacy">Pharmacy</option>
                      <option value="Laboratory">Laboratory</option>
                      <option value="Administration">Administration</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Qualification</FormLabel>
                    <Input
                      value={employeeForm.qualification}
                      onChange={(e) => handleFormChange('qualification', e.target.value)}
                      placeholder="e.g., MBBS, MD, B.Sc Nursing"
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Experience</FormLabel>
                    <Input
                      value={employeeForm.experience}
                      onChange={(e) => handleFormChange('experience', e.target.value)}
                      placeholder="e.g., 5 years"
                    />
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel>Monthly Salary (₹)</FormLabel>
                    <NumberInput
                      value={employeeForm.salary}
                      onChange={(value) => handleFormChange('salary', value)}
                      min={0}
                    >
                      <NumberInputField placeholder="Enter monthly salary" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Work Shift</FormLabel>
                    <Select
                      value={employeeForm.shift}
                      onChange={(e) => handleFormChange('shift', e.target.value)}
                    >
                      <option value="Morning">Morning</option>
                      <option value="Day">Day</option>
                      <option value="Evening">Evening</option>
                      <option value="Night">Night</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Work Location</FormLabel>
                    <Input
                      value={employeeForm.workLocation}
                      onChange={(e) => handleFormChange('workLocation', e.target.value)}
                      placeholder="e.g., Main Building, Ward 1, OPD"
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Reporting Manager</FormLabel>
                    <Input
                      value={employeeForm.reportingManager}
                      onChange={(e) => handleFormChange('reportingManager', e.target.value)}
                      placeholder="Enter reporting manager name"
                    />
                  </FormControl>
                </VStack>
              </Box>

              {/* Additional Information */}
              <Box gridColumn={{ base: "1", md: "1 / -1" }}>
                <Text fontSize="lg" fontWeight="semibold" mb={4} color="purple.600">
                  Additional Information
                </Text>
                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                  <FormControl>
                    <FormLabel>Address</FormLabel>
                    <Textarea
                      value={employeeForm.address}
                      onChange={(e) => handleFormChange('address', e.target.value)}
                      placeholder="Enter complete address"
                      rows={3}
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Emergency Contact</FormLabel>
                    <Input
                      value={employeeForm.emergencyContact}
                      onChange={(e) => handleFormChange('emergencyContact', e.target.value)}
                      placeholder="+91 9876543210"
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Skills (comma-separated)</FormLabel>
                    <Textarea
                      value={employeeForm.skills}
                      onChange={(e) => handleFormChange('skills', e.target.value)}
                      placeholder="e.g., Patient Care, Administration, Emergency Response"
                      rows={3}
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Projects (comma-separated)</FormLabel>
                    <Textarea
                      value={employeeForm.projects}
                      onChange={(e) => handleFormChange('projects', e.target.value)}
                      placeholder="e.g., Quality Improvement, Digital Transformation"
                      rows={3}
                    />
                  </FormControl>
                </Grid>
              </Box>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button colorScheme="blue" onClick={handleAddEmployee} leftIcon={<Plus size={16} />}>
                Add Employee
              </Button>
              <Button variant="outline" onClick={onAddModalClose}>
                Cancel
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Employee Modal */}
      <Modal isOpen={isEditModalOpen} onClose={onEditModalClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" color="white">
            <HStack spacing={3}>
              <Icon as={Edit} />
              <Text>Edit Employee</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody p={6}>
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
              {/* Personal Information */}
              <Box>
                <Text fontSize="lg" fontWeight="semibold" mb={4} color="blue.600">
                  Personal Information
                </Text>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Full Name</FormLabel>
                    <Input
                      value={employeeForm.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      placeholder="Enter full name"
                    />
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel>Designation</FormLabel>
                    <Input
                      value={employeeForm.designation}
                      onChange={(e) => handleFormChange('designation', e.target.value)}
                      placeholder="Enter designation"
                    />
                  </FormControl>
                  
                  <FormControl isRequired>
                    <FormLabel>Department</FormLabel>
                    <Select
                      value={employeeForm.department}
                      onChange={(e) => handleFormChange('department', e.target.value)}
                    >
                      <option value="">Select Department</option>
                      <option value="Medical">Medical</option>
                      <option value="Nursing">Nursing</option>
                      <option value="Pharmacy">Pharmacy</option>
                      <option value="Laboratory">Laboratory</option>
                      <option value="Administration">Administration</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      value={employeeForm.gender}
                      onChange={(e) => handleFormChange('gender', e.target.value)}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Date of Birth</FormLabel>
                    <Input
                      type="date"
                      value={employeeForm.dateOfBirth}
                      onChange={(e) => handleFormChange('dateOfBirth', e.target.value)}
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Blood Group</FormLabel>
                    <Select
                      value={employeeForm.bloodGroup}
                      onChange={(e) => handleFormChange('bloodGroup', e.target.value)}
                    >
                      <option value="">Select Blood Group</option>
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
                    <FormLabel>Marital Status</FormLabel>
                    <Select
                      value={employeeForm.maritalStatus}
                      onChange={(e) => handleFormChange('maritalStatus', e.target.value)}
                    >
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </Select>
                  </FormControl>
                </VStack>
              </Box>

              {/* Professional Information */}
              <Box>
                <Text fontSize="lg" fontWeight="semibold" mb={4} color="green.600">
                  Professional Information
                </Text>
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel>Qualification</FormLabel>
                    <Input
                      value={employeeForm.qualification}
                      onChange={(e) => handleFormChange('qualification', e.target.value)}
                      placeholder="Enter qualification"
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Experience</FormLabel>
                    <Input
                      value={employeeForm.experience}
                      onChange={(e) => handleFormChange('experience', e.target.value)}
                      placeholder="e.g., 5 years"
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Salary</FormLabel>
                    <Input
                      type="number"
                      value={employeeForm.salary}
                      onChange={(e) => handleFormChange('salary', e.target.value)}
                      placeholder="Enter salary amount"
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Shift</FormLabel>
                    <Select
                      value={employeeForm.shift}
                      onChange={(e) => handleFormChange('shift', e.target.value)}
                    >
                      <option value="Morning">Morning</option>
                      <option value="Day">Day</option>
                      <option value="Evening">Evening</option>
                      <option value="Night">Night</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Work Location</FormLabel>
                    <Input
                      value={employeeForm.workLocation}
                      onChange={(e) => handleFormChange('workLocation', e.target.value)}
                      placeholder="Enter work location"
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Reporting Manager</FormLabel>
                    <Input
                      value={employeeForm.reportingManager}
                      onChange={(e) => handleFormChange('reportingManager', e.target.value)}
                      placeholder="Enter reporting manager"
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Skills (comma separated)</FormLabel>
                    <Textarea
                      value={employeeForm.skills}
                      onChange={(e) => handleFormChange('skills', e.target.value)}
                      placeholder="Enter skills separated by commas"
                      rows={3}
                    />
                  </FormControl>
                </VStack>
              </Box>

              {/* Contact Information */}
              <Box>
                <Text fontSize="lg" fontWeight="semibold" mb={4} color="purple.600">
                  Contact Information
                </Text>
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel>Phone Number</FormLabel>
                    <Input
                      value={employeeForm.phone}
                      onChange={(e) => handleFormChange('phone', e.target.value)}
                      placeholder="Enter phone number"
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Email Address</FormLabel>
                    <Input
                      type="email"
                      value={employeeForm.email}
                      onChange={(e) => handleFormChange('email', e.target.value)}
                      placeholder="Enter email address"
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Emergency Contact</FormLabel>
                    <Input
                      value={employeeForm.emergencyContact}
                      onChange={(e) => handleFormChange('emergencyContact', e.target.value)}
                      placeholder="Enter emergency contact"
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Address</FormLabel>
                    <Textarea
                      value={employeeForm.address}
                      onChange={(e) => handleFormChange('address', e.target.value)}
                      placeholder="Enter complete address"
                      rows={4}
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Projects (comma separated)</FormLabel>
                    <Textarea
                      value={employeeForm.projects}
                      onChange={(e) => handleFormChange('projects', e.target.value)}
                      placeholder="Enter current projects separated by commas"
                      rows={3}
                    />
                  </FormControl>
                </VStack>
              </Box>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button colorScheme="blue" onClick={handleUpdateEmployee} leftIcon={<Edit size={16} />}>
                Update Employee
              </Button>
              <Button variant="outline" onClick={onEditModalClose}>
                Cancel
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default HumanResources;
