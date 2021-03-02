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
      showFiles: false,
      showCaveats: false
    }
    this.toggleAttributes = this.toggleAttributes.bind(this)
    this.toggleFiles = this.toggleFiles.bind(this)
    this.toggleCaveats = this.toggleCaveats.bind(this)
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

  toggleCaveats(e) {
    e.preventDefault()
    this.setState({ showCaveats: !this.state.showCaveats})
  }

  handleDownload(e, files) {
    e.preventDefault()
    DatasetApi.downloadFiles(files)
  }

  renderDataset(dataset) {
    const { glossary, onSelect, isSelected } = this.props
    const { showAttributes, showFiles, showCaveats } = this.state
    const inputId = `${dataset.id}-input`

    return (
      <li className="list-group-item">
        <Badges glossary={glossary} dataset={dataset} />

        <h4 className="card-title mt-3 mb-3">
          <a className="result-title" href={dataset.metadata_url} target="_blank">{dataset.name}</a>
        </h4>

        <div>
          {dataset.public &&
          <div className="form-check result-select mb-2 d-xl-inline mr-xl-3 mb-xl-0">
            <input className="form-check-input" id={inputId} type="checkbox"
                   checked={isSelected(dataset)} onChange={e => onSelect(e, dataset)} />
            <label className="form-check-label" htmlFor={inputId}>
              Select dataset
            </label>
          </div>}

          <div className="float-md-right">
            <div className="d-sm-inline-block mr-2 mb-2 mb-md-0">
              <a href={dataset.download_url}>
                Configure download
              </a>
            </div>

            <div className="d-sm-inline-block mr-2 mb-2 mb-md-0">
              <a href={dataset.filelist_url}>
                Download file list
              </a>
            </div>

            <div className="d-sm-inline-block mb-2 mb-md-0">
              <button className="btn btn-link" onClick={e => this.handleDownload(e, dataset.files)}>
                Download all files
              </button>
            </div>
          </div>

          <div className="d-inline mr-2">
            <button className="btn btn-link" onClick={this.toggleAttributes}>
              {showAttributes && <span>
                Attributes <FontAwesomeIcon icon={faChevronUp} />
              </span>}
              {!showAttributes && <span>
                Attributes <FontAwesomeIcon icon={faChevronDown} />
              </span>}
            </button>
          </div>

          <div className="d-inline mr-2">
            <button className="btn btn-link" onClick={this.toggleFiles}>
              {showFiles && <span>
                Files <FontAwesomeIcon icon={faChevronUp} />
              </span>}
              {!showFiles && <span>
                Files <FontAwesomeIcon icon={faChevronDown} />
              </span>}
            </button>
          </div>

          {dataset.caveats.length > 0 && <div className="d-inline">
            <button className="btn btn-link" onClick={this.toggleCaveats}>
              {showCaveats && <span>
                Caveats <FontAwesomeIcon icon={faChevronUp} />
              </span>}
              {!showCaveats && <span>
                Caveats <FontAwesomeIcon icon={faChevronDown} />
              </span>}
            </button>
          </div>}
        </div>
      </li>
    )
  }

  renderAttributes(dataset) {
    const { glossary } = this.props

    return (
      <li className="list-group-item">
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
      <li className="list-group-item">
        <ul className="list-unstyled">
          {
            dataset.files.map(file => {
              return (
                <li className="result-file" key={file.id}>
                  <div className="row">
                    <div className="col-md-8">
                      <a href={file.metadata_url} target="_blank">{file.name}</a>
                    </div>
                    <div className="col-md-2">
                      {get_size(file.size)}
                    </div>
                    <div className="col-md-2">
                      {file.file_url && <button className="btn btn-link" onClick={e => this.handleDownload(e, [file])}>
                          Download file
                      </button>}
                    </div>
                  </div>
                </li>
              )
            })
          }
        </ul>
      </li>
    )
  }

  renderCaveats(dataset) {
    return (
      <li className="list-group-item">
        <ul className="list-unstyled">
          {
            dataset.caveats.map(caveat => {
              return (
                <li className="result-caveat" key={caveat.id}>
                  <div className="float-right">
                    <span className={'badge badge-pill badge-' + caveat.severity_color + ' mr-2'}>
                      {caveat.severity_display}
                    </span>
                    <span className={'badge badge-pill badge-' + caveat.status_color}>
                      {caveat.status_display}
                    </span>
                  </div>
                  <a href={caveat.url} target="_blank">{caveat.title}</a>
                  <span className="text-muted"> #{caveat.id}</span>
                </li>
              )
            })
          }
        </ul>
      </li>
    )
  }

  render() {
    const { dataset } = this.props
    const { showAttributes, showFiles, showCaveats } = this.state

    return (
      <div className="card result">
        <ul className="list-group list-group-flush">
          {this.renderDataset(dataset)}
          {showAttributes && this.renderAttributes(dataset)}
          {showFiles && this.renderFiles(dataset)}
          {showCaveats && this.renderCaveats(dataset)}
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
