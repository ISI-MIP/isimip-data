import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp, faTimes  } from '@fortawesome/free-solid-svg-icons'
import bytes from 'bytes'

import { encodeParams } from 'isimip_data/core/assets/js/utils/api'


const get_size = size => bytes(size, {unitSeparator: ' '})

class Selection extends Component {

  constructor(props) {
    super(props)
    this.state = {
      showDatasets: false
    }
    this.toggleDatasets = this.toggleDatasets.bind(this)
  }

  toggleDatasets(e) {
    e.preventDefault()
    this.setState({ showDatasets: !this.state.showDatasets})
  }


  renderSelection() {
    const { selected, onReset } = this.props
    const { showDatasets } = this.state

    const count = selected.length
    const size = get_size(selected.reduce((accumulator, dataset) => {
      accumulator += dataset.size
      return accumulator
    }, 0))
    const ids = {
      id: selected.map(dataset => {
        return dataset.id
      })
    }

    return (
      <li className="list-group-item">
        <ul className="list-inline">
          <li className="list-inline-item">
            <strong>Selection</strong>
          </li>
          <li className="list-inline-item">
            You selected {count} {count > 1 ? 'datasets' : 'dataset'} of {size} size.
          </li>
        </ul>
        {selected.length > 0 && <div className="mt-2">
          <ul className="list-inline float-right">
            <li className="list-inline-item">
              <a href={`/api/v1/datasets/filelist/?${encodeParams(ids)}`}>
                Download file list for this selection
              </a>
            </li>
          </ul>
          <ul className="list-inline">
            <li className="list-inline-item">
              <button className="btn btn-link" onClick={this.toggleDatasets}>
                {showDatasets && <span>
                  Hide selected datasets <FontAwesomeIcon icon={faChevronUp} />
                </span>}
                {!showDatasets && <span>
                  Show selected datasets <FontAwesomeIcon icon={faChevronDown} />
                </span>}
              </button>
            </li>
            <li className="list-inline-item">
              <button className="btn btn-link" onClick={e => onReset(e)}>
                Reset selection <FontAwesomeIcon icon={faTimes} />
              </button>
            </li>
          </ul>
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
                  <td><a href={dataset.metadata_url} target="_blank">{dataset.name}</a></td>
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
  onReset: PropTypes.func.isRequired
}

export default Selection
