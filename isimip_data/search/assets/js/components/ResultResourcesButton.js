import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import Tooltip from 'isimip_data/core/assets/js/components/Tooltip'

const ResultResourcesButton = ({ dataset, onClick }) => {
  const resources = (dataset.resources || []).filter((resource) => (
    resource.new_version === null || !dataset.resources.map((r) => r.doi).includes(resource.new_version)
  ))

  return !isEmpty(resources) && (
    <Tooltip title="The dataset can be cited using a DOI. Click for more information.">
      <button type="button" className="d-block link" onClick={onClick}>
        <div className="doi-logo"></div>
      </button>
    </Tooltip>
  )
}

ResultResourcesButton.propTypes = {
  dataset: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
}

export default ResultResourcesButton
