import React from 'react'
import PropTypes from 'prop-types'


const ResultCaveat = ({ caveat }) => (
  <li className="result-caveat" key={caveat.id}>
    <div className="float-right">
      <span className={'badge badge-pill badge-' + caveat.severity_color + ' mr-2'}>
        {caveat.severity_display}
      </span>
      <span className={'badge badge-pill badge-' + caveat.status_color}>
        {caveat.status_display}
      </span>
    </div>
    <p className="mb-0">
      <a href={caveat.url} target="_blank" rel="noreferrer">{caveat.title}</a>
      <span className="text-muted"> #{caveat.id}</span>
    </p>
    <p className={'mb-0 text-' + caveat.message_color}> {caveat.message_display}</p>
  </li>
)

ResultCaveat.propTypes = {
  caveat: PropTypes.object.isRequired,
}

export default ResultCaveat
