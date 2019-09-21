import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Facet from './Facet'


class Facets extends Component {

  render() {
    const { params, facets, onFacetChange } = this.props

    return (
      <div className="facets">
        {
          facets.map(facet => {
            return (
              <Facet key={facet.attribute} params={params} facet={facet}
                     onChange={onFacetChange} />
            )
          })
        }
      </div>
    )
  }
}

Facets.propTypes = {
  params: PropTypes.object.isRequired,
  facets: PropTypes.array.isRequired,
  onFacetChange: PropTypes.func.isRequired
}

export default Facets
