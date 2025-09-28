// vite.config.js
import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

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

    // Ensure both index.html and viewer.html are emitted
    rollupOptions: {
      input: {
        main: resolve(rootDir, 'index.html'),
        viewer: resolve(rootDir, 'viewer.html'),
      },
    },
  },
  
  // Server configuration for dev
  server: {
    port: 3000,
  }
})