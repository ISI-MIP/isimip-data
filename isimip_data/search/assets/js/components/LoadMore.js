import React from 'react'
import PropTypes from 'prop-types'


const LoadMore = ({ onLoadMore, isLoading }) => (
  <div className="row justify-content-md-center">
    <div className="col col-lg-4">
      <div className="card load-more">
        <div className="card-header d-flex justify-content-center">
          {isLoading && <span className="material-symbols-rounded symbols-spin">progress_activity</span>}
          {!isLoading && <button className="btn btn-link" onClick={() => onLoadMore()}>
            Load more datasets
          </button>}
        </div>
      </div>
    </div>
  </div>
)

LoadMore.propTypes = {
  onLoadMore: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired
}

export default LoadMore
