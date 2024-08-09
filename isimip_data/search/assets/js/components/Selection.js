import React, { Component } from 'react'
import PropTypes from 'prop-types'
import DatasetApi from 'isimip_data/metadata/assets/js/api/DatasetApi'

import bytes from 'bytes'
import Cookies from 'js-cookie'

import { encodeParams } from 'isimip_data/core/assets/js/utils/api'


const get_size = size => bytes(size, {unitSeparator: ' '})

class Selection extends Component {

  constructor(props) {
    super(props)
    this.state = {
      showDatasets: false,
      csrfToken: Cookies.get('csrftoken')
    }
    this.toggleDatasets = this.toggleDatasets.bind(this)
  }

  toggleDatasets(e) {
    e.preventDefault()
    this.setState({ showDatasets: !this.state.showDatasets})
  }

  handleDownload(e, ids) {
    e.preventDefault()
    DatasetApi.fetchDatasets(ids).then(response => {
      DatasetApi.downloadFiles(response.results.reduce((acc, cur) => acc.concat(cur.files), []))
    })
  }

  renderSelection() {
    const { selected, count, maxCount, isLoading, onReset } = this.props
    const { showDatasets, csrfToken } = this.state

    const selected_count = selected.length
    const size = get_size(selected.reduce((accumulator, dataset) => {
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

    return (
      <li className="list-group-item">
        <div className="d-md-flex">
          <div className="d-md-inline">
            <strong>Selection</strong>
          </div>
          <div className="d-md-inline ml-md-2">
            You selected {selected_count} {selected_count > 1 ? 'datasets' : 'dataset'} of {size} size.
          </div>
          <div className="d-md-inline-block ml-auto mt-2 mt-md-0">
            {isLoading && <span className="material-symbols-rounded symbols-spin">progress_activity</span>}
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
        {selected.length > 0 &&
        <div className="mt-2">
          <div className="float-md-right">
            <div className="d-sm-inline-block mr-2 mb-2 mb-md-0">
              <form className="m-0" method="post" action="/download/" target="_blank" rel="noreferrer">
                <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />
                {files.map(file => {
                  return <input type="hidden" name="paths" value={file.path} key={file.id} />
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
              <button className="btn btn-link" onClick={e => this.handleDownload(e, ids)}
                 title="Download all files in this selection at once.">
                Download all files
              </button>
            </div>
          </div>
          <div className="d-inline mr-2">
            <button className="btn btn-link" onClick={this.toggleDatasets}>
              {showDatasets && <span>
                Hide selected datasets
                <span className="material-symbols-rounded symbols-expand">expand_less</span>
              </span>}
              {!showDatasets && <span>
                Show selected datasets
                <span className="material-symbols-rounded symbols-expand">expand_more</span>
              </span>}
            </button>
          </div>
          <div className="d-inline">
            <button className="btn btn-link" onClick={e => onReset(e)}>
              Reset selection
              <span className="material-symbols-rounded symbols-close">close</span>
            </button>
          </div>
        </div>}
      </li>
    )
  }

  renderDatasets() {
    const { selected } = this.props
    const { showDatasets } = this.state

    if (selected.length > 0 && showDatasets) {
      return (
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
                  <td>{get_size(dataset.size)}</td>
                </tr>
              ))
            }
            </tbody>
          </table>
        </li>
      )
    } else {
      return null
    }
  }

  render() {
    return (
      <div className="card selection">
        <ul className="list-group list-group-flush">
          {this.renderSelection()}
          {this.renderDatasets()}
        </ul>
      </div>
    )
  }
}

Selection.propTypes = {
  selected: PropTypes.array.isRequired,
  count: PropTypes.number.isRequired,
  maxCount: PropTypes.number.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onReset: PropTypes.func.isRequired
}

export default Selection
