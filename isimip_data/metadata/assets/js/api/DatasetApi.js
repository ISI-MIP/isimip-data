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

  static fetchResources() {
    const fetchParams = {}
    return fetch('/api/v1/resources/index/', fetchParams).then(response => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error(response.statusText)
      }
    })
  }

  static fetchAttributes(fetchParams = {}) {
    return fetch('/api/v1/attributes/', fetchParams).then(response => {
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
    })
  }

  static fetchTree(urlParams, fetchParams = {}) {
    return fetch('/api/v1/tree/?' + encodeParams(urlParams), fetchParams).then(response => {
      return response.json()
    }).catch(error => {
      return error
    })
  }

  static downloadFiles(files) {
    files.forEach((file, index) => {
      // add a 300ms delay between the downloads
      setTimeout(() => {
        this.downloadFile(file)
      }, index * 300)
    })
  }

  static downloadFile(file) {
    if (file.file_url) {
      const iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      iframe.src = file.file_url
      iframe.onload = function() {
          this.parentNode.removeChild(this)
      }
      document.body.appendChild(iframe)
    }
  }
}

export default DatasetApi
