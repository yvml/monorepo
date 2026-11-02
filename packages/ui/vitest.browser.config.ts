import { defineConfig } from 'vitest/config';

/** Browser tests: they render the generated stylesheet in a real Chrome. Run `pnpm test:browser` (codegen first). */
export default defineConfig({
  test: { include: ['tests/browser/**/*.test.ts'], testTimeout: 60_000, hookTimeout: 60_000, fileParallelism: false },
});
