import React, { useState } from 'react';
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  VStack,
  HStack,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Grid,
  GridItem,
  Badge,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  SimpleGrid
} from '@chakra-ui/react';
import { 
  Plus, 
  Printer, 
  Save, 
  FileText, 
  User, 
  Calendar,
  Clock,
  Trash2,
  Edit
} from 'lucide-react';

const AyurvedicPrescription = () => {
  const [prescription, setPrescription] = useState({
    // Patient Details
    patientName: '',
    age: '',
    gender: '',
    caseId: '',
    date: new Date().toISOString().split('T')[0],
    
    // Present Complaint
    presentComplaint: '',
    complaintDuration: '',
    
    // Ayurvedic Assessment
    prakriti: '', // Constitutional type
    vikriti: '', // Current imbalance
    agni: '', // Digestive fire
    ojas: '', // Vital essence
    tejas: '', // Metabolic fire
    prana: '', // Life force
    
    // Clinical Assessment
    roga: '', // Disease/condition
    hetu: '', // Causative factors
    samprapti: '', // Pathogenesis
    lakshana: '', // Symptoms
    
    // Examination (Ashtavidha Pariksha)
    nadi: '', // Pulse
    mutra: '', // Urine
    mala: '', // Stool
    jihva: '', // Tongue
    shabda: '', // Voice
    sparsha: '', // Touch/skin
    drik: '', // Eyes
    akriti: '', // General appearance
    
    // Treatment Plan
    chikitsa: '', // Treatment approach
    pathya: '', // Diet recommendations
    apathya: '', // Things to avoid
    vihara: '', // Lifestyle recommendations
    
    // Medicines
    medicines: [],
    
    // Follow-up
    followUpDate: '',
    specialInstructions: ''
  });

  const [currentMedicine, setCurrentMedicine] = useState({
    name: '',
    type: '', // Kashaya, Churna, Vati, etc.
    dose: '',
    anupana: '', // Vehicle for administration
    kala: '', // Time of administration
    duration: '',
    instructions: ''
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Ayurvedic Medicine Types
  const medicineTypes = [
    'Kashaya (Decoction)',
    'Churna (Powder)',
    'Vati/Gutika (Tablet)',
    'Avaleha (Jam/Paste)',
    'Ghrita (Medicated Ghee)',
    'Taila (Medicated Oil)',
    'Asava/Arishta (Fermented)',
    'Bhasma (Calcined)',
    'Rasa (Mercury preparations)',
    'Kwatha (Concentrated decoction)'
  ];

  // Anupana (Vehicles)
  const anupanaOptions = [
    'Ushna Jala (Warm Water)',
    'Madhu (Honey)',
    'Ghrita (Ghee)',
    'Dugdha (Milk)',
    'Takra (Buttermilk)',
    'Arista (Fermented liquid)',
    'Swarasa (Fresh juice)',
    'Coconut Water',
    'After meals',
    'Before meals'
  ];

  // Kala (Time of administration)
  const kalaOptions = [
    'Pratar (Morning)',
    'Madhyahna (Afternoon)', 
    'Sayam (Evening)',
    'Ratri (Night)',
    'Pratah-Sayam (Morning-Evening)',
    'Bhojana Purva (Before meals)',
    'Bhojana Madhya (During meals)',
    'Bhojana Anta (After meals)',
    'Nishita (Midnight)',
    'As required'
  ];

  // Prakriti types
  const prakritiTypes = [
    'Vata Prakriti',
    'Pitta Prakriti', 
    'Kapha Prakriti',
    'Vata-Pitta',
    'Vata-Kapha',
    'Pitta-Kapha',
    'Tridoshaja'
  ];

  // Agni states
  const agniStates = [
    'Sama Agni (Balanced)',
    'Vishama Agni (Irregular)',
    'Tikshna Agni (Sharp)',
    'Manda Agni (Weak)'
  ];

  const addMedicine = () => {
    if (currentMedicine.name && currentMedicine.dose) {
      setPrescription(prev => ({
        ...prev,
        medicines: [...prev.medicines, { ...currentMedicine, id: Date.now() }]
      }));
      setCurrentMedicine({
        name: '',
        type: '',
        dose: '',
        anupana: '',
        kala: '',
        duration: '',
        instructions: ''
      });
      onClose();
    }
  };

  const removeMedicine = (id) => {
    setPrescription(prev => ({
      ...prev,
      medicines: prev.medicines.filter(med => med.id !== id)
    }));
  };

  const handleSave = () => {
    console.log('Saving prescription:', prescription);
    // Add save logic here
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Box p={6}>
      <Card bg={cardBg} border="1px" borderColor={borderColor} shadow="sm">
        <CardHeader>
          <HStack justify="space-between">
            <VStack align="start" spacing={0}>
              <Heading size="lg" color="green.600">Ayurvedic Prescription</Heading>
              <Text fontSize="sm" color="gray.500">Digital Prescription Management</Text>
            </VStack>
            <HStack>
              <Button leftIcon={<Save />} colorScheme="green" variant="outline" onClick={handleSave}>
                Save
              </Button>
              <Button leftIcon={<Printer />} colorScheme="blue" onClick={handlePrint}>
                Print
              </Button>
            </HStack>
          </HStack>
        </CardHeader>

        <CardBody>
          <VStack spacing={6} align="stretch">
            {/* Patient Information */}
            <Card variant="outline">
              <CardHeader>
                <Heading size="md" color="green.600">रोगी विवरण (Patient Details)</Heading>
              </CardHeader>
              <CardBody>
                <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
                  <FormControl>
                    <FormLabel>Patient Name / रोगी का नाम</FormLabel>
                    <Input 
                      value={prescription.patientName}
                      onChange={(e) => setPrescription(prev => ({...prev, patientName: e.target.value}))}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Age / आयु</FormLabel>
                    <Input 
                      type="number"
                      value={prescription.age}
                      onChange={(e) => setPrescription(prev => ({...prev, age: e.target.value}))}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Gender / लिंग</FormLabel>
                    <Select 
                      value={prescription.gender}
                      onChange={(e) => setPrescription(prev => ({...prev, gender: e.target.value}))}
                    >
                      <option value="">Select</option>
                      <option value="Male">Male / पुरुष</option>
                      <option value="Female">Female / स्त्री</option>
                      <option value="Other">Other / अन्य</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Case ID</FormLabel>
                    <Input 
                      value={prescription.caseId}
                      onChange={(e) => setPrescription(prev => ({...prev, caseId: e.target.value}))}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Date / दिनांक</FormLabel>
                    <Input 
                      type="date"
                      value={prescription.date}
                      onChange={(e) => setPrescription(prev => ({...prev, date: e.target.value}))}
                    />
                  </FormControl>
                </Grid>
              </CardBody>
            </Card>

            {/* Present Complaint */}
            <Card variant="outline">
              <CardHeader>
                <Heading size="md" color="green.600">वर्तमान शिकायत (Present Complaint)</Heading>
              </CardHeader>
              <CardBody>
                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                  <FormControl>
                    <FormLabel>Present Complaint / मुख्य शिकायत</FormLabel>
                    <Textarea 
                      value={prescription.presentComplaint}
                      onChange={(e) => setPrescription(prev => ({...prev, presentComplaint: e.target.value}))}
                      placeholder="Chief complaints and symptoms"
                      rows={4}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Duration / अवधि</FormLabel>
                    <Input 
                      value={prescription.complaintDuration}
                      onChange={(e) => setPrescription(prev => ({...prev, complaintDuration: e.target.value}))}
                      placeholder="e.g., 2 weeks, 1 month, 6 months"
                    />
                  </FormControl>
                </Grid>
              </CardBody>
            </Card>

            {/* Ayurvedic Assessment */}
            <Card variant="outline">
              <CardHeader>
                <Heading size="md" color="green.600">आयुर्वेदिक निदान (Ayurvedic Assessment)</Heading>
              </CardHeader>
              <CardBody>
                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                  <FormControl>
                    <FormLabel>Prakriti / प्रकृति (Constitution)</FormLabel>
                    <Select 
                      value={prescription.prakriti}
                      onChange={(e) => setPrescription(prev => ({...prev, prakriti: e.target.value}))}
                    >
                      <option value="">Select Prakriti</option>
                      {prakritiTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Vikriti / विकृति (Current Imbalance)</FormLabel>
                    <Input 
                      value={prescription.vikriti}
                      onChange={(e) => setPrescription(prev => ({...prev, vikriti: e.target.value}))}
                      placeholder="e.g., Vata Vriddhi, Pitta Kopa"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Agni / अग्नि (Digestive Fire)</FormLabel>
                    <Select 
                      value={prescription.agni}
                      onChange={(e) => setPrescription(prev => ({...prev, agni: e.target.value}))}
                    >
                      <option value="">Select Agni State</option>
                      {agniStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Ojas / ओजस् (Vital Essence)</FormLabel>
                    <Select 
                      value={prescription.ojas}
                      onChange={(e) => setPrescription(prev => ({...prev, ojas: e.target.value}))}
                    >
                      <option value="">Select Ojas State</option>
                      <option value="Uttama (Excellent)">Uttama (Excellent)</option>
                      <option value="Madhya (Moderate)">Madhya (Moderate)</option>
                      <option value="Hina (Poor)">Hina (Poor)</option>
                    </Select>
                  </FormControl>
                </Grid>
              </CardBody>
            </Card>

            {/* Clinical Assessment */}
            <Card variant="outline">
              <CardHeader>
                <Heading size="md" color="green.600">रोग निदान (Clinical Assessment)</Heading>
              </CardHeader>
              <CardBody>
                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                  <FormControl>
                    <FormLabel>Roga / रोग (Disease/Condition)</FormLabel>
                    <Input 
                      value={prescription.roga}
                      onChange={(e) => setPrescription(prev => ({...prev, roga: e.target.value}))}
                      placeholder="e.g., Amavata, Grahani, Prameha"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Hetu / हेतु (Causative Factors)</FormLabel>
                    <Textarea 
                      value={prescription.hetu}
                      onChange={(e) => setPrescription(prev => ({...prev, hetu: e.target.value}))}
                      placeholder="Ahara-Vihara Hetu (dietary and lifestyle causes)"
                      rows={2}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Samprapti / सम्प्राप्ति (Pathogenesis)</FormLabel>
                    <Textarea 
                      value={prescription.samprapti}
                      onChange={(e) => setPrescription(prev => ({...prev, samprapti: e.target.value}))}
                      placeholder="Disease process and dosha involvement"
                      rows={2}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Lakshana / लक्षण (Symptoms)</FormLabel>
                    <Textarea 
                      value={prescription.lakshana}
                      onChange={(e) => setPrescription(prev => ({...prev, lakshana: e.target.value}))}
                      placeholder="Main symptoms and signs"
                      rows={2}
                    />
                  </FormControl>
                </Grid>
              </CardBody>
            </Card>

            {/* Ashtavidha Pariksha (Eight-fold Examination) */}
            <Card variant="outline">
              <CardHeader>
                <Heading size="md" color="green.600">अष्टविध परीक्षा (Eight-fold Examination)</Heading>
              </CardHeader>
              <CardBody>
                <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={4}>
                  <FormControl>
                    <FormLabel>Nadi / नाड़ी (Pulse)</FormLabel>
                    <Input 
                      value={prescription.nadi}
                      onChange={(e) => setPrescription(prev => ({...prev, nadi: e.target.value}))}
                      placeholder="e.g., Vata gati, irregular"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Mutra / मूत्र (Urine)</FormLabel>
                    <Input 
                      value={prescription.mutra}
                      onChange={(e) => setPrescription(prev => ({...prev, mutra: e.target.value}))}
                      placeholder="Color, odor, frequency"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Mala / मल (Stool)</FormLabel>
                    <Input 
                      value={prescription.mala}
                      onChange={(e) => setPrescription(prev => ({...prev, mala: e.target.value}))}
                      placeholder="Consistency, frequency"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Jihva / जिह्वा (Tongue)</FormLabel>
                    <Input 
                      value={prescription.jihva}
                      onChange={(e) => setPrescription(prev => ({...prev, jihva: e.target.value}))}
                      placeholder="Color, coating, texture"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Shabda / शब्द (Voice)</FormLabel>
                    <Input 
                      value={prescription.shabda}
                      onChange={(e) => setPrescription(prev => ({...prev, shabda: e.target.value}))}
                      placeholder="Quality of speech"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Sparsha / स्पर्श (Touch/Skin)</FormLabel>
                    <Input 
                      value={prescription.sparsha}
                      onChange={(e) => setPrescription(prev => ({...prev, sparsha: e.target.value}))}
                      placeholder="Temperature, texture"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Drik / दृक् (Eyes)</FormLabel>
                    <Input 
                      value={prescription.drik}
                      onChange={(e) => setPrescription(prev => ({...prev, drik: e.target.value}))}
                      placeholder="Color, clarity, movement"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Akriti / आकृति (Appearance)</FormLabel>
                    <Input 
                      value={prescription.akriti}
                      onChange={(e) => setPrescription(prev => ({...prev, akriti: e.target.value}))}
                      placeholder="General build, posture"
                    />
                  </FormControl>
                </Grid>
              </CardBody>
            </Card>

            {/* Medicines */}
            <Card variant="outline">
              <CardHeader>
                <HStack justify="space-between">
                  <Heading size="md" color="green.600">औषधि योजना (Medicine Plan)</Heading>
                  <Button leftIcon={<Plus />} colorScheme="green" size="sm" onClick={onOpen}>
                    Add Medicine
                  </Button>
                </HStack>
              </CardHeader>
              <CardBody>
                {prescription.medicines.length > 0 ? (
                  <TableContainer>
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th>Medicine / औषधि</Th>
                          <Th>Type / प्रकार</Th>
                          <Th>Dose / मात्रा</Th>
                          <Th>Anupana / अनुपान</Th>
                          <Th>Kala / काल</Th>
                          <Th>Duration / अवधि</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {prescription.medicines.map((medicine) => (
                          <Tr key={medicine.id}>
                            <Td>
                              <VStack align="start" spacing={0}>
                                <Text fontWeight="medium">{medicine.name}</Text>
                                {medicine.instructions && (
                                  <Text fontSize="xs" color="gray.500">{medicine.instructions}</Text>
                                )}
                              </VStack>
                            </Td>
                            <Td>
                              <Badge colorScheme="green" variant="subtle">
                                {medicine.type}
                              </Badge>
                            </Td>
                            <Td>{medicine.dose}</Td>
                            <Td>{medicine.anupana}</Td>
                            <Td>{medicine.kala}</Td>
                            <Td>{medicine.duration}</Td>
                            <Td>
                              <IconButton
                                icon={<Trash2 />}
                                size="sm"
                                colorScheme="red"
                                variant="ghost"
                                onClick={() => removeMedicine(medicine.id)}
                              />
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Text color="gray.500" textAlign="center" py={8}>
                    No medicines added yet. Click "Add Medicine" to start.
                  </Text>
                )}
              </CardBody>
            </Card>

            {/* Treatment Plan */}
            <Card variant="outline">
              <CardHeader>
                <Heading size="md" color="green.600">चिकित्सा योजना (Treatment Plan)</Heading>
              </CardHeader>
              <CardBody>
                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                  <FormControl>
                    <FormLabel>Chikitsa / चिकित्सा (Treatment Approach)</FormLabel>
                    <Textarea 
                      value={prescription.chikitsa}
                      onChange={(e) => setPrescription(prev => ({...prev, chikitsa: e.target.value}))}
                      placeholder="e.g., Shodhana, Shamana, Rasayana"
                      rows={3}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Pathya / पथ्य (Diet Recommendations)</FormLabel>
                    <Textarea 
                      value={prescription.pathya}
                      onChange={(e) => setPrescription(prev => ({...prev, pathya: e.target.value}))}
                      placeholder="Beneficial foods and dietary guidelines"
                      rows={3}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Apathya / अपथ्य (Things to Avoid)</FormLabel>
                    <Textarea 
                      value={prescription.apathya}
                      onChange={(e) => setPrescription(prev => ({...prev, apathya: e.target.value}))}
                      placeholder="Foods and activities to avoid"
                      rows={3}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Vihara / विहार (Lifestyle Recommendations)</FormLabel>
                    <Textarea 
                      value={prescription.vihara}
                      onChange={(e) => setPrescription(prev => ({...prev, vihara: e.target.value}))}
                      placeholder="Daily routine, exercise, sleep pattern"
                      rows={3}
                    />
                  </FormControl>
                </Grid>
              </CardBody>
            </Card>

            {/* Follow-up */}
            <Card variant="outline">
              <CardHeader>
                <Heading size="md" color="green.600">पुनर्दर्शन (Follow-up)</Heading>
              </CardHeader>
              <CardBody>
                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                  <FormControl>
                    <FormLabel>Follow-up Date / पुनर्दर्शन दिनांक</FormLabel>
                    <Input 
                      type="date"
                      value={prescription.followUpDate}
                      onChange={(e) => setPrescription(prev => ({...prev, followUpDate: e.target.value}))}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Special Instructions / विशेष निर्देश</FormLabel>
                    <Textarea 
                      value={prescription.specialInstructions}
                      onChange={(e) => setPrescription(prev => ({...prev, specialInstructions: e.target.value}))}
                      placeholder="Any special instructions or precautions"
                      rows={2}
                    />
                  </FormControl>
                </Grid>
              </CardBody>
            </Card>
          </VStack>
        </CardBody>
      </Card>

      {/* Add Medicine Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Medicine / औषधि जोड़ें</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                <FormControl isRequired>
                  <FormLabel>Medicine Name / औषधि नाम</FormLabel>
                  <Input 
                    value={currentMedicine.name}
                    onChange={(e) => setCurrentMedicine(prev => ({...prev, name: e.target.value}))}
                    placeholder="e.g., Triphala Churna, Ashwagandharishta"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Type / प्रकार</FormLabel>
                  <Select 
                    value={currentMedicine.type}
                    onChange={(e) => setCurrentMedicine(prev => ({...prev, type: e.target.value}))}
                  >
                    <option value="">Select Type</option>
                    {medicineTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Dose / मात्रा</FormLabel>
                  <Input 
                    value={currentMedicine.dose}
                    onChange={(e) => setCurrentMedicine(prev => ({...prev, dose: e.target.value}))}
                    placeholder="e.g., 3-6 gm, 15-30 ml, 2 tablets"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Anupana / अनुपान</FormLabel>
                  <Select 
                    value={currentMedicine.anupana}
                    onChange={(e) => setCurrentMedicine(prev => ({...prev, anupana: e.target.value}))}
                  >
                    <option value="">Select Anupana</option>
                    {anupanaOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Kala / काल (Time)</FormLabel>
                  <Select 
                    value={currentMedicine.kala}
                    onChange={(e) => setCurrentMedicine(prev => ({...prev, kala: e.target.value}))}
                  >
                    <option value="">Select Time</option>
                    {kalaOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Duration / अवधि</FormLabel>
                  <Input 
                    value={currentMedicine.duration}
                    onChange={(e) => setCurrentMedicine(prev => ({...prev, duration: e.target.value}))}
                    placeholder="e.g., 15 days, 1 month, Until symptoms subside"
                  />
                </FormControl>
              </SimpleGrid>
              <FormControl>
                <FormLabel>Special Instructions / विशेष निर्देश</FormLabel>
                <Textarea 
                  value={currentMedicine.instructions}
                  onChange={(e) => setCurrentMedicine(prev => ({...prev, instructions: e.target.value}))}
                  placeholder="Any special instructions for this medicine"
                  rows={2}
                />
              </FormControl>
              <HStack w="full" justify="flex-end" spacing={3}>
                <Button onClick={onClose}>Cancel</Button>
                <Button colorScheme="green" onClick={addMedicine}>
                  Add Medicine
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AyurvedicPrescription;
