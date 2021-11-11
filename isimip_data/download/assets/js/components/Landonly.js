import React, { Component } from 'react'
import PropTypes from 'prop-types'


class Landonly extends Component {

  render() {
    const { name, task, onSelect, label, help } = this.props
    const htmlId = 'check-' + name
    const checked = (task == name)

    return (
      <div className="row download-row align-items-center">
        <div className="col-md-4 mb-2">
          <div className="form-check mb-0">
            <input className="form-check-input" type="radio" name="landonly" id={htmlId}
                onChange={() => onSelect(name)} checked={checked} />

            <label className="form-check-label" htmlFor={htmlId}>{label}</label>
          </div>
        </div>
        <div className="col-lg-12">
          <p className="text-muted small" dangerouslySetInnerHTML={{__html: help}}></p>
        </div>
      </div>
    )
  }
}

Landonly.propTypes = {
  name: PropTypes.string.isRequired,
  task: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  help: PropTypes.string
}

export default Landonly
