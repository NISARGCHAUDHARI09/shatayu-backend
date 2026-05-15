import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  HStack,
  Alert,
  AlertIcon,
  AlertDescription,
  FormErrorMessage,
  Checkbox,
  Textarea,
  SimpleGrid,
  useToast
} from '@chakra-ui/react';
import { useAuth } from '../../../contexts/AuthContext.jsx';

const UserManagementModal = ({ isOpen, onClose, mode = 'create', userData = null }) => {
  const { user } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    username: userData?.username || '',
    password: '',
    confirmPassword: '',
    role: userData?.role || 'doctor',
    phone: userData?.phone || '',
    designation: userData?.designation || '',
    department: userData?.department || '',
    address: userData?.address || '',
    qualifications: userData?.qualifications || '',
    specialization: userData?.specialization || '',
    experience: userData?.experience || '',
    licenseNumber: userData?.licenseNumber || '',
    emergencyContact: userData?.emergencyContact || '',
    bloodGroup: userData?.bloodGroup || '',
    isActive: userData?.isActive ?? true,
    sendCredentials: true,
    permissions: userData?.permissions || {
      canViewPatients: false,
      canManagePatients: false,
      canViewReports: false,
      canManageAppointments: false,
      canAccessBilling: false,
      canManagePrescriptions: false,
      canAccessInventory: false
    }
  });

  const roleOptions = [
    { value: 'doctor', label: 'Doctor' },
    { value: 'nurse', label: 'Nurse' },
    { value: 'receptionist', label: 'Receptionist' },
    { value: 'pharmacist', label: 'Pharmacist' },
    { value: 'pathologist', label: 'Pathologist' },
    { value: 'radiologist', label: 'Radiologist' },
    { value: 'accountant', label: 'Accountant' },
    { value: 'admin', label: 'Administrator' }
  ];

  const departmentOptions = [
    'Ayurveda',
    'General Medicine',
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Gynecology',
    'Pediatrics',
    'Dermatology',
    'ENT',
    'Ophthalmology',
    'Psychiatry',
    'Radiology',
    'Pathology',
    'Pharmacy',
    'Reception',
    'Administration',
    'Nursing',
    'Emergency',
    'ICU',
    'Surgery'
  ];

  const bloodGroupOptions = [
    'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handlePermissionChange = (permission, checked) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: checked
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (mode === 'create' && !formData.password) {
      newErrors.password = 'Password is required';
    }

    if (mode === 'create' && formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (mode === 'create' && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (formData.role === 'doctor' && !formData.specialization.trim()) {
      newErrors.specialization = 'Specialization is required for doctors';
    }

    if (formData.role === 'doctor' && !formData.licenseNumber.trim()) {
      newErrors.licenseNumber = 'License number is required for doctors';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Here you would typically make an API call to create/update the user
      const apiData = {
        ...formData,
        createdBy: user?.id,
        hospitalId: user?.hospitalId || 'default',
        ...(mode === 'create' ? { createdAt: new Date().toISOString() } : { updatedAt: new Date().toISOString() })
      };

      console.log('User data to be saved:', apiData);

      toast({
        title: `User ${mode === 'create' ? 'created' : 'updated'} successfully`,
        description: `${formData.name} has been ${mode === 'create' ? 'added' : 'updated'} as a ${formData.role}.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      onClose();
      
      // Reset form if creating new user
      if (mode === 'create') {
        setFormData({
          name: '',
          email: '',
          username: '',
          password: '',
          confirmPassword: '',
          role: 'doctor',
          phone: '',
          designation: '',
          department: '',
          address: '',
          qualifications: '',
          specialization: '',
          experience: '',
          licenseNumber: '',
          emergencyContact: '',
          bloodGroup: '',
          isActive: true,
          sendCredentials: true,
          permissions: {
            canViewPatients: false,
            canManagePatients: false,
            canViewReports: false,
            canManageAppointments: false,
            canAccessBilling: false,
            canManagePrescriptions: false,
            canAccessInventory: false
          }
        });
      }

    } catch (error) {
      console.error('Error saving user:', error);
      toast({
        title: 'Error',
        description: `Failed to ${mode === 'create' ? 'create' : 'update'} user. Please try again.`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="4xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {mode === 'create' ? 'Add New User' : 'Edit User'}
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Alert for admin-only access */}
            <Alert status="info" borderRadius="md">
              <AlertIcon />
              <AlertDescription>
                Only administrators can create and manage user accounts for the hospital system.
              </AlertDescription>
            </Alert>

            {/* Basic Information */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl isInvalid={!!errors.name} isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter full name"
                />
                <FormErrorMessage>{errors.name}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.email} isRequired>
                <FormLabel>Email Address</FormLabel>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.username} isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="Enter username"
                />
                <FormErrorMessage>{errors.username}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.phone} isRequired>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                />
                <FormErrorMessage>{errors.phone}</FormErrorMessage>
              </FormControl>
            </SimpleGrid>

            {/* Password Fields (only for new users) */}
            {mode === 'create' && (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl isInvalid={!!errors.password} isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter password"
                  />
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.confirmPassword} isRequired>
                  <FormLabel>Confirm Password</FormLabel>
                  <Input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirm password"
                  />
                  <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                </FormControl>
              </SimpleGrid>
            )}

            {/* Role and Department */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl isRequired>
                <FormLabel>Role</FormLabel>
                <Select
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                >
                  {roleOptions.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Department</FormLabel>
                <Select
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                >
                  <option value="">Select Department</option>
                  {departmentOptions.map(dept => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Designation</FormLabel>
                <Input
                  value={formData.designation}
                  onChange={(e) => handleInputChange('designation', e.target.value)}
                  placeholder="Enter designation"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Blood Group</FormLabel>
                <Select
                  value={formData.bloodGroup}
                  onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                >
                  <option value="">Select Blood Group</option>
                  {bloodGroupOptions.map(bg => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </SimpleGrid>

            {/* Professional Information (for doctors) */}
            {formData.role === 'doctor' && (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl isInvalid={!!errors.specialization} isRequired>
                  <FormLabel>Specialization</FormLabel>
                  <Input
                    value={formData.specialization}
                    onChange={(e) => handleInputChange('specialization', e.target.value)}
                    placeholder="Enter specialization"
                  />
                  <FormErrorMessage>{errors.specialization}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.licenseNumber} isRequired>
                  <FormLabel>License Number</FormLabel>
                  <Input
                    value={formData.licenseNumber}
                    onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                    placeholder="Enter license number"
                  />
                  <FormErrorMessage>{errors.licenseNumber}</FormErrorMessage>
                </FormControl>

                <FormControl>
                  <FormLabel>Experience (Years)</FormLabel>
                  <Input
                    type="number"
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    placeholder="Enter years of experience"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Qualifications</FormLabel>
                  <Input
                    value={formData.qualifications}
                    onChange={(e) => handleInputChange('qualifications', e.target.value)}
                    placeholder="MBBS, MD, etc."
                  />
                </FormControl>
              </SimpleGrid>
            )}

            {/* Contact Information */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl>
                <FormLabel>Emergency Contact</FormLabel>
                <Input
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  placeholder="Emergency contact number"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Address</FormLabel>
                <Textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter address"
                  rows={2}
                />
              </FormControl>
            </SimpleGrid>

            {/* Permissions */}
            <FormControl>
              <FormLabel>Permissions</FormLabel>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                <Checkbox
                  isChecked={formData.permissions.canViewPatients}
                  onChange={(e) => handlePermissionChange('canViewPatients', e.target.checked)}
                >
                  View Patients
                </Checkbox>
                <Checkbox
                  isChecked={formData.permissions.canManagePatients}
                  onChange={(e) => handlePermissionChange('canManagePatients', e.target.checked)}
                >
                  Manage Patients
                </Checkbox>
                <Checkbox
                  isChecked={formData.permissions.canManageAppointments}
                  onChange={(e) => handlePermissionChange('canManageAppointments', e.target.checked)}
                >
                  Manage Appointments
                </Checkbox>
                <Checkbox
                  isChecked={formData.permissions.canAccessBilling}
                  onChange={(e) => handlePermissionChange('canAccessBilling', e.target.checked)}
                >
                  Access Billing
                </Checkbox>
                <Checkbox
                  isChecked={formData.permissions.canManagePrescriptions}
                  onChange={(e) => handlePermissionChange('canManagePrescriptions', e.target.checked)}
                >
                  Manage Prescriptions
                </Checkbox>
                <Checkbox
                  isChecked={formData.permissions.canViewReports}
                  onChange={(e) => handlePermissionChange('canViewReports', e.target.checked)}
                >
                  View Reports
                </Checkbox>
                <Checkbox
                  isChecked={formData.permissions.canAccessInventory}
                  onChange={(e) => handlePermissionChange('canAccessInventory', e.target.checked)}
                >
                  Access Inventory
                </Checkbox>
              </SimpleGrid>
            </FormControl>

            {/* Additional Options */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Checkbox
                isChecked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
              >
                Active User
              </Checkbox>

              {mode === 'create' && (
                <Checkbox
                  isChecked={formData.sendCredentials}
                  onChange={(e) => handleInputChange('sendCredentials', e.target.checked)}
                >
                  Send login credentials via email
                </Checkbox>
              )}
            </SimpleGrid>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack spacing={3}>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={isLoading}
              loadingText={mode === 'create' ? 'Creating...' : 'Updating...'}
            >
              {mode === 'create' ? 'Create User' : 'Update User'}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UserManagementModal;