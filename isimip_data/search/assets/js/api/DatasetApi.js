class DatasetApi {

  static fetchDatasets(params) {
    const urlParams = new URLSearchParams(params)

    return fetch('/api/v1/datasets/?' + urlParams).then(response => {
      return response.json()
    }).catch(error => {
      return error
    });
  }

  static fetchDatasetsFacets(attribute, params) {
    const urlParams = new URLSearchParams(params)

    return fetch('/api/v1/datasets/facets/' + attribute + '/?' + urlParams).then(response => {
      return response.json()
    }).catch(error => {
      return error
    });
  }

}

export default DatasetApi
