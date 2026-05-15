// Multi-tenant utilities for hospital management
export const hospitalContext = {
  currentHospital: null,
  hospitals: [],
  
  setCurrentHospital: (hospital) => {
    hospitalContext.currentHospital = hospital;
    localStorage.setItem('currentHospital', JSON.stringify(hospital));
  },
  
  getCurrentHospital: () => {
    if (!hospitalContext.currentHospital) {
      const stored = localStorage.getItem('currentHospital');
      hospitalContext.currentHospital = stored ? JSON.parse(stored) : null;
    }
    return hospitalContext.currentHospital;
  },
  
  getAllHospitals: () => {
    return hospitalContext.hospitals;
  },
  
  addHospital: (hospital) => {
    hospitalContext.hospitals.push(hospital);
  }
};

// Mock hospital data
export const mockHospitals = [
  {
    id: 1,
    name: "Ayurveda Wellness Center",
    location: "Mumbai, Maharashtra",
    admin: "Dr. Rajesh Sharma",
    status: "Active",
    subscription: "Pro",
    patientCount: 2847,
    staffCount: 12,
    revenue: 125000
  },
  {
    id: 2,
    name: "Kerala Ayurveda Hospital",
    location: "Kochi, Kerala", 
    admin: "Dr. Priya Nair",
    status: "Active",
    subscription: "Enterprise",
    patientCount: 4521,
    staffCount: 18,
    revenue: 189000
  },
  {
    id: 3,
    name: "Panchakarma Treatment Center",
    location: "Pune, Maharashtra",
    admin: "Dr. Amit Kulkarni",
    status: "Trial",
    subscription: "Basic",
    patientCount: 1205,
    staffCount: 8,
    revenue: 67000
  }
];

// Initialize hospitals
hospitalContext.hospitals = mockHospitals;
