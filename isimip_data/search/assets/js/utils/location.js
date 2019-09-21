const getLocationParams = (location, attributes) => {
  const tokens = location.pathname.split('/')
  const params = {}

  for (let i = 1; i < tokens.length - 1; i++) {
    if (i % 2 == 0) {
      const key = tokens[i-1], value = tokens[i]

      if (attributes.indexOf(key) > -1) {
        if (params[key] == undefined) {
          params[key] = []
        }
        params[key].push(value)
      } else if (key == 'search') {
        params['search'] = value
      } else if (key == 'page') {
        params['page'] = parseInt(value)
      }
    }
  }

  return params
}

const getLocationString = (params, attributes) => {
  let string = '/'

  attributes.sort().forEach(key => {
    if (params[key] !== undefined) {
      params[key].sort().forEach(value => {
        string += key + '/' + value + '/'
      })
    }
  })

  if (params['search']) {
    string += 'search/' + params['search'] + '/'
  }

  if (params['page'] && params['page'] > 1) {
    string += 'page/' + params['page'] + '/'
  }

  return string
}

export { getLocationParams, getLocationString }
