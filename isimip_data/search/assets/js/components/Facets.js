import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Facet from './Facet'


function Facets(props) {
  const { facets } = props

  return (
    <div className="facets">
      {
        facets.map(facet => {
          return <Facet key={facet.attribute} facet={facet} />
        })
      }
    </div>
  )
}

Facets.propTypes = {
  facets: PropTypes.array.isRequired
}

export default Facets
