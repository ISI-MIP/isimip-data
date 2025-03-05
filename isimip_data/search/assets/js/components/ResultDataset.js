import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import Badges from './Badges'
import References from './References'
import Caveats from './Caveats'
import ConfigureDownload from './ConfigureDownload'

import { handleDownload } from '../utils'


const ResultDataset = ({ dataset, glossary, selected, setSelected, dropdown, setDropdown }) => {

  const checkboxId = `${dataset.id}-checkbox`

  const handleSelection = (dataset) => {
    setSelected(
      selected.includes(dataset) ? [...selected.filter(d => d != dataset)] : [...selected, dataset]
    )
  }

  return (
    <li className="list-group-item">
      <Badges glossary={glossary} dataset={dataset} />

      <div className="mt-0 mb-3">
        <References dataset={dataset} />
        <Caveats dataset={dataset} toggleCaveats={() => setDropdown('caveats')} />
        <h4 className="card-title">
          <a className="result-title" href={dataset.metadata_url} target="_blank" rel="noreferrer">{dataset.name}</a>
        </h4>
      </div>

      <div className="d-flex">
        {
          dataset.public && (
            <div className="form-check result-select mb-2 d-xl-inline mr-xl-3 mb-xl-0">
              <input className="form-check-input" id={checkboxId} type="checkbox"
                     checked={selected.includes(dataset)} onChange={() => handleSelection(dataset)} />
              <label className="form-check-label" htmlFor={checkboxId}>
                Select dataset
              </label>
            </div>
          )
        }

        <div className="d-inline mr-2">
          <button className="btn btn-link" onClick={() => setDropdown('attributes')}>
            Attributes
            <span className="material-symbols-rounded symbols-expand">
              {dropdown == 'attributes' ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        </div>

        <div className="d-inline mr-2">
          <button className="btn btn-link" onClick={() => setDropdown('files')}>
            Files
            <span className="material-symbols-rounded symbols-expand">
              {dropdown == 'files' ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        </div>

        {
          (!isEmpty(dataset.caveats) || !isEmpty(dataset.caveats_versions)) && (
            <div className="d-inline">
              <button className="btn btn-link" onClick={() => setDropdown('caveats')}>
                Issues & Notes
                <span className="material-symbols-rounded symbols-expand">
                  {dropdown == 'caveats' ? 'expand_less' : 'expand_more'}
                </span>
              </button>
            </div>
          )
        }

        {
          dataset.public && (
            <div className="d-inline ml-auto">
              {
                dataset.is_global && dataset.is_netcdf && (
                  <div className="d-sm-inline-block mr-2 mb-2 mb-md-0">
                    <ConfigureDownload files={dataset.files} />
                  </div>
                )
              }

              <div className="d-sm-inline-block mr-2 mb-2 mb-md-0">
                <a href={dataset.filelist_url}
                   title="Download file list for this dataset.">
                  Download file list
                </a>
              </div>

              <div className="d-sm-inline-block mb-2 mb-md-0">
                <button className="btn btn-link" onClick={() => handleDownload()}
                        title="Download all files in this dataset at once.">
                  Download all files
                </button>
              </div>
            </div>
          )
        }
      </div>
    </li>
  )
}

ResultDataset.propTypes = {
  dataset: PropTypes.object.isRequired,
  glossary: PropTypes.object.isRequired,
  selected: PropTypes.array.isRequired,
  setSelected: PropTypes.func.isRequired,
  dropdown: PropTypes.string.isRequired,
  setDropdown: PropTypes.func.isRequired
}

export default ResultDataset
