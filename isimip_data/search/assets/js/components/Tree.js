import React from 'react'
import PropTypes from 'prop-types'
import { get, intersection, isEmpty, sortBy } from 'lodash'

import Icon from 'isimip_data/core/assets/js/components/Icon'
import Tooltip from 'isimip_data/core/assets/js/components/Tooltip'

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

  const toggleItem = (event, item) => {
    if (event.type == 'change' || isEmpty(
      // do not react to click events on the checkbox or the label, those are handled by the change event
      intersection(event.target.classList, ['form-check-input', 'form-check-label']))
    ) {
      if (item.items) {
        handleClose(item)
      } else {
        handleOpen(item)
      }
    }
  }

  const renderTooltip = (properties) => (
    (properties.long_name || properties.description || properties.warning) ? (
      <>
        {properties.long_name && (<strong>{properties.long_name}</strong>)}
        {properties.description && (<p>{properties.description}</p>)}
        {properties.warning && (<p>Warning: {properties.warning}</p>)}
      </>
    ) : null
  )

  const renderUrl = (item, properties) => (
    Object.keys(properties.urls).map((key, index) => {
      if (item.tree.includes(key)) {
        return (
          <Tooltip key={index} title={<>More information is available in the {key} protocol.</>}>
            <a className="d-block ms-auto" href={properties.urls[key]} target="_blank" rel="noreferrer"
               onClick={e => e.stopPropagation()}>
              <Icon className="d-block" icon="quick_reference_all" size="sm" />
            </a>
          </Tooltip>
        )
      } else {
        return null
      }
    })
  )

  const renderItem = (item, level) => {
    // try to get additional or updated properties from the glossary
    const properties = get(glossary, [item.identifier, item.specifier], {})
    const id = `${item.identifier}-${item.specifier}`

    return (
      <li className="list-group-item" onClick={(event) => toggleItem(event, item)}>
        <div className={`tree-level-${level}`}>
          <Tooltip placement="right" title={renderTooltip(properties)}>
            <div className="d-flex gap-1 align-items-center">
              <input className="form-check-input me-1 mt-0" type="checkbox" id={id} checked={!isEmpty(item.items)}
                     onChange={(event) => toggleItem(event, item)} />

              <label className="form-check-label flex-grow-1" htmlFor={id}>
                {properties.title || item.specifier}
              </label>

              {properties.urls && renderUrl(item, properties)}
            </div>
          </Tooltip>
        </div>
      </li>
    )
  }

  const renderItems = (items, level = 0) => (
    <>
      {
        sortBy(items, ['specifier']).map((item, index) => (
          <React.Fragment key={index}>
            {renderItem(item, level)}
            {item.items && renderItems(item.items, level + 1)}
          </React.Fragment>
        ))
      }
    </>
  )

  return !isEmpty(tree) && (
    <div className="card tree">
      <ul className="list-group list-group-flush">
        {renderItems(tree)}
      </ul>
    </div>
  )
}

Tree.propTypes = {
  params: PropTypes.object.isRequired,
  glossary: PropTypes.object.isRequired,
  updateParams: PropTypes.func.isRequired
}

export default Tree
