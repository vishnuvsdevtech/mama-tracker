import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `npm run build`          -> GitHub Pages build, served from /mama-tracker/
// `npm run build:preview`  -> one self-contained HTML file (used for the Claude preview)
export default defineConfig(({ mode }) => ({
  base: mode === 'preview' ? './' : '/mama-tracker/',
  plugins: mode === 'preview' ? [react(), viteSingleFile()] : [react()],
  build: { outDir: mode === 'preview' ? 'dist-preview' : 'dist' },
}))
