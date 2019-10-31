import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile } from '@fortawesome/free-solid-svg-icons'
import { faFile as faFileRegular } from '@fortawesome/free-regular-svg-icons'
import jQuery from 'jquery'

import DatasetApi from 'isimip_data/metadata/assets/js/api/DatasetApi'


class Result extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showAttributes: false,
      showFiles: false
    }
    this.toggleAttributes = this.toggleAttributes.bind(this)
    this.toggleFiles = this.toggleFiles.bind(this)
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

  renderDataset(dataset) {
    const { showAttributes, showFiles } = this.state

    return (
      <li className="list-group-item">

        <h4 className="card-title">
          <a href={`/datasets/${dataset.id}/`}>{dataset.path}</a>
        </h4>
        <p className="card-text badges">
          <span className="badge badge-primary"
                data-toggle="tooltip" data-placement="bottom" title="Simulation round">
            {dataset.attributes.simulation_round}
          </span>
          <span className="badge badge-secondary"
                data-toggle="tooltip" data-placement="bottom" title="Product">
            {dataset.attributes.product}
          </span>
          <span className="badge badge-warning"
                data-toggle="tooltip" data-placement="bottom" title="Sector">
            {dataset.attributes.sector}
          </span>
          <span className="badge badge-success"
                data-toggle="tooltip" data-placement="bottom" title="Impact model">
            {dataset.attributes.model}
          </span>
          <span className="badge badge-info"
                data-toggle="tooltip" data-placement="bottom" title="Variable">
            {dataset.attributes.variable}
          </span>
          <span className="badge badge-dark"
                data-toggle="tooltip" data-placement="bottom" title="Version">
            {dataset.version}
          </span>
        </p>
        <ul className="list-inline float-right">
          <li className="list-inline-item">
            <a href={`/api/v1/datasets/${dataset.id}/filelist/`}>
              Download file list
            </a>
          </li>
          <li className="list-inline-item">
            <a href={`/api/v1/datasets/${dataset.id}/wget/`}>
              Download wget script
            </a>
          </li>
        </ul>
        <ul className="list-inline">
          <li className="list-inline-item">
            <a href="" onClick={this.toggleAttributes}>
              {showAttributes ? 'Hide attributes' : 'Show attributes'}
            </a>
          </li>
          <li className="list-inline-item">
            <a href="" onClick={this.toggleFiles}>
              {showFiles ? 'Hide files' : 'Show files'}
            </a>
          </li>
        </ul>
      </li>
    )
  }

  renderAttributes(dataset) {
    return (
      <li className="list-group-item">
        <h4 className="card-title">Attributes</h4>
        {
          Object.entries(dataset.attributes).map(([key, value], index) => {
            return (
              <div key={key} className="row">
                <div className="col-lg-3">
                  <strong>{key}</strong>
                </div>
                <div className="col-lg-9">
                  {value}
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
        <h4 className="card-title">Files</h4>
        <ul className="list-unstyled">
        {
          dataset.files.map(file => {
            return (
              <li key={file.id}>
                <a href={file.url}>{file.name}</a><br />
                Checksum: {file.checksum}<br />
                Checksum type: {file.checksum_type}
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
  dataset: PropTypes.object.isRequired
}

export default Result
