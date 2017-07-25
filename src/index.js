import fs from 'fs'

import {parse, serialize, getAttrs, compilers, generate} from './utils'

const noop = () => {}

export default class {
  constructor({exportsName, defaultEngine, output} = {}) {
    if (!exportsName) throw new Error('invalid options without `exportsName`')
    this.exportsName = exportsName
    this.defaultEngine = defaultEngine
    this.output = output
  }

  compile(file, callback = noop) {
    fs.readFile(file, (err, data) => {
      if (err) return callback(err)

      const {childNodes} = parse(data.toString())

      const combined = {}

      childNodes.forEach(node => {
        if (node.tagName !== 'template') return

        const {id, engine} = getAttrs(node.attrs, ['engine', 'id'], {engine: this.defaultEngine})

        combined[id] = compilers[engine](serialize(node.content))
      })

      callback(combined)
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
