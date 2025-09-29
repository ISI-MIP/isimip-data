class AccessApi {

  static fetchAccess() {
    return fetch('/api/v1/access/').then(response => {
      return response.json()
    }).catch(error => {
      return error
    })
  }

}

export default AccessApi
