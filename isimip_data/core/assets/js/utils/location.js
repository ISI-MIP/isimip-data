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
            value = tokens[i]

      if (key == 'all') {
        params['all'] = true
      } else if (key == 'query') {
        params['query'] = value
      } else if (key == 'page') {
        params['page'] = parseInt(value)
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
    if (key == 'all') {
      if (params['all'] == true) {
        string += 'all/true/'
      }
    } else if (key == 'query') {
      string += 'query/' + params['query'] + '/'
    } else if (key == 'page') {
      if (params['page'] > 1) {
        string += 'page/' + params['page'] + '/'
      }
    } else {
      params[key].forEach(value => {
        string += key + '/' + value + '/'
      })
    }
  })

  return string
}

export { getLocationParams, getLocationString }
