// Debug login script to test the actual login API
async function testLoginAPI() {
  const baseURL = 'http://localhost:3000';
  
  const credentials = [
    { email: 'admin@socialbuzz.com', password: 'admin123' },
    { email: 'creator@socialbuzz.com', password: 'creator123' },
    { email: 'user@socialbuzz.com', password: 'user123' }
  ];
  
  console.log('Testing login API...\n');
  
  for (const cred of credentials) {
    try {
      console.log(`Testing: ${cred.email}`);
      
      const response = await fetch(`${baseURL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cred),
      });
      
      const data = await response.json();
      
      console.log(`Status: ${response.status}`);
      console.log(`Response:`, data);
      console.log('---\n');
      
    } catch (error) {
      console.error(`Error testing ${cred.email}:`, error.message);
      console.log('---\n');
    }
  }
}

// Only run if server is running
if (process.env.NODE_ENV !== 'test') {
  testLoginAPI().catch(console.error);
} else {
  console.log('Please start the development server first: npm run dev');
}