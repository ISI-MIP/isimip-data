import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty, uniqueId } from 'lodash'

const Mean = ({ checked, errors, onChange }) => {
  const id = uniqueId('download-form-input-mean-')

  return (
    <div className="col-lg-12">
      <div className="form-check mb-2">
        <input className="form-check-input" type="checkbox" id={id} checked={checked}
               onChange={event => onChange(event.target.checked)} />
        <label className="form-check-label font-weight-normal" htmlFor={id}>
          Compute the field mean using the <code>-fldmean</code> operator
        </label>
      </div>
    </div>
  )
}

Mean.propTypes = {
  checked: PropTypes.bool.isRequired,
  errors: PropTypes.array,
  onChange: PropTypes.func.isRequired
}

export default Mean
