#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔥 Firebase Setup for Yoga Customer App');
console.log('=====================================\n');

console.log('📋 Steps to configure Firebase:');
console.log('1. Go to https://console.firebase.google.com/');
console.log('2. Create a new project or select existing project');
console.log('3. Add a web app to your project');
console.log('4. Copy the Firebase config values\n');

console.log('📝 Required Firebase configuration values:');
console.log('- apiKey');
console.log('- authDomain');
console.log('- projectId');
console.log('- storageBucket');
console.log('- messagingSenderId');
console.log('- appId\n');

console.log('🔧 Configuration options:');
console.log('Option 1: Use environment variables (recommended)');
console.log('  - Copy env.example to .env');
console.log('  - Replace placeholder values with your Firebase config');
console.log('  - Restart your development server\n');

console.log('Option 2: Direct configuration');
console.log('  - Edit config/firebase.ts directly');
console.log('  - Replace placeholder values with your Firebase config\n');

console.log('📚 Next steps after configuration:');
console.log('1. Enable Firestore Database in Firebase Console');
console.log('2. Set up security rules for your collections');
console.log('3. Add sample data to collections: classes, courses, instructors');
console.log('4. Test the app connection\n');

console.log('🚀 Ready to start! Run: npm start');

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.log('\n💡 Tip: Create a .env file with your Firebase credentials for better security');
}
