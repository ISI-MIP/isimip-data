import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { encodeParams } from 'isimip_data/core/assets/js/utils/api'

import Icon from 'isimip_data/core/assets/js/components/Icon'
import Tooltip from 'isimip_data/core/assets/js/components/Tooltip'

import ConfigureDownload from './ConfigureDownload'

import { addLineBreaks, getSize, handleDownload } from '../utils'

const Selection = ({ selected, setSelected }) => {

  const [open, setOpen] = useState(false)

  const size = getSize(selected.reduce((accumulator, dataset) => {
    accumulator += dataset.size
    return accumulator
  }, 0))

  const ids = {
    id: selected.map(dataset => {
      return dataset.id
    })
  }

  const files = selected.reduce((files, dataset) => {
    files = files.concat(dataset.files)
    return files
  }, [])

  const handleReset = () => {
    setSelected([])
    setOpen(false)
  }

  const renderOptions = () => (
    <>
      <Tooltip title="Reset selection">
        <button type="button" className="d-flex align-items-center link me-1"
          onClick={() => handleReset()}>
          <Icon icon="close" />
        </button>
      </Tooltip>

      <ConfigureDownload
        title={'Configure the download for this selection, e.g. to only download a ' +
               'specific country, a lat/lon box or landonly data.'}
        files={files}
      />

      <Tooltip title="Download the file list for this selection.">
        <a className="d-flex align-items-center ms-1"
           href={`/api/v1/datasets/filelist/?${encodeParams(ids)}`}>
          <Icon icon="description" />
        </a>
      </Tooltip>

      <Tooltip title="Download all files in this selection at once.">
        <button type="button" className="d-flex align-items-center link ms-1"
                onClick={() => handleDownload(ids)}>
          <Icon icon="file_copy" />
        </button>
      </Tooltip>
    </>
  )

  return (
    <div className="card selection">
      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          <div className="position-relative">
            <div className="d-none d-sm-flex position-absolute top-0 end-0">
              <div className="d-flex align-items-center">
                {renderOptions()}
              </div>
            </div>
            <div className="d-flex align-items-center">
              <button type="button" className="d-flex align-items-start link" onClick={() => setOpen(!open)}>
                <div className="selection-toggle">
                  <Icon className={classNames({'rotate-90': open})} icon="chevron_right" />
                </div>
                You selected {selected.length} {selected.length > 1 ? 'datasets' : 'dataset'} of {size} size.
              </button>
            </div>
            <div className="d-flex justify-content-end align-items-center d-sm-none mt-2">
              {renderOptions()}
            </div>
          </div>
        </li>
        {
          open && (
            <li className="list-group-item">
              <table className="table align-top">
                <thead>
                  <tr>
                    <th>Dataset</th>
                    <th>Size</th>
                    <th aria-label="Actions"></th>
                  </tr>
                </thead>
                <tbody>
                {
                  selected.map(dataset => {
                    return (
                      <tr key={dataset.id}>
                        <td>
                          {addLineBreaks(dataset.name)}
                        </td>
                        <td className="text-nowrap text-end w-0">
                          {getSize(dataset.size)}
                        </td>
                        <td className="text-nowrap text-end w-0">
                          <div className="d-flex align-items-start">
                            <Tooltip title="Visit dataset metadata page.">
                              <a className="d-block" href={dataset.metadata_url} target="_blank" rel="noreferrer">
                                <Icon className="d-block" icon="exit_to_app" />
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
            </li>
          )
        }
      </ul>
    </div>
  )
}

Selection.propTypes = {
  selected: PropTypes.array.isRequired,
  setSelected: PropTypes.func.isRequired
}

export default Selection
