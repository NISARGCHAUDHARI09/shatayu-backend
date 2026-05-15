// Clean staff controller with minimal functions for testing

// In-memory staff data for testing
let staffList = [
  {
    id: 1,
    employee_id: 'EMP001',
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@hospital.com',
    phone: '+91 9876543210',
    position: 'Senior Doctor',
    department: 'Cardiology',
    join_date: '2020-01-15',
    salary: 75000,
    status: 'Active',
    avatar: '',
    address: '123 Medical Street, New Delhi',
    experience: '8 years',
    qualification: 'MBBS, MD Cardiology',
    emergency_contact: '+91 9876543211',
    blood_group: 'O+',
    working_hours: '9:00 AM - 6:00 PM',
    performance: 95
  },
  {
    id: 2,
    employee_id: 'EMP002',
    name: 'Sister Priya Sharma',
    email: 'priya.sharma@hospital.com',
    phone: '+91 9876543220',
    position: 'Head Nurse',
    department: 'ICU',
    join_date: '2019-03-10',
    salary: 35000,
    status: 'Active',
    avatar: '',
    address: '456 Care Lane, Mumbai',
    experience: '6 years',
    qualification: 'B.Sc Nursing',
    emergency_contact: '+91 9876543221',
    blood_group: 'A+',
    working_hours: '8:00 AM - 8:00 PM',
    performance: 88
  },
  {
    id: 3,
    employee_id: 'EMP003',
    name: 'Mr. Amit Patel',
    email: 'amit.patel@hospital.com',
    phone: '+91 9876543230',
    position: 'Pharmacist',
    department: 'Pharmacy',
    join_date: '2021-06-20',
    salary: 28000,
    status: 'Active',
    avatar: '',
    address: '789 Medicine Road, Bangalore',
    experience: '3 years',
    qualification: 'B.Pharm',
    emergency_contact: '+91 9876543231',
    blood_group: 'B+',
    working_hours: '9:00 AM - 6:00 PM',
    performance: 92
  }
];

// Get all staff
const getAllStaff = (req, res) => {
  try {
    console.log('getAllStaff called successfully');
    res.json({
      success: true,
      data: staffList,
      message: 'Staff data retrieved successfully'
    });
  } catch (error) {
    console.error('Error in getAllStaff:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch staff data',
      error: error.message
    });
  }
};

// Get staff by ID
const getStaffById = (req, res) => {
  try {
    const { id } = req.params;
    const staff = staffList.find(s => s.id === parseInt(id));
    
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }
    
    res.json({
      success: true,
      data: staff
    });
  } catch (error) {
    console.error('Error in getStaffById:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch staff member',
      error: error.message
    });
  }
};

// Create new staff
const createStaff = (req, res) => {
  try {
    const newStaff = {
      id: staffList.length + 1,
      ...req.body
    };
    
    staffList.push(newStaff);
    
    res.status(201).json({
      success: true,
      data: newStaff,
      message: 'Staff member created successfully'
    });
  } catch (error) {
    console.error('Error in createStaff:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create staff member',
      error: error.message
    });
  }
};

// Update staff
const updateStaff = (req, res) => {
  try {
    const { id } = req.params;
    const staffIndex = staffList.findIndex(s => s.id === parseInt(id));
    
    if (staffIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }
    
    staffList[staffIndex] = { ...staffList[staffIndex], ...req.body };
    
    res.json({
      success: true,
      data: staffList[staffIndex],
      message: 'Staff member updated successfully'
    });
  } catch (error) {
    console.error('Error in updateStaff:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update staff member',
      error: error.message
    });
  }
};

// Delete staff
const deleteStaff = (req, res) => {
  try {
    const { id } = req.params;
    const staffIndex = staffList.findIndex(s => s.id === parseInt(id));
    
    if (staffIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }
    
    staffList.splice(staffIndex, 1);
    
    res.json({
      success: true,
      message: 'Staff member deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteStaff:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete staff member',
      error: error.message
    });
  }
};

// Get staff statistics
const getStaffStatistics = (req, res) => {
  try {
    const total_staff = staffList.length;
    const active_staff = staffList.filter(s => s.status === 'Active').length;
    const on_leave_staff = staffList.filter(s => s.status === 'On Leave').length;
    const inactive_staff = staffList.filter(s => s.status === 'Inactive').length;
    const departments = [...new Set(staffList.map(s => s.department))];

    res.json({
      total_staff,
      active_staff,
      on_leave_staff,
      inactive_staff,
      total_departments: departments.length,
      departments
    });
  } catch (error) {
    console.error('Error in getStaffStatistics:', error);
    res.status(500).json({
      error: 'Failed to fetch statistics',
      details: error.message
    });
  }
};

// Get departments
const getDepartments = (req, res) => {
  try {
    const departments = [...new Set(staffList.map(s => s.department))];
    res.json({
      success: true,
      data: departments
    });
  } catch (error) {
    console.error('Error in getDepartments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch departments',
      error: error.message
    });
  }
};

// Stub functions for other endpoints
const applyLeave = (req, res) => {
  res.json({ success: true, message: 'applyLeave stub' });
};

const getStaffLeave = (req, res) => {
  res.json({ success: true, message: 'getStaffLeave stub' });
};

const updateLeaveStatus = (req, res) => {
  res.json({ success: true, message: 'updateLeaveStatus stub' });
};

const importStaff = (req, res) => {
  res.json({ success: true, message: 'importStaff stub' });
};

export {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  getStaffStatistics,
  applyLeave,
  getStaffLeave,
  updateLeaveStatus,
  getDepartments,
  importStaff
};