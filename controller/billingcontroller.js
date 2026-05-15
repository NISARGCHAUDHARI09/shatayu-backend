import { query as d1Query, execute as d1Execute } from '../config/d1-rest-client.js';

// Get all billing records
export const getAllBills = async (req, res) => {
  try {
    const result = await d1Query(`
      SELECT * FROM billing 
      ORDER BY date DESC
    `);

    res.json(result || []);
  } catch (error) {
    console.error('Error fetching bills:', error);
    res.status(500).json({ error: 'Failed to fetch bills' });
  }
};

// Get single bill by ID
export const getBillById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await d1Query(`
      SELECT * FROM billing WHERE id = ?
    `, [id]);

    if (!result || result.length === 0) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    res.json(result[0]);
  } catch (error) {
    console.error('Error fetching bill:', error);
    res.status(500).json({ error: 'Failed to fetch bill' });
  }
};

// Create new bill
export const createBill = async (req, res) => {
  try {
    const {
      patientName,
      patientId,
      date,
      services,
      amount,
      paid,
      status,
      paymentMethod,
      phone,
      invoiceId,
      dueDate
    } = req.body;
    
    // Generate invoice ID if not provided
    const finalInvoiceId = invoiceId || `INV-${Date.now()}`;
    
    const result = await d1Execute(`
      INSERT INTO billing (
        invoiceId, patientName, patientId, date, services, 
        amount, paid, status, paymentMethod, phone, dueDate
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      finalInvoiceId,
      patientName,
      patientId,
      date,
      JSON.stringify(services), // Store services as JSON string
      amount,
      paid || 0,
      status || 'Pending',
      paymentMethod,
      phone,
      dueDate
    ]);

    // Fetch the created bill
    const newBill = await d1Query(`
      SELECT * FROM billing WHERE id = last_insert_rowid()
    `);

    res.status(201).json(newBill[0]);
  } catch (error) {
    console.error('Error creating bill:', error);
    res.status(500).json({ error: 'Failed to create bill' });
  }
};

// Update bill
export const updateBill = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Build dynamic UPDATE query
    const updateFields = [];
    const values = [];
    
    if (updates.patientName !== undefined) {
      updateFields.push('patientName = ?');
      values.push(updates.patientName);
    }
    if (updates.amount !== undefined) {
      updateFields.push('amount = ?');
      values.push(updates.amount);
    }
    if (updates.paid !== undefined) {
      updateFields.push('paid = ?');
      values.push(updates.paid);
    }
    if (updates.status !== undefined) {
      updateFields.push('status = ?');
      values.push(updates.status);
    }
    if (updates.paymentMethod !== undefined) {
      updateFields.push('paymentMethod = ?');
      values.push(updates.paymentMethod);
    }
    if (updates.services !== undefined) {
      updateFields.push('services = ?');
      values.push(JSON.stringify(updates.services));
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    values.push(id);
    
    await d1Execute(`
      UPDATE billing 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `, values);
    
    // Fetch updated bill
    const updatedBill = await d1Query(`
      SELECT * FROM billing WHERE id = ?
    `, [id]);
    
    res.json(updatedBill[0]);
  } catch (error) {
    console.error('Error updating bill:', error);
    res.status(500).json({ error: 'Failed to update bill' });
  }
};

// Delete bill
export const deleteBill = async (req, res) => {
  try {
    const { id } = req.params;
    
    await d1Execute(`
      DELETE FROM billing WHERE id = ?
    `, [id]);
    
    res.json({ message: 'Bill deleted successfully' });
  } catch (error) {
    console.error('Error deleting bill:', error);
    res.status(500).json({ error: 'Failed to delete bill' });
  }
};

// Get billing statistics
export const getBillingStats = async (req, res) => {
  try {
    const stats = await d1Query(`
      SELECT 
        COUNT(*) as totalBills,
        SUM(amount) as totalAmount,
        SUM(paid) as totalPaid,
        SUM(amount - paid) as totalDue,
        COUNT(CASE WHEN status = 'Paid' THEN 1 END) as paidCount,
        COUNT(CASE WHEN status = 'Pending' THEN 1 END) as pendingCount,
        COUNT(CASE WHEN status = 'Overdue' THEN 1 END) as overdueCount
      FROM billing
    `);
    
    res.json(stats[0]);
  } catch (error) {
    console.error('Error fetching billing stats:', error);
    res.status(500).json({ error: 'Failed to fetch billing stats' });
  }
};
