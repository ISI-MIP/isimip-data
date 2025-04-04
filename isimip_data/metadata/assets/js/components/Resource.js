import React from 'react'
import PropTypes from 'prop-types'


const Resource = ({ resource, all }) => (
  <div className="card mb-2">
    <div className="card-body">
      <div className="row">
        <div className="col-sm-8">
          <div>
            <a href={resource.resource_url} target="_blank" rel="noreferrer">
              {resource.title_with_version}
            </a>
            {
              all && (
                resource.new_version ? (
                  <div className="badge rounded-pill border border-secondary text-secondary ms-2">previous</div>
                ) : (
                  <div className="badge rounded-pill border border-orange text-orange ms-2">current</div>
                )
              )
            }
          </div>
          {
            resource.paths.map((path, pathIndex) => (
              <div key={pathIndex}>
                <code>{path}</code>
              </div>
            ))
          }
        </div>
        <div className="col-sm-4">
          <a className="d-block doi-link" href={resource.doi_url} target="_blank" rel="noreferrer">
            {resource.doi_url}
          </a>
        </div>
      </div>
    </div>
  </div>
)

Resource.propTypes = {
  resource: PropTypes.object.isRequired,
  all: PropTypes.bool
}

export default Resource
