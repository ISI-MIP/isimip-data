import React, { Component} from 'react'
import PropTypes from 'prop-types'
import { withRouter } from "react-router";

import { getLocationParams, getLocationString } from 'isimip_data/core/assets/js/utils/location'

import FacetApi from '../api/FacetApi'

import Latest from './Latest'
import Search from './Search'
import Results from './Results'
import Facets from './Facets'


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      params: {},
      facets: []
    }
    this.handleReset = this.handleReset.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleParamsRemove = this.handleParamsRemove.bind(this)
    this.handlePaginationClick = this.handlePaginationClick.bind(this)
    this.handleFacetChange = this.handleFacetChange.bind(this)
    this.handleLatestChange = this.handleLatestChange.bind(this)
  }

  componentDidMount() {
    const { location } = this.props
    const { params } = this.state

    FacetApi.fetchFacets().then(facets => {
      const attributes = facets.map(facet => { return facet.attribute })
      const params = Object.assign({ page: 1 }, getLocationParams('/search/', location))
      this.setState({
        params: params,
        facets: facets
      })
    })
  }

  setLocation() {
    const { history } = this.props
    const { params, facets } = this.state
    const attributes = facets.map(facet => { return facet.attribute })

    history.push(getLocationString('/search/', params))
  }

  handleReset() {
    const { history } = this.props
    this.setState({ params: {} }, this.setLocation)
  }

  handleSearch(query) {
    const params = Object.assign({}, this.state.params, { query: query, page: 1 })
    this.setState({ params }, this.setLocation)
  }

  handlePaginationClick(page) {
    const params = Object.assign({}, this.state.params, { page: page })
    this.setState({ params }, this.setLocation)
  }

  handleFacetChange(attribute, key, value) {
    const params = Object.assign({}, this.state.params, { page: 1 })

    // create the array in params if it not already exists
    if (params[attribute] == undefined) {
      params[attribute] = []
    }

    // find the current index of key
    const index = params[attribute].indexOf(key)

    if (index == -1 && value) {
      // the key does not exist but should -> push
      params[attribute].push(key)
    } else if (index > -1 && !value) {
      // the key exists, but shouln't -> splice
      params[attribute].splice(index, 1)
    }

    this.setState({ params }, this.setLocation)
  }

  handleParamsRemove(key, value) {
    if (key == 'query') {
      this.handleSearch('')
    } else {
      this.handleFacetChange(key, value, false)
    }
  }

  handleLatestChange(value) {
    const params = Object.assign({}, this.state.params, { page: 1 })

    params.all = value

    this.setState({ params })
  }

  render() {
    const { params, facets } = this.state

    return (
      <div className="row">
        <div className="col-lg-12">
          <Search params={params} onSubmit={this.handleSearch} onReset={this.handleReset} />
        </div>
        <div className="col-lg-3">
          <Latest params={params} onChange={this.handleLatestChange}/>
          <Facets params={params} facets={facets} onFacetChange={this.handleFacetChange}/>
        </div>
        <div className="col-lg-9">
          <Results params={params}
                   onParamsRemove={this.handleParamsRemove}
                   onPaginationClick={this.handlePaginationClick} />
        </div>
      </div>
    )
  }
}

export default withRouter(App)
