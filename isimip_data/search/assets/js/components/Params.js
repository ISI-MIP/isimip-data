import React from 'react'
import PropTypes from 'prop-types'
import { isArray, isEmpty } from 'lodash'

import { encodeParams } from 'isimip_data/core/assets/js/utils/api'

import { handleDownload } from '../utils'


const Params = ({ params, count, updateParams }) => {

  const items = Object.entries(params).reduce((items, [key, value]) => (
    Array.isArray(value) ? [...items, ...value.map(v => [key, v])] : [...items, [key, value]]
  ), [])

  const handleRemove = (key, value) => {
    updateParams({ [key]: isArray(params[key]) ? params[key].filter(v => v != value) : null })
  }

  return !isEmpty(items) && (
    <div className="card params">
      <div className="card-body">
        <div>
          <div className="d-inline">
            <strong>Search constraints</strong>
          </div>
          {
            items.map(([key, value], index) => {
              return !isEmpty(value) && (
                <div key={index} className="d-inline ml-2">
                  <button className="btn btn-link close-link" onClick={() => handleRemove(key, value)}>
                    {key} = {value}<span className="material-symbols-rounded symbols-close">close</span>
                  </button>
                </div>
              )
            })
          }
        </div>

        {
          count > 0 && <div className="float-md-right mt-2">
            <div className="d-sm-inline-block mb-2 mb-md-0">
              <a href={`/api/v1/datasets/filelist/?${encodeParams(params)}`}
                 title="Download file list for this search.">
                Download file list
              </a>
            </div>
            {
              count < 10 && <div className="d-sm-inline-block ml-2 mb-2 mb-md-0">
                <button className="btn btn-link" onClick={() => handleDownload(params)}
                   title="Download all files for this search at once.">
                  Download all files
                </button>
              </div>
            }
          </div>
        }
      </div>
    </div>
  )
}

Params.propTypes = {
  params: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  updateParams: PropTypes.func.isRequired
}

export default Params
