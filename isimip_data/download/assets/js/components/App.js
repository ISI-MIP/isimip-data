import React, { Component} from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

import { getLocationParams, getLocationString } from 'isimip_data/metadata/assets/js/utils/location'

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
      selectedError: '',
      country: '',
      countryError: '',
      bbox: ['', '', '', ''],
      bboxError: '',
      message: '',
      error: ''
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
    this.setState({ selected: value, selectedError: '' })
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
    let selectedError = '',
        countryError = '',
        bboxError = '',
        error = ''

    if (selected) {
      if (selected == 'country') {
        if (country) {
          this.fetch(settings.FILES_API_URL, { path, country })
        } else {
          countryError = 'Please select one of the options.'
        }
      } else if (selected == 'bbox') {
        if (bbox) {
          this.fetch(settings.FILES_API_URL, { path, bbox })
        } else {
          bboxError = 'Please select one of the options.'
        }
      } else if (selected == 'landonly') {
          this.fetch(settings.FILES_API_URL, { path, landonly: true })
      }
    } else {
      selectedError = 'Please select one of the options.'
    }

    this.setState({ selectedError, countryError, bboxError, error })
  }

  fetch(url, data) {
    DownloadApi.submitJob(url, data).then(response => {
      if (response.status == 'finished') {
        DownloadApi.downloadFile(response.file_url)
        this.setState({ message: '' })
      } else if (response.status == 'queued') {
        setTimeout(() => this.fetch(url, data), 2000)
        this.setState({ message: 'The download request was queued on the server.' })
      } else if (response.status == 'error') {
        const pathError = response.errors.path || ''
        const countryError = response.errors.country || '';
        const bboxError = response.errors.bbox || '';
        this.setState({ message: '', pathError, countryError, bboxError })
      } else {
        let message
        if (response.meta.total_files > 0) {
          message = `The files are created on the server (${response.meta.created_files} of ${response.meta.total_files} created). The download will start once all files are created.`
        } else {
          message = 'The file is created on the server. The download will start soon.'
        }

        setTimeout(() => this.fetch(url, data), 10000)
        this.setState({ message })
      }
    }).catch(error => {
      this.setState({ error: 'There has been a problem connecting to the server. If this problem persists, please contact support.' })
    })
  }

  render() {
    const { path, pathError, selected, selectedError, country, countryError, bbox, bboxError, message, error } = this.state

    return (
      <div>
        <div className="row justify-content-md-center">
          <div className="col-sm-8">
            <header>
              <h1>Configure download</h1>
            </header>
          </div>
        </div>
        <form className="text-center" onSubmit={this.handleSubmit} noValidate>
          <Path path={path} pathError={pathError} onChange={this.handlePathChange} />

          <div className="row justify-content-md-center mt-5">
            <div className="col-md-8">
              <h2>Restrict download area</h2>

              <p>
                Download file sizes can be reduced by restricting the geographical extend of the dataset. This is done by masking all data outside of a certain country, bounding box or by applying a land-sea-mask.
              </p>

              <div className="mt-2">
                <Country selected={selected} country={country} countryError={countryError}
                    onChange={this.handleCountryChange} onSelect={this.handleSelectChange} />
              </div>

              <div className="mt-2">
                <BBox selected={selected} bbox={bbox} bboxError={bboxError}
                    onChange={this.handleBBoxChange} onSelect={this.handleSelectChange} />
              </div>

              <div className="mt-2">
                <Landonly selected={selected} onSelect={this.handleSelectChange} />
              </div>

              <div className="mt-4">
                <button className="btn btn-success btn-lg" onClick={this.handleSubmit}>
                  Download file
                </button>
              </div>

              {
                message && <p className="text-success mt-4">
                  <FontAwesomeIcon icon={faSpinner} spin /> {message}
                </p>
              }
              {
                error && <p className="text-danger mt-4">
                  {error}
                </p>
              }
              {
                selectedError && <p className="col-md-8 text-danger mt-4">
                  {selectedError}
                </p>
              }
            </div>
          </div>
        </form>
      </div>
    )
  }
}

export default withRouter(App)
