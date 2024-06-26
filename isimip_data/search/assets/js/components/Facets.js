import React, { Component } from 'react'
import PropTypes from 'prop-types'

import FacetApi from '../api/FacetApi'

import Facet from './Facet'


class Facets extends Component {

  constructor(props) {
    super(props)
    this.state = {
      facets: []
    }
  }

  componentDidMount() {
    FacetApi.fetchFacets().then(facets => {
      this.setState({ facets })
    })
  }

  render() {
    const { params, glossary, onFacetChange } = this.props
    const { facets } = this.state

    return (
      <div className="facets">
        {
          facets.map((facet, index) => {
            return (
              <Facet key={index} params={params} facet={facet} glossary={glossary}
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
  glossary: PropTypes.object.isRequired,
  onFacetChange: PropTypes.func.isRequired
}

export default Facets
