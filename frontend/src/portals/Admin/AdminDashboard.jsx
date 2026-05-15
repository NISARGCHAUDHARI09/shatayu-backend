import React from 'react';
import { 
  Box, 
  Flex, 
  Grid, 
  GridItem,
  Heading, 
  Text, 
  Badge,
  Card,
  CardHeader,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Avatar,
  HStack,
  VStack,
  IconButton,
  Button,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Image,
  useColorModeValue
} from '@chakra-ui/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  ChevronLeft, 
  ChevronRight, 
  Bell, 
  Settings, 
  LogOut, 
  User,
  Shield,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { useSidebar } from './AdminLayout';

const AdminDashboard = () => {
  const { sidebarCollapsed } = useSidebar();
  // Mock data for the dashboard
  // Empty data for dashboard UI (no mock values)
  const incomeData = [
    { name: 'Total Patients', value: 0, color: '#4CAF50', icon: '👥' },
    { name: 'OPD Patients', value: 0, color: '#2196F3', icon: '🩺' },
    { name: 'IPD Patients', value: 0, color: '#FF9800', icon: '🏥' },
    { name: 'General Income', value: 0, color: '#9C27B0', icon: '💰' }
  ];

  const expensesData = {
    title: 'Expenses',
    value: 0,
    color: '#F44336'
  };

  const yearlyData = [];

  const monthlyOverviewData = [];

  const staffData = [];

  const calendarData = [];

  return (
    <Box 
      bg="linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)" 
      minH="100vh"
      position="relative"
      overflow="hidden"
    >
      {/* Background Pattern Overlay */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        opacity={0.03}
        bgImage="data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234299e1' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"
        zIndex={0}
      />
      
      {/* Medical Cross Pattern - Top Right */}
      <Box
        position="absolute"
        top="10%"
        right="8%"
        w="100px"
        h="100px"
        opacity={0.02}
        transform="rotate(15deg)"
        zIndex={0}
      >
        <Box
          position="absolute"
          top="40%"
          left="0"
          w="100%"
          h="20%"
          bg="blue.300"
        />
        <Box
          position="absolute"
          top="0"
          left="40%"
          w="20%"
          h="100%"
          bg="blue.300"
        />
      </Box>

      {/* Medical Cross Pattern - Bottom Left */}
      <Box
        position="absolute"
        bottom="15%"
        left="15%"
        w="80px"
        h="80px"
        opacity={0.02}
        transform="rotate(-10deg)"
        zIndex={0}
      >
        <Box
          position="absolute"
          top="40%"
          left="0"
          w="100%"
          h="20%"
          bg="green.300"
        />
        <Box
          position="absolute"
          top="0"
          left="40%"
          w="20%"
          h="100%"
          bg="green.300"
        />
      </Box>

      {/* Subtle Floating Circles */}
      <Box
        position="absolute"
        top="20%"
        left="20%"
        w="200px"
        h="200px"
        borderRadius="full"
        bg="linear-gradient(135deg, rgba(99, 179, 237, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)"
        filter="blur(40px)"
        zIndex={0}
      />
      
      <Box
        position="absolute"
        bottom="25%"
        right="25%"
        w="150px"
        h="150px"
        borderRadius="full"
        bg="linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)"
        filter="blur(35px)"
        zIndex={0}
      />

      {/* Main Content */}
      <Box 
        maxW="1400px" 
        mx="auto" 
        pl={sidebarCollapsed ? "0px" : "0px"}
        transition="all 0.3s ease-in-out"
        position="relative"
        zIndex={1}
      >
        {/* Header Section */}
        <Box
          bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          color="white"
          py={8}
          px={6}
          position="relative"
          overflow="hidden"
          mx={6}
          borderRadius="2xl"
          boxShadow="0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        >
          {/* Background Pattern */}
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            opacity={0.1}
            bgImage="data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"
          />
          
          <VStack spacing={4} position="relative" zIndex={1}>
            <VStack spacing={2}>
              <Heading size="xl" fontWeight="bold" textAlign="center">
                Welcome back, Dr. Admin
              </Heading>
              <Text fontSize="lg" opacity={0.9} textAlign="center">
                Hospital Management Overview • Real-time Analytics
              </Text>
              <HStack spacing={6} mt={4}>
                <HStack spacing={2}>
                  <Box w="3" h="3" bg="green.400" borderRadius="full" />
                  <Text fontSize="sm" opacity={0.8}>System Online</Text>
                </HStack>
                <HStack spacing={2}>
                  <Box w="3" h="3" bg="blue.400" borderRadius="full" />
                  <Text fontSize="sm" opacity={0.8}>Live Updates</Text>
                </HStack>
                <HStack spacing={2}>
                  <Box w="3" h="3" bg="yellow.400" borderRadius="full" />
                  <Text fontSize="sm" opacity={0.8}>3 Alerts</Text>
                </HStack>
              </HStack>
            </VStack>
          </VStack>
        </Box>

        {/* Main Dashboard Content */}
        <Box p={6}>
          {/* Enhanced Statistics Cards */}
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(5, 1fr)" }} gap={6} mb={8}>
            {incomeData.map((item, index) => (
              <Card 
                key={index} 
                bg="rgba(255, 255, 255, 0.9)" 
                backdropFilter="blur(20px)"
                boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.15)"
                borderRadius="2xl"
                border="1px solid"
                borderColor="rgba(255, 255, 255, 0.18)"
                _hover={{ 
                  transform: "translateY(-6px) scale(1.03)", 
                  boxShadow: "0 16px 40px 0 rgba(31, 38, 135, 0.25)",
                  bg: "rgba(255, 255, 255, 0.95)",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                }}
                transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                overflow="hidden"
                position="relative"
              >
                {/* Gradient overlay for extra elegance */}
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  h="2px"
                  bg={`linear-gradient(90deg, ${item.color} 0%, ${item.color}80 100%)`}
                />
                <CardBody p={6}>
                  <VStack spacing={4} align="stretch">
                    <Flex justify="space-between" align="center">
                      <Box
                        p={3}
                        bg={`${item.color}20`}
                        borderRadius="xl"
                        border="1px solid"
                        borderColor={`${item.color}40`}
                      >
                        <Text fontSize="2xl">{item.icon}</Text>
                      </Box>
                      <VStack align="end" spacing={0}>
                        <Text fontSize="2xl" fontWeight="bold" color={item.color}>
                          {item.name.includes('Income') 
                            ? `₹${item.value.toLocaleString()}` 
                            : item.value.toLocaleString()
                          }
                        </Text>
                        <Text fontSize="xs" color="green.500" fontWeight="medium">
                          +12% from last month
                        </Text>
                      </VStack>
                    </Flex>
                    <Box>
                      <Text fontSize="sm" color="gray.600" fontWeight="medium" mb={2}>
                        {item.name}
                      </Text>
                      <Box w="full" h="3" bg="gray.100" borderRadius="full">
                        <Box 
                          w={`${Math.random() * 40 + 60}%`} 
                          h="full" 
                          bg={`linear-gradient(135deg, ${item.color} 0%, ${item.color}CC 100%)`} 
                          borderRadius="full"
                          transition="width 1s ease-in-out"
                        />
                      </Box>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>
            ))}
            
            <Card 
              bg="rgba(255, 255, 255, 0.9)" 
              backdropFilter="blur(20px)"
              boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.15)"
              borderRadius="2xl"
              border="1px solid"
              borderColor="rgba(255, 255, 255, 0.18)"
              _hover={{ 
                transform: "translateY(-6px) scale(1.03)", 
                boxShadow: "0 16px 40px 0 rgba(31, 38, 135, 0.25)",
                bg: "rgba(255, 255, 255, 0.95)",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
              }}
              transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
              overflow="hidden"
              position="relative"
            >
              {/* Gradient overlay */}
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                h="2px"
                bg={`linear-gradient(90deg, ${expensesData.color} 0%, ${expensesData.color}80 100%)`}
              />
              <CardBody p={6}>
                <VStack spacing={4} align="stretch">
                  <Flex justify="space-between" align="center">
                    <Box
                      p={3}
                      bg={`${expensesData.color}20`}
                      borderRadius="xl"
                      border="1px solid"
                      borderColor={`${expensesData.color}40`}
                    >
                      <Text fontSize="2xl">💸</Text>
                    </Box>
                    <VStack align="end" spacing={0}>
                      <Text fontSize="2xl" fontWeight="bold" color={expensesData.color}>
                        ₹{expensesData.value.toLocaleString()}
                      </Text>
                      <Text fontSize="xs" color="red.500" fontWeight="medium">
                        +8% from last month
                      </Text>
                    </VStack>
                  </Flex>
                  <Box>
                    <Text fontSize="sm" color="gray.600" fontWeight="medium" mb={2}>
                      {expensesData.title}
                    </Text>
                    <Box w="full" h="3" bg="gray.100" borderRadius="full">
                      <Box 
                        w="65%" 
                        h="full" 
                        bg={`linear-gradient(135deg, ${expensesData.color} 0%, ${expensesData.color}CC 100%)`} 
                        borderRadius="full" 
                      />
                    </Box>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          </Grid>

          {/* Enhanced Charts Row */}
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={8} mb={8}>
            {/* Yearly Income & Expense Chart */}
            <Card 
              bg="rgba(255, 255, 255, 0.9)" 
              backdropFilter="blur(20px)"
              boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.15)"
              borderRadius="2xl"
              border="1px solid"
              borderColor="rgba(255, 255, 255, 0.18)"
              overflow="hidden"
              _hover={{ 
                boxShadow: "0 12px 40px 0 rgba(31, 38, 135, 0.2)",
                transition: "all 0.3s ease"
              }}
            >
              <CardHeader 
                bg="linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)" 
                borderTopRadius="2xl" 
                py={6}
                backdropFilter="blur(10px)"
              >
                <Flex justify="space-between" align="center">
                  <VStack align="start" spacing={1}>
                    <Heading size="md" color="gray.800">Yearly Income & Expense</Heading>
                    <Text fontSize="sm" color="gray.600">Financial overview for 2025</Text>
                  </VStack>
                  <HStack spacing={2}>
                    <IconButton 
                      size="sm" 
                      icon={<ChevronLeft size={16} />} 
                      variant="ghost"
                      borderRadius="lg"
                      _hover={{ bg: "gray.200" }}
                    />
                    <IconButton 
                      size="sm" 
                      icon={<ChevronRight size={16} />} 
                      variant="ghost"
                      borderRadius="lg"
                      _hover={{ bg: "gray.200" }}
                    />
                  </HStack>
                </Flex>
              </CardHeader>
            <CardBody p={6}>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={yearlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12, fill: '#666' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#666' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                      fontSize: '14px'
                    }} 
                  />
                  <Legend />
                  <Bar 
                    dataKey="Income" 
                    fill="url(#incomeGradient)" 
                    radius={[4, 4, 0, 0]}
                    name="Income (₹)"
                  />
                  <Bar 
                    dataKey="Expenses" 
                    fill="url(#expenseGradient)" 
                    radius={[4, 4, 0, 0]}
                    name="Expenses (₹)"
                  />
                  <defs>
                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4CAF50" stopOpacity={0.3}/>
                    </linearGradient>
                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F44336" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#F44336" stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          {/* Revenue Distribution */}
          <Card 
            bg="rgba(255, 255, 255, 0.9)" 
            backdropFilter="blur(20px)"
            boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.15)"
            borderRadius="2xl"
            border="1px solid"
            borderColor="rgba(255, 255, 255, 0.18)"
            overflow="hidden"
            _hover={{ 
              boxShadow: "0 12px 40px 0 rgba(31, 38, 135, 0.2)",
              transition: "all 0.3s ease"
            }}
          >
            <CardHeader 
              bg="linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)" 
              borderTopRadius="2xl" 
              py={6}
              backdropFilter="blur(10px)"
            >
              <Flex justify="space-between" align="center">
                <VStack align="start" spacing={1}>
                  <Heading size="md" color="gray.800">Revenue Distribution</Heading>
                  <Text fontSize="sm" color="gray.600">Department-wise breakdown</Text>
                </VStack>
                <HStack spacing={2}>
                  <IconButton 
                    size="sm" 
                    icon={<ChevronLeft size={16} />} 
                    variant="ghost"
                    borderRadius="lg"
                    _hover={{ bg: "gray.200" }}
                  />
                  <IconButton 
                    size="sm" 
                    icon={<ChevronRight size={16} />} 
                    variant="ghost"
                    borderRadius="lg"
                    _hover={{ bg: "gray.200" }}
                  />
                </HStack>
              </Flex>
            </CardHeader>
            <CardBody p={6}>
              <Flex direction="column" h="320px">
                <ResponsiveContainer width="100%" height="70%">
                  <PieChart>
                    <Pie
                      data={monthlyOverviewData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {monthlyOverviewData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                        fontSize: '14px'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Legend */}
                <Grid templateColumns="repeat(2, 1fr)" gap={2} mt={4}>
                  {monthlyOverviewData.slice(0, 6).map((item, index) => (
                    <HStack key={index} spacing={2}>
                      <Box w={3} h={3} bg={item.color} borderRadius="full" />
                      <Text fontSize="xs" color="gray.600">{item.name}</Text>
                      <Text fontSize="xs" fontWeight="bold" color="gray.800">{item.value}%</Text>
                    </HStack>
                  ))}
                </Grid>
              </Flex>
            </CardBody>
          </Card>
        </Grid>

        {/* Enhanced Bottom Row */}
        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
          {/* Enhanced Calendar */}
          <Card 
            bg="rgba(255, 255, 255, 0.9)" 
            backdropFilter="blur(20px)"
            boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.15)"
            borderRadius="2xl"
            border="1px solid"
            borderColor="rgba(255, 255, 255, 0.18)"
            overflow="hidden"
            _hover={{ 
              boxShadow: "0 12px 40px 0 rgba(31, 38, 135, 0.2)",
              transition: "all 0.3s ease"
            }}
          >
            <CardHeader 
              bg="linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)" 
              borderTopRadius="2xl" 
              py={6}
              backdropFilter="blur(10px)"
            >
              <Flex justify="space-between" align="center" mb={4}>
                <VStack align="start" spacing={1}>
                  <Heading size="md" color="gray.800">Schedule & Events</Heading>
                  <Text fontSize="sm" color="gray.600">Weekly calendar overview</Text>
                </VStack>
                <HStack spacing={2}>
                  <IconButton 
                    size="sm" 
                    icon={<ChevronLeft size={16} />} 
                    variant="ghost"
                    borderRadius="lg"
                    _hover={{ bg: "gray.200" }}
                  />
                  <Button 
                    size="sm" 
                    bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                    color="white"
                    borderRadius="lg"
                    _hover={{ transform: "translateY(-1px)" }}
                  >
                    Today
                  </Button>
                  <IconButton 
                    size="sm" 
                    icon={<ChevronRight size={16} />} 
                    variant="ghost"
                    borderRadius="lg"
                    _hover={{ bg: "gray.200" }}
                  />
                </HStack>
              </Flex>
              <Text fontSize="lg" fontWeight="semibold" color="gray.700">August 24 – 30 2025</Text>
              <HStack mt={3} spacing={2}>
                <Button size="xs" variant="outline" borderRadius="lg">Month</Button>
                <Button size="xs" bg="gray.600" color="white" borderRadius="lg">Week</Button>
                <Button size="xs" variant="outline" borderRadius="lg">Day</Button>
              </HStack>
            </CardHeader>
            <CardBody p={6}>
              <Grid templateColumns="repeat(7, 1fr)" gap={3}>
                {calendarData.map((day, index) => (
                  <Box 
                    key={index} 
                    p={3} 
                    border="1px" 
                    borderColor="gray.100" 
                    minH="140px"
                    borderRadius="xl"
                    bg="gray.50"
                    _hover={{ bg: "gray.100", transform: "translateY(-1px)", transition: "all 0.2s" }}
                    transition="all 0.2s"
                  >
                    <Text fontSize="sm" fontWeight="semibold" mb={2} color="gray.700">
                      {day.day}
                    </Text>
                    {day.events.map((event, eventIndex) => (
                      <Box 
                        key={eventIndex} 
                        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                        color="white" 
                        p={2} 
                        mb={1} 
                        borderRadius="lg" 
                        fontSize="xs"
                        fontWeight="medium"
                        boxShadow="sm"
                      >
                        {event}
                      </Box>
                    ))}
                  </Box>
                ))}
              </Grid>
            </CardBody>
          </Card>

          {/* Enhanced Staff Overview */}
          <Card 
            bg="rgba(255, 255, 255, 0.9)" 
            backdropFilter="blur(20px)"
            boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.15)"
            borderRadius="2xl"
            border="1px solid"
            borderColor="rgba(255, 255, 255, 0.18)"
            overflow="hidden"
            _hover={{ 
              boxShadow: "0 12px 40px 0 rgba(31, 38, 135, 0.2)",
              transition: "all 0.3s ease"
            }}
          >
            <CardHeader 
              bg="linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)" 
              borderTopRadius="2xl" 
              py={6}
              backdropFilter="blur(10px)"
            >
              <VStack align="start" spacing={1}>
                <Heading size="md" color="gray.800">Team Overview</Heading>
                <Text fontSize="sm" color="gray.600">Staff distribution by department</Text>
              </VStack>
            </CardHeader>
            <CardBody p={6}>
              <VStack spacing={4} align="stretch">
                {staffData.map((staff, index) => (
                  <Box key={index}>
                    <Flex justify="space-between" align="center" p={3} borderRadius="xl" _hover={{ bg: "gray.50" }}>
                      <HStack spacing={3}>
                        <Avatar 
                          size="md" 
                          bg={staff.color} 
                          color="white"
                          name={staff.role}
                          fontWeight="bold"
                          boxShadow="md"
                        />
                        <VStack align="start" spacing={0}>
                          <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                            {staff.role}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            Active members
                          </Text>
                        </VStack>
                      </HStack>
                      <Badge 
                        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        color="white"
                        variant="solid"
                        borderRadius="full"
                        px={3}
                        py={1}
                        fontSize="sm"
                        fontWeight="bold"
                      >
                        {staff.count}
                      </Badge>
                    </Flex>
                    {index < staffData.length - 1 && <Divider my={1} />}
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </Card>
        </Grid>
      </Box>
    </Box>
  </Box>
  );
};

export default AdminDashboard;
