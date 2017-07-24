import Serializer from 'parse5/lib/serializer'

export {parseFragment as parse} from 'parse5'

Serializer.escapeString = str => str

export const serialize = (node, options) => new Serializer(node, options).serialize()

export const getAttrs = (attrs, names, defaultVals) => {
  const result = {}
  attrs.forEach(({name, value}) => {
    if (!names.includes(name)) return
    result[name] = value || defaultVals[name]
  })
  return result
}

export const compilers = {
  underscore(content) {
    return `_.template(${JSON.stringify(content)})`
  }
}

export const generate = combined => {
  const result = []
  Object.keys(combined).forEach(key => {
    const value = combined[key]
    result.push(`'${key}':${value}`)
  })

  return `{${result.join()}}`
}
