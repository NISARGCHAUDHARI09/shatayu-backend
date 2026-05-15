import React from 'react';
import StaffManagement from './StaffManagement';

const DoctorStaffManagementEnhanced = (props) => {
  return (
    <StaffManagement 
      title="Doctor Staff Management" 
      {...props} 
    />
  );
};

export default DoctorStaffManagementEnhanced;