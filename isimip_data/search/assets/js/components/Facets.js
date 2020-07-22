import React, { Component } from 'react'
import PropTypes from 'prop-types'

import DatasetApi from 'isimip_data/metadata/assets/js/api/DatasetApi'

import Facet from './Facet'


class Facets extends Component {

  constructor(props) {
    super(props);
    this.state = {
      glossary: {}
    }
    this.abortController = new AbortController()
  }

  componentDidMount() {
    DatasetApi.fetchGlossary({
      signal: this.abortController.signal
    }).then(glossary => {
      this.setState({ glossary })
    })
  }

  componentWillUnmount(){
    this.abortController.abort();
  }

  render() {
    const { params, facets, onFacetChange } = this.props
    const { glossary } = this.state

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
  onFacetChange: PropTypes.func.isRequired
}

export default Facets
