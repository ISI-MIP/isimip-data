import React from 'react'

import { useLs } from 'isimip_data/core/assets/js/hooks/ls'

import { useResourcesQuery } from '../hooks/queries'

import Filter from './Filter'
import Resource from './Resource'


const Resources = () => {

  const [values, setValues] = useLs('isimip.resources', {
    showAll: false,
    filterString: ''
  })

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
      <Filter values={values} setValues={setValues} />
      {
        filteredResources.map(resource => <Resource key={resource.id} resource={resource} />)
      }
    </div>
  )
}

export default Resources
