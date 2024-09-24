import React from 'react'
import PropTypes from 'prop-types'

const Job = ({ url }) => {
  console.log(url);
  return (
    <div>
      {url}
    </div>
  )
}

Job.propTypes = {
  url: PropTypes.string
}

export default Job
