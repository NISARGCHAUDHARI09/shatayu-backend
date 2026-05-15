import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import axios from 'axios';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Avatar,
  Text,
  Badge,
  Button,
  HStack,
  VStack,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Card,
  CardBody,
  CardHeader,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Grid,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  SimpleGrid,
  Divider,
  Tooltip,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  useToast
} from '@chakra-ui/react';
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Edit,
  Eye,
  Trash2,
  UserPlus,
  Users,
  Activity,
  UserCheck,
  UserX,
  Download,
  Calendar,
  Phone,
  MapPin,
  Heart,
  FileText,
  FileSpreadsheet,
  Leaf,
  Flower2,
  TreePine,
  Upload
} from 'lucide-react';

const API_URL = 'http://localhost:5002/api/patients';

const PatientList = ({ title = "Patient Management" }) => {

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [patients, setPatients] = useState([
    {
      id: 1,
      patientId: 'AYU001',
      name: 'Rajesh Kumar Sharma',
      age: 45,
      gender: 'Male',
      phone: '+91 9876543210',
      email: 'rajesh.sharma@gmail.com',
      address: '123 Gandhi Road, Sector 15, Chandigarh, Punjab',
      city: 'Chandigarh',
      postalCode: '160015',
      country: 'India',
      constitution: 'Vata-Pitta',
      primaryTreatment: 'Panchakarma',
      patientType: 'IPD',
      status: 'admitted',
      lastVisit: '2024-01-15',
      nextAppointment: '2024-01-22',
      emergencyContact: '+91 9876543211'
    },
    {
      id: 2,
      patientId: 'AYU002',
      name: 'Priya Devi Patel',
      age: 32,
      gender: 'Female',
      phone: '+91 9876543212',
      email: 'priya.patel@yahoo.com',
      address: '456 Lotus Valley, Andheri West, Mumbai, Maharashtra',
      city: 'Mumbai',
      postalCode: '400058',
      country: 'India',
      constitution: 'Kapha',
      primaryTreatment: 'Shirodhara',
      patientType: 'OPD',
      status: 'active',
      lastVisit: '2024-01-18',
      nextAppointment: '2024-01-25',
      emergencyContact: '+91 9876543213'
    },
    {
      id: 3,
      patientId: 'AYU003',
      name: 'Dr. Amit Kumar Gupta',
      age: 52,
      gender: 'Male',
      phone: '+91 9876543214',
      email: 'amit.gupta@rediffmail.com',
      address: '789 Ayurvedic Complex, Civil Lines, Allahabad, Uttar Pradesh',
      city: 'Prayagraj',
      postalCode: '211001',
      country: 'India',
      constitution: 'Pitta',
      primaryTreatment: 'Abhyanga',
      patientType: 'OPD',
      status: 'active',
      lastVisit: '2024-01-20',
      nextAppointment: '2024-01-27',
      emergencyContact: '+91 9876543215'
    },
    {
      id: 4,
      patientId: 'AYU004',
      name: 'Meera Joshi',
      age: 28,
      gender: 'Female',
      phone: '+91 9876543216',
      email: 'meera.joshi@gmail.com',
      address: '321 Heritage Apartments, Koregaon Park, Pune, Maharashtra',
      city: 'Pune',
      postalCode: '411001',
      country: 'India',
      constitution: 'Vata',
      primaryTreatment: 'Nasya Therapy',
      patientType: 'OPD',
      status: 'discharged',
      lastVisit: '2024-01-10',
      nextAppointment: null,
      emergencyContact: '+91 9876543217'
    },
    {
      id: 5,
      patientId: 'AYU005',
      name: 'Suresh Chandra Verma',
      age: 60,
      gender: 'Male',
      phone: '+91 9876543218',
      email: 'suresh.verma@hotmail.com',
      address: '654 Old City, Lal Kuan, Lucknow, Uttar Pradesh',
      city: 'Lucknow',
      postalCode: '226001',
      country: 'India',
      constitution: 'Kapha-Vata',
      primaryTreatment: 'Rasayana Therapy',
      patientType: 'IPD',
      status: 'admitted',
      lastVisit: '2024-01-12',
      nextAppointment: '2024-01-24',
      emergencyContact: '+91 9876543219'
    },
    {
      id: 6,
      patientId: 'AYU006',
      name: 'Sunita Rani Singh',
      age: 35,
      gender: 'Female',
      phone: '+91 9876543220',
      email: 'sunita.singh@gmail.com',
      address: '987 Green Gardens, Model Town, Delhi',
      city: 'New Delhi',
      postalCode: '110009',
      country: 'India',
      constitution: 'Pitta-Kapha',
      primaryTreatment: 'Udvartana',
      patientType: 'OPD',
      status: 'active',
      lastVisit: '2024-01-19',
      nextAppointment: '2024-01-26',
      emergencyContact: '+91 9876543221'
    },
    {
      id: 7,
      patientId: 'AYU007',
      name: 'Rakesh Kumar Jain',
      age: 42,
      gender: 'Male',
      phone: '+91 9876543222',
      email: 'rakesh.jain@yahoo.in',
      address: '147 Commercial Street, Brigade Road, Bangalore, Karnataka',
      city: 'Bangalore',
      postalCode: '560001',
      country: 'India',
      constitution: 'Vata-Kapha',
      primaryTreatment: 'Herbal Medicine',
      patientType: 'OPD',
      status: 'active',
      lastVisit: '2024-01-17',
      nextAppointment: '2024-01-28',
      emergencyContact: '+91 9876543223'
    },
    {
      id: 8,
      patientId: 'AYU008',
      name: 'Kavita Devi Agarwal',
      age: 38,
      gender: 'Female',
      phone: '+91 9876543224',
      email: 'kavita.agarwal@rediffmail.com',
      address: '258 Lake View, Anna Nagar, Chennai, Tamil Nadu',
      city: 'Chennai',
      postalCode: '600040',
      country: 'India',
      constitution: 'Tridosha',
      primaryTreatment: 'Panchakarma',
      patientType: 'IPD',
      status: 'admitted',
      lastVisit: '2024-01-14',
      nextAppointment: '2024-01-23',
      emergencyContact: '+91 9876543225'
    },
    {
      id: 9,
      patientId: 'AYU009',
      name: 'Deepak Sharma',
      age: 29,
      gender: 'Male',
      phone: '+91 9876543226',
      email: 'deepak.sharma@gmail.com',
      address: '369 Rose Garden, Sector 18, Noida, Uttar Pradesh',
      city: 'Noida',
      postalCode: '201301',
      country: 'India',
      constitution: 'Pitta',
      primaryTreatment: 'Shirodhara',
      patientType: 'OPD',
      status: 'discharged',
      lastVisit: '2024-01-08',
      nextAppointment: null,
      emergencyContact: '+91 9876543227'
    },
    {
      id: 10,
      patientId: 'AYU010',
      name: 'Anita Kumari',
      age: 46,
      gender: 'Female',
      phone: '+91 9876543228',
      email: 'anita.kumari@hotmail.com',
      address: '741 Heritage Colony, Bandra East, Mumbai, Maharashtra',
      city: 'Mumbai',
      postalCode: '400051',
      country: 'India',
      constitution: 'Kapha',
      primaryTreatment: 'Abhyanga',
      patientType: 'OPD',
      status: 'active',
      lastVisit: '2024-01-16',
      nextAppointment: '2024-01-29',
      emergencyContact: '+91 9876543229'
    },
    {
      id: 11,
      patientId: 'AYU011',
      name: 'Manoj Kumar Tiwari',
      age: 55,
      gender: 'Male',
      phone: '+91 9876543230',
      email: 'manoj.tiwari@yahoo.com',
      address: '852 University Road, Near Medical College, Jaipur, Rajasthan',
      city: 'Jaipur',
      postalCode: '302004',
      country: 'India',
      constitution: 'Vata',
      primaryTreatment: 'Rasayana Therapy',
      patientType: 'IPD',
      status: 'admitted',
      lastVisit: '2024-01-11',
      nextAppointment: '2024-01-25',
      emergencyContact: '+91 9876543231'
    },
    {
      id: 12,
      patientId: 'AYU012',
      name: 'Geeta Devi Mishra',
      age: 41,
      gender: 'Female',
      phone: '+91 9876543232',
      email: 'geeta.mishra@gmail.com',
      address: '963 Temple Street, Old Ahmedabad, Gujarat',
      city: 'Ahmedabad',
      postalCode: '380001',
      country: 'India',
      constitution: 'Pitta-Vata',
      primaryTreatment: 'Udvartana',
      patientType: 'OPD',
      status: 'active',
      lastVisit: '2024-01-21',
      nextAppointment: '2024-01-30',
      emergencyContact: '+91 9876543233'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isExportOpen, onOpen: onExportOpen, onClose: onExportClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isScheduleOpen, onOpen: onScheduleOpen, onClose: onScheduleClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isFilterOpen, onOpen: onFilterOpen, onClose: onFilterClose } = useDisclosure();

  // Import Patients state
  const [importing, setImporting] = useState(false);
  const fileInputRef = React.useRef();

  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgGradient = "linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(16, 185, 129, 0.08) 50%, rgba(139, 92, 246, 0.08) 100%)";
  const headerGradient = "linear(135deg, #3B82F6, #10B981, #8B5CF6)";
  const primaryBlue = "#3B82F6";
  const accentTeal = "#10B981";

  // Handler for file import
  const handleImportPatients = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImporting(true);
    try {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        let data = evt.target.result;
        let workbook;
        if (file.name.endsWith('.csv')) {
          // Parse CSV
          workbook = XLSX.read(data, { type: 'binary', codepage: 65001 });
        } else {
          // Parse Excel
          workbook = XLSX.read(data, { type: 'binary' });
        }
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { defval: '', raw: false });
        // Optionally map/validate fields here
        try {
          // Send to backend API (bulk import)
          await axios.post(`${API_URL}/import`, { patients: json });
          alert(`Imported ${json.length} patients successfully.`);
          // Refresh patient list from backend
          const response = await axios.get(API_URL);
          setPatients(response.data);
        } catch (apiErr) {
          alert('API import failed: ' + (apiErr.response?.data?.message || apiErr.message));
        }
      };
      reader.onerror = () => alert('Error reading file');
      reader.readAsBinaryString(file);
    } catch (err) {
      alert('Import failed: ' + err.message);
    }
    setImporting(false);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  React.useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const response = await axios.get(API_URL);
        setPatients(response.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch patients from API');
      }
      setLoading(false);
    };

    fetchPatients();
  }, []);

  // Calculate statistics
  const totalPatients = patients.length;
  const activePatients = patients.filter(p => p.status === 'active').length;
  const admittedPatients = patients.filter(p => p.status === 'admitted').length;
  const dischargedPatients = patients.filter(p => p.status === 'discharged').length;

  // Filter patients based on search and filters
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
    const matchesType = typeFilter === 'all' || patient.patientType.toLowerCase() === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    onViewOpen();
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    onEditOpen();
  };

  const handleScheduleAppointment = (patient) => {
    setSelectedPatient(patient);
    onScheduleOpen();
  };

  const handleDeletePatient = (patient) => {
    setSelectedPatient(patient);
    onDeleteOpen();
  };

  const confirmDeletePatient = async () => {
    try {
      await axios.delete(`${API_URL}/${selectedPatient.id}`);
      setPatients(prev => prev.filter(p => p.id !== selectedPatient.id));
      toast({ title: 'Patient deleted successfully', status: 'success' });
    } catch (err) {
      toast({ title: 'Failed to delete patient', status: 'error' });
    }
    onDeleteClose();
    setSelectedPatient(null);
  };

  const generateAvatar = (name) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4338CA&color=fff&size=40`;
  };

  const handleExport = (format) => {
    console.log('Export function called with format:', format);
    console.log('Filtered patients:', filteredPatients);
    
    const headers = ['Patient ID', 'Name', 'Age', 'Gender', 'Phone', 'Email', 'Address', 'Constitution', 'Primary Treatment', 'Status', 'Last Visit'];
    const currentDate = new Date().toISOString().split('T')[0];
    
    if (format === 'csv') {
      const csvContent = [
        headers.join(','),
        ...filteredPatients.map(patient => [
          patient.patientId,
          `"${patient.name}"`,
          patient.age,
          patient.gender,
          patient.phone,
          `"${patient.email}"`,
          `"${patient.address}"`,
          patient.constitution,
          `"${patient.primaryTreatment}"`,
          patient.status,
          patient.lastVisit
        ].join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ayurvedic_patients_${currentDate}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
    } else if (format === 'pdf') {
      try {
        console.log('Starting PDF generation...');
        const doc = new jsPDF('l', 'mm', 'a4'); // landscape orientation
        
        // Add title
        doc.setFontSize(18);
        doc.setTextColor(59, 130, 246); // Blue color
        doc.text('Ayurvedic Hospital - Patient Records', 20, 20);
        
        // Add subtitle
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
        doc.text(`Total Patients: ${filteredPatients.length}`, 20, 38);
        
        // Check if jsPDF autotable is available
        if (doc.autoTable) {
          console.log('Using autoTable for PDF generation');
          
          // Prepare table data
          const tableData = filteredPatients.map(patient => [
            patient.patientId || 'N/A',
            patient.name || 'N/A',
            patient.age?.toString() || 'N/A',
            patient.gender || 'N/A',
            patient.phone || 'N/A',
            patient.constitution || 'N/A',
            patient.primaryTreatment || 'N/A',
            patient.status || 'N/A',
            patient.lastVisit || 'N/A'
          ]);
          
          // Add table with simpler configuration
          doc.autoTable({
            head: [['ID', 'Name', 'Age', 'Gender', 'Phone', 'Constitution', 'Treatment', 'Status', 'Last Visit']],
            body: tableData,
            startY: 50,
            theme: 'striped',
            headStyles: {
              fillColor: [59, 130, 246],
              textColor: [255, 255, 255],
              fontStyle: 'bold',
              fontSize: 10
            },
            bodyStyles: {
              fontSize: 8
            },
            margin: { top: 50 },
            styles: {
              cellPadding: 2,
              fontSize: 8
            }
          });
        } else {
          console.log('autoTable not available, using simple text output');
          // Fallback: Simple text output
          let yPosition = 50;
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          
          // Add headers
          doc.text('ID', 20, yPosition);
          doc.text('Name', 50, yPosition);
          doc.text('Age', 100, yPosition);
          doc.text('Gender', 120, yPosition);
          doc.text('Phone', 150, yPosition);
          doc.text('Status', 200, yPosition);
          
          yPosition += 10;
          
          // Add patient data
          filteredPatients.forEach((patient, index) => {
            if (yPosition > 180) { // New page if needed
              doc.addPage();
              yPosition = 20;
            }
            
            doc.text(patient.patientId || 'N/A', 20, yPosition);
            doc.text(patient.name || 'N/A', 50, yPosition);
            doc.text(patient.age?.toString() || 'N/A', 100, yPosition);
            doc.text(patient.gender || 'N/A', 120, yPosition);
            doc.text(patient.phone || 'N/A', 150, yPosition);
            doc.text(patient.status || 'N/A', 200, yPosition);
            
            yPosition += 8;
          });
        }
        
        // Save the PDF
        doc.save(`ayurvedic_patients_${currentDate}.pdf`);
        console.log('PDF generated successfully');
        
      } catch (error) {
        console.error('PDF generation error:', error);
        alert('Error generating PDF: ' + error.message);
      }
      
    } else if (format === 'excel') {
      // Prepare data for Excel
      const excelData = [
        headers,
        ...filteredPatients.map(patient => [
          patient.patientId,
          patient.name,
          patient.age,
          patient.gender,
          patient.phone,
          patient.email,
          patient.address,
          patient.constitution,
          patient.primaryTreatment,
          patient.status,
          patient.lastVisit
        ])
      ];
      
      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(excelData);
      
      // Set column widths
      const colWidths = [
        { wch: 12 }, // Patient ID
        { wch: 20 }, // Name
        { wch: 8 },  // Age
        { wch: 10 }, // Gender
        { wch: 15 }, // Phone
        { wch: 25 }, // Email
        { wch: 30 }, // Address
        { wch: 15 }, // Constitution
        { wch: 20 }, // Primary Treatment
        { wch: 12 }, // Status
        { wch: 12 }  // Last Visit
      ];
      ws['!cols'] = colWidths;
      
      // Style the header row
      const headerStyle = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "3B82F6" } },
        alignment: { horizontal: "center", vertical: "center" }
      };
      
      // Apply header styling
      for (let i = 0; i < headers.length; i++) {
        const cellRef = XLSX.utils.encode_cell({ r: 0, c: i });
        if (!ws[cellRef]) ws[cellRef] = {};
        ws[cellRef].s = headerStyle;
      }
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Patient Records");
      
      // Add metadata sheet
      const metaData = [
        ['Report Information'],
        ['Generated Date', new Date().toLocaleDateString()],
        ['Generated Time', new Date().toLocaleTimeString()],
        ['Total Patients', filteredPatients.length],
        ['Hospital', 'Ayurvedic Hospital Management System'],
        [''],
        ['Statistics'],
        ['Active Patients', filteredPatients.filter(p => p.status === 'active').length],
        ['Admitted Patients', filteredPatients.filter(p => p.status === 'admitted').length],
        ['Discharged Patients', filteredPatients.filter(p => p.status === 'discharged').length]
      ];
      
      const metaWs = XLSX.utils.aoa_to_sheet(metaData);
      metaWs['!cols'] = [{ wch: 20 }, { wch: 30 }];
      XLSX.utils.book_append_sheet(wb, metaWs, "Report Info");
      
      // Save file
      XLSX.writeFile(wb, `ayurvedic_patients_${currentDate}.xlsx`);
    }
    
    onExportClose();
  };

  return (
    <Box 
      minH="100vh" 
      bg="gray.50"
      bgImage={`url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233B82F6' fill-opacity='0.04'%3E%3Cpath d='M30 30c0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12 12-5.373 12-12zm12 0c0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12 12-5.373 12-12z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"), ${bgGradient}`}
      p={6}
    >
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Card 
          bg={cardBg} 
          border="1px" 
          borderColor="blue.200"
          boxShadow="xl"
          borderRadius="xl"
          overflow="hidden"
          position="relative"
        >
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            height="4px"
            bgGradient={headerGradient}
          />
          <CardHeader pb={4} bg="blue.50">
            <Flex justifyContent="space-between" alignItems="center">
              <VStack align="start" spacing={1}>
                <Heading size="lg" color="blue.700" display="flex" alignItems="center" gap={2}>
                  <Box p={2} bg="blue.100" borderRadius="lg">
                    <Leaf size={28} color={primaryBlue} />
                  </Box>
                  {title}
                </Heading>
                <Text color="blue.600" fontSize="sm" fontWeight="medium">
                  Manage Ayurvedic patient records and constitutional assessments
                </Text>
              </VStack>
              <HStack spacing={3}>
                <Button
                  leftIcon={<Download size={18} />}
                  colorScheme="teal"
                  variant="solid"
                  borderRadius="lg"
                  size="md"
                  isLoading={importing}
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                >
                  Import Patients
                </Button>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                  onChange={handleImportPatients}
                />
                <Button
                  leftIcon={<Upload size={18} />}
                  colorScheme="blue"
                  variant="outline"
                  borderRadius="lg"
                  size="md"
                  onClick={onExportOpen}
                >
                  Export
                </Button>
              </HStack>
            </Flex>
          </CardHeader>
        </Card>

        {/* Statistics Cards */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <Card 
            bg="white" 
            borderRadius="xl" 
            boxShadow="lg"
            border="1px solid"
            borderColor="blue.100"
            overflow="hidden"
            position="relative"
            _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
            transition="all 0.3s"
          >
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              height="4px"
              bgGradient="linear(90deg, blue.400, blue.500, blue.600)"
            />
            <CardBody>
              <Stat>
                <Flex justifyContent="space-between" alignItems="start">
                  <Box>
                    <StatLabel color="gray.600" fontSize="sm" fontWeight="medium">Total Patients</StatLabel>
                    <StatNumber fontSize="2xl" fontWeight="bold" color="blue.600">{totalPatients}</StatNumber>
                    <StatHelpText color="blue.500" fontSize="xs">
                      <StatArrow type="increase" />
                      12% from last month
                    </StatHelpText>
                  </Box>
                  <Box bg="blue.50" p={3} borderRadius="lg" border="1px" borderColor="blue.100">
                    <Users size={24} color="#3B82F6" />
                  </Box>
                </Flex>
              </Stat>
            </CardBody>
          </Card>

          <Card 
            bg="white" 
            borderRadius="xl" 
            boxShadow="lg"
            border="1px solid"
            borderColor="teal.100"
            overflow="hidden"
            position="relative"
            _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
            transition="all 0.3s"
          >
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              height="4px"
              bgGradient="linear(90deg, teal.400, teal.500, teal.600)"
            />
            <CardBody>
              <Stat>
                <Flex justifyContent="space-between" alignItems="start">
                  <Box>
                    <StatLabel color="gray.600" fontSize="sm" fontWeight="medium">Active Patients</StatLabel>
                    <StatNumber fontSize="2xl" fontWeight="bold" color="teal.600">{activePatients}</StatNumber>
                    <StatHelpText color="teal.500" fontSize="xs">
                      <StatArrow type="increase" />
                      8% from last week
                    </StatHelpText>
                  </Box>
                  <Box bg="teal.50" p={3} borderRadius="lg" border="1px" borderColor="teal.100">
                    <UserCheck size={24} color="#10B981" />
                  </Box>
                </Flex>
              </Stat>
            </CardBody>
          </Card>

          <Card 
            bg="white" 
            borderRadius="xl" 
            boxShadow="lg"
            border="1px solid"
            borderColor="purple.100"
            overflow="hidden"
            position="relative"
            _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
            transition="all 0.3s"
          >
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              height="4px"
              bgGradient="linear(90deg, purple.400, purple.500, purple.600)"
            />
            <CardBody>
              <Stat>
                <Flex justifyContent="space-between" alignItems="start">
                  <Box>
                    <StatLabel color="gray.600" fontSize="sm" fontWeight="medium">Undergoing Treatment</StatLabel>
                    <StatNumber fontSize="2xl" fontWeight="bold" color="purple.600">{admittedPatients}</StatNumber>
                    <StatHelpText color="purple.500" fontSize="xs">
                      <TreePine size={12} />
                      Ayurvedic Therapies
                    </StatHelpText>
                  </Box>
                  <Box bg="purple.50" p={3} borderRadius="lg" border="1px" borderColor="purple.100">
                    <Activity size={24} color="#8B5CF6" />
                  </Box>
                </Flex>
              </Stat>
            </CardBody>
          </Card>

          <Card 
            bg="white" 
            borderRadius="xl" 
            boxShadow="lg"
            border="1px solid"
            borderColor="gray.100"
            overflow="hidden"
            position="relative"
            _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
            transition="all 0.3s"
          >
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              height="4px"
              bgGradient="linear(90deg, gray.400, gray.500, gray.600)"
            />
            <CardBody>
              <Stat>
                <Flex justifyContent="space-between" alignItems="start">
                  <Box>
                    <StatLabel color="gray.600" fontSize="sm" fontWeight="medium">Treatment Complete</StatLabel>
                    <StatNumber fontSize="2xl" fontWeight="bold" color="gray.600">{dischargedPatients}</StatNumber>
                    <StatHelpText color="gray.500" fontSize="xs">
                      <UserX size={12} />
                      This month
                    </StatHelpText>
                  </Box>
                  <Box bg="gray.50" p={3} borderRadius="lg" border="1px" borderColor="gray.100">
                    <UserX size={24} color="#6B7280" />
                  </Box>
                </Flex>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Search and Filters */}
        <Card 
          bg={cardBg} 
          border="1px" 
          borderColor="blue.200"
          borderRadius="xl"
          boxShadow="lg"
          overflow="hidden"
          position="relative"
        >
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            height="3px"
            bgGradient="linear(90deg, blue.300, teal.400, purple.500)"
          />
          <CardBody bg="blue.25">
            <Grid templateColumns={{ base: "1fr", md: "2fr 1fr 1fr" }} gap={6}>
              <InputGroup size="md">
                <InputLeftElement>
                  <Search color="#3B82F6" size={18} />
                </InputLeftElement>
                <Input
                  placeholder="Search by name, ID, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  borderRadius="lg"
                  borderColor="blue.200"
                  bg="white"
                  _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px #3B82F6' }}
                  _hover={{ borderColor: 'blue.300' }}
                />
              </InputGroup>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                borderRadius="lg"
                borderColor="blue.200"
                bg="white"
                _focus={{ borderColor: 'blue.400' }}
                _hover={{ borderColor: 'blue.300' }}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="discharged">Discharged</option>
                <option value="admitted">Admitted</option>
              </Select>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                borderRadius="lg"
                borderColor="blue.200"
                bg="white"
                _focus={{ borderColor: 'blue.400' }}
                _hover={{ borderColor: 'blue.300' }}
              >
                <option value="all">All Types</option>
                <option value="opd">OPD</option>
                <option value="ipd">IPD</option>
              </Select>
            </Grid>
          </CardBody>
        </Card>

        {/* Patient Table */}
        <Card 
          bg={cardBg} 
          border="1px" 
          borderColor="blue.200"
          borderRadius="xl"
          boxShadow="lg"
          overflow="hidden"
          position="relative"
        >
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            height="3px"
            bgGradient="linear(90deg, blue.400, teal.500, purple.600)"
          />
          <CardHeader bg="blue.50">
            <Flex justifyContent="space-between" alignItems="center">
              <Heading size="md" color="blue.700">
                Patient Records ({filteredPatients.length} found)
              </Heading>
              <Text fontSize="sm" color="blue.600" fontWeight="medium">
                Total: {totalPatients} patients
              </Text>
            </Flex>
            <Divider borderColor="blue.200" />
          </CardHeader>
          <CardBody p={0}>
            <TableContainer>
              <Table variant="simple" size="md">
                <Thead bg="blue.50">
                  <Tr>
                    <Th borderColor="blue.200" color="blue.700" fontWeight="semibold">Patient</Th>
                    <Th borderColor="blue.200" color="blue.700" fontWeight="semibold">Contact</Th>
                    <Th borderColor="blue.200" color="blue.700" fontWeight="semibold">Address</Th>
                    <Th borderColor="blue.200" color="blue.700" fontWeight="semibold">City / Postal Code</Th>
                    <Th borderColor="blue.200" color="blue.700" fontWeight="semibold">Country</Th>
                    <Th borderColor="blue.200" color="blue.700" fontWeight="semibold">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredPatients.map((patient, index) => (
                    <Tr 
                      key={patient.id}
                      _hover={{ bg: 'blue.25' }}
                      borderBottom="1px"
                      borderColor="blue.100"
                    >
                      <Td py={4}>
                        <HStack spacing={3}>
                          <Avatar 
                            size="md" 
                            name={patient.name}
                            src={generateAvatar(patient.name)}
                            bg="blue.500"
                          />
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="semibold" color="gray.700">
                              {patient.name}
                            </Text>
                            <Text fontSize="sm" color="blue.600" fontWeight="medium">
                              {patient.patientId}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              {patient.age} years • {patient.gender}
                            </Text>
                          </VStack>
                        </HStack>
                      </Td>
                      <Td>
                        <VStack align="start" spacing={1}>
                          <HStack spacing={1}>
                            <Phone size={14} color="#6B7280" />
                            <Text fontSize="sm" color="gray.600">
                              {patient.phone}
                            </Text>
                          </HStack>
                          <Text fontSize="xs" color="gray.500">
                            {patient.email}
                          </Text>
                        </VStack>
                      </Td>
                      <Td>
                        <Text fontSize="sm" color="gray.600" isTruncated maxW="150px">
                          {patient.address}
                        </Text>
                      </Td>
                      <Td>
                        <Text fontSize="sm" color="gray.600">
                          {patient.city}{patient.postalCode ? `, ${patient.postalCode}` : ''}
                        </Text>
                      </Td>
                      <Td>
                        <Text fontSize="sm" color="gray.600">
                          {patient.country}
                        </Text>
                      </Td>
                      <Td>
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            aria-label="Patient Actions"
                            icon={<MoreVertical />}
                            variant="ghost"
                            size="sm"
                            colorScheme="blue"
                            borderRadius="lg"
                            _hover={{ bg: 'blue.100' }}
                          />
                          <MenuList borderRadius="lg" boxShadow="xl" border="1px" borderColor="blue.200">
                            <MenuItem 
                              icon={<Eye />} 
                              onClick={() => handleViewPatient(patient)}
                              _hover={{ bg: 'blue.50' }}
                            >
                              View Details
                            </MenuItem>
                            <MenuItem 
                              icon={<Edit />}
                              onClick={() => handleEditPatient(patient)}
                              _hover={{ bg: 'green.50' }}
                            >
                              Edit Patient
                            </MenuItem>
                            <MenuItem 
                              icon={<Calendar />}
                              onClick={() => handleScheduleAppointment(patient)}
                              _hover={{ bg: 'purple.50' }}
                            >
                              Schedule Appointment
                            </MenuItem>
                            <Divider />
                            <MenuItem 
                              icon={<Trash2 />} 
                              color="red.500"
                              onClick={() => handleDeletePatient(patient)}
                              _hover={{ bg: 'red.50' }}
                            >
                              Delete Patient
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>

            {filteredPatients.length === 0 && (
              <Box textAlign="center" py={20}>
                <VStack spacing={4}>
                  <Users size={48} color="#CBD5E0" />
                  <VStack spacing={2}>
                    <Text fontSize="lg" fontWeight="semibold" color="gray.500">
                      No patients found
                    </Text>
                    <Text fontSize="sm" color="gray.400">
                      Try adjusting your search criteria.
                    </Text>
                  </VStack>
                </VStack>
              </Box>
            )}
          </CardBody>
        </Card>

        {/* Patient Details Modal */}
        {selectedPatient && (
          <Modal isOpen={isViewOpen} onClose={onViewClose} size="xl">
            <ModalOverlay backdropFilter="blur(4px)" />
            <ModalContent borderRadius="xl" boxShadow="2xl">
              <ModalHeader bg="blue.500" color="white" borderTopRadius="xl">
                <HStack spacing={3}>
                  <Avatar 
                    size="md" 
                    name={selectedPatient.name}
                    src={generateAvatar(selectedPatient.name)}
                  />
                  <VStack align="start" spacing={0}>
                    <Text fontSize="lg" fontWeight="bold">
                      {selectedPatient.name}
                    </Text>
                    <Text fontSize="sm" opacity={0.9}>
                      Patient ID: {selectedPatient.patientId}
                    </Text>
                  </VStack>
                </HStack>
              </ModalHeader>
              <ModalCloseButton color="white" />
              <ModalBody p={6}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <VStack align="start" spacing={4}>
                    <Box>
                      <Text fontSize="sm" fontWeight="semibold" color="gray.500" mb={1}>
                        PERSONAL INFORMATION
                      </Text>
                      <VStack align="start" spacing={2}>
                        <Text><strong>Age:</strong> {selectedPatient.age} years</Text>
                        <Text><strong>Gender:</strong> {selectedPatient.gender}</Text>
                        <Text><strong>Constitution:</strong> {selectedPatient.constitution}</Text>
                      </VStack>
                    </Box>
                    <Box>
                      <Text fontSize="sm" fontWeight="semibold" color="gray.500" mb={1}>
                        CONTACT DETAILS
                      </Text>
                      <VStack align="start" spacing={2}>
                        <Text><strong>Phone:</strong> {selectedPatient.phone}</Text>
                        <Text><strong>Email:</strong> {selectedPatient.email}</Text>
                        <Text><strong>Emergency:</strong> {selectedPatient.emergencyContact}</Text>
                        <Text><strong>Address:</strong> {selectedPatient.address}</Text>
                      </VStack>
                    </Box>
                  </VStack>
                  <VStack align="start" spacing={4}>
                    <Box>
                      <Text fontSize="sm" fontWeight="semibold" color="gray.500" mb={1}>
                        AYURVEDIC INFORMATION
                      </Text>
                      <VStack align="start" spacing={2}>
                        <Text><strong>Constitution (Prakriti):</strong> {selectedPatient.constitution}</Text>
                        <Text><strong>Primary Treatment:</strong> {selectedPatient.primaryTreatment}</Text>
                        <Text><strong>Patient Type:</strong> {selectedPatient.patientType}</Text>
                        <Text><strong>Status:</strong> 
                          <Badge ml={2} colorScheme={
                            selectedPatient.status === 'active' ? 'green' : 
                            selectedPatient.status === 'admitted' ? 'blue' : 'gray'
                          }>
                            {selectedPatient.status}
                          </Badge>
                        </Text>
                      </VStack>
                    </Box>
                    <Box>
                      <Text fontSize="sm" fontWeight="semibold" color="gray.500" mb={1}>
                        VISIT INFORMATION
                      </Text>
                      <VStack align="start" spacing={2}>
                        <Text><strong>Last Visit:</strong> {selectedPatient.lastVisit}</Text>
                        <Text><strong>Next Appointment:</strong> {selectedPatient.nextAppointment || 'Not scheduled'}</Text>
                      </VStack>
                    </Box>
                  </VStack>
                </SimpleGrid>
              </ModalBody>
              <ModalFooter>
                <HStack spacing={3}>
                  <Button variant="outline" onClick={onViewClose}>
                    Close
                  </Button>
                  <Button colorScheme="blue" leftIcon={<Edit />}>
                    Edit Patient
                  </Button>
                </HStack>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}

        {/* Add Patient Modal */}
        <Modal isOpen={isAddOpen} onClose={onAddClose} size="xl">
          <ModalOverlay backdropFilter="blur(4px)" />
          <ModalContent borderRadius="xl" boxShadow="2xl">
            <ModalHeader bg="blue.500" color="white" borderTopRadius="xl">
              <HStack spacing={3}>
                <UserPlus size={24} />
                <Text fontSize="lg" fontWeight="bold">
                  Add New Patient
                </Text>
              </HStack>
            </ModalHeader>
            <ModalCloseButton color="white" />
            <ModalBody p={6}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Full Name</FormLabel>
                  <Input placeholder="Enter patient name" borderRadius="lg" />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Age</FormLabel>
                  <Input type="number" placeholder="Enter age" borderRadius="lg" />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Gender</FormLabel>
                  <Select placeholder="Select gender" borderRadius="lg">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Constitution (Prakriti)</FormLabel>
                  <Select placeholder="Select constitution" borderRadius="lg">
                    <option value="Vata">Vata</option>
                    <option value="Pitta">Pitta</option>
                    <option value="Kapha">Kapha</option>
                    <option value="Vata-Pitta">Vata-Pitta</option>
                    <option value="Vata-Kapha">Vata-Kapha</option>
                    <option value="Pitta-Kapha">Pitta-Kapha</option>
                    <option value="Tridosha">Tridosha</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Primary Treatment</FormLabel>
                  <Select placeholder="Select treatment" borderRadius="lg">
                    <option value="Panchakarma">Panchakarma</option>
                    <option value="Abhyanga">Abhyanga</option>
                    <option value="Shirodhara">Shirodhara</option>
                    <option value="Herbal Medicine">Herbal Medicine</option>
                    <option value="Nasya Therapy">Nasya Therapy</option>
                    <option value="Udvartana">Udvartana</option>
                    <option value="Rasayana Therapy">Rasayana Therapy</option>
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Phone Number</FormLabel>
                  <Input placeholder="Enter phone number" borderRadius="lg" />
                </FormControl>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input type="email" placeholder="Enter email address" borderRadius="lg" />
                </FormControl>
                <FormControl>
                  <FormLabel>Emergency Contact</FormLabel>
                  <Input placeholder="Enter emergency contact" borderRadius="lg" />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Patient Type</FormLabel>
                  <Select placeholder="Select patient type" borderRadius="lg">
                    <option value="OPD">OPD</option>
                    <option value="IPD">IPD</option>
                  </Select>
                </FormControl>
              </SimpleGrid>
              <FormControl mt={4}>
                <FormLabel>Address</FormLabel>
                <Textarea placeholder="Enter complete address" borderRadius="lg" />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <HStack spacing={3}>
                <Button variant="outline" onClick={onAddClose}>
                  Cancel
                </Button>
                <Button colorScheme="blue" leftIcon={<UserPlus />}>
                  Add Patient
                </Button>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Edit Patient Modal */}
        {selectedPatient && (
          <Modal isOpen={isEditOpen} onClose={onEditClose} size="xl">
            <ModalOverlay backdropFilter="blur(4px)" />
            <ModalContent borderRadius="xl" boxShadow="2xl">
              <ModalHeader bg="teal.500" color="white" borderTopRadius="xl">
                <HStack spacing={3}>
                  <Edit size={24} />
                  <Text fontSize="lg" fontWeight="bold">
                    Edit Patient - {selectedPatient.name}
                  </Text>
                </HStack>
              </ModalHeader>
              <ModalCloseButton color="white" />
              <ModalBody p={6}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Full Name</FormLabel>
                    <Input defaultValue={selectedPatient.name} borderRadius="lg" />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Age</FormLabel>
                    <Input type="number" defaultValue={selectedPatient.age} borderRadius="lg" />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Gender</FormLabel>
                    <Select defaultValue={selectedPatient.gender} borderRadius="lg">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Select>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Constitution (Prakriti)</FormLabel>
                    <Select defaultValue={selectedPatient.constitution} borderRadius="lg">
                      <option value="Vata">Vata</option>
                      <option value="Pitta">Pitta</option>
                      <option value="Kapha">Kapha</option>
                      <option value="Vata-Pitta">Vata-Pitta</option>
                      <option value="Vata-Kapha">Vata-Kapha</option>
                      <option value="Pitta-Kapha">Pitta-Kapha</option>
                      <option value="Tridosha">Tridosha</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Primary Treatment</FormLabel>
                    <Select defaultValue={selectedPatient.primaryTreatment} borderRadius="lg">
                      <option value="Panchakarma">Panchakarma</option>
                      <option value="Abhyanga">Abhyanga</option>
                      <option value="Shirodhara">Shirodhara</option>
                      <option value="Herbal Medicine">Herbal Medicine</option>
                      <option value="Nasya Therapy">Nasya Therapy</option>
                      <option value="Udvartana">Udvartana</option>
                      <option value="Rasayana Therapy">Rasayana Therapy</option>
                    </Select>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Phone Number</FormLabel>
                    <Input defaultValue={selectedPatient.phone} borderRadius="lg" />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input type="email" defaultValue={selectedPatient.email} borderRadius="lg" />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Emergency Contact</FormLabel>
                    <Input defaultValue={selectedPatient.emergencyContact} borderRadius="lg" />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Patient Type</FormLabel>
                    <Select defaultValue={selectedPatient.patientType} borderRadius="lg">
                      <option value="OPD">OPD</option>
                      <option value="IPD">IPD</option>
                    </Select>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Status</FormLabel>
                    <Select defaultValue={selectedPatient.status} borderRadius="lg">
                      <option value="active">Active</option>
                      <option value="admitted">Admitted</option>
                      <option value="discharged">Discharged</option>
                    </Select>
                  </FormControl>
                </SimpleGrid>
                <FormControl mt={4}>
                  <FormLabel>Address</FormLabel>
                  <Textarea defaultValue={selectedPatient.address} borderRadius="lg" />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <HStack spacing={3}>
                  <Button variant="outline" onClick={onEditClose}>
                    Cancel
                  </Button>
                  <Button colorScheme="teal" leftIcon={<Edit />}>
                    Update Patient
                  </Button>
                </HStack>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}

        {/* Schedule Appointment Modal */}
        {selectedPatient && (
          <Modal isOpen={isScheduleOpen} onClose={onScheduleClose} size="lg">
            <ModalOverlay backdropFilter="blur(4px)" />
            <ModalContent borderRadius="xl" boxShadow="2xl">
              <ModalHeader bg="purple.500" color="white" borderTopRadius="xl">
                <HStack spacing={3}>
                  <Calendar size={24} />
                  <Text fontSize="lg" fontWeight="bold">
                    Schedule Appointment - {selectedPatient.name}
                  </Text>
                </HStack>
              </ModalHeader>
              <ModalCloseButton color="white" />
              <ModalBody p={6}>
                <VStack spacing={4} align="stretch">
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Appointment Date</FormLabel>
                      <Input type="date" borderRadius="lg" />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Appointment Time</FormLabel>
                      <Input type="time" borderRadius="lg" />
                    </FormControl>
                  </SimpleGrid>
                  
                  <FormControl isRequired>
                    <FormLabel>Treatment Type</FormLabel>
                    <Select placeholder="Select treatment type" borderRadius="lg">
                      <option value="Consultation">General Consultation</option>
                      <option value="Panchakarma">Panchakarma Session</option>
                      <option value="Abhyanga">Abhyanga Therapy</option>
                      <option value="Shirodhara">Shirodhara Treatment</option>
                      <option value="Herbal Medicine">Herbal Medicine Consultation</option>
                      <option value="Nasya Therapy">Nasya Therapy</option>
                      <option value="Follow-up">Follow-up Visit</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Assigned Practitioner</FormLabel>
                    <Select placeholder="Select practitioner" borderRadius="lg">
                      <option value="Dr. Sharma">Dr. Rajesh Sharma</option>
                      <option value="Dr. Patel">Dr. Priya Patel</option>
                      <option value="Dr. Gupta">Dr. Amit Gupta</option>
                      <option value="Dr. Nair">Dr. Meera Nair</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Special Instructions</FormLabel>
                    <Textarea 
                      placeholder="Any special instructions or notes for the appointment..."
                      borderRadius="lg"
                      rows={3}
                    />
                  </FormControl>

                  <Box p={4} bg="blue.50" borderRadius="lg" border="1px" borderColor="blue.100">
                    <Text fontSize="sm" color="blue.700" fontWeight="semibold" mb={2}>
                      Patient Information:
                    </Text>
                    <VStack align="start" spacing={1}>
                      <Text fontSize="sm"><strong>Constitution:</strong> {selectedPatient.constitution}</Text>
                      <Text fontSize="sm"><strong>Current Treatment:</strong> {selectedPatient.primaryTreatment}</Text>
                      <Text fontSize="sm"><strong>Last Visit:</strong> {selectedPatient.lastVisit}</Text>
                    </VStack>
                  </Box>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <HStack spacing={3}>
                  <Button variant="outline" onClick={onScheduleClose}>
                    Cancel
                  </Button>
                  <Button colorScheme="blue" leftIcon={<Calendar />}>
                    Schedule Appointment
                  </Button>
                </HStack>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}

        {/* Delete Confirmation Modal */}
        {selectedPatient && (
          <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} size="md">
            <ModalOverlay backdropFilter="blur(4px)" />
            <ModalContent borderRadius="xl" boxShadow="2xl">
              <ModalHeader bg="red.500" color="white" borderTopRadius="xl">
                <HStack spacing={3}>
                  <Trash2 size={24} />
                  <Text fontSize="lg" fontWeight="bold">
                    Confirm Delete Patient
                  </Text>
                </HStack>
              </ModalHeader>
              <ModalCloseButton color="white" />
              <ModalBody p={6}>
                <VStack spacing={4} align="center">
                  <Box p={4} bg="red.50" borderRadius="lg" border="1px" borderColor="red.200">
                    <Text textAlign="center" color="red.700">
                      Are you sure you want to delete patient{' '}
                      <Text as="span" fontWeight="bold">
                        {selectedPatient.name}
                      </Text>
                      ?
                    </Text>
                  </Box>
                  
                  <VStack spacing={2} align="start" w="100%">
                    <Text fontSize="sm" color="gray.600">
                      <strong>Patient ID:</strong> {selectedPatient.patientId}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      <strong>Constitution:</strong> {selectedPatient.constitution}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      <strong>Last Visit:</strong> {selectedPatient.lastVisit}
                    </Text>
                  </VStack>

                  <Box p={3} bg="yellow.50" borderRadius="lg" border="1px" borderColor="yellow.200" w="100%">
                    <Text fontSize="sm" color="yellow.800" textAlign="center">
                      ⚠️ This action cannot be undone. All patient records will be permanently deleted.
                    </Text>
                  </Box>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <HStack spacing={3}>
                  <Button variant="outline" onClick={onDeleteClose}>
                    Cancel
                  </Button>
                  <Button colorScheme="red" leftIcon={<Trash2 />} onClick={confirmDeletePatient}>
                    Delete Patient
                  </Button>
                </HStack>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}

        {/* Export Options Modal */}
        <Modal isOpen={isExportOpen} onClose={onExportClose} size="md">
          <ModalOverlay backdropFilter="blur(4px)" />
          <ModalContent borderRadius="xl" boxShadow="2xl">
            <ModalHeader bg="blue.500" color="white" borderTopRadius="xl">
              <HStack spacing={3}>
                <Download size={24} />
                <Text fontSize="lg" fontWeight="bold">
                  Export Patient Data
                </Text>
              </HStack>
            </ModalHeader>
            <ModalCloseButton color="white" />
            <ModalBody p={6}>
              <VStack spacing={4} align="stretch">
                <Text color="gray.600" mb={2}>
                  Choose your preferred export format:
                </Text>
                
                <Button
                  leftIcon={<FileText />}
                  size="lg"
                  variant="outline"
                  colorScheme="red"
                  justifyContent="flex-start"
                  h={12}
                  onClick={() => handleExport('pdf')}
                  _hover={{ bg: 'red.50', borderColor: 'red.300' }}
                >
                  <VStack align="start" spacing={0} ml={2}>
                    <Text fontWeight="semibold">Export as PDF</Text>
                    <Text fontSize="sm" color="gray.500">
                      Formatted document for printing
                    </Text>
                  </VStack>
                </Button>

                <Button
                  leftIcon={<FileSpreadsheet />}
                  size="lg"
                  variant="outline"
                  colorScheme="green"
                  justifyContent="flex-start"
                  h={12}
                  onClick={() => handleExport('excel')}
                  _hover={{ bg: 'green.50', borderColor: 'green.300' }}
                >
                  <VStack align="start" spacing={0} ml={2}>
                    <Text fontWeight="semibold">Export as Excel</Text>
                    <Text fontSize="sm" color="gray.500">
                      Spreadsheet for data analysis
                    </Text>
                  </VStack>
                </Button>

                <Button
                  leftIcon={<Download />}
                  size="lg"
                  variant="outline"
                  colorScheme="blue"
                  justifyContent="flex-start"
                  h={12}
                  onClick={() => handleExport('csv')}
                  _hover={{ bg: 'blue.50', borderColor: 'blue.300' }}
                >
                  <VStack align="start" spacing={0} ml={2}>
                    <Text fontWeight="semibold">Export as CSV</Text>
                    <Text fontSize="sm" color="gray.500">
                      Comma-separated values file
                    </Text>
                  </VStack>
                </Button>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="outline" onClick={onExportClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
};

export default PatientList;
