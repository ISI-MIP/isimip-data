import React from 'react'
import PropTypes from 'prop-types'

import Icon from 'isimip_data/core/assets/js/components/Icon'
import Tooltip from 'isimip_data/core/assets/js/components/Tooltip'

import { addLineBreaks, getSize } from '../utils'

const ResultFilesTab = ({ dataset }) => {
  return (
    <table className="table align-top">
      <thead>
        <tr>
          <th>File name</th>
          <th>Size</th>
          <th aria-label="Actions"></th>
        </tr>
      </thead>
      <tbody>
      {
        dataset.files.map(file => {
          return (
            <tr key={file.id}>
              <td>
                {addLineBreaks(file.name)}
              </td>
              <td className="text-nowrap text-end w-0">
                {getSize(file.size)}
              </td>
              <td className="text-nowrap text-end w-0">
                <div className="d-flex align-items-start">
                  <Tooltip title="Visit file metadata page.">
                    <a className="d-block" href={file.metadata_url} target="_blank" rel="noreferrer">
                      <Icon className="d-block" icon="exit_to_app" />
                    </a>
                  </Tooltip>
                  <Tooltip title="Download file">
                    <a className="d-block" href={file.file_url} target="_blank" rel="noreferrer">
                      <Icon className="d-block" icon="download" />
                    </a>
                  </Tooltip>
                </div>
              </td>
            </tr>
          )
        })
      }
      </tbody>
    </table>
  )
}

ResultFilesTab.propTypes = {
  dataset: PropTypes.object.isRequired
}

export default ResultFilesTab
