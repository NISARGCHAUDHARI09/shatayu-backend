// Update Users Table Schema - Add Missing Columns
import { initDatabase, execute } from './config/d1-rest-client.js';

async function updateUsersTableSchema() {
    console.log('🔧 Updating Users Table Schema...\n');

    try {
        // Initialize database
        await initDatabase();
        console.log('✅ Database initialized\n');

        // Add missing columns one by one
        const alterQueries = [
            'ALTER TABLE users ADD COLUMN first_name TEXT',
            'ALTER TABLE users ADD COLUMN last_name TEXT', 
            'ALTER TABLE users ADD COLUMN phone TEXT',
            'ALTER TABLE users ADD COLUMN department TEXT',
            'ALTER TABLE users ADD COLUMN is_active INTEGER DEFAULT 1',
            'ALTER TABLE users ADD COLUMN deleted_at DATETIME'
        ];

        console.log('📋 Adding missing columns...');
        
        for (const query of alterQueries) {
            try {
                console.log(`Executing: ${query}`);
                await execute(query);
                console.log('✅ Success');
            } catch (error) {
                if (error.message.includes('duplicate column name')) {
                    console.log('⚠️  Column already exists, skipping');
                } else {
                    console.log('❌ Error:', error.message);
                }
            }
        }

        console.log('\n🔄 Updating existing admin user with new columns...');
        
        // Update the admin user to have the new fields
        await execute(
            `UPDATE users SET 
                first_name = 'Admin',
                last_name = 'User', 
                is_active = 1,
                department = 'Administration'
             WHERE id = 1`
        );
        
        console.log('✅ Admin user updated with new fields');

        // Verify the schema update
        console.log('\n🔍 Verifying updated schema...');
        const { query } = await import('./config/d1-rest-client.js');
        const schema = await query('PRAGMA table_info(users)');
        console.log('Updated schema columns:');
        schema.forEach(col => {
            console.log(`  • ${col.name} (${col.type})`);
        });

        console.log('\n🎉 Users table schema updated successfully!');

    } catch (error) {
        console.error('❌ Schema update failed:', error.message);
        console.error('Error details:', error);
    }
}

updateUsersTableSchema();