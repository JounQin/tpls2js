import buble from 'rollup-plugin-buble'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  entry: 'src/index.js',
  dest: 'dist/tpls2js.js',
  format: 'cjs',
  plugins: [resolve(), commonjs(), buble()],
  external: ['fs', 'path', 'parse5', 'parse5/lib/serializer']
}
