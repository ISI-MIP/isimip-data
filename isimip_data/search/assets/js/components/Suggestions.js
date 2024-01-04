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

  handleReset(e) {
    this.setState({ value: '' })
    this.props.onReset()
  }

  render() {
    const { count, suggestions, onClick } = this.props
    const suggestionsList = suggestions === null ? [] :suggestions.reduce((cur, agg) => {
      if (cur.length > 0) agg.push(cur)
      return agg
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

Suggestions.Suggestions = {
  count: PropTypes.number.isRequired,
  suggestions: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired
}

export default Suggestions
