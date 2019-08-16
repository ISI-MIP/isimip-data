import React, { Component} from 'react'
import PropTypes from 'prop-types'

import DatasetApi from '../api/DatasetApi'
import Search from '../components/Search'
import Results from '../components/Results'
import Pagination from '../components/Pagination'
import Facets from '../components/Facets'


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      params: {
        search: '',
        page: 1
      },
      datasets: {
        count: 0,
        results: []
      },
      facets: [
        {
          title: 'Simulation round',
          attribute: 'simulation_round',
          items: []
        },
        {
          title: 'Sector',
          attribute: 'sector',
          items: []
        }
      ]
    }
    this.handleSearch = this.handleSearch.bind(this);
    this.handlePagination = this.handlePagination.bind(this)
  }

  componentDidMount() {
    this.fetch()
  }

  reset() {
    this.setState({
      params: {
        search: '',
        page: 1
      }
    })
  }

  fetch() {
    const { params, facets } = this.state

    // fetch the datasets
    DatasetApi.fetchDatasets(params).then(datasets => {
      this.setState({ datasets })
    })

    // fetch the facets
    const promises = []
    facets.map(facet => {
      promises.push(DatasetApi.fetchDatasetsFacets(facet.attribute, params))
    })
    Promise.all(promises).then(results => {
      this.setState({
        facets: facets.map((facet, index) => {
          facet.items = results[index]
          return facet
        })
      })
    })
  }

  handleSearch(search) {
    const { params } = this.state

    params.search = search
    params.page = 1

    // update state and call fetch as callback
    this.setState({ params }, this.fetch)
  }

  handlePagination(page) {
    const { params } = this.state

    params.page = page

    // update state and call fetch as callback
    this.setState({ params }, this.fetch)
  }

  render() {
    const { params, facets, datasets } = this.state

    return (
      <div className="row">
        <div className="col-lg-12">
          <Search onSubmit={this.handleSearch} />
        </div>
        <div className="col-lg-3">
          <Facets facets={facets}/>
        </div>
        <div className="col-lg-9">
          <Pagination count={datasets.count} page={params.page} pageSize={10} onSubmit={this.handlePagination} />
          <Results results={datasets.results} />
        </div>
      </div>
    )
  }
}

export default App
