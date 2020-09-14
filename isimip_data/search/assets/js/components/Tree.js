import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Tooltip from "react-bootstrap/Tooltip"

import DatasetApi from 'isimip_data/metadata/assets/js/api/DatasetApi'

import { getValueOrNull } from 'isimip_data/core/assets/js/utils/object'


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
    this.fetchTree()
  }

  componentDidUpdate(prevProps) {
    if (this.props.params !== prevProps.params) {
      this.fetchTree()
    }
  }

  componentWillUnmount(){
    this.abortController.abort();
  }

  fetchTree() {
    const { params } = this.props

    return DatasetApi.fetchTree({
      path: params.path || ''
    }, {
      signal: this.abortController.signal
    }).then(items => {
      this.setState({ tree: items })
    })
  }

  handleOpen(item) {
    const { params, onTreeChange } = this.props

    // close all parents
    if (params.path) {
      params.path.map(path_param => {
        if (item.path.indexOf(path_param) == 0) {
          onTreeChange('path', path_param, false)
        }
      })
    }

    // open item
    onTreeChange('path', item.path, true)
  }

  handleClose(item) {
    const { params, onTreeChange } = this.props
    const parentPath = item.path.substring(0, item.path.lastIndexOf('/'))

    // close item
    onTreeChange('path', item.path, false)

    // close all children
    params.path.reduce((accumulator, path) => {
      if (path.indexOf(item.path) == 0) {
        accumulator.push(path)
      }
      return accumulator
    }, []).map(path => {
      onTreeChange('path', path, false)
    })

    // open parent if no other child is open
    const openParent = params.path.reduce((accumulator, path) => {
      if (item.path.indexOf(parentPath) == 0) {
        accumulator = false
      }
      return accumulator
    }, true)
    if (openParent) {
      onTreeChange('path', parentPath, true)
    }
  }

  renderTooltip(identifier, specifier) {
    const { glossary } = this.props
    const properties = getValueOrNull(glossary, identifier, specifier)

    if (properties && (properties.title || properties.description)) {
      return (
        <Tooltip>
          {properties.title && <strong>{properties.title}</strong>}
          {properties.description && <div>{properties.description}</div>}
        </Tooltip>
      )
    }
  }

  renderItem(item) {
    return (
      <div className="tree-item d-flex justify-content-between align-items-center"
           onClick={e => this.handleOpen(item)}>
        <span className="d-flex align-items-center">
          <input className="mr-2" type="checkbox" checked={false} readOnly /> {item.specifier}
        </span>
        {item.hasItems && <FontAwesomeIcon icon={faChevronDown} />}
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

  renderOpenItem(item) {
    return (
      <div className="tree-item d-flex justify-content-between align-items-center"
           onClick={e => this.handleClose(item)}>
        <span className="d-flex align-items-center">
          <input className="mr-2" type="checkbox" checked={true} readOnly /> {item.specifier}
        </span>
        {item.hasItems && <FontAwesomeIcon icon={faChevronUp} />}
      </div>
    )
  }

  renderOpenItemWrapper(item, index) {
    const tooltip = this.renderTooltip(item.identifier, item.specifier)

    if (tooltip) {
      return (
        <li key={index}>
          <OverlayTrigger placement="right" overlay={tooltip}>
            {this.renderOpenItem(item)}
          </OverlayTrigger>
          {item.items && this.renderItems(item.items)}
        </li>
      )
    } else {
      return (
        <li key={index}>
          {this.renderOpenItem(item)}
          {item.items && this.renderItems(item.items)}
        </li>
      )
    }
  }

  renderItems(items) {
    return (
      <ul>
        {
          items.map((item, index) => {
            if (item.items) {
              return this.renderOpenItemWrapper(item, index)
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
