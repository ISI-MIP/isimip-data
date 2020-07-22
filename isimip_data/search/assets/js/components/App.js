import React, { Component} from 'react'
import PropTypes from 'prop-types'
import ls from 'local-storage'
import { withRouter } from 'react-router'

import { getLocationParams, getLocationString } from 'isimip_data/core/assets/js/utils/location'

import CoreApi from 'isimip_data/core/assets/js/api/CoreApi'
import FacetApi from '../api/FacetApi'

import Version from './Version'
import Search from './Search'
import Results from './Results'
import Facets from './Facets'
import Tree from './Tree'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      params: {},
      facets: [],
      settings: {},
      sidebar: 'tree'
    }
    this.handleReset = this.handleReset.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleSidebarChange = this.handleSidebarChange.bind(this)
    this.handleParamsRemove = this.handleParamsRemove.bind(this)
    this.handlePaginationClick = this.handlePaginationClick.bind(this)
    this.handleAttributeChange = this.handleAttributeChange.bind(this)
    this.handleVersionChange = this.handleVersionChange.bind(this)
  }

  componentDidMount() {
    const { location } = this.props
    const { params } = this.state

    CoreApi.fetchSettings().then(settings => {
      this.setState({ settings })
    })

    FacetApi.fetchFacets().then(facets => {
      const attributes = facets.map(facet => { return facet.attribute })
      const params = Object.assign({ page: 1 }, getLocationParams('/search/', location))
      this.setState({
        params: params,
        facets: facets
      })
    })

    const sidebar = ls.get('sidebar')
    if (sidebar) {
      this.handleSidebarChange(sidebar)
    }
  }

  setLocation() {
    const { history } = this.props
    const { params, facets } = this.state
    const attributes = facets.map(facet => { return facet.attribute })

    history.push(getLocationString('/search/', params))
  }

  handleReset() {
    const params = { page: 1 }
    this.setState({ params }, this.setLocation)
  }

  handleSearch(query) {
    const params = Object.assign({}, this.state.params, { query: query, page: 1 })
    this.setState({ params }, this.setLocation)
  }

  handleSidebarChange(sidebar) {
    ls.set('sidebar', sidebar)
    this.setState({ sidebar })
  }

  handlePaginationClick(page) {
    const params = Object.assign({}, this.state.params, { page: page })
    this.setState({ params }, this.setLocation)
  }

  handleAttributeChange(attribute, key, value) {
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
      this.handleAttributeChange(key, value, false)
    }
  }

  handleVersionChange(value) {
    const params = Object.assign({}, this.state.params, { page: 1 })

    params.all = value

    this.setState({ params }, this.setLocation)
  }

  render() {
    const { params, facets, settings, sidebar } = this.state
    const pageSize = parseInt(settings.METADATA_PAGE_SIZE)

    return (
      <div className="row">
        <div className="col-lg-12">
          <Search params={params} onSubmit={this.handleSearch} onReset={this.handleReset} />
        </div>
        <div className="col-lg-3">
          <div className="card sidebar-header">
            <div className="card-header d-flex justify-content-between align-items-center">
              Sidebar view:
              <div className="form-check">
                <input className="form-check-input" type="radio" id="tree-radio"
                       onChange={e => this.handleSidebarChange('tree')} checked={sidebar == 'tree'} />
                <label className="form-check-label" htmlFor="tree-radio">Tree</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="radio" id="facets-radio"
                       onChange={e => this.handleSidebarChange('facets')} checked={sidebar == 'facets'} />
                <label className="form-check-label" htmlFor="facets-radio">Facets</label>
              </div>
            </div>
          </div>
          <div className={sidebar == 'tree' ? '' : 'd-none'}>
            <Tree params={params} onTreeChange={this.handleAttributeChange}/>
          </div>
          <div className={sidebar == 'facets' ? '' : 'd-none'}>
            <Facets params={params} facets={facets} onFacetChange={this.handleAttributeChange}/>
          </div>
        </div>
        <div className="col-lg-9">
          <Version params={params} onChange={this.handleVersionChange}/>
          <Results params={params}
                   pageSize={pageSize}
                   onParamsRemove={this.handleParamsRemove}
                   onPaginationClick={this.handlePaginationClick} />
        </div>
      </div>
    )
  }
}

export default withRouter(App)
