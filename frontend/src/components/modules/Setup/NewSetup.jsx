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
  Switch,
  FormControl,
  FormLabel,
  Textarea,
  SimpleGrid,
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
  Checkbox,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper
} from '@chakra-ui/react';
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Settings,
  Database,
  Shield,
  Bell,
  Mail,
  Smartphone,
  Globe,
  Users,
  Calendar,
  Clock,
  Save,
  RefreshCw,
  Download,
  Upload,
  Server,
  Wifi,
  Monitor,
  Eye,
  EyeOff,
  Key,
  Lock,
  Unlock,
  CheckCircle,
  AlertCircle,
  Info,
  Trash2,
  DollarSign,
  Bed,
  FileText,
  Pill,
  Activity,
  TrendingUp,
  Video,
  MapPin,
  Printer,
  Receipt,
  CreditCard,
  Heart,
  Stethoscope,
  UserCheck,
  Building
} from 'lucide-react';

const Setup = ({ title = "System Setup" }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedSubsection, setSelectedSubsection] = useState('general-setting');
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const setupCategories = [
    {
      id: 'settings',
      title: 'Settings',
      icon: Settings,
      color: 'blue',
      subsections: [
        { id: 'general-setting', title: 'General Setting', icon: Settings },
        { id: 'notification-setting', title: 'Notification Setting', icon: Bell },
        { id: 'system-notification-setting', title: 'System Notification Setting', icon: Monitor },
        { id: 'sms-setting', title: 'SMS Setting', icon: Smartphone },
        { id: 'whatsapp-setting', title: 'WhatsApp Setting', icon: Smartphone },
        { id: 'email-setting', title: 'Email Setting', icon: Mail },
        { id: 'payment-methods', title: 'Payment Methods', icon: CreditCard },
        { id: 'front-cms-setting', title: 'Front CMS Setting', icon: Globe },
        { id: 'backup-restore', title: 'Backup/Restore', icon: Database },
        { id: 'languages', title: 'Languages', icon: Globe },
        { id: 'users', title: 'Users', icon: Users }
      ]
    },
    {
      id: 'hospital-charges',
      title: 'Hospital Charges',
      icon: DollarSign,
      color: 'green',
      subsections: [
        { id: 'charges', title: 'Charges', icon: DollarSign },
        { id: 'charge-category', title: 'Charge Category', icon: TrendingUp },
        { id: 'charge-type', title: 'Charge Type', icon: FileText },
        { id: 'tax-category', title: 'Tax Category', icon: Receipt }
      ]
    },
    {
      id: 'bed',
      title: 'Bed',
      icon: Bed,
      color: 'purple',
      subsections: [
        { id: 'bed-status', title: 'Bed Status', icon: Activity },
        { id: 'bed', title: 'Bed', icon: Bed },
        { id: 'bed-type', title: 'Bed Type', icon: Building },
        { id: 'bed-group', title: 'Bed Group', icon: Building },
        { id: 'floor', title: 'Floor', icon: MapPin }
      ]
    },
    {
      id: 'print-header-footer',
      title: 'Print Header Footer',
      icon: Printer,
      color: 'orange',
      subsections: [
        { id: 'appointment', title: 'Appointment', icon: Calendar },
        { id: 'opd-prescription', title: 'OPD Prescription', icon: FileText },
        { id: 'opd-bill', title: 'OPD Bill', icon: Receipt },
        { id: 'ipd-prescription', title: 'IPD Prescription', icon: FileText },
        { id: 'ipd-bill', title: 'IPD Bill', icon: Receipt },
        { id: 'bill-summary', title: 'Bill Summary', icon: Receipt },
        { id: 'pharmacy-bill', title: 'Pharmacy Bill', icon: Pill },
        { id: 'payslip', title: 'Payslip', icon: DollarSign },
        { id: 'payment-receipt', title: 'Payment Receipt', icon: Receipt },
        { id: 'discharge-card', title: 'Discharge Card', icon: UserCheck }
      ]
    },
    {
      id: 'pharmacy',
      title: 'Pharmacy',
      icon: Pill,
      color: 'teal',
      subsections: [
        { id: 'medicine-category', title: 'Medicine Category', icon: Pill },
        { id: 'supplier', title: 'Supplier', icon: Users },
        { id: 'medicine-dosage', title: 'Medicine Dosage', icon: Pill },
        { id: 'dose-interval', title: 'Dose Interval', icon: Clock },
        { id: 'dose-duration', title: 'Dose Duration', icon: Calendar },
        { id: 'unit', title: 'Unit', icon: FileText },
        { id: 'company', title: 'Company', icon: Building },
        { id: 'medicine-group', title: 'Medicine Group', icon: Pill }
      ]
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      icon: Activity,
      color: 'red',
      subsections: [
        { id: 'symptoms-head', title: 'Symptoms Head', icon: Activity },
        { id: 'symptoms-type', title: 'Symptoms Type', icon: Heart }
      ]
    },
    {
      id: 'findings',
      title: 'Findings',
      icon: Stethoscope,
      color: 'pink',
      subsections: [
        { id: 'finding', title: 'Finding', icon: Stethoscope },
        { id: 'category', title: 'Category', icon: FileText }
      ]
    },
    {
      id: 'zoom-gmeet-setting',
      title: 'Zoom/GMeet Setting',
      icon: Video,
      color: 'cyan',
      subsections: []
    },
    {
      id: 'finance',
      title: 'Finance',
      icon: TrendingUp,
      color: 'yellow',
      subsections: [
        { id: 'income-head', title: 'Income Head', icon: TrendingUp },
        { id: 'expense-head', title: 'Expense Head', icon: DollarSign }
      ]
    },
    {
      id: 'appointment',
      title: 'Appointment',
      icon: Calendar,
      color: 'indigo',
      subsections: [
        { id: 'slots', title: 'Slots', icon: Clock },
        { id: 'doctor-shift', title: 'Doctor Shift', icon: UserCheck },
        { id: 'shift', title: 'Shift', icon: Clock },
        { id: 'appointment-priority', title: 'Appointment Priority', icon: AlertCircle }
      ]
    }
  ];

  const renderSubsectionContent = () => {
    switch (selectedSubsection) {
      case 'general-setting':
        return (
          <VStack spacing={6} align="stretch">
            <Text fontSize="lg" fontWeight="semibold">General Settings</Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl>
                <FormLabel>Hospital Name</FormLabel>
                <Input defaultValue="Ayurveda Wellness Hospital" />
              </FormControl>
              <FormControl>
                <FormLabel>Hospital Code</FormLabel>
                <Input defaultValue="AWH001" />
              </FormControl>
              <FormControl>
                <FormLabel>Phone Number</FormLabel>
                <Input defaultValue="+91 80 1234 5678" />
              </FormControl>
              <FormControl>
                <FormLabel>Email Address</FormLabel>
                <Input defaultValue="info@ayurvedawellness.com" />
              </FormControl>
              <FormControl>
                <FormLabel>Website</FormLabel>
                <Input defaultValue="www.ayurvedawellness.com" />
              </FormControl>
              <FormControl>
                <FormLabel>Currency</FormLabel>
                <Select defaultValue="INR">
                  <option value="INR">Indian Rupee (INR)</option>
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                </Select>
              </FormControl>
            </SimpleGrid>
            <FormControl>
              <FormLabel>Hospital Address</FormLabel>
              <Textarea defaultValue="123 Wellness Street, Bangalore, Karnataka 560001" rows={3} />
            </FormControl>
            <Button colorScheme="blue" leftIcon={<Save />}>Save Settings</Button>
          </VStack>
        );

      case 'notification-setting':
        return (
          <VStack spacing={6} align="stretch">
            <Text fontSize="lg" fontWeight="semibold">Notification Settings</Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Card border="1px" borderColor={borderColor}>
                <CardBody>
                  <VStack spacing={4}>
                    <Text fontWeight="medium">Email Notifications</Text>
                    <HStack justify="space-between" w="full">
                      <Text fontSize="sm">Enable Email Notifications</Text>
                      <Switch defaultChecked />
                    </HStack>
                    <HStack justify="space-between" w="full">
                      <Text fontSize="sm">Appointment Reminders</Text>
                      <Switch defaultChecked />
                    </HStack>
                    <HStack justify="space-between" w="full">
                      <Text fontSize="sm">Payment Reminders</Text>
                      <Switch defaultChecked />
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
              <Card border="1px" borderColor={borderColor}>
                <CardBody>
                  <VStack spacing={4}>
                    <Text fontWeight="medium">SMS Notifications</Text>
                    <HStack justify="space-between" w="full">
                      <Text fontSize="sm">Enable SMS Notifications</Text>
                      <Switch defaultChecked />
                    </HStack>
                    <HStack justify="space-between" w="full">
                      <Text fontSize="sm">Appointment Confirmations</Text>
                      <Switch defaultChecked />
                    </HStack>
                    <HStack justify="space-between" w="full">
                      <Text fontSize="sm">Bill Reminders</Text>
                      <Switch />
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            </SimpleGrid>
            <Button colorScheme="blue" leftIcon={<Save />}>Save Notification Settings</Button>
          </VStack>
        );

      case 'users':
        return (
          <VStack spacing={6} align="stretch">
            <Flex justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="semibold">User Management</Text>
              <Button leftIcon={<Plus />} colorScheme="blue" onClick={onAddOpen}>
                Add New User
              </Button>
            </Flex>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Email</Th>
                    <Th>Role</Th>
                    <Th>Department</Th>
                    <Th>Status</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {[
                    { name: 'Dr. Priya Sharma', email: 'priya@hospital.com', role: 'Doctor', department: 'Ayurveda', status: 'Active' },
                    { name: 'Nurse Anjali', email: 'anjali@hospital.com', role: 'Nurse', department: 'General', status: 'Active' },
                    { name: 'Admin User', email: 'admin@hospital.com', role: 'Admin', department: 'Administration', status: 'Active' }
                  ].map((user, index) => (
                    <Tr key={index}>
                      <Td>{user.name}</Td>
                      <Td>{user.email}</Td>
                      <Td><Badge colorScheme="blue">{user.role}</Badge></Td>
                      <Td>{user.department}</Td>
                      <Td><Badge colorScheme="green">{user.status}</Badge></Td>
                      <Td>
                        <IconButton size="sm" icon={<MoreVertical />} variant="ghost" />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </VStack>
        );

      case 'charges':
        return (
          <VStack spacing={6} align="stretch">
            <Flex justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="semibold">Hospital Charges</Text>
              <Button leftIcon={<Plus />} colorScheme="green" onClick={onAddOpen}>
                Add New Charge
              </Button>
            </Flex>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Charge Name</Th>
                    <Th>Category</Th>
                    <Th>Type</Th>
                    <Th>Amount</Th>
                    <Th>Tax</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {[
                    { name: 'Consultation Fee', category: 'OPD', type: 'Fixed', amount: '₹500', tax: '18%' },
                    { name: 'Panchakarma Treatment', category: 'Treatment', type: 'Variable', amount: '₹2,500', tax: '18%' },
                    { name: 'Room Charges - General', category: 'IPD', type: 'Per Day', amount: '₹1,200', tax: '12%' }
                  ].map((charge, index) => (
                    <Tr key={index}>
                      <Td>{charge.name}</Td>
                      <Td><Badge colorScheme="blue">{charge.category}</Badge></Td>
                      <Td>{charge.type}</Td>
                      <Td fontWeight="semibold">{charge.amount}</Td>
                      <Td>{charge.tax}</Td>
                      <Td>
                        <IconButton size="sm" icon={<MoreVertical />} variant="ghost" />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </VStack>
        );

      case 'bed-status':
        return (
          <VStack spacing={6} align="stretch">
            <Flex justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="semibold">Bed Status Management</Text>
              <Button leftIcon={<Plus />} colorScheme="purple" onClick={onAddOpen}>
                Add Bed Status
              </Button>
            </Flex>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              {[
                { status: 'Available', count: 45, color: 'green' },
                { status: 'Occupied', count: 32, color: 'red' },
                { status: 'Maintenance', count: 3, color: 'orange' },
                { status: 'Reserved', count: 8, color: 'blue' }
              ].map((item, index) => (
                <Card key={index} border="1px" borderColor={borderColor}>
                  <CardBody textAlign="center">
                    <Text fontSize="2xl" fontWeight="bold" color={`${item.color}.500`}>
                      {item.count}
                    </Text>
                    <Text color="gray.600">{item.status} Beds</Text>
                    <Badge colorScheme={item.color} mt={2}>{item.status}</Badge>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>
        );

      case 'medicine-category':
        return (
          <VStack spacing={6} align="stretch">
            <Flex justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="semibold">Medicine Categories</Text>
              <Button leftIcon={<Plus />} colorScheme="teal" onClick={onAddOpen}>
                Add Category
              </Button>
            </Flex>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {[
                'Digestive Medicines',
                'Immunity Boosters',
                'Pain Relief',
                'Respiratory Care',
                'Skin Care',
                'Mental Health',
                'Heart Care',
                'Liver Care',
                'Kidney Care'
              ].map((category, index) => (
                <Card key={index} border="1px" borderColor={borderColor}>
                  <CardBody>
                    <Flex justify="space-between" align="center">
                      <Text fontWeight="medium">{category}</Text>
                      <IconButton size="sm" icon={<MoreVertical />} variant="ghost" />
                    </Flex>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>
        );

      case 'symptoms-head':
        return (
          <VStack spacing={6} align="stretch">
            <Flex justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="semibold">Symptoms Head</Text>
              <Button leftIcon={<Plus />} colorScheme="red" onClick={onAddOpen}>
                Add Symptom Head
              </Button>
            </Flex>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Symptom Head</Th>
                    <Th>Category</Th>
                    <Th>Description</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {[
                    { head: 'Digestive Issues', category: 'Gastrointestinal', description: 'Related to digestion and stomach problems' },
                    { head: 'Respiratory Problems', category: 'Respiratory', description: 'Breathing and lung related symptoms' },
                    { head: 'Skin Conditions', category: 'Dermatological', description: 'Skin related symptoms and conditions' }
                  ].map((symptom, index) => (
                    <Tr key={index}>
                      <Td fontWeight="medium">{symptom.head}</Td>
                      <Td><Badge colorScheme="red">{symptom.category}</Badge></Td>
                      <Td>{symptom.description}</Td>
                      <Td>
                        <IconButton size="sm" icon={<MoreVertical />} variant="ghost" />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </VStack>
        );

      case 'slots':
        return (
          <VStack spacing={6} align="stretch">
            <Flex justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="semibold">Appointment Slots</Text>
              <Button leftIcon={<Plus />} colorScheme="indigo" onClick={onAddOpen}>
                Add Time Slot
              </Button>
            </Flex>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Card border="1px" borderColor={borderColor}>
                <CardBody>
                  <Text fontWeight="semibold" mb={4}>Morning Slots</Text>
                  <VStack spacing={2} align="stretch">
                    {['09:00 - 09:30', '09:30 - 10:00', '10:00 - 10:30', '10:30 - 11:00', '11:00 - 11:30'].map((slot, index) => (
                      <Flex key={index} justify="space-between" align="center" p={2} bg="green.50" borderRadius="md">
                        <Text fontSize="sm">{slot}</Text>
                        <Badge colorScheme="green">Available</Badge>
                      </Flex>
                    ))}
                  </VStack>
                </CardBody>
              </Card>
              <Card border="1px" borderColor={borderColor}>
                <CardBody>
                  <Text fontWeight="semibold" mb={4}>Evening Slots</Text>
                  <VStack spacing={2} align="stretch">
                    {['16:00 - 16:30', '16:30 - 17:00', '17:00 - 17:30', '17:30 - 18:00', '18:00 - 18:30'].map((slot, index) => (
                      <Flex key={index} justify="space-between" align="center" p={2} bg="blue.50" borderRadius="md">
                        <Text fontSize="sm">{slot}</Text>
                        <Badge colorScheme="blue">Available</Badge>
                      </Flex>
                    ))}
                  </VStack>
                </CardBody>
              </Card>
            </SimpleGrid>
          </VStack>
        );

      case 'zoom-gmeet-setting':
        return (
          <VStack spacing={6} align="stretch">
            <Text fontSize="lg" fontWeight="semibold">Zoom/GMeet Configuration</Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Card border="1px" borderColor={borderColor}>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <Text fontWeight="medium">Zoom Settings</Text>
                    <FormControl>
                      <FormLabel fontSize="sm">Zoom API Key</FormLabel>
                      <Input placeholder="Enter Zoom API Key" type="password" />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="sm">Zoom API Secret</FormLabel>
                      <Input placeholder="Enter Zoom API Secret" type="password" />
                    </FormControl>
                    <HStack justify="space-between">
                      <Text fontSize="sm">Enable Zoom Integration</Text>
                      <Switch />
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
              <Card border="1px" borderColor={borderColor}>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <Text fontWeight="medium">Google Meet Settings</Text>
                    <FormControl>
                      <FormLabel fontSize="sm">Google Client ID</FormLabel>
                      <Input placeholder="Enter Google Client ID" />
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="sm">Google Client Secret</FormLabel>
                      <Input placeholder="Enter Google Client Secret" type="password" />
                    </FormControl>
                    <HStack justify="space-between">
                      <Text fontSize="sm">Enable Google Meet Integration</Text>
                      <Switch />
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            </SimpleGrid>
            <Button colorScheme="cyan" leftIcon={<Save />}>Save Integration Settings</Button>
          </VStack>
        );

      default:
        return (
          <VStack spacing={6} align="stretch">
            <Text fontSize="lg" fontWeight="semibold">
              {setupCategories.find(cat => 
                cat.subsections.some(sub => sub.id === selectedSubsection)
              )?.subsections.find(sub => sub.id === selectedSubsection)?.title || 'Configuration'}
            </Text>
            <Alert status="info">
              <AlertIcon />
              <Box>
                <AlertTitle>Configuration Section</AlertTitle>
                <AlertDescription>
                  This section is under development. Configuration options will be available soon.
                </AlertDescription>
              </Box>
            </Alert>
            <Button leftIcon={<Plus />} colorScheme="blue" onClick={onAddOpen}>
              Add New Item
            </Button>
          </VStack>
        );
    }
  };

  return (
    <Box>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">{title}</Text>
          <Text color="gray.600">Configure system settings and hospital parameters</Text>
        </Box>
        <HStack>
          <Button leftIcon={<RefreshCw />} variant="outline">Refresh</Button>
          <Button leftIcon={<Save />} colorScheme="blue">Save All Changes</Button>
        </HStack>
      </Flex>

      <Grid templateColumns={{ base: '1fr', lg: '300px 1fr' }} gap={6}>
        {/* Sidebar Navigation */}
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody p={0}>
            <VStack spacing={0} align="stretch">
              {setupCategories.map((category) => (
                <Box key={category.id}>
                  <Flex
                    p={4}
                    bg={activeTab === setupCategories.indexOf(category) ? `${category.color}.50` : 'transparent'}
                    borderLeft={activeTab === setupCategories.indexOf(category) ? '4px solid' : '4px solid transparent'}
                    borderLeftColor={`${category.color}.500`}
                    cursor="pointer"
                    onClick={() => setActiveTab(setupCategories.indexOf(category))}
                    _hover={{ bg: `${category.color}.50` }}
                  >
                    <category.icon size={20} />
                    <Text ml={3} fontWeight="medium">{category.title}</Text>
                  </Flex>
                  
                  {activeTab === setupCategories.indexOf(category) && category.subsections.length > 0 && (
                    <VStack spacing={0} align="stretch" bg="gray.50" pl={8}>
                      {category.subsections.map((subsection) => (
                        <Flex
                          key={subsection.id}
                          p={3}
                          pl={6}
                          bg={selectedSubsection === subsection.id ? `${category.color}.100` : 'transparent'}
                          cursor="pointer"
                          onClick={() => setSelectedSubsection(subsection.id)}
                          _hover={{ bg: `${category.color}.100` }}
                          borderLeft={selectedSubsection === subsection.id ? '3px solid' : '3px solid transparent'}
                          borderLeftColor={`${category.color}.500`}
                        >
                          <subsection.icon size={16} />
                          <Text ml={2} fontSize="sm">{subsection.title}</Text>
                        </Flex>
                      ))}
                    </VStack>
                  )}
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>

        {/* Main Content Area */}
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            {renderSubsectionContent()}
          </CardBody>
        </Card>
      </Grid>

      {/* Add/Edit Modals */}
      <Modal isOpen={isAddOpen} onClose={onAddClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Item</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input placeholder="Enter name" />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea placeholder="Enter description" rows={3} />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onAddClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" leftIcon={<Save />}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Setup;
