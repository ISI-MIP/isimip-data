import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { uniqueId } from 'lodash'

const Checkbox = ({ children, className, checked, onChange }) => {
  const id = uniqueId('checkbox')

  return (
    <div className={classNames("form-check", className)}>
      <input className="form-check-input" type="checkbox" id={id} checked={checked} onChange={onChange} />
      <label className="form-check-label" htmlFor={id}>
        {children}
      </label>
    </div>
  )
}

Checkbox.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
}

export default Checkbox
