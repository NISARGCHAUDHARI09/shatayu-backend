import React from 'react';
import StaffManagement from './StaffManagement';

const DoctorStaffManagement = (props) => {
  return (
    <StaffManagement 
      title="Staff Management" 
      {...props} 
    />
  );
};

export default DoctorStaffManagement;