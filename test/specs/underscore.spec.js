import fs from 'fs'
import path from 'path'
import vm from 'vm'

import _ from 'underscore'

import Tpls2js from '../../dist/tpls2js'

const resolve = (...args) => path.resolve(__dirname, ...args)

const exportsName = 'tpls'

const run = (tpls, name, data) => vm.runInNewContext(tpls + `;tpls['${name}'](${JSON.stringify(data)})`, {_}).trim()

const tpl = resolve('../tpls/underscore.html')

test('generate runnable js code', done => {
  const tpls2js = new Tpls2js({
    exportsName,
    output: false
  })

  tpls2js.compile(tpl, (err, combined) => {
    expect(err).toBe(null)
    expect(run(tpls2js.generate(combined), 'first', {msg: 'Hello tpls2js'})).toBe(
      '<div class="first">Hello tpls2js</div>'
    )
    done()
  })
})

test('generate js file ', done => {
  const output = resolve('_underscore.js')

  const tpls2js = new Tpls2js({
    exportsName,
    output
  })

  tpls2js.compile(tpl, (err, combined) => {
    expect(err).toBe(null)
    tpls2js.generate(combined, (err, result) => {
      expect(err).toBe(null)
      expect(fs.readFileSync(output).toString()).toBe(result)
      done()
    })
  })
})

test('read tpls directory', done => {
  const output = resolve('_underscore_dir.js')

  const tpls2js = new Tpls2js({
    exportsName,
    output
  })

  tpls2js.compile(resolve('../tpls'), (err, combined) => {
    expect(err).toBe(null)
    tpls2js.generate(combined, (err, result) => {
      expect(err).toBe(null)
      expect(fs.readFileSync(output).toString()).toBe(result)
      done()
    })
  })
})
