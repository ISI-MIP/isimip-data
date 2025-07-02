import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import ResultCaveatsTabCaveat from './ResultCaveatsTabCaveat'

const ResultCaveatsTab = ({ dataset }) => {
  return (
    <div>
    {
      !isEmpty(dataset.caveats) && (
        <ul className="list-unstyled">
          {
            dataset.caveats.map((caveat, caveatIndex) => (
              <ResultCaveatsTabCaveat key={caveatIndex} caveat={caveat} caveatIndex={caveatIndex} />
            ))
          }
        </ul>
      )
    }
    {
      !isEmpty(dataset.caveats_versions) && (
        <>
          <p className="mb-2 text-muted">Caveats for other versions of this dataset:</p>
          <ul className="list-unstyled">
            {
              dataset.caveats_versions.map((caveat, caveatIndex) => (
                <ResultCaveatsTabCaveat key={caveatIndex} caveat={caveat} caveatIndex={caveatIndex} />
              ))
            }
          </ul>
        </>
      )
    }
    </div>
  )
}

ResultCaveatsTab.propTypes = {
  dataset: PropTypes.object.isRequired
}

export default ResultCaveatsTab
