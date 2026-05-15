// src/pages/Login.jsx
import React, { useState } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  Card,
  CardBody,
  Heading,
  InputGroup,
  InputRightElement,
  IconButton,
  Flex,
  Circle,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🚀 Login form submitted with:', { email });
      const result = await login(email, password);
      console.log('📊 Login result:', result);
      
      if (result && result.success) {
        console.log('✅ Login successful, redirecting based on role:', result.user.role);
        // Navigate based on user role
        switch (result.user.role) {
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'doctor':
            navigate('/doctor/opd');
            break;
          case 'patient':
            navigate('/patient');
            break;
          default:
            navigate('/');
        }
      } else {
        console.log('❌ Login failed:', result);
        setError('The username or password is incorrect');
      }
    } catch (err) {
      console.error('💥 Login error:', err);
      setError('The username or password is incorrect');
    } finally {
      setLoading(false);
    }
  };

  const bgGradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

  return (
    <Box
      minH="100vh"
      bg={bgGradient}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
      position="relative"
      overflow="hidden"
    >
      {/* Background decorative elements */}
      <Circle size="200px" bg="rgba(255,255,255,0.1)" position="absolute" top="10%" left="5%" />
      <Circle size="150px" bg="rgba(255,255,255,0.05)" position="absolute" top="60%" right="10%" />
      <Circle size="100px" bg="rgba(255,255,255,0.08)" position="absolute" bottom="20%" left="15%" />
      <Box
        position="absolute"
        top="20%"
        right="20%"
        w="80px"
        h="80px"
        bg="rgba(255,255,255,0.03)"
        transform="rotate(45deg)"
        borderRadius="15px"
      />

      <Container maxW="5xl">
        <Card
          bg="white"
          borderRadius="3xl"
          overflow="hidden"
          boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.25)"
          border="none"
        >
          <CardBody p={0}>
            <Flex direction={{ base: 'column', lg: 'row' }} minH="600px">
              {/* Left Side - Illustration */}
              <Box
                flex="1"
                bg="linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={12}
                position="relative"
                overflow="hidden"
              >
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  opacity={0.1}
                  bgImage="data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"
                />
                <VStack spacing={6} textAlign="center" position="relative" zIndex={1}>
                  <Box fontSize="120px" lineHeight="1" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.1))">
                    👨‍⚕️
                  </Box>
                  <VStack spacing={3}>
                    <Heading size="2xl" color="gray.800" fontWeight="bold" letterSpacing="-0.02em">
                      HELLO!
                    </Heading>
                    <Text fontSize="lg" color="gray.600" maxW="300px" lineHeight="1.6">
                      Please enter your details to continue
                    </Text>
                  </VStack>
                </VStack>
              </Box>

              {/* Right Side - Login Form */}
              <Box flex="1" p={12} display="flex" alignItems="center">
                <VStack spacing={8} w="full" maxW="400px" mx="auto">
                  {/* Logo */}
                  <HStack spacing={3} alignSelf="flex-start">
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
                    <Text fontSize="xl" fontWeight="600" color="gray.700">
                      <Text as="span" color="teal.400">
                        LOGO
                      </Text>{' '}
                      Hospital
                    </Text>
                  </HStack>

                  {/* Single Form */}
                  <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <VStack spacing={6} align="stretch">
                      {error && (
                        <Alert status="error" borderRadius="lg" fontSize="sm">
                          <AlertIcon />
                          {error}
                        </Alert>
                      )}

                      <FormControl>
                        <FormLabel fontSize="sm" fontWeight="500" color="gray.700" mb={2}>
                          Email
                        </FormLabel>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          bg="gray.50"
                          border="1px solid"
                          borderColor={error ? 'red.300' : 'gray.200'}
                          borderRadius="lg"
                          _focus={{
                            borderColor: error ? 'red.400' : 'teal.400',
                            boxShadow: error
                              ? '0 0 0 1px #F56565'
                              : '0 0 0 1px #4FD1C7',
                            bg: 'white',
                          }}
                          fontSize="sm"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel fontSize="sm" fontWeight="500" color="gray.700" mb={2}>
                          Password
                        </FormLabel>
                        <InputGroup>
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            bg="gray.50"
                            border="1px solid"
                            borderColor={error ? 'red.300' : 'gray.200'}
                            borderRadius="lg"
                            _focus={{
                              borderColor: error ? 'red.400' : 'teal.400',
                              boxShadow: error
                                ? '0 0 0 1px #F56565'
                                : '0 0 0 1px #4FD1C7',
                              bg: 'white',
                            }}
                            fontSize="sm"
                          />
                          <InputRightElement>
                            <IconButton
                              variant="ghost"
                              size="sm"
                              icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                              onClick={() => setShowPassword(!showPassword)}
                              aria-label={showPassword ? 'Hide password' : 'Show password'}
                              color="gray.400"
                            />
                          </InputRightElement>
                        </InputGroup>
                      </FormControl>

                      <Button
                        type="submit"
                        colorScheme="teal"
                        size="lg"
                        fontWeight="600"
                        fontSize="sm"
                        isLoading={loading}
                        loadingText="Logging in..."
                      >
                        Log In
                      </Button>

                      <Text
                        fontSize="sm"
                        color="teal.500"
                        textAlign="center"
                        cursor="pointer"
                        _hover={{ color: 'teal.600' }}
                      >
                        Forgot Password?
                      </Text>
                    </VStack>
                  </form>
                </VStack>
              </Box>
            </Flex>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;
