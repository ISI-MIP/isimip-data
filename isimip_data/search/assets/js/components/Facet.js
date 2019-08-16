import React, { useState } from 'react'
import PropTypes from 'prop-types'


function Facet(props) {
  const { facet } = props

  const facet_items = facet.items.map((item, index) => {
    return <li key={index} className="list-group-item">{item[0]} / {item[1]}</li>
  })

  return (
    <div className="card facet">
      <div className="card-header">
        {facet.title}
      </div>
      <ul className="list-group list-group-flush">
        {facet_items}
      </ul>
    </div>
  )
}

Facet.propTypes = {
  facet: PropTypes.object.isRequired
}

export default Facet
