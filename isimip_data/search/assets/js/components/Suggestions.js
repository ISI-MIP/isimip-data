import React from 'react'
import PropTypes from 'prop-types'

import { useDatasetSuggestionsQuery } from 'isimip_data/metadata/assets/js/hooks/queries'


const Suggestions = ({ params, updateParams }) => {

  const { data: suggestions } = useDatasetSuggestionsQuery(params)

  const onClick = (suggestion) => updateParams({ query: suggestion })

  return suggestions && (
    <div className="card suggestions">
      <div className="card-body">
        <strong>No results found</strong>
        {
          suggestions.length > 0 && <>
            <span className="ml-2">Maybe you misspelled your query. Did you mean:</span>
            {
              suggestions.map((suggestion, index) => (
                <button key={index} className="btn btn-link ml-2" onClick={() => onClick(suggestion)}>
                  {suggestion}
                </button>
              ))
            }
          </>
        }
      </div>
    </div>
  )
}

Suggestions.propTypes = {
  params: PropTypes.object.isRequired,
  updateParams: PropTypes.func.isRequired
}

export default Suggestions
