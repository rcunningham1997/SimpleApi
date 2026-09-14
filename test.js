const { spawn } = require('child_process');
const http = require('http');

function request(path, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path,
      method: 'GET',
      headers
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body: JSON.parse(body) }));
    });
    req.on('error', reject);
    req.end();
  });
}

async function runTests() {
  const server = spawn('node', ['main.js'], { env: { ...process.env, PORT: 3000, API_KEY: 'test-key' } });

  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    console.log('Testing unauthenticated request...');
    const res1 = await request('/api/hello');
    if (res1.statusCode !== 401) throw new Error(`Expected 401, got ${res1.statusCode}`);

    console.log('Testing request with invalid key...');
    const res2 = await request('/api/hello', { 'x-api-key': 'wrong-key' });
    if (res2.statusCode !== 401) throw new Error(`Expected 401, got ${res2.statusCode}`);

    console.log('Testing request with valid x-api-key...');
    const res3 = await request('/api/hello', { 'x-api-key': 'test-key' });
    if (res3.statusCode !== 200 || !res3.body.ok) throw new Error(`Expected 200 OK, got ${res3.statusCode}`);

    console.log('Testing request with valid Bearer token...');
    const res4 = await request('/api/hello', { 'authorization': 'Bearer test-key' });
    if (res4.statusCode !== 200 || !res4.body.ok) throw new Error(`Expected 200 OK, got ${res4.statusCode}`);

    console.log('All tests passed!');
  } finally {
    server.kill();
  }
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
