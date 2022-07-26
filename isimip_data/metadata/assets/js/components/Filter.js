import React, { Component} from 'react'
import PropTypes from 'prop-types'


class Filter extends React.Component {

  render() {
    const { value, onChange } = this.props

    return (
      <input className="form-control form-control-lg" type="text" placeholder="Filter by DOI, title, creator, or path"
             onChange={e => onChange(e.target.value)} value={value} />
    )
  }
}

export default Filter
