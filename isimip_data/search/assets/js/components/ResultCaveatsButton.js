import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import Icon from 'isimip_data/core/assets/js/components/Icon'
import Tooltip from 'isimip_data/core/assets/js/components/Tooltip'

const ResultCaveatsButton = ({ dataset, onClick }) => {

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
      <Tooltip title="There are issues or notes for this dataset. Click for more information.">
        <button type="button" className={`d-block link text-${color}`} onClick={onClick}>
          <Icon icon={symbol} size="lg" />
        </button>
      </Tooltip>
    )
  } else if (!isEmpty(dataset.caveats_versions)) {
    const { symbol } = getSeverity(dataset.caveats_versions)

    return (
      <Tooltip title="There are issues or notes for other versions of this dataset. Click for more information.">
        <button type="button" className="d-block link text-muted" onClick={onClick}>
          <Icon icon={symbol} size="lg" />
        </button>
      </Tooltip>
    )
  } else {
    return null
  }
}

ResultCaveatsButton.propTypes = {
  dataset: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
}

export default ResultCaveatsButton
