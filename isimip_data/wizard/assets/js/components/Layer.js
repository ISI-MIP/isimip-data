import React, { Component} from 'react'
import PropTypes from 'prop-types'


const cardChunkSize = 6

class Layer extends Component {

  handleClick(attribute, value) {
    const { onChange } = this.props
    onChange(attribute, value)
  }

  render() {
    const { params, layer } = this.props

    return (
      <div className="layer">
        <h3>{layer.title}</h3>
        <div className="card-columns" style={{columnCount: Math.min(4, layer.values.length)}}>
          {
            layer.values.map((value, index) => {
              const active = params[layer.attribute] && params[layer.attribute].indexOf(value) > -1

              return (
                <div key={index} className={ 'card' + (active ? ' active' : '') }
                     onClick={e => this.handleClick(layer.attribute, value)}>
                  <div className="card-body">
                    <h4 className="card-title">{value}</h4>
                    <p className="card-text">
                      Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod.
                    </p>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}

Layer.propTypes = {
  params: PropTypes.object.isRequired,
  layer: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
}

export default Layer
