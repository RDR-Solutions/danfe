import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: {
    // tsup 8.5.x injects baseUrl during DTS; TS 6 deprecates it (TS5101)
    compilerOptions: {
      ignoreDeprecations: '6.0',
    },
  },
  clean: true,
  sourcemap: true,
  esbuildOptions(options) {
    options.keepNames = true;
  },
});
