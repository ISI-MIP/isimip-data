import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDebouncedCallback } from 'use-debounce'

import Icon from 'isimip_data/core/assets/js/components/Icon'
import Checkbox from 'isimip_data/core/assets/js/components/Checkbox'

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
        <div className="d-flex">
          <div className="flex-grow-1">
            <input className="form-control form-control-lg mb-1" type="text"
                   placeholder="Filter by DOI, title, creator, or path"
                   value={filterString} onChange={handleChange} />
            <div className="float-md-end text-muted">
              The list of DOI will update as you type.
            </div>

            <Checkbox checked={values.showAll} onChange={() => setValues({ ...values, showAll: !values.showAll })}>
              Show older DOI versions as well
            </Checkbox>
          </div>

          <div className="ms-md-2">
            <button role="button" className="d-flex align-items-center btn btn-outline-secondary btn-lg" onClick={handleReset}>
              Reset <Icon icon="close" size="lg" />
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
