import React from 'react'
import PropTypes from 'prop-types'

import { getSize } from '../utils'


const ResultAttributes = ({ dataset }) => {

  return (
    <li className="list-group-item result-files">
      <ul className="list-unstyled">
        {
          dataset.files.map(file => {
            return (
              <li className="result-file" key={file.id}>
                <div className="row">
                  <div className="col-md-8">
                    <a href={file.metadata_url} target="_blank" rel="noreferrer">{file.name}</a>
                  </div>
                  <div className="col-md-2">
                    {getSize(file.size)}
                  </div>
                  <div className="col-md-2">
                    <a href={file.file_url } target="_blank" rel="noreferrer">Download file</a>
                  </div>
                </div>
              </li>
            )
          })
        }
      </ul>
    </li>
  )
}

ResultAttributes.propTypes = {
  dataset: PropTypes.object.isRequired,
}

export default ResultAttributes
