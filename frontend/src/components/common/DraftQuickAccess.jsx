import React from 'react';
import { 
  Box, 
  Button, 
  Badge, 
  HStack, 
  Text, 
  Tooltip,
  useColorModeValue
} from '@chakra-ui/react';
import { FileText, Eye } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { getDraftBillsStats } from '../../utils/draftBillUtils';

const DraftQuickAccess = () => {
  // Get fresh stats each time component renders
  const stats = getDraftBillsStats();
  const bgColor = useColorModeValue('blue.50', 'blue.900');
  const borderColor = useColorModeValue('blue.200', 'blue.600');

  if (stats.total === 0) {
    return null; // Don't show if no drafts
  }

  return (
    <Box
      bg={bgColor}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="lg"
      p={4}
      mb={4}
    >
      <HStack justify="space-between" align="center">
        <HStack spacing={3}>
          <FileText size={20} color="blue" />
          <Box>
            <Text fontWeight="semibold" color="blue.700">
              You have draft bills pending
            </Text>
            <Text fontSize="sm" color="blue.600">
              {stats.draft} active drafts • ₹{stats.totalValue.toFixed(2)} total value
            </Text>
          </Box>
        </HStack>
        
        <HStack spacing={2}>
          <Badge colorScheme="orange" variant="solid">
            {stats.draft} Active
          </Badge>
          <Tooltip label="View all draft bills">
            <Button
              as={RouterLink}
              to="/doctor/draft"
              leftIcon={<Eye size={16} />}
              colorScheme="blue"
              size="sm"
              variant="outline"
            >
              View Drafts
            </Button>
          </Tooltip>
        </HStack>
      </HStack>
    </Box>
  );
};

export default DraftQuickAccess;
