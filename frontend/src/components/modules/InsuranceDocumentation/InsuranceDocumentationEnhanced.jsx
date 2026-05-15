import React, { useState } from 'react';
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Text,
  Button,
  HStack,
  VStack,
  Flex,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
  Badge,
  useColorModeValue,
  Select,
  InputGroup,
  InputLeftElement,
  Avatar,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  SimpleGrid,
  Progress,
  Divider,
  Alert,
  AlertIcon,
  useToast,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Circle,
  Grid,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stack,
  Center,
  Tag,
  TagLabel,
  Switch,
  Container
} from '@chakra-ui/react';
import {
  FileText,
  Download,
  Eye,
  Search,
  Filter,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle,
  Shield,
  FileCheck,
  Receipt,
  Pill,
  Building,
  Calendar,
  User,
  Phone,
  Mail,
  CreditCard,
  Send,
  MessageCircle,
  Share2,
  Plus,
  MoreVertical,
  TrendingUp,
  Activity,
  DollarSign,
  Users,
  CheckCircle2,
  Archive,
  Upload,
  Star,
  Award,
  BarChart3,
  Target,
  Zap,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

const InsuranceDocumentationEnhanced = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [generatingDocs, setGeneratingDocs] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [autoGenerate, setAutoGenerate] = useState(false);
  const patientsPerPage = 12;

  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const { isOpen: isGenerateOpen, onOpen: onGenerateOpen, onClose: onGenerateClose } = useDisclosure();
  const { isOpen: isStatsOpen, onOpen: onStatsOpen, onClose: onStatsClose } = useDisclosure();
  const { isOpen: isBulkOpen, onOpen: onBulkOpen, onClose: onBulkClose } = useDisclosure();
  const toast = useToast();

  // Enhanced color scheme
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const primaryBlue = useColorModeValue('blue.500', 'blue.300');
  const primaryGreen = useColorModeValue('green.500', 'green.300');
  const gradientBg = useColorModeValue(
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)'
  );

  // Enhanced mock data
  const [insurancePatients, setInsurancePatients] = useState([
    {
      id: 1,
      caseId: 7501,
      patientName: 'Radhika Sharma',
      patientAge: 45,
      patientGender: 'Female',
      patientPhone: '+91 9876543210',
      patientEmail: 'radhika.sharma@email.com',
      patientAddress: '123, Ayurveda Street, Mumbai, Maharashtra',
      insuranceProvider: 'Star Health Insurance',
      policyNumber: 'SHI/MUM/2024/789456',
      treatmentType: 'Panchakarma Therapy (Virechana & Basti)',
      admissionDate: '2024-08-15',
      dischargeDate: '2024-08-28',
      totalBill: 45000,
      doctorName: 'Dr. Ramesh Ayurveda',
      ailments: 'Chronic joint pain, digestive disorders',
      prakriti: 'Vata-Pitta',
      status: 'ready_for_documentation',
      documents: {
        dischargeSummary: { generated: false, url: null },
        treatmentSummary: { generated: false, url: null },
        hospitalBill: { generated: false, url: null },
        pharmacyBills: { generated: false, url: null },
        hospitalRegistration: { generated: true, url: '/docs/hospital-reg.pdf' }
      }
    },
    {
      id: 2,
      caseId: 7502,
      patientName: 'Arjun Patel',
      patientAge: 38,
      patientGender: 'Male',
      patientPhone: '+91 9876543211',
      patientEmail: 'arjun.patel@email.com',
      patientAddress: '456, Wellness Colony, Pune, Maharashtra',
      insuranceProvider: 'HDFC ERGO Health',
      policyNumber: 'HDFC/PUN/2024/123789',
      treatmentType: 'Ayurvedic Detox Program (Shodhana Karma)',
      admissionDate: '2024-08-20',
      dischargeDate: '2024-08-29',
      totalBill: 32000,
      doctorName: 'Dr. Sunita Herbs',
      ailments: 'Metabolic disorders, stress management',
      prakriti: 'Kapha-Vata',
      status: 'documentation_in_progress',
      documents: {
        dischargeSummary: { generated: true, url: '/docs/discharge-7502.pdf' },
        treatmentSummary: { generated: true, url: '/docs/treatment-7502.pdf' },
        hospitalBill: { generated: false, url: null },
        pharmacyBills: { generated: false, url: null },
        hospitalRegistration: { generated: true, url: '/docs/hospital-reg.pdf' }
      }
    },
    {
      id: 3,
      caseId: 7503,
      patientName: 'Meera Reddy',
      patientAge: 52,
      patientGender: 'Female',
      patientPhone: '+91 9876543212',
      patientEmail: 'meera.reddy@email.com',
      patientAddress: '789, Herbal Gardens, Hyderabad, Telangana',
      insuranceProvider: 'New India Assurance',
      policyNumber: 'NIA/HYD/2024/456123',
      treatmentType: 'Arthritic Joint Care (Abhyanga & Pizhichil)',
      admissionDate: '2024-08-10',
      dischargeDate: '2024-08-25',
      totalBill: 28000,
      doctorName: 'Dr. Vishnu Panchakarma',
      ailments: 'Rheumatoid arthritis, inflammation',
      prakriti: 'Vata dominant',
      status: 'documentation_complete',
      documents: {
        dischargeSummary: { generated: true, url: '/docs/discharge-7503.pdf' },
        treatmentSummary: { generated: true, url: '/docs/treatment-7503.pdf' },
        hospitalBill: { generated: true, url: '/docs/bill-7503.pdf' },
        pharmacyBills: { generated: true, url: '/docs/pharmacy-7503.pdf' },
        hospitalRegistration: { generated: true, url: '/docs/hospital-reg.pdf' }
      }
    },
    {
      id: 4,
      caseId: 7504,
      patientName: 'Rajesh Kumar',
      patientAge: 41,
      patientGender: 'Male',
      patientPhone: '+91 9876543213',
      patientEmail: 'rajesh.kumar@email.com',
      patientAddress: '321, Ayush Nagar, Jaipur, Rajasthan',
      insuranceProvider: 'Oriental Insurance',
      policyNumber: 'ORI/JAI/2024/789012',
      treatmentType: 'Skin Disorder Treatment (Raktamokshana)',
      admissionDate: '2024-08-18',
      dischargeDate: '2024-08-30',
      totalBill: 38000,
      doctorName: 'Dr. Lakshmi Skin',
      ailments: 'Chronic eczema, skin allergies',
      prakriti: 'Pitta-Kapha',
      status: 'submitted_to_insurance',
      documents: {
        dischargeSummary: { generated: true, url: '/docs/discharge-7504.pdf' },
        treatmentSummary: { generated: true, url: '/docs/treatment-7504.pdf' },
        hospitalBill: { generated: true, url: '/docs/bill-7504.pdf' },
        pharmacyBills: { generated: true, url: '/docs/pharmacy-7504.pdf' },
        hospitalRegistration: { generated: true, url: '/docs/hospital-reg.pdf' }
      }
    }
  ]);

  // Statistics calculation
  const getStatistics = () => {
    const total = insurancePatients.length;
    const ready = insurancePatients.filter(p => p.status === 'ready_for_documentation').length;
    const inProgress = insurancePatients.filter(p => p.status === 'documentation_in_progress').length;
    const complete = insurancePatients.filter(p => p.status === 'documentation_complete').length;
    const submitted = insurancePatients.filter(p => p.status === 'submitted_to_insurance').length;
    
    const totalValue = insurancePatients.reduce((sum, p) => sum + p.totalBill, 0);
    const avgValue = totalValue / total;
    const completionRate = ((complete + submitted) / total * 100).toFixed(1);
    const monthlyGrowth = 12.5;
    
    return { total, ready, inProgress, complete, submitted, totalValue, avgValue, completionRate, monthlyGrowth };
  };

  const statistics = getStatistics();

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'ready_for_documentation': return 'orange';
      case 'documentation_in_progress': return 'blue';
      case 'documentation_complete': return 'green';
      case 'submitted_to_insurance': return 'purple';
      default: return 'gray';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ready_for_documentation': return 'Ready';
      case 'documentation_in_progress': return 'In Progress';
      case 'documentation_complete': return 'Complete';
      case 'submitted_to_insurance': return 'Submitted';
      default: return 'Unknown';
    }
  };

  const calculateProgress = (documents) => {
    const total = documentTypes.length;
    const generated = documentTypes.filter(doc => documents[doc.key]?.generated).length;
    return (generated / total) * 100;
  };

  // Document types
  const documentTypes = [
    { key: 'dischargeSummary', label: 'Discharge Summary', icon: FileText },
    { key: 'treatmentSummary', label: 'Treatment Summary', icon: Pill },
    { key: 'hospitalBill', label: 'Hospital Bill', icon: Receipt },
    { key: 'pharmacyBills', label: 'Pharmacy Bills', icon: CreditCard },
    { key: 'hospitalRegistration', label: 'Hospital Registration', icon: Building }
  ];

  // Filtering and pagination
  const getFilteredPatients = () => {
    let filtered = insurancePatients;
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(patient => patient.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(patient =>
        patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.caseId.toString().includes(searchTerm) ||
        patient.insuranceProvider.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.policyNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredPatients = getFilteredPatients();
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * patientsPerPage,
    currentPage * patientsPerPage
  );

  // Event handlers
  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
    onViewOpen();
  };

  const handleGenerateDocuments = (patient) => {
    setSelectedPatient(patient);
    setGeneratingDocs(true);
    
    // Simulate document generation
    setTimeout(() => {
      setInsurancePatients(prev => prev.map(p => 
        p.id === patient.id 
          ? {
              ...p,
              status: 'documentation_complete',
              documents: Object.keys(p.documents).reduce((acc, key) => ({
                ...acc,
                [key]: { generated: true, url: `/docs/${key}-${p.caseId}.pdf` }
              }), {})
            }
          : p
      ));
      
      setGeneratingDocs(false);
      onGenerateClose();
      
      toast({
        title: 'Documents Generated Successfully',
        description: `All insurance documents have been generated for ${patient.patientName}`,
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
    }, 3000);
  };

  const handleShareAllDocuments = (patient) => {
    const generatedDocs = documentTypes.filter(doc => patient.documents[doc.key]?.generated);
    
    if (generatedDocs.length === 0) {
      toast({
        title: 'No Documents Available',
        description: 'Please generate documents first before sharing.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: 'Documents Shared via WhatsApp',
      description: `Insurance documentation package shared for ${patient.patientName}`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="full" p={0}>
      <Box p={6} minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
        {/* Enhanced Header */}
        <Card 
          bg={gradientBg}
          color="white" 
          mb={6}
          borderRadius="2xl" 
          overflow="hidden"
          border="none"
          boxShadow="xl"
        >
          <CardBody p={8}>
            <Flex justify="space-between" align="center" direction={{ base: 'column', lg: 'row' }} gap={4}>
              <VStack align={{ base: 'center', lg: 'start' }} spacing={2}>
                <HStack>
                  <Shield size={32} />
                  <Heading size="xl" fontWeight="bold">Insurance Documentation Portal</Heading>
                </HStack>
                <Text opacity={0.9} fontSize="lg" textAlign={{ base: 'center', lg: 'left' }}>
                  Streamline insurance claim documentation with AI-powered automation
                </Text>
                <HStack spacing={4} mt={2}>
                  <HStack>
                    <CheckCircle size={16} />
                    <Text fontSize="sm">Auto-Generated Documents</Text>
                  </HStack>
                  <HStack>
                    <Zap size={16} />
                    <Text fontSize="sm">Instant Processing</Text>
                  </HStack>
                  <HStack>
                    <Award size={16} />
                    <Text fontSize="sm">99.5% Accuracy</Text>
                  </HStack>
                </HStack>
              </VStack>
              
              <VStack spacing={3}>
                <HStack spacing={3}>
                  <Button 
                    leftIcon={<Plus />} 
                    colorScheme="whiteAlpha" 
                    variant="solid"
                    size="lg"
                    onClick={onBulkOpen}
                  >
                    Bulk Generate
                  </Button>
                  <Button 
                    leftIcon={<BarChart3 />} 
                    variant="outline"
                    colorScheme="whiteAlpha"
                    size="lg"
                    onClick={onStatsOpen}
                  >
                    Analytics
                  </Button>
                </HStack>
                <Switch 
                  colorScheme="orange" 
                  isChecked={autoGenerate}
                  onChange={(e) => setAutoGenerate(e.target.checked)}
                />
                <Text fontSize="sm" opacity={0.9}>Auto-Generate on Discharge</Text>
              </VStack>
            </Flex>
          </CardBody>
        </Card>

        {/* Statistics Dashboard */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6} mb={6}>
          <Card bg={cardBg} border="1px" borderColor={borderColor} borderRadius="xl" 
                _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }} transition="all 0.3s">
            <CardBody>
              <Stat>
                <StatLabel color={textColor} fontSize="sm">Total Claims</StatLabel>
                <HStack justify="space-between" align="end">
                  <StatNumber fontSize="3xl" fontWeight="bold" color={primaryBlue}>
                    {statistics.total}
                  </StatNumber>
                  <Box p={2} bg="blue.50" borderRadius="lg">
                    <Users size={24} color="#3182CE" />
                  </Box>
                </HStack>
                <StatHelpText>
                  <StatArrow type="increase" />
                  {statistics.monthlyGrowth}% from last month
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} border="1px" borderColor={borderColor} borderRadius="xl"
                _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }} transition="all 0.3s">
            <CardBody>
              <Stat>
                <StatLabel color={textColor} fontSize="sm">Claim Value</StatLabel>
                <HStack justify="space-between" align="end">
                  <StatNumber fontSize="3xl" fontWeight="bold" color={primaryGreen}>
                    ₹{Math.round(statistics.totalValue / 1000)}K
                  </StatNumber>
                  <Box p={2} bg="green.50" borderRadius="lg">
                    <DollarSign size={24} color="#38A169" />
                  </Box>
                </HStack>
                <StatHelpText>
                  Avg: ₹{Math.round(statistics.avgValue / 1000)}K per claim
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} border="1px" borderColor={borderColor} borderRadius="xl"
                _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }} transition="all 0.3s">
            <CardBody>
              <Stat>
                <StatLabel color={textColor} fontSize="sm">Completion Rate</StatLabel>
                <HStack justify="space-between" align="end">
                  <StatNumber fontSize="3xl" fontWeight="bold" color="purple.500">
                    {statistics.completionRate}%
                  </StatNumber>
                  <Box p={2} bg="purple.50" borderRadius="lg">
                    <Target size={24} color="#805AD5" />
                  </Box>
                </HStack>
                <StatHelpText>
                  {statistics.complete + statistics.submitted} of {statistics.total} completed
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={cardBg} border="1px" borderColor={borderColor} borderRadius="xl"
                _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }} transition="all 0.3s">
            <CardBody>
              <Stat>
                <StatLabel color={textColor} fontSize="sm">Processing</StatLabel>
                <HStack justify="space-between" align="end">
                  <StatNumber fontSize="3xl" fontWeight="bold" color="orange.500">
                    {statistics.inProgress}
                  </StatNumber>
                  <Box p={2} bg="orange.50" borderRadius="lg">
                    <Activity size={24} color="#DD6B20" />
                  </Box>
                </HStack>
                <StatHelpText>
                  {statistics.ready} awaiting documentation
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </Grid>

        {/* Search and Filters */}
        <Card bg={cardBg} border="1px" borderColor={borderColor} mb={6} borderRadius="xl" boxShadow="lg">
          <CardBody>
            <VStack spacing={4}>
              <Flex gap={4} direction={{ base: 'column', lg: 'row' }} align="center" w="full">
                <InputGroup flex={2}>
                  <InputLeftElement>
                    <Search size={20} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search patients, case IDs, insurance providers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    size="lg"
                    borderRadius="xl"
                  />
                </InputGroup>
                
                <Select
                  placeholder="Filter by Status"
                  w={{ base: 'full', lg: '250px' }}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  size="lg"
                  borderRadius="xl"
                >
                  <option value="all">All Status</option>
                  <option value="ready_for_documentation">📋 Ready</option>
                  <option value="documentation_in_progress">⏳ In Progress</option>
                  <option value="documentation_complete">✅ Complete</option>
                  <option value="submitted_to_insurance">📤 Submitted</option>
                </Select>

                <HStack spacing={2}>
                  <IconButton
                    icon={viewMode === 'grid' ? <BarChart3 /> : <Activity />}
                    size="lg"
                    variant="outline"
                    onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
                    borderRadius="xl"
                  />
                  <IconButton
                    icon={<RefreshCw />}
                    size="lg"
                    variant="outline"
                    onClick={() => window.location.reload()}
                    borderRadius="xl"
                  />
                </HStack>
              </Flex>

              <HStack spacing={6} divider={<Divider orientation="vertical" />}>
                <HStack>
                  <Circle size="12px" bg="orange.400" />
                  <Text fontSize="sm" color={textColor}>
                    <strong>{statistics.ready}</strong> Ready
                  </Text>
                </HStack>
                <HStack>
                  <Circle size="12px" bg="blue.400" />
                  <Text fontSize="sm" color={textColor}>
                    <strong>{statistics.inProgress}</strong> In Progress
                  </Text>
                </HStack>
                <HStack>
                  <Circle size="12px" bg="green.400" />
                  <Text fontSize="sm" color={textColor}>
                    <strong>{statistics.complete}</strong> Complete
                  </Text>
                </HStack>
                <HStack>
                  <Circle size="12px" bg="purple.400" />
                  <Text fontSize="sm" color={textColor}>
                    <strong>{statistics.submitted}</strong> Submitted
                  </Text>
                </HStack>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Enhanced Grid View */}
        <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={6}>
          {paginatedPatients.map((patient) => (
            <Card
              key={patient.id}
              bg={cardBg}
              border="1px"
              borderColor={borderColor}
              borderRadius="xl"
              overflow="hidden"
              _hover={{ 
                transform: 'translateY(-4px)', 
                boxShadow: 'xl',
                borderColor: primaryBlue 
              }}
              transition="all 0.3s"
              position="relative"
            >
              <Box
                position="absolute"
                top={4}
                right={4}
                zIndex={1}
              >
                <Badge
                  colorScheme={getStatusColor(patient.status)}
                  borderRadius="full"
                  px={3}
                  py={1}
                  fontSize="xs"
                  fontWeight="bold"
                >
                  {getStatusBadge(patient.status)}
                </Badge>
              </Box>

              <CardBody p={6}>
                <VStack align="stretch" spacing={4}>
                  {/* Patient Header */}
                  <HStack spacing={4}>
                    <Avatar
                      name={patient.patientName}
                      size="lg"
                      bg={gradientBg}
                      color="white"
                    />
                    <VStack align="start" spacing={1} flex={1}>
                      <Heading size="md" noOfLines={1}>
                        {patient.patientName}
                      </Heading>
                      <HStack spacing={4} fontSize="sm" color={textColor}>
                        <Text>#{patient.caseId}</Text>
                        <Text>{patient.patientAge}y {patient.patientGender.charAt(0)}</Text>
                      </HStack>
                      <Tag size="sm" colorScheme="blue" borderRadius="full">
                        {patient.prakriti}
                      </Tag>
                    </VStack>
                  </HStack>

                  <Divider />

                  {/* Treatment Info */}
                  <VStack align="stretch" spacing={3}>
                    <HStack>
                      <Pill size={16} color={primaryBlue} />
                      <Text fontSize="sm" fontWeight="medium" noOfLines={2}>
                        {patient.treatmentType}
                      </Text>
                    </HStack>
                    
                    <SimpleGrid columns={2} spacing={3}>
                      <VStack align="start" spacing={1}>
                        <Text fontSize="xs" color={textColor} fontWeight="semibold">
                          DURATION
                        </Text>
                        <Text fontSize="sm" fontWeight="medium">
                          {Math.ceil((new Date(patient.dischargeDate) - new Date(patient.admissionDate)) / (1000 * 60 * 60 * 24))} days
                        </Text>
                      </VStack>
                      
                      <VStack align="start" spacing={1}>
                        <Text fontSize="xs" color={textColor} fontWeight="semibold">
                          AMOUNT
                        </Text>
                        <Text fontSize="sm" fontWeight="bold" color={primaryGreen}>
                          ₹{patient.totalBill.toLocaleString()}
                        </Text>
                      </VStack>
                    </SimpleGrid>

                    <VStack align="stretch" spacing={2}>
                      <HStack justify="space-between">
                        <Text fontSize="xs" color={textColor} fontWeight="semibold">
                          INSURANCE
                        </Text>
                        <Shield size={14} color={primaryBlue} />
                      </HStack>
                      <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                        {patient.insuranceProvider}
                      </Text>
                      <Text fontSize="xs" color={textColor} noOfLines={1}>
                        {patient.policyNumber}
                      </Text>
                    </VStack>
                  </VStack>

                  <Divider />

                  {/* Document Progress */}
                  <VStack align="stretch" spacing={2}>
                    <HStack justify="space-between">
                      <Text fontSize="xs" color={textColor} fontWeight="semibold">
                        DOCUMENTS
                      </Text>
                      <Text fontSize="xs" color={textColor}>
                        {Object.values(patient.documents).filter(doc => doc.generated).length}/5
                      </Text>
                    </HStack>
                    
                    <Progress 
                      value={calculateProgress(patient.documents)} 
                      colorScheme={getStatusColor(patient.status)}
                      size="sm" 
                      borderRadius="full"
                    />
                  </VStack>

                  {/* Actions */}
                  <HStack spacing={2} mt={4}>
                    <Button
                      leftIcon={<Eye />}
                      size="sm"
                      variant="outline"
                      colorScheme="blue"
                      flex={1}
                      onClick={() => handleViewDetails(patient)}
                      borderRadius="lg"
                    >
                      View
                    </Button>
                    
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        icon={<MoreVertical />}
                        size="sm"
                        variant="outline"
                        borderRadius="lg"
                      />
                      <MenuList>
                        <MenuItem 
                          icon={<FileText />} 
                          onClick={() => handleGenerateDocuments(patient)}
                        >
                          Generate Documents
                        </MenuItem>
                        <MenuItem 
                          icon={<MessageCircle />} 
                          onClick={() => handleShareAllDocuments(patient)}
                        >
                          Share WhatsApp
                        </MenuItem>
                        <MenuItem icon={<Send />}>
                          Submit Insurance
                        </MenuItem>
                        <MenuDivider />
                        <MenuItem icon={<Archive />}>
                          Archive
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        {/* Pagination */}
        {filteredPatients.length > patientsPerPage && (
          <Card bg={cardBg} border="1px" borderColor={borderColor} mt={6} borderRadius="xl">
            <CardBody>
              <Flex justify="space-between" align="center">
                <Text color={textColor} fontSize="sm">
                  Showing {(currentPage - 1) * patientsPerPage + 1} to{' '}
                  {Math.min(currentPage * patientsPerPage, filteredPatients.length)} of{' '}
                  {filteredPatients.length} patients
                </Text>
                <HStack>
                  <IconButton
                    icon={<ArrowLeft />}
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    isDisabled={currentPage === 1}
                  />
                  <Text fontSize="sm">
                    {currentPage} / {Math.ceil(filteredPatients.length / patientsPerPage)}
                  </Text>
                  <IconButton
                    icon={<ArrowRight />}
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(Math.ceil(filteredPatients.length / patientsPerPage), currentPage + 1))}
                    isDisabled={currentPage === Math.ceil(filteredPatients.length / patientsPerPage)}
                  />
                </HStack>
              </Flex>
            </CardBody>
          </Card>
        )}

        {/* Modals */}
        <Modal isOpen={isGenerateOpen} onClose={onGenerateClose} closeOnOverlayClick={false}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Generate Insurance Documents</ModalHeader>
            <ModalBody>
              {selectedPatient && (
                <VStack spacing={4}>
                  <Alert status="info" borderRadius="lg">
                    <AlertIcon />
                    <Box>
                      <Text fontWeight="medium">
                        Generate all documents for {selectedPatient.patientName}?
                      </Text>
                      <Text fontSize="sm" mt={1}>
                        This will create all required insurance documents.
                      </Text>
                    </Box>
                  </Alert>

                  {generatingDocs && (
                    <VStack spacing={3}>
                      <Progress size="sm" isIndeterminate w="100%" colorScheme="blue" />
                      <Text fontSize="sm" color={textColor}>
                        Generating documents... Please wait.
                      </Text>
                    </VStack>
                  )}
                </VStack>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="outline" mr={3} onClick={onGenerateClose} isDisabled={generatingDocs}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={() => handleGenerateDocuments(selectedPatient)}
                isLoading={generatingDocs}
                loadingText="Generating..."
              >
                Generate All Documents
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Container>
  );
};

export default InsuranceDocumentationEnhanced;
