import { encodeParams } from '../utils/api'

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
