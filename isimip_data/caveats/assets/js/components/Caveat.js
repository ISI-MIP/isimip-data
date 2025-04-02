import React from 'react'
import PropTypes from 'prop-types'

import Badge from './Badge'
import Versions from './Versions'

const Caveat = ({ caveat }) => {
  return (
    <div className="card caveat mb-1">
      <div className="card-body">
        <div className="d-flex gap-2 align-items-center mb-2">
          <h4 className="me-auto">
            <a href={caveat.url}>{caveat.title}</a>
            {' '}
            <span className="text-muted">#{caveat.id}</span>
          </h4>

          <Badge label={caveat.category_display} color={caveat.category_color} />
          <Badge label={caveat.severity_display} color={caveat.severity_color} />
          <Badge label={caveat.status_display} color={caveat.status_color} />
        </div>

        <p className="mb-2">
          <span className={`text-${caveat.severity_color}`}>
            {caveat.message_display}
          </span>
        </p>

        <div className="d-flex">
          <p className="me-auto mb-0">
            {caveat.creator_display} created this {caveat.category_display} on {caveat.created_display}.
            {caveat.created != caveat.updated && <> It was last updated on {caveat.updated_display}.</>}
          </p>
          <p className="mb-0">
            Affected versions: <Versions caveat={caveat} />
          </p>
        </div>
      </div>
    </div>
  )
}

Caveat.propTypes = {
  caveat: PropTypes.object.isRequired
}

export default Caveat
