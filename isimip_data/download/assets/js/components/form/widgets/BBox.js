import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty, uniqueId } from 'lodash'

const BBox = ({ bbox, errors, onChange }) => {
  const [ west, east, south, north ] = bbox

  const westId = uniqueId('download-form-input-bbox-west-')
  const eastId = uniqueId('download-form-input-bbox-east-')
  const southId = uniqueId('download-form-input-bbox-south-')
  const northId = uniqueId('download-form-input-bbox-north-')

  const handleChange = (event, index) => {
    bbox[index] = (event.target.value) ? parseFloat(event.target.value) : ''
    onChange(bbox)
  }

  const handleWheel = (event) => {
    event.target.blur()
  }

  return <>
    <div className="col-lg-2">
      <label className="mb-0" htmlFor={westId}>West</label>
      <input className={'form-control download-form-input-bbox mb-2 ' + (!isEmpty(errors) && 'is-invalid')}
          type="number" id={westId} placeholder="West" min="-180" max="180" step="any"
          value={west} onChange={event => handleChange(event, 0)} onWheel={handleWheel} />
    </div>
    <div className="col-lg-2">
      <label className="mb-0" htmlFor={eastId}>East</label>
      <input className={'form-control download-form-input-bbox mb-2 ' + (!isEmpty(errors) && 'is-invalid')}
          type="number" id={eastId} placeholder="East" min="-180" max="180" step="any"
          value={east} onChange={event => handleChange(event, 1)} onWheel={handleWheel} />
    </div>
    <div className="col-lg-2">
      <label className="mb-0" htmlFor={southId}>South</label>
      <input className={'form-control download-form-input-bbox mb-2 ' + (!isEmpty(errors) && 'is-invalid')}
          type="number" id={southId} placeholder="South" min="-90" max="90" step="any"
          value={south} onChange={event => handleChange(event, 2)} onWheel={handleWheel} />
    </div>
    <div className="col-lg-2">
      <label className="mb-0" htmlFor={northId}>North</label>
      <input className={'form-control download-form-input-bbox mb-2 ' + (!isEmpty(errors) && 'is-invalid')}
          type="number" id={northId} placeholder="North" min="-90" max="90" step="any"
          value={north} onChange={event => handleChange(event, 3)} onWheel={handleWheel} />
    </div>
  </>
}

BBox.propTypes = {
  bbox: PropTypes.array.isRequired,
  errors: PropTypes.array,
  onChange: PropTypes.func.isRequired
}

export default BBox
