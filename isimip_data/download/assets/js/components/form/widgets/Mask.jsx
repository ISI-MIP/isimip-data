import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDropzone } from 'react-dropzone'
import { isEmpty, isNil, uniqueId } from 'lodash'

import Errors from './Errors'

const Mask = ({ file, accept, errors, onChange }) => {
  const fileId = uniqueId('download-form-input-file-')

  const [dropzoneError, setDropzoneError] = useState('')

  const acceptSuffixes = Object.keys(accept).reduce((suffixes, key) => {
    return [...suffixes, ...accept[key]]
  }, []).join(' or ')

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    onDropAccepted: acceptedFiles => {
      if (acceptedFiles.length > 0) {
        onChange(acceptedFiles[0])
        setDropzoneError('')
      }
    },
    onDropRejected: rejectedFiles => {
      setDropzoneError(rejectedFiles.map(file => file.errors.map(error => error.message).join()).join())
    }
  })

  return (
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
                <p>Drag and drop a {acceptSuffixes} file here, or click to select.</p>
              )
            }
            {
              !isNil(file) && !isNil(file.name) && (
                <p>Currently selected: <code>{file.name}</code></p>
              )
            }
          </div>
        </div>
      </div>
      {
        dropzoneError && (
          <div className="text-danger">{dropzoneError}</div>
        )
      }
      <Errors errors={errors} />
    </div>
  )
}

Mask.propTypes = {
  file: PropTypes.object,
  accept: PropTypes.object,
  errors: PropTypes.array,
  onChange: PropTypes.func.isRequired
}

export default Mask
