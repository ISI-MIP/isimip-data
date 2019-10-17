const getLocationParams = (location, attributes) => {
  const tokens = location.pathname.split('/')
  const params = {}

  // skip the first (empty) token
  for (let i = 1; i < tokens.length - 1; i++) {
    // look at every even token
    if (i % 2 == 1) {
      const key = tokens[i-1], value = tokens[i]
      if (attributes.indexOf(key) > -1) {
        if (params[key] == undefined) {
          params[key] = []
        }
        params[key].push(value)
      } else if (key == 'query') {
        params['query'] = value
      } else if (key == 'page') {
        params['page'] = parseInt(value)
      }
    }
  }
  console.log(params);
  return params
}

const getLocationString = (params, attributes) => {
  let string = '/search/'

  attributes.sort().forEach(key => {
    if (params[key] !== undefined) {
      params[key].sort().forEach(value => {
        string += key + '/' + value + '/'
      })
    }
  })

  if (params['query']) {
    string += 'query/' + params['query'] + '/'
  }

  if (params['page'] && params['page'] > 1) {
    string += 'page/' + params['page'] + '/'
  }

  return string
}

export { getLocationParams, getLocationString }
