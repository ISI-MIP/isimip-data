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
import Range from './Range'
import Point from './Point'


class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      job: null,
      settings: {},
      mode: 'range',
      rangeDomain: [1600, 2100],
      rangeValues: [1600, 2100],
      paths: [...props.files.map(file => file.path)],
      pathsError: [],
      task: '',
      taskError: '',
      country: '',
      countryError: '',
      bbox: ['', '', '', ''],
      bboxError: '',
      point: ['', '', '', ''],
      pointError: '',
      serverError: ''
    }

    this.handleModeChange =this.handleModeChange.bind(this)
    this.handleRangeChange = this.handleRangeChange.bind(this)
    this.handlePathChange = this.handlePathChange.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.handleCountryChange = this.handleCountryChange.bind(this)
    this.handleBBoxChange = this.handleBBoxChange.bind(this)
    this.handlePointChange = this.handlePointChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.togglePath = this.togglePath.bind(this)
  }

  componentDidMount() {
    if (this.props.url) {
      this.fetch(this.props.url)
    }

    if (this.props.files) {
      // compute the start_year/end_year of the files in this.props.files
      const range = this.props.files.reduce((acc, cur) => {
        let [start_year, end_year] = acc

        if (cur.specifiers.start_year && cur.specifiers.start_year < start_year) {
          start_year = cur.specifiers.start_year
        }
        if (cur.specifiers.end_year && cur.specifiers.end_year > end_year) {
          end_year = cur.specifiers.end_year
        } else if (cur.specifiers.start_year && cur.specifiers.start_year > end_year) {
          // workaround for files with a start_year, but no end_year
          end_year = cur.specifiers.start_year
        }

        return [start_year, end_year]
      }, [3000, 0])

      this.setState({
        rangeDomain: [...range],
        rangeValues: [...range]
      })
    }

    CoreApi.fetchSettings().then(settings => {
      this.setState({ settings })
    })
  }

  handleModeChange(mode) {
    this.setState({ mode })
  }

  handleRangeChange(specifier, value) {
    let [ startYear, endYear ] = this.state.rangeValues

    if (specifier == 'start_year') {
      startYear = (value < endYear) ? value : startYear
    } else if (specifier == 'end_year') {
      endYear = (value > startYear) ? value : endYear
    }

    const paths = this.props.files.filter(file => {
      return (file.specifiers.start_year === undefined) ||
             (file.specifiers.start_year >= startYear && file.specifiers.start_year <= endYear)
    }).map(file => file.path)

    this.setState({ rangeValues: [startYear, endYear], paths })
  }

  handlePathChange(value) {
    this.setState({ path: value, pathError: '' })
  }

  handleSelectChange(value) {
    this.setState({ task: value, taskError: '', countryError: '', bboxError: '' })
  }

  handleCountryChange(value) {
    this.setState({ country: value })
  }

  handleBBoxChange(value) {
    this.setState({ bbox: value })
  }

  handlePointChange(value) {
    this.setState({ point: value })
  }

  handleSubmit(e) {
    e.preventDefault()

    const { settings, paths, task, country, bbox, point } = this.state
    let pathsError = [],
        taskError = '',
        countryError = '',
        bboxError = '',
        pointError = ''

    if (task) {
      if (['mask_country', 'select_country'].includes(task)) {
        if (country) {
          this.submit(settings.FILES_API_URL, { paths, task, country })
        } else {
          countryError = 'Please select a country.'
        }
      } else if (['cutout_bbox', 'mask_bbox', 'select_bbox'].includes(task)) {
        if (bbox && bbox[0] !== '' && bbox[1] !== '' && bbox[2] !== '' && bbox[3] !== '') {
          this.submit(settings.FILES_API_URL, { paths, task, bbox })
        } else {
          bboxError = 'Please give a valid bounding box.'
        }
      } else if (['select_point'].includes(task)) {
        if (point && point[0] !== '' && point[1] !== '') {
          this.submit(settings.FILES_API_URL, { paths, task, point })
        } else {
          pointError = 'Please give a valid point.'
        }
      } else {
          this.submit(settings.FILES_API_URL, { paths, task })
      }
    } else {
      taskError = 'Please select one of the options.'
    }

    this.setState({ pathsError, taskError, countryError, bboxError, pointError })
  }

  submit(url, data) {
    DownloadApi.submitJob(url, data).then(response => {
      if (response.status == 'error') {
        const pathsError = response.errors.paths || []
        const countryError = response.errors.country || '';
        const bboxError = response.errors.bbox || '';
        const pointError = response.errors.point || '';
        this.setState({ job: null, pathsError, countryError, bboxError, pointError })
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
    const { paths } = this.state
    if (paths.includes(path)) {
      this.setState({ paths: paths.filter(item => item != path) })
    } else {
      paths.push(path)
      this.setState({ paths })
    }
  }

  toggleAll(e) {
    const allChecked = (this.state.paths.length == this.props.files.length)
    if (allChecked) {
      this.setState({ paths: [] })
    } else {
      this.setState({ paths: this.props.files.map(file => file.path) })
    }
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
              <>
                <p className="text-success">
                  The files were successfully created on the server, the download should start now.
                </p>
                <p>
                  Alternatively, you can use the following link: <a href={job.file_url} target="_blank">{job.file_url}</a>.
                </p>
              </>
            }
            {
              job.status == 'failed' &&
              <p className="text-danger">
                Due to a timeout, not all files were successfully created on the server, the download will only contain a subset of the selected files. Please select fewer files.
              </p>
            }
            {
              job.id &&
              <>
                <p>
                  If you need to close the browser, you can bookmark this page or store its URL otherwise: <a href={document.location.toString()} target="_blank">{document.location.toString()}</a>.
                </p>
                <p>
                  After completion, the files will be stored on the server for {job.ttl/60.0/60.0} hours.
                </p>
              </>
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
    const { settings, mode, rangeDomain, rangeValues, paths, pathsError, task, taskError,
            country, countryError, bbox, bboxError, point, pointError, serverError } = this.state
    const allChecked = (paths.length == this.props.files.length)
    const [startYear, endYear] = rangeValues

    if (Object.keys(settings).length == 0) {
      return null
    }

    const active = Object.entries(settings.DOWNLOAD).reduce((acc, [type, config]) => {
      if (config.resolutions) {
        acc[type] = this.props.files.every(file => config.resolutions.concat(undefined)
                                                                     .includes(file.specifiers.resolution))
      }
      return acc
    }, {})

    return (
      <form onSubmit={this.handleSubmit} noValidate>
        <h3>Selection</h3>
        <div className="card mb-2">
          <div className="card-header">
            <div className="form-check form-check-inline mb-0">
              <input className="form-check-input" type="radio" id="range-radio"
                     onChange={e => this.handleModeChange('range')} checked={mode == 'range'} />
              <label className="form-check-label font-weight-normal" htmlFor="range-radio">
                Select time range
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="radio" id="files-radio"
                     onChange={e => this.handleModeChange('files')} checked={mode == 'files'} />
              <label className="form-check-label font-weight-normal" htmlFor="files-radio">
                Select individual files
              </label>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            {
              mode == 'range' && <div>
                <Range domain={rangeDomain} values={rangeValues} onChange={this.handleRangeChange} />
                <div className="text-center">
                  <span className="mr-2"><strong>Start year:</strong> {startYear}</span>
                  <span className="mr-2"><strong>End year:</strong> {endYear}</span>
                  <span><strong>Number of files:</strong> {paths.length}</span>
                </div>
              </div>
            }
            {
              mode == 'files' && <div>
                {
                  this.props.files.length > 3 && <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="check-all"
                           checked={allChecked}
                           onChange={e => this.toggleAll(e)} />
                    <label className="form-check-label text-muted" htmlFor="check-all">
                      {allChecked ? <span>Uncheck all</span> : <span>Check all</span>}
                    </label>
                  </div>
                }
                {
                  this.props.files.map((file, index) => {
                    return (
                      <div className="form-check" key={index}>
                        <input className="form-check-input" type="checkbox" id={index}
                               checked={paths.includes(file.path)}
                               onChange={e => this.togglePath(e, file.path)} />
                        <label className="form-check-label" htmlFor={index}>{file.path}</label>
                      </div>
                    )
                  })
                }
              </div>
            }
            {
              pathsError && pathsError.map((error, index) => {
                return <p className="text-danger" key={index}>{error}</p>
              })
            }
          </div>
        </div>

        {
          active.cutout_bbox && <div>
            <h3>Cut out area</h3>
            <div className="card">
              <div className="card-body">
                <p dangerouslySetInnerHTML={{__html: settings.DOWNLOAD.cutout.help}}></p>

                {active.cutout_bbox && <div className="mt-2">
                  <BBox name="cutout_bbox" task={task} bbox={bbox} bboxError={bboxError}
                      onChange={this.handleBBoxChange} onSelect={this.handleSelectChange}
                      label={settings.DOWNLOAD.cutout_bbox.label} help={settings.DOWNLOAD.cutout_bbox.help} />
                </div>}
              </div>
            </div>
          </div>
        }

        {
          (active.mask_country || active.mask_bbox || active.mask_landonly) && <div>
            <h3>Mask area</h3>
            <div className="card">
              <div className="card-body">
                <p dangerouslySetInnerHTML={{__html: settings.DOWNLOAD.mask.help}}></p>

                {active.mask_country && <div className="mt-2">
                  <Country name="mask_country" task={task} country={country} countryError={countryError}
                      onChange={this.handleCountryChange} onSelect={this.handleSelectChange}
                      label={settings.DOWNLOAD.mask_country.label} help={settings.DOWNLOAD.mask_country.help} />
                </div>}

                {active.mask_bbox && <div className="mt-2">
                  <BBox name="mask_bbox" task={task} bbox={bbox} bboxError={bboxError}
                      onChange={this.handleBBoxChange} onSelect={this.handleSelectChange}
                      label={settings.DOWNLOAD.mask_bbox.label} help={settings.DOWNLOAD.mask_bbox.help} />
                </div>}

                {active.mask_landonly && <div className="mt-2">
                  <Landonly name="mask_landonly" task={task} onSelect={this.handleSelectChange}
                      label={settings.DOWNLOAD.mask_landonly.label} help={settings.DOWNLOAD.mask_landonly.help} />
                </div>}
              </div>
            </div>
          </div>
        }

        {
          (active.select_country || active.select_bbox || active.select_point) && <div>
            <h3>Select time series</h3>
            <div className="card">
              <div className="card-body">
                <p dangerouslySetInnerHTML={{__html: settings.DOWNLOAD.select.help}}></p>


                {active.select_country && <div className="mt-2">
                  <Country name="select_country" task={task} country={country} countryError={countryError}
                      onChange={this.handleCountryChange} onSelect={this.handleSelectChange}
                      label={settings.DOWNLOAD.select_country.label} help={settings.DOWNLOAD.select_country.help} />
                </div>}

                {active.select_bbox && <div className="mt-2">
                  <BBox name="select_bbox" task={task} bbox={bbox} bboxError={bboxError}
                      onChange={this.handleBBoxChange} onSelect={this.handleSelectChange}
                      label={settings.DOWNLOAD.select_bbox.label} help={settings.DOWNLOAD.select_bbox.help} />
                </div>}

                {active.select_point && <div className="mt-2">
                  <Point name="select_point" task={task} point={point} pointError={pointError}
                      onChange={this.handlePointChange} onSelect={this.handleSelectChange}
                      label={settings.DOWNLOAD.select_point.label} help={settings.DOWNLOAD.select_point.help} />
                </div>}
              </div>
            </div>
          </div>
        }

        {
          taskError && <div className="card">
            <div className="card-body">
              <p className="text-danger">
                {taskError}
              </p>
            </div>
          </div>
        }

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
    } else if (this.props.files.length > 0) {
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
  files: PropTypes.array.isRequired
}

export default App
