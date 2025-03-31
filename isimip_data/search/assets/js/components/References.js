import React from 'react'
import PropTypes from 'prop-types'

import Icon from 'isimip_data/core/assets/js/components/Icon'
import Tooltip from 'isimip_data/core/assets/js/components/Tooltip'

const referenceTypes = ['OTHER', 'EVALUATION', 'ISIPEDIA']


const References = ({ dataset }) => {

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
      <Tooltip title="There are articles on ISIpedia available for this dataset.">
        <a href={`${dataset.metadata_url}#references`} target="_blank" rel="noreferrer">
          <img className="isipedia-logo" src="/static/images/isipedia.png" alt="ISIpedia logo" />
        </a>
      </Tooltip>
    )
  } else if (referenceType == 'EVALUATION') {
    return (
      <Tooltip overlay="There are evaluation articles available for this dataset.">
        <a href={`${dataset.metadata_url}#references`} target="_blank" rel="noreferrer">
          <Icon icon="task_alt" />
        </a>
      </Tooltip>
    )
  } else if (referenceType == 'OTHER') {
    return (
      <Tooltip placement="bottom" overlay="There are references to other publications for this dataset.">
        <a href={`${dataset.metadata_url}#references`} target="_blank" rel="noreferrer">
          <Icon icon="local_library" />
        </a>
      </Tooltip>
    )
  } else {
    return null
  }
}

References.propTypes = {
  dataset: PropTypes.object.isRequired,
}

export default References
