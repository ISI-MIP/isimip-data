import React, { Component } from 'react'
import PropTypes from 'prop-types'


class Latest extends Component {

  render() {
    const { params, onChange } = this.props
    const isChecked = params.all || false

    return (
      <div className="card latest">
        <div className="card-header d-flex justify-content-between align-items-center">
          <label className="form-check-label" htmlFor="checkbox-versions">
            <input type="checkbox" className="form-check-input" id="checkbox-versions"
              checked={isChecked} onChange={e => onChange(e.target.checked)} />
              Show all versions
          </label>
        </div>
      </div>
    )
  }
}

Latest.propTypes = {
  params: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
}

export default Latest
