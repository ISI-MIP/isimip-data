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
    this.toogleItem = this.toogleItem.bind(this)
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
      tree: params.tree || ''
    }, {
      signal: this.abortController.signal
    }).then(items => {
      this.setState({ tree: items })
    })
  }

  toogleItem(item) {
    if (item.items) {
      this.handleClose(item)
    } else {
      this.handleOpen(item)
    }
  }

  handleOpen(item) {
    const { params, onTreeChange } = this.props

    // close all parents
    if (params.tree) {
      params.tree.map(treeParam => {
        if (item.tree.indexOf(treeParam) == 0) {
          onTreeChange('tree', treeParam, false)
        }
      })
    }

    // open item
    onTreeChange('tree', item.tree, true)
  }

  handleClose(item) {
    const { params, onTreeChange } = this.props
    const parentTrail = item.tree.substring(0, item.tree.lastIndexOf('/'))

    // close item
    onTreeChange('tree', item.tree, false)

    // close all children
    params.tree.reduce((accumulator, tree) => {
      if (tree.indexOf(item.tree) == 0) {
        accumulator.push(tree)
      }
      return accumulator
    }, []).map(tree => {
      onTreeChange('tree', tree, false)
    })

    // open parent if no other child is open
    if (parentTrail) {
      const openParent = params.tree.reduce((accumulator, tree) => {
        if (tree.indexOf(parentTrail) == 0) {
          accumulator = false
        }
        return accumulator
      }, true)
      if (openParent) {
        onTreeChange('tree', parentTrail, true)
      }
    }
  }

  updateItem(item) {
    const { glossary } = this.props
    const properties = getValueOrNull(glossary, item.identifier, item.specifier)

    if (properties) {
      item.title = properties.title
      item.long_name = properties.long_name
      item.description = properties.description
      item.warning = properties.warning
    }

    return item
  }

  renderTooltip(item) {
    if (item.long_name || item.description || item.warning) {
      return (
        <Tooltip>
          {item.long_name && (<strong>{item.long_name}</strong>)}
          {item.description && (<p>{item.description}</p>)}
          {item.warning && (<p>Warning: {item.warning}</p>)}
        </Tooltip>
      )
    }
  }

  renderItem(item) {
    return (
      <div className="tree-item d-flex align-items-center"
           onClick={e => this.toogleItem(item)}>
        <input className="mr-2" type="checkbox" checked={item.items || false} readOnly />
        <span>{item.title || item.specifier}</span>
        {item.hasItems && <FontAwesomeIcon icon={faChevronUp} />}
      </div>
    )
  }

  renderItemWrapper(item, index) {
    const tooltip = this.renderTooltip(item)

    if (tooltip) {
      return (
        <li key={index}>
          <OverlayTrigger placement="right" overlay={tooltip}>
            {this.renderItem(item)}
          </OverlayTrigger>
          {item.items && this.renderItems(item.items)}
        </li>
      )
    } else {
      return (
        <li key={index}>
          {this.renderItem(item)}
          {item.items && this.renderItems(item.items)}
        </li>
      )
    }
  }

  renderItems(items) {
    return (
      <ul>
        {
          items.sort((a, b) => a.specifier > b.specifier ? 1 : -1).map((item, index) => {
            item = this.updateItem(item)
            return this.renderItemWrapper(item, index)
          })
        }
      </ul>
    )
  }

  render() {
    const { tree } = this.state

    if (tree.length > 0) {
      return (
        <div className="card tree">
          {this.renderItems(tree)}
        </div>
      )
    } else {
      return null
    }
  }
}

Tree.propTypes = {
  params: PropTypes.object.isRequired,
  glossary: PropTypes.object.isRequired,
  onTreeChange: PropTypes.func.isRequired
}

export default Tree
