const fs = require('fs');
const path = require('path');

// Create public and avatars directories if they don't exist
const publicDir = path.join(__dirname, '../public');
const avatarsDir = path.join(publicDir, 'avatars');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
  console.log('Created public directory');
}

if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir);
  console.log('Created avatars directory');
}

// Create a default avatar.jpg if it doesn't exist
const defaultAvatarPath = path.join(avatarsDir, 'avatar.jpg');
if (!fs.existsSync(defaultAvatarPath)) {
  // Copy a default avatar from somewhere or create a blank one
  console.log('Default avatar.jpg needs to be added to:', defaultAvatarPath);
}

console.log('Directory structure checked and ready');
