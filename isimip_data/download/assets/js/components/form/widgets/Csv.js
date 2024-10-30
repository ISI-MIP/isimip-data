import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty, uniqueId } from 'lodash'

const Csv = ({ checked, errors, onChange }) => {
  const id = uniqueId('download-form-input-csv-')

  return (
    <div className="col-lg-12">
      <div className="form-check mb-2">
        <input className="form-check-input" type="checkbox" id={id} checked={checked}
               onChange={event => onChange(event.target.checked)} />
        <label className="form-check-label font-weight-normal" htmlFor={id}>
          Create CSV using <code>-s outputtab,date,value,nohead</code> and the Python CSV module
        </label>
      </div>
    </div>
  )
}

Csv.propTypes = {
  checked: PropTypes.bool.isRequired,
  errors: PropTypes.array,
  onChange: PropTypes.func.isRequired
}

export default Csv
