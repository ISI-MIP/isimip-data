import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp, faChevronDown, faSpinner } from '@fortawesome/free-solid-svg-icons'

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
    if (open && this.props.params !== prevProps.params) {
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

  renderListGroup(items, checked) {
    if (items.length > 0) {
      return (
        <ul className="list-group list-group-flush">
          {
            items.map((item, index) => {
              const [key, count] = item
              const id = item + '-facet-' + index
              const isChecked = (checked.indexOf(key) > -1)

              if (key !== null) {
                return (
                  <li key={index} className="list-group-item facet-item d-flex justify-content-between align-items-center">
                    <label className="form-check-label" htmlFor={id}>
                      <input type="checkbox" className="form-check-input" id={id}
                             checked={isChecked} onChange={e => this.handleChange(key, e)} /> {key}
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
    } else {
      return (
        <div class="card-body text-center">
          <FontAwesomeIcon icon={faSpinner} spin />
        </div>
      )
    }
  }

  render() {
    const { params, facet } = this.props
    const { open, items } = this.state
    const checked = params[facet.attribute] || []

    return (
      <div className="card facet">
        <div className="card-header d-flex justify-content-between align-items-center"  onClick={this.toggleFacet}>
          {facet.title}
          {open ? <FontAwesomeIcon icon={faChevronDown} /> : <FontAwesomeIcon icon={faChevronUp} />}
        </div>
        {open ? this.renderListGroup(items, checked) : ''}
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
