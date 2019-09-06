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

  static downloadFileList(dataset) {
    let fileName
    return fetch(`/api/v1/datasets/${dataset.id}/filelist/`).then(response => {
      if (response.ok) {
        fileName = getFileName(response)
        return response.blob()
      } else {
        throw new Error(response.statusText)
      }
    }).then(blob => downloadBlob(blob, fileName))
  }

  static downloadWgetScript(dataset) {
    let fileName
    return fetch(`/api/v1/datasets/${dataset.id}/wget/`).then(response => {
      if (response.ok) {
        fileName = getFileName(response)
        return response.blob()
      } else {
        throw new Error(response.statusText)
      }
    }).then(blob => downloadBlob(blob, fileName))
  }
}

export default DatasetApi
