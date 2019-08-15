import React, { useState } from 'react'
import PropTypes from 'prop-types'


function Results(props) {
  const { results } = props

  return (
    <ol className="results">
      {
        results.map(result => {
          return (
            <li key={result.id}>
              <p><b>{result.name}</b></p>
            </li>
          )
        })
      }
    </ol>
  )
}

Results.propTypes = {
  results: PropTypes.array.isRequired
}

export default Results
