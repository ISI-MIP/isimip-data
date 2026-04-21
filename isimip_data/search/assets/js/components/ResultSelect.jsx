import React from 'react'
import PropTypes from 'prop-types'

import Tooltip from 'isimip_data/core/assets/js/components/Tooltip'

const ResultSelect = ({ dataset, selected, setSelected }) => {

  const isSelected = selected.map(d => d.id).includes(dataset.id)

  const handleSelection = () => {
    setSelected(
      isSelected ? [...selected.filter(d => d.id != dataset.id)] : [...selected, dataset]
    )
  }

  return dataset.public && (
    <Tooltip title="Add this dataset to the selection.">
      <input className="form-check-input result-select" type="checkbox"
             checked={isSelected} onChange={handleSelection} />
    </Tooltip>
  )
}

ResultSelect.propTypes = {
  dataset: PropTypes.object.isRequired,
  selected: PropTypes.array.isRequired,
  setSelected: PropTypes.func.isRequired,
}

export default ResultSelect
