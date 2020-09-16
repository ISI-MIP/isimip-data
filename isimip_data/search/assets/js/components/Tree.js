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
      trace: params.trace || ''
    }, {
      signal: this.abortController.signal
    }).then(items => {
      this.setState({ tree: items })
    })
  }

  handleOpen(item) {
    const { params, onTreeChange } = this.props

    // close all parents
    if (params.trace) {
      params.trace.map(traceParam => {
        if (item.trace.indexOf(traceParam) == 0) {
          onTreeChange('trace', traceParam, false)
        }
      })
    }

    // open item
    onTreeChange('trace', item.trace, true)
  }

  handleClose(item) {
    const { params, onTreeChange } = this.props
    const parentTrail = item.trace.substring(0, item.trace.lastIndexOf('/'))

    // close item
    onTreeChange('trace', item.trace, false)

    // close all children
    params.trace.reduce((accumulator, trace) => {
      if (trace.indexOf(item.trace) == 0) {
        accumulator.push(trace)
      }
      return accumulator
    }, []).map(trace => {
      console.log(trace);
      onTreeChange('trace', trace, false)
    })

    // open parent if no other child is open
    if (parentTrail) {
      const openParent = params.trace.reduce((accumulator, trace) => {
        if (trace.indexOf(parentTrail) == 0) {
          accumulator = false
        }
        return accumulator
      }, true)
      if (openParent) {
        onTreeChange('trace', parentTrail, true)
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
    }

    return item
  }

  renderTooltip(item) {
    if (item.long_name || item.description) {
      return (
        <Tooltip>
          {item.long_name}
          {item.description}
        </Tooltip>
      )
    }
  }

  renderItem(item) {
    return (
      <div className="tree-item d-flex justify-content-between align-items-center"
           onClick={e => this.handleOpen(item)}>
        <span className="d-flex align-items-center">
          <input className="mr-2" type="checkbox" checked={false} readOnly /> {item.title || item.specifier}
        </span>
        {item.hasItems && <FontAwesomeIcon icon={faChevronDown} />}
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
          <input className="mr-2" type="checkbox" checked={true} readOnly /> {item.title || item.specifier}
        </span>
        {item.hasItems && <FontAwesomeIcon icon={faChevronUp} />}
      </div>
    )
  }

  renderOpenItemWrapper(item, index) {
    const tooltip = this.renderTooltip(item)

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
            item = this.updateItem(item)

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
