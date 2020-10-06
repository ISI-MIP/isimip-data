import React, { Component } from 'react'
import PropTypes from 'prop-types'
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Tooltip from "react-bootstrap/Tooltip"

import { getValueOrNull } from 'isimip_data/core/assets/js/utils/object'


class Badges extends Component {

  renderTooltip(identifier, specifier) {
    const { glossary } = this.props
    const properties = getValueOrNull(glossary, identifier, specifier)

    return (
      <Tooltip>
        {properties && properties.title && <strong>{properties.title}</strong>}
        {properties && properties.description && <div>{properties.description}</div>}
      </Tooltip>
    )
  }

  render() {
    const { glossary, version, specifiers, rights } = this.props

    return (
      <div>
        <p className="card-text badges float-right">
          {rights &&
            <OverlayTrigger placement="bottom" overlay={<Tooltip><strong>{rights.rights}</strong></Tooltip>}>
              <span className="badge badge-light">
                {rights.short}
              </span>
            </OverlayTrigger>
          }
          <OverlayTrigger placement="bottom" overlay={<Tooltip><strong>Version</strong></Tooltip>}>
            <span className="badge badge-dark">
              {version}
            </span>
          </OverlayTrigger>
        </p>
        <p className="card-text badges">
          <OverlayTrigger placement="bottom" overlay={this.renderTooltip('simulation_round', specifiers.simulation_round)}>
            <span className="badge" style={{ backgroundColor: '#FABA53' }}>
              {specifiers.simulation_round}
            </span>
          </OverlayTrigger>
          <OverlayTrigger placement="bottom" overlay={this.renderTooltip('product', specifiers.product)}>
            <span className="badge badge-secondary">
              {specifiers.product}
            </span>
          </OverlayTrigger>
          <OverlayTrigger placement="bottom" overlay={this.renderTooltip('sector', specifiers.sector)}>
            <span className="badge badge-success">
              {specifiers.sector}
            </span>
          </OverlayTrigger>
          <OverlayTrigger placement="bottom" overlay={this.renderTooltip('climate_forcing', specifiers.climate_forcing)}>
            <span className="badge badge-info">
              {specifiers.climate_forcing}
            </span>
          </OverlayTrigger>
          <OverlayTrigger placement="bottom" overlay={<Tooltip><strong>Model</strong></Tooltip>}>
            <span className="badge badge-primary">
              {specifiers.model}
            </span>
          </OverlayTrigger>
        </p>
      </div>
    )
  }
}

Badges.propTypes = {
  glossary: PropTypes.object.isRequired,
  specifiers: PropTypes.object.isRequired,
  version: PropTypes.string.isRequired,
  rights: PropTypes.object
}

export default Badges
