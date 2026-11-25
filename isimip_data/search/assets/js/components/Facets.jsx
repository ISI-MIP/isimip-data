import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import { useDatasetsFacetsQuery } from 'isimip_data/metadata/assets/js/hooks/queries'

import { useFacetsQuery } from '../hooks/queries'

import Facet from './Facet'

const Facets = ({ params, glossary, updateParams }) => {

  const { data: facets } = useFacetsQuery()
  const { data: histograms, isFetching } = useDatasetsFacetsQuery(params)

  return !isEmpty(facets) && (
    <div className="facets">
      {
        facets.map((facetGroup, facetGroupIndex) => (
          <div key={facetGroupIndex} className="card">
            {
              facetGroup.map((facet, facetIndex) => (
                <Facet
                  key={facetIndex} facet={facet} params={params} glossary={glossary} updateParams={updateParams}
                  items={histograms && histograms[facet.identifier]} isFetching={isFetching}
                />
              ))
            }
          </div>
        ))
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
