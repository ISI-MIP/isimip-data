import React from 'react'
import PropTypes from 'prop-types'
import { get, intersection, isEmpty, isNil } from 'lodash'

import Icon from 'isimip_data/core/assets/js/components/Icon'
import Spinner from 'isimip_data/core/assets/js/components/Spinner'
import Tooltip from 'isimip_data/core/assets/js/components/Tooltip'

import { useLsState } from 'isimip_data/core/assets/js/hooks/ls'
import { useDatasetsHistogramQuery } from 'isimip_data/metadata/assets/js/hooks/queries'


const Facet = ({ facet, params, glossary, updateParams }) => {

  const [isOpen, setIsOpen] = useLsState(`facet.${facet.identifier}`, false)

  const { data: items, isLoading, isFetching } = useDatasetsHistogramQuery(facet.identifier, params, isOpen)

  const checked = params[facet.identifier] || []
  const isChecked = checked.length > 0
  const hasNoItems = isNil(items) || isEmpty(items) || (items.length == 1 && isNil(items[0][0]))

  const handleChange = (event, specifier) => {
    if (event.type == 'change' || isEmpty(
      // do not react to click events on the checkbox or the label, those are handled by the change event
      intersection(event.target.classList, ['form-check-input', 'form-check-label']))
    ) {
      updateParams({
        [facet.identifier]: (
          (params[facet.identifier] || []).includes(specifier) ? params[facet.identifier].filter(s => s != specifier)
                                                               : [...(params[facet.identifier] || []), specifier]
        )
      })
    }
  }

  const renderTooltip = (properties) => (
    (properties && (properties.long_name || properties.description || properties.warning)) && (
      <span>
        {properties.long_name}
        {properties.description && (<p>{properties.description}</p>)}
        {properties.warning && (<p>Warning: {properties.warning}</p>)}
      </span>
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

  const renderHeader = () => (
    <div className="card-body" onClick={() => setIsOpen(!isOpen)}>
      <div className="d-flex gap-1 align-items-center">
        <span className="flex-grow-1">{facet.title}</span>
        {isFetching && !hasNoItems && <Spinner size="xs" />}
        {isChecked && <Icon icon="check" />}
        <Icon icon={isOpen ? 'expand_less' : 'expand_more'} />
      </div>
    </div>
  )

  const renderGroup = () => (
    <ul className="list-group list-group-flush">
      {
        items.map((item, itemIndex) => renderItem(item, itemIndex))
      }
    </ul>
  )

  const renderItem = (item, itemIndex) => {
    const [specifier, count] = item
    const properties = get(glossary, [facet.identifier, specifier], {})
    const title = properties ? properties.title : null
    const urls = properties ? properties.urls : null
    const id = `${facet.identifier}-${specifier}`

    return !isEmpty(specifier) && (
      <li key={itemIndex} className="list-group-item" onClick={(event) => handleChange(event, specifier)}>
        <Tooltip placement="right" title={renderTooltip(properties)}>
          <div className="d-flex gap-1 align-items-center">
            <input className="form-check-input me-1 mt-0" type="checkbox" id={id} checked={checked.includes(specifier)}
                   onChange={(event) => handleChange(event, specifier)} />

            <label className="form-check-label flex-grow-1" htmlFor={id}>
             {title || specifier}
            </label>

            {
              filterUrls(urls).map((key, index) => {
                return (
                  <Tooltip key={specifier} title={<>More information is available in the {specifier} protocol.</>}>
                    <a key={index} href={urls[key]}
                      target="_blank" rel="noreferrer" onClick={event => event.stopPropagation()}>
                      <Icon className="d-block" icon="quick_reference_all" size="sm" />
                    </a>
                  </Tooltip>
                )
              })
            }

            <div className="badge rounded-pill text-bg-secondary">
             {count}
            </div>
          </div>
        </Tooltip>
      </li>
    )
  }

  const renderEmpty = () => (
    <div className="card-body">
      <div className="d-flex justify-content-center align-items-center">
        <Icon icon="block" label="Empty"/>
      </div>
    </div>
  )

  const renderSpinner = () => (
    <div className="card-body pt-2 pb-2">
      <div className="d-flex justify-content-center align-items-center">
        <Spinner size="sm" className="text-secondary" />
      </div>
    </div>
  )

  return (
    <>
      {renderHeader()}
      {isOpen && !isLoading && !hasNoItems && renderGroup()}
      {isOpen && !isLoading && hasNoItems && renderEmpty()}
      {isOpen && isLoading && renderSpinner()}
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
