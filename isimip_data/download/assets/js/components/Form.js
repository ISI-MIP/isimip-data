import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { isEmpty, isNil, isUndefined } from 'lodash'

import { useLsState } from 'isimip_data/core/assets/js/hooks/ls'
import { useSettingsQuery } from 'isimip_data/core/assets/js/hooks/queries'

import Errors from './form/Errors'
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

    const uploads = []
    const data = {
      paths,
      operations: operations.reduce((operations, operation) => {
        const { mask, shape, ...values } = operation

        switch (operation.operation) {
          case 'mask_mask':
            uploads.push(mask)
            return [...operations, { ...values, mask: mask.name }]

          case 'mask_shape':
            uploads.push(shape)
            return [
              ...operations,
              {
                operation: 'create_mask',
                shape: shape.name,
                mask: shape.name + '.nc'
              },
              {
                operation: 'mask_mask',
                mask: shape.name + '.nc',
                var: `m_${values.layer}`
              }
            ]

          default:
            return [...operations, values]
        }
      }, [])
    }

    mutation.mutate({
      url: settings.FILES_API_URL,
      data,
      uploads,
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
      <div className="mt-4 mb-3 text-center">
        <button className="btn btn-primary btn-lg" disabled={isEmpty(paths) || isEmpty(operations)}
                onClick={handleSubmit}>
          Start download job
        </button>
      </div>
      <Errors errors={errors} />
    </form>
  )
}

Form.propTypes = {
  files: PropTypes.array,
  setJob: PropTypes.func.isRequired
}

export default Form
