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
    const specifiers = dataset.merged_specifiers

    return (
      <div className="d-lg-flex badges mb-2">
        {
          specifiers.simulation_round && specifiers.simulation_round.map((simulation_round, index) =>
            <OverlayTrigger key={index} placement="bottom" overlay={this.renderTooltip('simulation_round', simulation_round)}>
              <span className="badge badge-isimip">{simulation_round}</span>
            </OverlayTrigger>
          )
        }
        {
          specifiers.product && specifiers.product.map((product, index) =>
            <OverlayTrigger key={index} placement="bottom" overlay={this.renderTooltip('product', product)}>
              <span className="badge badge-secondary">{product}</span>
            </OverlayTrigger>
          )
        }
        {
          specifiers.category && specifiers.category.map((category, index) =>
            <OverlayTrigger key={index} placement="bottom" overlay={this.renderTooltip('category', category)}>
              <span className="badge badge-success">{category}</span>
            </OverlayTrigger>
          )
        }
        {
          specifiers.sector && specifiers.sector.map((sector, index) =>
            <OverlayTrigger key={index} placement="bottom" overlay={this.renderTooltip('sector', sector)}>
              <span className="badge badge-success">{sector}</span>
            </OverlayTrigger>
          )
        }
        {
          specifiers.publication && specifiers.publication.map((publication, index) =>
            <OverlayTrigger key={index} placement="bottom" overlay={this.renderTooltip('publication', publication)}>
              <span className="badge badge-success">{publication}</span>
            </OverlayTrigger>
          )
        }
        {
          specifiers.climate_forcing && specifiers.climate_forcing.map((climate_forcing, index) =>
            <OverlayTrigger key={index} placement="bottom" overlay={this.renderTooltip('climate_forcing', climate_forcing)}>
              <span className="badge badge-info">{climate_forcing}</span>
            </OverlayTrigger>
          )
        }
        {
          specifiers.period && specifiers.period.map((period, index) =>
            <OverlayTrigger key={index} placement="bottom" overlay={this.renderTooltip('period', period)}>
              <span className="badge badge-light">{period}</span>
            </OverlayTrigger>
          )
        }
        {
          specifiers.model && specifiers.model.map((model, index) =>
            <OverlayTrigger key={index} placement="bottom" overlay={<Tooltip><strong>Model</strong></Tooltip>}>
              <span className="badge badge-primary">{model}</span>
            </OverlayTrigger>
          )
        }

        <span className="ml-auto invisible"></span>

        {resource &&
          <OverlayTrigger placement="bottom" overlay={<Tooltip>This dataset can be cited using the Digital Object Identifier: <i>{resource.doi_url}</i>.</Tooltip>}>
            <a className="badge badge-light" href={resource.doi_url} target="_blank">
              {resource.doi}
            </a>
          </OverlayTrigger>
        }

        {dataset.terms_of_use &&
          <OverlayTrigger placement="bottom" overlay={<Tooltip>{ dataset.terms_of_use.terms_of_use }</Tooltip>}>
            <a className="badge badge-light" href={dataset.terms_of_use.terms_of_use_url} target="_blank">
              ToU
            </a>
          </OverlayTrigger>
        }

        {dataset.rights &&
          <OverlayTrigger placement="bottom" overlay={<Tooltip>This dataset is published under the <i>{dataset.rights.rights}</i>.</Tooltip>}>
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
