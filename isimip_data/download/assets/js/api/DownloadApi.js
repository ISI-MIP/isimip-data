import { BadRequestError, downloadFile } from 'isimip_data/core/assets/js/utils/api'

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
    }).then(response => response.json()).then(job => {
      if (job.file_url) {
        downloadFile(job.file_url)
      }
      return job
    })
  }

  static submitJob(url, data) {
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(response => {
      if (response.ok) {
        return response.json()
      } else {
        return response.json().then(data => {
          throw new BadRequestError(response.statusText, response.status, data.errors)
        })
      }
    })
  }

  static downloadFile(file_url) {

  }

}

export default DownloadApi
