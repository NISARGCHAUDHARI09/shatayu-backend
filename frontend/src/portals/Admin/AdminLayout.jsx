import React, { useState, createContext, useContext } from 'react';
import { Link as RouterLink, useLocation, useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

// Import admin components
import AdminDashboard from './AdminDashboard';
import PatientList from '../../components/modules/PatientManagement/PatientList';
import AppointmentManagement from '../../components/modules/AppointmentManagement/AppointmentManagement';
import OPD from '../../components/modules/OPD/OPD';
import PatientDetails from '../../components/modules/OPD/PatientDetails';
import IPD from '../../components/modules/IPD/IPD';
import BillingManagement from '../../components/modules/BillingManagement/BillingManagement';
import Draft from '../../components/modules/Draft/Draft';
import HumanResources from '../../components/modules/HumanResources/HumanResources';
import DutyRoster from '../../components/modules/DutyRoster/DutyRoster';
import AnnualCalendar from '../../components/modules/AnnualCalendar/AnnualCalendarSimple';
import TPAManagement from '../../components/modules/TPAManagement/TPAManagement';
import Finance from '../../components/modules/Finance/Finance';
import Income from '../../components/modules/Finance/Income';
import Expense from '../../components/modules/Finance/Expense';
import Messaging from '../../components/modules/Messaging/Messaging_new';
import Inventory from '../../components/modules/Inventory/Inventory';
import MedicineManagement from '../../components/modules/MedicineManagement/MedicineManagement';
import DownloadCenter from '../../components/modules/DownloadCenter/DownloadCenter';
import LiveConsultation from '../../components/modules/LiveConsultation/LiveConsultation';
import Consultation from '../../components/modules/LiveConsultation/Consultation';
import Meeting from '../../components/modules/LiveConsultation/Meeting';
import InsuranceDocumentation from '../../components/modules/InsuranceDocumentation/InsuranceDocumentation';
import Reports from '../../components/modules/Reports/Reports';
import Setup from '../../components/modules/Setup/Setup';
import { 
  Box, 
  Flex, 
  Heading, 
  Link, 
  Icon, 
  VStack, 
  Collapse, 
  Text, 
  IconButton, 
  Tooltip,
  HStack,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Badge
} from '@chakra-ui/react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Calendar, 
  Stethoscope, 
  BedDouble, 
  Pill, 
  Microscope, 
  Building,
  UserCheck,
  ClipboardList,
  CalendarDays,
  Shield,
  DollarSign,
  MessageSquare,
  Package,
  Download,
  Video,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Notebook,
  Menu as MenuIcon,
  ChevronLeft,
  Bell,
  Search,
  User,
  LogOut,
  UserCircle,
  HelpCircle
} from 'lucide-react';

// Create context for sidebar state
const SidebarContext = createContext();

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

const sidebarNavItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/appointments', label: 'Appointments', icon: Calendar },
  { href: '/admin/patients', label: 'Patient Management', icon: Users },
  { href: '/admin/opd', label: 'OPD - Out Patient', icon: Stethoscope },
  { href: '/admin/ipd', label: 'IPD - In Patient', icon: BedDouble },
  { 
    href: '/admin/live-consultation', 
    label: 'Live Consultation', 
    icon: Video,
    hasSubItems: true,
    subItems: [
      { href: '/admin/live-consultation/consultation', label: 'Live Consultation', icon: Video },
      { href: '/admin/live-consultation/meeting', label: 'Live Meeting', icon: Users },
    ]
  },
  { href: '/admin/billing', label: 'Billing', icon: FileText },
  { href: '/admin/draft', label: 'Draft Bills', icon: FileText },
  { href: '/admin/hr', label: 'Human Resources', icon: UserCheck },
  { href: '/admin/duty-roster', label: 'Duty Roster', icon: ClipboardList },
  { href: '/admin/calendar', label: 'Annual Calendar', icon: CalendarDays },
  { href: '/admin/tpa', label: 'TPA Management', icon: Shield },
  { 
    href: '/admin/finance', 
    label: 'Finance', 
    icon: DollarSign,
    hasSubItems: true,
    subItems: [
      { href: '/admin/finance/income', label: 'Income', icon: TrendingUp },
      { href: '/admin/finance/expense', label: 'Expense', icon: TrendingDown },
    ]
  },
  { href: '/admin/messaging', label: 'Messaging', icon: MessageSquare },
  { href: '/admin/inventory', label: 'Inventory', icon: Package },
  { href: '/admin/medicine-management', label: 'Medicine Management', icon: Pill },
  { href: '/admin/downloads', label: 'Download Center', icon: Download },
  { href: '/admin/pharmacy', label: 'Pharmacy', icon: Pill },
  { href: '/admin/insurance-docs', label: 'Insurance Documentation', icon: FileText },
  { 
    href: '/admin/reports', 
    label: 'Reports & Analytics', 
    icon: BarChart3,
    hasSubItems: true,
    subItems: [
      { href: '/admin/reports/finance', label: 'Finance Reports', icon: DollarSign },
      { href: '/admin/reports/appointment', label: 'Appointment Reports', icon: Calendar },
      { href: '/admin/reports/opd', label: 'OPD Reports', icon: Stethoscope },
      { href: '/admin/reports/ipd', label: 'IPD Reports', icon: BedDouble },
      { href: '/admin/reports/pharmacy', label: 'Pharmacy Reports', icon: Pill },
      { href: '/admin/reports/hr', label: 'HR Reports', icon: UserCheck },
      { href: '/admin/reports/tpa', label: 'TPA Reports', icon: Shield },
      { href: '/admin/reports/consultation', label: 'Consultation Reports', icon: Video },
      { href: '/admin/reports/logs', label: 'Log Reports', icon: FileText },
      { href: '/admin/reports/patients', label: 'Patient Reports', icon: Users },
    ]
  },
  { href: '/admin/setup', label: 'System Setup', icon: Settings },
];

const AdminLayout = () => {
  const [expandedItems, setExpandedItems] = useState({});
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/login');
    }
  };

  const toggleExpanded = (href) => {
    setExpandedItems(prev => ({
      ...prev,
      [href]: !prev[href]
    }));
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    // Close all expanded items when collapsing
    if (!sidebarCollapsed) {
      setExpandedItems({});
    }
  };

  const renderNavItem = (item) => {
    const isActive = location.pathname === item.href || 
                    (item.subItems && item.subItems.some(sub => location.pathname === sub.href));
    const isExpanded = expandedItems[item.href];

    if (sidebarCollapsed) {
      // Render minimal icon-only version when collapsed
      return (
        <Tooltip 
          key={item.href} 
          label={item.label} 
          placement="right" 
          hasArrow
          bg="gray.700"
          color="white"
        >
          <Link
            as={RouterLink}
            to={item.href}
            p={3}
            borderRadius="md"
            bg={isActive ? 'blue.600' : 'transparent'}
            _hover={{ bg: isActive ? 'blue.600' : 'gray.700' }}
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="sm"
            textDecoration="none"
            position="relative"
          >
            <Icon as={item.icon} size={20} />
            {/* Active indicator */}
            {isActive && (
              <Box
                position="absolute"
                right="2px"
                w="3px"
                h="20px"
                bg="blue.300"
                borderRadius="full"
              />
            )}
          </Link>
        </Tooltip>
      );
    }

    // Render full version when expanded
    if (item.hasSubItems) {
      return (
        <Box key={item.href}>
          <Link
            onClick={() => toggleExpanded(item.href)}
            p={3}
            borderRadius="md"
            bg={isActive ? 'blue.600' : 'transparent'}
            _hover={{ bg: isActive ? 'blue.600' : 'gray.700' }}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            fontSize="sm"
            textDecoration="none"
            cursor="pointer"
          >
            <Flex alignItems="center">
              <Icon as={item.icon} mr={3} size={18} />
              {item.label}
            </Flex>
            <Icon as={isExpanded ? ChevronDown : ChevronRight} size={16} />
          </Link>
          <Collapse in={isExpanded}>
            <VStack spacing={1} align="stretch" pl={6} mt={1}>
              {item.subItems.map(subItem => (
                <Link
                  as={RouterLink}
                  to={subItem.href}
                  key={subItem.href}
                  p={2}
                  borderRadius="md"
                  bg={location.pathname === subItem.href ? 'blue.500' : 'transparent'}
                  _hover={{ bg: location.pathname === subItem.href ? 'blue.500' : 'gray.700' }}
                  display="flex"
                  alignItems="center"
                  fontSize="sm"
                  textDecoration="none"
                >
                  <Icon as={subItem.icon} mr={3} size={16} />
                  {subItem.label}
                </Link>
              ))}
            </VStack>
          </Collapse>
        </Box>
      );
    }

    return (
      <Link
        as={RouterLink}
        to={item.href}
        key={item.href}
        p={3}
        borderRadius="md"
        bg={location.pathname === item.href ? 'blue.600' : 'transparent'}
        _hover={{ bg: location.pathname === item.href ? 'blue.600' : 'gray.700' }}
        display="flex"
        alignItems="center"
        fontSize="sm"
        textDecoration="none"
      >
        <Icon as={item.icon} mr={3} size={18} />
        {item.label}
      </Link>
    );
  };

  return (
    <SidebarContext.Provider value={{ sidebarCollapsed, toggleSidebar }}>
      <Flex h="100vh" direction="column">
        {/* Top Navigation Bar - Fixed */}
        <Box
          bg="rgba(255, 255, 255, 0.95)"
          backdropFilter="blur(20px)"
          borderBottom="1px solid"
          borderColor="rgba(226, 232, 240, 0.8)"
          position="fixed"
          top={0}
          left={sidebarCollapsed ? "70px" : "250px"}
          right={0}
          zIndex={999}
          transition="all 0.3s ease-in-out"
          boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
        >
          <Flex
            h="70px"
            align="center"
            justify="space-between"
            px={6}
            maxW="1400px"
            mx="auto"
          >
            {/* Left Side - Logo and Title */}
            <HStack spacing={4}>
              <Box
                w="40px"
                h="40px"
                borderRadius="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
                overflow="hidden"
                bg="white"
                boxShadow="sm"
              >
                <img 
                  src="/Shatayu TM logo.jpg" 
                  alt="Shatayu Logo" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
              <VStack align="start" spacing={0}>
                <Text fontSize="lg" fontWeight="bold" color="gray.800">
                  Ayurvedic Hospital
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Admin Portal
                </Text>
              </VStack>
            </HStack>

            {/* Right Side - Navigation Items */}
            <HStack spacing={4}>
              {/* Search */}
              <IconButton
                icon={<Search size={20} />}
                variant="ghost"
                borderRadius="lg"
                _hover={{ bg: "gray.100" }}
                aria-label="Search"
              />

              {/* Notifications */}
              <IconButton
                icon={<Bell size={20} />}
                variant="ghost"
                borderRadius="lg"
                _hover={{ bg: "gray.100" }}
                position="relative"
                aria-label="Notifications"
              >
                <Badge
                  position="absolute"
                  top="0"
                  right="0"
                  colorScheme="red"
                  borderRadius="full"
                  w="16px"
                  h="16px"
                  fontSize="8px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  3
                </Badge>
              </IconButton>

              {/* Help */}
              <IconButton
                icon={<HelpCircle size={20} />}
                variant="ghost"
                borderRadius="lg"
                _hover={{ bg: "gray.100" }}
                aria-label="Help"
              />

              {/* User Menu */}
              <Menu>
                <MenuButton>
                  <HStack
                    spacing={3}
                    p={2}
                    borderRadius="lg"
                    _hover={{ bg: "gray.100" }}
                    cursor="pointer"
                    transition="all 0.2s"
                  >
                    <Avatar 
                      size="sm" 
                      name={user?.name || "Admin User"} 
                      bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      color="white"
                    />
                    <VStack align="start" spacing={0} display={{ base: "none", md: "flex" }}>
                      <Text fontSize="sm" fontWeight="medium" color="gray.800">
                        {user?.name || "Admin User"}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || "System Administrator"}
                      </Text>
                    </VStack>
                    <ChevronDown size={16} color="#718096" />
                  </HStack>
                </MenuButton>
                <MenuList
                  bg="white"
                  border="1px solid"
                  borderColor="gray.200"
                  boxShadow="lg"
                  borderRadius="xl"
                  minW="200px"
                >
                  <MenuItem icon={<UserCircle size={16} />} _hover={{ bg: "gray.50" }}>
                    Profile Settings
                  </MenuItem>
                  <MenuItem icon={<Settings size={16} />} _hover={{ bg: "gray.50" }}>
                    Account Settings
                  </MenuItem>
                  <MenuItem icon={<HelpCircle size={16} />} _hover={{ bg: "gray.50" }}>
                    Help & Support
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem 
                    icon={<LogOut size={16} />} 
                    _hover={{ bg: "red.50", color: "red.600" }}
                    color="red.500"
                    onClick={handleLogout}
                  >
                    Sign Out
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>
        </Box>

        <Flex h="100vh">
          {/* Collapsible Sidebar */}
          <Box 
            w={sidebarCollapsed ? "70px" : "250px"} 
            bg="gray.800" 
            color="white" 
            h="100vh" 
            p={sidebarCollapsed ? 2 : 4} 
            overflowY="auto" 
            position="fixed" 
            left={0} 
            top={0} 
            zIndex={1000}
            transition="all 0.3s ease-in-out"
            boxShadow="lg"
          >
            {/* Header Section */}
            <Flex align="center" justify={sidebarCollapsed ? "center" : "space-between"} mb={6}>
              {!sidebarCollapsed && (
                <Heading as="h2" size="lg" color="white">
                  Admin Portal
                </Heading>
              )}
              
              {/* Toggle Button */}
              <IconButton
                icon={sidebarCollapsed ? <MenuIcon size={18} /> : <ChevronLeft size={18} />}
                variant="ghost"
                color="white"
                size="sm"
                onClick={toggleSidebar}
                _hover={{ bg: "gray.700" }}
                borderRadius="md"
                aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              />
            </Flex>

            {/* Logo/Brand Section for Collapsed State */}
            {sidebarCollapsed && (
              <Flex justify="center" mb={4}>
                <Box
                  w="40px"
                  h="40px"
                  borderRadius="lg"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  overflow="hidden"
                  bg="white"
                  boxShadow="sm"
                >
                  <img 
                    src="/Shatayu TM logo.jpg" 
                    alt="Shatayu Logo" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
              </Flex>
            )}

            {/* Navigation Items */}
            <VStack as="nav" spacing={sidebarCollapsed ? 2 : 1} align="stretch">
              {sidebarNavItems.map(renderNavItem)}
            </VStack>

            {/* Footer/Version info for collapsed state */}
            {sidebarCollapsed && (
              <Box position="absolute" bottom={4} left="50%" transform="translateX(-50%)">
                <Box 
                  w="3px" 
                  h="20px" 
                  bg="blue.400" 
                  borderRadius="full" 
                  opacity={0.6}
                />
              </Box>
            )}
          </Box>

          {/* Main Content Area */}
          <Box 
            flex="1" 
            bg="gray.50" 
            ml={sidebarCollapsed ? "70px" : "250px"} 
            mt="70px"
            minH="calc(100vh - 70px)" 
            overflowX="auto" 
            maxW={sidebarCollapsed ? "calc(100vw - 70px)" : "calc(100vw - 250px)"}
            transition="all 0.3s ease-in-out"
            p={6}
          >
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="patients" element={<PatientList />} />
              <Route path="appointments" element={<AppointmentManagement />} />
              <Route path="opd" element={<OPD />} />
              <Route path="patient-details/:id" element={<PatientDetails />} />
              <Route path="ipd" element={<IPD />} />
              <Route path="billing" element={<BillingManagement />} />
              <Route path="draft" element={<Draft />} />
              <Route path="hr" element={<HumanResources />} />
              <Route path="duty-roster" element={<DutyRoster />} />
              <Route path="calendar" element={<AnnualCalendar />} />
              <Route path="tpa" element={<TPAManagement />} />
              <Route path="finance" element={<Finance />} />
              <Route path="finance/income" element={<Income />} />
              <Route path="finance/expense" element={<Expense />} />
              <Route path="messaging" element={<Messaging />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="medicine-management" element={<MedicineManagement />} />
              <Route path="downloads" element={<DownloadCenter />} />
              <Route path="insurance-docs" element={<InsuranceDocumentation />} />
              <Route path="live-consultation" element={<LiveConsultation />} />
              <Route path="live-consultation/consultation" element={<Consultation />} />
              <Route path="live-consultation/meeting" element={<Meeting />} />
              <Route path="reports" element={<Reports />} />
              <Route path="setup" element={<Setup />} />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Routes>
          </Box>
        </Flex>
      </Flex>
    </SidebarContext.Provider>
  );
};

export default AdminLayout;
