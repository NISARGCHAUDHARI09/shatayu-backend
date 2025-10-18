// Database Table Analysis Report
// Checking required tables vs existing SQL schemas

import fs from 'fs';
import path from 'path';

console.log('📊 HOSPITAL MANAGEMENT SYSTEM - DATABASE TABLE ANALYSIS\n');

// Tables required by our controllers (extracted from grep analysis)
const requiredTables = {
  // IPD Controller
  'ipd_records': {
    description: 'In-Patient Department records with admission, patient info, room details',
    columns: ['id', 'reg_no', 'case_id', 'name', 'age', 'gender', 'phone', 'admission_date', 'room', 'doctor', 'condition', 'status', 'medicines', 'progress_notes', 'daily_charges', 'created_at', 'updated_at'],
    sqlFile: 'ipd_records.sql'
  },
  
  // OPD Controller  
  'opd_records': {
    description: 'Out-Patient Department records with visit info and medical details',
    columns: ['id', 'patient_name', 'case_id', 'visit_date', 'status', 'medicines', 'created_at', 'updated_at'],
    sqlFile: 'opd_records.sql'
  },
  
  // Prescription Controller
  'prescriptions': {
    description: 'Medical prescriptions linked to OPD patients',
    columns: ['id', 'opd_patient_id', 'prescription_date', 'doctor_name', 'medicines', 'instructions', 'notes', 'follow_up_date', 'complaints', 'ayurvedic_assessment', 'examination', 'roga'],
    sqlFile: 'prescriptions.sql'
  },
  
  // Staff Controller
  'staff': {
    description: 'Hospital staff management with roles, departments, salary',
    columns: ['id', 'employee_id', 'name', 'email', 'phone', 'position', 'department', 'join_date', 'salary', 'status', 'address', 'experience', 'qualification', 'emergency_contact', 'blood_group', 'working_hours', 'created_at', 'updated_at'],
    sqlFile: 'staff.sql'
  },
  
  // Inventory Controller
  'inventory': {
    description: 'Medical equipment and supplies inventory management',
    columns: ['id', 'name', 'category', 'current_stock', 'min_stock', 'unit_price', 'total_value', 'supplier', 'created_at', 'updated_at'],
    sqlFile: 'inventory.sql'
  },
  
  // Stock Movements (Inventory)
  'stock_movements': {
    description: 'Track inventory stock changes and movements',
    columns: ['id', 'inventory_id', 'movement_type', 'quantity', 'reason', 'created_at'],
    sqlFile: 'inventory.sql'
  },
  
  // Medicine Controllers
  'medicine_bills': {
    description: 'Finalized medicine bills for patients',
    columns: ['id', 'patient_id', 'patient_name', 'patient_age', 'patient_gender', 'case_id', 'doctor_id', 'doctor_name', 'medicines_json', 'total_amount', 'discount', 'final_total', 'reminder_date', 'finalized_at', 'created_at'],
    sqlFile: 'medicine_bills_mysql.sql'
  },
  
  'draft_bills': {
    description: 'Draft medicine bills before finalization',
    columns: ['id', 'patient_id', 'patient_name', 'patient_age', 'patient_gender', 'case_id', 'doctor_id', 'doctor_name', 'medicines_json', 'total_amount', 'discount', 'final_total', 'reminder_date', 'status', 'created_at'],
    sqlFile: 'draft_bills.sql'
  },
  
  // Authentication (already working)
  'users': {
    description: 'System users with authentication (WORKING - already exists in D1)',
    columns: ['id', 'email', 'password', 'role', 'username', 'name', 'created_at', 'updated_at'],
    sqlFile: 'users.sql',
    status: '✅ EXISTS & WORKING'
  }
};

console.log('🎯 REQUIRED TABLES FOR HOSPITAL MANAGEMENT SYSTEM:\n');

let existingCount = 0;
let missingCount = 0;

Object.entries(requiredTables).forEach(([tableName, info], index) => {
  const status = info.status || '❌ MISSING/NOT TESTED';
  if (info.status) existingCount++;
  else missingCount++;
  
  console.log(`${index + 1}. ${tableName.toUpperCase()}`);
  console.log(`   📝 ${info.description}`);
  console.log(`   📁 SQL File: ${info.sqlFile}`);
  console.log(`   📊 Status: ${status}`);
  console.log(`   🗃️  Expected Columns: ${info.columns.slice(0, 5).join(', ')}${info.columns.length > 5 ? ', ...' : ''}`);
  console.log('');
});

console.log('📋 SUMMARY:');
console.log(`✅ Working Tables: ${existingCount}`);
console.log(`❌ Missing/Untested Tables: ${missingCount}`);
console.log(`📊 Total Required: ${Object.keys(requiredTables).length}`);

console.log('\n🔧 NEXT STEPS RECOMMENDED:');
console.log('1. Convert MySQL schemas to SQLite/D1 compatible format');
console.log('2. Create database initialization script for D1');
console.log('3. Test each controller endpoint after table creation');
console.log('4. Fix any SQL syntax issues for Cloudflare D1');

export { requiredTables };