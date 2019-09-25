import { encodeParams, getFileName, downloadBlob } from '../utils/api'


class DatasetApi {

  static fetchDatasets(params) {
    return fetch('/api/v1/datasets/?' + encodeParams(params)).then(response => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error(response.statusText)
      }
    })
  }

  static fetchDatasetsFacets(attribute, params) {
    return fetch('/api/v1/datasets/facets/' + attribute + '/?' + encodeParams(params)).then(response => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error(response.statusText)
      }
    })
  }

}

export default DatasetApi
