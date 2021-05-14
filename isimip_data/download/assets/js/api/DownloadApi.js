class DownloadApi {

  static fetchCountries() {
    return fetch('/api/v1/countries/')
      .then(response => response.json())
      .catch(error => error)
  }

  static fetchJob(url) {
    return fetch(url, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
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

  static downloadFile(file_url) {
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.src = file_url
    iframe.onload = function() {
        this.parentNode.removeChild(this)
    }
    document.body.appendChild(iframe)
  }

}

export default DownloadApi
