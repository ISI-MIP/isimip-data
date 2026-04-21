import React from 'react'
import PropTypes from 'prop-types'
import { omit } from 'lodash'

import { useSeverityQuery } from '../hooks/queries'

import Icon from 'isimip_data/core/assets/js/components/Icon'

import Badge from './Badge'

const FilterSeverity = ({ values, setValues }) => {

  const { data: severities } = useSeverityQuery()

  const handleClick = (value) => {
    setValues(values.severity == value ? omit(values, ['severity']) : { ...values, severity: value})
  }

  const handleClear = () => {
    setValues(omit(values, ['severity']))
  }

  const renderLabel = () => {
    const severity = severities.find(c => c.value == values.severity)
    return <span>Severity {severity && <Badge label={severity.display} color={severity.color} />}</span>
  }

  return severities && (
    <div className="dropdown">
      <button type="button" className="d-block unstyled text-muted dropdown-toggle"
              data-bs-toggle="dropdown" aria-expanded="false">
        {renderLabel()}
      </button>
      <div className="dropdown-menu">
        {
          severities.map((severity, severityIndex) => (
            <button key={severityIndex} type="button" className="d-flex align-items-center dropdown-item"
                    onClick={() => handleClick(severity.value)}>
              {<Badge label={severity.display} color={severity.color} />}
              {values.severity && (values.severity == severity.value) && <Icon icon="check" size="sm" />}
            </button>
          ))
        }
        {
          values.severity && <small>
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

FilterSeverity.propTypes = {
  values: PropTypes.object.isRequired,
  setValues: PropTypes.func.isRequired
}

export default FilterSeverity
