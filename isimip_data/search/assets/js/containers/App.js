import React, { Component} from 'react'
import PropTypes from 'prop-types'

import DatasetApi from '../api/DatasetApi'
import Search from '../components/Search'
import Results from '../components/Results'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      query: null,
      datasets: {
        results: []
      }
    };
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    this.fetch()
  }

  fetch() {
    const { query } = this.state

    let params = {}
    if (query) {
      params.search = query
    }

    DatasetApi.fetchDatasets(params).then(datasets => {
      this.setState({ datasets })
    })
  }

  handleSearch(query) {
    // update state and call fetch as callback
    this.setState({ query }, this.fetch)
  }

  render() {
    const { datasets } = this.state

    return (
      <div className="row">
        <div className="col-lg-12">
          <Search onSubmit={this.handleSearch} />
        </div>
        <div className="col-lg-3">

        </div>
        <div className="col-lg-9">
          <Results results={datasets.results} />
        </div>
      </div>
    )
  }
}

export default App
