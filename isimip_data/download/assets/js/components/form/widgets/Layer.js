import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty, uniqueId } from 'lodash'

const Layer = ({ value, errors, onChange }) => {
  const id = uniqueId('download-form-input-layer-')

  return (
    <div className="col-lg-4">
      <label className="mb-0" htmlFor={id}>Layer</label>
      <input className={'form-control mb-2 ' +  (!isEmpty(errors) && 'is-invalid')}
          type="number" id={id} placeholder="Layer"
          value={value} onChange={event => onChange(event.target.value)} />
    </div>
  )
}

Layer.propTypes = {
  value: PropTypes.number,
  errors: PropTypes.array,
  onChange: PropTypes.func.isRequired
}

export default Layer
