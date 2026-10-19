const fs = require('fs');
const path = require('path');

// 1. Read the audioMap.ts file
const mapPath = path.join(__dirname, 'app', 'data', 'audioMap.ts');
const mapContent = fs.readFileSync(mapPath, 'utf8');

// 2. Extract all the .wav filenames using a FIXED regular expression
const wavRegex = /:\s*"([^"]+\.wav)"/g;
let match;
const expectedFiles = new Set();

while ((match = wavRegex.exec(mapContent)) !== null) {
  expectedFiles.add(match[1].trim());
}

// 3. Read the actual files in the public/sounds/ directory
const soundsDir = path.join(__dirname, 'public', 'sounds');
let actualFiles = [];

try {
  actualFiles = fs.readdirSync(soundsDir);
} catch (err) {
  console.error("❌ ERROR: Could not find the 'public/sounds' folder! Please make sure it exists.");
  process.exit(1);
}

// 4. Compare the two
let missingFiles = [];
expectedFiles.forEach(file => {
  if (!actualFiles.includes(file)) {
    missingFiles.push(file);
  }
});

// 5. Print the Results
console.log("========================================");
console.log(`🎵 AUDIO AUDIT COMPLETE`);
console.log(`Expected Unique Files in audioMap.ts: ${expectedFiles.size}`);
console.log(`Actual Files in public/sounds: ${actualFiles.length}`);
console.log("========================================");

if (missingFiles.length === 0) {
  console.log("✅ SUCCESS! Every single audio file is present. Your app is 100% offline-ready!");
} else {
  console.log(`❌ WARNING: You are missing ${missingFiles.length} files:\n`);
  missingFiles.forEach((file, index) => {
    console.log(`${index + 1}. ${file}`);
  });
  console.log("\nPlease add these files to 'public/sounds/' or fix the spelling in 'audioMap.ts'.");
}