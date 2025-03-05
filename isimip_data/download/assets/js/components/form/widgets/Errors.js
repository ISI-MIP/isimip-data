import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

const Errors = ({ errors }) => {
  if (isEmpty(errors)) {
    return null
  } else {
    return (
      <ul className="text-danger list-unstyled mb-2">
        {
          errors.map((error, errorIndex) => <li key={errorIndex}>{error}</li>)
        }
      </ul>
    )
  }
}

Errors.propTypes = {
  errors: PropTypes.array
}

export default Errors
