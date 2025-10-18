// Test just the IPD statistics endpoint
import http from 'http';

function testIPDStatistics() {
    return new Promise((resolve, reject) => {
        const req = http.request({
            hostname: 'localhost',
            port: 5002,
            path: '/api/ipd/statistics',
            method: 'GET'
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                console.log(`🏥 IPD Statistics - Status: ${res.statusCode}`);
                if (res.statusCode === 200) {
                    try {
                        const parsed = JSON.parse(data);
                        console.log('✅ Success Response:', JSON.stringify(parsed, null, 2));
                    } catch (e) {
                        console.log('✅ Success (text):', data.substring(0, 200));
                    }
                } else {
                    console.log('❌ Error Response:', data);
                }
                resolve();
            });
        });
        
        req.on('error', (err) => {
            console.log('❌ Connection error:', err.message);
            resolve();
        });
        
        req.setTimeout(5000, () => {
            console.log('⏰ Request timeout');
            req.destroy();
            resolve();
        });
        
        req.end();
    });
}

testIPDStatistics();