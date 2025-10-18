-- Staff Management System Database Schema
-- This schema supports comprehensive staff management including personal info, employment details, leave management, and performance tracking

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS hospital_management;
USE hospital_management;

-- Staff table for storing all staff information
CREATE TABLE IF NOT EXISTS staff (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    position VARCHAR(100) NOT NULL,
    department VARCHAR(50) NOT NULL,
    join_date DATE NOT NULL,
    salary DECIMAL(10,2),
    status ENUM('Active', 'On Leave', 'Inactive') DEFAULT 'Active',
    avatar VARCHAR(255),
    address TEXT,
    experience VARCHAR(50),
    qualification VARCHAR(200),
    emergency_contact VARCHAR(20),
    blood_group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
    working_hours VARCHAR(50),
    performance INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Leave management table
CREATE TABLE IF NOT EXISTS staff_leave (
    id INT PRIMARY KEY AUTO_INCREMENT,
    staff_id INT NOT NULL,
    leave_type ENUM('Annual Leave', 'Medical Leave', 'Emergency Leave', 'Maternity Leave', 'Paternity Leave', 'Study Leave', 'Casual Leave') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    applied_date DATE NOT NULL,
    approved_by INT NULL,
    approved_date DATE NULL,
    rejection_reason TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES staff(id) ON DELETE SET NULL
);

-- Staff performance tracking table
CREATE TABLE IF NOT EXISTS staff_performance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    staff_id INT NOT NULL,
    evaluation_date DATE NOT NULL,
    performance_score INT NOT NULL CHECK (performance_score >= 0 AND performance_score <= 100),
    attendance_percentage DECIMAL(5,2) DEFAULT 0,
    projects_completed INT DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    feedback TEXT,
    evaluator_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE,
    FOREIGN KEY (evaluator_id) REFERENCES staff(id) ON DELETE SET NULL
);

-- Staff attendance tracking table
CREATE TABLE IF NOT EXISTS staff_attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    staff_id INT NOT NULL,
    attendance_date DATE NOT NULL,
    check_in_time TIME,
    check_out_time TIME,
    hours_worked DECIMAL(4,2),
    status ENUM('Present', 'Absent', 'Late', 'Half Day', 'On Leave') NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE,
    UNIQUE KEY unique_staff_date (staff_id, attendance_date)
);

-- Staff documents table for storing important documents
CREATE TABLE IF NOT EXISTS staff_documents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    staff_id INT NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT,
    uploaded_date DATE NOT NULL,
    expiry_date DATE NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by INT NULL,
    verified_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES staff(id) ON DELETE SET NULL
);

-- Staff departments lookup table
CREATE TABLE IF NOT EXISTS departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    head_of_department INT NULL,
    budget DECIMAL(15,2) DEFAULT 0,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (head_of_department) REFERENCES staff(id) ON DELETE SET NULL
);

-- Indexes for better performance
CREATE INDEX idx_staff_employee_id ON staff(employee_id);
CREATE INDEX idx_staff_email ON staff(email);
CREATE INDEX idx_staff_department ON staff(department);
CREATE INDEX idx_staff_status ON staff(status);
CREATE INDEX idx_staff_join_date ON staff(join_date);

CREATE INDEX idx_leave_staff_id ON staff_leave(staff_id);
CREATE INDEX idx_leave_status ON staff_leave(status);
CREATE INDEX idx_leave_dates ON staff_leave(start_date, end_date);

CREATE INDEX idx_performance_staff_id ON staff_performance(staff_id);
CREATE INDEX idx_performance_date ON staff_performance(evaluation_date);

CREATE INDEX idx_attendance_staff_id ON staff_attendance(staff_id);
CREATE INDEX idx_attendance_date ON staff_attendance(attendance_date);
CREATE INDEX idx_attendance_status ON staff_attendance(status);

-- Insert default departments
INSERT INTO departments (name, description) VALUES
('Cardiology', 'Heart and cardiovascular system treatments'),
('ICU', 'Intensive Care Unit for critical patients'),
('Pharmacy', 'Medicine dispensing and pharmaceutical services'),
('Pediatrics', 'Medical care for infants, children, and adolescents'),
('Laboratory', 'Medical testing and diagnostics'),
('Radiology', 'Medical imaging and diagnostic services'),
('Emergency', 'Emergency medical services and trauma care'),
('Surgery', 'Surgical procedures and operations'),
('Orthopedics', 'Bone, joint, and musculoskeletal treatments'),
('Gynecology', 'Women\'s reproductive health and obstetrics');

-- Sample staff data (optional - for testing)
INSERT INTO staff (
    employee_id, name, email, phone, position, department, join_date, salary, 
    status, address, experience, qualification, emergency_contact, blood_group, 
    working_hours, performance
) VALUES
('EMP001', 'Dr. Rajesh Kumar', 'rajesh.kumar@hospital.com', '+91 9876543210', 
 'Senior Doctor', 'Cardiology', '2020-01-15', 75000.00, 'Active', 
 '123 Medical Street, New Delhi', '8 years', 'MBBS, MD Cardiology', 
 '+91 9876543211', 'O+', '9:00 AM - 6:00 PM', 95),

('EMP002', 'Sister Priya Sharma', 'priya.sharma@hospital.com', '+91 9876543220', 
 'Head Nurse', 'ICU', '2019-03-10', 35000.00, 'Active', 
 '456 Care Lane, Mumbai', '6 years', 'B.Sc Nursing', 
 '+91 9876543221', 'A+', '8:00 AM - 8:00 PM', 88),

('EMP003', 'Mr. Amit Patel', 'amit.patel@hospital.com', '+91 9876543230', 
 'Pharmacist', 'Pharmacy', '2021-06-20', 28000.00, 'Active', 
 '789 Medicine Road, Bangalore', '3 years', 'B.Pharm', 
 '+91 9876543231', 'B+', '9:00 AM - 6:00 PM', 92),

('EMP004', 'Dr. Sunita Verma', 'sunita.verma@hospital.com', '+91 9876543240', 
 'Consultant', 'Pediatrics', '2018-08-12', 65000.00, 'On Leave', 
 '321 Children Avenue, Chennai', '10 years', 'MBBS, MD Pediatrics', 
 '+91 9876543241', 'AB+', '10:00 AM - 7:00 PM', 90),

('EMP005', 'Mr. Ravi Singh', 'ravi.singh@hospital.com', '+91 9876543250', 
 'Lab Technician', 'Laboratory', '2022-01-05', 22000.00, 'Inactive', 
 '654 Lab Street, Pune', '2 years', 'Diploma in Medical Lab Technology', 
 '+91 9876543251', 'O-', '7:00 AM - 4:00 PM', 85);

-- Sample leave data
INSERT INTO staff_leave (staff_id, leave_type, start_date, end_date, reason, status, applied_date) VALUES
(1, 'Annual Leave', '2025-02-15', '2025-02-20', 'Family vacation', 'Approved', '2025-01-15'),
(4, 'Medical Leave', '2025-09-01', '2025-10-15', 'Surgery recovery', 'Approved', '2025-08-25');

-- Sample performance data
INSERT INTO staff_performance (staff_id, evaluation_date, performance_score, attendance_percentage, projects_completed, rating) VALUES
(1, '2024-12-31', 95, 98.5, 12, 4.8),
(2, '2024-12-31', 88, 96.0, 8, 4.4),
(3, '2024-12-31', 92, 99.0, 10, 4.6),
(4, '2024-12-31', 90, 94.0, 15, 4.5),
(5, '2024-12-31', 85, 91.0, 6, 4.2);

-- Views for easy data retrieval
CREATE VIEW staff_summary AS
SELECT 
    s.id,
    s.employee_id,
    s.name,
    s.email,
    s.phone,
    s.position,
    s.department,
    s.status,
    s.join_date,
    s.performance,
    DATEDIFF(CURDATE(), s.join_date) as days_employed,
    (SELECT COUNT(*) FROM staff_leave sl WHERE sl.staff_id = s.id AND sl.status = 'Approved') as total_leaves_taken,
    (SELECT AVG(performance_score) FROM staff_performance sp WHERE sp.staff_id = s.id) as avg_performance
FROM staff s;

CREATE VIEW department_stats AS
SELECT 
    department,
    COUNT(*) as total_staff,
    COUNT(CASE WHEN status = 'Active' THEN 1 END) as active_staff,
    COUNT(CASE WHEN status = 'On Leave' THEN 1 END) as on_leave_staff,
    COUNT(CASE WHEN status = 'Inactive' THEN 1 END) as inactive_staff,
    AVG(performance) as avg_performance,
    AVG(salary) as avg_salary
FROM staff 
GROUP BY department;

-- Stored procedures for common operations
DELIMITER //

CREATE PROCEDURE GetStaffStatistics()
BEGIN
    SELECT 
        COUNT(*) as total_staff,
        COUNT(CASE WHEN status = 'Active' THEN 1 END) as active_staff,
        COUNT(CASE WHEN status = 'On Leave' THEN 1 END) as on_leave_staff,
        COUNT(CASE WHEN status = 'Inactive' THEN 1 END) as inactive_staff,
        ROUND(AVG(performance), 2) as avg_performance,
        ROUND(AVG(salary), 2) as avg_salary
    FROM staff;
END //

CREATE PROCEDURE GetStaffLeaveBalance(IN staff_id_param INT)
BEGIN
    DECLARE total_leaves INT DEFAULT 0;
    DECLARE used_leaves INT DEFAULT 0;
    
    SET total_leaves = 21; -- Assuming 21 days annual leave
    
    SELECT COUNT(*) INTO used_leaves
    FROM staff_leave 
    WHERE staff_id = staff_id_param 
    AND status = 'Approved' 
    AND YEAR(start_date) = YEAR(CURDATE());
    
    SELECT 
        total_leaves as total_annual_leave,
        used_leaves as leaves_taken,
        (total_leaves - used_leaves) as remaining_leave;
END //

DELIMITER ;