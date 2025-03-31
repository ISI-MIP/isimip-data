import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { get, isNil } from 'lodash'

import Tooltip from 'isimip_data/core/assets/js/components/Tooltip'


const Badges = ({ glossary, dataset }) => {

  const specifiers = dataset.merged_specifiers
  const hasResources = (dataset.resources.length > 0)

  const getTooltip = (identifier, specifier) => {
    const properties = get(glossary, [identifier, specifier])
    const identifier_title = (identifier[0].toUpperCase() + identifier.slice(1)).replace('_', ' ')

    return (
      <>
        <strong>{identifier_title}:</strong>&nbsp;
        {properties && properties.title && <span>{properties.title}</span>}
        {properties && properties.long_name && <span>{properties.long_name}</span>}
        {properties && properties.description && <div>{properties.description}</div>}
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
      <div className={classNames('d-lg-flex flex-wrap gap-1', {'mb-2': !hasResources})}>
        {
          specifiers.simulation_round && specifiers.simulation_round.map((simulation_round, index) =>
            <Tooltip key={index} title={getTooltip('simulation_round', simulation_round)}>
              <span className="badge text-bg-orange mb-1">{simulation_round}</span>
            </Tooltip>
          )
        }
        {
          specifiers.product && specifiers.product.map((product, index) =>
            <Tooltip key={index} title={getTooltip('product', product)}>
              <span className="badge text-bg-secondary mb-1">{product}</span>
            </Tooltip>
          )
        }
        {
          specifiers.category && specifiers.category.map((category, index) =>
            <Tooltip key={index} title={getTooltip('category', category)}>
              <span className="badge text-bg-success mb-1">{category}</span>
            </Tooltip>
          )
        }
        {
          specifiers.sector && specifiers.sector.map((sector, index) =>
            <Tooltip key={index} title={getTooltip('sector', sector)}>
              <span className="badge text-bg-success mb-1">{sector}</span>
            </Tooltip>
          )
        }
        {
          specifiers.publication && specifiers.publication.map((publication, index) =>
            <Tooltip key={index} title={getTooltip('publication', publication)}>
              <span className="badge text-bg-success mb-1">{publication}</span>
            </Tooltip>
          )
        }
        {
          specifiers.climate_forcing && specifiers.climate_forcing.map((climate_forcing, index) =>
            <Tooltip key={index} title={getTooltip('climate_forcing', climate_forcing)}>
              <span className="badge text-bg-info mb-1">{renderTitle('climate_forcing', climate_forcing)}</span>
            </Tooltip>
          )
        }
        {
          specifiers.period && specifiers.period.map((period, index) =>
            <Tooltip key={index} title={getTooltip('period', period)}>
              <span className="badge text-bg-light mb-1">{period}</span>
            </Tooltip>
          )
        }
        {
          specifiers.model && specifiers.model.map((model, index) =>
            <Tooltip key={index} title={getTooltip('model', model)}>
              <span className="badge text-bg-primary mb-1">{renderTitle('model', model)}</span>
            </Tooltip>
          )
        }
        {
          specifiers.variable && specifiers.variable.map((variable, index) =>
            <Tooltip key={index} title={getTooltip('variable', variable)}>
              <span className="badge text-bg-dark mb-1">{variable}</span>
            </Tooltip>
          )
        }

        <span className="ms-auto invisible"></span>

        {
          dataset.terms_of_use && (
            <Tooltip placement="bottom" title={dataset.terms_of_use.terms_of_use}>
              <a className="badge text-bg-secondary mb-1" href={dataset.terms_of_use.terms_of_use_url}
                 target="_blank" rel="noreferrer">
                Terms of use
              </a>
            </Tooltip>
          )
        }
        {
          dataset.rights && (
            <Tooltip placement="bottom" title={<>This dataset is published under the <i>{dataset.rights.rights}</i>.</>}>
              <span className={`badge text-bg-${dataset.rights.color || 'light'} mb-1`}>
                {dataset.rights.short}
              </span>
            </Tooltip>
          )
        }
        {
          !dataset.public && (
            <Tooltip placement="bottom" title="This dataset is archived and currently not available for download. Please contact support if you need this version of the dataset.">
              <span className="badge text-bg-danger mb-1">Archived</span>
            </Tooltip>
          )
        }
        {
          dataset.public && dataset.restricted && (
            <Tooltip placement="bottom" title="Access to this dataset is restricted. Please contact support if you need this version of the dataset.">
              <span className="badge text-bg-danger mb-1">Restricted</span>
            </Tooltip>
          )
        }

        <Tooltip placement="bottom" title="The version for this dataset (YYYYMMDD).">
          <span className="badge text-bg-dark mb-1">{dataset.version}</span>
        </Tooltip>
      </div>
      {
        dataset.resources.length > 0 &&
        <div className="badges mb-2">
          {
            dataset.resources.map((resource, index) => {
              const is_current_version = (
                resource.new_version === null || !dataset.resources.map((r) => r.doi).includes(resource.new_version)
              )

              return is_current_version && (
                <Tooltip key={index} title={<>
                  <p className="mb-1">The dataset can be cited using a Digital Object Identifier (DOI):</p>
                  <p className="font-italic">{resource.citation}.</p>
                </>}>
                  <a className="badge text-bg-light" href={resource.doi_url}
                     target="_blank" rel="noreferrer">
                    {resource.doi_url}
                  </a>
                </Tooltip>
              )
            })
          }
        </div>
      }
    </React.Fragment>
  )
}

Badges.propTypes = {
  glossary: PropTypes.object.isRequired,
  dataset: PropTypes.object.isRequired
}

export default Badges
