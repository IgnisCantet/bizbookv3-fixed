import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// © 2026 ТОО «NOVA Comp». Все права защищены.
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'BizBook KZ — © 2026 ТОО «NOVA Comp»',
        short_name: 'BizBook KZ',
        description: 'Умная бухгалтерия для бизнеса РК',
        theme_color: '#060914',
        background_color: '#060914',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      }
    })
  ],
  build: {
    // Минификация и обфускация при сборке
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,      // убираем console.log
        drop_debugger: true,
        passes: 3,
      },
      mangle: {
        toplevel: true,           // переименовываем все переменные
        safari10: true,
      },
      format: {
        comments: false,          // убираем все комментарии
        preamble: '/* © 2026 ТОО «NOVA Comp». Все права защищены. Закон РК «Об авторском праве» №6-I */',
      }
    },
    rollupOptions: {
      output: {
        // Разбивка на чанки — сложнее анализировать
        manualChunks: undefined,
        entryFileNames: 'assets/[hash].js',
        chunkFileNames: 'assets/[hash].js',
        assetFileNames: 'assets/[hash].[ext]',
      }
    },
    // Скрываем исходники
    sourcemap: false,
    chunkSizeWarningLimit: 2000,
  }
})
