import React from 'react'
import PropTypes from 'prop-types'
import { isNil } from 'lodash'

import Icon from 'isimip_data/core/assets/js/components/Icon'

const orderings = {
  paths: 'Order by paths',
  title: 'Order by title',
  newest: 'Order by newest',
  oldest: 'Order by oldest',
}


const FilterOrder = ({ values, setValues }) => {

  const handleClick = (order) => {
    setValues({ ...values, order})
  }

  return (
    <div className="dropdown">
      <button type="button" className="d-block unstyled text-muted dropdown-toggle"
              data-bs-toggle="dropdown" aria-expanded="false">
        {values.order ? orderings[values.order] : orderings.paths}
      </button>
      <div className="dropdown-menu">
        {
          Object.keys(orderings).map((order, index) => (
            <button key={index} type="button" className="d-flex align-items-center dropdown-item"
                    onClick={() => handleClick(order)}>
              {orderings[order]}
              {(values.order == order || (isNil(values.order) && order == 'last')) && <Icon icon="check" size="sm" />}
            </button>
          ))
        }
      </div>
    </div>
  )
}

FilterOrder.propTypes = {
  values: PropTypes.object.isRequired,
  setValues: PropTypes.func.isRequired
}

export default FilterOrder
