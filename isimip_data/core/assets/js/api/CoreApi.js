class CoreApi {

  static fetchSettings() {
    return fetch('/api/v1/settings/')
      .then(response => response.json())
      .then(json => {
        return json.reduce((accumulator, currentItem) => ({ ...accumulator, [currentItem.key]: currentItem.value }), {})
      })
      .catch(error => error)
  }
}

export default CoreApi