import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import ResultCaveat from './ResultCaveat'


const ResultCaveats = ({ dataset }) => (
  <>
    {
      !isEmpty(dataset.caveats) && (
        <li className="list-group-item">
          <ul className="list-unstyled">
            {
              dataset.caveats.map(caveat => <ResultCaveat key={caveat.id} caveat={caveat} />)
            }
          </ul>
        </li>
      )
    }
    {
      !isEmpty(dataset.caveats_versions) && (
        <li className="list-group-item">
          <p className="mb-2 text-muted">Caveats for other versions of this dataset:</p>
          <ul className="list-unstyled">
            {
              dataset.caveats_versions.map(caveat => <ResultCaveat key={caveat.id} caveat={caveat} />)
            }
          </ul>
        </li>
      )
    }
  </>
)

ResultCaveats.propTypes = {
  dataset: PropTypes.object.isRequired,
}

export default ResultCaveats
