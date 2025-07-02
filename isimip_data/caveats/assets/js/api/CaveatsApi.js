import { encodeParams } from 'isimip_data/core/assets/js/utils/api'


class CaveatsApi {

  static fetchCaveats(params, fetchParams = {}) {
    return fetch('/api/v1/caveats/?' + encodeParams(params), fetchParams).then(response => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error(response.statusText)
      }
    })
  }

  static fetchCategory(fetchParams = {}) {
    return fetch('/api/v1/categories/', fetchParams).then(response => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error(response.statusText)
      }
    })
  }

  static fetchSeverity(fetchParams = {}) {
    return fetch('/api/v1/severities', fetchParams).then(response => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error(response.statusText)
      }
    })
  }

  static fetchStatus(params, fetchParams = {}) {
    return fetch('/api/v1/status/', fetchParams).then(response => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error(response.statusText)
      }
    })
  }

}

export default CaveatsApi
