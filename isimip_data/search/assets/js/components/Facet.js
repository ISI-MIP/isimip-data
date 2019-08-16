import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Facet extends Component {

  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(key, e) {
    const { facet, onChange } = this.props
    onChange(facet.attribute, key, e.target.checked)
  }

  render() {
    const { facet, checked } = this.props

    const facet_items = facet.items.map((item, index) => {
      const [key, count] = item
      const id = item + '-facet-' + index
      const isChecked = (checked.indexOf(key) > -1)

      return (
        <li key={index} className="list-group-item facet-item d-flex justify-content-between align-items-center">
          <label className="form-check-label" htmlFor={id}>
            <input type="checkbox" className="form-check-input" id={id} checked={isChecked}
                onChange={e => this.handleChange(key, e)} /> {key}
          </label>
          <span className="badge badge-secondary badge-pill pull-right">{count}</span>
        </li>
      )
    })

    return (
      <div className="card facet small">
        <div className="card-header d-flex justify-content-between align-items-center">
          {facet.title}
          <i className="fas fa-chevron-up"></i>
        </div>
        <ul className="list-group list-group-flush">
          {facet_items}
        </ul>
      </div>
    )
  }
}

Facet.propTypes = {
  facet: PropTypes.object.isRequired,
  checked: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
}

export default Facet
