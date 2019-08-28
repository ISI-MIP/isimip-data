import React, { Component } from 'react'
import PropTypes from 'prop-types'

import FacetApi from '../api/FacetApi'

import Facet from './Facet'


class Facets extends Component {

  constructor(props) {
    super(props);
    this.state = {
      facets: []
    }
  }

  componentDidMount() {
    this.fetch()
  }

  fetch() {
    FacetApi.fetchFacets().then(facets => {
      this.setState({ facets })
    })
  }

  render() {
    const { params, onFacetChange } = this.props
    const { facets } = this.state

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
  onFacetChange: PropTypes.func.isRequired
}

export default Facets
