import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

const Errors = ({ errors }) => {
  if (isEmpty(errors)) {
    return null
  } else {
    return (
      <div className="text-center mt-2">
        {
          errors.non_field_errors ? (
            errors.non_field_errors.map((error, index) => <p className="text-danger" key={index}>{error}</p>)
          ) : (
            <p className="text-danger">
              There has been an error with your request, please correct the errors above.
            </p>
          )
        }

      </div>
    )
  }
}

Errors.propTypes = {
  errors: PropTypes.object
}

export default Errors
