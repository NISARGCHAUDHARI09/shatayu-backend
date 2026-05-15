// Staff controller using Cloudflare D1
import { queryOne, query, execute } from '../config/d1-rest-client.js';

// Get all staff members with pagination and filters
const getAllStaff = async (req, res) => {
  try {
    const { page = 1, limit = 10, department, status, search } = req.query;
    const offset = (page - 1) * limit;
    
    console.log('👥 Fetching all staff members...', { page, limit, department, status, search });
    
    let whereClause = 'WHERE 1=1';
    const params = [];
    
    if (department) {
      whereClause += ' AND department = ?';
      params.push(department);
    }
    
    if (status) {
      whereClause += ' AND status = ?';
      params.push(status);
    }
    
    if (search) {
      whereClause += ' AND (name LIKE ? OR employee_id LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    const staff = await query(
      `SELECT * FROM staff ${whereClause} ORDER BY name ASC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );
    
    const totalCount = await queryOne(
      `SELECT COUNT(*) as count FROM staff ${whereClause}`,
      params
    );
    
    console.log('📊 Found staff members:', staff.length);
    res.json({
      success: true,
      data: staff,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount?.count || 0,
        totalPages: Math.ceil((totalCount?.count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('❌ Error fetching staff members:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch staff members' });
  }
};

// Get staff by ID
const getStaffById = async (req, res) => {
	const { id } = req.params;
	
	console.log('👤 Getting staff member by ID:', { staffId: id });

	try {
		const staff = await queryOne('SELECT * FROM staff WHERE id = ?', [id]);
		
		if (!staff) {
			console.log('❌ Staff member not found:', { staffId: id });
			return res.status(404).json({
				success: false,
				message: 'Staff member not found'
			});
		}

		console.log('✅ Staff member retrieved successfully:', { 
			staffId: id,
			name: staff.name,
			position: staff.position 
		});

		res.json({
			success: true,
			data: staff
		});
	} catch (error) {
		console.error('❌ Error getting staff member:', error);
		res.status(500).json({
			success: false,
			message: 'Failed to fetch staff member',
			error: error.message
		});
	}
};

// Create new staff
const createStaff = async (req, res) => {
	const { 
		employee_id, name, email, phone, position, department, 
		join_date, salary, status = 'Active', address, experience, 
		qualification, emergency_contact, blood_group, working_hours 
	} = req.body;

	console.log('👤➕ Creating new staff member:', { 
		employee_id, 
		name, 
		email, 
		position, 
		department,
		status 
	});

	try {
		const result = await execute(
			`INSERT INTO staff (
				employee_id, name, email, phone, position, department, 
				join_date, salary, status, address, experience, 
				qualification, emergency_contact, blood_group, working_hours
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				employee_id, name, email, phone, position, department,
				join_date, salary, status, address, experience,
				qualification, emergency_contact, blood_group, working_hours
			]
		);

		const newStaffId = result.meta?.last_row_id;
		
		// Get the created staff member
		const newStaff = await queryOne('SELECT * FROM staff WHERE id = ?', [newStaffId]);

		console.log('✅ Staff member created successfully:', { 
			staffId: newStaffId, 
			name, 
			employee_id 
		});
		
		res.status(201).json({
			success: true,
			data: newStaff,
			message: 'Staff member created successfully'
		});
	} catch (error) {
		console.error('❌ Error creating staff member:', error);
		res.status(500).json({
			success: false,
			message: 'Failed to create staff member',
			error: error.message
		});
	}
};

// Update staff
const updateStaff = async (req, res) => {
	const { id } = req.params;
	const { 
		employee_id, name, email, phone, position, department, 
		join_date, salary, status, address, experience, 
		qualification, emergency_contact, blood_group, working_hours 
	} = req.body;

	console.log('👤✏️ Updating staff member:', { 
		staffId: id, 
		name, 
		position, 
		department,
		status 
	});

	try {
		// Check if staff exists
		const existingStaff = await queryOne('SELECT * FROM staff WHERE id = ?', [id]);
		
		if (!existingStaff) {
			console.log('❌ Staff member not found for update:', { staffId: id });
			return res.status(404).json({
				success: false,
				message: 'Staff member not found'
			});
		}

		// Update staff member
		const result = await execute(
			`UPDATE staff SET 
				employee_id = ?, name = ?, email = ?, phone = ?, position = ?, 
				department = ?, join_date = ?, salary = ?, status = ?, address = ?, 
				experience = ?, qualification = ?, emergency_contact = ?, 
				blood_group = ?, working_hours = ?, updated_at = datetime('now')
			WHERE id = ?`,
			[
				employee_id, name, email, phone, position, department,
				join_date, salary, status, address, experience,
				qualification, emergency_contact, blood_group, working_hours, id
			]
		);

		// Get updated staff member
		const updatedStaff = await queryOne('SELECT * FROM staff WHERE id = ?', [id]);

		console.log('✅ Staff member updated successfully:', { 
			staffId: id, 
			changedRows: result.meta?.changes 
		});
		
		res.json({
			success: true,
			data: updatedStaff,
			message: 'Staff member updated successfully'
		});
	} catch (error) {
		console.error('❌ Error updating staff member:', error);
		res.status(500).json({
			success: false,
			message: 'Failed to update staff member',
			error: error.message
		});
	}
};

// Delete staff
const deleteStaff = async (req, res) => {
	const { id } = req.params;
	
	console.log('👤🗑️ Deleting staff member:', { staffId: id });

	try {
		// Check if staff exists
		const existingStaff = await queryOne('SELECT * FROM staff WHERE id = ?', [id]);
		
		if (!existingStaff) {
			console.log('❌ Staff member not found for deletion:', { staffId: id });
			return res.status(404).json({
				success: false,
				message: 'Staff member not found'
			});
		}

		// Delete staff member
		const result = await execute('DELETE FROM staff WHERE id = ?', [id]);

		console.log('✅ Staff member deleted successfully:', { 
			staffId: id, 
			name: existingStaff.name,
			changedRows: result.meta?.changes 
		});
		
		res.json({
			success: true,
			message: 'Staff member deleted successfully'
		});
	} catch (error) {
		console.error('❌ Error deleting staff member:', error);
		res.status(500).json({
			success: false,
			message: 'Failed to delete staff member',
			error: error.message
		});
	}
};

// Get staff statistics
const getStaffStatistics = async (req, res) => {
	console.log('📊 Getting staff statistics...');

	try {
		// Get total staff count
		const totalResult = await queryOne('SELECT COUNT(*) as total FROM staff');
		const total_staff = totalResult.total;

		// Get active staff count
		const activeResult = await queryOne('SELECT COUNT(*) as active FROM staff WHERE status = ?', ['Active']);
		const active_staff = activeResult.active;

		// Get on leave staff count
		const onLeaveResult = await queryOne('SELECT COUNT(*) as on_leave FROM staff WHERE status = ?', ['On Leave']);
		const on_leave_staff = onLeaveResult.on_leave;

		// Get inactive staff count
		const inactiveResult = await queryOne('SELECT COUNT(*) as inactive FROM staff WHERE status = ?', ['Inactive']);
		const inactive_staff = inactiveResult.inactive;

		// Get departments
		const departmentResult = await query('SELECT DISTINCT department FROM staff WHERE department IS NOT NULL');
		const departments = departmentResult.map(d => d.department);

		// Get department distribution
		const departmentDistribution = await query(
			'SELECT department, COUNT(*) as count FROM staff WHERE department IS NOT NULL GROUP BY department'
		);

		const statistics = {
			total_staff,
			active_staff,
			on_leave_staff,
			inactive_staff,
			total_departments: departments.length,
			departments,
			departmentDistribution
		};

		console.log('✅ Staff statistics retrieved successfully:', statistics);

		res.json({
			success: true,
			data: statistics
		});
	} catch (error) {
		console.error('❌ Error getting staff statistics:', error);
		res.status(500).json({
			success: false,
			error: 'Failed to fetch statistics',
			details: error.message
		});
	}
};

// Get departments
const getDepartments = async (req, res) => {
	console.log('🏢 Getting all departments...');

	try {
		const result = await query(
			'SELECT DISTINCT department, COUNT(*) as staff_count FROM staff WHERE department IS NOT NULL GROUP BY department ORDER BY department'
		);

		const departments = result.map(d => ({
			name: d.department,
			staff_count: d.staff_count
		}));

		console.log('✅ Departments retrieved successfully:', { count: departments.length });

		res.json({
			success: true,
			data: departments
		});
	} catch (error) {
		console.error('❌ Error getting departments:', error);
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