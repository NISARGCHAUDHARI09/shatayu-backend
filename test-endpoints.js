// Simple test script to check if backend is responding
import fetch from 'node-fetch';

async function testEndpoints() {
    const baseUrl = 'http://localhost:5002';
    
    try {
        console.log('🧪 Testing backend endpoints...');
        
        // Test basic health endpoint
        const healthResponse = await fetch(`${baseUrl}/health`);
        console.log('Health endpoint status:', healthResponse.status);
        
        // Test IPD patients endpoint
        const ipdResponse = await fetch(`${baseUrl}/api/ipd/patients`);
        console.log('IPD patients endpoint status:', ipdResponse.status);
        
        if (ipdResponse.ok) {
            const ipdData = await ipdResponse.json();
            console.log('IPD patients data:', ipdData);
        }
        
        // Test OPD patients endpoint
        const opdResponse = await fetch(`${baseUrl}/api/opd/`);
        console.log('OPD patients endpoint status:', opdResponse.status);
        
        if (opdResponse.ok) {
            const opdData = await opdResponse.json();
            console.log('OPD patients data:', opdData);
        }
        
        // Test inventory endpoint
        const inventoryResponse = await fetch(`${baseUrl}/api/inventory/`);
        console.log('Inventory endpoint status:', inventoryResponse.status);
        
        if (inventoryResponse.ok) {
            const inventoryData = await inventoryResponse.json();
            console.log('Inventory data:', inventoryData);
        }
        
    } catch (error) {
        console.error('❌ Error testing endpoints:', error.message);
    }
}

testEndpoints();