const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const htmlPath = path.join(__dirname, 'presentation.html');
const rootPdfPath = path.join(rootDir, 'DigitalSignature_Defense_Presentation.pdf');
const publicDir = path.join(rootDir, 'public');
const publicPdfPath = path.join(publicDir, 'DigitalSignature_Defense_Presentation.pdf');
const brainPdfPath = 'C:\\Users\\JOHNSON\\.gemini\\antigravity-ide\\brain\\d4a5efbc-e19d-4c9a-84e5-e56c7be94ab0\\DigitalSignature_Defense_Presentation.pdf';

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log('Target HTML:', htmlPath);
console.log('Target PDF:', rootPdfPath);

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const htmlFileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');

const chromeArgs = [
  '--headless=new',
  '--disable-gpu',
  '--no-pdf-header-footer',
  `--print-to-pdf=${rootPdfPath}`,
  htmlFileUrl
];

console.log('Spawning Chrome with args:', chromeArgs);
const result = spawnSync(chromePath, chromeArgs, { stdio: 'inherit' });

if (result.error) {
  console.error('Chrome spawn error:', result.error);
  process.exit(1);
}

if (fs.existsSync(rootPdfPath)) {
  const stats = fs.statSync(rootPdfPath);
  console.log(`Successfully created root PDF: ${rootPdfPath} (${stats.size} bytes)`);

  // Copy to public directory
  fs.copyFileSync(rootPdfPath, publicPdfPath);
  console.log(`Copied to public web directory: ${publicPdfPath}`);

  // Copy to Antigravity brain artifacts directory
  try {
    const brainDir = path.dirname(brainPdfPath);
    if (!fs.existsSync(brainDir)) fs.mkdirSync(brainDir, { recursive: true });
    fs.copyFileSync(rootPdfPath, brainPdfPath);
    console.log(`Copied to brain artifacts folder: ${brainPdfPath}`);
  } catch (e) {
    console.warn('Could not copy to brain folder:', e.message);
  }

  // Check page count
  const pdfRaw = fs.readFileSync(rootPdfPath, 'binary');
  const matches = pdfRaw.match(/\/Type\s*\/Page\b/g);
  console.log('Total PDF Page Count:', matches ? matches.length : 'Unknown');
} else {
  console.error('ERROR: Root PDF was not generated!');
  process.exit(1);
}
