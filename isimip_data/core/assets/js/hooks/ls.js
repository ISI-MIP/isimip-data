import { useState } from 'react'
import { difference, isArray, isEmpty, isNaN, isNil, isPlainObject, toNumber } from 'lodash'

const deserialize = (value) => {
  if (isArray(value)) {
    return value.map(v => deserialize(v))
  } else if (isPlainObject(value)) {
    if (!isEmpty(value.fileName)) {
      return loadFile(value.fileName) // this is a file
    } else {
      return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, deserialize(v)]))
    }
  } else if (['', true, false, null, undefined].includes(value)) {
    return value
  } else {
    const number = toNumber(value)
    return isNaN(number) ? value : number
  }
}

const serialize = (value) => {
  if (isArray(value)) {
    return value.map(v => serialize(v))
  } else if (isPlainObject(value)) {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, serialize(v)]))
  } else {
    return (value instanceof File) ? storeFile(value) : value
  }
}

const storeFile = (file) => {
  if (file.size < 1024 * 1024) {
    const reader = new FileReader()
    reader.onload = function(event) {
      try {
        localStorage.setItem(file.name, reader.result)
      } catch (e) {
        console.log(e);
      }
    }
    reader.readAsDataURL(file)
    return { fileName: file.name }
  } else {
    return null
  }
}

const loadFile = (fileName) => {
  const lsString = localStorage.getItem(fileName)
  if (lsString) {
    const match = lsString.match(/^data:(?<mimeType>[a-z\/\-\+]+);\w+,(?<base64>.*?)$/)
    if (match) {
      const { mimeType, base64 } = match.groups
      const buffer = Buffer.from(base64, 'base64')
      return new File([buffer], fileName, {type: mimeType})
    }
  }
  return null
}

export const useLsState = (path, initialValues) => {
  // get the value from the local storage
  const lsString = localStorage.getItem(path)
  const lsValues = isEmpty(lsString) ? [] : deserialize(JSON.parse(lsString))

  // setup the state with the values from the local storage or the provided initialValues
  const [values, setValues] = useState(isNil(lsValues) ? initialValues : lsValues)

  return [values, (values) => {
    localStorage.setItem(path, JSON.stringify(serialize(values)))
    setValues(values)
  }]
}