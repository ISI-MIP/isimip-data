import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty, isNil } from 'lodash'

import { useDatasetsFacetsQuery } from 'isimip_data/metadata/assets/js/hooks/queries'

import { useFacetsQuery } from '../hooks/queries'

import Facet from './Facet'

const Facets = ({ params, glossary, updateParams }) => {

  const { data: facets } = useFacetsQuery()
  const { data: histograms, isFetching } = useDatasetsFacetsQuery(params)

  // hide facets that have no values under the current filters (the computed histograms
  // represent datasets without the specifier as a single null value), unless the facet
  // has checked values, so those can be unchecked here; while the histograms are still
  // loading, show all facets
  const hasValues = (facet) => {
    if (!isEmpty(params[facet.identifier])) return true
    if (isNil(histograms)) return true

    const items = histograms[facet.identifier]
    return !isEmpty(items) && !(items.length == 1 && isNil(items[0][0]))
  }

  return !isEmpty(facets) && (
    <div className="facets">
      {
        facets.map((facetGroup, facetGroupIndex) => {
          const visibleFacets = facetGroup.filter(hasValues)

          return !isEmpty(visibleFacets) && (
            <div key={facetGroupIndex} className="card">
              {
                visibleFacets.map((facet) => (
                  <Facet
                    key={facet.identifier} facet={facet} params={params} glossary={glossary}
                    updateParams={updateParams} items={histograms && histograms[facet.identifier]}
                    isFetching={isFetching}
                  />
                ))
              }
            </div>
          )
        })
      }
    </div>
  )
}

Facets.propTypes = {
  params: PropTypes.object.isRequired,
  glossary: PropTypes.object.isRequired,
  updateParams: PropTypes.func.isRequired
}

export default Facets
