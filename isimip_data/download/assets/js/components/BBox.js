import React, { Component } from 'react'
import PropTypes from 'prop-types'


class BBox extends Component {

  constructor(props) {
    super(props)
    this.state = {
      error: ''
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(e, index) {
    const { name, bbox, onChange, onSelect } = this.props

    if (e.target.value) {
      bbox[index] = parseFloat(e.target.value)
    } else {
      bbox[index] = ''
    }

    onSelect(name)
    onChange(bbox)
  }

  render() {
    const { name, task, bbox, bboxError, onSelect, label, help } = this.props
    const [ south, north, west, east ] = bbox
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
          <input className={'form-control download-form-input-bbox ' + (checked && bboxError && 'is-invalid')}
              type="number" placeholder="South" min="-90" max="90" step="any"
              value={checked && south} onChange={e => this.handleChange(e, 0)} />
        </div>
        <div className="col-lg-2 mb-2">
          <input className={'form-control download-form-input-bbox ' + (checked && bboxError && 'is-invalid')}
              type="number" placeholder="North" min="-90" max="90" step="any"
              value={checked && north} onChange={e => this.handleChange(e, 1)} />
        </div>
        <div className="col-lg-2 mb-2">
          <input className={'form-control download-form-input-bbox ' + (checked && bboxError && 'is-invalid')}
              type="number" placeholder="West" min="-180" max="180" step="any"
              value={checked && west} onChange={e => this.handleChange(e, 2)} />
        </div>
        <div className="col-lg-2 mb-2">
          <input className={'form-control download-form-input-bbox ' + (checked && bboxError && 'is-invalid')}
              type="number" placeholder="East" min="-180" max="180" step="any"
              value={checked && east} onChange={e => this.handleChange(e, 3)} />
        </div>
        <div className="col-lg-12">
          {checked && bboxError && <p className="text-danger">{bboxError}</p>}
          <p className="text-muted small" dangerouslySetInnerHTML={{__html: help}}></p>
        </div>
      </div>
    )
  }
}

BBox.propTypes = {
  name: PropTypes.string.isRequired,
  task: PropTypes.string.isRequired,
  bbox: PropTypes.array.isRequired,
  bboxError: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  help: PropTypes.string
}

export default BBox
