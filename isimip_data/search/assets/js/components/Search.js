import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'


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
    <div className="search card">
      <div className="card-body">
        <h1 className="card-title">Search the ISIMIP Repository</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="col-12 mb-2 col-md mb-md-0">
              <input className="form-control form-control-lg" type="text" placeholder="Enter search query"
                  onChange={(event) => setQuery(event.target.value)} value={query} />
            </div>
            <div className="col-6 col-md-auto">
              <button className="btn btn-outline-primary btn-lg w-100" type="button" onClick={handleSubmit}>
                Search <span className="material-symbols-rounded symbols-search">search</span>
              </button>
            </div>
            <div className="col-6 col-md-auto">
              <button className="btn btn-outline-secondary btn-lg w-100" type="button" onClick={resetParams}>
                Reset <span className="material-symbols-rounded symbols-reset">close</span>
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
