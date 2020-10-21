const getLocationParams = (path, location) => {
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
  for (let i = 0; i < tokens.length; i++) {
    // look at every odd token, thats a value!
    if (i % 2 == 1) {
      const key = tokens[i-1],
            value = decodeURIComponent(tokens[i])

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
      string += key + '/' + params[key] + '/'
    } else {
      params[key].forEach(value => {
        string += key + '/' + encodeURIComponent(value) + '/'
      })
    }
  })

  return string
}

export { getLocationParams, getLocationString }
