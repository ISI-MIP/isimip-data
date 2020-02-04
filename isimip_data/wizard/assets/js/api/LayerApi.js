import { encodeParams } from 'isimip_data/core/assets/js/utils/api'


class LayerApi {

  static fetchLayers() {
    return fetch('/api/v1/layers/').then(response => {
      return response.json()
    }).catch(error => {
      return error
    });
  }

  static fetchLayersWizard(params) {
    return fetch('/api/v1/layers/wizard/?' + encodeParams(params)).then(response => {
      return response.json()
    }).catch(error => {
      return error
    });
  }

  static fetchGlossary() {
    return fetch('https://isi-mip.github.io/isimip-protocol-3/glossary.json').then(response => {
      return response.json()
    }).catch(error => {
      return error
    });
  }

}

export default LayerApi
