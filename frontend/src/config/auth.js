// Authentication configuration
export const AUTH_CONFIG = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_URL || 'https://shatayu-backend.onrender.com',
  
  // Token Configuration
  TOKEN_KEY: 'authToken',
  REFRESH_TOKEN_KEY: 'refreshToken',
  REFRESH_BUFFER: 5 * 60 * 1000, // 5 minutes in milliseconds
  
  // Routes
  LOGIN_REDIRECT: '/login',
  DEFAULT_REDIRECT: '/',
  
  // Role-based redirects after login
  ROLE_REDIRECTS: {
    admin: '/admin/dashboard',
    doctor: '/doctor/opd',
    patient: '/patient',
    staff: '/staff'
  },
  
  // Session Configuration
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  REMEMBER_ME_DURATION: 30 * 24 * 60 * 60 * 1000, // 30 days
};

// Role-based permissions
export const PERMISSIONS = {
  admin: [
    'manage_users',
    'manage_patients',
    'manage_doctors',
    'manage_billing',
    'manage_inventory',
    'view_reports',
    'manage_system_settings'
  ],
  doctor: [
    'manage_patients',
    'view_patients',
    'manage_prescriptions',
    'manage_appointments',
    'view_reports'
  ],
  patient: [
    'view_own_records',
    'book_appointments',
    'view_prescriptions',
    'update_profile'
  ],
  staff: [
    'view_patients',
    'manage_appointments',
    'manage_billing'
  ]
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  VERIFY: '/auth/verify',
  
  // User Management
  PROFILE: '/users/me',
  UPDATE_PROFILE: '/users/me',
  CHANGE_PASSWORD: '/users/me/password',
  
  // Patients
  PATIENTS: '/patients',
  
  // Appointments
  APPOINTMENTS: '/appointments',
  
  // Billing
  BILLING: '/billing',
  
  // Inventory
  INVENTORY: '/inventory',
  MEDICINES: '/medicines',
  
  // Reports
  REPORTS: '/reports'
};

export default AUTH_CONFIG;