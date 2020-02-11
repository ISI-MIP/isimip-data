import React, { Component} from 'react'
import PropTypes from 'prop-types'


const cardChunkSize = 6

class Layer extends Component {

  handleClick(attribute, value) {
    const { onChange } = this.props
    onChange(attribute, value)
  }

  renderCard(attribute, specifier, index) {
    const { params } = this.props
    const { glossary } = this.props
    const active = params[attribute] && params[attribute].indexOf(specifier) > -1

    let properties = {}
    if (glossary[attribute] && glossary[attribute][specifier]) {
      properties = glossary[attribute][specifier]
    }

    return (
      <div key={index} className={ 'card' + (active ? ' active' : '') }
           onClick={e => this.handleClick(attribute, specifier)}>
        <div className="card-body">
          <h4 className="card-title">{properties.title || specifier}</h4>
          <div className="card-text">
            {properties.description && <p>{properties.description}</p>}
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { layer } = this.props

    let className = 'card-columns'
    if (layer.values.length == 1) {
      className += ' one-column'
    } else if (layer.values.length == 2 || layer.values.length == 4){
      className += ' two-columns'
    } else {
      className += ' three-columns'
    }

    return (
      <div className="layer">
        <h3>{layer.title}</h3>
        <div className={className}>
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
