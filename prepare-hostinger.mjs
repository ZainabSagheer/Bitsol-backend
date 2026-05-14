import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function prepareHostingerDeploy() {
  console.log('📦 Preparing CRM Backend App for Hostinger Deployment...');

  const standaloneDir = path.join(__dirname, '.next', 'standalone');
  const staticDir = path.join(__dirname, '.next', 'static');
  const publicDir = path.join(__dirname, 'public');

  const destStaticDir = path.join(standaloneDir, '.next', 'static');
  const destPublicDir = path.join(standaloneDir, 'public');

  // Check if standalone build exists
  if (!fs.existsSync(standaloneDir)) {
    console.error('❌ Error: .next/standalone directory not found.');
    console.log('💡 Please run "npm run build" first with output: "standalone" in next.config.ts.');
    process.exit(1);
  }

  // 1. Copy .next/static to .next/standalone/.next/static
  console.log('➡️ Copying .next/static...');
  if (fs.existsSync(staticDir)) {
    fs.cpSync(staticDir, destStaticDir, { recursive: true });
  } else {
    console.warn('⚠️ Warning: .next/static directory not found.');
  }

  // 2. Copy public to .next/standalone/public
  console.log('➡️ Copying public folder...');
  if (fs.existsSync(publicDir)) {
    fs.cpSync(publicDir, destPublicDir, { recursive: true });
  } else {
    console.warn('⚠️ Warning: public directory not found.');
  }

  // 3. Remove build scripts from standalone package.json to prevent Hostinger auto-build errors
  console.log('➡️ Removing build scripts from standalone package.json...');
  const standalonePkgPath = path.join(standaloneDir, 'package.json');
  if (fs.existsSync(standalonePkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(standalonePkgPath, 'utf8'));
    if (pkg.scripts) {
      pkg.scripts.build = 'echo "Already built"';
      pkg.scripts.dev = 'echo "Cannot run dev in standalone"';
      fs.writeFileSync(standalonePkgPath, JSON.stringify(pkg, null, 2));
    }
  }

  // 4. Create a zip file of the standalone directory
  console.log('🤐 Creating hostinger-crm-app.zip...');
  
  try {
    const zipPath = path.join(__dirname, 'hostinger-crm-app.zip');
    
    // Remove old zip if exists
    if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
    
    // Create zip using built-in tar on Windows
    execSync(`tar -a -c -f "${zipPath}" *`, { cwd: standaloneDir, stdio: 'inherit' });
    
    console.log(`✅ Deployment package created successfully: hostinger-crm-app.zip`);
    console.log('\n🚀 Next Steps for Hostinger:');
    console.log('1. Go to your Hostinger hPanel -> Advanced -> Node.js.');
    console.log('2. Create a new Node.js App for admin.bitsolmarketing.com.');
    console.log('3. Upload hostinger-crm-app.zip using File Manager and extract it.');
    console.log('4. Ensure "Application startup file" is set to "server.js".');
    console.log('5. Set the required Environment Variables in the Node.js App settings.');
    console.log('6. Start the Node.js App from hPanel.');
  } catch (err) {
    console.error('❌ Failed to create zip file:', err);
  }
}

prepareHostingerDeploy().catch(console.error);
