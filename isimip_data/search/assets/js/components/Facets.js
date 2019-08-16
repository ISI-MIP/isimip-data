import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Facet from './Facet'


function Facets(props) {
  const { facets, params, onChange } = props

  return (
    <div className="facets">
      {
        facets.map(facet => {
          const checked = params[facet.attribute] || []
          return <Facet key={facet.attribute} facet={facet} checked={checked} onChange={onChange} />
        })
      }
    </div>
  )
}

Facets.propTypes = {
  facets: PropTypes.array.isRequired,
  params: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
}

export default Facets
