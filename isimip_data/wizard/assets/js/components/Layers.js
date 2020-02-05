import React, { Component } from 'react'
import PropTypes from 'prop-types'

import LayerApi from '../api/LayerApi'

import Layer from './Layer'


class Layers extends Component {

  constructor(props) {
    super(props);
    this.state = {
      layers: [],
      glossary: {}
    }
  }

  componentDidMount() {
    LayerApi.fetchGlossary().then(glossary => {
      this.setState({ glossary }, this.fetch)
    })
  }

  componentDidUpdate(prevProps) {
    if (this.props.params !== prevProps.params) {
      this.fetch()
    }
  }

  fetch() {
    const { params } = this.props

    LayerApi.fetchLayersWizard(params).then(layers => {
      this.setState({ layers })
    })
  }

  render() {
    const { params, onChange } = this.props
    const { layers, glossary } = this.state

    return (
      <div className="layers">
        {
          layers.map(layer => {
            return (
              <Layer key={layer.attribute} params={params} glossary={glossary} layer={layer} onChange={onChange} />
            )
          })
        }
      </div>
    )
  }
}

Layers.propTypes = {
  params: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
}

export default Layers
