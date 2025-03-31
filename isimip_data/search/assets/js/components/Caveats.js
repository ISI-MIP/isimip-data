import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import Icon from 'isimip_data/core/assets/js/components/Icon'


const Caveats = ({ dataset, toggleCaveats }) => {

  const getSeverity = (caveats) => {
    return caveats.reduce((acc, cur) => {
      if (cur.severity_level > acc.level) {
        return {level: cur.severity_level, color: cur.severity_color, symbol: cur.category_symbol}
      } else {
        return acc
      }
    }, {level: -1, color: 'muted', symbol: 'info'})
  }

  if (!isEmpty(dataset.caveats)) {
    const { color, symbol } = getSeverity(dataset.caveats)

    return (
      <div className="float-right">
        <button type="button" className={`link text-${color}`}>
          <Icon icon={symbol} title="There are issues or notes for this dataset."
                size="xl" onClick={toggleCaveats} />
        </button>
      </div>
    )
  } else if (!isEmpty(dataset.caveats_versions)) {
    const { symbol } = getSeverity(dataset.caveats_versions)

    return (
      <div className="float-right">
        <button type="button" className="link text-muted">
          <Icon icon={symbol} title="There are issues or notes for other versions of this dataset."
                size="xl" onClick={toggleCaveats} />
        </button>
      </div>
    )
  } else {
    return null
  }
}

Caveats.propTypes = {
  dataset: PropTypes.object.isRequired,
  toggleCaveats: PropTypes.func.isRequired
}

export default Caveats
