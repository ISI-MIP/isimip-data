import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const ResultResourcesTab = ({ dataset }) => {
  const resources = (dataset.resources || []).filter((resource) => (
    resource.new_version === null || !dataset.resources.map((r) => r.doi).includes(resource.new_version)
  ))

  return (
    <div>
      {
        dataset.resources.length > 1 && (
          <p className="text-muted mb-2">
            There are multiple DOI registered for this dataset, please use the citation that applies to your case.
          </p>
        )
      }
      {
        resources.map((resource, resourceIndex) => (
          <div key={resourceIndex} className={classNames({'mt-2': resourceIndex > 0})}>
            {
              resource.creators_str && <>
                <em>{resource.creators_str} ({resource.publication_year}):</em>{' '}
              </>
            }
            <strong>{resource.title_with_version}</strong>{'. '}
            {
              resource.creators_str && <>
                {resource.publisher}{'. '}
              </>
            }
            <a className="doi-link" href={resource.doi_url} target="_blank" rel="noreferrer">
              {resource.doi_url}
            </a>
          </div>
        ))
      }
    </div>
  )
}

ResultResourcesTab.propTypes = {
  dataset: PropTypes.object.isRequired
}

export default ResultResourcesTab
