import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

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
        'isimip_data': resolve('isimip_data'),
      },
    },
    build: {
      outDir: 'static',
      emptyOutDir: true,
      manifest: true,
      sourcemap: isDev,
      rollupOptions: {
        input: {
          'base': resolve('isimip_data/core/assets/js/base.js'),
          'bootstrap': resolve('isimip_data/core/assets/js/bootstrap.js'),
          'caveats': resolve('isimip_data/caveats/assets/js/caveats.jsx'),
          'download': resolve('isimip_data/download/assets/js/download.jsx'),
          'metadata': resolve('isimip_data/metadata/assets/js/metadata.jsx'),
          'resources': resolve('isimip_data/metadata/assets/js/resources.jsx'),
          'search': resolve('isimip_data/search/assets/js/search.jsx'),
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
