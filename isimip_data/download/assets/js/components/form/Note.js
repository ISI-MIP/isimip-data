import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'

const Note = ({ files, resolutions }) => {
  return (
    <div className="card mb-2">
      <div className="card-body">
        <p className="mb-1 text-danger">
          No operations are available for your selection of files.
        </p>
        <p className="mb-1">
          This usually happens when the resolution of one or more of the files are not supported by the Files API.
        </p>
        <p className="mb-1">
          You selected:
        </p>
        <ul className="mb-1">
          {
            files.map((file, fileIndex) => (
              <li key={fileIndex}>
                <div>{file.path}</div>
                <div>
                  Resolution: <span className="text-success">
                    {get(file, 'specifiers.resolution', '30arcmin')}
                  </span>
                </div>
              </li>
            ))
          }
        </ul>
        <p className="mb-0">
          The Files API supports: {resolutions.map((r, i) => (<span key={i} className="text-success">{r}</span>))
                                              .reduce((s, r) => [s, ', ', r])}.
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
