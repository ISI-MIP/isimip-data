import React, { Component } from 'react'
import PropTypes from 'prop-types'


class Point extends Component {

  constructor(props) {
    super(props)
    this.state = {
      error: ''
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(e, index) {
    const { name, point, onChange, onSelect } = this.props

    if (e.target.value) {
      point[index] = parseFloat(e.target.value)
    } else {
      point[index] = ''
    }

    onSelect(name)
    onChange(point)
  }

  render() {
    const { name, task, point, pointError, onSelect, label, help } = this.props
    const [ lat, lon ] = point
    const htmlId = 'check-' + name
    const checked = (task == name)

    return (
      <div className="row download-row align-items-center">
        <div className="col-lg-4 mb-2">
          <div className="form-check mb-0">
            <input className="form-check-input" type="radio" id={htmlId}
                onChange={() => onSelect(name)} checked={checked} />

            <label className="form-check-label" htmlFor={htmlId}>{label}</label>
          </div>
        </div>
        <div className="col-lg-2 mb-2">
          <input className={'form-control download-form-input-point ' + (checked && pointError && 'is-invalid')}
              type="number" placeholder="Latitude" min="-90" max="90" step="any"
              value={checked && lat} onChange={e => this.handleChange(e, 0)} />
        </div>
        <div className="col-lg-2 mb-2">
          <input className={'form-control download-form-input-point ' + (checked && pointError && 'is-invalid')}
              type="number" placeholder="Longitude" min="-180" max="180" step="any"
              value={checked && lon} onChange={e => this.handleChange(e, 1)} />
        </div>
        <div className="col-lg-12 mb-2">
          <p className="text-muted small" dangerouslySetInnerHTML={{__html: help}}></p>
        </div>
        {checked && pointError &&
          <div className="col-lg-12 mb-2">
            <p className="text-danger">{pointError}</p>
          </div>
        }
      </div>
    )
  }
}

Point.propTypes = {
  name: PropTypes.string.isRequired,
  task: PropTypes.string.isRequired,
  point: PropTypes.array.isRequired,
  pointError: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  help: PropTypes.string
}

export default Point
