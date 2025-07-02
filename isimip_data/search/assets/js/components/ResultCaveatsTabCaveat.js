import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Icon from 'isimip_data/core/assets/js/components/Icon'
import Tooltip from 'isimip_data/core/assets/js/components/Tooltip'

const ResultCaveatsTabCaveat = ({ caveat, caveatIndex }) => (
  <li className={classNames({'mt-2': caveatIndex > 0})}>
    <div className="d-flex align-items-center gap-1">
      <div className="me-auto">
        <a href={caveat.url} target="_blank" rel="noreferrer">{caveat.title}</a>
        <span className="text-muted"> #{caveat.id}</span>
      </div>
      <div className={`badge rounded-pill text-bg-${caveat.severity_color}`}>
        {caveat.severity_display}
      </div>
      <div className={`badge rounded-pill text-bg-${caveat.status_color}`}>
        {caveat.status_display}
      </div>
      <Tooltip title={`Visit ${caveat.category_display} page.`}>
        <a href={caveat.url} target="_blank" rel="noreferrer">
          <Icon className="d-block" icon="exit_to_app" />
        </a>
      </Tooltip>
    </div>
    <div className={'text-' + caveat.message_color}>
      {caveat.message_display}
    </div>
  </li>
)

ResultCaveatsTabCaveat.propTypes = {
  caveat: PropTypes.object.isRequired,
  caveatIndex: PropTypes.number.isRequired
}

export default ResultCaveatsTabCaveat
