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
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Progress,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
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
  SimpleGrid,
  Tooltip,
  Icon,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider,
  CircularProgress,
  CircularProgressLabel,
  Link,
  FormHelperText,
  Wrap,
  WrapItem,
  CardHeader
} from '@chakra-ui/react';
import {
  Shield,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Eye,
  Phone,
  Mail,
  Calendar,
  FileText,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Building,
  Globe,
  Award,
  Download,
  Upload,
  RefreshCw,
  BarChart,
  PieChart,
  Activity,
  MapPin,
  Star,
  Zap,
  LayoutGrid,
  Target
} from 'lucide-react';

const TPAManagement = ({ title = "TPA Management", showAddButton = true }) => {
  console.log("TPA Management component rendering..."); // Debug log
  

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('table');
  const [selectedTPA, setSelectedTPA] = useState(null);

  // Modal states
  const viewTPAModal = useDisclosure();
  const addTPAModal = useDisclosure();
  const editTPAModal = useDisclosure();
  const claimsModal = useDisclosure();
  const paymentHistoryModal = useDisclosure();

  // Hooks
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Filtered data
  const filteredTPAs = mockTPACompanies.filter(tpa => {
    const matchesSearch = tpa.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tpa.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tpa.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || tpa.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || tpa.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Helper functions
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'green';
      case 'inactive': return 'red';
      case 'expired': return 'gray';
      case 'pending': return 'orange';
      default: return 'gray';
    }
  };

  const getApprovalRateColor = (rate) => {
    if (rate >= 90) return 'green';
    if (rate >= 80) return 'yellow';
    return 'red';
  };

  const getGrowthColor = (growth) => {
    if (growth > 0) return 'green';
    if (growth === 0) return 'gray';
    return 'red';
  };

  // Event handlers
  const handleViewTPA = (tpa) => {
    setSelectedTPA(tpa);
    viewTPAModal.onOpen();
  };

  const handleEditTPA = (tpa) => {
    setSelectedTPA(tpa);
    editTPAModal.onOpen();
  };

  const handleViewClaims = (tpa) => {
    setSelectedTPA(tpa);
    claimsModal.onOpen();
  };

  const handlePaymentHistory = (tpa) => {
    setSelectedTPA(tpa);
    paymentHistoryModal.onOpen();
  };

  const handleExport = (format) => {
    toast({
      title: `Exporting to ${format.toUpperCase()}`,
      description: "Export started successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const onAddModalOpen = () => {
    addTPAModal.onOpen();
  };

  // Calculate stats
  const totalTPAs = mockTPACompanies.length;
  const activeTPAs = mockTPACompanies.filter(tpa => tpa.status === 'Active').length;
  const totalClaims = mockTPACompanies.reduce((sum, tpa) => sum + tpa.claimsProcessed, 0);
  const avgApprovalRate = Math.round(mockTPACompanies.reduce((sum, tpa) => sum + tpa.approvalRate, 0) / totalTPAs);

  return (
    <Box p={6}>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={8}>
        <Box>
          <Text fontSize="3xl" fontWeight="bold" bgGradient="linear(to-r, blue.600, purple.600)" bgClip="text">
            {title}
          </Text>
          <Text color="gray.600" fontSize="lg">
            Manage Third Party Administrator and insurance partnerships
          </Text>
        </Box>
        {showAddButton && (
          <Button 
            colorScheme="blue" 
            leftIcon={<Plus size={20} />}
            size="lg"
            onClick={onAddModalOpen}
          >
            Add TPA Partner
          </Button>
        )}
      </Flex>

      {/* Stats Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <Card bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" color="white">
          <CardBody>
            <HStack justify="space-between">
              <VStack align="start" spacing={2}>
                <Text fontSize="sm" opacity={0.9}>Total TPA Partners</Text>
                <Text fontSize="3xl" fontWeight="bold">{totalTPAs}</Text>
                <HStack>
                  <Icon as={TrendingUp} size={16} />
                  <Text fontSize="sm">+2 this month</Text>
                </HStack>
              </VStack>
              <Icon as={Shield} size={48} opacity={0.8} />
            </HStack>
          </CardBody>
        </Card>

        <Card bg="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" color="white">
          <CardBody>
            <HStack justify="space-between">
              <VStack align="start" spacing={2}>
                <Text fontSize="sm" opacity={0.9}>Active Partners</Text>
                <Text fontSize="3xl" fontWeight="bold">{activeTPAs}</Text>
                <HStack>
                  <Icon as={CheckCircle} size={16} />
                  <Text fontSize="sm">{Math.round((activeTPAs/totalTPAs)*100)}% active</Text>
                </HStack>
              </VStack>
              <Icon as={Activity} size={48} opacity={0.8} />
            </HStack>
          </CardBody>
        </Card>

        <Card bg="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" color="white">
          <CardBody>
            <HStack justify="space-between">
              <VStack align="start" spacing={2}>
                <Text fontSize="sm" opacity={0.9}>Total Claims</Text>
                <Text fontSize="3xl" fontWeight="bold">{totalClaims}</Text>
                <HStack>
                  <Icon as={FileText} size={16} />
                  <Text fontSize="sm">Last 30 days</Text>
                </HStack>
              </VStack>
              <Icon as={BarChart} size={48} opacity={0.8} />
            </HStack>
          </CardBody>
        </Card>

        <Card bg="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" color="white">
          <CardBody>
            <HStack justify="space-between">
              <VStack align="start" spacing={2}>
                <Text fontSize="sm" opacity={0.9}>Avg Approval Rate</Text>
                <Text fontSize="3xl" fontWeight="bold">{avgApprovalRate}%</Text>
                <HStack>
                  <Icon as={Award} size={16} />
                  <Text fontSize="sm">Industry leading</Text>
                </HStack>
              </VStack>
              <Icon as={Target} size={48} opacity={0.8} />
            </HStack>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Filters and Search */}
      <Card bg={cardBg} border="1px" borderColor={borderColor} mb={6}>
        <CardBody>
          <HStack spacing={4} wrap="wrap">
            <HStack>
              <Icon as={Search} color="gray.400" />
              <Input
                placeholder="Search TPAs, contacts, or IDs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                w="300px"
              />
            </HStack>
            
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              w="200px"
            >
              <option value="all">All Types</option>
              <option value="Health Insurance">Health Insurance</option>
              <option value="General Insurance">General Insurance</option>
              <option value="Life Insurance">Life Insurance</option>
              <option value="Motor Insurance">Motor Insurance</option>
            </Select>

            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              w="150px"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Expired">Expired</option>
              <option value="Pending">Pending</option>
            </Select>

            <Button
              variant="outline"
              leftIcon={<Filter />}
              onClick={() => {
                setSearchTerm('');
                setTypeFilter('all');
                setStatusFilter('all');
              }}
            >
              Clear Filters
            </Button>

            <Button
              variant="outline"
              leftIcon={viewMode === 'table' ? <BarChart /> : <LayoutGrid />}
              onClick={() => setViewMode(viewMode === 'table' ? 'card' : 'table')}
            >
              {viewMode === 'table' ? 'Card View' : 'Table View'}
            </Button>
          </HStack>
        </CardBody>
      </Card>

      {/* TPA Display */}
      <Card bg={cardBg} border="1px" borderColor={borderColor}>
        <CardBody>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>TPA Details</Th>
                  <Th>Contact</Th>
                  <Th>Performance</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredTPAs.map((tpa) => (
                  <Tr key={tpa.id}>
                    <Td>
                      <HStack>
                        <Avatar size="sm" name={tpa.name} />
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="semibold">{tpa.name}</Text>
                          <Text fontSize="sm" color="gray.500">{tpa.id}</Text>
                          <Badge colorScheme="blue" variant="outline" size="sm">
                            {tpa.type}
                          </Badge>
                        </VStack>
                      </HStack>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="medium" fontSize="sm">{tpa.contactPerson}</Text>
                        <Text fontSize="xs" color="gray.500">{tpa.phone}</Text>
                        <Text fontSize="xs" color="gray.500">{tpa.email}</Text>
                      </VStack>
                    </Td>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <HStack>
                          <Text fontSize="sm" fontWeight="medium">{tpa.approvalRate}%</Text>
                          <Text fontSize="sm" color="gray.500">Approval</Text>
                        </HStack>
                        <Progress 
                          value={tpa.approvalRate} 
                          colorScheme={getApprovalRateColor(tpa.approvalRate)} 
                          size="sm" 
                          w="60px"
                        />
                        <Text fontSize="xs" color="gray.500">
                          {tpa.claimsProcessed} claims processed
                        </Text>
                      </VStack>
                    </Td>
                    <Td>
                      <Badge colorScheme={getStatusColor(tpa.status)} variant="subtle">
                        {tpa.status}
                      </Badge>
                    </Td>
                    <Td>
                      <HStack>
                        <Tooltip label="View Details">
                          <IconButton
                            icon={<Eye />}
                            size="sm"
                            variant="ghost"
                            colorScheme="blue"
                            onClick={() => handleViewTPA(tpa)}
                            aria-label="View TPA"
                          />
                        </Tooltip>
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            icon={<MoreVertical />}
                            variant="ghost"
                            size="sm"
                          />
                          <MenuList>
                            <MenuItem 
                              icon={<Edit size={16} />}
                              onClick={() => handleEditTPA(tpa)}
                            >
                              Edit TPA
                            </MenuItem>
                            <MenuItem 
                              icon={<FileText size={16} />}
                              onClick={() => handleViewClaims(tpa)}
                            >
                              View Claims
                            </MenuItem>
                            <MenuItem 
                              icon={<CreditCard size={16} />}
                              onClick={() => handlePaymentHistory(tpa)}
                            >
                              Payment History
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
          
          {filteredTPAs.length === 0 && (
            <Box textAlign="center" py={8}>
              <Text color="gray.500">No TPA partners found matching your criteria</Text>
            </Box>
          )}
        </CardBody>
      </Card>

      {/* View TPA Modal */}
      <Modal isOpen={viewTPAModal.isOpen} onClose={viewTPAModal.onClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedTPA && (
              <HStack>
                <Avatar size="md" name={selectedTPA.name} />
                <VStack align="start" spacing={0}>
                  <Text fontSize="xl" fontWeight="bold">{selectedTPA.name}</Text>
                  <Text fontSize="sm" color="gray.500">{selectedTPA.id}</Text>
                </VStack>
              </HStack>
            )}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedTPA && (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Card>
                  <CardBody>
                    <VStack align="start" spacing={3}>
                      <Text fontWeight="bold">Contact Information</Text>
                      <Divider />
                      <HStack justify="space-between" w="full">
                        <Text color="gray.600">Contact Person:</Text>
                        <Text>{selectedTPA.contactPerson}</Text>
                      </HStack>
                      <HStack justify="space-between" w="full">
                        <Text color="gray.600">Phone:</Text>
                        <Text>{selectedTPA.phone}</Text>
                      </HStack>
                      <HStack justify="space-between" w="full">
                        <Text color="gray.600">Email:</Text>
                        <Text>{selectedTPA.email}</Text>
                      </HStack>
                      <HStack justify="space-between" w="full">
                        <Text color="gray.600">Location:</Text>
                        <Text>{selectedTPA.location}</Text>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody>
                    <VStack align="start" spacing={3}>
                      <Text fontWeight="bold">Performance Metrics</Text>
                      <Divider />
                      <HStack justify="space-between" w="full">
                        <Text color="gray.600">Approval Rate:</Text>
                        <Text fontWeight="bold" color="green.600">{selectedTPA.approvalRate}%</Text>
                      </HStack>
                      <HStack justify="space-between" w="full">
                        <Text color="gray.600">Claims Processed:</Text>
                        <Text>{selectedTPA.claimsProcessed}</Text>
                      </HStack>
                      <HStack justify="space-between" w="full">
                        <Text color="gray.600">Pending Claims:</Text>
                        <Text>{selectedTPA.pendingClaims}</Text>
                      </HStack>
                      <HStack justify="space-between" w="full">
                        <Text color="gray.600">Total Amount:</Text>
                        <Text fontWeight="bold">₹{(selectedTPA.totalAmount/100000).toFixed(1)}L</Text>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              </SimpleGrid>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Add TPA Modal */}
      <Modal isOpen={addTPAModal.isOpen} onClose={addTPAModal.onClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New TPA Partner</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl isRequired>
                <FormLabel>TPA Name</FormLabel>
                <Input placeholder="Enter TPA name" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Contact Person</FormLabel>
                <Input placeholder="Enter contact person name" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Phone Number</FormLabel>
                <Input placeholder="Enter phone number" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input type="email" placeholder="Enter email address" />
              </FormControl>
            </SimpleGrid>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={addTPAModal.onClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={() => {
                toast({
                  title: "TPA Partner Added",
                  description: "New TPA partner has been successfully added.",
                  status: "success",
                  duration: 3000,
                  isClosable: true,
                });
                addTPAModal.onClose();
              }}
            >
              Add TPA Partner
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit TPA Modal */}
      <Modal isOpen={editTPAModal.isOpen} onClose={editTPAModal.onClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Edit TPA Partner - {selectedTPA?.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedTPA && (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <FormControl isRequired>
                  <FormLabel>TPA Name</FormLabel>
                  <Input defaultValue={selectedTPA.name} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Contact Person</FormLabel>
                  <Input defaultValue={selectedTPA.contactPerson} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Phone Number</FormLabel>
                  <Input defaultValue={selectedTPA.phone} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input type="email" defaultValue={selectedTPA.email} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>TPA Type</FormLabel>
                  <Select defaultValue={selectedTPA.type}>
                    <option value="Health Insurance">Health Insurance</option>
                    <option value="General Insurance">General Insurance</option>
                    <option value="Life Insurance">Life Insurance</option>
                    <option value="Motor Insurance">Motor Insurance</option>
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Status</FormLabel>
                  <Select defaultValue={selectedTPA.status}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                    <option value="Expired">Expired</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Location</FormLabel>
                  <Input defaultValue={selectedTPA.location} />
                </FormControl>
                <FormControl>
                  <FormLabel>Website</FormLabel>
                  <Input defaultValue={selectedTPA.website} />
                </FormControl>
              </SimpleGrid>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={editTPAModal.onClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={() => {
                toast({
                  title: "TPA Partner Updated",
                  description: "TPA partner information has been successfully updated.",
                  status: "success",
                  duration: 3000,
                  isClosable: true,
                });
                editTPAModal.onClose();
              }}
            >
              Update TPA
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Claims Modal */}
      <Modal isOpen={claimsModal.isOpen} onClose={claimsModal.onClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Claims Overview - {selectedTPA?.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedTPA && (
              <VStack spacing={6} align="stretch">
                {/* Claims Statistics */}
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <Card bg="green.50" borderColor="green.200">
                    <CardBody textAlign="center">
                      <Icon as={CheckCircle} size={32} color="green.500" mb={2} />
                      <Text fontSize="2xl" fontWeight="bold" color="green.600">
                        {selectedTPA.claimsProcessed}
                      </Text>
                      <Text color="green.700">Claims Processed</Text>
                    </CardBody>
                  </Card>
                  <Card bg="orange.50" borderColor="orange.200">
                    <CardBody textAlign="center">
                      <Icon as={Clock} size={32} color="orange.500" mb={2} />
                      <Text fontSize="2xl" fontWeight="bold" color="orange.600">
                        {selectedTPA.pendingClaims}
                      </Text>
                      <Text color="orange.700">Pending Claims</Text>
                    </CardBody>
                  </Card>
                  <Card bg="blue.50" borderColor="blue.200">
                    <CardBody textAlign="center">
                      <Icon as={BarChart} size={32} color="blue.500" mb={2} />
                      <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                        {selectedTPA.approvalRate}%
                      </Text>
                      <Text color="blue.700">Approval Rate</Text>
                    </CardBody>
                  </Card>
                </SimpleGrid>

                {/* Recent Claims Table */}
                <Card>
                  <CardHeader>
                    <Text fontWeight="bold" fontSize="lg">Recent Claims Activity</Text>
                  </CardHeader>
                  <CardBody>
                    <TableContainer>
                      <Table variant="simple" size="sm">
                        <Thead>
                          <Tr>
                            <Th>Claim ID</Th>
                            <Th>Patient</Th>
                            <Th>Date</Th>
                            <Th>Amount</Th>
                            <Th>Status</Th>
                            <Th>Processing Time</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {[
                            { claimId: 'CLM001', patient: 'John Doe', date: '2024-01-15', amount: '₹45,000', status: 'Approved', processingTime: '2 days' },
                            { claimId: 'CLM002', patient: 'Jane Smith', date: '2024-01-14', amount: '₹32,000', status: 'Pending', processingTime: '1 day' },
                            { claimId: 'CLM003', patient: 'Mike Johnson', date: '2024-01-13', amount: '₹78,000', status: 'Under Review', processingTime: '3 days' },
                            { claimId: 'CLM004', patient: 'Sarah Wilson', date: '2024-01-12', amount: '₹25,000', status: 'Approved', processingTime: '1 day' },
                            { claimId: 'CLM005', patient: 'David Brown', date: '2024-01-11', amount: '₹56,000', status: 'Rejected', processingTime: '2 days' },
                          ].map((claim, index) => (
                            <Tr key={index}>
                              <Td fontFamily="mono">{claim.claimId}</Td>
                              <Td>{claim.patient}</Td>
                              <Td>{claim.date}</Td>
                              <Td fontWeight="semibold">{claim.amount}</Td>
                              <Td>
                                <Badge 
                                  colorScheme={
                                    claim.status === 'Approved' ? 'green' : 
                                    claim.status === 'Pending' ? 'orange' : 
                                    claim.status === 'Rejected' ? 'red' : 'blue'
                                  }
                                >
                                  {claim.status}
                                </Badge>
                              </Td>
                              <Td color="gray.600">{claim.processingTime}</Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </CardBody>
                </Card>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Payment History Modal */}
      <Modal isOpen={paymentHistoryModal.isOpen} onClose={paymentHistoryModal.onClose} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Payment History - {selectedTPA?.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedTPA && (
              <VStack spacing={6} align="stretch">
                {/* Payment Summary */}
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <Card bg="blue.50" borderColor="blue.200">
                    <CardBody textAlign="center">
                      <Icon as={DollarSign} size={32} color="blue.500" mb={2} />
                      <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                        ₹{(selectedTPA.totalAmount/100000).toFixed(1)}L
                      </Text>
                      <Text color="blue.700">Total Paid</Text>
                    </CardBody>
                  </Card>
                  <Card bg="green.50" borderColor="green.200">
                    <CardBody textAlign="center">
                      <Icon as={CheckCircle} size={32} color="green.500" mb={2} />
                      <Text fontSize="2xl" fontWeight="bold" color="green.600">
                        12
                      </Text>
                      <Text color="green.700">Payments Made</Text>
                    </CardBody>
                  </Card>
                  <Card bg="orange.50" borderColor="orange.200">
                    <CardBody textAlign="center">
                      <Icon as={Clock} size={32} color="orange.500" mb={2} />
                      <Text fontSize="2xl" fontWeight="bold" color="orange.600">
                        ₹2.3L
                      </Text>
                      <Text color="orange.700">Outstanding</Text>
                    </CardBody>
                  </Card>
                </SimpleGrid>

                {/* Payment History Table */}
                <Card>
                  <CardHeader>
                    <Text fontWeight="bold" fontSize="lg">Recent Payment Transactions</Text>
                  </CardHeader>
                  <CardBody>
                    <TableContainer>
                      <Table variant="simple" size="sm">
                        <Thead>
                          <Tr>
                            <Th>Transaction ID</Th>
                            <Th>Date</Th>
                            <Th>Amount</Th>
                            <Th>Method</Th>
                            <Th>Status</Th>
                            <Th>Description</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {[
                            { txnId: 'TXN001', date: '2024-01-15', amount: '₹2,45,000', method: 'Bank Transfer', status: 'Completed', description: 'Monthly settlement' },
                            { txnId: 'TXN002', date: '2024-01-01', amount: '₹1,98,000', method: 'NEFT', status: 'Completed', description: 'Claims settlement' },
                            { txnId: 'TXN003', date: '2023-12-15', amount: '₹3,22,000', method: 'Bank Transfer', status: 'Completed', description: 'Monthly settlement' },
                            { txnId: 'TXN004', date: '2023-12-01', amount: '₹1,76,000', method: 'RTGS', status: 'Completed', description: 'Bonus payment' },
                            { txnId: 'TXN005', date: '2023-11-15', amount: '₹2,89,000', method: 'Bank Transfer', status: 'Pending', description: 'Monthly settlement' },
                          ].map((payment, index) => (
                            <Tr key={index}>
                              <Td fontFamily="mono">{payment.txnId}</Td>
                              <Td>{payment.date}</Td>
                              <Td fontWeight="semibold" color="green.600">{payment.amount}</Td>
                              <Td>{payment.method}</Td>
                              <Td>
                                <Badge 
                                  colorScheme={payment.status === 'Completed' ? 'green' : 'orange'}
                                >
                                  {payment.status}
                                </Badge>
                              </Td>
                              <Td color="gray.600">{payment.description}</Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </CardBody>
                </Card>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TPAManagement;
