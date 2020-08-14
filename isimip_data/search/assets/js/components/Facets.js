import React, { Component } from 'react'
import PropTypes from 'prop-types'

import DatasetApi from 'isimip_data/metadata/assets/js/api/DatasetApi'

import Facet from './Facet'


class Facets extends Component {

  render() {
    const { params, facets, glossary, onFacetChange } = this.props

    return (
      <div className="facets">
        {
          facets.map(facet => {
            return (
              <Facet key={facet.attribute} params={params} facet={facet} glossary={glossary}
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
  glossary: PropTypes.object.isRequired,
  onFacetChange: PropTypes.func.isRequired
}

export default Facets
