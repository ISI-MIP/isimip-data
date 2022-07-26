import React, { Component} from 'react'
import PropTypes from 'prop-types'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faSearch } from '@fortawesome/free-solid-svg-icons'

class Filter extends React.Component {

  render() {
    const { value, onChange } = this.props

    return (
      <div className="form-row">
        <div className="col-12 mb-2 col-md mb-md-0">
          <input className="form-control form-control-lg" type="text" placeholder="Filter by DOI, title, creator, or path"
                 onChange={e => onChange(e.target.value)} value={value} />
        </div>
        <div className="col-6 col-md-auto">
          <button className="btn btn-outline-secondary btn-lg w-100" type="button" onClick={e => onChange('')}>
            Reset <FontAwesomeIcon className="fa-fw" icon={faTimes} />
          </button>
        </div>
      </div>
    )
  }
}

export default Filter
