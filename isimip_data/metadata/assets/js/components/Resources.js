import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Resource from './Resource'


class Resources extends Component {

  constructor(props) {
    super(props)

    this.filterResources = this.filterResources.bind(this)
  }

  filterResources(resource) {
    const { filterString, showAll } = this.props

    // filter for the showAll flag
    if (resource.new_version && !showAll) {
      return false
    }

    // filter for the filter string
    const tokens = filterString.toLowerCase().split(/(\s+)/).filter( e => e.trim().length > 0)
    const string = [
      resource.doi,
      resource.title,
      resource.creators_str
    ].concat(resource.paths).join(' ').toLowerCase()
    return tokens.map(token => {
      return string.includes(token)
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

Resources.propTypes = {
  resources: PropTypes.array.isRequired,
  filterString: PropTypes.string.isRequired,
  showAll: PropTypes.bool.isRequired
}

export default Resources
