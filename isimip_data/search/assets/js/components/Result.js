import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp, faExclamationTriangle, faLink } from '@fortawesome/free-solid-svg-icons'
import jQuery from 'jquery'
import bytes from 'bytes'
import Cookies from 'js-cookie'
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Tooltip from "react-bootstrap/Tooltip"

import DatasetApi from 'isimip_data/metadata/assets/js/api/DatasetApi'
import Scale from 'isimip_data/indicators/assets/js/components/Scale'
import Badges from './Badges'


const get_size = size => bytes(size, {unitSeparator: ' '})

class Result extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showAttributes: false,
      showFiles: false,
      showCaveats: false,
      showIndicators: false,
      csrfToken: Cookies.get('csrftoken')
    }
    this.toggleAttributes = this.toggleAttributes.bind(this)
    this.toggleFiles = this.toggleFiles.bind(this)
    this.toggleCaveats = this.toggleCaveats.bind(this)
    this.toggleIndicators = this.toggleIndicators.bind(this)
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

  toggleIndicators(e) {
    e.preventDefault()
    this.setState({ showIndicators: !this.state.showIndicators})
  }

  handleDownload(e, files) {
    e.preventDefault()
    DatasetApi.downloadFiles(files)
  }

  renderDataset(dataset) {
    const { glossary, onSelect, isSelected } = this.props
    const { showAttributes, showFiles, showCaveats, showIndicators } = this.state
    const inputId = `${dataset.id}-input`

    const get_caveats_color = caveats => {
      const [level, color] = caveats.reduce((acc, cur) => {
        const [acc_level, acc_color] = acc
        if (cur.severity_level > acc_level) {
          return [cur.severity_level, cur.severity_color]
        } else {
          return acc
        }
      }, [0, 'info'])

      return color
    }

    const referenceType = dataset.annotations.reduce((acc, cur) => {
      if (acc == 'ISIPEDIA') {
        return acc
      } else if (cur.references.length > 0) {
        return cur.references.some(r => (r.reference_type == 'ISIPEDIA')) ? 'ISIPEDIA' : 'OTHER'
      } else {
        return acc
      }
    }, null)

    return (
      <li className="list-group-item">
        <Badges glossary={glossary} dataset={dataset} />

        <div>
          {
            dataset.caveats.length > 0 &&
            <div className={'float-right text-' + get_caveats_color(dataset.caveats)}>
              <FontAwesomeIcon className="result-icon"
                               title="There are caveats for this dataset."
                               icon={faExclamationTriangle}
                               onClick={this.toggleCaveats} />
            </div>
          }
          {
            referenceType !== null &&
            <OverlayTrigger placement="bottom" overlay={
              referenceType == 'ISIPEDIA' ?
              <Tooltip>
                There are articles on ISIpedia available for this dataset.
              </Tooltip> :
              <Tooltip>
                There are references to other publications for this dataset.
              </Tooltip>
            }>
              <a className="float-right result-reference" href={`${dataset.metadata_url}#references`} target="_blank">
                {
                  referenceType == 'ISIPEDIA' &&
                  <img className="isipedia-logo" src="/static/images/isipedia.png" alt="ISIpedia logo" />
                }
                {
                  referenceType == 'OTHER' && <FontAwesomeIcon className="result-icon" icon={faLink} />
                }
              </a>
            </OverlayTrigger>
          }

          <h4 className="card-title mt-3 mb-3">
            <a className="result-title" href={dataset.metadata_url} target="_blank">{dataset.name}</a>
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

          {dataset.indicators.length > 0 && <div className="d-inline">
            <button className="btn btn-link" onClick={this.toggleIndicators}>
              {showIndicators && <span>
                Indicators <FontAwesomeIcon icon={faChevronUp} />
              </span>}
              {!showIndicators && <span>
                Indicators <FontAwesomeIcon icon={faChevronDown} />
              </span>}
            </button>
          </div>}
        </div>
      </li>
    )
  }

  renderAttributes(dataset) {
    const { glossary } = this.props
    const specifiers = dataset.pretty_specifiers

    return (
      <li className="list-group-item">
        <div className="row">
          <div className="col-lg-3">
            <strong>Path</strong>
          </div>
          <div className="col-lg-9">
            {dataset.paths.map((path, index) => <div key={index}>{path}</div>)}
          </div>
        </div>
        <div className="row">
          <div className="col-lg-3">
            <strong>ISIMIP ID</strong>
          </div>
          <div className="col-lg-9">
            {dataset.id}
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
            <strong>Size</strong>
          </div>
          <div className="col-lg-9">
            {get_size(dataset.size)}
          </div>
        </div>
        {
          Object.keys(specifiers).map((key, index) => {
            const values = specifiers[key]

            return (
              <div key={index} className="row">
                <div className="col-lg-3">
                  <strong>{key}</strong>
                </div>
                <div className="col-lg-9">
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
                      <a href={file.file_url } target="_blank">Download file</a>
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
                  {caveat.severity_level > 2 && <span className={'text-' + caveat.severity_color}> {caveat.severity_message}</span>}
                </li>
              )
            })
          }
        </ul>
      </li>
    )
  }

  renderIndicators(dataset) {
    return (
      <li className="list-group-item result-indicators">
        <ul className="list-unstyled">
          {
            dataset.indicators.map(indicator => {
              return (
                <li className="result-indicator" key={indicator.id}>
                  <div className="row">
                    <div className="col-md-8">
                      <a href={indicator.url} target="_blank">{indicator.title}</a>
                    </div>
                    <div className="col-md-4">
                      <Scale value={indicator.value} minimum={indicator.minimum} maximum={indicator.maximum} />
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

  renderConfigureDownloadForm(files) {
    const { csrfToken } = this.state

    return (
      <form className="m-0" method="post" action="/download/" target="_blank">
        <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />
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
    const { showAttributes, showFiles, showCaveats, showIndicators } = this.state

    return (
      <div className="card result">
        <ul className="list-group list-group-flush">
          {this.renderDataset(dataset)}
          {showAttributes && this.renderAttributes(dataset)}
          {showFiles && this.renderFiles(dataset)}
          {showCaveats && this.renderCaveats(dataset)}
          {showIndicators && this.renderIndicators(dataset)}
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
