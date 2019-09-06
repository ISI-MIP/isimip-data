import { encodeParams, getFileName, downloadBlob } from '../utils/api'


class FileApi {

  static downloadFile(file) {
    let fileName
    return fetch(file.url).then(response => {
      if (response.ok) {
        fileName = getFileName(response)
        return response.blob()
      } else {
        throw new Error(response.statusText)
      }
    }).then(blob => downloadBlob(blob, fileName))
  }

}

export default FileApi
