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
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Progress,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Checkbox,
  CheckboxGroup,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
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
  Heading,
  Avatar,
  AvatarGroup,
  Tooltip,
  Stack,
  Divider,
  useBreakpointValue,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Textarea,
  Radio,
  RadioGroup,
  Checkbox as ChakraCheckbox
} from '@chakra-ui/react';
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Download,
  FileText,
  File,
  Image,
  BarChart3,
  Calendar,
  Clock,
  User,
  Users,
  Activity,
  TrendingUp,
  Database,
  Archive,
  Folder,
  Share2,
  Eye,
  Trash2,
  RefreshCw,
  Settings,
  MessageCircle,
  Phone,
  UserCheck,
  UserPlus
} from 'lucide-react';

// Mock download data
const mockReports = [
  {
    id: 'RPT001',
    name: 'Monthly Patient Report - December 2024',
    type: 'Patient Report',
    category: 'Analytics',
    format: 'PDF',
    size: '2.4 MB',
    generatedDate: '2024-12-15',
    generatedBy: 'Dr. Priya Sharma',
    downloads: 12,
    description: 'Comprehensive patient statistics and treatment analysis for December 2024',
    status: 'Ready',
    expiry: '2025-01-15'
  },
  {
    id: 'RPT002',
    name: 'Financial Summary Q4 2024',
    type: 'Financial Report',
    category: 'Finance',
    format: 'Excel',
    size: '1.8 MB',
    generatedDate: '2024-12-14',
    generatedBy: 'Admin Team',
    downloads: 8,
    description: 'Quarterly financial performance and budget analysis',
    status: 'Ready',
    expiry: '2025-03-14'
  },
  {
    id: 'RPT003',
    name: 'Inventory Stock Report',
    type: 'Inventory Report',
    category: 'Operations',
    format: 'PDF',
    size: '3.1 MB',
    generatedDate: '2024-12-15',
    generatedBy: 'Pharmacy Team',
    downloads: 5,
    description: 'Current stock levels, low stock alerts, and expiry tracking',
    status: 'Ready',
    expiry: '2024-12-25'
  },
  {
    id: 'RPT004',
    name: 'Staff Attendance December',
    type: 'HR Report',
    category: 'Human Resources',
    format: 'Excel',
    size: '956 KB',
    generatedDate: '2024-12-13',
    generatedBy: 'HR Department',
    downloads: 15,
    description: 'Monthly attendance records and leave analysis',
    status: 'Ready',
    expiry: '2025-01-13'
  },
  {
    id: 'RPT005',
    name: 'Treatment Outcome Analysis',
    type: 'Clinical Report',
    category: 'Clinical',
    format: 'PDF',
    size: '4.7 MB',
    generatedDate: '2024-12-12',
    generatedBy: 'Dr. Anjali Nair',
    downloads: 22,
    description: 'Ayurvedic treatment effectiveness and patient recovery analysis',
    status: 'Ready',
    expiry: '2025-02-12'
  },
  {
    id: 'RPT006',
    name: 'Daily Operations Report',
    type: 'Operations Report',
    category: 'Operations',
    format: 'PDF',
    size: '1.2 MB',
    generatedDate: '2024-12-15',
    generatedBy: 'System Auto',
    downloads: 3,
    description: 'Daily summary of hospital operations and key metrics',
    status: 'Generating',
    expiry: '2024-12-16'
  }
];

const mockTemplates = [
  {
    id: 'TPL001',
    name: 'Patient Prescription Template',
    type: 'Medical Form',
    format: 'PDF',
    size: '245 KB',
    downloads: 45,
    description: 'Standard Ayurvedic prescription format with dosage guidelines'
  },
  {
    id: 'TPL002',
    name: 'Treatment Consent Form',
    type: 'Legal Document',
    format: 'PDF',
    size: '189 KB',
    downloads: 32,
    description: 'Patient consent form for Panchakarma and other treatments'
  },
  {
    id: 'TPL003',
    name: 'Insurance Claim Form',
    type: 'Administrative',
    format: 'PDF',
    size: '312 KB',
    downloads: 18,
    description: 'Standard insurance claim submission template'
  },
  {
    id: 'TPL004',
    name: 'Patient Registration Form',
    type: 'Administrative',
    format: 'PDF',
    size: '278 KB',
    downloads: 67,
    description: 'New patient registration and medical history form'
  }
];

const mockBackups = [
  {
    id: 'BKP001',
    name: 'Patient Database Backup',
    type: 'Database Backup',
    size: '145 MB',
    date: '2024-12-15 02:00',
    status: 'Completed',
    retention: '90 days'
  },
  {
    id: 'BKP002',
    name: 'Financial Records Backup',
    type: 'Database Backup',
    size: '78 MB',
    date: '2024-12-15 02:30',
    status: 'Completed',
    retention: '365 days'
  },
  {
    id: 'BKP003',
    name: 'System Configuration Backup',
    type: 'System Backup',
    size: '12 MB',
    date: '2024-12-15 03:00',
    status: 'Completed',
    retention: '30 days'
  },
  {
    id: 'BKP004',
    name: 'Full System Backup',
    type: 'Complete Backup',
    size: '2.3 GB',
    date: '2024-12-14 23:00',
    status: 'In Progress',
    retention: '180 days'
  }
];

// Mock WhatsApp contacts
const mockWhatsAppContacts = [
  {
    id: 'WC001',
    name: 'Dr. Priya Sharma',
    phone: '+91 9876543210',
    role: 'Ayurvedic Doctor',
    department: 'Clinical',
    avatar: '',
    lastSeen: '2024-12-15 09:30'
  },
  {
    id: 'WC002',
    name: 'Dr. Anjali Nair',
    phone: '+91 9876543211',
    role: 'Senior Consultant',
    department: 'Clinical',
    avatar: '',
    lastSeen: '2024-12-15 10:15'
  },
  {
    id: 'WC003',
    name: 'Admin Team',
    phone: '+91 9876543212',
    role: 'Administrator',
    department: 'Administration',
    avatar: '',
    lastSeen: '2024-12-15 11:00'
  },
  {
    id: 'WC004',
    name: 'Pharmacy Team',
    phone: '+91 9876543213',
    role: 'Pharmacist',
    department: 'Pharmacy',
    avatar: '',
    lastSeen: '2024-12-15 08:45'
  },
  {
    id: 'WC005',
    name: 'HR Department',
    phone: '+91 9876543214',
    role: 'Human Resources',
    department: 'HR',
    avatar: '',
    lastSeen: '2024-12-15 09:00'
  },
  {
    id: 'WC006',
    name: 'Finance Team',
    phone: '+91 9876543215',
    role: 'Finance Manager',
    department: 'Finance',
    avatar: '',
    lastSeen: '2024-12-15 10:30'
  },
  {
    id: 'WC007',
    name: 'Nursing Staff',
    phone: '+91 9876543216',
    role: 'Head Nurse',
    department: 'Nursing',
    avatar: '',
    lastSeen: '2024-12-15 07:30'
  },
  {
    id: 'WC008',
    name: 'Laboratory Team',
    phone: '+91 9876543217',
    role: 'Lab Technician',
    department: 'Laboratory',
    avatar: '',
    lastSeen: '2024-12-15 08:15'
  }
];

// Mock WhatsApp groups
const mockWhatsAppGroups = [
  {
    id: 'WG001',
    name: 'All Doctors',
    description: 'General communication for all medical staff',
    members: 15,
    category: 'Medical',
    icon: '👩‍⚕️',
    lastActivity: '2024-12-15 11:30'
  },
  {
    id: 'WG002',
    name: 'Admin Team',
    description: 'Administrative staff coordination',
    members: 8,
    category: 'Administration',
    icon: '📋',
    lastActivity: '2024-12-15 10:45'
  },
  {
    id: 'WG003',
    name: 'Emergency Response',
    description: 'Critical updates and emergency coordination',
    members: 25,
    category: 'Emergency',
    icon: '🚨',
    lastActivity: '2024-12-15 09:15'
  },
  {
    id: 'WG004',
    name: 'Department Heads',
    description: 'Senior management discussions',
    members: 6,
    category: 'Management',
    icon: '👥',
    lastActivity: '2024-12-15 12:00'
  },
  {
    id: 'WG005',
    name: 'Pharmacy Updates',
    description: 'Medicine stock and pharmacy coordination',
    members: 12,
    category: 'Pharmacy',
    icon: '💊',
    lastActivity: '2024-12-15 08:30'
  }
];

const DownloadCenter = ({ title = "Download Center", showAddButton = true }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [formatFilter, setFormatFilter] = useState('all');
  const [selectedItems, setSelectedItems] = useState([]);
  const [reports, setReports] = useState(mockReports);
  const [templates, setTemplates] = useState(mockTemplates);
  const [backups, setBackups] = useState(mockBackups);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { isOpen: isGenerateOpen, onOpen: onGenerateOpen, onClose: onGenerateClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isPreviewOpen, onOpen: onPreviewOpen, onClose: onPreviewClose } = useDisclosure();
  const { isOpen: isShareOpen, onOpen: onShareOpen, onClose: onShareClose } = useDisclosure();
  
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportForm, setReportForm] = useState({
    type: '',
    dateFrom: '',
    dateTo: '',
    format: 'pdf',
    sections: []
  });
  const [shareForm, setShareForm] = useState({
    shareType: 'individual', // 'individual', 'everyone', 'group'
    selectedContacts: [],
    selectedGroup: '',
    message: '',
    permissions: 'view',
    searchQuery: ''
  });
  
  const toast = useToast();
  
  // Enhanced color scheme
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const bgGradient = "linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(16, 185, 129, 0.08) 50%, rgba(139, 92, 246, 0.08) 100%)";
  const headerGradient = "linear(135deg, #3B82F6, #10B981, #8B5CF6)";
  const primaryBlue = "#3B82F6";
  const accentTeal = "#10B981";
  const gridColumns = useBreakpointValue({ base: 1, md: 2, lg: 3, xl: 6 });

  // Filter reports
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.generatedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || report.category.toLowerCase() === categoryFilter;
    const matchesType = typeFilter === 'all' || report.type.toLowerCase().includes(typeFilter.toLowerCase());
    const matchesFormat = formatFilter === 'all' || report.format.toLowerCase() === formatFilter;
    return matchesSearch && matchesCategory && matchesType && matchesFormat;
  });

  // Calculate statistics
  const totalReports = reports.length;
  const readyReports = reports.filter(r => r.status === 'Ready').length;
  const generatingReports = reports.filter(r => r.status === 'Generating').length;
  const totalDownloads = reports.reduce((sum, r) => sum + r.downloads, 0);
  const totalTemplates = templates.length;
  const totalBackups = backups.length;

  // Button functionality handlers
  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    toast({
      title: "Refreshing Data",
      description: "Syncing latest reports and documents...",
      status: "info",
      duration: 2000,
      isClosable: true,
    });

    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Data Refreshed",
        description: "All reports and documents are now up to date.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }, 2000);
  };

  const handleDownload = async (item, type = 'report') => {
    toast({
      title: "Download Started",
      description: `Downloading ${item.name}...`,
      status: "info",
      duration: 2000,
      isClosable: true,
    });

    // Update download count for reports
    if (type === 'report') {
      setReports(prev => prev.map(r => 
        r.id === item.id ? { ...r, downloads: r.downloads + 1 } : r
      ));
    } else if (type === 'template') {
      setTemplates(prev => prev.map(t => 
        t.id === item.id ? { ...t, downloads: t.downloads + 1 } : t
      ));
    }

    // Simulate download
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: `${item.name} has been downloaded successfully.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }, 1500);
  };

  const handlePreview = (item) => {
    setSelectedReport(item);
    onPreviewOpen();
    toast({
      title: "Preview Loading",
      description: `Opening preview for ${item.name}`,
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleShare = (item) => {
    setSelectedReport(item);
    setShareForm({ 
      shareType: 'individual',
      selectedContacts: [],
      selectedGroup: '',
      message: '',
      permissions: 'view',
      searchQuery: ''
    });
    onShareOpen();
  };

  const handleSubmitShare = () => {
    let recipients = '';
    
    if (shareForm.shareType === 'individual') {
      if (shareForm.selectedContacts.length === 0) {
        toast({
          title: "Recipients Required",
          description: "Please select at least one contact to share the document.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      recipients = shareForm.selectedContacts.map(contact => contact.name).join(', ');
    } else if (shareForm.shareType === 'group') {
      if (!shareForm.selectedGroup) {
        toast({
          title: "Group Required",
          description: "Please select a group to share the document.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      const group = mockWhatsAppGroups.find(g => g.id === shareForm.selectedGroup);
      recipients = group.name;
    } else if (shareForm.shareType === 'everyone') {
      recipients = 'All Hospital Staff';
    }

    toast({
      title: "Document Shared via WhatsApp",
      description: `${selectedReport.name} has been shared with ${recipients}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onShareClose();
  };

  // WhatsApp helper functions
  const handleContactToggle = (contact) => {
    setShareForm(prev => ({
      ...prev,
      selectedContacts: prev.selectedContacts.find(c => c.id === contact.id)
        ? prev.selectedContacts.filter(c => c.id !== contact.id)
        : [...prev.selectedContacts, contact]
    }));
  };

  const filteredContacts = mockWhatsAppContacts.filter(contact =>
    contact.name.toLowerCase().includes(shareForm.searchQuery.toLowerCase()) ||
    contact.role.toLowerCase().includes(shareForm.searchQuery.toLowerCase()) ||
    contact.department.toLowerCase().includes(shareForm.searchQuery.toLowerCase())
  );

  const filteredGroups = mockWhatsAppGroups.filter(group =>
    group.name.toLowerCase().includes(shareForm.searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(shareForm.searchQuery.toLowerCase()) ||
    group.category.toLowerCase().includes(shareForm.searchQuery.toLowerCase())
  );

  const handleArchive = (item) => {
    setReports(prev => prev.map(r => 
      r.id === item.id ? { ...r, status: 'Archived' } : r
    ));
    
    toast({
      title: "Report Archived",
      description: `${item.name} has been moved to archive.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleDelete = (item) => {
    setSelectedReport(item);
    onDeleteOpen();
  };

  const confirmDelete = () => {
    setReports(prev => prev.filter(r => r.id !== selectedReport.id));
    
    toast({
      title: "Report Deleted",
      description: `${selectedReport.name} has been permanently deleted.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onDeleteClose();
  };

  const handleGenerateReport = () => {
    if (!reportForm.type || !reportForm.dateFrom || !reportForm.dateTo) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const newReport = {
      id: `RPT${String(reports.length + 1).padStart(3, '0')}`,
      name: `${reportForm.type} Report - ${new Date().toLocaleDateString()}`,
      type: `${reportForm.type} Report`,
      category: reportForm.type,
      format: reportForm.format.toUpperCase(),
      size: '1.2 MB',
      generatedDate: new Date().toISOString().split('T')[0],
      generatedBy: 'Current User',
      downloads: 0,
      description: `Generated ${reportForm.type} report for ${reportForm.dateFrom} to ${reportForm.dateTo}`,
      status: 'Generating',
      expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    setReports(prev => [newReport, ...prev]);
    
    // Simulate report generation
    setTimeout(() => {
      setReports(prev => prev.map(r => 
        r.id === newReport.id ? { ...r, status: 'Ready' } : r
      ));
      
      toast({
        title: "Report Generated",
        description: `${newReport.name} is now ready for download.`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    }, 3000);

    toast({
      title: "Report Generation Started",
      description: "Your report is being generated. This may take a few minutes.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });

    onGenerateClose();
    setReportForm({ type: '', dateFrom: '', dateTo: '', format: 'pdf', sections: [] });
  };

  const handleBulkDownload = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "No Items Selected",
        description: "Please select items to download.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: "Bulk Download Started",
      description: `Downloading ${selectedItems.length} items...`,
      status: "info",
      duration: 3000,
      isClosable: true,
    });

    // Update download counts
    setReports(prev => prev.map(r => 
      selectedItems.includes(r.id) ? { ...r, downloads: r.downloads + 1 } : r
    ));

    setTimeout(() => {
      toast({
        title: "Bulk Download Complete",
        description: `${selectedItems.length} items downloaded successfully.`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      setSelectedItems([]);
    }, 2000);
  };

  const handleBackupRestore = (backup) => {
    toast({
      title: "Restore Started",
      description: `Restoring from ${backup.name}...`,
      status: "info",
      duration: 3000,
      isClosable: true,
    });

    setTimeout(() => {
      toast({
        title: "Restore Complete",
        description: "System has been restored successfully.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    }, 3000);
  };

  const handleBackupDelete = (backupId) => {
    setBackups(prev => prev.filter(b => b.id !== backupId));
    toast({
      title: "Backup Deleted",
      description: "Backup file has been permanently deleted.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'ready': return 'green';
      case 'generating': return 'yellow';
      case 'failed': return 'red';
      case 'completed': return 'green';
      case 'in progress': return 'blue';
      default: return 'gray';
    }
  };

  const getFormatIcon = (format) => {
    switch (format.toLowerCase()) {
      case 'pdf': return <FileText size={16} color="red" />;
      case 'excel': return <File size={16} color="green" />;
      case 'word': return <File size={16} color="blue" />;
      case 'image': return <Image size={16} color="purple" />;
      default: return <File size={16} color="gray" />;
    }
  };

  const formatFileSize = (size) => {
    if (size.includes('GB')) return size;
    if (size.includes('MB')) return size;
    if (size.includes('KB')) return size;
    return size;
  };

  return (
    <Box minH="100vh" bg={bgGradient}>
      {/* Enhanced Header */}
      <Box 
        bgGradient={headerGradient}
        borderRadius="2xl"
        p={8}
        mb={8}
        position="relative"
        overflow="hidden"
        css={{
          '@keyframes shimmer': {
            '0%': { transform: 'translateX(-100%)' },
            '100%': { transform: 'translateX(100%)' }
          }
        }}
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgGradient: "linear(45deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
          animation: "shimmer 3s infinite"
        }}
      >
        <Flex justify="space-between" align="center" position="relative" zIndex={1}>
          <VStack align="start" spacing={3}>
            <HStack>
              <Avatar
                size="lg"
                bg="whiteAlpha.200"
                icon={<Database size={24} color="white" />}
                border="2px solid rgba(255,255,255,0.2)"
              />
              <VStack align="start" spacing={1}>
                <Heading size="xl" color="white" fontWeight="bold">
                  {title}
                </Heading>
                <Text color="whiteAlpha.800" fontSize="md">
                  📊 Reports, documents, and backup management center
                </Text>
                <HStack spacing={4} mt={2}>
                  <Badge colorScheme="whiteAlpha" variant="solid" px={3} py={1} borderRadius="full">
                    🔄 Auto-Sync Enabled
                  </Badge>
                  <Badge colorScheme="whiteAlpha" variant="solid" px={3} py={1} borderRadius="full">
                    ☁️ Cloud Backup Active
                  </Badge>
                </HStack>
              </VStack>
            </HStack>
          </VStack>
          
          {showAddButton && (
            <VStack spacing={3}>
              <HStack spacing={3}>
                <Tooltip label="Refresh all reports and sync data">
                  <Button 
                    leftIcon={<RefreshCw size={18} />} 
                    variant="outline"
                    color="white"
                    borderColor="whiteAlpha.300"
                    bg="whiteAlpha.100"
                    _hover={{ bg: "whiteAlpha.200", transform: "translateY(-2px)" }}
                    transition="all 0.3s ease"
                    backdropFilter="blur(10px)"
                    size="md"
                    onClick={handleRefreshAll}
                    isLoading={isRefreshing}
                    loadingText="Refreshing"
                  >
                    Refresh All
                  </Button>
                </Tooltip>
                <Tooltip label="Configure automated report scheduling">
                  <Button 
                    leftIcon={<Settings size={18} />} 
                    variant="outline"
                    color="white"
                    borderColor="whiteAlpha.300"
                    bg="whiteAlpha.100"
                    _hover={{ bg: "whiteAlpha.200", transform: "translateY(-2px)" }}
                    transition="all 0.3s ease"
                    backdropFilter="blur(10px)"
                    size="md"
                  >
                    Schedule Reports
                  </Button>
                </Tooltip>
              </HStack>
              <Button 
                colorScheme="whiteAlpha"
                leftIcon={<Plus size={18} />} 
                onClick={onGenerateOpen}
                bg="white"
                color={primaryBlue}
                _hover={{ 
                  bg: "whiteAlpha.900", 
                  transform: "translateY(-2px)",
                  shadow: "xl" 
                }}
                transition="all 0.3s ease"
                fontWeight="bold"
                size="lg"
                px={8}
                borderRadius="full"
              >
                Generate Report
              </Button>
            </VStack>
          )}
        </Flex>
        
        {/* Decorative elements */}
        <Box
          position="absolute"
          top={-20}
          right={-20}
          w="200px"
          h="200px"
          bg="whiteAlpha.100"
          borderRadius="full"
          blur="lg"
        />
        <Box
          position="absolute"
          bottom={-30}
          left={-30}
          w="150px"
          h="150px"
          bg="whiteAlpha.100"
          borderRadius="full"
          blur="lg"
        />
      </Box>

      {/* Enhanced Statistics Cards */}
      <SimpleGrid columns={gridColumns} spacing={6} mb={8}>
        <Card 
          bg={cardBg} 
          border="1px" 
          borderColor={borderColor}
          borderRadius="xl"
          overflow="hidden"
          position="relative"
          minH="160px" // Fixed height
          _hover={{ 
            borderColor: primaryBlue,
            shadow: "md"
          }}
          transition="border-color 0.2s ease, box-shadow 0.2s ease"
          cursor="pointer"
        >
          <CardBody p={6} h="full">
            <VStack align="start" spacing={3} h="full" justify="space-between">
              <HStack justify="space-between" w="full">
                <Avatar size="md" bg="blue.500" icon={<BarChart3 size={20} color="white" />} />
                <Badge colorScheme="blue" variant="subtle" borderRadius="full">
                  Available
                </Badge>
              </HStack>
              <Box flex={1}>
                <Text fontSize="3xl" fontWeight="bold" color="blue.600">
                  {totalReports}
                </Text>
                <Text color="gray.600" fontSize="sm" fontWeight="medium">
                  Total Reports
                </Text>
              </Box>
              <Progress 
                value={85} 
                size="sm" 
                colorScheme="blue" 
                borderRadius="full" 
                w="full"
                bg="blue.50"
              />
            </VStack>
          </CardBody>
          <Box 
            position="absolute" 
            top={0} 
            left={0} 
            w="full" 
            h="2px" 
            bgGradient="linear(90deg, blue.400, blue.600)"
          />
        </Card>
        
        <Card 
          bg={cardBg} 
          border="1px" 
          borderColor={borderColor}
          borderRadius="xl"
          overflow="hidden"
          position="relative"
          minH="160px" // Fixed height
          _hover={{ 
            borderColor: "green.400",
            shadow: "md"
          }}
          transition="border-color 0.2s ease, box-shadow 0.2s ease"
          cursor="pointer"
        >
          <CardBody p={6} h="full">
            <VStack align="start" spacing={3} h="full" justify="space-between">
              <HStack justify="space-between" w="full">
                <Avatar size="md" bg="green.500" icon={<Download size={20} color="white" />} />
                <Badge colorScheme="green" variant="subtle" borderRadius="full">
                  Ready
                </Badge>
              </HStack>
              <Box flex={1}>
                <Text fontSize="3xl" fontWeight="bold" color="green.600">
                  {readyReports}
                </Text>
                <Text color="gray.600" fontSize="sm" fontWeight="medium">
                  Ready Downloads
                </Text>
              </Box>
              <Progress 
                value={readyReports/totalReports * 100} 
                size="sm" 
                colorScheme="green" 
                borderRadius="full" 
                w="full"
                bg="green.50"
              />
            </VStack>
          </CardBody>
          <Box 
            position="absolute" 
            top={0} 
            left={0} 
            w="full" 
            h="2px" 
            bgGradient="linear(90deg, green.400, green.600)"
          />
        </Card>
        
        <Card 
          bg={cardBg} 
          border="1px" 
          borderColor={borderColor}
          borderRadius="xl"
          overflow="hidden"
          position="relative"
          minH="160px" // Fixed height
          _hover={{ 
            borderColor: "yellow.400",
            shadow: "md"
          }}
          transition="border-color 0.2s ease, box-shadow 0.2s ease"
          cursor="pointer"
        >
          <CardBody p={6} h="full">
            <VStack align="start" spacing={3} h="full" justify="space-between">
              <HStack justify="space-between" w="full">
                <Avatar size="md" bg="yellow.500" icon={<Clock size={20} color="white" />} />
                <Badge colorScheme="yellow" variant="subtle" borderRadius="full">
                  Processing
                </Badge>
              </HStack>
              <Box flex={1}>
                <Text fontSize="3xl" fontWeight="bold" color="yellow.600">
                  {generatingReports}
                </Text>
                <Text color="gray.600" fontSize="sm" fontWeight="medium">
                  Generating
                </Text>
              </Box>
              <Progress 
                value={30} 
                size="sm" 
                colorScheme="yellow" 
                borderRadius="full" 
                w="full"
                bg="yellow.50"
                isIndeterminate={generatingReports > 0}
              />
            </VStack>
          </CardBody>
          <Box 
            position="absolute" 
            top={0} 
            left={0} 
            w="full" 
            h="2px" 
            bgGradient="linear(90deg, yellow.400, yellow.600)"
          />
        </Card>
        
        <Card 
          bg={cardBg} 
          border="1px" 
          borderColor={borderColor}
          borderRadius="xl"
          overflow="hidden"
          position="relative"
          minH="160px" // Fixed height
          _hover={{ 
            borderColor: "purple.400",
            shadow: "md"
          }}
          transition="border-color 0.2s ease, box-shadow 0.2s ease"
          cursor="pointer"
        >
          <CardBody p={6} h="full">
            <VStack align="start" spacing={3} h="full" justify="space-between">
              <HStack justify="space-between" w="full">
                <Avatar size="md" bg="purple.500" icon={<TrendingUp size={20} color="white" />} />
                <Badge colorScheme="purple" variant="subtle" borderRadius="full">
                  Total
                </Badge>
              </HStack>
              <Box flex={1}>
                <Text fontSize="3xl" fontWeight="bold" color="purple.600">
                  {totalDownloads}
                </Text>
                <Text color="gray.600" fontSize="sm" fontWeight="medium">
                  Downloads
                </Text>
              </Box>
              <HStack spacing={2} w="full">
                <TrendingUp size={14} color="#9333EA" />
                <Text fontSize="xs" color="purple.600" fontWeight="medium">
                  +12% this month
                </Text>
              </HStack>
            </VStack>
          </CardBody>
          <Box 
            position="absolute" 
            top={0} 
            left={0} 
            w="full" 
            h="2px" 
            bgGradient="linear(90deg, purple.400, purple.600)"
          />
        </Card>
        
        <Card 
          bg={cardBg} 
          border="1px" 
          borderColor={borderColor}
          borderRadius="xl"
          overflow="hidden"
          position="relative"
          _hover={{ 
            transform: "translateY(-4px)", 
            shadow: "xl",
            borderColor: "orange.400" 
          }}
          transition="all 0.3s ease"
          cursor="pointer"
        >
          <CardBody p={6}>
            <VStack align="start" spacing={3}>
              <HStack justify="space-between" w="full">
                <Avatar size="md" bg="orange.500" icon={<Folder size={20} color="white" />} />
                <Badge colorScheme="orange" variant="subtle" borderRadius="full">
                  Forms
                </Badge>
              </HStack>
              <Box>
                <Text fontSize="3xl" fontWeight="bold" color="orange.600">
                  {totalTemplates}
                </Text>
                <Text color="gray.600" fontSize="sm" fontWeight="medium">
                  Templates
                </Text>
              </Box>
              <HStack spacing={2} w="full">
                <Folder size={14} color="#EA580C" />
                <Text fontSize="xs" color="orange.600" fontWeight="medium">
                  Medical forms
                </Text>
              </HStack>
            </VStack>
          </CardBody>
          <Box 
            position="absolute" 
            top={0} 
            left={0} 
            w="full" 
            h="2px" 
            bgGradient="linear(90deg, orange.400, orange.600)"
          />
        </Card>
        
        <Card 
          bg={cardBg} 
          border="1px" 
          borderColor={borderColor}
          borderRadius="xl"
          overflow="hidden"
          position="relative"
          _hover={{ 
            transform: "translateY(-4px)", 
            shadow: "xl",
            borderColor: "gray.400" 
          }}
          transition="all 0.3s ease"
          cursor="pointer"
        >
          <CardBody p={6}>
            <VStack align="start" spacing={3}>
              <HStack justify="space-between" w="full">
                <Avatar size="md" bg="gray.500" icon={<Database size={20} color="white" />} />
                <Badge colorScheme="gray" variant="subtle" borderRadius="full">
                  Secured
                </Badge>
              </HStack>
              <Box>
                <Text fontSize="3xl" fontWeight="bold" color="gray.600">
                  {totalBackups}
                </Text>
                <Text color="gray.600" fontSize="sm" fontWeight="medium">
                  Backups
                </Text>
              </Box>
              <HStack spacing={2} w="full">
                <Activity size={14} color="#6B7280" />
                <Text fontSize="xs" color="gray.600" fontWeight="medium">
                  Auto-scheduled
                </Text>
              </HStack>
            </VStack>
          </CardBody>
          <Box 
            position="absolute" 
            top={0} 
            left={0} 
            w="full" 
            h="2px" 
            bgGradient="linear(90deg, gray.400, gray.600)"
          />
        </Card>
      </SimpleGrid>

      {/* Enhanced Main Content */}
      <Card 
        bg={cardBg} 
        border="1px" 
        borderColor={borderColor}
        borderRadius="2xl"
        overflow="hidden"
        shadow="xl"
        backdropFilter="blur(10px)"
      >
        <CardHeader 
          bg="whiteAlpha.50" 
          borderBottom="1px" 
          borderColor={borderColor}
          py={6}
        >
          <HStack justify="space-between">
            <VStack align="start" spacing={1}>
              <Heading size="lg" color="gray.800">
                📁 Document Management
              </Heading>
              <Text color="gray.600" fontSize="sm">
                Manage reports, templates, and system backups
              </Text>
            </VStack>
            <HStack>
              <AvatarGroup size="sm" max={3}>
                <Avatar name="Admin User" bg="blue.500" />
                <Avatar name="Doctor" bg="green.500" />
                <Avatar name="Staff" bg="purple.500" />
              </AvatarGroup>
              <Badge colorScheme="green" variant="subtle" px={3} py={1} borderRadius="full">
                🔄 Live Sync
              </Badge>
            </HStack>
          </HStack>
        </CardHeader>
        
        <CardBody p={8}>
          <Tabs variant="enclosed" colorScheme="blue" size="lg">
            <TabList 
              bg="gray.50" 
              borderRadius="xl" 
              p={2} 
              border="none"
              mb={6}
            >
              <Tab 
                borderRadius="lg" 
                fontWeight="semibold"
                _selected={{ 
                  bg: "white", 
                  color: primaryBlue,
                  shadow: "md" 
                }}
                leftIcon={<FileText size={18} />}
              >
                📊 Reports
              </Tab>
              <Tab 
                borderRadius="lg" 
                fontWeight="semibold"
                _selected={{ 
                  bg: "white", 
                  color: primaryBlue,
                  shadow: "md" 
                }}
              >
                📄 Templates
              </Tab>
              <Tab 
                borderRadius="lg" 
                fontWeight="semibold"
                _selected={{ 
                  bg: "white", 
                  color: primaryBlue,
                  shadow: "md" 
                }}
              >
                💾 Backups
              </Tab>
              <Tab 
                borderRadius="lg" 
                fontWeight="semibold"
                _selected={{ 
                  bg: "white", 
                  color: primaryBlue,
                  shadow: "md" 
                }}
              >
                ⚡ Bulk Actions
              </Tab>
            </TabList>
            
            <TabPanels>
              {/* Enhanced Reports Tab */}
              <TabPanel p={0}>
                {/* Modern Filters */}
                <Card 
                  bg="whiteAlpha.50" 
                  border="1px" 
                  borderColor="whiteAlpha.200"
                  borderRadius="xl" 
                  mb={6}
                  backdropFilter="blur(10px)"
                >
                  <CardBody p={6}>
                    <VStack spacing={4}>
                      <HStack justify="space-between" w="full">
                        <HStack>
                          <Text fontWeight="semibold" color="gray.700">
                            🔍 Search & Filter
                          </Text>
                          <Badge variant="subtle" colorScheme="blue">
                            {filteredReports.length} results
                          </Badge>
                        </HStack>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          leftIcon={<RefreshCw size={14} />}
                          onClick={() => {
                            setSearchTerm('');
                            setCategoryFilter('all');
                            setFormatFilter('all');
                          }}
                        >
                          Clear Filters
                        </Button>
                      </HStack>
                      
                      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} w="full">
                        <Box position="relative">
                          <HStack
                            bg="white"
                            border="2px"
                            borderColor={searchTerm ? primaryBlue : "gray.200"}
                            borderRadius="lg"
                            px={4}
                            py={2}
                            transition="all 0.3s ease"
                            _hover={{ borderColor: primaryBlue }}
                          >
                            <Search size={16} color={searchTerm ? primaryBlue : "#9CA3AF"} />
                            <Input
                              placeholder="Search reports, descriptions..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              variant="unstyled"
                              size="md"
                              fontWeight="medium"
                            />
                          </HStack>
                        </Box>
                        
                        <Select
                          value={categoryFilter}
                          onChange={(e) => setCategoryFilter(e.target.value)}
                          bg="white"
                          borderColor="gray.200"
                          borderRadius="lg"
                          _hover={{ borderColor: primaryBlue }}
                          _focus={{ borderColor: primaryBlue, ring: "2px", ringColor: "blue.100" }}
                          fontWeight="medium"
                        >
                          <option value="all">🏷️ All Categories</option>
                          <option value="analytics">📊 Analytics</option>
                          <option value="finance">💰 Finance</option>
                          <option value="operations">⚙️ Operations</option>
                          <option value="clinical">🏥 Clinical</option>
                          <option value="human resources">👥 Human Resources</option>
                        </Select>
                        
                        <Select
                          value={formatFilter}
                          onChange={(e) => setFormatFilter(e.target.value)}
                          bg="white"
                          borderColor="gray.200"
                          borderRadius="lg"
                          _hover={{ borderColor: primaryBlue }}
                          _focus={{ borderColor: primaryBlue, ring: "2px", ringColor: "blue.100" }}
                          fontWeight="medium"
                        >
                          <option value="all">📄 All Formats</option>
                          <option value="pdf">📕 PDF</option>
                          <option value="excel">📗 Excel</option>
                          <option value="word">📘 Word</option>
                        </Select>
                        
                        <Button
                          leftIcon={<Filter size={16} />}
                          colorScheme="blue"
                          variant="outline"
                          borderRadius="lg"
                          fontWeight="semibold"
                          _hover={{ bg: "blue.50" }}
                        >
                          Advanced Filters
                        </Button>
                      </SimpleGrid>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Modern Table-Based Report List */}
                <Card bg={cardBg} border="1px" borderColor={borderColor} borderRadius="xl" overflow="hidden">
                  <CardBody p={0}>
                    {filteredReports.length === 0 ? (
                      <VStack spacing={4} justify="center" py={12}>
                        <Box bg="gray.200" borderRadius="full" p={4}>
                          <Search size={32} color="#9CA3AF" />
                        </Box>
                        <VStack spacing={2}>
                          <Heading size="md" color="gray.600">No reports found</Heading>
                          <Text color="gray.500">Try adjusting your search or filters</Text>
                        </VStack>
                      </VStack>
                    ) : (
                      <TableContainer>
                        <Table variant="simple" size="md">
                          <Thead bg={useColorModeValue("gray.50", "gray.700")}>
                            <Tr>
                              <Th fontSize="xs" fontWeight="semibold">Report Details</Th>
                              <Th fontSize="xs" fontWeight="semibold">Format & Size</Th>
                              <Th fontSize="xs" fontWeight="semibold">Generated</Th>
                              <Th fontSize="xs" fontWeight="semibold">Downloads</Th>
                              <Th fontSize="xs" fontWeight="semibold">Status</Th>
                              <Th fontSize="xs" fontWeight="semibold">Expires</Th>
                              <Th fontSize="xs" fontWeight="semibold">Actions</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {filteredReports.map((report) => (
                              <Tr 
                                key={report.id}
                                _hover={{ bg: useColorModeValue("gray.50", "gray.700") }}
                              >
                                <Td py={4}>
                                  <HStack spacing={3}>
                                    {getFormatIcon(report.format, 20)}
                                    <VStack align="start" spacing={1}>
                                      <Text fontWeight="semibold" fontSize="sm">
                                        {report.name}
                                      </Text>
                                      <Text fontSize="xs" color="gray.500">
                                        {report.description}
                                      </Text>
                                      <HStack spacing={2}>
                                        <Badge colorScheme="purple" variant="subtle" size="sm">
                                          {report.category}
                                        </Badge>
                                        <Badge variant="outline" size="sm">
                                          ID: {report.id}
                                        </Badge>
                                      </HStack>
                                    </VStack>
                                  </HStack>
                                </Td>
                                <Td py={4}>
                                  <VStack align="start" spacing={1}>
                                    <Text fontSize="sm" fontWeight="medium">
                                      {report.format}
                                    </Text>
                                    <Text fontSize="xs" color="gray.500">
                                      {formatFileSize(report.size)}
                                    </Text>
                                  </VStack>
                                </Td>
                                <Td py={4}>
                                  <VStack align="start" spacing={1}>
                                    <Text fontSize="sm" fontWeight="medium">
                                      {report.generatedDate}
                                    </Text>
                                    <Text fontSize="xs" color="gray.500">
                                      By {report.generatedBy}
                                    </Text>
                                  </VStack>
                                </Td>
                                <Td py={4}>
                                  <HStack spacing={1}>
                                    <Activity size={14} />
                                    <Text fontSize="sm" fontWeight="bold" color="purple.600">
                                      {report.downloads}
                                    </Text>
                                  </HStack>
                                </Td>
                                <Td py={4}>
                                  <VStack align="start" spacing={2}>
                                    <Badge 
                                      colorScheme={getStatusColor(report.status)}
                                      variant="solid"
                                      px={3}
                                      py={1}
                                    >
                                      {report.status}
                                    </Badge>
                                    {report.status === 'Generating' && (
                                      <Box w="100px">
                                        <Progress value={65} colorScheme="blue" size="sm" />
                                      </Box>
                                    )}
                                  </VStack>
                                </Td>
                                <Td py={4}>
                                  <VStack align="start" spacing={1}>
                                    <Text fontSize="sm" fontWeight="medium">
                                      {report.expiry}
                                    </Text>
                                    <Badge 
                                      size="xs" 
                                      colorScheme={new Date(report.expiry) > new Date() ? 'green' : 'red'}
                                      variant="subtle"
                                    >
                                      {new Date(report.expiry) > new Date() ? 'Valid' : 'Expired'}
                                    </Badge>
                                  </VStack>
                                </Td>
                                <Td py={4}>
                                  <HStack spacing={2}>
                                    <Button
                                      colorScheme="blue"
                                      size="sm"
                                      leftIcon={<Download size={14} />}
                                      isDisabled={report.status !== 'Ready'}
                                      onClick={() => handleDownload(report, 'report')}
                                    >
                                      Download
                                    </Button>
                                    <Menu>
                                      <MenuButton
                                        as={IconButton}
                                        icon={<MoreVertical size={16} />}
                                        variant="ghost"
                                        size="sm"
                                      />
                                      <MenuList>
                                        <MenuItem 
                                          icon={<Download size={16} />}
                                          onClick={() => handleDownload(report, 'report')}
                                          isDisabled={report.status !== 'Ready'}
                                        >
                                          Download
                                        </MenuItem>
                                        <MenuItem 
                                          icon={<Eye size={16} />}
                                          onClick={() => handlePreview(report)}
                                        >
                                          Preview
                                        </MenuItem>
                                        <MenuItem 
                                          icon={<Share2 size={16} />}
                                          onClick={() => handleShare(report)}
                                        >
                                          Share
                                        </MenuItem>
                                        <MenuItem 
                                          icon={<Archive size={16} />}
                                          onClick={() => handleArchive(report)}
                                        >
                                          Archive
                                        </MenuItem>
                                        <MenuItem 
                                          icon={<Trash2 size={16} />} 
                                          color="red.500"
                                          onClick={() => handleDelete(report)}
                                        >
                                          Delete
                                        </MenuItem>
                                      </MenuList>
                                    </Menu>
                                  </HStack>
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    )}
                  </CardBody>
                </Card>
              </TabPanel>

              {/* Templates Tab */}
              <TabPanel p={0}>
                <Text fontSize="lg" fontWeight="semibold" mb={4}>Document Templates</Text>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                  {mockTemplates.map((template) => (
                    <Card 
                      key={template.id} 
                      variant="outline" 
                      minH="200px" // Fixed minimum height
                      _hover={{
                        borderColor: "purple.400",
                        shadow: "md"
                      }}
                      transition="border-color 0.2s ease, box-shadow 0.2s ease"
                    >
                      <CardBody p={4} h="full">
                        <VStack align="stretch" spacing={3} h="full" justify="space-between">
                          <Box>
                            <HStack mb={3}>
                              {getFormatIcon(template.format)}
                              <Text fontWeight="semibold" fontSize="sm" noOfLines={1}>
                                {template.name}
                              </Text>
                            </HStack>
                            
                            <Text fontSize="xs" color="gray.600" noOfLines={3} mb={3}>
                              {template.description}
                            </Text>
                            
                            <HStack justify="space-between" mb={3}>
                              <VStack align="start" spacing={0}>
                                <Text fontSize="xs" color="gray.500">Size: {formatFileSize(template.size)}</Text>
                                <Text fontSize="xs" color="gray.500">Downloads: {template.downloads}</Text>
                              </VStack>
                              <Badge colorScheme="purple" variant="outline" size="sm">
                                {template.type}
                              </Badge>
                            </HStack>
                          </Box>
                          
                          <HStack mt="auto">
                            <Button 
                              size="sm" 
                              leftIcon={<Download />} 
                              flex={1} 
                              colorScheme="purple"
                              onClick={() => handleDownload(template, 'template')}
                            >
                              Download
                            </Button>
                            <IconButton
                              icon={<Eye />}
                              size="sm"
                              variant="outline"
                              colorScheme="purple"
                              onClick={() => handlePreview(template)}
                            />
                          </HStack>
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>
              </TabPanel>

              {/* Backups Tab */}
              <TabPanel p={0}>
                <Text fontSize="lg" fontWeight="semibold" mb={4}>System Backups</Text>
                <TableContainer>
                  <Table variant="simple" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Backup Name</Th>
                        <Th>Type</Th>
                        <Th>Size</Th>
                        <Th>Date & Time</Th>
                        <Th>Status</Th>
                        <Th>Retention</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {mockBackups.map((backup) => (
                        <Tr key={backup.id}>
                          <Td>
                            <Text fontWeight="medium" fontSize="sm">{backup.name}</Text>
                          </Td>
                          <Td>
                            <Badge colorScheme="gray" variant="outline" size="sm">
                              {backup.type}
                            </Badge>
                          </Td>
                          <Td>
                            <Text fontSize="sm">{formatFileSize(backup.size)}</Text>
                          </Td>
                          <Td>
                            <Text fontSize="sm">{backup.date}</Text>
                          </Td>
                          <Td>
                            <VStack align="start" spacing={1}>
                              <Badge colorScheme={getStatusColor(backup.status)} variant="subtle" size="sm">
                                {backup.status}
                              </Badge>
                              {backup.status === 'In Progress' && (
                                <Progress value={45} colorScheme="blue" size="sm" w="80px" />
                              )}
                            </VStack>
                          </Td>
                          <Td>
                            <Text fontSize="sm" color="gray.600">{backup.retention}</Text>
                          </Td>
                          <Td>
                            <Menu>
                              <MenuButton
                                as={IconButton}
                                icon={<MoreVertical />}
                                variant="ghost"
                                size="sm"
                                isDisabled={backup.status !== 'Completed'}
                              />
                              <MenuList>
                                <MenuItem 
                                  icon={<Download size={16} />}
                                  onClick={() => handleDownload(backup, 'backup')}
                                >
                                  Download
                                </MenuItem>
                                <MenuItem 
                                  icon={<RefreshCw size={16} />}
                                  onClick={() => handleBackupRestore(backup)}
                                >
                                  Restore
                                </MenuItem>
                                <MenuItem 
                                  icon={<Eye size={16} />}
                                  onClick={() => handlePreview(backup)}
                                >
                                  View Details
                                </MenuItem>
                                <MenuItem 
                                  icon={<Trash2 size={16} />} 
                                  color="red.500"
                                  onClick={() => handleBackupDelete(backup.id)}
                                >
                                  Delete
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </TabPanel>

              {/* Bulk Actions Tab */}
              <TabPanel p={0}>
                <VStack spacing={6} align="stretch">
                  <Text fontSize="lg" fontWeight="semibold">Bulk Operations</Text>
                  
                  <Accordion allowToggle>
                    <AccordionItem>
                      <AccordionButton>
                        <Box flex="1" textAlign="left">
                          <Text fontWeight="medium">Scheduled Report Generation</Text>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel pb={4}>
                        <Text fontSize="sm" color="gray.600" mb={4}>
                          Configure automatic report generation schedules
                        </Text>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                          <Card variant="outline">
                            <CardBody>
                              <VStack align="stretch" spacing={3}>
                                <Text fontWeight="medium">Daily Operations Report</Text>
                                <Text fontSize="sm" color="gray.600">Auto-generated daily at 11:59 PM</Text>
                                <HStack justify="space-between">
                                  <Badge colorScheme="green">Active</Badge>
                                  <Button size="xs" variant="outline">Configure</Button>
                                </HStack>
                              </VStack>
                            </CardBody>
                          </Card>
                          
                          <Card variant="outline">
                            <CardBody>
                              <VStack align="stretch" spacing={3}>
                                <Text fontWeight="medium">Weekly Summary Report</Text>
                                <Text fontSize="sm" color="gray.600">Auto-generated every Sunday</Text>
                                <HStack justify="space-between">
                                  <Badge colorScheme="yellow">Pending</Badge>
                                  <Button size="xs" variant="outline">Configure</Button>
                                </HStack>
                              </VStack>
                            </CardBody>
                          </Card>
                        </SimpleGrid>
                      </AccordionPanel>
                    </AccordionItem>

                    <AccordionItem>
                      <AccordionButton>
                        <Box flex="1" textAlign="left">
                          <Text fontWeight="medium">Backup Management</Text>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel pb={4}>
                        <Text fontSize="sm" color="gray.600" mb={4}>
                          Manage automated backup schedules and retention policies
                        </Text>
                        <VStack spacing={4} align="stretch">
                          <HStack justify="space-between" p={4} border="1px" borderColor="gray.200" borderRadius="md">
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="medium">Database Backup</Text>
                              <Text fontSize="sm" color="gray.600">Daily at 2:00 AM</Text>
                            </VStack>
                            <HStack>
                              <Badge colorScheme="green">Active</Badge>
                              <Button size="sm" variant="outline">Configure</Button>
                            </HStack>
                          </HStack>
                          
                          <HStack justify="space-between" p={4} border="1px" borderColor="gray.200" borderRadius="md">
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="medium">Full System Backup</Text>
                              <Text fontSize="sm" color="gray.600">Weekly on Sundays</Text>
                            </VStack>
                            <HStack>
                              <Badge colorScheme="blue">In Progress</Badge>
                              <Button size="sm" variant="outline">Configure</Button>
                            </HStack>
                          </HStack>
                        </VStack>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CardBody>
      </Card>

      {/* Generate Report Modal */}
      <Modal isOpen={isGenerateOpen} onClose={onGenerateClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Generate New Report</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Report Type</FormLabel>
                <Select 
                  placeholder="Select report type"
                  value={reportForm.type}
                  onChange={(e) => setReportForm({...reportForm, type: e.target.value})}
                >
                  <option value="Patient">Patient Report</option>
                  <option value="Financial">Financial Report</option>
                  <option value="Inventory">Inventory Report</option>
                  <option value="Clinical">Clinical Report</option>
                  <option value="HR">HR Report</option>
                  <option value="Operations">Operations Report</option>
                </Select>
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Date Range</FormLabel>
                <HStack>
                  <Input 
                    type="date" 
                    value={reportForm.dateFrom}
                    onChange={(e) => setReportForm({...reportForm, dateFrom: e.target.value})}
                  />
                  <Text>to</Text>
                  <Input 
                    type="date" 
                    value={reportForm.dateTo}
                    onChange={(e) => setReportForm({...reportForm, dateTo: e.target.value})}
                  />
                </HStack>
              </FormControl>
              
              <FormControl>
                <FormLabel>Format</FormLabel>
                <Select 
                  value={reportForm.format}
                  onChange={(e) => setReportForm({...reportForm, format: e.target.value})}
                >
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="word">Word</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Include Sections</FormLabel>
                <CheckboxGroup 
                  value={reportForm.sections}
                  onChange={(sections) => setReportForm({...reportForm, sections})}
                >
                  <VStack align="start">
                    <Checkbox value="summary">Summary Statistics</Checkbox>
                    <Checkbox value="detailed">Detailed Data</Checkbox>
                    <Checkbox value="charts">Charts and Graphs</Checkbox>
                    <Checkbox value="recommendations">Recommendations</Checkbox>
                  </VStack>
                </CheckboxGroup>
              </FormControl>
            </VStack>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onGenerateClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              leftIcon={<BarChart3 />}
              onClick={handleGenerateReport}
            >
              Generate Report
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Report
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete "{selectedReport?.name}"? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Preview Modal */}
      <Modal isOpen={isPreviewOpen} onClose={onPreviewClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Preview: {selectedReport?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch" minH="500px">
              <Box bg="gray.50" p={6} borderRadius="md" textAlign="center">
                {getFormatIcon(selectedReport?.format || 'pdf', 48)}
                <Heading size="md" mt={4}>{selectedReport?.name}</Heading>
                <Text color="gray.600" mt={2}>{selectedReport?.description}</Text>
              </Box>
              
              <SimpleGrid columns={2} spacing={4}>
                <Box>
                  <Text fontWeight="semibold">Format:</Text>
                  <Text>{selectedReport?.format}</Text>
                </Box>
                <Box>
                  <Text fontWeight="semibold">Size:</Text>
                  <Text>{selectedReport?.size}</Text>
                </Box>
                <Box>
                  <Text fontWeight="semibold">Generated:</Text>
                  <Text>{selectedReport?.generatedDate}</Text>
                </Box>
                <Box>
                  <Text fontWeight="semibold">Generated By:</Text>
                  <Text>{selectedReport?.generatedBy}</Text>
                </Box>
              </SimpleGrid>
              
              <Box bg="blue.50" p={4} borderRadius="md" textAlign="center">
                <Text color="blue.600" fontWeight="semibold">
                  📄 Document preview would appear here in a real application
                </Text>
                <Text color="blue.500" fontSize="sm" mt={2}>
                  This is a demo preview showing document metadata
                </Text>
              </Box>
            </VStack>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onPreviewClose}>
              Close
            </Button>
            <Button 
              colorScheme="blue" 
              leftIcon={<Download />}
              onClick={() => {
                if (selectedReport) handleDownload(selectedReport);
                onPreviewClose();
              }}
            >
              Download
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Share Modal - WhatsApp Integration */}
      <Modal isOpen={isShareOpen} onClose={onShareClose} size="xl">
        <ModalOverlay />
        <ModalContent maxW="600px">
          <ModalHeader>
            <HStack spacing={3}>
              <MessageCircle color="#25D366" size={24} />
              <Text>Share via WhatsApp: {selectedReport?.name}</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={6} align="stretch">
              {/* Share Type Selection */}
              <FormControl>
                <FormLabel fontWeight="semibold">Share with:</FormLabel>
                <RadioGroup 
                  value={shareForm.shareType} 
                  onChange={(value) => setShareForm({...shareForm, shareType: value, selectedContacts: [], selectedGroup: ''})}
                >
                  <VStack align="start" spacing={2}>
                    <Radio value="individual" colorScheme="green">
                      <HStack>
                        <User size={16} />
                        <Text>Individual Contacts</Text>
                      </HStack>
                    </Radio>
                    <Radio value="group" colorScheme="green">
                      <HStack>
                        <Users size={16} />
                        <Text>WhatsApp Group</Text>
                      </HStack>
                    </Radio>
                    <Radio value="everyone" colorScheme="green">
                      <HStack>
                        <UserCheck size={16} />
                        <Text>Everyone (All Hospital Staff)</Text>
                      </HStack>
                    </Radio>
                  </VStack>
                </RadioGroup>
              </FormControl>

              {/* Search Bar */}
              {(shareForm.shareType === 'individual' || shareForm.shareType === 'group') && (
                <FormControl>
                  <FormLabel fontWeight="semibold">Search:</FormLabel>
                  <Input 
                    placeholder={shareForm.shareType === 'individual' ? "Search contacts..." : "Search groups..."}
                    value={shareForm.searchQuery}
                    onChange={(e) => setShareForm({...shareForm, searchQuery: e.target.value})}
                    leftElement={<Search size={16} />}
                  />
                </FormControl>
              )}

              {/* Individual Contacts Selection */}
              {shareForm.shareType === 'individual' && (
                <Box>
                  <Text fontWeight="semibold" mb={3}>Select Contacts:</Text>
                  <Box maxH="200px" overflowY="auto" border="1px" borderColor="gray.200" borderRadius="md" p={2}>
                    <VStack spacing={2} align="stretch">
                      {filteredContacts.map((contact) => (
                        <Box 
                          key={contact.id}
                          p={3}
                          bg={shareForm.selectedContacts.find(c => c.id === contact.id) ? "green.50" : "white"}
                          border="1px"
                          borderColor={shareForm.selectedContacts.find(c => c.id === contact.id) ? "green.200" : "gray.200"}
                          borderRadius="md"
                          cursor="pointer"
                          onClick={() => handleContactToggle(contact)}
                          _hover={{ bg: "green.25" }}
                        >
                          <HStack justify="space-between">
                            <HStack spacing={3}>
                              <Avatar size="sm" name={contact.name} bg="green.500" />
                              <VStack align="start" spacing={0}>
                                <Text fontWeight="medium" fontSize="sm">{contact.name}</Text>
                                <Text fontSize="xs" color="gray.600">{contact.role}</Text>
                                <HStack spacing={1}>
                                  <Phone size={12} />
                                  <Text fontSize="xs" color="gray.500">{contact.phone}</Text>
                                </HStack>
                              </VStack>
                            </HStack>
                            <ChakraCheckbox 
                              isChecked={shareForm.selectedContacts.find(c => c.id === contact.id) ? true : false}
                              colorScheme="green"
                              onChange={() => handleContactToggle(contact)}
                            />
                          </HStack>
                        </Box>
                      ))}
                    </VStack>
                  </Box>
                  
                  {shareForm.selectedContacts.length > 0 && (
                    <Box mt={3} p={3} bg="green.50" borderRadius="md">
                      <Text fontSize="sm" fontWeight="medium" color="green.700">
                        Selected ({shareForm.selectedContacts.length}):
                      </Text>
                      <Text fontSize="sm" color="green.600">
                        {shareForm.selectedContacts.map(c => c.name).join(', ')}
                      </Text>
                    </Box>
                  )}
                </Box>
              )}

              {/* Group Selection */}
              {shareForm.shareType === 'group' && (
                <Box>
                  <Text fontWeight="semibold" mb={3}>Select Group:</Text>
                  <Box maxH="200px" overflowY="auto" border="1px" borderColor="gray.200" borderRadius="md" p={2}>
                    <VStack spacing={2} align="stretch">
                      {filteredGroups.map((group) => (
                        <Box 
                          key={group.id}
                          p={3}
                          bg={shareForm.selectedGroup === group.id ? "green.50" : "white"}
                          border="1px"
                          borderColor={shareForm.selectedGroup === group.id ? "green.200" : "gray.200"}
                          borderRadius="md"
                          cursor="pointer"
                          onClick={() => setShareForm({...shareForm, selectedGroup: group.id})}
                          _hover={{ bg: "green.25" }}
                        >
                          <HStack justify="space-between">
                            <HStack spacing={3}>
                              <Box 
                                w={10} 
                                h={10} 
                                bg="green.100" 
                                borderRadius="full" 
                                display="flex" 
                                alignItems="center" 
                                justifyContent="center"
                                fontSize="lg"
                              >
                                {group.icon}
                              </Box>
                              <VStack align="start" spacing={0}>
                                <Text fontWeight="medium" fontSize="sm">{group.name}</Text>
                                <Text fontSize="xs" color="gray.600">{group.description}</Text>
                                <HStack spacing={4}>
                                  <HStack spacing={1}>
                                    <Users size={12} />
                                    <Text fontSize="xs" color="gray.500">{group.members} members</Text>
                                  </HStack>
                                  <Badge size="xs" colorScheme="green" variant="subtle">
                                    {group.category}
                                  </Badge>
                                </HStack>
                              </VStack>
                            </HStack>
                            <Radio 
                              isChecked={shareForm.selectedGroup === group.id}
                              colorScheme="green"
                              onChange={() => setShareForm({...shareForm, selectedGroup: group.id})}
                            />
                          </HStack>
                        </Box>
                      ))}
                    </VStack>
                  </Box>
                </Box>
              )}

              {/* Everyone confirmation */}
              {shareForm.shareType === 'everyone' && (
                <Box p={4} bg="orange.50" borderRadius="md" borderLeft="4px" borderLeftColor="orange.400">
                  <HStack spacing={2} mb={2}>
                    <UserCheck color="#D69E2E" size={16} />
                    <Text fontWeight="semibold" color="orange.700">Send to All Hospital Staff</Text>
                  </HStack>
                  <Text fontSize="sm" color="orange.600">
                    This will send the document to all registered WhatsApp contacts in the hospital system.
                    Please ensure this is appropriate for the document being shared.
                  </Text>
                </Box>
              )}

              {/* Permissions */}
              <FormControl>
                <FormLabel fontWeight="semibold">Permissions:</FormLabel>
                <Select 
                  value={shareForm.permissions}
                  onChange={(e) => setShareForm({...shareForm, permissions: e.target.value})}
                >
                  <option value="view">View Only</option>
                  <option value="download">View & Download</option>
                  <option value="edit">View, Download & Edit</option>
                </Select>
              </FormControl>
              
              {/* Message */}
              <FormControl>
                <FormLabel fontWeight="semibold">Message (Optional):</FormLabel>
                <Textarea 
                  placeholder="Add a personal message to accompany the document..."
                  value={shareForm.message}
                  onChange={(e) => setShareForm({...shareForm, message: e.target.value})}
                  resize="vertical"
                  minH="100px"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onShareClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="green"
              leftIcon={<MessageCircle />}
              onClick={handleSubmitShare}
              bg="#25D366"
              _hover={{ bg: "#128C7E" }}
            >
              Share via WhatsApp
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DownloadCenter;
