import React, { Component} from 'react'

import { getLocationString } from 'isimip_data/core/assets/js/utils/location'

import Layers from './Layers'
import Submit from './Submit'


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      params: {},
    }
    this.handleLayerChange = this.handleLayerChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleLayerChange(attribute, key) {
    const params = Object.assign({}, this.state.params)

    // create the array in params if it not already exists
    if (params[attribute] == undefined) {
      params[attribute] = []
    }

    // find the current index of key
    const index = params[attribute].indexOf(key)

    if (index == -1) {
      // the key does not exist but should -> push
      params[attribute].push(key)
    } else {
      // the key exists, but shouln't -> splice
      params[attribute].splice(index, 1)
    }

    this.setState({ params })
  }

  handleSubmit() {
    const { params } = this.state
    const searchPath = getLocationString('/search/', params)
    document.location.href = searchPath
  }

  render() {
    const { params } = this.state

    return (
      <div className="wizard">
        <Layers params={params} onChange={this.handleLayerChange}/>
        <Submit params={params} onSubmit={this.handleSubmit}/>
      </div>
    )
  }
}

export default App
