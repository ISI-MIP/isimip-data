import { isEmpty } from 'lodash'

const getLsValue = (path) => {
  const lsValue = localStorage.getItem(`daiquiri.${path}`)

  // check if the value is empty
  if (isEmpty(lsValue)) {
    return null
  } else {
    return JSON.parse(lsValue)
  }
}

const setLsValue = (path, value) => {
  localStorage.setItem(path, JSON.stringify(value))
}

export { getLsValue, setLsValue }
