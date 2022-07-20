import React, { Component} from 'react'
import PropTypes from 'prop-types'


class Filter extends React.Component {

  render() {
    const { filterString, onChange } = this.props

    return (
      <div className="filter mt-2 mb-2">
        <input className="form-control form-control-lg" type="text" placeholder="Filter DOI / Title"
               onChange={onChange} value={filterString} />
      </div>
    )
  }
}

export default Filter
