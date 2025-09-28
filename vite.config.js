// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  // Base public path when served in production
  base: './',
  
  // Build configuration
  build: {
    // Directory for built files
    outDir: 'dist',
    
    // Assets directory inside dist
    assetsDir: 'assets',
    
    // Include GLB files as assets
    assetsInclude: ['**/*.glb', '**/*.gltf'],
  },
  
  // Server configuration for dev
  server: {
    port: 3000,
  }
})