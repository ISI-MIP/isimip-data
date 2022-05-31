import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ls from 'local-storage'


class Version extends Component {

  constructor(props) {
    super(props)
    this.state = {
      after: '',
      before: '',
      showVersions: false
    }
    this.handleshowVersionsChange = this.handleshowVersionsChange.bind(this)
    this.handleAfterChange = this.handleAfterChange.bind(this)
    this.handleBeforeChange = this.handleBeforeChange.bind(this)
    this.handleApply = this.handleApply.bind(this)
  }

  componentDidMount() {
    let showVersions = ls.get('showVersions')
    if (showVersions === null) {
      showVersions = false
    }
    this.setState({ showVersions })
  }

  componentDidUpdate(prevProps) {
    if (this.props.params.after !== prevProps.params.after || this.props.params.before !== prevProps.params.before) {
      const after = this.props.params.after || ''
      const before = this.props.params.before || ''

      this.setState({ after, before })
    }
  }

  handleshowVersionsChange(showVersions) {
    const { onChange } = this.props

    if (showVersions === false) {
      onChange({
        after: false,
        before: false
      })
    }

    ls.set('showVersions', showVersions)
    this.setState({ showVersions })
  }

  handleAfterChange(e) {
    this.setState({ after: e.target.value })
  }

  handleBeforeChange(e) {
    this.setState({ before: e.target.value })
  }

  handleApply() {
    const { onChange } = this.props
    const { after, before } = this.state

    onChange({
      after: after || false,
      before: before || false
    })
  }

  render() {
    const { params, onChange } = this.props
    const { after, before, showVersions } = this.state
    const allChecked = params.all === 'true' || false

    return (
      <div className="card version">
        <div className="card-header d-md-flex">
          <div className="form-check form-check-inline mb-2 mb-md-0">
            <input className="form-check-input" type="radio" id="latest-version-radio"
                   checked={!showVersions} onChange={e => this.handleshowVersionsChange(false)} />
            <label className="form-check-label" htmlFor="latest-version-radio">
              Show only the latest version
            </label>
          </div>
          <div className="form-check form-check-inline mb-2 mb-md-0">
            <input className="form-check-input" type="radio" id="specific-versions-radio"
                   checked={showVersions} onChange={e => this.handleshowVersionsChange(true)} />
            <label className="form-check-label" htmlFor="specific-versions-radio">
              Show specific versions with date constraints
            </label>
          </div>
          <div className="form-check form-check-inline ml-auto mr-0">
            <input className="form-check-input" type="checkbox" id="archived-versions-checkbox"
                   checked={allChecked} onChange={e => onChange({ all: !allChecked})} />
            <label className="form-check-label" htmlFor="archived-versions-checkbox">Show archived files</label>
          </div>
        </div>
        {showVersions &&
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <div className="row align-items-center">
                <div className="col-12 col-md-auto mb-2 mb-md-0">
                  <label className="form-check-label">Version range:</label>
                </div>
                <div className="col-12 col-md mb-2 mb-md-0">
                  <input type="text" className="form-control form-control-sm" placeholder="After YYYYMMDD" value={after}
                         onChange={this.handleAfterChange} />
                </div>
                <div className="col-12 col-md-auto mb-2 mb-md-0">
                  <label className="form-check-label">≤ Dataset version ≤</label>
                </div>
                <div className="col-12 col-md mb-2 mb-md-0">
                  <input type="text" className="form-control form-control-sm" placeholder="Before YYYYMMDD" value={before}
                         onChange={this.handleBeforeChange} />
                </div>
                <div className="col-12 col-md-auto">
                  <button className="btn btn-default btn-sm" onClick={this.handleApply}>Apply range</button>
                </div>
              </div>
            </li>
          </ul>
        }
      </div>
    )
  }
}

Version.propTypes = {
  params: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
}

export default Version
