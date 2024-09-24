import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty, uniqueId } from 'lodash'

const Point = ({ point, errors, onChange }) => {
  const [ lat, lon ] = point

  const latId = uniqueId('download-form-input-point-lat-')
  const lonId = uniqueId('download-form-input-point-lon-')

  const handleChange = (event, index) => {
    point[index] = (event.target.value) ? parseFloat(event.target.value) : ''
    onChange(point)
  }

  const handleWheel = (event) => {
    event.target.blur()
  }

  return (
    <div className="form-row align-items-center">
      <div className="col-lg-4">
        <label className="mb-0" htmlFor={latId}>Latitude</label>
        <input className={'form-control download-form-input-point mb-2 ' +  (!isEmpty(errors) && 'is-invalid')}
            type="number" id={latId} placeholder="Latitude" min="-90" max="90" step="any"
            value={lat} onChange={event => handleChange(event, 0)} />
      </div>
      <div className="col-lg-4">
        <label className="mb-0" htmlFor={lonId}>Longitude</label>
        <input className={'form-control download-form-input-point mb-2 ' +  (!isEmpty(errors) && 'is-invalid')}
            type="number" id={lonId} placeholder="Longitude" min="-180" max="180" step="any"
            value={lon} onChange={event => handleChange(event, 1)} />
      </div>
    </div>
  )
}

Point.propTypes = {
  point: PropTypes.array.isRequired,
  errors: PropTypes.array,
  onChange: PropTypes.func.isRequired
}

export default Point
