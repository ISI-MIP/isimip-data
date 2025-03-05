import React from 'react'
import PropTypes from 'prop-types'

import { useResourcesQuery } from '../hooks/queries'

import Resource from './Resource'


const Resources = ({ values }) => {

  const { data: resources } = useResourcesQuery()

  const filteredResources = resources.filter(resource => {
    // filter for the showAll flag
    if (resource.new_version && !values.showAll) {
      return false
    }

    // filter for the filter string
    const tokens = values.filterString.toLowerCase().split(/(\s+)/).filter( e => e.trim().length > 0)
    const string = [
      resource.doi,
      resource.title,
      resource.creators_str
    ].concat(resource.paths).join(' ').toLowerCase()

    return tokens.map(token => string.includes(token)).every(element => element === true)
  })

  return (
    <div className="resources">
      {
        filteredResources.map(resource => <Resource key={resource.id} resource={resource} />)
      }
    </div>
  )
}

Resources.propTypes = {
  values: PropTypes.object.isRequired
}

export default Resources
