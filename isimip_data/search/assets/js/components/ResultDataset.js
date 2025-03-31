import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import Checkbox from 'isimip_data/core/assets/js/components/Checkbox'
import Icon from 'isimip_data/core/assets/js/components/Icon'

import Badges from './Badges'
import References from './References'
import Caveats from './Caveats'
import ConfigureDownload from './ConfigureDownload'

import { handleDownload } from '../utils'


const ResultDataset = ({ dataset, glossary, selected, setSelected, dropdown, setDropdown }) => {

  const isSelected = selected.map(d => d.id).includes(dataset.id)

  const handleSelection = () => {
    setSelected(
      isSelected ? [...selected.filter(d => d.id != dataset.id)] : [...selected, dataset]
    )
  }

  return (
    <li className="list-group-item">
      <Badges glossary={glossary} dataset={dataset} />

      <div className="d-flex gap-2 mt-0 mb-3">
        <h4 className="card-title me-auto mb-0">
          <a className="result-title" href={dataset.metadata_url} target="_blank" rel="noreferrer">{dataset.name}</a>
        </h4>
        <References dataset={dataset} />
        <Caveats dataset={dataset} toggleCaveats={() => setDropdown('caveats')} />
      </div>

      <div className="d-flex">
        {
          dataset.public && (
            <div className="d-inline me-2">
              <Checkbox checked={isSelected} onChange={handleSelection}>
                Select dataset
              </Checkbox>
            </div>
          )
        }

        <div className="d-inline me-1">
          <button role="button" className="d-flex link" onClick={() => setDropdown('attributes')}>
            Attributes
            <Icon icon={dropdown == 'attributes' ? 'expand_less' : 'expand_more'} />
          </button>
        </div>

        <div className="d-inline me-1">
          <button role="button" className="d-flex link" onClick={() => setDropdown('files')}>
            Files
            <Icon icon={dropdown == 'files' ? 'expand_less' : 'expand_more'} />
          </button>
        </div>

        {
          (!isEmpty(dataset.caveats) || !isEmpty(dataset.caveats_versions)) && (
            <div className="d-inline">
              <button role="button" className="d-flex link" onClick={() => setDropdown('files')}>
                Issues & Notes
                <Icon icon={dropdown == 'files' ? 'expand_less' : 'expand_more'} />
              </button>
            </div>
          )
        }

        {
          dataset.public && (
            <div className="d-inline ms-auto">
              {
                dataset.is_global && dataset.is_netcdf && (
                  <div className="d-sm-inline-block me-2 mb-2 mb-md-0">
                    <ConfigureDownload files={dataset.files} />
                  </div>
                )
              }

              <div className="d-sm-inline-block me-2 mb-2 mb-md-0">
                <a href={dataset.filelist_url}
                   title="Download file list for this dataset.">
                  Download file list
                </a>
              </div>

              <div className="d-sm-inline-block mb-2 mb-md-0">
                <button role="button" className="link" onClick={() => handleDownload({id: dataset.id})}
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
