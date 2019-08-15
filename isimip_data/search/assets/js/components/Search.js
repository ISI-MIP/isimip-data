import React, { useState } from 'react'
import PropTypes from 'prop-types'


function Search(props) {
  const { onSubmit } = props
  const [value, setValue] = useState('')

  return (
    <div className="search">
      <form onSubmit={e => {
        e.preventDefault()
        onSubmit(value)
      }}>

        <input className="form-control form-control-lg" type="text" placeholder="Enter search query"
            onChange={e => setValue(e.target.value)} />
      </form>
    </div>
  )
}

Search.propTypes = {
  onSubmit: PropTypes.func.isRequired
}

export default Search
