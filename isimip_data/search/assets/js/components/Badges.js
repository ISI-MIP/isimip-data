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
    const { dataset } = this.props
    const resource = dataset.resources[0]

    return (
      <div>
        <p className="card-text badges float-right">
          {resource &&
            <OverlayTrigger placement="bottom" overlay={<Tooltip><strong>Digital object identifier (DOI)</strong></Tooltip>}>
              <span className="badge badge-light">
                {resource.doi}
              </span>
            </OverlayTrigger>
          }
          {dataset.rights &&
            <OverlayTrigger placement="bottom" overlay={<Tooltip><strong>{dataset.rights.rights}</strong></Tooltip>}>
              <span className="badge badge-light">
                {dataset.rights.short}
              </span>
            </OverlayTrigger>
          }
          <OverlayTrigger placement="bottom" overlay={<Tooltip><strong>Version</strong></Tooltip>}>
            <span className="badge badge-dark">
              {dataset.version}
            </span>
          </OverlayTrigger>
        </p>
        <p className="card-text badges">
          <OverlayTrigger placement="bottom" overlay={this.renderTooltip('simulation_round', dataset.specifiers.simulation_round)}>
            <span className="badge" style={{ backgroundColor: '#FABA53' }}>
              {dataset.specifiers.simulation_round}
            </span>
          </OverlayTrigger>
          <OverlayTrigger placement="bottom" overlay={this.renderTooltip('product', dataset.specifiers.product)}>
            <span className="badge badge-secondary">
              {dataset.specifiers.product}
            </span>
          </OverlayTrigger>
          <OverlayTrigger placement="bottom" overlay={this.renderTooltip('sector', dataset.specifiers.sector)}>
            <span className="badge badge-success">
              {dataset.specifiers.sector}
            </span>
          </OverlayTrigger>
          <OverlayTrigger placement="bottom" overlay={this.renderTooltip('climate_forcing', dataset.specifiers.climate_forcing)}>
            <span className="badge badge-info">
              {dataset.specifiers.climate_forcing}
            </span>
          </OverlayTrigger>
          <OverlayTrigger placement="bottom" overlay={<Tooltip><strong>Model</strong></Tooltip>}>
            <span className="badge badge-primary">
              {dataset.specifiers.model}
            </span>
          </OverlayTrigger>
        </p>
      </div>
    )
  }
}

Badges.propTypes = {
  glossary: PropTypes.object.isRequired,
  dataset: PropTypes.object.isRequired
}

export default Badges
