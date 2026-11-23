import { defineConfig } from 'vitest/config'
import viteReact from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// Separate from vite.config.ts: the TanStack Start / devtools plugins are for the
// app server and load a second React instance inside component tests.
export default defineConfig({
  plugins: [tsconfigPaths({ projects: ['./tsconfig.json'] }), viteReact()],
  test: {
    environment: 'node', // component tests opt in with `// @vitest-environment jsdom`
  },
})
