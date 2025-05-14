import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDebouncedCallback } from 'use-debounce'

import Icon from 'isimip_data/core/assets/js/components/Icon'


const FilterInput = ({ values, setValues }) => {

  const [input, setInput] = useState(values.filter || '')

  const debouncedSetValuesFilter = useDebouncedCallback((values) => setValues(values), 500)

  const handleChange = (event) => {
    setInput(event.target.value)
    debouncedSetValuesFilter({ ...values, filter: event.target.value })
  }

  const handleReset = () => {
    setInput('')
    setValues({ })
  }

  return (
    <div className="d-flex">
      <div className="flex-grow-1">
          <input className="form-control form-control-lg mb-1" type="text"
                 placeholder="Filter by DOI, title, creator, or path"
                 value={input} onChange={handleChange} />
      </div>

      <div className="ms-2">
          <button role="button" className="d-flex align-items-center btn btn-outline-secondary btn-lg"
                  onClick={handleReset}>
            Reset <Icon icon="close" size="lg" />
          </button>
      </div>
    </div>
  )
}

FilterInput.propTypes = {
  values: PropTypes.object.isRequired,
  setValues: PropTypes.func.isRequired
}

export default FilterInput
