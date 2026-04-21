import React from 'react'
import PropTypes from 'prop-types'

import Checkbox from 'isimip_data/core/assets/js/components/Checkbox'

import FilterInput from './FilterInput'
import FilterOrder from './FilterOrder'


const Filter = ({ values, setValues }) => (
  <div className="card mb-1">
    <div className="card-body">
      <FilterInput values={values} setValues={setValues} />

      <div className="d-lg-flex gap-2">
        <Checkbox checked={values.all || false}
                  onChange={() => setValues({ ...values, all: !values.all })}>
          Show previous DOI versions as well
        </Checkbox>
        <div className="d-none d-md-block me-2"></div>
        <FilterOrder values={values} setValues={setValues} />
        <div className="ms-auto text-muted">
          The list of DOI will update as you type.
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
