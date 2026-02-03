// SHA-256 API Debug Script
// Run this with: node debug-sha256.js

const crypto = require('crypto');

// CONFIGURATION - Replace with your actual values
const CONFIG = {
  AA_ORIGIN: process.env.AA_ORIGIN || 'https://api.audienceacuity.com',
  AA_KEY_ID: process.env.AA_KEY_ID || 'iOOWCZUYbkPHlDym',
  AA_SECRET: process.env.AA_SECRET || 'l8G279Pd8z8Y7cjwohpFuWnypq1bhOgl',
  
  // TEST CASE: The email/hash you confirmed works in playground
  TEST_EMAIL: 'jlhoffner@yahoo.com', // Replace with actual test email
  TEST_HASH: 'ddd212c954c166540a832c08fe9b88d4686b6f59ea58a790cd0866415652f12c', // Replace with the hash that worked in playground
};

// Authentication helper (copied from your app)
function createAuthHeader() {
  const timestamp = Date.now().toString();
  const toHash = timestamp + CONFIG.AA_SECRET;
  const hash = crypto.createHash('md5').update(toHash).digest('hex');
  const authHeader = `${CONFIG.AA_KEY_ID}${timestamp}${hash}`;
  
  console.log('🔐 Auth Debug:');
  console.log('  Key ID:', CONFIG.AA_KEY_ID);
  console.log('  Timestamp:', timestamp);
  console.log('  Secret Length:', CONFIG.AA_SECRET?.length);
  console.log('  MD5 Hash:', hash.slice(0, 8) + '...');
  console.log('  Full Auth Header:', authHeader.slice(0, 30) + '...\n');
  
  return authHeader;
}

// Generate SHA-256 hash from email (copied from your app)
function generateSHA256(email) {
  return crypto
    .createHash('sha256')
    .update(email.toLowerCase().trim())
    .digest('hex');
}

// Test 1: Verify our hash generation matches what you got
async function test1_HashGeneration() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 1: Hash Generation Verification');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  const generatedHash = generateSHA256(CONFIG.TEST_EMAIL);
  
  console.log('Input Email:', CONFIG.TEST_EMAIL);
  console.log('Generated Hash:', generatedHash);
  console.log('Expected Hash:', CONFIG.TEST_HASH);
  console.log('Match:', generatedHash === CONFIG.TEST_HASH ? '✅ YES' : '❌ NO');
  
  if (generatedHash !== CONFIG.TEST_HASH) {
    console.log('\n⚠️  WARNING: Hash mismatch detected!');
    console.log('   This suggests a problem with how we generate hashes.');
    console.log('   Check for: extra whitespace, capitalization, encoding issues\n');
  }
  
  return generatedHash;
}

// Test 2: Make actual API call with known-good hash
async function test2_APICallWithKnownHash() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 2: API Call with Known-Good Hash');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  const url = `${CONFIG.AA_ORIGIN}/v2/identities/bySha256?sha256=${CONFIG.TEST_HASH}`;
  
  console.log('🌐 Request Details:');
  console.log('  URL:', url);
  console.log('  Method: GET');
  console.log('  Headers: Authorization, Content-Type\n');
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': createAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📥 Response:');
    console.log('  Status:', response.status, response.statusText);
    console.log('  Headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('  ✅ SUCCESS - Found', data.identities?.length || 0, 'identities');
      console.log('\n  Identity Data Preview:');
      console.log(JSON.stringify(data, null, 2).slice(0, 500) + '...\n');
      return { success: true, data };
    } else {
      console.log('  ❌ FAILED');
      console.log('  Error Response:', JSON.stringify(data, null, 2));
      return { success: false, error: data };
    }
    
  } catch (error) {
    console.log('  ❌ REQUEST FAILED');
    console.log('  Error:', error.message);
    return { success: false, error: error.message };
  }
}

// Test 3: Make API call with our generated hash
async function test3_APICallWithGeneratedHash(generatedHash) {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 3: API Call with App-Generated Hash');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  const url = `${CONFIG.AA_ORIGIN}/v2/identities/bySha256?sha256=${generatedHash}`;
  
  console.log('🌐 Request Details:');
  console.log('  URL:', url);
  console.log('  Using hash generated from:', CONFIG.TEST_EMAIL);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': createAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    
    console.log('\n📥 Response:');
    console.log('  Status:', response.status, response.statusText);
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('  ✅ SUCCESS - Found', data.identities?.length || 0, 'identities');
      return { success: true, data };
    } else {
      console.log('  ❌ FAILED');
      console.log('  Error Response:', JSON.stringify(data, null, 2));
      return { success: false, error: data };
    }
    
  } catch (error) {
    console.log('  ❌ REQUEST FAILED');
    console.log('  Error:', error.message);
    return { success: false, error: error.message };
  }
}

// Test 4: Compare with CSV hash from client
async function test4_ClientHashTest(clientHash) {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 4: Client-Provided Hash Test');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  const url = `${CONFIG.AA_ORIGIN}/v2/identities/bySha256?sha256=${clientHash}`;
  
  console.log('Testing hash from client CSV:', clientHash);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': createAuthHeader(),
        'Content-Type': 'application/json'
      }
    });
    
    console.log('\n📥 Response:');
    console.log('  Status:', response.status, response.statusText);
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('  ✅ SUCCESS - Found', data.identities?.length || 0, 'identities');
      return { success: true, data };
    } else {
      console.log('  ❌ FAILED');
      console.log('  Error Response:', JSON.stringify(data, null, 2));
      return { success: false, error: data };
    }
    
  } catch (error) {
    console.log('  ❌ REQUEST FAILED');
    console.log('  Error:', error.message);
    return { success: false, error: error.message };
  }
}

// Run all tests
async function runDiagnostics() {
  console.log('🔬 BrandIntel™ SHA-256 API Diagnostics\n');
  
  // Test 1: Hash generation
  const generatedHash = await test1_HashGeneration();
  
  // Test 2: Known-good hash from playground
  const test2Result = await test2_APICallWithKnownHash();
  
  // Test 3: Our generated hash
  const test3Result = await test3_APICallWithGeneratedHash(generatedHash);
  
  // Test 4: Optional - test a hash from client CSV
  // Uncomment and add hash from client file:
  const clientHash = '6f23c1fbf631025f3116e645fe8dd6b14f18353960c5799438b698184044d727';
  const test4Result = await test4_ClientHashTest(clientHash);
  
  // Summary
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('DIAGNOSTIC SUMMARY');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log('Test 1 (Hash Generation):', generatedHash === CONFIG.TEST_HASH ? '✅ PASS' : '❌ FAIL');
  console.log('Test 2 (Known-Good Hash):', test2Result.success ? '✅ PASS' : '❌ FAIL');
  console.log('Test 3 (Generated Hash):', test3Result.success ? '✅ PASS' : '❌ FAIL');
  console.log('Test 4 (Client Hash):', test4Result?.success ? '✅ PASS' : '❌ FAIL');
  
  console.log('\n📋 RECOMMENDATIONS:\n');
  
  if (!test2Result.success) {
    console.log('❌ Test 2 failed: API authentication or endpoint issue');
    console.log('   Action: Contact API provider - your credentials may be invalid\n');
  }
  
  if (test2Result.success && !test3Result.success) {
    console.log('❌ Test 3 failed but Test 2 passed: Hash generation mismatch');
    console.log('   Action: Check for differences in hash generation between playground and app');
    console.log('   - Verify email is lowercase');
    console.log('   - Check for extra whitespace or newlines');
    console.log('   - Ensure SHA-256 encoding matches playground\n');
  }
  
  if (test2Result.success && test3Result.success) {
    console.log('✅ Both tests passed: App API calls work correctly');
    console.log('   Action: Problem likely with client-provided hashes');
    console.log('   - Ask client how they generated hashes');
    console.log('   - Verify they used lowercase + SHA-256');
    console.log('   - Test a sample hash from their CSV (uncomment Test 4)\n');
  }
}

// Execute
runDiagnostics().catch(console.error);