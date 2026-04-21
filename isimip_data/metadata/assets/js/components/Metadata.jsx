import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { isEmpty, first, trim } from 'lodash'
import classNames from 'classnames'
import sha512 from 'js-sha512'

import DatasetApi from '../api/DatasetApi'


const Metadata = () => {

  const [query, setQuery] = useState('')
  const [queryError, setQueryError] = useState('')

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropAccepted: acceptedFiles => {
      if (acceptedFiles.length > 0) {
        first(acceptedFiles).arrayBuffer().then(buffer => {
          setQuery(sha512(buffer))
        })
      }
    }
  })

  const onSubmit = (event) => {
    event.preventDefault()
    setQueryError('')

    // check for an isimip_id
    const idMatch = trim(query).match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/)
    if (idMatch) {
      const id = idMatch[0]

      return DatasetApi.fetchFiles({ id }).then(response => {
        if (isEmpty(response.results)) {
          DatasetApi.fetchDatasets({ id }).then(response => {
            if (isEmpty(response.results)) {
              setQueryError('No dataset or file with this isimip_id has been found.')
            } else {
              window.location = response.results[0].metadata_url
            }
          })
        } else {
          window.location = response.results[0].metadata_url
        }
      })
    }

    // check for a checksum
    const checksumMatch = trim(query).match(/[0-9a-fA-F]{128}/)
    if (checksumMatch) {
      const checksum = checksumMatch[0]

      return DatasetApi.fetchFiles({ checksum }).then(response => {
        if (isEmpty(response.results)) {
          setQueryError('No file with this checksum has been found.')
        } else {
          window.location = response.results[0].metadata_url
        }
      })
    }

    // if nothing worked, display an error
    setQueryError('Please provide a valid UUID or SHA-512 checksum')
  }

  return (
    <div className="metadata">
      <div className="card mb-2">
        <div className="card-body">
          <form className="mb-0" method="GET" onSubmit={onSubmit}>
            <div>
              <label className="form-label" htmlFor="metadata-query">UUID or Checksum</label>
              <textarea
                id="metadata-query"
                className={classNames('form-control mb-2', {
                  'is-invalid': !isEmpty(queryError)
                })}
                name="query"
                rows="2"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <div className="invalid-feedback mb-2">
                {queryError}
              </div>
            </div>
            <button type="submit" className="btn btn-success btn-sm" disabled={isEmpty(query)}>
              Go to metadata page
            </button>
          </form>
        </div>
      </div>
      <div className="card mb-2">
        <div className="card-body">
          <div>
            <div className="form-control file-control">
              <div {...getRootProps({className: 'dropzone'})}>
                <input id="metadata-file" {...getInputProps()} />
                <div className="file-control-inner">
                  {
                    isDragActive ? (
                      <p>Drop the file here ...</p>
                    ) : (
                      <p>Drag and drop a file here, or click to select.</p>
                    )
                  }
                </div>
              </div>
            </div>
            <div id="metadata-file-help" className="form-text">
                You can also drag the file to the area above to compute its checksum automatically.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Metadata
