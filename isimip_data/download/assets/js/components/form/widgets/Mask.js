import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDropzone } from 'react-dropzone'
import { isEmpty, isNil, uniqueId } from 'lodash'

const Mask = ({ values, errors, onChange }) => {
  const fileId = uniqueId('download-form-input-file-')
  const maskId = uniqueId('download-form-input-mask-')
  const varId = uniqueId('download-form-input-var-')

  const [dropzoneError, setDropzoneError] = useState('')

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/x-hdf': ['.nc', '.nc4'],
      'application/json': ['.json'],
      'application/zip': ['.zip']
    },
    onDropAccepted: acceptedFiles => {
      if (acceptedFiles.length > 0) {
        onChange({ file: acceptedFiles[0] })
        setDropzoneError('')
      }
    },
    onDropRejected: rejectedFiles => {
      setDropzoneError(rejectedFiles.map(file => file.errors.map(error => error.message).join()).join())
    }
  })

  return (
    <div>
      <div className="form-row">
        <div className="col-lg-8">
          <label className="mb-0" htmlFor={fileId}>Mask file</label>
          <div className={'form-control file-control mb-2 ' +  ((!isEmpty(errors) || !isEmpty(dropzoneError)) && 'is-invalid')}>
            <div {...getRootProps({className: 'dropzone'})}>
              <input id={fileId} {...getInputProps()} />
              <div className="file-control-inner">
                {
                  isDragActive ? (
                    <p>Drop the file here ...</p>
                  ) : (
                    <p>Drag and drop a NetCDF mask file here, or click to select.</p>
                  )
                }
                {
                  !isNil(values.file) && !isNil(values.file.name) && (
                    <p>Currently selected: <code>{values.file.name}</code></p>
                  )
                }
              </div>
            </div>
          </div>
          {
            dropzoneError && (
              <div class="invalid-feedback">{dropzoneError}</div>
            )
          }
        </div>
      </div>
      <div className="form-row">
        <div className="col-lg-4">
          <label className="mb-0" htmlFor={maskId}>Mask name</label>
          <input className={'form-control mb-2 ' +  (!isEmpty(errors) && 'is-invalid')}
              type="text" id={maskId} placeholder="Mask name"
              value={values.mask} onChange={event => onChange({ mask: event.target.value })} />
        </div>
        <div className="col-lg-4">
          <label className="mb-0" htmlFor={varId}>Mask variable</label>
          <input className={'form-control mb-2 ' +  (!isEmpty(errors) && 'is-invalid')}
              type="text" id={varId} placeholder="Mask variable"
              value={values.var} onChange={event => onChange({ var: event.target.value })} />
        </div>
      </div>
    </div>
  )
}

Mask.propTypes = {
  values: PropTypes.object,
  errors: PropTypes.array,
  onChange: PropTypes.func.isRequired
}

export default Mask
