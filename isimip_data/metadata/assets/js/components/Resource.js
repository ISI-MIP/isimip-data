import React, { Component} from 'react'
import PropTypes from 'prop-types'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'

class Resource extends React.Component {

  render() {
    const { resource, toggleResource } = this.props

    return (
      <div className="card mb-2">
        <div className="card-body">
          <div className="row">
            <div className="col-sm-8">
              <a href={resource.resource_url} target="_blank">
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
              <a className="doi-link" href={resource.doi_url} target="_blank">
                {resource.doi_url}
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default Resource
