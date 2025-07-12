const bcrypt = require('bcryptjs');

// Test login function
async function testLogin() {
  const testPassword = 'admin123';
  const dbHash = '$2a$10$yvucvMXGZHuch.QnTqQ5fO6q30e7.vsZWY/XHSjfWV0QV64iGte9O';
  
  console.log('Testing login verification...');
  console.log('Password:', testPassword);
  console.log('Hash:', dbHash);
  
  const isValid = await bcrypt.compare(testPassword, dbHash);
  console.log('Password valid:', isValid);
  
  // Test all passwords
  const tests = [
    { password: 'admin123', hash: '$2a$10$yvucvMXGZHuch.QnTqQ5fO6q30e7.vsZWY/XHSjfWV0QV64iGte9O' },
    { password: 'creator123', hash: '$2a$10$mIdx6B8ygfEIligjKHQ0But/pKYnMQvZmwIAfQrgt/BVvtE4FBLl2' },
    { password: 'user123', hash: '$2a$10$THTEU8.ZPCQwnY4lhO5OX.IePEI1g1FENu263SGjNPAA88jF2ad3e' }
  ];
  
  console.log('\nTesting all passwords:');
  for (const test of tests) {
    const result = await bcrypt.compare(test.password, test.hash);
    console.log(`${test.password}: ${result ? '✅ VALID' : '❌ INVALID'}`);
  }
}

testLogin().catch(console.error);