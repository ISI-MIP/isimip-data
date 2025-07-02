import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import Icon from 'isimip_data/core/assets/js/components/Icon'


const Search = ({ params, updateParams, resetParams }) => {

  const [query, setQuery] = useState('')

  useEffect(() => {
    setQuery(params.query || '')
  }, [params])

  const handleSubmit = (event) => {
    event.preventDefault()
    updateParams({ query })
  }

  return (
    <div className="card pt-2 pb-2">
      <div className="card-body">
        <h1 className="card-title mb-2">Search the ISIMIP Repository</h1>

        <form onSubmit={handleSubmit}>
          <div className="d-md-flex">
            <div className="flex-grow-1 mb-2 mb-md-0">
              <input className="form-control form-control-lg" type="text" placeholder="Enter search query"
                  onChange={(event) => setQuery(event.target.value)} value={query} />
            </div>
            <div className="mb-2 mb-md-0 ms-md-2">
              <button type="button" className="d-flex align-items-center btn btn-outline-primary btn-lg search-button"
                      aria-label="Search" onClick={handleSubmit}>
                Search <Icon icon="search" size="lg" className="ms-1" />
              </button>
            </div>
            <div className="ms-md-2">
              <button type="button" className="d-flex align-items-center btn btn-outline-secondary btn-lg reset-button"
                      aria-label="Reset" onClick={resetParams}>
                Reset <Icon icon="close" size="lg" className="ms-1" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

Search.propTypes = {
  params: PropTypes.object.isRequired,
  updateParams: PropTypes.func.isRequired,
  resetParams: PropTypes.func.isRequired
}

export default Search
