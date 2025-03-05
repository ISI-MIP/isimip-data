import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { get, isNil } from 'lodash'

import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Tooltip from "react-bootstrap/Tooltip"

import { useDatasetsHistogramQuery } from 'isimip_data/metadata/assets/js/hooks/queries'


const Facet = ({ facet, params, glossary, updateParams }) => {

  const [isOpen, setIsOpen] = useState(false)

  const { data: items, isLoading } = useDatasetsHistogramQuery(facet.identifier, params, isOpen)

  const checked = params[facet.identifier] || []
  const isChecked = checked.length > 0
  const isEmpty = isNil(items) || items.length == 0 || (items.length == 1 && items[0][0] == null)

  const handleChange = (event, specifier) => {
    updateParams({
      [facet.identifier]: (
        (params[facet.identifier] || []).includes(specifier) ? params[facet.identifier].filter(s => s != specifier)
                                                             : [...(params[facet.identifier] || []), specifier]
      )
    })
  }

  const renderTooltip = (properties) => (
    (properties && (properties.long_name || properties.description || properties.warning)) && (
      <Tooltip>
        {properties.long_name}
        {properties.description && (<p>{properties.description}</p>)}
        {properties.warning && (<p>Warning: {properties.warning}</p>)}
      </Tooltip>
    )
  )

  const filterUrls = (urls) => {
    let filteredUrls = []
    if (urls) {
      Object.keys(urls).forEach(key => {
        if (window.location.href.includes(key)) {
          filteredUrls.push(key)
        }
      })
      if (filteredUrls.length == 0) {
        filteredUrls.push(Object.keys(urls).sort().at(-1))
      }
    }

    return filteredUrls
  }

  const renderListItem = (identifier, specifier, title, isChecked, urls, count) => {
    const id = 'facet-' + identifier + '-' + specifier
    const filteredUrls = filterUrls(urls)

    return (
      <li key={specifier} className="list-group-item facet-item d-flex align-items-center">
        <label className="form-check-label" htmlFor={id}>
          <input type="checkbox" className="form-check-input" id={id}
                 checked={isChecked} onChange={(event) => handleChange(event, specifier)} />
            {title || specifier}
        </label>
        {filteredUrls.map((key, index) => {
          return (
            <a key={index} className={'ml-1'.concat(index == 0 ? ' ml-auto' : '')} href={urls[key]}
               target="_blank" rel="noreferrer" onClick={event => event.stopPropagation()}>
              <OverlayTrigger placement="bottom" overlay={<Tooltip>More information is available in the {key} protocol.</Tooltip>}>
                <span className="material-symbols-rounded">quick_reference_all</span>
              </OverlayTrigger>
            </a>
          )
        })}
        <span className={'badge badge-secondary badge-pill '.concat(filteredUrls.length > 0 ? 'ml-1' : 'ml-auto')}>
          {count}
        </span>
      </li>
    )
  }

  const renderListGroup = (identifier, items, checked) => (
    <ul className="list-group list-group-flush">
      {
        items.map((item) => {
          const [specifier, count] = item
          const properties = get(glossary, [identifier, specifier], {})
          const title = properties ? properties.title : null
          const urls = properties ? properties.urls : null

          if (!isNil(specifier)) {
            const isChecked = checked.includes(specifier)
            const tooltip = renderTooltip(properties)

            if (tooltip) {
              return (
                <OverlayTrigger key={specifier} placement="right" overlay={tooltip}>
                  {renderListItem(identifier, specifier, title, isChecked, urls, count)}
                </OverlayTrigger>
              )
            } else {
              return renderListItem(identifier, specifier, title, isChecked, urls, count)
            }
          }
        })
      }
    </ul>
  )

  const renderEmpty = () => (
    <div className="card-body text-center">
      <span className="material-symbols-rounded">block</span>
    </div>
  )

  const renderSpinner = () => (
    <div className="card-body text-center">
      <span className="material-symbols-rounded symbols-spin">progress_activity</span>
    </div>
  )

  return (
    <>
      <div className="card-header d-flex justify-content-between align-items-center" onClick={() => setIsOpen(!isOpen)}>
        {facet.title}
        <div>
          {isChecked && <span className="material-symbols-rounded symbols-check text-secondary">check_box</span>}
          {isOpen ? <span className="material-symbols-rounded symbols-expand">expand_less</span>
                  : <span className="material-symbols-rounded symbols-expand">expand_more</span>}
        </div>
      </div>
      {isOpen && !isEmpty && renderListGroup(facet.identifier, items, checked)}
      {isOpen && isEmpty && !isLoading && renderEmpty()}
      {isOpen && isEmpty && isLoading && renderSpinner()}
    </>
  )
}

Facet.propTypes = {
  facet: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  glossary: PropTypes.object.isRequired,
  updateParams: PropTypes.func.isRequired
}

export default Facet
