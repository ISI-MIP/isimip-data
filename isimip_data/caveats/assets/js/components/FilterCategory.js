import React from 'react'
import PropTypes from 'prop-types'
import { omit } from 'lodash'

import { useCategoryQuery } from '../hooks/queries'

import Icon from 'isimip_data/core/assets/js/components/Icon'

import Badge from './Badge'

const FilterCategory = ({ values, setValues }) => {

  const { data: categories } = useCategoryQuery()

  const handleClick = (value) => {
    setValues(values.category == value ? omit(values, ['category']) : { ...values, category: value})
  }

  const handleClear = () => {
    setValues(omit(values, ['category']))
  }

  const renderLabel = () => {
    const category = categories.find(c => c.value == values.category)
    return <span>Category {category && <Badge label={category.display} color={category.color} />}</span>
  }

  return categories && (
    <div className="dropdown">
      <button type="button" className="d-block unstyled text-muted dropdown-toggle"
              data-bs-toggle="dropdown" aria-expanded="false">
        {renderLabel()}
      </button>
      <div className="dropdown-menu">
        {
          categories.map((category, categoryIndex) => (
            <button key={categoryIndex} type="button" className="d-flex align-items-center dropdown-item"
                    onClick={() => handleClick(category.value)}>
              {<Badge label={category.display} color={category.color} />}
              {values.category && (values.category == category.value) && <Icon icon="check" size="sm" />}
            </button>
          ))
        }
        {
          values.category && <small>
            <hr className="dropdown-divider" />
            <button type="button" className="dropdown-item text-muted" onClick={() => handleClear()}>
              Clear filter
            </button>
          </small>
        }
      </div>
    </div>
  )
}

FilterCategory.propTypes = {
  values: PropTypes.object.isRequired,
  setValues: PropTypes.func.isRequired
}

export default FilterCategory
