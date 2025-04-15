import React from 'react'
import PropTypes from 'prop-types'
import { get, isNil } from 'lodash'

import Tooltip from 'isimip_data/core/assets/js/components/Tooltip'

const ResultBadges = ({ glossary, dataset }) => {

  const specifiers = dataset.merged_specifiers

  const getTooltip = (identifier, specifier) => {
    const properties = get(glossary, [identifier, specifier])
    const identifier_title = (identifier[0].toUpperCase() + identifier.slice(1)).replace('_', ' ')

    return (
      <>
        <strong>{identifier_title}</strong><br />
        {properties && properties.title && <span>{properties.title}</span>}
        {properties && properties.long_name && <span>{properties.long_name}</span>}
        {properties && properties.description && <div><i>{properties.description}</i></div>}
        {properties && properties.warning && <div>Warning: {properties.warning}</div>}
      </>
    )
  }

  const renderTitle = (identifier, specifier) => {
    const properties = get(glossary, [identifier, specifier])
    return isNil(properties) ? specifier : properties.title
  }

  return (
    <React.Fragment>
      {
        specifiers.simulation_round && specifiers.simulation_round.map((simulation_round, index) =>
          <Tooltip key={index} title={getTooltip('simulation_round', simulation_round)}>
            <span className="badge rounded-pill border border-orange text-orange">
              {simulation_round}
            </span>
          </Tooltip>
        )
      }
      {
        specifiers.product && specifiers.product.map((product, index) =>
          <Tooltip key={index} title={getTooltip('product', product)}>
            <span className="badge rounded-pill border border-secondary text-secondary">
              {product}
            </span>
          </Tooltip>
        )
      }
      {
        specifiers.category && specifiers.category.map((category, index) =>
          <Tooltip key={index} title={getTooltip('category', category)}>
            <span className="badge rounded-pill border border-success text-success">
              {category}
            </span>
          </Tooltip>
        )
      }
      {
        specifiers.sector && specifiers.sector.map((sector, index) =>
          <Tooltip key={index} title={getTooltip('sector', sector)}>
            <span className="badge rounded-pill border border-success text-success">
              {sector}
            </span>
          </Tooltip>
        )
      }
      {
        specifiers.publication && specifiers.publication.map((publication, index) =>
          <Tooltip key={index} title={getTooltip('publication', publication)}>
            <span className="badge rounded-pill border border-success text-success">
              {publication}
            </span>
          </Tooltip>
        )
      }
      {
        specifiers.climate_forcing && specifiers.climate_forcing.map((climate_forcing, index) =>
          <Tooltip key={index} title={getTooltip('climate_forcing', climate_forcing)}>
            <span className="badge rounded-pill border border-info text-info">
              {renderTitle('climate_forcing', climate_forcing)}
            </span>
          </Tooltip>
        )
      }
      {
        specifiers.period && specifiers.period.map((period, index) =>
          <Tooltip key={index} title={getTooltip('period', period)}>
            <span className="badge rounded-pill border border-dark text-dark">
              {period}
            </span>
          </Tooltip>
        )
      }
      {
        specifiers.model && specifiers.model.map((model, index) =>
          <Tooltip key={index} title={getTooltip('model', model)}>
            <span className="badge rounded-pill border border-primary text-primary">
              {renderTitle('model', model)}
            </span>
          </Tooltip>
        )
      }
      {
        specifiers.variable && specifiers.variable.map((variable, index) =>
          <Tooltip key={index} title={getTooltip('variable', variable)}>
            <span className="badge rounded-pill border border-dark text-dark">{variable}</span>
          </Tooltip>
        )
      }

      <div className="d-none d-md-block me-auto invisible"></div>

      {
        dataset.terms_of_use && (
          <Tooltip placement="bottom" title={dataset.terms_of_use.terms_of_use}>
            <a className="badge text-bg-secondary" href={dataset.terms_of_use.terms_of_use_url}
               target="_blank" rel="noreferrer">
              ToU
            </a>
          </Tooltip>
        )
      }
      {
        dataset.rights && (
          <Tooltip placement="bottom" title={<>This dataset is published under the <i>{dataset.rights.rights}</i>.</>}>
            <span className={`badge text-bg-${dataset.rights.color || 'light'}`}>
              {dataset.rights.short}
            </span>
          </Tooltip>
        )
      }
      {
        !dataset.public && (
          <Tooltip placement="bottom" title="This dataset is archived and currently not available for download. Please contact support if you need this version of the dataset.">
            <span className="badge text-bg-danger">Archived</span>
          </Tooltip>
        )
      }
      {
        dataset.public && dataset.restricted && (
          <Tooltip placement="bottom" title="Access to this dataset is restricted. Please contact support if you need this version of the dataset.">
            <span className="badge text-bg-danger">Restricted</span>
          </Tooltip>
        )
      }

      <Tooltip placement="bottom" title="The version for this dataset (YYYYMMDD).">
        <span className="badge text-bg-dark">{dataset.version}</span>
      </Tooltip>
    </React.Fragment>
  )
}

ResultBadges.propTypes = {
  glossary: PropTypes.object.isRequired,
  dataset: PropTypes.object.isRequired
}

export default ResultBadges
