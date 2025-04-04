import React from 'react'

import { useLs } from 'isimip_data/core/assets/js/hooks/ls'
import { useSearch } from 'isimip_data/core/assets/js/hooks/search'

import { useCaveatsQuery } from '../hooks/queries'

import Caveat from './Caveat'
import Filter from './Filter'

const Caveats = () => {

  const [values, setValues] = useLs('isimip.caveats', {})

  const { data: caveats } = useCaveatsQuery()

  const search = useSearch(caveats, {
    fields: ['title', 'creators_str']
  })

  const filteredCaveats = search.search(values.filterString).filter((caveat) => (
    values.category ? caveat.category == values.category : true
  )).filter((caveat) => (
    values.severity ? caveat.severity == values.severity : true
  )).filter((caveat) => (
    values.status ? caveat.status == values.status : true
  )).sort((a, b) => {
    switch (values.order) {
      case 'newest':
        return b.created.localeCompare(a.created)
      case 'oldest':
        return a.created.localeCompare(b.created)
      case 'title':
        return a.title.localeCompare(b.title)
      case 'last':
      default:
        return b.updated.localeCompare(a.updated)
    }
  })

  return (
    <div className="caveats">
      <Filter values={values} setValues={setValues} />
      {
          filteredCaveats.map((caveat, caveatIndex) => <Caveat key={caveatIndex} caveat={caveat} />)
      }
    </div>
  )
}

export default Caveats
