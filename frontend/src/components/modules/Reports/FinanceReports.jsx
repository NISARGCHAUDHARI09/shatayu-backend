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
  DollarSign,
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
  Users,
  CreditCard,
  Wallet,
  Target,
  Zap,
  Award,
  Star,
  MoreVertical,
  Share2,
  Clock,
  Mail,
  MessageCircle
} from 'lucide-react';

const FinanceReports = ({ title = "Finance Reports" }) => {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [reportFormat, setReportFormat] = useState('pdf');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30);

  const { isOpen: isGenerateOpen, onOpen: onGenerateOpen, onClose: onGenerateClose } = useDisclosure();
  const { isOpen: isFilterOpen, onOpen: onFilterOpen, onClose: onFilterClose } = useDisclosure();
  const { isOpen: isPreviewOpen, onOpen: onPreviewOpen, onClose: onPreviewClose } = useDisclosure();
  const { isOpen: isScheduleOpen, onOpen: onScheduleOpen, onClose: onScheduleClose } = useDisclosure();
  const { isOpen: isConfigureOpen, onOpen: onConfigureOpen, onClose: onConfigureClose } = useDisclosure();
  const [selectedReportType, setSelectedReportType] = useState('');
  const [previewData, setPreviewData] = useState(null);
  const [scheduleSettings, setScheduleSettings] = useState({
    frequency: 'weekly',
    dayOfWeek: 'monday',
    time: '09:00',
    email: '',
    format: 'pdf'
  });
  const toast = useToast();
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const gradientBg = useColorModeValue(
    'linear(to-r, blue.50, purple.50)',
    'linear(to-r, blue.900, purple.900)'
  );
  const headerBg = useColorModeValue(
    'linear(135deg, #667eea 0%, #764ba2 100%)',
    'linear(135deg, #2d3748 0%, #1a202c 100%)'
  );

  const reportTypes = [
    {
      id: 'all-transactions',
      title: 'All Transaction Report',
      description: 'Comprehensive report of all financial transactions including income and expenses',
      icon: FileText,
      color: 'blue',
      fields: ['Date Range', 'Transaction Type', 'Category', 'Payment Method']
    },
    {
      id: 'income-report',
      title: 'Income Report',
      description: 'Detailed analysis of all income sources and revenue streams',
      icon: TrendingUp,
      color: 'green',
      fields: ['Date Range', 'Income Category', 'Payment Method', 'Doctor/Department']
    },
    {
      id: 'income-group',
      title: 'Income Group Report',
      description: 'Income data grouped by categories, departments, or time periods',
      icon: BarChart3,
      color: 'green',
      fields: ['Date Range', 'Group By', 'Income Category', 'Chart Type']
    },
    {
      id: 'expense-report',
      title: 'Expense Report',
      description: 'Complete breakdown of all hospital expenses and expenditures',
      icon: TrendingDown,
      color: 'red',
      fields: ['Date Range', 'Expense Category', 'Vendor', 'Approval Status']
    },
    {
      id: 'expense-group',
      title: 'Expense Group Report',
      description: 'Expenses categorized and grouped for analysis and budgeting',
      icon: PieChart,
      color: 'red',
      fields: ['Date Range', 'Group By', 'Expense Category', 'Department']
    },
    {
      id: 'patient-bill',
      title: 'Patient Bill Report',
      description: 'Patient billing summary with payment status and outstanding amounts',
      icon: DollarSign,
      color: 'purple',
      fields: ['Date Range', 'Patient ID', 'Bill Status', 'Payment Status']
    }
  ];

  const quickStats = [
    { 
      label: 'Total Revenue', 
      value: '₹15,45,000', 
      change: '+12.5%', 
      trend: 'up',
      icon: TrendingUp,
      color: 'green',
      target: '₹18,00,000',
      progress: 85.8,
      description: 'Monthly revenue target'
    },
    { 
      label: 'Total Expenses', 
      value: '₹8,92,000', 
      change: '+5.2%', 
      trend: 'up',
      icon: TrendingDown,
      color: 'red',
      target: '₹9,50,000',
      progress: 93.9,
      description: 'Monthly budget utilization'
    },
    { 
      label: 'Net Profit', 
      value: '₹6,53,000', 
      change: '+18.3%', 
      trend: 'up',
      icon: Award,
      color: 'blue',
      target: '₹7,00,000',
      progress: 93.3,
      description: 'Profit margin growth'
    },
    { 
      label: 'Outstanding Bills', 
      value: '₹2,45,000', 
      change: '-8.1%', 
      trend: 'down',
      icon: Activity,
      color: 'orange',
      target: '₹2,00,000',
      progress: 81.6,
      description: 'Collection efficiency'
    },
    {
      label: 'Cash Flow',
      value: '₹4,23,000',
      change: '+15.7%',
      trend: 'up',
      icon: Wallet,
      color: 'purple',
      target: '₹5,00,000',
      progress: 84.6,
      description: 'Positive cash flow'
    },
    {
      label: 'Active Patients',
      value: '1,234',
      change: '+6.8%',
      trend: 'up',
      icon: Users,
      color: 'teal',
      target: '1,500',
      progress: 82.3,
      description: 'Patient base growth'
    }
  ];

  const recentTransactions = [
    {
      id: 'TXN001',
      date: '2025-09-15',
      description: 'OPD Consultation Fee',
      amount: '+₹5,000',
      type: 'income',
      category: 'Consultation',
      status: 'completed'
    },
    {
      id: 'TXN002',
      date: '2025-09-15',
      description: 'Medical Equipment Purchase',
      amount: '-₹45,000',
      type: 'expense',
      category: 'Equipment',
      status: 'pending'
    },
    {
      id: 'TXN003',
      date: '2025-09-14',
      description: 'Pharmacy Sales',
      amount: '+₹12,500',
      type: 'income',
      category: 'Pharmacy',
      status: 'completed'
    },
    {
      id: 'TXN004',
      date: '2025-09-14',
      description: 'Staff Salary Payment',
      amount: '-₹85,000',
      type: 'expense',
      category: 'Payroll',
      status: 'completed'
    }
  ];

  // Enhanced report types with better categorization
  const reportCategories = [
    {
      id: 'revenue-analysis',
      title: 'Revenue Analysis',
      color: 'green',
      icon: TrendingUp,
      reports: [
        {
          id: 'income-report',
          title: 'Income Report',
          description: 'Detailed analysis of all income sources and revenue streams',
          icon: DollarSign,
          fields: ['Date Range', 'Income Category', 'Payment Method', 'Doctor/Department'],
          estimatedTime: '2-3 minutes',
          popularity: 95
        },
        {
          id: 'income-group',
          title: 'Income Group Report',
          description: 'Income data grouped by categories, departments, or time periods',
          icon: BarChart3,
          fields: ['Date Range', 'Group By', 'Income Category', 'Chart Type'],
          estimatedTime: '3-5 minutes',
          popularity: 88
        }
      ]
    },
    {
      id: 'expense-management',
      title: 'Expense Management',
      color: 'red',
      icon: TrendingDown,
      reports: [
        {
          id: 'expense-report',
          title: 'Expense Report',
          description: 'Complete breakdown of all hospital expenses and expenditures',
          icon: CreditCard,
          fields: ['Date Range', 'Expense Category', 'Vendor', 'Approval Status'],
          estimatedTime: '2-4 minutes',
          popularity: 92
        },
        {
          id: 'expense-group',
          title: 'Expense Group Report',
          description: 'Expenses categorized and grouped for analysis and budgeting',
          icon: PieChart,
          fields: ['Date Range', 'Group By', 'Expense Category', 'Department'],
          estimatedTime: '3-6 minutes',
          popularity: 85
        }
      ]
    },
    {
      id: 'comprehensive-reports',
      title: 'Comprehensive Reports',
      color: 'blue',
      icon: BarChart3,
      reports: [
        {
          id: 'all-transactions',
          title: 'All Transaction Report',
          description: 'Comprehensive report of all financial transactions including income and expenses',
          icon: FileText,
          fields: ['Date Range', 'Transaction Type', 'Category', 'Payment Method'],
          estimatedTime: '5-8 minutes',
          popularity: 98
        },
        {
          id: 'patient-bill',
          title: 'Patient Bill Report',
          description: 'Patient billing summary with payment status and outstanding amounts',
          icon: Users,
          fields: ['Date Range', 'Patient ID', 'Bill Status', 'Payment Status'],
          estimatedTime: '3-5 minutes',
          popularity: 90
        }
      ]
    }
  ];

  const handleGenerateReport = (reportType) => {
    setSelectedReportType(reportType);
    onGenerateOpen();
  };

  const handleQuickGenerate = async (reportType) => {
    setIsGenerating(true);
    toast({
      title: 'Generating Report',
      description: `Processing ${reportType.title}...`,
      status: 'info',
      duration: 2000,
      isClosable: true,
    });

    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: 'Report Generated',
        description: `${reportType.title} has been generated successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }, 3000);
  };

  const handleExportReport = (format) => {
    toast({
      title: `Exporting Report`,
      description: `Generating ${format.toUpperCase()} report...`,
      status: 'info',
      duration: 2000,
      isClosable: true,
    });

    // Simulate export process
    setTimeout(() => {
      toast({
        title: `${format.toUpperCase()} Downloaded`,
        description: `Finance report has been exported as ${format.toUpperCase()}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }, 2000);
  };

  const handleShareReport = () => {
    toast({
      title: 'Share Report',
      description: 'Report sharing link has been generated',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleEmailShare = (reportData) => {
    const subject = `Finance Report - ${reportData?.title || 'Report'}`;
    const body = `Please find the finance report attached:\n\nReport: ${reportData?.title}\nGenerated: ${new Date().toLocaleDateString()}\n\nBest regards`;
    
    // Create mailto link
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
    const message = `📊 *Finance Report - ${reportData?.title || 'Report'}*\n\nGenerated: ${new Date().toLocaleDateString()}\n\nReport summary and details have been prepared. Please check your dashboard for the complete report.\n\n#FinanceReport #Dashboard`;
    
    // Create WhatsApp share link
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

  const handleCopyLink = (reportData) => {
    const shareUrl = `${window.location.origin}/reports/finance/${reportData?.id || 'preview'}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        toast({
          title: 'Link Copied',
          description: 'Report sharing link copied to clipboard',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        toast({
          title: 'Link Copied',
          description: 'Report sharing link copied to clipboard',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      });
    }
  };

  const handlePrintReport = () => {
    toast({
      title: 'Print Report',
      description: 'Opening print preview...',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
    
    // Simulate print
    setTimeout(() => {
      window.print();
    }, 1000);
  };

  const handleRefreshData = () => {
    toast({
      title: 'Refreshing Data',
      description: 'Financial data is being updated...',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const handlePreviewSample = (report) => {
    setSelectedReportType(report);
    // Generate mock preview data
    const mockData = {
      reportTitle: report.title,
      generatedDate: new Date().toLocaleDateString(),
      totalRecords: Math.floor(Math.random() * 1000) + 100,
      summary: {
        totalRevenue: `₹${(Math.random() * 1000000 + 100000).toLocaleString('en-IN')}`,
        totalExpenses: `₹${(Math.random() * 500000 + 50000).toLocaleString('en-IN')}`,
        netProfit: `₹${(Math.random() * 200000 + 20000).toLocaleString('en-IN')}`,
        transactions: Math.floor(Math.random() * 500) + 50
      },
      sampleData: [
        { date: '2025-09-15', description: 'OPD Consultation', amount: '₹2,500', type: 'Income' },
        { date: '2025-09-14', description: 'Medical Supplies', amount: '₹15,000', type: 'Expense' },
        { date: '2025-09-13', description: 'Pharmacy Sales', amount: '₹8,750', type: 'Income' },
        { date: '2025-09-12', description: 'Equipment Maintenance', amount: '₹5,200', type: 'Expense' }
      ]
    };
    setPreviewData(mockData);
    onPreviewOpen();
  };

  const handleScheduleReport = (report) => {
    setSelectedReportType(report);
    onScheduleOpen();
  };

  const handleConfigureReport = (report) => {
    setSelectedReportType(report);
    onConfigureOpen();
  };

  const handlePreviewReport = (report) => {
    setSelectedReportType(report);
    // Generate different preview data for main preview
    const mockData = {
      reportTitle: report.title,
      generatedDate: new Date().toLocaleDateString(),
      totalRecords: Math.floor(Math.random() * 1000) + 100,
      summary: {
        totalRevenue: `₹${(Math.random() * 1000000 + 100000).toLocaleString('en-IN')}`,
        totalExpenses: `₹${(Math.random() * 500000 + 50000).toLocaleString('en-IN')}`,
        netProfit: `₹${(Math.random() * 200000 + 20000).toLocaleString('en-IN')}`,
        transactions: Math.floor(Math.random() * 500) + 50
      },
      chartData: [
        { month: 'Jan', income: 450000, expense: 280000 },
        { month: 'Feb', income: 520000, expense: 310000 },
        { month: 'Mar', income: 480000, expense: 295000 },
        { month: 'Apr', income: 600000, expense: 340000 }
      ]
    };
    setPreviewData(mockData);
    onPreviewOpen();
  };

  const handleSaveSchedule = () => {
    toast({
      title: 'Schedule Saved',
      description: `${selectedReportType.title} scheduled successfully for ${scheduleSettings.frequency} delivery`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    onScheduleClose();
  };

  const getIconComponent = (IconComponent, color, size = 20) => {
    return <IconComponent size={size} color={color} />;
  };

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        handleRefreshData();
      }, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  return (
    <Container maxW="full" p={0}>
      <Box bg={gradientBg} minH="100vh">
        {/* Enhanced Header */}
        <Box
          bgGradient={headerBg}
          color="white"
          p={8}
          borderRadius={{ base: 'none', md: 'xl' }}
          mb={6}
          position="relative"
          overflow="visible"
          zIndex={1}
          isolation="isolate"
        >
          <Box 
            position="absolute" 
            top={0} 
            right={0} 
            opacity={0.08}
            zIndex={0}
            pointerEvents="none"
            overflow="hidden"
          >
            <BarChart3 size={180} />
          </Box>
          
          <Flex 
            justify="space-between" 
            align="center" 
            position="relative" 
            zIndex={1}
          >
            <VStack align="start" spacing={2}>
              <Heading size="xl" fontWeight="800">
                {title}
              </Heading>
              <Text fontSize="lg" opacity={0.9}>
                Advanced Financial Analytics & Reporting Dashboard
              </Text>
              <HStack spacing={4} mt={2}>
                <Badge colorScheme="whiteAlpha" size="lg" px={3} py={1}>
                  <HStack spacing={1}>
                    <Activity size={14} />
                    <Text>Real-time Data</Text>
                  </HStack>
                </Badge>
                <Badge colorScheme="whiteAlpha" size="lg" px={3} py={1}>
                  <HStack spacing={1}>
                    <Target size={14} />
                    <Text>AI-Powered Insights</Text>
                  </HStack>
                </Badge>
              </HStack>
            </VStack>
            
            <VStack spacing={3} align="end" minW="280px">
              <HStack spacing={3} wrap="wrap" justify="end">
                <Tooltip label="Advanced Filters" hasArrow>
                  <IconButton
                    icon={<Filter />}
                    variant="outline"
                    colorScheme="whiteAlpha"
                    onClick={onFilterOpen}
                    size="lg"
                    _hover={{ bg: 'whiteAlpha.200' }}
                    _active={{ bg: 'whiteAlpha.300' }}
                  />
                </Tooltip>
                <Tooltip label="Refresh Data" hasArrow>
                  <IconButton
                    icon={<RefreshCw />}
                    variant="outline"
                    colorScheme="whiteAlpha"
                    onClick={handleRefreshData}
                    size="lg"
                    isLoading={isGenerating}
                    _hover={{ bg: 'whiteAlpha.200' }}
                    _active={{ bg: 'whiteAlpha.300' }}
                  />
                </Tooltip>
                <Menu placement="bottom-end" strategy="fixed">
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDown />}
                    variant="outline"
                    colorScheme="whiteAlpha"
                    size="lg"
                    _hover={{ bg: 'whiteAlpha.200' }}
                    _active={{ bg: 'whiteAlpha.300' }}
                    transition="all 0.2s ease"
                  >
                    Export
                  </MenuButton>
                  <MenuList 
                    color="gray.800"
                    bg="white"
                    zIndex={9999}
                    borderRadius="xl"
                    shadow="2xl"
                    border="1px"
                    borderColor="gray.200"
                    minW="200px"
                    p={2}
                    mt={2}
                  >
                    <MenuItem 
                      icon={<Download size={18} />}
                      onClick={() => handleExportReport('pdf')}
                      _hover={{ bg: 'red.50', color: 'red.600' }}
                      _focus={{ bg: 'red.50', color: 'red.600' }}
                      borderRadius="lg"
                      py={3}
                      px={4}
                      fontWeight="medium"
                      fontSize="sm"
                    >
                      Download PDF
                    </MenuItem>
                    <MenuItem 
                      icon={<FileText size={18} />}
                      onClick={() => handleExportReport('excel')}
                      _hover={{ bg: 'green.50', color: 'green.600' }}
                      _focus={{ bg: 'green.50', color: 'green.600' }}
                      borderRadius="lg"
                      py={3}
                      px={4}
                      fontWeight="medium"
                      fontSize="sm"
                    >
                      Download Excel
                    </MenuItem>
                    <MenuItem 
                      icon={<FileText size={18} />}
                      onClick={() => handleExportReport('csv')}
                      _hover={{ bg: 'blue.50', color: 'blue.600' }}
                      _focus={{ bg: 'blue.50', color: 'blue.600' }}
                      borderRadius="lg"
                      py={3}
                      px={4}
                      fontWeight="medium"
                      fontSize="sm"
                    >
                      Download CSV
                    </MenuItem>
                    <Box height="1px" bg="gray.200" my={2} />
                    <MenuItem 
                      icon={<Share size={18} />}
                      onClick={handleShareReport}
                      _hover={{ bg: 'purple.50', color: 'purple.600' }}
                      _focus={{ bg: 'purple.50', color: 'purple.600' }}
                      borderRadius="lg"
                      py={3}
                      px={4}
                      fontWeight="medium"
                      fontSize="sm"
                    >
                      Share Report
                    </MenuItem>
                    <MenuItem 
                      icon={<Printer size={18} />}
                      onClick={handlePrintReport}
                      _hover={{ bg: 'orange.50', color: 'orange.600' }}
                      _focus={{ bg: 'orange.50', color: 'orange.600' }}
                      borderRadius="lg"
                      py={3}
                      px={4}
                      fontWeight="medium"
                      fontSize="sm"
                    >
                      Print Report
                    </MenuItem>
                  </MenuList>
                </Menu>
              </HStack>
              
              <HStack 
                spacing={2} 
                opacity={0.8}
                bg="whiteAlpha.200"
                px={3}
                py={2}
                borderRadius="lg"
                backdropFilter="blur(10px)"
              >
                <Switch
                  isChecked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  colorScheme="whiteAlpha"
                  size="sm"
                />
                <Text fontSize="sm" fontWeight="medium">Auto-refresh</Text>
              </HStack>
            </VStack>
          </Flex>
        </Box>

        <Box px={6} pb={6}>
          {/* Enhanced Quick Stats */}
          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)', xl: 'repeat(6, 1fr)' }} gap={6} mb={8}>
            {quickStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card
                  key={index}
                  bg={cardBg}
                  borderRadius="2xl"
                  overflow="hidden"
                  position="relative"
                  _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }}
                  transition="all 0.3s ease"
                  border="1px"
                  borderColor={`${stat.color}.100`}
                >
                  <CardBody p={6}>
                    <VStack align="stretch" spacing={4}>
                      <HStack justify="space-between">
                        <Box
                          p={3}
                          bg={`${stat.color}.100`}
                          borderRadius="xl"
                          display="inline-block"
                        >
                          <IconComponent size={24} color={`var(--chakra-colors-${stat.color}-600)`} />
                        </Box>
                        <Badge
                          colorScheme={stat.trend === 'up' ? 'green' : 'red'}
                          variant="subtle"
                          borderRadius="full"
                          px={3}
                          py={1}
                        >
                          <HStack spacing={1}>
                            {stat.trend === 'up' ? 
                              <TrendingUp size={12} /> : 
                              <TrendingDown size={12} />
                            }
                            <Text fontSize="xs">{stat.change}</Text>
                          </HStack>
                        </Badge>
                      </HStack>
                      
                      <VStack align="start" spacing={2}>
                        <Text fontSize="sm" color="gray.600" fontWeight="medium">
                          {stat.label}
                        </Text>
                        <Text fontSize="2xl" fontWeight="bold" color={`${stat.color}.600`}>
                          {stat.value}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          Target: {stat.target}
                        </Text>
                      </VStack>
                      
                      <Progress
                        value={stat.progress}
                        colorScheme={stat.color}
                        size="sm"
                        borderRadius="full"
                        bg={`${stat.color}.50`}
                      />
                      
                      <Text fontSize="xs" color="gray.500">
                        {stat.description}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              );
            })}
          </Grid>

          {/* Enhanced Report Categories with Tabs */}
          <Tabs variant="soft-rounded" colorScheme="blue" mb={8}>
            <TabList mb={6} bg="white" p={2} borderRadius="xl" shadow="sm">
              {reportCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Tab
                    key={category.id}
                    _selected={{ 
                      bg: `${category.color}.500`, 
                      color: 'white' 
                    }}
                    borderRadius="lg"
                    fontWeight="semibold"
                    px={6}
                    py={3}
                  >
                    <HStack spacing={2}>
                      <IconComponent size={18} />
                      <Text>{category.title}</Text>
                    </HStack>
                  </Tab>
                );
              })}
            </TabList>

            <TabPanels>
              {reportCategories.map((category) => (
                <TabPanel key={category.id} p={0}>
                  <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                    {category.reports.map((report) => {
                      const IconComponent = report.icon;
                      return (
                        <Card
                          key={report.id}
                          bg={cardBg}
                          borderRadius="2xl"
                          overflow="hidden"
                          _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                          transition="all 0.3s ease"
                          border="1px"
                          borderColor={borderColor}
                        >
                          <CardHeader pb={3}>
                            <HStack justify="space-between">
                              <HStack spacing={3}>
                                <Box
                                  p={3}
                                  bg={`${category.color}.100`}
                                  borderRadius="xl"
                                >
                                  <IconComponent size={24} color={`var(--chakra-colors-${category.color}-600)`} />
                                </Box>
                                <VStack align="start" spacing={1}>
                                  <Text fontWeight="bold" fontSize="lg">
                                    {report.title}
                                  </Text>
                                  <Badge 
                                    colorScheme={category.color} 
                                    variant="subtle" 
                                    size="sm"
                                    borderRadius="full"
                                  >
                                    <HStack spacing={1}>
                                      <Star size={10} />
                                      <Text>{report.popularity}% Popular</Text>
                                    </HStack>
                                  </Badge>
                                </VStack>
                              </HStack>
                              <Menu>
                                <MenuButton
                                  as={IconButton}
                                  icon={<MoreVertical />}
                                  variant="ghost"
                                  size="sm"
                                />
                                <MenuList>
                                  <MenuItem 
                                    icon={<Eye />}
                                    onClick={() => handlePreviewSample(report)}
                                  >
                                    Preview Sample
                                  </MenuItem>
                                  <MenuItem 
                                    icon={<Calendar />}
                                    onClick={() => handleScheduleReport(report)}
                                  >
                                    Schedule
                                  </MenuItem>
                                  <MenuItem 
                                    icon={<Settings />}
                                    onClick={() => handleConfigureReport(report)}
                                  >
                                    Configure
                                  </MenuItem>
                                </MenuList>
                              </Menu>
                            </HStack>
                          </CardHeader>
                          
                          <CardBody pt={0}>
                            <VStack align="stretch" spacing={4}>
                              <Text fontSize="sm" color="gray.600" lineHeight="tall">
                                {report.description}
                              </Text>
                              
                              <Box>
                                <Text fontSize="xs" fontWeight="bold" color="gray.700" mb={2}>
                                  Available Fields:
                                </Text>
                                <HStack wrap="wrap" spacing={1}>
                                  {report.fields.slice(0, 3).map((field, index) => (
                                    <Badge 
                                      key={index} 
                                      size="sm" 
                                      variant="outline" 
                                      colorScheme="gray"
                                      borderRadius="full"
                                    >
                                      {field}
                                    </Badge>
                                  ))}
                                  {report.fields.length > 3 && (
                                    <Badge 
                                      size="sm" 
                                      variant="outline" 
                                      colorScheme="blue"
                                      borderRadius="full"
                                    >
                                      +{report.fields.length - 3} more
                                    </Badge>
                                  )}
                                </HStack>
                              </Box>
                              
                              <HStack justify="space-between" color="gray.500" fontSize="xs">
                                <HStack spacing={1}>
                                  <Activity size={12} />
                                  <Text>Est. time: {report.estimatedTime}</Text>
                                </HStack>
                                <HStack spacing={1}>
                                  <Zap size={12} />
                                  <Text>Quick Generate</Text>
                                </HStack>
                              </HStack>
                              
                              <HStack spacing={2}>
                                <Button 
                                  size="sm" 
                                  colorScheme={category.color}
                                  leftIcon={<BarChart3 />}
                                  onClick={() => handleGenerateReport(report)}
                                  flex={1}
                                  borderRadius="lg"
                                >
                                  Configure & Generate
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  leftIcon={<Zap />}
                                  onClick={() => handleQuickGenerate(report)}
                                  borderRadius="lg"
                                  isLoading={isGenerating}
                                >
                                  Quick
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  leftIcon={<Eye />}
                                  onClick={() => handlePreviewReport(report)}
                                  borderRadius="lg"
                                >
                                  Preview
                                </Button>
                              </HStack>
                            </VStack>
                          </CardBody>
                        </Card>
                      );
                    })}
                  </SimpleGrid>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>

          {/* Recent Transactions Card */}
          <Card bg={cardBg} borderRadius="2xl" border="1px" borderColor={borderColor}>
            <CardHeader>
              <HStack justify="space-between">
                <VStack align="start" spacing={1}>
                  <Text fontSize="xl" fontWeight="bold">
                    Recent Transactions
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Latest financial activities
                  </Text>
                </VStack>
                <Button leftIcon={<Eye />} variant="outline" size="sm">
                  View All
                </Button>
              </HStack>
            </CardHeader>
            
            <CardBody pt={0}>
              <VStack spacing={3} align="stretch">
                {recentTransactions.map((transaction, index) => (
                  <HStack
                    key={transaction.id}
                    p={4}
                    bg={useColorModeValue('gray.50', 'gray.700')}
                    borderRadius="lg"
                    justify="space-between"
                  >
                    <HStack spacing={3}>
                      <Box
                        p={2}
                        bg={transaction.type === 'income' ? 'green.100' : 'red.100'}
                        borderRadius="lg"
                      >
                        {transaction.type === 'income' ? 
                          <TrendingUp size={16} color="green" /> :
                          <TrendingDown size={16} color="red" />
                        }
                      </Box>
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="semibold" fontSize="sm">
                          {transaction.description}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {transaction.date} • {transaction.category}
                        </Text>
                      </VStack>
                    </HStack>
                    <VStack align="end" spacing={0}>
                      <Text 
                        fontWeight="bold" 
                        color={transaction.type === 'income' ? 'green.600' : 'red.600'}
                      >
                        {transaction.amount}
                      </Text>
                      <Badge 
                        size="sm" 
                        colorScheme={transaction.status === 'completed' ? 'green' : 'yellow'}
                        borderRadius="full"
                      >
                        {transaction.status}
                      </Badge>
                    </VStack>
                  </HStack>
                ))}
              </VStack>
            </CardBody>
          </Card>
        </Box>
      </Box>

      {/* Generate Report Modal - Enhanced */}
      <Modal isOpen={isGenerateOpen} onClose={onGenerateClose} size="xl">
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent borderRadius="2xl">
          <ModalHeader>
            <VStack align="start" spacing={2}>
              <HStack>
                <Box
                  p={2}
                  bg="blue.100"
                  borderRadius="lg"
                >
                  <BarChart3 size={20} color="blue" />
                </Box>
                <Text>Generate {selectedReportType?.title}</Text>
              </HStack>
              <Text fontSize="sm" color="gray.600" fontWeight="normal">
                {selectedReportType?.description}
              </Text>
            </VStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={6} align="stretch">
              <Card variant="outline" bg="blue.50">
                <CardBody>
                  <HStack spacing={3}>
                    <Activity size={20} color="blue" />
                    <VStack align="start" spacing={1}>
                      <Text fontSize="sm" fontWeight="semibold">
                        Estimated Generation Time
                      </Text>
                      <Text fontSize="xs" color="gray.600">
                        {selectedReportType?.estimatedTime || '2-5 minutes'}
                      </Text>
                    </VStack>
                  </HStack>
                </CardBody>
              </Card>

              <SimpleGrid columns={2} spacing={4}>
                <FormControl>
                  <FormLabel fontWeight="semibold">From Date</FormLabel>
                  <Input 
                    type="date" 
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    borderRadius="lg"
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel fontWeight="semibold">To Date</FormLabel>
                  <Input 
                    type="date" 
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    borderRadius="lg"
                  />
                </FormControl>
              </SimpleGrid>
              
              <FormControl>
                <FormLabel fontWeight="semibold">Report Format</FormLabel>
                <Select 
                  value={reportFormat}
                  onChange={(e) => setReportFormat(e.target.value)}
                  borderRadius="lg"
                >
                  <option value="pdf">PDF Document</option>
                  <option value="excel">Excel Spreadsheet</option>
                  <option value="csv">CSV File</option>
                </Select>
              </FormControl>

              {/* Dynamic fields based on report type */}
              {selectedReportType?.id === 'all-transactions' && (
                <SimpleGrid columns={2} spacing={4}>
                  <FormControl>
                    <FormLabel fontWeight="semibold">Transaction Type</FormLabel>
                    <Select placeholder="Select transaction type" borderRadius="lg">
                      <option value="all">All Transactions</option>
                      <option value="income">Income Only</option>
                      <option value="expense">Expense Only</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel fontWeight="semibold">Category</FormLabel>
                    <Select placeholder="Select category" borderRadius="lg">
                      <option value="all">All Categories</option>
                      <option value="consultation">Consultation</option>
                      <option value="pharmacy">Pharmacy</option>
                      <option value="treatment">Treatment</option>
                      <option value="equipment">Equipment</option>
                    </Select>
                  </FormControl>
                </SimpleGrid>
              )}
            </VStack>
          </ModalBody>
          
          <ModalFooter>
            <HStack spacing={3}>
              <Button variant="outline" onClick={onGenerateClose} borderRadius="lg">
                Cancel
              </Button>
              <Button 
                colorScheme="blue" 
                leftIcon={<Download />}
                borderRadius="lg"
                onClick={() => {
                  handleQuickGenerate(selectedReportType);
                  onGenerateClose();
                }}
              >
                Generate Report
              </Button>
              <Button 
                colorScheme="gray" 
                leftIcon={<Printer />}
                borderRadius="lg"
              >
                Print Preview
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Advanced Filters Modal */}
      <Modal isOpen={isFilterOpen} onClose={onFilterClose} size="lg">
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
                <FormLabel>Search Reports</FormLabel>
                <Input
                  placeholder="Search by report name or category..."
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
                  <option value="revenue-analysis">Revenue Analysis</option>
                  <option value="expense-management">Expense Management</option>
                  <option value="comprehensive-reports">Comprehensive Reports</option>
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
                {autoRefresh && (
                  <Select
                    value={refreshInterval}
                    onChange={(e) => setRefreshInterval(Number(e.target.value))}
                    size="sm"
                    mt={2}
                  >
                    <option value={30}>Every 30 seconds</option>
                    <option value={60}>Every minute</option>
                    <option value={300}>Every 5 minutes</option>
                    <option value={900}>Every 15 minutes</option>
                  </Select>
                )}
              </FormControl>
            </VStack>
          </ModalBody>
          
          <ModalFooter>
            <HStack>
              <Button variant="outline" onClick={onFilterClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={onFilterClose}>
                Apply Filters
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

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
                {/* Report Header */}
                <Card variant="outline" bg="blue.50">
                  <CardBody>
                    <HStack justify="space-between">
                      <VStack align="start" spacing={1}>
                        <Text fontSize="lg" fontWeight="bold">{previewData.reportTitle}</Text>
                        <Text fontSize="sm" color="gray.600">Generated on: {previewData.generatedDate}</Text>
                      </VStack>
                      <Badge colorScheme="blue" fontSize="sm" px={3} py={1} borderRadius="full">
                        {previewData.totalRecords} Records
                      </Badge>
                    </HStack>
                  </CardBody>
                </Card>

                {/* Summary Statistics */}
                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                  <Stat p={4} bg="green.50" borderRadius="xl" border="1px solid" borderColor="green.200">
                    <StatLabel>Total Revenue</StatLabel>
                    <StatNumber color="green.600" fontSize="xl">{previewData.summary.totalRevenue}</StatNumber>
                  </Stat>
                  <Stat p={4} bg="red.50" borderRadius="xl" border="1px solid" borderColor="red.200">
                    <StatLabel>Total Expenses</StatLabel>
                    <StatNumber color="red.600" fontSize="xl">{previewData.summary.totalExpenses}</StatNumber>
                  </Stat>
                  <Stat p={4} bg="blue.50" borderRadius="xl" border="1px solid" borderColor="blue.200">
                    <StatLabel>Net Profit</StatLabel>
                    <StatNumber color="blue.600" fontSize="xl">{previewData.summary.netProfit}</StatNumber>
                  </Stat>
                  <Stat p={4} bg="purple.50" borderRadius="xl" border="1px solid" borderColor="purple.200">
                    <StatLabel>Transactions</StatLabel>
                    <StatNumber color="purple.600" fontSize="xl">{previewData.summary.transactions}</StatNumber>
                  </Stat>
                </SimpleGrid>

                {/* Sample Data Table */}
                {previewData.sampleData && (
                  <Card variant="outline">
                    <CardHeader>
                      <Text fontSize="lg" fontWeight="semibold">Sample Transactions</Text>
                    </CardHeader>
                    <CardBody pt={0}>
                      <TableContainer>
                        <Table size="sm" variant="striped">
                          <Thead bg="gray.50">
                            <Tr>
                              <Th>Date</Th>
                              <Th>Description</Th>
                              <Th>Amount</Th>
                              <Th>Type</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {previewData.sampleData.map((row, index) => (
                              <Tr key={index}>
                                <Td fontWeight="medium">{row.date}</Td>
                                <Td>{row.description}</Td>
                                <Td fontWeight="semibold">{row.amount}</Td>
                                <Td>
                                  <Badge 
                                    colorScheme={row.type === 'Income' ? 'green' : 'red'}
                                    borderRadius="full"
                                  >
                                    {row.type}
                                  </Badge>
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
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
                  <MenuItem 
                    icon={<Share2 size={16} />}
                    onClick={() => handleCopyLink(previewData)}
                    _hover={{ bg: 'purple.50' }}
                  >
                    Copy Share Link
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
              <Text>Schedule Report - {selectedReportType?.title}</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={5} align="stretch">
              <Card variant="outline" bg="blue.50">
                <CardBody>
                  <HStack spacing={3}>
                    <Clock size={20} color="blue" />
                    <VStack align="start" spacing={1}>
                      <Text fontSize="sm" fontWeight="semibold">
                        Automated Report Generation
                      </Text>
                      <Text fontSize="xs" color="gray.600">
                        Reports will be automatically generated and sent to specified recipients
                      </Text>
                    </VStack>
                  </HStack>
                </CardBody>
              </Card>

              <SimpleGrid columns={2} spacing={4}>
                <FormControl>
                  <FormLabel fontWeight="semibold">Frequency</FormLabel>
                  <Select 
                    value={scheduleSettings.frequency} 
                    onChange={(e) => setScheduleSettings({...scheduleSettings, frequency: e.target.value})}
                    borderRadius="lg"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel fontWeight="semibold">Report Format</FormLabel>
                  <Select 
                    value={scheduleSettings.format}
                    onChange={(e) => setScheduleSettings({...scheduleSettings, format: e.target.value})}
                    borderRadius="lg"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="excel">Excel Spreadsheet</option>
                    <option value="csv">CSV File</option>
                  </Select>
                </FormControl>
              </SimpleGrid>
              
              <FormControl>
                <FormLabel fontWeight="semibold">Email Recipients</FormLabel>
                <Textarea 
                  placeholder="Enter email addresses separated by commas&#10;Example: admin@hospital.com, finance@hospital.com"
                  value={scheduleSettings.email}
                  onChange={(e) => setScheduleSettings({...scheduleSettings, email: e.target.value})}
                  borderRadius="lg"
                  minH="100px"
                />
              </FormControl>
              
              <FormControl>
                <FormLabel fontWeight="semibold">Start Date & Time</FormLabel>
                <Input 
                  type="datetime-local" 
                  value={scheduleSettings.startDate}
                  onChange={(e) => setScheduleSettings({...scheduleSettings, startDate: e.target.value})}
                  borderRadius="lg"
                />
              </FormControl>
              
              <HStack spacing={8}>
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0" fontWeight="semibold">Include Charts</FormLabel>
                  <Switch 
                    isChecked={scheduleSettings.includeCharts}
                    onChange={(e) => setScheduleSettings({...scheduleSettings, includeCharts: e.target.checked})}
                    colorScheme="blue"
                  />
                </FormControl>
                
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0" fontWeight="semibold">Send Summary</FormLabel>
                  <Switch 
                    defaultChecked
                    colorScheme="blue"
                  />
                </FormControl>
              </HStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button variant="outline" onClick={onScheduleClose} borderRadius="lg">
                Cancel
              </Button>
              <Button 
                colorScheme="blue" 
                leftIcon={<Calendar />}
                onClick={handleSaveSchedule}
                borderRadius="lg"
              >
                Schedule Report
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Configure Modal */}
      <Modal isOpen={isConfigureOpen} onClose={onConfigureClose} size="xl">
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent borderRadius="2xl">
          <ModalHeader>
            <HStack>
              <Settings size={24} />
              <Text>Configure Report - {selectedReportType?.title}</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={5} align="stretch">
              <Card variant="outline" bg="orange.50">
                <CardBody>
                  <HStack spacing={3}>
                    <Settings size={20} color="orange" />
                    <VStack align="start" spacing={1}>
                      <Text fontSize="sm" fontWeight="semibold">
                        Customize Report Parameters
                      </Text>
                      <Text fontSize="xs" color="gray.600">
                        Configure data sources, formatting, and output options
                      </Text>
                    </VStack>
                  </HStack>
                </CardBody>
              </Card>

              <SimpleGrid columns={2} spacing={4}>
                <FormControl>
                  <FormLabel fontWeight="semibold">Report Name</FormLabel>
                  <Input 
                    defaultValue={selectedReportType?.title} 
                    borderRadius="lg"
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel fontWeight="semibold">Currency Format</FormLabel>
                  <Select defaultValue="INR" borderRadius="lg">
                    <option value="INR">Indian Rupees (₹)</option>
                    <option value="USD">US Dollars ($)</option>
                    <option value="EUR">Euros (€)</option>
                  </Select>
                </FormControl>
              </SimpleGrid>
              
              <FormControl>
                <FormLabel fontWeight="semibold">Data Sources</FormLabel>
                <CheckboxGroup defaultValue={['transactions', 'billing']}>
                  <SimpleGrid columns={2} spacing={3}>
                    <Checkbox value="transactions" borderRadius="md">Transaction Records</Checkbox>
                    <Checkbox value="billing" borderRadius="md">Billing Data</Checkbox>
                    <Checkbox value="inventory" borderRadius="md">Inventory Costs</Checkbox>
                    <Checkbox value="payroll" borderRadius="md">Payroll Expenses</Checkbox>
                    <Checkbox value="insurance" borderRadius="md">Insurance Claims</Checkbox>
                    <Checkbox value="assets" borderRadius="md">Asset Management</Checkbox>
                  </SimpleGrid>
                </CheckboxGroup>
              </FormControl>
              
              <FormControl>
                <FormLabel fontWeight="semibold">Chart Types</FormLabel>
                <CheckboxGroup defaultValue={['bar', 'line']}>
                  <HStack wrap="wrap" spacing={4}>
                    <Checkbox value="bar">Bar Chart</Checkbox>
                    <Checkbox value="line">Line Chart</Checkbox>
                    <Checkbox value="pie">Pie Chart</Checkbox>
                    <Checkbox value="area">Area Chart</Checkbox>
                  </HStack>
                </CheckboxGroup>
              </FormControl>
              
              <SimpleGrid columns={2} spacing={4}>
                <FormControl>
                  <FormLabel fontWeight="semibold">Data Grouping</FormLabel>
                  <Select defaultValue="monthly" borderRadius="lg">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </Select>
                </FormControl>
                
                <FormControl>
                  <FormLabel fontWeight="semibold">Sort Order</FormLabel>
                  <Select defaultValue="desc" borderRadius="lg">
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                    <option value="amount_desc">Highest Amount</option>
                    <option value="amount_asc">Lowest Amount</option>
                  </Select>
                </FormControl>
              </SimpleGrid>
              
              <HStack spacing={8}>
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0" fontWeight="semibold">Show Comparisons</FormLabel>
                  <Switch defaultChecked colorScheme="blue" />
                </FormControl>
                
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0" fontWeight="semibold">Include Trends</FormLabel>
                  <Switch defaultChecked colorScheme="blue" />
                </FormControl>
                
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0" fontWeight="semibold">Auto-update</FormLabel>
                  <Switch colorScheme="blue" />
                </FormControl>
              </HStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button variant="outline" onClick={onConfigureClose} borderRadius="lg">
                Cancel
              </Button>
              <Button 
                colorScheme="blue" 
                leftIcon={<Settings />}
                onClick={() => {
                  toast({
                    title: 'Configuration Saved',
                    description: `Report configuration for ${selectedReportType?.title} has been updated successfully.`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                  });
                  onConfigureClose();
                }}
                borderRadius="lg"
              >
                Save Configuration
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default FinanceReports;
