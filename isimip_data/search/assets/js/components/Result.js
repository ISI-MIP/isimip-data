import React from 'react'
import PropTypes from 'prop-types'

import ResultAttributes from './ResultAttributes'
import ResultFiles from './ResultFiles'
import ResultCaveats from './ResultCaveats'
import ResultDataset from './ResultDataset'

import { useToggle } from 'isimip_data/core/assets/js/hooks/toggle'


const Result = ({ dataset, glossary, selected, setSelected }) => {

  const [dropdown, setDropdown] = useToggle('')

  return (
    <div className="card result">
      <ul className="list-group list-group-flush">
        <ResultDataset
          dataset={dataset}
          glossary={glossary}
          selected={selected}
          setSelected={setSelected}
          dropdown={dropdown}
          setDropdown={setDropdown}
        />
        {dropdown == 'attributes' && <ResultAttributes dataset={dataset} />}
        {dropdown == 'files' && <ResultFiles dataset={dataset} />}
        {dropdown == 'caveats' && <ResultCaveats dataset={dataset} />}
      </ul>
    </div>
  )
}

Result.propTypes = {
  dataset: PropTypes.object.isRequired,
  glossary: PropTypes.object.isRequired,
  selected: PropTypes.array.isRequired,
  setSelected: PropTypes.func.isRequired
}

export default Result
