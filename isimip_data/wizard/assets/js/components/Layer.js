import React, { Component} from 'react'
import PropTypes from 'prop-types'

import DatasetApi from 'isimip_data/metadata/assets/js/api/DatasetApi'


const cardChunkSize = 6

class Layer extends Component {

  constructor(props) {
    super(props)
    this.state = {
      cards: []
    }
  }

  componentDidMount() {
    this.fetch()
  }

  componentDidUpdate(prevProps) {
    if (this.props.params !== prevProps.params) {
      this.fetch()
    }
  }

  fetch() {
    const { params, layer } = this.props

    DatasetApi.fetchDatasetsHistogram(layer.attribute, params).then(items => {
      const cards = items.map(item => {
        const [key, count] = item
        const active = params[layer.attribute] ? params[layer.attribute].indexOf(key) > -1  : false

        return {
          attribute: layer.attribute,
          key: key,
          title: key,
          active: active
        }
      })
      this.setState({ cards })
    })
  }

  handleClick(card) {
    const { onChange } = this.props
    onChange(card.attribute, card.key)
  }

  render() {
    const { layer } = this.props
    const { cards } = this.state

    return (
      <div className="layer">
        <h3>{layer.title}</h3>
        <div className="card-columns" style={{columnCount: Math.min(4, cards.length)}}>
          {
            cards.map((card, index) => {
              return (
                <div key={index} className={'card' + (card.active ? ' active' : '')}
                     onClick={e => this.handleClick(card)}>
                  <div className="card-body">
                    <h4 className="card-title">{card.title}</h4>
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
