import { isEmpty } from 'lodash'

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

  static submitJob(url, data, uploads) {
    let promise

    if (isEmpty(uploads)) {
      promise = fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
    } else {
      const formData = new FormData()

      // append data as a JSON blob
      formData.append('data', new Blob([JSON.stringify(data)]), {
        type: "application/json"
      })

      // append each file
      Object.entries(uploads).forEach(([fileName, file]) => {
        formData.append(fileName, file)
      })

      promise = fetch(url, {
        method: 'POST',
        body: formData
      })
    }

    return promise.then(response => {
      if (response.ok) {
        return response.json()
      } else {
        return response.json().then(data => {
          throw new BadRequestError(response.statusText, response.status, data.errors)
        })
      }
    })
  }
}

export default DownloadApi
