import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  VStack,
  HStack,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Button,
  Text,
  NumberInput,
  NumberInputField,
  Divider,
  useToast,
  Icon,
  IconButton,
  Card,
  CardHeader,
  CardBody
} from '@chakra-ui/react';
import { UserPlus, Plus, Trash2, Upload, Paperclip, X, Eye, Calendar, Clock, PlusCircle } from 'lucide-react';
import { countryList } from '../../../utils/countryList.js';

const AddPatientForm = ({ isOpen, onClose, onSave, generatedCaseId }) => {
  const toast = useToast();
  const nameRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Simple, direct state management - NO DEBOUNCING
  const [formData, setFormData] = useState({
    patientName: '',
    caseId: generatedCaseId || '',
    patientAge: '',
    patientGender: '',
    patientPhone: '',
    patientEmail: '',
    patientAddress: '',
    city: '',
    country: '',
    countrySearch: '',
    bloodGroup: '',
    emergencyContact: '',
    emergencyPhone: '',
    appointmentDate: new Date().toISOString().split('T')[0],
    appointmentTime: new Date().toTimeString().slice(0, 5),
    presentComplaints: [
      { complaint: '', duration: '' },
      { complaint: '', duration: '' },
      { complaint: '', duration: '' },
      { complaint: '', duration: '' },
      { complaint: '', duration: '' }
    ],
    ayurvedicAssessment: {
      prakriti: '',
      vikriti: '',
      agni: '',
      ojas: ''
    },
    examination: {
      nadi: '',
      jihva: '',
      eyes: ''
    },
    clinicalAssessment: {
      roga: ''
    },
    familyHistory: {
      father: '',
      mother: '',
      brother: '',
      sister: '',
      others: ''
    },
    documents: [],
    panchkarmas: []
  });
  
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPanchkarmaSection, setShowPanchkarmaSection] = useState(false);

  // Keep caseId in sync with generatedCaseId from parent (OPD)
  useEffect(() => {
    if (generatedCaseId && !formData.caseId) {
      setFormData(prev => ({ ...prev, caseId: generatedCaseId }));
    }
  }, [generatedCaseId, formData.caseId]);

  // Ayurvedic options
  const prakritiOptions = ['Vata', 'Pitta', 'Kapha', 'Vata-Pitta', 'Pitta-Kapha', 'Vata-Kapha', 'Tridosha'];
  const vikritiOptions = ['Vata', 'Pitta', 'Kapha', 'Vata-Pitta', 'Pitta-Kapha', 'Vata-Kapha', 'Tridosha'];
  const agniOptions = ['Sama', 'Vishama', 'Tikshna', 'Manda'];
  const ojasOptions = ['Excellent', 'Good', 'Moderate', 'Low', 'Very Low'];
  const nadiOptions = ['Vata (Sarpa)', 'Pitta (Manduka)', 'Kapha (Hamsa)', 'Mixed'];
  const jihvaOptions = ['Clean', 'Coated - White', 'Coated - Yellow', 'Coated - Brown', 'Red', 'Pale'];
  const eyesOptions = ['Clear', 'Red', 'Yellow', 'Dull', 'Bright'];

  // Panchkarma categories
  const panchkarmaCategories = {
    'Vamana': {
      subcategories: [
        { name: 'Pre-Vamana (Snehana + Swedana)', defaultDuration: 7 },
        { name: 'Vamana Procedure', defaultDuration: 1 },
        { name: 'Post-Vamana (Samsarjana Krama)', defaultDuration: 7 }
      ]
    },
    'Virechana': {
      subcategories: [
        { name: 'Pre-Virechana (Snehana + Swedana)', defaultDuration: 7 },
        { name: 'Virechana Procedure', defaultDuration: 1 },
        { name: 'Post-Virechana (Samsarjana Krama)', defaultDuration: 7 }
      ]
    },
    'Basti': {
      subcategories: [
        { name: 'Anuvasana Basti', defaultDuration: 3 },
        { name: 'Niruha Basti', defaultDuration: 3 },
        { name: 'Kala Basti (16 days)', defaultDuration: 16 },
        { name: 'Karma Basti (30 days)', defaultDuration: 30 },
        { name: 'Yoga Basti (8 days)', defaultDuration: 8 }
      ]
    },
    'Nasya': {
      subcategories: [
        { name: 'Pradhamana Nasya', defaultDuration: 7 },
        { name: 'Bruhana Nasya', defaultDuration: 7 },
        { name: 'Shamana Nasya', defaultDuration: 7 },
        { name: 'Navana Nasya', defaultDuration: 7 },
        { name: 'Marshya Nasya', defaultDuration: 7 }
      ]
    },
    'Raktamokshana': {
      subcategories: [
        { name: 'Jalaukavacharana (Leech Therapy)', defaultDuration: 1 },
        { name: 'Pracchana (Scarification)', defaultDuration: 1 },
        { name: 'Siravyadha (Venepuncture)', defaultDuration: 1 }
      ]
    }
  };

  // Direct input handler - NO BUFFERING
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Nested field handlers
  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }));
  };

  // Present complaints handlers
  const addPresentComplaint = () => {
    setFormData(prev => ({
      ...prev,
      presentComplaints: [...prev.presentComplaints, { complaint: '', duration: '' }]
    }));
  };

  const updatePresentComplaint = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      presentComplaints: prev.presentComplaints.map((c, i) => 
        i === index ? { ...c, [field]: value } : c
      )
    }));
  };

  const removePresentComplaint = (index) => {
    setFormData(prev => ({
      ...prev,
      presentComplaints: prev.presentComplaints.filter((_, i) => i !== index)
    }));
  };

  // Panchkarma handlers
  const addPanchkarmaBlock = () => {
    const newPanchkarma = {
      id: Date.now(),
      category: '',
      subcategories: [],
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      notes: ''
    };
    setFormData(prev => ({
      ...prev,
      panchkarmas: [...prev.panchkarmas, newPanchkarma]
    }));
  };

  const removePanchkarmaBlock = (id) => {
    setFormData(prev => ({
      ...prev,
      panchkarmas: prev.panchkarmas.filter(p => p.id !== id)
    }));
  };

  const updatePanchkarmaCategory = (id, category) => {
    const categoryData = panchkarmaCategories[category];
    const subcategories = categoryData?.subcategories.map(sub => ({
      name: sub.name,
      duration: sub.defaultDuration,
      isCustom: false
    })) || [];

    setFormData(prev => ({
      ...prev,
      panchkarmas: prev.panchkarmas.map(p =>
        p.id === id ? { ...p, category, subcategories } : p
      )
    }));
  };

  const updateSubcategoryDuration = (panchkarmaId, subIndex, duration) => {
    setFormData(prev => ({
      ...prev,
      panchkarmas: prev.panchkarmas.map(p => {
        if (p.id === panchkarmaId) {
          const updatedSubcategories = p.subcategories.map((sub, i) =>
            i === subIndex ? { ...sub, duration: parseInt(duration) || 0 } : sub
          );
          const totalDuration = updatedSubcategories.reduce((sum, sub) => sum + (sub.duration || 0), 0);
          const endDate = calculateEndDate(p.startDate, totalDuration);
          return { ...p, subcategories: updatedSubcategories, endDate };
        }
        return p;
      })
    }));
  };

  const updateSubcategoryName = (panchkarmaId, subIndex, name) => {
    setFormData(prev => ({
      ...prev,
      panchkarmas: prev.panchkarmas.map(p =>
        p.id === panchkarmaId ? {
          ...p,
          subcategories: p.subcategories.map((sub, i) =>
            i === subIndex ? { ...sub, name } : sub
          )
        } : p
      )
    }));
  };

  const addSubcategory = (panchkarmaId) => {
    setFormData(prev => ({
      ...prev,
      panchkarmas: prev.panchkarmas.map(p =>
        p.id === panchkarmaId ? {
          ...p,
          subcategories: [...p.subcategories, { name: '', duration: 1, isCustom: true }]
        } : p
      )
    }));
  };

  const removeSubcategory = (panchkarmaId, subIndex) => {
    setFormData(prev => ({
      ...prev,
      panchkarmas: prev.panchkarmas.map(p =>
        p.id === panchkarmaId ? {
          ...p,
          subcategories: p.subcategories.filter((_, i) => i !== subIndex)
        } : p
      )
    }));
  };

  const updatePanchkarmaStartDate = (id, startDate) => {
    setFormData(prev => ({
      ...prev,
      panchkarmas: prev.panchkarmas.map(p => {
        if (p.id === id) {
          const totalDuration = p.subcategories.reduce((sum, sub) => sum + (sub.duration || 0), 0);
          const endDate = calculateEndDate(startDate, totalDuration);
          return { ...p, startDate, endDate };
        }
        return p;
      })
    }));
  };

  const calculateEndDate = (startDate, totalDuration) => {
    if (!startDate || !totalDuration) return '';
    const start = new Date(startDate);
    start.setDate(start.getDate() + totalDuration);
    return start.toISOString().split('T')[0];
  };

  // Document handlers
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files || []);
    const newDocuments = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
      file: file
    }));
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...newDocuments]
    }));
  };

  const removeDocument = (id) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter(doc => doc.id !== id)
    }));
  };

  const getFileIcon = (type) => {
    if (type?.includes('pdf')) return <Icon as={Paperclip} color="red.500" />;
    if (type?.includes('image')) return <Icon as={Eye} color="blue.500" />;
    return <Icon as={Paperclip} color="gray.500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  // Validate required fields
  const validateForm = () => {
    const required = ['patientName', 'patientAge', 'patientGender', 'patientPhone', 'city', 'country'];
    const missing = required.filter(field => !formData[field] || formData[field].toString().trim() === '');
    
    if (missing.length > 0) {
      toast({
        title: 'Required fields missing',
        description: `Please fill: ${missing.map(f => f.replace('patient', '')).join(', ')}`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    
    // Phone validation
    if (formData.patientPhone && !/^\d{10,15}$/.test(formData.patientPhone.replace(/[\s\-\(\)]/g, ''))) {
      toast({
        title: 'Invalid phone number',
        description: 'Phone must be 10-15 digits',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    
    return true;
  };

  // Handle save
  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Get auth token
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      // Prepare data for API (include patient_id = caseId so OPD number is preserved)
      const patientData = {
        patient_id: formData.caseId, // use generated caseId as patient_id/OPD number
        name: formData.patientName.trim(),
        age: parseInt(formData.patientAge),
        gender: formData.patientGender,
        phone: formData.patientPhone.trim(),
        email: formData.patientEmail?.trim() || '',
        address: formData.patientAddress?.trim() || '',
        city: formData.city.trim(),
        country: formData.country.trim(),
        blood_group: formData.bloodGroup || '',
        emergency_contact: formData.emergencyContact?.trim() || '',
        emergency_phone: formData.emergencyPhone?.trim() || '',
        status: 'active'
      };
      
      // Save to database
      const baseURL = import.meta.env.VITE_API_URL || 'https://shatayu-backend.onrender.com';
      const response = await fetch(`${baseURL}/api/patients`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(patientData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save patient');
      }
      
      const savedPatient = await response.json();
      console.log('✅ Patient saved successfully:', savedPatient);
      
      // Extract the patient_id from the response
      const patientId = savedPatient.data?.patient_id || savedPatient.data?.id || savedPatient.patient_id;
      console.log('🎫 Patient ID from API:', patientId);
      
      // Clear cache to refresh list
      localStorage.removeItem('patientManagementCache');
      localStorage.removeItem('patientManagementCacheTime');
      
      toast({
        title: 'Success!',
        description: `Patient ${formData.patientName} added successfully with OPD No: ${patientId}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Call parent's onSave callback with saved data including proper IDs
      if (onSave) {
        onSave({
          ...formData,
          ...savedPatient.data,
          patient_id: patientId,
          patientId: patientId,
          id: patientId,
          caseId: patientId,
          opdNo: patientId,
          patientName: formData.patientName,
          patientAge: formData.patientAge,
          patientGender: formData.patientGender,
          patientPhone: formData.patientPhone,
          appointmentDate: formData.appointmentDate,
          appointmentTime: formData.appointmentTime
        });
      }
      
      // Reset form and close
      resetForm();
      onClose();
      
    } catch (error) {
      console.error('❌ Error saving patient:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save patient. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      patientName: '',
      caseId: generatedCaseId || '',
      patientAge: '',
      patientGender: '',
      patientPhone: '',
      patientEmail: '',
      patientAddress: '',
      city: '',
      postalCode: '',
      country: '',
      countrySearch: '',
      bloodGroup: '',
      emergencyContact: '',
      emergencyPhone: '',
      appointmentDate: new Date().toISOString().split('T')[0],
      appointmentTime: new Date().toTimeString().slice(0, 5),
      presentComplaints: [
        { complaint: '', duration: '' },
        { complaint: '', duration: '' },
        { complaint: '', duration: '' },
        { complaint: '', duration: '' },
        { complaint: '', duration: '' }
      ],
      ayurvedicAssessment: {
        prakriti: '',
        vikriti: '',
        agni: '',
        ojas: ''
      },
      examination: {
        nadi: '',
        jihva: '',
        eyes: ''
      },
      clinicalAssessment: {
        roga: ''
      },
      familyHistory: {
        father: '',
        mother: '',
        brother: '',
        sister: '',
        others: ''
      },
      documents: [],
      panchkarmas: []
    });
  };

  // Handle close
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Filter countries for dropdown
  const filteredCountries = countryList.filter(c => {
    const query = (formData.countrySearch || '').toLowerCase();
    return !query || c.name.toLowerCase().includes(query) || c.code.toLowerCase().includes(query);
  });

  // Handle Enter key navigation
  const handleEnter = (e, nextRef) => {
    if (e.key === 'Enter' && nextRef?.current) {
      e.preventDefault();
      nextRef.current.focus();
    }
  };

  // Create refs for form navigation
  const ageRef = useRef(null);
  const genderRef = useRef(null);
  const phoneRef = useRef(null);
  const emailRef = useRef(null);
  const cityRef = useRef(null);
  const countryRef = useRef(null);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="3xl"
      closeOnOverlayClick={false}
      scrollBehavior="inside"
    >
      <ModalOverlay bg="blackAlpha.600" />
      <ModalContent maxH="85vh">
        <ModalHeader>
          <HStack spacing={3}>
            <UserPlus size={24} color="#3182CE" />
            <Text color="blue.700">Add New Patient</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Basic Information */}
            <Box>
              <Text fontSize="lg" fontWeight="semibold" mb={4} color="blue.600">
                Patient Information
              </Text>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Patient Name</FormLabel>
                  <Input
                    ref={nameRef}
                    value={formData.patientName}
                    onChange={e => handleChange('patientName', e.target.value)}
                    onKeyDown={e => handleEnter(e, ageRef)}
                    placeholder="Enter full name"
                    autoFocus
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Case ID</FormLabel>
                  <Input
                    value={formData.caseId || generatedCaseId || ''}
                    isReadOnly
                    bg="gray.50"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Age</FormLabel>
                  <NumberInput min={0} max={150}>
                    <NumberInputField
                      ref={ageRef}
                      value={formData.patientAge}
                      onChange={e => handleChange('patientAge', e.target.value)}
                      onKeyDown={e => handleEnter(e, genderRef)}
                      placeholder="Enter age"
                    />
                  </NumberInput>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    ref={genderRef}
                    value={formData.patientGender}
                    onChange={e => handleChange('patientGender', e.target.value)}
                    onKeyDown={e => handleEnter(e, phoneRef)}
                    placeholder="Select gender"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Phone Number</FormLabel>
                  <Input
                    ref={phoneRef}
                    value={formData.patientPhone}
                    onChange={e => handleChange('patientPhone', e.target.value)}
                    onKeyDown={e => handleEnter(e, emailRef)}
                    placeholder="10-15 digits"
                    type="tel"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Email (Optional)</FormLabel>
                  <Input
                    ref={emailRef}
                    value={formData.patientEmail}
                    onChange={e => handleChange('patientEmail', e.target.value)}
                    onKeyDown={e => handleEnter(e, cityRef)}
                    placeholder="email@example.com"
                    type="email"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>City</FormLabel>
                  <Input
                    ref={cityRef}
                    value={formData.city}
                    onChange={e => handleChange('city', e.target.value)}
                    onKeyDown={e => handleEnter(e, countryRef)}
                    placeholder="Enter city"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Country</FormLabel>
                  <Box position="relative">
                    <Input
                      ref={countryRef}
                      value={formData.countrySearch}
                      onChange={e => {
                        handleChange('countrySearch', e.target.value);
                        handleChange('country', e.target.value);
                      }}
                      placeholder="Type country name..."
                      autoComplete="off"
                      onFocus={() => setShowCountryDropdown(true)}
                      onBlur={() => setTimeout(() => setShowCountryDropdown(false), 200)}
                    />
                    {showCountryDropdown && filteredCountries.length > 0 && (
                      <Box
                        position="absolute"
                        zIndex={1000}
                        bg="white"
                        border="1px solid"
                        borderColor="gray.300"
                        borderRadius="md"
                        maxH="200px"
                        overflowY="auto"
                        w="100%"
                        mt={1}
                        boxShadow="lg"
                      >
                        {filteredCountries.map(c => (
                          <Box
                            key={c.code}
                            px={4}
                            py={2}
                            cursor="pointer"
                            _hover={{ bg: 'blue.50' }}
                            onMouseDown={() => {
                              handleChange('country', c.name);
                              handleChange('countrySearch', c.name);
                              setShowCountryDropdown(false);
                            }}
                          >
                            {c.name} <Text as="span" color="gray.500" fontSize="sm">({c.code})</Text>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                </FormControl>

                <FormControl>
                  <FormLabel>Blood Group (Optional)</FormLabel>
                  <Select
                    value={formData.bloodGroup}
                    onChange={e => handleChange('bloodGroup', e.target.value)}
                    placeholder="Select blood group"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </Select>
                </FormControl>
              </SimpleGrid>

              <FormControl mt={4}>
                <FormLabel>Address (Optional)</FormLabel>
                <Textarea
                  value={formData.patientAddress}
                  onChange={e => handleChange('patientAddress', e.target.value)}
                  placeholder="Enter complete address"
                  rows={2}
                />
              </FormControl>
            </Box>

            <Divider />

            {/* Emergency Contact */}
            <Box>
              <Text fontSize="lg" fontWeight="semibold" mb={4} color="red.600">
                Emergency Contact (Optional)
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl>
                  <FormLabel>Contact Name</FormLabel>
                  <Input
                    value={formData.emergencyContact}
                    onChange={e => handleChange('emergencyContact', e.target.value)}
                    placeholder="Emergency contact name"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Contact Phone</FormLabel>
                  <Input
                    value={formData.emergencyPhone}
                    onChange={e => handleChange('emergencyPhone', e.target.value)}
                    placeholder="Emergency phone number"
                    type="tel"
                  />
                </FormControl>
              </SimpleGrid>
            </Box>

            <Divider />

            {/* Appointment Details */}
            <Box>
              <Text fontSize="lg" fontWeight="semibold" mb={4} color="green.600">
                Appointment Details
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl>
                  <FormLabel>Date</FormLabel>
                  <Input
                    type="date"
                    value={formData.appointmentDate}
                    onChange={e => handleChange('appointmentDate', e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Time</FormLabel>
                  <Input
                    type="time"
                    value={formData.appointmentTime}
                    onChange={e => handleChange('appointmentTime', e.target.value)}
                  />
                </FormControl>
              </SimpleGrid>
            </Box>

            <Divider />

            {/* Medical Information Section */}
            <Box>
              <Text fontSize="lg" fontWeight="semibold" mb={4} color="red.600">
                Medical Information
              </Text>

              {/* 1. Present Complaints */}
              <Box mb={6}>
                <HStack justify="space-between" mb={3}>
                  <Text fontSize="md" fontWeight="semibold" color="blue.600">
                    1. Present Complaints
                  </Text>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    leftIcon={<Plus size={16} />}
                    onClick={addPresentComplaint}
                  >
                    Add More
                  </Button>
                </HStack>
                <VStack spacing={3} align="stretch">
                  {(formData.presentComplaints || []).map((complaint, index) => (
                    <HStack key={index} spacing={3} align="start">
                      <FormControl flex={2}>
                        <FormLabel fontSize="sm">Complaint {index + 1}</FormLabel>
                        <Input
                          value={complaint.complaint}
                          onChange={e => updatePresentComplaint(index, 'complaint', e.target.value)}
                          placeholder="Enter complaint"
                        />
                      </FormControl>
                      <FormControl flex={1}>
                        <FormLabel fontSize="sm">Duration</FormLabel>
                        <Input
                          value={complaint.duration}
                          onChange={e => updatePresentComplaint(index, 'duration', e.target.value)}
                          placeholder="e.g., 2 weeks"
                        />
                      </FormControl>
                      {index > 0 && (
                        <IconButton
                          icon={<Trash2 size={16} />}
                          colorScheme="red"
                          variant="ghost"
                          size="sm"
                          mt={6}
                          onClick={() => removePresentComplaint(index)}
                          aria-label="Remove complaint"
                        />
                      )}
                    </HStack>
                  ))}
                </VStack>
              </Box>

              <Divider />

              {/* 2. Ayurvedic Assessment */}
              <Box mb={6}>
                <Text fontSize="md" fontWeight="semibold" mb={3} color="orange.600">
                  2. Ayurvedic Assessment
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl>
                    <FormLabel>Prakriti</FormLabel>
                    <Select
                      value={formData.ayurvedicAssessment?.prakriti || ''}
                      onChange={e => handleNestedChange('ayurvedicAssessment', 'prakriti', e.target.value)}
                      placeholder="Select Prakriti"
                    >
                      {prakritiOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Vikriti</FormLabel>
                    <Select
                      value={formData.ayurvedicAssessment?.vikriti || ''}
                      onChange={e => handleNestedChange('ayurvedicAssessment', 'vikriti', e.target.value)}
                      placeholder="Select Vikriti"
                    >
                      {vikritiOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Agni</FormLabel>
                    <Select
                      value={formData.ayurvedicAssessment?.agni || ''}
                      onChange={e => handleNestedChange('ayurvedicAssessment', 'agni', e.target.value)}
                      placeholder="Select Agni"
                    >
                      {agniOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Ojas</FormLabel>
                    <Select
                      value={formData.ayurvedicAssessment?.ojas || ''}
                      onChange={e => handleNestedChange('ayurvedicAssessment', 'ojas', e.target.value)}
                      placeholder="Select Ojas"
                    >
                      {ojasOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </Select>
                  </FormControl>
                </SimpleGrid>
              </Box>

              <Divider />

              {/* 3. Examination */}
              <Box mb={6}>
                <Text fontSize="md" fontWeight="semibold" mb={3} color="green.600">
                  3. Examination
                </Text>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                  <FormControl>
                    <FormLabel>Nadi</FormLabel>
                    <Select
                      value={formData.examination?.nadi || ''}
                      onChange={e => handleNestedChange('examination', 'nadi', e.target.value)}
                      placeholder="Select Nadi"
                    >
                      {nadiOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Jihva</FormLabel>
                    <Select
                      value={formData.examination?.jihva || ''}
                      onChange={e => handleNestedChange('examination', 'jihva', e.target.value)}
                      placeholder="Select Jihva"
                    >
                      {jihvaOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Eyes</FormLabel>
                    <Select
                      value={formData.examination?.eyes || ''}
                      onChange={e => handleNestedChange('examination', 'eyes', e.target.value)}
                      placeholder="Select Eyes"
                    >
                      {eyesOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </Select>
                  </FormControl>
                </SimpleGrid>
              </Box>

              <Divider />

              {/* 4. Clinical Assessment */}
              <Box mb={6}>
                <Text fontSize="md" fontWeight="semibold" mb={3} color="purple.600">
                  4. Clinical Assessment
                </Text>
                <FormControl>
                  <FormLabel>Roga (Disease Description - Max 150 words)</FormLabel>
                  <Textarea
                    value={formData.clinicalAssessment?.roga || ''}
                    onChange={e => {
                      const wordCount = e.target.value.split(/\s+/).filter(word => word.length > 0).length;
                      if (wordCount <= 150) {
                        handleNestedChange('clinicalAssessment', 'roga', e.target.value);
                      }
                    }}
                    placeholder="Describe the disease condition in Ayurvedic terms (Maximum 150 words)"
                    rows={4}
                    resize="vertical"
                  />
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    {(formData.clinicalAssessment?.roga || '').split(/\s+/).filter(word => word.length > 0).length}/150 words
                  </Text>
                </FormControl>
              </Box>

              <Divider />

              {/* 5. Document Upload */}
              <Box mb={6}>
                <Text fontSize="md" fontWeight="semibold" mb={3} color="teal.600">
                  5. Upload Documents
                </Text>
                <Box
                  border="2px dashed"
                  borderColor="gray.300"
                  borderRadius="lg"
                  p={6}
                  bg="gray.50"
                  textAlign="center"
                  position="relative"
                  cursor="pointer"
                  _hover={{ borderColor: "teal.400" }}
                >
                  <VStack spacing={3}>
                    <Icon as={Upload} boxSize={8} color="teal.500" />
                    <Text fontSize="md" fontWeight="medium" color="gray.700">
                      Click to upload documents
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      PDF, JPEG, PNG files up to 5MB each
                    </Text>
                    <Input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      opacity={0}
                      position="absolute"
                      cursor="pointer"
                      w="full"
                      h="full"
                      top={0}
                      left={0}
                      ref={fileInputRef}
                    />
                  </VStack>
                </Box>

                {formData.documents.length > 0 && (
                  <Box mt={4}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={3}>
                      Uploaded Documents ({formData.documents?.length || 0})
                    </Text>
                    {(formData.documents || []).map(doc => (
                      <HStack
                        key={doc.id}
                        p={3}
                        bg="white"
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="md"
                        mb={2}
                        justify="space-between"
                      >
                        <HStack spacing={3}>
                          {getFileIcon(doc.type)}
                          <VStack align="start" spacing={0}>
                            <Text fontSize="sm" fontWeight="medium" color="gray.800">
                              {doc.name}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              {formatFileSize(doc.size)}
                            </Text>
                          </VStack>
                        </HStack>
                        <IconButton
                          icon={<X size={14} />}
                          size="sm"
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => removeDocument(doc.id)}
                          aria-label="Remove document"
                        />
                      </HStack>
                    ))}
                  </Box>
                )}
              </Box>

              <Divider />

              {/* 6. Family History */}
              <Box mb={6}>
                <Text fontSize="md" fontWeight="semibold" mb={3} color="blue.600">
                  6. Family History
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl>
                    <FormLabel>Father</FormLabel>
                    <Input
                      value={formData.familyHistory?.father || ''}
                      onChange={e => handleNestedChange('familyHistory', 'father', e.target.value)}
                      placeholder="Father's medical history"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Mother</FormLabel>
                    <Input
                      value={formData.familyHistory?.mother || ''}
                      onChange={e => handleNestedChange('familyHistory', 'mother', e.target.value)}
                      placeholder="Mother's medical history"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Brother</FormLabel>
                    <Input
                      value={formData.familyHistory?.brother || ''}
                      onChange={e => handleNestedChange('familyHistory', 'brother', e.target.value)}
                      placeholder="Brother's medical history"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Sister</FormLabel>
                    <Input
                      value={formData.familyHistory?.sister || ''}
                      onChange={e => handleNestedChange('familyHistory', 'sister', e.target.value)}
                      placeholder="Sister's medical history"
                    />
                  </FormControl>
                  <FormControl gridColumn={{ md: "span 2" }}>
                    <FormLabel>Others</FormLabel>
                    <Input
                      value={formData.familyHistory?.others || ''}
                      onChange={e => handleNestedChange('familyHistory', 'others', e.target.value)}
                      placeholder="Others medical history"
                    />
                  </FormControl>
                </SimpleGrid>
              </Box>

              {/* Add Panchkarma Button */}
              <Box textAlign="center" py={4}>
                <Button
                  leftIcon={<PlusCircle />}
                  colorScheme="purple"
                  variant="outline"
                  onClick={() => {
                    setShowPanchkarmaSection(true);
                    if (formData.panchkarmas.length === 0) {
                      addPanchkarmaBlock();
                    }
                  }}
                  size="md"
                >
                  Add Panchkarma
                </Button>
              </Box>

              {/* 7. Panchkarma Section */}
              {showPanchkarmaSection && (
                <>
                  <Divider />
                  <Box>
                    <HStack justify="space-between" align="center" mb={4}>
                      <Text fontSize="md" fontWeight="semibold" color="purple.600">
                        7. Panchkarma Treatment
                      </Text>
                      <Button
                        leftIcon={<Plus />}
                        colorScheme="purple"
                        size="sm"
                        onClick={addPanchkarmaBlock}
                      >
                        Add Panchkarma
                      </Button>
                    </HStack>

                    <VStack spacing={4} align="stretch">
                      {(formData.panchkarmas || []).map((panchkarma, index) => (
                        <Card key={panchkarma.id} border="1px solid" borderColor="purple.200" bg="purple.50">
                          <CardHeader pb={2}>
                            <HStack justify="space-between">
                              <Text fontWeight="semibold" color="purple.700">
                                Panchkarma {index + 1}
                              </Text>
                              <IconButton
                                icon={<X />}
                                size="sm"
                                colorScheme="red"
                                variant="ghost"
                                onClick={() => removePanchkarmaBlock(panchkarma.id)}
                                aria-label="Remove Panchkarma"
                              />
                            </HStack>
                          </CardHeader>
                          <CardBody pt={0}>
                            <VStack spacing={4} align="stretch">
                              <FormControl>
                                <FormLabel>Panchkarma Category</FormLabel>
                                <Select
                                  value={panchkarma.category}
                                  onChange={e => updatePanchkarmaCategory(panchkarma.id, e.target.value)}
                                  placeholder="Select Panchkarma category"
                                >
                                  {Object.keys(panchkarmaCategories).map(category => (
                                    <option key={category} value={category}>{category}</option>
                                  ))}
                                </Select>
                              </FormControl>

                              {panchkarma.category && (
                                <Box>
                                  <Text fontWeight="medium" mb={2} color="gray.700">
                                    Treatment Details
                                  </Text>
                                  <VStack spacing={3} align="stretch">
                                    {(panchkarma.subcategories || []).map((subcategory, subIndex) => (
                                      <HStack key={subIndex} spacing={3} align="center">
                                        <Box flex="1" minW="180px">
                                          {subcategory.isCustom ? (
                                            <Input
                                              value={subcategory.name}
                                              onChange={e => updateSubcategoryName(panchkarma.id, subIndex, e.target.value)}
                                              placeholder="Enter custom subcategory"
                                              size="sm"
                                            />
                                          ) : (
                                            <Text
                                              fontSize="sm"
                                              fontWeight="medium"
                                              color="gray.700"
                                              bg="gray.50"
                                              px={3}
                                              py={2}
                                              borderRadius="md"
                                            >
                                              {subcategory.name}
                                            </Text>
                                          )}
                                        </Box>
                                        <HStack spacing={2}>
                                          <NumberInput
                                            value={subcategory.duration}
                                            onChange={value => updateSubcategoryDuration(panchkarma.id, subIndex, value)}
                                            min={1}
                                            max={30}
                                            size="sm"
                                            width="90px"
                                          >
                                            <NumberInputField placeholder="Days" textAlign="center" />
                                          </NumberInput>
                                          <Text fontSize="sm" color="gray.500">days</Text>
                                          {subcategory.isCustom && (
                                            <IconButton
                                              icon={<X />}
                                              size="sm"
                                              colorScheme="red"
                                              variant="ghost"
                                              onClick={() => removeSubcategory(panchkarma.id, subIndex)}
                                              aria-label="Remove subcategory"
                                            />
                                          )}
                                        </HStack>
                                      </HStack>
                                    ))}

                                    {panchkarmaCategories[panchkarma.category]?.subcategories.length > 0 && (
                                      <Button
                                        leftIcon={<Plus />}
                                        size="sm"
                                        variant="outline"
                                        colorScheme="purple"
                                        onClick={() => addSubcategory(panchkarma.id)}
                                        alignSelf="flex-start"
                                      >
                                        Add Custom Subcategory
                                      </Button>
                                    )}
                                  </VStack>
                                </Box>
                              )}

                              <SimpleGrid columns={2} spacing={4}>
                                <FormControl>
                                  <FormLabel fontSize="sm">
                                    <HStack>
                                      <Calendar size={16} />
                                      <Text>Start Date</Text>
                                    </HStack>
                                  </FormLabel>
                                  <Input
                                    type="date"
                                    value={panchkarma.startDate}
                                    onChange={e => updatePanchkarmaStartDate(panchkarma.id, e.target.value)}
                                    size="sm"
                                  />
                                </FormControl>
                                <FormControl>
                                  <FormLabel fontSize="sm">
                                    <HStack>
                                      <Clock size={16} />
                                      <Text>End Date</Text>
                                    </HStack>
                                  </FormLabel>
                                  <Input
                                    type="date"
                                    value={panchkarma.endDate}
                                    isReadOnly
                                    bg="gray.100"
                                    size="sm"
                                  />
                                </FormControl>
                              </SimpleGrid>

                              <FormControl>
                                <FormLabel fontSize="sm">Notes</FormLabel>
                                <Textarea
                                  value={panchkarma.notes}
                                  onChange={e => {
                                    setFormData(prev => ({
                                      ...prev,
                                      panchkarmas: prev.panchkarmas.map(p =>
                                        p.id === panchkarma.id ? { ...p, notes: e.target.value } : p
                                      )
                                    }));
                                  }}
                                  placeholder="Additional notes..."
                                  size="sm"
                                  rows={2}
                                />
                              </FormControl>
                            </VStack>
                          </CardBody>
                        </Card>
                      ))}
                    </VStack>
                  </Box>
                </>
              )}
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter bg="gray.50" borderTop="1px solid" borderColor="gray.200">
          <HStack spacing={3}>
            <Button
              variant="ghost"
              onClick={handleClose}
              isDisabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSave}
              isLoading={isSubmitting}
              loadingText="Saving..."
            >
              Save Patient
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddPatientForm;
