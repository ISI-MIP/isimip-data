import React, { Component} from 'react'
import PropTypes from 'prop-types'

import DatasetApi from 'isimip_data/metadata/assets/js/api/DatasetApi'

import Filter from './Filter'
import Resources from './Resources'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      resources: [],
      filterString: ''
    }

    this.toggleResource = this.toggleResource.bind(this)
    this.updateFilterString = this.updateFilterString.bind(this)
  }

  toggleResource(resource) {
    const resources = [...this.state.resources]
    resource.hidden = !resource.hidden
    this.setState(resources)
  }

  updateFilterString(event) {
    this.setState({ filterString: event.target.value })
  }

  componentDidMount() {
    DatasetApi.fetchResources().then(resources => {
      this.setState({ resources })
    })
  }

  render() {
    const { resources, filterString } = this.state

    return (
      <div>
        <Filter onChange={this.updateFilterString} filterString={filterString} />
        <Resources resources={resources} filterString={filterString} />
      </div>
    )
  }
}

export default App
