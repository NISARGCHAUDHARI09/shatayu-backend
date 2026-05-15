import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Box, Text, Button, VStack, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: ('admin' | 'doctor' | 'staff' | 'patient')[];
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles = [], 
  fallbackPath = '/login' 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Show loading while authentication state is being determined
  if (isLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height="100vh"
        bg="gray.50"
      >
        <VStack spacing={4}>
          <Text fontSize="lg" color="gray.600">
            Loading...
          </Text>
        </VStack>
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Check if user has required role
  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height="100vh"
        bg="gray.50"
        p={8}
      >
        <VStack spacing={6} maxWidth="md" textAlign="center">
          <Alert status="warning" borderRadius="lg">
            <AlertIcon />
            <Box>
              <AlertTitle>Access Denied!</AlertTitle>
              <AlertDescription>
                You don't have permission to access this page. 
                Required role(s): {requiredRoles.join(', ')}
              </AlertDescription>
            </Box>
          </Alert>
          
          <VStack spacing={2}>
            <Text fontSize="sm" color="gray.600">
              Current role: {user.role}
            </Text>
            <Text fontSize="sm" color="gray.600">
              Logged in as: {user.username} ({user.email})
            </Text>
          </VStack>
          
          <Button 
            colorScheme="blue" 
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </VStack>
      </Box>
    );
  }

  // User is authenticated and has required permissions
  return <>{children}</>;
};

// Higher-order component for specific role requirements
export const AdminOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRoles={['admin']}>
    {children}
  </ProtectedRoute>
);

export const DoctorRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRoles={['doctor', 'admin']}>
    {children}
  </ProtectedRoute>
);

export const StaffRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRoles={['staff', 'doctor', 'admin']}>
    {children}
  </ProtectedRoute>
);

export default ProtectedRoute;