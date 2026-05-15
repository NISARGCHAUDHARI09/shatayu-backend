# JWT Authentication Setup Guide

## Overview
This JWT authentication system provides secure user authentication with role-based access control for your hospital management system.

## Features
- ✅ JWT token-based authentication
- ✅ Role-based access control (Admin, Doctor, Patient, Staff)
- ✅ Protected routes with automatic redirects
- ✅ Token auto-refresh
- ✅ Persistent login with "Remember Me"
- ✅ User profile management
- ✅ Secure API client with automatic token injection

## Demo Credentials

### Admin Access
- **Email:** admin@hospital.com
- **Password:** admin123
- **Role:** Administrator with full system access

### Doctor Access  
- **Email:** doctor@hospital.com
- **Password:** doctor123
- **Role:** Doctor with patient management access

### Patient Access
- **Email:** patient@hospital.com
- **Password:** patient123
- **Role:** Patient with limited self-service access

## Components Created

### 1. Authentication Context (`src/contexts/AuthContext.tsx`)
- Manages global authentication state
- Provides login/logout functions
- Handles token validation and user data

### 2. Protected Routes (`src/components/common/ProtectedRoute.tsx`)
- Wrapper component for protected pages
- Role-based access control
- Automatic redirects for unauthorized access

### 3. Login Component (`src/components/common/SplitLoginCard.tsx`)
- Modern login form with validation
- Error handling and loading states
- Integration with authentication context

### 4. User Profile (`src/components/common/UserProfile.tsx`)
- Display current user information
- Logout functionality
- Role-based UI elements

### 5. API Client (`src/lib/apiClient.ts`)
- Axios-based HTTP client
- Automatic token injection
- Token expiration handling

### 6. Token Manager (`src/lib/tokenManager.ts`)
- JWT token utilities
- Token validation and decoding
- Auto-refresh capabilities

### 7. Configuration (`src/config/auth.ts`)
- Authentication settings
- Role permissions
- API endpoints

## Integration

### App.jsx Updates
```jsx
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Protected Admin Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                {/* Admin routes */}
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          {/* Protected Doctor Routes */}
          <Route path="/doctor/*" element={
            <ProtectedRoute requiredRole="doctor">
              <DoctorLayout />
            </ProtectedRoute>
          }>
            {/* Doctor routes */}
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
```

## Usage Examples

### Using Authentication in Components
```jsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please login</div>;
  }
  
  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Role: {user.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Making Authenticated API Calls
```jsx
import apiClient from '../lib/apiClient';

// API calls automatically include authentication token
const fetchPatients = async () => {
  try {
    const response = await apiClient.get('/patients');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch patients:', error);
  }
};
```

### Role-Based Access Control
```jsx
import { PERMISSIONS } from '../config/auth';
import { useAuth } from '../contexts/AuthContext';

function AdminOnlyButton() {
  const { user } = useAuth();
  
  if (user?.role !== 'admin') {
    return null; // Hide from non-admin users
  }
  
  return <button>Admin Action</button>;
}
```

## Backend Integration

To integrate with your backend API, update these files:

### 1. Update API Base URL
```typescript
// src/config/auth.ts
export const AUTH_CONFIG = {
  API_BASE_URL: 'https://your-api-domain.com/api',
  // ... other config
};
```

### 2. Replace Mock Authentication
```typescript
// src/contexts/AuthContext.tsx
const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post('/auth/login', { email, password });
    const { token, user } = response.data;
    
    localStorage.setItem('authToken', token);
    setToken(token);
    setUser(user);
    
    return true;
  } catch (error) {
    console.error('Login failed:', error);
    return false;
  }
};
```

## Security Features

### Token Security
- JWT tokens stored in localStorage/sessionStorage
- Automatic token expiration handling
- Secure token refresh mechanism

### API Security
- All API requests include Authorization header
- Automatic logout on 401 responses
- Request/response interceptors for error handling

### Route Protection
- Role-based access control
- Automatic redirects for unauthorized access
- Loading states during authentication checks

## Next Steps

1. **Backend Setup**: Implement JWT authentication on your backend
2. **Token Refresh**: Set up refresh token endpoint
3. **Password Reset**: Implement forgot/reset password flow
4. **User Registration**: Add user registration functionality
5. **Audit Logging**: Track user authentication events

## Troubleshooting

### Common Issues

1. **Token Not Found**: Clear browser storage and login again
2. **Role Access Denied**: Check user role assignments
3. **API Errors**: Verify backend API endpoints and CORS settings

### Debug Mode
Set `localStorage.setItem('debug', 'true')` for verbose logging.

## Files Modified
- ✅ `src/App.jsx` - Added AuthProvider and ProtectedRoute
- ✅ `src/contexts/AuthContext.tsx` - Created authentication context
- ✅ `src/components/common/` - Added authentication components
- ✅ `src/lib/` - Added utility functions and API client
- ✅ `src/config/` - Added configuration files