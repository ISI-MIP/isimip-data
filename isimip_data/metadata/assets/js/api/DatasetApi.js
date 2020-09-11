import { encodeParams } from 'isimip_data/core/assets/js/utils/api'


class DatasetApi {

  static fetchDatasets(params, fetchParams = {}) {
    return fetch('/api/v1/datasets/?' + encodeParams(params), fetchParams).then(response => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error(response.statusText)
      }
    })
  }

  static fetchDatasetsHistogram(attribute, urlParams, fetchParams = {}) {
    return fetch('/api/v1/datasets/histogram/' + attribute + '/?' + encodeParams(urlParams), fetchParams)
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          throw new Error(response.statusText)
        }
      })
  }

  static fetchGlossary(fetchParams = {}) {
    return fetch('/api/v1/glossary/', fetchParams).then(response => {
      return response.json()
    }).catch(error => {
      return error
    });
  }

  static fetchTree(fetchParams = {}) {
    return fetch('/api/v1/tree/', fetchParams).then(response => {
      return response.json()
    }).catch(error => {
      return error
    });
  }

  static downloadFiles(files, fetchParams = {}) {
    return files.map(file => {
      return fetch(file.file_url, fetchParams)
        .then(response => response.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = file.name

          document.body.appendChild(a)
          a.click()
          a.remove()
        })
    })
  }
}

export default DatasetApi
