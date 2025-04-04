import React from 'react'

import { useLs } from 'isimip_data/core/assets/js/hooks/ls'
import { useSearch } from 'isimip_data/core/assets/js/hooks/search'

import { useResourcesQuery } from '../hooks/queries'

import Filter from './Filter'
import Resource from './Resource'


const Resources = () => {

  const [values, setValues] = useLs('isimip.resources', {
    all: false,
    filter: ''
  })

  const { data: resources } = useResourcesQuery()

  const search = useSearch(resources, {
    fields: ['doi', 'title', 'creators_str', 'paths'],
    extractField: (resource, fieldName) => (
      fieldName == 'paths' ? resource.paths.join() : resource[fieldName]
    )
  })

  const filteredResources = search.search(values.filter).filter((resource) => (
    values.all ? true : !resource.new_version
  )).sort((a, b) => {
    switch (values.order) {
      case 'newest':
        return b.publication_date.localeCompare(a.publication_date) || a.doi.localeCompare(b.doi)
      case 'oldest':
        return a.publication_date.localeCompare(b.publication_date) || a.doi.localeCompare(b.doi)
      case 'title':
        return a.title.localeCompare(b.title) || a.doi.localeCompare(b.doi)
      case 'paths':
      default:
        return a.paths.join().localeCompare(b.paths.join()) || b.doi.localeCompare(a.doi)
    }
  })

  return (
    <div className="resources">
      <Filter values={values} setValues={setValues} />
      {
        filteredResources.map(resource => <Resource key={resource.id} resource={resource} all={values.all} />)
      }
    </div>
  )
}

export default Resources
