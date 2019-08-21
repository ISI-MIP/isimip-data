import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'

import DatasetApi from '../api/DatasetApi'


class Facet extends Component {

  constructor(props) {
    super(props)
    this.state = {
      open: false,
      items: []
    }
    this.handleChange = this.handleChange.bind(this)
    this.toggleFacet = this.toggleFacet.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (this.props.params !== prevProps.params) {
      this.fetch()
    }
  }

  fetch() {
    const { params, facet } = this.props
    const { open } = this.state

    if (open) {
      DatasetApi.fetchDatasetsFacets(facet.attribute, params).then(items => {
        this.setState({
          items
        })
      })
    }
  }

  handleChange(key, e) {
    const { facet, onChange } = this.props
    onChange(facet.attribute, key, e.target.checked)
  }

  toggleFacet() {
    const { open } = this.state
    this.setState({ open: !open }, this.fetch)
  }

  render() {
    const { params, facet } = this.props
    const { open, items } = this.state
    const checked = params[facet.attribute] || []

    let list_group
    if (open) {
      list_group = items.map((item, index) => {
        const [key, count] = item
        const id = item + '-facet-' + index
        const isChecked = (checked.indexOf(key) > -1)

        if (key !== null) {
          return (
            <li key={index} className="list-group-item facet-item d-flex justify-content-between align-items-center">
              <label className="form-check-label" htmlFor={id}>
                <input type="checkbox" className="form-check-input" id={id} checked={isChecked}
                    onChange={e => this.handleChange(key, e)} /> {key}
              </label>
              <span className="badge badge-secondary badge-pill pull-right">
                {count}
              </span>
            </li>
          )
        }
      })
    }

    return (
      <div className="card facet small">
        <div className="card-header d-flex justify-content-between align-items-center">
          {facet.title}
          <button type="button" className="btn btn-sm" onClick={this.toggleFacet}>
            {open ? <FontAwesomeIcon icon={faChevronDown} /> : <FontAwesomeIcon icon={faChevronUp} />}
          </button>
        </div>
        <ul className="list-group list-group-flush">
          {list_group}
        </ul>
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
