class LayerApi {

  static fetchLayers() {
    return fetch('/api/v1/layers/').then(response => {
      return response.json()
    }).catch(error => {
      return error
    });
  }

}

export default LayerApi
