import React, { Component} from 'react'
import PropTypes from 'prop-types'

import Resource from './Resource'

class Resources extends React.Component {

  constructor(props) {
    super(props)

    this.filterResources = this.filterResources.bind(this)
  }

  filterResources(resource) {
    const { filterString } = this.props
    const tokens = filterString.split(/(\s+)/).filter( e => e.trim().length > 0)

    return tokens.map(string => {
      if (resource.doi.includes(string) || resource.title.includes(string)) {
        return true
      }
    }).every(element => element === true)
  }

  render() {
    const { resources } = this.props

    return (
      <div className="resources">
        {
          resources.filter(this.filterResources).map(resource => <Resource key={resource.id} resource={resource} />)
        }
      </div>
    )
  }

}

export default Resources
