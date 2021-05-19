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
    const { bbox, onChange, onSelect } = this.props

    if (e.target.value) {
      bbox[index] = parseInt(e.target.value)
    } else {
      bbox[index] = ''
    }

    onSelect('bbox')
    onChange(bbox)
  }

  render() {
    const { selected, bbox, bboxError, onSelect, help } = this.props
    const [ south, north, west, east ] = bbox

    return (
      <div className="row download-row align-items-center">
        <div className="col-lg-4 mb-2">
          <div className="form-check mb-0">
            <input className="form-check-input" type="radio" name="country" id="check-bbox"
                onChange={() => onSelect('bbox')} checked={selected == 'bbox'} />

            <label className="form-check-label" htmlFor="check-bbox">Mask by bounding box</label>
          </div>
        </div>
        <div className="col-lg-2 mb-2">
          <input className={'form-control download-form-input-bbox ' + (bboxError && 'is-invalid')}
              type="number" placeholder="South" min="-90" max="90"
              value={south} onChange={e => this.handleChange(e, 0)} />
        </div>
        <div className="col-lg-2 mb-2">
          <input className={'form-control download-form-input-bbox ' + (bboxError && 'is-invalid')}
              type="number" placeholder="North" min="-90" max="90"
              value={north} onChange={e => this.handleChange(e, 1)} />
        </div>
        <div className="col-lg-2 mb-2">
          <input className={'form-control download-form-input-bbox ' + (bboxError && 'is-invalid')}
              type="number" placeholder="West" min="-180" max="180"
              value={west} onChange={e => this.handleChange(e, 2)} />
        </div>
        <div className="col-lg-2 mb-2">
          <input className={'form-control download-form-input-bbox ' + (bboxError && 'is-invalid')}
              type="number" placeholder="East" min="-180" max="180"
              value={east} onChange={e => this.handleChange(e, 3)} />
        </div>
        <div className="col-lg-12 mb-2">
          <p className="text-muted small" dangerouslySetInnerHTML={{__html: help}}></p>
        </div>
        {bboxError &&
          <div className="col-lg-12 mb-2">
            <p className="text-danger">{bboxError}</p>
          </div>
        }
      </div>
    )
  }
}

BBox.propTypes = {
  selected: PropTypes.string.isRequired,
  bbox: PropTypes.array.isRequired,
  bboxError: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired
}

export default BBox
