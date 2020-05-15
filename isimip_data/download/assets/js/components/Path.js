import React, { Component } from 'react'
import PropTypes from 'prop-types'


class Path extends Component {

  constructor(props) {
    super(props)
    this.state = {
      error: ''
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(e) {
    if (e.target.value) {
      this.setState({ error: '' })
    } else {
      this.setState({ error: 'This field is required.' })
    }

    this.props.onChange(e.target.value)
  }

  render() {
    const { path, pathError } = this.props
    const { error } = this.state

    return (
      <div className="download-path">
        <label className="form-check-label" htmlFor="input-path">Path</label>
        <input className={'form-control ' + ((error || pathError) && 'is-invalid')}
            type="text" id="input-path"
            placeholder="Path" value={path} onChange={this.handleChange} required />
        <div className="invalid-feedback">{error}</div>
        <div className="invalid-feedback">{pathError}</div>
      </div>
    )
  }
}

Path.propTypes = {
  path: PropTypes.string.isRequired,
  pathError: PropTypes.string.isRequired
}

export default Path
