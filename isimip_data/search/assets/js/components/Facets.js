import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import { useFacetsQuery } from '../hooks/queries'

import Facet from './Facet'


const Facets = ({ params, glossary, updateParams }) => {

  const { data: facets } = useFacetsQuery()

  return !isEmpty(facets) && (
    <div className="facets">
      {
        facets.map((facetGroup, facetGroupIndex) => (
          <div key={facetGroupIndex} className="card">
          {
            facetGroup.map((facet, facetIndex) => (
              <Facet key={facetIndex} facet={facet} params={params} glossary={glossary} updateParams={updateParams} />
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
