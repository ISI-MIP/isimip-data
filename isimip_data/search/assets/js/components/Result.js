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
        <p className="card-text badges float-right">
          <span className="badge badge-dark"
                data-toggle="tooltip" data-placement="bottom" title="Version">
            {dataset.version}
          </span>
        </p>
        <p className="card-text badges">
          <span className="badge badge-primary"
                data-toggle="tooltip" data-placement="bottom" title="Simulation round">
            {dataset.attributes.simulation_round}
          </span>
          <span className="badge badge-secondary"
                data-toggle="tooltip" data-placement="bottom" title="Data product">
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
                data-toggle="tooltip" data-placement="bottom" title="Period">
            {dataset.attributes.period}
          </span>
        </p>

        <h4 className="card-title">
          <a href={dataset.metadata_url} target="_blank">{dataset.name}</a>
        </h4>

        <ul className="list-inline float-right">
          <li className="list-inline-item">
            <a href={dataset.filelist_url}>
              Download file list
            </a>
          </li>
          <li className="list-inline-item">
            <a href={dataset.wget_url}>
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

        <table className="table">
          <thead>
            <tr>
              <th className="border-top-0">File name</th>
              <th className="border-top-0">Checksum</th>
              <th className="border-top-0"></th>
            </tr>
          </thead>
          <tbody>
          {
            dataset.files.map(file => (
              <tr key={file.id}>
                <td><a href={dataset.metadata_url} target="_blank">{file.name}</a></td>
                <td>{file.checksum}</td>
                <td><a href={file.file_url}>Download</a></td>
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
  dataset: PropTypes.object.isRequired
}

export default Result
