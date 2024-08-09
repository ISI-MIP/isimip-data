import React, { Component } from 'react'
import ls from 'local-storage'

import { getLocationParams, getLocationString } from 'isimip_data/metadata/assets/js/utils/location'

import CoreApi from 'isimip_data/core/assets/js/api/CoreApi'
import DatasetApi from 'isimip_data/metadata/assets/js/api/DatasetApi'

import Search from './Search'
import Results from './Results'
import Facets from './Facets'
import Tree from './Tree'
import Version from './Version'


class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      params: {},
      settings: {},
      identifiers: [],
      glossary: {},
      sidebar: null
    }
    this.handleReset = this.handleReset.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleSidebarChange = this.handleSidebarChange.bind(this)
    this.handleParamsRemove = this.handleParamsRemove.bind(this)
    this.handleLoadMore = this.handleLoadMore.bind(this)
    this.handleIdentifierChange = this.handleIdentifierChange.bind(this)
    this.handleVersionChange = this.handleVersionChange.bind(this)
  }

  componentDidMount() {
    Promise.all([
      CoreApi.fetchSettings(),
      DatasetApi.fetchIdentifiers(),
      DatasetApi.fetchGlossary()
    ]).then(results => {
      const [ settings, identifiers, glossary ] = results
      const params = Object.assign({ page: 1 }, getLocationParams('/search/', window.location.pathname,
                                                                  identifiers.map(i => i.identifier)))
      this.setState({ params, identifiers, glossary, settings })
    })

    let sidebar = ls.get('sidebar')
    if (sidebar === null) {
      sidebar = 'tree'
    }
    this.handleSidebarChange(sidebar)

    window.addEventListener('popstate', () => {
      const { identifiers } = this.state
      const params = Object.assign({ page: 1 }, getLocationParams('/search/', window.location.pathname,
                                                                  identifiers.map(i => i.identifier)))
      this.setState({ params })
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.params != this.state.params) {
      // update the browser location
      this.setLocation()
    }
  }

  setLocation() {
    const { params } = this.state
    const pathname = getLocationString('/search/', params)
    if (pathname != window.location.pathname) {
      history.pushState(null, null, pathname)
    }
  }

  handleReset() {
    const params = { page: 1 }
    this.setState({ params })
  }

  handleSearch(query) {
    const params = Object.assign({}, this.state.params, { query: query, page: 1 })
    this.setState({ params })
  }

  handleVersionChange(values) {
    const params = Object.assign({}, this.state.params, { page: 1 })

    Object.entries(values).map(item => {
      const [key, value] = item
      if (value === false) {
        delete params[key]
      } else if (value === true) {
        params[key] = 'true'
      } else {
        params[key] = value
      }
    })

    this.setState({ params })
  }

  handleSidebarChange(sidebar) {
    ls.set('sidebar', sidebar)
    this.setState({ sidebar })
  }

  handleLoadMore() {
    const params = Object.assign({}, this.state.params)
    params.page += 1
    this.setState({ params })
  }

  handleIdentifierChange(identifier, key, value) {
    const params = Object.assign({}, this.state.params, { page: 1 })

    // create the array in params if it not already exists
    if (params[identifier] == undefined) {
      params[identifier] = []
    }

    // find the current index of key
    const index = params[identifier].indexOf(key)

    if (index == -1 && value) {
      // the key does not exist but should -> push
      params[identifier].push(key)
    } else if (index > -1 && !value) {
      // the key exists, but shouln't -> splice
      params[identifier].splice(index, 1)
    }

    this.setState({ params })
  }

  handleParamsRemove(key, value) {
    if (key == 'query') {
      this.handleSearch('')
    } else if (['all', 'after', 'before'].indexOf(key) > -1) {
      this.handleVersionChange({
        [key]: false
      })
    } else {
      this.handleIdentifierChange(key, value, false)
    }
  }

  render() {
    const { params, glossary, settings, sidebar } = this.state
    const pageSize = parseInt(settings.METADATA_PAGE_SIZE)
    const maxCount = parseInt(settings.METADATA_MAX_COUNT)

    return (
      <div className="row">
        <div className="col-lg-12">
          <Search params={params} onSubmit={this.handleSearch} onReset={this.handleReset} />
        </div>
        <div className="col-lg-3">
          <div className="card sidebar-header">
            <div className="card-header d-flex justify-content-between">
              Sidebar view:
              <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" id="tree-radio"
                       onChange={() => this.handleSidebarChange('tree')} checked={sidebar == 'tree'} />
                <label className="form-check-label" htmlFor="tree-radio">Tree</label>
              </div>
              <div className="form-check form-check-inline mr-0">
                <input className="form-check-input" type="radio" id="facets-radio"
                       onChange={() => this.handleSidebarChange('facets')} checked={sidebar == 'facets'} />
                <label className="form-check-label" htmlFor="facets-radio">Facets</label>
              </div>
            </div>
          </div>
          {sidebar == 'tree' && <Tree params={params} glossary={glossary} onTreeChange={this.handleIdentifierChange}/>}
          {sidebar == 'facets' && <Facets params={params} glossary={glossary} onFacetChange={this.handleIdentifierChange}/>}
        </div>
        <div className="col-lg-9">
          <Version params={params} onChange={this.handleVersionChange}/>
          <Results params={params}
                   pageSize={pageSize}
                   maxCount={maxCount}
                   glossary={glossary}
                   onSearch={this.handleSearch}
                   onParamsRemove={this.handleParamsRemove}
                   onLoadMore={this.handleLoadMore} />
        </div>
      </div>
    )
  }
}

export default App
