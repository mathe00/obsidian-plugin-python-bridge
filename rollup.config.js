// rollup.config.js
const typescript = require('rollup-plugin-typescript2');
const commonjs = require('@rollup/plugin-commonjs');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const json = require('@rollup/plugin-json'); // Corrected import using require

/** @type {import('rollup').RollupOptions} */
module.exports = {
  input: 'src/main.ts',
  output: {
    dir: '.',
    format: 'cjs',
    sourcemap: 'inline',
    exports: 'default',
  },
  external: ['obsidian'],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      useTsconfigDeclarationDir: true,
    }),
    nodeResolve({ browser: true }),
    commonjs(),
    json(), // JSON plugin added here
  ],
};
