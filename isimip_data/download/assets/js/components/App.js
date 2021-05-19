import React, { Component} from 'react'
import PropTypes from 'prop-types'
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
      job: null,
      settings: {},
      paths: [...props.paths],
      pathsError: [],
      selected: '',
      selectedError: '',
      country: '',
      countryError: '',
      bbox: ['', '', '', ''],
      bboxError: '',
      serverError: ''
    }
    this.handlePathChange = this.handlePathChange.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.handleCountryChange = this.handleCountryChange.bind(this)
    this.handleBBoxChange = this.handleBBoxChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.togglePath = this.togglePath.bind(this)
  }

  componentDidMount() {
    if (this.props.url) {
      this.fetch(this.props.url)
    }

    CoreApi.fetchSettings().then(settings => {
      this.setState({ settings })
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

    const { settings, paths, selected, country, bbox } = this.state
    let pathsError = [],
        selectedError = '',
        countryError = '',
        bboxError = ''

    if (selected) {
      if (selected == 'country') {
        if (country) {
          this.submit(settings.FILES_API_URL, { paths, country })
        } else {
          countryError = 'Please select a country.'
        }
      } else if (selected == 'bbox') {
        if (bbox && bbox[0] !== '' && bbox[1] !== '' && bbox[2] !== '' && bbox[3] !== '') {
          this.submit(settings.FILES_API_URL, { paths, bbox })
        } else {
          bboxError = 'Please give a valid bounding box.'
        }
      } else if (selected == 'landonly') {
          this.submit(settings.FILES_API_URL, { paths, landonly: true })
      }
    } else {
      selectedError = 'Please select one of the options.'
    }

    this.setState({ pathsError, selectedError, countryError, bboxError })
  }

  submit(url, data) {
    DownloadApi.submitJob(url, data).then(response => {
      if (response.status == 'error') {
        const pathsError = response.errors.paths || []
        const countryError = response.errors.country || '';
        const bboxError = response.errors.bbox || '';
        this.setState({ job: null, pathsError, countryError, bboxError })
      } else {
        setTimeout(() => this.fetch(response.job_url), 2000)

        window.history.pushState({}, document.title, response.id + '/')
        this.setState({ job: response })
      }

    }).catch(error => {
      this.setState({ serverError: 'There has been a problem connecting to the server. If this problem persists, please contact support.' })
    })
  }

  fetch(url) {
    DownloadApi.fetchJob(url).then(response => {
      if (response.status == 'finished' || response.status == 'failed') {
        DownloadApi.downloadFile(response.file_url)
      } else if (response.status == 'queued' || response.status == 'started') {
        setTimeout(() => this.fetch(response.job_url), 10000)
      }

      this.setState({ job: response })
    }).catch(error => {
      this.setState({ serverError: 'There has been a problem connecting to the server. If this problem persists, please contact support.' })
    })
  }

  togglePath(e, path) {
    const paths = this.state.paths.filter(item => item != path)
    this.setState({ paths })
  }

  renderJob() {
    const { job, settings } = this.state

    return (
      <div>
        <h3>Download status</h3>
        <div className="card">
          <div className="card-body">
            {
              job.status == 'queued' &&
              <p className="text-success">
                <FontAwesomeIcon icon={faSpinner} spin /> The download has been queued on the server.
              </p>
            }
            {
              job.status == 'started' &&
              <p className="text-success">
                <FontAwesomeIcon icon={faSpinner} spin /> The files are created on the server ({job.meta.created_files} of {job.meta.total_files} created).
              </p>
            }
            {
              job.status == 'finished' &&
              <p className="text-success">
                The files were successfully created on the server, the download should start now.
              </p>
            }
            {
              job.status == 'failed' &&
              <p className="text-danger">
                Due to a timeout, not all files were successfully created on the server, the download will only contain a subset of the selected files. Please select fewer files.
              </p>
            }
            {
              job.id &&
              <p>
                If you need to close the browser, you can check the status of this download later. You can bookmark this page or store its URL otherwise: <a href={document.location.toString()} target="blank">{document.location.toString()}</a>. After completion, the files will be stored on the server for {job.ttl/60.0/60.0} hours.
              </p>
            }
            {
              !job.id &&
              <p className="text-danger">
                The download was not found. Probably it was deleted automatically after some time.
              </p>
            }
          </div>
        </div>
      </div>
    )
  }

  renderForm() {
    const { settings, paths, pathsError, selected, selectedError, country, countryError, bbox, bboxError, serverError } = this.state

    return (
      <form onSubmit={this.handleSubmit} noValidate>
        <h3>Selected files</h3>
        <div className="card">
          <div className="card-body">
          {
            this.props.paths.map((path, index) => {
              return (
                <div className="form-check" key={index}>
                  <input className="form-check-input" type="checkbox" id={index}
                         defaultChecked={paths.includes(path)}
                         onChange={e => this.togglePath(e, path)} />
                  <label className="form-check-label" htmlFor={index}>{path}</label>
                </div>
              )
            })
          }
          {
            pathsError && pathsError.map((error, index) => {
              return <p className="text-danger" key={index}>{error}</p>
            })
          }
          </div>
        </div>

        <h3>Restrict download area</h3>
        <div className="card">
          <div className="card-body">
            <p>
              Download file sizes can be reduced by restricting the geographical extend of the dataset. This is done by masking all data outside of a certain country, bounding box or by applying a land-sea-mask.
            </p>

            <p>
              Please note that the masking of NetCDF files takes a considerable amount of time. Depending on the size of the dataset, it can take tens of minutes to create the download. It is only possible to mask global files.
            </p>

            <div className="mt-2">
              <Country selected={selected} country={country} countryError={countryError}
                  onChange={this.handleCountryChange} onSelect={this.handleSelectChange}
                  help={settings.DOWNLOAD_HELP_COUNTRY} />
            </div>

            <div className="mt-2">
              <BBox selected={selected} bbox={bbox} bboxError={bboxError}
                  onChange={this.handleBBoxChange} onSelect={this.handleSelectChange}
                  help={settings.DOWNLOAD_HELP_BBOX} />
            </div>

            <div className="mt-2">
              <Landonly selected={selected} onSelect={this.handleSelectChange}
                        help={settings.DOWNLOAD_HELP_LANDONLY} />
            </div>

            {
              selectedError && <p className="text-danger">
                {selectedError}
              </p>
            }
          </div>
        </div>

        <div className="text-center">
          <div className="mb-3">
            <button className="btn btn-success btn-lg" onClick={this.handleSubmit}>
              Download file
            </button>
          </div>
          {
            serverError && <p className="text-danger mt-4">
              {serverError}
            </p>
          }
        </div>
      </form>
    )
  }

  render() {
    if (this.state.job) {
      return this.renderJob()
    } else if (this.props.paths.length > 0) {
      return this.renderForm()
    } else if (this.state.serverError) {
      return <p className="text-center text-danger mt-4">{this.state.serverError}</p>
    } else {
      return null
    }
  }
}

App.propTypes = {
  url: PropTypes.string,
  paths: PropTypes.array.isRequired
}

export default App
