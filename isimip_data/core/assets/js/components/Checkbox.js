import React from 'react'
import PropTypes from 'prop-types'
import { uniqueId } from 'lodash'

const Checkbox = ({ children, checked, onChange }) => {
  const id = uniqueId('checkbox')

  return (
    <div className="form-check mb-0">
      <input className="form-check-input" type="checkbox" id={id} checked={checked} onChange={onChange} />
      <label className="form-check-label" htmlFor={id}>
        {children}
      </label>
    </div>
  )
}

Checkbox.propTypes = {
  children: PropTypes.node,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
}

export default Checkbox
