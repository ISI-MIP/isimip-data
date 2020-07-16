import { encodeParams } from 'isimip_data/core/assets/js/utils/api'


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

  static fetchDatasetsHistogram(attribute, params) {
    return fetch('/api/v1/datasets/histogram/' + attribute + '/?' + encodeParams(params)).then(response => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error(response.statusText)
      }
    })
  }

  static fetchGlossary() {
    return fetch('/api/v1/glossary/').then(response => {
      return response.json()
    }).catch(error => {
      return error
    });
  }

  static fetchHierarchy() {
    return fetch('/api/v1/hierarchy/').then(response => {
      return response.json()
    }).catch(error => {
      return error
    });
  }

}

export default DatasetApi
