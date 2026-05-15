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
  Input,
  Select,
  useColorModeValue,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Checkbox,
  Textarea,
  Progress,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import {
  Download,
  Pill,
  Package,
  DollarSign,
  TrendingUp,
  BarChart3,
  Filter,
  Eye,
  Printer,
  FileText,
  Calendar,
  AlertTriangle,
  ShoppingCart,
  Truck,
  Users
} from 'lucide-react';

const PharmacyReports = ({ title = "Pharmacy Reports" }) => {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [reportFormat, setReportFormat] = useState('pdf');
  const { isOpen: isGenerateOpen, onOpen: onGenerateOpen, onClose: onGenerateClose } = useDisclosure();
  const [selectedReportType, setSelectedReportType] = useState('');
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const reportTypes = [
    {
      id: 'sales-report',
      title: 'Pharmacy Sales Report',
      description: 'Comprehensive sales analysis including medicine sales, revenue trends, and prescription patterns',
      icon: ShoppingCart,
      color: 'green',
      fields: ['Sales Volume', 'Revenue Analysis', 'Top Medicines', 'Prescription Patterns']
    },
    {
      id: 'inventory-report',
      title: 'Pharmacy Inventory Report',
      description: 'Stock levels, expiry tracking, reorder alerts, and inventory valuation for all medicines',
      icon: Package,
      color: 'blue',
      fields: ['Stock Levels', 'Expiry Dates', 'Reorder Points', 'Inventory Value']
    }
  ];

  const quickStats = [
    { label: 'Total Sales', value: '₹4,56,789', change: '+18.5%', trend: 'up' },
    { label: 'Medicines Sold', value: '2,345', change: '+12.3%', trend: 'up' },
    { label: 'Low Stock Items', value: '23', change: '-15.2%', trend: 'down' },
    { label: 'Expiring Soon', value: '8', change: '+25.0%', trend: 'up' }
  ];

  const topMedicines = [
    { name: 'Triphala Churna', sales: 145, revenue: '₹14,500', category: 'Digestive', color: 'green' },
    { name: 'Ashwagandha Capsules', sales: 123, revenue: '₹18,450', category: 'Immunity', color: 'blue' },
    { name: 'Brahmi Ghrita', sales: 98, revenue: '₹19,600', category: 'Mental Health', color: 'purple' },
    { name: 'Panchasakar Churna', sales: 87, revenue: '₹8,700', category: 'Digestive', color: 'orange' },
    { name: 'Mahanarayan Oil', sales: 76, revenue: '₹11,400', category: 'Pain Relief', color: 'red' }
  ];

  const stockAlerts = [
    { type: 'Low Stock', count: 23, severity: 'warning' },
    { type: 'Out of Stock', count: 5, severity: 'error' },
    { type: 'Expiring Soon', count: 8, severity: 'info' },
    { type: 'Expired', count: 2, severity: 'error' }
  ];

  const handleGenerateReport = (reportType) => {
    setSelectedReportType(reportType);
    onGenerateOpen();
  };

  const getIconComponent = (IconComponent, color) => {
    return <IconComponent size={24} color={color} />;
  };

  return (
    <Box>
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
            {title}
          </Text>
          <Text color="gray.600">
            Comprehensive pharmacy analytics and inventory management reports
          </Text>
        </Box>
        <HStack>
          <Button leftIcon={<Filter />} variant="outline">
            Advanced Filters
          </Button>
          <Button leftIcon={<AlertTriangle />} variant="outline" colorScheme="orange">
            Stock Alerts
          </Button>
        </HStack>
      </Flex>

      {/* Quick Stats */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={6} mb={6}>
        {quickStats.map((stat, index) => (
          <Card key={index} bg={cardBg} border="1px" borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel color="gray.600">{stat.label}</StatLabel>
                <StatNumber color={stat.trend === 'up' ? 'green.600' : 'red.600'}>
                  {stat.value}
                </StatNumber>
                <StatHelpText>
                  <StatArrow type={stat.trend === 'up' ? 'increase' : 'decrease'} />
                  {stat.change} from last month
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        ))}
      </Grid>

      {/* Stock Alerts */}
      {stockAlerts.some(alert => alert.count > 0) && (
        <Alert status="warning" mb={6} borderRadius="md">
          <AlertIcon />
          <VStack align="start" spacing={1} flex={1}>
            <Text fontWeight="semibold">Inventory Alerts</Text>
            <HStack wrap="wrap" spacing={4}>
              {stockAlerts.map((alert, index) => 
                alert.count > 0 && (
                  <HStack key={index} spacing={2}>
                    <Text fontSize="sm">{alert.type}:</Text>
                    <Badge colorScheme={alert.severity === 'error' ? 'red' : alert.severity === 'warning' ? 'orange' : 'blue'}>
                      {alert.count} items
                    </Badge>
                  </HStack>
                )
              )}
            </HStack>
          </VStack>
        </Alert>
      )}

      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6} mb={6}>
        {/* Report Categories */}
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <Text fontSize="lg" fontWeight="semibold" mb={6}>Pharmacy Report Categories</Text>
            
            <VStack spacing={4} align="stretch">
              {reportTypes.map((report) => (
                <Card key={report.id} variant="outline" _hover={{ shadow: 'md' }}>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <HStack>
                        <Box p={3} bg={`${report.color}.100`} borderRadius="lg">
                          {getIconComponent(report.icon, report.color)}
                        </Box>
                        <VStack align="start" spacing={1} flex={1}>
                          <Text fontWeight="semibold">
                            {report.title}
                          </Text>
                          <Badge colorScheme={report.color} variant="subtle">
                            Pharmacy Report
                          </Badge>
                        </VStack>
                      </HStack>
                      
                      <Text fontSize="sm" color="gray.600">
                        {report.description}
                      </Text>
                      
                      <VStack align="stretch" spacing={2}>
                        <Text fontSize="xs" fontWeight="medium" color="gray.700">
                          Report Includes:
                        </Text>
                        <HStack wrap="wrap" spacing={1}>
                          {report.fields.map((field, index) => (
                            <Badge key={index} size="sm" variant="outline" colorScheme="gray">
                              {field}
                            </Badge>
                          ))}
                        </HStack>
                      </VStack>
                      
                      <HStack spacing={2}>
                        <Button 
                          size="sm" 
                          colorScheme={report.color} 
                          leftIcon={<BarChart3 />}
                          onClick={() => handleGenerateReport(report)}
                          flex={1}
                        >
                          Generate Report
                        </Button>
                        <Button size="sm" variant="outline" leftIcon={<Eye />}>
                          Preview
                        </Button>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          </CardBody>
        </Card>

        {/* Top Selling Medicines */}
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <Text fontSize="lg" fontWeight="semibold" mb={4}>Top Selling Medicines</Text>
            
            <VStack spacing={4} align="stretch">
              {topMedicines.map((medicine, index) => (
                <Box key={index} p={3} bg="gray.50" borderRadius="md">
                  <VStack spacing={2} align="stretch">
                    <HStack justify="space-between">
                      <Text fontWeight="medium" fontSize="sm">
                        {medicine.name}
                      </Text>
                      <Badge colorScheme={medicine.color} size="sm">
                        {medicine.category}
                      </Badge>
                    </HStack>
                    <HStack justify="space-between" fontSize="xs" color="gray.600">
                      <Text>Units: {medicine.sales}</Text>
                      <Text fontWeight="semibold" color="green.600">
                        {medicine.revenue}
                      </Text>
                    </HStack>
                    <Progress 
                      value={(medicine.sales / 145) * 100} 
                      colorScheme={medicine.color}
                      size="sm"
                    />
                  </VStack>
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>
      </Grid>

      {/* Today's Activity */}
      <Card bg={cardBg} border="1px" borderColor={borderColor}>
        <CardBody>
          <Flex justify="space-between" align="center" mb={4}>
            <Text fontSize="lg" fontWeight="semibold">Today's Pharmacy Activity</Text>
            <Button size="sm" leftIcon={<Pill />} variant="outline">
              Live Inventory
            </Button>
          </Flex>
          
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
            <VStack align="stretch" spacing={3}>
              <Text fontSize="sm" fontWeight="medium" color="gray.700">Sales Today</Text>
              <HStack justify="space-between">
                <Text fontSize="sm">Prescriptions Filled</Text>
                <Badge colorScheme="blue">145</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">OTC Sales</Text>
                <Badge colorScheme="green">67</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">Total Revenue</Text>
                <Text fontSize="sm" fontWeight="semibold" color="green.600">₹28,450</Text>
              </HStack>
            </VStack>
            
            <VStack align="stretch" spacing={3}>
              <Text fontSize="sm" fontWeight="medium" color="gray.700">Inventory Updates</Text>
              <HStack justify="space-between">
                <Text fontSize="sm">New Stock Received</Text>
                <Badge colorScheme="blue">12 items</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">Stock Adjustments</Text>
                <Badge colorScheme="orange">5 items</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">Expired Removed</Text>
                <Badge colorScheme="red">2 items</Badge>
              </HStack>
            </VStack>
            
            <VStack align="stretch" spacing={3}>
              <Text fontSize="sm" fontWeight="medium" color="gray.700">Popular Categories</Text>
              <HStack justify="space-between">
                <Text fontSize="sm">Digestive</Text>
                <Badge>35%</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">Immunity</Text>
                <Badge>28%</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">Pain Relief</Text>
                <Badge>22%</Badge>
              </HStack>
            </VStack>
            
            <VStack align="stretch" spacing={3}>
              <Text fontSize="sm" fontWeight="medium" color="gray.700">Urgent Actions</Text>
              <HStack justify="space-between">
                <Text fontSize="sm">Reorder Required</Text>
                <Badge colorScheme="orange">8 items</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">Price Updates</Text>
                <Badge colorScheme="blue">3 items</Badge>
              </HStack>
              <HStack justify="space-between">
                <Text fontSize="sm">Vendor Follow-up</Text>
                <Badge colorScheme="purple">2 orders</Badge>
              </HStack>
            </VStack>
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Generate Report Modal */}
      <Modal isOpen={isGenerateOpen} onClose={onGenerateClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Generate {selectedReportType?.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text fontSize="sm" color="gray.600">
                {selectedReportType?.description}
              </Text>
              
              <HStack>
                <FormControl>
                  <FormLabel>From Date</FormLabel>
                  <Input 
                    type="date" 
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>To Date</FormLabel>
                  <Input 
                    type="date" 
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </FormControl>
              </HStack>
              
              <FormControl>
                <FormLabel>Medicine Category</FormLabel>
                <Select placeholder="Select category or all">
                  <option value="all">All Categories</option>
                  <option value="digestive">Digestive Medicines</option>
                  <option value="immunity">Immunity Boosters</option>
                  <option value="pain-relief">Pain Relief</option>
                  <option value="mental-health">Mental Health</option>
                  <option value="respiratory">Respiratory</option>
                  <option value="skin-care">Skin Care</option>
                  <option value="womens-health">Women's Health</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Manufacturer/Brand</FormLabel>
                <Select placeholder="Select manufacturer or all">
                  <option value="all">All Manufacturers</option>
                  <option value="himalaya">Himalaya Wellness</option>
                  <option value="patanjali">Patanjali Ayurved</option>
                  <option value="dabur">Dabur</option>
                  <option value="baidyanath">Baidyanath</option>
                  <option value="kerala-ayurveda">Kerala Ayurveda</option>
                  <option value="arya-vaidya">Arya Vaidya Sala</option>
                </Select>
              </FormControl>
              
              {selectedReportType?.id === 'sales-report' && (
                <>
                  <FormControl>
                    <FormLabel>Sales Type</FormLabel>
                    <Select placeholder="Select sales type">
                      <option value="all">All Sales</option>
                      <option value="prescription">Prescription Sales</option>
                      <option value="otc">Over-the-Counter Sales</option>
                      <option value="online">Online Orders</option>
                      <option value="walk-in">Walk-in Sales</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Payment Method</FormLabel>
                    <Select placeholder="Select payment method">
                      <option value="all">All Payment Methods</option>
                      <option value="cash">Cash</option>
                      <option value="card">Card Payment</option>
                      <option value="upi">UPI/Digital</option>
                      <option value="insurance">Insurance</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Customer Type</FormLabel>
                    <Select placeholder="Select customer type">
                      <option value="all">All Customers</option>
                      <option value="hospital-patients">Hospital Patients</option>
                      <option value="walk-in">Walk-in Customers</option>
                      <option value="online">Online Customers</option>
                      <option value="wholesale">Wholesale</option>
                    </Select>
                  </FormControl>
                </>
              )}
              
              {selectedReportType?.id === 'inventory-report' && (
                <>
                  <FormControl>
                    <FormLabel>Stock Status</FormLabel>
                    <Select placeholder="Select stock status">
                      <option value="all">All Items</option>
                      <option value="in-stock">In Stock</option>
                      <option value="low-stock">Low Stock</option>
                      <option value="out-of-stock">Out of Stock</option>
                      <option value="overstocked">Overstocked</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Expiry Status</FormLabel>
                    <Select placeholder="Select expiry status">
                      <option value="all">All Items</option>
                      <option value="expiring-30">Expiring in 30 days</option>
                      <option value="expiring-90">Expiring in 90 days</option>
                      <option value="expired">Already Expired</option>
                      <option value="valid">Valid Stock</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Vendor</FormLabel>
                    <Select placeholder="Select vendor or all">
                      <option value="all">All Vendors</option>
                      <option value="medplus">MedPlus Distributors</option>
                      <option value="apollo">Apollo Pharmacy</option>
                      <option value="ayush-dist">Ayush Distributors</option>
                      <option value="herbal-world">Herbal World</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Value Range</FormLabel>
                    <HStack>
                      <Input placeholder="Min value" type="number" />
                      <Input placeholder="Max value" type="number" />
                    </HStack>
                  </FormControl>
                </>
              )}
              
              <FormControl>
                <FormLabel>Include Details</FormLabel>
                <VStack align="stretch" spacing={2}>
                  <Checkbox defaultChecked>Medicine Details</Checkbox>
                  <Checkbox defaultChecked>Pricing Information</Checkbox>
                  <Checkbox defaultChecked>Vendor Information</Checkbox>
                  <Checkbox>Batch Numbers</Checkbox>
                  <Checkbox>Expiry Dates</Checkbox>
                  <Checkbox>GST Details</Checkbox>
                </VStack>
              </FormControl>
              
              <FormControl>
                <FormLabel>Report Format</FormLabel>
                <Select 
                  value={reportFormat}
                  onChange={(e) => setReportFormat(e.target.value)}
                >
                  <option value="pdf">PDF Report</option>
                  <option value="excel">Excel Spreadsheet</option>
                  <option value="csv">CSV Data File</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Additional Notes</FormLabel>
                <Textarea 
                  placeholder="Any specific requirements or notes for this report..."
                  rows={3}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onGenerateClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" leftIcon={<Download />}>
              Generate Report
            </Button>
            <Button colorScheme="gray" leftIcon={<Printer />} ml={2}>
              Print Preview
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PharmacyReports;
