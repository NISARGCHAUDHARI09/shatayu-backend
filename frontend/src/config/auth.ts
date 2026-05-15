// JWT Authentication Configuration
export const AUTH_CONFIG = {
  // Backend API URL
  API_BASE_URL: import.meta.env.VITE_API_URL || 'https://shatayu-backend.onrender.com',
  
  // JWT Token settings
  TOKEN_KEY: 'authToken',
  REFRESH_TOKEN_KEY: 'refreshToken',
  
  // Token expiration buffer (in milliseconds)
  // Refresh token when it's about to expire in 5 minutes
  REFRESH_BUFFER: 5 * 60 * 1000,
  
  // Auto-logout on token expiration
  AUTO_LOGOUT: true,
  
  // Remember me duration (in days)
  REMEMBER_ME_DURATION: 30,
  
  // Default redirect paths
  LOGIN_REDIRECT: '/login',
  DEFAULT_REDIRECT: {
    admin: '/admin/dashboard',
    doctor: '/doctor/opd',
    patient: '/patient',
    staff: '/staff'
  }
};

// Role-based permissions
export const PERMISSIONS = {
  admin: [
    'view_all_patients',
    'manage_users',
    'view_reports',
    'manage_inventory',
    'manage_billing',
    'manage_appointments',
    'view_analytics'
  ],
  doctor: [
    'view_patients',
    'manage_prescriptions',
    'view_appointments',
    'manage_consultations',
    'view_medical_records'
  ],
  patient: [
    'view_own_records',
    'book_appointments',
    'view_prescriptions',
    'communicate_doctor'
  ],
  staff: [
    'view_patients',
    'manage_appointments',
    'basic_billing'
  ]
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY: '/auth/verify',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password'
  },
  USERS: {
    PROFILE: '/users/me',
    UPDATE_PROFILE: '/users/me',
    CHANGE_PASSWORD: '/users/me/password',
    LIST: '/users',
    CREATE: '/users',
    UPDATE: '/users/:id',
    DELETE: '/users/:id'
  },
  PATIENTS: {
    LIST: '/patients',
    CREATE: '/patients',
    VIEW: '/patients/:id',
    UPDATE: '/patients/:id',
    DELETE: '/patients/:id',
    MEDICAL_RECORDS: '/patients/:id/records'
  }
};