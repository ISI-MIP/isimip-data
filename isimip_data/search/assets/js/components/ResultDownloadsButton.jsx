import React from 'react'
import PropTypes from 'prop-types'

import Icon from 'isimip_data/core/assets/js/components/Icon'
import Tooltip from 'isimip_data/core/assets/js/components/Tooltip'

const ResultDownloadsButton = ({ dataset, onClick }) => {
  return dataset.public && (
    <Tooltip title="Click here to find out how to download this dataset.">
      <button type="button" className="d-block link" onClick={onClick}>
        <Icon icon="download" size="lg" />
      </button>
    </Tooltip>
  )
}

ResultDownloadsButton.propTypes = {
  dataset: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default ResultDownloadsButton
