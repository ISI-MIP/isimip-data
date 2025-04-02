import React from 'react'
import PropTypes from 'prop-types'

import FilterCategory from './FilterCategory'
import FilterInput from './FilterInput'
import FilterOrder from './FilterOrder'
import FilterSeverity from './FilterSeverity'
import FilterStatus from './FilterStatus'

const Filter = ({ values, setValues }) => (
  <div className="filter card mb-1">
    <div className="card-body">
      <FilterInput values={values} setValues={setValues} />

      <div className="d-lg-flex gap-2">
        <FilterCategory values={values} setValues={setValues} />
        <FilterSeverity values={values} setValues={setValues} />
        <FilterStatus values={values} setValues={setValues} />
        <div className="d-none d-md-block me-2"></div>
        <FilterOrder values={values} setValues={setValues} />
        <div className="text-muted ms-auto">
          The list of caveats will update as you type.
        </div>
      </div>
    </div>
  </div>
)

Filter.propTypes = {
  values: PropTypes.object.isRequired,
  setValues: PropTypes.func.isRequired
}

export default Filter
