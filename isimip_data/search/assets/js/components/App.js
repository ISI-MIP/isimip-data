import React, { Component} from 'react'
import PropTypes from 'prop-types'
import { withRouter } from "react-router";

import FacetApi from '../api/FacetApi'
import { getLocationParams, getLocationString } from '../utils/location'
import Search from './Search'
import Results from './Results'
import Facets from './Facets'


const initialParams = {
  search: '',
  page: 1
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      params: initialParams,
      facets: []
    }
    this.handleSearch = this.handleSearch.bind(this)
    this.handleReset = this.handleReset.bind(this)
    this.handleParamsRemove = this.handleParamsRemove.bind(this)
    this.handlePaginationClick = this.handlePaginationClick.bind(this)
    this.handleFacetChange = this.handleFacetChange.bind(this)
  }

  componentDidMount() {
    const { location } = this.props

    FacetApi.fetchFacets().then(facets => {
      const attributes = facets.map(facet => { return facet.attribute })
      this.setState({
        params: Object.assign(this.state.params, getLocationParams(location, attributes)),
        facets: facets
      })
    })
  }

  setLocation() {
    const { history } = this.props
    const { params, facets } = this.state
    const attributes = facets.map(facet => { return facet.attribute })

    history.push(getLocationString(params, attributes))
  }

  handleSearch(search) {
    const params = Object.assign({}, this.state.params)
    params.search = search
    params.page = 1
    this.setState({ params })
  }

  handleReset() {
    const { history } = this.props
    this.setState({ params: initialParams }, history.push('/'))
  }

  handlePaginationClick(page) {
    const params = Object.assign({}, this.state.params)
    params.page = page
    this.setState({ params: params })
  }

  handleFacetChange(attribute, key, value) {
    const params = Object.assign({}, this.state.params)
    params.page = 1

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
    if (key == 'search') {
      this.handleSearch('')
    } else {
      this.handleFacetChange(key, value, false)
    }
  }

  render() {
    const { params, facets } = this.state

    return (
      <div className="row">
        <div className="col-lg-12">
          <Search params={params} onSubmit={this.handleSearch} onReset={this.handleReset} />
        </div>
        <div className="col-lg-3">
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
