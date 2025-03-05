import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDebouncedCallback } from 'use-debounce'

const Filter = ({ values, setValues }) => {

  const [filterString, setFilterString] = useState(values.filterString)

  const debouncedSetValuesFilter = useDebouncedCallback((values) => setValues(values), 500)

  const handleChange = (event) => {
    setFilterString(event.target.value)
    debouncedSetValuesFilter({ ...values, filterString: event.target.value })
  }

  const handleReset = () => {
    setFilterString('')
    setValues({ ...values, filterString: '' })
  }

  return (
    <div className="filter card mb-2">
      <div className="card-body">
        <div className="form-row">
          <div className="col-12 mb-2 col-md mb-md-0">
            <input className="form-control form-control-lg mb-1" type="text"
                   placeholder="Filter by DOI, title, creator, or path"
                   value={filterString} onChange={handleChange} />
            <div className="float-md-right text-muted">
              The list of DOI will update as you type.
            </div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="checkbox" id="show-all-checkbox"
                     checked={values.showAll} onChange={() => setValues({ ...values, showAll: !values.showAll })} />
              <label className="form-check-label" htmlFor="show-all-checkbox">
                Show older DOI versions as well
              </label>
            </div>
          </div>
          <div className="col-6 col-md-auto">
            <button className="btn btn-outline-secondary btn-lg w-100" type="button" onClick={handleReset}>
              Reset <span className="material-symbols-rounded symbols-reset">close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

Filter.propTypes = {
  values: PropTypes.object.isRequired,
  setValues: PropTypes.func.isRequired
}

export default Filter
