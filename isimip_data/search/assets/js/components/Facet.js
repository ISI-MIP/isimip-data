import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ls from 'local-storage'

import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Tooltip from "react-bootstrap/Tooltip"

import DatasetApi from 'isimip_data/metadata/assets/js/api/DatasetApi'

import { getValueOrNull } from 'isimip_data/core/assets/js/utils/object'


class Facet extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isOpen: false,
      isLoading: false,
      items: []
    }
    this.handleChange = this.handleChange.bind(this)
    this.toggleFacet = this.toggleFacet.bind(this)
    this.abortController = new AbortController()
  }

  componentDidMount() {
    const { facet } = this.props
    const isOpen = ls.get(`facet.${facet.identifier}.isOpen`)

    if (isOpen) {
      this.toggleFacet()
    }
  }

  componentWillUnmount(){
    this.abortController.abort()
  }

  componentDidUpdate(prevProps) {
    if (this.state.isOpen && this.props.params !== prevProps.params) {
      this.fetch()
    }
  }

  fetch() {
    const { params, facet } = this.props
    const { isOpen } = this.state

    if (isOpen) {
      this.setState({ isLoading: true })
      DatasetApi.fetchDatasetsHistogram(facet.identifier, params, {
        signal: this.abortController.signal
      }).then(items => {
        this.setState({
          isLoading: false,
          items: items
        })
      })
    }
  }

  handleChange(key, e) {
    const { facet, onChange } = this.props
    onChange(facet.identifier, key, e.target.checked)
  }

  toggleFacet() {
    const { facet } = this.props
    const { isOpen } = this.state
    ls.set(`facet.${facet.identifier}.isOpen`, !isOpen)
    this.setState({ isOpen: !isOpen }, this.fetch)
  }

  renderTooltip(properties) {
    if (properties && (properties.long_name || properties.description || properties.warning)) {
      return (
        <Tooltip>
          {properties.long_name}
          {properties.description && (<p>{properties.description}</p>)}
          {properties.warning && (<p>Warning: {properties.warning}</p>)}
        </Tooltip>
      )
    }
  }

  filterUrls(urls) {
    let filteredUrls = []
    if (urls) {
      Object.keys(urls).forEach(key => {
        if (window.location.href.includes(key)) {
          filteredUrls.push(key)
        }
      })
      if (filteredUrls.length == 0) {
        filteredUrls.push(Object.keys(urls).sort().at(-1))
      }
    }

    return filteredUrls
  }

  renderListItem(identifier, specifier, title, isChecked, urls, count) {
    const id = 'facet-' + identifier + '-' + specifier
    const filteredUrls = this.filterUrls(urls)

    return (
      <li key={specifier} className="list-group-item facet-item d-flex align-items-center">
        <label className="form-check-label" htmlFor={id}>
          <input type="checkbox" className="form-check-input" id={id}
                 checked={isChecked} onChange={e => this.handleChange(specifier, e)} />
            {title || specifier}
        </label>
        {filteredUrls.map((key, index) => {
          return (
            <a key={index} className={'ml-1'.concat(index == 0 ? ' ml-auto' : '')} href={urls[key]}
               target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>
              <OverlayTrigger placement="bottom" overlay={<Tooltip>More information is available in the {key} protocol.</Tooltip>}>
                <span className="material-symbols-rounded">quick_reference_all</span>
              </OverlayTrigger>
            </a>
          )
        })}
        <span className={'badge badge-secondary badge-pill '.concat(filteredUrls.length > 0 ? 'ml-1' : 'ml-auto')}>
          {count}
        </span>
      </li>
    )
  }

  renderListGroup(identifier, items, checked) {
    const { glossary } = this.props

    return (
      <ul className="list-group list-group-flush">
        {
          items.map((item) => {
            const [specifier, count] = item
            const properties = getValueOrNull(glossary, identifier, specifier)
            const title = properties ? properties.title : null
            const urls = properties ? properties.urls : null

            if (specifier !== null) {
              const isChecked = (checked.indexOf(specifier) > -1)
              const tooltip = this.renderTooltip(properties)

              if (tooltip) {
                return (
                  <OverlayTrigger key={specifier} placement="right" overlay={tooltip}>
                    {this.renderListItem(identifier, specifier, title, isChecked, urls, count)}
                  </OverlayTrigger>
                )
              } else {
                return this.renderListItem(identifier, specifier, title, isChecked, urls, count)
              }
            }
          })
        }
      </ul>
    )
  }

  renderEmpty() {
    return (
      <div className="card-body text-center">
        <span className="material-symbols-rounded">block</span>
      </div>
    )
  }

  renderSpinner() {
    return (
      <div className="card-body text-center">
        <span className="material-symbols-rounded symbols-spin">progress_activity</span>
      </div>
    )
  }

  render() {
    const { params, facet } = this.props
    const { isOpen, isLoading, items } = this.state
    const checked = params[facet.identifier] || []
    const isChecked = checked.length > 0
    const isEmpty = (items.length == 0) || (items.length == 1 && items[0][0] == null)

    return (
      <>
        <div className="card-header d-flex justify-content-between align-items-center" onClick={this.toggleFacet}>
          {facet.title}
          <div>
            {isChecked && <span className="material-symbols-rounded symbols-check text-secondary">check_box</span>}
            {isOpen ? <span className="material-symbols-rounded symbols-expand">expand_less</span>
                    : <span className="material-symbols-rounded symbols-expand">expand_more</span>}
          </div>
        </div>
        {isOpen && !isEmpty && this.renderListGroup(facet.identifier, items, checked)}
        {isOpen && isEmpty && !isLoading && this.renderEmpty()}
        {isOpen && isEmpty && isLoading && this.renderSpinner()}
      </>
    )
  }
}

Facet.propTypes = {
  params: PropTypes.object.isRequired,
  facet: PropTypes.object.isRequired,
  glossary: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
}

export default Facet
