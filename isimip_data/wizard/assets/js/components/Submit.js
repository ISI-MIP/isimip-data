import React, { Component } from 'react'
import PropTypes from 'prop-types'


class Submit extends Component {

  render() {
    const { params, onSubmit } = this.props

    if (Object.keys(params).length) {
      return (
        <div className="submit">
          <button className="btn btn-success btn-lg" onClick={onSubmit}>
            Submit
          </button>
        </div>
      )
    } else {
      return null
    }
  }
}

Submit.propTypes = {
  params: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default Submit
