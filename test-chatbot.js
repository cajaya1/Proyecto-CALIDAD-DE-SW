const http = require('http');

const postData = JSON.stringify({
  userId: 1,
  userMessage: 'What is the price of Nike Air Max?'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/chatbot/message',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('Testing chatbot endpoint: POST http://localhost:3000/api/chatbot/message');
console.log('Message:', postData);

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('\n✓ Response received:');
    try {
      const parsed = JSON.parse(data);
      console.log(JSON.stringify(parsed, null, 2));
    } catch (e) {
      console.log(data);
    }
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error(`✗ Problem with request: ${e.message}`);
  console.error('Make sure the backend is running on port 3000');
  process.exit(1);
});

req.on('timeout', () => {
  console.error('✗ Request timeout');
  req.destroy();
  process.exit(1);
});

req.setTimeout(5000);
req.write(postData);
req.end();
