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
  NumberDecrementStepper,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Divider,
  Avatar,
  AvatarGroup,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Wrap,
  WrapItem,
  Tag,
  TagLabel,
  TagCloseButton,
  RadioGroup,
  Radio
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
  Bold,
  Italic,
  Underline,
  Link,
  AlignRight,
  AlignJustify,
  Lock,
  Unlock,
  CheckCircle,
  AlertCircle,
  Info,
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
  Building,
  ChevronRight,
  ChevronLeft,
  Edit3,
  BarChart3,
  RotateCcw,
  ArrowUpDown,
  Type,
  Quote,
  List,
  AlignLeft,
  AlignCenter
} from 'lucide-react';

const Setup = ({ title = "System Setup" }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubsection, setSelectedSubsection] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSMSTab, setActiveSMSTab] = useState(0);
  const [smsStatus, setSmsStatus] = useState('disabled');
  const [emailEngine, setEmailEngine] = useState('SMTP');
  const [smtpSecurity, setSmtpSecurity] = useState('TLS');
  const [smtpAuth, setSmtpAuth] = useState('ON');
  const [activePaymentTab, setActivePaymentTab] = useState(0);
  const [selectedPaymentGateways, setSelectedPaymentGateways] = useState(['razorpay']);
  const [activeUserTab, setActiveUserTab] = useState('patient');
  const [isChargeModalOpen, setIsChargeModalOpen] = useState(false);
  const [isChargeCategoryModalOpen, setIsChargeCategoryModalOpen] = useState(false);
  const [isChargeTypeModalOpen, setIsChargeTypeModalOpen] = useState(false);
  const [chargeTypeSearch, setChargeTypeSearch] = useState('');
  const [editingChargeTypeIndex, setEditingChargeTypeIndex] = useState(null);
  const [chargeTypeForm, setChargeTypeForm] = useState({
    name: '',
    appointment: false,
    opd: false,
    ipd: false,
    radiology: false,
    bloodBank: false,
    ambulance: false
  });
  const [chargeTypes, setChargeTypes] = useState([
    {
      name: 'Appointment',
      appointment: true,
      opd: false,
      ipd: false,
      radiology: false,
      bloodBank: false,
      ambulance: false
    },
    {
      name: 'OPD',
      appointment: false,
      opd: true,
      ipd: false,
      radiology: false,
      bloodBank: false,
      ambulance: false
    },
    {
      name: 'IPD',
      appointment: false,
      opd: false,
      ipd: true,
      radiology: false,
      bloodBank: false,
      ambulance: false
    },
    {
      name: 'Pathology',
      appointment: false,
      opd: false,
      ipd: false,
      radiology: false,
      bloodBank: false,
      ambulance: false
    },
    {
      name: 'Radiology',
      appointment: false,
      opd: false,
      ipd: false,
      radiology: true,
      bloodBank: false,
      ambulance: false
    },
    {
      name: 'Blood Bank',
      appointment: false,
      opd: false,
      ipd: false,
      radiology: false,
      bloodBank: true,
      ambulance: false
    },
    {
      name: 'Ambulance',
      appointment: false,
      opd: false,
      ipd: false,
      radiology: false,
      bloodBank: false,
      ambulance: true
    },
    {
      name: 'Procedures',
      appointment: true,
      opd: true,
      ipd: false,
      radiology: false,
      bloodBank: false,
      ambulance: false
    },
    {
      name: 'Investigations',
      appointment: false,
      opd: false,
      ipd: false,
      radiology: true,
      bloodBank: false,
      ambulance: false
    },
    {
      name: 'Supplier',
      appointment: true,
      opd: true,
      ipd: false,
      radiology: false,
      bloodBank: false,
      ambulance: false
    },
    {
      name: 'Operations',
      appointment: true,
      opd: true,
      ipd: false,
      radiology: false,
      bloodBank: false,
      ambulance: false
    },
    {
      name: 'Others',
      appointment: true,
      opd: true,
      ipd: true,
      radiology: true,
      bloodBank: true,
      ambulance: true
    }
  ]);
  const [isTaxCategoryModalOpen, setIsTaxCategoryModalOpen] = useState(false);
  const [taxCategorySearch, setTaxCategorySearch] = useState('');
  const [editingTaxCategoryIndex, setEditingTaxCategoryIndex] = useState(null);
  const [taxCategoryForm, setTaxCategoryForm] = useState({
    name: '',
    percentage: 0
  });
  const [taxCategories, setTaxCategories] = useState([
    { name: 'Others Tax', percentage: 10.00 },
    { name: 'Supplier', percentage: 10.00 },
    { name: 'Investigation Tax', percentage: 10.00 },
    { name: 'Procedures', percentage: 10.00 },
    { name: 'Ambulance Tax', percentage: 15.00 },
    { name: 'Radiology Tax', percentage: 20.00 },
    { name: 'Pathology Tax', percentage: 18.00 },
    { name: 'Operation Charges', percentage: 10.00 },
    { name: 'IPD Tax', percentage: 20.00 },
    { name: 'OPD Tax', percentage: 20.00 },
    { name: 'Blood Module', percentage: 10.00 }
  ]);
  const [isBedModalOpen, setIsBedModalOpen] = useState(false);
  const [bedSearch, setBedSearch] = useState('');
  const [editingBedIndex, setEditingBedIndex] = useState(null);
  const [bedForm, setBedForm] = useState({
    name: '',
    bedType: '',
    bedGroup: '',
    used: false
  });
  const [beds, setBeds] = useState([
    { name: 'GF - 101', bedType: 'Standard', bedGroup: 'VIP Ward - Ground Floor', used: true },
    { name: 'TF - 102', bedType: 'VIP', bedGroup: 'Private Ward - 3rd Floor', used: true },
    { name: 'TF - 103', bedType: 'Normal', bedGroup: 'Private Ward - 3rd Floor', used: true },
    { name: 'TF - 104', bedType: 'Standard', bedGroup: 'Private Ward - 3rd Floor', used: true },
    { name: 'SF - 105', bedType: 'Standard', bedGroup: 'ICU - 2nd Floor', used: true },
    { name: 'TF - 106', bedType: 'VIP', bedGroup: 'General Ward Male - 3rd Floor', used: true },
    { name: 'TF - 107', bedType: 'VIP', bedGroup: 'Private Ward - 3rd Floor', used: true },
    { name: 'GF - 108', bedType: 'Standard', bedGroup: 'VIP Ward - Ground Floor', used: true },
    { name: 'GF - 109', bedType: 'VIP', bedGroup: 'VIP Ward - Ground Floor', used: true },
    { name: 'TF - 110', bedType: 'Normal', bedGroup: 'General Ward Male - 3rd Floor', used: true },
    { name: 'FF - 111', bedType: 'Normal', bedGroup: 'AC (Normal) - 1st Floor', used: true },
    { name: 'SF - 112', bedType: 'Normal', bedGroup: 'NICU - 2nd Floor', used: true },
    { name: 'SF - 113', bedType: 'Standard', bedGroup: 'NICU - 2nd Floor', used: true },
    { name: 'FF - 114', bedType: 'Standard', bedGroup: 'Non AC - 4th Floor', used: true },
    { name: 'FF - 115', bedType: 'Standard', bedGroup: 'AC (Normal) - 1st Floor', used: true },
    { name: 'FF - 116', bedType: 'Standard', bedGroup: 'AC (Normal) - 1st Floor', used: true },
    { name: 'FF - 117', bedType: 'Standard', bedGroup: 'AC (Normal) - 1st Floor', used: true }
  ]);
  const [isBedTypeModalOpen, setIsBedTypeModalOpen] = useState(false);
  const [isViewBedTypeModalOpen, setIsViewBedTypeModalOpen] = useState(false);
  const [bedTypeSearch, setBedTypeSearch] = useState('');
  const [editingBedTypeIndex, setEditingBedTypeIndex] = useState(null);
  const [viewingBedType, setViewingBedType] = useState(null);
  const [bedTypeForm, setBedTypeForm] = useState({
    name: '',
    description: '',
    charges: 0,
    status: 'Active'
  });
  const [bedTypes, setBedTypes] = useState([
    {
      name: 'Standard',
      description: 'Basic hospital bed with essential amenities for general patient care',
      charges: 1500,
      status: 'Active'
    },
    {
      name: 'VIP',
      description: 'Premium bed with enhanced comfort, private room, and additional amenities',
      charges: 5000,
      status: 'Active'
    },
    {
      name: 'Normal',
      description: 'Standard hospital bed for routine patient accommodation',
      charges: 1000,
      status: 'Active'
    },
    {
      name: 'ICU',
      description: 'Intensive Care Unit bed with advanced monitoring and life support equipment',
      charges: 8000,
      status: 'Active'
    },
    {
      name: 'Emergency',
      description: 'Emergency department bed for immediate patient assessment and treatment',
      charges: 2000,
      status: 'Active'
    },
    {
      name: 'Deluxe',
      description: 'High-end bed with luxury amenities and superior comfort',
      charges: 7000,
      status: 'Active'
    },
    {
      name: 'General',
      description: 'Multi-bed ward accommodation for general patient care',
      charges: 800,
      status: 'Active'
    },
    {
      name: 'Isolation',
      description: 'Specialized bed for patients requiring isolation precautions',
      charges: 3000,
      status: 'Active'
    }
  ]);
  const [isBedGroupModalOpen, setIsBedGroupModalOpen] = useState(false);
  const [isViewBedGroupModalOpen, setIsViewBedGroupModalOpen] = useState(false);
  const [bedGroupSearch, setBedGroupSearch] = useState('');
  const [editingBedGroupIndex, setEditingBedGroupIndex] = useState(null);
  const [viewingBedGroup, setViewingBedGroup] = useState(null);
  const [bedGroupForm, setBedGroupForm] = useState({
    name: '',
    floor: '',
    totalBeds: 0,
    description: ''
  });
  const [bedGroups, setBedGroups] = useState([
    {
      name: 'VIP Ward - Ground Floor',
      floor: 'Ground Floor',
      totalBeds: 8,
      description: 'Premium private rooms with luxury amenities for VIP patients'
    },
    {
      name: 'Private Ward - 3rd Floor',
      floor: '3rd Floor',
      totalBeds: 12,
      description: 'Private single occupancy rooms with modern facilities'
    },
    {
      name: 'ICU - 2nd Floor',
      floor: '2nd Floor',
      totalBeds: 6,
      description: 'Intensive Care Unit with advanced monitoring equipment'
    },
    {
      name: 'General Ward Male - 3rd Floor',
      floor: '3rd Floor',
      totalBeds: 15,
      description: 'General ward accommodation for male patients'
    },
    {
      name: 'AC (Normal) - 1st Floor',
      floor: '1st Floor',
      totalBeds: 10,
      description: 'Air-conditioned rooms for normal patient care'
    },
    {
      name: 'NICU - 2nd Floor',
      floor: '2nd Floor',
      totalBeds: 4,
      description: 'Neonatal Intensive Care Unit for newborn critical care'
    },
    {
      name: 'Non AC - 4th Floor',
      floor: '4th Floor',
      totalBeds: 20,
      description: 'Non air-conditioned general ward accommodation'
    }
  ]);
  const [isFloorModalOpen, setIsFloorModalOpen] = useState(false);
  const [isViewFloorModalOpen, setIsViewFloorModalOpen] = useState(false);
  const [floorSearch, setFloorSearch] = useState('');
  const [editingFloorIndex, setEditingFloorIndex] = useState(null);
  const [viewingFloor, setViewingFloor] = useState(null);
  const [floorForm, setFloorForm] = useState({
    name: '',
    number: 0,
    totalRooms: 0,
    department: '',
    status: 'Active'
  });
  const [floors, setFloors] = useState([
    {
      name: 'Ground Floor',
      number: 0,
      totalRooms: 25,
      department: 'Emergency',
      status: 'Active'
    },
    {
      name: '1st Floor',
      number: 1,
      totalRooms: 20,
      department: 'General Ward',
      status: 'Active'
    },
    {
      name: '2nd Floor',
      number: 2,
      totalRooms: 18,
      department: 'ICU',
      status: 'Active'
    },
    {
      name: '3rd Floor',
      number: 3,
      totalRooms: 22,
      department: 'VIP Ward',
      status: 'Active'
    },
    {
      name: '4th Floor',
      number: 4,
      totalRooms: 30,
      department: 'General Ward',
      status: 'Active'
    },
    {
      name: '5th Floor',
      number: 5,
      totalRooms: 15,
      department: 'Administration',
      status: 'Maintenance'
    }
  ]);
  const [printTemplates, setPrintTemplates] = useState({
    'appointment': {
      headerImage: null,
      footerContent: '',
      footerFormat: {
        textStyle: 'normal',
        bold: false,
        italic: false,
        underline: false,
        small: false,
        alignment: 'left'
      }
    },
    'opd-prescription': {
      headerImage: null,
      footerContent: '',
      footerFormat: {
        textStyle: 'normal',
        bold: false,
        italic: false,
        underline: false,
        small: false,
        alignment: 'left'
      }
    },
    'opd-bill': {
      headerImage: null,
      footerContent: '',
      footerFormat: {
        textStyle: 'normal',
        bold: false,
        italic: false,
        underline: false,
        small: false,
        alignment: 'left'
      }
    },
    'ipd-prescription': {
      headerImage: null,
      footerContent: '',
      footerFormat: {
        textStyle: 'normal',
        bold: false,
        italic: false,
        underline: false,
        small: false,
        alignment: 'left'
      }
    },
    'ipd-bill': {
      headerImage: null,
      footerContent: '',
      footerFormat: {
        textStyle: 'normal',
        bold: false,
        italic: false,
        underline: false,
        small: false,
        alignment: 'left'
      }
    },
    'bill-summary': {
      headerImage: null,
      footerContent: '',
      footerFormat: {
        textStyle: 'normal',
        bold: false,
        italic: false,
        underline: false,
        small: false,
        alignment: 'left'
      }
    },
    'pharmacy-bill': {
      headerImage: null,
      footerContent: '',
      footerFormat: {
        textStyle: 'normal',
        bold: false,
        italic: false,
        underline: false,
        small: false,
        alignment: 'left'
      }
    },
    'payslip': {
      headerImage: null,
      footerContent: '',
      footerFormat: {
        textStyle: 'normal',
        bold: false,
        italic: false,
        underline: false,
        small: false,
        alignment: 'left'
      }
    },
    'payment-receipt': {
      headerImage: null,
      footerContent: '',
      footerFormat: {
        textStyle: 'normal',
        bold: false,
        italic: false,
        underline: false,
        small: false,
        alignment: 'left'
      }
    },
    'discharge-card': {
      headerImage: null,
      footerContent: '',
      footerFormat: {
        textStyle: 'normal',
        bold: false,
        italic: false,
        underline: false,
        small: false,
        alignment: 'left'
      }
    },
    'insurance-document': {
      headerImage: null,
      footerContent: '',
      footerFormat: {
        textStyle: 'normal',
        bold: false,
        italic: false,
        underline: false,
        small: false,
        alignment: 'left'
      }
    }
  });
  const [editingMessage, setEditingMessage] = useState({});
  const [ayurvedicMedicineCategories, setAyurvedicMedicineCategories] = useState([
    {
      id: 1,
      name: 'Rasayana (Rejuvenatives)',
      sanskrit: 'रसायन',
      description: 'Medicines that promote longevity and vitality',
      properties: 'Rejuvenative, Anti-aging, Immunity enhancing',
      doshaEffect: 'Balances all three doshas',
      examples: 'Chyawanprash, Brahmi Rasayana, Amla Churna',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Vrishya (Aphrodisiacs)',
      sanskrit: 'वृष्य',
      description: 'Medicines that enhance reproductive health',
      properties: 'Aphrodisiac, Fertility enhancing, Strength building',
      doshaEffect: 'Primarily Vata pacifying',
      examples: 'Shilajit, Ashwagandha, Safed Musli',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Deepana-Pachana (Digestive)',
      sanskrit: 'दीपन-पाचन',
      description: 'Medicines that kindle digestive fire and aid digestion',
      properties: 'Digestive stimulant, Carminative, Appetizer',
      doshaEffect: 'Primarily Kapha-Vata balancing',
      examples: 'Trikatu, Hingwashtak Churna, Ajwain',
      status: 'Active'
    },
    {
      id: 4,
      name: 'Jwaraghna (Antipyretic)',
      sanskrit: 'ज्वरघ्न',
      description: 'Medicines that reduce fever and related symptoms',
      properties: 'Antipyretic, Anti-inflammatory, Cooling',
      doshaEffect: 'Primarily Pitta pacifying',
      examples: 'Guduchi, Kiratatikta, Maha Sudarshan Churna',
      status: 'Active'
    },
    {
      id: 5,
      name: 'Kasa-Shwasahara (Respiratory)',
      sanskrit: 'कास-श्वासहर',
      description: 'Medicines for cough, asthma and respiratory disorders',
      properties: 'Bronchodilator, Expectorant, Anti-tussive',
      doshaEffect: 'Primarily Kapha-Vata balancing',
      examples: 'Sitopaladi, Vasaka, Kantakari',
      status: 'Active'
    },
    {
      id: 6,
      name: 'Hridya (Cardiotonic)',
      sanskrit: 'हृद्य',
      description: 'Medicines that strengthen heart and circulatory system',
      properties: 'Cardiotonic, Circulation enhancing, Heart protective',
      doshaEffect: 'Primarily Vata pacifying',
      examples: 'Arjuna, Pushkarmool, Hridayarnava Rasa',
      status: 'Active'
    },
    {
      id: 7,
      name: 'Medhya (Brain Tonics)',
      sanskrit: 'मेध्य',
      description: 'Medicines that enhance cognitive function and memory',
      properties: 'Nootropic, Memory enhancer, Neuroprotective',
      doshaEffect: 'Primarily Vata balancing',
      examples: 'Brahmi, Mandukaparni, Saraswatarishta',
      status: 'Active'
    },
    {
      id: 8,
      name: 'Yakridottejaka (Hepatic)',
      sanskrit: 'यकृदोत्तेजक',
      description: 'Medicines that support liver function',
      properties: 'Hepatoprotective, Cholagogue, Liver tonic',
      doshaEffect: 'Primarily Pitta balancing',
      examples: 'Kalmegh, Bhumi Amla, Rohitkarishta',
      status: 'Active'
    },
    {
      id: 9,
      name: 'Mutravirechana (Diuretic)',
      sanskrit: 'मूत्रविरेचन',
      description: 'Medicines that promote urination and kidney health',
      properties: 'Diuretic, Kidney tonic, Urinary antiseptic',
      doshaEffect: 'Primarily Kapha balancing',
      examples: 'Punarnava, Gokshura, Varunadi Kwath',
      status: 'Active'
    },
    {
      id: 10,
      name: 'Tvachya (Dermatological)',
      sanskrit: 'त्वच्य',
      description: 'Medicines for skin disorders and complexion',
      properties: 'Anti-inflammatory, Antimicrobial, Skin tonic',
      doshaEffect: 'Primarily Pitta-Kapha balancing',
      examples: 'Neem, Haridra, Khadirarishta',
      status: 'Active'
    },
    {
      id: 11,
      name: 'Sandhaniya (Bone & Joint)',
      sanskrit: 'संधानीय',
      description: 'Medicines for bone, joint and muscle health',
      properties: 'Anti-inflammatory, Analgesic, Bone strengthening',
      doshaEffect: 'Primarily Vata pacifying',
      examples: 'Guggulu, Shallaki, Maharasnadi Kwath',
      status: 'Active'
    },
    {
      id: 12,
      name: 'Stanya-Janana (Galactagogue)',
      sanskrit: 'स्तन्य-जनन',
      description: 'Medicines that promote lactation in nursing mothers',
      properties: 'Galactagogue, Nutritive, Strength building',
      doshaEffect: 'Primarily Vata pacifying',
      examples: 'Shatavari, Vidari, Jivanti',
      status: 'Active'
    }
  ]);
  const [medicineCategoryModal, setMedicineCategoryModal] = useState({
    isOpen: false,
    mode: 'add', // 'add', 'edit', 'view'
    editingIndex: null,
    formData: {
      name: '',
      sanskrit: '',
      description: '',
      properties: '',
      doshaEffect: '',
      examples: '',
      status: 'Active'
    }
  });
  const [medicineCategorySearch, setMedicineCategorySearch] = useState('');
  const [notificationMessages, setNotificationMessages] = useState({
    'opd-registration': 'Dear {patient_name} your OPD Registration at Smart Hospital is successful on date {appointment_date} with Patient Id {patient_id} and OPD No {opd_no}',
    'ipd-registration': 'Dear {patient_name} your IPD Registration at Smart Hospital is successful with Patient Id {patient_id} and IPD No {ipd_no}',
    'ipd-discharge': 'IPD Patient {patient_name} is now discharged from Smart Hospital. Total bill amount is {currency_symbol}{total_amount} Total paid amount is {currency_symbol}{paid_amount} Total balance amount is {currency_symbol}{balance_amount}',
    'login-credential': 'Hello {display_name} your Smart Hospital login details are Url: {url} Username: {username} Password: {password}',
    'appointment-approved': 'Dear {patient_name} your appointment with {staff_name} {staff_surname} is confirmed on {date} with appointment no: {appointment_no}',
    'live-meeting': 'Dear staff, your live meeting {title} has been scheduled on {date} for the duration of {duration} minute.',
    'live-consult': 'Dear patient, your live consultation {title} has been scheduled on {date} for the duration of {duration} minute.',
    'opd-discharged': 'OPD No {opd_no} {patient_name} is now discharged from Smart Hospital. Total bill amount was {currency_symbol}{total_amount} Total paid amount was {currency_symbol}{paid_amount} Total balance amount is {currency_symbol}{balance_amount}',
    'forgot-password': 'Dear {display_name}, recently a request was submitted to reset password for your account with email: {email}. If you didn\'t make the request, just ignore this email, otherwise you can reset your password using this link\nclick here to reset your password\nIf you\'re having trouble clicking the password reset link, copy and paste below URL into your web browser.\n{resetpasslink}\nRegards,\nSmart Hospital'
  });
  const [systemNotificationMessages, setSystemNotificationMessages] = useState({
    'opd-patient-registration': 'Dear {patient_name} your OPD Registration at Smart Hospital is successful on date {appointment_date} with Patient Id {patient_id} and OPD No {opd_no}',
    'ipd-patient-registration': 'Dear {patient_name} your IPD Registration at Smart Hospital is successful with Patient Id {patient_id} and IPD No {ipd_no}',
    'ipd-patient-discharge': 'IPD Patient {patient_name} is now discharged from Smart Hospital. Total bill amount is {currency_symbol}{total_amount} Total paid amount is {currency_symbol}{paid_amount} Total balance amount is {currency_symbol}{balance_amount}',
    'login-credential': 'Hello {display_name} your Smart Hospital login details are Url: {url} Username: {username} Password: {password}',
    'appointment-approved': 'Dear {patient_name} your appointment with {staff_name} {staff_surname} is confirmed on {date} with appointment no: {appointment_no}',
    'live-meeting': 'Dear staff, your live meeting {title} has been scheduled on {date} for the duration of {duration} minute.',
    'live-consult': 'Dear patient, your live consultation {title} has been scheduled on {date} for the duration of {duration} minute.',
    'opd-patient-discharged': 'OPD No {opd_no} {patient_name} is now discharged from Smart Hospital. Total bill amount was {currency_symbol}{total_amount} Total paid amount was {currency_symbol}{paid_amount} Total balance amount is {currency_symbol}{balance_amount}',
    'forgot-password': 'Dear {display_name}, recently a request was submitted to reset password for your account with email: {email}. If you don\'t make the request, just ignore this email, otherwise you can reset your password using this link click here to reset your password. If you\'re having trouble clicking the password reset link, copy and paste below URL into your web browser. {resetpasslink} Regards, Smart Hospital',
    'appointment-approved-patient': 'Dear {patient_name}, your appointment with {staff_name} {staff_surname} is confirmed on {date} with appointment no: {appointment_no}',
    'appointment-approved-staff': 'Dear {staff_name}, you have a new appointment with {patient_name} scheduled on {date}',
    'password-change': 'Dear {display_name}, your password has been successfully changed for your Smart Hospital account.',
    'new-patient-registration': 'Welcome {patient_name}! Your registration at Smart Hospital is complete. Patient ID: {patient_id}',
    'bill-generated': 'Dear {patient_name}, your bill has been generated. Amount: {currency_symbol}{total_amount}. Please visit reception for payment.',
    'payment-received': 'Dear {patient_name}, we have received your payment of {currency_symbol}{paid_amount}. Receipt No: {receipt_no}',
    'prescription-ready': 'Dear {patient_name}, your prescription is ready for collection. Please visit pharmacy.',
    'lab-report-ready': 'Dear {patient_name}, your lab report is ready. Please visit reception to collect.',
    'appointment-reminder': 'Dear {patient_name}, this is a reminder for your appointment tomorrow at {time} with Dr. {doctor_name}',
    'staff-attendance': 'Dear {staff_name}, your attendance has been marked for {date} at {time}',
    'inventory-low': 'Alert: {item_name} stock is running low. Current quantity: {quantity}',
    'medicine-expiry': 'Alert: {medicine_name} will expire on {expiry_date}. Please check inventory.',
    'bed-allocation': 'Dear {patient_name}, bed number {bed_number} has been allocated for your stay.',
    'discharge-summary': 'Dear {patient_name}, your discharge summary is ready for collection.',
    'insurance-claim': 'Insurance claim {claim_number} has been processed for patient {patient_name}',
    'emergency-alert': 'Emergency: {emergency_type} reported at {location}. Immediate attention required.'
  });
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  // Notification message handlers
  const handleMessageEdit = (eventId, newMessage, isSystem = false) => {
    if (isSystem) {
      setSystemNotificationMessages(prev => ({
        ...prev,
        [eventId]: newMessage
      }));
    } else {
      setNotificationMessages(prev => ({
        ...prev,
        [eventId]: newMessage
      }));
    }
  };

  const toggleEdit = (eventId) => {
    setEditingMessage(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };

  // Charge Type handlers
  const handleChargeTypeToggle = (index, field, value) => {
    setChargeTypes(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const handleEditChargeType = (type, index) => {
    setChargeTypeForm(type);
    setEditingChargeTypeIndex(index);
    setIsChargeTypeModalOpen(true);
  };

  const handleDeleteChargeType = (index) => {
    if (window.confirm('Are you sure you want to delete this charge type?')) {
      setChargeTypes(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSaveChargeType = () => {
    if (!chargeTypeForm.name.trim()) {
      alert('Please enter a charge type name');
      return;
    }

    if (editingChargeTypeIndex !== null) {
      // Update existing
      setChargeTypes(prev => prev.map((item, i) => 
        i === editingChargeTypeIndex ? chargeTypeForm : item
      ));
    } else {
      // Add new
      setChargeTypes(prev => [...prev, chargeTypeForm]);
    }

    handleCancelChargeType();
  };

  const handleCancelChargeType = () => {
    setChargeTypeForm({
      name: '',
      appointment: false,
      opd: false,
      ipd: false,
      radiology: false,
      bloodBank: false,
      ambulance: false
    });
    setEditingChargeTypeIndex(null);
    setIsChargeTypeModalOpen(false);
  };

  const handleSortChargeTypes = (field) => {
    setChargeTypes(prev => [...prev].sort((a, b) => {
      if (field === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    }));
  };

  const handleExportChargeTypes = (format) => {
    const data = chargeTypes.map(type => ({
      'Charge Type': type.name,
      'Appointment': type.appointment ? 'Yes' : 'No',
      'OPD': type.opd ? 'Yes' : 'No',
      'IPD': type.ipd ? 'Yes' : 'No',
      'Pathology': type.pathology ? 'Yes' : 'No',
      'Radiology': type.radiology ? 'Yes' : 'No',
      'Blood Bank': type.bloodBank ? 'Yes' : 'No',
      'Ambulance': type.ambulance ? 'Yes' : 'No'
    }));

    if (format === 'csv') {
      const csv = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).join(','))
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'charge-types.csv';
      a.click();
    } else {
      console.log(`Export as ${format}:`, data);
      alert(`Export as ${format} - Feature coming soon!`);
    }
  };

  const handlePrintChargeTypes = () => {
    window.print();
  };

  // Tax Category handlers
  const handleEditTaxCategory = (category, index) => {
    setTaxCategoryForm(category);
    setEditingTaxCategoryIndex(index);
    setIsTaxCategoryModalOpen(true);
  };

  const handleDeleteTaxCategory = (index) => {
    if (window.confirm('Are you sure you want to delete this tax category?')) {
      setTaxCategories(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSaveTaxCategory = () => {
    if (!taxCategoryForm.name.trim()) {
      alert('Please enter a tax category name');
      return;
    }

    if (taxCategoryForm.percentage < 0 || taxCategoryForm.percentage > 100) {
      alert('Please enter a valid percentage between 0 and 100');
      return;
    }

    if (editingTaxCategoryIndex !== null) {
      // Update existing
      setTaxCategories(prev => prev.map((item, i) => 
        i === editingTaxCategoryIndex ? taxCategoryForm : item
      ));
    } else {
      // Add new
      setTaxCategories(prev => [...prev, taxCategoryForm]);
    }

    handleCancelTaxCategory();
  };

  const handleCancelTaxCategory = () => {
    setTaxCategoryForm({
      name: '',
      percentage: 0
    });
    setEditingTaxCategoryIndex(null);
    setIsTaxCategoryModalOpen(false);
  };

  const handleSortTaxCategories = (field) => {
    setTaxCategories(prev => [...prev].sort((a, b) => {
      if (field === 'name') {
        return a.name.localeCompare(b.name);
      } else if (field === 'percentage') {
        return a.percentage - b.percentage;
      }
      return 0;
    }));
  };

  const handleExportTaxCategories = (format) => {
    const data = taxCategories.map(category => ({
      'Name': category.name,
      'Percentage': category.percentage + '%'
    }));

    if (format === 'csv') {
      const csv = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).join(','))
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tax-categories.csv';
      a.click();
    } else {
      console.log(`Export as ${format}:`, data);
      alert(`Export as ${format} - Feature coming soon!`);
    }
  };

  const handlePrintTaxCategories = () => {
    window.print();
  };

  // Bed handlers
  const handleBedUsedToggle = (index, value) => {
    setBeds(prev => prev.map((item, i) => 
      i === index ? { ...item, used: value } : item
    ));
  };

  const handleEditBed = (bed, index) => {
    setBedForm(bed);
    setEditingBedIndex(index);
    setIsBedModalOpen(true);
  };

  const handleDeleteBed = (index) => {
    if (window.confirm('Are you sure you want to delete this bed?')) {
      setBeds(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSaveBed = () => {
    if (!bedForm.name.trim()) {
      alert('Please enter a bed name');
      return;
    }

    if (!bedForm.bedType) {
      alert('Please select a bed type');
      return;
    }

    if (!bedForm.bedGroup) {
      alert('Please select a bed group');
      return;
    }

    if (editingBedIndex !== null) {
      // Update existing
      setBeds(prev => prev.map((item, i) => 
        i === editingBedIndex ? bedForm : item
      ));
    } else {
      // Add new
      setBeds(prev => [...prev, bedForm]);
    }

    handleCancelBed();
  };

  const handleCancelBed = () => {
    setBedForm({
      name: '',
      bedType: '',
      bedGroup: '',
      used: false
    });
    setEditingBedIndex(null);
    setIsBedModalOpen(false);
  };

  const handleSortBeds = (field) => {
    setBeds(prev => [...prev].sort((a, b) => {
      if (field === 'name') {
        return a.name.localeCompare(b.name);
      } else if (field === 'bedType') {
        return a.bedType.localeCompare(b.bedType);
      } else if (field === 'bedGroup') {
        return a.bedGroup.localeCompare(b.bedGroup);
      } else if (field === 'used') {
        return Number(b.used) - Number(a.used);
      }
      return 0;
    }));
  };

  const handleExportBeds = (format) => {
    const data = beds.map(bed => ({
      'Name': bed.name,
      'Bed Type': bed.bedType,
      'Bed Group': bed.bedGroup,
      'Used': bed.used ? 'Yes' : 'No'
    }));

    if (format === 'csv') {
      const csv = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).join(','))
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'beds.csv';
      a.click();
    } else {
      console.log(`Export as ${format}:`, data);
      alert(`Export as ${format} - Feature coming soon!`);
    }
  };

  const handlePrintBeds = () => {
    window.print();
  };

  // Bed Type handlers
  const handleViewBedType = (bedType, index) => {
    setViewingBedType(bedType);
    setIsViewBedTypeModalOpen(true);
  };

  const handleEditBedType = (bedType, index) => {
    setBedTypeForm(bedType);
    setEditingBedTypeIndex(index);
    setIsBedTypeModalOpen(true);
  };

  const handleDeleteBedType = (index) => {
    if (window.confirm('Are you sure you want to delete this bed type?')) {
      setBedTypes(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSaveBedType = () => {
    if (!bedTypeForm.name.trim()) {
      alert('Please enter a bed type name');
      return;
    }

    if (!bedTypeForm.description.trim()) {
      alert('Please enter a description');
      return;
    }

    if (bedTypeForm.charges <= 0) {
      alert('Please enter valid charges');
      return;
    }

    if (editingBedTypeIndex !== null) {
      // Update existing
      setBedTypes(prev => prev.map((item, i) => 
        i === editingBedTypeIndex ? bedTypeForm : item
      ));
    } else {
      // Add new
      setBedTypes(prev => [...prev, bedTypeForm]);
    }

    handleCancelBedType();
  };

  const handleCancelBedType = () => {
    setBedTypeForm({
      name: '',
      description: '',
      charges: 0,
      status: 'Active'
    });
    setEditingBedTypeIndex(null);
    setIsBedTypeModalOpen(false);
  };

  const handleSortBedTypes = (field) => {
    setBedTypes(prev => [...prev].sort((a, b) => {
      if (field === 'name') {
        return a.name.localeCompare(b.name);
      } else if (field === 'description') {
        return a.description.localeCompare(b.description);
      } else if (field === 'charges') {
        return a.charges - b.charges;
      } else if (field === 'status') {
        return a.status.localeCompare(b.status);
      }
      return 0;
    }));
  };

  const handleExportBedTypes = (format) => {
    const data = bedTypes.map(bedType => ({
      'Bed Type': bedType.name,
      'Description': bedType.description,
      'Daily Charges': '₹' + bedType.charges.toLocaleString(),
      'Status': bedType.status
    }));

    if (format === 'csv') {
      const csv = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).join(','))
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bed-types.csv';
      a.click();
    } else {
      console.log(`Export as ${format}:`, data);
      alert(`Export as ${format} - Feature coming soon!`);
    }
  };

  const handlePrintBedTypes = () => {
    window.print();
  };

  // Bed Group handlers
  const handleViewBedGroup = (bedGroup, index) => {
    setViewingBedGroup(bedGroup);
    setIsViewBedGroupModalOpen(true);
  };

  const handleEditBedGroup = (bedGroup, index) => {
    setBedGroupForm(bedGroup);
    setEditingBedGroupIndex(index);
    setIsBedGroupModalOpen(true);
  };

  const handleDeleteBedGroup = (index) => {
    if (window.confirm('Are you sure you want to delete this bed group?')) {
      setBedGroups(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSaveBedGroup = () => {
    if (!bedGroupForm.name.trim()) {
      alert('Please enter a bed group name');
      return;
    }

    if (!bedGroupForm.floor) {
      alert('Please select a floor');
      return;
    }

    if (bedGroupForm.totalBeds <= 0) {
      alert('Please enter valid total beds');
      return;
    }

    if (editingBedGroupIndex !== null) {
      // Update existing
      setBedGroups(prev => prev.map((item, i) => 
        i === editingBedGroupIndex ? bedGroupForm : item
      ));
    } else {
      // Add new
      setBedGroups(prev => [...prev, bedGroupForm]);
    }

    handleCancelBedGroup();
  };

  const handleCancelBedGroup = () => {
    setBedGroupForm({
      name: '',
      floor: '',
      totalBeds: 0,
      description: ''
    });
    setEditingBedGroupIndex(null);
    setIsBedGroupModalOpen(false);
  };

  const handleSortBedGroups = (field) => {
    setBedGroups(prev => [...prev].sort((a, b) => {
      if (field === 'name') {
        return a.name.localeCompare(b.name);
      } else if (field === 'floor') {
        return a.floor.localeCompare(b.floor);
      } else if (field === 'totalBeds') {
        return a.totalBeds - b.totalBeds;
      }
      return 0;
    }));
  };

  const handleExportBedGroups = (format) => {
    const data = bedGroups.map(group => ({
      'Group Name': group.name,
      'Floor': group.floor,
      'Total Beds': group.totalBeds,
      'Description': group.description
    }));

    if (format === 'csv') {
      const csv = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).join(','))
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bed-groups.csv';
      a.click();
    } else {
      console.log(`Export as ${format}:`, data);
      alert(`Export as ${format} - Feature coming soon!`);
    }
  };

  const handlePrintBedGroups = () => {
    window.print();
  };

  // Floor handlers
  const handleViewFloor = (floor, index) => {
    setViewingFloor(floor);
    setIsViewFloorModalOpen(true);
  };

  const handleEditFloor = (floor, index) => {
    setFloorForm(floor);
    setEditingFloorIndex(index);
    setIsFloorModalOpen(true);
  };

  const handleDeleteFloor = (index) => {
    if (window.confirm('Are you sure you want to delete this floor?')) {
      setFloors(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSaveFloor = () => {
    if (!floorForm.name.trim()) {
      alert('Please enter a floor name');
      return;
    }

    if (floorForm.number < 0) {
      alert('Please enter a valid floor number');
      return;
    }

    if (floorForm.totalRooms <= 0) {
      alert('Please enter valid total rooms');
      return;
    }

    if (!floorForm.department) {
      alert('Please select a department');
      return;
    }

    if (editingFloorIndex !== null) {
      // Update existing
      setFloors(prev => prev.map((item, i) => 
        i === editingFloorIndex ? floorForm : item
      ));
    } else {
      // Add new
      setFloors(prev => [...prev, floorForm]);
    }

    handleCancelFloor();
  };

  const handleCancelFloor = () => {
    setFloorForm({
      name: '',
      number: 0,
      totalRooms: 0,
      department: '',
      status: 'Active'
    });
    setEditingFloorIndex(null);
    setIsFloorModalOpen(false);
  };

  const handleSortFloors = (field) => {
    setFloors(prev => [...prev].sort((a, b) => {
      if (field === 'name') {
        return a.name.localeCompare(b.name);
      } else if (field === 'number') {
        return a.number - b.number;
      } else if (field === 'totalRooms') {
        return a.totalRooms - b.totalRooms;
      } else if (field === 'department') {
        return a.department.localeCompare(b.department);
      } else if (field === 'status') {
        return a.status.localeCompare(b.status);
      }
      return 0;
    }));
  };

  const handleExportFloors = (format) => {
    const data = floors.map(floor => ({
      'Floor Name': floor.name,
      'Floor Number': floor.number === 0 ? 'Ground' : floor.number,
      'Total Rooms': floor.totalRooms,
      'Department': floor.department,
      'Status': floor.status
    }));

    if (format === 'csv') {
      const csv = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).join(','))
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'floors.csv';
      a.click();
    } else {
      console.log(`Export as ${format}:`, data);
      alert(`Export as ${format} - Feature coming soon!`);
    }
  };

  const handlePrintFloors = () => {
    window.print();
  };

  // Print Template handlers
  const handleHeaderImageUpload = (templateType, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPrintTemplates(prev => ({
          ...prev,
          [templateType]: {
            ...prev[templateType],
            headerImage: e.target.result
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFooterContentChange = (templateType, content) => {
    setPrintTemplates(prev => ({
      ...prev,
      [templateType]: {
        ...prev[templateType],
        footerContent: content
      }
    }));
  };

  const handleFormatToggle = (templateType, formatType) => {
    setPrintTemplates(prev => ({
      ...prev,
      [templateType]: {
        ...prev[templateType],
        footerFormat: {
          ...prev[templateType].footerFormat,
          [formatType]: !prev[templateType].footerFormat[formatType]
        }
      }
    }));
  };

  const handleTextStyleChange = (templateType, style) => {
    setPrintTemplates(prev => ({
      ...prev,
      [templateType]: {
        ...prev[templateType],
        footerFormat: {
          ...prev[templateType].footerFormat,
          textStyle: style
        }
      }
    }));
  };

  const handleAlignmentChange = (templateType, alignment) => {
    setPrintTemplates(prev => ({
      ...prev,
      [templateType]: {
        ...prev[templateType],
        footerFormat: {
          ...prev[templateType].footerFormat,
          alignment: alignment
        }
      }
    }));
  };

  const handleInsertLink = (templateType) => {
    const url = prompt('Enter URL:');
    const text = prompt('Enter link text:');
    if (url && text) {
      const linkHtml = `<a href="${url}">${text}</a>`;
      const currentContent = printTemplates[templateType].footerContent;
      handleFooterContentChange(templateType, currentContent + linkHtml);
    }
  };

  const handleSavePrintTemplate = (templateType) => {
    // Save template logic here
    console.log(`Saving ${templateType} template:`, printTemplates[templateType]);
    alert(`${templateType.charAt(0).toUpperCase() + templateType.slice(1)} template saved successfully!`);
  };

  // Ayurvedic Medicine Category handlers
  const handleMedicineCategoryAdd = () => {
    setMedicineCategoryModal({
      isOpen: true,
      mode: 'add',
      editingIndex: null,
      formData: {
        name: '',
        sanskrit: '',
        description: '',
        properties: '',
        doshaEffect: '',
        examples: '',
        status: 'Active'
      }
    });
  };

  const handleMedicineCategoryEdit = (index) => {
    const category = ayurvedicMedicineCategories[index];
    setMedicineCategoryModal({
      isOpen: true,
      mode: 'edit',
      editingIndex: index,
      formData: { ...category }
    });
  };

  const handleMedicineCategoryView = (index) => {
    const category = ayurvedicMedicineCategories[index];
    setMedicineCategoryModal({
      isOpen: true,
      mode: 'view',
      editingIndex: index,
      formData: { ...category }
    });
  };

  const handleMedicineCategoryDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this medicine category?')) {
      setAyurvedicMedicineCategories(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleMedicineCategorySave = () => {
    const { mode, editingIndex, formData } = medicineCategoryModal;
    
    if (mode === 'add') {
      const newCategory = {
        ...formData,
        id: Math.max(...ayurvedicMedicineCategories.map(c => c.id)) + 1
      };
      setAyurvedicMedicineCategories(prev => [...prev, newCategory]);
    } else if (mode === 'edit') {
      setAyurvedicMedicineCategories(prev => 
        prev.map((category, index) => 
          index === editingIndex ? { ...category, ...formData } : category
        )
      );
    }
    
    setMedicineCategoryModal(prev => ({ ...prev, isOpen: false }));
  };

  const handleMedicineCategoryInputChange = (field, value) => {
    setMedicineCategoryModal(prev => ({
      ...prev,
      formData: { ...prev.formData, [field]: value }
    }));
  };

  const filteredMedicineCategories = ayurvedicMedicineCategories.filter(category =>
    category.name.toLowerCase().includes(medicineCategorySearch.toLowerCase()) ||
    category.sanskrit.toLowerCase().includes(medicineCategorySearch.toLowerCase()) ||
    category.description.toLowerCase().includes(medicineCategorySearch.toLowerCase())
  );

  const setupCategories = [
    {
      id: 'settings',
      title: 'Settings',
      icon: Settings,
      color: 'blue',
      description: 'General system configuration and preferences',
      count: 11,
      subsections: [
        { id: 'general-setting', title: 'General Setting', icon: Settings, description: 'Basic hospital information' },
        { id: 'notification-setting', title: 'Notification Setting', icon: Bell, description: 'Configure notifications' },
        { id: 'system-notification-setting', title: 'System Notification Setting', icon: Monitor, description: 'System alerts' },
        { id: 'sms-setting', title: 'SMS Setting', icon: Smartphone, description: 'SMS configuration' },
        { id: 'whatsapp-setting', title: 'WhatsApp Setting', icon: Smartphone, description: 'WhatsApp integration' },
        { id: 'email-setting', title: 'Email Setting', icon: Mail, description: 'Email configuration' },
        { id: 'payment-methods', title: 'Payment Methods', icon: CreditCard, description: 'Payment options' },
        { id: 'front-cms-setting', title: 'Front CMS Setting', icon: Globe, description: 'Website content' },
        { id: 'backup-restore', title: 'Backup/Restore', icon: Database, description: 'Data backup' },
        { id: 'languages', title: 'Languages', icon: Globe, description: 'Language settings' },
        { id: 'users', title: 'Users', icon: Users, description: 'User management' }
      ]
    },
    {
      id: 'hospital-charges',
      title: 'Hospital Charges',
      icon: DollarSign,
      color: 'green',
      description: 'Manage billing and charges',
      count: 4,
      subsections: [
        { id: 'charges', title: 'Charges', icon: DollarSign, description: 'Service charges' },
        { id: 'charge-category', title: 'Charge Category', icon: TrendingUp, description: 'Charge categories' },
        { id: 'charge-type', title: 'Charge Type', icon: FileText, description: 'Types of charges' },
        { id: 'tax-category', title: 'Tax Category', icon: Receipt, description: 'Tax settings' }
      ]
    },
    {
      id: 'bed',
      title: 'Bed Management',
      icon: Bed,
      color: 'purple',
      description: 'Hospital bed and room configuration',
      count: 5,
      subsections: [
        { id: 'bed-status', title: 'Bed Status', icon: Activity, description: 'Bed availability' },
        { id: 'bed', title: 'Bed', icon: Bed, description: 'Bed configuration' },
        { id: 'bed-type', title: 'Bed Type', icon: Building, description: 'Types of beds' },
        { id: 'bed-group', title: 'Bed Group', icon: Building, description: 'Bed grouping' },
        { id: 'floor', title: 'Floor', icon: MapPin, description: 'Floor management' }
      ]
    },
    {
      id: 'print-header-footer',
      title: 'Print Templates',
      icon: Printer,
      color: 'orange',
      description: 'Document templates and headers',
      count: 10,
      subsections: [
        { id: 'appointment', title: 'Appointment', icon: Calendar, description: 'Appointment forms' },
        { id: 'opd-prescription', title: 'OPD Prescription', icon: FileText, description: 'OPD prescriptions' },
        { id: 'opd-bill', title: 'OPD Bill', icon: Receipt, description: 'OPD billing' },
        { id: 'ipd-prescription', title: 'IPD Prescription', icon: FileText, description: 'IPD prescriptions' },
        { id: 'ipd-bill', title: 'IPD Bill', icon: Receipt, description: 'IPD billing' },
        { id: 'bill-summary', title: 'Bill Summary', icon: Receipt, description: 'Bill summaries' },
        { id: 'pharmacy-bill', title: 'Pharmacy Bill', icon: Pill, description: 'Pharmacy billing' },
        { id: 'payslip', title: 'Payslip', icon: DollarSign, description: 'Employee payslips' },
        { id: 'payment-receipt', title: 'Payment Receipt', icon: Receipt, description: 'Payment receipts' },
        { id: 'discharge-card', title: 'Discharge Card', icon: UserCheck, description: 'Discharge documents' },
        { id: 'insurance-document', title: 'Insurance Document', icon: Shield, description: 'Insurance documentation' }
      ]
    },
    {
      id: 'pharmacy',
      title: 'Pharmacy',
      icon: Pill,
      color: 'teal',
      description: 'Medicine and pharmacy configuration',
      count: 8,
      subsections: [
        { id: 'medicine-category', title: 'Medicine Category', icon: Pill, description: 'Medicine categories' },
        { id: 'supplier', title: 'Supplier', icon: Users, description: 'Medicine suppliers' },
        { id: 'medicine-dosage', title: 'Medicine Dosage', icon: Pill, description: 'Dosage settings' },
        { id: 'dose-interval', title: 'Dose Interval', icon: Clock, description: 'Dosing intervals' },
        { id: 'dose-duration', title: 'Dose Duration', icon: Calendar, description: 'Treatment duration' },
        { id: 'unit', title: 'Unit', icon: FileText, description: 'Measurement units' },
        { id: 'company', title: 'Company', icon: Building, description: 'Pharmaceutical companies' },
        { id: 'medicine-group', title: 'Medicine Group', icon: Pill, description: 'Medicine grouping' }
      ]
    },
    {
      id: 'symptoms',
      title: 'Symptoms',
      icon: Activity,
      color: 'red',
      description: 'Patient symptoms configuration',
      count: 2,
      subsections: [
        { id: 'symptoms-head', title: 'Symptoms Head', icon: Activity, description: 'Main symptoms' },
        { id: 'symptoms-type', title: 'Symptoms Type', icon: Heart, description: 'Symptom types' }
      ]
    },
    {
      id: 'findings',
      title: 'Findings',
      icon: Stethoscope,
      color: 'pink',
      description: 'Medical findings and observations',
      count: 2,
      subsections: [
        { id: 'finding', title: 'Finding', icon: Stethoscope, description: 'Medical findings' },
        { id: 'category', title: 'Category', icon: FileText, description: 'Finding categories' }
      ]
    },
    {
      id: 'zoom-gmeet-setting',
      title: 'Video Conferencing',
      icon: Video,
      color: 'cyan',
      description: 'Video consultation setup',
      count: 1,
      subsections: []
    },
    {
      id: 'finance',
      title: 'Finance',
      icon: TrendingUp,
      color: 'yellow',
      description: 'Financial configuration',
      count: 2,
      subsections: [
        { id: 'income-head', title: 'Income Head', icon: TrendingUp, description: 'Income categories' },
        { id: 'expense-head', title: 'Expense Head', icon: DollarSign, description: 'Expense categories' }
      ]
    },
    {
      id: 'appointment',
      title: 'Appointment',
      icon: Calendar,
      color: 'indigo',
      description: 'Appointment system configuration',
      count: 4,
      subsections: [
        { id: 'slots', title: 'Slots', icon: Clock, description: 'Time slots' },
        { id: 'doctor-shift', title: 'Doctor Shift', icon: UserCheck, description: 'Doctor schedules' },
        { id: 'shift', title: 'Shift', icon: Clock, description: 'Work shifts' },
        { id: 'appointment-priority', title: 'Appointment Priority', icon: AlertCircle, description: 'Priority levels' }
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
            <Flex justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="semibold">Notification Setting</Text>
              <Button colorScheme="blue" leftIcon={<Save />} size="sm">
                Save
              </Button>
            </Flex>
            
            <Card border="1px" borderColor={borderColor} bg={cardBg}>
              <CardBody p={0}>
                <TableContainer>
                  <Table variant="simple" size="sm">
                    <Thead bg="gray.50">
                      <Tr>
                        <Th fontSize="xs" fontWeight="bold" color="gray.700" py={4} w="200px">Event</Th>
                        <Th fontSize="xs" fontWeight="bold" color="gray.700" py={4} textAlign="center" w="150px">Option</Th>
                        <Th fontSize="xs" fontWeight="bold" color="gray.700" py={4} textAlign="center" w="100px">Template Id</Th>
                        <Th fontSize="xs" fontWeight="bold" color="gray.700" py={4} w="auto">Sample Message</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr borderBottom="1px solid" borderColor={borderColor}>
                        <Td py={4} fontWeight="medium" color="blue.600" w="200px">
                          <Text wordBreak="break-word" whiteSpace="normal">
                            OPD Patient Registration
                          </Text>
                        </Td>
                        <Td py={4} textAlign="center" w="150px">
                          <VStack spacing={2}>
                            <HStack spacing={2} justify="center" flexWrap="wrap">
                              <Checkbox size="sm">Email</Checkbox>
                              <Checkbox size="sm">SMS</Checkbox>
                              <Checkbox size="sm" defaultChecked>Mobile App</Checkbox>
                            </HStack>
                          </VStack>
                        </Td>
                        <Td py={4} textAlign="center" w="100px">
                          <Badge colorScheme="blue" fontSize="xs">7</Badge>
                        </Td>
                        <Td py={4} fontSize="sm" color="gray.700" w="auto">
                          {editingMessage['opd-registration'] ? (
                            <VStack spacing={2} align="stretch">
                              <Textarea
                                value={notificationMessages['opd-registration']}
                                onChange={(e) => handleMessageEdit('opd-registration', e.target.value)}
                                size="sm"
                                resize="vertical"
                                minH="80px"
                                wordBreak="break-word"
                                whiteSpace="pre-wrap"
                              />
                              <HStack spacing={2}>
                                <Button size="xs" colorScheme="green" onClick={() => toggleEdit('opd-registration')}>
                                  Save
                                </Button>
                                <Button size="xs" variant="outline" onClick={() => toggleEdit('opd-registration')}>
                                  Cancel
                                </Button>
                              </HStack>
                            </VStack>
                          ) : (
                            <HStack justify="space-between" align="start">
                              <Text 
                                flex={1} 
                                wordBreak="break-word" 
                                whiteSpace="normal"
                                overflowWrap="break-word"
                                maxW="100%"
                              >
                                {notificationMessages['opd-registration']}
                              </Text>
                              <IconButton
                                size="xs"
                                icon={<Edit3 size={12} />}
                                variant="ghost"
                                onClick={() => toggleEdit('opd-registration')}
                                ml={2}
                                flexShrink={0}
                              />
                            </HStack>
                          )}
                        </Td>
                      </Tr>
                      
                      <Tr borderBottom="1px solid" borderColor={borderColor}>
                        <Td py={4} fontWeight="medium" color="blue.600" w="200px">
                          <Text wordBreak="break-word" whiteSpace="normal">
                            IPD Patient Registration
                          </Text>
                        </Td>
                        <Td py={4} textAlign="center" w="150px">
                          <VStack spacing={2}>
                            <HStack spacing={2} justify="center" flexWrap="wrap">
                              <Checkbox size="sm">Email</Checkbox>
                              <Checkbox size="sm">SMS</Checkbox>
                              <Checkbox size="sm" defaultChecked>Mobile App</Checkbox>
                            </HStack>
                          </VStack>
                        </Td>
                        <Td py={4} textAlign="center" w="100px">
                          <Badge colorScheme="blue" fontSize="xs">7</Badge>
                        </Td>
                        <Td py={4} fontSize="sm" color="gray.700" w="auto">
                          {editingMessage['ipd-registration'] ? (
                            <VStack spacing={2} align="stretch">
                              <Textarea
                                value={notificationMessages['ipd-registration']}
                                onChange={(e) => handleMessageEdit('ipd-registration', e.target.value)}
                                size="sm"
                                resize="vertical"
                                minH="80px"
                                wordBreak="break-word"
                                whiteSpace="pre-wrap"
                              />
                              <HStack spacing={2}>
                                <Button size="xs" colorScheme="green" onClick={() => toggleEdit('ipd-registration')}>
                                  Save
                                </Button>
                                <Button size="xs" variant="outline" onClick={() => toggleEdit('ipd-registration')}>
                                  Cancel
                                </Button>
                              </HStack>
                            </VStack>
                          ) : (
                            <HStack justify="space-between" align="start">
                              <Text 
                                flex={1} 
                                wordBreak="break-word" 
                                whiteSpace="normal"
                                overflowWrap="break-word"
                                maxW="100%"
                              >
                                {notificationMessages['ipd-registration']}
                              </Text>
                              <IconButton
                                size="xs"
                                icon={<Edit3 size={12} />}
                                variant="ghost"
                                onClick={() => toggleEdit('ipd-registration')}
                                ml={2}
                                flexShrink={0}
                              />
                            </HStack>
                          )}
                        </Td>
                      </Tr>
                      
                      <Tr borderBottom="1px solid" borderColor={borderColor}>
                        <Td py={4} fontWeight="medium" color="blue.600" w="200px">
                          <Text wordBreak="break-word" whiteSpace="normal">
                            IPD Patient Discharge
                          </Text>
                        </Td>
                        <Td py={4} textAlign="center" w="150px">
                          <VStack spacing={2}>
                            <HStack spacing={2} justify="center" flexWrap="wrap">
                              <Checkbox size="sm">Email</Checkbox>
                              <Checkbox size="sm">SMS</Checkbox>
                              <Checkbox size="sm" defaultChecked>Mobile App</Checkbox>
                            </HStack>
                          </VStack>
                        </Td>
                        <Td py={4} textAlign="center" w="100px">
                          <Badge colorScheme="blue" fontSize="xs">7</Badge>
                        </Td>
                        <Td py={4} fontSize="sm" color="gray.700" w="auto">
                          {editingMessage['ipd-discharge'] ? (
                            <VStack spacing={2} align="stretch">
                              <Textarea
                                value={notificationMessages['ipd-discharge']}
                                onChange={(e) => handleMessageEdit('ipd-discharge', e.target.value)}
                                size="sm"
                                resize="vertical"
                                minH="80px"
                                wordBreak="break-word"
                                whiteSpace="pre-wrap"
                              />
                              <HStack spacing={2}>
                                <Button size="xs" colorScheme="green" onClick={() => toggleEdit('ipd-discharge')}>
                                  Save
                                </Button>
                                <Button size="xs" variant="outline" onClick={() => toggleEdit('ipd-discharge')}>
                                  Cancel
                                </Button>
                              </HStack>
                            </VStack>
                          ) : (
                            <HStack justify="space-between" align="start">
                              <Text 
                                flex={1} 
                                wordBreak="break-word" 
                                whiteSpace="normal"
                                overflowWrap="break-word"
                                maxW="100%"
                              >
                                {notificationMessages['ipd-discharge']}
                              </Text>
                              <IconButton
                                size="xs"
                                icon={<Edit3 size={12} />}
                                variant="ghost"
                                onClick={() => toggleEdit('ipd-discharge')}
                                ml={2}
                                flexShrink={0}
                              />
                            </HStack>
                          )}
                        </Td>
                      </Tr>
                      
                      <Tr borderBottom="1px solid" borderColor={borderColor}>
                        <Td py={4} fontWeight="medium" color="blue.600" w="200px">
                          <Text wordBreak="break-word" whiteSpace="normal">
                            Login Credential
                          </Text>
                        </Td>
                        <Td py={4} textAlign="center" w="150px">
                          <VStack spacing={2}>
                            <HStack spacing={2} justify="center" flexWrap="wrap">
                              <Checkbox size="sm">Email</Checkbox>
                              <Checkbox size="sm">SMS</Checkbox>
                            </HStack>
                          </VStack>
                        </Td>
                        <Td py={4} textAlign="center" w="100px">
                          <Badge colorScheme="blue" fontSize="xs">7</Badge>
                        </Td>
                        <Td py={4} fontSize="sm" color="gray.700" w="auto">
                          {editingMessage['login-credential'] ? (
                            <VStack spacing={2} align="stretch">
                              <Textarea
                                value={notificationMessages['login-credential']}
                                onChange={(e) => handleMessageEdit('login-credential', e.target.value)}
                                size="sm"
                                resize="vertical"
                                minH="80px"
                                wordBreak="break-word"
                                whiteSpace="pre-wrap"
                              />
                              <HStack spacing={2}>
                                <Button size="xs" colorScheme="green" onClick={() => toggleEdit('login-credential')}>
                                  Save
                                </Button>
                                <Button size="xs" variant="outline" onClick={() => toggleEdit('login-credential')}>
                                  Cancel
                                </Button>
                              </HStack>
                            </VStack>
                          ) : (
                            <HStack justify="space-between" align="start">
                              <Text 
                                flex={1} 
                                wordBreak="break-word" 
                                whiteSpace="normal"
                                overflowWrap="break-word"
                                maxW="100%"
                              >
                                {notificationMessages['login-credential']}
                              </Text>
                              <IconButton
                                size="xs"
                                icon={<Edit3 size={12} />}
                                variant="ghost"
                                onClick={() => toggleEdit('login-credential')}
                                ml={2}
                                flexShrink={0}
                              />
                            </HStack>
                          )}
                        </Td>
                      </Tr>
                      
                      <Tr borderBottom="1px solid" borderColor={borderColor}>
                        <Td py={4} fontWeight="medium" color="blue.600" w="200px">
                          <Text wordBreak="break-word" whiteSpace="normal">
                            Appointment Approved
                          </Text>
                        </Td>
                        <Td py={4} textAlign="center" w="150px">
                          <VStack spacing={2}>
                            <HStack spacing={2} justify="center" flexWrap="wrap">
                              <Checkbox size="sm">Email</Checkbox>
                              <Checkbox size="sm">SMS</Checkbox>
                              <Checkbox size="sm" defaultChecked>Mobile App</Checkbox>
                            </HStack>
                          </VStack>
                        </Td>
                        <Td py={4} textAlign="center" w="100px">
                          <Badge colorScheme="blue" fontSize="xs">7</Badge>
                        </Td>
                        <Td py={4} fontSize="sm" color="gray.700" w="auto">
                          {editingMessage['appointment-approved'] ? (
                            <VStack spacing={2} align="stretch">
                              <Textarea
                                value={notificationMessages['appointment-approved']}
                                onChange={(e) => handleMessageEdit('appointment-approved', e.target.value)}
                                size="sm"
                                resize="vertical"
                                minH="80px"
                                wordBreak="break-word"
                                whiteSpace="pre-wrap"
                              />
                              <HStack spacing={2}>
                                <Button size="xs" colorScheme="green" onClick={() => toggleEdit('appointment-approved')}>
                                  Save
                                </Button>
                                <Button size="xs" variant="outline" onClick={() => toggleEdit('appointment-approved')}>
                                  Cancel
                                </Button>
                              </HStack>
                            </VStack>
                          ) : (
                            <HStack justify="space-between" align="start">
                              <Text 
                                flex={1} 
                                wordBreak="break-word" 
                                whiteSpace="normal"
                                overflowWrap="break-word"
                                maxW="100%"
                              >
                                {notificationMessages['appointment-approved']}
                              </Text>
                              <IconButton
                                size="xs"
                                icon={<Edit3 size={12} />}
                                variant="ghost"
                                onClick={() => toggleEdit('appointment-approved')}
                                ml={2}
                                flexShrink={0}
                              />
                            </HStack>
                          )}
                        </Td>
                      </Tr>
                      
                      <Tr borderBottom="1px solid" borderColor={borderColor}>
                        <Td py={4} fontWeight="medium" color="blue.600" w="200px">
                          <Text wordBreak="break-word" whiteSpace="normal">
                            Live Meeting
                          </Text>
                        </Td>
                        <Td py={4} textAlign="center" w="150px">
                          <VStack spacing={2}>
                            <HStack spacing={2} justify="center" flexWrap="wrap">
                              <Checkbox size="sm">Email</Checkbox>
                              <Checkbox size="sm">SMS</Checkbox>
                            </HStack>
                          </VStack>
                        </Td>
                        <Td py={4} textAlign="center" w="100px">
                          <Badge colorScheme="blue" fontSize="xs">7</Badge>
                        </Td>
                        <Td py={4} fontSize="sm" color="gray.700" w="auto">
                          {editingMessage['live-meeting'] ? (
                            <VStack spacing={2} align="stretch">
                              <Textarea
                                value={notificationMessages['live-meeting']}
                                onChange={(e) => handleMessageEdit('live-meeting', e.target.value)}
                                size="sm"
                                resize="vertical"
                                minH="80px"
                                wordBreak="break-word"
                                whiteSpace="pre-wrap"
                              />
                              <HStack spacing={2}>
                                <Button size="xs" colorScheme="green" onClick={() => toggleEdit('live-meeting')}>
                                  Save
                                </Button>
                                <Button size="xs" variant="outline" onClick={() => toggleEdit('live-meeting')}>
                                  Cancel
                                </Button>
                              </HStack>
                            </VStack>
                          ) : (
                            <HStack justify="space-between" align="start">
                              <Text 
                                flex={1} 
                                wordBreak="break-word" 
                                whiteSpace="normal"
                                overflowWrap="break-word"
                                maxW="100%"
                              >
                                {notificationMessages['live-meeting']}
                              </Text>
                              <IconButton
                                size="xs"
                                icon={<Edit3 size={12} />}
                                variant="ghost"
                                onClick={() => toggleEdit('live-meeting')}
                                ml={2}
                                flexShrink={0}
                              />
                            </HStack>
                          )}
                        </Td>
                      </Tr>
                      
                      <Tr borderBottom="1px solid" borderColor={borderColor}>
                        <Td py={4} fontWeight="medium" color="blue.600" w="200px">
                          <Text wordBreak="break-word" whiteSpace="normal">
                            Live Consult
                          </Text>
                        </Td>
                        <Td py={4} textAlign="center" w="150px">
                          <VStack spacing={2}>
                            <HStack spacing={2} justify="center" flexWrap="wrap">
                              <Checkbox size="sm">Email</Checkbox>
                              <Checkbox size="sm">SMS</Checkbox>
                              <Checkbox size="sm" defaultChecked>Mobile App</Checkbox>
                            </HStack>
                          </VStack>
                        </Td>
                        <Td py={4} textAlign="center" w="100px">
                          <Badge colorScheme="blue" fontSize="xs">7</Badge>
                        </Td>
                        <Td py={4} fontSize="sm" color="gray.700" w="auto">
                          {editingMessage['live-consult'] ? (
                            <VStack spacing={2} align="stretch">
                              <Textarea
                                value={notificationMessages['live-consult']}
                                onChange={(e) => handleMessageEdit('live-consult', e.target.value)}
                                size="sm"
                                resize="vertical"
                                minH="80px"
                                wordBreak="break-word"
                                whiteSpace="pre-wrap"
                              />
                              <HStack spacing={2}>
                                <Button size="xs" colorScheme="green" onClick={() => toggleEdit('live-consult')}>
                                  Save
                                </Button>
                                <Button size="xs" variant="outline" onClick={() => toggleEdit('live-consult')}>
                                  Cancel
                                </Button>
                              </HStack>
                            </VStack>
                          ) : (
                            <HStack justify="space-between" align="start">
                              <Text 
                                flex={1} 
                                wordBreak="break-word" 
                                whiteSpace="normal"
                                overflowWrap="break-word"
                                maxW="100%"
                              >
                                {notificationMessages['live-consult']}
                              </Text>
                              <IconButton
                                size="xs"
                                icon={<Edit3 size={12} />}
                                variant="ghost"
                                onClick={() => toggleEdit('live-consult')}
                                ml={2}
                                flexShrink={0}
                              />
                            </HStack>
                          )}
                        </Td>
                      </Tr>
                      
                      <Tr borderBottom="1px solid" borderColor={borderColor}>
                        <Td py={4} fontWeight="medium" color="blue.600" w="200px">
                          <Text wordBreak="break-word" whiteSpace="normal">
                            OPD Patient Discharged
                          </Text>
                        </Td>
                        <Td py={4} textAlign="center" w="150px">
                          <VStack spacing={2}>
                            <HStack spacing={2} justify="center" flexWrap="wrap">
                              <Checkbox size="sm">Email</Checkbox>
                              <Checkbox size="sm">SMS</Checkbox>
                              <Checkbox size="sm" defaultChecked>Mobile App</Checkbox>
                            </HStack>
                          </VStack>
                        </Td>
                        <Td py={4} textAlign="center" w="100px">
                          <Badge colorScheme="blue" fontSize="xs">7</Badge>
                        </Td>
                        <Td py={4} fontSize="sm" color="gray.700" w="auto">
                          {editingMessage['opd-discharged'] ? (
                            <VStack spacing={2} align="stretch">
                              <Textarea
                                value={notificationMessages['opd-discharged']}
                                onChange={(e) => handleMessageEdit('opd-discharged', e.target.value)}
                                size="sm"
                                resize="vertical"
                                minH="80px"
                                wordBreak="break-word"
                                whiteSpace="pre-wrap"
                              />
                              <HStack spacing={2}>
                                <Button size="xs" colorScheme="green" onClick={() => toggleEdit('opd-discharged')}>
                                  Save
                                </Button>
                                <Button size="xs" variant="outline" onClick={() => toggleEdit('opd-discharged')}>
                                  Cancel
                                </Button>
                              </HStack>
                            </VStack>
                          ) : (
                            <HStack justify="space-between" align="start">
                              <Text 
                                flex={1} 
                                wordBreak="break-word" 
                                whiteSpace="normal"
                                overflowWrap="break-word"
                                maxW="100%"
                              >
                                {notificationMessages['opd-discharged']}
                              </Text>
                              <IconButton
                                size="xs"
                                icon={<Edit3 size={12} />}
                                variant="ghost"
                                onClick={() => toggleEdit('opd-discharged')}
                                ml={2}
                                flexShrink={0}
                              />
                            </HStack>
                          )}
                        </Td>
                      </Tr>
                      
                      <Tr>
                        <Td py={4} fontWeight="medium" color="blue.600" w="200px">
                          <Text wordBreak="break-word" whiteSpace="normal">
                            Forgot Password
                          </Text>
                        </Td>
                        <Td py={4} textAlign="center" w="150px">
                          <VStack spacing={2}>
                            <HStack spacing={2} justify="center" flexWrap="wrap">
                              <Checkbox size="sm" defaultChecked>Email</Checkbox>
                            </HStack>
                          </VStack>
                        </Td>
                        <Td py={4} textAlign="center" w="100px">
                          <Badge colorScheme="blue" fontSize="xs">7</Badge>
                        </Td>
                        <Td py={4} fontSize="sm" color="gray.700" w="auto">
                          {editingMessage['forgot-password'] ? (
                            <VStack spacing={2} align="stretch">
                              <Textarea
                                value={notificationMessages['forgot-password']}
                                onChange={(e) => handleMessageEdit('forgot-password', e.target.value)}
                                size="sm"
                                resize="vertical"
                                minH="120px"
                                wordBreak="break-word"
                                whiteSpace="pre-wrap"
                              />
                              <HStack spacing={2}>
                                <Button size="xs" colorScheme="green" onClick={() => toggleEdit('forgot-password')}>
                                  Save
                                </Button>
                                <Button size="xs" variant="outline" onClick={() => toggleEdit('forgot-password')}>
                                  Cancel
                                </Button>
                              </HStack>
                            </VStack>
                          ) : (
                            <HStack justify="space-between" align="start">
                              <VStack align="start" spacing={1} flex={1}>
                                {notificationMessages['forgot-password'].split('\n').map((line, index) => (
                                  <Text 
                                    key={index} 
                                    fontSize="sm" 
                                    color={line.includes('click here') ? 'blue.500' : 'gray.700'} 
                                    textDecoration={line.includes('click here') ? 'underline' : 'none'}
                                    wordBreak="break-word" 
                                    whiteSpace="normal"
                                    overflowWrap="break-word"
                                  >
                                    {line}
                                  </Text>
                                ))}
                              </VStack>
                              <IconButton
                                size="xs"
                                icon={<Edit3 size={12} />}
                                variant="ghost"
                                onClick={() => toggleEdit('forgot-password')}
                                ml={2}
                                flexShrink={0}
                              />
                            </HStack>
                          )}
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
              </CardBody>
            </Card>
          </VStack>
        );

      case 'system-notification-setting':
        const systemNotificationEvents = [
          { id: 'opd-patient-registration', title: 'OPD Patient Registration', templateId: '7' },
          { id: 'ipd-patient-registration', title: 'IPD Patient Registration', templateId: '7' },
          { id: 'ipd-patient-discharge', title: 'IPD Patient Discharge', templateId: '7' },
          { id: 'login-credential', title: 'Login Credential', templateId: '7' },
          { id: 'appointment-approved', title: 'Appointment Approved', templateId: '7' },
          { id: 'live-meeting', title: 'Live Meeting', templateId: '7' },
          { id: 'live-consult', title: 'Live Consult', templateId: '7' },
          { id: 'opd-patient-discharged', title: 'OPD Patient Discharged', templateId: '7' },
          { id: 'forgot-password', title: 'Forgot Password', templateId: '7' },
          { id: 'appointment-approved-patient', title: 'Appointment Approved (Patient)', templateId: '8' },
          { id: 'appointment-approved-staff', title: 'Appointment Approved (Staff)', templateId: '9' },
          { id: 'password-change', title: 'Password Change Notification', templateId: '10' },
          { id: 'new-patient-registration', title: 'New Patient Welcome', templateId: '11' },
          { id: 'bill-generated', title: 'Bill Generated', templateId: '12' },
          { id: 'payment-received', title: 'Payment Confirmation', templateId: '13' },
          { id: 'prescription-ready', title: 'Prescription Ready', templateId: '14' },
          { id: 'lab-report-ready', title: 'Lab Report Ready', templateId: '15' },
          { id: 'appointment-reminder', title: 'Appointment Reminder', templateId: '16' },
          { id: 'staff-attendance', title: 'Staff Attendance Notification', templateId: '17' },
          { id: 'inventory-low', title: 'Low Inventory Alert', templateId: '18' },
          { id: 'medicine-expiry', title: 'Medicine Expiry Alert', templateId: '19' },
          { id: 'bed-allocation', title: 'Bed Allocation Notification', templateId: '20' },
          { id: 'discharge-summary', title: 'Discharge Summary Ready', templateId: '21' },
          { id: 'insurance-claim', title: 'Insurance Claim Processed', templateId: '22' },
          { id: 'emergency-alert', title: 'Emergency Alert', templateId: '23' }
        ];

        return (
          <VStack spacing={6} align="stretch">
            <Flex justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="semibold">System Notification Setting</Text>
              <Button colorScheme="blue" leftIcon={<Save />} size="sm">
                Save
              </Button>
            </Flex>
            
            <Card border="1px" borderColor={borderColor} bg={cardBg}>
              <CardBody p={0}>
                <TableContainer>
                  <Table variant="simple" size="sm">
                    <Thead bg="gray.50">
                      <Tr>
                        <Th fontSize="xs" fontWeight="bold" color="gray.700" py={4} w="200px">Event</Th>
                        <Th fontSize="xs" fontWeight="bold" color="gray.700" py={4} textAlign="center" w="150px">Option</Th>
                        <Th fontSize="xs" fontWeight="bold" color="gray.700" py={4} textAlign="center" w="100px">Template Id</Th>
                        <Th fontSize="xs" fontWeight="bold" color="gray.700" py={4} w="auto">Sample Message</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {systemNotificationEvents.map((event, index) => (
                        <Tr key={event.id} borderBottom="1px solid" borderColor={borderColor}>
                          <Td py={4} fontWeight="medium" color="blue.600" w="200px">
                            <Text wordBreak="break-word" whiteSpace="normal">
                              {event.title}
                            </Text>
                          </Td>
                          <Td py={4} textAlign="center" w="150px">
                            <VStack spacing={2}>
                              <HStack spacing={2} justify="center" flexWrap="wrap">
                                <Checkbox size="sm">Email</Checkbox>
                                <Checkbox size="sm">SMS</Checkbox>
                                <Checkbox size="sm" defaultChecked>Mobile App</Checkbox>
                              </HStack>
                            </VStack>
                          </Td>
                          <Td py={4} textAlign="center" w="100px">
                            <Badge colorScheme="blue" fontSize="xs">{event.templateId}</Badge>
                          </Td>
                          <Td py={4} fontSize="sm" color="gray.700" w="auto">
                            {editingMessage[event.id] ? (
                              <VStack spacing={2} align="stretch">
                                <Textarea
                                  value={systemNotificationMessages[event.id]}
                                  onChange={(e) => handleMessageEdit(event.id, e.target.value, true)}
                                  size="sm"
                                  resize="vertical"
                                  minH="80px"
                                  wordBreak="break-word"
                                  whiteSpace="pre-wrap"
                                />
                                <HStack spacing={2}>
                                  <Button size="xs" colorScheme="green" onClick={() => toggleEdit(event.id)}>
                                    Save
                                  </Button>
                                  <Button size="xs" variant="outline" onClick={() => toggleEdit(event.id)}>
                                    Cancel
                                  </Button>
                                </HStack>
                              </VStack>
                            ) : (
                              <HStack justify="space-between" align="start">
                                <Text 
                                  flex={1} 
                                  wordBreak="break-word" 
                                  whiteSpace="normal"
                                  overflowWrap="break-word"
                                  maxW="100%"
                                >
                                  {systemNotificationMessages[event.id]}
                                </Text>
                                <IconButton
                                  size="xs"
                                  icon={<Edit3 size={12} />}
                                  variant="ghost"
                                  onClick={() => toggleEdit(event.id)}
                                  ml={2}
                                  flexShrink={0}
                                />
                              </HStack>
                            )}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </CardBody>
            </Card>
          </VStack>
        );

      case 'sms-setting':
        const indianSMSProviders = [
          { id: 'textlocal', name: 'TextLocal', logo: '📱', url: 'https://www.textlocal.in' },
          { id: 'msg91', name: 'MSG91', logo: '📲', url: 'https://msg91.com' },
          { id: 'twilio', name: 'Twilio India', logo: '💬', url: 'https://www.twilio.com/en-us/messaging/sms/pricing/india' },
          { id: 'kaleyra', name: 'Kaleyra', logo: '🚀', url: 'https://www.kaleyra.com' },
          { id: 'gupshup', name: 'Gupshup', logo: '🗨️', url: 'https://www.gupshup.io' },
          { id: 'way2sms', name: 'Way2SMS', logo: '📞', url: 'https://www.way2sms.com' },
          { id: 'bulk-sms', name: 'Bulk SMS India', logo: '📧', url: 'https://www.bulksmsclub.com' },
          { id: 'sms-country', name: 'SMS Country', logo: '🌐', url: 'https://www.smscountry.com' },
          { id: 'custom', name: 'Custom SMS Gateway', logo: '⚙️', url: '' }
        ];

        const renderSMSProviderForm = (provider) => {
          switch (provider.id) {
            case 'textlocal':
              return (
                <VStack spacing={6} align="stretch">
                  <HStack spacing={6} align="start">
                    <VStack spacing={4} flex={1}>
                      <FormControl isRequired>
                        <FormLabel>TextLocal Username *</FormLabel>
                        <Input placeholder="Enter your TextLocal username" />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>TextLocal API Key *</FormLabel>
                        <Input placeholder="Enter your TextLocal API key" />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Sender ID *</FormLabel>
                        <Input placeholder="Enter sender ID (6 characters)" maxLength={6} />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Status</FormLabel>
                        <Select value={smsStatus} onChange={(e) => setSmsStatus(e.target.value)}>
                          <option value="disabled">Disabled</option>
                          <option value="enabled">Enabled</option>
                        </Select>
                      </FormControl>
                    </VStack>
                    <Box flex={1} textAlign="center">
                      <VStack spacing={4}>
                        <Box fontSize="4xl">{provider.logo}</Box>
                        <Text fontSize="xl" fontWeight="bold" color="blue.600">{provider.name}</Text>
                        <Text fontSize="sm" color="blue.500" textDecoration="underline" cursor="pointer">
                          {provider.url}
                        </Text>
                        <Text fontSize="sm" color="gray.600" textAlign="center">
                          TextLocal is one of India's leading SMS service providers offering reliable SMS delivery with competitive pricing.
                        </Text>
                      </VStack>
                    </Box>
                  </HStack>
                </VStack>
              );

            case 'msg91':
              return (
                <VStack spacing={6} align="stretch">
                  <HStack spacing={6} align="start">
                    <VStack spacing={4} flex={1}>
                      <FormControl isRequired>
                        <FormLabel>MSG91 Auth Key *</FormLabel>
                        <Input placeholder="Enter your MSG91 Auth Key" />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Template ID *</FormLabel>
                        <Input placeholder="Enter template ID" />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Sender ID *</FormLabel>
                        <Input placeholder="Enter sender ID" />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Route</FormLabel>
                        <Select defaultValue="4">
                          <option value="1">Promotional</option>
                          <option value="4">Transactional</option>
                        </Select>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Status</FormLabel>
                        <Select value={smsStatus} onChange={(e) => setSmsStatus(e.target.value)}>
                          <option value="disabled">Disabled</option>
                          <option value="enabled">Enabled</option>
                        </Select>
                      </FormControl>
                    </VStack>
                    <Box flex={1} textAlign="center">
                      <VStack spacing={4}>
                        <Box fontSize="4xl">{provider.logo}</Box>
                        <Text fontSize="xl" fontWeight="bold" color="blue.600">{provider.name}</Text>
                        <Text fontSize="sm" color="blue.500" textDecoration="underline" cursor="pointer">
                          {provider.url}
                        </Text>
                        <Text fontSize="sm" color="gray.600" textAlign="center">
                          MSG91 provides robust SMS APIs for businesses with global reach and Indian compliance.
                        </Text>
                      </VStack>
                    </Box>
                  </HStack>
                </VStack>
              );

            case 'twilio':
              return (
                <VStack spacing={6} align="stretch">
                  <HStack spacing={6} align="start">
                    <VStack spacing={4} flex={1}>
                      <FormControl isRequired>
                        <FormLabel>Twilio Account SID *</FormLabel>
                        <Input placeholder="Enter your Twilio Account SID" />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Twilio Auth Token *</FormLabel>
                        <Input placeholder="Enter your Twilio Auth Token" type="password" />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Twilio Phone Number *</FormLabel>
                        <Input placeholder="Enter Twilio phone number" />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Status</FormLabel>
                        <Select value={smsStatus} onChange={(e) => setSmsStatus(e.target.value)}>
                          <option value="disabled">Disabled</option>
                          <option value="enabled">Enabled</option>
                        </Select>
                      </FormControl>
                    </VStack>
                    <Box flex={1} textAlign="center">
                      <VStack spacing={4}>
                        <Box fontSize="4xl">{provider.logo}</Box>
                        <Text fontSize="xl" fontWeight="bold" color="blue.600">{provider.name}</Text>
                        <Text fontSize="sm" color="blue.500" textDecoration="underline" cursor="pointer">
                          {provider.url}
                        </Text>
                        <Text fontSize="sm" color="gray.600" textAlign="center">
                          Twilio offers reliable SMS services for India with competitive pricing and excellent delivery rates.
                        </Text>
                      </VStack>
                    </Box>
                  </HStack>
                </VStack>
              );

            case 'kaleyra':
              return (
                <VStack spacing={6} align="stretch">
                  <HStack spacing={6} align="start">
                    <VStack spacing={4} flex={1}>
                      <FormControl isRequired>
                        <FormLabel>Kaleyra API Key *</FormLabel>
                        <Input placeholder="Enter your Kaleyra API Key" />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Kaleyra SID *</FormLabel>
                        <Input placeholder="Enter your Kaleyra SID" />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Sender ID *</FormLabel>
                        <Input placeholder="Enter sender ID" />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Status</FormLabel>
                        <Select value={smsStatus} onChange={(e) => setSmsStatus(e.target.value)}>
                          <option value="disabled">Disabled</option>
                          <option value="enabled">Enabled</option>
                        </Select>
                      </FormControl>
                    </VStack>
                    <Box flex={1} textAlign="center">
                      <VStack spacing={4}>
                        <Box fontSize="4xl">{provider.logo}</Box>
                        <Text fontSize="xl" fontWeight="bold" color="blue.600">{provider.name}</Text>
                        <Text fontSize="sm" color="blue.500" textDecoration="underline" cursor="pointer">
                          {provider.url}
                        </Text>
                        <Text fontSize="sm" color="gray.600" textAlign="center">
                          Kaleyra provides enterprise-grade communication solutions with strong presence in India.
                        </Text>
                      </VStack>
                    </Box>
                  </HStack>
                </VStack>
              );

            case 'custom':
              return (
                <VStack spacing={6} align="stretch">
                  <HStack spacing={6} align="start">
                    <VStack spacing={4} flex={1}>
                      <FormControl isRequired>
                        <FormLabel>Gateway URL *</FormLabel>
                        <Input placeholder="Enter your custom SMS gateway URL" />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Username *</FormLabel>
                        <Input placeholder="Enter username" />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Password *</FormLabel>
                        <Input placeholder="Enter password" type="password" />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Additional Parameters</FormLabel>
                        <Textarea placeholder="Enter additional parameters (JSON format)" rows={3} />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Status</FormLabel>
                        <Select value={smsStatus} onChange={(e) => setSmsStatus(e.target.value)}>
                          <option value="disabled">Disabled</option>
                          <option value="enabled">Enabled</option>
                        </Select>
                      </FormControl>
                    </VStack>
                    <Box flex={1} textAlign="center">
                      <VStack spacing={4}>
                        <Box fontSize="4xl">{provider.logo}</Box>
                        <Text fontSize="xl" fontWeight="bold" color="blue.600">{provider.name}</Text>
                        <Text fontSize="sm" color="gray.600" textAlign="center">
                          Configure your own custom SMS gateway with API parameters and authentication details.
                        </Text>
                      </VStack>
                    </Box>
                  </HStack>
                </VStack>
              );

            default:
              return (
                <VStack spacing={6} align="stretch">
                  <HStack spacing={6} align="start">
                    <VStack spacing={4} flex={1}>
                      <FormControl isRequired>
                        <FormLabel>{provider.name} API Key *</FormLabel>
                        <Input placeholder={`Enter your ${provider.name} API key`} />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Username *</FormLabel>
                        <Input placeholder="Enter username" />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Sender ID *</FormLabel>
                        <Input placeholder="Enter sender ID" />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Status</FormLabel>
                        <Select value={smsStatus} onChange={(e) => setSmsStatus(e.target.value)}>
                          <option value="disabled">Disabled</option>
                          <option value="enabled">Enabled</option>
                        </Select>
                      </FormControl>
                    </VStack>
                    <Box flex={1} textAlign="center">
                      <VStack spacing={4}>
                        <Box fontSize="4xl">{provider.logo}</Box>
                        <Text fontSize="xl" fontWeight="bold" color="blue.600">{provider.name}</Text>
                        <Text fontSize="sm" color="blue.500" textDecoration="underline" cursor="pointer">
                          {provider.url}
                        </Text>
                        <Text fontSize="sm" color="gray.600" textAlign="center">
                          Configure {provider.name} SMS gateway for reliable message delivery.
                        </Text>
                      </VStack>
                    </Box>
                  </HStack>
                </VStack>
              );
          }
        };

        return (
          <VStack spacing={6} align="stretch">
            <Flex justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="semibold">SMS Setting</Text>
              <Button colorScheme="blue" leftIcon={<Save />} size="sm">
                Save
              </Button>
            </Flex>

            <Card border="1px" borderColor={borderColor} bg={cardBg}>
              <CardBody p={0}>
                <Tabs index={activeSMSTab} onChange={setActiveSMSTab} variant="enclosed">
                  <TabList overflowX="auto" flexWrap="nowrap">
                    {indianSMSProviders.map((provider, index) => (
                      <Tab key={provider.id} fontSize="sm" minW="120px" whiteSpace="nowrap">
                        <HStack spacing={2}>
                          <Text>{provider.logo}</Text>
                          <Text>{provider.name}</Text>
                        </HStack>
                      </Tab>
                    ))}
                  </TabList>

                  <TabPanels>
                    {indianSMSProviders.map((provider) => (
                      <TabPanel key={provider.id} p={8}>
                        {renderSMSProviderForm(provider)}
                      </TabPanel>
                    ))}
                  </TabPanels>
                </Tabs>
              </CardBody>
            </Card>
          </VStack>
        );

      case 'email-setting':
        return (
          <VStack spacing={6} align="stretch">
            <Flex justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="semibold">Email Setting</Text>
              <Button colorScheme="blue" leftIcon={<Save />} size="sm">
                Save
              </Button>
            </Flex>

            <Card border="1px" borderColor={borderColor} bg={cardBg}>
              <CardBody p={8}>
                <VStack spacing={6} align="stretch" maxW="600px">
                  <FormControl isRequired>
                    <FormLabel fontWeight="medium" color="gray.700">Email Engine</FormLabel>
                    <Select 
                      value={emailEngine} 
                      onChange={(e) => setEmailEngine(e.target.value)}
                      bg="white"
                      border="1px solid"
                      borderColor="gray.300"
                    >
                      <option value="SMTP">SMTP</option>
                      <option value="Sendmail">Sendmail</option>
                      <option value="Mail">PHP Mail</option>
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel fontWeight="medium" color="gray.700">
                      SMTP Username <Text as="span" color="red.500">*</Text>
                    </FormLabel>
                    <Input 
                      placeholder="webfebtest@gmail.com"
                      defaultValue="webfebtest@gmail.com"
                      bg="white"
                      border="1px solid"
                      borderColor="gray.300"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel fontWeight="medium" color="gray.700">
                      SMTP Password <Text as="span" color="red.500">*</Text>
                    </FormLabel>
                    <Input 
                      type="password"
                      placeholder="••••••••••••••"
                      defaultValue="webfebtest123"
                      bg="white"
                      border="1px solid"
                      borderColor="gray.300"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel fontWeight="medium" color="gray.700">SMTP Server</FormLabel>
                    <Input 
                      placeholder="smtp.gmail.com"
                      defaultValue="smtp.gmail.com"
                      bg="white"
                      border="1px solid"
                      borderColor="gray.300"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel fontWeight="medium" color="gray.700">SMTP Port</FormLabel>
                    <Input 
                      placeholder="587"
                      defaultValue="587"
                      bg="white"
                      border="1px solid"
                      borderColor="gray.300"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel fontWeight="medium" color="gray.700">SMTP Security</FormLabel>
                    <Select 
                      value={smtpSecurity} 
                      onChange={(e) => setSmtpSecurity(e.target.value)}
                      bg="white"
                      border="1px solid"
                      borderColor="gray.300"
                    >
                      <option value="TLS">TLS</option>
                      <option value="SSL">SSL</option>
                      <option value="NONE">None</option>
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel fontWeight="medium" color="gray.700">SMTP Auth</FormLabel>
                    <Select 
                      value={smtpAuth} 
                      onChange={(e) => setSmtpAuth(e.target.value)}
                      bg="white"
                      border="1px solid"
                      borderColor="gray.300"
                    >
                      <option value="ON">ON</option>
                      <option value="OFF">OFF</option>
                    </Select>
                  </FormControl>

                  <Box pt={4}>
                    <Button 
                      colorScheme="blue" 
                      leftIcon={<Save />}
                      size="md"
                      px={8}
                    >
                      Save
                    </Button>
                  </Box>

                  <Box mt={6} p={4} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200">
                    <VStack spacing={3} align="start">
                      <Text fontSize="sm" fontWeight="semibold" color="blue.800">
                        📧 Common SMTP Settings:
                      </Text>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                        <VStack align="start" spacing={2}>
                          <Text fontSize="sm" fontWeight="medium" color="blue.700">Gmail</Text>
                          <Text fontSize="xs" color="blue.600">Server: smtp.gmail.com</Text>
                          <Text fontSize="xs" color="blue.600">Port: 587 (TLS) / 465 (SSL)</Text>
                        </VStack>
                        <VStack align="start" spacing={2}>
                          <Text fontSize="sm" fontWeight="medium" color="blue.700">Outlook</Text>
                          <Text fontSize="xs" color="blue.600">Server: smtp-mail.outlook.com</Text>
                          <Text fontSize="xs" color="blue.600">Port: 587 (TLS)</Text>
                        </VStack>
                        <VStack align="start" spacing={2}>
                          <Text fontSize="sm" fontWeight="medium" color="blue.700">Yahoo</Text>
                          <Text fontSize="xs" color="blue.600">Server: smtp.mail.yahoo.com</Text>
                          <Text fontSize="xs" color="blue.600">Port: 587 (TLS) / 465 (SSL)</Text>
                        </VStack>
                        <VStack align="start" spacing={2}>
                          <Text fontSize="sm" fontWeight="medium" color="blue.700">Zoho</Text>
                          <Text fontSize="xs" color="blue.600">Server: smtp.zoho.com</Text>
                          <Text fontSize="xs" color="blue.600">Port: 587 (TLS) / 465 (SSL)</Text>
                        </VStack>
                      </SimpleGrid>
                      <Alert status="info" mt={2} fontSize="sm">
                        <AlertIcon boxSize="16px" />
                        <Box>
                          <AlertTitle fontSize="sm">Note:</AlertTitle>
                          <AlertDescription fontSize="xs">
                            For Gmail, use App Passwords instead of your regular password. Enable 2-factor authentication and generate an app-specific password.
                          </AlertDescription>
                        </Box>
                      </Alert>
                    </VStack>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        );

      case 'payment-methods':
        const indianPaymentGateways = [
          { 
            id: 'razorpay', 
            name: 'Razorpay', 
            logo: '💳',
            color: 'blue',
            url: 'https://razorpay.com',
            description: 'India\'s most trusted payment gateway'
          },
          { 
            id: 'payu', 
            name: 'PayU', 
            logo: '🟢',
            color: 'green',
            url: 'https://payu.in',
            description: 'Leading online payment solution'
          },
          { 
            id: 'ccavenue', 
            name: 'CCAvenue', 
            logo: '🔵',
            color: 'purple',
            url: 'https://www.ccavenue.com',
            description: 'Pioneering payment gateway in India'
          },
          { 
            id: 'gpay', 
            name: 'Google Pay', 
            logo: '🌈',
            color: 'orange',
            url: 'https://pay.google.com',
            description: 'Google UPI payment solution'
          },
          { 
            id: 'paystack', 
            name: 'PayStack', 
            logo: '🚀',
            color: 'cyan',
            url: 'https://paystack.com',
            description: 'Modern online payments'
          },
          { 
            id: 'paytm', 
            name: 'Paytm', 
            logo: '💙',
            color: 'blue',
            url: 'https://paytm.com',
            description: 'One97 payment gateway'
          },
          { 
            id: 'phonepe', 
            name: 'PhonePe', 
            logo: '🟣',
            color: 'purple',
            url: 'https://www.phonepe.com',
            description: 'Walmart-backed payment solution'
          },
          { 
            id: 'bhimupi', 
            name: 'BHIM UPI', 
            logo: '🇮🇳',
            color: 'green',
            url: 'https://www.npci.org.in/what-we-do/upi',
            description: 'National UPI payment system'
          },
          { 
            id: 'billdesk', 
            name: 'BillDesk', 
            logo: '🏦',
            color: 'gray',
            url: 'https://www.billdesk.com',
            description: 'Enterprise payment solutions'
          },
          { 
            id: 'easebuzz', 
            name: 'Easebuzz', 
            logo: '⭐',
            color: 'yellow',
            url: 'https://www.easebuzz.in',
            description: 'Seamless payment experience'
          }
        ];

        const renderPaymentGatewayForm = (gateway) => {
          switch (gateway.id) {
            case 'razorpay':
              return (
                <VStack spacing={6} align="stretch">
                  <HStack spacing={8} align="start">
                    <VStack spacing={4} flex={1}>
                      <FormControl isRequired>
                        <FormLabel>Razorpay Key ID *</FormLabel>
                        <Input placeholder="rzp_test_xxxxxxxxxx" />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Razorpay Secret Key *</FormLabel>
                        <Input placeholder="xxxxxxxxxxxxxxxxxx" type="password" />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Processing Fees Type</FormLabel>
                        <RadioGroup defaultValue="none">
                          <VStack align="start" spacing={2}>
                            <Radio value="none">None</Radio>
                            <Radio value="percentage">Percentage (%)</Radio>
                            <Radio value="fixed">Fix Amount (₹)</Radio>
                          </VStack>
                        </RadioGroup>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Percentage/Fix Amount</FormLabel>
                        <Input placeholder="0.00" />
                      </FormControl>
                    </VStack>
                    <Box flex={1} textAlign="center">
                      <VStack spacing={4}>
                        <Box fontSize="4xl">{gateway.logo}</Box>
                        <Text fontSize="xl" fontWeight="bold" color={`${gateway.color}.600`}>{gateway.name}</Text>
                        <Text fontSize="sm" color={`${gateway.color}.500`} textDecoration="underline" cursor="pointer">
                          {gateway.url}
                        </Text>
                        <Text fontSize="sm" color="gray.600" textAlign="center">
                          {gateway.description}
                        </Text>
                      </VStack>
                    </Box>
                  </HStack>
                </VStack>
              );

            case 'payu':
              return (
                <VStack spacing={6} align="stretch">
                  <HStack spacing={8} align="start">
                    <VStack spacing={4} flex={1}>
                      <FormControl isRequired>
                        <FormLabel>PayU Merchant ID *</FormLabel>
                        <Input placeholder="Your PayU Merchant ID" />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>PayU Salt Key *</FormLabel>
                        <Input placeholder="Your PayU Salt Key" type="password" />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Environment</FormLabel>
                        <Select defaultValue="test">
                          <option value="test">Test</option>
                          <option value="production">Production</option>
                        </Select>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Processing Fees Type</FormLabel>
                        <RadioGroup defaultValue="none">
                          <VStack align="start" spacing={2}>
                            <Radio value="none">None</Radio>
                            <Radio value="percentage">Percentage (%)</Radio>
                            <Radio value="fixed">Fix Amount (₹)</Radio>
                          </VStack>
                        </RadioGroup>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Percentage/Fix Amount</FormLabel>
                        <Input placeholder="0.00" />
                      </FormControl>
                    </VStack>
                    <Box flex={1} textAlign="center">
                      <VStack spacing={4}>
                        <Box fontSize="4xl">{gateway.logo}</Box>
                        <Text fontSize="xl" fontWeight="bold" color={`${gateway.color}.600`}>{gateway.name}</Text>
                        <Text fontSize="sm" color={`${gateway.color}.500`} textDecoration="underline" cursor="pointer">
                          {gateway.url}
                        </Text>
                        <Text fontSize="sm" color="gray.600" textAlign="center">
                          {gateway.description}
                        </Text>
                      </VStack>
                    </Box>
                  </HStack>
                </VStack>
              );

            case 'ccavenue':
              return (
                <VStack spacing={6} align="stretch">
                  <HStack spacing={8} align="start">
                    <VStack spacing={4} flex={1}>
                      <FormControl isRequired>
                        <FormLabel>CCAvenue Merchant ID *</FormLabel>
                        <Input placeholder="Your CCAvenue Merchant ID" />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Working Key *</FormLabel>
                        <Input placeholder="Your Working Key" type="password" />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Access Code *</FormLabel>
                        <Input placeholder="Your Access Code" />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Processing Fees Type</FormLabel>
                        <RadioGroup defaultValue="none">
                          <VStack align="start" spacing={2}>
                            <Radio value="none">None</Radio>
                            <Radio value="percentage">Percentage (%)</Radio>
                            <Radio value="fixed">Fix Amount (₹)</Radio>
                          </VStack>
                        </RadioGroup>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Percentage/Fix Amount</FormLabel>
                        <Input placeholder="0.00" />
                      </FormControl>
                    </VStack>
                    <Box flex={1} textAlign="center">
                      <VStack spacing={4}>
                        <Box fontSize="4xl">{gateway.logo}</Box>
                        <Text fontSize="xl" fontWeight="bold" color={`${gateway.color}.600`}>{gateway.name}</Text>
                        <Text fontSize="sm" color={`${gateway.color}.500`} textDecoration="underline" cursor="pointer">
                          {gateway.url}
                        </Text>
                        <Text fontSize="sm" color="gray.600" textAlign="center">
                          {gateway.description}
                        </Text>
                      </VStack>
                    </Box>
                  </HStack>
                </VStack>
              );

            case 'gpay':
              return (
                <VStack spacing={6} align="stretch">
                  <HStack spacing={8} align="start">
                    <VStack spacing={4} flex={1}>
                      <FormControl isRequired>
                        <FormLabel>Google Pay Merchant ID *</FormLabel>
                        <Input placeholder="Your Google Pay Merchant ID" />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>UPI ID *</FormLabel>
                        <Input placeholder="merchant@gpay" />
                      </FormControl>
                      <FormControl>
                        <FormLabel>VPA (Virtual Payment Address)</FormLabel>
                        <Input placeholder="yourname@gpay" />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Processing Fees Type</FormLabel>
                        <RadioGroup defaultValue="none">
                          <VStack align="start" spacing={2}>
                            <Radio value="none">None</Radio>
                            <Radio value="percentage">Percentage (%)</Radio>
                            <Radio value="fixed">Fix Amount (₹)</Radio>
                          </VStack>
                        </RadioGroup>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Percentage/Fix Amount</FormLabel>
                        <Input placeholder="0.00" />
                      </FormControl>
                    </VStack>
                    <Box flex={1} textAlign="center">
                      <VStack spacing={4}>
                        <Box fontSize="4xl">{gateway.logo}</Box>
                        <Text fontSize="xl" fontWeight="bold" color={`${gateway.color}.600`}>{gateway.name}</Text>
                        <Text fontSize="sm" color={`${gateway.color}.500`} textDecoration="underline" cursor="pointer">
                          {gateway.url}
                        </Text>
                        <Text fontSize="sm" color="gray.600" textAlign="center">
                          {gateway.description}
                        </Text>
                      </VStack>
                    </Box>
                  </HStack>
                </VStack>
              );

            case 'bhimupi':
              return (
                <VStack spacing={6} align="stretch">
                  <HStack spacing={8} align="start">
                    <VStack spacing={4} flex={1}>
                      <FormControl isRequired>
                        <FormLabel>UPI ID *</FormLabel>
                        <Input placeholder="yourname@upi" />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>BHIM App Registration Number *</FormLabel>
                        <Input placeholder="Your BHIM Registration Number" />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Bank Account Number</FormLabel>
                        <Input placeholder="XXXXXXXXXXXX" />
                      </FormControl>
                      <FormControl>
                        <FormLabel>IFSC Code</FormLabel>
                        <Input placeholder="SBIN0001234" />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Processing Fees Type</FormLabel>
                        <RadioGroup defaultValue="none">
                          <VStack align="start" spacing={2}>
                            <Radio value="none">None</Radio>
                            <Radio value="percentage">Percentage (%)</Radio>
                            <Radio value="fixed">Fix Amount (₹)</Radio>
                          </VStack>
                        </RadioGroup>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Percentage/Fix Amount</FormLabel>
                        <Input placeholder="0.00" />
                      </FormControl>
                    </VStack>
                    <Box flex={1} textAlign="center">
                      <VStack spacing={4}>
                        <Box fontSize="4xl">{gateway.logo}</Box>
                        <Text fontSize="xl" fontWeight="bold" color={`${gateway.color}.600`}>{gateway.name}</Text>
                        <Text fontSize="sm" color={`${gateway.color}.500`} textDecoration="underline" cursor="pointer">
                          {gateway.url}
                        </Text>
                        <Text fontSize="sm" color="gray.600" textAlign="center">
                          {gateway.description}
                        </Text>
                      </VStack>
                    </Box>
                  </HStack>
                </VStack>
              );

            default:
              return (
                <VStack spacing={6} align="stretch">
                  <HStack spacing={8} align="start">
                    <VStack spacing={4} flex={1}>
                      <FormControl isRequired>
                        <FormLabel>{gateway.name} API Key *</FormLabel>
                        <Input placeholder={`Your ${gateway.name} API Key`} />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>{gateway.name} Secret *</FormLabel>
                        <Input placeholder={`Your ${gateway.name} Secret`} type="password" />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Processing Fees Type</FormLabel>
                        <RadioGroup defaultValue="none">
                          <VStack align="start" spacing={2}>
                            <Radio value="none">None</Radio>
                            <Radio value="percentage">Percentage (%)</Radio>
                            <Radio value="fixed">Fix Amount (₹)</Radio>
                          </VStack>
                        </RadioGroup>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Percentage/Fix Amount</FormLabel>
                        <Input placeholder="0.00" />
                      </FormControl>
                    </VStack>
                    <Box flex={1} textAlign="center">
                      <VStack spacing={4}>
                        <Box fontSize="4xl">{gateway.logo}</Box>
                        <Text fontSize="xl" fontWeight="bold" color={`${gateway.color}.600`}>{gateway.name}</Text>
                        <Text fontSize="sm" color={`${gateway.color}.500`} textDecoration="underline" cursor="pointer">
                          {gateway.url}
                        </Text>
                        <Text fontSize="sm" color="gray.600" textAlign="center">
                          {gateway.description}
                        </Text>
                      </VStack>
                    </Box>
                  </HStack>
                </VStack>
              );
          }
        };

        return (
          <Grid templateColumns={{ base: '1fr', xl: '1fr 300px' }} gap={8}>
            {/* Main Payment Gateway Configuration */}
            <VStack spacing={6} align="stretch">
              <Flex justify="space-between" align="center">
                <Text fontSize="lg" fontWeight="semibold">Payment Methods</Text>
                <Button colorScheme="blue" leftIcon={<Save />} size="sm">
                  Save
                </Button>
              </Flex>

              <Card border="1px" borderColor={borderColor} bg={cardBg}>
                <CardBody p={0}>
                  <Tabs index={activePaymentTab} onChange={setActivePaymentTab} variant="enclosed">
                    <TabList overflowX="auto" flexWrap="wrap">
                      {indianPaymentGateways.map((gateway, index) => (
                        <Tab key={gateway.id} fontSize="sm" minW="120px">
                          <HStack spacing={2}>
                            <Text>{gateway.logo}</Text>
                            <Text>{gateway.name}</Text>
                          </HStack>
                        </Tab>
                      ))}
                    </TabList>

                    <TabPanels>
                      {indianPaymentGateways.map((gateway) => (
                        <TabPanel key={gateway.id} p={8}>
                          {renderPaymentGatewayForm(gateway)}
                          <Box pt={6}>
                            <Button colorScheme="blue" leftIcon={<Save />}>
                              Save
                            </Button>
                          </Box>
                        </TabPanel>
                      ))}
                    </TabPanels>
                  </Tabs>
                </CardBody>
              </Card>
            </VStack>

            {/* Payment Gateway Selection Sidebar */}
            <VStack spacing={6} align="stretch">
              <Text fontSize="md" fontWeight="semibold">Select Payment Gateway</Text>
              <Card border="1px" borderColor={borderColor} bg={cardBg}>
                <CardBody>
                  <VStack spacing={3} align="stretch">
                    {indianPaymentGateways.map((gateway) => (
                      <Box key={gateway.id}>
                        <Checkbox 
                          isChecked={selectedPaymentGateways.includes(gateway.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPaymentGateways([...selectedPaymentGateways, gateway.id]);
                            } else {
                              setSelectedPaymentGateways(selectedPaymentGateways.filter(id => id !== gateway.id));
                            }
                          }}
                        >
                          <Text fontSize="sm">{gateway.name}</Text>
                        </Checkbox>
                      </Box>
                    ))}
                    <Box pt={4}>
                      <Button colorScheme="blue" size="sm" width="full">
                        Save
                      </Button>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          </Grid>
        );

      case 'front-cms-setting':
        return (
          <VStack spacing={6} align="stretch">
            <Flex justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="semibold">Front CMS Setting</Text>
              <Button colorScheme="blue" leftIcon={<Save />} size="sm">
                Save
              </Button>
            </Flex>

            <Grid templateColumns={{ base: '1fr', lg: '1fr 400px' }} gap={8}>
              {/* Main Settings Panel */}
              <VStack spacing={6} align="stretch">
                {/* Toggle Settings */}
                <Card border="1px" borderColor={borderColor} bg={cardBg}>
                  <CardBody p={6}>
                    <VStack spacing={6} align="stretch">
                      {/* Front CMS Toggle */}
                      <Flex justify="space-between" align="center">
                        <Text fontWeight="medium">Front CMS</Text>
                        <Switch size="lg" colorScheme="green" defaultChecked />
                      </Flex>

                      {/* Online Appointment Toggle */}
                      <Flex justify="space-between" align="center">
                        <Text fontWeight="medium">Online Appointment</Text>
                        <Switch size="lg" colorScheme="green" defaultChecked />
                      </Flex>

                      {/* Sidebar Toggle */}
                      <Flex justify="space-between" align="center">
                        <Text fontWeight="medium">Sidebar</Text>
                        <Switch size="lg" colorScheme="gray" />
                      </Flex>

                      {/* Language RTL Text Mode Toggle */}
                      <Flex justify="space-between" align="center">
                        <Text fontWeight="medium">Language RTL Text Mode</Text>
                        <Switch size="lg" colorScheme="gray" />
                      </Flex>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Sidebar Options */}
                <Card border="1px" borderColor={borderColor} bg={cardBg}>
                  <CardBody p={6}>
                    <VStack spacing={4} align="stretch">
                      <Text fontWeight="medium">Sidebar Option</Text>
                      <HStack spacing={6}>
                        <Checkbox defaultChecked>News</Checkbox>
                        <Checkbox defaultChecked>Complain</Checkbox>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Logo Upload */}
                <Card border="1px" borderColor={borderColor} bg={cardBg}>
                  <CardBody p={6}>
                    <VStack spacing={4} align="stretch">
                      <Text fontWeight="medium">Logo (369px X 76px)</Text>
                      <Box 
                        border="2px dashed" 
                        borderColor="gray.300" 
                        borderRadius="md" 
                        p={8} 
                        textAlign="center"
                        bg="gray.50"
                      >
                        <VStack spacing={3}>
                          <Box bg="orange.500" color="white" px={6} py={2} borderRadius="md" fontSize="lg" fontWeight="bold">
                            SMART HOSPITAL
                          </Box>
                          <Button size="sm" colorScheme="blue" variant="outline">
                            Choose File
                          </Button>
                          <Text fontSize="sm" color="gray.500">
                            Recommended size: 369px X 76px
                          </Text>
                        </VStack>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Favicon Upload */}
                <Card border="1px" borderColor={borderColor} bg={cardBg}>
                  <CardBody p={6}>
                    <VStack spacing={4} align="stretch">
                      <Text fontWeight="medium">Favicon (32px X 32px)</Text>
                      <Box 
                        border="2px dashed" 
                        borderColor="gray.300" 
                        borderRadius="md" 
                        p={6} 
                        textAlign="center"
                        bg="gray.50"
                      >
                        <VStack spacing={3}>
                          <Box bg="pink.500" w="8" h="8" borderRadius="md"></Box>
                          <Button size="sm" colorScheme="blue" variant="outline">
                            Choose File
                          </Button>
                          <Text fontSize="sm" color="gray.500">
                            Recommended size: 32px X 32px
                          </Text>
                        </VStack>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Footer Text */}
                <Card border="1px" borderColor={borderColor} bg={cardBg}>
                  <CardBody p={6}>
                    <VStack spacing={4} align="stretch">
                      <FormControl>
                        <FormLabel fontWeight="medium">Footer Text</FormLabel>
                        <Input 
                          defaultValue="©Smart Hospital & Research Center 2025 All rights reserved" 
                          placeholder="Enter footer text"
                        />
                      </FormControl>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Google Analytics */}
                <Card border="1px" borderColor={borderColor} bg={cardBg}>
                  <CardBody p={6}>
                    <VStack spacing={4} align="stretch">
                      <FormControl>
                        <FormLabel fontWeight="medium">Google Analytics</FormLabel>
                        <Textarea 
                          defaultValue={`<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID">
</script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
</script>`}
                          placeholder="Enter Google Analytics code"
                          rows={6}
                          fontFamily="mono"
                          fontSize="sm"
                        />
                      </FormControl>
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>

              {/* Social Media URLs Sidebar */}
              <VStack spacing={6} align="stretch">
                <Text fontSize="md" fontWeight="semibold">Social Media URLs</Text>
                
                <Card border="1px" borderColor={borderColor} bg={cardBg}>
                  <CardBody p={6}>
                    <VStack spacing={4} align="stretch">
                      <FormControl>
                        <FormLabel fontSize="sm">Facebook URL</FormLabel>
                        <Input 
                          defaultValue="https://www.facebook.com/login"
                          placeholder="Enter Facebook URL"
                          size="sm"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel fontSize="sm">Twitter URL</FormLabel>
                        <Input 
                          defaultValue="https://twitter.com/login?lang=en"
                          placeholder="Enter Twitter URL"
                          size="sm"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel fontSize="sm">Youtube URL</FormLabel>
                        <Input 
                          defaultValue="https://www.youtube.com/account"
                          placeholder="Enter Youtube URL"
                          size="sm"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel fontSize="sm">Google Plus URL</FormLabel>
                        <Input 
                          defaultValue="https://plus.google.com/people"
                          placeholder="Enter Google Plus URL"
                          size="sm"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel fontSize="sm">LinkedIn URL</FormLabel>
                        <Input 
                          defaultValue="https://www.linkedin.com/uas/login?_l=en"
                          placeholder="Enter LinkedIn URL"
                          size="sm"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel fontSize="sm">Instagram URL</FormLabel>
                        <Input 
                          defaultValue="https://www.instagram.com/accounts/login/"
                          placeholder="Enter Instagram URL"
                          size="sm"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel fontSize="sm">Pinterest URL</FormLabel>
                        <Input 
                          defaultValue="https://in.pinterest.com/login/"
                          placeholder="Enter Pinterest URL"
                          size="sm"
                        />
                      </FormControl>
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>
            </Grid>

            {/* Theme Selection */}
            <Card border="1px" borderColor={borderColor} bg={cardBg}>
              <CardBody p={6}>
                <VStack spacing={6} align="stretch">
                  <Text fontSize="lg" fontWeight="semibold">Current Theme</Text>
                  
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                    {/* Turquoise Blue Theme */}
                    <VStack spacing={3}>
                      <Box 
                        w="full" 
                        h="200px" 
                        bg="teal.500" 
                        borderRadius="md" 
                        position="relative"
                        cursor="pointer"
                        border="3px solid"
                        borderColor="blue.500"
                      >
                        <Box position="absolute" top={2} left={2} right={2}>
                          <Box bg="white" h="6" borderRadius="sm" mb={2}></Box>
                          <Box bg="white" h="4" borderRadius="sm" mb={1}></Box>
                          <Box bg="white" h="4" borderRadius="sm"></Box>
                        </Box>
                        <Box position="absolute" bottom={2} left={2} right={2}>
                          <Box bg="white" h="12" borderRadius="sm"></Box>
                        </Box>
                      </Box>
                      <Text fontWeight="medium" textAlign="center" bg="gray.700" color="white" py={2} px={4} borderRadius="md" w="full">
                        turquoise_blue
                      </Text>
                    </VStack>

                    {/* Sky Blue Theme */}
                    <VStack spacing={3}>
                      <Box 
                        w="full" 
                        h="200px" 
                        bg="blue.400" 
                        borderRadius="md" 
                        position="relative"
                        cursor="pointer"
                        border="2px solid"
                        borderColor="gray.300"
                      >
                        <Box position="absolute" top={2} left={2} right={2}>
                          <Box bg="white" h="6" borderRadius="sm" mb={2}></Box>
                          <Box bg="white" h="4" borderRadius="sm" mb={1}></Box>
                          <Box bg="white" h="4" borderRadius="sm"></Box>
                        </Box>
                        <Box position="absolute" bottom={2} left={2} right={2}>
                          <Box bg="white" h="12" borderRadius="sm"></Box>
                        </Box>
                      </Box>
                      <Text fontWeight="medium" textAlign="center" bg="blue.500" color="white" py={2} px={4} borderRadius="md" w="full">
                        sky_blue
                      </Text>
                    </VStack>

                    {/* Material Pink Theme */}
                    <VStack spacing={3}>
                      <Box 
                        w="full" 
                        h="200px" 
                        bg="pink.500" 
                        borderRadius="md" 
                        position="relative"
                        cursor="pointer"
                        border="2px solid"
                        borderColor="gray.300"
                      >
                        <Box position="absolute" top={2} left={2} right={2}>
                          <Box bg="white" h="6" borderRadius="sm" mb={2}></Box>
                          <Box bg="white" h="4" borderRadius="sm" mb={1}></Box>
                          <Box bg="white" h="4" borderRadius="sm"></Box>
                        </Box>
                        <Box position="absolute" bottom={2} left={2} right={2}>
                          <Box bg="white" h="12" borderRadius="sm"></Box>
                        </Box>
                      </Box>
                      <Text fontWeight="medium" textAlign="center" bg="pink.600" color="white" py={2} px={4} borderRadius="md" w="full">
                        material_pink
                      </Text>
                    </VStack>

                    {/* White Gray Theme */}
                    <VStack spacing={3}>
                      <Box 
                        w="full" 
                        h="200px" 
                        bg="gray.100" 
                        borderRadius="md" 
                        position="relative"
                        cursor="pointer"
                        border="2px solid"
                        borderColor="gray.300"
                      >
                        <Box position="absolute" top={2} left={2} right={2}>
                          <Box bg="gray.300" h="6" borderRadius="sm" mb={2}></Box>
                          <Box bg="gray.300" h="4" borderRadius="sm" mb={1}></Box>
                          <Box bg="gray.300" h="4" borderRadius="sm"></Box>
                        </Box>
                        <Box position="absolute" bottom={2} left={2} right={2}>
                          <Box bg="gray.300" h="12" borderRadius="sm"></Box>
                        </Box>
                      </Box>
                      <Text fontWeight="medium" textAlign="center" bg="gray.600" color="white" py={2} px={4} borderRadius="md" w="full">
                        white_gray
                      </Text>
                    </VStack>
                  </SimpleGrid>
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        );

      case 'backup-restore':
        return (
          <VStack spacing={6} align="stretch">
            <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
              {/* Main Backup History Panel */}
              <VStack spacing={4} align="stretch">
                <Flex justify="space-between" align="center">
                  <Text fontSize="lg" fontWeight="semibold">Backup History</Text>
                  <Button colorScheme="blue" leftIcon={<Plus />} size="sm">
                    Create Backup
                  </Button>
                </Flex>

                <Card border="1px" borderColor={borderColor} bg={cardBg}>
                  <CardBody p={4}>
                    <TableContainer>
                      <Table variant="simple" size="sm">
                        <Thead bg="gray.50">
                          <Tr>
                            <Th py={3} px={4} fontSize="sm" fontWeight="semibold" textTransform="uppercase">
                              Backup Files
                            </Th>
                            <Th py={3} px={4} fontSize="sm" fontWeight="semibold" textTransform="uppercase">
                              Action
                            </Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          <Tr>
                            <Td py={3} px={4}>
                              <Text color="blue.500" textDecoration="underline" cursor="pointer" fontSize="sm">
                                db_ver_6.0_2025-08-21_16-03-09.sql
                              </Text>
                            </Td>
                            <Td py={3} px={4}>
                              <HStack spacing={2} flexWrap="wrap">
                                <Button size="xs" colorScheme="green" leftIcon={<Download />} minW="80px">
                                  Download
                                </Button>
                                <Button size="xs" colorScheme="orange" leftIcon={<RotateCcw />} minW="70px">
                                  Restore
                                </Button>
                                <Button size="xs" colorScheme="red" leftIcon={<Trash2 />} minW="65px">
                                  Delete
                                </Button>
                              </HStack>
                            </Td>
                          </Tr>
                          <Tr>
                            <Td py={3} px={4}>
                              <Text color="blue.500" textDecoration="underline" cursor="pointer" fontSize="sm">
                                db_ver_6.0_2025-08-23_18-41-03.sql
                              </Text>
                            </Td>
                            <Td py={3} px={4}>
                              <HStack spacing={2} flexWrap="wrap">
                                <Button size="xs" colorScheme="green" leftIcon={<Download />} minW="80px">
                                  Download
                                </Button>
                                <Button size="xs" colorScheme="orange" leftIcon={<RotateCcw />} minW="70px">
                                  Restore
                                </Button>
                                <Button size="xs" colorScheme="red" leftIcon={<Trash2 />} minW="65px">
                                  Delete
                                </Button>
                              </HStack>
                            </Td>
                          </Tr>
                          <Tr>
                            <Td py={3} px={4}>
                              <Text color="blue.500" textDecoration="underline" cursor="pointer" fontSize="sm">
                                db_ver_6.0_2025-08-24_14-12-05.sql
                              </Text>
                            </Td>
                            <Td py={3} px={4}>
                              <HStack spacing={2} flexWrap="wrap">
                                <Button size="xs" colorScheme="green" leftIcon={<Download />} minW="80px">
                                  Download
                                </Button>
                                <Button size="xs" colorScheme="orange" leftIcon={<RotateCcw />} minW="70px">
                                  Restore
                                </Button>
                                <Button size="xs" colorScheme="red" leftIcon={<Trash2 />} minW="65px">
                                  Delete
                                </Button>
                              </HStack>
                            </Td>
                          </Tr>
                          <Tr>
                            <Td py={3} px={4}>
                              <Text color="blue.500" textDecoration="underline" cursor="pointer" fontSize="sm">
                                db_ver_6.0_2025-08-24_18-05-37.sql
                              </Text>
                            </Td>
                            <Td py={3} px={4}>
                              <HStack spacing={2} flexWrap="wrap">
                                <Button size="xs" colorScheme="green" leftIcon={<Download />} minW="80px">
                                  Download
                                </Button>
                                <Button size="xs" colorScheme="orange" leftIcon={<RotateCcw />} minW="70px">
                                  Restore
                                </Button>
                                <Button size="xs" colorScheme="red" leftIcon={<Trash2 />} minW="65px">
                                  Delete
                                </Button>
                              </HStack>
                            </Td>
                          </Tr>
                          <Tr>
                            <Td py={3} px={4}>
                              <Text color="blue.500" textDecoration="underline" cursor="pointer" fontSize="sm">
                                db_ver_6.0_2025-08-24_19-17-24.sql
                              </Text>
                            </Td>
                            <Td py={3} px={4}>
                              <HStack spacing={2} flexWrap="wrap">
                                <Button size="xs" colorScheme="green" leftIcon={<Download />} minW="80px">
                                  Download
                                </Button>
                                <Button size="xs" colorScheme="orange" leftIcon={<RotateCcw />} minW="70px">
                                  Restore
                                </Button>
                                <Button size="xs" colorScheme="red" leftIcon={<Trash2 />} minW="65px">
                                  Delete
                                </Button>
                              </HStack>
                            </Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </CardBody>
                </Card>
              </VStack>

              {/* Sidebar with Upload and Cron Settings */}
              <VStack spacing={6} align="stretch">
                {/* Upload From Local Directory */}
                <Box>
                  <Text fontSize="md" fontWeight="semibold" mb={4}>Upload From Local Directory</Text>
                  <Card border="1px" borderColor={borderColor} bg={cardBg}>
                    <CardBody p={6}>
                      <VStack spacing={4}>
                        <Box
                          border="2px dashed"
                          borderColor="gray.300"
                          borderRadius="md"
                          p={8}
                          textAlign="center"
                          bg="gray.50"
                          w="full"
                          minH="120px"
                          cursor="pointer"
                          _hover={{ borderColor: "blue.400", bg: "blue.50" }}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <VStack spacing={3}>
                            <Box fontSize="2xl" color="gray.400">
                              ☁️
                            </Box>
                            <Text fontSize="sm" color="gray.600">
                              Drop a file here or click
                            </Text>
                          </VStack>
                        </Box>
                        <Button colorScheme="blue" size="sm" width="full" leftIcon={<Upload />}>
                          Upload
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                </Box>

                {/* Cron Secret Key */}
                <Box>
                  <Text fontSize="md" fontWeight="semibold" mb={4}>Cron Secret Key</Text>
                  <Card border="1px" borderColor={borderColor} bg={cardBg}>
                    <CardBody p={6}>
                      <VStack spacing={4}>
                        <HStack w="full" spacing={2}>
                          <Input 
                            value="************************" 
                            type="password"
                            isReadOnly
                            bg="gray.50"
                            size="sm"
                            flex={1}
                          />
                          <IconButton
                            icon={<Eye />}
                            size="sm"
                            variant="ghost"
                            aria-label="Show key"
                            flexShrink={0}
                          />
                        </HStack>
                        <Button colorScheme="blue" size="sm" width="full">
                          Regenerate
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                </Box>
              </VStack>
            </Grid>
          </VStack>
        );

      case 'languages':
        return (
          <VStack spacing={6} align="stretch">
            <Flex justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="semibold">Language List</Text>
              <Button colorScheme="blue" leftIcon={<Plus />} size="sm">
                Add
              </Button>
            </Flex>

            {/* Information Alert */}
            <Alert status="warning" borderRadius="md">
              <AlertIcon />
              <Box>
                <Text fontSize="sm">
                  To change language key phrases, go your language directory e.g. for English language go edit file /application/language/English/app_files/system_lang.php
                </Text>
              </Box>
            </Alert>

            {/* Languages Table */}
            <Card border="1px" borderColor={borderColor} bg={cardBg}>
              <CardBody p={0}>
                <TableContainer>
                  <Table variant="simple" size="sm">
                    <Thead bg="gray.50">
                      <Tr>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold">#</Th>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold">Language</Th>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold">Short Code</Th>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold">Country Code</Th>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold">Status</Th>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold">Active</Th>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold">Is RTL</Th>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold">Action</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {/* English */}
                      <Tr>
                        <Td py={3} px={4}>1.</Td>
                        <Td py={3} px={4}>
                          <HStack spacing={2}>
                            <Text fontSize="lg">🇬🇧</Text>
                            <Text fontSize="sm" fontWeight="medium">English</Text>
                          </HStack>
                        </Td>
                        <Td py={3} px={4}>
                          <Text fontSize="sm">en</Text>
                        </Td>
                        <Td py={3} px={4}>
                          <Text fontSize="sm">us</Text>
                        </Td>
                        <Td py={3} px={4}>
                          <Badge colorScheme="green" size="sm" borderRadius="full">
                            Active
                          </Badge>
                        </Td>
                        <Td py={3} px={4}>
                          <Switch size="sm" colorScheme="green" defaultChecked />
                        </Td>
                        <Td py={3} px={4}>
                          <Checkbox size="sm" />
                        </Td>
                        <Td py={3} px={4}>
                          <Switch size="sm" colorScheme="green" defaultChecked />
                        </Td>
                      </Tr>

                      {/* Hindi */}
                      <Tr>
                        <Td py={3} px={4}>2.</Td>
                        <Td py={3} px={4}>
                          <HStack spacing={2}>
                            <Text fontSize="lg">🇮🇳</Text>
                            <Text fontSize="sm" fontWeight="medium">Hindi</Text>
                          </HStack>
                        </Td>
                        <Td py={3} px={4}>
                          <Text fontSize="sm">hi</Text>
                        </Td>
                        <Td py={3} px={4}>
                          <Text fontSize="sm">in</Text>
                        </Td>
                        <Td py={3} px={4}>
                          <Badge colorScheme="gray" size="sm" borderRadius="full">
                            Inactive
                          </Badge>
                        </Td>
                        <Td py={3} px={4}>
                          <Switch size="sm" colorScheme="gray" />
                        </Td>
                        <Td py={3} px={4}>
                          <Checkbox size="sm" />
                        </Td>
                        <Td py={3} px={4}>
                          <Switch size="sm" colorScheme="gray" />
                        </Td>
                      </Tr>

                      {/* Gujarati */}
                      <Tr>
                        <Td py={3} px={4}>3.</Td>
                        <Td py={3} px={4}>
                          <HStack spacing={2}>
                            <Text fontSize="lg">🇮🇳</Text>
                            <Text fontSize="sm" fontWeight="medium">Gujarati</Text>
                          </HStack>
                        </Td>
                        <Td py={3} px={4}>
                          <Text fontSize="sm">gu</Text>
                        </Td>
                        <Td py={3} px={4}>
                          <Text fontSize="sm">in</Text>
                        </Td>
                        <Td py={3} px={4}>
                          <Badge colorScheme="gray" size="sm" borderRadius="full">
                            Inactive
                          </Badge>
                        </Td>
                        <Td py={3} px={4}>
                          <Switch size="sm" colorScheme="gray" />
                        </Td>
                        <Td py={3} px={4}>
                          <Checkbox size="sm" />
                        </Td>
                        <Td py={3} px={4}>
                          <Switch size="sm" colorScheme="gray" />
                        </Td>
                      </Tr>

                      {/* Sanskrit */}
                      <Tr>
                        <Td py={3} px={4}>4.</Td>
                        <Td py={3} px={4}>
                          <HStack spacing={2}>
                            <Text fontSize="lg">🇮🇳</Text>
                            <Text fontSize="sm" fontWeight="medium">Sanskrit</Text>
                          </HStack>
                        </Td>
                        <Td py={3} px={4}>
                          <Text fontSize="sm">sa</Text>
                        </Td>
                        <Td py={3} px={4}>
                          <Text fontSize="sm">in</Text>
                        </Td>
                        <Td py={3} px={4}>
                          <Badge colorScheme="gray" size="sm" borderRadius="full">
                            Inactive
                          </Badge>
                        </Td>
                        <Td py={3} px={4}>
                          <Switch size="sm" colorScheme="gray" />
                        </Td>
                        <Td py={3} px={4}>
                          <Checkbox size="sm" />
                        </Td>
                        <Td py={3} px={4}>
                          <Switch size="sm" colorScheme="gray" />
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
              </CardBody>
            </Card>
          </VStack>
        );

      case 'users':
        return (
          <VStack spacing={6} align="stretch">
            <Flex justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="semibold">Users</Text>
              <HStack spacing={3}>
                <Button 
                  colorScheme={activeUserTab === 'patient' ? "blue" : "gray"} 
                  variant={activeUserTab === 'patient' ? "solid" : "outline"} 
                  size="sm"
                  onClick={() => setActiveUserTab('patient')}
                >
                  Patient
                </Button>
                <Button 
                  colorScheme={activeUserTab === 'staff' ? "blue" : "gray"} 
                  variant={activeUserTab === 'staff' ? "solid" : "outline"} 
                  size="sm"
                  onClick={() => setActiveUserTab('staff')}
                >
                  Staff
                </Button>
              </HStack>
            </Flex>

            {/* Search and Controls */}
            <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
              <Input
                placeholder="Search..."
                size="sm"
                maxW="300px"
                bg="white"
              />
              <HStack spacing={2}>
                <Select size="sm" maxW="100px" defaultValue="100">
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </Select>
                <IconButton
                  icon={<Download />}
                  size="sm"
                  variant="ghost"
                  aria-label="Export CSV"
                  title="Export CSV"
                />
                <IconButton
                  icon={<FileText />}
                  size="sm"
                  variant="ghost"
                  aria-label="Export Excel"
                  title="Export Excel"
                />
                <IconButton
                  icon={<FileText />}
                  size="sm"
                  variant="ghost"
                  aria-label="Export PDF"
                  title="Export PDF"
                />
                <IconButton
                  icon={<Printer />}
                  size="sm"
                  variant="ghost"
                  aria-label="Print"
                  title="Print"
                />
              </HStack>
            </Flex>

            {/* Users Table */}
            <Card border="1px" borderColor={borderColor} bg={cardBg}>
              <CardBody p={0}>
                <TableContainer>
                  <Table variant="simple" size="sm">
                    <Thead bg="gray.50">
                      <Tr>
                        {activeUserTab === 'patient' ? (
                          <>
                            <Th py={4} px={4} fontSize="sm" fontWeight="semibold">
                              Patient Id
                              <IconButton
                                icon={<ArrowUpDown />}
                                size="xs"
                                variant="ghost"
                                ml={1}
                                aria-label="Sort"
                              />
                            </Th>
                            <Th py={4} px={4} fontSize="sm" fontWeight="semibold">Name</Th>
                            <Th py={4} px={4} fontSize="sm" fontWeight="semibold">Username</Th>
                            <Th py={4} px={4} fontSize="sm" fontWeight="semibold">
                              Mobile Number
                              <IconButton
                                icon={<ArrowUpDown />}
                                size="xs"
                                variant="ghost"
                                ml={1}
                                aria-label="Sort"
                              />
                            </Th>
                            <Th py={4} px={4} fontSize="sm" fontWeight="semibold">Action</Th>
                          </>
                        ) : (
                          <>
                            <Th py={4} px={4} fontSize="sm" fontWeight="semibold">Staff ID</Th>
                            <Th py={4} px={4} fontSize="sm" fontWeight="semibold">Name</Th>
                            <Th py={4} px={4} fontSize="sm" fontWeight="semibold">Email</Th>
                            <Th py={4} px={4} fontSize="sm" fontWeight="semibold">
                              Role
                              <IconButton
                                icon={<ArrowUpDown />}
                                size="xs"
                                variant="ghost"
                                ml={1}
                                aria-label="Sort"
                              />
                            </Th>
                            <Th py={4} px={4} fontSize="sm" fontWeight="semibold">
                              Designation
                              <IconButton
                                icon={<ArrowUpDown />}
                                size="xs"
                                variant="ghost"
                                ml={1}
                                aria-label="Sort"
                              />
                            </Th>
                            <Th py={4} px={4} fontSize="sm" fontWeight="semibold">
                              Department
                              <IconButton
                                icon={<ArrowUpDown />}
                                size="xs"
                                variant="ghost"
                                ml={1}
                                aria-label="Sort"
                              />
                            </Th>
                            <Th py={4} px={4} fontSize="sm" fontWeight="semibold">Phone</Th>
                            <Th py={4} px={4} fontSize="sm" fontWeight="semibold">
                              Action
                              <IconButton
                                icon={<ArrowUpDown />}
                                size="xs"
                                variant="ghost"
                                ml={1}
                                aria-label="Sort"
                              />
                            </Th>
                          </>
                        )}
                      </Tr>
                    </Thead>
                    <Tbody>
                      {activeUserTab === 'patient' ? (
                        /* Patient Data */
                        [
                          { id: 1, name: "Olivier Thomas", username: "pat1", mobile: "7896541230" },
                          { id: 2, name: "John Marshall", username: "pat2", mobile: "9856475632" },
                          { id: 9, name: "Manu", username: "pat9", mobile: "" },
                          { id: 121, name: "Maria Taylor", username: "pat121", mobile: "7488548942" },
                          { id: 363, name: "Mahima Shinde", username: "pat363", mobile: "94894161854" },
                          { id: 484, name: "Dhawan Kulkarni", username: "pat484", mobile: "8908067876" },
                          { id: 489, name: "Gaurav Patel", username: "pat489", mobile: "769787087989" },
                          { id: 493, name: "Ankit Singh", username: "pat493", mobile: "898797856" },
                          { id: 509, name: "Daniel Wood", username: "pat509", mobile: "78909806787" },
                          { id: 520, name: "Shakib Khanna", username: "pat520", mobile: "789090890" },
                          { id: 531, name: "Olivier Thomas", username: "pat531", mobile: "962547581" },
                          { id: 539, name: "David Hussan", username: "pat539", mobile: "89080867876" },
                          { id: 542, name: "Olivier Thomas", username: "pat542", mobile: "9254582321" },
                          { id: 561, name: "Olivier Thomas", username: "pat561", mobile: "9214711125" },
                          { id: 563, name: "Nivetha Thomas", username: "pat563", mobile: "08907867876" },
                          { id: 578, name: "Ashutosh pandey", username: "pat578", mobile: "897646216" },
                          { id: 580, name: "Stuart Wood", username: "pat580", mobile: "87969078" }
                        ].map((patient, index) => (
                          <Tr key={patient.id}>
                            <Td py={3} px={4}>
                              <Text fontSize="sm">{patient.id}</Text>
                            </Td>
                            <Td py={3} px={4}>
                              <Text fontSize="sm" color="blue.600" cursor="pointer" _hover={{ textDecoration: "underline" }}>
                                {patient.name}
                              </Text>
                            </Td>
                            <Td py={3} px={4}>
                              <Text fontSize="sm">{patient.username}</Text>
                            </Td>
                            <Td py={3} px={4}>
                              <Text fontSize="sm">{patient.mobile}</Text>
                            </Td>
                            <Td py={3} px={4}>
                              <Switch size="sm" colorScheme="green" defaultChecked />
                            </Td>
                          </Tr>
                        ))
                      ) : (
                        /* Staff Data */
                        [
                          { id: 9002, name: "Sonia", email: "sonia@gmail.com", role: "Doctor", designation: "Doctor", department: "OT", phone: "96464644341", active: true },
                          { id: 9008, name: "Sansa", email: "sansa@gmail.com", role: "Doctor", designation: "Doctor", department: "Gynecology", phone: "965456454", active: true },
                          { id: 9005, name: "Belina", email: "belinat@gmail.com", role: "Pathologist", designation: "Pathologist", department: "Pathology", phone: "6465465465", active: true },
                          { id: 9006, name: "John", email: "johnhook@gmail.com", role: "Radiologist", designation: "Radiologist", department: "Radiology", phone: "9464644564", active: true },
                          { id: 9007, name: "Alice", email: "alicew@gmail.com", role: "Receptionist", designation: "Receptionist", department: "Reception", phone: "956465456", active: false },
                          { id: 9004, name: "Harry", email: "harrygrant@gmail.com", role: "Pharmacist", designation: "Pharmacist", department: "Pharmacy Department", phone: "955464465465", active: false },
                          { id: 9003, name: "Brad", email: "bradf@gmail.com", role: "Accountant", designation: "Accountant", department: "Finance", phone: "5454464644", active: true },
                          { id: 9010, name: "Natasha", email: "natasha@gmail.com", role: "Nurse", designation: "Nurse", department: "Nursing Department", phone: "676745667", active: true },
                          { id: 9009, name: "Amit", email: "amitsingh@gmail.com", role: "Doctor", designation: "Doctor", department: "Doctor Department", phone: "904892392", active: true },
                          { id: 9011, name: "Reyan", email: "reyan@gmail.com", role: "Doctor", designation: "Doctor", department: "Doctor Department", phone: "852963741", active: true },
                          { id: 9012, name: "Harry", email: "harry@gmail.com", role: "Pharmacist", designation: "Pharmacist", department: "Pharmacy Department", phone: "8529637410", active: true },
                          { id: 9017, name: "Jason", email: "jason@gmail.com", role: "Admin", designation: "Admin", department: "Admin", phone: "4785963210", active: true },
                          { id: 9018, name: "Maria", email: "maria@gmail.com", role: "Receptionist", designation: "Receptionist", department: "Reception", phone: "8529637410", active: true },
                          { id: 9020, name: "April", email: "april@gmail.com", role: "Nurse", designation: "Nurse", department: "Nursing Department", phone: "7418529630", active: true }
                        ].map((staff, index) => (
                          <Tr key={staff.id}>
                            <Td py={3} px={4}>
                              <Text fontSize="sm">{staff.id}</Text>
                            </Td>
                            <Td py={3} px={4}>
                              <Text fontSize="sm" color="blue.600" cursor="pointer" _hover={{ textDecoration: "underline" }}>
                                {staff.name}
                              </Text>
                            </Td>
                            <Td py={3} px={4}>
                              <Text fontSize="sm">{staff.email}</Text>
                            </Td>
                            <Td py={3} px={4}>
                              <Text fontSize="sm">{staff.role}</Text>
                            </Td>
                            <Td py={3} px={4}>
                              <Text fontSize="sm">{staff.designation}</Text>
                            </Td>
                            <Td py={3} px={4}>
                              <Text fontSize="sm">{staff.department}</Text>
                            </Td>
                            <Td py={3} px={4}>
                              <Text fontSize="sm">{staff.phone}</Text>
                            </Td>
                            <Td py={3} px={4}>
                              <Switch size="sm" colorScheme={staff.active ? "green" : "gray"} defaultChecked={staff.active} />
                            </Td>
                          </Tr>
                        ))
                      )}
                    </Tbody>
                  </Table>
                </TableContainer>
              </CardBody>
            </Card>

            {/* Pagination */}
            <Flex justify="space-between" align="center" mt={4}>
              <Text fontSize="sm" color="gray.600">
                {activeUserTab === 'patient' 
                  ? "Showing 1 to 17 of 17 entries" 
                  : "Records: 1 to 14 of 14"
                }
              </Text>
              <HStack spacing={2}>
                <Button size="sm" variant="outline" isDisabled>
                  {activeUserTab === 'patient' ? "Previous" : "‹"}
                </Button>
                <Button size="sm" colorScheme="blue">
                  1
                </Button>
                <Button size="sm" variant="outline" isDisabled>
                  {activeUserTab === 'patient' ? "Next" : "›"}
                </Button>
              </HStack>
            </Flex>
          </VStack>
        );

      case 'charges':
        return (
          <VStack spacing={6} align="stretch">
            <Flex justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="semibold">Hospital Charges</Text>
              <Button leftIcon={<Plus />} colorScheme="green" onClick={() => setIsChargeModalOpen(true)}>
                Add New Charge
              </Button>
            </Flex>

            {/* Charges Table */}
            <Card border="1px" borderColor={borderColor} bg={cardBg}>
              <CardBody p={0}>
                <TableContainer>
                  <Table variant="simple" size="sm">
                    <Thead bg="gray.50">
                      <Tr>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold">#</Th>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold">Charge Name</Th>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold">Charge Type</Th>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold">Charge Category</Th>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold">Tax Category</Th>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold">Amount</Th>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold">Action</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {[
                        { id: 1, name: "Consultation Fee", type: "General", category: "Doctor Fees", tax: "GST 18%", amount: "₹500" },
                        { id: 2, name: "X-Ray Chest", type: "Diagnostic", category: "Radiology", tax: "GST 5%", amount: "₹300" },
                        { id: 3, name: "Blood Test CBC", type: "Pathology", category: "Laboratory", tax: "GST 5%", amount: "₹250" },
                        { id: 4, name: "Room Charges", type: "Accommodation", category: "Room Rent", tax: "GST 12%", amount: "₹1200" },
                        { id: 5, name: "Medicine Fee", type: "Pharmacy", category: "Medicines", tax: "GST 12%", amount: "₹150" },
                        { id: 6, name: "Physiotherapy", type: "Treatment", category: "Therapy", tax: "GST 18%", amount: "₹800" },
                        { id: 7, name: "Emergency Charges", type: "Emergency", category: "Emergency", tax: "GST 18%", amount: "₹2000" }
                      ].map((charge, index) => (
                        <Tr key={charge.id}>
                          <Td py={3} px={4}>
                            <Text fontSize="sm">{charge.id}</Text>
                          </Td>
                          <Td py={3} px={4}>
                            <Text fontSize="sm" fontWeight="medium">{charge.name}</Text>
                          </Td>
                          <Td py={3} px={4}>
                            <Badge colorScheme="blue" size="sm">{charge.type}</Badge>
                          </Td>
                          <Td py={3} px={4}>
                            <Text fontSize="sm">{charge.category}</Text>
                          </Td>
                          <Td py={3} px={4}>
                            <Badge colorScheme="orange" size="sm">{charge.tax}</Badge>
                          </Td>
                          <Td py={3} px={4}>
                            <Text fontSize="sm" fontWeight="semibold" color="green.600">{charge.amount}</Text>
                          </Td>
                          <Td py={3} px={4}>
                            <HStack spacing={2}>
                              <IconButton
                                size="xs"
                                icon={<Eye />}
                                colorScheme="blue"
                                variant="ghost"
                                aria-label="Show"
                                title="Show"
                              />
                              <IconButton
                                size="xs"
                                icon={<Edit3 />}
                                colorScheme="green"
                                variant="ghost"
                                aria-label="Edit"
                                title="Edit"
                              />
                              <IconButton
                                size="xs"
                                icon={<Trash2 />}
                                colorScheme="red"
                                variant="ghost"
                                aria-label="Delete"
                                title="Delete"
                              />
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </CardBody>
            </Card>

            {/* Add Charge Modal */}
            <Modal isOpen={isChargeModalOpen} onClose={() => setIsChargeModalOpen(false)} size="lg">
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Add New Charge</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack spacing={4} align="stretch">
                    <FormControl isRequired>
                      <FormLabel>Charge Name</FormLabel>
                      <Input placeholder="Enter charge name" />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Charge Type</FormLabel>
                      <Select placeholder="Select charge type">
                        <option value="general">General</option>
                        <option value="diagnostic">Diagnostic</option>
                        <option value="pathology">Pathology</option>
                        <option value="accommodation">Accommodation</option>
                        <option value="pharmacy">Pharmacy</option>
                        <option value="treatment">Treatment</option>
                        <option value="emergency">Emergency</option>
                        <option value="surgery">Surgery</option>
                        <option value="ot">Operation Theater</option>
                      </Select>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Charge Category</FormLabel>
                      <Select placeholder="Select charge category">
                        <option value="doctor-fees">Doctor Fees</option>
                        <option value="radiology">Radiology</option>
                        <option value="laboratory">Laboratory</option>
                        <option value="room-rent">Room Rent</option>
                        <option value="medicines">Medicines</option>
                        <option value="therapy">Therapy</option>
                        <option value="emergency">Emergency</option>
                        <option value="surgery">Surgery</option>
                        <option value="nursing">Nursing</option>
                        <option value="ambulance">Ambulance</option>
                      </Select>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Tax Category</FormLabel>
                      <Select placeholder="Select tax category">
                        <option value="gst-0">GST 0%</option>
                        <option value="gst-5">GST 5%</option>
                        <option value="gst-12">GST 12%</option>
                        <option value="gst-18">GST 18%</option>
                        <option value="gst-28">GST 28%</option>
                        <option value="no-tax">No Tax</option>
                      </Select>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Amount (₹)</FormLabel>
                      <Input 
                        type="number" 
                        placeholder="Enter amount" 
                        min="0"
                        step="0.01"
                      />
                    </FormControl>
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <HStack spacing={3}>
                    <Button variant="outline" onClick={() => setIsChargeModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button colorScheme="green" leftIcon={<Save />} onClick={() => setIsChargeModalOpen(false)}>
                      Save Charge
                    </Button>
                  </HStack>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </VStack>
        );

      case 'charge-category':
        return (
          <VStack spacing={6} align="stretch">
            <Flex justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="semibold">Charge Category List</Text>
              <Button leftIcon={<Plus />} colorScheme="blue" onClick={() => setIsChargeCategoryModalOpen(true)}>
                Add Charge Category
              </Button>
            </Flex>

            {/* Search and Controls */}
            <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
              <Input
                placeholder="Search..."
                size="sm"
                maxW="300px"
                bg="white"
              />
              <HStack spacing={2}>
                <Select size="sm" maxW="100px" defaultValue="100">
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </Select>
                <IconButton
                  icon={<Download />}
                  size="sm"
                  variant="ghost"
                  aria-label="Export CSV"
                  title="Export CSV"
                />
                <IconButton
                  icon={<FileText />}
                  size="sm"
                  variant="ghost"
                  aria-label="Export Excel"
                  title="Export Excel"
                />
                <IconButton
                  icon={<FileText />}
                  size="sm"
                  variant="ghost"
                  aria-label="Export PDF"
                  title="Export PDF"
                />
                <IconButton
                  icon={<Printer />}
                  size="sm"
                  variant="ghost"
                  aria-label="Print"
                  title="Print"
                />
              </HStack>
            </Flex>

            {/* Charge Category Table */}
            <Card border="1px" borderColor={borderColor} bg={cardBg}>
              <CardBody p={0}>
                <TableContainer>
                  <Table variant="simple" size="sm">
                    <Thead bg="gray.50">
                      <Tr>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold">
                          Name
                          <IconButton
                            icon={<ArrowUpDown />}
                            size="xs"
                            variant="ghost"
                            ml={1}
                            aria-label="Sort"
                          />
                        </Th>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold">Charge Type</Th>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold">
                          Description
                          <IconButton
                            icon={<ArrowUpDown />}
                            size="xs"
                            variant="ghost"
                            ml={1}
                            aria-label="Sort"
                          />
                        </Th>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold">Action</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {[
                        { 
                          name: "Other Charges", 
                          type: "Others", 
                          description: "Others" 
                        },
                        { 
                          name: "Operation Services", 
                          type: "Operations", 
                          description: "Health care operations include the administrative, financial and legal activities of a hospital, specialty practice, ancillary care provider or remote health service center. Health care professionals need to get a handle on operations because, at minimum, they enable running the business" 
                        },
                        { 
                          name: "Fire extinguisher", 
                          type: "Supplier", 
                          description: "The size of a fire extinguisher indicates the amount of extinguishing agent it holds and is most often measured in pounds. Sizes can range from as small as 2.5 lb. to as large as 350 lb." 
                        },
                        { 
                          name: "Appointment Charges", 
                          type: "Appointment", 
                          description: "Define appointment fee, means a non-refundable sum of money payable to body corporate practicing as a Town Planner immediately on his official engagement" 
                        },
                        { 
                          name: "Oxygen cylinder", 
                          type: "Supplier", 
                          description: "Best Overall - OXYF5 Portable Pure Oxygen 3+1 Cans with built-in mask for Ambitious People. It has a capacity of almost 600 breaths and is claimed by the company to be India's first refillable can. It is a perfect product for those who are ambitious and want the most out of life." 
                        },
                        { 
                          name: "X-ray", 
                          type: "Investigations", 
                          description: "An X-ray is a quick, painless test that produces images of the structures inside your body — particularly your bones. X-ray beams pass through your body, and they are absorbed in different amounts depending on the density of the material they pass through." 
                        },
                        { 
                          name: "Sterilization and Cleaning Equipment", 
                          type: "Procedures", 
                          description: "Sterilization ." 
                        },
                        { 
                          name: "Blood sugar test", 
                          type: "Blood Bank", 
                          description: "A blood glucose test is a blood test that screens for diabetes by measuring the level of glucose (sugar) in a person's blood. Normal blood glucose level (while fasting) range within 70 to 99 mg/dL (3.9 to 5.5 mmol/L). Higher ranges could indicate pre-diabetes or diabetes." 
                        }
                      ].map((category, index) => (
                        <Tr key={index}>
                          <Td py={3} px={4}>
                            <Text fontSize="sm" color="blue.600" cursor="pointer" _hover={{ textDecoration: "underline" }}>
                              {category.name}
                            </Text>
                          </Td>
                          <Td py={3} px={4}>
                            <Badge colorScheme="purple" size="sm">{category.type}</Badge>
                          </Td>
                          <Td py={3} px={4} maxW="400px">
                            <Text fontSize="sm" noOfLines={3} title={category.description}>
                              {category.description}
                            </Text>
                          </Td>
                          <Td py={3} px={4}>
                            <HStack spacing={2}>
                              <IconButton
                                size="xs"
                                icon={<Eye />}
                                colorScheme="blue"
                                variant="ghost"
                                aria-label="Show"
                                title="Show"
                              />
                              <IconButton
                                size="xs"
                                icon={<Edit3 />}
                                colorScheme="green"
                                variant="ghost"
                                aria-label="Edit"
                                title="Edit"
                              />
                              <IconButton
                                size="xs"
                                icon={<Trash2 />}
                                colorScheme="red"
                                variant="ghost"
                                aria-label="Delete"
                                title="Delete"
                              />
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </CardBody>
            </Card>

            {/* Add Charge Category Modal */}
            <Modal isOpen={isChargeCategoryModalOpen} onClose={() => setIsChargeCategoryModalOpen(false)} size="lg">
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Add Charge Category</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack spacing={4} align="stretch">
                    <FormControl isRequired>
                      <FormLabel>Name</FormLabel>
                      <Input placeholder="Enter category name" />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Charge Type</FormLabel>
                      <Select placeholder="Select charge type">
                        <option value="others">Others</option>
                        <option value="operations">Operations</option>
                        <option value="supplier">Supplier</option>
                        <option value="appointment">Appointment</option>
                        <option value="investigations">Investigations</option>
                        <option value="procedures">Procedures</option>
                        <option value="blood-bank">Blood Bank</option>
                        <option value="radiology">Radiology</option>
                        <option value="pathology">Pathology</option>
                        <option value="pharmacy">Pharmacy</option>
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Description</FormLabel>
                      <Textarea 
                        placeholder="Enter description" 
                        rows={4}
                        resize="vertical"
                      />
                    </FormControl>
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <HStack spacing={3}>
                    <Button variant="outline" onClick={() => setIsChargeCategoryModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button colorScheme="blue" leftIcon={<Save />} onClick={() => setIsChargeCategoryModalOpen(false)}>
                      Save Category
                    </Button>
                  </HStack>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </VStack>
        );

      case 'charge-type':
        return (
          <VStack spacing={6} align="stretch">
            <Flex justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="semibold">Charge Type List</Text>
              <Button leftIcon={<Plus />} colorScheme="blue" onClick={() => setIsChargeTypeModalOpen(true)}>
                Add Charge Type
              </Button>
            </Flex>

            {/* Search and Controls */}
            <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
              <Input
                placeholder="Search..."
                size="sm"
                maxW="300px"
                bg="white"
                value={chargeTypeSearch}
                onChange={(e) => setChargeTypeSearch(e.target.value)}
              />
              <HStack spacing={2}>
                <Select size="sm" maxW="100px" defaultValue="100">
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </Select>
                <IconButton
                  icon={<Download />}
                  size="sm"
                  variant="ghost"
                  aria-label="Export CSV"
                  title="Export CSV"
                  onClick={() => handleExportChargeTypes('csv')}
                />
                <IconButton
                  icon={<FileText />}
                  size="sm"
                  variant="ghost"
                  aria-label="Export Excel"
                  title="Export Excel"
                  onClick={() => handleExportChargeTypes('excel')}
                />
                <IconButton
                  icon={<FileText />}
                  size="sm"
                  variant="ghost"
                  aria-label="Export PDF"
                  title="Export PDF"
                  onClick={() => handleExportChargeTypes('pdf')}
                />
                <IconButton
                  icon={<Printer />}
                  size="sm"
                  variant="ghost"
                  aria-label="Print"
                  title="Print"
                  onClick={() => handlePrintChargeTypes()}
                />
              </HStack>
            </Flex>

            {/* Charge Type Table */}
            <Card border="1px" borderColor={borderColor} bg={cardBg}>
              <CardBody p={0}>
                <TableContainer>
                  <Table variant="simple" size="sm">
                    <Thead bg="gray.50">
                      <Tr>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold">
                          Charge Type
                          <IconButton
                            icon={<ArrowUpDown />}
                            size="xs"
                            variant="ghost"
                            ml={1}
                            aria-label="Sort"
                            onClick={() => handleSortChargeTypes('name')}
                          />
                        </Th>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold" textAlign="center">
                          Appointment
                          <IconButton
                            icon={<ArrowUpDown />}
                            size="xs"
                            variant="ghost"
                            ml={1}
                            aria-label="Sort"
                          />
                        </Th>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold" textAlign="center">OPD</Th>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold" textAlign="center">IPD</Th>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold" textAlign="center">
                          Pathology
                          <IconButton
                            icon={<ArrowUpDown />}
                            size="xs"
                            variant="ghost"
                            ml={1}
                            aria-label="Sort"
                          />
                        </Th>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold" textAlign="center">
                          Radiology
                          <IconButton
                            icon={<ArrowUpDown />}
                            size="xs"
                            variant="ghost"
                            ml={1}
                            aria-label="Sort"
                          />
                        </Th>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold" textAlign="center">Blood Bank</Th>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold" textAlign="center">Ambulance</Th>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold" textAlign="center">Action</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {chargeTypes.filter(type => 
                        type.name.toLowerCase().includes(chargeTypeSearch.toLowerCase())
                      ).map((type, index) => (
                        <Tr key={index}>
                          <Td py={3} px={4}>
                            <Text fontSize="sm" fontWeight="medium">
                              {type.name}
                            </Text>
                          </Td>
                          <Td py={3} px={4} textAlign="center">
                            <Checkbox 
                              isChecked={type.appointment}
                              colorScheme="blue"
                              onChange={(e) => handleChargeTypeToggle(index, 'appointment', e.target.checked)}
                            />
                          </Td>
                          <Td py={3} px={4} textAlign="center">
                            <Checkbox 
                              isChecked={type.opd}
                              colorScheme="blue"
                              onChange={(e) => handleChargeTypeToggle(index, 'opd', e.target.checked)}
                            />
                          </Td>
                          <Td py={3} px={4} textAlign="center">
                            <Checkbox 
                              isChecked={type.ipd}
                              colorScheme="blue"
                              onChange={(e) => handleChargeTypeToggle(index, 'ipd', e.target.checked)}
                            />
                          </Td>
                          <Td py={3} px={4} textAlign="center">
                            <Checkbox 
                              isChecked={type.pathology}
                              colorScheme="blue"
                              onChange={(e) => handleChargeTypeToggle(index, 'pathology', e.target.checked)}
                            />
                          </Td>
                          <Td py={3} px={4} textAlign="center">
                            <Checkbox 
                              isChecked={type.radiology}
                              colorScheme="blue"
                              onChange={(e) => handleChargeTypeToggle(index, 'radiology', e.target.checked)}
                            />
                          </Td>
                          <Td py={3} px={4} textAlign="center">
                            <Checkbox 
                              isChecked={type.bloodBank}
                              colorScheme="blue"
                              onChange={(e) => handleChargeTypeToggle(index, 'bloodBank', e.target.checked)}
                            />
                          </Td>
                          <Td py={3} px={4} textAlign="center">
                            <Checkbox 
                              isChecked={type.ambulance}
                              colorScheme="blue"
                              onChange={(e) => handleChargeTypeToggle(index, 'ambulance', e.target.checked)}
                            />
                          </Td>
                          <Td py={3} px={4}>
                            <HStack spacing={2} justify="center">
                              <IconButton
                                size="xs"
                                icon={<Edit3 />}
                                colorScheme="green"
                                variant="ghost"
                                aria-label="Edit"
                                title="Edit"
                                onClick={() => handleEditChargeType(type, index)}
                              />
                              <IconButton
                                size="xs"
                                icon={<Trash2 />}
                                colorScheme="red"
                                variant="ghost"
                                aria-label="Delete"
                                title="Delete"
                                onClick={() => handleDeleteChargeType(index)}
                              />
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </CardBody>
            </Card>

            {/* Pagination */}
            <Flex justify="space-between" align="center">
              <Text fontSize="sm" color="gray.600">
                Records: 1 to {chargeTypes.length} of {chargeTypes.length}
              </Text>
              <HStack spacing={2}>
                <IconButton
                  size="sm"
                  icon={<ChevronLeft />}
                  variant="outline"
                  aria-label="Previous"
                  isDisabled={true}
                />
                <Button size="sm" colorScheme="blue" variant="solid">
                  1
                </Button>
                <IconButton
                  size="sm"
                  icon={<ChevronRight />}
                  variant="outline"
                  aria-label="Next"
                  isDisabled={true}
                />
              </HStack>
            </Flex>

            {/* Add/Edit Charge Type Modal */}
            <Modal isOpen={isChargeTypeModalOpen} onClose={() => setIsChargeTypeModalOpen(false)} size="lg">
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>{editingChargeTypeIndex !== null ? 'Edit Charge Type' : 'Add Charge Type'}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack spacing={4} align="stretch">
                    <FormControl isRequired>
                      <FormLabel>Charge Type Name</FormLabel>
                      <Input 
                        placeholder="Enter charge type name" 
                        value={chargeTypeForm.name}
                        onChange={(e) => setChargeTypeForm({...chargeTypeForm, name: e.target.value})}
                      />
                    </FormControl>

                    <Text fontSize="md" fontWeight="semibold" mt={4}>Available In:</Text>
                    
                    <SimpleGrid columns={2} spacing={4}>
                      <Checkbox 
                        isChecked={chargeTypeForm.appointment}
                        onChange={(e) => setChargeTypeForm({...chargeTypeForm, appointment: e.target.checked})}
                      >
                        Appointment
                      </Checkbox>
                      <Checkbox 
                        isChecked={chargeTypeForm.opd}
                        onChange={(e) => setChargeTypeForm({...chargeTypeForm, opd: e.target.checked})}
                      >
                        OPD
                      </Checkbox>
                      <Checkbox 
                        isChecked={chargeTypeForm.ipd}
                        onChange={(e) => setChargeTypeForm({...chargeTypeForm, ipd: e.target.checked})}
                      >
                        IPD
                      </Checkbox>
                      <Checkbox 
                        isChecked={chargeTypeForm.pathology}
                        onChange={(e) => setChargeTypeForm({...chargeTypeForm, pathology: e.target.checked})}
                      >
                        Pathology
                      </Checkbox>
                      <Checkbox 
                        isChecked={chargeTypeForm.radiology}
                        onChange={(e) => setChargeTypeForm({...chargeTypeForm, radiology: e.target.checked})}
                      >
                        Radiology
                      </Checkbox>
                      <Checkbox 
                        isChecked={chargeTypeForm.bloodBank}
                        onChange={(e) => setChargeTypeForm({...chargeTypeForm, bloodBank: e.target.checked})}
                      >
                        Blood Bank
                      </Checkbox>
                      <Checkbox 
                        isChecked={chargeTypeForm.ambulance}
                        onChange={(e) => setChargeTypeForm({...chargeTypeForm, ambulance: e.target.checked})}
                      >
                        Ambulance
                      </Checkbox>
                    </SimpleGrid>
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <HStack spacing={3}>
                    <Button variant="outline" onClick={() => handleCancelChargeType()}>
                      Cancel
                    </Button>
                    <Button colorScheme="blue" leftIcon={<Save />} onClick={handleSaveChargeType}>
                      {editingChargeTypeIndex !== null ? 'Update' : 'Save'} Charge Type
                    </Button>
                  </HStack>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </VStack>
        );

      case 'tax-category':
        return (
          <VStack spacing={6} align="stretch">
            <Flex justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="semibold">Tax Category List</Text>
              <Button leftIcon={<Plus />} colorScheme="blue" onClick={() => setIsTaxCategoryModalOpen(true)}>
                Add Tax Category
              </Button>
            </Flex>

            {/* Search and Controls */}
            <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
              <Input
                placeholder="Search..."
                size="sm"
                maxW="300px"
                bg="white"
                value={taxCategorySearch}
                onChange={(e) => setTaxCategorySearch(e.target.value)}
              />
              <HStack spacing={2}>
                <Select size="sm" maxW="100px" defaultValue="100">
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </Select>
                <IconButton
                  icon={<Download />}
                  size="sm"
                  variant="ghost"
                  aria-label="Export CSV"
                  title="Export CSV"
                  onClick={() => handleExportTaxCategories('csv')}
                />
                <IconButton
                  icon={<FileText />}
                  size="sm"
                  variant="ghost"
                  aria-label="Export Excel"
                  title="Export Excel"
                  onClick={() => handleExportTaxCategories('excel')}
                />
                <IconButton
                  icon={<FileText />}
                  size="sm"
                  variant="ghost"
                  aria-label="Export PDF"
                  title="Export PDF"
                  onClick={() => handleExportTaxCategories('pdf')}
                />
                <IconButton
                  icon={<Printer />}
                  size="sm"
                  variant="ghost"
                  aria-label="Print"
                  title="Print"
                  onClick={() => handlePrintTaxCategories()}
                />
              </HStack>
            </Flex>

            {/* Tax Category Table */}
            <Card border="1px" borderColor={borderColor} bg={cardBg}>
              <CardBody p={0}>
                <TableContainer>
                  <Table variant="simple" size="sm">
                    <Thead bg="gray.50">
                      <Tr>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold">
                          Name
                          <IconButton
                            icon={<ArrowUpDown />}
                            size="xs"
                            variant="ghost"
                            ml={1}
                            aria-label="Sort"
                            onClick={() => handleSortTaxCategories('name')}
                          />
                        </Th>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold" textAlign="right">
                          Percentage(%)
                          <IconButton
                            icon={<ArrowUpDown />}
                            size="xs"
                            variant="ghost"
                            ml={1}
                            aria-label="Sort"
                            onClick={() => handleSortTaxCategories('percentage')}
                          />
                        </Th>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold" textAlign="center">Action</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {taxCategories.filter(category => 
                        category.name.toLowerCase().includes(taxCategorySearch.toLowerCase())
                      ).map((category, index) => (
                        <Tr key={index} _hover={{ bg: hoverBg }}>
                          <Td py={3} px={4}>
                            <Text fontSize="sm" color="blue.600" cursor="pointer" _hover={{ textDecoration: "underline" }}>
                              {category.name}
                            </Text>
                          </Td>
                          <Td py={3} px={4} textAlign="right">
                            <Text fontSize="sm" fontWeight="medium">
                              {category.percentage.toFixed(2)}
                            </Text>
                          </Td>
                          <Td py={3} px={4}>
                            <HStack spacing={2} justify="center">
                              <IconButton
                                size="xs"
                                icon={<Edit3 />}
                                colorScheme="green"
                                variant="ghost"
                                aria-label="Edit"
                                title="Edit"
                                onClick={() => handleEditTaxCategory(category, index)}
                              />
                              <IconButton
                                size="xs"
                                icon={<Trash2 />}
                                colorScheme="red"
                                variant="ghost"
                                aria-label="Delete"
                                title="Delete"
                                onClick={() => handleDeleteTaxCategory(index)}
                              />
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </CardBody>
            </Card>

            {/* Pagination */}
            <Flex justify="space-between" align="center">
              <Text fontSize="sm" color="gray.600">
                Records: 1 to {taxCategories.length} of {taxCategories.length}
              </Text>
              <HStack spacing={2}>
                <IconButton
                  size="sm"
                  icon={<ChevronLeft />}
                  variant="outline"
                  aria-label="Previous"
                  isDisabled={true}
                />
                <Button size="sm" colorScheme="blue" variant="solid">
                  1
                </Button>
                <IconButton
                  size="sm"
                  icon={<ChevronRight />}
                  variant="outline"
                  aria-label="Next"
                  isDisabled={true}
                />
              </HStack>
            </Flex>

            {/* Add/Edit Tax Category Modal */}
            <Modal isOpen={isTaxCategoryModalOpen} onClose={() => setIsTaxCategoryModalOpen(false)} size="lg">
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>{editingTaxCategoryIndex !== null ? 'Edit Tax Category' : 'Add Tax Category'}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack spacing={4} align="stretch">
                    <FormControl isRequired>
                      <FormLabel>Tax Category Name</FormLabel>
                      <Input 
                        placeholder="Enter tax category name" 
                        value={taxCategoryForm.name}
                        onChange={(e) => setTaxCategoryForm({...taxCategoryForm, name: e.target.value})}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Percentage (%)</FormLabel>
                      <NumberInput 
                        value={taxCategoryForm.percentage}
                        onChange={(valueString, valueNumber) => 
                          setTaxCategoryForm({...taxCategoryForm, percentage: valueNumber || 0})
                        }
                        precision={2}
                        step={0.01}
                        min={0}
                        max={100}
                      >
                        <NumberInputField placeholder="Enter percentage" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>

                    {taxCategoryForm.percentage > 0 && (
                      <Alert status="info" borderRadius="md">
                        <AlertIcon />
                        <Box>
                          <AlertTitle>Tax Preview</AlertTitle>
                          <AlertDescription>
                            On ₹1000: Tax = ₹{(1000 * taxCategoryForm.percentage / 100).toFixed(2)}, 
                            Total = ₹{(1000 + (1000 * taxCategoryForm.percentage / 100)).toFixed(2)}
                          </AlertDescription>
                        </Box>
                      </Alert>
                    )}
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <HStack spacing={3}>
                    <Button variant="outline" onClick={() => handleCancelTaxCategory()}>
                      Cancel
                    </Button>
                    <Button colorScheme="blue" leftIcon={<Save />} onClick={handleSaveTaxCategory}>
                      {editingTaxCategoryIndex !== null ? 'Update' : 'Save'} Tax Category
                    </Button>
                  </HStack>
                </ModalFooter>
              </ModalContent>
            </Modal>
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
              <HStack spacing={4}>
                <Text fontSize="lg" fontWeight="semibold">Ayurvedic Medicine Categories</Text>
                <Badge colorScheme="green" variant="subtle">
                  {filteredMedicineCategories.length} Categories
                </Badge>
              </HStack>
              <HStack spacing={2}>
                <InputGroup maxW="300px">
                  <InputLeftElement pointerEvents="none">
                    <Search color="gray.400" size={16} />
                  </InputLeftElement>
                  <Input
                    placeholder="Search categories..."
                    value={medicineCategorySearch}
                    onChange={(e) => setMedicineCategorySearch(e.target.value)}
                  />
                </InputGroup>
                <Button leftIcon={<Plus />} colorScheme="teal" onClick={handleMedicineCategoryAdd}>
                  Add Category
                </Button>
              </HStack>
            </Flex>

            {/* Categories Table */}
            <Card border="1px" borderColor={borderColor}>
              <CardBody p={0}>
                <Table variant="simple">
                  <Thead bg="gray.50">
                    <Tr>
                      <Th>Category Name</Th>
                      <Th>Sanskrit Name</Th>
                      <Th>Dosha Effect</Th>
                      <Th>Properties</Th>
                      <Th>Status</Th>
                      <Th width="120px">Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredMedicineCategories.map((category, index) => (
                      <Tr key={category.id}>
                        <Td>
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="medium">{category.name}</Text>
                            <Text fontSize="sm" color="gray.600" noOfLines={1}>
                              {category.description}
                            </Text>
                          </VStack>
                        </Td>
                        <Td>
                          <Text fontFamily="devanagari" fontSize="lg" color="orange.600">
                            {category.sanskrit}
                          </Text>
                        </Td>
                        <Td>
                          <Text fontSize="sm" noOfLines={2}>{category.doshaEffect}</Text>
                        </Td>
                        <Td>
                          <Text fontSize="sm" noOfLines={2}>{category.properties}</Text>
                        </Td>
                        <Td>
                          <Badge 
                            colorScheme={category.status === 'Active' ? 'green' : 'red'}
                            variant="subtle"
                          >
                            {category.status}
                          </Badge>
                        </Td>
                        <Td>
                          <HStack spacing={1}>
                            <IconButton
                              size="sm"
                              icon={<Eye />}
                              variant="ghost"
                              colorScheme="blue"
                              aria-label="View"
                              onClick={() => handleMedicineCategoryView(index)}
                            />
                            <IconButton
                              size="sm"
                              icon={<Edit />}
                              variant="ghost"
                              colorScheme="green"
                              aria-label="Edit"
                              onClick={() => handleMedicineCategoryEdit(index)}
                            />
                            <IconButton
                              size="sm"
                              icon={<Trash2 />}
                              variant="ghost"
                              colorScheme="red"
                              aria-label="Delete"
                              onClick={() => handleMedicineCategoryDelete(index)}
                            />
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </CardBody>
            </Card>

            {/* Medicine Category Modal */}
            <Modal 
              isOpen={medicineCategoryModal.isOpen} 
              onClose={() => setMedicineCategoryModal(prev => ({ ...prev, isOpen: false }))}
              size="xl"
            >
              <ModalOverlay />
              <ModalContent maxW="800px">
                <ModalHeader>
                  {medicineCategoryModal.mode === 'add' ? 'Add Medicine Category' : 
                   medicineCategoryModal.mode === 'edit' ? 'Edit Medicine Category' : 'View Medicine Category'}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <FormControl>
                      <FormLabel>Category Name (English)</FormLabel>
                      <Input
                        value={medicineCategoryModal.formData.name}
                        onChange={(e) => handleMedicineCategoryInputChange('name', e.target.value)}
                        placeholder="e.g., Rasayana (Rejuvenatives)"
                        isReadOnly={medicineCategoryModal.mode === 'view'}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Sanskrit Name</FormLabel>
                      <Input
                        value={medicineCategoryModal.formData.sanskrit}
                        onChange={(e) => handleMedicineCategoryInputChange('sanskrit', e.target.value)}
                        placeholder="e.g., रसायन"
                        fontFamily="devanagari"
                        fontSize="lg"
                        isReadOnly={medicineCategoryModal.mode === 'view'}
                      />
                    </FormControl>
                    <FormControl gridColumn="span 2">
                      <FormLabel>Description</FormLabel>
                      <Textarea
                        value={medicineCategoryModal.formData.description}
                        onChange={(e) => handleMedicineCategoryInputChange('description', e.target.value)}
                        placeholder="Brief description of the medicine category..."
                        rows={3}
                        isReadOnly={medicineCategoryModal.mode === 'view'}
                      />
                    </FormControl>
                    <FormControl gridColumn="span 2">
                      <FormLabel>Properties</FormLabel>
                      <Textarea
                        value={medicineCategoryModal.formData.properties}
                        onChange={(e) => handleMedicineCategoryInputChange('properties', e.target.value)}
                        placeholder="e.g., Rejuvenative, Anti-aging, Immunity enhancing"
                        rows={2}
                        isReadOnly={medicineCategoryModal.mode === 'view'}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Dosha Effect</FormLabel>
                      <Select
                        value={medicineCategoryModal.formData.doshaEffect}
                        onChange={(e) => handleMedicineCategoryInputChange('doshaEffect', e.target.value)}
                        isDisabled={medicineCategoryModal.mode === 'view'}
                      >
                        <option value="">Select Dosha Effect</option>
                        <option value="Balances all three doshas">Balances all three doshas</option>
                        <option value="Primarily Vata pacifying">Primarily Vata pacifying</option>
                        <option value="Primarily Pitta pacifying">Primarily Pitta pacifying</option>
                        <option value="Primarily Kapha pacifying">Primarily Kapha pacifying</option>
                        <option value="Primarily Vata-Pitta balancing">Primarily Vata-Pitta balancing</option>
                        <option value="Primarily Pitta-Kapha balancing">Primarily Pitta-Kapha balancing</option>
                        <option value="Primarily Kapha-Vata balancing">Primarily Kapha-Vata balancing</option>
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel>Status</FormLabel>
                      <Select
                        value={medicineCategoryModal.formData.status}
                        onChange={(e) => handleMedicineCategoryInputChange('status', e.target.value)}
                        isDisabled={medicineCategoryModal.mode === 'view'}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </Select>
                    </FormControl>
                    <FormControl gridColumn="span 2">
                      <FormLabel>Examples</FormLabel>
                      <Textarea
                        value={medicineCategoryModal.formData.examples}
                        onChange={(e) => handleMedicineCategoryInputChange('examples', e.target.value)}
                        placeholder="e.g., Chyawanprash, Brahmi Rasayana, Amla Churna"
                        rows={2}
                        isReadOnly={medicineCategoryModal.mode === 'view'}
                      />
                    </FormControl>
                  </SimpleGrid>
                </ModalBody>
                <ModalFooter>
                  <Button 
                    variant="ghost" 
                    mr={3} 
                    onClick={() => setMedicineCategoryModal(prev => ({ ...prev, isOpen: false }))}
                  >
                    {medicineCategoryModal.mode === 'view' ? 'Close' : 'Cancel'}
                  </Button>
                  {medicineCategoryModal.mode !== 'view' && (
                    <Button colorScheme="teal" onClick={handleMedicineCategorySave}>
                      {medicineCategoryModal.mode === 'add' ? 'Add Category' : 'Update Category'}
                    </Button>
                  )}
                </ModalFooter>
              </ModalContent>
            </Modal>
          </VStack>
        );

      case 'supplier':
        return (
          <VStack spacing={6} align="stretch">
            <Flex justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="semibold">Medicine Suppliers</Text>
              <Button leftIcon={<Plus />} colorScheme="teal">
                Add Supplier
              </Button>
            </Flex>
            <Card>
              <CardBody>
                <Text color="gray.600" textAlign="center" py={8}>
                  Supplier management functionality coming soon...
                </Text>
              </CardBody>
            </Card>
          </VStack>
        );

      case 'medicine-dosage':
        return (
          <VStack spacing={6} align="stretch">
            <Flex justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="semibold">Medicine Dosage</Text>
              <Button leftIcon={<Plus />} colorScheme="teal">
                Add Dosage
              </Button>
            </Flex>
            <Card>
              <CardBody>
                <Text color="gray.600" textAlign="center" py={8}>
                  Medicine dosage management functionality coming soon...
                </Text>
              </CardBody>
            </Card>
          </VStack>
        );

      case 'dose-interval':
        return (
          <VStack spacing={6} align="stretch">
            <Flex justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="semibold">Dose Interval</Text>
              <Button leftIcon={<Plus />} colorScheme="teal">
                Add Interval
              </Button>
            </Flex>
            <Card>
              <CardBody>
                <Text color="gray.600" textAlign="center" py={8}>
                  Dose interval management functionality coming soon...
                </Text>
              </CardBody>
            </Card>
          </VStack>
        );

      case 'dose-duration':
        return (
          <VStack spacing={6} align="stretch">
            <Flex justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="semibold">Dose Duration</Text>
              <Button leftIcon={<Plus />} colorScheme="teal">
                Add Duration
              </Button>
            </Flex>
            <Card>
              <CardBody>
                <Text color="gray.600" textAlign="center" py={8}>
                  Dose duration management functionality coming soon...
                </Text>
              </CardBody>
            </Card>
          </VStack>
        );

      case 'unit':
        return (
          <VStack spacing={6} align="stretch">
            <Flex justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="semibold">Measurement Units</Text>
              <Button leftIcon={<Plus />} colorScheme="teal">
                Add Unit
              </Button>
            </Flex>
            <Card>
              <CardBody>
                <Text color="gray.600" textAlign="center" py={8}>
                  Measurement units management functionality coming soon...
                </Text>
              </CardBody>
            </Card>
          </VStack>
        );

      case 'company':
        return (
          <VStack spacing={6} align="stretch">
            <Flex justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="semibold">Pharmaceutical Companies</Text>
              <Button leftIcon={<Plus />} colorScheme="teal">
                Add Company
              </Button>
            </Flex>
            <Card>
              <CardBody>
                <Text color="gray.600" textAlign="center" py={8}>
                  Pharmaceutical companies management functionality coming soon...
                </Text>
              </CardBody>
            </Card>
          </VStack>
        );

      case 'medicine-group':
        return (
          <VStack spacing={6} align="stretch">
            <Flex justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="semibold">Medicine Groups</Text>
              <Button leftIcon={<Plus />} colorScheme="teal">
                Add Group
              </Button>
            </Flex>
            <Card>
              <CardBody>
                <Text color="gray.600" textAlign="center" py={8}>
                  Medicine groups management functionality coming soon...
                </Text>
              </CardBody>
            </Card>
          </VStack>
        );

      case 'bed':
        return (
          <VStack spacing={6} align="stretch">
            <Flex justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="semibold">Bed List</Text>
              <Button leftIcon={<Plus />} colorScheme="blue" onClick={() => setIsBedModalOpen(true)}>
                Add Bed
              </Button>
            </Flex>

            {/* Search and Controls */}
            <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
              <Input
                placeholder="Search..."
                size="sm"
                maxW="300px"
                bg="white"
                value={bedSearch}
                onChange={(e) => setBedSearch(e.target.value)}
              />
              <HStack spacing={2}>
                <Select size="sm" maxW="100px" defaultValue="100">
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </Select>
                <IconButton
                  icon={<Download />}
                  size="sm"
                  variant="ghost"
                  aria-label="Export CSV"
                  title="Export CSV"
                  onClick={() => handleExportBeds('csv')}
                />
                <IconButton
                  icon={<FileText />}
                  size="sm"
                  variant="ghost"
                  aria-label="Export Excel"
                  title="Export Excel"
                  onClick={() => handleExportBeds('excel')}
                />
                <IconButton
                  icon={<FileText />}
                  size="sm"
                  variant="ghost"
                  aria-label="Export PDF"
                  title="Export PDF"
                  onClick={() => handleExportBeds('pdf')}
                />
                <IconButton
                  icon={<Printer />}
                  size="sm"
                  variant="ghost"
                  aria-label="Print"
                  title="Print"
                  onClick={() => handlePrintBeds()}
                />
              </HStack>
            </Flex>

            {/* Bed Table */}
            <Card border="1px" borderColor={borderColor} bg={cardBg}>
              <CardBody p={0}>
                <TableContainer>
                  <Table variant="simple" size="sm">
                    <Thead bg="gray.50">
                      <Tr>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold">
                          Name
                          <IconButton
                            icon={<ArrowUpDown />}
                            size="xs"
                            variant="ghost"
                            ml={1}
                            aria-label="Sort"
                            onClick={() => handleSortBeds('name')}
                          />
                        </Th>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold">
                          Bed Type
                          <IconButton
                            icon={<ArrowUpDown />}
                            size="xs"
                            variant="ghost"
                            ml={1}
                            aria-label="Sort"
                            onClick={() => handleSortBeds('bedType')}
                          />
                        </Th>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold">
                          Bed Group
                          <IconButton
                            icon={<ArrowUpDown />}
                            size="xs"
                            variant="ghost"
                            ml={1}
                            aria-label="Sort"
                            onClick={() => handleSortBeds('bedGroup')}
                          />
                        </Th>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold" textAlign="center">
                          Used
                          <IconButton
                            icon={<ArrowUpDown />}
                            size="xs"
                            variant="ghost"
                            ml={1}
                            aria-label="Sort"
                            onClick={() => handleSortBeds('used')}
                          />
                        </Th>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold" textAlign="center">
                          Action
                          <IconButton
                            icon={<ArrowUpDown />}
                            size="xs"
                            variant="ghost"
                            ml={1}
                            aria-label="Sort"
                          />
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {beds.filter(bed => 
                        bed.name.toLowerCase().includes(bedSearch.toLowerCase()) ||
                        bed.bedType.toLowerCase().includes(bedSearch.toLowerCase()) ||
                        bed.bedGroup.toLowerCase().includes(bedSearch.toLowerCase())
                      ).map((bed, index) => (
                        <Tr key={index} _hover={{ bg: hoverBg }}>
                          <Td py={3} px={4}>
                            <Text fontSize="sm" color="blue.600" cursor="pointer" _hover={{ textDecoration: "underline" }}>
                              {bed.name}
                            </Text>
                          </Td>
                          <Td py={3} px={4}>
                            <Badge 
                              colorScheme={
                                bed.bedType === 'VIP' ? 'purple' : 
                                bed.bedType === 'Standard' ? 'blue' : 'gray'
                              } 
                              size="sm"
                            >
                              {bed.bedType}
                            </Badge>
                          </Td>
                          <Td py={3} px={4}>
                            <Text fontSize="sm" color="gray.600">
                              {bed.bedGroup}
                            </Text>
                          </Td>
                          <Td py={3} px={4} textAlign="center">
                            <Checkbox 
                              isChecked={bed.used}
                              colorScheme="blue"
                              onChange={(e) => handleBedUsedToggle(index, e.target.checked)}
                            />
                          </Td>
                          <Td py={3} px={4}>
                            <HStack spacing={2} justify="center">
                              <IconButton
                                size="xs"
                                icon={<Edit3 />}
                                colorScheme="green"
                                variant="ghost"
                                aria-label="Edit"
                                title="Edit"
                                onClick={() => handleEditBed(bed, index)}
                              />
                              <IconButton
                                size="xs"
                                icon={<Trash2 />}
                                colorScheme="red"
                                variant="ghost"
                                aria-label="Delete"
                                title="Delete"
                                onClick={() => handleDeleteBed(index)}
                              />
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </CardBody>
            </Card>

            {/* Add/Edit Bed Modal */}
            <Modal isOpen={isBedModalOpen} onClose={() => setIsBedModalOpen(false)} size="lg">
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>{editingBedIndex !== null ? 'Edit Bed' : 'Add Bed'}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack spacing={4} align="stretch">
                    <FormControl isRequired>
                      <FormLabel>Bed Name</FormLabel>
                      <Input 
                        placeholder="Enter bed name (e.g., GF-101)" 
                        value={bedForm.name}
                        onChange={(e) => setBedForm({...bedForm, name: e.target.value})}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Bed Type</FormLabel>
                      <Select 
                        placeholder="Select bed type"
                        value={bedForm.bedType}
                        onChange={(e) => setBedForm({...bedForm, bedType: e.target.value})}
                      >
                        <option value="Standard">Standard</option>
                        <option value="VIP">VIP</option>
                        <option value="Normal">Normal</option>
                      </Select>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Bed Group</FormLabel>
                      <Select 
                        placeholder="Select bed group"
                        value={bedForm.bedGroup}
                        onChange={(e) => setBedForm({...bedForm, bedGroup: e.target.value})}
                      >
                        <option value="VIP Ward - Ground Floor">VIP Ward - Ground Floor</option>
                        <option value="Private Ward - 3rd Floor">Private Ward - 3rd Floor</option>
                        <option value="ICU - 2nd Floor">ICU - 2nd Floor</option>
                        <option value="General Ward Male - 3rd Floor">General Ward Male - 3rd Floor</option>
                        <option value="AC (Normal) - 1st Floor">AC (Normal) - 1st Floor</option>
                        <option value="NICU - 2nd Floor">NICU - 2nd Floor</option>
                        <option value="Non AC - 4th Floor">Non AC - 4th Floor</option>
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Used Status</FormLabel>
                      <Checkbox 
                        isChecked={bedForm.used}
                        onChange={(e) => setBedForm({...bedForm, used: e.target.checked})}
                      >
                        Mark as Used
                      </Checkbox>
                    </FormControl>

                    <Alert status="info" borderRadius="md">
                      <AlertIcon />
                      <Box>
                        <AlertTitle>Bed Information</AlertTitle>
                        <AlertDescription>
                          {bedForm.used ? 
                            "This bed will be marked as occupied and unavailable for new patients." :
                            "This bed will be available for patient assignment."
                          }
                        </AlertDescription>
                      </Box>
                    </Alert>
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <HStack spacing={3}>
                    <Button variant="outline" onClick={() => handleCancelBed()}>
                      Cancel
                    </Button>
                    <Button colorScheme="blue" leftIcon={<Save />} onClick={handleSaveBed}>
                      {editingBedIndex !== null ? 'Update' : 'Save'} Bed
                    </Button>
                  </HStack>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </VStack>
        );

      case 'bed-type':
        return (
          <VStack spacing={6} align="stretch">
            <Flex justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="semibold">Bed Type List</Text>
              <Button leftIcon={<Plus />} colorScheme="blue" onClick={() => setIsBedTypeModalOpen(true)}>
                Add Bed Type
              </Button>
            </Flex>

            {/* Search and Controls */}
            <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
              <Input
                placeholder="Search..."
                size="sm"
                maxW="300px"
                bg="white"
                value={bedTypeSearch}
                onChange={(e) => setBedTypeSearch(e.target.value)}
              />
              <HStack spacing={2}>
                <Select size="sm" maxW="100px" defaultValue="100">
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </Select>
                <IconButton
                  icon={<Download />}
                  size="sm"
                  variant="ghost"
                  aria-label="Export CSV"
                  title="Export CSV"
                  onClick={() => handleExportBedTypes('csv')}
                />
                <IconButton
                  icon={<FileText />}
                  size="sm"
                  variant="ghost"
                  aria-label="Export Excel"
                  title="Export Excel"
                  onClick={() => handleExportBedTypes('excel')}
                />
                <IconButton
                  icon={<FileText />}
                  size="sm"
                  variant="ghost"
                  aria-label="Export PDF"
                  title="Export PDF"
                  onClick={() => handleExportBedTypes('pdf')}
                />
                <IconButton
                  icon={<Printer />}
                  size="sm"
                  variant="ghost"
                  aria-label="Print"
                  title="Print"
                  onClick={() => handlePrintBedTypes()}
                />
              </HStack>
            </Flex>

            {/* Bed Type Table */}
            <Card border="1px" borderColor={borderColor} bg={cardBg}>
              <CardBody p={0}>
                <TableContainer>
                  <Table variant="simple" size="sm">
                    <Thead bg="gray.50">
                      <Tr>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold">
                          Bed Type
                          <IconButton
                            icon={<ArrowUpDown />}
                            size="xs"
                            variant="ghost"
                            ml={1}
                            aria-label="Sort"
                            onClick={() => handleSortBedTypes('name')}
                          />
                        </Th>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold">
                          Description
                          <IconButton
                            icon={<ArrowUpDown />}
                            size="xs"
                            variant="ghost"
                            ml={1}
                            aria-label="Sort"
                            onClick={() => handleSortBedTypes('description')}
                          />
                        </Th>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold" textAlign="right">
                          Charges (₹)
                          <IconButton
                            icon={<ArrowUpDown />}
                            size="xs"
                            variant="ghost"
                            ml={1}
                            aria-label="Sort"
                            onClick={() => handleSortBedTypes('charges')}
                          />
                        </Th>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold" textAlign="center">
                          Status
                          <IconButton
                            icon={<ArrowUpDown />}
                            size="xs"
                            variant="ghost"
                            ml={1}
                            aria-label="Sort"
                            onClick={() => handleSortBedTypes('status')}
                          />
                        </Th>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold" textAlign="center">Action</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {bedTypes.filter(bedType => 
                        bedType.name.toLowerCase().includes(bedTypeSearch.toLowerCase()) ||
                        bedType.description.toLowerCase().includes(bedTypeSearch.toLowerCase())
                      ).map((bedType, index) => (
                        <Tr key={index} _hover={{ bg: hoverBg }}>
                          <Td py={3} px={4}>
                            <HStack spacing={2}>
                              <Badge 
                                colorScheme={
                                  bedType.name === 'VIP' ? 'purple' : 
                                  bedType.name === 'Standard' ? 'blue' : 
                                  bedType.name === 'ICU' ? 'red' :
                                  bedType.name === 'Emergency' ? 'orange' : 'gray'
                                } 
                                size="sm"
                              >
                                {bedType.name}
                              </Badge>
                            </HStack>
                          </Td>
                          <Td py={3} px={4}>
                            <Text fontSize="sm" color="gray.600" noOfLines={2}>
                              {bedType.description}
                            </Text>
                          </Td>
                          <Td py={3} px={4} textAlign="right">
                            <Text fontSize="sm" fontWeight="medium" color="green.600">
                              ₹{bedType.charges.toLocaleString()}
                            </Text>
                          </Td>
                          <Td py={3} px={4} textAlign="center">
                            <Badge 
                              colorScheme={bedType.status === 'Active' ? 'green' : 'red'} 
                              size="sm"
                            >
                              {bedType.status}
                            </Badge>
                          </Td>
                          <Td py={3} px={4}>
                            <HStack spacing={2} justify="center">
                              <IconButton
                                size="xs"
                                icon={<Eye />}
                                colorScheme="blue"
                                variant="ghost"
                                aria-label="View"
                                title="View Details"
                                onClick={() => handleViewBedType(bedType, index)}
                              />
                              <IconButton
                                size="xs"
                                icon={<Edit3 />}
                                colorScheme="green"
                                variant="ghost"
                                aria-label="Edit"
                                title="Edit"
                                onClick={() => handleEditBedType(bedType, index)}
                              />
                              <IconButton
                                size="xs"
                                icon={<Trash2 />}
                                colorScheme="red"
                                variant="ghost"
                                aria-label="Delete"
                                title="Delete"
                                onClick={() => handleDeleteBedType(index)}
                              />
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </CardBody>
            </Card>

            {/* Pagination */}
            <Flex justify="space-between" align="center">
              <Text fontSize="sm" color="gray.600">
                Records: 1 to {bedTypes.length} of {bedTypes.length}
              </Text>
              <HStack spacing={2}>
                <IconButton
                  size="sm"
                  icon={<ChevronLeft />}
                  variant="outline"
                  aria-label="Previous"
                  isDisabled={true}
                />
                <Button size="sm" colorScheme="blue" variant="solid">
                  1
                </Button>
                <IconButton
                  size="sm"
                  icon={<ChevronRight />}
                  variant="outline"
                  aria-label="Next"
                  isDisabled={true}
                />
              </HStack>
            </Flex>

            {/* Add/Edit Bed Type Modal */}
            <Modal isOpen={isBedTypeModalOpen} onClose={() => setIsBedTypeModalOpen(false)} size="lg">
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>{editingBedTypeIndex !== null ? 'Edit Bed Type' : 'Add Bed Type'}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack spacing={4} align="stretch">
                    <FormControl isRequired>
                      <FormLabel>Bed Type Name</FormLabel>
                      <Input 
                        placeholder="Enter bed type name" 
                        value={bedTypeForm.name}
                        onChange={(e) => setBedTypeForm({...bedTypeForm, name: e.target.value})}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Description</FormLabel>
                      <Textarea 
                        placeholder="Enter description" 
                        value={bedTypeForm.description}
                        onChange={(e) => setBedTypeForm({...bedTypeForm, description: e.target.value})}
                        rows={3}
                        resize="vertical"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Daily Charges (₹)</FormLabel>
                      <NumberInput 
                        value={bedTypeForm.charges}
                        onChange={(valueString, valueNumber) => 
                          setBedTypeForm({...bedTypeForm, charges: valueNumber || 0})
                        }
                        precision={2}
                        step={100}
                        min={0}
                      >
                        <NumberInputField placeholder="Enter daily charges" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Status</FormLabel>
                      <RadioGroup 
                        value={bedTypeForm.status}
                        onChange={(value) => setBedTypeForm({...bedTypeForm, status: value})}
                      >
                        <HStack spacing={4}>
                          <Radio value="Active" colorScheme="green">Active</Radio>
                          <Radio value="Inactive" colorScheme="red">Inactive</Radio>
                        </HStack>
                      </RadioGroup>
                    </FormControl>

                    {bedTypeForm.charges > 0 && (
                      <Alert status="info" borderRadius="md">
                        <AlertIcon />
                        <Box>
                          <AlertTitle>Pricing Information</AlertTitle>
                          <AlertDescription>
                            Daily Rate: ₹{bedTypeForm.charges.toLocaleString()} | 
                            Weekly: ₹{(bedTypeForm.charges * 7).toLocaleString()} | 
                            Monthly: ₹{(bedTypeForm.charges * 30).toLocaleString()}
                          </AlertDescription>
                        </Box>
                      </Alert>
                    )}
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <HStack spacing={3}>
                    <Button variant="outline" onClick={() => handleCancelBedType()}>
                      Cancel
                    </Button>
                    <Button colorScheme="blue" leftIcon={<Save />} onClick={handleSaveBedType}>
                      {editingBedTypeIndex !== null ? 'Update' : 'Save'} Bed Type
                    </Button>
                  </HStack>
                </ModalFooter>
              </ModalContent>
            </Modal>

            {/* View Bed Type Modal */}
            <Modal isOpen={isViewBedTypeModalOpen} onClose={() => setIsViewBedTypeModalOpen(false)} size="lg">
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Bed Type Details</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  {viewingBedType && (
                    <VStack spacing={4} align="stretch">
                      <Card border="1px" borderColor={borderColor}>
                        <CardBody>
                          <SimpleGrid columns={2} spacing={4}>
                            <Box>
                              <Text fontSize="sm" color="gray.500">Bed Type</Text>
                              <Badge 
                                colorScheme={
                                  viewingBedType.name === 'VIP' ? 'purple' : 
                                  viewingBedType.name === 'Standard' ? 'blue' : 
                                  viewingBedType.name === 'ICU' ? 'red' :
                                  viewingBedType.name === 'Emergency' ? 'orange' : 'gray'
                                } 
                                size="lg"
                              >
                                {viewingBedType.name}
                              </Badge>
                            </Box>
                            <Box>
                              <Text fontSize="sm" color="gray.500">Status</Text>
                              <Badge 
                                colorScheme={viewingBedType.status === 'Active' ? 'green' : 'red'} 
                                size="lg"
                              >
                                {viewingBedType.status}
                              </Badge>
                            </Box>
                            <Box>
                              <Text fontSize="sm" color="gray.500">Daily Charges</Text>
                              <Text fontSize="lg" fontWeight="bold" color="green.600">
                                ₹{viewingBedType.charges.toLocaleString()}
                              </Text>
                            </Box>
                            <Box>
                              <Text fontSize="sm" color="gray.500">Monthly Rate</Text>
                              <Text fontSize="lg" fontWeight="bold" color="blue.600">
                                ₹{(viewingBedType.charges * 30).toLocaleString()}
                              </Text>
                            </Box>
                          </SimpleGrid>
                          <Box mt={4}>
                            <Text fontSize="sm" color="gray.500">Description</Text>
                            <Text fontSize="md" mt={1}>
                              {viewingBedType.description}
                            </Text>
                          </Box>
                        </CardBody>
                      </Card>
                    </VStack>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" onClick={() => setIsViewBedTypeModalOpen(false)}>
                    Close
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </VStack>
        );

      case 'bed-group':
        return (
          <VStack spacing={6} align="stretch">
            <Flex justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="semibold">Bed Group List</Text>
              <Button leftIcon={<Plus />} colorScheme="blue" onClick={() => setIsBedGroupModalOpen(true)}>
                Add Bed Group
              </Button>
            </Flex>

            {/* Search and Controls */}
            <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
              <Input
                placeholder="Search..."
                size="sm"
                maxW="300px"
                bg="white"
                value={bedGroupSearch}
                onChange={(e) => setBedGroupSearch(e.target.value)}
              />
              <HStack spacing={2}>
                <Select size="sm" maxW="100px" defaultValue="100">
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </Select>
                <IconButton
                  icon={<Download />}
                  size="sm"
                  variant="ghost"
                  aria-label="Export CSV"
                  title="Export CSV"
                  onClick={() => handleExportBedGroups('csv')}
                />
                <IconButton
                  icon={<FileText />}
                  size="sm"
                  variant="ghost"
                  aria-label="Export Excel"
                  title="Export Excel"
                  onClick={() => handleExportBedGroups('excel')}
                />
                <IconButton
                  icon={<FileText />}
                  size="sm"
                  variant="ghost"
                  aria-label="Export PDF"
                  title="Export PDF"
                  onClick={() => handleExportBedGroups('pdf')}
                />
                <IconButton
                  icon={<Printer />}
                  size="sm"
                  variant="ghost"
                  aria-label="Print"
                  title="Print"
                  onClick={() => handlePrintBedGroups()}
                />
              </HStack>
            </Flex>

            {/* Bed Group Table */}
            <Card border="1px" borderColor={borderColor} bg={cardBg}>
              <CardBody p={0}>
                <TableContainer>
                  <Table variant="simple" size="sm">
                    <Thead bg="gray.50">
                      <Tr>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold">
                          Group Name
                          <IconButton
                            icon={<ArrowUpDown />}
                            size="xs"
                            variant="ghost"
                            ml={1}
                            aria-label="Sort"
                            onClick={() => handleSortBedGroups('name')}
                          />
                        </Th>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold">
                          Floor
                          <IconButton
                            icon={<ArrowUpDown />}
                            size="xs"
                            variant="ghost"
                            ml={1}
                            aria-label="Sort"
                            onClick={() => handleSortBedGroups('floor')}
                          />
                        </Th>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold" textAlign="center">
                          Total Beds
                          <IconButton
                            icon={<ArrowUpDown />}
                            size="xs"
                            variant="ghost"
                            ml={1}
                            aria-label="Sort"
                            onClick={() => handleSortBedGroups('totalBeds')}
                          />
                        </Th>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold">
                          Description
                        </Th>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold" textAlign="center">Action</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {bedGroups.filter(group => 
                        group.name.toLowerCase().includes(bedGroupSearch.toLowerCase()) ||
                        group.floor.toLowerCase().includes(bedGroupSearch.toLowerCase()) ||
                        group.description.toLowerCase().includes(bedGroupSearch.toLowerCase())
                      ).map((group, index) => (
                        <Tr key={index} _hover={{ bg: hoverBg }}>
                          <Td py={3} px={4}>
                            <Text fontSize="sm" color="blue.600" cursor="pointer" _hover={{ textDecoration: "underline" }}>
                              {group.name}
                            </Text>
                          </Td>
                          <Td py={3} px={4}>
                            <Badge 
                              colorScheme={
                                group.floor === 'Ground Floor' ? 'green' : 
                                group.floor === '1st Floor' ? 'blue' : 
                                group.floor === '2nd Floor' ? 'purple' : 
                                group.floor === '3rd Floor' ? 'orange' : 'gray'
                              } 
                              size="sm"
                            >
                              {group.floor}
                            </Badge>
                          </Td>
                          <Td py={3} px={4} textAlign="center">
                            <Badge colorScheme="teal" size="sm">
                              {group.totalBeds}
                            </Badge>
                          </Td>
                          <Td py={3} px={4}>
                            <Text fontSize="sm" color="gray.600" noOfLines={2}>
                              {group.description}
                            </Text>
                          </Td>
                          <Td py={3} px={4}>
                            <HStack spacing={2} justify="center">
                              <IconButton
                                size="xs"
                                icon={<Eye />}
                                colorScheme="blue"
                                variant="ghost"
                                aria-label="View"
                                title="View Details"
                                onClick={() => handleViewBedGroup(group, index)}
                              />
                              <IconButton
                                size="xs"
                                icon={<Edit3 />}
                                colorScheme="green"
                                variant="ghost"
                                aria-label="Edit"
                                title="Edit"
                                onClick={() => handleEditBedGroup(group, index)}
                              />
                              <IconButton
                                size="xs"
                                icon={<Trash2 />}
                                colorScheme="red"
                                variant="ghost"
                                aria-label="Delete"
                                title="Delete"
                                onClick={() => handleDeleteBedGroup(index)}
                              />
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </CardBody>
            </Card>

            {/* Add/Edit Bed Group Modal */}
            <Modal isOpen={isBedGroupModalOpen} onClose={() => setIsBedGroupModalOpen(false)} size="lg">
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>{editingBedGroupIndex !== null ? 'Edit Bed Group' : 'Add Bed Group'}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack spacing={4} align="stretch">
                    <FormControl isRequired>
                      <FormLabel>Group Name</FormLabel>
                      <Input 
                        placeholder="Enter bed group name" 
                        value={bedGroupForm.name}
                        onChange={(e) => setBedGroupForm({...bedGroupForm, name: e.target.value})}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Floor</FormLabel>
                      <Select 
                        placeholder="Select floor"
                        value={bedGroupForm.floor}
                        onChange={(e) => setBedGroupForm({...bedGroupForm, floor: e.target.value})}
                      >
                        <option value="Ground Floor">Ground Floor</option>
                        <option value="1st Floor">1st Floor</option>
                        <option value="2nd Floor">2nd Floor</option>
                        <option value="3rd Floor">3rd Floor</option>
                        <option value="4th Floor">4th Floor</option>
                        <option value="5th Floor">5th Floor</option>
                      </Select>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Total Beds</FormLabel>
                      <NumberInput 
                        value={bedGroupForm.totalBeds}
                        onChange={(valueString, valueNumber) => 
                          setBedGroupForm({...bedGroupForm, totalBeds: valueNumber || 0})
                        }
                        min={1}
                        max={100}
                      >
                        <NumberInputField placeholder="Enter total beds" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Description</FormLabel>
                      <Textarea 
                        placeholder="Enter description" 
                        value={bedGroupForm.description}
                        onChange={(e) => setBedGroupForm({...bedGroupForm, description: e.target.value})}
                        rows={3}
                        resize="vertical"
                      />
                    </FormControl>
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <HStack spacing={3}>
                    <Button variant="outline" onClick={() => handleCancelBedGroup()}>
                      Cancel
                    </Button>
                    <Button colorScheme="blue" leftIcon={<Save />} onClick={handleSaveBedGroup}>
                      {editingBedGroupIndex !== null ? 'Update' : 'Save'} Bed Group
                    </Button>
                  </HStack>
                </ModalFooter>
              </ModalContent>
            </Modal>

            {/* View Bed Group Modal */}
            <Modal isOpen={isViewBedGroupModalOpen} onClose={() => setIsViewBedGroupModalOpen(false)} size="lg">
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Bed Group Details</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  {viewingBedGroup && (
                    <VStack spacing={4} align="stretch">
                      <Card border="1px" borderColor={borderColor}>
                        <CardBody>
                          <SimpleGrid columns={2} spacing={4}>
                            <Box>
                              <Text fontSize="sm" color="gray.500">Group Name</Text>
                              <Text fontSize="lg" fontWeight="bold" color="blue.600">
                                {viewingBedGroup.name}
                              </Text>
                            </Box>
                            <Box>
                              <Text fontSize="sm" color="gray.500">Floor</Text>
                              <Badge 
                                colorScheme={
                                  viewingBedGroup.floor === 'Ground Floor' ? 'green' : 
                                  viewingBedGroup.floor === '1st Floor' ? 'blue' : 
                                  viewingBedGroup.floor === '2nd Floor' ? 'purple' : 
                                  viewingBedGroup.floor === '3rd Floor' ? 'orange' : 'gray'
                                } 
                                size="lg"
                              >
                                {viewingBedGroup.floor}
                              </Badge>
                            </Box>
                            <Box>
                              <Text fontSize="sm" color="gray.500">Total Beds</Text>
                              <Text fontSize="lg" fontWeight="bold" color="teal.600">
                                {viewingBedGroup.totalBeds} Beds
                              </Text>
                            </Box>
                          </SimpleGrid>
                          <Box mt={4}>
                            <Text fontSize="sm" color="gray.500">Description</Text>
                            <Text fontSize="md" mt={1}>
                              {viewingBedGroup.description}
                            </Text>
                          </Box>
                        </CardBody>
                      </Card>
                    </VStack>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" onClick={() => setIsViewBedGroupModalOpen(false)}>
                    Close
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </VStack>
        );

      case 'floor':
        return (
          <VStack spacing={6} align="stretch">
            <Flex justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="semibold">Floor Management</Text>
              <Button leftIcon={<Plus />} colorScheme="blue" onClick={() => setIsFloorModalOpen(true)}>
                Add Floor
              </Button>
            </Flex>

            {/* Search and Controls */}
            <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
              <Input
                placeholder="Search..."
                size="sm"
                maxW="300px"
                bg="white"
                value={floorSearch}
                onChange={(e) => setFloorSearch(e.target.value)}
              />
              <HStack spacing={2}>
                <Select size="sm" maxW="100px" defaultValue="100">
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </Select>
                <IconButton
                  icon={<Download />}
                  size="sm"
                  variant="ghost"
                  aria-label="Export CSV"
                  title="Export CSV"
                  onClick={() => handleExportFloors('csv')}
                />
                <IconButton
                  icon={<FileText />}
                  size="sm"
                  variant="ghost"
                  aria-label="Export Excel"
                  title="Export Excel"
                  onClick={() => handleExportFloors('excel')}
                />
                <IconButton
                  icon={<FileText />}
                  size="sm"
                  variant="ghost"
                  aria-label="Export PDF"
                  title="Export PDF"
                  onClick={() => handleExportFloors('pdf')}
                />
                <IconButton
                  icon={<Printer />}
                  size="sm"
                  variant="ghost"
                  aria-label="Print"
                  title="Print"
                  onClick={() => handlePrintFloors()}
                />
              </HStack>
            </Flex>

            {/* Floor Table */}
            <Card border="1px" borderColor={borderColor} bg={cardBg}>
              <CardBody p={0}>
                <TableContainer>
                  <Table variant="simple" size="sm">
                    <Thead bg="gray.50">
                      <Tr>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold">
                          Floor Name
                          <IconButton
                            icon={<ArrowUpDown />}
                            size="xs"
                            variant="ghost"
                            ml={1}
                            aria-label="Sort"
                            onClick={() => handleSortFloors('name')}
                          />
                        </Th>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold" textAlign="center">
                          Floor Number
                          <IconButton
                            icon={<ArrowUpDown />}
                            size="xs"
                            variant="ghost"
                            ml={1}
                            aria-label="Sort"
                            onClick={() => handleSortFloors('number')}
                          />
                        </Th>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold" textAlign="center">
                          Total Rooms
                          <IconButton
                            icon={<ArrowUpDown />}
                            size="xs"
                            variant="ghost"
                            ml={1}
                            aria-label="Sort"
                            onClick={() => handleSortFloors('totalRooms')}
                          />
                        </Th>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold">
                          Department
                          <IconButton
                            icon={<ArrowUpDown />}
                            size="xs"
                            variant="ghost"
                            ml={1}
                            aria-label="Sort"
                            onClick={() => handleSortFloors('department')}
                          />
                        </Th>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold" textAlign="center">
                          Status
                          <IconButton
                            icon={<ArrowUpDown />}
                            size="xs"
                            variant="ghost"
                            ml={1}
                            aria-label="Sort"
                            onClick={() => handleSortFloors('status')}
                          />
                        </Th>
                        <Th py={4} px={4} fontSize="sm" fontWeight="semibold" textAlign="center">Action</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {floors.filter(floor => 
                        floor.name.toLowerCase().includes(floorSearch.toLowerCase()) ||
                        floor.department.toLowerCase().includes(floorSearch.toLowerCase())
                      ).map((floor, index) => (
                        <Tr key={index} _hover={{ bg: hoverBg }}>
                          <Td py={3} px={4}>
                            <Text fontSize="sm" color="blue.600" cursor="pointer" _hover={{ textDecoration: "underline" }}>
                              {floor.name}
                            </Text>
                          </Td>
                          <Td py={3} px={4} textAlign="center">
                            <Badge 
                              colorScheme={
                                floor.number === 0 ? 'green' : 
                                floor.number === 1 ? 'blue' : 
                                floor.number === 2 ? 'purple' : 
                                floor.number >= 3 ? 'orange' : 'gray'
                              } 
                              size="sm"
                            >
                              {floor.number === 0 ? 'G' : floor.number}
                            </Badge>
                          </Td>
                          <Td py={3} px={4} textAlign="center">
                            <Badge colorScheme="teal" size="sm">
                              {floor.totalRooms}
                            </Badge>
                          </Td>
                          <Td py={3} px={4}>
                            <Badge 
                              colorScheme={
                                floor.department === 'General Ward' ? 'blue' :
                                floor.department === 'ICU' ? 'red' :
                                floor.department === 'Emergency' ? 'orange' :
                                floor.department === 'VIP Ward' ? 'purple' : 'gray'
                              } 
                              size="sm"
                            >
                              {floor.department}
                            </Badge>
                          </Td>
                          <Td py={3} px={4} textAlign="center">
                            <Badge 
                              colorScheme={floor.status === 'Active' ? 'green' : 'red'} 
                              size="sm"
                            >
                              {floor.status}
                            </Badge>
                          </Td>
                          <Td py={3} px={4}>
                            <HStack spacing={2} justify="center">
                              <IconButton
                                size="xs"
                                icon={<Eye />}
                                colorScheme="blue"
                                variant="ghost"
                                aria-label="View"
                                title="View Details"
                                onClick={() => handleViewFloor(floor, index)}
                              />
                              <IconButton
                                size="xs"
                                icon={<Edit3 />}
                                colorScheme="green"
                                variant="ghost"
                                aria-label="Edit"
                                title="Edit"
                                onClick={() => handleEditFloor(floor, index)}
                              />
                              <IconButton
                                size="xs"
                                icon={<Trash2 />}
                                colorScheme="red"
                                variant="ghost"
                                aria-label="Delete"
                                title="Delete"
                                onClick={() => handleDeleteFloor(index)}
                              />
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </CardBody>
            </Card>

            {/* Add/Edit Floor Modal */}
            <Modal isOpen={isFloorModalOpen} onClose={() => setIsFloorModalOpen(false)} size="lg">
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>{editingFloorIndex !== null ? 'Edit Floor' : 'Add Floor'}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack spacing={4} align="stretch">
                    <FormControl isRequired>
                      <FormLabel>Floor Name</FormLabel>
                      <Input 
                        placeholder="Enter floor name" 
                        value={floorForm.name}
                        onChange={(e) => setFloorForm({...floorForm, name: e.target.value})}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Floor Number</FormLabel>
                      <NumberInput 
                        value={floorForm.number}
                        onChange={(valueString, valueNumber) => 
                          setFloorForm({...floorForm, number: valueNumber || 0})
                        }
                        min={0}
                        max={20}
                      >
                        <NumberInputField placeholder="Enter floor number (0 for Ground)" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Total Rooms</FormLabel>
                      <NumberInput 
                        value={floorForm.totalRooms}
                        onChange={(valueString, valueNumber) => 
                          setFloorForm({...floorForm, totalRooms: valueNumber || 0})
                        }
                        min={1}
                        max={50}
                      >
                        <NumberInputField placeholder="Enter total rooms" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Department</FormLabel>
                      <Select 
                        placeholder="Select department"
                        value={floorForm.department}
                        onChange={(e) => setFloorForm({...floorForm, department: e.target.value})}
                      >
                        <option value="General Ward">General Ward</option>
                        <option value="ICU">ICU</option>
                        <option value="Emergency">Emergency</option>
                        <option value="VIP Ward">VIP Ward</option>
                        <option value="OPD">OPD</option>
                        <option value="Surgery">Surgery</option>
                        <option value="Maternity">Maternity</option>
                        <option value="Pediatrics">Pediatrics</option>
                        <option value="Administration">Administration</option>
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Status</FormLabel>
                      <RadioGroup 
                        value={floorForm.status}
                        onChange={(value) => setFloorForm({...floorForm, status: value})}
                      >
                        <HStack spacing={4}>
                          <Radio value="Active" colorScheme="green">Active</Radio>
                          <Radio value="Inactive" colorScheme="red">Inactive</Radio>
                          <Radio value="Maintenance" colorScheme="orange">Maintenance</Radio>
                        </HStack>
                      </RadioGroup>
                    </FormControl>
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <HStack spacing={3}>
                    <Button variant="outline" onClick={() => handleCancelFloor()}>
                      Cancel
                    </Button>
                    <Button colorScheme="blue" leftIcon={<Save />} onClick={handleSaveFloor}>
                      {editingFloorIndex !== null ? 'Update' : 'Save'} Floor
                    </Button>
                  </HStack>
                </ModalFooter>
              </ModalContent>
            </Modal>

            {/* View Floor Modal */}
            <Modal isOpen={isViewFloorModalOpen} onClose={() => setIsViewFloorModalOpen(false)} size="lg">
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Floor Details</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  {viewingFloor && (
                    <VStack spacing={4} align="stretch">
                      <Card border="1px" borderColor={borderColor}>
                        <CardBody>
                          <SimpleGrid columns={2} spacing={4}>
                            <Box>
                              <Text fontSize="sm" color="gray.500">Floor Name</Text>
                              <Text fontSize="lg" fontWeight="bold" color="blue.600">
                                {viewingFloor.name}
                              </Text>
                            </Box>
                            <Box>
                              <Text fontSize="sm" color="gray.500">Floor Number</Text>
                              <Badge 
                                colorScheme={
                                  viewingFloor.number === 0 ? 'green' : 
                                  viewingFloor.number === 1 ? 'blue' : 
                                  viewingFloor.number === 2 ? 'purple' : 
                                  viewingFloor.number >= 3 ? 'orange' : 'gray'
                                } 
                                size="lg"
                              >
                                {viewingFloor.number === 0 ? 'Ground Floor' : `${viewingFloor.number} Floor`}
                              </Badge>
                            </Box>
                            <Box>
                              <Text fontSize="sm" color="gray.500">Total Rooms</Text>
                              <Text fontSize="lg" fontWeight="bold" color="teal.600">
                                {viewingFloor.totalRooms} Rooms
                              </Text>
                            </Box>
                            <Box>
                              <Text fontSize="sm" color="gray.500">Department</Text>
                              <Badge 
                                colorScheme={
                                  viewingFloor.department === 'General Ward' ? 'blue' :
                                  viewingFloor.department === 'ICU' ? 'red' :
                                  viewingFloor.department === 'Emergency' ? 'orange' :
                                  viewingFloor.department === 'VIP Ward' ? 'purple' : 'gray'
                                } 
                                size="lg"
                              >
                                {viewingFloor.department}
                              </Badge>
                            </Box>
                            <Box>
                              <Text fontSize="sm" color="gray.500">Status</Text>
                              <Badge 
                                colorScheme={
                                  viewingFloor.status === 'Active' ? 'green' : 
                                  viewingFloor.status === 'Maintenance' ? 'orange' : 'red'
                                } 
                                size="lg"
                              >
                                {viewingFloor.status}
                              </Badge>
                            </Box>
                          </SimpleGrid>
                        </CardBody>
                      </Card>
                    </VStack>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" onClick={() => setIsViewFloorModalOpen(false)}>
                    Close
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </VStack>
        );

      case 'appointment':
        return (
          <VStack spacing={6} align="stretch">
            <Flex justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="semibold">Appointment Print Template</Text>
              <Button leftIcon={<Save />} colorScheme="blue" onClick={() => handleSavePrintTemplate('appointment')}>
                Save Template
              </Button>
            </Flex>

            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
              {/* Header Image Section */}
              <Card border="1px" borderColor={borderColor}>
                <CardHeader>
                  <Text fontSize="md" fontWeight="semibold">Header Image (2230px X 300px)</Text>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    {/* Image Upload Area */}
                    <Box
                      border="2px dashed"
                      borderColor="gray.300"
                      borderRadius="md"
                      p={8}
                      textAlign="center"
                      bg="gray.50"
                      minH="200px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      position="relative"
                      cursor="pointer"
                      _hover={{ borderColor: "blue.400", bg: "blue.50" }}
                      onClick={() => document.getElementById('appointment-header-upload').click()}
                    >
                      {printTemplates.appointment.headerImage ? (
                        <VStack spacing={2}>
                          <Box
                            as="img"
                            src={printTemplates.appointment.headerImage}
                            alt="Header Image"
                            maxH="150px"
                            objectFit="contain"
                          />
                          <Text fontSize="sm" color="blue.600">Click to change image</Text>
                        </VStack>
                      ) : (
                        <VStack spacing={2}>
                          <Upload size={32} color="gray" />
                          <Text color="gray.500">Drop a file here or click</Text>
                          <Text fontSize="sm" color="gray.400">Recommended: 2230px × 300px</Text>
                        </VStack>
                      )}
                    </Box>
                    <Input
                      id="appointment-header-upload"
                      type="file"
                      accept="image/*"
                      display="none"
                      onChange={(e) => handleHeaderImageUpload('appointment', e)}
                    />
                    <Text fontSize="xs" color="gray.500" textAlign="center">
                      📁 uploads/printing/20.jpg
                    </Text>
                  </VStack>
                </CardBody>
              </Card>

              {/* Footer Content Section */}
              <Card border="1px" borderColor={borderColor}>
                <CardHeader>
                  <Text fontSize="md" fontWeight="semibold">Footer Content</Text>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    {/* Enhanced Text Formatting Toolbar */}
                    <HStack spacing={2} p={3} bg="gray.50" borderRadius="md" flexWrap="wrap" justify="flex-start">
                      {/* Text Style Dropdown */}
                      <Select 
                        size="sm" 
                        maxW="140px" 
                        value={printTemplates.appointment.footerFormat.textStyle}
                        onChange={(e) => handleTextStyleChange('appointment', e.target.value)}
                        bg="white"
                      >
                        <option value="normal">Normal text</option>
                        <option value="heading1">Heading 1</option>
                        <option value="heading2">Heading 2</option>
                        <option value="heading3">Heading 3</option>
                        <option value="heading4">Heading 4</option>
                        <option value="heading5">Heading 5</option>
                        <option value="heading6">Heading 6</option>
                      </Select>

                      <Divider orientation="vertical" h="24px" borderColor="gray.300" />

                      {/* Text Formatting Buttons */}
                      <IconButton
                        size="sm"
                        icon={<Bold />}
                        variant={printTemplates.appointment.footerFormat.bold ? "solid" : "outline"}
                        colorScheme={printTemplates.appointment.footerFormat.bold ? "blue" : "gray"}
                        aria-label="Bold"
                        onClick={() => handleFormatToggle('appointment', 'bold')}
                      />
                      <IconButton
                        size="sm"
                        icon={<Italic />}
                        variant={printTemplates.appointment.footerFormat.italic ? "solid" : "outline"}
                        colorScheme={printTemplates.appointment.footerFormat.italic ? "blue" : "gray"}
                        aria-label="Italic"
                        onClick={() => handleFormatToggle('appointment', 'italic')}
                      />
                      <IconButton
                        size="sm"
                        icon={<Underline />}
                        variant={printTemplates.appointment.footerFormat.underline ? "solid" : "outline"}
                        colorScheme={printTemplates.appointment.footerFormat.underline ? "blue" : "gray"}
                        aria-label="Underline"
                        onClick={() => handleFormatToggle('appointment', 'underline')}
                      />
                      <IconButton
                        size="sm"
                        icon={<Type />}
                        variant={printTemplates.appointment.footerFormat.small ? "solid" : "outline"}
                        colorScheme={printTemplates.appointment.footerFormat.small ? "blue" : "gray"}
                        aria-label="Small"
                        onClick={() => handleFormatToggle('appointment', 'small')}
                      />

                      <Divider orientation="vertical" h="24px" borderColor="gray.300" />

                      {/* Quote and Link Buttons */}
                      <IconButton
                        size="sm"
                        icon={<Quote />}
                        variant="outline"
                        aria-label="Quote"
                        onClick={() => {
                          const currentContent = printTemplates.appointment.footerContent;
                          handleFooterContentChange('appointment', currentContent + '\n> ');
                        }}
                      />
                      <IconButton
                        size="sm"
                        icon={<Link />}
                        variant="outline"
                        aria-label="Insert Link"
                        onClick={() => handleInsertLink('appointment')}
                      />

                      <Divider orientation="vertical" h="24px" borderColor="gray.300" />

                      {/* List Buttons */}
                      <IconButton
                        size="sm"
                        icon={<List />}
                        variant="outline"
                        aria-label="Bullet List"
                        onClick={() => {
                          const currentContent = printTemplates.appointment.footerContent;
                          handleFooterContentChange('appointment', currentContent + '\n• ');
                        }}
                      />
                      <IconButton
                        size="sm"
                        icon={<Type />}
                        variant="outline"
                        aria-label="Numbered List"
                        onClick={() => {
                          const currentContent = printTemplates.appointment.footerContent;
                          handleFooterContentChange('appointment', currentContent + '\n1. ');
                        }}
                      />

                      <Divider orientation="vertical" h="24px" borderColor="gray.300" />

                      {/* Alignment Buttons */}
                      <IconButton
                        size="sm"
                        icon={<AlignLeft />}
                        variant={printTemplates.appointment.footerFormat.alignment === 'left' ? "solid" : "outline"}
                        colorScheme={printTemplates.appointment.footerFormat.alignment === 'left' ? "blue" : "gray"}
                        aria-label="Align Left"
                        onClick={() => handleAlignmentChange('appointment', 'left')}
                      />
                      <IconButton
                        size="sm"
                        icon={<AlignCenter />}
                        variant={printTemplates.appointment.footerFormat.alignment === 'center' ? "solid" : "outline"}
                        colorScheme={printTemplates.appointment.footerFormat.alignment === 'center' ? "blue" : "gray"}
                        aria-label="Align Center"
                        onClick={() => handleAlignmentChange('appointment', 'center')}
                      />
                      <IconButton
                        size="sm"
                        icon={<AlignRight />}
                        variant={printTemplates.appointment.footerFormat.alignment === 'right' ? "solid" : "outline"}
                        colorScheme={printTemplates.appointment.footerFormat.alignment === 'right' ? "blue" : "gray"}
                        aria-label="Align Right"
                        onClick={() => handleAlignmentChange('appointment', 'right')}
                      />
                      <IconButton
                        size="sm"
                        icon={<AlignJustify />}
                        variant={printTemplates.appointment.footerFormat.alignment === 'justify' ? "solid" : "outline"}
                        colorScheme={printTemplates.appointment.footerFormat.alignment === 'justify' ? "blue" : "gray"}
                        aria-label="Justify"
                        onClick={() => handleAlignmentChange('appointment', 'justify')}
                      />

                      <Divider orientation="vertical" h="24px" borderColor="gray.300" />

                      {/* Reset Button */}
                      <IconButton
                        size="sm"
                        icon={<RotateCcw />}
                        variant="outline"
                        aria-label="Reset Formatting"
                        onClick={() => {
                          setPrintTemplates(prev => ({
                            ...prev,
                            appointment: {
                              ...prev.appointment,
                              footerFormat: {
                                textStyle: 'normal',
                                bold: false,
                                italic: false,
                                underline: false,
                                small: false,
                                alignment: 'left'
                              }
                            }
                          }));
                        }}
                      />
                    </HStack>

                    {/* Footer Content Editor */}
                    <Textarea
                      placeholder="Enter footer content for appointment template..."
                      value={printTemplates.appointment.footerContent}
                      onChange={(e) => handleFooterContentChange('appointment', e.target.value)}
                      minH="300px"
                      bg="white"
                      border="1px"
                      borderColor="gray.300"
                      resize="vertical"
                    />
                  </VStack>
                </CardBody>
              </Card>
            </SimpleGrid>

            {/* Save Button */}
            <Flex justify="end">
              <Button leftIcon={<Save />} colorScheme="blue" size="lg" onClick={() => handleSavePrintTemplate('appointment')}>
                Save Template
              </Button>
            </Flex>
          </VStack>
        );

      case 'opd-prescription':
        return (
          <VStack spacing={6} align="stretch">
            <Flex justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="semibold">OPD Prescription Print Template</Text>
              <Button leftIcon={<Save />} colorScheme="blue" onClick={() => handleSavePrintTemplate('opd-prescription')}>
                Save Template
              </Button>
            </Flex>

            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
              {/* Header Image Section */}
              <Card border="1px" borderColor={borderColor}>
                <CardHeader>
                  <Text fontSize="md" fontWeight="semibold">Header Image (2230px X 300px)</Text>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <Box
                      border="2px dashed"
                      borderColor="gray.300"
                      borderRadius="md"
                      p={8}
                      textAlign="center"
                      bg="gray.50"
                      minH="200px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      cursor="pointer"
                      _hover={{ borderColor: "blue.400", bg: "blue.50" }}
                      onClick={() => document.getElementById('opd-prescription-header-upload').click()}
                    >
                      {printTemplates['opd-prescription'].headerImage ? (
                        <VStack spacing={2}>
                          <Box
                            as="img"
                            src={printTemplates['opd-prescription'].headerImage}
                            alt="Header Image"
                            maxH="150px"
                            objectFit="contain"
                          />
                          <Text fontSize="sm" color="blue.600">Click to change image</Text>
                        </VStack>
                      ) : (
                        <VStack spacing={2}>
                          <Upload size={32} color="gray" />
                          <Text color="gray.500">Drop a file here or click</Text>
                          <Text fontSize="sm" color="gray.400">Recommended: 2230px × 300px</Text>
                        </VStack>
                      )}
                    </Box>
                    <Input
                      id="opd-prescription-header-upload"
                      type="file"
                      accept="image/*"
                      display="none"
                      onChange={(e) => handleHeaderImageUpload('opd-prescription', e)}
                    />
                    <Text fontSize="xs" color="gray.500" textAlign="center">
                      📁 uploads/printing/opd-prescription.jpg
                    </Text>
                  </VStack>
                </CardBody>
              </Card>

              {/* Footer Content Section */}
              <Card border="1px" borderColor={borderColor}>
                <CardHeader>
                  <Text fontSize="md" fontWeight="semibold">Footer Content</Text>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    {/* Enhanced Text Formatting Toolbar */}
                    <HStack spacing={2} p={3} bg="gray.50" borderRadius="md" flexWrap="wrap" justify="flex-start">
                      {/* Text Style Dropdown */}
                      <Select 
                        size="sm" 
                        maxW="140px" 
                        value={printTemplates['opd-prescription'].footerFormat.textStyle}
                        onChange={(e) => handleTextStyleChange('opd-prescription', e.target.value)}
                        bg="white"
                      >
                        <option value="normal">Normal text</option>
                        <option value="heading1">Heading 1</option>
                        <option value="heading2">Heading 2</option>
                        <option value="heading3">Heading 3</option>
                        <option value="heading4">Heading 4</option>
                        <option value="heading5">Heading 5</option>
                        <option value="heading6">Heading 6</option>
                      </Select>

                      <Divider orientation="vertical" h="24px" borderColor="gray.300" />

                      {/* Text Formatting Buttons */}
                      <IconButton
                        size="sm"
                        icon={<Bold />}
                        variant={printTemplates['opd-prescription'].footerFormat.bold ? "solid" : "outline"}
                        colorScheme={printTemplates['opd-prescription'].footerFormat.bold ? "blue" : "gray"}
                        aria-label="Bold"
                        onClick={() => handleFormatToggle('opd-prescription', 'bold')}
                      />
                      <IconButton
                        size="sm"
                        icon={<Italic />}
                        variant={printTemplates['opd-prescription'].footerFormat.italic ? "solid" : "outline"}
                        colorScheme={printTemplates['opd-prescription'].footerFormat.italic ? "blue" : "gray"}
                        aria-label="Italic"
                        onClick={() => handleFormatToggle('opd-prescription', 'italic')}
                      />
                      <IconButton
                        size="sm"
                        icon={<Underline />}
                        variant={printTemplates['opd-prescription'].footerFormat.underline ? "solid" : "outline"}
                        colorScheme={printTemplates['opd-prescription'].footerFormat.underline ? "blue" : "gray"}
                        aria-label="Underline"
                        onClick={() => handleFormatToggle('opd-prescription', 'underline')}
                      />
                      <IconButton
                        size="sm"
                        icon={<Type />}
                        variant={printTemplates['opd-prescription'].footerFormat.small ? "solid" : "outline"}
                        colorScheme={printTemplates['opd-prescription'].footerFormat.small ? "blue" : "gray"}
                        aria-label="Small"
                        onClick={() => handleFormatToggle('opd-prescription', 'small')}
                      />

                      <Divider orientation="vertical" h="24px" borderColor="gray.300" />

                      {/* Quote and Link Buttons */}
                      <IconButton
                        size="sm"
                        icon={<Quote />}
                        variant="outline"
                        aria-label="Quote"
                        onClick={() => {
                          const currentContent = printTemplates['opd-prescription'].footerContent;
                          handleFooterContentChange('opd-prescription', currentContent + '\n> ');
                        }}
                      />
                      <IconButton
                        size="sm"
                        icon={<Link />}
                        variant="outline"
                        aria-label="Insert Link"
                        onClick={() => handleInsertLink('opd-prescription')}
                      />

                      <Divider orientation="vertical" h="24px" borderColor="gray.300" />

                      {/* List Buttons */}
                      <IconButton
                        size="sm"
                        icon={<List />}
                        variant="outline"
                        aria-label="Bullet List"
                        onClick={() => {
                          const currentContent = printTemplates['opd-prescription'].footerContent;
                          handleFooterContentChange('opd-prescription', currentContent + '\n• ');
                        }}
                      />
                      <IconButton
                        size="sm"
                        icon={<Type />}
                        variant="outline"
                        aria-label="Numbered List"
                        onClick={() => {
                          const currentContent = printTemplates['opd-prescription'].footerContent;
                          handleFooterContentChange('opd-prescription', currentContent + '\n1. ');
                        }}
                      />

                      <Divider orientation="vertical" h="24px" borderColor="gray.300" />

                      {/* Alignment Buttons */}
                      <IconButton
                        size="sm"
                        icon={<AlignLeft />}
                        variant={printTemplates['opd-prescription'].footerFormat.alignment === 'left' ? "solid" : "outline"}
                        colorScheme={printTemplates['opd-prescription'].footerFormat.alignment === 'left' ? "blue" : "gray"}
                        aria-label="Align Left"
                        onClick={() => handleAlignmentChange('opd-prescription', 'left')}
                      />
                      <IconButton
                        size="sm"
                        icon={<AlignCenter />}
                        variant={printTemplates['opd-prescription'].footerFormat.alignment === 'center' ? "solid" : "outline"}
                        colorScheme={printTemplates['opd-prescription'].footerFormat.alignment === 'center' ? "blue" : "gray"}
                        aria-label="Align Center"
                        onClick={() => handleAlignmentChange('opd-prescription', 'center')}
                      />
                      <IconButton
                        size="sm"
                        icon={<AlignRight />}
                        variant={printTemplates['opd-prescription'].footerFormat.alignment === 'right' ? "solid" : "outline"}
                        colorScheme={printTemplates['opd-prescription'].footerFormat.alignment === 'right' ? "blue" : "gray"}
                        aria-label="Align Right"
                        onClick={() => handleAlignmentChange('opd-prescription', 'right')}
                      />
                      <IconButton
                        size="sm"
                        icon={<AlignJustify />}
                        variant={printTemplates['opd-prescription'].footerFormat.alignment === 'justify' ? "solid" : "outline"}
                        colorScheme={printTemplates['opd-prescription'].footerFormat.alignment === 'justify' ? "blue" : "gray"}
                        aria-label="Justify"
                        onClick={() => handleAlignmentChange('opd-prescription', 'justify')}
                      />

                      <Divider orientation="vertical" h="24px" borderColor="gray.300" />

                      {/* Reset Button */}
                      <IconButton
                        size="sm"
                        icon={<RotateCcw />}
                        variant="outline"
                        aria-label="Reset Formatting"
                        onClick={() => {
                          setPrintTemplates(prev => ({
                            ...prev,
                            'opd-prescription': {
                              ...prev['opd-prescription'],
                              footerFormat: {
                                textStyle: 'normal',
                                bold: false,
                                italic: false,
                                underline: false,
                                small: false,
                                alignment: 'left'
                              }
                            }
                          }));
                        }}
                      />
                    </HStack>

                    <Textarea
                      placeholder="Enter footer content for OPD prescription template..."
                      value={printTemplates['opd-prescription'].footerContent}
                      onChange={(e) => handleFooterContentChange('opd-prescription', e.target.value)}
                      minH="300px"
                      bg="white"
                      border="1px"
                      borderColor="gray.300"
                      resize="vertical"
                    />
                  </VStack>
                </CardBody>
              </Card>
            </SimpleGrid>

            <Flex justify="end">
              <Button leftIcon={<Save />} colorScheme="blue" size="lg" onClick={() => handleSavePrintTemplate('opd-prescription')}>
                Save Template
              </Button>
            </Flex>
          </VStack>
        );

      case 'opd-bill':
      case 'ipd-prescription':
      case 'ipd-bill':
      case 'bill-summary':
      case 'pharmacy-bill':
      case 'payslip':
      case 'payment-receipt':
      case 'discharge-card':
      case 'insurance-document':
        const templateDisplayName = {
          'opd-bill': 'OPD Bill',
          'ipd-prescription': 'IPD Prescription',
          'ipd-bill': 'IPD Bill',
          'bill-summary': 'Bill Summary',
          'pharmacy-bill': 'Pharmacy Bill',
          'payslip': 'Payslip',
          'payment-receipt': 'Payment Receipt',
          'discharge-card': 'Discharge Card',
          'insurance-document': 'Insurance Document'
        };

        return (
          <VStack spacing={6} align="stretch">
            <Flex justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="semibold">{templateDisplayName[selectedSubsection]} Print Template</Text>
              <Button leftIcon={<Save />} colorScheme="blue" onClick={() => handleSavePrintTemplate(selectedSubsection)}>
                Save Template
              </Button>
            </Flex>

            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
              {/* Header Image Section */}
              <Card border="1px" borderColor={borderColor}>
                <CardHeader>
                  <Text fontSize="md" fontWeight="semibold">Header Image (2230px X 300px)</Text>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <Box
                      border="2px dashed"
                      borderColor="gray.300"
                      borderRadius="md"
                      p={8}
                      textAlign="center"
                      bg="gray.50"
                      minH="200px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      cursor="pointer"
                      _hover={{ borderColor: "blue.400", bg: "blue.50" }}
                      onClick={() => document.getElementById(`${selectedSubsection}-header-upload`).click()}
                    >
                      {printTemplates[selectedSubsection]?.headerImage ? (
                        <VStack spacing={2}>
                          <Box
                            as="img"
                            src={printTemplates[selectedSubsection].headerImage}
                            alt="Header Image"
                            maxH="150px"
                            objectFit="contain"
                          />
                          <Text fontSize="sm" color="blue.600">Click to change image</Text>
                        </VStack>
                      ) : (
                        <VStack spacing={2}>
                          <Upload size={32} color="gray" />
                          <Text color="gray.500">Drop a file here or click</Text>
                          <Text fontSize="sm" color="gray.400">Recommended: 2230px × 300px</Text>
                        </VStack>
                      )}
                    </Box>
                    <Input
                      id={`${selectedSubsection}-header-upload`}
                      type="file"
                      accept="image/*"
                      display="none"
                      onChange={(e) => handleHeaderImageUpload(selectedSubsection, e)}
                    />
                    <Text fontSize="xs" color="gray.500" textAlign="center">
                      📁 uploads/printing/{selectedSubsection}.jpg
                    </Text>
                  </VStack>
                </CardBody>
              </Card>

              {/* Footer Content Section */}
              <Card border="1px" borderColor={borderColor}>
                <CardHeader>
                  <Text fontSize="md" fontWeight="semibold">Footer Content</Text>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    {/* Enhanced Text Formatting Toolbar */}
                    <HStack spacing={2} p={3} bg="gray.50" borderRadius="md" flexWrap="wrap" justify="flex-start">
                      {/* Text Style Dropdown */}
                      <Select 
                        size="sm" 
                        maxW="140px" 
                        value={printTemplates[selectedSubsection]?.footerFormat?.textStyle || 'normal'}
                        onChange={(e) => handleTextStyleChange(selectedSubsection, e.target.value)}
                        bg="white"
                      >
                        <option value="normal">Normal text</option>
                        <option value="heading1">Heading 1</option>
                        <option value="heading2">Heading 2</option>
                        <option value="heading3">Heading 3</option>
                        <option value="heading4">Heading 4</option>
                        <option value="heading5">Heading 5</option>
                        <option value="heading6">Heading 6</option>
                      </Select>

                      <Divider orientation="vertical" h="24px" borderColor="gray.300" />

                      {/* Text Formatting Buttons */}
                      <IconButton
                        size="sm"
                        icon={<Bold />}
                        variant={printTemplates[selectedSubsection]?.footerFormat?.bold ? "solid" : "outline"}
                        colorScheme={printTemplates[selectedSubsection]?.footerFormat?.bold ? "blue" : "gray"}
                        aria-label="Bold"
                        onClick={() => handleFormatToggle(selectedSubsection, 'bold')}
                      />
                      <IconButton
                        size="sm"
                        icon={<Italic />}
                        variant={printTemplates[selectedSubsection]?.footerFormat?.italic ? "solid" : "outline"}
                        colorScheme={printTemplates[selectedSubsection]?.footerFormat?.italic ? "blue" : "gray"}
                        aria-label="Italic"
                        onClick={() => handleFormatToggle(selectedSubsection, 'italic')}
                      />
                      <IconButton
                        size="sm"
                        icon={<Underline />}
                        variant={printTemplates[selectedSubsection]?.footerFormat?.underline ? "solid" : "outline"}
                        colorScheme={printTemplates[selectedSubsection]?.footerFormat?.underline ? "blue" : "gray"}
                        aria-label="Underline"
                        onClick={() => handleFormatToggle(selectedSubsection, 'underline')}
                      />
                      <IconButton
                        size="sm"
                        icon={<Type />}
                        variant={printTemplates[selectedSubsection]?.footerFormat?.small ? "solid" : "outline"}
                        colorScheme={printTemplates[selectedSubsection]?.footerFormat?.small ? "blue" : "gray"}
                        aria-label="Small"
                        onClick={() => handleFormatToggle(selectedSubsection, 'small')}
                      />

                      <Divider orientation="vertical" h="24px" borderColor="gray.300" />

                      {/* Quote and Link Buttons */}
                      <IconButton
                        size="sm"
                        icon={<Quote />}
                        variant="outline"
                        aria-label="Quote"
                        onClick={() => {
                          const currentContent = printTemplates[selectedSubsection]?.footerContent || '';
                          handleFooterContentChange(selectedSubsection, currentContent + '\n> ');
                        }}
                      />
                      <IconButton
                        size="sm"
                        icon={<Link />}
                        variant="outline"
                        aria-label="Insert Link"
                        onClick={() => handleInsertLink(selectedSubsection)}
                      />

                      <Divider orientation="vertical" h="24px" borderColor="gray.300" />

                      {/* List Buttons */}
                      <IconButton
                        size="sm"
                        icon={<List />}
                        variant="outline"
                        aria-label="Bullet List"
                        onClick={() => {
                          const currentContent = printTemplates[selectedSubsection]?.footerContent || '';
                          handleFooterContentChange(selectedSubsection, currentContent + '\n• ');
                        }}
                      />
                      <IconButton
                        size="sm"
                        icon={<Type />}
                        variant="outline"
                        aria-label="Numbered List"
                        onClick={() => {
                          const currentContent = printTemplates[selectedSubsection]?.footerContent || '';
                          handleFooterContentChange(selectedSubsection, currentContent + '\n1. ');
                        }}
                      />

                      <Divider orientation="vertical" h="24px" borderColor="gray.300" />

                      {/* Alignment Buttons */}
                      <IconButton
                        size="sm"
                        icon={<AlignLeft />}
                        variant={printTemplates[selectedSubsection]?.footerFormat?.alignment === 'left' ? "solid" : "outline"}
                        colorScheme={printTemplates[selectedSubsection]?.footerFormat?.alignment === 'left' ? "blue" : "gray"}
                        aria-label="Align Left"
                        onClick={() => handleAlignmentChange(selectedSubsection, 'left')}
                      />
                      <IconButton
                        size="sm"
                        icon={<AlignCenter />}
                        variant={printTemplates[selectedSubsection]?.footerFormat?.alignment === 'center' ? "solid" : "outline"}
                        colorScheme={printTemplates[selectedSubsection]?.footerFormat?.alignment === 'center' ? "blue" : "gray"}
                        aria-label="Align Center"
                        onClick={() => handleAlignmentChange(selectedSubsection, 'center')}
                      />
                      <IconButton
                        size="sm"
                        icon={<AlignRight />}
                        variant={printTemplates[selectedSubsection]?.footerFormat?.alignment === 'right' ? "solid" : "outline"}
                        colorScheme={printTemplates[selectedSubsection]?.footerFormat?.alignment === 'right' ? "blue" : "gray"}
                        aria-label="Align Right"
                        onClick={() => handleAlignmentChange(selectedSubsection, 'right')}
                      />
                      <IconButton
                        size="sm"
                        icon={<AlignJustify />}
                        variant={printTemplates[selectedSubsection]?.footerFormat?.alignment === 'justify' ? "solid" : "outline"}
                        colorScheme={printTemplates[selectedSubsection]?.footerFormat?.alignment === 'justify' ? "blue" : "gray"}
                        aria-label="Justify"
                        onClick={() => handleAlignmentChange(selectedSubsection, 'justify')}
                      />

                      <Divider orientation="vertical" h="24px" borderColor="gray.300" />

                      {/* Reset Button */}
                      <IconButton
                        size="sm"
                        icon={<RotateCcw />}
                        variant="outline"
                        aria-label="Reset Formatting"
                        onClick={() => {
                          setPrintTemplates(prev => ({
                            ...prev,
                            [selectedSubsection]: {
                              ...prev[selectedSubsection],
                              footerFormat: {
                                textStyle: 'normal',
                                bold: false,
                                italic: false,
                                underline: false,
                                small: false,
                                alignment: 'left'
                              }
                            }
                          }));
                        }}
                      />
                    </HStack>

                    {/* Footer Content Editor */}
                    <Textarea
                      placeholder={`Enter footer content for ${templateDisplayName[selectedSubsection]} template...`}
                      value={printTemplates[selectedSubsection]?.footerContent || ''}
                      onChange={(e) => handleFooterContentChange(selectedSubsection, e.target.value)}
                      minH="300px"
                      bg="white"
                      border="1px"
                      borderColor="gray.300"
                      resize="vertical"
                    />
                  </VStack>
                </CardBody>
              </Card>
            </SimpleGrid>

            {/* Save Button */}
            <Flex justify="end">
              <Button leftIcon={<Save />} colorScheme="blue" size="lg" onClick={() => handleSavePrintTemplate(selectedSubsection)}>
                Save Template
              </Button>
            </Flex>
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

  const getCurrentCategory = () => {
    const category = setupCategories.find(cat => cat.id === selectedCategory);
    if (!category) {
      console.log('Category not found for selectedCategory:', selectedCategory);
      console.log('Available categories:', setupCategories.map(cat => cat.id));
    }
    return category;
  };

  const getCurrentSubsection = () => {
    const category = getCurrentCategory();
    return category?.subsections.find(sub => sub.id === selectedSubsection);
  };

  const filteredCategories = setupCategories.filter(category =>
    category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Safety check for invalid category state
  const currentCategory = getCurrentCategory();
  if (selectedCategory && !currentCategory) {
    console.error('Invalid category state detected, resetting to grid view');
    setSelectedCategory(null);
    setSelectedSubsection(null);
    return null; // Prevent rendering until state is corrected
  }

  return (
    <Box p={6}>
      {/* Modern Header */}
      <Box mb={8}>
        <Flex justify="space-between" align="center" mb={4}>
          <VStack align="start" spacing={1}>
            <Text fontSize="3xl" fontWeight="bold" color="gray.800">
              System Setup
            </Text>
            <Text color="gray.600" fontSize="lg">
              Configure your hospital management system
            </Text>
          </VStack>
          <HStack spacing={3}>
            <Button leftIcon={<BarChart3 />} variant="outline" size="lg">
              Analytics
            </Button>
            <Button leftIcon={<Download />} variant="outline" size="lg">
              Export
            </Button>
            <Button leftIcon={<Save />} colorScheme="blue" size="lg">
              Save Changes
            </Button>
          </HStack>
        </Flex>

        {/* Search Bar */}
        <Box maxW="500px">
          <Input
            placeholder="Search configuration sections..."
            leftElement={<Search size={20} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="lg"
            bg={cardBg}
            border="2px solid"
            borderColor={borderColor}
            _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px #3182ce' }}
          />
        </Box>
      </Box>

      {selectedCategory ? (
        /* Configuration View */
        <Box>
          {/* Breadcrumb Navigation */}
          <Card mb={6} bg={cardBg} shadow="sm">
            <CardBody py={4}>
              <Breadcrumb spacing="8px" separator={<ChevronRight color="gray.500" size={16} />}>
                <BreadcrumbItem>
                  <BreadcrumbLink 
                    onClick={() => setSelectedCategory(null)} 
                    color="blue.600" 
                    fontWeight="medium"
                    _hover={{ textDecoration: 'underline' }}
                  >
                    System Setup
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbLink 
                    onClick={() => setSelectedSubsection(null)} 
                    color="blue.600" 
                    fontWeight="medium"
                    _hover={{ textDecoration: 'underline' }}
                  >
                    {getCurrentCategory()?.title}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {selectedSubsection && (
                  <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink fontWeight="semibold" color="gray.700">
                      {getCurrentSubsection()?.title}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                )}
              </Breadcrumb>
            </CardBody>
          </Card>

          <Grid templateColumns={{ base: '1fr', lg: '350px 1fr' }} gap={8}>
            {/* Subsection Navigation */}
            <VStack spacing={4} align="stretch">
              <Card bg={cardBg} shadow="md">
                <CardHeader pb={3}>
                  <HStack>
                    {getCurrentCategory()?.icon && React.createElement(getCurrentCategory().icon, { 
                      size: 24, 
                      color: `var(--chakra-colors-${getCurrentCategory().color}-500)` 
                    })}
                    <Box>
                      <Text fontSize="lg" fontWeight="bold">
                        {getCurrentCategory()?.title}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {getCurrentCategory()?.description}
                      </Text>
                    </Box>
                  </HStack>
                </CardHeader>
                <CardBody pt={0}>
                  <VStack spacing={2} align="stretch">
                    {getCurrentCategory()?.subsections.map((subsection) => (
                      <Box
                        key={subsection.id}
                        p={4}
                        borderRadius="lg"
                        cursor="pointer"
                        bg={selectedSubsection === subsection.id ? `${getCurrentCategory()?.color || 'blue'}.50` : 'transparent'}
                        border="2px solid"
                        borderColor={selectedSubsection === subsection.id ? `${getCurrentCategory()?.color || 'blue'}.200` : 'transparent'}
                        onClick={() => setSelectedSubsection(subsection.id)}
                        _hover={{ 
                          bg: `${getCurrentCategory()?.color || 'blue'}.50`,
                          borderColor: `${getCurrentCategory()?.color || 'blue'}.200`,
                          transform: 'translateY(-1px)',
                          shadow: 'md'
                        }}
                        transition="all 0.2s"
                      >
                        <HStack spacing={3}>
                          <Box
                            p={2}
                            borderRadius="md"
                            bg={selectedSubsection === subsection.id ? `${getCurrentCategory()?.color || 'blue'}.100` : hoverBg}
                          >
                            {React.createElement(subsection.icon, { size: 16 })}
                          </Box>
                          <Box flex={1}>
                            <Text fontWeight="medium" fontSize="sm">
                              {subsection.title}
                            </Text>
                            <Text fontSize="xs" color="gray.600">
                              {subsection.description}
                            </Text>
                          </Box>
                          {selectedSubsection === subsection.id && (
                            <CheckCircle size={16} color={`var(--chakra-colors-${getCurrentCategory()?.color || 'blue'}-500)`} />
                          )}
                        </HStack>
                      </Box>
                    ))}
                  </VStack>
                </CardBody>
              </Card>

              {/* Quick Stats */}
              <Card bg={cardBg} shadow="md">
                <CardBody>
                  <Text fontSize="md" fontWeight="semibold" mb={4}>Quick Stats</Text>
                  <VStack spacing={3}>
                    <Stat textAlign="center">
                      <StatNumber fontSize="2xl" color={`${getCurrentCategory()?.color || 'blue'}.600`}>
                        {getCurrentCategory()?.count || 0}
                      </StatNumber>
                      <StatLabel fontSize="xs">Configuration Items</StatLabel>
                    </Stat>
                    <Divider />
                    <HStack justify="space-between" w="full">
                      <Text fontSize="xs" color="gray.600">Status</Text>
                      <Badge colorScheme="green" size="sm">Active</Badge>
                    </HStack>
                    <HStack justify="space-between" w="full">
                      <Text fontSize="xs" color="gray.600">Last Updated</Text>
                      <Text fontSize="xs" color="gray.700">Today</Text>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>

            {/* Main Content */}
            <Card bg={cardBg} shadow="md">
              <CardBody p={8}>
                {selectedSubsection ? renderSubsectionContent() : (
                  <VStack spacing={6} align="center" py={12}>
                    {getCurrentCategory()?.icon && React.createElement(getCurrentCategory().icon, { size: 64, color: 'gray.400' })}
                    <VStack spacing={2} textAlign="center">
                      <Text fontSize="xl" fontWeight="semibold" color="gray.700">
                        Select a Configuration Item
                      </Text>
                      <Text color="gray.600">
                        Choose a subsection from the left panel to configure {getCurrentCategory()?.title?.toLowerCase() || 'system'} settings
                      </Text>
                    </VStack>
                  </VStack>
                )}
              </CardBody>
            </Card>
          </Grid>
        </Box>
      ) : (
        /* Category Grid View */
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={6}>
          {filteredCategories.map((category) => (
            <Card
              key={category.id}
              bg={cardBg}
              shadow="md"
              cursor="pointer"
              onClick={() => {
                setSelectedCategory(category.id);
                setSelectedSubsection(category.subsections[0]?.id || null);
              }}
              _hover={{
                transform: 'translateY(-4px)',
                shadow: 'xl',
                [`& .category-icon`]: {
                  transform: 'scale(1.1)',
                }
              }}
              transition="all 0.3s ease"
              position="relative"
              overflow="hidden"
            >
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                height="4px"
                bg={`${category.color}.400`}
              />
              
              <CardBody p={6}>
                <VStack spacing={4} align="start">
                  <HStack spacing={4} w="full">
                    <Box
                      className="category-icon"
                      p={3}
                      borderRadius="xl"
                      bg={`${category.color}.50`}
                      transition="transform 0.2s"
                    >
                      {React.createElement(category.icon, { 
                        size: 24, 
                        color: `var(--chakra-colors-${category.color}-500)` 
                      })}
                    </Box>
                    <Box flex={1}>
                      <Text fontSize="lg" fontWeight="bold" color="gray.800">
                        {category.title}
                      </Text>
                      <Badge colorScheme={category.color} size="sm">
                        {category.count} items
                      </Badge>
                    </Box>
                  </HStack>
                  
                  <Text fontSize="sm" color="gray.600" noOfLines={2}>
                    {category.description}
                  </Text>
                  
                  <Divider />
                  
                  <HStack justify="space-between" w="full">
                    <Text fontSize="xs" color="gray.500">
                      {category.subsections.length} subsections
                    </Text>
                    <ChevronRight size={16} color="gray.400" />
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      )}

      {/* Add/Edit Modals remain the same */}
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
