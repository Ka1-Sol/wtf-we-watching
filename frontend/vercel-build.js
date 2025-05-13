// Script per gestire la build su Vercel
console.log('Starting Vercel build process...');

// Esegue il processo di build
import { execSync } from 'child_process';

try {
  // Esegue la build
  console.log('Running TypeScript compiler...');
  execSync('npx tsc -b', { stdio: 'inherit' });
  
  console.log('Creating an empty .npmrc to avoid native dependencies issues...');
  execSync('echo "optional=false\nomit=optional" > .npmrc', { stdio: 'inherit' });
  
  console.log('Installing vite-node for direct execution...');
  execSync('npm install --no-save vite-node', { stdio: 'inherit' });
  
  console.log('Running Vite build with workaround...');
  
  // Workaround per il bug di Rollup
  const buildCode = `
    import { build } from 'vite';
    process.env.ROLLUP_SKIP_LOAD_NATIVE_PLUGIN = "1";
    
    async function runBuild() {
      try {
        await build({ 
          mode: 'production',
          logLevel: 'info',
          configFile: './vite.config.ts'
        });
        console.log('Build completed successfully!');
      } catch (error) {
        console.error('Build error:', error);
        process.exit(1);
      }
    }
    
    runBuild();
  `;
  
  // Scrive il codice in un file temporaneo
  execSync(`echo '${buildCode}' > temp-build.js`, { stdio: 'inherit' });
  
  // Esegue il build utilizzando vite-node
  execSync('npx vite-node temp-build.js', { 
    stdio: 'inherit',
    env: { ...process.env, ROLLUP_SKIP_LOAD_NATIVE_PLUGIN: "1" } 
  });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
} 