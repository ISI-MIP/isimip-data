import React, { Component } from 'react'
import PropTypes from 'prop-types'


class Suggestions extends Component {

  constructor(props) {
    super(props)
  }

  handleCLick(e) {
    e.preventDefault()
    this.props.onClick()
  }

  render() {
    const { count, suggestions, onClick } = this.props
    const suggestionsList = (suggestions === null) ? [] : suggestions.reduce((acc, cur) => {
      if (cur.length > 0) acc.push(cur)
      return acc
    }, [])

    return (count == 0) && (
      <div className="card suggestions">
        <div className="card-body">
          <strong>No results found</strong>
          {
            suggestionsList.length > 0 && <>
              <span className="ml-2">Maybe you misspelled your query. Did you mean:</span>
              {
                suggestionsList.map((suggestion, index) => (
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
}

Suggestions.propTypes = {
  count: PropTypes.number.isRequired,
  suggestions: PropTypes.array,
  onClick: PropTypes.func.isRequired
}

export default Suggestions
