import React, { Component }  from 'react'
import PropTypes from 'prop-types'


class Resource extends Component {

  render() {
    const { resource } = this.props

    return (
      <div className="card mb-2">
        <div className="card-body">
          <div className="row">
            <div className="col-sm-8">
              <a href={resource.resource_url} target="_blank" rel="noreferrer">
                {resource.title_with_version}
              </a>
              {
                resource.paths.map((path, pathIndex) => (
                  <div key={pathIndex}>
                    <code>{path}</code>
                  </div>
                ))
              }
            </div>
            <div className="col-sm-4">
              <a className="doi-link" href={resource.doi_url} target="_blank" rel="noreferrer">
                {resource.doi_url}
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

Resource.propTypes = {
  resource: PropTypes.object.isRequired
}

export default Resource
