import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

class Count extends Component {

  render() {
    const { count, isLoading } = this.props

    return (
      <div className="card count d-flex flex-row justify-content-between">
        <div>{ count } datasets found.</div>
        <div>
          {isLoading && <FontAwesomeIcon icon={faSpinner} spin />}
        </div>
      </div>
    )
  }
}

Count.propTypes = {
  count: PropTypes.number.isRequired,
  isLoading: PropTypes.bool.isRequired
}

export default Count
