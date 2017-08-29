import buble from 'rollup-plugin-buble'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

const pkg = require('./package.json')

export default {
  banner: `/*!
 * ${pkg.name} ${pkg.description}
 * Version ${pkg.version}
 * Copyright (C) 2017 JounQin <admin@1stg.me>
 * Released under the MIT license
 *
 * Github: https://github.com/JounQin/tpls2js
 */`,
  input: 'src/index.js',
  output: {
    file: 'dist/tpls2js.js',
    format: 'cjs'
  },
  plugins: [resolve(), commonjs(), buble()],
  external: ['fs', 'path', 'parse5', 'parse5/lib/serializer']
}
