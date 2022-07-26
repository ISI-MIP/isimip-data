import React, { Component} from 'react'
import PropTypes from 'prop-types'
import ls from 'local-storage'

import DatasetApi from 'isimip_data/metadata/assets/js/api/DatasetApi'

import Filter from './Filter'
import Resources from './Resources'
import Version from './Version'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      resources: [],
      filterString: '',
      showAll: false
    }

    this.toggleResource = this.toggleResource.bind(this)
    this.updateFilterString = this.updateFilterString.bind(this)
    this.updateShowAll = this.updateShowAll.bind(this)
  }

  componentDidMount() {
    DatasetApi.fetchResources().then(resources => {
      this.setState({
        resources,
        filterString: ls.get('filterString'),
        showAll: ls.get('showAll')
      })
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const { filterString, showAll } = this.state

    if (prevState.filterString != filterString) {
      ls.set('filterString', filterString)
    }
    if (prevState.showAll != showAll) {
      ls.set('showAll', showAll)
    }
  }

  toggleResource(resource) {
    const resources = [...this.state.resources]
    resource.hidden = !resource.hidden
    this.setState(resources)
  }

  updateFilterString(filterString) {
    this.setState({ filterString })
  }

  updateShowAll(showAll) {
    this.setState({ showAll })
  }

  render() {
    const { resources, filterString, showAll } = this.state

    return (
      <div>
        <Filter value={filterString} onChange={this.updateFilterString} />
        <Version value={showAll} onChange={this.updateShowAll} />
        <div className="mt-4">
          <Resources resources={resources} filterString={filterString} showAll={showAll} />
        </div>
      </div>
    )
  }
}

export default App
