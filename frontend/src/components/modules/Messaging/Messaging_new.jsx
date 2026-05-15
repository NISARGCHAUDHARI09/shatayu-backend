import React, { useState } from 'react';
import {
  Box, Card, CardBody, CardHeader, Text, Badge, Button, HStack, VStack, Flex,
  Input, Select, Textarea, Table, Thead, Tbody, Tr, Th, Td, TableContainer,
  IconButton, Tabs, TabList, Tab, TabPanels, TabPanel, Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton,
  useDisclosure, FormControl, FormLabel, Switch, SimpleGrid, Icon, Progress
} from '@chakra-ui/react';
import { MessageSquare, CheckCircle, TrendingUp, Activity, Eye, Send, Plus, Smartphone, MessageCircle, BarChart3 } from 'lucide-react';

// Mock data
const mockSMSMessages = [
  { id: 'SMS001', recipient: 'Rajesh Kumar (+91 9876543210)', message: 'Appointment tomorrow 10:00 AM.', status: 'delivered', timestamp: Date.now(), type: 'reminder', template: 'Appointment' },
  { id: 'SMS002', recipient: 'Meera Patel (+91 9876543211)', message: 'Lab reports ready.', status: 'sent', timestamp: Date.now(), type: 'lab', template: 'Lab' }
];
const mockWhatsAppMessages = [
  { id: 'WA001', recipient: 'Anil Singh (+91 9876500001)', message: 'Diet plan shared.', status: 'read', timestamp: Date.now(), type: 'diet', template: 'Diet', media: false },
  { id: 'WA002', recipient: 'Fatima Ali (+91 9876500002)', message: 'Payment received.', status: 'delivered', timestamp: Date.now(), type: 'payment', template: 'Payment', media: true }
];
const mockCampaigns = [
  { id: 'CAM001', name: 'Diabetes Camp', type: 'SMS', recipients: 120, delivered: 110, status: 'completed', startDate: '2025-09-01', description: 'Free screening week' },
  { id: 'CAM002', name: 'Wellness Followup', type: 'WhatsApp', recipients: 80, delivered: 55, status: 'in_progress', startDate: '2025-09-05', description: 'Follow-up reminders' }
];

// Mock recipient counts for bulk send
const recipientCounts = {
  patients: 1250,
  staff: 85,
  suppliers: 32
};

const Messaging = () => {
  // Filters
  const [activeTab, setActiveTab] = useState(0);
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Campaign form
  const [campaignForm, setCampaignForm] = useState({ name: '', type: 'sms', audience: '', template: '', message: '', scheduleNow: true, scheduleDate: '', scheduleTime: '' });

  // Composer
  const [composeChannel, setComposeChannel] = useState('sms');
  const [composeRecipient, setComposeRecipient] = useState('');
  const [composeMessage, setComposeMessage] = useState('');
  const [isBulkSend, setIsBulkSend] = useState(false);
  const [bulkRecipientType, setBulkRecipientType] = useState('patients');

  // Action modals state
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [analyticsCampaign, setAnalyticsCampaign] = useState(null);

  // Disclosures
  const composeDisc = useDisclosure();
  const campaignDisc = useDisclosure();
  const campaignsDisc = useDisclosure();
  const campaignDetailDisc = useDisclosure();
  const messageDetailDisc = useDisclosure();
  const analyticsDisc = useDisclosure();

  // Stats
  const smsStats = {
    total: mockSMSMessages.length,
    delivered: mockSMSMessages.filter(m => m.status === 'delivered').length
  };
  const whatsappStats = {
    total: mockWhatsAppMessages.length,
    delivered: mockWhatsAppMessages.filter(m => m.status === 'delivered' || m.status === 'read').length
  };
  const campaignStats = {
    active: mockCampaigns.filter(c => c.status === 'in_progress').length,
    completed: mockCampaigns.filter(c => c.status === 'completed').length
  };

  // Handlers
  const handleCampaignSubmit = () => {
    if (!campaignForm.name || !campaignForm.audience || !campaignForm.template) return;
    campaignDisc.onClose();
  };
  const handleViewMessage = (id, type) => {
    const pool = type === 'SMS' ? mockSMSMessages : mockWhatsAppMessages;
    const msg = pool.find(m => m.id === id);
    if (msg) { setSelectedMessage({ ...msg, channel: type }); messageDetailDisc.onOpen(); }
  };
  const handleResendMessage = (id) => {
    if (selectedMessage && selectedMessage.id === id) setSelectedMessage(prev => ({ ...prev, status: 'pending' }));
  };
  const handleReplyMessage = (id) => {
    const msg = mockWhatsAppMessages.find(m => m.id === id);
    if (msg) {
      setComposeChannel('whatsapp');
      setComposeRecipient(msg.recipient.split(' (')[0]);
      setComposeMessage(`Replying: ${msg.message}`);
      composeDisc.onOpen();
    }
  };
  const openCampaignDetails = (c) => { setSelectedCampaign(c); campaignDetailDisc.onOpen(); };
  const duplicateCampaign = (c) => { campaignDetailDisc.onClose(); setCampaignForm({ ...campaignForm, name: c.name + ' Copy', message: c.description }); campaignDisc.onOpen(); };
  const openAnalytics = (c) => { setAnalyticsCampaign(c); analyticsDisc.onOpen(); };

  const filteredSMS = mockSMSMessages.filter(m => (typeFilter === 'all' || m.type === typeFilter) && (m.recipient.toLowerCase().includes(searchTerm.toLowerCase()) || m.message.toLowerCase().includes(searchTerm.toLowerCase())));
  const filteredWA = mockWhatsAppMessages.filter(m => (typeFilter === 'all' || m.type === typeFilter) && (m.recipient.toLowerCase().includes(searchTerm.toLowerCase()) || m.message.toLowerCase().includes(searchTerm.toLowerCase())));

  return (
    <VStack align="stretch" spacing={8} p={6}>
      {/* Header Actions */}
      <Card shadow="lg" borderRadius="xl">
        <CardBody>
          <Flex direction={{ base:'column', md:'row' }} justify="space-between" gap={6}>
            <VStack align="start" spacing={3} flex={1}>
              <Text fontSize="3xl" fontWeight="bold" bgGradient="linear(to-r, blue.500, purple.500)" bgClip="text">Messaging Center</Text>
              <Text fontSize="sm" color="gray.600">Send SMS / WhatsApp updates and manage campaigns.</Text>
              <HStack spacing={4} w="full">
                <Input placeholder="Search messages..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} maxW="300px" />
                <Select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)} maxW="200px">
                  <option value="all">All Types</option>
                  <option value="reminder">Reminder</option>
                  <option value="lab">Lab</option>
                  <option value="diet">Diet</option>
                  <option value="payment">Payment</option>
                </Select>
              </HStack>
            </VStack>
            <VStack align="end" spacing={3}>
              <HStack>
                <Button leftIcon={<Plus size={16} />} colorScheme="purple" onClick={campaignDisc.onOpen}>New Campaign</Button>
                <Button leftIcon={<Eye size={16} />} variant="outline" colorScheme="teal" onClick={campaignsDisc.onOpen}>View Campaigns</Button>
                <Button leftIcon={<Send size={16} />} colorScheme="blue" onClick={composeDisc.onOpen}>Send Message</Button>
              </HStack>
              <Text fontSize="xs" color="gray.500">Quick actions</Text>
            </VStack>
          </Flex>
        </CardBody>
      </Card>

      {/* Statistics */}
      <SimpleGrid columns={{ base:1, md:2, lg:3 }} spacing={6}>
        {[{icon:MessageSquare,color:'blue',value:smsStats.total+whatsappStats.total,label:'Total Messages',sub:'+12% MoM'},
          {icon:CheckCircle,color:'green',value:smsStats.delivered+whatsappStats.delivered,label:'Delivered',sub:'98.5% rate'},
          {icon:TrendingUp,color:'purple',value:campaignStats.active,label:'Active Campaigns',sub:`${campaignStats.completed} completed`}].map((c,i)=>(
          <Card key={i} border="1px solid" borderColor={`${c.color}.100`} _hover={{shadow:'xl',transform:'translateY(-4px)'}} transition="all .25s" borderRadius="2xl">
            <CardBody>
              <HStack align="start" spacing={4}>
                <Box p={4} bg={`${c.color}.500`} color="white" borderRadius="xl"><Icon as={c.icon} /></Box>
                <VStack align="start" spacing={1}>
                  <Text fontSize="2xl" fontWeight="bold" color={`${c.color}.600`}>{c.value}</Text>
                  <Text fontSize="sm" color="gray.600">{c.label}</Text>
                  <Text fontSize="xs" color={`${c.color}.500`} fontWeight="semibold">{c.sub}</Text>
                </VStack>
              </HStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      {/* Tabs */}
      <Card borderRadius="xl" shadow="xl">
        <CardBody p={0}>
          <Tabs variant="enclosed" index={activeTab} onChange={setActiveTab}>
            <TabList px={4} pt={4}>
              <Tab>SMS Messages</Tab>
              <Tab>WhatsApp Messages</Tab>
              <Tab>Analytics</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <TableContainer>
                  <Table size="sm">
                    <Thead>
                      <Tr>
                        <Th>Recipient</Th><Th>Message</Th><Th>Template</Th><Th>Status</Th><Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredSMS.map(m => (
                        <Tr key={m.id} _hover={{bg:'blue.50'}}>
                          <Td>{m.recipient.split(' (')[0]}</Td>
                          <Td><Text noOfLines={1} maxW="250px">{m.message}</Text></Td>
                          <Td><Badge>{m.template}</Badge></Td>
                          <Td><Badge colorScheme={m.status==='delivered'?'green':m.status==='sent'?'blue':m.status==='failed'?'red':'yellow'}>{m.status}</Badge></Td>
                          <Td>
                            <HStack spacing={2}>
                              <Button size="xs" leftIcon={<Eye size={12} />} onClick={()=>handleViewMessage(m.id,'SMS')}>View</Button>
                              <Button size="xs" variant="outline" leftIcon={<Send size={12} />} onClick={()=>handleResendMessage(m.id)}>Resend</Button>
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </TabPanel>
              <TabPanel>
                <TableContainer>
                  <Table size="sm">
                    <Thead>
                      <Tr>
                        <Th>Recipient</Th><Th>Message</Th><Th>Template</Th><Th>Status</Th><Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredWA.map(m => (
                        <Tr key={m.id} _hover={{bg:'green.50'}}>
                          <Td>{m.recipient.split(' (')[0]}</Td>
                          <Td><Text noOfLines={1} maxW="250px">{m.message}</Text></Td>
                          <Td><Badge>{m.template}</Badge></Td>
                          <Td><Badge colorScheme={m.status==='read'?'purple':m.status==='delivered'?'green':'yellow'}>{m.status}</Badge></Td>
                          <Td>
                            <HStack spacing={2}>
                              <Button size="xs" leftIcon={<Eye size={12} />} onClick={()=>handleViewMessage(m.id,'WhatsApp')}>View</Button>
                              <Button size="xs" variant="outline" leftIcon={<Send size={12} />} onClick={()=>handleReplyMessage(m.id)}>Reply</Button>
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </TabPanel>
              <TabPanel>
                <VStack align="stretch" spacing={4}>
                  <Text fontWeight="bold">Campaign Overview</Text>
                  <TableContainer>
                    <Table size="sm">
                      <Thead><Tr><Th>Name</Th><Th>Status</Th><Th>Delivered</Th><Th>Recipients</Th><Th>Actions</Th></Tr></Thead>
                      <Tbody>
                        {mockCampaigns.map(c => (
                          <Tr key={c.id} _hover={{bg:'gray.50'}}>
                            <Td>
                              <VStack align="start" spacing={0}>
                                <Text fontWeight="semibold">{c.name}</Text>
                                <Text fontSize="xs" color="gray.500">{c.description}</Text>
                              </VStack>
                            </Td>
                            <Td><Badge colorScheme={c.status==='completed'?'green':c.status==='in_progress'?'blue':'orange'}>{c.status}</Badge></Td>
                            <Td>{c.delivered}</Td>
                            <Td>{c.recipients}</Td>
                            <Td>
                              <HStack spacing={1}>
                                <IconButton size="xs" aria-label="details" icon={<Eye size={12} />} onClick={()=>openCampaignDetails(c)} />
                                <IconButton size="xs" aria-label="duplicate" icon={<Send size={12} />} onClick={()=>duplicateCampaign(c)} />
                                <IconButton size="xs" aria-label="analytics" icon={<BarChart3 size={12} />} onClick={()=>openAnalytics(c)} />
                              </HStack>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CardBody>
      </Card>

      {/* Campaigns Modal */}
      <Modal isOpen={campaignsDisc.isOpen} onClose={campaignsDisc.onClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>All Campaigns</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Table size="sm">
              <Thead><Tr><Th>Name</Th><Th>Type</Th><Th>Status</Th><Th>Recipients</Th><Th>Delivered</Th><Th>Actions</Th></Tr></Thead>
              <Tbody>
                {mockCampaigns.map(c => (
                  <Tr key={c.id} _hover={{bg:'gray.50'}}>
                    <Td>{c.name}</Td>
                    <Td><Badge>{c.type}</Badge></Td>
                    <Td><Badge colorScheme={c.status==='completed'?'green':c.status==='in_progress'?'blue':'gray'}>{c.status}</Badge></Td>
                    <Td>{c.recipients}</Td>
                    <Td>{c.delivered}</Td>
                    <Td>
                      <HStack spacing={1}>
                        <IconButton size="xs" icon={<Eye size={12} />} aria-label="details" onClick={()=>openCampaignDetails(c)} />
                        <IconButton size="xs" icon={<Send size={12} />} aria-label="duplicate" onClick={()=>duplicateCampaign(c)} />
                        <IconButton size="xs" icon={<BarChart3 size={12} />} aria-label="analytics" onClick={()=>openAnalytics(c)} />
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" mr={3} onClick={()=>{campaignsDisc.onClose(); campaignDisc.onOpen();}}>New Campaign</Button>
            <Button variant="outline" onClick={campaignsDisc.onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Campaign Detail Modal */}
      <Modal isOpen={campaignDetailDisc.isOpen} onClose={campaignDetailDisc.onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Campaign Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedCampaign && (
              <VStack align="stretch" spacing={3} fontSize="sm">
                <HStack justify="space-between"><Text fontWeight="bold">{selectedCampaign.name}</Text><Badge>{selectedCampaign.status}</Badge></HStack>
                <Text>{selectedCampaign.description}</Text>
                <SimpleGrid columns={2} spacing={3}>
                  <Box><Text fontWeight="semibold">Type</Text><Text>{selectedCampaign.type}</Text></Box>
                  <Box><Text fontWeight="semibold">Recipients</Text><Text>{selectedCampaign.recipients}</Text></Box>
                  <Box><Text fontWeight="semibold">Delivered</Text><Text>{selectedCampaign.delivered}</Text></Box>
                  <Box><Text fontWeight="semibold">Start Date</Text><Text>{selectedCampaign.startDate}</Text></Box>
                  <Box><Text fontWeight="semibold">Success Rate</Text><Text>{selectedCampaign.recipients>0? Math.round((selectedCampaign.delivered/selectedCampaign.recipients)*100)+'%':'0%'}</Text></Box>
                </SimpleGrid>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={()=> duplicateCampaign(selectedCampaign)}>Duplicate</Button>
            <Button colorScheme="blue" onClick={campaignDetailDisc.onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Analytics Modal */}
      <Modal isOpen={analyticsDisc.isOpen} onClose={analyticsDisc.onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Campaign Analytics</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {analyticsCampaign && (
              <VStack align="stretch" spacing={4}>
                <Text fontWeight="bold">{analyticsCampaign.name}</Text>
                <Progress value={analyticsCampaign.recipients? (analyticsCampaign.delivered/analyticsCampaign.recipients)*100:0} borderRadius="md" />
                <HStack justify="space-between"><Text>Delivered</Text><Text>{analyticsCampaign.delivered}/{analyticsCampaign.recipients}</Text></HStack>
                <HStack justify="space-between"><Text>Start Date</Text><Text>{analyticsCampaign.startDate}</Text></HStack>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter><Button onClick={analyticsDisc.onClose}>Close</Button></ModalFooter>
        </ModalContent>
      </Modal>

      {/* Message Detail Modal */}
      <Modal isOpen={messageDetailDisc.isOpen} onClose={messageDetailDisc.onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Message Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedMessage && (
              <VStack align="stretch" spacing={3} fontSize="sm">
                <HStack justify="space-between"><Text fontWeight="semibold">Channel</Text><Badge>{selectedMessage.channel}</Badge></HStack>
                <HStack justify="space-between"><Text fontWeight="semibold">Recipient</Text><Text>{selectedMessage.recipient}</Text></HStack>
                <HStack justify="space-between"><Text fontWeight="semibold">Template</Text><Text>{selectedMessage.template}</Text></HStack>
                <HStack justify="space-between"><Text fontWeight="semibold">Status</Text><Badge>{selectedMessage.status}</Badge></HStack>
                <Box><Text fontWeight="semibold" mb={1}>Message</Text><Box p={3} bg="gray.50" borderRadius="md" borderWidth="1px">{selectedMessage.message}</Box></Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            {selectedMessage?.channel==='WhatsApp' && <Button mr={3} onClick={()=>handleReplyMessage(selectedMessage.id)}>Reply</Button>}
            <Button onClick={messageDetailDisc.onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Compose Modal */}
      <Modal isOpen={composeDisc.isOpen} onClose={composeDisc.onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Compose Message</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="stretch" spacing={4}>
              <HStack>
                <Button size="sm" colorScheme={composeChannel==='sms'?'blue':'gray'} onClick={()=>setComposeChannel('sms')}>SMS</Button>
                <Button size="sm" colorScheme={composeChannel==='whatsapp'?'green':'gray'} onClick={()=>setComposeChannel('whatsapp')}>WhatsApp</Button>
              </HStack>
              
              {/* Bulk Send Toggle */}
              <FormControl display="flex" alignItems="center">
                <FormLabel mb={0} fontSize="sm">Bulk Send</FormLabel>
                <Switch 
                  isChecked={isBulkSend} 
                  onChange={e => {
                    setIsBulkSend(e.target.checked);
                    if (e.target.checked) {
                      setComposeRecipient('');
                    }
                  }} 
                  colorScheme="blue"
                />
              </FormControl>

              {/* Recipient Selection */}
              {isBulkSend ? (
                <FormControl>
                  <FormLabel>Send To</FormLabel>
                  <Select 
                    value={bulkRecipientType} 
                    onChange={e => setBulkRecipientType(e.target.value)}
                    placeholder="Select recipient group"
                  >
                    <option value="patients">All Patients ({recipientCounts.patients})</option>
                    <option value="staff">All Staff Members ({recipientCounts.staff})</option>
                    <option value="suppliers">All Suppliers ({recipientCounts.suppliers})</option>
                  </Select>
                  {bulkRecipientType && (
                    <HStack justify="space-between" mt={2}>
                      <Text fontSize="xs" color="gray.500">
                        {bulkRecipientType === 'patients' && 'Message will be sent to all registered patients'}
                        {bulkRecipientType === 'staff' && 'Message will be sent to all hospital staff members'}
                        {bulkRecipientType === 'suppliers' && 'Message will be sent to all suppliers and vendors'}
                      </Text>
                      <Badge colorScheme="blue" fontSize="xs">
                        {recipientCounts[bulkRecipientType]} recipients
                      </Badge>
                    </HStack>
                  )}
                </FormControl>
              ) : (
                <FormControl>
                  <FormLabel>Recipient</FormLabel>
                  <Input 
                    value={composeRecipient} 
                    onChange={e=>setComposeRecipient(e.target.value)} 
                    placeholder="Enter patient name or phone number" 
                  />
                </FormControl>
              )}

              <FormControl>
                <FormLabel>Message</FormLabel>
                <Textarea 
                  rows={4} 
                  value={composeMessage} 
                  onChange={e=>setComposeMessage(e.target.value)} 
                  placeholder="Type your message here..." 
                />
                <HStack justify="space-between" mt={1}>
                  <Text fontSize="xs" color="gray.500">
                    {composeMessage.length}/160 characters
                  </Text>
                  {isBulkSend && bulkRecipientType && recipientCounts[bulkRecipientType] > 100 && (
                    <Text fontSize="xs" color="orange.500" fontWeight="medium">
                      ⚠️ Large bulk send - please review message carefully
                    </Text>
                  )}
                </HStack>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button 
              colorScheme="blue" 
              mr={3} 
              onClick={()=>{
                if (isBulkSend && !bulkRecipientType) return;
                if (!isBulkSend && !composeRecipient) return;
                if (!composeMessage.trim()) return;
                
                // Handle bulk send logic here
                if (isBulkSend) {
                  console.log(`Sending ${composeChannel} to all ${bulkRecipientType}:`, composeMessage);
                } else {
                  console.log(`Sending ${composeChannel} to ${composeRecipient}:`, composeMessage);
                }
                
                // Reset form
                setComposeRecipient('');
                setComposeMessage('');
                setIsBulkSend(false);
                setBulkRecipientType('patients');
                composeDisc.onClose();
              }}
              isDisabled={
                (!isBulkSend && !composeRecipient) || 
                (isBulkSend && !bulkRecipientType) || 
                !composeMessage.trim()
              }
            >
              {isBulkSend 
                ? `Send to All ${bulkRecipientType.charAt(0).toUpperCase() + bulkRecipientType.slice(1)}`
                : 'Send Message'
              }
            </Button>
            <Button variant="outline" onClick={() => {
              setComposeRecipient('');
              setComposeMessage('');
              setIsBulkSend(false);
              setBulkRecipientType('patients');
              composeDisc.onClose();
            }}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Create Campaign Modal */}
      <Modal isOpen={campaignDisc.isOpen} onClose={campaignDisc.onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Campaign</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired><FormLabel>Name</FormLabel><Input value={campaignForm.name} onChange={e=>setCampaignForm({...campaignForm,name:e.target.value})} /></FormControl>
              <FormControl isRequired>
                <FormLabel>Channel</FormLabel>
                <Select value={campaignForm.type} onChange={e=>setCampaignForm({...campaignForm,type:e.target.value})}>
                  <option value="sms">SMS</option>
                  <option value="whatsapp">WhatsApp</option>
                </Select>
              </FormControl>
              <FormControl isRequired><FormLabel>Audience</FormLabel><Input value={campaignForm.audience} onChange={e=>setCampaignForm({...campaignForm,audience:e.target.value})} /></FormControl>
              <FormControl isRequired><FormLabel>Template</FormLabel><Input value={campaignForm.template} onChange={e=>setCampaignForm({...campaignForm,template:e.target.value})} /></FormControl>
              <FormControl><FormLabel>Message</FormLabel><Textarea value={campaignForm.message} onChange={e=>setCampaignForm({...campaignForm,message:e.target.value})} /></FormControl>
              <FormControl display="flex" alignItems="center"><FormLabel mb={0}>Send Now?</FormLabel><Switch isChecked={campaignForm.scheduleNow} onChange={e=>setCampaignForm({...campaignForm,scheduleNow:e.target.checked})} /></FormControl>
              {!campaignForm.scheduleNow && (
                <HStack>
                  <Input type="date" value={campaignForm.scheduleDate} onChange={e=>setCampaignForm({...campaignForm,scheduleDate:e.target.value})} />
                  <Input type="time" value={campaignForm.scheduleTime} onChange={e=>setCampaignForm({...campaignForm,scheduleTime:e.target.value})} />
                </HStack>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCampaignSubmit}>Create</Button>
            <Button variant="outline" onClick={campaignDisc.onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default Messaging;
