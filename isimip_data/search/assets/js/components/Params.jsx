import React from 'react'
import PropTypes from 'prop-types'
import { isArray, isEmpty } from 'lodash'

import Icon from 'isimip_data/core/assets/js/components/Icon'
import Tooltip from 'isimip_data/core/assets/js/components/Tooltip'

import { encodeParams } from 'isimip_data/core/assets/js/utils/api'

import { handleDownload } from '../utils'

const Params = ({ params, count, updateParams }) => {

  const items = Object.entries(params).reduce((items, [key, value]) => (
    Array.isArray(value) ? [...items, ...value.map(v => [key, v])] : [...items, [key, value]]
  ), [])

  const handleRemove = (key, value) => {
    updateParams({ [key]: isArray(params[key]) ? params[key].filter(v => v != value) : null })
  }

  const renderOptions = () => (
    <>
      {
        count > 0 && (
          <Tooltip title="Download file list for this search.">
            <a href={`/api/v1/datasets/filelist/?${encodeParams(params)}`}>
              <Icon icon="description" />
            </a>
          </Tooltip>
        )
      }
      {
        count > 0 && count < 10 && (
          <Tooltip title="Download all files for this search at once.">
            <button type="button" className="link" onClick={() => handleDownload(params)}>
              <Icon icon="file_copy" />
            </button>
          </Tooltip>
        )
      }
    </>
  )

  return !isEmpty(items) && (
    <div className="card">
      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          <div className="position-relative">
            <div className="d-none d-sm-flex position-absolute top-0 end-0">
              {renderOptions()}
            </div>
            <div className="d-flex flex-wrap row-gap-1 column-gap-2">
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
            <div className="d-flex justify-content-end align-items-center d-sm-none mt-2">
              {renderOptions()}
            </div>
          </div>
        </li>
      </ul>
    </div>
  )
}

Params.propTypes = {
  params: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  updateParams: PropTypes.func.isRequired
}

export default Params
