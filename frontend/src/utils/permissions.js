// Role-based access control system
export const roles = {
  SUPER_ADMIN: 'super_admin',
  HOSPITAL_ADMIN: 'hospital_admin', 
  DOCTOR: 'doctor',
  RECEPTIONIST: 'receptionist',
  PHARMACIST: 'pharmacist'
};

export const permissions = {
  // SuperAdmin permissions
  MANAGE_HOSPITALS: 'manage_hospitals',
  VIEW_ALL_ANALYTICS: 'view_all_analytics',
  MANAGE_SUBSCRIPTIONS: 'manage_subscriptions',
  SYSTEM_SETTINGS: 'system_settings',
  
  // Hospital Admin permissions
  MANAGE_HOSPITAL_USERS: 'manage_hospital_users',
  VIEW_HOSPITAL_ANALYTICS: 'view_hospital_analytics',
  MANAGE_HOSPITAL_SETTINGS: 'manage_hospital_settings',
  
  // Common permissions
  PATIENTS_VIEW: 'patients_view',
  PATIENTS_CREATE: 'patients_create',
  PATIENTS_EDIT: 'patients_edit',
  PATIENTS_DELETE: 'patients_delete',
  
  OPD_VIEW: 'opd_view',
  OPD_MANAGE: 'opd_manage',
  
  IPD_VIEW: 'ipd_view',
  IPD_MANAGE: 'ipd_manage',
  
  APPOINTMENTS_VIEW: 'appointments_view',
  APPOINTMENTS_MANAGE: 'appointments_manage',
  
  BILLING_VIEW: 'billing_view',
  BILLING_MANAGE: 'billing_manage',
  
  PHARMACY_VIEW: 'pharmacy_view',
  PHARMACY_MANAGE: 'pharmacy_manage',
  
  INSURANCE_DOCS_VIEW: 'insurance_docs_view',
  INSURANCE_DOCS_GENERATE: 'insurance_docs_generate',
  INSURANCE_DOCS_SUBMIT: 'insurance_docs_submit'
};

export const rolePermissions = {
  [roles.SUPER_ADMIN]: [
    permissions.MANAGE_HOSPITALS,
    permissions.VIEW_ALL_ANALYTICS,
    permissions.MANAGE_SUBSCRIPTIONS,
    permissions.SYSTEM_SETTINGS,
    // SuperAdmin can access everything
    ...Object.values(permissions)
  ],
  
  [roles.HOSPITAL_ADMIN]: [
    permissions.MANAGE_HOSPITAL_USERS,
    permissions.VIEW_HOSPITAL_ANALYTICS,
    permissions.MANAGE_HOSPITAL_SETTINGS,
    permissions.PATIENTS_VIEW,
    permissions.PATIENTS_CREATE,
    permissions.PATIENTS_EDIT,
    permissions.PATIENTS_DELETE,
    permissions.OPD_VIEW,
    permissions.OPD_MANAGE,
    permissions.IPD_VIEW,
    permissions.IPD_MANAGE,
    permissions.APPOINTMENTS_VIEW,
    permissions.APPOINTMENTS_MANAGE,
    permissions.BILLING_VIEW,
    permissions.BILLING_MANAGE,
    permissions.PHARMACY_VIEW,
    permissions.PHARMACY_MANAGE,
    permissions.INSURANCE_DOCS_VIEW,
    permissions.INSURANCE_DOCS_GENERATE,
    permissions.INSURANCE_DOCS_SUBMIT
  ],
  
  [roles.DOCTOR]: [
    permissions.PATIENTS_VIEW,
    permissions.PATIENTS_EDIT,
    permissions.OPD_VIEW,
    permissions.OPD_MANAGE,
    permissions.IPD_VIEW,
    permissions.IPD_MANAGE,
    permissions.APPOINTMENTS_VIEW
  ],
  
  [roles.RECEPTIONIST]: [
    permissions.PATIENTS_VIEW,
    permissions.PATIENTS_CREATE,
    permissions.PATIENTS_EDIT,
    permissions.APPOINTMENTS_VIEW,
    permissions.APPOINTMENTS_MANAGE,
    permissions.BILLING_VIEW
  ],
  
  [roles.PHARMACIST]: [
    permissions.PATIENTS_VIEW,
    permissions.PHARMACY_VIEW,
    permissions.PHARMACY_MANAGE
  ],
  
};

export const hasPermission = (userRole, permission) => {
  const userPermissions = rolePermissions[userRole] || [];
  return userPermissions.includes(permission);
};

export const canAccess = (userRole, requiredPermissions) => {
  return requiredPermissions.every(permission => hasPermission(userRole, permission));
};
