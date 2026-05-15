// Simple test using Node.js built-in http module
import http from 'http';

function testEndpoint(path) {
    return new Promise((resolve, reject) => {
        const req = http.request({
            hostname: 'localhost',
            port: 5002,
            path: path,
            method: 'GET'
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                console.log(`✅ ${path} - Status: ${res.statusCode}`);
                if (res.statusCode === 200) {
                    try {
                        const parsed = JSON.parse(data);
                        console.log(`📊 Response:`, parsed);
                    } catch (e) {
                        console.log(`📄 Response (text):`, data.substring(0, 100));
                    }
                } else {
                    console.log(`❌ Error response:`, data);
                }
                resolve();
            });
        });
        
        req.on('error', (err) => {
            console.log(`❌ ${path} - Connection error:`, err.message);
            resolve();
        });
        
        req.setTimeout(5000, () => {
            console.log(`⏰ ${path} - Request timeout`);
            req.destroy();
            resolve();
        });
        
        req.end();
    });
}

async function runTests() {
    console.log('🧪 Testing Hospital Management System Backend...\n');
    
    const endpoints = [
        '/health',
        '/api/ipd/patients',
        '/api/opd/',
        '/api/inventory/',
        '/api/staff/',
        '/api/ipd/statistics',
        '/api/opd/statistics',
        '/api/inventory/statistics'
    ];
    
    for (const endpoint of endpoints) {
        await testEndpoint(endpoint);
        console.log(''); // Empty line for readability
    }
    
    console.log('🏁 Testing complete!');
}

runTests().catch(console.error);