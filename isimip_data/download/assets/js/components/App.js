import React, { Component} from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

import { getLocationParams, getLocationString } from 'isimip_data/core/assets/js/utils/location'

import CoreApi from 'isimip_data/core/assets/js/api/CoreApi'
import DownloadApi from '../api/DownloadApi'

import Path from './Path'
import Country from './Country'
import BBox from './BBox'
import Landonly from './Landonly'


class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      settings: {},
      path: '',
      pathError: '',
      selected: '',
      country: '',
      bbox: ['', '', '', ''],
      message: ''
    }
    this.handlePathChange = this.handlePathChange.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.handleCountryChange = this.handleCountryChange.bind(this)
    this.handleBBoxChange = this.handleBBoxChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    // remove /download/ and trailing slash from path
    const path = this.props.location.pathname.replace('/download/', '').replace(/\/$/, '')

    CoreApi.fetchSettings().then(settings => {
      this.setState({ path, settings })
    })
  }

  handlePathChange(value) {
    this.setState({ path: value, pathError: '' })
  }

  handleSelectChange(value) {
    this.setState({ selected: value })
  }

  handleCountryChange(value) {
    this.setState({ country: value })
  }

  handleBBoxChange(value) {
    this.setState({ bbox: value })
  }

  handleSubmit(e) {
    e.preventDefault()

    const { settings, path, selected, country, bbox } = this.state
    const data = { path }

    if (selected) {
      if (selected == 'country') {
        data.country = country
      } else if (selected == 'bbox') {
        data.bbox = bbox
      } else if (selected == 'landonly') {
        data.landonly = true
      }

      this.fetch(settings.FILES_API_URL, data)
    } else {
      DownloadApi.downloadFile(settings.FILES_BASE_URL + path).then(response => {
        this.setState({pathError: response.errors.path})
      })
    }
  }

  fetch(url, data) {
    DownloadApi.submitJob(url, data).then(response => {
      if (response.status == 'finished') {
        DownloadApi.downloadFile(response.file_url)
        this.setState({ message: '' })
      } else if (response.status == 'error') {
        this.setState({ message: '', pathError: response.errors.path })
      } else {
        setTimeout(() => this.fetch(url, data), 1000)
        this.setState({ message: 'The file is created on the server, the download will start soon.' })
      }
    })
  }

  render() {
    const { path, pathError, selected, country, bbox, message } = this.state

    return (
      <div>
        <div className="row justify-content-md-center">
          <div className="col col-md-8 text-center">
            <h1>Download file</h1>

            <form className="download-form" onSubmit={this.handleSubmit} noValidate>
              <Path path={path} pathError={pathError} onChange={this.handlePathChange} />

              <h2>Restrict download area</h2>

              <p>
                Download file sizes can be reduced by restricting the geographical extend of the dataset. This is done by masking all data outside of a certain country, bounding box or by applying a land-sea-mask.
              </p>

              <Country selected={selected} country={country}
                  onChange={this.handleCountryChange} onSelect={this.handleSelectChange} />

              <BBox selected={selected} bbox={bbox}
                  onChange={this.handleBBoxChange} onSelect={this.handleSelectChange} />

              <Landonly selected={selected} onSelect={this.handleSelectChange} />

              <div className="download-form-submit">
                <button className="btn btn-success btn-lg" onClick={this.handleSubmit}>
                  Download file
                </button>
              </div>

              {
                message && <p className="download-message text-success">
                  <FontAwesomeIcon icon={faSpinner} spin /> {message}
                </p>
              }
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(App)
