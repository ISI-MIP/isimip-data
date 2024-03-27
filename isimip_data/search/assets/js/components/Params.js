import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { encodeParams } from 'isimip_data/core/assets/js/utils/api'
import DatasetApi from 'isimip_data/metadata/assets/js/api/DatasetApi'


const hiddenParams = ['page']

class Params extends Component {

  constructor(props) {
    super(props)
  }

  handleDownload(e, params) {
    e.preventDefault()
    DatasetApi.fetchDatasets(params).then(response => {
      DatasetApi.downloadFiles(response.results.reduce((acc, cur) => acc.concat(cur.files), []))
    })
  }

  render() {
    const { params, count, isLoading, onRemove } = this.props

    const items = []
    Object.keys(params).map(key => {
      const value = params[key]

      if (hiddenParams.indexOf(key) < 0) {
        if (Array.isArray(value)) {
          value.map(v => {
            items.push([key, v])
          })
        } else {
          if (value) {
            items.push([key, value])
          }
        }
      }
    })

    if (items.length == 0) {
      return null
    }

    return (
      <div className="card params">
        <div className="card-body">
          <div>
            <div className="d-inline">
              <strong>Search constraints</strong>
            </div>
            {
              items.map((item, index) => {
                const [key, value] = item
                return (
                  <div key={index} className="d-inline ml-2">
                    <button className="btn btn-link close-link" onClick={() => onRemove(key, value)}>
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
                  <button className="btn btn-link" onClick={e => this.handleDownload(e, params)}
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
}

Params.propTypes = {
  params: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onRemove: PropTypes.func.isRequired
}

export default Params
