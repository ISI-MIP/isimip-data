import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import { encodeParams } from 'isimip_data/core/assets/js/utils/api'

import Icon from 'isimip_data/core/assets/js/components/Icon'
import Spinner from 'isimip_data/core/assets/js/components/Spinner'

import ConfigureDownload from './ConfigureDownload'

import { getSize, handleDownload } from '../utils'



const Selection = ({ selected, count, maxCount, isLoading, setSelected }) => {

  const [dropdown, setDropdown] = useState(null)

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

  const handleToggleDatasets = () => {
    setDropdown(dropdown ? null : 'datasets')
  }

  const handleReset = () => {
    setSelected([])
    setDropdown(null)
  }

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-md-flex">
          <strong className="d-block me-2 mb-1 mb-md-0">Selection</strong>
          <div className="d-md-inline mb-1 mb-md-0">
            You selected {selected.length} {selected.length > 1 ? 'datasets' : 'dataset'} of {size} size.
          </div>
          <div className="d-md-inline-block ms-auto mb-1 mb-md-0">
            {isLoading && <Spinner size="sm" className="text-secondary" />}
            {
              !isLoading && count >= 0 && count <= maxCount && (
                <span>{ count.toLocaleString('en-US') } datasets found.</span>
              )
            }
            {
              !isLoading && count > maxCount && (
                <span>More than { maxCount.toLocaleString('en-US') } datasets found.</span>
              )
            }
          </div>
        </div>
        {
          !isEmpty(selected) && (
            <div className="d-md-flex gap-2 mt-md-1">
              <button type="button" className="d-flex align-items-center link" onClick={handleToggleDatasets}>
                {
                  (dropdown == 'datasets') ? (
                    <>
                      Hide selected datasets <Icon icon="expand_less" />
                    </>
                  ) : (
                    <>
                      Show selected datasets <Icon icon="expand_more" />
                    </>

                  )
                }
              </button>

              <button role="button" className="d-flex align-items-center link me-md-auto" onClick={handleReset}>
                Reset selection <Icon icon="close" />
              </button>

              <ConfigureDownload files={files} />

              <a className="d-block mb-1 mb-md-0" href={`/api/v1/datasets/filelist/?${encodeParams(ids)}`}
                 title="Download the file list for this selection.">
                Download file list
              </a>

              <button type="button" className="d-block link" onClick={() => handleDownload(ids)}
                 title="Download all files in this selection at once.">
                Download all files
              </button>
            </div>
          )
        }
      </div>
      {
        !isEmpty(selected) && (dropdown == 'datasets') && (
          <div className="card-body">
            <table className="table table-sm mb-0">
              <thead>
                <tr>
                  <th className="border-top-0">Dataset name</th>
                  <th className="border-top-0" style={{width: '15%'}}>Size</th>
                </tr>
              </thead>
              <tbody>
              {
                selected.map(dataset => (
                  <tr key={dataset.id}>
                    <td><a href={dataset.metadata_url} target="_blank" rel="noreferrer">{dataset.name}</a></td>
                    <td>{getSize(dataset.size)}</td>
                  </tr>
                ))
              }
              </tbody>
            </table>
          </div>
        )
      }
    </div>
  )
}

Selection.propTypes = {
  selected: PropTypes.array.isRequired,
  count: PropTypes.number.isRequired,
  maxCount: PropTypes.number.isRequired,
  isLoading: PropTypes.bool.isRequired,
  setSelected: PropTypes.func.isRequired
}

export default Selection
