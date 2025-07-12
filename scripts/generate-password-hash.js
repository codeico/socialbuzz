const bcrypt = require('bcryptjs');

async function generatePasswordHashes() {
  const passwords = {
    admin123: await bcrypt.hash('admin123', 10),
    creator123: await bcrypt.hash('creator123', 10),
    user123: await bcrypt.hash('user123', 10),
  };

  console.log('Password Hashes:');
  console.log('===============');
  console.log(`admin123: ${passwords.admin123}`);
  console.log(`creator123: ${passwords.creator123}`);
  console.log(`user123: ${passwords.user123}`);

  console.log('\n\nSQL Update Commands:');
  console.log('===================');
  console.log(`UPDATE users SET password_hash = '${passwords.admin123}' WHERE email = 'admin@socialbuzz.com';`);
  console.log(`UPDATE users SET password_hash = '${passwords.creator123}' WHERE email = 'creator@socialbuzz.com';`);
  console.log(`UPDATE users SET password_hash = '${passwords.user123}' WHERE email = 'user@socialbuzz.com';`);
}

generatePasswordHashes().catch(console.error);
