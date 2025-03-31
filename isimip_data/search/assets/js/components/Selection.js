import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { encodeParams } from 'isimip_data/core/assets/js/utils/api'

import Icon from 'isimip_data/core/assets/js/components/Icon'
import Spinner from 'isimip_data/core/assets/js/components/Spinner'

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
    <div className="card selection">
      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          <div className="d-md-flex">
            <div className="d-md-inline">
              <strong>Selection</strong>
            </div>
            <div className="d-md-inline ms-md-2">
              You selected {selected.length} {selected.length > 1 ? 'datasets' : 'dataset'} of {size} size.
            </div>
            <div className="d-md-inline-block ms-auto mt-2 mt-md-0">
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
            (selected.length > 0) && (
              <div className="mt-2">
                <div className="float-md-right">
                  <div className="d-sm-inline-block mr-2 mb-2 mb-md-0">
                    <form className="m-0" method="post" action="/download/" target="_blank" rel="noreferrer">
                      {files.map((file, fileIndex) => {
                        return <input type="hidden" name="paths" value={file.path} key={fileIndex} />
                      })}
                      <button type="submit" className="btn btn-link"
                         title="Download only a specific country, a lat/lon box or landonly data.">
                        Configure download
                      </button>
                    </form>
                  </div>
                  <div className="d-sm-inline-block mr-2 mb-2 mb-md-0">
                    <a href={`/api/v1/datasets/filelist/?${encodeParams(ids)}`}
                       title="Download the file list for this selection.">
                      Download file list
                    </a>
                  </div>
                  <div className="d-sm-inline-block mb-2 mb-md-0">
                    <button className="btn btn-link" onClick={() => handleDownload(ids)}
                       title="Download all files in this selection at once.">
                      Download all files
                    </button>
                  </div>
                </div>
                <div className="d-inline mr-2">
                  <button className="btn btn-link" onClick={handleToggleDatasets}>
                    {
                      (dropdown == 'datasets') && (
                        <span>
                          Hide selected datasets <Icon icon="expand_less" />
                        </span>
                      )
                    }
                    {
                      (dropdown != 'datasets') && (
                        <span>
                          Show selected datasets <Icon icon="expand_more" />
                        </span>
                      )
                    }
                  </button>
                </div>
                <div className="d-inline">
                  <button role="button" className="btn btn-link" onClick={handleReset}>
                    Reset selection <Icon icon="close" />
                  </button>
                </div>
              </div>
            )
          }
        </li>
        {
          (dropdown == 'datasets') && (selected.length > 0) && (
            <li className="list-group-item">
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
            </li>
          )
        }
      </ul>
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
