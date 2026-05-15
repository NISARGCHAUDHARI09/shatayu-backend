// Central Patient Database - Consistent across all modules
// All patient IDs are numerical for system-wide consistency

export const centralPatientDatabase = [
  {
    id: '10001',
    name: 'Rajesh Kumar',
    age: 45,
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '+91 9876543210',
    email: 'rajesh.kumar@email.com',
    address: '123 Main Street, Mumbai, Maharashtra 400001',
    emergencyContact: '+91 9876543299',
    constitution: 'Vata',
    primaryTreatment: 'Panchakarma',
    status: 'active',
    registrationDate: '2024-01-15',
    lastVisit: '2024-12-15',
    nextAppointment: '2024-12-20',
    doctor: 'Dr. Ramesh Ayurveda',
    patientType: 'OPD',
    outstandingAmount: 0
  },
  {
    id: '10002',
    name: 'Priya Sharma',
    age: 32,
    gender: 'Female',
    bloodGroup: 'A+',
    phone: '+91 9876543211',
    email: 'priya.sharma@email.com',
    address: '456 Garden Street, Delhi, Delhi 110001',
    emergencyContact: '+91 9876543288',
    constitution: 'Pitta',
    primaryTreatment: 'Abhyanga',
    status: 'admitted',
    registrationDate: '2024-02-20',
    lastVisit: '2024-12-14',
    nextAppointment: '2024-12-18',
    doctor: 'Dr. Sunita Herbs',
    patientType: 'IPD',
    outstandingAmount: 5000
  },
  {
    id: '10003',
    name: 'Amit Patel',
    age: 38,
    gender: 'Male',
    bloodGroup: 'B+',
    phone: '+91 9876543212',
    email: 'amit.patel@email.com',
    address: '789 Oak Street, Ahmedabad, Gujarat 380001',
    emergencyContact: '+91 9876543277',
    constitution: 'Kapha',
    primaryTreatment: 'Herbal Medicine',
    status: 'active',
    registrationDate: '2024-03-10',
    lastVisit: '2024-12-13',
    nextAppointment: '2024-12-21',
    doctor: 'Dr. Vishnu Panchakarma',
    patientType: 'OPD',
    outstandingAmount: 1800
  },
  {
    id: '10004',
    name: 'Meera Reddy',
    age: 28,
    gender: 'Female',
    bloodGroup: 'AB+',
    phone: '+91 9876543213',
    email: 'meera.reddy@email.com',
    address: '321 Pine Street, Hyderabad, Telangana 500001',
    emergencyContact: '+91 9876543266',
    constitution: 'Vata-Pitta',
    primaryTreatment: 'Shirodhara',
    status: 'active',
    registrationDate: '2024-04-05',
    lastVisit: '2024-12-12',
    nextAppointment: '2024-12-19',
    doctor: 'Dr. Lakshmi Skin',
    patientType: 'OPD',
    outstandingAmount: 0
  },
  {
    id: '10005',
    name: 'Suresh Nair',
    age: 55,
    gender: 'Male',
    bloodGroup: 'B-',
    phone: '+91 9876543214',
    email: 'suresh.nair@email.com',
    address: '654 Cedar Avenue, Kochi, Kerala 682001',
    emergencyContact: '+91 9876543255',
    constitution: 'Pitta-Kapha',
    primaryTreatment: 'Nasya Therapy',
    status: 'active',
    registrationDate: '2024-05-12',
    lastVisit: '2024-12-11',
    nextAppointment: '2024-12-17',
    doctor: 'Dr. Kumar Wellness',
    patientType: 'IPD',
    outstandingAmount: 0
  },
  {
    id: '10006',
    name: 'Anita Singh',
    age: 42,
    gender: 'Female',
    bloodGroup: 'O-',
    phone: '+91 9876543215',
    email: 'anita.singh@email.com',
    address: '987 Rose Garden, Jaipur, Rajasthan 302001',
    emergencyContact: '+91 9876543244',
    constitution: 'Vata-Kapha',
    primaryTreatment: 'Basti Therapy',
    status: 'active',
    registrationDate: '2024-06-18',
    lastVisit: '2024-12-10',
    nextAppointment: '2024-12-22',
    doctor: 'Dr. Priya Sharma',
    patientType: 'OPD',
    outstandingAmount: 3500
  },
  {
    id: '10007',
    name: 'Vikram Joshi',
    age: 35,
    gender: 'Male',
    bloodGroup: 'A-',
    phone: '+91 9876543216',
    email: 'vikram.joshi@email.com',
    address: '456 Tech Park, Pune, Maharashtra 411001',
    emergencyContact: '+91 9876543233',
    constitution: 'Pitta-Vata',
    primaryTreatment: 'Ayurvedic Medicine',
    status: 'active',
    registrationDate: '2024-07-25',
    lastVisit: '2024-12-09',
    nextAppointment: '2024-12-23',
    doctor: 'Dr. Ayurveda Specialist',
    patientType: 'OPD',
    outstandingAmount: 2200
  },
  {
    id: '10008',
    name: 'Kavya Menon',
    age: 29,
    gender: 'Female',
    bloodGroup: 'AB-',
    phone: '+91 9876543217',
    email: 'kavya.menon@email.com',
    address: '789 IT Corridor, Bangalore, Karnataka 560001',
    emergencyContact: '+91 9876543222',
    constitution: 'Kapha-Pitta',
    primaryTreatment: 'Wellness Program',
    status: 'active',
    registrationDate: '2024-08-30',
    lastVisit: '2024-12-08',
    nextAppointment: '2024-12-24',
    doctor: 'Dr. Wellness Expert',
    patientType: 'OPD',
    outstandingAmount: 4800
  }
];

// Helper functions to get patient data
export const getPatientById = (id) => {
  return centralPatientDatabase.find(patient => patient.id === id.toString());
};

export const getAllPatients = () => {
  return centralPatientDatabase;
};

export const getPatientsByStatus = (status) => {
  return centralPatientDatabase.filter(patient => patient.status === status);
};

export const getPatientsByType = (type) => {
  return centralPatientDatabase.filter(patient => patient.patientType === type);
};

export const searchPatients = (searchTerm) => {
  const term = searchTerm.toLowerCase();
  return centralPatientDatabase.filter(patient => 
    patient.name.toLowerCase().includes(term) ||
    patient.id.includes(term) ||
    patient.phone.includes(term) ||
    patient.email.toLowerCase().includes(term)
  );
};

// Generate next patient ID
export const generateNextPatientId = () => {
  const lastId = Math.max(...centralPatientDatabase.map(p => parseInt(p.id)));
  return (lastId + 1).toString();
};

export default centralPatientDatabase;
