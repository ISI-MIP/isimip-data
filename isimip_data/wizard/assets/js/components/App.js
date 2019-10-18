import React, { Component} from 'react'

import Layers from './Layers'


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      params: {},
    }
    this.handleLayerChange = this.handleLayerChange.bind(this)
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

  render() {
    const { params } = this.state

    return (
      <div className="row">
        <div className="col-lg-8 offset-lg-2">
          <h1>Welcome to the ISIMIP Data Portal</h1>
          <p>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
          </p>

          <h2>What data are you interested in?</h2>
          <p>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
          </p>

          <Layers params={params} onChange={this.handleLayerChange}/>
        </div>
      </div>
    )
  }
}

export default App
