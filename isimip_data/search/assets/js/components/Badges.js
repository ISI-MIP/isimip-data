import React from 'react'
import PropTypes from 'prop-types'
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Tooltip from "react-bootstrap/Tooltip"
import { get, isNil } from 'lodash'


const Badges = ({ glossary, dataset }) => {

  const specifiers = dataset.merged_specifiers
  const hasResources = (dataset.resources.length > 0)

  const renderTooltip = (identifier, specifier) => {
    const properties = get(glossary, [identifier, specifier])
    const identifier_title = (identifier[0].toUpperCase() + identifier.slice(1)).replace('_', ' ')

    return (
      <Tooltip>
        <strong>{identifier_title}:</strong>&nbsp;
        {properties && properties.title && <span>{properties.title}</span>}
        {properties && properties.long_name && <span>{properties.long_name}</span>}
        {properties && properties.description && <div>{properties.description}</div>}
        {properties && properties.warning && <div>Warning: {properties.warning}</div>}
      </Tooltip>
    )
  }

  const renderTitle = (identifier, specifier) => {
    const properties = get(glossary, [identifier, specifier])
    return isNil(properties) ? specifier : properties.title
  }

  return (
    <React.Fragment>
      <div className={'d-lg-flex flex-wrap badges ' + (hasResources ? 'mb-0' : 'mb-2')}>
        {
          specifiers.simulation_round && specifiers.simulation_round.map((simulation_round, index) =>
            <OverlayTrigger key={index} placement="bottom" overlay={renderTooltip('simulation_round', simulation_round)}>
              <span className="badge badge-isimip mb-1">{simulation_round}</span>
            </OverlayTrigger>
          )
        }
        {
          specifiers.product && specifiers.product.map((product, index) =>
            <OverlayTrigger key={index} placement="bottom" overlay={renderTooltip('product', product)}>
              <span className="badge badge-secondary mb-1">{product}</span>
            </OverlayTrigger>
          )
        }
        {
          specifiers.category && specifiers.category.map((category, index) =>
            <OverlayTrigger key={index} placement="bottom" overlay={renderTooltip('category', category)}>
              <span className="badge badge-success mb-1">{category}</span>
            </OverlayTrigger>
          )
        }
        {
          specifiers.sector && specifiers.sector.map((sector, index) =>
            <OverlayTrigger key={index} placement="bottom" overlay={renderTooltip('sector', sector)}>
              <span className="badge badge-success mb-1">{sector}</span>
            </OverlayTrigger>
          )
        }
        {
          specifiers.publication && specifiers.publication.map((publication, index) =>
            <OverlayTrigger key={index} placement="bottom" overlay={renderTooltip('publication', publication)}>
              <span className="badge badge-success mb-1">{publication}</span>
            </OverlayTrigger>
          )
        }
        {
          specifiers.climate_forcing && specifiers.climate_forcing.map((climate_forcing, index) =>
            <OverlayTrigger key={index} placement="bottom" overlay={renderTooltip('climate_forcing', climate_forcing)}>
              <span className="badge badge-info mb-1">{renderTitle('climate_forcing', climate_forcing)}</span>
            </OverlayTrigger>
          )
        }
        {
          specifiers.period && specifiers.period.map((period, index) =>
            <OverlayTrigger key={index} placement="bottom" overlay={renderTooltip('period', period)}>
              <span className="badge badge-light mb-1">{period}</span>
            </OverlayTrigger>
          )
        }
        {
          specifiers.model && specifiers.model.map((model, index) =>
            <OverlayTrigger key={index} placement="bottom" overlay={renderTooltip('model', model)}>
              <span className="badge badge-primary mb-1">{renderTitle('model', model)}</span>
            </OverlayTrigger>
          )
        }
        {
          specifiers.variable && specifiers.variable.map((variable, index) =>
            <OverlayTrigger key={index} placement="bottom" overlay={renderTooltip('variable', variable)}>
              <span className="badge badge-dark mb-1">{variable}</span>
            </OverlayTrigger>
          )
        }

        <span className="ml-auto invisible"></span>

        {dataset.terms_of_use &&
          <OverlayTrigger placement="bottom" overlay={<Tooltip>{ dataset.terms_of_use.terms_of_use }</Tooltip>}>
            <a className="badge badge-secondary mb-1" href={dataset.terms_of_use.terms_of_use_url}
               target="_blank" rel="noreferrer">
              Terms of use
            </a>
          </OverlayTrigger>
        }

        {dataset.rights &&
          <OverlayTrigger placement="bottom" overlay={<Tooltip>This dataset is published under the <i>{dataset.rights.rights}</i>.</Tooltip>}>
            <span className={`badge badge-${dataset.rights.color || 'light'} mb-1`}>
              {dataset.rights.short}
            </span>
          </OverlayTrigger>
        }

        {!dataset.public &&
          <OverlayTrigger placement="bottom" overlay={<Tooltip>This dataset is archived and currently not available for download. Please contact support if you need this version of the dataset.</Tooltip>}>
            <span className="badge badge-danger mb-1">
              Archived
            </span>
          </OverlayTrigger>
        }

        {dataset.public && dataset.restricted &&
          <OverlayTrigger placement="bottom" overlay={<Tooltip>Access to this dataset is restricted. Please contact support if you need this version of the dataset.</Tooltip>}>
            <span className="badge badge-danger mb-1">
              Restricted
            </span>
          </OverlayTrigger>
        }

        <OverlayTrigger placement="bottom" overlay={<Tooltip>The version for this dataset (YYYYMMDD).</Tooltip>}>
          <span className="badge badge-dark mb-1">
            {dataset.version}
          </span>
        </OverlayTrigger>
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
                <OverlayTrigger key={index} placement="bottom" overlay={<Tooltip>
                  <p className="mb-1">The dataset can be cited using a Digital Object Identifier (DOI):</p>
                  <p className="font-italic">{resource.citation}.</p>
                </Tooltip>}>
                  <a className="badge badge-light" href={resource.doi_url}
                     target="_blank" rel="noreferrer">
                    {resource.doi_url}
                  </a>
                </OverlayTrigger>
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
