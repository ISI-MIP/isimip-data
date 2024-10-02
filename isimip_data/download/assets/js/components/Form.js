import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import { useLsState } from 'isimip_data/core/assets/js/hooks/ls'
import { useSettingsQuery } from 'isimip_data/core/assets/js/hooks/queries'

import Operations from './form/Operations'
import Paths from './form/Paths'

import { useSubmitJobMutation } from '../hooks/mutations'

const Form = ({ files, setJob }) => {
  const { data: settings } = useSettingsQuery()
  const mutation = useSubmitJobMutation()

  const [errors, setErrors] = useState({})
  const [paths, setPaths] = useState([...files.map(file => file.path)])
  const [operations, setOperations] = useLsState('operations', [])

  const handleSubmit = (event) => {
    event.preventDefault()
    mutation.mutate({
      url: settings.FILES_API_URL,
      data: {
        paths,
        operations
      },
      setErrors,
      setJob
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Paths
        files={files}
        errors={errors}
        paths={paths}
        setPaths={setPaths}
      />
      <Operations
        files={files}
        errors={errors}
        operations={operations}
        setOperations={setOperations}
      />
      <div className="mb-3 text-center">
        <button className="btn btn-primary btn-lg" disabled={isEmpty(paths) || isEmpty(operations)}
                onClick={handleSubmit}>
          Start download job
        </button>
      </div>
    </form>
  )
}

Form.propTypes = {
  files: PropTypes.array,
  setJob: PropTypes.func.isRequired
}

export default Form
