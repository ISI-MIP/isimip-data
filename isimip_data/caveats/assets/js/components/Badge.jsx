import React from 'react'
import PropTypes from 'prop-types'


const Badge = ({ label, color }) => (
  <div className={`badge rounded-pill text-bg-${color}`}>
    {label}
  </div>
)

Badge.propTypes = {
  label: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
}

export default Badge
