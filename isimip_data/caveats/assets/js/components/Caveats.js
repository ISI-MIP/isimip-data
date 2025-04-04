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
        return a.id < b.id ? 1 : -1
      case 'oldest':
        return a.id > b.id ? 1 : -1
      case 'title':
        return a.title > b.title ? 1 : -1
      case 'last':
      default:
        return a.updated < b.updated ? 1 : -1
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
