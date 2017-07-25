import fs from 'fs'
import path from 'path'

import {parse, serialize, getAttrs, compilers, generate} from './utils'

const noop = () => {}

const DEFAULT_SUFFIXES = ['.html']

export default class {
  constructor({exportsName, defaultEngine, output} = {}) {
    if (!exportsName) throw new Error('invalid options without `exportsName`')
    this.exportsName = exportsName
    this.defaultEngine = defaultEngine
    this.suffixes = DEFAULT_SUFFIXES
    this.output = output
  }

  readFile(file, callback, combined = {}) {
    fs.readFile(file, (err, data) => {
      if (err) return callback(err)

      const {childNodes} = parse(data.toString())

      childNodes.forEach(node => {
        if (node.tagName !== 'template') return

        const {id, engine} = getAttrs(node.attrs, ['engine', 'id'], {engine: this.defaultEngine})

        combined[id] = compilers[engine](serialize(node.content))
      })

      callback(null, combined)
    })

    return this
  }

  readDirectory(directory, callback, combined = {}) {
    fs.readdir(directory, (err, files) => {
      if (err) return callback(err)

      files = files.filter(file => this.suffixes.includes(path.extname(file)))

      let count = files.length
      let error

      files.forEach(file => {
        this.readFile(
          path.resolve(directory, file),
          (err, combined) => {
            if (error) return

            if (err) {
              error = true
              return callback(err)
            }

            --count

            if (!count) {
              callback(null, combined)
            }
          },
          combined
        )
      })
    })

    return this
  }

  compile(file, callback = noop) {
    fs.stat(file, (err, stats) => {
      if (err) return callback(err)

      if (stats.isFile()) {
        return this.readFile(file, callback)
      }

      if (stats.isDirectory()) {
        return this.readDirectory(file, callback)
      }

      callback(new Error('no file nor directory passed in'))
    })

    return this
  }

  generate(combined, callback = noop) {
    const result = `var ${this.exportsName} = ${generate(combined)}`

    const output = this.output == null ? console.log : this.output

    switch (typeof output) {
      case 'string':
        return fs.writeFile(output, result, err => callback(err, result))
      case 'function':
        output(result)
    }

    callback(null, result)

    return result
  }
}
