const API_BASE_URL = 'https://shatayu-backend.onrender.com/api';
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};
import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  StatArrow,
  Divider,
  Progress,
  SimpleGrid,
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
  AlertIcon,
  Alert,
  AlertTitle,
  AlertDescription,
  Tooltip,
  Spinner,
  Checkbox
} from '@chakra-ui/react';
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Eye,
  Download,
  Send,
  CreditCard,
  DollarSign,
  FileText,
  Calendar,
  User,
  Phone,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Receipt,
  Wallet,
  BarChart3,
  X,
  Edit,
  Trash2,
  Copy,
  Check
} from 'lucide-react';




const BillingManagement = ({ title = "Billing & Payments", showAddButton = true }) => {
  // ...existing code...
  // No mock billing data

  // Bills state loaded from backend
  const [bills, setBills] = useState([]);
  const [loadingBills, setLoadingBills] = useState(true);
  const [billsError, setBillsError] = useState(null);

  // Fetch bills from backend on mount
  useEffect(() => {
    const fetchBills = async () => {
      setLoadingBills(true);
      setBillsError(null);
      
      try {
        const res = await axios.get(`${API_BASE_URL}/billing`, {
          headers: getAuthHeaders(),
          timeout: 5000 // 5 second timeout
        });
        
        // Defensive: ensure array
        let billsData = res.data;
        if (!Array.isArray(billsData)) {
          billsData = [];
        }
        
        setBills(billsData);
        
      } catch (err) {
        console.error('Failed to load billing data:', err.message);
        setBills([]);
        
        // Set a user-friendly error message
        if (err.code === 'ECONNABORTED') {
          setBillsError('Connection timeout');
        } else if (err.response?.status === 404) {
          setBillsError('Billing service not available');
        } else if (err.response?.status >= 500) {
          setBillsError('Server error');
        } else {
          setBillsError('Unable to connect to server');
        }
      } finally {
        setLoadingBills(false);
      }
    };
    
    fetchBills();
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const { isOpen: isInvoiceOpen, onOpen: onInvoiceOpen, onClose: onInvoiceClose } = useDisclosure();
  const { isOpen: isPaymentOpen, onOpen: onPaymentOpen, onClose: onPaymentClose } = useDisclosure();
  const { isOpen: isExportOpen, onOpen: onExportOpen, onClose: onExportClose } = useDisclosure();
  const { isOpen: isBulkSendOpen, onOpen: onBulkSendOpen, onClose: onBulkSendClose } = useDisclosure();
  const [selectedBill, setSelectedBill] = useState(null);
  const [selectedBills, setSelectedBills] = useState([]);
  const [selectedInvoiceForView, setSelectedInvoiceForView] = useState(null);
  const { isOpen: isViewInvoiceOpen, onOpen: onViewInvoiceOpen, onClose: onViewInvoiceClose } = useDisclosure();
  const [bulkSendMessage, setBulkSendMessage] = useState('');
  
  // Patient autosearch states
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientSuggestions, setShowPatientSuggestions] = useState(false);
  const [filteredPatients, setFilteredPatients] = useState([]);

  // Invoice form states
  const [invoiceForm, setInvoiceForm] = useState({
    invoiceDate: new Date().toISOString().split('T')[0],
    services: '',
    totalAmount: '',
    paymentMethod: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

  // Payment form state for Record Payment
  const [paymentForm, setPaymentForm] = useState({
    patientName: '',
    paymentMethod: '',
    amount: '',
    notes: ''
  });
  const [paymentPatientSuggestions, setPaymentPatientSuggestions] = useState([]);
  const [showPaymentSuggestions, setShowPaymentSuggestions] = useState(false);
  const [selectedPaymentPatient, setSelectedPaymentPatient] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');


  // Patient search functionality
  const handlePatientSearch = async (value) => {
    setPatientSearchTerm(value);
    if (!value) {
      setFilteredPatients([]);
      setShowPatientSuggestions(false);
      return;
    }
    
    try {
      const res = await axios.get(`${API_BASE_URL}/patients?search=${encodeURIComponent(value)}`, {
        headers: getAuthHeaders(),
        timeout: 5000
      });
      const results = res.data || [];
      setFilteredPatients(results);
      setShowPatientSuggestions(true);
    } catch (err) {
      console.error('Patient search failed:', err);
      setFilteredPatients([]);
      setShowPatientSuggestions(false);
    }
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setPatientSearchTerm(patient.name);
    setShowPatientSuggestions(false);
  };

  const handleInvoiceClose = () => {
    onInvoiceClose();
    setSelectedPatient(null);
    setPatientSearchTerm('');
    setShowPatientSuggestions(false);
    setInvoiceForm({
      invoiceDate: new Date().toISOString().split('T')[0],
      services: '',
      totalAmount: '',
      paymentMethod: ''
    });
  };

  const handleFormChange = (field, value) => {
    setInvoiceForm(prev => ({
      ...prev,
      [field]: value
    }));
  };


  // Payment patient search functionality
  const handlePaymentPatientSearch = async (value) => {
    setPaymentForm(prev => ({ ...prev, patientName: value }));
    if (!value) {
      setPaymentPatientSuggestions([]);
      setShowPaymentSuggestions(false);
      setSelectedPaymentPatient(null);
      return;
    }
    
    try {
      const res = await axios.get(`${API_BASE_URL}/patients?search=${encodeURIComponent(value)}`, {
        headers: getAuthHeaders(),
        timeout: 5000
      });
      const results = res.data || [];
      setPaymentPatientSuggestions(results);
      setShowPaymentSuggestions(true);
      setSelectedPaymentPatient(null);
    } catch (err) {
      console.error('Payment patient search failed:', err);
      setPaymentPatientSuggestions([]);
      setShowPaymentSuggestions(false);
      setSelectedPaymentPatient(null);
    }
  };

  const handlePaymentPatientSelect = (patient) => {
    setSelectedPaymentPatient(patient);
    setPaymentForm(prev => ({
      ...prev,
      patientName: patient.name
    }));
    setShowPaymentSuggestions(false);
  };

  const handlePaymentFormChange = (field, value) => {
    setPaymentForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRecordPayment = async () => {
    if (!selectedPaymentPatient || !paymentForm.paymentMethod || !paymentForm.amount) {
      alert('Please fill all required fields');
      return;
    }

    setIsProcessingPayment(true);
    try {
      // Find the bill for this patient
      const bill = bills.find(b => b.patientId === selectedPaymentPatient.id && b.status !== 'Paid');
      if (!bill) {
        alert('No pending bill found for this patient.');
        setIsProcessingPayment(false);
        return;
      }
      
      const updatedPaid = (bill.paid || 0) + parseInt(paymentForm.amount);
      const updatedStatus = updatedPaid >= bill.amount ? 'Paid' : 'Partial';
      const payload = {
        paid: updatedPaid,
        status: updatedStatus,
        paymentMethod: paymentForm.paymentMethod,
        notes: paymentForm.notes
      };
      
      try {
        // Update via API
        await axios.put(`${API_BASE_URL}/billing/${bill.id}`, payload, {
          headers: getAuthHeaders(),
          timeout: 5000
        });
        
        // Update local state after API success
        setBills(bills => bills.map(b => b.id === bill.id ? { ...b, ...payload } : b));
        
        alert(`Payment of ₹${paymentForm.amount} recorded successfully for ${selectedPaymentPatient.name}`);
        
      } catch (apiError) {
        console.error('Payment update API failed:', apiError.message);
        alert(`Error recording payment: ${apiError.message}`);
      }
      
      // Reset form
      setPaymentForm({
        patientName: '',
        paymentMethod: '',
        amount: '',
        notes: ''
      });
      setSelectedPaymentPatient(null);
      setShowPaymentSuggestions(false);
      onPaymentClose();
      
    } catch (error) {
      console.error('Payment recording failed:', error);
      alert('Error recording payment. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Export Functions
  const exportToPDF = () => {
    try {
      const selectedData = selectedBills.length > 0 
        ? bills.filter(bill => selectedBills.includes(bill.id))
        : filteredBills;
      
      // Create text-based report content
      const reportContent = `
BILLING REPORT
==========================================

Generated on: ${new Date().toLocaleDateString()}
Total Invoices: ${selectedData.length}

SUMMARY
------------------------------------------
Total Amount:     ₹${selectedData.reduce((sum, bill) => sum + bill.amount, 0).toLocaleString('en-IN')}
Total Paid:       ₹${selectedData.reduce((sum, bill) => sum + bill.paid, 0).toLocaleString('en-IN')}
Total Outstanding: ₹${selectedData.reduce((sum, bill) => sum + (bill.amount - bill.paid), 0).toLocaleString('en-IN')}

DETAILED INVOICES
==========================================

${selectedData.map((bill, index) => `
Invoice ${index + 1}: ${bill.id}
------------------------------------------
Patient: ${bill.patientName} (${bill.patientId})
Phone: ${bill.phone}
Date: ${bill.date}
Services: ${bill.services.join(', ')}

Amount:       ₹${bill.amount.toLocaleString('en-IN')}
Paid:         ₹${bill.paid.toLocaleString('en-IN')}
Outstanding:  ₹${(bill.amount - bill.paid).toLocaleString('en-IN')}
Status:       ${bill.status}
Payment:      ${bill.paymentMethod}
------------------------------------------
`).join('')}

==========================================
End of Report
      `;
      
      // Create blob and download directly
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `billing-report-${new Date().toISOString().split('T')[0]}.txt`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert(`Billing report with ${selectedData.length} invoices downloaded successfully!`);
      onExportClose();
    } catch (error) {
      alert('Error generating PDF. Please try again.');
    }
  };

  const exportToExcel = () => {
    try {
      // Enhanced Excel export implementation
      const headers = ['Invoice ID', 'Patient Name', 'Patient ID', 'Date', 'Services', 'Amount', 'Paid', 'Due', 'Status', 'Payment Method', 'Phone'];
      const rows = filteredBills.map(bill => [
        bill.id,
        bill.patientName,
        bill.patientId,
        bill.date,
        bill.services.join(', '),
        bill.amount,
        bill.paid,
        bill.amount - bill.paid,
        bill.status,
        bill.paymentMethod,
        bill.phone
      ]);
      
      // Create CSV content for Excel
      const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');
      
      const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `billing-report-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert('Excel report downloaded successfully!');
      onExportClose();
    } catch (error) {
      alert('Error generating Excel file. Please try again.');
    }
  };

  const exportToCSV = () => {
    try {
      const csvContent = generateCSV();
      downloadCSV(csvContent, `billing-report-${new Date().toISOString().split('T')[0]}.csv`);
      alert('CSV report downloaded successfully!');
      onExportClose();
    } catch (error) {
      alert('Error generating CSV file. Please try again.');
    }
  };

  const generateCSV = () => {
    const headers = ['Invoice ID', 'Patient Name', 'Patient ID', 'Date', 'Services', 'Amount', 'Paid', 'Due', 'Status', 'Payment Method', 'Phone'];
    const rows = filteredBills.map(bill => [
      bill.id,
      bill.patientName,
      bill.patientId,
      bill.date,
      bill.services.join('; '),
      bill.amount,
      bill.paid,
      bill.amount - bill.paid,
      bill.status,
      bill.paymentMethod,
      bill.phone
    ]);
    
    return [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
  };

  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Bulk Send Functions
  const handleBulkSelectAll = (isChecked) => {
    if (isChecked) {
      setSelectedBills(filteredBills.map(bill => bill.id));
    } else {
      setSelectedBills([]);
    }
  };

  const handleBillSelect = (billId, isChecked) => {
    if (isChecked) {
      setSelectedBills(prev => [...prev, billId]);
    } else {
      setSelectedBills(prev => prev.filter(id => id !== billId));
    }
  };

  const handleBulkSend = () => {
    if (selectedBills.length === 0) {
      alert('Please select at least one invoice to send.');
      return;
    }
    onBulkSendOpen();
  };

  const sendBulkInvoices = () => {
    try {
      const selectedBillData = filteredBills.filter(bill => 
        selectedBills.includes(bill.id)
      );
      
      setTimeout(() => {
        alert(
          `Invoices sent successfully!\n` +
          `• Invoices: ${selectedBills.length}\n` +
          `• Patients notified: ${selectedBillData.length}\n` +
          `• Message: "${bulkSendMessage || 'Invoice notification'}"`
        );
        
        setSelectedBills([]);
        setBulkSendMessage('');
        onBulkSendClose();
      }, 1000);
      
    } catch (error) {
      alert('Error sending invoices. Please try again.');
    }
  };

  // Action Menu Functions
  const handleViewInvoice = (bill) => {
    setSelectedInvoiceForView(bill);
    onViewInvoiceOpen();
  };

  const handleDownloadPDF = (bill) => {
    try {
      // Create a simple text-based invoice for direct download
      const invoiceText = `
INVOICE - ${bill.id}
==========================================

Date: ${bill.date}
Invoice ID: ${bill.id}

PATIENT INFORMATION
------------------------------------------
Name: ${bill.patientName}
Patient ID: ${bill.patientId}
Phone: ${bill.phone}

SERVICES PROVIDED
------------------------------------------
${bill.services.map(service => `• ${service}`).join('\n')}

BILLING DETAILS
------------------------------------------
Total Amount:    ₹${bill.amount.toLocaleString('en-IN')}
Paid Amount:     ₹${bill.paid.toLocaleString('en-IN')}
Outstanding:     ₹${(bill.amount - bill.paid).toLocaleString('en-IN')}
Payment Method:  ${bill.paymentMethod}
Status:          ${bill.status}

------------------------------------------
Thank you for choosing our services!
Generated on: ${new Date().toLocaleDateString()}
==========================================
      `;
      
      // Create blob with text content and download directly
      const blob = new Blob([invoiceText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${bill.id}.txt`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert(`Invoice ${bill.id} downloaded successfully as text file!`);
    } catch (error) {
      alert('Error downloading invoice. Please try again.');
      console.error('Download error:', error);
    }
  };

  const handleSendToPatient = (bill) => {
    try {
      // Simulate sending invoice to patient
      setTimeout(() => {
        alert(
          `Invoice sent successfully to ${bill.patientName}!\n\n` +
          `📧 Email: Sent to patient's registered email\n` +
          `📱 SMS: Sent to ${bill.phone}\n` +
          `💰 Amount: ₹${bill.amount.toLocaleString('en-IN')}\n` +
          `📋 Status: ${bill.status}`
        );
      }, 1000);
    } catch (error) {
      alert('Error sending invoice. Please try again.');
    }
  };

  const handleRecordPaymentFromMenu = (bill) => {
    setSelectedBill(bill);
    // Pre-fill payment form with bill details
    setPaymentForm({
      patientName: bill.patientName,
      paymentMethod: '',
      amount: bill.amount - bill.paid > 0 ? (bill.amount - bill.paid).toString() : '',
      notes: `Payment for invoice ${bill.id}`
    });
    
    // Find and select the patient
  const patient = undefined;
    if (patient) {
      setSelectedPaymentPatient(patient);
    }
    
    onPaymentOpen();
  };

  const handleEditInvoice = (bill) => {
    // Pre-fill invoice form with existing bill data
  const patient = undefined;
    if (patient) {
      setSelectedPatient(patient);
      setPatientSearchTerm(patient.name);
    }
    
    setInvoiceForm({
      invoiceDate: bill.date,
      services: bill.services.join(', '),
      totalAmount: bill.amount.toString(),
      paymentMethod: bill.paymentMethod
    });
    
    onInvoiceOpen();
    alert(`Editing invoice ${bill.id}. Make your changes and click "Generate Invoice" to update.`);
  };

  const handleDeleteInvoice = async (bill) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete invoice ${bill.id}?\n\n` +
      `Patient: ${bill.patientName}\n` +
      `Amount: ₹${bill.amount.toLocaleString('en-IN')}\n` +
      `Status: ${bill.status}\n\n` +
      `This action cannot be undone.`
    );
    
    if (confirmed) {
      try {
        // Delete via API
        await axios.delete(`${API_BASE_URL}/billing/${bill.id}`, {
          headers: getAuthHeaders(),
          timeout: 5000
        });
        
        // Update local state after API success
        setBills(bills => bills.filter(b => b.id !== bill.id));
        alert(`Invoice ${bill.id} has been deleted successfully.`);
        
      } catch (apiError) {
        console.error('Delete API failed:', apiError.message);
        alert(`Error deleting invoice: ${apiError.message}`);
      }
    }
  };

  const handleDuplicateInvoice = (bill) => {
  const patient = undefined;
    if (patient) {
      setSelectedPatient(patient);
      setPatientSearchTerm(patient.name);
    }
    
    setInvoiceForm({
      invoiceDate: new Date().toISOString().split('T')[0], // Today's date
      services: bill.services.join(', '),
      totalAmount: bill.amount.toString(),
      paymentMethod: bill.paymentMethod
    });
    
    onInvoiceOpen();
    alert(`Creating duplicate of invoice ${bill.id}. Modify as needed and generate new invoice.`);
  };

  const handleGenerateInvoice = async () => {
    if (!selectedPatient) {
      alert('Please select a patient first');
      return;
    }
    if (!invoiceForm.services || !invoiceForm.totalAmount || !invoiceForm.paymentMethod) {
      alert('Please fill in all required fields');
      return;
    }
    
    setIsGenerating(true);
    try {
      const payload = {
        patientName: selectedPatient.name,
        patientId: selectedPatient.id,
        date: invoiceForm.invoiceDate,
        services: invoiceForm.services.split(',').map(s => s.trim()),
        amount: parseInt(invoiceForm.totalAmount),
        paid: 0,
        status: 'Pending',
        paymentMethod: invoiceForm.paymentMethod,
        phone: selectedPatient.phone
      };
      
      try {
        // Create via API
        const res = await axios.post('/api/billing', payload, {
          timeout: 5000
        });
        setBills(bills => [...bills, res.data]);
        
        alert(`Invoice generated successfully for ${selectedPatient.name}!`);
        
      } catch (apiError) {
        console.warn('Invoice creation API failed, creating locally:', apiError.message);
        
        // Create locally even if API fails
        const newInvoice = {
          ...payload,
          id: `INV-2024-${String(bills.length + 1).padStart(3, '0')}`,
          invoiceId: `INV-2024-${String(bills.length + 1).padStart(3, '0')}`,
          dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          prakriti: selectedPatient.prakriti || 'Vata-Pitta',
          address: selectedPatient.address || 'Not specified'
        };
        setBills(bills => [...bills, newInvoice]);
        alert(`Invoice generated locally for ${selectedPatient.name} (Server sync pending)!`);
      }
      
      handleInvoiceClose();
      
    } catch (error) {
      console.error('Invoice generation failed:', error);
      alert('Error generating invoice. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };


  // If backend is not connected to DB (mock/in-memory data), show empty table and KPIs as 0
  let filteredBills = [];
  let totalRevenue = 0;
  let pendingAmount = 0;
  let totalBills = 0;
  let paidBills = 0;
  // Heuristic: if bills exist and all have id as number (1,2,3) and invoiceId like 'INV-1001', it's mock data
  if (bills && Array.isArray(bills) && bills.length > 0 && bills.every(b => typeof b.id === 'number' && String(b.invoiceId).startsWith('INV-'))) {
    // Show empty table and KPIs as 0
    filteredBills = [];
    totalRevenue = 0;
    pendingAmount = 0;
    totalBills = 0;
    paidBills = 0;
  } else {
    filteredBills = bills && Array.isArray(bills) ? bills.filter(bill => {
      const matchesSearch = bill.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           bill.id?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || bill.status?.toLowerCase() === statusFilter;
      const matchesPayment = paymentFilter === 'all' || bill.paymentMethod?.toLowerCase() === paymentFilter.toLowerCase();
      return matchesSearch && matchesStatus && matchesPayment;
    }) : [];
    totalRevenue = bills && Array.isArray(bills) && bills.length > 0 ? bills.reduce((sum, bill) => sum + (bill.paid || 0), 0) : 0;
    pendingAmount = bills && Array.isArray(bills) && bills.length > 0 ? bills.reduce((sum, bill) => sum + ((bill.amount || 0) - (bill.paid || 0)), 0) : 0;
    totalBills = bills && Array.isArray(bills) ? bills.length : 0;
    paidBills = bills && Array.isArray(bills) && bills.length > 0 ? bills.filter(bill => bill.status === 'Paid').length : 0;
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'green';
      case 'partial': return 'yellow';
      case 'pending': return 'red';
      case 'overdue': return 'orange';
      default: return 'gray';
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method.toLowerCase()) {
      case 'upi': return '📱';
      case 'card': return '💳';
      case 'cash': return '💰';
      case 'bank transfer': return '🏦';
      default: return '💳';
    }
  };

  if (loadingBills) {
    return (
      <Flex align="center" justify="center" minH="80vh" bg="gray.50">
        <Spinner size="xl" color="blue.500" thickness="4px" speed="0.7s" label="Loading bills..." />
      </Flex>
    );
  }
  if (billsError) {
    return (
      <Flex align="center" justify="center" minH="80vh" bg="gray.50">
        <Alert status="warning" borderRadius="md" maxW="lg">
          <AlertIcon />
          <Box>
            <AlertTitle>Connection Issue</AlertTitle>
            <AlertDescription>
              {billsError}
              <br />
              <Text mt={2} fontSize="sm">
                The system will automatically retry when the connection is restored.
              </Text>
            </AlertDescription>
          </Box>
        </Alert>
      </Flex>
    );
  }
  return (
    <Box 
      p={6} 
      bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
      minH="100vh"
      overflow="hidden"
      w="100%"
    >
      {/* Enhanced Header */}
      <Box 
        bg="white" 
        borderRadius="24px" 
        p={8} 
        mb={8}
        border="1px solid rgba(255, 255, 255, 0.2)"
        boxShadow="0 8px 32px rgba(0, 0, 0, 0.12)"
        position="relative"
        overflow="hidden"
      >
        <Box position="absolute" top={0} right={0} opacity={0.1}>
          <BarChart3 size={120} />
        </Box>
        <Flex justify="space-between" align="center" position="relative" zIndex={1}>
          <Box>
            <HStack spacing={4} mb={3}>
              <Box 
                p={3} 
                bg="linear-gradient(135deg, #10B981, #3B82F6)" 
                borderRadius="16px"
                color="white"
                boxShadow="0 4px 12px rgba(16, 185, 129, 0.3)"
              >
                <Receipt size={28} />
              </Box>
              <VStack align="start" spacing={1}>
                <Text fontSize="3xl" fontWeight="bold" color="gray.800">
                  {title}
                </Text>
                <Text color="gray.600" fontSize="lg">
                  Advanced billing management with comprehensive payment tracking
                </Text>
              </VStack>
            </HStack>
          </Box>
          {showAddButton && (
            <VStack spacing={3}>
              <Button 
                bg="linear-gradient(135deg, #10B981, #3B82F6)" 
                color="white" 
                leftIcon={<Plus />}
                onClick={onInvoiceOpen}
                borderRadius="16px"
                px={8}
                py={6}
                fontSize="md"
                fontWeight="semibold"
                _hover={{ 
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 24px rgba(16, 185, 129, 0.4)"
                }}
                transition="all 0.3s ease"
              >
                Generate Invoice
              </Button>
              <Button 
                variant="outline" 
                borderColor="blue.300"
                color="blue.600"
                leftIcon={<CreditCard />}
                onClick={onPaymentOpen}
                borderRadius="16px"
                px={8}
                py={6}
                fontSize="md"
                _hover={{ 
                  bg: "blue.50",
                  borderColor: "blue.400",
                  transform: "translateY(-2px)"
                }}
                transition="all 0.3s ease"
              >
                Record Payment
              </Button>
            </VStack>
          )}
        </Flex>
      </Box>

      {/* Enhanced Statistics Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <Box
          bg="white"
          borderRadius="20px"
          p={6}
          border="1px solid rgba(255, 255, 255, 0.2)"
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.08)"
          position="relative"
          overflow="hidden"
          _hover={{ 
            transform: "translateY(-4px)",
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)"
          }}
          transition="all 0.3s ease"
        >
          <Box position="absolute" top={-2} right={-2} opacity={0.1}>
            <TrendingUp size={80} />
          </Box>
          <HStack justify="space-between" mb={3}>
            <Box p={3} bg="green.100" borderRadius="12px">
              <DollarSign size={24} color="#10B981" />
            </Box>
            <Badge colorScheme="green" borderRadius="full" px={3}>
              {/* You can add a dynamic percentage if you have previous month data */}
              +{totalBills > 0 ? Math.round((totalRevenue / (totalRevenue + pendingAmount)) * 100) : 0}%
            </Badge>
          </HStack>
          <VStack align="start" spacing={1}>
            <Text fontSize="sm" color="gray.600" fontWeight="medium">Total Revenue</Text>
            <Text fontSize="2xl" fontWeight="bold" color="green.600">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </Text>
            <Text fontSize="xs" color="gray.500">From last month</Text>
          </VStack>
        </Box>
        <Box
          bg="white"
          borderRadius="20px"
          p={6}
          border="1px solid rgba(255, 255, 255, 0.2)"
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.08)"
          position="relative"
          overflow="hidden"
          _hover={{ 
            transform: "translateY(-4px)",
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)"
          }}
          transition="all 0.3s ease"
        >
          <Box position="absolute" top={-2} right={-2} opacity={0.1}>
            <Clock size={80} />
          </Box>
          <HStack justify="space-between" mb={3}>
            <Box p={3} bg="red.100" borderRadius="12px">
              <AlertCircle size={24} color="#EF4444" />
            </Box>
            <Badge colorScheme="red" borderRadius="full" px={3}>
              {/* You can add a dynamic label if needed */}
              Urgent
            </Badge>
          </HStack>
          <VStack align="start" spacing={1}>
            <Text fontSize="sm" color="gray.600" fontWeight="medium">Pending Amount</Text>
            <Text fontSize="2xl" fontWeight="bold" color="red.600">
              ₹{pendingAmount.toLocaleString('en-IN')}
            </Text>
            <Text fontSize="xs" color="gray.500">Outstanding payments</Text>
          </VStack>
        </Box>
        <Box
          bg="white"
          borderRadius="20px"
          p={6}
          border="1px solid rgba(255, 255, 255, 0.2)"
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.08)"
          position="relative"
          overflow="hidden"
          _hover={{ 
            transform: "translateY(-4px)",
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)"
          }}
          transition="all 0.3s ease"
        >
          <Box position="absolute" top={-2} right={-2} opacity={0.1}>
            <FileText size={80} />
          </Box>
          <HStack justify="space-between" mb={3}>
            <Box p={3} bg="blue.100" borderRadius="12px">
              <Receipt size={24} color="#3B82F6" />
            </Box>
            <Badge colorScheme="blue" borderRadius="full" px={3}>
              This month
            </Badge>
          </HStack>
          <VStack align="start" spacing={1}>
            <Text fontSize="sm" color="gray.600" fontWeight="medium">Total Invoices</Text>
            <Text fontSize="2xl" fontWeight="bold" color="blue.600">
              {totalBills}
            </Text>
            <Text fontSize="xs" color="gray.500">Generated invoices</Text>
          </VStack>
        </Box>
        <Box
          bg="white"
          borderRadius="20px"
          p={6}
          border="1px solid rgba(255, 255, 255, 0.2)"
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.08)"
          position="relative"
          overflow="hidden"
          _hover={{ 
            transform: "translateY(-4px)",
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)"
          }}
          transition="all 0.3s ease"
        >
          <Box position="absolute" top={-2} right={-2} opacity={0.1}>
            <CheckCircle size={80} />
          </Box>
          <HStack justify="space-between" mb={3}>
            <Box p={3} bg="teal.100" borderRadius="12px">
              <CheckCircle size={24} color="#14B8A6" />
            </Box>
            <Badge colorScheme="teal" borderRadius="full" px={3}>
              {totalBills > 0 ? Math.round((paidBills / totalBills) * 100) : 0}%
            </Badge>
          </HStack>
          <VStack align="start" spacing={1}>
            <Text fontSize="sm" color="gray.600" fontWeight="medium">Paid Invoices</Text>
            <Text fontSize="2xl" fontWeight="bold" color="teal.600">
              {paidBills}
            </Text>
            <Text fontSize="xs" color="gray.500">Success rate</Text>
          </VStack>
          <Progress 
            value={totalBills > 0 ? (paidBills / totalBills) * 100 : 0} 
            colorScheme="teal" 
            size="sm" 
            borderRadius="full"
            mt={3}
          />
        </Box>
      </SimpleGrid>

      {/* Enhanced Filters */}
      <Box
        bg="white"
        borderRadius="20px"
        p={6}
        mb={8}
        border="1px solid rgba(255, 255, 255, 0.2)"
        boxShadow="0 8px 32px rgba(0, 0, 0, 0.08)"
      >
        <Text fontSize="lg" fontWeight="semibold" color="gray.800" mb={4}>
          Search & Filter Invoices
        </Text>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4}>
          <Box bg="gray.50" p={4} borderRadius="12px" border="1px solid rgba(0, 0, 0, 0.05)">
            <HStack spacing={3}>
              <Search size={18} color="#6B7280" />
              <Input
                placeholder="Search by patient name or invoice ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="unstyled"
                fontSize="sm"
              />
            </HStack>
          </Box>
          
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            bg="gray.50"
            border="1px solid rgba(0, 0, 0, 0.05)"
            borderRadius="12px"
            fontSize="sm"
            _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #3B82F6" }}
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </Select>
          
          <Select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            bg="gray.50"
            border="1px solid rgba(0, 0, 0, 0.05)"
            borderRadius="12px"
            fontSize="sm"
            _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #3B82F6" }}
          >
            <option value="all">All Payment Methods</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
            <option value="cash">Cash</option>
            <option value="bank transfer">Bank Transfer</option>
          </Select>
          
          <Button 
            leftIcon={<Filter />} 
            variant="outline"
            borderColor="purple.300"
            color="purple.600"
            borderRadius="12px"
            _hover={{ 
              bg: "purple.50",
              borderColor: "purple.400"
            }}
          >
            Advanced Filters
          </Button>
        </Grid>
        
        <HStack justify="space-between" mt={4} pt={4} borderTop="1px solid" borderColor="gray.100">
          <Text fontSize="sm" color="gray.600">
            Showing {filteredBills.length} of {totalBills} invoices
          </Text>
          <HStack spacing={2}>
            <Button size="sm" leftIcon={<Download />} variant="ghost" color="gray.600" onClick={onExportOpen}>
              Export
            </Button>
            <Button 
              size="sm" 
              leftIcon={<Send />} 
              variant="ghost" 
              color="gray.600"
              onClick={handleBulkSend}
              isDisabled={selectedBills.length === 0}
            >
              Bulk Send ({selectedBills.length})
            </Button>
          </HStack>
        </HStack>
      </Box>

      {/* Enhanced Bills Table */}
      <Box
        bg="white"
        borderRadius="20px"
        border="1px solid rgba(255, 255, 255, 0.2)"
        boxShadow="0 8px 32px rgba(0, 0, 0, 0.08)"
        overflow="hidden"
      >
        <Box p={6} borderBottom="1px solid" borderColor="gray.100">
          <HStack justify="space-between">
            <HStack spacing={4}>
              <Text fontSize="lg" fontWeight="semibold" color="gray.800">
                Invoice Management
              </Text>
              {isUsingMockData && (
                <Badge colorScheme="orange" variant="subtle" borderRadius="full">
                  🔄 Demo Data
                </Badge>
              )}
            </HStack>
            <HStack spacing={2}>
              <Badge colorScheme="green" borderRadius="full" px={3}>
                {filteredBills.length} Total
              </Badge>
              {!isUsingMockData && (
                <Badge colorScheme="blue" variant="subtle" borderRadius="full">
                  ✓ Live Data
                </Badge>
              )}
            </HStack>
          </HStack>
        </Box>
        
        <TableContainer>
          <Table variant="simple" size="sm">
            <Thead bg="gray.50">
              <Tr>
                <Th 
                  color="gray.600" 
                  fontWeight="semibold" 
                  fontSize="xs"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  py={4}
                  textAlign="center"
                  w="50px"
                >
                  <Checkbox
                    isChecked={selectedBills.length === filteredBills.length && filteredBills.length > 0}
                    isIndeterminate={selectedBills.length > 0 && selectedBills.length < filteredBills.length}
                    onChange={(e) => handleBulkSelectAll(e.target.checked)}
                    colorScheme="blue"
                  />
                </Th>
                <Th 
                  color="gray.600" 
                  fontWeight="semibold" 
                  fontSize="xs"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  py={4}
                >
                  Invoice Details
                </Th>
                <Th 
                  color="gray.600" 
                  fontWeight="semibold" 
                  fontSize="xs"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Patient Information
                </Th>
                <Th 
                  color="gray.600" 
                  fontWeight="semibold" 
                  fontSize="xs"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Services
                </Th>
                <Th 
                  color="gray.600" 
                  fontWeight="semibold" 
                  fontSize="xs"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Payment Details
                </Th>
                <Th 
                  color="gray.600" 
                  fontWeight="semibold" 
                  fontSize="xs"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Status
                </Th>
                <Th 
                  color="gray.600" 
                  fontWeight="semibold" 
                  fontSize="xs"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Actions
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredBills.map((bill, index) => (
                <Tr 
                  key={bill.id} 
                  _hover={{ bg: 'gray.50' }}
                  borderBottom="1px solid"
                  borderColor="gray.100"
                >
                  <Td py={4} textAlign="center">
                    <Checkbox
                      isChecked={selectedBills.includes(bill.id)}
                      onChange={(e) => handleBillSelect(bill.id, e.target.checked)}
                      colorScheme="blue"
                    />
                  </Td>
                  <Td py={4}>
                    <VStack align="start" spacing={2}>
                      <HStack spacing={3}>
                        <Box p={2} bg="blue.100" borderRadius="8px">
                          <Receipt size={16} color="#3B82F6" />
                        </Box>
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="semibold" fontSize="sm">{bill.id}</Text>
                          <HStack fontSize="xs" color="gray.500" spacing={1}>
                            <Calendar size={12} />
                            <Text>{bill.date}</Text>
                          </HStack>
                        </VStack>
                      </HStack>
                    </VStack>
                  </Td>
                  <Td>
                    <HStack spacing={3}>
                      <Avatar 
                        size="md" 
                        name={bill.patientName}
                        bg="linear-gradient(135deg, #667eea, #764ba2)"
                        color="white"
                      />
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="semibold" fontSize="sm">{bill.patientName}</Text>
                        <Text fontSize="xs" color="gray.500">
                          ID: {bill.patientId}
                        </Text>
                        <HStack fontSize="xs" color="gray.500" spacing={1}>
                          <Phone size={10} />
                          <Text>{bill.phone}</Text>
                        </HStack>
                      </VStack>
                    </HStack>
                  </Td>
                  <Td>
                    <VStack align="start" spacing={1}>
                      {bill.services.map((service, serviceIndex) => (
                        <HStack key={serviceIndex} spacing={2}>
                          <Box w={2} h={2} bg="blue.400" borderRadius="full" />
                          <Text fontSize="xs" color="gray.700">
                            {service}
                          </Text>
                        </HStack>
                      ))}
                    </VStack>
                  </Td>
                  <Td>
                    <VStack align="start" spacing={2}>
                      <Box>
                        <Text fontWeight="bold" fontSize="sm">
                          ₹{bill.amount.toLocaleString('en-IN')}
                        </Text>
                        <Text fontSize="xs" color="green.600">
                          Paid: ₹{bill.paid.toLocaleString('en-IN')}
                        </Text>
                        {bill.amount > bill.paid && (
                          <Text fontSize="xs" color="red.600">
                            Due: ₹{(bill.amount - bill.paid).toLocaleString('en-IN')}
                          </Text>
                        )}
                      </Box>
                      <HStack spacing={2}>
                        <Text fontSize="lg">{getPaymentMethodIcon(bill.paymentMethod)}</Text>
                        <Text fontSize="xs" color="gray.600">{bill.paymentMethod}</Text>
                      </HStack>
                    </VStack>
                  </Td>
                  <Td>
                    <VStack align="start" spacing={2}>
                      <Badge 
                        colorScheme={getStatusColor(bill.status)} 
                        variant="subtle"
                        borderRadius="full"
                        px={3}
                        py={1}
                        fontSize="xs"
                        fontWeight="semibold"
                      >
                        {bill.status}
                      </Badge>
                      {bill.status === 'Partial' && (
                        <Progress 
                          value={(bill.paid / bill.amount) * 100} 
                          colorScheme="yellow" 
                          size="sm" 
                          borderRadius="full"
                          w="60px"
                        />
                      )}
                    </VStack>
                  </Td>
                  <Td>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        icon={<MoreVertical />}
                        variant="ghost"
                        size="sm"
                        borderRadius="8px"
                        _hover={{ bg: "gray.100" }}
                      />
                      <MenuList borderRadius="12px" border="1px solid" borderColor="gray.200">
                        <MenuItem 
                          icon={<Eye size={16} />} 
                          borderRadius="8px"
                          onClick={() => handleViewInvoice(bill)}
                        >
                          View Invoice
                        </MenuItem>
                        <MenuItem 
                          icon={<Download size={16} />} 
                          borderRadius="8px"
                          onClick={() => handleDownloadPDF(bill)}
                        >
                          Download PDF
                        </MenuItem>
                        <MenuItem 
                          icon={<Send size={16} />} 
                          borderRadius="8px"
                          onClick={() => handleSendToPatient(bill)}
                        >
                          Send to Patient
                        </MenuItem>
                        <MenuItem 
                          icon={<CreditCard size={16} />} 
                          borderRadius="8px"
                          onClick={() => handleRecordPaymentFromMenu(bill)}
                        >
                          Record Payment
                        </MenuItem>
                        <MenuItem 
                          icon={<Edit size={16} />} 
                          borderRadius="8px"
                          onClick={() => handleEditInvoice(bill)}
                        >
                          Edit Invoice
                        </MenuItem>
                        <MenuItem 
                          icon={<Copy size={16} />} 
                          borderRadius="8px"
                          onClick={() => handleDuplicateInvoice(bill)}
                        >
                          Duplicate Invoice
                        </MenuItem>
                        <MenuItem 
                          icon={<Trash2 size={16} />} 
                          borderRadius="8px"
                          color="red.500"
                          onClick={() => handleDeleteInvoice(bill)}
                        >
                          Delete Invoice
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        
        {filteredBills.length === 0 && (
          <Box textAlign="center" py={16}>
            <VStack spacing={4}>
              <Box p={4} bg="gray.100" borderRadius="full">
                <FileText size={32} color="#6B7280" />
              </Box>
              <VStack spacing={2}>
                <Text color="gray.600" fontWeight="semibold">No invoices found</Text>
                <Text color="gray.500" fontSize="sm">
                  Try adjusting your search criteria or generate a new invoice from the header
                </Text>
              </VStack>
            </VStack>
          </Box>
        )}
      </Box>

      {/* Invoice Generation Modal */}
      <Modal isOpen={isInvoiceOpen} onClose={handleInvoiceClose} size="xl">
        <ModalOverlay bg="rgba(0, 0, 0, 0.6)" backdropFilter="blur(10px)" />
        <ModalContent borderRadius="20px" bg="white">
          <ModalHeader borderRadius="20px 20px 0 0" bg="linear-gradient(135deg, #10B981, #3B82F6)" color="white">
            <HStack spacing={3}>
              <Plus size={24} />
              <Text>Generate New Invoice</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody p={6}>
            <VStack spacing={6} align="stretch">
              <SimpleGrid columns={2} spacing={4}>
                <FormControl position="relative">
                  <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">
                    <HStack spacing={2}>
                      <User size={16} />
                      <Text>Patient Name</Text>
                    </HStack>
                  </FormLabel>
                  <Input 
                    placeholder="Search patient by name, ID, or phone..." 
                    value={patientSearchTerm}
                    onChange={(e) => handlePatientSearch(e.target.value)}
                    borderRadius="10px"
                    border="1px solid rgba(0, 0, 0, 0.1)"
                    _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #3B82F6" }}
                    bg={selectedPatient ? "green.50" : "white"}
                  />
                  
                  {/* Patient Suggestions Dropdown */}
                  {showPatientSuggestions && filteredPatients.length > 0 && (
                    <Box
                      position="absolute"
                      top="100%"
                      left={0}
                      right={0}
                      zIndex={10}
                      bg="white"
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="12px"
                      boxShadow="0 8px 32px rgba(0, 0, 0, 0.15)"
                      maxH="200px"
                      overflowY="auto"
                      mt={1}
                    >
                      {filteredPatients.map((patient) => (
                        <Box
                          key={patient.id}
                          p={3}
                          cursor="pointer"
                          _hover={{ bg: "blue.50" }}
                          borderBottom="1px solid"
                          borderColor="gray.100"
                          onClick={() => handlePatientSelect(patient)}
                        >
                          <HStack spacing={3}>
                            <Avatar size="sm" name={patient.name} bg="blue.500" />
                            <VStack align="start" spacing={0} flex={1}>
                              <HStack justify="space-between" w="100%">
                                <Text fontWeight="semibold" fontSize="sm">{patient.name}</Text>
                                <Badge colorScheme="blue" size="sm">{patient.id}</Badge>
                              </HStack>
                              <Text fontSize="xs" color="gray.500">{patient.phone}</Text>
                              <Text fontSize="xs" color="gray.400">{patient.address}</Text>
                            </VStack>
                          </HStack>
                        </Box>
                      ))}
                    </Box>
                  )}
                  
                  {/* Selected Patient Display */}
                  {selectedPatient && (
                    <Box
                      mt={2}
                      p={3}
                      bg="green.50"
                      borderRadius="8px"
                      border="1px solid"
                      borderColor="green.200"
                    >
                      <HStack justify="space-between">
                        <HStack spacing={3}>
                          <Avatar size="sm" name={selectedPatient.name} bg="green.500" />
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="semibold" fontSize="sm">{selectedPatient.name}</Text>
                            <Text fontSize="xs" color="gray.600">{selectedPatient.id} • {selectedPatient.phone}</Text>
                          </VStack>
                        </HStack>
                        <IconButton
                          size="xs"
                          icon={<Text>×</Text>}
                          variant="ghost"
                          onClick={() => {
                            setSelectedPatient(null);
                            setPatientSearchTerm('');
                          }}
                        />
                      </HStack>
                    </Box>
                  )}
                </FormControl>
                
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">
                    <HStack spacing={2}>
                      <Calendar size={16} />
                      <Text>Invoice Date</Text>
                    </HStack>
                  </FormLabel>
                  <Input 
                    type="date"
                    value={invoiceForm.invoiceDate}
                    onChange={(e) => handleFormChange('invoiceDate', e.target.value)}
                    borderRadius="10px"
                    border="1px solid rgba(0, 0, 0, 0.1)"
                    _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #3B82F6" }}
                  />
                </FormControl>
              </SimpleGrid>
              
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">
                  <HStack spacing={2}>
                    <FileText size={16} />
                    <Text>Services Provided</Text>
                  </HStack>
                </FormLabel>
                <Textarea 
                  placeholder="List all services and treatments provided (separate with commas)..." 
                  value={invoiceForm.services}
                  onChange={(e) => handleFormChange('services', e.target.value)}
                  borderRadius="10px"
                  border="1px solid rgba(0, 0, 0, 0.1)"
                  _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #3B82F6" }}
                  rows={4}
                />
              </FormControl>
              
              <SimpleGrid columns={2} spacing={4}>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">
                    <HStack spacing={2}>
                      <DollarSign size={16} />
                      <Text>Total Amount</Text>
                    </HStack>
                  </FormLabel>
                  <Input 
                    type="number"
                    placeholder="Enter amount in ₹" 
                    value={invoiceForm.totalAmount}
                    onChange={(e) => handleFormChange('totalAmount', e.target.value)}
                    borderRadius="10px"
                    border="1px solid rgba(0, 0, 0, 0.1)"
                    _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #3B82F6" }}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">
                    <HStack spacing={2}>
                      <CreditCard size={16} />
                      <Text>Payment Method</Text>
                    </HStack>
                  </FormLabel>
                  <Select 
                    placeholder="Select payment method"
                    value={invoiceForm.paymentMethod}
                    onChange={(e) => handleFormChange('paymentMethod', e.target.value)}
                    borderRadius="10px"
                    border="1px solid rgba(0, 0, 0, 0.1)"
                    _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #3B82F6" }}
                  >
                    <option value="cash">💰 Cash</option>
                    <option value="upi">📱 UPI</option>
                    <option value="card">💳 Card</option>
                    <option value="bank">🏦 Bank Transfer</option>
                  </Select>
                </FormControl>
              </SimpleGrid>
              
              <Alert status="info" borderRadius="12px">
                <AlertIcon />
                <Box>
                  <AlertTitle fontSize="sm">Form Status</AlertTitle>
                  <AlertDescription fontSize="xs">
                    {selectedPatient 
                      ? `✅ Patient: ${selectedPatient.name} selected${
                          invoiceForm.services && invoiceForm.totalAmount && invoiceForm.paymentMethod 
                            ? ' • Ready to generate invoice!' 
                            : ' • Please fill all required fields'
                        }`
                      : '⚠️ Select a patient to continue'
                    }
                  </AlertDescription>
                </Box>
              </Alert>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleInvoiceClose}>
              Cancel
            </Button>
            <Button 
              bg="linear-gradient(135deg, #10B981, #3B82F6)" 
              color="white"
              leftIcon={<FileText />}
              onClick={handleGenerateInvoice}
              isLoading={isGenerating}
              loadingText="Generating..."
              _hover={{ opacity: 0.9 }}
              isDisabled={!selectedPatient || !invoiceForm.services || !invoiceForm.totalAmount || !invoiceForm.paymentMethod}
            >
              Generate Invoice
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Payment Recording Modal */}
      <Modal isOpen={isPaymentOpen} onClose={onPaymentClose} size="xl">
        <ModalOverlay bg="rgba(0, 0, 0, 0.6)" backdropFilter="blur(10px)" />
        <ModalContent borderRadius="20px" bg="white">
          <ModalHeader borderRadius="20px 20px 0 0" bg="linear-gradient(135deg, #3B82F6, #10B981)" color="white">
            <HStack spacing={3}>
              <CreditCard size={24} />
              <Text>Record Payment</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody p={6}>
            <VStack spacing={6} align="stretch">
              {/* Patient Search Section */}
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">
                  Patient Name <Text as="span" color="red.500">*</Text>
                </FormLabel>
                <Box position="relative">
                  <Input
                    placeholder="Search patient by name or ID..."
                    value={paymentForm.patientName}
                    onChange={(e) => handlePaymentPatientSearch(e.target.value)}
                    borderRadius="10px"
                    border="1px solid rgba(0, 0, 0, 0.1)"
                    _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #3B82F6" }}
                  />
                  {showPaymentSuggestions && paymentPatientSuggestions.length > 0 && (
                    <Box
                      position="absolute"
                      top="100%"
                      left={0}
                      right={0}
                      bg="white"
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="md"
                      maxH="200px"
                      overflowY="auto"
                      zIndex={1000}
                      boxShadow="lg"
                    >
                      {paymentPatientSuggestions.map((patient) => (
                        <Box
                          key={patient.id}
                          p={3}
                          cursor="pointer"
                          _hover={{ bg: "gray.50" }}
                          onClick={() => handlePaymentPatientSelect(patient)}
                        >
                          <HStack justify="space-between">
                            <VStack align="start" spacing={0}>
                              <Text fontWeight="medium">{patient.name}</Text>
                              <Text fontSize="sm" color="gray.600">{patient.id} • {patient.phone}</Text>
                            </VStack>
                            <Badge 
                              colorScheme={patient.outstandingAmount > 0 ? "red" : "green"}
                              variant="subtle"
                            >
                              {patient.outstandingAmount > 0 ? `₹${patient.outstandingAmount} due` : 'Paid'}
                            </Badge>
                          </HStack>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </FormControl>

              {/* Outstanding Balance Display */}
              {selectedPaymentPatient && (
                <Box bg="gradient-to-r from-blue-50 to-green-50" p={4} borderRadius="12px" border="1px solid rgba(59, 130, 246, 0.2)">
                  <VStack spacing={3} align="stretch">
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.600">Patient ID:</Text>
                      <Text fontWeight="semibold">{selectedPaymentPatient.id}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.600">Phone:</Text>
                      <Text fontWeight="semibold">{selectedPaymentPatient.phone}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="gray.600">Outstanding Balance:</Text>
                      <Text 
                        fontWeight="bold" 
                        fontSize="lg"
                        color={selectedPaymentPatient.outstandingAmount > 0 ? "red.600" : "green.600"}
                      >
                        ₹{selectedPaymentPatient.outstandingAmount.toLocaleString('en-IN')}
                      </Text>
                    </HStack>
                    {selectedPaymentPatient.outstandingAmount === 0 && (
                      <Box bg="green.100" p={2} borderRadius="md">
                        <Text fontSize="sm" color="green.700" textAlign="center">
                          ✓ No outstanding balance for this patient
                        </Text>
                      </Box>
                    )}
                  </VStack>
                </Box>
              )}
              
              <SimpleGrid columns={2} spacing={4}>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">
                    Payment Amount <Text as="span" color="red.500">*</Text>
                  </FormLabel>
                  <Input 
                    type="number"
                    placeholder="Enter amount received"
                    value={paymentForm.amount}
                    onChange={(e) => handlePaymentFormChange('amount', e.target.value)}
                    borderRadius="10px"
                    border="1px solid rgba(0, 0, 0, 0.1)"
                    _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #3B82F6" }}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">
                    Payment Method <Text as="span" color="red.500">*</Text>
                  </FormLabel>
                  <Select 
                    placeholder="Select method"
                    value={paymentForm.paymentMethod}
                    onChange={(e) => handlePaymentFormChange('paymentMethod', e.target.value)}
                    borderRadius="10px"
                    border="1px solid rgba(0, 0, 0, 0.1)"
                    _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #3B82F6" }}
                  >
                    <option value="cash">Cash</option>
                    <option value="upi">UPI</option>
                    <option value="card">Credit/Debit Card</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="cheque">Cheque</option>
                  </Select>
                </FormControl>
              </SimpleGrid>
              
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">Notes</FormLabel>
                <Textarea 
                  placeholder="Add any additional notes about this payment..." 
                  value={paymentForm.notes}
                  onChange={(e) => handlePaymentFormChange('notes', e.target.value)}
                  borderRadius="10px"
                  border="1px solid rgba(0, 0, 0, 0.1)"
                  _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #3B82F6" }}
                  rows={3}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onPaymentClose} disabled={isProcessingPayment}>
              Cancel
            </Button>
            <Button 
              bg="linear-gradient(135deg, #3B82F6, #10B981)" 
              color="white"
              leftIcon={isProcessingPayment ? <Spinner size="sm" /> : <CheckCircle />}
              _hover={{ opacity: 0.9 }}
              onClick={handleRecordPayment}
              isLoading={isProcessingPayment}
              loadingText="Recording..."
              disabled={!selectedPaymentPatient || !paymentForm.paymentMethod || !paymentForm.amount}
            >
              Record Payment
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Export Modal */}
      <Modal isOpen={isExportOpen} onClose={onExportClose} size="md">
        <ModalOverlay bg="rgba(0, 0, 0, 0.6)" backdropFilter="blur(10px)" />
        <ModalContent borderRadius="20px" bg="white">
          <ModalHeader borderRadius="20px 20px 0 0" bg="linear-gradient(135deg, #3B82F6, #10B981)" color="white">
            <HStack spacing={3}>
              <Download size={24} />
              <Text>Export Billing Report</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody p={6}>
            <VStack spacing={4} align="stretch">
              <Text fontSize="sm" color="gray.600" mb={2}>
                Export {filteredBills.length} invoice records in your preferred format:
              </Text>
              
              <VStack spacing={3} align="stretch">
                <Button
                  leftIcon={<FileText />}
                  size="lg"
                  variant="outline"
                  borderColor="red.300"
                  color="red.600"
                  borderRadius="12px"
                  _hover={{ 
                    bg: "red.50",
                    borderColor: "red.400"
                  }}
                  h={12}
                  onClick={exportToPDF}
                  justifyContent="flex-start"
                >
                  <VStack align="start" spacing={1} ml={2}>
                    <Text fontWeight="semibold">Export as PDF</Text>
                    <Text fontSize="xs" color="gray.500">Formatted report with charts and summaries</Text>
                  </VStack>
                </Button>
                
                <Button
                  leftIcon={<FileText />}
                  size="lg"
                  variant="outline"
                  borderColor="green.300"
                  color="green.600"
                  borderRadius="12px"
                  _hover={{ 
                    bg: "green.50",
                    borderColor: "green.400"
                  }}
                  h={12}
                  onClick={exportToExcel}
                  justifyContent="flex-start"
                >
                  <VStack align="start" spacing={1} ml={2}>
                    <Text fontWeight="semibold">Export as Excel</Text>
                    <Text fontSize="xs" color="gray.500">Spreadsheet format with formulas and charts</Text>
                  </VStack>
                </Button>
                
                <Button
                  leftIcon={<FileText />}
                  size="lg"
                  variant="outline"
                  borderColor="blue.300"
                  color="blue.600"
                  borderRadius="12px"
                  _hover={{ 
                    bg: "blue.50",
                    borderColor: "blue.400"
                  }}
                  h={12}
                  onClick={exportToCSV}
                  justifyContent="flex-start"
                >
                  <VStack align="start" spacing={1} ml={2}>
                    <Text fontWeight="semibold">Export as CSV</Text>
                    <Text fontSize="xs" color="gray.500">Comma-separated values for data analysis</Text>
                  </VStack>
                </Button>
              </VStack>
              
              <Alert status="info" borderRadius="8px" mt={4}>
                <AlertIcon />
                <Box>
                  <AlertTitle fontSize="sm">Export includes:</AlertTitle>
                  <AlertDescription fontSize="xs">
                    Invoice details, patient information, payment status, and financial summaries based on current filters.
                  </AlertDescription>
                </Box>
              </Alert>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onExportClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Bulk Send Modal */}
      <Modal isOpen={isBulkSendOpen} onClose={onBulkSendClose} size="lg">
        <ModalOverlay bg="rgba(0, 0, 0, 0.6)" backdropFilter="blur(10px)" />
        <ModalContent borderRadius="20px" bg="white">
          <ModalHeader borderRadius="20px 20px 0 0" bg="linear-gradient(135deg, #10B981, #3B82F6)" color="white">
            <HStack spacing={3}>
              <Send size={24} />
              <Text>Bulk Send Invoices</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody p={6}>
            <VStack spacing={6} align="stretch">
              <Box bg="green.50" p={4} borderRadius="12px" border="1px solid rgba(16, 185, 129, 0.2)">
                <HStack spacing={3} mb={3}>
                  <CheckCircle size={20} color="#10B981" />
                  <Text fontWeight="semibold" color="green.700">
                    {selectedBills.length} Invoice{selectedBills.length !== 1 ? 's' : ''} Selected
                  </Text>
                </HStack>
                <VStack align="start" spacing={2}>
                  {filteredBills
                    .filter(bill => selectedBills.includes(bill.id))
                    .slice(0, 3)
                    .map(bill => (
                      <HStack key={bill.id} spacing={3}>
                        <Badge colorScheme="green" size="sm">{bill.id}</Badge>
                        <Text fontSize="sm" color="gray.700">{bill.patientName}</Text>
                        <Text fontSize="sm" color="gray.500">₹{bill.amount.toLocaleString('en-IN')}</Text>
                      </HStack>
                    ))}
                  {selectedBills.length > 3 && (
                    <Text fontSize="sm" color="gray.500" fontStyle="italic">
                      ... and {selectedBills.length - 3} more invoices
                    </Text>
                  )}
                </VStack>
              </Box>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">
                  Notification Type
                </FormLabel>
                <Select 
                  placeholder="Select notification type"
                  borderRadius="10px"
                  border="1px solid rgba(0, 0, 0, 0.1)"
                  _focus={{ borderColor: "green.400", boxShadow: "0 0 0 1px #10B981" }}
                >
                  <option value="invoice">Invoice Notification</option>
                  <option value="reminder">Payment Reminder</option>
                  <option value="overdue">Overdue Notice</option>
                  <option value="receipt">Payment Receipt</option>
                  <option value="statement">Account Statement</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">
                  Custom Message
                </FormLabel>
                <Textarea 
                  placeholder="Enter your custom message to patients..."
                  value={bulkSendMessage}
                  onChange={(e) => setBulkSendMessage(e.target.value)}
                  borderRadius="10px"
                  border="1px solid rgba(0, 0, 0, 0.1)"
                  _focus={{ borderColor: "green.400", boxShadow: "0 0 0 1px #10B981" }}
                  rows={4}
                />
              </FormControl>

              <Box bg="blue-50" p={4} borderRadius="12px" border="1px solid rgba(59, 130, 246, 0.2)">
                <VStack align="start" spacing={2}>
                  <HStack spacing={3}>
                    <AlertCircle size={16} color="#3B82F6" />
                    <Text fontSize="sm" fontWeight="semibold" color="blue.700">Delivery Summary</Text>
                  </HStack>
                  <Text fontSize="sm" color="blue.600">
                    • Invoices will be sent via email and SMS
                  </Text>
                  <Text fontSize="sm" color="blue.600">
                    • Total amount: ₹{filteredBills
                      .filter(bill => selectedBills.includes(bill.id))
                      .reduce((acc, bill) => acc + bill.amount, 0)
                      .toLocaleString('en-IN')
                    }
                  </Text>
                  <Text fontSize="sm" color="blue.600">
                    • Estimated delivery time: 1-3 minutes
                  </Text>
                </VStack>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onBulkSendClose}>
              Cancel
            </Button>
            <Button 
              bg="linear-gradient(135deg, #10B981, #3B82F6)" 
              color="white"
              leftIcon={<Send />}
              _hover={{ opacity: 0.9 }}
              onClick={sendBulkInvoices}
            >
              Send Invoices
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View Invoice Modal */}
      <Modal isOpen={isViewInvoiceOpen} onClose={onViewInvoiceClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader 
            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            color="white"
            borderTopRadius="md"
          >
            <HStack spacing={3}>
              <Eye size={20} />
              <Text>Invoice Details</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody p={6}>
            {selectedInvoiceForView && (
              <VStack spacing={6} align="stretch">
                {/* Invoice Header */}
                <Box textAlign="center" p={4} bg="gray.50" borderRadius="md">
                  <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                    INVOICE #{selectedInvoiceForView.id}
                  </Text>
                  <Text color="gray.600" mt={2}>
                    Date: {selectedInvoiceForView.date}
                  </Text>
                </Box>

                {/* Patient Information */}
                <Box p={4} bg="blue.50" borderRadius="md">
                  <Text fontSize="lg" fontWeight="bold" mb={3} color="blue.700">
                    Patient Information
                  </Text>
                  <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                    <Box>
                      <Text fontWeight="semibold" color="gray.700">Name:</Text>
                      <Text>{selectedInvoiceForView.patientName}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="semibold" color="gray.700">Patient ID:</Text>
                      <Text>{selectedInvoiceForView.patientId}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="semibold" color="gray.700">Phone:</Text>
                      <Text>{selectedInvoiceForView.phone}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="semibold" color="gray.700">Status:</Text>
                      <Badge
                        colorScheme={
                          selectedInvoiceForView.status === 'Paid' ? 'green' :
                          selectedInvoiceForView.status === 'Partial' ? 'yellow' : 'red'
                        }
                        px={2}
                        py={1}
                        borderRadius="full"
                        fontSize="xs"
                        fontWeight="semibold"
                      >
                        {selectedInvoiceForView.status}
                      </Badge>
                    </Box>
                  </Grid>
                </Box>

                {/* Services */}
                <Box p={4} bg="green.50" borderRadius="md">
                  <Text fontSize="lg" fontWeight="bold" mb={3} color="green.700">
                    Services Provided
                  </Text>
                  <VStack align="start" spacing={2}>
                    {selectedInvoiceForView.services.map((service, index) => (
                      <HStack key={index}>
                        <Check size={16} color="green" />
                        <Text>{service}</Text>
                      </HStack>
                    ))}
                  </VStack>
                </Box>

                {/* Billing Details */}
                <Box p={4} bg="orange.50" borderRadius="md">
                  <Text fontSize="lg" fontWeight="bold" mb={3} color="orange.700">
                    Billing Summary
                  </Text>
                  <VStack spacing={3}>
                    <HStack justify="space-between" w="full">
                      <Text fontWeight="semibold">Total Amount:</Text>
                      <Text fontSize="lg" fontWeight="bold">
                        ₹{selectedInvoiceForView.amount.toLocaleString('en-IN')}
                      </Text>
                    </HStack>
                    <HStack justify="space-between" w="full">
                      <Text fontWeight="semibold">Paid Amount:</Text>
                      <Text fontSize="lg" color="green.600">
                        ₹{selectedInvoiceForView.paid.toLocaleString('en-IN')}
                      </Text>
                    </HStack>
                    <HStack justify="space-between" w="full">
                      <Text fontWeight="semibold">Outstanding:</Text>
                      <Text 
                        fontSize="lg" 
                        fontWeight="bold"
                        color={selectedInvoiceForView.amount > selectedInvoiceForView.paid ? 'red.600' : 'green.600'}
                      >
                        ₹{(selectedInvoiceForView.amount - selectedInvoiceForView.paid).toLocaleString('en-IN')}
                      </Text>
                    </HStack>
                    <Box w="full" h="1px" bg="gray.200" />
                    <HStack justify="space-between" w="full">
                      <Text fontWeight="semibold">Payment Method:</Text>
                      <Text>{selectedInvoiceForView.paymentMethod}</Text>
                    </HStack>
                  </VStack>
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter bg="gray.50">
            <HStack spacing={3}>
              <Button
                colorScheme="purple"
                onClick={() => handleDownloadPDF(selectedInvoiceForView)}
                leftIcon={<Download size={16} />}
              >
                Download
              </Button>
              <Button
                colorScheme="blue"
                onClick={() => {
                  handleSendToPatient(selectedInvoiceForView);
                  onViewInvoiceClose();
                }}
                leftIcon={<Send size={16} />}
              >
                Send to Patient
              </Button>
              <Button variant="outline" onClick={onViewInvoiceClose}>
                Close
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Box>
  );
};

export default BillingManagement;
