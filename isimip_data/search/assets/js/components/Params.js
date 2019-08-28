import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

const hiddenParams = ['page']

class Params extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    const { params, onRemove } = this.props

    const items = []
    Object.keys(params).map(key => {
      const value = params[key]

      if (hiddenParams.indexOf(key) < 0) {
        if (Array.isArray(value)) {
          value.map(v => {
            items.push([key, v])
          })
        } else {
          if (value) {
            items.push([key, value])
          }
        }
      }
    })

    let list_items = <li className="list-inline-item">none</li>
    if (items.length) {
      list_items = items.map((item, index) => {
        const [key, value] = item
        return (
          <li key={index} className="list-inline-item">
            {key} = {value}
            <button className="btn btn-link" onClick={() => onRemove(key, value)}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </li>
        )
      })
    }

    return (
      <div className="card params">
        <div className="card-body">
          <h4 className="card-title">Search constraints</h4>
          <ul className="list-inline">
            {list_items}
          </ul>
        </div>
      </div>
    )
  }
}

Params.propTypes = {
  params: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired
}

export default Params
