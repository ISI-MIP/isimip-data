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
      <div className="d-lg-flex badges mb-2">
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

        <span className="ml-auto invisible"></span>

        {resource &&
          <OverlayTrigger placement="bottom" overlay={<Tooltip>This dataset can be cited using the Digital Object Identifier: <i>{resource.doi_url}</i>.</Tooltip>}>
            <a className="badge badge-light" href={resource.doi_url} target="blank">
              {resource.doi}
            </a>
          </OverlayTrigger>
        }

        {dataset.terms_of_use &&
          <OverlayTrigger placement="bottom" overlay={<Tooltip>{ dataset.terms_of_use.terms_of_use }</Tooltip>}>
            <a className="badge badge-light" href={dataset.terms_of_use.terms_of_use_url} target="blank">
              ToU
            </a>
          </OverlayTrigger>
        }

        {dataset.rights &&
          <OverlayTrigger placement="bottom" overlay={<Tooltip>This dataset is published under the <i>{dataset.rights.rights}.</i></Tooltip>}>
            <span className="badge badge-light">
              {dataset.rights.short}
            </span>
          </OverlayTrigger>
        }

        {!dataset.public &&
          <OverlayTrigger placement="bottom" overlay={<Tooltip>This dataset is archived and currently not available for download. Please contact support if you need this version of the dataset.</Tooltip>}>
            <span className="badge badge-danger">
              Archived
            </span>
          </OverlayTrigger>
        }

        <OverlayTrigger placement="bottom" overlay={<Tooltip>The version for this dataset (YYYYMMDD).</Tooltip>}>
          <span className="badge badge-dark">
            {dataset.version}
          </span>
        </OverlayTrigger>
      </div>
    )
  }
}

Badges.propTypes = {
  glossary: PropTypes.object.isRequired,
  dataset: PropTypes.object.isRequired
}

export default Badges
