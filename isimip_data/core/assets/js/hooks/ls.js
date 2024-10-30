import { useState } from 'react'
import { difference, isArray, isEmpty, isNil, isPlainObject } from 'lodash'

const deserialize = (values) => {
  if (isArray(values)) {
    return values.map(value => deserialize(value))
  } else if (isPlainObject(values)) {
    if (isEmpty(difference(Object.keys(values), ['path']))) {
      return loadFile(values.path) // this is a file
    } else {
      return Object.fromEntries(Object.entries(values).map(([key, value]) => [key, deserialize(value)]))
    }
  } else {
    return values
  }
}

const serialize = (values) => {
  if (isArray(values)) {
    return values.map(value => serialize(value))
  } else if (isPlainObject(values)) {
    return Object.fromEntries(Object.entries(values).map(([key, value]) => [key, serialize(value)]))
  } else {
    if (values instanceof File) {
      storeFile(values)
    }
    return values
  }
}

const storeFile = (file) => {
  const reader = new FileReader()
  reader.onload = function(event) {
    localStorage.setItem(file.path, reader.result)
  }
  reader.readAsDataURL(file)
}

const loadFile = (filePath) => {
  const lsString = localStorage.getItem(filePath)
  if (lsString) {
    const match = lsString.match(/^data:(?<mimeType>[a-z\/\-\+]+);\w+,(?<base64>.*?)$/)
    if (match) {
      const { mimeType, base64 } = match.groups
      const buffer = Buffer.from(base64, 'base64')
      return new File([buffer], filePath, {type: mimeType})
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
