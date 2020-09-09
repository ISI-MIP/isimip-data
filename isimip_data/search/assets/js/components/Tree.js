import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Tooltip from "react-bootstrap/Tooltip"

import DatasetApi from 'isimip_data/metadata/assets/js/api/DatasetApi'


class Tree extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tree: []
    }
    this.handleClose = this.handleClose.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
    this.abortController = new AbortController()
  }

  componentDidMount() {
    DatasetApi.fetchTree({
      signal: this.abortController.signal
    }).then(tree => {
      tree.map(item => {
        this.addParentToItem(item)
      })
      this.setState({ tree })
    })
  }

  componentWillUnmount(){
    this.abortController.abort();
  }

  addParentToItem(parent) {
    parent.items.map(item => {
      this.addParentToItem(item)
      item.parent = parent
    })
  }

  handleOpen(item) {
    const { params, onTreeChange } = this.props

    // open parent
    if (item.parent) {
      this.handleOpen(item.parent)
    }

    // close all siblings
    if (params[item.identifier]) {
      params[item.identifier].map(specifier => {
        onTreeChange(item.identifier, specifier, false)
      })
    }

    // recursively close all childs for consistency
    if (item.items) {
      item.items.map(item =>
        this.handleClose(item)
      )
    }

    // add this item to the params
    onTreeChange(item.identifier, item.specifier, true)
  }

  handleClose(item) {
    const { params, onTreeChange } = this.props

    // recursively close all childs
    if (item.items) {
      item.items.map(item =>
        this.handleClose(item)
      )
    }

    // remove this item from the params (and all siblings)
    if (params[item.identifier]) {
      params[item.identifier].map(specifier => {
        onTreeChange(item.identifier, specifier, false)
      })
    }
  }

  getActiveItem(items) {
    const { params } = this.props

    return items.reduce((accumulator, current) => {
      const isActive = (current.identifier in params) && (params[current.identifier].indexOf(current.specifier) > -1)
      if (accumulator === null && isActive) {
        return current
      } else {
        return accumulator
      }
    }, null)
  }

  renderTooltip(identifier, specifier) {
    const { glossary } = this.props

    let properties = {}
    if (glossary[identifier] && glossary[identifier][specifier]) {
      properties = glossary[identifier][specifier]
    }

    if (properties.title || properties.description) {
      return (
        <Tooltip>
          {properties.title && <strong>{properties.title}</strong>}
          {properties.description && <div>{properties.description}</div>}
        </Tooltip>
      )
    } else {
      return null
    }
  }

  renderItem(item) {
    return (
      <div className="tree-item d-flex justify-content-between align-items-center"
           onClick={e => this.handleOpen(item)}>
        <span className="d-flex align-items-center">
          <input className="mr-2" type="radio" checked={false} readOnly /> {item.specifier}
        </span>
        {item.items && (item.items.length > 0) && <FontAwesomeIcon icon={faChevronDown} />}
      </div>
    )
  }

  renderItemWrapper(item, index) {
    const tooltip = this.renderTooltip(item.identifier, item.specifier)

    if (tooltip) {
      return (
        <li key={index}>
          <OverlayTrigger placement="right" overlay={tooltip}>
            {this.renderItem(item)}
          </OverlayTrigger>
        </li>
      )
    } else {
      return (
        <li key={index}>
          {this.renderItem(item)}
        </li>
      )
    }
  }

  renderActiveItem(item, hasItems) {
    return (
      <div className="tree-item d-flex justify-content-between align-items-center"
           onClick={e => this.handleClose(item)}>
        <span className="d-flex align-items-center">
          <input className="mr-2" type="radio" checked={true} readOnly /> {item.specifier}
        </span>
        {hasItems && <FontAwesomeIcon icon={faChevronUp} />}
      </div>
    )
  }

  renderActiveItemWrapper(item, index) {
    const hasItems = item.items && (item.items.length > 0)
    const tooltip = this.renderTooltip(item.identifier, item.specifier)

    if (tooltip) {
      return (
        <li key={index}>
          <OverlayTrigger placement="right" overlay={tooltip}>
            {this.renderActiveItem(item, hasItems)}
          </OverlayTrigger>
          {hasItems && this.renderItems(item.items)}
        </li>
      )
    } else {
      return (
        <li key={index}>
          {this.renderActiveItem(item, hasItems)}
          {hasItems && this.renderItems(item.items)}
        </li>
      )
    }
  }

  renderItems(items) {
    const active = this.getActiveItem(items)

    return (
      <ul>
        {
          items.map((item, index) => {
            if (active == item) {
              return this.renderActiveItemWrapper(item, index)
            } else {
              return this.renderItemWrapper(item, index)
            }
          })
        }
      </ul>
    )
  }

  render() {
    const { tree } = this.state

    return (
      <div className="card tree">
        {this.renderItems(tree)}
      </div>
    )
  }
}

Tree.propTypes = {
  params: PropTypes.object.isRequired,
  glossary: PropTypes.object.isRequired,
  onTreeChange: PropTypes.func.isRequired
}

export default Tree
