import React from 'react';
import {
  Box,
  HStack,
  VStack,
  Avatar,
  Text,
  Badge,
  Button,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton
} from '@chakra-ui/react';
import { ChevronDownIcon, SettingsIcon } from '@chakra-ui/icons';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Force logout anyway
      navigate('/login');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'red';
      case 'doctor': return 'green';
      case 'patient': return 'blue';
      case 'staff': return 'yellow';
      default: return 'gray';
    }
  };

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Menu>
      <MenuButton
        as={Button}
        variant="ghost"
        size="sm"
        rightIcon={<ChevronDownIcon />}
        _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
        _active={{ bg: useColorModeValue('gray.200', 'gray.600') }}
        p={2}
      >
        <HStack spacing={3}>
          <Avatar
            size="sm"
            name={user.name}
            bg="blue.500"
            color="white"
            fontWeight="bold"
          />
          <VStack spacing={0} align="start" display={{ base: 'none', md: 'flex' }}>
            <Text fontSize="sm" fontWeight="medium" color="gray.900">
              {user.name}
            </Text>
            <Badge
              colorScheme={getRoleBadgeColor(user.role)}
              size="sm"
              fontSize="xs"
            >
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Badge>
          </VStack>
        </HStack>
      </MenuButton>
      
      <MenuList bg={bgColor} borderColor={borderColor} shadow="lg">
        <Box p={3} borderBottom="1px" borderColor={borderColor}>
          <Text fontWeight="medium" fontSize="sm">
            {user.name}
          </Text>
          <Text fontSize="xs" color="gray.500">
            {user.email}
          </Text>
          <Badge
            colorScheme={getRoleBadgeColor(user.role)}
            size="sm"
            mt={1}
          >
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </Badge>
        </Box>
        
        <MenuItem icon={<SettingsIcon />} fontSize="sm">
          Profile Settings
        </MenuItem>
        
        <MenuDivider />
        
        <MenuItem 
          onClick={handleLogout}
          fontSize="sm"
          color="red.600"
          _hover={{ bg: 'red.50' }}
        >
          Sign Out
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default UserProfile;