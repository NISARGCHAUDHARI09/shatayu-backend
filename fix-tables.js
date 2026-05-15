// Fix OPD and Inventory table issues
// 1. Add missing columns to OPD table
// 2. Create inventory table

import { execute, queryOne, query } from './config/d1-rest-client.js';

async function fixOPDTable() {
    console.log('🏥 Fixing OPD Records Table Schema...');
    
    try {
        // Check current schema
        const schema = await query("PRAGMA table_info(opd_records)");
        const columnNames = schema.map(col => col.name);
        
        console.log('Current OPD columns:', columnNames);
        
        // Add missing columns if they don't exist
        const columnsToAdd = [
            { name: 'visit_date', type: 'TEXT', default: 'appointment_date' },
            { name: 'created_at', type: 'TEXT', default: 'CURRENT_TIMESTAMP' },
            { name: 'updated_at', type: 'TEXT', default: 'CURRENT_TIMESTAMP' }
        ];
        
        for (const col of columnsToAdd) {
            if (!columnNames.includes(col.name)) {
                console.log(`➕ Adding column: ${col.name}`);
                
                let alterQuery;
                if (col.default === 'appointment_date') {
                    // Copy appointment_date to visit_date
                    alterQuery = `ALTER TABLE opd_records ADD COLUMN ${col.name} ${col.type}`;
                } else {
                    alterQuery = `ALTER TABLE opd_records ADD COLUMN ${col.name} ${col.type} DEFAULT ${col.default}`;
                }
                
                await execute(alterQuery);
                console.log(`✅ Added column: ${col.name}`);
                
                // If visit_date, copy data from appointment_date
                if (col.name === 'visit_date') {
                    await execute('UPDATE opd_records SET visit_date = appointment_date WHERE visit_date IS NULL');
                    console.log('✅ Populated visit_date from appointment_date');
                }
            } else {
                console.log(`✅ Column ${col.name} already exists`);
            }
        }
        
        console.log('✅ OPD table schema fixed!');
        return true;
        
    } catch (error) {
        console.error('❌ Error fixing OPD table:', error.message);
        return false;
    }
}

async function createInventoryTable() {
    console.log('\n📦 Creating Inventory Table...');
    
    try {
        const createInventorySQL = `
        CREATE TABLE IF NOT EXISTS inventory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT,
            current_stock INTEGER DEFAULT 0,
            min_stock INTEGER DEFAULT 0,
            unit_price REAL DEFAULT 0.0,
            total_value REAL DEFAULT 0.0,
            supplier TEXT,
            description TEXT,
            unit TEXT DEFAULT 'piece',
            expiry_date TEXT,
            batch_number TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        );`;
        
        await execute(createInventorySQL);
        console.log('✅ Inventory table created successfully!');
        
        // Add some sample inventory data
        const sampleItems = [
            {
                name: 'Ashwagandha Tablets',
                category: 'Ayurvedic Medicine',
                current_stock: 100,
                min_stock: 20,
                unit_price: 150.0,
                total_value: 15000.0,
                supplier: 'Himalaya Drug Company',
                description: '500mg tablets for stress relief',
                unit: 'bottle'
            },
            {
                name: 'Digital Thermometer',
                category: 'Medical Equipment',
                current_stock: 15,
                min_stock: 5,
                unit_price: 250.0,
                total_value: 3750.0,
                supplier: 'Medical Supplies Co.',
                description: 'Digital infrared thermometer',
                unit: 'piece'
            },
            {
                name: 'Surgical Gloves',
                category: 'Medical Supplies',
                current_stock: 500,
                min_stock: 100,
                unit_price: 2.0,
                total_value: 1000.0,
                supplier: 'MedTech Solutions',
                description: 'Disposable latex gloves',
                unit: 'pair'
            }
        ];
        
        console.log('📝 Adding sample inventory items...');
        
        for (const item of sampleItems) {
            await execute(
                `INSERT INTO inventory (
                    name, category, current_stock, min_stock, unit_price, 
                    total_value, supplier, description, unit
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    item.name, item.category, item.current_stock, item.min_stock,
                    item.unit_price, item.total_value, item.supplier, item.description, item.unit
                ]
            );
        }
        
        console.log('✅ Sample inventory items added!');
        
        // Verify inventory creation
        const count = await queryOne('SELECT COUNT(*) as count FROM inventory');
        console.log(`📊 Inventory items created: ${count.count}`);
        
        return true;
        
    } catch (error) {
        console.error('❌ Error creating inventory table:', error.message);
        return false;
    }
}

async function testFixedTables() {
    console.log('\n🧪 Testing Fixed Tables...');
    
    try {
        // Test OPD queries
        console.log('Testing OPD queries...');
        const opdCount = await queryOne('SELECT COUNT(*) as total FROM opd_records');
        console.log('✅ OPD count query:', opdCount);
        
        const opdRecords = await query('SELECT * FROM opd_records ORDER BY visit_date DESC, created_at DESC LIMIT 2');
        console.log('✅ OPD select query works, found:', opdRecords.length, 'records');
        
        // Test Inventory queries
        console.log('Testing Inventory queries...');
        const inventoryCount = await queryOne('SELECT COUNT(*) as count FROM inventory');
        console.log('✅ Inventory count query:', inventoryCount);
        
        const inventoryItems = await query('SELECT * FROM inventory ORDER BY name ASC LIMIT 3');
        console.log('✅ Inventory select query works, found:', inventoryItems.length, 'items');
        
        const lowStock = await query('SELECT * FROM inventory WHERE current_stock <= min_stock');
        console.log('✅ Low stock query works, found:', lowStock.length, 'low stock items');
        
        return true;
        
    } catch (error) {
        console.error('❌ Error testing fixed tables:', error.message);
        return false;
    }
}

// Main execution
async function main() {
    console.log('🔧 FIXING OPD & INVENTORY TABLE ISSUES');
    console.log('=' .repeat(50));
    
    let opdFixed = await fixOPDTable();
    let inventoryCreated = await createInventoryTable();
    
    if (opdFixed && inventoryCreated) {
        await testFixedTables();
        
        console.log('\n' + '=' .repeat(50));
        console.log('✅ All table issues fixed!');
        console.log('🧪 You can now test the endpoints again');
        console.log('📊 Expected working endpoints:');
        console.log('   - GET /api/opd/ (should return 200)');
        console.log('   - GET /api/inventory/ (should return 200)');
        console.log('   - GET /api/staff/ (already working)');
        console.log('   - GET /api/ipd/patients (already working)');
    } else {
        console.log('\n❌ Some fixes failed. Check error messages above.');
    }
}

main().catch(console.error);