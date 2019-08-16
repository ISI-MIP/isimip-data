const encodeParams = params => {
  return Object.entries(params).map(item => {
    const [key, value] = item

    if (Array.isArray(value)) {
      return value.map(v => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(v)
      }).join('&')
    } else {
      return encodeURIComponent(key) + '=' + encodeURIComponent(value)
    }
  }).join('&')
}

class DatasetApi {

  static fetchDatasets(params) {
    return fetch('/api/v1/datasets/?' + encodeParams(params)).then(response => {
      return response.json()
    }).catch(error => {
      return error
    });
  }

  static fetchDatasetsFacets(attribute, params) {
    return fetch('/api/v1/datasets/facets/' + attribute + '/?' + encodeParams(params)).then(response => {
      return response.json()
    }).catch(error => {
      return error
    });
  }

}

export default DatasetApi
