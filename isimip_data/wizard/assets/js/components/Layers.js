import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Layer from './Layer'


class Layers extends Component {

  render() {
    const { params, layers, onChange } = this.props

    return (
      <div className="layers">
        {
          layers.map(layer => {
            return (
              <Layer key={layer.attribute} params={params} layer={layer} onChange={onChange} />
            )
          })
        }
      </div>
    )
  }
}

Layers.propTypes = {
  params: PropTypes.object.isRequired,
  layers: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
}

export default Layers
