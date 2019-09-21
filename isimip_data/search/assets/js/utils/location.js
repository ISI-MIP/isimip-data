const getLocationParams = (location, attributes) => {
  const tokens = location.pathname.split('/')
  const params = {}

  for (let i = 1; i < tokens.length - 1; i++) {
    if (i % 2 == 0) {
      const attribute = tokens[i-1], value = tokens[i]

      if (attributes.indexOf(attribute) > -1) {
        if (params[attribute] == undefined) {
          params[attribute] = []
        }
        params[attribute].push(value)
      }
    }
  }

  return params
}

const getLocationString = (params, attributes) => {
  let string = '/'

  attributes.sort().forEach(attribute => {
    if (params[attribute] !== undefined) {
      params[attribute].sort().forEach(value => {
        string += attribute + '/' + value + '/'
      })
    }
  })

  return string
}

export { getLocationParams, getLocationString }
