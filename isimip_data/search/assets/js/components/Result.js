import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile } from '@fortawesome/free-solid-svg-icons'
import { faFile as faFileRegular } from '@fortawesome/free-regular-svg-icons'


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
        <ul className="list-inline result-options">
          <li className="list-inline-item">
            <a href="" onClick={this.toggleAttributes}>
              {showAttributes ? 'Hide Attributes' : 'Show Attributes'}
            </a>
          </li>
          <li className="list-inline-item">
            <a href="" onClick={this.toggleFiles}>
              {showFiles ? 'Hide Files' : 'Show Files'}
            </a>
          </li>
        </ul>
        <h4 className="card-title">{dataset.name}</h4>
        <p className="card-text">
          Simulation round: {dataset.attributes.simulation_round}<br />
          Product: {dataset.attributes.product}<br />
          Sector: {dataset.attributes.sector}<br />
          Version: {dataset.version}<br />
          {dataset.search_rank > 0 && 'Search rank: ' + dataset.search_rank}
        </p>
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
                <a href={file.url} target="_blank">{file.name}</a><br />
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
