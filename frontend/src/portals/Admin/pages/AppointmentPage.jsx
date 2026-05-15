import React, { useState } from 'react';
import { Box, Button, Flex, Heading, Input, Table, Thead, Tbody, Tr, Th, Td, Tabs, TabList, Tab, TabPanels, TabPanel, IconButton } from '@chakra-ui/react';
import { appointments } from '../../../data/adminMockData';
import { Plus, Download } from 'lucide-react';

const AppointmentPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filterAppointments = (status) => {
    return appointments.filter(appointment =>
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (status === 'All' || appointment.status === status)
    );
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading as="h1" size="xl">Appointments</Heading>
        <Flex>
          <Button leftIcon={<Plus />} colorScheme="blue" mr={4}>
            Add Appointment
          </Button>
          <Button>Doctor Wise</Button>
        </Flex>
      </Flex>

      <Box p={6} bg="white" borderRadius="lg" boxShadow="md">
        <Flex justify="space-between" mb={4}>
          <Tabs>
            <TabList>
              <Tab>Today</Tab>
              <Tab>Upcoming</Tab>
              <Tab>Old</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <AppointmentTable appointments={filterAppointments('Today')} />
              </TabPanel>
              <TabPanel>
                <AppointmentTable appointments={filterAppointments('Upcoming')} />
              </TabPanel>
              <TabPanel>
                <AppointmentTable appointments={filterAppointments('Old')} />
              </TabPanel>
            </TabPanels>
          </Tabs>
          <Flex>
            <Input 
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              mr={2}
            />
            <IconButton icon={<Download />} />
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

const AppointmentTable = ({ appointments }) => (
  <Table variant="simple">
    <Thead>
      <Tr>
        <Th>Patient Name</Th>
        <Th>Appointment No</Th>
        <Th>Date</Th>
        <Th>Doctor</Th>
      </Tr>
    </Thead>
    <Tbody>
      {appointments.map(appointment => (
        <Tr key={appointment.id}>
          <Td>{appointment.patientName}</Td>
          <Td>{appointment.appointmentNo}</Td>
          <Td>{appointment.date}</Td>
          <Td>{appointment.doctor}</Td>
        </Tr>
      ))}
    </Tbody>
  </Table>
);

export default AppointmentPage;
