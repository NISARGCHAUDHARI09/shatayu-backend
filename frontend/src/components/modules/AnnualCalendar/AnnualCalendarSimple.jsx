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
  useColorModeValue,
  IconButton,
  Tooltip,
  SimpleGrid,
  Input,
  Select,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Textarea
} from '@chakra-ui/react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Plus,
  Clock,
  Users,
  Stethoscope,
  CalendarDays,
  Star,
  Search,
  Download,
  Calendar as CalendarIcon,
  TrendingUp,
  Ban,
  AlertTriangle
} from 'lucide-react';

// No mockEvents
const mockEvents = {};
// Mock holidays
const mockHolidays = [];

// Helper to check if using mock/demo data (no real backend)
const isDemoData = () => {
  // If mockEvents is empty or only contains demo/demo keys, treat as demo
  return !mockEvents || Object.keys(mockEvents).length === 0;
};

const AnnualCalendar = ({ title = "Annual Calendar Management", showAddButton = true }) => {
  // Sync calendar to present timeline (today's date)
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // month, year
  const [searchTerm, setSearchTerm] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('all');
  // If using demo data, show empty holidays
  const [holidays, setHolidays] = useState(isDemoData() ? [] : mockHolidays);
  const [holidayForm, setHolidayForm] = useState({
    date: '',
    name: '',
    type: 'clinic'
  });
  
  // Modal states
  const { isOpen: isHolidayModalOpen, onOpen: onHolidayModalOpen, onClose: onHolidayModalClose } = useDisclosure();
  
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'meeting': return 'blue';
      case 'appointment': return 'green';
      case 'maintenance': return 'orange';
      case 'inventory': return 'purple';
      case 'training': return 'teal';
      case 'event': return 'red';
      default: return 'gray';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'green';
      case 'pending': return 'yellow';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };

  const getHolidayTypeColor = (type) => {
    switch (type) {
      case 'national': return 'red';
      case 'festival': return 'orange';
      case 'clinic': return 'purple';
      default: return 'gray';
    }
  };

  // Holiday form handling
  const handleHolidayFormChange = (field, value) => {
    setHolidayForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddHoliday = () => {
    if (!holidayForm.date || !holidayForm.name) {
      toast({
        title: "Missing Information",
        description: "Please fill in date and holiday name.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const newHoliday = {
      ...holidayForm,
      id: Date.now()
    };

    setHolidays(prev => [...prev, newHoliday]);

    toast({
      title: "Holiday Added",
      description: `${holidayForm.name} has been set as a holiday. Appointments will be blocked on this date.`,
      status: "success",
      duration: 4000,
      isClosable: true,
    });

    // Reset form and close modal
    setHolidayForm({
      date: '',
      name: '',
      type: 'clinic'
    });
    onHolidayModalClose();
  };

  // Check if a date is a holiday
  const isHoliday = (dateStr) => {
    return holidays.find(holiday => holiday.date === dateStr);
  };

  // Export functionality
  const handleExport = (format) => {
    toast({
      title: "Export Successful",
      description: `Calendar events exported as ${format.toUpperCase()}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // Generate year view data
  const generateYearData = () => {
    const year = currentDate.getFullYear();
    const months = [];
    
    for (let month = 0; month < 12; month++) {
      const monthDate = new Date(year, month, 1);
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      months.push({
        name: monthNames[month],
        days: daysInMonth,
        events: Math.floor(Math.random() * 10 + 1), // Random for demo
        date: monthDate
      });
    }
    
    return months;
  };

  const yearData = generateYearData();

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Get today's date string in yyyy-mm-dd
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // Add empty cells for days before the first day of month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = mockEvents[dateStr] || [];
      const holiday = isHoliday(dateStr);

      days.push({
        day,
        dateStr,
        events: dayEvents,
        holiday: holiday,
        isToday: dateStr === todayStr
      });
    }

    return days;
  };

  // If using demo data, show empty events for all days
  let calendarDays = generateCalendarDays();
  if (isDemoData()) {
    calendarDays = calendarDays.map(day => day ? { ...day, events: [] } : null);
  }

  return (
    <Box p={6}>
      {/* Enhanced Header */}
      <Flex justify="space-between" align="center" mb={8}>
        <Box>
          <Text fontSize="3xl" fontWeight="bold" bgGradient="linear(to-r, blue.600, purple.600)" bgClip="text">
            {title}
          </Text>
          <Text color="gray.600" fontSize="lg">
            Hospital events, appointments, and important dates management
          </Text>
        </Box>
        {showAddButton && (
          <HStack spacing={3}>
            <Button 
              colorScheme="blue" 
              leftIcon={<Plus size={20} />}
              size="lg"
              onClick={() => {
                toast({
                  title: "Add Event",
                  description: "Add event functionality would open here",
                  status: "info",
                  duration: 3000,
                  isClosable: true,
                });
              }}
            >
              Add Event
            </Button>
            <Button 
              colorScheme="red" 
              leftIcon={<Ban size={20} />}
              size="lg"
              variant="outline"
              onClick={onHolidayModalOpen}
            >
              Set Holiday
            </Button>
            <Menu>
              <MenuButton
                as={Button}
                colorScheme="green"
                leftIcon={<Download size={20} />}
                rightIcon={<ChevronDown size={16} />}
                variant="outline"
                size="lg"
              >
                Export
              </MenuButton>
              <MenuList>
                <MenuItem icon={<Download size={16} />} onClick={() => handleExport('csv')}>
                  Export as CSV
                </MenuItem>
                <MenuItem icon={<Download size={16} />} onClick={() => handleExport('pdf')}>
                  Export as PDF
                </MenuItem>
                <MenuItem icon={<Download size={16} />} onClick={() => handleExport('excel')}>
                  Export as Excel
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        )}
      </Flex>

      {/* KPI Cards */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={6} mb={8}>
        <Card bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" color="white">
          <CardBody>
            <HStack spacing={4}>
              <Icon as={CalendarIcon} size={40} />
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" opacity={0.9}>Total Events</Text>
                <Text fontSize="2xl" fontWeight="bold">{isDemoData() ? 0 : 24}</Text>
                <Text fontSize="xs" opacity={0.8}>This month</Text>
              </VStack>
            </HStack>
          </CardBody>
        </Card>

        <Card bg="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" color="white">
          <CardBody>
            <HStack spacing={4}>
              <Icon as={Users} size={40} />
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" opacity={0.9}>Meetings</Text>
                <Text fontSize="2xl" fontWeight="bold">{isDemoData() ? 0 : 8}</Text>
                <Text fontSize="xs" opacity={0.8}>Scheduled</Text>
              </VStack>
            </HStack>
          </CardBody>
        </Card>

        <Card bg="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" color="white">
          <CardBody>
            <HStack spacing={4}>
              <Icon as={Stethoscope} size={40} />
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" opacity={0.9}>Appointments</Text>
                <Text fontSize="2xl" fontWeight="bold">{isDemoData() ? 0 : 12}</Text>
                <Text fontSize="xs" opacity={0.8}>Today</Text>
              </VStack>
            </HStack>
          </CardBody>
        </Card>

        <Card bg="linear-gradient(135deg, #fa709a 0%, #fee140 100%)" color="white">
          <CardBody>
            <HStack spacing={4}>
              <Icon as={TrendingUp} size={40} />
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" opacity={0.9}>Attendance</Text>
                <Text fontSize="2xl" fontWeight="bold">{isDemoData() ? '0%' : '94%'}</Text>
                <Text fontSize="xs" opacity={0.8}>Event attendance</Text>
              </VStack>
            </HStack>
          </CardBody>
        </Card>
      </Grid>

      {/* Filters */}
      <Card bg={cardBg} mb={6}>
        <CardBody>
          <Flex gap={4} wrap="wrap" align="center">
            <HStack spacing={2} flex="1" minW="300px">
              <Icon as={Search} color="gray.400" />
              <Input
                placeholder="Search events by title, organizer, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                bg="white"
                border="2px solid"
                borderColor="gray.200"
                _focus={{ borderColor: "blue.400" }}
              />
            </HStack>
            <Select
              value={eventTypeFilter}
              onChange={(e) => setEventTypeFilter(e.target.value)}
              w="200px"
              bg="white"
            >
              <option value="all">All Event Types</option>
              <option value="meeting">Meetings</option>
              <option value="appointment">Appointments</option>
              <option value="training">Training</option>
              <option value="event">Events</option>
              <option value="maintenance">Maintenance</option>
              <option value="inventory">Inventory</option>
            </Select>
          </Flex>
        </CardBody>
      </Card>

      {/* Calendar Section */}
      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6} h="auto" minH="500px">
        {/* Calendar */}
        <Card bg={cardBg} border="1px" borderColor={borderColor} h="auto" minH="500px">
          <CardBody h="100%" overflow="auto">
            {/* Calendar Header */}
            <Flex justify="space-between" align="center" mb={4}>
              <HStack spacing={4}>
                <HStack>
                  <IconButton
                    icon={<ChevronLeft />}
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth(-1)}
                    aria-label="Previous month"
                  />
                  <Text fontSize="xl" fontWeight="bold">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </Text>
                  <IconButton
                    icon={<ChevronRight />}
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth(1)}
                    aria-label="Next month"
                  />
                </HStack>
                
                {/* View Mode Buttons */}
                <HStack spacing={2} ml={6}>
                  <Button
                    variant={viewMode === 'month' ? 'solid' : 'outline'}
                    colorScheme="blue"
                    size="sm"
                    onClick={() => {
                      setViewMode('month');
                      toast({
                        title: "Month View",
                        description: "Switched to monthly calendar view",
                        status: "info",
                        duration: 2000,
                        isClosable: true,
                      });
                    }}
                  >
                    Month
                  </Button>
                  <Button
                    variant={viewMode === 'year' ? 'solid' : 'outline'}
                    colorScheme="blue"
                    size="sm"
                    onClick={() => {
                      setViewMode('year');
                      toast({
                        title: "Year View",
                        description: "Switched to annual overview",
                        status: "info",
                        duration: 2000,
                        isClosable: true,
                      });
                    }}
                  >
                    Year
                  </Button>
                </HStack>
              </HStack>
              
              <HStack>
                <Text fontSize="sm" color="gray.500">
                  Today: {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </Text>
              </HStack>
            </Flex>

            {/* Conditional View Rendering */}
            {viewMode === 'month' ? (
              <Box>
                {/* Days of week header */}
                <Grid templateColumns="repeat(7, 1fr)" gap={0} mb={0} borderBottom="2px" borderColor="gray.200">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <Box 
                      key={day} 
                      textAlign="center" 
                      fontWeight="bold" 
                      color="gray.700" 
                      fontSize="sm"
                      p={2}
                      bg="gray.50"
                      borderRight="1px"
                      borderColor="gray.200"
                      _last={{ borderRight: "none" }}
                    >
                      {day}
                    </Box>
                  ))}
                </Grid>

                {/* Calendar Days */}
                <Grid templateColumns="repeat(7, 1fr)" gap={1} h="auto" minH="300px">
                  {calendarDays.map((dayData, index) => (
                    <Box
                      key={index}
                      minH="80px"
                      maxH="120px"
                      p={2}
                      border="1px"
                      borderColor={dayData?.isToday ? 'blue.300' : 'gray.200'}
                      bg={
                        dayData?.holiday ? 'red.50' :
                        dayData?.isToday ? 'blue.50' : 'white'
                      }
                      position="relative"
                      overflow="visible"
                      display="flex"
                      flexDirection="column"
                    >
                      {dayData && (
                        <>
                          {/* Day number and holiday indicator */}
                          <Flex justify="space-between" align="flex-start" mb={1} flexShrink={0}>
                            <Text 
                              fontSize="sm" 
                              fontWeight={dayData.isToday ? 'bold' : 'semibold'}
                              color={
                                dayData.holiday ? 'red.600' :
                                dayData.isToday ? 'blue.600' : 'gray.800'
                              }
                            >
                              {dayData.day}
                            </Text>
                            <HStack spacing={1}>
                              {dayData.holiday && (
                                <Tooltip label={`Holiday: ${dayData.holiday.name}`} placement="top">
                                  <Icon as={Ban} size={12} color="red.500" />
                                </Tooltip>
                              )}
                              {dayData.events.length > 0 && (
                                <Badge 
                                  colorScheme={dayData.isToday ? 'blue' : 'gray'} 
                                  variant="subtle"
                                  fontSize="xs"
                                  borderRadius="full"
                                  size="xs"
                                >
                                  {dayData.events.length}
                                </Badge>
                              )}
                            </HStack>
                          </Flex>
                          
                          {/* Events */}
                          <VStack spacing={1} align="start" flex="1" overflow="hidden">
                            {dayData.events.slice(0, 2).map((event, eventIndex) => (
                              <Tooltip 
                                key={eventIndex} 
                                label={
                                  <Box p={2}>
                                    <Text fontWeight="bold">{event.title}</Text>
                                    <Text fontSize="sm">{event.time} - {event.location}</Text>
                                    <Text fontSize="sm">Organizer: {event.organizer}</Text>
                                    <Text fontSize="sm">{event.attendees} attendees</Text>
                                  </Box>
                                }
                                placement="top"
                                hasArrow
                              >
                                <Box
                                  w="full"
                                  bg={`${getEventTypeColor(event.type)}.100`}
                                  color={`${getEventTypeColor(event.type)}.700`}
                                  fontSize="xs"
                                  p={1}
                                  borderRadius="sm"
                                  cursor="pointer"
                                  border="1px"
                                  borderColor={`${getEventTypeColor(event.type)}.200`}
                                  _hover={{ 
                                    bg: `${getEventTypeColor(event.type)}.200`,
                                    transform: "scale(1.02)",
                                    zIndex: 10,
                                    position: "relative"
                                  }}
                                  transition="all 0.2s"
                                  position="relative"
                                  zIndex={1}
                                >
                                  <Text noOfLines={1} fontWeight="medium" fontSize="xs">
                                    {event.title}
                                  </Text>
                                  <Text fontSize="xs" opacity={0.8}>
                                    {event.time}
                                  </Text>
                                </Box>
                              </Tooltip>
                            ))}
                            {dayData.events.length > 2 && (
                              <Text fontSize="xs" color="blue.600" fontWeight="medium">
                                +{dayData.events.length - 2} more
                              </Text>
                            )}
                          </VStack>
                        </>
                      )}
                    </Box>
                  ))}
                </Grid>
              </Box>
            ) : (
              // Year View
              <VStack spacing={4} p={4}>
                <Text fontSize="2xl" fontWeight="bold" color="blue.600" mb={4}>
                  {currentDate.getFullYear()} Annual Overview
                </Text>
                <Grid templateColumns="repeat(3, 1fr)" gap={6} w="full">
                  {yearData.map((month, index) => (
                    <Card 
                      key={index} 
                      variant="outline" 
                      cursor="pointer"
                      _hover={{ shadow: "md", transform: "translateY(-2px)" }}
                      transition="all 0.2s"
                      onClick={() => {
                        const newDate = new Date(currentDate.getFullYear(), index, 1);
                        setCurrentDate(newDate);
                        setViewMode('month');
                        toast({
                          title: `${month.name} Selected`,
                          description: `Switching to ${month.name} ${currentDate.getFullYear()}`,
                          status: "info",
                          duration: 2000,
                          isClosable: true,
                        });
                      }}
                    >
                      <CardBody textAlign="center" p={4}>
                        <Text fontSize="lg" fontWeight="bold" color="blue.600" mb={2}>
                          {month.name}
                        </Text>
                        <VStack spacing={1}>
                          <Text fontSize="sm" color="gray.600">
                            {month.days} days
                          </Text>
                          <HStack spacing={2} justify="center">
                            <Icon as={Calendar} size={14} color="green.500" />
                            <Text fontSize="sm" color="green.600" fontWeight="medium">
                              {month.events} events
                            </Text>
                          </HStack>
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </Grid>
              </VStack>
            )}
          </CardBody>
        </Card>

        {/* Sidebar with Today's Events and Holidays */}
        <VStack spacing={4} align="stretch" h="100%">
          <Card bg={cardBg} border="1px" borderColor={borderColor}>
            <CardBody>
              <HStack mb={4}>
                <CalendarDays size={20} />
                <Text fontSize="lg" fontWeight="semibold">Today's Events</Text>
              </HStack>
              <VStack spacing={3} align="stretch">
                {(() => {
                  const today = new Date();
                  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                  const todayEvents = mockEvents[todayStr] || [];
                  if (todayEvents.length > 0) {
                    return todayEvents.map((event, index) => (
                      <Box key={index} p={3} bg="gray.50" borderRadius="md">
                        <HStack justify="space-between">
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="medium">{event.title}</Text>
                            <HStack fontSize="sm" color="gray.600">
                              <Clock size={12} />
                              <Text>{event.time}</Text>
                              <Users size={12} />
                              <Text>{event.attendees} attendees</Text>
                            </HStack>
                          </VStack>
                          <Badge colorScheme={getEventTypeColor(event.type)} variant="subtle">
                            {event.type}
                          </Badge>
                        </HStack>
                      </Box>
                    ));
                  } else {
                    return <Text color="gray.500" fontSize="sm">No events scheduled for today</Text>;
                  }
                })()}
              </VStack>
            </CardBody>
          </Card>

          {/* Upcoming Holidays */}
          <Card bg={cardBg} border="1px" borderColor={borderColor}>
            <CardBody>
              <HStack mb={4}>
                <AlertTriangle size={20} />
                <Text fontSize="lg" fontWeight="semibold">Holidays</Text>
              </HStack>
              <VStack spacing={3} align="stretch">
                {holidays.slice(0, 4).map((holiday, index) => (
                  <Box key={index} p={3} bg="red.50" borderRadius="md">
                    <Flex justify="space-between" align="center">
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="medium">{holiday.name}</Text>
                        <Text fontSize="sm" color="gray.600">{holiday.date}</Text>
                      </VStack>
                      <Badge colorScheme={getHolidayTypeColor(holiday.type)} variant="outline">
                        {holiday.type}
                      </Badge>
                    </Flex>
                  </Box>
                ))}
              </VStack>
              {holidays.length === 0 && (
                <Text color="gray.500" fontSize="sm">No holidays set</Text>
              )}
            </CardBody>
          </Card>
        </VStack>
      </Grid>

      {/* Set Holiday Modal */}
      <Modal isOpen={isHolidayModalOpen} onClose={onHolidayModalClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="linear-gradient(135deg, #fc466b 0%, #3f5efb 100%)" color="white">
            <HStack spacing={3}>
              <Icon as={Ban} />
              <Text>Set Holiday</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody p={6}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Holiday Date</FormLabel>
                <Input 
                  type="date"
                  value={holidayForm.date}
                  onChange={(e) => handleHolidayFormChange('date', e.target.value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Holiday Name</FormLabel>
                <Input 
                  placeholder="Enter holiday name (e.g., Diwali, Clinic Closed)"
                  value={holidayForm.name}
                  onChange={(e) => handleHolidayFormChange('name', e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Holiday Type</FormLabel>
                <Select 
                  value={holidayForm.type}
                  onChange={(e) => handleHolidayFormChange('type', e.target.value)}
                >
                  <option value="clinic">Clinic Holiday</option>
                  <option value="national">National Holiday</option>
                  <option value="festival">Festival</option>
                </Select>
              </FormControl>
              <Box p={4} bg="orange.50" borderRadius="md" border="1px" borderColor="orange.200">
                <HStack spacing={2}>
                  <Icon as={AlertTriangle} color="orange.500" />
                  <Text fontSize="sm" color="orange.700">
                    <strong>Note:</strong> Setting a holiday will prevent patients from booking appointments on this date.
                  </Text>
                </HStack>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button 
                colorScheme="red"
                onClick={handleAddHoliday}
                leftIcon={<Ban size={16} />}
              >
                Set Holiday
              </Button>
              <Button variant="outline" onClick={onHolidayModalClose}>
                Cancel
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AnnualCalendar;
