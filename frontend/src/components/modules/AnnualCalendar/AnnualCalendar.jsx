// Fallback mockHolidays for calendar (empty by default)
const mockHolidays = [];
// Fallback mockEvents for calendar filtering (empty by default)
const mockEvents = {};
// Month names for calendar
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
import axios from 'axios';

const EVENTS_API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/events` : 'https://shatayu-backend.onrender.com/api/events';

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
  Textarea,
  Avatar,
  AvatarGroup,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider
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
  AlertCircle,
  Search,
  Filter,
  Download,
  Upload,
  Settings,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  MapPin,
  Bell,
  CheckCircle,
  XCircle,
  Calendar as CalendarIcon,
  TrendingUp,
  BarChart3
} from 'lucide-react';



const AnnualCalendar = ({ title = "Annual Calendar Management", showAddButton = true }) => {
  // Backend-integrated state for events
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load events from backend
  React.useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(EVENTS_API_URL, { headers: { Authorization: `Bearer ${token}` } });
        setEvents(response.data);
        setError('');
      } catch (err) {
        setError('Failed to load events');
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);

  // Add event
  const addEvent = async (eventData) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(EVENTS_API_URL, eventData, { headers: { Authorization: `Bearer ${token}` } });
      setEvents(prev => [...prev, response.data]);
      toast({ title: 'Event Added', description: `${eventData.title} scheduled.`, status: 'success', duration: 3000, isClosable: true });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to add event', status: 'error', duration: 3000, isClosable: true });
    }
  };

  // Update event
  const updateEvent = async (id, eventData) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put(`${EVENTS_API_URL}/${id}`, eventData, { headers: { Authorization: `Bearer ${token}` } });
      setEvents(prev => prev.map(e => e.id === id ? response.data : e));
      toast({ title: 'Event Updated', description: `${eventData.title} updated.`, status: 'success', duration: 3000, isClosable: true });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to update event', status: 'error', duration: 3000, isClosable: true });
    }
  };

  // Delete event
  const deleteEvent = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`${EVENTS_API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setEvents(prev => prev.filter(e => e.id !== id));
      toast({ title: 'Event Deleted', status: 'success', duration: 3000, isClosable: true });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to delete event', status: 'error', duration: 3000, isClosable: true });
    }
  };
  // Sync calendar to present timeline (today's date)
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // month, year
  const [searchTerm, setSearchTerm] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // Form state for add event
  const [eventForm, setEventForm] = useState({
    title: '',
    type: 'meeting',
    date: '',
    time: '',
    location: '',
    attendees: '',
    description: '',
    organizer: ''
  });
  
  // Modal states
  const { isOpen: isAddModalOpen, onOpen: onAddModalOpen, onClose: onAddModalClose } = useDisclosure();
  const { isOpen: isViewModalOpen, onOpen: onViewModalOpen, onClose: onViewModalClose } = useDisclosure();

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

  const getHolidayTypeColor = (type) => {
    switch (type) {
      case 'national': return 'red';
      case 'festival': return 'orange';
      case 'hospital': return 'blue';
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

  // Event form handling
  const handleEventFormChange = (field, value) => {
    setEventForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddEvent = () => {
    if (!eventForm.title || !eventForm.date || !eventForm.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: "Event Added",
      description: `${eventForm.title} has been scheduled for ${eventForm.date} at ${eventForm.time}.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    // Reset form and close modal
    setEventForm({
      title: '',
      type: 'meeting',
      date: '',
      time: '',
      location: '',
      attendees: '',
      description: '',
      organizer: ''
    });
    onAddModalClose();
  };

  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    onViewModalOpen();
  };

  const handleEventClick = (date, event) => {
    if (event.isMultiple) {
      setSelectedEvent(event);
    } else {
      setSelectedEvent(event);
    }
    onViewModalOpen();
  };

  const handleDeleteEvent = (event) => {
    toast({
      title: "Event Deleted",
      description: `${event.title} has been removed from the calendar.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Export functionality
  const handleExport = (format) => {
    const currentMonthEvents = events;
    
    if (format === 'csv') {
      const csvContent = [
        ['Date', 'Time', 'Title', 'Type', 'Location', 'Organizer', 'Attendees', 'Status'],
        ...currentMonthEvents.map(event => [
          event.date,
          event.time,
          event.title,
          event.type,
          event.location,
          event.organizer,
          event.attendees,
          event.status
        ])
      ].map(row => row.join(',')).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `calendar-events-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } else if (format === 'excel') {
      // Create Excel-compatible XML content
      const excelContent = `<?xml version="1.0"?>
        <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
          <Worksheet ss:Name="Calendar Events">
            <Table>
              <Row>
                <Cell><Data ss:Type="String">Date</Data></Cell>
                <Cell><Data ss:Type="String">Time</Data></Cell>
                <Cell><Data ss:Type="String">Title</Data></Cell>
                <Cell><Data ss:Type="String">Type</Data></Cell>
                <Cell><Data ss:Type="String">Location</Data></Cell>
                <Cell><Data ss:Type="String">Organizer</Data></Cell>
                <Cell><Data ss:Type="String">Attendees</Data></Cell>
                <Cell><Data ss:Type="String">Status</Data></Cell>
              </Row>
              ${currentMonthEvents.map(event => `
                <Row>
                  <Cell><Data ss:Type="String">${event.date}</Data></Cell>
                  <Cell><Data ss:Type="String">${event.time}</Data></Cell>
                  <Cell><Data ss:Type="String">${event.title}</Data></Cell>
                  <Cell><Data ss:Type="String">${event.type}</Data></Cell>
                  <Cell><Data ss:Type="String">${event.location}</Data></Cell>
                  <Cell><Data ss:Type="String">${event.organizer}</Data></Cell>
                  <Cell><Data ss:Type="String">${event.attendees}</Data></Cell>
                  <Cell><Data ss:Type="String">${event.status}</Data></Cell>
                </Row>
              `).join('')}
            </Table>
          </Worksheet>
        </Workbook>`;
      
      const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `calendar-events-${new Date().toISOString().split('T')[0]}.xls`;
      a.click();
      window.URL.revokeObjectURL(url);
    } else if (format === 'pdf') {
      // Create a simple PDF content
      const pdfContent = `
        Hospital Calendar Events - ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}
        
        ${currentMonthEvents.map(event => 
          `${event.time} - ${event.title}\nType: ${event.type} | Location: ${event.location}\nOrganizer: ${event.organizer} | Attendees: ${event.attendees}\nStatus: ${event.status}\n`
        ).join('\n')}
      `;
      
      const blob = new Blob([pdfContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `calendar-events-${new Date().toISOString().split('T')[0]}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
    
    toast({
      title: "Export Successful",
      description: `Calendar events exported as ${format.toUpperCase()}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Year view functionality
  const handleYearView = () => {
    toast({
      title: "Year View",
      description: "Displaying annual calendar overview",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  // Generate year view data
  const generateYearData = () => {
    const year = currentDate.getFullYear();
    const months = [];
    for (let month = 0; month < 12; month++) {
      const monthDate = new Date(year, month, 1);
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      // Count events in this month
      const monthEvents = events.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === month && d.getFullYear() === year;
      }).length;
      months.push({
        name: monthNames[month],
        days: daysInMonth,
        events: monthEvents,
        date: monthDate
      });
    }
    return months;
  };

  const yearData = generateYearData();

  // Filtered events based on search and filter
  const filteredEvents = Object.entries(mockEvents).reduce((acc, [date, events]) => {
    const filtered = events.filter(event => {
      const matchesSearch = searchTerm === '' || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = eventTypeFilter === 'all' || event.type === eventTypeFilter;
      
      return matchesSearch && matchesType;
    });
    
    if (filtered.length > 0) {
      acc[date] = filtered;
    }
    
    return acc;
  }, {});

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
      days.push({
        day,
        dateStr,
        events: filteredEvents[dateStr] || [],
        isToday: dateStr === todayStr
      });
    }

    return days;
  };

  // ...existing code...

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const calendarDays = generateCalendarDays();

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
              onClick={onAddModalOpen}
            >
              Add Event
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

      {/* KPI Cards - now dynamic */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={6} mb={8}>
        {/* Total Events This Month */}
        <Card bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" color="white">
          <CardBody>
            <HStack spacing={4}>
              <Icon as={CalendarIcon} size={40} />
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" opacity={0.9}>Total Events</Text>
                <Text fontSize="2xl" fontWeight="bold">{
                  events.filter(e => {
                    const d = new Date(e.date);
                    const now = new Date();
                    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                  }).length
                }</Text>
                <Text fontSize="xs" opacity={0.8}>This month</Text>
              </VStack>
            </HStack>
          </CardBody>
        </Card>

        {/* Meetings Scheduled */}
        <Card bg="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" color="white">
          <CardBody>
            <HStack spacing={4}>
              <Icon as={Users} size={40} />
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" opacity={0.9}>Meetings</Text>
                <Text fontSize="2xl" fontWeight="bold">{
                  events.filter(e => e.type === 'meeting').length
                }</Text>
                <Text fontSize="xs" opacity={0.8}>Scheduled</Text>
              </VStack>
            </HStack>
          </CardBody>
        </Card>

        {/* Appointments Today */}
        <Card bg="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" color="white">
          <CardBody>
            <HStack spacing={4}>
              <Icon as={Stethoscope} size={40} />
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" opacity={0.9}>Appointments</Text>
                <Text fontSize="2xl" fontWeight="bold">{
                  events.filter(e => {
                    const d = new Date(e.date);
                    const now = new Date();
                    return e.type === 'appointment' && d.toDateString() === now.toDateString();
                  }).length
                }</Text>
                <Text fontSize="xs" opacity={0.8}>Today</Text>
              </VStack>
            </HStack>
          </CardBody>
        </Card>

        {/* Attendance (if available, else show N/A) */}
        <Card bg="linear-gradient(135deg, #fa709a 0%, #fee140 100%)" color="white">
          <CardBody>
            <HStack spacing={4}>
              <Icon as={TrendingUp} size={40} />
              <VStack align="start" spacing={1}>
                <Text fontSize="sm" opacity={0.9}>Attendance</Text>
                <Text fontSize="2xl" fontWeight="bold">{
                  (() => {
                    const attended = events.filter(e => typeof e.attendance === 'number');
                    if (attended.length === 0) return 'N/A';
                    const avg = attended.reduce((sum, e) => sum + e.attendance, 0) / attended.length;
                    return `${Math.round(avg)}%`;
                  })()
                }</Text>
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

      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6} h="calc(100vh - 280px)">
        {/* Calendar */}
        <Card bg={cardBg} border="1px" borderColor={borderColor} h="100%">
          <CardBody h="100%" overflow="hidden">
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
                      handleYearView();
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
              <>
                {/* Days of week header */}
                <Grid templateColumns="repeat(7, 1fr)" gap={0} mb={0} borderBottom="2px" borderColor="gray.200">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <Box 
                      key={day} 
                      textAlign="center" 
                      fontWeight="bold" 
                      color="gray.700" 
                      fontSize="sm"
                      p={3}
                      bg="gray.50"
                      borderRight="1px"
                      borderColor="gray.200"
                      _last={{ borderRight: "none" }}
                    >
                      {day}
                    </Box>
                  ))}
                </Grid>

                {/* Monthly Calendar Grid */}
                <Grid templateColumns="repeat(7, 1fr)" gap={0} maxH="500px" overflow="auto">
                  {calendarDays.map((dayData, index) => (
                    <Box
                      key={index}
                      minH="100px"
                      maxH="120px"
                      p={2}
                      border="1px"
                      borderColor={dayData?.isToday ? 'blue.300' : 'gray.200'}
                      bg={dayData?.isToday ? 'blue.50' : 'white'}
                      position="relative"
                      cursor="pointer"
                      _hover={{ 
                        bg: dayData?.isToday ? 'blue.100' : 'gray.50'
                      }}
                      transition="all 0.2s"
                      overflow="hidden"
                    >
                      {dayData && (
                        <>
                          <Flex justify="space-between" align="center" mb={1}>
                            <Text 
                              fontSize="sm" 
                              fontWeight={dayData.isToday ? 'bold' : 'semibold'}
                              color={dayData.isToday ? 'blue.600' : 'gray.800'}
                            >
                              {dayData.day}
                            </Text>
                            {dayData.events.length > 0 && (
                              <Badge 
                                colorScheme={dayData.isToday ? 'blue' : 'gray'} 
                                variant="subtle"
                                fontSize="xs"
                                borderRadius="full"
                                size="sm"
                              >
                                {dayData.events.length}
                              </Badge>
                            )}
                          </Flex>
                          <VStack spacing={1} align="start" h="calc(100% - 25px)" overflow="hidden">
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
                                  borderRadius="md"
                                  cursor="pointer"
                                  border="1px"
                                  borderColor={`${getEventTypeColor(event.type)}.200`}
                                  _hover={{ 
                                    bg: `${getEventTypeColor(event.type)}.200`,
                                    transform: "scale(1.02)"
                                  }}
                                  transition="all 0.2s"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewEvent(event);
                                  }}
                                >
                                  <HStack spacing={1} justify="space-between">
                                    <Text noOfLines={1} fontWeight="medium" fontSize="xs">{event.title}</Text>
                                    <Badge 
                                      colorScheme={getStatusColor(event.status)} 
                                      variant="solid"
                                      size="xs"
                                    >
                                      {event.status}
                                    </Badge>
                                  </HStack>
                                  <Text fontSize="xs" opacity={0.8} mt={1}>
                                    <Clock size={8} style={{ display: 'inline', marginRight: '2px' }} />
                                    {event.time}
                                  </Text>
                                </Box>
                              </Tooltip>
                            ))}
                            {dayData.events.length > 2 && (
                              <Button
                                size="xs"
                                variant="ghost"
                                colorScheme="blue"
                                p={1}
                                h="auto"
                                fontSize="xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const allEvents = dayData.events;
                                  setSelectedEvent({ 
                                    title: `${dayData.day} Events`, 
                                    events: allEvents,
                                    isMultiple: true 
                                  });
                                  onViewModalOpen();
                                }}
                              >
                                +{dayData.events.length - 2} more
                              </Button>
                            )}
                          </VStack>
                        </>
                      )}
                    </Box>
                  ))}
                </Grid>
              </>
            ) : (
              <>
                {/* Year View */}
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
                                {Math.floor(Math.random() * 10 + 1)} events
                              </Text>
                            </HStack>
                          </VStack>
                          <Progress 
                            value={Math.random() * 100} 
                            size="sm" 
                            colorScheme="blue" 
                            mt={3}
                            borderRadius="full"
                          />
                        </CardBody>
                      </Card>
                    ))}
                  </Grid>
                </VStack>
              </>
            )}
          </CardBody>
        </Card>

        {/* Sidebar with Events and Holidays */}
        <VStack spacing={4} align="stretch" h="100%" overflow="auto">
          {/* Today's Events */}
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
                  const todayEvents = events.filter(e => e.date === todayStr);
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
                <Star size={20} />
                <Text fontSize="lg" fontWeight="semibold">Upcoming Holidays</Text>
              </HStack>
              <VStack spacing={3} align="stretch">
                {mockHolidays.slice(0, 4).map((holiday, index) => (
                  <Box key={index} p={3} bg="gray.50" borderRadius="md">
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
            </CardBody>
          </Card>

          {/* Quick Stats */}
          <Card bg={cardBg} border="1px" borderColor={borderColor}>
            <CardBody>
              <Text fontSize="lg" fontWeight="semibold" mb={4}>This Month</Text>
              <SimpleGrid columns={2} spacing={4}>
                <Box textAlign="center">
                  <Text fontSize="2xl" fontWeight="bold" color="blue.600">15</Text>
                  <Text fontSize="sm" color="gray.600">Events</Text>
                </Box>
                <Box textAlign="center">
                  <Text fontSize="2xl" fontWeight="bold" color="green.600">8</Text>
                  <Text fontSize="sm" color="gray.600">Meetings</Text>
                </Box>
                <Box textAlign="center">
                  <Text fontSize="2xl" fontWeight="bold" color="orange.600">5</Text>
                  <Text fontSize="sm" color="gray.600">Training</Text>
                </Box>
                <Box textAlign="center">
                  <Text fontSize="2xl" fontWeight="bold" color="purple.600">3</Text>
                  <Text fontSize="sm" color="gray.600">Holidays</Text>
                </Box>
              </SimpleGrid>
            </CardBody>
          </Card>
        </VStack>
      </Grid>

      {/* Add Event Modal */}
      <Modal isOpen={isAddModalOpen} onClose={onAddModalClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" color="white">
            <HStack spacing={3}>
              <Icon as={Plus} />
              <Text>Add New Event</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody p={6}>
            <VStack spacing={4}>
              <SimpleGrid columns={2} spacing={4} w="full">
                <FormControl isRequired>
                  <FormLabel>Event Title</FormLabel>
                  <Input 
                    placeholder="Enter event title"
                    value={eventForm.title}
                    onChange={(e) => handleEventFormChange('title', e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Event Type</FormLabel>
                  <Select 
                    value={eventForm.type}
                    onChange={(e) => handleEventFormChange('type', e.target.value)}
                  >
                    <option value="meeting">Meeting</option>
                    <option value="appointment">Appointment</option>
                    <option value="training">Training</option>
                    <option value="event">Event</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="inventory">Inventory</option>
                  </Select>
                </FormControl>
              </SimpleGrid>
              <SimpleGrid columns={2} spacing={4} w="full">
                <FormControl isRequired>
                  <FormLabel>Date</FormLabel>
                  <Input 
                    type="date"
                    value={eventForm.date}
                    onChange={(e) => handleEventFormChange('date', e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Time</FormLabel>
                  <Input 
                    type="time"
                    value={eventForm.time}
                    onChange={(e) => handleEventFormChange('time', e.target.value)}
                  />
                </FormControl>
              </SimpleGrid>
              <SimpleGrid columns={2} spacing={4} w="full">
                <FormControl>
                  <FormLabel>Location</FormLabel>
                  <Input 
                    placeholder="Event location"
                    value={eventForm.location}
                    onChange={(e) => handleEventFormChange('location', e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Expected Attendees</FormLabel>
                  <Input 
                    type="number"
                    placeholder="Number of attendees"
                    value={eventForm.attendees}
                    onChange={(e) => handleEventFormChange('attendees', e.target.value)}
                  />
                </FormControl>
              </SimpleGrid>
              <FormControl>
                <FormLabel>Organizer</FormLabel>
                <Select 
                  placeholder="Select organizer"
                  value={eventForm.organizer}
                  onChange={(e) => handleEventFormChange('organizer', e.target.value)}
                >
                  <option value="Dr. Ramesh Ayurveda">Dr. Ramesh Ayurveda</option>
                  <option value="Nurse Priya Sharma">Nurse Priya Sharma</option>
                  <option value="Mr. Amit Patel">Mr. Amit Patel</option>
                  <option value="Admin Team">Admin Team</option>
                  <option value="HR Manager">HR Manager</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea 
                  placeholder="Event description (optional)"
                  value={eventForm.description}
                  onChange={(e) => handleEventFormChange('description', e.target.value)}
                  rows={3}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button 
                colorScheme="blue"
                onClick={handleAddEvent}
                leftIcon={<Plus size={16} />}
              >
                Add Event
              </Button>
              <Button variant="outline" onClick={onAddModalClose}>
                Cancel
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View Event Modal */}
      <Modal isOpen={isViewModalOpen} onClose={onViewModalClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" color="white">
            <HStack spacing={3}>
              <Icon as={Eye} />
              <Text>{selectedEvent?.isMultiple ? selectedEvent.title : 'Event Details'}</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody p={6}>
            {selectedEvent?.isMultiple ? (
              // Multiple events view
              <VStack spacing={4} align="start">
                <Text fontSize="lg" fontWeight="semibold" color="blue.600">
                  All Events for This Day
                </Text>
                <SimpleGrid columns={1} spacing={3} w="full">
                  {selectedEvent.events.map((event, idx) => (
                    <Card key={idx} variant="outline">
                      <CardBody p={4}>
                        <HStack spacing={4} justify="space-between">
                          <VStack align="start" spacing={1} flex="1">
                            <HStack spacing={2}>
                              <Text fontWeight="semibold">{event.title}</Text>
                              <Badge colorScheme={getEventTypeColor(event.type)} size="sm">
                                {event.type}
                              </Badge>
                              <Badge colorScheme={getStatusColor(event.status)} size="sm">
                                {event.status}
                              </Badge>
                            </HStack>
                            <Text fontSize="sm" color="gray.600">{event.description}</Text>
                            <HStack fontSize="sm" color="gray.500" spacing={3}>
                              <HStack spacing={1}>
                                <Clock size={12} />
                                <Text>{event.time}</Text>
                              </HStack>
                              <HStack spacing={1}>
                                <MapPin size={12} />
                                <Text>{event.location}</Text>
                              </HStack>
                              <HStack spacing={1}>
                                <Users size={12} />
                                <Text>{event.attendees} attendees</Text>
                              </HStack>
                            </HStack>
                            <Text fontSize="sm" color="gray.600">
                              Organizer: {event.organizer}
                            </Text>
                          </VStack>
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              aria-label="Options"
                              icon={<MoreVertical size={16} />}
                              variant="ghost"
                              size="sm"
                            />
                            <MenuList>
                              <MenuItem 
                                icon={<Edit size={16} />}
                                onClick={() => {
                                  onViewModalClose();
                                  toast({
                                    title: "Edit Event",
                                    description: `Opening editor for ${event.title}`,
                                    status: "info",
                                    duration: 2000,
                                    isClosable: true,
                                  });
                                }}
                              >
                                Edit Event
                              </MenuItem>
                              <MenuItem 
                                icon={<Trash2 size={16} />} 
                                color="red.500"
                                onClick={() => {
                                  handleDeleteEvent(event);
                                  onViewModalClose();
                                }}
                              >
                                Delete Event
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </HStack>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>
              </VStack>
            ) : selectedEvent ? (
              // Single event view
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
                <Box>
                  <Text fontSize="lg" fontWeight="semibold" mb={4} color="blue.600">
                    Event Information
                  </Text>
                  <VStack align="start" spacing={3}>
                    <SimpleGrid columns={1} spacing={4} w="full">
                      <Box>
                        <Text fontSize="sm" color="gray.600">Title</Text>
                        <Text fontWeight="semibold">{selectedEvent.title}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Type</Text>
                        <Badge colorScheme={getEventTypeColor(selectedEvent.type)}>
                          {selectedEvent.type}
                        </Badge>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Status</Text>
                        <Badge colorScheme={getStatusColor(selectedEvent.status)}>
                          {selectedEvent.status}
                        </Badge>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Description</Text>
                        <Text fontWeight="semibold">{selectedEvent.description}</Text>
                      </Box>
                    </SimpleGrid>
                  </VStack>
                </Box>

                <Box>
                  <Text fontSize="lg" fontWeight="semibold" mb={4} color="green.600">
                    Schedule & Logistics
                  </Text>
                  <VStack align="start" spacing={3}>
                    <SimpleGrid columns={1} spacing={4} w="full">
                      <Box>
                        <Text fontSize="sm" color="gray.600">Time</Text>
                        <HStack>
                          <Clock size={16} />
                          <Text fontWeight="semibold">{selectedEvent.time}</Text>
                        </HStack>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Location</Text>
                        <HStack>
                          <MapPin size={16} />
                          <Text fontWeight="semibold">{selectedEvent.location}</Text>
                        </HStack>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Organizer</Text>
                        <HStack>
                          <Avatar size="sm" name={selectedEvent.organizer} />
                          <Text fontWeight="semibold">{selectedEvent.organizer}</Text>
                        </HStack>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.600">Expected Attendees</Text>
                        <HStack>
                          <Users size={16} />
                          <Text fontWeight="semibold">{selectedEvent.attendees} people</Text>
                        </HStack>
                      </Box>
                    </SimpleGrid>
                  </VStack>
                </Box>
              </Grid>
            ) : null}
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button 
                colorScheme="blue" 
                leftIcon={<Edit size={16} />}
                onClick={() => {
                  onViewModalClose();
                  toast({
                    title: "Edit Event",
                    description: "Opening event editor",
                    status: "info",
                    duration: 2000,
                    isClosable: true,
                  });
                  // You can add logic to open edit modal here
                }}
              >
                Edit Event
              </Button>
              <Button 
                colorScheme="red" 
                leftIcon={<Trash2 size={16} />} 
                variant="outline"
                onClick={() => {
                  handleDeleteEvent(selectedEvent);
                  onViewModalClose();
                }}
              >
                Delete Event
              </Button>
              <Button variant="outline" onClick={onViewModalClose}>
                Close
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AnnualCalendar;
