import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty, uniqueId } from 'lodash'

const Var = ({ value, errors, onChange }) => {
  const id = uniqueId('download-form-input-var-')

  return (
    <div className="col-lg-4">
      <label className="mb-0" htmlFor={id}>Mask variable</label>
      <input className={'form-control mb-2 ' +  (!isEmpty(errors) && 'is-invalid')}
          type="text" id={id} placeholder="Mask variable"
          value={value} onChange={event => onChange(event.target.value)} />
    </div>
  )
}

Var.propTypes = {
  value: PropTypes.string,
  errors: PropTypes.array,
  onChange: PropTypes.func.isRequired
}

export default Var
