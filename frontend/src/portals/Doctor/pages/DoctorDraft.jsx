import React from 'react';
import {
  Box,
  Badge,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  HStack,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { ArrowLeft, Stethoscope, RefreshCw } from 'lucide-react';
import Draft from '../../../components/modules/Draft/Draft';
import { getDraftBillsStats } from '../../../utils/draftBillUtils';

const DoctorDraft = () => {
  const [refreshKey, setRefreshKey] = React.useState(0);
  const stats = getDraftBillsStats();

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    // Force re-render of stats
    window.location.reload();
  };

  return (
    <Box>
      {/* Doctor-specific navigation */}
      <HStack mb={4} justify="space-between">
        <Button
          as={RouterLink}
          to="/doctor/opd"
          leftIcon={<ArrowLeft size={16} />}
          variant="outline"
          colorScheme="blue"
          size="sm"
        >
          Back to OPD
        </Button>
        
        <Button
          leftIcon={<RefreshCw size={16} />}
          colorScheme="green"
          variant="outline"
          size="sm"
          onClick={handleRefresh}
        >
          Refresh Data
        </Button>
      </HStack>

      {/* Doctor-specific header info */}
      <Alert status="info" mb={6} borderRadius="lg" bg="blue.50" borderColor="blue.200">
        <AlertIcon color="blue.500" />
        <Box>
          <AlertTitle color="blue.800">Doctor Portal - Draft Medicine Bills</AlertTitle>
          <AlertDescription color="blue.700">
            Manage your draft medicine bills and prescriptions. You have{' '}
            <Badge colorScheme="orange" ml={1} mr={1}>{stats.draft}</Badge>
            active drafts worth ₹{stats.totalValue.toFixed(2)}.
          </AlertDescription>
        </Box>
      </Alert>

      {/* Quick stats for doctors */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={6}>
        <Card bg="blue.50" borderLeft="4px solid" borderColor="blue.400">
          <CardBody py={4}>
            <Stat size="sm">
              <StatLabel color="blue.600">Your Drafts</StatLabel>
              <StatNumber color="blue.700">{stats.draft}</StatNumber>
              <StatHelpText color="blue.500">
                <Stethoscope size={12} style={{ display: 'inline', marginRight: '4px' }} />
                Active prescriptions
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card bg="green.50" borderLeft="4px solid" borderColor="green.400">
          <CardBody py={4}>
            <Stat size="sm">
              <StatLabel color="green.600">Finalized</StatLabel>
              <StatNumber color="green.700">{stats.finalized}</StatNumber>
              <StatHelpText color="green.500">Sent to billing</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card bg="purple.50" borderLeft="4px solid" borderColor="purple.400">
          <CardBody py={4}>
            <Stat size="sm">
              <StatLabel color="purple.600">To Pharmacy</StatLabel>
              <StatNumber color="purple.700">{stats.sent}</StatNumber>
              <StatHelpText color="purple.500">Processing</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
        
        <Card bg="teal.50" borderLeft="4px solid" borderColor="teal.400">
          <CardBody py={4}>
            <Stat size="sm">
              <StatLabel color="teal.600">Total Value</StatLabel>
              <StatNumber color="teal.700">₹{stats.totalValue.toFixed(2)}</StatNumber>
              <StatHelpText color="teal.500">All bills</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Main Draft component */}
      <Draft key={refreshKey} showStatistics={false} showHeader={false} />
    </Box>
  );
};

export default DoctorDraft;
