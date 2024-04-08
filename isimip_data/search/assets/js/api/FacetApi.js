class FacetApi {

  static fetchFacets() {
    return fetch('/api/v1/facets/').then(response => {
      return response.json()
    }).catch(error => {
      return error
    })
  }

}

export default FacetApi
