import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { isEmpty } from 'lodash'

const ResultReferencesTab = ({ dataset }) => {

  const references = dataset.annotations.reduce((references, annotation) => (
    isEmpty(annotation.references) ? references : [...references, ...annotation.references]
  ), [])

  return (
    <div>
      {
        references.map((reference, referenceIndex) => (
          <div key={referenceIndex} className="mb-2">
            {reference.title}
            {reference.identifier_type != 'doi' && ' → '}
            <a className={classNames({'doi-link ms-2': reference.identifier_type == 'doi'})}
               href={reference.identifier} target="_blank" rel="noreferrer">
              {reference.identifier}
            </a>
          </div>
        ))
      }
    </div>
  )
}

ResultReferencesTab.propTypes = {
  dataset: PropTypes.object.isRequired
}

export default ResultReferencesTab
