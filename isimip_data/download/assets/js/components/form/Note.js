import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'

const Note = ({ files, resolutions }) => {
  return (
    <div className="card mb-2">
      <div className="card-body">
        <p className="mb-1">
          No operations are available for your selection of files. This usually happens when the resolution of one or
          if the files are not supported by the Files API.
        </p>
        <p className="mb-1">
          You selected:
        </p>
        <ul className="mb-1 pl-4">
          {
            files.map((file, fileIndex) => (
              <li key={fileIndex}>
                <div>{file.path}</div>
                <div>Resolution: {get(file, 'specifiers.resolution', '30arcmin')}</div>
              </li>
            ))
          }
        </ul>
        <p className="mb-0">
          The Files API supports: {resolutions.join(', ')}.
        </p>
      </div>
    </div>
  )
}

Note.propTypes = {
  files: PropTypes.array,
  resolutions: PropTypes.array
}

export default Note
