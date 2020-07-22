import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'

import DatasetApi from 'isimip_data/metadata/assets/js/api/DatasetApi'


class Tree extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hierarchy: []
    }
    this.handleClose = this.handleClose.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
    this.abortController = new AbortController()
  }

  componentDidMount() {
    DatasetApi.fetchHierarchy({
      signal: this.abortController.signal
    }).then(hierarchy => {
      hierarchy.map(item => {
        this.addParentToItem(item)
      })
      this.setState({ hierarchy })
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

  renderItem(item, index) {
    return (
      <li key={index}>
        <div className="tree-item d-flex justify-content-between align-items-center"
             onClick={e => this.handleOpen(item)}>
          <span className="d-flex align-items-center" title={item.description}>
            <input className="mr-2" type="radio" checked={false} readOnly /> {item.title || item.specifier}
          </span>
          {item.items && (item.items.length > 0) && <FontAwesomeIcon icon={faChevronDown} />}
        </div>
      </li>
    )
  }

  renderActiveItem(item, index) {
    const hasItems = item.items && (item.items.length > 0)
    return (
      <li key={index}>
        <div className="tree-item d-flex justify-content-between align-items-center"
             onClick={e => this.handleClose(item)}>
          <span className="d-flex align-items-center" title={item.description}>
            <input className="mr-2" type="radio" checked={true} readOnly /> {item.title || item.specifier}
          </span>
          {hasItems && <FontAwesomeIcon icon={faChevronUp} />}
        </div>
        {hasItems && this.renderItems(item.items)}
      </li>
    )
  }

  renderItems(items) {
    const active = this.getActiveItem(items)

    return (
      <ul>
        {
          items.map((item, index) => {
            if (active == item) {
              return this.renderActiveItem(item, index)
            } else {
              return this.renderItem(item, index)
            }
          })
        }
      </ul>
    )
  }

  render() {
    const { hierarchy } = this.state

    return (
      <div className="card tree">
        {this.renderItems(hierarchy)}
      </div>
    )
  }
}

Tree.propTypes = {
  params: PropTypes.object.isRequired,
  onTreeChange: PropTypes.func.isRequired
}

export default Tree
