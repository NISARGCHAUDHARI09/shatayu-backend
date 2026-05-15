import React, { useState } from 'react';
import { Link as RouterLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Box, Badge, Flex, HStack, VStack, IconButton, Menu, MenuButton, MenuList, MenuItem, Avatar, MenuDivider, Heading, Link, Icon, Text } from '@chakra-ui/react';
import { LayoutDashboard, User, Stethoscope, BedDouble, FileText, Search, Bell, HelpCircle, ChevronDown, UserCircle, Settings, LogOut, Menu as MenuIcon, ChevronLeft, Video, CalendarDays, Package, MessageSquare, Users, Pill } from 'lucide-react';

const sidebarNavItems = [
  { href: '/doctor/opd', label: 'OPD', icon: Stethoscope },
  { href: '/doctor/ipd', label: 'IPD', icon: BedDouble },
  { href: '/doctor/patients', label: 'Patient', icon: User },
  { href: '/doctor/live-consultation', label: 'Live Consultation', icon: Video },
  { href: '/doctor/live-consultation/meeting', label: 'Live Meeting', icon: LayoutDashboard },
  { href: '/doctor/messaging', label: 'Messaging', icon: MessageSquare },
  { href: '/doctor/staff-management', label: 'Staff Management', icon: Users },
  { href: '/doctor/inventory', label: 'Inventory', icon: Package },
  { href: '/doctor/medicine-management', label: 'Medicine Management', icon: Pill },
  { href: '/doctor/calendar', label: 'Calendar', icon: CalendarDays },
  { href: '/doctor/billing', label: 'Billing', icon: FileText },
  { href: '/doctor/draft', label: 'Draft Bills', icon: FileText },
  { href: '/doctor/setup', label: 'Setup', icon: Settings },
];

const DoctorLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  // Sidebar width (responsive)
  const sidebarWidth = { base: '200px', md: '250px' };
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const toggleSidebar = () => setSidebarCollapsed(s => !s);
  const currentSidebarWidth = sidebarCollapsed ? '70px' : sidebarWidth;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/login');
    }
  };

  return (
    <Flex direction="column" minH="100vh">
      {/* Top Navigation Bar - Fixed */}
      <Box
        bg="linear-gradient(90deg, #667eea 0%, #5eead4 50%, #764ba2 100%)"
        boxShadow="0 2px 12px 0 rgba(44, 62, 80, 0.10)"
        borderBottom="1px solid rgba(120, 144, 156, 0.12)"
        position="fixed"
        top={0}
        left={sidebarCollapsed ? '70px' : sidebarWidth}
        right={0}
        zIndex={999}
        style={{ backdropFilter: 'blur(10px)' }}
      >
  <Flex h="70px" align="center" justify="space-between" px={6}>
          <HStack spacing={4}>
            <Box
              w="40px"
              h="40px"
              borderRadius="lg"
              display="flex"
              alignItems="center"
              justifyContent="center"
              overflow="hidden"
              boxShadow="0 2px 8px 0 rgba(44, 62, 80, 0.10)"
              border="1.5px solid rgba(255,255,255,0.25)"
              bg="white"
            >
              <img 
                src="/Shatayu TM logo.jpg" 
                alt="Shatayu Logo" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Box>
            <VStack align="start" spacing={0}>
              <Text fontSize="xl" fontWeight="bold" color="#fff" textShadow="0 1px 8px rgba(44,62,80,0.10)">Ayurvedic Hospital</Text>
              <Text fontSize="sm" color="rgba(255,255,255,0.85)">Doctor Portal</Text>
            </VStack>
          </HStack>

          <HStack spacing={3}>
            <IconButton icon={<Search size={18} />} variant="ghost" aria-label="Search" />
            <IconButton icon={<Bell size={18} />} variant="ghost" aria-label="Notifications" />
            <IconButton icon={<HelpCircle size={18} />} variant="ghost" aria-label="Help" />

            <Menu>
              <MenuButton>
                <HStack spacing={3} p={2} borderRadius="md" _hover={{ bg: 'rgba(255,255,255,0.10)' }} cursor="pointer">
                  <Avatar size="sm" name={user?.name || "Dr. User"} bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" color="white" />
                  <VStack align="start" spacing={0} display={{ base: 'none', md: 'flex' }}>
                    <Text fontSize="sm" fontWeight="medium" color="#fff" textShadow="0 1px 8px rgba(44,62,80,0.18)">{user?.name || "Dr. User"}</Text>
                    <Text fontSize="xs" color="rgba(255,255,255,0.85)" textShadow="0 1px 8px rgba(44,62,80,0.10)">{user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || "Doctor"}</Text>
                  </VStack>
                  <ChevronDown size={16} color="#fff" style={{ filter: 'drop-shadow(0 1px 4px rgba(44,62,80,0.18))' }} />
                </HStack>
              </MenuButton>
              <MenuList>
                <MenuItem icon={<UserCircle size={16} />}>Profile</MenuItem>
                <MenuItem icon={<Settings size={16} />}>Settings</MenuItem>
                <MenuDivider />
                <MenuItem icon={<LogOut size={16} />} onClick={handleLogout}>Sign Out</MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
      </Box>

      <Flex>
        {/* Fixed Sidebar */}
        <Box
          as="aside"
          w={sidebarCollapsed ? '70px' : sidebarWidth}
          bg="gray.800"
          color="white"
          h="100vh"
          p={sidebarCollapsed ? 2 : 5}
          position="fixed"
          left={0}
          top={0}
          zIndex={1000}
          boxShadow="md"
          borderRightWidth="1px"
          borderRightColor="gray.700"
          overflowY="auto"
        >
          <Flex align="center" justify="space-between" mb={6}>
            {!sidebarCollapsed && (
              <Heading as="h2" size="lg" fontWeight="semibold">Doctor's Portal</Heading>
            )}
            <IconButton
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              icon={sidebarCollapsed ? <MenuIcon size={18} /> : <ChevronLeft size={18} />}
              size="sm"
              variant="ghost"
              color="white"
              onClick={toggleSidebar}
            />
          </Flex>
          <Flex as="nav" direction="column" gap={1}>
            {sidebarNavItems.map(item => (
              <Link
                as={RouterLink}
                to={item.href}
                key={item.href}
                py={2}
                px={sidebarCollapsed ? 2 : 3}
                borderRadius="md"
                bg={location.pathname.startsWith(item.href) ? 'gray.700' : 'transparent'}
                _hover={{ bg: 'gray.700' }}
                display="flex"
                alignItems="center"
                fontWeight="medium"
                fontSize="md"
              >
                <Icon as={item.icon} mr={sidebarCollapsed ? 0 : 3} boxSize={6} />
                {!sidebarCollapsed && item.label}
              </Link>
            ))}
          </Flex>
        </Box>

        {/* Main Content Area */}
        <Box as="main" flex="1" p={{ base: 2, md: 6 }} bg="gray.50" minH="100vh" overflowY="auto" ml={sidebarCollapsed ? '70px' : sidebarWidth} mt="70px">
          {/* Use full width for pages/tables; remove extra centered gaps */}
          <Box w="100%">
            <Outlet />
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
};

export default DoctorLayout;
