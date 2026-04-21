import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { resolve } from 'path'

import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'

  return {
    plugins: [
      react(),
      viteStaticCopy({
        targets: [
          {
            src: 'isimip_data/core/assets/images/**/*',
            dest: 'images',
            rename: { stripBase: 4 }
          }
        ]
      })
    ],
    base: '/static/',
    resolve: {
      alias: {
        'isimip_data': resolve(__dirname, 'isimip_data'),
      },
    },
    build: {
      outDir: 'static',
      emptyOutDir: true,
      manifest: true,
      rollupOptions: {
        input: {
          'base': resolve(__dirname, 'isimip_data/core/assets/js/base.js'),
          'bootstrap': resolve(__dirname, 'isimip_data/core/assets/js/bootstrap.js'),
          'caveats': resolve(__dirname, 'isimip_data/caveats/assets/js/caveats.jsx'),
          'download': resolve(__dirname, 'isimip_data/download/assets/js/download.jsx'),
          'metadata': resolve(__dirname, 'isimip_data/metadata/assets/js/metadata.jsx'),
          'resources': resolve(__dirname, 'isimip_data/metadata/assets/js/resources.jsx'),
          'search': resolve(__dirname, 'isimip_data/search/assets/js/search.jsx'),
        },
          output: {
            entryFileNames: isDev ? 'js/[name].js' : 'js/[name]-[hash].js',
            chunkFileNames: isDev ? 'chunks/[name].js' : 'chunks/[name]-[hash].js',
            assetFileNames: isDev ? 'assets/[name][extname]' : 'assets/[name]-[hash][extname]',
          },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          quietDeps: true,
          silenceDeprecations: ['import', 'legacy-js-api', 'global-builtin', 'color-functions'],
        },
      },
    },
  }
})
