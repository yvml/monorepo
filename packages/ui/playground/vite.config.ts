import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

/** The playground: every component and variant on one page, with the baseline overlay, dark mode and a theme switch. */
export default defineConfig({
  root: import.meta.dirname,
  plugins: [react()],
  server: { port: 5190 },
});
