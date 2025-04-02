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
      <div className="dropdown">
        <button type="button" className="d-block link" data-bs-toggle="dropdown" aria-expanded="false">
          <div className="d-inline-block doi"></div>
        </button>
        <div className="dropdown-menu">
          <h6 className="dropdown-header">
            There are multiple DOI registered for this dataset, please use the citation that applies to your case.
          </h6>
          {
            resources.map((resource, resourceIndex) => (
              <Tooltip key={resourceIndex} title={getTooltip(resource)}>
                <a className="dropdown-item"  href={resource.doi_url}>
                  <strong>{resource.title}</strong>
                  <span className="doi-link ms-2">{resource.doi_url}</span>
                </a>
              </Tooltip>
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
