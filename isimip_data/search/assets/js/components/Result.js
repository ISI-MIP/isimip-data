import React, { Component } from 'react'
import PropTypes from 'prop-types'

import jQuery from 'jquery'
import bytes from 'bytes'

import DatasetApi from 'isimip_data/metadata/assets/js/api/DatasetApi'
import Badges from './Badges'
import References from './References'
import Caveats from './Caveats'


const get_size = size => bytes(size, {unitSeparator: ' '})

class Result extends Component {

  constructor(props) {
    super(props)
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
    jQuery('[data-toggle="tooltip"]').tooltip()
  }

  componentDidUpdate() {
    jQuery('[data-toggle="tooltip"]').tooltip()
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

        <div>
          <References dataset={dataset} />
          <Caveats dataset={dataset} toggleCaveats={this.toggleCaveats} />
          <h4 className="card-title mt-0 mb-3">
            <a className="result-title" href={dataset.metadata_url} target="_blank" rel="noreferrer">{dataset.name}</a>
          </h4>
        </div>

        <div>
          {dataset.public &&
            <div className="form-check result-select mb-2 d-xl-inline mr-xl-3 mb-xl-0">
              <input className="form-check-input" id={inputId} type="checkbox"
                     checked={isSelected(dataset)} onChange={e => onSelect(e, dataset)} />
              <label className="form-check-label" htmlFor={inputId}>
                Select dataset
              </label>
            </div>
          }

          {dataset.public &&
            <div className="float-md-right">
              {dataset.is_global && dataset.is_netcdf &&
                <div className="d-sm-inline-block mr-2 mb-2 mb-md-0">
                  {this.renderConfigureDownloadForm(dataset.files)}
                </div>
              }

              <div className="d-sm-inline-block mr-2 mb-2 mb-md-0">
                <a href={dataset.filelist_url}
                   title="Download file list for this dataset.">
                  Download file list
                </a>
              </div>

              <div className="d-sm-inline-block mb-2 mb-md-0">
                <button className="btn btn-link" onClick={e => this.handleDownload(e, dataset.files)}
                        title="Download all files in this dataset at once.">
                  Download all files
                </button>
              </div>
            </div>
          }

          <div className="d-inline mr-2">
            <button className="btn btn-link" onClick={this.toggleAttributes}>
              {showAttributes && <span>
                Attributes
                <span className="material-symbols-rounded symbols-expand">expand_less</span>
              </span>}
              {!showAttributes && <span>
                Attributes
                <span className="material-symbols-rounded symbols-expand">expand_more</span>
              </span>}
            </button>
          </div>

          <div className="d-inline mr-2">
            <button className="btn btn-link" onClick={this.toggleFiles}>
              {showFiles && <span>
                Files
                <span className="material-symbols-rounded symbols-expand">expand_less</span>
              </span>}
              {!showFiles && <span>
                Files
                <span className="material-symbols-rounded symbols-expand">expand_more</span>
              </span>}
            </button>
          </div>

          {
            (dataset.caveats.length > 0 || dataset.caveats_versions.length > 0) &&
            <div className="d-inline">
              <button className="btn btn-link" onClick={this.toggleCaveats}>
                {showCaveats && <span>
                  Issues & Notes
                  <span className="material-symbols-rounded symbols-expand">expand_less</span>
                </span>}
                {!showCaveats && <span>
                  Issues & Notes
                  <span className="material-symbols-rounded symbols-expand">expand_more</span>
                </span>}
              </button>
            </div>
          }

        </div>
      </li>
    )
  }

  renderAttributes(dataset) {
    const specifiers = dataset.pretty_specifiers

    return (
      <li className="list-group-item">
        <div>
          <strong>Path</strong>
        </div>
        <div>
          {dataset.paths.map((path, index) => <div key={index}><code>{path}</code></div>)}
        </div>
        <hr className="mt-2 mb-2" />
        <div className="row">
          <div className="col-lg-4">
            <strong>ISIMIP ID</strong>
          </div>
          <div className="col-lg-8">
            <code>{dataset.id}</code>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4">
            <strong>Version</strong>
          </div>
          <div className="col-lg-8">
            {dataset.version}
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4">
            <strong>Size</strong>
          </div>
          <div className="col-lg-8">
            {get_size(dataset.size)}
          </div>
        </div>
        {
          Object.keys(specifiers).map((key, index) => {
            const values = specifiers[key]

            return (
              <div key={index} className="row">
                <div className="col-lg-4">
                  <strong>{key}</strong>
                </div>
                <div className="col-lg-8">
                  {values.map((v, i) => <div key={i}>{v}</div>)}
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
        <ul className="list-unstyled">
          {
            dataset.files.map(file => {
              return (
                <li className="result-file" key={file.id}>
                  <div className="row">
                    <div className="col-md-8">
                      <a href={file.metadata_url} target="_blank" rel="noreferrer">{file.name}</a>
                    </div>
                    <div className="col-md-2">
                      {get_size(file.size)}
                    </div>
                    <div className="col-md-2">
                      <a href={file.file_url } target="_blank" rel="noreferrer">Download file</a>
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

  renderCaveat(caveat) {
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
        <p className="mb-0">
          <a href={caveat.url} target="_blank" rel="noreferrer">{caveat.title}</a>
          <span className="text-muted"> #{caveat.id}</span>
        </p>
        <p className={'mb-0 text-' + caveat.message_color}> {caveat.message_display}</p>
      </li>
    )
  }

  renderCaveats(dataset) {
    return (
      <React.Fragment>
        {
          dataset.caveats.length > 0 &&
          <li className="list-group-item">
            <ul className="list-unstyled">
              {
                dataset.caveats.map(caveat => {
                  return this.renderCaveat(caveat)
                })
              }
            </ul>
          </li>
        }
        {
          dataset.caveats_versions.length > 0 &&
          <li className="list-group-item">
            <p className="mb-2 text-muted">Caveats for other versions of this dataset:</p>
            <ul className="list-unstyled">
              {
                dataset.caveats_versions.map(caveat => {
                  return this.renderCaveat(caveat)
                })
              }
            </ul>
          </li>
        }
      </React.Fragment>
    )
  }

  renderConfigureDownloadForm(files) {
    return (
      <form className="m-0" method="post" action="/download/" target="_blank">
        {files.map(file => {
          return <input type="hidden" name="paths" value={file.path} key={file.id} />
        })}
        <button type="submit" className="btn btn-link"
           title="Download only a specific country, a lat/lon box or landonly data.">
          Configure download
        </button>
      </form>
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
