// Clean inventory controller with full CRUD operations using Cloudflare D1
import { queryOne, query, execute } from '../config/d1-rest-client.js';

// Get all inventory items with pagination and filters
export const getAllItems = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, status, search } = req.query;
    const offset = (page - 1) * limit;
    
    console.log('📦 Fetching all inventory items...', { page, limit, category, status, search });
    
    let whereClause = 'WHERE 1=1';
    const params = [];
    
    if (category) {
      whereClause += ' AND category = ?';
      params.push(category);
    }
    
    if (status) {
      whereClause += ' AND status = ?';
      params.push(status);
    }
    
    if (search) {
      whereClause += ' AND (name LIKE ? OR item_code LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    const items = await query(
      `SELECT * FROM inventory ${whereClause} ORDER BY name ASC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );
    
    const totalCount = await queryOne(
      `SELECT COUNT(*) as count FROM inventory ${whereClause}`,
      params
    );
    
    console.log('📊 Found inventory items:', items.length);
    res.json({
      success: true,
      data: items,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount?.count || 0,
        totalPages: Math.ceil((totalCount?.count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('❌ Error fetching inventory items:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch inventory items' });
  }
};

// Add new inventory item
export const addItem = async (req, res) => {
  try {
    const {
      item_code,
      name,
      category,
      subcategory,
      description,
      unit,
      current_stock,
      min_stock,
      max_stock,
      unit_price,
      supplier,
      batch_number,
      manufacturing_date,
      expiry_date,
      location,
      status = 'in stock'
    } = req.body;

    console.log('➕ Adding new inventory item:', { name, item_code });

    const total_value = current_stock * unit_price;

    const result = await execute(
      `INSERT INTO inventory (
        item_code, name, category, subcategory, description, unit,
        current_stock, min_stock, max_stock, unit_price, total_value,
        supplier, batch_number, manufacturing_date, expiry_date,
        location, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [item_code, name, category, subcategory, description, unit,
       current_stock, min_stock, max_stock, unit_price, total_value,
       supplier, batch_number, manufacturing_date, expiry_date, location, status]
    );

    console.log('✅ Inventory item added successfully');
    res.status(201).json({ 
      success: true, 
      message: 'Inventory item added successfully',
      id: result.meta.last_row_id 
    });
  } catch (error) {
    console.error('❌ Error adding inventory item:', error);
    res.status(500).json({ success: false, error: 'Failed to add inventory item' });
  }
};

// Get specific item details
export const getItem = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('👁️ Viewing inventory item:', id);
    
    const item = await queryOne('SELECT * FROM inventory WHERE id = ?', [id]);
    
    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }
    
    console.log('📄 Item found:', item.name);
    res.json({ success: true, data: item });
  } catch (error) {
    console.error('❌ Error viewing item:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch item' });
  }
};

// Update inventory item
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    console.log('✏️ Editing inventory item:', id);
    
    // Recalculate total_value if stock or price changed
    if (updateData.current_stock || updateData.unit_price) {
      const currentItem = await queryOne('SELECT current_stock, unit_price FROM inventory WHERE id = ?', [id]);
      const newStock = updateData.current_stock || currentItem.current_stock;
      const newPrice = updateData.unit_price || currentItem.unit_price;
      updateData.total_value = newStock * newPrice;
    }
    
    const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updateData), id];
    
    await execute(
      `UPDATE inventory SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );
    
    console.log('✅ Item updated successfully');
    res.json({ success: true, message: 'Item updated successfully' });
  } catch (error) {
    console.error('❌ Error updating item:', error);
    res.status(500).json({ success: false, error: 'Failed to update item' });
  }
};

// Delete inventory item
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑️ Deleting inventory item:', id);
    
    await execute('DELETE FROM inventory WHERE id = ?', [id]);
    
    console.log('✅ Item deleted successfully');
    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting item:', error);
    res.status(500).json({ success: false, error: 'Failed to delete item' });
  }
};

// Get low stock items
export const getLowStockItems = async (req, res) => {
  try {
    console.log('⚠️ Fetching low stock items...');
    
    const lowStockItems = await query(
      'SELECT * FROM inventory WHERE current_stock <= min_stock ORDER BY current_stock ASC'
    );
    
    console.log('📊 Found low stock items:', lowStockItems.length);
    res.json({ success: true, data: lowStockItems });
  } catch (error) {
    console.error('❌ Error fetching low stock items:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch low stock items' });
  }
};

// Get inventory statistics
export const getInventoryStatistics = async (req, res) => {
  try {
    console.log('📊 Fetching inventory statistics...');
    
    const totalItems = await queryOne('SELECT COUNT(*) as count FROM inventory');
    const totalValue = await queryOne('SELECT SUM(total_value) as total FROM inventory');
    const lowStockCount = await queryOne('SELECT COUNT(*) as count FROM inventory WHERE current_stock <= min_stock');
    const outOfStockCount = await queryOne('SELECT COUNT(*) as count FROM inventory WHERE current_stock = 0');
    
    const categories = await query(
      'SELECT category, COUNT(*) as count, SUM(total_value) as value FROM inventory GROUP BY category'
    );
    
    const stats = {
      total_items: totalItems?.count || 0,
      total_value: totalValue?.total || 0,
      low_stock_count: lowStockCount?.count || 0,
      out_of_stock_count: outOfStockCount?.count || 0,
      categories: categories
    };
    
    console.log('📈 Inventory Statistics:', stats);
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('❌ Error fetching inventory statistics:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch statistics' });
  }
};

// Record stock movement (in/out)
export const recordStockMovement = async (req, res) => {
  try {
    const { id } = req.params;
    const { movement_type, quantity, reason, reference } = req.body;
    
    console.log('📝 Recording stock movement for item:', id);
    
    // Get current stock
    const item = await queryOne('SELECT current_stock, unit_price, name FROM inventory WHERE id = ?', [id]);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }
    
    let newStock;
    if (movement_type === 'in') {
      newStock = item.current_stock + quantity;
    } else if (movement_type === 'out') {
      newStock = Math.max(0, item.current_stock - quantity);
    } else {
      return res.status(400).json({ success: false, error: 'Invalid movement type' });
    }
    
    const newTotalValue = newStock * item.unit_price;
    
    // Update stock
    await execute(
      'UPDATE inventory SET current_stock = ?, total_value = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newStock, newTotalValue, id]
    );
    
    // Record movement in stock_movements table (if exists)
    try {
      await execute(
        `INSERT INTO stock_movements (
          item_id, item_name, movement_type, quantity, 
          previous_stock, new_stock, reason, reference, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [id, item.name, movement_type, quantity, item.current_stock, newStock, reason, reference]
      );
    } catch (err) {
      console.log('⚠️ Stock movements table not found, skipping movement record');
    }
    
    console.log('✅ Stock movement recorded successfully');
    res.json({ 
      success: true, 
      message: 'Stock movement recorded successfully',
      previous_stock: item.current_stock,
      new_stock: newStock
    });
  } catch (error) {
    console.error('❌ Error recording stock movement:', error);
    res.status(500).json({ success: false, error: 'Failed to record stock movement' });
  }
};