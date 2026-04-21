import React from 'react'
import PropTypes from 'prop-types'


const Versions = ({ caveat }) => {
  if (caveat.version_after && caveat.version_before) {
    return (
      <>
        <span className="badge text-bg-dark">{caveat.version_after}</span>
        {'-'}
        <span className="badge text-bg-dark">{caveat.version_before}</span>
      </>
    )
  } else if (caveat.version_after) {
    return (
      <>after <span className="badge text-bg-dark">{caveat.version_after}</span></>
    )
  } else if (caveat.version_before) {
    return (
      <>before <span className="badge text-bg-dark">{caveat.version_before}</span></>
    )
  } else {
    return 'all versions affected'
  }
}

Versions.propTypes = {
  caveat: PropTypes.object.isRequired
}

export default Versions
