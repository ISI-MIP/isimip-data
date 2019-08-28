import React, { Component } from 'react'
import PropTypes from 'prop-types'


class Count extends Component {

  render() {
    const { count } = this.props

    return (
      <div className="card count">
      { count } datasets found.
      </div>
    )
  }
}

Count.propTypes = {
  count: PropTypes.number.isRequired
}

export default Count
