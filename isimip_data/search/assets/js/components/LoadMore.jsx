import React from 'react'
import PropTypes from 'prop-types'

import Spinner from 'isimip_data/core/assets/js/components/Spinner'


const LoadMore = ({ onClick, isFetching }) => (
  <div className="d-flex justify-content-center">
    {isFetching ? <Spinner className="mt-2" /> : (
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-center">
            <button type="button" className="link" onClick={onClick}>
              Load more datasets
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
)

LoadMore.propTypes = {
  onClick: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired
}

export default LoadMore
