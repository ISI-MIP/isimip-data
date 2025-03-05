import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { isEmpty, isNil, isNumber, isUndefined } from 'lodash'

import { useLsState } from 'isimip_data/core/assets/js/hooks/ls'
import { useSettingsQuery } from 'isimip_data/core/assets/js/hooks/queries'

import Errors from './form/Errors'
import Note from './form/Note'
import Operations from './form/Operations'
import Paths from './form/Paths'

import { useSubmitJobMutation } from '../hooks/mutations'

const Form = ({ files, setJob }) => {
  const { data: settings } = useSettingsQuery()
  const mutation = useSubmitJobMutation()

  const [errors, setErrors] = useState({})
  const [paths, setPaths] = useState([...files.map(file => file.path)])
  const [operations, setOperations] = useLsState('operations', [])

  // get all resolutions from the operations
  const resolutions = isUndefined(settings) ? null : (
    settings.DOWNLOAD_OPERATIONS.reduce((resolutions, operation) => [
      ...resolutions, ...operation.resolutions.filter(r => !resolutions.includes(r))
    ], [])
  )

  // filter the operations with respect to the resolution of the files
  const operationsConfig = isUndefined(settings) ? null : (
    settings.DOWNLOAD_OPERATIONS.filter(operation => (
      files.every(file => operation.resolutions.concat(undefined).includes(file.specifiers.resolution))
    ))
  )

  // remove operations if they are not in operationsConfig
  useEffect(() => {
    if (!isNil(operationsConfig)) {
      setOperations(operations.filter(operation => (
        operationsConfig.map(o => o.operation).includes(operation.operation)
      )))
    }
  }, [settings])

  const handleSubmit = (event) => {
    event.preventDefault()

    let errors = {}
    operations.forEach((operation) => {
      if (!isUndefined(operation.bbox) && operation.bbox.some(v => !isNumber(v))) {
        errors = { ...errors, bbox: settings.DOWNLOAD_ERRORS.bbox }
      }
      if (!isUndefined(operation.point) && operation.point.some(v => !isNumber(v))) {
        errors = { ...errors, point: settings.DOWNLOAD_ERRORS.point }
      }
      if (!isUndefined(operation.country) && isEmpty(operation.country)) {
        errors = { ...errors, country: settings.DOWNLOAD_ERRORS.country }
      }
      if (!isUndefined(operation.mask) && isNil(operation.mask)) {
        errors = { ...errors, mask: settings.DOWNLOAD_ERRORS.mask }
      }
      if (!isUndefined(operation.shape) && isNil(operation.shape)) {
        errors = { ...errors, shape: settings.DOWNLOAD_ERRORS.shape }
      }
      if (!isUndefined(operation.var) && isEmpty(operation.var)) {
        errors = { ...errors, var: settings.DOWNLOAD_ERRORS.var }
      }
      if (!isUndefined(operation.layer) && !isNumber(operation.layer)) {
        errors = { ...errors, layer: settings.DOWNLOAD_ERRORS.layer }
      }
    })

    if (isEmpty(errors)) {
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
    } else {
      setErrors(errors)
    }
  }

  return settings && (
    isEmpty(operationsConfig) ? (
      <Note files={files} resolutions={resolutions}/>
    ): (
      <form onSubmit={handleSubmit} noValidate>
        <Paths
          files={files}
          errors={errors}
          paths={paths}
          setPaths={setPaths}
        />
        <Operations
          operationsConfig={operationsConfig}
          operationsHelp={settings.DOWNLOAD_OPERATIONS_HELP}
          operations={operations}
          errors={errors}
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
  )
}

Form.propTypes = {
  files: PropTypes.array,
  setJob: PropTypes.func.isRequired
}

export default Form
