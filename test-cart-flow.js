const http = require('http');

// Primero necesitamos un token de usuario válido
// Vamos a crear un usuario de prueba y hacer login

const registerData = JSON.stringify({
  username: 'testuser',
  email: 'test@example.com',
  password: 'test123'
});

const loginData = JSON.stringify({
  username: 'testuser',
  password: 'test123'
});

function makeRequest(path, method, data, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data ? Buffer.byteLength(data) : 0
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (data) {
      req.write(data);
    }
    req.end();
  });
}

async function testCartFlow() {
  try {
    console.log('=== Testing Cart Flow ===\n');

    // 1. Register (or it may fail if user exists, that's ok)
    console.log('1. Registering user...');
    const registerResult = await makeRequest('/api/auth/register', 'POST', registerData);
    console.log('Register status:', registerResult.status);
    console.log('Register response:', registerResult.data);

    // 2. Login
    console.log('\n2. Logging in...');
    const loginResult = await makeRequest('/api/auth/login', 'POST', loginData);
    console.log('Login status:', loginResult.status);
    console.log('Login response:', loginResult.data);

    if (!loginResult.data.token) {
      console.error('❌ No token received!');
      return;
    }

    const token = loginResult.data.token;
    console.log('✓ Token obtained:', token.substring(0, 20) + '...');

    // 3. Add to cart
    console.log('\n3. Adding product to cart...');
    const addCartData = JSON.stringify({
      productId: 1,  // Nike Air Max from seed data
      quantity: 2
    });
    const cartResult = await makeRequest('/api/cart/add', 'POST', addCartData, token);
    console.log('Add to cart status:', cartResult.status);
    console.log('Add to cart response:', cartResult.data);

    // 4. Get cart
    console.log('\n4. Getting cart contents...');
    const getCartResult = await makeRequest('/api/cart', 'GET', null, token);
    console.log('Get cart status:', getCartResult.status);
    console.log('Get cart response:', JSON.stringify(getCartResult.data, null, 2));

    console.log('\n✅ Cart test completed!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testCartFlow();
