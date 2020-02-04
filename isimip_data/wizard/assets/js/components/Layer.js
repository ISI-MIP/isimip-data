import React, { Component} from 'react'
import PropTypes from 'prop-types'


const cardChunkSize = 6

class Layer extends Component {

  handleClick(attribute, value) {
    const { onChange } = this.props
    onChange(attribute, value)
  }

  renderCard(attribute, specifier, index) {
    const { params, glossary } = this.props
    const active = params[attribute] && params[attribute].indexOf(specifier) > -1

    let properties = {}
    if (glossary.terms[attribute] && glossary.terms[attribute][specifier]) {
      properties = glossary.terms[attribute][specifier]
    }
    return (
      <div key={index} className={ 'card' + (active ? ' active' : '') }
           onClick={e => this.handleClick(attribute, specifier)}>
        <div className="card-body">
          <h4 className="card-title">{properties.title || specifier}</h4>
          {(properties.title || properties.description) && <div className="card-text">
            {properties.title && <p>{specifier}</p>}
            {properties.description && <p>{properties.description}</p>}
          </div>}
        </div>
      </div>
    )
  }

  render() {
    const { layer } = this.props

    return (
      <div className="layer">
        <h3>{layer.title}</h3>
        <div className="card-columns" style={{columnCount: Math.min(3, layer.values.length)}}>
          {layer.values.map((value, index) => this.renderCard(layer.attribute, value, index))}
        </div>
      </div>
    )
  }
}

Layer.propTypes = {
  params: PropTypes.object.isRequired,
  glossary: PropTypes.object.isRequired,
  layer: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
}

export default Layer
