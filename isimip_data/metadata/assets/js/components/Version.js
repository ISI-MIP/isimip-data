import React, { Component} from 'react'
import PropTypes from 'prop-types'


class Version extends React.Component {

  render() {
    const { value, onChange } = this.props

    return (
      <div className="form-check form-check-inline">
        <input className="form-check-input" type="checkbox" id="show-all-checkbox"
               checked={value} onChange={e => onChange(!value)} />
        <label className="form-check-label" htmlFor="show-all-checkbox">Show older versions</label>
      </div>
    )
  }
}

export default Version
