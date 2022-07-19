const updateParams = (params, key, value) => {
  if (key !== null && value !== null) {
    if (key == 'page') {
      params['page'] = parseInt(value)
    } else if (['all', 'after', 'before', 'query'].indexOf(key) > -1) {
      params[key] = value
    } else {
      if (params[key] == undefined) {
        params[key] = [value]
      } else {
        params[key].push(value)
      }
    }
  }
}

const getLocationParams = (path, location, identifiers) => {
  const keys = ['page', 'tree', 'all', 'after', 'before', 'query'].concat(identifiers)

  // remove the base path
  const string = location.pathname.replace(path, '')

  // split into array and remove empty elements
  const tokens = string.split('/').reduce((array, currentElement) => {
    if (currentElement) {
      array.push(currentElement)
    }
    return array
  }, [])

  const params = {}
  let key = null, value = null
  for (let i = 0; i < tokens.length; i++) {
    const token = decodeURIComponent(tokens[i])

    if (keys.includes(token)) {
      updateParams(params, key, value)
      key = token
      value = null
    } else {
      if (value === null) {
        value = token
      } else {
        value += '/' + token
      }
    }
  }

  updateParams(params, key, value)
  return params
}

const getLocationString = (path, params) => {
  let string = path

  Object.keys(params).forEach(key => {
    if (key == 'page') {
      if (params['page'] > 1) {
        string += 'page/' + params['page'] + '/'
      }
    } else if (['all', 'after', 'before', 'query'].indexOf(key) > -1) {
      string += key + '/' + encodeURIComponent(params[key]) + '/'
    } else {
      params[key].forEach(value => {
        // encode everything but the slashes
        string += key + '/' + value.split('/').map(v => encodeURIComponent(v)).join('/') + '/'
      })
    }
  })

  return string
}

export { getLocationParams, getLocationString }
