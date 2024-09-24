import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Operations from './form/Operations'
import Selection from './form/Selection'

const Form = ({ files }) => {
  const [values, setValues] = useState({
    paths: [...files.map(file => file.path)],
    operations: []
  })
  const [errors, setErrors] = useState({})

  const handleSubmit = () => {
    console.log('handleSubmit', values)
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Selection files={files} values={values} errors={errors} setValues={setValues} />
      <Operations files={files} values={values} errors={errors} setValues={setValues} />
    </form>
  )
}

Form.propTypes = {
  files: PropTypes.array
}

export default Form
