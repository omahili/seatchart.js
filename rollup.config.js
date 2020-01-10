import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/seatchart.ts',
  output: {
    dir: 'dist',
    format: 'umd',
    name: "Seatchart"
  },
  plugins: [typescript()]
};