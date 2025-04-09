import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import Tooltip from 'isimip_data/core/assets/js/components/Tooltip'

const Resources = ({ dataset }) => {
  const resources = (dataset.resources || []).filter((resource) => (
    resource.new_version === null || !dataset.resources.map((r) => r.doi).includes(resource.new_version)
  ))

  const getTooltip = (resource) => (
    <>
      <p className="mb-1">The dataset can be cited using a DOI:</p>
      <p className="font-italic mb-1">{resource.citation}.</p>
      <p>Click for more information.</p>
    </>
  )

  if (isEmpty(resources)) {
    return null
  } else if (resources.length == 1) {
    const resource = resources[0]
    return (
      <Tooltip title={getTooltip(resource)}>
        <a href={resource.doi_url} className="d-inline-block doi"></a>
      </Tooltip>
    )
  } else {
    return (
      <div className="dropdown dropdown-resources">
        <button type="button" className="d-block link" data-bs-toggle="dropdown" aria-expanded="false">
          <Tooltip title="There are multiple DOI registered for this dataset. Click for more information."
                   placement="top" className="tooltip-resources">
            <div className="d-inline-block doi"></div>
          </Tooltip>
        </button>
        <div className="dropdown-menu">
          <h6 className="dropdown-header">
            There are multiple DOI registered for this dataset, please use the citation that applies to your case.
          </h6>
          {
            resources.map((resource, resourceIndex) => (
              <a key={resourceIndex} className="dropdown-item" href={resource.doi_url}>
                <em>{resource.creators_str} ({resource.publication_year}):</em>{' '}
                <strong>{resource.title_with_version}</strong>{'. '}
                {resource.publisher}{'. '}
                <a className="doi-link" href={resource.doi_url}>{resource.doi_url}</a>
              </a>
            ))
          }
        </div>
      </div>
    )
  }
}

Resources.propTypes = {
  dataset: PropTypes.object.isRequired,
}

export default Resources
