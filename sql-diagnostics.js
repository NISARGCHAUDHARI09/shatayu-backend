// OPD and Inventory SQL Diagnostics
// Test existing table schemas and identify SQL compatibility issues

import { execute, queryOne, query } from './config/d1-rest-client.js';

async function testOPDTable() {
    console.log('🏥 Testing OPD Records Table...');
    
    try {
        // Check if opd_records table exists
        const tableExists = await queryOne("SELECT name FROM sqlite_master WHERE type='table' AND name='opd_records'");
        console.log('OPD table exists:', tableExists ? '✅ YES' : '❌ NO');
        
        if (tableExists) {
            // Get table schema
            console.log('📋 Getting OPD table schema...');
            const schema = await query("PRAGMA table_info(opd_records)");
            console.log('OPD table columns:');
            schema.forEach(col => {
                console.log(`  - ${col.name} (${col.type}) ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`);
            });
            
            // Test basic queries that controllers use
            console.log('\n🧪 Testing OPD controller queries...');
            
            // Test 1: Count query (used in getAllPatients)
            try {
                const count = await queryOne('SELECT COUNT(*) as total FROM opd_records');
                console.log('✅ Count query works:', count);
            } catch (error) {
                console.log('❌ Count query failed:', error.message);
            }
            
            // Test 2: Basic select (used in getAllPatients)
            try {
                const records = await query('SELECT * FROM opd_records ORDER BY visit_date DESC, created_at DESC LIMIT 5');
                console.log('✅ Basic select works, found:', records.length, 'records');
            } catch (error) {
                console.log('❌ Basic select failed:', error.message);
            }
            
            // Test 3: Statistics queries
            try {
                const todayCount = await queryOne('SELECT COUNT(*) as today FROM opd_records WHERE DATE(visit_date) = DATE("now")');
                console.log('✅ Today count query works:', todayCount);
            } catch (error) {
                console.log('❌ Today count query failed:', error.message);
            }
            
            // Test 4: Month query with strftime
            try {
                const monthCount = await queryOne('SELECT COUNT(*) as month FROM opd_records WHERE strftime("%Y-%m", visit_date) = strftime("%Y-%m", "now")');
                console.log('✅ Month count query works:', monthCount);
            } catch (error) {
                console.log('❌ Month count query failed:', error.message);
            }
            
        } else {
            console.log('❌ OPD table does not exist - need to create it');
        }
        
    } catch (error) {
        console.error('❌ OPD table test failed:', error.message);
    }
}

async function testInventoryTable() {
    console.log('\n📦 Testing Inventory Table...');
    
    try {
        // Check if inventory table exists
        const tableExists = await queryOne("SELECT name FROM sqlite_master WHERE type='table' AND name='inventory'");
        console.log('Inventory table exists:', tableExists ? '✅ YES' : '❌ NO');
        
        if (tableExists) {
            // Get table schema
            console.log('📋 Getting Inventory table schema...');
            const schema = await query("PRAGMA table_info(inventory)");
            console.log('Inventory table columns:');
            schema.forEach(col => {
                console.log(`  - ${col.name} (${col.type}) ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`);
            });
            
            // Test basic queries that controllers use
            console.log('\n🧪 Testing Inventory controller queries...');
            
            // Test 1: Count query (used in getAllItems)
            try {
                const count = await queryOne('SELECT COUNT(*) as count FROM inventory');
                console.log('✅ Count query works:', count);
            } catch (error) {
                console.log('❌ Count query failed:', error.message);
            }
            
            // Test 2: Basic select (used in getAllItems)
            try {
                const records = await query('SELECT * FROM inventory ORDER BY name ASC LIMIT 5');
                console.log('✅ Basic select works, found:', records.length, 'records');
            } catch (error) {
                console.log('❌ Basic select failed:', error.message);
            }
            
            // Test 3: Statistics queries
            try {
                const totalValue = await queryOne('SELECT SUM(total_value) as total FROM inventory');
                console.log('✅ Total value query works:', totalValue);
            } catch (error) {
                console.log('❌ Total value query failed:', error.message);
            }
            
            // Test 4: Low stock query
            try {
                const lowStock = await query('SELECT * FROM inventory WHERE current_stock <= min_stock ORDER BY current_stock ASC');
                console.log('✅ Low stock query works, found:', lowStock.length, 'items');
            } catch (error) {
                console.log('❌ Low stock query failed:', error.message);
            }
            
            // Test 5: Category grouping
            try {
                const categories = await query('SELECT category, COUNT(*) as count, SUM(total_value) as value FROM inventory GROUP BY category');
                console.log('✅ Category grouping works, found:', categories.length, 'categories');
            } catch (error) {
                console.log('❌ Category grouping failed:', error.message);
            }
            
        } else {
            console.log('❌ Inventory table does not exist - need to create it');
        }
        
    } catch (error) {
        console.error('❌ Inventory table test failed:', error.message);
    }
}

async function testPrescriptionsTable() {
    console.log('\n💊 Testing Prescriptions Table...');
    
    try {
        // Check if prescriptions table exists
        const tableExists = await queryOne("SELECT name FROM sqlite_master WHERE type='table' AND name='prescriptions'");
        console.log('Prescriptions table exists:', tableExists ? '✅ YES' : '❌ NO');
        
        if (tableExists) {
            // Get table schema
            console.log('📋 Getting Prescriptions table schema...');
            const schema = await query("PRAGMA table_info(prescriptions)");
            console.log('Prescriptions table columns:');
            schema.forEach(col => {
                console.log(`  - ${col.name} (${col.type}) ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`);
            });
            
            // Test basic queries
            console.log('\n🧪 Testing Prescriptions controller queries...');
            
            try {
                const count = await queryOne('SELECT COUNT(*) as count FROM prescriptions');
                console.log('✅ Count query works:', count);
            } catch (error) {
                console.log('❌ Count query failed:', error.message);
            }
            
        } else {
            console.log('❌ Prescriptions table does not exist - need to create it');
        }
        
    } catch (error) {
        console.error('❌ Prescriptions table test failed:', error.message);
    }
}

// Main execution
async function runDiagnostics() {
    console.log('🔍 RUNNING SQL DIAGNOSTICS FOR OPD & INVENTORY CONTROLLERS');
    console.log('=' .repeat(70));
    
    await testOPDTable();
    await testInventoryTable();
    await testPrescriptionsTable();
    
    console.log('\n' + '=' .repeat(70));
    console.log('✅ Diagnostics completed! Check results above for issues.');
}

runDiagnostics().catch(console.error);