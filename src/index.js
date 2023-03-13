// stolen with permission from:
// https://github.com/joelmoss/ibiza/blob/master/src/store.js

const isPlainObject = (value) => {
  if (Object.prototype.toString.call(value) !== '[object Object]') return false

  const prototype = Object.getPrototypeOf(value)
  return prototype === null || prototype === Object.prototype
}

const merge = (target, src) => {
  const props = Object.keys(src)

  for (const prop of props) {
    const desc = Object.getOwnPropertyDescriptor(src, prop)
    const isDataDesc = Object.prototype.hasOwnProperty.call(desc, 'value')

    // If the prop doesn't exist on the target, define it.
    if (!Object.prototype.hasOwnProperty.call(target, prop)) {
      Object.defineProperty(target, prop, desc)

      // If have prop, but type is not object => Overwrite by redefining property
    } else if (isDataDesc && typeof desc.value !== 'object') {
      Object.defineProperty(target, prop, desc)

      // If prop is Array => Replace.
    } else if (Array.isArray(desc.value)) {
      Object.defineProperty(target, prop, desc)
    }

    // prop is a data descriptor
    if (isDataDesc) {
      const value = target[prop]

      if (isPlainObject(desc.value)) {
        target[prop] = merge(value || {}, desc.value)
      } else if (Array.isArray(desc.value)) {
        target[prop] = desc.value.map((x, i, array) => {
          return isPlainObject(x) ? merge(array[i], x) : x
        })
      }
    }
  }

  return target
}

const mergeObjects = (...objects) => {
  const target = {}

  objects.forEach((obj) => {
    merge(target, obj)
  })

  return target
}

export default mergeObjects
