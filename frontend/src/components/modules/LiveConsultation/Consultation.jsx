import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
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
  Portal
} from '@chakra-ui/react';
import {
  Search,
  Plus,
  MoreVertical,
  Eye,
  Video,
  Phone,
  Calendar,
  Clock,
  User,
  FileText,
  Camera,
  Mic,
  MicOff,
  VideoOff,
  Share2,
  Download,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  StopCircle
} from 'lucide-react';

// Mock consultation data
const mockConsultations = [
  {
    id: 'CONS001',
    patientId: 'P001',
    patientName: 'Rajesh Kumar',
    patientAge: 45,
    patientGender: 'Male',
    doctorId: 'D001',
    doctorName: 'Dr. Priya Sharma',
    doctorSpecialty: 'Ayurvedic Physician',
    appointmentDate: '2024-12-15',
    appointmentTime: '14:30',
    duration: '30 mins',
    status: 'Scheduled',
    consultationType: 'Follow-up',
    chiefComplaint: 'Digestive issues, stomach pain',
    meetingLink: 'https://meet.hospital.com/cons001',
    prescription: null,
    notes: 'Patient reports improvement in symptoms'
  },
  {
    id: 'CONS002',
    patientId: 'P002',
    patientName: 'Meera Patel',
    patientAge: 32,
    patientGender: 'Female',
    doctorId: 'D002',
    doctorName: 'Dr. Anjali Nair',
    doctorSpecialty: 'Panchakarma Specialist',
    appointmentDate: '2024-12-15',
    appointmentTime: '15:00',
    duration: '45 mins',
    status: 'In Progress',
    consultationType: 'Initial Consultation',
    chiefComplaint: 'Stress, anxiety, sleep disorders',
    meetingLink: 'https://meet.hospital.com/cons002',
    prescription: 'Ashwagandha, Brahmi',
    notes: 'Recommended Panchakarma treatment'
  },
  {
    id: 'CONS003',
    patientId: 'P003',
    patientName: 'Vikram Singh',
    patientAge: 38,
    patientGender: 'Male',
    doctorId: 'D001',
    doctorName: 'Dr. Priya Sharma',
    doctorSpecialty: 'Ayurvedic Physician',
    appointmentDate: '2024-12-15',
    appointmentTime: '13:30',
    duration: '30 mins',
    status: 'Completed',
    consultationType: 'Follow-up',
    chiefComplaint: 'Joint pain, arthritis',
    meetingLink: 'https://meet.hospital.com/cons003',
    prescription: 'Guggulu, Shallaki',
    notes: 'Patient showing good progress'
  },
  {
    id: 'CONS004',
    patientId: 'P004',
    patientName: 'Anita Sharma',
    patientAge: 28,
    patientGender: 'Female',
    doctorId: 'D003',
    doctorName: 'Dr. Vikram Joshi',
    doctorSpecialty: 'Ayurvedic Consultant',
    appointmentDate: '2024-12-15',
    appointmentTime: '16:00',
    duration: '30 mins',
    status: 'Scheduled',
    consultationType: 'Initial Consultation',
    chiefComplaint: 'Skin problems, acne',
    meetingLink: 'https://meet.hospital.com/cons004',
    prescription: null,
    notes: null
  },
  {
    id: 'CONS005',
    patientId: 'P005',
    patientName: 'Sunita Gupta',
    patientAge: 55,
    patientGender: 'Female',
    doctorId: 'D002',
    doctorName: 'Dr. Anjali Nair',
    doctorSpecialty: 'Panchakarma Specialist',
    appointmentDate: '2024-12-14',
    appointmentTime: '11:00',
    duration: '60 mins',
    status: 'Completed',
    consultationType: 'Treatment Planning',
    chiefComplaint: 'Diabetes, weight management',
    meetingLink: 'https://meet.hospital.com/cons005',
    prescription: 'Triphala, Bitter Gourd',
    notes: 'Customized diet plan provided'
  }
];

const LiveConsultationManagement = ({ title = "Live Consultation" }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [doctorFilter, setDoctorFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isJoinOpen, onOpen: onJoinOpen, onClose: onJoinClose } = useDisclosure();
  const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  
  // Form state for schedule consultation
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    patientAge: '',
    patientGender: '',
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    duration: '30',
    platform: '',
    consultationType: '',
    chiefComplaint: '',
    notes: ''
  });
  const [patientSuggestions, setPatientSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Mock patient database
  const mockPatients = [
    { id: 'P001', name: 'Rajesh Kumar', age: 45, gender: 'Male', phone: '9876543210', email: 'rajesh@email.com' },
    { id: 'P002', name: 'Meera Patel', age: 38, gender: 'Female', phone: '9876543211', email: 'meera@email.com' },
    { id: 'P003', name: 'Arjun Singh', age: 52, gender: 'Male', phone: '9876543212', email: 'arjun@email.com' },
    { id: 'P004', name: 'Lakshmi Nair', age: 29, gender: 'Female', phone: '9876543213', email: 'lakshmi@email.com' },
    { id: 'P005', name: 'Suresh Gupta', age: 61, gender: 'Male', phone: '9876543214', email: 'suresh@email.com' },
    { id: 'P006', name: 'Priya Sharma', age: 34, gender: 'Female', phone: '9876543215', email: 'priya@email.com' },
    { id: 'P007', name: 'Ravi Kumar', age: 42, gender: 'Male', phone: '9876543216', email: 'ravi@email.com' },
    { id: 'P008', name: 'Anjali Reddy', age: 28, gender: 'Female', phone: '9876543217', email: 'anjali@email.com' }
  ];
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Filter consultations
  const filteredConsultations = mockConsultations.filter(consultation => {
    const matchesSearch = consultation.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || consultation.status.toLowerCase().replace(' ', '') === statusFilter;
    const matchesDoctor = doctorFilter === 'all' || consultation.doctorName.toLowerCase().includes(doctorFilter.toLowerCase());
    const matchesType = typeFilter === 'all' || consultation.consultationType.toLowerCase().replace(' ', '') === typeFilter;
    return matchesSearch && matchesStatus && matchesDoctor && matchesType;
  });

  // Calculate statistics
  const totalConsultations = mockConsultations.length;
  const scheduledConsultations = mockConsultations.filter(c => c.status === 'Scheduled').length;
  const inProgressConsultations = mockConsultations.filter(c => c.status === 'In Progress').length;
  const completedConsultations = mockConsultations.filter(c => c.status === 'Completed').length;
  const todayConsultations = mockConsultations.filter(c => c.appointmentDate === '2024-12-15').length;

  // Export functions
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(59, 130, 246);
    doc.text('Live Consultations Report', 20, 20);
    
    // Date
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    
    // Summary statistics
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text('Summary Statistics:', 20, 45);
    
    doc.setFontSize(10);
    doc.text(`Total Consultations: ${totalConsultations}`, 20, 55);
    doc.text(`Scheduled: ${scheduledConsultations}`, 20, 62);
    doc.text(`In Progress: ${inProgressConsultations}`, 20, 69);
    doc.text(`Completed: ${completedConsultations}`, 20, 76);
    doc.text(`Today's Consultations: ${todayConsultations}`, 20, 83);
    
    // Table data
    const tableData = filteredConsultations.map(consultation => [
      consultation.id,
      consultation.patientName,
      consultation.doctorName,
      consultation.appointmentDate,
      consultation.appointmentTime,
      consultation.status,
      consultation.consultationType,
      consultation.chiefComplaint
    ]);
    
    // Table
    doc.autoTable({
      startY: 95,
      head: [['ID', 'Patient', 'Doctor', 'Date', 'Time', 'Status', 'Type', 'Chief Complaint']],
      body: tableData,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] },
      alternateRowStyles: { fillColor: [245, 247, 250] }
    });
    
    doc.save(`consultations-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const exportToExcel = () => {
    const worksheetData = filteredConsultations.map(consultation => ({
      'Consultation ID': consultation.id,
      'Patient Name': consultation.patientName,
      'Patient Age': consultation.patientAge,
      'Patient Gender': consultation.patientGender,
      'Doctor Name': consultation.doctorName,
      'Doctor Specialty': consultation.doctorSpecialty,
      'Appointment Date': consultation.appointmentDate,
      'Appointment Time': consultation.appointmentTime,
      'Duration': consultation.duration,
      'Status': consultation.status,
      'Consultation Type': consultation.consultationType,
      'Chief Complaint': consultation.chiefComplaint,
      'Meeting Link': consultation.meetingLink,
      'Prescription': consultation.prescription || 'N/A',
      'Notes': consultation.notes || 'N/A'
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Consultations');
    
    // Set column widths
    const colWidths = [
      { wch: 15 }, // Consultation ID
      { wch: 20 }, // Patient Name
      { wch: 8 },  // Age
      { wch: 10 }, // Gender
      { wch: 20 }, // Doctor Name
      { wch: 25 }, // Doctor Specialty
      { wch: 12 }, // Date
      { wch: 10 }, // Time
      { wch: 10 }, // Duration
      { wch: 12 }, // Status
      { wch: 18 }, // Type
      { wch: 30 }, // Chief Complaint
      { wch: 30 }, // Meeting Link
      { wch: 25 }, // Prescription
      { wch: 25 }  // Notes
    ];
    worksheet['!cols'] = colWidths;
    
    XLSX.writeFile(workbook, `consultations-report-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportToCSV = () => {
    const headers = [
      'Consultation ID',
      'Patient Name',
      'Patient Age',
      'Patient Gender',
      'Doctor Name',
      'Doctor Specialty',
      'Appointment Date',
      'Appointment Time',
      'Duration',
      'Status',
      'Consultation Type',
      'Chief Complaint',
      'Meeting Link',
      'Prescription',
      'Notes'
    ];

    const csvData = filteredConsultations.map(consultation => [
      consultation.id,
      consultation.patientName,
      consultation.patientAge,
      consultation.patientGender,
      consultation.doctorName,
      consultation.doctorSpecialty,
      consultation.appointmentDate,
      consultation.appointmentTime,
      consultation.duration,
      consultation.status,
      consultation.consultationType,
      consultation.chiefComplaint,
      consultation.meetingLink,
      consultation.prescription || 'N/A',
      consultation.notes || 'N/A'
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `consultations-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadIndividualReport = (consultation) => {
    // For individual reports, we'll use a simpler approach - just export as PDF by default
    // but we could extend this to show a submenu if needed
    downloadIndividualPDF(consultation);
  };

  const downloadIndividualPDF = (consultation) => {
    console.log('PDF Download clicked for:', consultation.patientName);
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(59, 130, 246);
    doc.text('Consultation Report', 20, 20);
    
    // Consultation details
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(`Consultation ID: ${consultation.id}`, 20, 40);
    
    doc.setFontSize(12);
    doc.text(`Patient: ${consultation.patientName} (${consultation.patientAge}yr, ${consultation.patientGender})`, 20, 55);
    doc.text(`Doctor: ${consultation.doctorName}`, 20, 65);
    doc.text(`Specialty: ${consultation.doctorSpecialty}`, 20, 75);
    doc.text(`Date: ${consultation.appointmentDate}`, 20, 85);
    doc.text(`Time: ${consultation.appointmentTime}`, 20, 95);
    doc.text(`Duration: ${consultation.duration}`, 20, 105);
    doc.text(`Status: ${consultation.status}`, 20, 115);
    doc.text(`Type: ${consultation.consultationType}`, 20, 125);
    
    doc.text('Chief Complaint:', 20, 140);
    doc.text(consultation.chiefComplaint, 20, 150);
    
    if (consultation.prescription) {
      doc.text('Prescription:', 20, 165);
      doc.text(consultation.prescription, 20, 175);
    }
    
    if (consultation.notes) {
      doc.text('Notes:', 20, 190);
      doc.text(consultation.notes, 20, 200);
    }
    
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 220);
    
    doc.save(`consultation-${consultation.id}-report.pdf`);
  };

  const downloadIndividualExcel = (consultation) => {
    console.log('Excel Download clicked for:', consultation.patientName);
    const worksheetData = [{
      'Consultation ID': consultation.id,
      'Patient Name': consultation.patientName,
      'Patient Age': consultation.patientAge,
      'Patient Gender': consultation.patientGender,
      'Doctor Name': consultation.doctorName,
      'Doctor Specialty': consultation.doctorSpecialty,
      'Appointment Date': consultation.appointmentDate,
      'Appointment Time': consultation.appointmentTime,
      'Duration': consultation.duration,
      'Status': consultation.status,
      'Consultation Type': consultation.consultationType,
      'Chief Complaint': consultation.chiefComplaint,
      'Meeting Link': consultation.meetingLink,
      'Prescription': consultation.prescription || 'N/A',
      'Notes': consultation.notes || 'N/A'
    }];

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Consultation Details');
    
    // Set column widths
    const colWidths = [
      { wch: 15 }, { wch: 20 }, { wch: 8 }, { wch: 10 }, { wch: 20 },
      { wch: 25 }, { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 12 },
      { wch: 18 }, { wch: 30 }, { wch: 30 }, { wch: 25 }, { wch: 25 }
    ];
    worksheet['!cols'] = colWidths;
    
    XLSX.writeFile(workbook, `consultation-${consultation.id}-report.xlsx`);
  };

  const downloadIndividualCSV = (consultation) => {
    console.log('CSV Download clicked for:', consultation.patientName);
    const headers = [
      'Consultation ID', 'Patient Name', 'Patient Age', 'Patient Gender',
      'Doctor Name', 'Doctor Specialty', 'Appointment Date', 'Appointment Time',
      'Duration', 'Status', 'Consultation Type', 'Chief Complaint',
      'Meeting Link', 'Prescription', 'Notes'
    ];

    const csvData = [
      consultation.id,
      consultation.patientName,
      consultation.patientAge,
      consultation.patientGender,
      consultation.doctorName,
      consultation.doctorSpecialty,
      consultation.appointmentDate,
      consultation.appointmentTime,
      consultation.duration,
      consultation.status,
      consultation.consultationType,
      consultation.chiefComplaint,
      consultation.meetingLink,
      consultation.prescription || 'N/A',
      consultation.notes || 'N/A'
    ];

    const csvContent = [headers, csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `consultation-${consultation.id}-report.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'scheduled': return 'blue';
      case 'in progress': return 'green';
      case 'completed': return 'gray';
      case 'cancelled': return 'red';
      case 'no show': return 'orange';
      default: return 'gray';
    }
  };

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'initial consultation': return 'purple';
      case 'follow-up': return 'blue';
      case 'treatment planning': return 'orange';
      case 'emergency': return 'red';
      default: return 'gray';
    }
  };

  const handleJoinConsultation = (consultation) => {
    setSelectedConsultation(consultation);
    onJoinOpen();
  };

  const handleMonitorSession = (consultation) => {
    alert(`Monitoring session for ${consultation.patientName}`);
    // You can implement actual monitoring functionality here
  };

  const handleViewDetails = (consultation) => {
    console.log('View Details clicked for:', consultation.patientName);
    setSelectedConsultation(consultation);
    onDetailsOpen();
  };

  const handleEditAppointment = (consultation) => {
    console.log('Edit Appointment clicked for:', consultation.patientName);
    setSelectedConsultation(consultation);
    onEditOpen();
  };

  const handleCancelConsultation = (consultation) => {
    if (window.confirm(`Are you sure you want to cancel ${consultation.patientName}'s consultation?`)) {
      alert(`Consultation for ${consultation.patientName} has been cancelled`);
      // You can implement actual cancellation logic here
    }
  };

  const handleJoinNow = (consultation) => {
    onJoinClose();
    // Simulate joining the consultation
    alert(`Joining consultation with ${consultation.patientName}...\nMeeting Link: ${consultation.meetingLink}`);
    // You can implement actual video call integration here
    // For example: window.open(consultation.meetingLink, '_blank');
  };

  // Patient search and auto-fill functions
  const handlePatientSearch = (value) => {
    setFormData(prev => ({ ...prev, patientName: value }));
    
    if (value.length > 0) {
      const suggestions = mockPatients.filter(patient => 
        patient.name.toLowerCase().includes(value.toLowerCase()) ||
        patient.id.toLowerCase().includes(value.toLowerCase())
      );
      setPatientSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setPatientSuggestions([]);
      setShowSuggestions(false);
      // Clear patient fields if search is empty
      setFormData(prev => ({
        ...prev,
        patientId: '',
        patientAge: '',
        patientGender: ''
      }));
    }
  };

  const selectPatient = (patient) => {
    setFormData(prev => ({
      ...prev,
      patientId: patient.id,
      patientName: patient.name,
      patientAge: patient.age,
      patientGender: patient.gender
    }));
    setShowSuggestions(false);
  };

  const resetForm = () => {
    setFormData({
      patientId: '',
      patientName: '',
      patientAge: '',
      patientGender: '',
      doctorId: '',
      appointmentDate: '',
      appointmentTime: '',
      duration: '30',
      platform: '',
      consultationType: '',
      chiefComplaint: '',
      notes: ''
    });
    setPatientSuggestions([]);
    setShowSuggestions(false);
  };

  const handleScheduleSubmit = () => {
    // Validate required fields
    if (!formData.patientId || !formData.doctorId || !formData.appointmentDate || !formData.appointmentTime) {
      alert('Please fill in all required fields (Patient, Doctor, Date, Time)');
      return;
    }

    // Create consultation object
    const newConsultation = {
      id: `CONS${String(mockConsultations.length + 1).padStart(3, '0')}`,
      patientId: formData.patientId,
      patientName: formData.patientName,
      patientAge: formData.patientAge,
      patientGender: formData.patientGender,
      doctorId: formData.doctorId,
      doctorName: formData.doctorId === 'd001' ? 'Dr. Priya Sharma' : 
                  formData.doctorId === 'd002' ? 'Dr. Anjali Nair' : 'Dr. Vikram Joshi',
      doctorSpecialty: formData.doctorId === 'd001' ? 'Ayurvedic Physician' : 
                      formData.doctorId === 'd002' ? 'Panchakarma Specialist' : 'Ayurvedic Consultant',
      appointmentDate: formData.appointmentDate,
      appointmentTime: formData.appointmentTime,
      duration: `${formData.duration} mins`,
      status: 'Scheduled',
      consultationType: formData.consultationType === 'initial' ? 'Initial Consultation' :
                       formData.consultationType === 'followup' ? 'Follow-up' :
                       formData.consultationType === 'treatment' ? 'Treatment Planning' : 'Emergency',
      chiefComplaint: formData.chiefComplaint,
      meetingLink: `https://meet.hospital.com/cons${String(mockConsultations.length + 1).padStart(3, '0')}`,
      prescription: null,
      notes: formData.notes
    };

    console.log('New Consultation Scheduled:', newConsultation);
    alert(`Consultation scheduled successfully!\nConsultation ID: ${newConsultation.id}\nPatient: ${newConsultation.patientName}\nDoctor: ${newConsultation.doctorName}\nDate: ${newConsultation.appointmentDate} at ${newConsultation.appointmentTime}`);
    
    // Reset form and close modal
    resetForm();
    onAddClose();
  };

  const formatTime = (time) => {
    return new Date(`2024-12-15 ${time}`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
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
              Advanced consultation management with real-time patient interaction
            </Text>
          </Box>
          <HStack spacing={3}>
            <Menu>
              <MenuButton
                as={Button}
                leftIcon={<Download />}
                variant="outline"
                borderColor="teal.300"
                color="teal.600"
                _hover={{ bg: "teal.50", borderColor: "teal.400" }}
                borderRadius="12px"
                size="md"
              >
                Export Report
              </MenuButton>
              <Portal>
                <MenuList 
                  borderRadius="16px" 
                  border="1px solid rgba(0, 0, 0, 0.1)" 
                  boxShadow="0 20px 60px rgba(0, 0, 0, 0.3)"
                  bg="white"
                  minW="280px"
                  maxW="320px"
                  py={2}
                  zIndex={99999}
                  position="fixed"
                  overflow="hidden"
                  maxH="400px"
                  right="20px"
                  top="auto"
                >
                <MenuItem 
                  borderRadius="12px"
                  mx={2}
                  mb={1}
                  px={3}
                  py={3}
                  _hover={{ bg: "blue.50" }}
                  onClick={exportToPDF}
                  whiteSpace="nowrap"
                  overflow="hidden"
                >
                  <HStack spacing={3} w="full" align="center">
                    <Box 
                      bg="red.100" 
                      p={2} 
                      borderRadius="8px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexShrink={0}
                    >
                      <FileText size={18} color="#DC2626" />
                    </Box>
                    <VStack align="start" spacing={0} flex={1} minW="0">
                      <Text fontWeight="semibold" fontSize="sm" color="gray.800" isTruncated>
                        Export as PDF
                      </Text>
                      <Text fontSize="xs" color="gray.500" isTruncated>
                        Professional report format
                      </Text>
                    </VStack>
                  </HStack>
                </MenuItem>
                
                <MenuItem 
                  borderRadius="12px"
                  mx={2}
                  mb={1}
                  px={3}
                  py={3}
                  _hover={{ bg: "green.50" }}
                  onClick={exportToExcel}
                  whiteSpace="nowrap"
                  overflow="hidden"
                >
                  <HStack spacing={3} w="full" align="center">
                    <Box 
                      bg="green.100" 
                      p={2} 
                      borderRadius="8px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexShrink={0}
                    >
                      <Download size={18} color="#059669" />
                    </Box>
                    <VStack align="start" spacing={0} flex={1} minW="0">
                      <Text fontWeight="semibold" fontSize="sm" color="gray.800" isTruncated>
                        Export as Excel
                      </Text>
                      <Text fontSize="xs" color="gray.500" isTruncated>
                        Spreadsheet with data analysis
                      </Text>
                    </VStack>
                  </HStack>
                </MenuItem>
                
                <MenuItem 
                  borderRadius="12px"
                  mx={2}
                  px={3}
                  py={3}
                  _hover={{ bg: "blue.50" }}
                  onClick={exportToCSV}
                  whiteSpace="nowrap"
                  overflow="hidden"
                >
                  <HStack spacing={3} w="full" align="center">
                    <Box 
                      bg="blue.100" 
                      p={2} 
                      borderRadius="8px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexShrink={0}
                    >
                      <FileText size={18} color="#2563EB" />
                    </Box>
                    <VStack align="start" spacing={0} flex={1} minW="0">
                      <Text fontWeight="semibold" fontSize="sm" color="gray.800" isTruncated>
                        Export as CSV
                      </Text>
                      <Text fontSize="xs" color="gray.500" isTruncated>
                        Simple data format
                      </Text>
                    </VStack>
                  </HStack>
                </MenuItem>
              </MenuList>
              </Portal>
            </Menu>
            <Button 
              bg="linear-gradient(135deg, #3B82F6, #10B981)" 
              color="white"
              leftIcon={<Plus />} 
              onClick={onAddOpen}
              _hover={{ 
                transform: "translateY(-2px)",
                boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)"
              }}
              borderRadius="12px"
              px={6}
            >
              Schedule Consultation
            </Button>
          </HStack>
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
              <StatLabel color="gray.600" fontSize="sm" fontWeight="medium">Total Consultations</StatLabel>
              <Box p={2} bg="blue.100" borderRadius="8px">
                <Video size={16} color="#3B82F6" />
              </Box>
            </HStack>
            <StatNumber color="blue.600" fontSize="2xl" fontWeight="bold">{totalConsultations}</StatNumber>
            <StatHelpText color="gray.500" fontSize="xs" mb={0}>
              All time record
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
                <Calendar size={16} color="#3B82F6" />
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
              <StatLabel color="gray.600" fontSize="sm" fontWeight="medium">In Progress</StatLabel>
              <Box p={2} bg="green.100" borderRadius="8px">
                <Play size={16} color="#10B981" />
              </Box>
            </HStack>
            <StatNumber color="green.600" fontSize="2xl" fontWeight="bold">{inProgressConsultations}</StatNumber>
            <StatHelpText color="gray.500" fontSize="xs" mb={0}>
              Active sessions
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
                <CheckCircle size={16} color="#6B7280" />
              </Box>
            </HStack>
            <StatNumber color="gray.600" fontSize="2xl" fontWeight="bold">{completedConsultations}</StatNumber>
            <StatHelpText color="gray.500" fontSize="xs" mb={0}>
              Finished sessions
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
              <StatLabel color="gray.600" fontSize="sm" fontWeight="medium">Today's Total</StatLabel>
              <Box p={2} bg="purple.100" borderRadius="8px">
                <Clock size={16} color="#8B5CF6" />
              </Box>
            </HStack>
            <StatNumber color="purple.600" fontSize="2xl" fontWeight="bold">{todayConsultations}</StatNumber>
            <StatHelpText color="gray.500" fontSize="xs" mb={0}>
              Daily count
            </StatHelpText>
          </Stat>
        </Box>
      </Grid>

      {/* Active Consultations Alert */}
      {inProgressConsultations > 0 && (
        <Box
          bg="rgba(255, 255, 255, 0.95)"
          backdropFilter="blur(20px)"
          borderRadius="16px"
          p={4}
          mb={6}
          border="2px solid #10B981"
          boxShadow="0 8px 32px rgba(16, 185, 129, 0.2)"
          position="relative"
          overflow="hidden"
          _before={{
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            bg: "linear-gradient(90deg, #10B981, #3B82F6)",
          }}
        >
          <HStack spacing={4}>
            <Box 
              p={3} 
              bg="linear-gradient(135deg, #10B981, #059669)" 
              borderRadius="12px"
              boxShadow="0 4px 12px rgba(16, 185, 129, 0.3)"
            >
              <Play size={24} color="white" />
            </Box>
            <VStack align="start" spacing={1} flex={1}>
              <HStack spacing={2}>
                <Text fontWeight="bold" color="gray.800" fontSize="lg">
                  🟢 Active Consultations in Progress!
                </Text>
                <Box 
                  bg="linear-gradient(135deg, #10B981, #059669)" 
                  color="white" 
                  px={3} 
                  py={1} 
                  borderRadius="full" 
                  fontSize="sm" 
                  fontWeight="bold"
                >
                  {inProgressConsultations} Live
                </Box>
              </HStack>
              <Text color="gray.600" fontSize="sm" fontWeight="medium">
                {inProgressConsultations} consultation{inProgressConsultations > 1 ? 's' : ''} currently active • Monitor for technical issues or patient support needs
              </Text>
            </VStack>
            <Box 
              p={2} 
              bg="green.50" 
              borderRadius="8px"
              animation="pulse 2s infinite"
            >
              <Box w={3} h={3} bg="green.500" borderRadius="full" />
            </Box>
          </HStack>
        </Box>
      )}

      {/* Consultations Table */}
      <Box
        bg="rgba(255, 255, 255, 0.95)"
        backdropFilter="blur(20px)"
        borderRadius="20px"
        p={6}
        border="1px solid rgba(255, 255, 255, 0.2)"
        boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
      >
        <Flex justify="space-between" align="center" mb={6}>
          <HStack spacing={3}>
            <Box p={2} bg="blue.100" borderRadius="8px">
              <Video size={20} color="#3B82F6" />
            </Box>
            <Text fontSize="lg" fontWeight="semibold" color="gray.800">Live Consultations</Text>
          </HStack>
        </Flex>

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
                placeholder="Search by patient, doctor, or complaint..."
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
              <option value="inprogress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </Select>
            
            <Select
              size="sm"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              w={{ base: 'full', md: '160px' }}
              bg="white"
              borderRadius="10px"
              border="1px solid rgba(0, 0, 0, 0.05)"
            >
              <option value="all">All Types</option>
              <option value="initialconsultation">Initial Consultation</option>
              <option value="follow-up">Follow-up</option>
              <option value="treatmentplanning">Treatment Planning</option>
              <option value="emergency">Emergency</option>
            </Select>
          </Flex>
        </Box>

        <Box bg="white" borderRadius="12px" overflow="hidden" border="1px solid rgba(0, 0, 0, 0.05)">
          <TableContainer>
            <Table variant="simple" size="sm">
              <Thead bg="gray.50">
                <Tr>
                  <Th color="gray.700" fontWeight="semibold">Patient Details</Th>
                  <Th color="gray.700" fontWeight="semibold">Doctor</Th>
                  <Th color="gray.700" fontWeight="semibold">Appointment</Th>
                  <Th color="gray.700" fontWeight="semibold">Type</Th>
                  <Th color="gray.700" fontWeight="semibold">Chief Complaint</Th>
                  <Th color="gray.700" fontWeight="semibold">Status</Th>
                  <Th color="gray.700" fontWeight="semibold">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredConsultations.map((consultation) => (
                  <Tr key={consultation.id} _hover={{ bg: "gray.50" }}>
                    <Td>
                      <HStack>
                        <Avatar size="sm" name={consultation.patientName} />
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="medium" fontSize="sm">{consultation.patientName}</Text>
                          <Text fontSize="xs" color="gray.500">
                            {consultation.patientAge}Y, {consultation.patientGender}
                          </Text>
                          <Text fontSize="xs" color="gray.400">ID: {consultation.patientId}</Text>
                        </VStack>
                      </HStack>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <Text fontSize="sm" fontWeight="medium" color="blue.600">{consultation.doctorName}</Text>
                        <Text fontSize="xs" color="gray.500">{consultation.doctorSpecialty}</Text>
                      </VStack>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <HStack fontSize="sm">
                          <Calendar size={12} color="#3B82F6" />
                          <Text>{consultation.appointmentDate}</Text>
                        </HStack>
                        <HStack fontSize="sm">
                          <Clock size={12} color="#10B981" />
                          <Text>{formatTime(consultation.appointmentTime)}</Text>
                        </HStack>
                        <Text fontSize="xs" color="gray.500">{consultation.duration}</Text>
                      </VStack>
                    </Td>
                    <Td>
                      <Badge 
                        colorScheme={getTypeColor(consultation.consultationType)} 
                        variant="subtle" 
                        size="sm"
                        borderRadius="6px"
                      >
                        {consultation.consultationType}
                      </Badge>
                    </Td>
                    <Td>
                      <Text fontSize="sm" noOfLines={2} maxW="200px">
                        {consultation.chiefComplaint}
                      </Text>
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
                      <Menu placement="bottom-end" autoSelect={false} closeOnSelect={true}>
                        <MenuButton
                          as={IconButton}
                          icon={<MoreVertical />}
                          variant="ghost"
                          size="sm"
                          borderRadius="8px"
                          _hover={{ bg: "gray.100" }}
                        />
                        <Portal>
                          <MenuList 
                            borderRadius="12px" 
                            border="1px solid rgba(0, 0, 0, 0.1)" 
                            boxShadow="0 8px 32px rgba(0, 0, 0, 0.15)"
                            zIndex={10000}
                            bg="white"
                            maxW="280px"
                            minW="240px"
                          >
                          {consultation.status === 'Scheduled' && (
                            <MenuItem
                              icon={<Video size={16} />}
                              borderRadius="8px"
                              onClick={() => handleJoinConsultation(consultation)}
                            >
                              Join Consultation
                            </MenuItem>
                          )}
                          {consultation.status === 'In Progress' && (
                            <MenuItem 
                              icon={<Eye size={16} />} 
                              borderRadius="8px"
                              onClick={() => handleMonitorSession(consultation)}
                            >
                              Monitor Session
                            </MenuItem>
                          )}
                          <MenuItem 
                            icon={<FileText size={16} />} 
                            borderRadius="8px"
                            onClick={() => handleViewDetails(consultation)}
                          >
                            View Details
                          </MenuItem>
                          <MenuItem 
                            icon={<Edit size={16} />} 
                            borderRadius="8px"
                            onClick={() => handleEditAppointment(consultation)}
                          >
                            Edit Appointment
                          </MenuItem>
                          <Menu placement="left-start">
                            <MenuButton as={MenuItem} icon={<Download size={16} />} borderRadius="8px">
                              Download Report
                            </MenuButton>
                            <Portal>
                              <MenuList 
                                borderRadius="16px" 
                                border="1px solid rgba(0, 0, 0, 0.1)" 
                                boxShadow="0 10px 40px rgba(0, 0, 0, 0.25)"
                                bg="white"
                                minW="200px"
                                maxW="250px"
                                py={2}
                                zIndex={10001}
                                position="absolute"
                              >
                              <MenuItem 
                                borderRadius="12px"
                                mx={2}
                                mb={1}
                                px={4}
                                py={3}
                                _hover={{ bg: "red.50" }}
                                onClick={() => downloadIndividualPDF(consultation)}
                              >
                                <HStack spacing={3} w="full">
                                  <Box 
                                    bg="red.100" 
                                    p={2} 
                                    borderRadius="8px"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                  >
                                    <FileText size={18} color="#DC2626" />
                                  </Box>
                                  <VStack align="start" spacing={0} flex={1}>
                                    <Text fontWeight="semibold" fontSize="sm" color="gray.800">
                                      PDF Report
                                    </Text>
                                    <Text fontSize="xs" color="gray.500">
                                      Detailed consultation
                                    </Text>
                                  </VStack>
                                </HStack>
                              </MenuItem>
                              
                              <MenuItem 
                                borderRadius="12px"
                                mx={2}
                                mb={1}
                                px={4}
                                py={3}
                                _hover={{ bg: "green.50" }}
                                onClick={() => downloadIndividualExcel(consultation)}
                              >
                                <HStack spacing={3} w="full">
                                  <Box 
                                    bg="green.100" 
                                    p={2} 
                                    borderRadius="8px"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                  >
                                    <Download size={18} color="#059669" />
                                  </Box>
                                  <VStack align="start" spacing={0} flex={1}>
                                    <Text fontWeight="semibold" fontSize="sm" color="gray.800">
                                      Excel Report
                                    </Text>
                                    <Text fontSize="xs" color="gray.500">
                                      Structured data
                                    </Text>
                                  </VStack>
                                </HStack>
                              </MenuItem>
                              
                              <MenuItem 
                                borderRadius="12px"
                                mx={2}
                                px={4}
                                py={3}
                                _hover={{ bg: "blue.50" }}
                                onClick={() => downloadIndividualCSV(consultation)}
                              >
                                <HStack spacing={3} w="full">
                                  <Box 
                                    bg="blue.100" 
                                    p={2} 
                                    borderRadius="8px"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                  >
                                    <FileText size={18} color="#2563EB" />
                                  </Box>
                                  <VStack align="start" spacing={0} flex={1}>
                                    <Text fontWeight="semibold" fontSize="sm" color="gray.800">
                                      CSV Report
                                    </Text>
                                    <Text fontSize="xs" color="gray.500">
                                      Raw data export
                                    </Text>
                                  </VStack>
                                </HStack>
                              </MenuItem>
                            </MenuList>
                            </Portal>
                          </Menu>
                          {consultation.status !== 'Completed' && (
                            <MenuItem 
                              icon={<Trash2 size={16} />} 
                              color="red.500" 
                              borderRadius="8px"
                              onClick={() => handleCancelConsultation(consultation)}
                            >
                              Cancel Consultation
                            </MenuItem>
                          )}
                        </MenuList>
                        </Portal>
                      </Menu>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      {/* Schedule Consultation Modal */}
      <Modal isOpen={isAddOpen} onClose={() => { onAddClose(); resetForm(); }} size="xl">
        <ModalOverlay bg="rgba(0, 0, 0, 0.6)" backdropFilter="blur(10px)" />
        <ModalContent borderRadius="20px" bg="white" border="1px solid rgba(255, 255, 255, 0.2)">
          <ModalHeader borderRadius="20px 20px 0 0" bg="linear-gradient(135deg, #3B82F6, #10B981)" color="white">
            <HStack spacing={3}>
              <Plus size={24} />
              <Text>Schedule New Consultation</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody p={6}>
            <VStack spacing={6} align="stretch">
              {/* Patient Search Section */}
              <Box>
                <FormControl position="relative">
                  <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">
                    Patient Name or ID
                  </FormLabel>
                  <Input 
                    placeholder="Search by patient name or ID (e.g., Rajesh Kumar or P001)" 
                    value={formData.patientName}
                    onChange={(e) => handlePatientSearch(e.target.value)}
                    borderRadius="10px"
                    border="1px solid rgba(0, 0, 0, 0.1)"
                    _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #3B82F6" }}
                    autoComplete="off"
                  />
                  
                  {/* Patient Suggestions Dropdown */}
                  {showSuggestions && patientSuggestions.length > 0 && (
                    <Box
                      position="absolute"
                      top="100%"
                      left={0}
                      right={0}
                      zIndex={1000}
                      bg="white"
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="10px"
                      boxShadow="0 4px 12px rgba(0, 0, 0, 0.15)"
                      mt={1}
                      maxH="200px"
                      overflowY="auto"
                    >
                      {patientSuggestions.map((patient) => (
                        <Box
                          key={patient.id}
                          p={3}
                          cursor="pointer"
                          _hover={{ bg: "blue.50" }}
                          onClick={() => selectPatient(patient)}
                          borderBottom="1px solid"
                          borderColor="gray.100"
                          _last={{ borderBottom: "none" }}
                        >
                          <HStack justify="space-between">
                            <VStack align="start" spacing={0}>
                              <Text fontSize="sm" fontWeight="semibold" color="gray.800">
                                {patient.name}
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                ID: {patient.id} • {patient.age}Y {patient.gender}
                              </Text>
                            </VStack>
                            <Badge colorScheme="blue" size="sm">
                              Select
                            </Badge>
                          </HStack>
                        </Box>
                      ))}
                    </Box>
                  )}
                </FormControl>
              </Box>

              {/* Auto-filled Patient Information */}
              {formData.patientId && (
                <Box p={4} bg="green.50" borderRadius="12px" border="1px solid" borderColor="green.200">
                  <HStack spacing={4}>
                    <Box p={2} bg="green.100" borderRadius="8px">
                      <CheckCircle size={20} color="#059669" />
                    </Box>
                    <VStack align="start" spacing={1}>
                      <Text fontSize="sm" fontWeight="semibold" color="green.800">
                        Patient Selected: {formData.patientName}
                      </Text>
                      <Text fontSize="xs" color="green.600">
                        ID: {formData.patientId} • Age: {formData.patientAge} • Gender: {formData.patientGender}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              )}

              <Grid templateColumns="1fr 1fr" gap={4}>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">Patient ID</FormLabel>
                  <Input 
                    value={formData.patientId}
                    isReadOnly
                    bg="gray.50"
                    borderRadius="10px"
                    border="1px solid rgba(0, 0, 0, 0.1)"
                    placeholder="Auto-filled when patient selected"
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">Doctor</FormLabel>
                  <Select 
                    placeholder="Select consulting doctor"
                    value={formData.doctorId}
                    onChange={(e) => setFormData(prev => ({ ...prev, doctorId: e.target.value }))}
                    borderRadius="10px"
                    border="1px solid rgba(0, 0, 0, 0.1)"
                    _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #3B82F6" }}
                  >
                    <option value="d001">Dr. Priya Sharma - Ayurvedic Physician</option>
                    <option value="d002">Dr. Anjali Nair - Panchakarma Specialist</option>
                    <option value="d003">Dr. Vikram Joshi - Ayurvedic Consultant</option>
                  </Select>
                </FormControl>
              </Grid>

              <Grid templateColumns="1fr 1fr" gap={4}>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">Patient Age</FormLabel>
                  <Input 
                    value={formData.patientAge}
                    isReadOnly
                    bg="gray.50"
                    borderRadius="10px"
                    border="1px solid rgba(0, 0, 0, 0.1)"
                    placeholder="Auto-filled"
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">Patient Gender</FormLabel>
                  <Input 
                    value={formData.patientGender}
                    isReadOnly
                    bg="gray.50"
                    borderRadius="10px"
                    border="1px solid rgba(0, 0, 0, 0.1)"
                    placeholder="Auto-filled"
                  />
                </FormControl>
              </Grid>
              
              <Grid templateColumns="1fr 1fr 1fr" gap={4}>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">Date</FormLabel>
                  <Input 
                    type="date" 
                    value={formData.appointmentDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, appointmentDate: e.target.value }))}
                    borderRadius="10px"
                    border="1px solid rgba(0, 0, 0, 0.1)"
                    _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #3B82F6" }}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">Time</FormLabel>
                  <Input 
                    type="time" 
                    value={formData.appointmentTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, appointmentTime: e.target.value }))}
                    borderRadius="10px"
                    border="1px solid rgba(0, 0, 0, 0.1)"
                    _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #3B82F6" }}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">Duration</FormLabel>
                  <Select 
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    borderRadius="10px"
                    border="1px solid rgba(0, 0, 0, 0.1)"
                    _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #3B82F6" }}
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid templateColumns="1fr 1fr" gap={4}>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">Platform</FormLabel>
                  <Select 
                    placeholder="Select consultation platform"
                    value={formData.platform}
                    onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value }))}
                    borderRadius="10px"
                    border="1px solid rgba(0, 0, 0, 0.1)"
                    _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #3B82F6" }}
                  >
                    <option value="zoom">🔵 Zoom Meeting</option>
                    <option value="gmeet">🟢 Google Meet</option>
                    <option value="teams">🟦 Microsoft Teams</option>
                    <option value="webex">🔶 Cisco Webex</option>
                    <option value="jitsi">🟣 Jitsi Meet</option>
                    <option value="skype">🔷 Skype</option>
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">Consultation Type</FormLabel>
                  <Select 
                    placeholder="Select consultation type"
                    value={formData.consultationType}
                    onChange={(e) => setFormData(prev => ({ ...prev, consultationType: e.target.value }))}
                    borderRadius="10px"
                    border="1px solid rgba(0, 0, 0, 0.1)"
                    _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #3B82F6" }}
                  >
                    <option value="initial">Initial Consultation</option>
                    <option value="followup">Follow-up</option>
                    <option value="treatment">Treatment Planning</option>
                    <option value="emergency">Emergency</option>
                  </Select>
                </FormControl>
              </Grid>
              
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">Chief Complaint</FormLabel>
                <Textarea 
                  placeholder="Brief description of patient's main concern" 
                  rows={3} 
                  value={formData.chiefComplaint}
                  onChange={(e) => setFormData(prev => ({ ...prev, chiefComplaint: e.target.value }))}
                  borderRadius="10px"
                  border="1px solid rgba(0, 0, 0, 0.1)"
                  _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #3B82F6" }}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">Additional Notes</FormLabel>
                <Textarea 
                  placeholder="Additional notes for the consultation" 
                  rows={2} 
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  borderRadius="10px"
                  border="1px solid rgba(0, 0, 0, 0.1)"
                  _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #3B82F6" }}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          
          <ModalFooter p={6} borderRadius="0 0 20px 20px">
            <HStack spacing={3} w="full">
              <Button 
                variant="outline" 
                onClick={() => { onAddClose(); resetForm(); }}
                borderRadius="12px"
                borderColor="gray.300"
                color="gray.600"
                _hover={{ bg: "gray.50" }}
                flex={1}
              >
                Cancel
              </Button>
              <Button 
                bg="linear-gradient(135deg, #3B82F6, #10B981)" 
                color="white"
                leftIcon={<Calendar />}
                borderRadius="12px"
                _hover={{ 
                  transform: "translateY(-2px)",
                  boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)"
                }}
                flex={2}
                h={12}
                onClick={handleScheduleSubmit}
                isDisabled={!formData.patientId || !formData.doctorId || !formData.appointmentDate || !formData.appointmentTime}
              >
                Schedule Consultation
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Join Consultation Modal */}
      {selectedConsultation && (
        <Modal isOpen={isJoinOpen} onClose={onJoinClose} size="lg">
          <ModalOverlay bg="rgba(0, 0, 0, 0.6)" backdropFilter="blur(10px)" />
          <ModalContent borderRadius="20px" bg="white" border="1px solid rgba(255, 255, 255, 0.2)">
            <ModalHeader borderRadius="20px 20px 0 0" bg="linear-gradient(135deg, #10B981, #3B82F6)" color="white">
              <HStack spacing={3}>
                <Video size={24} />
                <Text>Join Consultation - {selectedConsultation.id}</Text>
              </HStack>
            </ModalHeader>
            <ModalCloseButton color="white" />
            <ModalBody p={6}>
              <VStack spacing={6} align="stretch">
                <Box p={4} bg="gray.50" borderRadius="16px">
                  <HStack spacing={4}>
                    <Avatar size="lg" name={selectedConsultation.patientName} />
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="bold" fontSize="lg">{selectedConsultation.patientName}</Text>
                      <Text fontSize="md" color="blue.600" fontWeight="medium">{selectedConsultation.doctorName}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {selectedConsultation.patientAge}Y • {selectedConsultation.patientGender}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
                
                <Box p={4} bg="blue.50" borderRadius="16px">
                  <VStack align="stretch" spacing={2}>
                    <Text fontSize="sm" color="gray.700">
                      <Text as="span" fontWeight="semibold">Chief Complaint:</Text> {selectedConsultation.chiefComplaint}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      <Text as="span" fontWeight="semibold">Type:</Text> {selectedConsultation.consultationType} • 
                      <Text as="span" fontWeight="semibold"> Duration:</Text> {selectedConsultation.duration}
                    </Text>
                  </VStack>
                </Box>
                
                <Box p={4} bg="green.50" borderRadius="16px">
                  <HStack justify="space-between" align="center">
                    <VStack align="start" spacing={1}>
                      <Text fontSize="md" fontWeight="semibold" color="green.700">Ready to Connect</Text>
                      <Text fontSize="sm" color="green.600">All systems operational • Network stable</Text>
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
                  onClick={() => handleJoinNow(selectedConsultation)}
                >
                  Join Consultation Now
                </Button>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {/* View Details Modal */}
      {selectedConsultation && (
        <Modal isOpen={isDetailsOpen} onClose={onDetailsClose} size="xl">
          <ModalOverlay bg="rgba(0, 0, 0, 0.6)" backdropFilter="blur(10px)" />
          <ModalContent borderRadius="20px" bg="white" border="1px solid rgba(255, 255, 255, 0.2)">
            <ModalHeader borderRadius="20px 20px 0 0" bg="linear-gradient(135deg, #3B82F6, #10B981)" color="white">
              <HStack spacing={3}>
                <Eye size={24} />
                <Text>Consultation Details - {selectedConsultation.id}</Text>
              </HStack>
            </ModalHeader>
            <ModalCloseButton color="white" />
            <ModalBody p={6}>
              <VStack spacing={6} align="stretch">
                <Box p={4} bg="gray.50" borderRadius="16px">
                  <SimpleGrid columns={2} spacing={4}>
                    <VStack align="start" spacing={2}>
                      <Text fontSize="sm" color="gray.600" fontWeight="semibold">Patient Information</Text>
                      <Text fontWeight="bold" fontSize="lg">{selectedConsultation.patientName}</Text>
                      <Text fontSize="sm" color="gray.600">ID: {selectedConsultation.patientId}</Text>
                      <Text fontSize="sm" color="gray.600">{selectedConsultation.patientAge}Y • {selectedConsultation.patientGender}</Text>
                    </VStack>
                    <VStack align="start" spacing={2}>
                      <Text fontSize="sm" color="gray.600" fontWeight="semibold">Doctor Information</Text>
                      <Text fontWeight="bold" fontSize="lg">{selectedConsultation.doctorName}</Text>
                      <Text fontSize="sm" color="gray.600">ID: {selectedConsultation.doctorId}</Text>
                      <Text fontSize="sm" color="gray.600">{selectedConsultation.doctorSpecialty}</Text>
                    </VStack>
                  </SimpleGrid>
                </Box>
                
                <Box p={4} bg="blue.50" borderRadius="16px">
                  <VStack align="stretch" spacing={3}>
                    <Text fontSize="md" fontWeight="semibold" color="blue.700">Consultation Details</Text>
                    <SimpleGrid columns={2} spacing={4}>
                      <VStack align="start" spacing={1}>
                        <Text fontSize="sm" color="gray.600" fontWeight="semibold">Date & Time</Text>
                        <Text fontSize="sm">{selectedConsultation.appointmentDate} at {selectedConsultation.appointmentTime}</Text>
                      </VStack>
                      <VStack align="start" spacing={1}>
                        <Text fontSize="sm" color="gray.600" fontWeight="semibold">Duration</Text>
                        <Text fontSize="sm">{selectedConsultation.duration}</Text>
                      </VStack>
                      <VStack align="start" spacing={1}>
                        <Text fontSize="sm" color="gray.600" fontWeight="semibold">Status</Text>
                        <Badge colorScheme={getStatusColor(selectedConsultation.status)} size="sm">
                          {selectedConsultation.status}
                        </Badge>
                      </VStack>
                      <VStack align="start" spacing={1}>
                        <Text fontSize="sm" color="gray.600" fontWeight="semibold">Type</Text>
                        <Badge colorScheme={getTypeColor(selectedConsultation.consultationType)} size="sm">
                          {selectedConsultation.consultationType}
                        </Badge>
                      </VStack>
                    </SimpleGrid>
                  </VStack>
                </Box>
                
                <Box p={4} bg="yellow.50" borderRadius="16px">
                  <VStack align="start" spacing={2}>
                    <Text fontSize="md" fontWeight="semibold" color="yellow.700">Chief Complaint</Text>
                    <Text fontSize="sm" color="gray.700">{selectedConsultation.chiefComplaint}</Text>
                  </VStack>
                </Box>
                
                {selectedConsultation.meetingLink && (
                  <Box p={4} bg="green.50" borderRadius="16px">
                    <VStack align="start" spacing={2}>
                      <Text fontSize="md" fontWeight="semibold" color="green.700">Meeting Information</Text>
                      <Text fontSize="sm" color="gray.700">Meeting Link: {selectedConsultation.meetingLink}</Text>
                    </VStack>
                  </Box>
                )}
              </VStack>
            </ModalBody>
            
            <ModalFooter p={6}>
              <HStack spacing={3} w="full">
                <Button 
                  variant="outline" 
                  onClick={onDetailsClose}
                  borderRadius="12px"
                  borderColor="gray.300"
                  color="gray.600"
                  _hover={{ bg: "gray.50" }}
                  flex={1}
                >
                  Close
                </Button>
                <Button 
                  bg="linear-gradient(135deg, #3B82F6, #10B981)" 
                  color="white"
                  leftIcon={<Edit />}
                  borderRadius="12px"
                  _hover={{ 
                    transform: "translateY(-2px)",
                    boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)"
                  }}
                  flex={1}
                  onClick={() => {
                    onDetailsClose();
                    handleEditAppointment(selectedConsultation);
                  }}
                >
                  Edit Details
                </Button>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {/* Edit Appointment Modal */}
      {selectedConsultation && (
        <Modal isOpen={isEditOpen} onClose={onEditClose} size="xl">
          <ModalOverlay bg="rgba(0, 0, 0, 0.6)" backdropFilter="blur(10px)" />
          <ModalContent borderRadius="20px" bg="white" border="1px solid rgba(255, 255, 255, 0.2)">
            <ModalHeader borderRadius="20px 20px 0 0" bg="linear-gradient(135deg, #F59E0B, #3B82F6)" color="white">
              <HStack spacing={3}>
                <Edit size={24} />
                <Text>Edit Appointment - {selectedConsultation.id}</Text>
              </HStack>
            </ModalHeader>
            <ModalCloseButton color="white" />
            <ModalBody p={6}>
              <VStack spacing={6} align="stretch">
                <SimpleGrid columns={2} spacing={4}>
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="semibold">Patient Name</FormLabel>
                    <Input 
                      defaultValue={selectedConsultation.patientName}
                      borderRadius="12px"
                      border="1px solid"
                      borderColor="gray.300"
                      _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px blue.400" }}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="semibold">Doctor</FormLabel>
                    <Select 
                      defaultValue={selectedConsultation.doctorName}
                      borderRadius="12px"
                      border="1px solid"
                      borderColor="gray.300"
                      _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px blue.400" }}
                    >
                      <option value="Dr. Priya Sharma">Dr. Priya Sharma</option>
                      <option value="Dr. Anjali Nair">Dr. Anjali Nair</option>
                      <option value="Dr. Vikram Gupta">Dr. Vikram Gupta</option>
                    </Select>
                  </FormControl>
                </SimpleGrid>
                
                <SimpleGrid columns={2} spacing={4}>
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="semibold">Date</FormLabel>
                    <Input 
                      type="date"
                      defaultValue={selectedConsultation.appointmentDate}
                      borderRadius="12px"
                      border="1px solid"
                      borderColor="gray.300"
                      _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px blue.400" }}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="semibold">Time</FormLabel>
                    <Input 
                      type="time"
                      defaultValue={selectedConsultation.appointmentTime}
                      borderRadius="12px"
                      border="1px solid"
                      borderColor="gray.300"
                      _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px blue.400" }}
                    />
                  </FormControl>
                </SimpleGrid>
                
                <SimpleGrid columns={2} spacing={4}>
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="semibold">Status</FormLabel>
                    <Select 
                      defaultValue={selectedConsultation.status}
                      borderRadius="12px"
                      border="1px solid"
                      borderColor="gray.300"
                      _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px blue.400" }}
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="semibold">Duration</FormLabel>
                    <Select 
                      defaultValue={selectedConsultation.duration}
                      borderRadius="12px"
                      border="1px solid"
                      borderColor="gray.300"
                      _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px blue.400" }}
                    >
                      <option value="15 mins">15 minutes</option>
                      <option value="30 mins">30 minutes</option>
                      <option value="45 mins">45 minutes</option>
                      <option value="60 mins">60 minutes</option>
                    </Select>
                  </FormControl>
                </SimpleGrid>
                
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="semibold">Chief Complaint</FormLabel>
                  <Textarea 
                    defaultValue={selectedConsultation.chiefComplaint}
                    borderRadius="12px"
                    border="1px solid"
                    borderColor="gray.300"
                    _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px blue.400" }}
                    rows={3}
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            
            <ModalFooter p={6}>
              <HStack spacing={3} w="full">
                <Button 
                  variant="outline" 
                  onClick={onEditClose}
                  borderRadius="12px"
                  borderColor="gray.300"
                  color="gray.600"
                  _hover={{ bg: "gray.50" }}
                  flex={1}
                >
                  Cancel
                </Button>
                <Button 
                  bg="linear-gradient(135deg, #F59E0B, #3B82F6)" 
                  color="white"
                  leftIcon={<CheckCircle />}
                  borderRadius="12px"
                  _hover={{ 
                    transform: "translateY(-2px)",
                    boxShadow: "0 10px 25px rgba(245, 158, 11, 0.3)"
                  }}
                  flex={1}
                  onClick={() => {
                    alert('Appointment updated successfully!');
                    onEditClose();
                  }}
                >
                  Save Changes
                </Button>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default LiveConsultationManagement;
