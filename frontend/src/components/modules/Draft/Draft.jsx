import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Button,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  SimpleGrid,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Flex,
  Tooltip,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow
} from '@chakra-ui/react';
import {
  Search,
  Filter,
  Eye,
  Edit3,
  Trash2,
  FileText,
  Calendar,
  User,
  Package,
  DollarSign,
  Clock,
  Send,
  Download,
  RefreshCw,
  Plus,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Draft = ({ showStatistics = true, showHeader = true }) => {
  const [draftBills, setDraftBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedBill, setSelectedBill] = useState(null);
  const toast = useToast();

  // Modal controls
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

  // Load draft bills from localStorage on component mount
  useEffect(() => {
    loadDraftBills();
  }, []);

  // Filter bills when search/filter criteria change
  useEffect(() => {
    filterBills();
  }, [searchTerm, statusFilter, dateFilter, draftBills]);

  const loadDraftBills = () => {
    try {
      const savedDrafts = localStorage.getItem('draftMedicineBills');
      if (savedDrafts) {
        const drafts = JSON.parse(savedDrafts);
        setDraftBills(drafts);
      }
    } catch (error) {
      console.error('Error loading draft bills:', error);
      toast({
        title: 'Error Loading Drafts',
        description: 'Could not load saved draft bills.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const saveDraftBills = (bills) => {
    try {
      localStorage.setItem('draftMedicineBills', JSON.stringify(bills));
    } catch (error) {
      console.error('Error saving draft bills:', error);
      toast({
        title: 'Error Saving',
        description: 'Could not save draft bills.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const filterBills = () => {
    let filtered = [...draftBills];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(bill =>
        bill.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.caseId.toString().includes(searchTerm) ||
        bill.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(bill => bill.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const today = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(bill => new Date(bill.createdAt) >= filterDate);
          break;
        case 'week':
          filterDate.setDate(today.getDate() - 7);
          filtered = filtered.filter(bill => new Date(bill.createdAt) >= filterDate);
          break;
        case 'month':
          filterDate.setMonth(today.getMonth() - 1);
          filtered = filtered.filter(bill => new Date(bill.createdAt) >= filterDate);
          break;
      }
    }

    setFilteredBills(filtered);
  };

  const handleViewBill = (bill) => {
    setSelectedBill(bill);
    onViewOpen();
  };

  const handleEditBill = (bill) => {
    setSelectedBill(bill);
    onEditOpen();
  };

  const handleDeleteBill = (billId) => {
    if (window.confirm('Are you sure you want to delete this draft bill?')) {
      const updatedBills = draftBills.filter(bill => bill.id !== billId);
      setDraftBills(updatedBills);
      saveDraftBills(updatedBills);
      
      toast({
        title: 'Draft Deleted',
        description: 'Draft bill has been deleted successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleFinalizeBill = (billId) => {
    const updatedBills = draftBills.map(bill =>
      bill.id === billId
        ? { ...bill, status: 'finalized', finalizedAt: new Date().toISOString() }
        : bill
    );
    setDraftBills(updatedBills);
    saveDraftBills(updatedBills);

    toast({
      title: 'Bill Finalized',
      description: 'Draft bill has been finalized and sent to billing.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSendToPharmacy = (billId) => {
    const updatedBills = draftBills.map(bill =>
      bill.id === billId
        ? { ...bill, status: 'sent_to_pharmacy', sentAt: new Date().toISOString() }
        : bill
    );
    setDraftBills(updatedBills);
    saveDraftBills(updatedBills);

    toast({
      title: 'Sent to Pharmacy',
      description: 'Draft bill has been sent to pharmacy for processing.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'orange';
      case 'finalized': return 'green';
      case 'sent_to_pharmacy': return 'blue';
      default: return 'gray';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'draft': return 'Draft';
      case 'finalized': return 'Finalized';
      case 'sent_to_pharmacy': return 'Sent to Pharmacy';
      default: return 'Unknown';
    }
  };

  const getTotalAmount = (medicines) => {
    return medicines.reduce((total, med) => {
      return total + (parseFloat(med.unitPrice || 0) * parseFloat(med.quantity || 0));
    }, 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Statistics
  const stats = {
    total: draftBills.length,
    draft: draftBills.filter(b => b.status === 'draft').length,
    finalized: draftBills.filter(b => b.status === 'finalized').length,
    sent: draftBills.filter(b => b.status === 'sent_to_pharmacy').length,
    totalValue: draftBills.reduce((sum, bill) => sum + getTotalAmount(bill.medicines || []), 0)
  };

  return (
    <Box p={6} bg="gray.50" minH="100vh">
      <VStack spacing={6} align="stretch">
        {/* Header */}
        {showHeader && (
          <Card bg="white" shadow="sm">
            <CardHeader>
              <HStack justify="space-between" align="center">
                <VStack align="start" spacing={1}>
                  <Heading size="lg" color="blue.600">
                    <HStack>
                      <FileText size={28} />
                      <Text>Draft Medicine Bills</Text>
                    </HStack>
                  </Heading>
                  <Text color="gray.600">Manage and review draft medicine bills</Text>
                </VStack>
                <Button leftIcon={<RefreshCw />} onClick={loadDraftBills} size="md">
                  Refresh
                </Button>
              </HStack>
            </CardHeader>
          </Card>
        )}

        {/* Statistics Cards */}
        {showStatistics && (
          <SimpleGrid columns={{ base: 2, md: 5 }} spacing={4}>
            <Card bg="blue.50" borderLeft="4px solid" borderColor="blue.400">
              <CardBody py={4}>
                <Stat size="sm">
                  <StatLabel color="blue.600">Total Bills</StatLabel>
                  <StatNumber color="blue.700">{stats.total}</StatNumber>
                </Stat>
              </CardBody>
            </Card>
            <Card bg="orange.50" borderLeft="4px solid" borderColor="orange.400">
              <CardBody py={4}>
                <Stat size="sm">
                  <StatLabel color="orange.600">Draft</StatLabel>
                  <StatNumber color="orange.700">{stats.draft}</StatNumber>
                </Stat>
              </CardBody>
            </Card>
            <Card bg="green.50" borderLeft="4px solid" borderColor="green.400">
              <CardBody py={4}>
                <Stat size="sm">
                  <StatLabel color="green.600">Finalized</StatLabel>
                  <StatNumber color="green.700">{stats.finalized}</StatNumber>
                </Stat>
              </CardBody>
            </Card>
            <Card bg="blue.50" borderLeft="4px solid" borderColor="blue.400">
              <CardBody py={4}>
                <Stat size="sm">
                  <StatLabel color="blue.600">Sent to Pharmacy</StatLabel>
                  <StatNumber color="blue.700">{stats.sent}</StatNumber>
                </Stat>
              </CardBody>
            </Card>
            <Card bg="teal.50" borderLeft="4px solid" borderColor="teal.400">
              <CardBody py={4}>
                <Stat size="sm">
                  <StatLabel color="teal.600">Total Value</StatLabel>
                  <StatNumber color="teal.700">₹{stats.totalValue.toFixed(2)}</StatNumber>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>
        )}

        {/* Filters */}
        <Card bg="white" shadow="sm">
          <CardBody>
            <HStack spacing={4} wrap="wrap">
              <InputGroup maxW="300px">
                <InputLeftElement>
                  <Search size={18} color="gray" />
                </InputLeftElement>
                <Input
                  placeholder="Search by patient, case ID, or doctor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              
              <Select maxW="200px" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="finalized">Finalized</option>
                <option value="sent_to_pharmacy">Sent to Pharmacy</option>
              </Select>

              <Select maxW="200px" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </Select>
            </HStack>
          </CardBody>
        </Card>

        {/* Bills Table */}
        <Card bg="white" shadow="sm">
          <CardBody p={0}>
            {filteredBills.length === 0 ? (
              <Box p={8} textAlign="center">
                <FileText size={48} color="gray" style={{ margin: '0 auto 16px' }} />
                <Text fontSize="lg" color="gray.500" mb={2}>
                  No draft bills found
                </Text>
                <Text color="gray.400">
                  {draftBills.length === 0 
                    ? "Create your first draft bill from the Medicine module"
                    : "Try adjusting your search or filter criteria"
                  }
                </Text>
              </Box>
            ) : (
              <TableContainer>
                <Table variant="simple" size="sm">
                  <Thead bg="gray.50">
                    <Tr>
                      <Th>Bill ID</Th>
                      <Th>Patient Details</Th>
                      <Th>Doctor</Th>
                      <Th>Medicines</Th>
                      <Th>Amount</Th>
                      <Th>Status</Th>
                      <Th>Created</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredBills.map((bill) => (
                      <Tr key={bill.id} _hover={{ bg: 'gray.50' }}>
                        <Td fontWeight="medium">#{bill.id}</Td>
                        <Td>
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="medium">{bill.patientName}</Text>
                            <Text fontSize="sm" color="gray.500">
                              Case: {bill.caseId} | Age: {bill.patientAge}
                            </Text>
                          </VStack>
                        </Td>
                        <Td>{bill.doctorName}</Td>
                        <Td>
                          <Badge colorScheme="blue" variant="subtle">
                            {bill.medicines?.length || 0} items
                          </Badge>
                        </Td>
                        <Td fontWeight="medium">₹{getTotalAmount(bill.medicines || []).toFixed(2)}</Td>
                        <Td>
                          <Badge colorScheme={getStatusColor(bill.status)} variant="subtle">
                            {getStatusText(bill.status)}
                          </Badge>
                        </Td>
                        <Td fontSize="sm" color="gray.500">
                          {formatDate(bill.createdAt)}
                        </Td>
                        <Td>
                          <HStack spacing={1}>
                            <Tooltip label="View Details">
                              <IconButton
                                icon={<Eye />}
                                size="sm"
                                variant="ghost"
                                colorScheme="blue"
                                onClick={() => handleViewBill(bill)}
                              />
                            </Tooltip>
                            {bill.status === 'draft' && (
                              <>
                                <Tooltip label="Edit Bill">
                                  <IconButton
                                    icon={<Edit3 />}
                                    size="sm"
                                    variant="ghost"
                                    colorScheme="orange"
                                    onClick={() => handleEditBill(bill)}
                                  />
                                </Tooltip>
                                <Tooltip label="Finalize Bill">
                                  <IconButton
                                    icon={<CheckCircle />}
                                    size="sm"
                                    variant="ghost"
                                    colorScheme="green"
                                    onClick={() => handleFinalizeBill(bill.id)}
                                  />
                                </Tooltip>
                                <Tooltip label="Send to Pharmacy">
                                  <IconButton
                                    icon={<Send />}
                                    size="sm"
                                    variant="ghost"
                                    colorScheme="blue"
                                    onClick={() => handleSendToPharmacy(bill.id)}
                                  />
                                </Tooltip>
                              </>
                            )}
                            <Tooltip label="Delete">
                              <IconButton
                                icon={<Trash2 />}
                                size="sm"
                                variant="ghost"
                                colorScheme="red"
                                onClick={() => handleDeleteBill(bill.id)}
                              />
                            </Tooltip>
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
      </VStack>

      {/* View Bill Modal */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <FileText size={24} />
              <Text>Draft Bill Details - #{selectedBill?.id}</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedBill && (
              <VStack spacing={6} align="stretch">
                {/* Patient & Bill Info */}
                <SimpleGrid columns={2} spacing={6}>
                  <Card variant="outline">
                    <CardHeader pb={2}>
                      <Text fontWeight="semibold" color="blue.600">Patient Information</Text>
                    </CardHeader>
                    <CardBody pt={0}>
                      <VStack align="start" spacing={2}>
                        <Text><strong>Name:</strong> {selectedBill.patientName}</Text>
                        <Text><strong>Case ID:</strong> {selectedBill.caseId}</Text>
                        <Text><strong>Age:</strong> {selectedBill.patientAge}</Text>
                        <Text><strong>Gender:</strong> {selectedBill.patientGender}</Text>
                      </VStack>
                    </CardBody>
                  </Card>

                  <Card variant="outline">
                    <CardHeader pb={2}>
                      <Text fontWeight="semibold" color="green.600">Bill Information</Text>
                    </CardHeader>
                    <CardBody pt={0}>
                      <VStack align="start" spacing={2}>
                        <Text><strong>Doctor:</strong> {selectedBill.doctorName}</Text>
                        <Text><strong>Status:</strong> 
                          <Badge ml={2} colorScheme={getStatusColor(selectedBill.status)}>
                            {getStatusText(selectedBill.status)}
                          </Badge>
                        </Text>
                        <Text><strong>Created:</strong> {formatDate(selectedBill.createdAt)}</Text>
                        <Text><strong>Total:</strong> ₹{getTotalAmount(selectedBill.medicines || []).toFixed(2)}</Text>
                      </VStack>
                    </CardBody>
                  </Card>
                </SimpleGrid>

                {/* Medicines List */}
                <Card variant="outline">
                  <CardHeader>
                    <Text fontWeight="semibold" color="purple.600">Medicine Details</Text>
                  </CardHeader>
                  <CardBody>
                    <TableContainer>
                      <Table size="sm" variant="simple">
                        <Thead>
                          <Tr>
                            <Th>Medicine</Th>
                            <Th>Type</Th>
                            <Th>Dose</Th>
                            <Th>Quantity</Th>
                            <Th>Unit Price</Th>
                            <Th>Total</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {(selectedBill.medicines || []).map((medicine, index) => (
                            <Tr key={index}>
                              <Td fontWeight="medium">{medicine.name}</Td>
                              <Td>{medicine.type}</Td>
                              <Td>{medicine.dose}</Td>
                              <Td>{medicine.quantity}</Td>
                              <Td>₹{parseFloat(medicine.unitPrice || 0).toFixed(2)}</Td>
                              <Td fontWeight="medium">
                                ₹{(parseFloat(medicine.unitPrice || 0) * parseFloat(medicine.quantity || 0)).toFixed(2)}
                              </Td>
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
          <ModalFooter>
            <Button variant="outline" onClick={onViewClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Draft;
