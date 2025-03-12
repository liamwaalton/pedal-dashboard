#!/usr/bin/env node

/**
 * This script checks if the required environment variables for Strava OAuth are set.
 * Run it with: node scripts/check-env.js
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
let envVars = {};

try {
  if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    envVars = envConfig;
    console.log('✅ Found .env.local file');
  } else {
    console.log('❌ No .env.local file found. Please create one based on .env.local.example');
  }
} catch (error) {
  console.error('Error reading .env.local file:', error);
}

// Check required variables
const requiredVars = [
  'STRAVA_CLIENT_ID',
  'STRAVA_CLIENT_SECRET',
  'NEXT_PUBLIC_STRAVA_CLIENT_ID'
];

let allVarsPresent = true;

console.log('\nChecking required environment variables:');
requiredVars.forEach(varName => {
  if (envVars[varName]) {
    console.log(`✅ ${varName} is set`);
  } else {
    console.log(`❌ ${varName} is missing`);
    allVarsPresent = false;
  }
});

// Check if client IDs match
if (envVars['STRAVA_CLIENT_ID'] && envVars['NEXT_PUBLIC_STRAVA_CLIENT_ID']) {
  if (envVars['STRAVA_CLIENT_ID'] === envVars['NEXT_PUBLIC_STRAVA_CLIENT_ID']) {
    console.log('\n✅ STRAVA_CLIENT_ID and NEXT_PUBLIC_STRAVA_CLIENT_ID match');
  } else {
    console.log('\n❌ STRAVA_CLIENT_ID and NEXT_PUBLIC_STRAVA_CLIENT_ID do not match. They should be the same value.');
    allVarsPresent = false;
  }
}

if (allVarsPresent) {
  console.log('\n✅ All required environment variables are set correctly!');
} else {
  console.log('\n❌ Some environment variables are missing or incorrect.');
  console.log('\nPlease update your .env.local file with the correct values:');
  console.log(`
# Strava OAuth Configuration
STRAVA_CLIENT_ID=your_strava_client_id
STRAVA_CLIENT_SECRET=your_strava_client_secret
NEXT_PUBLIC_STRAVA_CLIENT_ID=your_strava_client_id  # Same as STRAVA_CLIENT_ID
`);
}

// Provide instructions for getting Strava API credentials
console.log('\nTo get Strava API credentials:');
console.log('1. Go to https://www.strava.com/settings/api');
console.log('2. Create a new application');
console.log('3. Set the "Authorization Callback Domain" to your domain or "localhost" for development');
console.log('4. Copy the Client ID and Client Secret to your .env.local file'); 