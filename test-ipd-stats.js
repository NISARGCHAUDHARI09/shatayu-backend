// Quick fix for IPD statistics query
import { queryOne } from './config/d1-rest-client.js';

async function testIPDStats() {
    console.log('🏥 Testing IPD Statistics queries...');
    
    try {
        // Test each query individually
        console.log('1. Testing total patients...');
        const total = await queryOne('SELECT COUNT(*) as count FROM ipd_records');
        console.log('✅ Total patients:', total);
        
        console.log('2. Testing admitted patients...');
        const admitted = await queryOne('SELECT COUNT(*) as count FROM ipd_records WHERE status = "admitted"');
        console.log('✅ Admitted patients:', admitted);
        
        console.log('3. Testing discharged patients...');
        const discharged = await queryOne('SELECT COUNT(*) as count FROM ipd_records WHERE status = "discharged"');
        console.log('✅ Discharged patients:', discharged);
        
        console.log('4. Testing revenue query...');
        // Check if daily_charges column exists
        const schema = await queryOne("SELECT sql FROM sqlite_master WHERE type='table' AND name='ipd_records'");
        console.log('IPD table schema includes daily_charges?', schema.sql.includes('daily_charges'));
        
        if (schema.sql.includes('daily_charges')) {
            const revenue = await queryOne('SELECT SUM(daily_charges) as total FROM ipd_records WHERE status = "discharged"');
            console.log('✅ Revenue query works:', revenue);
        } else {
            console.log('❌ daily_charges column missing, will skip revenue calculation');
        }
        
        console.log('5. Testing room query...');
        const rooms = await queryOne('SELECT DISTINCT room FROM ipd_records WHERE status = "admitted"');
        console.log('✅ Room query works');
        
    } catch (error) {
        console.error('❌ IPD stats test error:', error.message);
    }
}

testIPDStats();