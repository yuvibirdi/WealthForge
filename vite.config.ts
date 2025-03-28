import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? './' : '/',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: '.',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return 'assets/[name]-[hash][extname]'
          
          // Keep model files in their original location without hashing
          if (assetInfo.name.endsWith('.glb') || assetInfo.name.endsWith('.gltf')) {
            const parts = assetInfo.name.split('/')
            const filename = parts[parts.length - 1]
            return `models/${filename}`
          }
          
          return 'assets/[name]-[hash][extname]'
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js'
      }
    },
    // Ensure static assets are copied
    copyPublicDir: true,
    // Ensure WebGL works
    target: 'esnext',
    minify: 'esbuild'
  },
  assetsInclude: ['**/*.glb', '**/*.gltf'],
  // allow all hosts
  server: {
    port: 5175,
    strictPort: false,
    host: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  },
  optimizeDeps: {
    exclude: ['@react-three/fiber', '@react-three/drei']
  }
})
