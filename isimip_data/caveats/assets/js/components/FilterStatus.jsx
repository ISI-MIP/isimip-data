import React from 'react'
import PropTypes from 'prop-types'
import { omit } from 'lodash'

import { useStatusQuery } from '../hooks/queries'

import Icon from 'isimip_data/core/assets/js/components/Icon'

import Badge from './Badge'

const FilterStatus = ({ values, setValues }) => {

  const { data: status } = useStatusQuery()

  const handleClick = (value) => {
    setValues(values.status == value ? omit(values, ['status']) : { ...values, status: value})
  }

  const handleClear = () => {
    setValues(omit(values, ['status']))
  }

  const renderLabel = () => {
    const status_item = status.find(c => c.value == values.status)
    return <span>Status {status_item && <Badge label={status_item.display} color={status_item.color} />}</span>
  }

  return status && (
    <div className="dropdown">
      <button type="button" className="d-block unstyled text-muted dropdown-toggle"
              data-bs-toggle="dropdown" aria-expanded="false">
        {renderLabel()}
      </button>
      <div className="dropdown-menu">
        {
          status.map((status, statusIndex) => (
            <button key={statusIndex} type="button" className="d-flex align-items-center dropdown-item"
                    onClick={() => handleClick(status.value)}>
              {<Badge label={status.display} color={status.color} />}
              {values.status && (values.status == status.value) && <Icon icon="check" size="sm" />}
            </button>
          ))
        }
        {
          values.status && <small>
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

FilterStatus.propTypes = {
  values: PropTypes.object.isRequired,
  setValues: PropTypes.func.isRequired
}

export default FilterStatus
