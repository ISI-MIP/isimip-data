import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Dropdown as BootstrapDropdown } from 'bootstrap'

const Dropdown = ({ dropdown, label, className, disabled, children }) => {
  const ref = useRef(null)

  useEffect(() => {
    const dropdown = new BootstrapDropdown(ref.current, {})
    return () => dropdown.dispose()
  }, [])

  // show/hide the dropdown on when show changes
  useEffect(() => {
    const instance = BootstrapDropdown.getInstance(ref.current)
    if (dropdown.display) {
      instance.show()
    } else {
      instance.hide()
    }
  }, [dropdown.display])

  // close the dropdown on a click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdown.display && ref.current && !ref.current.contains(event.target)) {
        dropdown.hide()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdown])

  return (
    <div ref={ref} className="dropdown">
      <button
        type="button"
        className={className}
        disabled={disabled}
        data-bs-toggle="dropdown"
        aria-expanded="false"
        onClick={() => dropdown.toggle()}
      >
        {label}
      </button>
      <div className="dropdown-menu">
        {children}
      </div>
    </div>
  )
}

Dropdown.propTypes = {
  dropdown: PropTypes.object.isRequired,
  label: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  children: PropTypes.node
}

export default Dropdown
