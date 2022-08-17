import React, { Component} from 'react'
import PropTypes from 'prop-types'
import ls from 'local-storage'

import DatasetApi from 'isimip_data/metadata/assets/js/api/DatasetApi'

import Filter from './Filter'
import Resources from './Resources'

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
        filterString: ls.get('filterString') || '',
        showAll: ls.get('showAll') || false
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
        <Filter filterString={filterString} onFilterStringChange={this.updateFilterString}
                showAll={showAll} onShowAllChange={this.updateShowAll} />
        <Resources resources={resources} filterString={filterString} showAll={showAll} />
      </div>
    )
  }
}

export default App
