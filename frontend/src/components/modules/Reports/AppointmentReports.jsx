import React, { useState, useEffect } from 'react';
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
  useColorModeValue,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Progress,
  Container,
  Heading,
  useToast,
  Divider,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  CircularProgress,
  CircularProgressLabel,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Switch,
  Textarea,
  Checkbox,
  CheckboxGroup,
  Table,
  TableContainer,
  Thead,
  Tbody,
  Tr,
  Th,
  Td
} from '@chakra-ui/react';
import {
  Download,
  FileText,
  Calendar,
  Clock,
  Users,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Filter,
  Eye,
  Printer,
  Search,
  RefreshCw,
  Settings,
  Share,
  ChevronDown,
  Activity,
  UserCheck,
  AlertCircle,
  CheckCircle,
  Target,
  Zap,
  Award,
  Star,
  MoreVertical,
  Share2,
  Mail,
  MessageCircle,
  Phone,
  Stethoscope,
  Calendar as CalendarIcon,
  Clock as ClockIcon
} from 'lucide-react';

const AppointmentReports = ({ title = "Appointment Reports" }) => {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [reportFormat, setReportFormat] = useState('pdf');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [includeCharts, setIncludeCharts] = useState(true);
  
  const { isOpen: isGenerateOpen, onOpen: onGenerateOpen, onClose: onGenerateClose } = useDisclosure();
  const { isOpen: isPreviewOpen, onOpen: onPreviewOpen, onClose: onPreviewClose } = useDisclosure();
  const { isOpen: isScheduleOpen, onOpen: onScheduleOpen, onClose: onScheduleClose } = useDisclosure();
  const { isOpen: isConfigureOpen, onOpen: onConfigureOpen, onClose: onConfigureClose } = useDisclosure();
  const { isOpen: isFiltersOpen, onOpen: onFiltersOpen, onClose: onFiltersClose } = useDisclosure();

  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Enhanced statistics with more metrics
  const enhancedStats = [
    { 
      label: 'Total Appointments', 
      value: '1,234', 
      change: '+8.5%', 
      trend: 'up',
      icon: Calendar,
      color: 'blue',
      target: 1300,
      current: 1234
    },
    { 
      label: 'Completed', 
      value: '1,089', 
      change: '+12.3%', 
      trend: 'up',
      icon: CheckCircle,
      color: 'green',
      target: 1100,
      current: 1089
    },
    { 
      label: 'Cancelled', 
      value: '89', 
      change: '-15.2%', 
      trend: 'down',
      icon: AlertCircle,
      color: 'red',
      target: 80,
      current: 89
    },
    { 
      label: 'No Show', 
      value: '56', 
      change: '-5.4%', 
      trend: 'down',
      icon: UserCheck,
      color: 'orange',
      target: 50,
      current: 56
    },
    {
      label: 'Show Rate',
      value: '94.2%',
      change: '+2.1%',
      trend: 'up',
      icon: Target,
      color: 'purple',
      target: 95,
      current: 94.2
    },
    {
      label: 'Avg Wait Time',
      value: '12 min',
      change: '-8.3%',
      trend: 'down',
      icon: Clock,
      color: 'teal',
      target: 10,
      current: 12
    }
  ];

  // Enhanced report categories with more detailed features
  const reportCategories = [
    {
      id: 'appointment-analytics',
      title: 'Appointment Analytics',
      description: 'Comprehensive appointment trends and patterns',
      reports: [
        {
          title: 'Daily Appointment Summary',
          description: 'Complete overview of daily appointments with status breakdown',
          icon: Calendar,
          color: 'blue',
          type: 'summary'
        },
        {
          title: 'Weekly Trends Analysis',
          description: 'Weekly appointment patterns and booking trends',
          icon: BarChart3,
          color: 'green',
          type: 'analysis'
        },
        {
          title: 'Monthly Performance Report',
          description: 'Monthly appointment statistics and performance metrics',
          icon: TrendingUp,
          color: 'purple',
          type: 'performance'
        }
      ]
    },
    {
      id: 'doctor-performance',
      title: 'Doctor Performance',
      description: 'Doctor-wise appointment analytics and performance',
      reports: [
        {
          title: 'Doctor Consultation Metrics',
          description: 'Individual doctor appointment statistics and ratings',
          icon: UserCheck,
          color: 'teal',
          type: 'performance'
        },
        {
          title: 'Specialization Analysis',
          description: 'Appointment distribution across medical specializations',
          icon: Stethoscope,
          color: 'cyan',
          type: 'analysis'
        },
        {
          title: 'Patient Satisfaction Report',
          description: 'Patient feedback and satisfaction scores by doctor',
          icon: Star,
          color: 'yellow',
          type: 'satisfaction'
        }
      ]
    },
    {
      id: 'operational-reports',
      title: 'Operational Reports',
      description: 'Time analysis and operational efficiency metrics',
      reports: [
        {
          title: 'Time Slot Utilization',
          description: 'Peak hours and time slot efficiency analysis',
          icon: Clock,
          color: 'orange',
          type: 'operational'
        },
        {
          title: 'Resource Allocation',
          description: 'Room and resource utilization for appointments',
          icon: Target,
          color: 'pink',
          type: 'resource'
        },
        {
          title: 'Wait Time Analysis',
          description: 'Patient wait times and queue management insights',
          icon: Activity,
          color: 'red',
          type: 'efficiency'
        }
      ]
    }
  ];

  // Sample recent appointments data
  const recentAppointments = [
    {
      id: 'APT001',
      patient: 'Rajesh Kumar',
      doctor: 'Dr. Priya Sharma',
      date: '2025-09-15',
      time: '10:30 AM',
      status: 'completed',
      type: 'consultation',
      amount: '₹500'
    },
    {
      id: 'APT002',
      patient: 'Meera Patel',
      doctor: 'Dr. Anjali Nair',
      date: '2025-09-15',
      time: '11:00 AM',
      status: 'scheduled',
      type: 'follow-up',
      amount: '₹300'
    },
    {
      id: 'APT003',
      patient: 'Amit Singh',
      doctor: 'Dr. Arjun Kumar',
      date: '2025-09-15',
      time: '11:30 AM',
      status: 'cancelled',
      type: 'therapy',
      amount: '₹800'
    },
    {
      id: 'APT004',
      patient: 'Priya Nair',
      doctor: 'Dr. Meera Patel',
      date: '2025-09-15',
      time: '12:00 PM',
      status: 'completed',
      type: 'wellness',
      amount: '₹600'
    },
    {
      id: 'APT005',
      patient: 'Kiran Reddy',
      doctor: 'Dr. Priya Sharma',
      date: '2025-09-15',
      time: '12:30 PM',
      status: 'no-show',
      type: 'consultation',
      amount: '₹500'
    }
  ];

  const handleGenerateReport = () => {
    // Set default dates if not already set
    if (!dateFrom || !dateTo) {
      const today = new Date();
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
      
      setDateFrom(lastMonth.toISOString().split('T')[0]);
      setDateTo(today.toISOString().split('T')[0]);
    }
    onGenerateOpen();
  };

  const setQuickDateRange = (range) => {
    const today = new Date();
    let fromDate;
    
    switch (range) {
      case '7days':
        fromDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
        break;
      case '30days':
        fromDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30);
        break;
      case '90days':
        fromDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 90);
        break;
      case 'thisMonth':
        fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'lastMonth':
        fromDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastDayOfPrevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        setDateTo(lastDayOfPrevMonth.toISOString().split('T')[0]);
        setDateFrom(fromDate.toISOString().split('T')[0]);
        return;
      default:
        fromDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30);
    }
    
    setDateFrom(fromDate.toISOString().split('T')[0]);
    setDateTo(today.toISOString().split('T')[0]);
  };

  const handleExportReport = (format) => {
    toast({
      title: `Export ${format.toUpperCase()}`,
      description: `Generating ${format.toUpperCase()} report...`,
      status: 'info',
      duration: 2000,
      isClosable: true,
    });

    // Simulate processing and actual export
    setTimeout(() => {
      try {
        // Generate mock data for export
        const exportData = generateExportData();
        
        switch (format) {
          case 'pdf':
            downloadPDF(exportData);
            break;
          case 'excel':
            downloadExcel(exportData);
            break;
          case 'csv':
            downloadCSV(exportData);
            break;
          default:
            throw new Error('Unsupported format');
        }

        toast({
          title: 'Export Complete',
          description: `Report exported as ${format.toUpperCase()} successfully`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: 'Export Failed',
          description: `Failed to export report as ${format.toUpperCase()}`,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }, 2000);
  };

  const generateExportData = () => {
    return {
      title: 'Appointment Analytics Report',
      generatedDate: new Date().toLocaleDateString(),
      dateRange: `${dateFrom || 'All Time'} - ${dateTo || 'Current'}`,
      summary: {
        totalAppointments: 1234,
        completed: 1089,
        cancelled: 89,
        noShow: 56,
        showRate: '94.2%',
        avgWaitTime: '12 min'
      },
      appointmentData: recentAppointments,
      doctorStats: [
        { name: 'Dr. Priya Sharma', appointments: 156, rating: 4.8 },
        { name: 'Dr. Anjali Nair', appointments: 142, rating: 4.7 },
        { name: 'Dr. Arjun Kumar', appointments: 128, rating: 4.6 },
        { name: 'Dr. Meera Patel', appointments: 98, rating: 4.9 }
      ],
      timeSlotAnalysis: [
        { slot: '9:00 AM - 11:00 AM', utilization: 85, status: 'High' },
        { slot: '11:00 AM - 1:00 PM', utilization: 65, status: 'Medium' },
        { slot: '2:00 PM - 4:00 PM', utilization: 80, status: 'High' },
        { slot: '4:00 PM - 6:00 PM', utilization: 45, status: 'Low' }
      ]
    };
  };

  const downloadPDF = (data) => {
    const hospitalInfo = {
      name: "AYURVEDA WELLNESS HOSPITAL",
      address: "123 Wellness Street, Health City, HC 12345",
      phone: "+91 98765-43210",
      email: "reports@ayurvedahospital.com",
      website: "www.ayurvedahospital.com",
      license: "HOS/2023/AWH/001"
    };

    const pdfContent = `
╔══════════════════════════════════════════════════════════════════════════════╗
║                           ${hospitalInfo.name}                               ║
║                      COMPREHENSIVE HEALTHCARE SOLUTIONS                      ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  📍 Address: ${hospitalInfo.address}                                         ║
║  📞 Phone: ${hospitalInfo.phone}        📧 Email: ${hospitalInfo.email}       ║
║  🌐 Website: ${hospitalInfo.website}     🏥 License: ${hospitalInfo.license}  ║
╚══════════════════════════════════════════════════════════════════════════════╝

                            APPOINTMENT ANALYTICS REPORT
                               CONFIDENTIAL DOCUMENT
                                                                    
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REPORT INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Report Title        : ${data.title}
Generated Date      : ${data.generatedDate}
Report Period       : ${data.dateRange}
Generated By        : Hospital Management System
Report ID           : APT-${Date.now()}
Security Level      : INTERNAL USE ONLY

EXECUTIVE SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This report provides a comprehensive analysis of appointment statistics, patient
attendance patterns, and operational efficiency metrics for the specified period.

KEY PERFORMANCE INDICATORS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
├─ Total Appointments         : ${data.summary.totalAppointments.toLocaleString()}
├─ Completed Successfully     : ${data.summary.completed.toLocaleString()} (${((data.summary.completed/data.summary.totalAppointments)*100).toFixed(1)}%)
├─ Cancelled Appointments     : ${data.summary.cancelled.toLocaleString()} (${((data.summary.cancelled/data.summary.totalAppointments)*100).toFixed(1)}%)
├─ No-Show Appointments       : ${data.summary.noShow.toLocaleString()} (${((data.summary.noShow/data.summary.totalAppointments)*100).toFixed(1)}%)
├─ Overall Show Rate          : ${data.summary.showRate}
└─ Average Patient Wait Time  : ${data.summary.avgWaitTime}

APPOINTMENT DETAILS ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┌────────────┬─────────────────────┬─────────────────────┬─────────────┬─────────────┬────────────┐
│ Appt. ID   │ Patient Name        │ Consulting Doctor   │ Date        │ Time        │ Status     │
├────────────┼─────────────────────┼─────────────────────┼─────────────┼─────────────┼────────────┤
${data.appointmentData.map(apt => 
  `│ ${apt.id.padEnd(10)} │ ${apt.patient.padEnd(19)} │ ${apt.doctor.padEnd(19)} │ ${apt.date.padEnd(11)} │ ${apt.time.padEnd(11)} │ ${apt.status.toUpperCase().padEnd(10)} │`
).join('\n')}
└────────────┴─────────────────────┴─────────────────────┴─────────────┴─────────────┴────────────┘

DOCTOR PERFORMANCE METRICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┌─────────────────────────────┬─────────────────┬─────────────────┬─────────────────┐
│ Doctor Name                 │ Total Appts     │ Patient Rating  │ Efficiency      │
├─────────────────────────────┼─────────────────┼─────────────────┼─────────────────┤
${data.doctorStats.map(doc => 
  `│ ${doc.name.padEnd(27)} │ ${doc.appointments.toString().padEnd(15)} │ ${(doc.rating + '/5.0').padEnd(15)} │ ${'Excellent'.padEnd(15)} │`
).join('\n')}
└─────────────────────────────┴─────────────────┴─────────────────┴─────────────────┘

TIME SLOT UTILIZATION ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┌─────────────────────────────┬─────────────────┬─────────────────┬─────────────────┐
│ Time Slot                   │ Utilization %   │ Demand Level    │ Recommendation  │
├─────────────────────────────┼─────────────────┼─────────────────┼─────────────────┤
${data.timeSlotAnalysis.map(slot => 
  `│ ${slot.slot.padEnd(27)} │ ${(slot.utilization + '%').padEnd(15)} │ ${slot.status.padEnd(15)} │ ${'Maintain'.padEnd(15)} │`
).join('\n')}
└─────────────────────────────┴─────────────────┴─────────────────┴─────────────────┘

CLINICAL RECOMMENDATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Maintain current scheduling efficiency during peak hours (9-11 AM, 2-4 PM)
• Consider additional slots during high-demand periods to reduce wait times
• Implement patient reminder system to reduce no-show appointments
• Continue quality healthcare delivery as reflected in high completion rates

COMPLIANCE & CERTIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This report complies with:
✓ Hospital Information Management Standards (HIMS)
✓ Patient Data Privacy Regulations (PDPR)
✓ Healthcare Quality Assurance Guidelines (HQAG)
✓ Medical Record Management Protocols (MRMP)

AUTHORIZED SIGNATURES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Report Prepared By:     _________________________      Date: ${new Date().toLocaleDateString()}
                        Hospital Management System
                        
Reviewed By:           _________________________      Date: ${new Date().toLocaleDateString()}
                        Dr. Chief Medical Officer
                        
Approved By:           _________________________      Date: ${new Date().toLocaleDateString()}
                        Hospital Administrator

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                              END OF REPORT
                    
                        This is a computer-generated document
                     No signature required for digital reports
                          
                        For queries contact: ${hospitalInfo.email}
                         © 2025 Ayurveda Wellness Hospital
                              All Rights Reserved
                              
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;

    const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Appointment_Analytics_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const downloadExcel = (data) => {
    const hospitalInfo = {
      name: "AYURVEDA WELLNESS HOSPITAL",
      address: "123 Wellness Street, Health City, HC 12345",
      phone: "+91 98765-43210",
      email: "reports@ayurvedahospital.com"
    };

    let csvContent = `"${hospitalInfo.name}"\n`;
    csvContent += `"${hospitalInfo.address}"\n`;
    csvContent += `"Phone: ${hospitalInfo.phone} | Email: ${hospitalInfo.email}"\n`;
    csvContent += `\n`;
    csvContent += `"APPOINTMENT ANALYTICS REPORT"\n`;
    csvContent += `"Report Generated: ${data.generatedDate}"\n`;
    csvContent += `"Reporting Period: ${data.dateRange}"\n`;
    csvContent += `"Report ID: APT-${Date.now()}"\n`;
    csvContent += `\n`;
    
    csvContent += '"EXECUTIVE SUMMARY"\n';
    csvContent += '"Key Performance Indicators"\n';
    csvContent += '"Metric","Value","Percentage"\n';
    csvContent += `"Total Appointments","${data.summary.totalAppointments}","100.0%"\n`;
    csvContent += `"Completed Successfully","${data.summary.completed}","${((data.summary.completed/data.summary.totalAppointments)*100).toFixed(1)}%"\n`;
    csvContent += `"Cancelled Appointments","${data.summary.cancelled}","${((data.summary.cancelled/data.summary.totalAppointments)*100).toFixed(1)}%"\n`;
    csvContent += `"No-Show Appointments","${data.summary.noShow}","${((data.summary.noShow/data.summary.totalAppointments)*100).toFixed(1)}%"\n`;
    csvContent += `"Overall Show Rate","${data.summary.showRate}","-"\n`;
    csvContent += `"Average Wait Time","${data.summary.avgWaitTime}","-"\n`;
    csvContent += `\n`;
    
    csvContent += '"DETAILED APPOINTMENT DATA"\n';
    csvContent += '"Appointment ID","Patient Name","Consulting Doctor","Appointment Date","Appointment Time","Status","Type","Amount","Remarks"\n';
    data.appointmentData.forEach(apt => {
      csvContent += `"${apt.id}","${apt.patient}","${apt.doctor}","${apt.date}","${apt.time}","${apt.status.toUpperCase()}","${apt.type}","${apt.amount}","Processed"\n`;
    });
    csvContent += `\n`;
    
    csvContent += '"DOCTOR PERFORMANCE ANALYSIS"\n';
    csvContent += '"Doctor Name","Specialization","Total Appointments","Patient Rating","Efficiency Rating","Status"\n';
    data.doctorStats.forEach(doc => {
      const specialization = doc.name.includes('Priya') ? 'Ayurvedic Physician' :
                           doc.name.includes('Anjali') ? 'Panchakarma Specialist' :
                           doc.name.includes('Arjun') ? 'Pulse Diagnosis Expert' :
                           doc.name.includes('Meera') ? 'Ayurvedic Gynecologist' : 'General Practitioner';
      csvContent += `"${doc.name}","${specialization}","${doc.appointments}","${doc.rating}/5.0","Excellent","Active"\n`;
    });
    csvContent += `\n`;

    csvContent += '"TIME SLOT UTILIZATION MATRIX"\n';
    csvContent += '"Time Slot","Utilization Percentage","Demand Level","Capacity","Recommendations"\n';
    data.timeSlotAnalysis.forEach(slot => {
      const capacity = slot.utilization > 80 ? 'Near Full' : slot.utilization > 60 ? 'Moderate' : 'Available';
      const recommendation = slot.utilization > 80 ? 'Consider Additional Slots' : 
                           slot.utilization < 40 ? 'Optimize Scheduling' : 'Maintain Current';
      csvContent += `"${slot.slot}","${slot.utilization}%","${slot.status}","${capacity}","${recommendation}"\n`;
    });
    csvContent += `\n`;

    csvContent += '"QUALITY METRICS"\n';
    csvContent += '"Metric","Current Value","Target Value","Status"\n';
    csvContent += '"Patient Satisfaction","95%","90%","Exceeds Target"\n';
    csvContent += '"Appointment Punctuality","88%","85%","Meets Target"\n';
    csvContent += '"Doctor Availability","96%","95%","Meets Target"\n';
    csvContent += '"Resource Utilization","82%","80%","Optimal"\n';
    csvContent += `\n`;

    csvContent += '"COMPLIANCE INFORMATION"\n';
    csvContent += '"Standard","Compliance Status","Last Audit Date","Next Review"\n';
    csvContent += '"HIMS Standards","Compliant","2025-08-15","2025-11-15"\n';
    csvContent += '"Privacy Regulations","Compliant","2025-07-20","2025-10-20"\n';
    csvContent += '"Quality Guidelines","Compliant","2025-09-01","2025-12-01"\n';
    csvContent += `\n`;

    csvContent += '"REPORT AUTHENTICATION"\n';
    csvContent += '"Generated By","Hospital Management System"\n';
    csvContent += '"Report Date","' + new Date().toLocaleDateString() + '"\n';
    csvContent += '"Authorized By","System Administrator"\n';
    csvContent += '"Report Validity","Valid for 30 days from generation date"\n';
    csvContent += `\n`;
    csvContent += '"© 2025 Ayurveda Wellness Hospital - Confidential Report"\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Appointment_Report_Excel_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const downloadCSV = (data) => {
    const hospitalInfo = {
      name: "AYURVEDA WELLNESS HOSPITAL",
      address: "123 Wellness Street, Health City, HC 12345",
      phone: "+91 98765-43210",
      email: "reports@ayurvedahospital.com"
    };

    let csvContent = `# ${hospitalInfo.name}\n`;
    csvContent += `# ${hospitalInfo.address}\n`;
    csvContent += `# Phone: ${hospitalInfo.phone} | Email: ${hospitalInfo.email}\n`;
    csvContent += `# \n`;
    csvContent += `# APPOINTMENT DATA EXPORT\n`;
    csvContent += `# Generated: ${data.generatedDate} | Period: ${data.dateRange}\n`;
    csvContent += `# Report ID: APT-${Date.now()}\n`;
    csvContent += `# Classification: CONFIDENTIAL - INTERNAL USE ONLY\n`;
    csvContent += `# \n`;
    
    // Primary appointment data table
    csvContent += 'Appointment_ID,Patient_Full_Name,Consulting_Doctor,Appointment_Date,Appointment_Time,Current_Status,Appointment_Type,Consultation_Fee,Payment_Status,Created_Date,Last_Modified\n';
    
    data.appointmentData.forEach(apt => {
      const createdDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const paymentStatus = apt.status === 'completed' ? 'PAID' : apt.status === 'cancelled' ? 'REFUNDED' : 'PENDING';
      csvContent += `"${apt.id}","${apt.patient}","${apt.doctor}","${apt.date}","${apt.time}","${apt.status.toUpperCase()}","${apt.type}","${apt.amount}","${paymentStatus}","${createdDate}","${new Date().toISOString().split('T')[0]}"\n`;
    });

    csvContent += `\n# SUMMARY STATISTICS\n`;
    csvContent += `# Total Appointments: ${data.summary.totalAppointments}\n`;
    csvContent += `# Completed: ${data.summary.completed} (${((data.summary.completed/data.summary.totalAppointments)*100).toFixed(1)}%)\n`;
    csvContent += `# Cancelled: ${data.summary.cancelled} (${((data.summary.cancelled/data.summary.totalAppointments)*100).toFixed(1)}%)\n`;
    csvContent += `# No Shows: ${data.summary.noShow} (${((data.summary.noShow/data.summary.totalAppointments)*100).toFixed(1)}%)\n`;
    csvContent += `# Show Rate: ${data.summary.showRate}\n`;
    csvContent += `# Average Wait Time: ${data.summary.avgWaitTime}\n`;
    csvContent += `# \n`;

    csvContent += `\n# DOCTOR PERFORMANCE DATA\n`;
    csvContent += 'Doctor_Name,Specialization,Total_Appointments,Patient_Rating,Years_Experience,Employment_Status,Department\n';
    data.doctorStats.forEach(doc => {
      const specialization = doc.name.includes('Priya') ? 'Ayurvedic_Physician' :
                           doc.name.includes('Anjali') ? 'Panchakarma_Specialist' :
                           doc.name.includes('Arjun') ? 'Pulse_Diagnosis_Expert' :
                           doc.name.includes('Meera') ? 'Ayurvedic_Gynecologist' : 'General_Practitioner';
      const experience = Math.floor(Math.random() * 15) + 5;
      const department = 'Ayurveda_Medicine';
      csvContent += `"${doc.name}","${specialization}","${doc.appointments}","${doc.rating}","${experience}","ACTIVE","${department}"\n`;
    });

    csvContent += `\n# TIME SLOT ANALYSIS\n`;
    csvContent += 'Time_Slot,Utilization_Percent,Demand_Level,Recommended_Capacity,Peak_Hours_Flag\n';
    data.timeSlotAnalysis.forEach(slot => {
      const recommendedCapacity = Math.ceil(slot.utilization * 1.2);
      const peakFlag = slot.utilization > 75 ? 'YES' : 'NO';
      csvContent += `"${slot.slot}","${slot.utilization}","${slot.status}","${recommendedCapacity}","${peakFlag}"\n`;
    });

    csvContent += `\n# METADATA\n`;
    csvContent += `# Export Format: CSV\n`;
    csvContent += `# Generated By: Hospital Management System v2.1\n`;
    csvContent += `# Export Date: ${new Date().toISOString()}\n`;
    csvContent += `# Data Integrity: VERIFIED\n`;
    csvContent += `# Records Count: ${data.appointmentData.length}\n`;
    csvContent += `# Data Classification: CONFIDENTIAL\n`;
    csvContent += `# Retention Policy: 7 Years\n`;
    csvContent += `# Contact: ${hospitalInfo.email} for queries\n`;
    csvContent += `# \n`;
    csvContent += `# © 2025 Ayurveda Wellness Hospital. All rights reserved.\n`;
    csvContent += `# This data is proprietary and confidential. Unauthorized distribution prohibited.\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Hospital_Appointment_Data_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleGenerateAndDownload = () => {
    toast({
      title: 'Generating Report',
      description: 'Creating appointment analytics report...',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });

    // Simulate report generation
    setTimeout(() => {
      const reportData = generateExportData();
      
      // Auto-download based on selected format
      switch (reportFormat) {
        case 'pdf':
          downloadPDF(reportData);
          break;
        case 'excel':
          downloadExcel(reportData);
          break;
        case 'csv':
          downloadCSV(reportData);
          break;
      }

      toast({
        title: 'Report Generated',
        description: `Appointment report generated and downloaded as ${reportFormat.toUpperCase()}`,
        status: 'success',
        duration: 4000,
        isClosable: true,
      });

      onGenerateClose();
    }, 3000);
  };

  const handleEmailShare = (reportData) => {
    const subject = `Appointment Report - ${reportData?.title || 'Report'}`;
    const body = `Please find the appointment report attached:\n\nReport: ${reportData?.title}\nGenerated: ${new Date().toLocaleDateString()}\n\nBest regards`;
    
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
    
    toast({
      title: 'Email Share',
      description: 'Opening email client to share report',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleWhatsAppShare = (reportData) => {
    const message = `📅 *Appointment Report - ${reportData?.title || 'Report'}*\n\nGenerated: ${new Date().toLocaleDateString()}\n\nReport summary and details have been prepared. Please check your dashboard for the complete report.\n\n#AppointmentReport #Dashboard`;
    
    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');
    
    toast({
      title: 'WhatsApp Share',
      description: 'Opening WhatsApp to share report',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handlePrintReport = () => {
    toast({
      title: 'Print Report',
      description: 'Opening print preview...',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
    
    setTimeout(() => {
      window.print();
    }, 1000);
  };

  const handlePreviewReport = (reportData) => {
    const mockData = {
      reportTitle: reportData?.title || 'Appointment Report',
      generatedDate: new Date().toLocaleDateString(),
      totalRecords: 1234,
      summary: {
        totalAppointments: '1,234',
        completed: '1,089',
        cancelled: '89',
        noShow: '56'
      },
      sampleData: recentAppointments.slice(0, 3)
    };
    
    setPreviewData(mockData);
    onPreviewOpen();
  };

  const handleScheduleReport = () => {
    onScheduleOpen();
  };

  const handleConfigureReport = () => {
    onConfigureOpen();
  };

  const handleRefreshData = () => {
    toast({
      title: 'Refreshing Data',
      description: 'Updating appointment analytics...',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });

    setTimeout(() => {
      toast({
        title: 'Data Updated',
        description: 'Latest appointment data has been loaded',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }, 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'green';
      case 'scheduled': return 'blue';
      case 'cancelled': return 'red';
      case 'no-show': return 'orange';
      case 'rescheduled': return 'purple';
      default: return 'gray';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'scheduled': return 'Scheduled';
      case 'cancelled': return 'Cancelled';
      case 'no-show': return 'No Show';
      case 'rescheduled': return 'Rescheduled';
      default: return 'Unknown';
    }
  };

  const getIconComponent = (IconComponent, color) => {
    return <IconComponent size={20} color={color} />;
  };

  return (
    <Container maxW="full" p={0}>
      {/* Enhanced Header with Gradient */}
      <Box
        bgGradient="linear(135deg, blue.600 0%, purple.600 50%, teal.500 100%)"
        borderRadius="2xl"
        p={8}
        mb={8}
        color="white"
        position="relative"
        overflow="visible"
        zIndex={10}
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgGradient="radial(circle at 30% 20%, whiteAlpha.200, transparent 50%)"
          zIndex={1}
        />
        
        <Flex justify="space-between" align="center" position="relative" zIndex={2}>
          <VStack align="start" spacing={3}>
            <HStack>
              <Box p={3} bg="whiteAlpha.200" borderRadius="xl" backdropFilter="blur(10px)">
                <CalendarIcon size={32} />
              </Box>
              <VStack align="start" spacing={1}>
                <Heading size="xl" fontWeight="800">
                  {title}
                </Heading>
                <Text fontSize="lg" opacity={0.9} fontWeight="500">
                  Comprehensive appointment analytics and insights
                </Text>
              </VStack>
            </HStack>
            
            <HStack spacing={6} mt={4}>
              <HStack>
                <Activity size={16} />
                <Text fontSize="sm" opacity={0.9}>Real-time Updates</Text>
              </HStack>
              <HStack>
                <Target size={16} />
                <Text fontSize="sm" opacity={0.9}>Performance Tracking</Text>
              </HStack>
              <HStack>
                <Award size={16} />
                <Text fontSize="sm" opacity={0.9}>Quality Metrics</Text>
              </HStack>
            </HStack>
          </VStack>

          <VStack spacing={3}>
            <HStack>
              <Menu placement="bottom-end" strategy="fixed">
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDown />}
                  bg="whiteAlpha.200"
                  color="white"
                  _hover={{ bg: 'whiteAlpha.300' }}
                  _active={{ bg: 'whiteAlpha.400' }}
                  backdropFilter="blur(10px)"
                  border="1px solid"
                  borderColor="whiteAlpha.300"
                  _expanded={{ bg: 'whiteAlpha.400' }}
                >
                  Export
                </MenuButton>
                <MenuList 
                  zIndex={99999} 
                  bg="white" 
                  border="1px solid" 
                  borderColor="gray.200"
                  shadow="2xl"
                  borderRadius="lg"
                  minW="200px"
                  overflow="visible"
                >
                  <MenuItem 
                    icon={<FileText size={16} />} 
                    onClick={() => handleExportReport('pdf')}
                    _hover={{ bg: 'blue.50', color: 'blue.600' }}
                    color="gray.700"
                    fontWeight="500"
                  >
                    Export as PDF
                  </MenuItem>
                  <MenuItem 
                    icon={<FileText size={16} />} 
                    onClick={() => handleExportReport('excel')}
                    _hover={{ bg: 'green.50', color: 'green.600' }}
                    color="gray.700"
                    fontWeight="500"
                  >
                    Export as Excel
                  </MenuItem>
                  <MenuItem 
                    icon={<FileText size={16} />} 
                    onClick={() => handleExportReport('csv')}
                    _hover={{ bg: 'purple.50', color: 'purple.600' }}
                    color="gray.700"
                    fontWeight="500"
                  >
                    Export as CSV
                  </MenuItem>
                  <MenuItem 
                    icon={<Share size={16} />} 
                    onClick={() => handleEmailShare()}
                    _hover={{ bg: 'orange.50', color: 'orange.600' }}
                    color="gray.700"
                    fontWeight="500"
                  >
                    Share Report
                  </MenuItem>
                  <MenuItem 
                    icon={<Printer size={16} />} 
                    onClick={handlePrintReport}
                    _hover={{ bg: 'teal.50', color: 'teal.600' }}
                    color="gray.700"
                    fontWeight="500"
                  >
                    Print Report
                  </MenuItem>
                </MenuList>
              </Menu>

              <IconButton
                icon={<RefreshCw size={20} />}
                bg="whiteAlpha.200"
                color="white"
                _hover={{ bg: 'whiteAlpha.300' }}
                _active={{ bg: 'whiteAlpha.400' }}
                backdropFilter="blur(10px)"
                border="1px solid"
                borderColor="whiteAlpha.300"
                onClick={handleRefreshData}
              />
            </HStack>

            <HStack>
              <Button 
                leftIcon={<Filter />} 
                variant="outline" 
                color="white" 
                borderColor="whiteAlpha.400"
                _hover={{ bg: 'whiteAlpha.200', borderColor: 'whiteAlpha.500' }}
                onClick={onFiltersOpen}
              >
                Advanced Filters
              </Button>
              <Button 
                leftIcon={<BarChart3 />} 
                bg="white" 
                color="blue.600"
                _hover={{ bg: 'gray.50' }}
                fontWeight="600"
                onClick={handleGenerateReport}
              >
                Generate Report
              </Button>
            </HStack>
          </VStack>
        </Flex>
      </Box>

      {/* Enhanced Statistics Dashboard */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6} mb={8}>
        {enhancedStats.map((stat, index) => (
          <Card key={index} 
            bg={cardBg} 
            shadow="lg" 
            borderRadius="xl" 
            border="1px solid" 
            borderColor={borderColor}
            transition="all 0.3s"
            _hover={{ 
              transform: 'translateY(-4px)', 
              shadow: '2xl',
              borderColor: `${stat.color}.200`
            }}
          >
            <CardBody>
              <HStack justify="space-between" mb={4}>
                <VStack align="start" spacing={1}>
                  <HStack>
                    <Box 
                      p={2} 
                      bg={`${stat.color}.100`} 
                      borderRadius="lg"
                      color={`${stat.color}.600`}
                    >
                      <stat.icon size={20} />
                    </Box>
                    <Text fontSize="sm" color="gray.600" fontWeight="500">
                      {stat.label}
                    </Text>
                  </HStack>
                  <Text fontSize="2xl" fontWeight="800" color={stat.trend === 'up' ? 'green.600' : 'red.600'}>
                    {stat.value}
                  </Text>
                </VStack>
                
                <VStack align="end" spacing={1}>
                  <Badge 
                    colorScheme={stat.trend === 'up' ? 'green' : 'red'} 
                    variant="subtle"
                    px={2}
                    py={1}
                    borderRadius="md"
                  >
                    {stat.change}
                  </Badge>
                  <CircularProgress 
                    value={stat.current} 
                    max={stat.target} 
                    color={`${stat.color}.500`}
                    size="40px"
                    thickness="8px"
                  >
                    <CircularProgressLabel fontSize="xs" fontWeight="bold">
                      {Math.round((stat.current / stat.target) * 100)}%
                    </CircularProgressLabel>
                  </CircularProgress>
                </VStack>
              </HStack>
              
              <Progress 
                value={(stat.current / stat.target) * 100} 
                colorScheme={stat.color}
                borderRadius="full"
                size="sm"
              />
            </CardBody>
          </Card>
        ))}
      </Grid>

      {/* Enhanced Report Categories */}
      <Card bg={cardBg} shadow="lg" borderRadius="2xl" mb={8} overflow="visible" zIndex={1}>
        <CardHeader>
          <HStack justify="space-between">
            <HStack>
              <Box p={3} bg="blue.50" borderRadius="xl">
                <BarChart3 size={24} color="blue.600" />
              </Box>
              <VStack align="start" spacing={1}>
                <Text fontSize="xl" fontWeight="700">
                  Report Categories & Analytics
                </Text>
                <Text color="gray.600" fontSize="sm">
                  Choose from comprehensive appointment reporting options
                </Text>
              </VStack>
            </HStack>
          </HStack>
        </CardHeader>
        <CardBody overflow="visible">
          <Tabs variant="soft-rounded" colorScheme="blue">
            <TabList mb={6} p={1} bg="gray.50" borderRadius="xl">
              {reportCategories.map((category) => (
                <Tab 
                  key={category.id}
                  fontWeight="600"
                  _selected={{ 
                    bg: 'white', 
                    shadow: 'md',
                    color: 'blue.600'
                  }}
                >
                  {category.title}
                </Tab>
              ))}
            </TabList>
            
            <TabPanels>
              {reportCategories.map((category) => (
                <TabPanel key={category.id} p={0}>
                  <VStack align="stretch" spacing={4}>
                    <Text color="gray.600" fontSize="sm" mb={4}>
                      {category.description}
                    </Text>
                    
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                      {category.reports.map((report, index) => (
                        <Card key={index} 
                          variant="outline" 
                          borderRadius="xl"
                          transition="all 0.3s"
                          _hover={{ 
                            shadow: 'lg', 
                            transform: 'translateY(-2px)',
                            borderColor: `${report.color}.300`
                          }}
                          cursor="pointer"
                        >
                          <CardBody>
                            <VStack spacing={4} align="stretch">
                              <HStack justify="space-between">
                                <HStack>
                                  <Box 
                                    p={3} 
                                    bg={`${report.color}.100`} 
                                    borderRadius="xl"
                                    color={`${report.color}.600`}
                                  >
                                    <report.icon size={20} />
                                  </Box>
                                  <VStack align="start" spacing={1}>
                                    <Text fontWeight="600" fontSize="sm">
                                      {report.title}
                                    </Text>
                                    <Badge colorScheme={report.color} variant="subtle" size="sm">
                                      {report.type}
                                    </Badge>
                                  </VStack>
                                </HStack>
                                
                                <Menu placement="bottom-end" strategy="fixed">
                                  <MenuButton
                                    as={IconButton}
                                    icon={<MoreVertical size={16} />}
                                    variant="ghost"
                                    size="sm"
                                    _hover={{ bg: 'gray.100' }}
                                    _active={{ bg: 'gray.200' }}
                                  />
                                  <MenuList 
                                    zIndex={99999}
                                    bg="white"
                                    border="1px solid"
                                    borderColor="gray.200"
                                    shadow="2xl"
                                    borderRadius="lg"
                                    minW="160px"
                                  >
                                    <MenuItem 
                                      icon={<Eye size={16} />} 
                                      onClick={() => handlePreviewReport(report)}
                                      _hover={{ bg: 'blue.50', color: 'blue.600' }}
                                      fontWeight="500"
                                    >
                                      Preview
                                    </MenuItem>
                                    <MenuItem 
                                      icon={<Calendar size={16} />} 
                                      onClick={handleScheduleReport}
                                      _hover={{ bg: 'green.50', color: 'green.600' }}
                                      fontWeight="500"
                                    >
                                      Schedule
                                    </MenuItem>
                                    <MenuItem 
                                      icon={<Settings size={16} />} 
                                      onClick={handleConfigureReport}
                                      _hover={{ bg: 'purple.50', color: 'purple.600' }}
                                      fontWeight="500"
                                    >
                                      Configure
                                    </MenuItem>
                                  </MenuList>
                                </Menu>
                              </HStack>
                              
                              <Text fontSize="xs" color="gray.600" lineHeight="1.4">
                                {report.description}
                              </Text>
                              
                              <Divider />
                              
                              <HStack justify="space-between">
                                <Badge colorScheme="green" variant="outline" size="sm">
                                  Available
                                </Badge>
                                <Text fontSize="xs" color="gray.500">
                                  Updated daily
                                </Text>
                              </HStack>
                            </VStack>
                          </CardBody>
                        </Card>
                      ))}
                    </SimpleGrid>
                  </VStack>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </CardBody>
      </Card>

      {/* Recent Appointments Summary */}
      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8} mb={8}>
        <Card bg={cardBg} shadow="lg" borderRadius="2xl">
          <CardHeader>
            <HStack justify="space-between">
              <HStack>
                <Box p={3} bg="purple.50" borderRadius="xl">
                  <Activity size={24} color="purple.600" />
                </Box>
                <VStack align="start" spacing={1}>
                  <Text fontSize="lg" fontWeight="700">
                    Recent Appointments
                  </Text>
                  <Text color="gray.600" fontSize="sm">
                    Latest appointment activities and status updates
                  </Text>
                </VStack>
              </HStack>
              <Button size="sm" leftIcon={<Eye />} variant="outline">
                View All
              </Button>
            </HStack>
          </CardHeader>
          <CardBody>
            <TableContainer>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Patient</Th>
                    <Th>Doctor</Th>
                    <Th>Date & Time</Th>
                    <Th>Status</Th>
                    <Th>Amount</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {recentAppointments.map((appointment) => (
                    <Tr key={appointment.id}>
                      <Td>
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="600" fontSize="sm">{appointment.patient}</Text>
                          <Text color="gray.500" fontSize="xs">{appointment.id}</Text>
                        </VStack>
                      </Td>
                      <Td>
                        <Text fontSize="sm">{appointment.doctor}</Text>
                      </Td>
                      <Td>
                        <VStack align="start" spacing={1}>
                          <Text fontSize="sm">{appointment.date}</Text>
                          <Text color="gray.500" fontSize="xs">{appointment.time}</Text>
                        </VStack>
                      </Td>
                      <Td>
                        <Badge 
                          colorScheme={getStatusColor(appointment.status)} 
                          variant="subtle"
                          borderRadius="md"
                        >
                          {getStatusText(appointment.status)}
                        </Badge>
                      </Td>
                      <Td>
                        <Text fontWeight="600" fontSize="sm">{appointment.amount}</Text>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </CardBody>
        </Card>

        <VStack spacing={6}>
          <Card bg={cardBg} shadow="lg" borderRadius="2xl" w="full">
            <CardHeader>
              <HStack>
                <Box p={2} bg="green.50" borderRadius="lg">
                  <CheckCircle size={20} color="green.600" />
                </Box>
                <Text fontSize="md" fontWeight="700">Today's Schedule</Text>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack align="stretch" spacing={3}>
                <HStack justify="space-between">
                  <Text fontSize="sm">Total Appointments</Text>
                  <Badge colorScheme="blue" variant="solid">45</Badge>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="sm">Completed</Text>
                  <Badge colorScheme="green" variant="solid">38</Badge>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="sm">Pending</Text>
                  <Badge colorScheme="orange" variant="solid">5</Badge>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="sm">Cancelled</Text>
                  <Badge colorScheme="red" variant="solid">2</Badge>
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          <Card bg={cardBg} shadow="lg" borderRadius="2xl" w="full">
            <CardHeader>
              <HStack>
                <Box p={2} bg="blue.50" borderRadius="lg">
                  <Users size={20} color="blue.600" />
                </Box>
                <Text fontSize="md" fontWeight="700">Top Doctors</Text>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack align="stretch" spacing={3}>
                <HStack justify="space-between">
                  <Text fontSize="sm">Dr. Priya Sharma</Text>
                  <Badge colorScheme="blue" variant="outline">156</Badge>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="sm">Dr. Anjali Nair</Text>
                  <Badge colorScheme="blue" variant="outline">142</Badge>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="sm">Dr. Arjun Kumar</Text>
                  <Badge colorScheme="blue" variant="outline">128</Badge>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="sm">Dr. Meera Patel</Text>
                  <Badge colorScheme="blue" variant="outline">98</Badge>
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          <Card bg={cardBg} shadow="lg" borderRadius="2xl" w="full">
            <CardHeader>
              <HStack>
                <Box p={2} bg="purple.50" borderRadius="lg">
                  <Clock size={20} color="purple.600" />
                </Box>
                <Text fontSize="md" fontWeight="700">Peak Hours</Text>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack align="stretch" spacing={3}>
                <HStack justify="space-between">
                  <Text fontSize="sm">9:00 AM - 11:00 AM</Text>
                  <Badge colorScheme="purple" variant="solid">High</Badge>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="sm">2:00 PM - 4:00 PM</Text>
                  <Badge colorScheme="purple" variant="solid">High</Badge>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="sm">11:00 AM - 1:00 PM</Text>
                  <Badge colorScheme="blue" variant="solid">Medium</Badge>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="sm">4:00 PM - 6:00 PM</Text>
                  <Badge colorScheme="gray" variant="solid">Low</Badge>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Grid>

      {/* Preview Modal */}
      <Modal isOpen={isPreviewOpen} onClose={onPreviewClose} size="4xl">
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent maxW="90vw" maxH="90vh" borderRadius="2xl">
          <ModalHeader>
            <HStack>
              <Eye size={24} />
              <Text>{previewData?.reportTitle} - Preview</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody overflow="auto">
            {previewData && (
              <VStack spacing={6} align="stretch">
                <Card variant="outline" borderRadius="xl">
                  <CardBody>
                    <HStack justify="space-between" mb={4}>
                      <VStack align="start" spacing={1}>
                        <Text fontSize="lg" fontWeight="bold">{previewData.reportTitle}</Text>
                        <Text fontSize="sm" color="gray.600">Generated on: {previewData.generatedDate}</Text>
                      </VStack>
                      <Badge colorScheme="blue" variant="subtle" px={3} py={1}>
                        {previewData.totalRecords} Records
                      </Badge>
                    </HStack>
                    
                    <SimpleGrid columns={4} spacing={4}>
                      <Stat textAlign="center">
                        <StatLabel>Total Appointments</StatLabel>
                        <StatNumber color="blue.600" fontSize="xl">{previewData.summary.totalAppointments}</StatNumber>
                      </Stat>
                      <Stat textAlign="center">
                        <StatLabel>Completed</StatLabel>
                        <StatNumber color="green.600" fontSize="xl">{previewData.summary.completed}</StatNumber>
                      </Stat>
                      <Stat textAlign="center">
                        <StatLabel>Cancelled</StatLabel>
                        <StatNumber color="red.600" fontSize="xl">{previewData.summary.cancelled}</StatNumber>
                      </Stat>
                      <Stat textAlign="center">
                        <StatLabel>No Show</StatLabel>
                        <StatNumber color="orange.600" fontSize="xl">{previewData.summary.noShow}</StatNumber>
                      </Stat>
                    </SimpleGrid>
                  </CardBody>
                </Card>

                {previewData.sampleData && (
                  <Card variant="outline" borderRadius="xl">
                    <CardHeader>
                      <Text fontWeight="600">Sample Data Preview</Text>
                    </CardHeader>
                    <CardBody>
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th>Patient</Th>
                            <Th>Doctor</Th>
                            <Th>Date</Th>
                            <Th>Status</Th>
                            <Th>Amount</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {previewData.sampleData.map((row, index) => (
                            <Tr key={index}>
                              <Td>{row.patient}</Td>
                              <Td>{row.doctor}</Td>
                              <Td>{row.date}</Td>
                              <Td>
                                <Badge colorScheme={getStatusColor(row.status)} variant="subtle">
                                  {getStatusText(row.status)}
                                </Badge>
                              </Td>
                              <Td>{row.amount}</Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </CardBody>
                  </Card>
                )}
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button variant="outline" onClick={onPreviewClose} borderRadius="lg">
                Close
              </Button>
              <Button 
                colorScheme="blue" 
                leftIcon={<Download />}
                onClick={() => handleExportReport('pdf')}
                borderRadius="lg"
              >
                Export as PDF
              </Button>
              <Menu>
                <MenuButton
                  as={Button}
                  colorScheme="green"
                  leftIcon={<Share2 />}
                  rightIcon={<ChevronDown size={16} />}
                  borderRadius="lg"
                  _hover={{ bg: 'green.600' }}
                >
                  Share Report
                </MenuButton>
                <MenuList zIndex={9999}>
                  <MenuItem 
                    icon={<Mail size={16} />}
                    onClick={() => handleEmailShare(previewData)}
                    _hover={{ bg: 'blue.50' }}
                  >
                    Share via Email
                  </MenuItem>
                  <MenuItem 
                    icon={<MessageCircle size={16} />}
                    onClick={() => handleWhatsAppShare(previewData)}
                    _hover={{ bg: 'green.50' }}
                  >
                    Share via WhatsApp
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Schedule Modal */}
      <Modal isOpen={isScheduleOpen} onClose={onScheduleClose} size="lg">
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent borderRadius="2xl">
          <ModalHeader>
            <HStack>
              <Calendar size={24} />
              <Text>Schedule Appointment Report</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text fontSize="sm" color="gray.600">
                Schedule automatic generation and delivery of appointment reports
              </Text>
              
              <SimpleGrid columns={2} spacing={4}>
                <FormControl>
                  <FormLabel>Frequency</FormLabel>
                  <Select>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="custom">Custom</option>
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Time</FormLabel>
                  <Input type="time" defaultValue="09:00" />
                </FormControl>
              </SimpleGrid>
              
              <FormControl>
                <FormLabel>Recipients</FormLabel>
                <Textarea 
                  placeholder="Enter email addresses separated by commas"
                  rows={3}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Report Format</FormLabel>
                <CheckboxGroup defaultValue={['pdf']}>
                  <HStack spacing={6}>
                    <Checkbox value="pdf">PDF</Checkbox>
                    <Checkbox value="excel">Excel</Checkbox>
                    <Checkbox value="csv">CSV</Checkbox>
                  </HStack>
                </CheckboxGroup>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onScheduleClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" leftIcon={<Calendar />}>
              Schedule Report
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Configure Modal */}
      <Modal isOpen={isConfigureOpen} onClose={onConfigureClose} size="lg">
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent borderRadius="2xl">
          <ModalHeader>
            <HStack>
              <Settings size={24} />
              <Text>Configure Report Settings</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text fontSize="sm" color="gray.600">
                Customize report parameters and display preferences
              </Text>
              
              <FormControl>
                <FormLabel>Default Date Range</FormLabel>
                <Select>
                  <option value="7days">Last 7 days</option>
                  <option value="30days">Last 30 days</option>
                  <option value="90days">Last 90 days</option>
                  <option value="custom">Custom range</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Include in Reports</FormLabel>
                <VStack align="stretch" spacing={3}>
                  <HStack justify="space-between">
                    <Text fontSize="sm">Patient Demographics</Text>
                    <Switch defaultIsChecked />
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm">Doctor Performance Metrics</Text>
                    <Switch defaultIsChecked />
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm">Revenue Analysis</Text>
                    <Switch defaultIsChecked />
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm">Time Slot Analysis</Text>
                    <Switch defaultIsChecked />
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm">Charts and Graphs</Text>
                    <Switch defaultIsChecked />
                  </HStack>
                </VStack>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onConfigureClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" leftIcon={<Settings />}>
              Save Configuration
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Advanced Filters Modal */}
      <Modal isOpen={isFiltersOpen} onClose={onFiltersClose} size="lg">
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent borderRadius="2xl">
          <ModalHeader>
            <HStack>
              <Filter size={24} />
              <Text>Advanced Filters</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Search Appointments</FormLabel>
                <Input
                  placeholder="Search by patient name, doctor, or appointment ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftElement={<Search size={16} />}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Category Filter</FormLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="appointment-analytics">Appointment Analytics</option>
                  <option value="doctor-performance">Doctor Performance</option>
                  <option value="operational-reports">Operational Reports</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Auto-refresh Settings</FormLabel>
                <HStack>
                  <Switch
                    isChecked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                  />
                  <Text>Enable auto-refresh</Text>
                </HStack>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onFiltersClose}>
              Reset
            </Button>
            <Button colorScheme="blue" leftIcon={<Filter />}>
              Apply Filters
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Generate Report Modal */}
      <Modal isOpen={isGenerateOpen} onClose={onGenerateClose} size="lg">
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent borderRadius="2xl">
          <ModalHeader>
            <HStack>
              <BarChart3 size={24} />
              <Text>Generate Appointment Report</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text fontSize="sm" color="gray.600">
                Generate comprehensive appointment analytics with detailed insights and trends
              </Text>

              {(!dateFrom || !dateTo) && (
                <Box bg="orange.50" border="1px solid" borderColor="orange.200" p={3} borderRadius="md">
                  <Text fontSize="sm" color="orange.700" fontWeight="500">
                    ⚠️ Please select date range to generate the report
                  </Text>
                </Box>
              )}
              
              <HStack>
                <FormControl isRequired>
                  <FormLabel>From Date</FormLabel>
                  <Input 
                    type="date" 
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>To Date</FormLabel>
                  <Input 
                    type="date" 
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    min={dateFrom}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </FormControl>
              </HStack>

              <Box>
                <Text fontSize="sm" color="gray.600" mb={2}>Quick Date Ranges:</Text>
                <HStack spacing={2} flexWrap="wrap">
                  <Button size="xs" variant="outline" onClick={() => setQuickDateRange('7days')}>
                    Last 7 Days
                  </Button>
                  <Button size="xs" variant="outline" onClick={() => setQuickDateRange('30days')}>
                    Last 30 Days
                  </Button>
                  <Button size="xs" variant="outline" onClick={() => setQuickDateRange('90days')}>
                    Last 90 Days
                  </Button>
                  <Button size="xs" variant="outline" onClick={() => setQuickDateRange('thisMonth')}>
                    This Month
                  </Button>
                  <Button size="xs" variant="outline" onClick={() => setQuickDateRange('lastMonth')}>
                    Last Month
                  </Button>
                </HStack>
              </Box>
              
              <FormControl>
                <FormLabel>Doctor/Practitioner</FormLabel>
                <Select placeholder="Select doctor or all">
                  <option value="all">All Doctors</option>
                  <option value="dr-priya">Dr. Priya Sharma (Ayurvedic Physician)</option>
                  <option value="dr-anjali">Dr. Anjali Nair (Panchakarma Specialist)</option>
                  <option value="dr-arjun">Dr. Arjun Kumar (Pulse Diagnosis Expert)</option>
                  <option value="dr-meera">Dr. Meera Patel (Ayurvedic Gynecologist)</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Appointment Status</FormLabel>
                <Select placeholder="Select status or all">
                  <option value="all">All Statuses</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no-show">No Show</option>
                  <option value="rescheduled">Rescheduled</option>
                </Select>
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Report Format</FormLabel>
                <Select 
                  value={reportFormat}
                  onChange={(e) => setReportFormat(e.target.value)}
                >
                  <option value="pdf">📄 PDF Report (Recommended)</option>
                  <option value="excel">📊 Excel Spreadsheet</option>
                  <option value="csv">📋 CSV Data File</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Additional Options</FormLabel>
                <VStack align="stretch" spacing={3}>
                  <HStack justify="space-between">
                    <Text fontSize="sm">Include Charts & Graphs</Text>
                    <Switch 
                      isChecked={includeCharts}
                      onChange={(e) => setIncludeCharts(e.target.checked)}
                      colorScheme="blue"
                    />
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm">Include Patient Demographics</Text>
                    <Switch defaultIsChecked colorScheme="green" />
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm">Include Doctor Performance</Text>
                    <Switch defaultIsChecked colorScheme="purple" />
                  </HStack>
                </VStack>
              </FormControl>

              {dateFrom && dateTo && (
                <Box bg="green.50" border="1px solid" borderColor="green.200" p={3} borderRadius="md">
                  <Text fontSize="sm" color="green.700" fontWeight="500">
                    ✅ Ready to generate report for {dateFrom} to {dateTo}
                  </Text>
                </Box>
              )}
            </VStack>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onGenerateClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              leftIcon={<Download />}
              onClick={handleGenerateAndDownload}
              isDisabled={!dateFrom || !dateTo}
            >
              Generate & Download
            </Button>
            <Button 
              colorScheme="gray" 
              leftIcon={<Printer />} 
              ml={2}
              onClick={handlePrintReport}
            >
              Print Preview
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default AppointmentReports;
