import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faChevronDown, faChevronUp  } from '@fortawesome/free-solid-svg-icons'
import { faFile as faFileRegular } from '@fortawesome/free-regular-svg-icons'
import jQuery from 'jquery'
import bytes from 'bytes'
import DatasetApi from 'isimip_data/metadata/assets/js/api/DatasetApi'

import Badges from './Badges'


const get_size = size => bytes(size, {unitSeparator: ' '})

class Result extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showAttributes: false,
      showFiles: false
    }
    this.toggleAttributes = this.toggleAttributes.bind(this)
    this.toggleFiles = this.toggleFiles.bind(this)
    this.handleDownload = this.handleDownload.bind(this)
  }

  componentDidMount() {
    jQuery('[data-toggle="tooltip"]').tooltip();
  }

  componentDidUpdate() {
    jQuery('[data-toggle="tooltip"]').tooltip();
  }

  toggleAttributes(e) {
    e.preventDefault()
    this.setState({ showAttributes: !this.state.showAttributes})
  }

  toggleFiles(e) {
    e.preventDefault()
    this.setState({ showFiles: !this.state.showFiles})
  }

  handleDownload(e, files) {
    e.preventDefault()
    DatasetApi.downloadFiles(files)
  }

  renderDataset(dataset) {
    const { glossary, onSelect, isSelected } = this.props
    const { showAttributes, showFiles } = this.state
    const inputId = `${dataset.id}-input`

    return (
      <li className="list-group-item">
        <Badges glossary={glossary} dataset={dataset} />

        <h4 className="card-title">
          <a className="result-title" href={dataset.metadata_url} target="_blank">{dataset.name}</a>
        </h4>


        {dataset.download_url && <ul className="list-inline float-right">
          <li className="list-inline-item">
            <a href={dataset.download_url}>
              Configure download
            </a>
          </li>
          <li className="list-inline-item">
            <a href={dataset.filelist_url}>
              Download file list
            </a>
          </li>
          <li className="list-inline-item">
            <button className="btn btn-link" onClick={e => this.handleDownload(e, dataset.files)}>
              Download file list
            </button>
          </li>
        </ul>}
        <ul className="list-inline">
          {dataset.public && <li className="list-inline-item">
            <div className="form-check result-select">
              <input className="form-check-input" id={inputId} type="checkbox"
                     checked={isSelected(dataset)} onChange={e => onSelect(e, dataset)} />
              <label className="form-check-label" htmlFor={inputId}>
                Select dataset
              </label>
            </div>
          </li>}
          <li className="list-inline-item">
            <button className="btn btn-link" onClick={this.toggleAttributes}>
              {showAttributes && <span>
                Hide attributes <FontAwesomeIcon icon={faChevronUp} />
              </span>}
              {!showAttributes && <span>
                Show attributes <FontAwesomeIcon icon={faChevronDown} />
              </span>}
            </button>
          </li>
          <li className="list-inline-item">
            <button className="btn btn-link" onClick={this.toggleFiles}>
              {showFiles && <span>
                Hide files <FontAwesomeIcon icon={faChevronUp} />
              </span>}
              {!showFiles && <span>
                Show files <FontAwesomeIcon icon={faChevronDown} />
              </span>}
            </button>
          </li>
        </ul>
      </li>
    )
  }

  renderAttributes(dataset) {
    const { glossary } = this.props

    return (
      <li className="list-group-item">
        <div className="mb-2">
          <div className="row">
            <div className="col-lg-3">
              <strong>Size</strong>
            </div>
            <div className="col-lg-9">
              {get_size(dataset.size)}
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3">
              <strong>Version</strong>
            </div>
            <div className="col-lg-9">
              {dataset.version}
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3">
              <strong>ISIMIP id</strong>
            </div>
            <div className="col-lg-9">
              {dataset.id}
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3">
              <strong>ISIMIP path</strong>
            </div>
            <div className="col-lg-9">
              {dataset.path}
            </div>
          </div>
        </div>
        {
          dataset.identifiers.map(identifier => {
            const specifier = dataset.specifiers[identifier]

            let label
            if (glossary['identifier'] && glossary['identifier'][identifier]) {
              label = glossary['identifier'][identifier].title
            }

            return (
              <div key={identifier} className="row">
                <div className="col-lg-3">
                  <strong>{label || identifier}</strong>
                </div>
                <div className="col-lg-9">
                  {specifier}
                </div>
              </div>
            )
          })
        }
      </li>
    )
  }

  renderFiles(dataset) {
    return (
      <li className="list-group-item result-files">
        <table className="table table-sm">
          <thead>
            <tr>
              <th className="border-top-0">File name</th>
              <th className="border-top-0" style={{width: '15%'}}>Size</th>
              <th className="border-top-0" style={{width: '15%'}}></th>
            </tr>
          </thead>
          <tbody>
          {
            dataset.files.map(file => (
              <tr key={file.id}>
                <td><a href={file.metadata_url} target="_blank">{file.name}</a></td>
                <td>{get_size(file.size)}</td>
                <td className="text-right">
                  {file.file_url && <button className="btn btn-link" onClick={e => this.handleDownload(e, [file])}>
                    Download file
                  </button>}
                </td>
              </tr>
            ))
          }
          </tbody>
        </table>
      </li>
    )
  }

  render() {
    const { dataset } = this.props
    const { showAttributes, showFiles } = this.state

    return (
      <div className="card result">
        <ul className="list-group list-group-flush">
          {this.renderDataset(dataset)}
          {showAttributes && this.renderAttributes(dataset)}
          {showFiles && this.renderFiles(dataset)}
        </ul>
      </div>
    )
  }
}

Result.propTypes = {
  dataset: PropTypes.object.isRequired,
  glossary: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
  isSelected: PropTypes.func.isRequired
}

export default Result
