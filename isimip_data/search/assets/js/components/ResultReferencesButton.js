import React from 'react'
import PropTypes from 'prop-types'

import Icon from 'isimip_data/core/assets/js/components/Icon'
import Tooltip from 'isimip_data/core/assets/js/components/Tooltip'

const referenceTypes = ['OTHER', 'EVALUATION', 'ISIPEDIA']

const ResultReferencesButton = ({ dataset, onClick }) => {

  const referenceTypeIndex = dataset.annotations.reduce((acc, cur) => {
      const index = cur.references.reduce((a, c) => {
          const i = referenceTypes.indexOf(c.reference_type)
          return (i > a) ? i : a
      }, -1)
      return (index > acc) ? index : acc
  }, -1)

  const referenceType = referenceTypes[referenceTypeIndex]

  if (referenceType == 'ISIPEDIA') {
    return (
      <Tooltip title="There are articles on ISIpedia available for this dataset. Click for more information.">
        <button type="button" className="d-block link" onClick={onClick}>
          <img className="isipedia-logo" src="/static/images/isipedia.png" alt="ISIpedia logo" />
        </button>
      </Tooltip>
    )
  } else if (referenceType == 'EVALUATION') {
    return (
      <Tooltip overlay="There are evaluation articles available for this dataset. Click for more information.">
        <button type="button" className="d-block link" onClick={onClick}>
          <Icon icon="task_alt" />
        </button>
      </Tooltip>
    )
  } else if (referenceType == 'OTHER') {
    return (
      <Tooltip placement="bottom" overlay="There are references to other publications for this dataset. Click for more information.">
        <button type="button" className="d-block link" onClick={onClick}>
          <Icon icon="local_library" />
        </button>
      </Tooltip>
    )
  } else {
    return null
  }
}

ResultReferencesButton.propTypes = {
  dataset: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default ResultReferencesButton
