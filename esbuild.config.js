// esbuild.config.js
import esbuild from 'esbuild';

esbuild.build({
  entryPoints: ['index.ts'], // Entry point of your application
  bundle: true, // Bundle all dependencies
  outfile: './dist/bundle.cjs', // Output file
  platform: 'node', // Target platform (node for server-side, browser for client-side)
  minify: true, // Minify the output
  sourcemap: false, // Generate source maps
  format: 'cjs', // Output format (cjs for Node.js)
}).catch(() => process.exit(1));