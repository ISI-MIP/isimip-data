import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Icon from 'isimip_data/core/assets/js/components/Icon'

import { addLineBreaks } from '../utils'

const ResultTitle = ({ dataset, open, setOpen }) => {
  return (
    <h4 className="d-block me-auto mt-0 mb-0">
      <button type="button" className="d-flex flex-wrap align-items-start position-relative link" onClick={() => setOpen(!open)}>
        <div className="result-toggle">
          <Icon className={classNames({'rotate-90': open})} icon="chevron_right" />
        </div>
        {addLineBreaks(dataset.name)}
      </button>
    </h4>
  )
}

ResultTitle.propTypes = {
  dataset: PropTypes.object.isRequired,
  glossary: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired
}

export default ResultTitle
