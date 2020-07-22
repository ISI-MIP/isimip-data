import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ls from 'local-storage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp, faChevronDown, faSpinner, faCheckSquare, faBan } from '@fortawesome/free-solid-svg-icons'

import DatasetApi from 'isimip_data/metadata/assets/js/api/DatasetApi'


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
    const isOpen = ls.get(`facet.${facet.attribute}.isOpen`)

    if (isOpen) {
      this.toggleFacet()
    }
  }

  componentWillUnmount(){
    this.abortController.abort();
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
      DatasetApi.fetchDatasetsHistogram(facet.attribute, params, {
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
    onChange(facet.attribute, key, e.target.checked)
  }

  toggleFacet() {
    const { facet } = this.props
    const { isOpen } = this.state
    ls.set(`facet.${facet.attribute}.isOpen`, !isOpen)
    this.setState({ isOpen: !isOpen }, this.fetch)
  }

  renderListGroup(attribute, items, checked) {
    const { glossary } = this.props

    return (
      <ul className="list-group list-group-flush">
        {
          items.map((item, index) => {
            const [specifier, count] = item
            const id = item + '-facet-' + index
            const isChecked = (checked.indexOf(specifier) > -1)

            if (specifier !== null) {
              let properties = {}
              if (glossary[attribute] && glossary[attribute][specifier]) {
                properties = glossary[attribute][specifier]
              }

              return (
                <li key={index} className="list-group-item facet-item d-flex justify-content-between align-items-center">
                  <label className="form-check-label" htmlFor={specifier}>
                    <input type="checkbox" className="form-check-input" id={specifier}
                           checked={isChecked} onChange={e => this.handleChange(specifier, e)} />
                      {properties.title || specifier}
                  </label>
                  <span className="badge badge-secondary badge-pill pull-right">
                    {count}
                  </span>
                </li>
              )
            }
          })
        }
      </ul>
    )
  }

  renderEmpty() {
    return (
      <div className="card-body text-center">
        <FontAwesomeIcon icon={faBan} />
      </div>
    )
  }

  renderSpinner() {
    return (
      <div className="card-body text-center">
        <FontAwesomeIcon icon={faSpinner} spin />
      </div>
    )
  }

  render() {
    const { params, facet, glossary } = this.props
    const { isOpen, isLoading, items } = this.state
    const checked = params[facet.attribute] || []
    const isChecked = checked.length > 0
    const isEmpty = (items.length == 0) || (items.length == 1 && items[0][0] == null)

    return (
      <div className="card facet">
        <div className="card-header d-flex justify-content-between align-items-center" onClick={this.toggleFacet}>
          {facet.title}
          <div>
            {isChecked && <FontAwesomeIcon className="facet-check text-secondary" icon={faCheckSquare} />}
            {isOpen ? <FontAwesomeIcon icon={faChevronDown} /> : <FontAwesomeIcon icon={faChevronUp} />}
          </div>
        </div>
        {isOpen && !isEmpty && this.renderListGroup(facet.attribute, items, checked)}
        {isOpen && isEmpty && !isLoading && this.renderEmpty()}
        {isOpen && isEmpty && isLoading && this.renderSpinner()}
      </div>
    )
  }
}

Facet.propTypes = {
  params: PropTypes.object.isRequired,
  facet: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
}

export default Facet
