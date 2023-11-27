import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue' 

// https://vitejs.dev/config/
export default defineConfig({
  base: "/woof-wallet/",
  plugins: [
    vue() 
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)) 
    }
  }, 
  optimizeDeps: {
    exclude: [ 
      'osmojs',
      '@cosmology/core', 
      
    ],
    include: [ 
      '@cosmjs/math',
      '@cosmjs/amino',
      '@cosmjs/encoding', 
      'retry'
     
    ]
  }, 
})
