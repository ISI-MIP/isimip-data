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
        page: 1,
        sector: ['biomes', 'health']

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
        },
        {
          title: 'Model',
          attribute: 'model',
          items: []
        }
      ]
    }
    this.handleSearch = this.handleSearch.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handlePagination = this.handlePagination.bind(this)
    this.handleFacets = this.handleFacets.bind(this)
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
    }, this.fetch)
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

  handleReset() {
    this.reset()
  }

  handlePagination(page) {
    const { params } = this.state

    params.page = page

    // update state and call fetch as callback
    this.setState({ params }, this.fetch)
  }

  handleFacets(attribute, key, value) {
    const { params } = this.state

    // create the array in params if it not already exists
    if (params[attribute] == undefined) {
      params[attribute] = []
    }

    // find the current index of key
    const index = params[attribute].indexOf(key)

    console.log(params[attribute], index);

    if (index == -1 && value) {
      params[attribute].push(key)
    } else if (index > -1 && !value) {
      params[attribute].splice(index, 1)
    }

    this.setState({ params }, this.fetch)
  }

  render() {
    const { params, facets, datasets } = this.state

    return (
      <div className="row">
        <div className="col-lg-12">
          <Search onSubmit={this.handleSearch} onReset={this.handleReset} />
        </div>
        <div className="col-lg-3">
          <Facets facets={facets} params={params} onChange={this.handleFacets}/>
        </div>
        <div className="col-lg-9">
          <Pagination count={datasets.count} page={params.page} pageSize={10} onSubmit={this.handlePagination} />
          <Results results={datasets.results} />
          <Pagination count={datasets.count} page={params.page} pageSize={10} onSubmit={this.handlePagination} />
        </div>
      </div>
    )
  }
}

export default App
