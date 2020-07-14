class DownloadApi {

  static fetchCountries() {
    return fetch('/api/v1/countries/')
      .then(response => response.json())
      .catch(error => error)
  }

  static submitJob(url, data) {
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(response => response.json())
  }

  static downloadFile(fileUrl) {
    let fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1)
    return fetch(fileUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName

        document.body.appendChild(a)
        a.click()
        a.remove()
      })
      .catch(error => {
        return {
          errors: {
            path: 'File not found'
          }
        }
      })
  }
}

export default DownloadApi
