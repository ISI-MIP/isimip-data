import React from 'react'
import PropTypes from 'prop-types'
import { get, isEmpty, sortBy } from 'lodash'

import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Tooltip from "react-bootstrap/Tooltip"

import { useTreeQuery } from 'isimip_data/metadata/assets/js/hooks/queries'


const Tree = ({ params, glossary, updateParams }) => {

  const { data: tree } = useTreeQuery(params)

  const handleOpen = (item) => {
    // if params.tree does not exist yet, set it to [item.tree]
    // otherwise remove all "parent" items and add the item
    updateParams({ tree: [...(params.tree || []).filter(t => !item.tree.startsWith(t)), item.tree] })
  }

  const handleClose = (item) => {
    // close the item and open the parent, unless there is no parent (top level),
    // or a sibling or one of it's descendants (other) is open
    const parent = item.tree.substring(0, item.tree.lastIndexOf('/'))
    const other = params.tree.filter(t => (!isEmpty(parent) && t.startsWith(parent) && !t.startsWith(item.tree)))

    if (isEmpty(parent) || !isEmpty(other)) {
      updateParams({ tree: params.tree.filter(t => !t.startsWith(item.tree)) })
    } else {
      updateParams({ tree: [...params.tree.filter(t => !t.startsWith(item.tree)), parent] })
    }
  }

  const toggleItem = (item) => {
    if (item.items) {
      handleClose(item)
    } else {
      handleOpen(item)
    }
  }

  const renderTooltip = (item) => (
    (item.long_name || item.description || item.warning) ? (
      <Tooltip>
        {item.long_name && (<strong>{item.long_name}</strong>)}
        {item.description && (<p>{item.description}</p>)}
        {item.warning && (<p>Warning: {item.warning}</p>)}
      </Tooltip>
    ) : null
  )

  const renderUrl = (item) => (
    Object.keys(item.urls).map((key, index) => {
      if (item.tree.includes(key)) {
        return (
          <a key={index} className="ml-auto" href={item.urls[key]} target="_blank" rel="noreferrer"
             onClick={e => e.stopPropagation()}>
            <OverlayTrigger placement="bottom" overlay={<Tooltip>More information is available in the {key} protocol.</Tooltip>}>
              <span className="material-symbols-rounded symbols-protocol">quick_reference_all</span>
            </OverlayTrigger>
          </a>
        )
      } else {
        return null
      }
    })
  )

  const renderItem = (item) => (
    <div className="tree-item d-flex align-items-center"
         onClick={() => toggleItem(item)}>
      <input className="mr-2" type="checkbox" checked={item.items || false} readOnly />
      <span>{item.title || item.specifier}</span>
      {item.hasItems && <span className="material-symbols-rounded symbols-expand">expand_more</span>}
      {item.urls && renderUrl(item)}
    </div>
  )

  const renderItemWrapper = (item, index) => {
    const tooltip = renderTooltip(item)

    if (tooltip) {
      return (
        <li key={index}>
          <OverlayTrigger placement="right" overlay={tooltip}>
            {renderItem(item)}
          </OverlayTrigger>
          {item.items && renderItems(item.items)}
        </li>
      )
    } else {
      return (
        <li key={index}>
          {renderItem(item)}
          {item.items && renderItems(item.items)}
        </li>
      )
    }
  }

  const renderItems = (items) => (
    <ul>
      {
        sortBy(items, ['specifier']).map((item, index) => {
          // try to get additional or updated properties from the glossary
          const properties = get(glossary, [item.identifier, item.specifier], {})

          return renderItemWrapper({...item, ...properties}, index)
        })
      }
    </ul>
  )

  return !isEmpty(tree) && (
    <div className="card tree">
      {renderItems(tree)}
    </div>
  )
}

Tree.propTypes = {
  params: PropTypes.object.isRequired,
  glossary: PropTypes.object.isRequired,
  updateParams: PropTypes.func.isRequired
}

export default Tree
