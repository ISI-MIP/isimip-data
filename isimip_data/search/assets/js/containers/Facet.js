import React, { Component } from 'react'
import PropTypes from 'prop-types'

import DatasetApi from '../api/DatasetApi'


class Facet extends Component {

  constructor(props) {
    super(props)
    this.state = { items: [] }
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.fetch()
  }

  componentDidUpdate(prevProps) {
    if (this.props.params !== prevProps.params) {
      this.fetch()
    }
  }

  fetch() {
    const { params, facet } = this.props

    DatasetApi.fetchDatasetsFacets(facet.attribute, params).then(items => {
      this.setState({
        items
      })
    })
  }

  handleChange(key, e) {
    const { facet, onChange } = this.props
    onChange(facet.attribute, key, e.target.checked)
  }

  render() {
    const { params, facet } = this.props
    const { items } = this.state
    const checked = params[facet.attribute] || []

    return (
      <div className="card facet small">
        <div className="card-header d-flex justify-content-between align-items-center">
          {facet.title}
          <i className="fas fa-chevron-up"></i>
        </div>
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
