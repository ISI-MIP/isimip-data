import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp, faTimes, faSpinner  } from '@fortawesome/free-solid-svg-icons'


class LoadMore extends Component {

  render() {
    const { onLoadMore, isLoading } = this.props

    return (
      <div className="row justify-content-md-center">
        <div className="col col-lg-4">
          <div className="card">
            <div className="card-header d-flex justify-content-center">
              {isLoading && <FontAwesomeIcon icon={faSpinner} spin />}
              {!isLoading && <button className="btn btn-link" onClick={e => onLoadMore()}>
                Load more datasets
              </button>}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

LoadMore.propTypes = {
  onLoadMore: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired
}

export default LoadMore
