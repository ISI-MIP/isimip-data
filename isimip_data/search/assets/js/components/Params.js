import React from 'react'
import PropTypes from 'prop-types'
import { isArray, isEmpty } from 'lodash'

import Icon from 'isimip_data/core/assets/js/components/Icon'

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
        <div className="d-flex flex-wrap row-gap-1 column-gap-2 mb-2">
          <strong className="d-block">Search constraints</strong>
          {
            items.map(([key, value], index) => {
              return !isEmpty(value) && (
                <button type="button" key={index} className="d-flex align-items-center link"
                        onClick={() => handleRemove(key, value)}>
                  {key} = {value} <Icon icon="close" size="sm" />
                </button>
              )
            })
          }
        </div>

        <div className="d-flex gap-2 justify-content-end">
        {
          count > 0 && (
            <a href={`/api/v1/datasets/filelist/?${encodeParams(params)}`}
                 title="Download file list for this search.">
              Download file list
            </a>
          )
        }
        {
          count < 10 && (
              <button type="button" className="link" onClick={() => handleDownload(params)}
                 title="Download all files for this search at once.">
                Download all files
              </button>
          )
        }
        </div>
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
