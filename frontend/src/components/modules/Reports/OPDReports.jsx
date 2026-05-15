import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Text, VStack, HStack, SimpleGrid, Card, CardHeader, CardBody,
  Button, Badge, Select, FormControl, FormLabel, Input, Textarea,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, useDisclosure, Checkbox,
  Heading, Divider, IconButton, Menu, MenuButton, MenuList, MenuItem,
  Stat, StatLabel, StatNumber, StatHelpText, Progress, Avatar,
  AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader,
  AlertDialogContent, AlertDialogOverlay, AlertDialogCloseButton,
  useToast, Tooltip, Flex, Stack, Grid, Tabs, TabList, TabPanels,
  Tab, TabPanel, useColorModeValue, Spinner
} from '@chakra-ui/react';
import { 
  Download, FileText, Calendar, Users, DollarSign, TrendingUp, 
  Activity, Clock, Printer, Eye, Share2, Filter, Settings,
  Mail, MessageCircle, CheckCircle, AlertCircle, BarChart3, PieChart,
  Stethoscope, RefreshCw, ChevronDown, Loader
} from 'lucide-react';

const OPDReports = () => {
  // State management
  const [selectedReportType, setSelectedReportType] = useState(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [reportFormat, setReportFormat] = useState('pdf');
  const [shareEmail, setShareEmail] = useState('');
  const [shareMessage, setShareMessage] = useState('');
  const [activeDateRange, setActiveDateRange] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(false);

  // Chakra UI hooks
  const { isOpen: isGenerateOpen, onOpen: onGenerateOpen, onClose: onGenerateClose } = useDisclosure();
  const { isOpen: isPreviewOpen, onOpen: onPreviewOpen, onClose: onPreviewClose } = useDisclosure();
  const { isOpen: isScheduleOpen, onOpen: onScheduleOpen, onClose: onScheduleClose } = useDisclosure();
  const { isOpen: isConfigureOpen, onOpen: onConfigureOpen, onClose: onConfigureClose } = useDisclosure();
  const { isOpen: isShareOpen, onOpen: onShareOpen, onClose: onShareClose } = useDisclosure();
  const toast = useToast();

  // Initialize with Last 7 Days by default
  useEffect(() => {
    if (!dateFrom && !dateTo) {
      const today = new Date();
      const fromDate = new Date(today);
      fromDate.setDate(today.getDate() - 7);
      
      setDateFrom(fromDate.toISOString().split('T')[0]);
      setDateTo(today.toISOString().split('T')[0]);
      setActiveDateRange(7);
    }
  }, [dateFrom, dateTo]);

  // Enhanced report types with more details
  const reportTypes = [
    {
      id: 'opd-report',
      title: 'OPD Patient Report',
      description: 'Comprehensive report of all outpatient department visits, treatments, and patient statistics',
      icon: Stethoscope,
      color: 'blue',
      count: 1247,
      trend: '+12%',
      category: 'Patient Reports'
    },
    {
      id: 'balance-report',
      title: 'OPD Balance Report',
      description: 'Financial balance report showing pending payments, collections, and outstanding amounts',
      icon: DollarSign,
      color: 'green',
      count: '₹2.4L',
      trend: '+8%',
      category: 'Financial Reports'
    },
    {
      id: 'department-wise',
      title: 'Department Performance',
      description: 'Performance metrics and statistics for each OPD department',
      icon: BarChart3,
      color: 'orange',
      count: 12,
      trend: 'Active',
      category: 'Analytics'
    }
  ];

  // Quick stats with enhanced data
  const quickStats = [
    {
      label: 'Total OPD Visits Today',
      value: '124',
      change: '+15%',
      changeType: 'increase',
      icon: Users,
      color: 'blue'
    },
    {
      label: 'Revenue Generated',
      value: '₹45,600',
      change: '+22%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'green'
    },
    {
      label: 'Active Departments',
      value: '12',
      change: 'All Active',
      changeType: 'neutral',
      icon: Activity,
      color: 'purple'
    },
    {
      label: 'Follow-ups Pending',
      value: '47',
      change: '-8%',
      changeType: 'decrease',
      icon: Clock,
      color: 'orange'
    }
  ];

  // Department performance data
  const departmentStats = [
    { name: 'General Medicine', patients: 45, revenue: 18500, efficiency: 92 },
    { name: 'Panchakarma', patients: 32, revenue: 24800, efficiency: 88 },
    { name: 'Ayurvedic Gynecology', patients: 28, revenue: 15600, efficiency: 85 },
    { name: 'Pediatrics', patients: 19, revenue: 12400, efficiency: 90 },
    { name: 'Dermatology', patients: 22, revenue: 14200, efficiency: 87 },
    { name: 'Orthopedics', patients: 15, revenue: 11800, efficiency: 83 }
  ];

  // Dynamic data generation based on date range
  const generateDynamicData = (days) => {
    let multiplier;
    if (days === 7) {
      multiplier = 1;
    } else if (days === 30) {
      multiplier = 4.2;
    } else if (days === 90) {
      multiplier = 12.5;
    } else if (days === 365) {
      multiplier = 52;
    } else {
      multiplier = 1;
    }
    
    return {
      quickStats: [
        {
          label: `Total OPD Visits ${days === 7 ? 'This Week' : days === 30 ? 'This Month' : days === 90 ? 'This Quarter' : 'This Year'}`,
          value: Math.round(124 * multiplier).toLocaleString(),
          change: days === 7 ? '+15%' : days === 30 ? '+18%' : days === 90 ? '+12%' : '+25%',
          changeType: 'increase',
          icon: Users,
          color: 'blue'
        },
        {
          label: 'Revenue Generated',
          value: `₹${Math.round(45600 * multiplier / 1000)}${multiplier > 10 ? 'L' : 'K'}`,
          change: days === 7 ? '+22%' : days === 30 ? '+28%' : days === 90 ? '+15%' : '+35%',
          changeType: 'increase',
          icon: DollarSign,
          color: 'green'
        },
        {
          label: 'Active Departments',
          value: '12',
          change: 'All Active',
          changeType: 'neutral',
          icon: Activity,
          color: 'purple'
        },
        {
          label: 'Follow-ups Pending',
          value: Math.round(47 * (multiplier * 0.3)).toString(),
          change: days === 7 ? '-8%' : days === 30 ? '-12%' : days === 90 ? '-5%' : '+2%',
          changeType: days === 365 ? 'increase' : 'decrease',
          icon: Clock,
          color: 'orange'
        }
      ],
      departmentStats: departmentStats.map(dept => ({
        ...dept,
        patients: Math.round(dept.patients * multiplier),
        revenue: Math.round(dept.revenue * multiplier),
        efficiency: Math.max(75, Math.min(98, dept.efficiency + (Math.random() - 0.5) * 10))
      })),
      reportCounts: {
  'opd-report': Math.round(1247 * multiplier),
  'balance-report': `₹${Math.round(2.4 * multiplier)}L`,
  'department-wise': 12
      }
    };
  };

  // Get current data based on active date range
  const currentData = useMemo(() => {
    const days = activeDateRange || 7;
    return generateDynamicData(days);
  }, [activeDateRange]);

  // Quick date range functions
  const setQuickDateRange = (days) => {
    setIsDataLoading(true);
    
    const today = new Date();
    const fromDate = new Date(today);
    fromDate.setDate(today.getDate() - days);
    
    const formattedFromDate = fromDate.toISOString().split('T')[0];
    const formattedToDate = today.toISOString().split('T')[0];
    
    setDateFrom(formattedFromDate);
    setDateTo(formattedToDate);
    setActiveDateRange(days);

    // Simulate data loading
    setTimeout(() => {
      setIsDataLoading(false);
      
      // Show confirmation toast
      const rangeName = days === 7 ? 'Last 7 Days' : 
                        days === 30 ? 'Last Month' : 
                        days === 90 ? 'Last Quarter' : 
                        days === 365 ? 'Last Year' : `Last ${days} Days`;

      const dynamicData = generateDynamicData(days);
      const totalVisits = dynamicData.quickStats[0].value;
      const revenue = dynamicData.quickStats[1].value;

      toast({
        title: "Date Range Updated",
        description: `${rangeName} selected • ${totalVisits} visits • ${revenue} revenue`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }, 300);
  };

  // Export functions with actual file generation
  const downloadPDF = (reportData, filename) => {
  let hospitalHeader = `
╔══════════════════════════════════════════════════════════════════════════════╗
║                          AYUSH HEALTHCARE HOSPITAL                           ║
║                         OUTPATIENT DEPARTMENT REPORT                         ║
║                                                                              ║
║   📍 Address: 123 Wellness Street, Ayurveda City - 560001                    ║
║   📞 Phone: +91-80-2345-6789 | 📧 Email: reports@ayushhospital.com            ║
║   🌐 Website: www.ayushhospital.com                                           ║
║   📋 Registration: KARNMED2023-AYU-001 | 🏥 NABH Accredited                   ║
╚══════════════════════════════════════════════════════════════════════════════╝

CONFIDENTIAL MEDICAL REPORT
Report Type: ${reportData.type || 'OPD Report'}
Generation Date: ${new Date().toLocaleString()}
Report Period: ${dateFrom} to ${dateTo}
Generated by: Dr. Administrator
Department: Outpatient Services

════════════════════════════════════════════════════════════════════════════════

EXECUTIVE SUMMARY:
• Total OPD Visits: ${reportData.totalVisits || '1,247'}
• Revenue Generated: ${reportData.totalRevenue || '₹2,45,600'}
• Active Departments: ${reportData.activeDepartments || '12'}
• Patient Satisfaction: ${reportData.satisfaction || '94.5%'}

DEPARTMENT-WISE BREAKDOWN:
────────────────────────────────────────────────────────────────────────────────
Department              | Patients | Revenue    | Efficiency | Follow-ups
────────────────────────────────────────────────────────────────────────────────`;

    currentData.departmentStats.forEach(dept => {
      const paddedName = dept.name.padEnd(23);
      const paddedPatients = dept.patients.toString().padStart(8);
      const paddedRevenue = `₹${dept.revenue}`.padStart(10);
      const paddedEfficiency = `${dept.efficiency}%`.padStart(10);
      const followUps = Math.floor(dept.patients * 0.3).toString().padStart(10);
      
      hospitalHeader += `\n${paddedName} | ${paddedPatients} | ${paddedRevenue} | ${paddedEfficiency} | ${followUps}`;
    });

    const fullReport = hospitalHeader + `
────────────────────────────────────────────────────────────────────────────────

FINANCIAL SUMMARY:
• Total Collections: ₹2,45,600
• Pending Payments: ₹32,400  
• Insurance Claims: ₹18,900
• Cash Payments: ₹1,94,300

QUALITY METRICS:
• Average Waiting Time: 12 minutes
• Patient Satisfaction Score: 4.7/5.0
• Treatment Success Rate: 96.8%
• Readmission Rate: 2.1%

COMPLIANCE & CERTIFICATION:
✓ NABH Standards Compliant
✓ ISO 9001:2015 Certified
✓ Ayush Ministry Approved
✓ State Medical Council Registered

AUTHORIZED SIGNATURES:
_______________________          _______________________
Dr. Medical Superintendent       Chief Administrative Officer
Registration: MED2023-001        Employee ID: CAO-2023-015

Report Authentication Code: OPD-${Date.now()}
Security Classification: RESTRICTED - MEDICAL DATA
This report contains confidential patient information and should be handled accordingly.

════════════════════════════════════════════════════════════════════════════════
Generated by AYUSH Hospital Management System v2.4.1
© 2024 Ayush Healthcare Hospital. All rights reserved.
════════════════════════════════════════════════════════════════════════════════`;

    const blob = new Blob([fullReport], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadExcel = (reportData, filename) => {
    const csvContent = `AYUSH HEALTHCARE HOSPITAL - OPD REPORT
Generated: ${new Date().toLocaleString()}
Period: ${dateFrom} to ${dateTo}

SUMMARY STATISTICS
Metric,Value,Change
Total OPD Visits,${reportData.totalVisits || '1247'},+15%
Revenue Generated,${reportData.totalRevenue || '245600'},+22%
Active Departments,${reportData.activeDepartments || '12'},Stable
Follow-ups Pending,${reportData.followUps || '47'},-8%

DEPARTMENT PERFORMANCE
Department,Patients,Revenue,Efficiency,Follow-ups Required
${currentData.departmentStats.map(dept => 
  `${dept.name},${dept.patients},${dept.revenue},${dept.efficiency}%,${Math.floor(dept.patients * 0.3)}`
).join('\n')}

FINANCIAL BREAKDOWN
Category,Amount,Percentage
Collections,245600,75.8%
Pending,32400,10.0%
Insurance,18900,5.8%
Cash Payments,194300,60.0%

Report Authentication: OPD-${Date.now()}
Generated by: AYUSH Hospital Management System`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.replace('.xlsx', '.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadCSV = (reportData, filename) => {
    const csvData = [
      ['AYUSH HEALTHCARE HOSPITAL - OPD DATA EXPORT'],
      ['Generated', new Date().toLocaleString()],
      ['Period', `${dateFrom} to ${dateTo}`],
      [''],
      ['Department', 'Patients', 'Revenue', 'Efficiency', 'Follow-ups'],
      ...currentData.departmentStats.map(dept => [
        dept.name,
        dept.patients,
        dept.revenue,
        `${dept.efficiency}%`,
        Math.floor(dept.patients * 0.3)
      ]),
      [''],
      ['Total Patients', currentData.departmentStats.reduce((sum, dept) => sum + dept.patients, 0)],
      ['Total Revenue', currentData.departmentStats.reduce((sum, dept) => sum + dept.revenue, 0)],
      ['Average Efficiency', `${Math.round(currentData.departmentStats.reduce((sum, dept) => sum + dept.efficiency, 0) / currentData.departmentStats.length)}%`]
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.replace('.xlsx', '.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Generate mock data for reports
  const generateReportData = (reportType) => {
    return {
      type: reportType.title,
      totalVisits: '1,247',
      totalRevenue: '₹2,45,600',
      activeDepartments: '12',
      satisfaction: '94.5%',
      followUps: '47'
    };
  };

  // Export handler
  const handleExportReport = (format) => {
    if (!selectedReportType) {
      toast({
        title: "No Report Selected",
        description: "Please select a report type first.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const reportData = generateReportData(selectedReportType);
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${selectedReportType.title.replace(/\s+/g, '_')}_${timestamp}`;

    try {
      switch (format) {
        case 'pdf':
          downloadPDF(reportData, `${filename}.txt`);
          break;
        case 'excel':
          downloadExcel(reportData, `${filename}.xlsx`);
          break;
        case 'csv':
          downloadCSV(reportData, `${filename}.csv`);
          break;
        default:
          downloadPDF(reportData, `${filename}.txt`);
      }

      toast({
        title: "Report Generated Successfully",
        description: `${selectedReportType.title} has been downloaded as ${format.toUpperCase()}.`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error generating the report. Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  // Share functions
  const handleEmailShare = () => {
    if (!shareEmail) {
      toast({
        title: "Email Required",
        description: "Please enter an email address.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Simulate email sharing
    setTimeout(() => {
      toast({
        title: "Report Shared Successfully",
        description: `Report has been sent to ${shareEmail}`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      onShareClose();
      setShareEmail('');
      setShareMessage('');
    }, 1500);
  };

  const handleWhatsAppShare = () => {
    const message = encodeURIComponent(
      `OPD Report from AYUSH Healthcare Hospital\n\nReport: ${selectedReportType?.title}\nGenerated: ${new Date().toLocaleDateString()}\n\n${shareMessage || 'Please find the attached OPD report.'}`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
    
    toast({
      title: "WhatsApp Opened",
      description: "Share your report via WhatsApp",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleRefreshData = () => {
    // Force re-render by briefly clearing and resetting the active date range
    const currentRange = activeDateRange || 7;
    setActiveDateRange(null);
    
    setTimeout(() => {
      setActiveDateRange(currentRange);
      toast({
        title: "Data Refreshed",
        description: "All statistics and department data have been updated",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }, 100);
  };

  const handleGenerateAndDownload = () => {
    if (!selectedReportType) {
      toast({
        title: "No Report Selected",
        description: "Please select a report type first.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Simulate report generation
    toast({
      title: "Generating Report",
      description: "Please wait while we prepare your report...",
      status: "info",
      duration: 2000,
      isClosable: true,
    });

    setTimeout(() => {
      handleExportReport(reportFormat);
      onGenerateClose();
    }, 2000);
  };

  return (
    <Box p={6} bg="gray.50" minH="100vh">
      {/* Modern Header Section */}
      <Box
        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        color="white"
        p={6}
        borderRadius="xl"
        mb={6}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="blackAlpha.200"
          backdropFilter="blur(10px)"
        />
        <VStack spacing={4} position="relative" zIndex={1}>
          <HStack spacing={4} w="full" justify="space-between" align="center">
            <VStack align="start" spacing={2}>
              <Heading size="lg" fontWeight="bold">
                📊 OPD Reports & Analytics
              </Heading>
              <Text fontSize="md" opacity={0.9}>
                Comprehensive outpatient department reporting and insights
              </Text>
            </VStack>
            <HStack spacing={2}>
              <Menu placement="bottom-end" strategy="fixed">
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDown size={16} />}
                  colorScheme="whiteAlpha"
                  variant="outline"
                  size="sm"
                >
                  Export Reports
                </MenuButton>
                <MenuList color="gray.800" overflow="visible" zIndex={1500}>
                  <MenuItem icon={<Download size={16} />} onClick={() => handleExportReport('pdf')}>
                    Download as PDF
                  </MenuItem>
                  <MenuItem icon={<FileText size={16} />} onClick={() => handleExportReport('excel')}>
                    Export to Excel
                  </MenuItem>
                  <MenuItem icon={<BarChart3 size={16} />} onClick={() => handleExportReport('csv')}>
                    Export as CSV
                  </MenuItem>
                </MenuList>
              </Menu>
              <Tooltip label="Refresh Data">
                <IconButton
                  icon={<RefreshCw size={18} />}
                  colorScheme="whiteAlpha"
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshData}
                />
              </Tooltip>
            </HStack>
          </HStack>

          {/* Quick Date Range Buttons */}
          <HStack spacing={2} w="full" justify="center">
            <Button 
              size="sm" 
              variant={activeDateRange === 7 ? "solid" : "outline"} 
              colorScheme={activeDateRange === 7 ? "blue" : "whiteAlpha"}
              onClick={() => setQuickDateRange(7)}
              _hover={{ transform: 'translateY(-1px)', boxShadow: 'md' }}
              transition="all 0.2s"
            >
              Last 7 Days
            </Button>
            <Button 
              size="sm" 
              variant={activeDateRange === 30 ? "solid" : "outline"} 
              colorScheme={activeDateRange === 30 ? "blue" : "whiteAlpha"}
              onClick={() => setQuickDateRange(30)}
              _hover={{ transform: 'translateY(-1px)', boxShadow: 'md' }}
              transition="all 0.2s"
            >
              Last Month
            </Button>
            <Button 
              size="sm" 
              variant={activeDateRange === 90 ? "solid" : "outline"} 
              colorScheme={activeDateRange === 90 ? "blue" : "whiteAlpha"}
              onClick={() => setQuickDateRange(90)}
              _hover={{ transform: 'translateY(-1px)', boxShadow: 'md' }}
              transition="all 0.2s"
            >
              Last Quarter
            </Button>
            <Button 
              size="sm" 
              variant={activeDateRange === 365 ? "solid" : "outline"} 
              colorScheme={activeDateRange === 365 ? "blue" : "whiteAlpha"}
              onClick={() => setQuickDateRange(365)}
              _hover={{ transform: 'translateY(-1px)', boxShadow: 'md' }}
              transition="all 0.2s"
            >
              Last Year
            </Button>
          </HStack>
          
          {/* Current Date Range Display */}
          {(dateFrom && dateTo) && (
            <HStack justify="center" spacing={2}>
              <Badge colorScheme="blue" px={3} py={1} borderRadius="full">
                📅 {dateFrom} to {dateTo}
              </Badge>
              <Button
                size="xs"
                variant="ghost"
                colorScheme="whiteAlpha"
                onClick={() => {
                  setDateFrom('');
                  setDateTo('');
                  setActiveDateRange(null);
                }}
                _hover={{ bg: 'whiteAlpha.200' }}
              >
                Clear
              </Button>
            </HStack>
          )}
        </VStack>
      </Box>

      {/* Enhanced Statistics Dashboard */}
      <SimpleGrid 
        key={activeDateRange || 'default'} 
        columns={{ base: 1, md: 2, lg: 4 }} 
        spacing={6} 
        mb={8}
      >
        {currentData.quickStats.map((stat, index) => (
          <Card 
            key={index}
            bg="white"
            borderRadius="xl"
            boxShadow="lg"
            border="1px solid"
            borderColor="gray.100"
            transition="all 0.5s ease-in-out"
            _hover={{ 
              transform: 'translateY(-2px)', 
              boxShadow: 'xl',
              borderColor: `${stat.color}.200`
            }}
          >
            <CardBody p={6}>
              <Flex justify="space-between" align="start" mb={4}>
                <Box 
                  p={3} 
                  borderRadius="lg" 
                  bg={`${stat.color}.50`}
                >
                  <stat.icon color={`var(--chakra-colors-${stat.color}-500)`} size={24} />
                </Box>
                <Badge
                  colorScheme={stat.changeType === 'increase' ? 'green' : stat.changeType === 'decrease' ? 'red' : 'gray'}
                  borderRadius="full"
                  px={2}
                  py={1}
                  fontSize="xs"
                >
                  {stat.change}
                </Badge>
              </Flex>
              <Stat>
                <StatNumber fontSize="2xl" fontWeight="bold" color="gray.800">
                  {isDataLoading ? (
                    <HStack>
                      <Spinner size="sm" color="blue.500" />
                      <Text fontSize="lg">Loading...</Text>
                    </HStack>
                  ) : (
                    stat.value
                  )}
                </StatNumber>
                <StatLabel color="gray.600" fontSize="sm" mt={1}>
                  {stat.label}
                </StatLabel>
              </Stat>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      {/* Report Types Grid */}
      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6} mb={6}>
        {/* Report Categories */}
        <Card bg="white" borderRadius="xl" boxShadow="lg">
          <CardHeader>
            <Heading size="md" color="gray.800">
              📋 Available Reports
            </Heading>
            <Text color="gray.600" fontSize="sm">
              Generate comprehensive OPD reports and analytics
            </Text>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              {reportTypes.map((report, index) => (
                <Card
                  key={index}
                  borderRadius="lg"
                  border="2px solid"
                  borderColor={selectedReportType?.id === report.id ? `${report.color}.200` : 'gray.100'}
                  bg={selectedReportType?.id === report.id ? `${report.color}.50` : 'white'}
                  transition="all 0.3s"
                  cursor="pointer"
                  _hover={{ 
                    borderColor: `${report.color}.200`,
                    transform: 'translateY(-1px)',
                    boxShadow: 'md'
                  }}
                  onClick={() => setSelectedReportType(report)}
                >
                  <CardBody p={4}>
                    <VStack align="start" spacing={3}>
                      <HStack justify="space-between" w="full">
                        <Box p={2} borderRadius="md" bg={`${report.color}.100`}>
                          <report.icon color={`var(--chakra-colors-${report.color}-600)`} size={20} />
                        </Box>
                        <Badge colorScheme={report.color} borderRadius="full">
                          {currentData.reportCounts[report.id] || report.count}
                        </Badge>
                      </HStack>
                      <VStack align="start" spacing={1} w="full">
                        <Text fontWeight="semibold" fontSize="sm" color="gray.800">
                          {report.title}
                        </Text>
                        <Text fontSize="xs" color="gray.600" noOfLines={2}>
                          {report.description}
                        </Text>
                        <HStack justify="space-between" w="full" mt={2}>
                          <Badge size="sm" colorScheme="gray" borderRadius="md">
                            {report.category}
                          </Badge>
                          <Text fontSize="xs" color={`${report.color}.600`} fontWeight="medium">
                            {report.trend}
                          </Text>
                        </HStack>
                      </VStack>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>

            <Divider my={6} />

            {/* Action Buttons */}
            <HStack spacing={4} justify="center">
              <Button
                leftIcon={<FileText size={16} />}
                colorScheme="blue"
                size="md"
                onClick={onGenerateOpen}
                isDisabled={!selectedReportType}
              >
                Generate Report
              </Button>
              <Menu placement="bottom" strategy="fixed">
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDown size={16} />}
                  variant="outline"
                  colorScheme="blue"
                  size="md"
                  isDisabled={!selectedReportType}
                >
                  Actions
                </MenuButton>
                <MenuList overflow="visible" zIndex={1500}>
                  <MenuItem icon={<Eye size={16} />} onClick={onPreviewOpen}>
                    Preview Report
                  </MenuItem>
                  <MenuItem icon={<Calendar size={16} />} onClick={onScheduleOpen}>
                    Schedule Report
                  </MenuItem>
                  <MenuItem icon={<Settings size={16} />} onClick={onConfigureOpen}>
                    Configure Settings
                  </MenuItem>
                  <MenuItem icon={<Share2 size={16} />} onClick={onShareOpen}>
                    Share Report
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </CardBody>
        </Card>

        {/* Department Performance */}
        <Card bg="white" borderRadius="xl" boxShadow="lg">
          <CardHeader>
            <HStack justify="space-between">
              <VStack align="start" spacing={1}>
                <Heading size="md" color="gray.800">
                  🏥 Department Performance
                </Heading>
                <Text color="gray.600" fontSize="sm">
                  Today's department-wise statistics
                </Text>
              </VStack>
              <IconButton 
                icon={<BarChart3 size={16} />} 
                size="sm" 
                variant="ghost"
                colorScheme="blue"
              />
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack 
              key={activeDateRange || 'default'} 
              spacing={4} 
              align="stretch"
            >
              {currentData.departmentStats.slice(0, 6).map((dept, index) => (
                <Box key={index}>
                  <HStack justify="space-between" mb={2}>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" fontWeight="medium" color="gray.800">
                        {dept.name}
                      </Text>
                      <Text fontSize="xs" color="gray.600">
                        {dept.patients} patients • ₹{dept.revenue.toLocaleString()}
                      </Text>
                    </VStack>
                    <Badge
                      colorScheme={dept.efficiency >= 90 ? 'green' : dept.efficiency >= 85 ? 'yellow' : 'red'}
                      borderRadius="md"
                    >
                      {dept.efficiency}%
                    </Badge>
                  </HStack>
                  <Progress
                    value={dept.efficiency}
                    size="sm"
                    borderRadius="full"
                    bg="gray.100"
                    colorScheme={dept.efficiency >= 90 ? 'green' : dept.efficiency >= 85 ? 'yellow' : 'red'}
                  />
                </Box>
              ))}
            </VStack>

            <Divider my={4} />

            <SimpleGrid columns={2} spacing={4}>
              <VStack align="start" spacing={1}>
                <Text fontSize="xs" color="gray.600">Avg. Efficiency</Text>
                <Text fontSize="lg" fontWeight="bold" color="blue.600">
                  {Math.round(currentData.departmentStats.reduce((sum, dept) => sum + dept.efficiency, 0) / currentData.departmentStats.length)}%
                </Text>
              </VStack>
              <VStack align="start" spacing={1}>
                <Text fontSize="xs" color="gray.600">Active Depts</Text>
                <Text fontSize="lg" fontWeight="bold" color="green.600">
                  {currentData.departmentStats.length}/12
                </Text>
              </VStack>
            </SimpleGrid>
          </CardBody>
        </Card>
      </Grid>

      {/* Generate Report Modal */}
      <Modal isOpen={isGenerateOpen} onClose={onGenerateClose} size="xl">
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent borderRadius="xl" mx={4}>
          <ModalHeader>
            <VStack align="start" spacing={2}>
              <HStack>
                <FileText size={20} />
                <Text>Generate {selectedReportType?.title}</Text>
              </HStack>
              <Text fontSize="sm" color="gray.600" fontWeight="normal">
                {selectedReportType?.description}
              </Text>
            </VStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={5} align="stretch">
              {/* Date Range */}
              <SimpleGrid columns={2} spacing={4}>
                <FormControl>
                  <FormLabel fontSize="sm" color="gray.700">From Date</FormLabel>
                  <Input 
                    type="date" 
                    value={dateFrom}
                    onChange={(e) => {
                      setDateFrom(e.target.value);
                      setActiveDateRange(null); // Clear active range when manually changed
                    }}
                    borderRadius="md"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm" color="gray.700">To Date</FormLabel>
                  <Input 
                    type="date" 
                    value={dateTo}
                    onChange={(e) => {
                      setDateTo(e.target.value);
                      setActiveDateRange(null); // Clear active range when manually changed
                    }}
                    borderRadius="md"
                  />
                </FormControl>
              </SimpleGrid>

              {/* Filters */}
              <SimpleGrid columns={2} spacing={4}>
                <FormControl>
                  <FormLabel fontSize="sm" color="gray.700">Department</FormLabel>
                  <Select borderRadius="md">
                    <option value="all">All Departments</option>
                    <option value="general">General Medicine</option>
                    <option value="panchakarma">Panchakarma</option>
                    <option value="gynecology">Ayurvedic Gynecology</option>
                    <option value="pediatrics">Ayurvedic Pediatrics</option>
                    <option value="dermatology">Ayurvedic Dermatology</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm" color="gray.700">Doctor</FormLabel>
                  <Select borderRadius="md">
                    <option value="all">All Doctors</option>
                    <option value="dr-priya">Dr. Priya Sharma</option>
                    <option value="dr-anjali">Dr. Anjali Nair</option>
                    <option value="dr-arjun">Dr. Arjun Kumar</option>
                    <option value="dr-meera">Dr. Meera Patel</option>
                  </Select>
                </FormControl>
              </SimpleGrid>

              {/* Report Format */}
              <FormControl>
                <FormLabel fontSize="sm" color="gray.700">Report Format</FormLabel>
                <Select 
                  value={reportFormat}
                  onChange={(e) => setReportFormat(e.target.value)}
                  borderRadius="md"
                >
                  <option value="pdf">📄 PDF Report (Recommended)</option>
                  <option value="excel">📊 Excel Spreadsheet</option>
                  <option value="csv">📈 CSV Data File</option>
                </Select>
              </FormControl>

              {/* Include Options */}
              <FormControl>
                <FormLabel fontSize="sm" color="gray.700" mb={3}>Include in Report</FormLabel>
                <SimpleGrid columns={2} spacing={3}>
                  <Checkbox defaultChecked colorScheme="blue">Patient Demographics</Checkbox>
                  <Checkbox defaultChecked colorScheme="blue">Treatment History</Checkbox>
                  <Checkbox defaultChecked colorScheme="blue">Billing Information</Checkbox>
                  <Checkbox colorScheme="blue">Doctor Notes</Checkbox>
                  <Checkbox colorScheme="blue">Prescription Details</Checkbox>
                  <Checkbox colorScheme="blue">Follow-up Schedule</Checkbox>
                </SimpleGrid>
              </FormControl>

              {/* Additional Notes */}
              <FormControl>
                <FormLabel fontSize="sm" color="gray.700">Additional Notes</FormLabel>
                <Textarea 
                  placeholder="Any specific requirements or notes for this report..."
                  rows={3}
                  borderRadius="md"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          
          <ModalFooter>
            <HStack spacing={3}>
              <Button variant="ghost" onClick={onGenerateClose}>
                Cancel
              </Button>
              <Button 
                colorScheme="blue" 
                leftIcon={<Download size={16} />}
                onClick={handleGenerateAndDownload}
              >
                Generate & Download
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Preview Modal */}
      <Modal isOpen={isPreviewOpen} onClose={onPreviewClose} size="xl">
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent borderRadius="xl" mx={4}>
          <ModalHeader>
            <HStack>
              <Eye size={20} />
              <Text>Report Preview</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Card bg="gray.50" borderRadius="lg">
                <CardBody p={4}>
                  <Text fontSize="sm" fontFamily="mono" whiteSpace="pre-line">
                    {`AYUSH HEALTHCARE HOSPITAL
OPD REPORT PREVIEW

Report Type: ${selectedReportType?.title || 'OPD Report'}
Generated: ${new Date().toLocaleDateString()}
Department: All Departments

SUMMARY STATISTICS:
• Total Visits: 1,247
• Revenue: ₹2,45,600
• Active Departments: 12
• Patient Satisfaction: 94.5%

TOP DEPARTMENTS:
1. General Medicine - 45 patients
2. Panchakarma - 32 patients  
3. Ayurvedic Gynecology - 28 patients

This is a preview. The actual report will contain detailed patient data and analytics.`}
                  </Text>
                </CardBody>
              </Card>
              <HStack justify="space-between">
                <Button leftIcon={<Share2 size={16} />} variant="outline" onClick={onShareOpen}>
                  Share Report
                </Button>
                <Button leftIcon={<Download size={16} />} colorScheme="blue" onClick={handleGenerateAndDownload}>
                  Download Full Report
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Share Modal */}
      <Modal isOpen={isShareOpen} onClose={onShareClose} size="md">
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent borderRadius="xl" mx={4}>
          <ModalHeader>
            <HStack>
              <Share2 size={20} />
              <Text>Share Report</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Email Address</FormLabel>
                <Input
                  type="email"
                  placeholder="colleague@hospital.com"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Message (Optional)</FormLabel>
                <Textarea
                  placeholder="Add a message with the report..."
                  value={shareMessage}
                  onChange={(e) => setShareMessage(e.target.value)}
                  rows={3}
                />
              </FormControl>
              <HStack spacing={3}>
                <Button
                  leftIcon={<Mail size={16} />}
                  colorScheme="blue"
                  flex={1}
                  onClick={handleEmailShare}
                >
                  Send Email
                </Button>
                <Button
                  leftIcon={<MessageCircle size={16} />}
                  colorScheme="green"
                  flex={1}
                  onClick={handleWhatsAppShare}
                >
                  WhatsApp
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Schedule Modal */}
      <Modal isOpen={isScheduleOpen} onClose={onScheduleClose} size="lg">
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent borderRadius="xl" mx={4}>
          <ModalHeader>
            <HStack>
              <Calendar size={20} />
              <Text>Schedule Report</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text fontSize="sm" color="gray.600">
                Schedule automatic generation of {selectedReportType?.title}
              </Text>
              <SimpleGrid columns={2} spacing={4}>
                <FormControl>
                  <FormLabel>Frequency</FormLabel>
                  <Select>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Time</FormLabel>
                  <Input type="time" defaultValue="09:00" />
                </FormControl>
              </SimpleGrid>
              <FormControl>
                <FormLabel>Recipients</FormLabel>
                <Input placeholder="admin@hospital.com, doctor@hospital.com" />
              </FormControl>
              <Button colorScheme="blue" leftIcon={<Calendar size={16} />}>
                Schedule Report
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Configure Modal */}
      <Modal isOpen={isConfigureOpen} onClose={onConfigureClose} size="lg">
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent borderRadius="xl" mx={4}>
          <ModalHeader>
            <HStack>
              <Settings size={20} />
              <Text>Report Configuration</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text fontSize="sm" color="gray.600">
                Configure default settings for {selectedReportType?.title}
              </Text>
              <SimpleGrid columns={2} spacing={4}>
                <FormControl>
                  <FormLabel>Default Format</FormLabel>
                  <Select defaultValue="pdf">
                    <option value="pdf">PDF Report</option>
                    <option value="excel">Excel Spreadsheet</option>
                    <option value="csv">CSV Data</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Data Retention</FormLabel>
                  <Select defaultValue="1year">
                    <option value="6months">6 Months</option>
                    <option value="1year">1 Year</option>
                    <option value="2years">2 Years</option>
                    <option value="permanent">Permanent</option>
                  </Select>
                </FormControl>
              </SimpleGrid>
              <FormControl>
                <FormLabel>Report Template</FormLabel>
                <Select defaultValue="standard">
                  <option value="standard">Standard Template</option>
                  <option value="detailed">Detailed Template</option>
                  <option value="summary">Summary Template</option>
                  <option value="custom">Custom Template</option>
                </Select>
              </FormControl>
              <Button colorScheme="blue" leftIcon={<Settings size={16} />}>
                Save Configuration
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default OPDReports;
