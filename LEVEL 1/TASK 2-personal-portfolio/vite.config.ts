import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages project-site config.
//
// This repo is deployed at https://ArjithSiva.github.io/portfolio/, i.e. as a
// PROJECT page (not a user/root page at ArjithSiva.github.io itself). GitHub
// Pages serves project pages from a sub-path equal to the repo name, so every
// asset URL, the resume link, and the audio file all need to resolve
// relative to that sub-path or they 404 once deployed.
//
// If you ever rename the repo, or move this into the ArjithSiva.github.io
// root user-site repo instead, update `base` below to match:
//   - project page   (github.com/ArjithSiva/portfolio)            -> '/portfolio/'
//   - user/root page (github.com/ArjithSiva/ArjithSiva.github.io) -> '/'
const REPO_NAME = 'portfolio'

export default defineConfig({
  base: `/${REPO_NAME}/`,
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
