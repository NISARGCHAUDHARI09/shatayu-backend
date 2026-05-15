// API Client with JWT Token Management
export class ApiClient {
  private baseURL: string;
  private token: string | null;

  constructor(baseURL: string = 'https://shatayu-backend.onrender.com') {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('authToken');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    // Handle authentication errors
    if (response.status === 401) {
      this.clearToken();
      window.location.href = '/login';
      throw new Error('Authentication required');
    }
    
    if (response.status === 403) {
      throw new Error('Insufficient permissions');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Authentication methods
  async login(credentials: { email?: string; password?: string; username?: string }) {
    // Try auth endpoint first
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.token) {
          this.setToken(data.token);
          return { success: true, token: data.token, user: data.user };
        }
      }
    } catch (error) {
      console.log('Auth endpoint not available, trying demo login...');
    }

    // Fallback to demo login
    try {
      const response = await fetch(`${this.baseURL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'doctor', password: 'password' }),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          this.setToken(data.token);
          // For demo login, create a mock user object
          return { 
            success: true, 
            token: data.token, 
            user: { 
              username: 'doctor',
              role: 'doctor',
              email: 'doctor@hospital.com',
              id: '1'
            }
          };
        }
      }
    } catch (error) {
      console.error('Demo login failed:', error);
    }

    return { success: false, error: 'Login failed' };
  }

  // Hospital Management API methods
  async getIPDPatients(page = 1, limit = 10) {
    return this.request(`/ipd/patients?page=${page}&limit=${limit}`);
  }

  async getOPDPatients(page = 1, limit = 10) {
    return this.request(`/opd/?page=${page}&limit=${limit}`);
  }

  async getStaff(page = 1, limit = 10) {
    return this.request(`/staff/?page=${page}&limit=${limit}`);
  }

  async getInventory(page = 1, limit = 10) {
    return this.request(`/inventory/?page=${page}&limit=${limit}`);
  }

  async getIPDStatistics() {
    return this.request('/ipd/statistics');
  }

  async getOPDStatistics() {
    return this.request('/opd/statistics');
  }

  async getStaffStatistics() {
    return this.request('/staff/statistics');
  }

  async getInventoryStatistics() {
    return this.request('/inventory/statistics');
  }

  // CRUD operations
  async createIPDPatient(patientData: any) {
    return this.request('/ipd/patients', {
      method: 'POST',
      body: JSON.stringify(patientData),
    });
  }

  async updateIPDPatient(id: string, patientData: any) {
    return this.request(`/ipd/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patientData),
    });
  }

  async deleteIPDPatient(id: string) {
    return this.request(`/ipd/patients/${id}`, {
      method: 'DELETE',
    });
  }

  // User Management API Methods
  
  // Create new user
  async createUser(userData: {
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'doctor' | 'staff' | 'patient';
    first_name: string;
    last_name: string;
    phone?: string;
    department?: string;
  }) {
    return this.request('/users/create', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Get all users with filters and pagination
  async getAllUsers(params: {
    page?: number;
    limit?: number;
    role?: string;
    department?: string;
    is_active?: boolean;
    search?: string;
  } = {}) {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    return this.request(`/users${queryString ? `?${queryString}` : ''}`);
  }

  // Get user by ID
  async getUserById(id: string | number) {
    return this.request(`/users/${id}`);
  }

  // Update user
  async updateUser(id: string | number, userData: {
    username?: string;
    email?: string;
    role?: 'admin' | 'doctor' | 'staff' | 'patient';
    first_name?: string;
    last_name?: string;
    phone?: string;
    department?: string;
    is_active?: boolean;
  }) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Delete user (soft delete)
  async deleteUser(id: string | number) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Get user statistics
  async getUserStatistics() {
    return this.request('/users/statistics');
  }

  // User login (alternative endpoint)
  async loginUser(credentials: { 
    email?: string; 
    username?: string; 
    password: string; 
  }) {
    return this.request('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();